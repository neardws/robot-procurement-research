import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Columns3,
  Database,
  Download,
  ExternalLink,
  Info,
  RefreshCw,
  Search,
  X
} from "lucide-react";
import data from "./robotResearchData.json";
import "./styles.css";

type Confidence = "high" | "medium" | "low";
type ReleaseConfidence = Confidence | "unknown";
type Tab = "overview" | "compare" | "report" | "sources";
type SourceFilter = "官网" | "电商" | "GitHub" | "论文" | "招投标";
type OriginFilter = "全部" | "国产" | "进口";
type PriceBand = "全部" | "10万以下" | "10-30万" | "30-80万" | "80万以上" | "需询价";
type ReleaseFilter = "全部" | "近1年" | "近3年" | "2020年以后" | "待核验";
type MarketTier = "重点候选" | "市场初筛";
type VerificationStatus = "官网核验" | "部分核验" | "待核验";
type ColumnKey = "formFactor" | "country" | "priceType" | "software" | "risk" | "sources" | "releaseDate" | "marketTier" | "verification" | "tags";

type Robot = {
  id: string;
  name: string;
  vendor: string;
  category: string;
  formFactor: string;
  country: string;
  domesticPriority: boolean;
  officialUrl: string;
  image?: string;
  lastChecked?: string;
  releaseDate: string;
  releaseDateConfidence: ReleaseConfidence;
  marketTier: MarketTier;
  verificationStatus?: VerificationStatus;
  verificationNotes?: string;
  verifiedAt?: string;
  brandNormalized: string;
  brandDisplayName?: string;
  brandLocation?: string;
  tags: string[];
  purchaseChannels?: string[];
  price: {
    label: string;
    amount: number | null;
    currency: string;
    range: string;
    type: string;
    confidence: Confidence;
    sourceIds: string[];
    original?: string | null;
  };
  specs: Record<string, string>;
  software: {
    ros: string;
    ros2: string;
    sdk: string;
    sim: string;
  };
  researchEvidence: string[];
  deploymentEvidence: string[];
  risks: string[];
  scores: {
    research: number;
    deployment: number;
    overall: number;
  };
  shortlistTags: string[];
  sourceIds: string[];
};

type Source = {
  id: string;
  title: string;
  url: string;
  type: string;
  confidence: Confidence;
  notes: string;
};

type CategoryStat = {
  category: string;
  count: number;
  image: string;
  payloadText: string;
  priceText: string;
  averageResearch: number;
  averageDeployment: number;
  best?: Robot;
};

const robots = data.robots as Robot[];
const sources = data.sources as Source[];
const meta = data.meta as {
  version: string;
  accessedDate: string;
  updateSummary: string;
  exchangeRates?: Record<string, string | number>;
};

const categories = ["机械臂", "移动/复合机器人", "人形机器人", "机器狗"];
const shortlistGroups = ["科研平台", "教学平台", "落地项目"];
const sourceFilters: SourceFilter[] = ["官网", "电商", "GitHub", "论文", "招投标"];
const originFilters: OriginFilter[] = ["全部", "国产", "进口"];
const priceBands: PriceBand[] = ["全部", "10万以下", "10-30万", "30-80万", "80万以上", "需询价"];
const releaseFilters: ReleaseFilter[] = ["全部", "近1年", "近3年", "2020年以后", "待核验"];
const marketTiers: Array<"全部" | MarketTier> = ["全部", "重点候选", "市场初筛"];
const categoryTags: Record<string, string[]> = {
  "机械臂": ["协作臂", "桌面机械臂", "工业臂", "轻量臂", "双臂", "开源/低成本"],
  "移动/复合机器人": ["移动操作", "轮式底盘", "双臂移动平台", "四足加臂", "教学移动平台", "服务/巡检"],
  "人形机器人": ["全尺寸", "小型人形", "开源人形", "科研开发套件", "教育版", "工业/商用"],
  "机器狗": ["消费级", "教育版", "工业巡检", "科研开发", "负载型", "轮足/足式"]
};
const optionalColumns: Array<{ key: ColumnKey; label: string }> = [
  { key: "formFactor", label: "形态" },
  { key: "country", label: "地区" },
  { key: "releaseDate", label: "发布时间" },
  { key: "marketTier", label: "市场层级" },
  { key: "verification", label: "核验状态" },
  { key: "tags", label: "标签" },
  { key: "priceType", label: "价格口径" },
  { key: "software", label: "软件生态" },
  { key: "risk", label: "主要风险" },
  { key: "sources", label: "证据数" }
];
const sortOptions = [
  { value: "overall", label: "综合评分" },
  { value: "research", label: "科研通用性" },
  { value: "deployment", label: "落地适配" },
  { value: "price", label: "公开价格" },
  { value: "release", label: "发布时间" },
  { value: "sources", label: "证据数量" }
];

function rankedShortlist(tag: string, limit = 5) {
  return robots
    .filter((robot) => robot.shortlistTags.includes(tag))
    .sort((a, b) => (tag === "落地项目" ? b.scores.deployment - a.scores.deployment : b.scores.overall - a.scores.overall))
    .slice(0, limit);
}

function confidenceLabel(confidence: ReleaseConfidence) {
  if (confidence === "unknown") return "待核验";
  return confidence === "high" ? "高" : confidence === "medium" ? "中" : "低";
}

function confidenceText(confidence: ReleaseConfidence) {
  if (confidence === "unknown") return "待核验证据";
  return confidence === "high" ? "高置信证据" : confidence === "medium" ? "中置信证据" : "低置信证据";
}

function formatCny(amount: number) {
  if (amount >= 10000) {
    const value = amount / 10000;
    return `¥${value >= 100 ? Math.round(value) : value.toFixed(amount % 10000 === 0 ? 0 : 1)}万`;
  }
  return `¥${amount.toLocaleString("zh-CN")}`;
}

function formatPrice(robot: Robot) {
  if (robot.price.amount === null) {
    return robot.price.label || "需正式报价";
  }
  return robot.price.label || `人民币 ${formatCny(robot.price.amount)}`;
}

function priceStatus(robot: Robot) {
  if (robot.price.amount !== null) return robot.price.confidence === "high" ? "公开价" : robot.price.confidence === "medium" ? "需复核" : "估算";
  return robot.price.type.includes("正式报价") ? "正式报价" : "需询价";
}

function brandLabel(robot: Robot) {
  return robot.brandDisplayName || robot.brandNormalized;
}

function brandPlace(robot: Robot) {
  return robot.brandLocation || robot.country;
}

function releaseYear(robot: Robot) {
  const match = robot.releaseDate?.match(/\d{4}/);
  return match ? Number(match[0]) : null;
}

function matchesReleaseFilter(robot: Robot, filter: ReleaseFilter) {
  if (filter === "全部") return true;
  const year = releaseYear(robot);
  if (filter === "待核验") return robot.releaseDate === "待核验" || robot.releaseDateConfidence === "unknown" || year === null;
  if (year === null) return false;
  if (filter === "近1年") return year >= 2025;
  if (filter === "近3年") return year >= 2023;
  return year >= 2020;
}

function matchesPriceBand(robot: Robot, band: PriceBand) {
  const amount = robot.price.amount;
  if (band === "全部") return true;
  if (band === "需询价") return amount === null;
  if (amount === null) return false;
  if (band === "10万以下") return amount < 100000;
  if (band === "10-30万") return amount >= 100000 && amount < 300000;
  if (band === "30-80万") return amount >= 300000 && amount < 800000;
  return amount >= 800000;
}

function categoryClass(category: string) {
  if (category === "机械臂") return "arm";
  if (category === "移动/复合机器人") return "mobile";
  if (category === "人形机器人") return "humanoid";
  return "quadruped";
}

function parseNumericSpec(value: string) {
  const match = value?.match(/[\d.]+/);
  return match ? Number(match[0]) : null;
}

function sourceMatchesType(source: Source, filter: SourceFilter) {
  const text = `${source.type} ${source.title} ${source.notes}`;
  if (filter === "官网") return /官网|官方|文档/.test(text);
  if (filter === "电商") return /京东|淘宝|天猫|商店|商城|价格/.test(text);
  if (filter === "GitHub") return /GitHub|开源|SDK|ROS/.test(text);
  if (filter === "论文") return /论文|学术|项目|科研/.test(text);
  return /招投标|政府采购|采购网/.test(text);
}

function sourceFilterCounts() {
  return Object.fromEntries(sourceFilters.map((filter) => [filter, sources.filter((source) => sourceMatchesType(source, filter)).length]));
}

function robotHasSourceFilter(robot: Robot, enabled: SourceFilter[]) {
  if (enabled.length === sourceFilters.length) return true;
  return robot.sourceIds.some((id) => {
    const source = sources.find((item) => item.id === id);
    return source ? enabled.some((filter) => sourceMatchesType(source, filter)) : false;
  });
}

function downloadText(filename: string, text: string, type = "text/csv;charset=utf-8") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function exportRobots(items: Robot[]) {
  const rows = [
    ["型号", "类别", "厂商", "品牌", "品牌所在地", "国产/进口", "市场层级", "核验状态", "核验备注", "发布时间", "发布时间置信度", "标签", "人民币价格", "价格口径", "价格置信度", "负载/能力", "科研评分", "落地评分", "来源ID", "官网"],
    ...items.map((robot) => [
      robot.name,
      robot.category,
      robot.vendor,
      brandLabel(robot),
      brandPlace(robot),
      robot.domesticPriority ? "国产" : "进口",
      robot.marketTier,
      robot.verificationStatus || "未标注",
      robot.verificationNotes || "",
      robot.releaseDate,
      confidenceLabel(robot.releaseDateConfidence),
      robot.tags.join(";"),
      formatPrice(robot),
      robot.price.type,
      confidenceLabel(robot.price.confidence),
      robot.category === "机器狗" ? robot.specs.speed : robot.specs.payloadKg,
      `${robot.scores.research}/50`,
      `${robot.scores.deployment}/50`,
      robot.sourceIds.join(";"),
      robot.officialUrl
    ])
  ];
  downloadText(`机器人候选清单-${meta.accessedDate}.csv`, rows.map((row) => row.map(csvEscape).join(",")).join("\n"));
}

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [shortlist, setShortlist] = useState("全部");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [originFilter, setOriginFilter] = useState<OriginFilter>("全部");
  const [priceBand, setPriceBand] = useState<PriceBand>("全部");
  const [releaseFilter, setReleaseFilter] = useState<ReleaseFilter>("全部");
  const [marketTier, setMarketTier] = useState<"全部" | MarketTier>("全部");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [rosOnly, setRosOnly] = useState(false);
  const [knownPriceOnly, setKnownPriceOnly] = useState(false);
  const [scoreBand, setScoreBand] = useState("全部");
  const [sortBy, setSortBy] = useState("overall");
  const [selectedIds, setSelectedIds] = useState<string[]>(() => rankedShortlist("科研平台", 4).map((robot) => robot.id));
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [rightListTag, setRightListTag] = useState("科研平台");
  const [enabledSourceFilters, setEnabledSourceFilters] = useState<SourceFilter[]>(sourceFilters);
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(["formFactor", "releaseDate", "marketTier", "verification", "priceType", "software", "risk", "sources"]);
  const [showColumns, setShowColumns] = useState(false);
  const [detailRobotId, setDetailRobotId] = useState<string | null>(null);
  const columnMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
        setShowColumns(false);
      }
    }
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  const countsBySourceType = useMemo(sourceFilterCounts, []);
  const brandOptions = useMemo(() => {
    const counts = new Map<string, { label: string; count: number; place: string }>();
    robots.forEach((robot) => {
      const current = counts.get(robot.brandNormalized);
      counts.set(robot.brandNormalized, {
        label: brandLabel(robot),
        count: (current?.count || 0) + 1,
        place: brandPlace(robot)
      });
    });
    return Array.from(counts.entries()).sort((a, b) => b[1].count - a[1].count || a[1].label.localeCompare(b[1].label, "zh-CN"));
  }, []);
  const visibleTagOptions = useMemo(() => {
    if (category !== "全部") return categoryTags[category] || [];
    return Array.from(new Set(Object.values(categoryTags).flat()));
  }, [category]);
  const detailRobot = detailRobotId ? robots.find((robot) => robot.id === detailRobotId) || null : null;

  const categoryStats = useMemo<CategoryStat[]>(() => {
    return categories.map((item) => {
      const items = robots.filter((robot) => robot.category === item);
      const best = items.slice().sort((a, b) => b.scores.overall - a.scores.overall)[0];
      const payloads = items.map((robot) => parseNumericSpec(robot.specs.payloadKg)).filter((value): value is number => value !== null);
      const prices = items.map((robot) => robot.price.amount).filter((value): value is number => value !== null);
      return {
        category: item,
        count: items.length,
        image: best?.image || "/assets/robots/robot-arm.png",
        best,
        payloadText: payloads.length > 0 ? `${Math.min(...payloads)} - ${Math.max(...payloads)} kg` : "按配置确认",
        priceText: prices.length > 0 ? `${formatCny(Math.min(...prices))} - ${formatCny(Math.max(...prices))}` : "多为询价",
        averageResearch: Math.round(items.reduce((sum, robot) => sum + robot.scores.research, 0) / Math.max(items.length, 1)),
        averageDeployment: Math.round(items.reduce((sum, robot) => sum + robot.scores.deployment, 0) / Math.max(items.length, 1))
      };
    });
  }, []);

  const filteredRobots = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return robots
      .filter((robot) => {
        const text = [
          robot.name,
          robot.vendor,
          robot.brandNormalized,
          brandLabel(robot),
          brandPlace(robot),
          robot.category,
          robot.formFactor,
          robot.country,
          robot.price.label,
          robot.price.type,
          robot.marketTier,
          robot.verificationStatus || "",
          robot.verificationNotes || "",
          robot.releaseDate,
          robot.tags.join(" "),
          robot.software.ros,
          robot.software.ros2,
          robot.researchEvidence.join(" "),
          robot.deploymentEvidence.join(" "),
          robot.risks.join(" ")
        ]
          .join(" ")
          .toLowerCase();
        const queryMatch = normalized.length === 0 || text.includes(normalized);
        const categoryMatch = category === "全部" || robot.category === category;
        const shortlistMatch = shortlist === "全部" || robot.shortlistTags.includes(shortlist);
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(robot.brandNormalized);
        const originMatch = originFilter === "全部" || (originFilter === "国产" ? robot.domesticPriority : !robot.domesticPriority);
        const tierMatch = marketTier === "全部" || robot.marketTier === marketTier;
        const tagMatch = selectedTags.length === 0 || selectedTags.every((tag) => robot.tags.includes(tag));
        const software = `${robot.software.ros} ${robot.software.ros2}`;
        const rosMatch = !rosOnly || /ROS|ROS2|成熟|支持|生态|官方|社区/.test(software);
        const priceMatch = matchesPriceBand(robot, priceBand) && (!knownPriceOnly || robot.price.amount !== null);
        const releaseMatch = matchesReleaseFilter(robot, releaseFilter);
        const scoreMatch = scoreBand === "全部" || (scoreBand === "高" ? robot.scores.overall >= 80 : scoreBand === "中" ? robot.scores.overall >= 65 && robot.scores.overall < 80 : robot.scores.overall < 65);
        const sourceMatch = robotHasSourceFilter(robot, enabledSourceFilters);
        return queryMatch && categoryMatch && shortlistMatch && brandMatch && originMatch && tierMatch && tagMatch && rosMatch && priceMatch && releaseMatch && scoreMatch && sourceMatch;
      })
      .sort((a, b) => {
        if (sortBy === "price") {
          return (a.price.amount ?? Number.MAX_SAFE_INTEGER) - (b.price.amount ?? Number.MAX_SAFE_INTEGER);
        }
        if (sortBy === "release") {
          return (releaseYear(b) ?? -1) - (releaseYear(a) ?? -1);
        }
        if (sortBy === "sources") {
          return b.sourceIds.length - a.sourceIds.length;
        }
        return b.scores[sortBy as keyof Robot["scores"]] - a.scores[sortBy as keyof Robot["scores"]];
      });
  }, [query, category, shortlist, selectedBrands, originFilter, priceBand, releaseFilter, marketTier, selectedTags, rosOnly, knownPriceOnly, scoreBand, sortBy, enabledSourceFilters]);

  const selectedRobots = selectedIds.map((id) => robots.find((robot) => robot.id === id)).filter((robot): robot is Robot => Boolean(robot));
  const knownPrices = robots.filter((robot) => robot.price.amount !== null);
  const formalQuoteCount = robots.filter((robot) => robot.price.amount === null && robot.price.type.includes("正式报价")).length;
  const unpricedCount = robots.filter((robot) => robot.price.amount === null).length;
  const priceLow = Math.min(...knownPrices.map((robot) => robot.price.amount ?? 0));
  const priceHigh = Math.max(...knownPrices.map((robot) => robot.price.amount ?? 0));
  const averageResearch = Math.round((robots.reduce((sum, robot) => sum + robot.scores.research, 0) / robots.length) * 2);
  const averageDeployment = Math.round((robots.reduce((sum, robot) => sum + robot.scores.deployment, 0) / robots.length) * 2);
  const highConfidenceSources = sources.filter((source) => source.confidence === "high").length;
  const filteredSourceIds = new Set(filteredRobots.flatMap((robot) => robot.sourceIds));
  const rightShortlist = rankedShortlist(rightListTag);
  const knownReleaseCount = robots.filter((robot) => robot.releaseDate !== "待核验").length;

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.length === 1 ? current : current.filter((item) => item !== id);
      }
      return [...current.slice(-3), id];
    });
  }

  function toggleSourceFilter(filter: SourceFilter) {
    setEnabledSourceFilters((current) => {
      if (current.includes(filter)) {
        return current.length === 1 ? current : current.filter((item) => item !== filter);
      }
      return [...current, filter];
    });
  }

  function toggleBrand(brand: string) {
    setSelectedBrands((current) => current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand]);
  }

  function toggleTag(tag: string) {
    setSelectedTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  }

  function toggleColumn(key: ColumnKey) {
    setVisibleColumns((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  function resetFilters() {
    setCategory("全部");
    setShortlist("全部");
    setSelectedBrands([]);
    setOriginFilter("全部");
    setPriceBand("全部");
    setReleaseFilter("全部");
    setMarketTier("全部");
    setSelectedTags([]);
    setRosOnly(false);
    setKnownPriceOnly(false);
    setScoreBand("全部");
    setEnabledSourceFilters(sourceFilters);
  }

  return (
    <div className="app-shell">
      <Header query={query} setQuery={setQuery} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="layout-grid">
        <FilterSidebar
          category={category}
          setCategory={setCategory}
          shortlist={shortlist}
          setShortlist={setShortlist}
          brandOptions={brandOptions}
          selectedBrands={selectedBrands}
          toggleBrand={toggleBrand}
          originFilter={originFilter}
          setOriginFilter={setOriginFilter}
          priceBand={priceBand}
          setPriceBand={setPriceBand}
          releaseFilter={releaseFilter}
          setReleaseFilter={setReleaseFilter}
          marketTier={marketTier}
          setMarketTier={setMarketTier}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          visibleTagOptions={visibleTagOptions}
          rosOnly={rosOnly}
          setRosOnly={setRosOnly}
          knownPriceOnly={knownPriceOnly}
          setKnownPriceOnly={setKnownPriceOnly}
          scoreBand={scoreBand}
          setScoreBand={setScoreBand}
          categoryStats={categoryStats}
          enabledSourceFilters={enabledSourceFilters}
          toggleSourceFilter={toggleSourceFilter}
          countsBySourceType={countsBySourceType}
          resetFilters={resetFilters}
        />
        <main className="dashboard-main">
          {activeTab === "overview" && (
            <>
              <div className="data-stamp">
                <span>数据更新：{meta.accessedDate} · {meta.version}</span>
                <RefreshCw size={14} />
              </div>
              <section className="summary-grid" aria-label="调研概览">
                <MetricCard label="候选数量（当前筛选）" value={String(filteredRobots.length)} detail={`总计 ${robots.length} 个`} />
                <MetricCard label="公开价格区间" value={`${formatCny(priceLow)} - ${formatCny(priceHigh)}`} detail={`已收录 ${knownPrices.length} 个；${formalQuoteCount} 个需厂商正式报价`} warn={unpricedCount > 0} />
                <MetricCard label="科研通用性（平均）" value={String(averageResearch)} detail="/100" status="中-高" />
                <MetricCard label="落地适配（平均）" value={String(averageDeployment)} detail="/100" status="中" />
                <MetricCard label="来源记录" value={String(sources.length)} detail={`高置信 ${highConfidenceSources} 条，占 ${Math.round((highConfidenceSources / sources.length) * 100)}%`} />
                <MetricCard label="发布时间" value={String(knownReleaseCount)} detail={`已标注；${robots.length - knownReleaseCount} 个待核验`} />
              </section>
              <CategoryOverview stats={categoryStats} onCategory={setCategory} />
              <section className="table-panel">
                <div className="panel-head">
                  <div>
                    <h2>候选机器人对比</h2>
                    <span>价格统一人民币主显示；低置信电商线索不会作为确定报价</span>
                  </div>
                  <div className="table-actions">
                    <div className="column-menu-wrap" ref={columnMenuRef}>
                      <button onClick={() => setShowColumns((value) => !value)}><Columns3 size={15} /> 自定义列</button>
                      {showColumns && <ColumnMenu visibleColumns={visibleColumns} toggleColumn={toggleColumn} />}
                    </div>
                    <button onClick={() => exportRobots(filteredRobots)}><Download size={15} /> 导出</button>
                    <label className="sorter">
                      <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                        {sortOptions.map((item) => (
                          <option value={item.value} key={item.value}>{item.label}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
                <RobotTable robots={filteredRobots} selectedIds={selectedIds} onToggle={toggleSelected} visibleColumns={visibleColumns} onOpenDetail={setDetailRobotId} />
                <div className="table-footer">
                  <span>显示 {filteredRobots.length} 条；已选择 {selectedRobots.length} 个进入横向对比</span>
                  <button className="text-action" onClick={() => setActiveTab("compare")}>查看对比 <ChevronRight size={14} /></button>
                </div>
              </section>
            </>
          )}

          {activeTab === "compare" && (
            <section className="compare-panel">
              <div className="panel-head">
                <div>
                  <h2>横向对比</h2>
                  <span>显示当前勾选的机器人，最多保留最近 4 个</span>
                </div>
                <button className="panel-button" onClick={() => exportRobots(selectedRobots)}><Download size={15} />导出对比</button>
              </div>
              <CompareGrid robots={selectedRobots} />
            </section>
          )}

          {activeTab === "report" && <ReportCenter selectedRobots={selectedRobots} setActiveTab={setActiveTab} />}

          {activeTab === "sources" && (
            <section className="source-panel">
              <div className="panel-head">
                <div>
                  <h2>数据源</h2>
                  <span>所有价格、参数和推荐理由都必须可回溯</span>
                </div>
                <button className="panel-button" onClick={() => exportSources(sources)}><Download size={15} />导出来源</button>
              </div>
              <SourceTable enabledSourceFilters={enabledSourceFilters} filteredSourceIds={filteredSourceIds} />
            </section>
          )}
        </main>
        <RightPanel
          rightListTag={rightListTag}
          setRightListTag={setRightListTag}
          shortlist={rightShortlist}
          selectedRobots={selectedRobots}
          filteredSourceIds={filteredSourceIds}
          enabledSourceFilters={enabledSourceFilters}
          toggleSourceFilter={toggleSourceFilter}
          setActiveTab={setActiveTab}
        />
      </div>
      {detailRobot && <RobotDetail robot={detailRobot} onClose={() => setDetailRobotId(null)} />}
    </div>
  );
}

function Header({
  query,
  setQuery,
  activeTab,
  setActiveTab
}: {
  query: string;
  setQuery: (value: string) => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) {
  return (
    <header className="app-header">
      <div className="product-title">高校机器人采购研究平台</div>
      <nav className="top-nav" aria-label="主导航">
        <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>概览</button>
        <button className={activeTab === "compare" ? "active" : ""} onClick={() => setActiveTab("compare")}>对比分析</button>
        <button className={activeTab === "report" ? "active" : ""} onClick={() => setActiveTab("report")}>报告中心</button>
        <button className={activeTab === "sources" ? "active" : ""} onClick={() => setActiveTab("sources")}>数据源</button>
      </nav>
      <div className="header-search">
        <Search size={16} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索机器人、厂商、用途或风险" />
        <kbd>⌘K</kbd>
      </div>
      <div className="header-tools" aria-label="状态工具">
        <button aria-label="数据提醒"><Bell size={18} /></button>
        <span className="data-badge">候选库 {meta.version}</span>
      </div>
    </header>
  );
}

function FilterSidebar({
  category,
  setCategory,
  shortlist,
  setShortlist,
  brandOptions,
  selectedBrands,
  toggleBrand,
  originFilter,
  setOriginFilter,
  priceBand,
  setPriceBand,
  releaseFilter,
  setReleaseFilter,
  marketTier,
  setMarketTier,
  selectedTags,
  toggleTag,
  visibleTagOptions,
  rosOnly,
  setRosOnly,
  knownPriceOnly,
  setKnownPriceOnly,
  scoreBand,
  setScoreBand,
  categoryStats,
  enabledSourceFilters,
  toggleSourceFilter,
  countsBySourceType,
  resetFilters
}: {
  category: string;
  setCategory: (value: string) => void;
  shortlist: string;
  setShortlist: (value: string) => void;
  brandOptions: Array<[string, { label: string; count: number; place: string }]>;
  selectedBrands: string[];
  toggleBrand: (value: string) => void;
  originFilter: OriginFilter;
  setOriginFilter: (value: OriginFilter) => void;
  priceBand: PriceBand;
  setPriceBand: (value: PriceBand) => void;
  releaseFilter: ReleaseFilter;
  setReleaseFilter: (value: ReleaseFilter) => void;
  marketTier: "全部" | MarketTier;
  setMarketTier: (value: "全部" | MarketTier) => void;
  selectedTags: string[];
  toggleTag: (value: string) => void;
  visibleTagOptions: string[];
  rosOnly: boolean;
  setRosOnly: (value: boolean) => void;
  knownPriceOnly: boolean;
  setKnownPriceOnly: (value: boolean) => void;
  scoreBand: string;
  setScoreBand: (value: string) => void;
  categoryStats: CategoryStat[];
  enabledSourceFilters: SourceFilter[];
  toggleSourceFilter: (value: SourceFilter) => void;
  countsBySourceType: Record<string, number>;
  resetFilters: () => void;
}) {
  return (
    <aside className="filter-sidebar">
      <div className="filter-head">
        <h2>筛选条件</h2>
        <button onClick={resetFilters}>重置</button>
      </div>
      <section className="filter-section">
        <h3>机器人类别</h3>
        <div className="category-selector">
          {categoryStats.map((item) => (
            <button key={item.category} className={category === item.category ? "active" : ""} onClick={() => setCategory(category === item.category ? "全部" : item.category)}>
              <CategoryThumb category={item.category} compact />
              <span>{item.category}</span>
              <small>{item.count}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <h3>品牌</h3>
        <div className="brand-list">
          {brandOptions.slice(0, 24).map(([brand, item]) => (
            <label className="check-row" key={brand}>
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
              <span>{item.label}<small>{item.place}</small></span>
              <b>{item.count}</b>
            </label>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <h3>国产/进口</h3>
        <div className="pill-grid">
          {originFilters.map((item) => (
            <button key={item} className={originFilter === item ? "active" : ""} onClick={() => setOriginFilter(item)}>{item}</button>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <h3>价格区间（人民币公开价）</h3>
        <div className="pill-grid price-grid">
          {priceBands.map((item) => (
            <button key={item} className={priceBand === item ? "active" : ""} onClick={() => setPriceBand(item)}>{item}</button>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <h3>发布时间</h3>
        <div className="pill-grid">
          {releaseFilters.map((item) => (
            <button key={item} className={releaseFilter === item ? "active" : ""} onClick={() => setReleaseFilter(item)}>{item}</button>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <h3>市场层级</h3>
        <div className="pill-grid">
          {marketTiers.map((item) => (
            <button key={item} className={marketTier === item ? "active" : ""} onClick={() => setMarketTier(item)}>{item}</button>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <h3>细分类别标签</h3>
        <div className="tag-filter-grid">
          {visibleTagOptions.map((tag) => (
            <button key={tag} className={selectedTags.includes(tag) ? "active" : ""} onClick={() => toggleTag(tag)}>{tag}</button>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <h3>综合评分</h3>
        <select value={scoreBand} onChange={(event) => setScoreBand(event.target.value)}>
          <option>全部</option>
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>
      </section>

      <section className="filter-section">
        <h3>推荐标签</h3>
        <select value={shortlist} onChange={(event) => setShortlist(event.target.value)}>
          <option>全部</option>
          <option>科研平台</option>
          <option>教学平台</option>
          <option>落地项目</option>
          <option>高性价比组合</option>
        </select>
      </section>

      <section className="filter-section">
        <h3>快速条件</h3>
        <label className="check-row"><input type="checkbox" checked={rosOnly} onChange={(event) => setRosOnly(event.target.checked)} />ROS/ROS2 生态明确</label>
        <label className="check-row"><input type="checkbox" checked={knownPriceOnly} onChange={(event) => setKnownPriceOnly(event.target.checked)} />仅看已收录公开价</label>
      </section>

      <section className="filter-section">
        <h3>数据来源</h3>
        {sourceFilters.map((filter) => (
          <label className="check-row" key={filter}>
            <input type="checkbox" checked={enabledSourceFilters.includes(filter)} onChange={() => toggleSourceFilter(filter)} />
            {filter}
            <b>{countsBySourceType[filter] || 0}</b>
          </label>
        ))}
      </section>
    </aside>
  );
}

function MetricCard({ label, value, detail, status, warn }: { label: string; value: string; detail: string; status?: string; warn?: boolean }) {
  return (
    <article className="metric-card">
      <div className="metric-label">{label} <CircleHelp size={13} /></div>
      <strong>{value}</strong>
      <div className={warn ? "metric-warning" : "metric-detail"}>{warn ? "! " : ""}{detail}</div>
      {status && <span className="status-pill">{status}</span>}
    </article>
  );
}

function CategoryOverview({ stats, onCategory }: { stats: CategoryStat[]; onCategory: (category: string) => void }) {
  return (
    <section className="category-overview">
      {stats.map((item) => (
        <button key={item.category} className="category-card with-image" onClick={() => onCategory(item.category)}>
          <div>
            <h3>{item.category}</h3>
            <strong>{item.count}</strong><span>款</span>
            <p>公开价 {item.priceText}</p>
            <p>科研 {item.averageResearch * 2}/100 · 落地 {item.averageDeployment * 2}/100</p>
          </div>
          <CategoryThumb category={item.category} />
        </button>
      ))}
    </section>
  );
}

function RobotTable({
  robots,
  selectedIds,
  onToggle,
  visibleColumns,
  onOpenDetail
}: {
  robots: Robot[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  visibleColumns: ColumnKey[];
  onOpenDetail: (id: string) => void;
}) {
  if (robots.length === 0) {
    return <EmptyState title="没有匹配的候选" body="请减少品牌、价格、发布时间、标签或来源筛选条件。" />;
  }

  return (
    <div className="table-scroll">
      <table className="robot-table">
        <thead>
          <tr>
            <th>选择</th>
            <th>型号</th>
            <th>类别</th>
            <th>品牌</th>
            {visibleColumns.includes("formFactor") && <th>形态</th>}
            {visibleColumns.includes("country") && <th>地区</th>}
            {visibleColumns.includes("releaseDate") && <th>发布时间</th>}
            {visibleColumns.includes("marketTier") && <th>层级</th>}
            {visibleColumns.includes("verification") && <th>核验</th>}
            {visibleColumns.includes("tags") && <th>标签</th>}
            <th>人民币价格</th>
            {visibleColumns.includes("priceType") && <th>价格口径</th>}
            <th>负载/能力</th>
            {visibleColumns.includes("software") && <th>软件生态</th>}
            <th>科研</th>
            <th>落地</th>
            <th>置信度</th>
            {visibleColumns.includes("risk") && <th>主要风险</th>}
            {visibleColumns.includes("sources") && <th>证据数</th>}
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          {robots.map((robot) => (
            <tr key={robot.id} className={selectedIds.includes(robot.id) ? "selected-row" : ""}>
              <td>
                <button className={`row-check ${selectedIds.includes(robot.id) ? "selected" : ""}`} onClick={() => onToggle(robot.id)} aria-label={`选择 ${robot.name}`}>
                  {selectedIds.includes(robot.id) && <Check size={13} />}
                </button>
              </td>
              <td>
                <div className="model-cell">
                  <CategoryThumb category={robot.category} compact />
                  <a href={robot.officialUrl} target="_blank" rel="noreferrer">{robot.name}</a>
                </div>
              </td>
              <td><span className={`tag ${categoryClass(robot.category)}`}>{robot.category}</span></td>
              <td><span className="brand-cell">{brandLabel(robot)}<small>{brandPlace(robot)}</small></span></td>
              {visibleColumns.includes("formFactor") && <td>{robot.formFactor}</td>}
              {visibleColumns.includes("country") && <td>{brandPlace(robot)}</td>}
              {visibleColumns.includes("releaseDate") && <td><span className="release-cell">{robot.releaseDate}<small>{confidenceLabel(robot.releaseDateConfidence)}</small></span></td>}
              {visibleColumns.includes("marketTier") && <td><span className={`tier-pill ${robot.marketTier === "重点候选" ? "focus" : ""}`}>{robot.marketTier}</span></td>}
              {visibleColumns.includes("verification") && <td><span className={`verify-pill ${robot.verificationStatus === "官网核验" ? "official" : ""}`}>{robot.verificationStatus || "未标注"}</span></td>}
              {visibleColumns.includes("tags") && <td><TagList tags={robot.tags.slice(0, 3)} /></td>}
              <td>
                <div className="price-cell">
                  <span>{formatPrice(robot)}</span>
                  {robot.price.amount === null && <small>{priceStatus(robot)}</small>}
                  {robot.price.amount !== null && robot.price.confidence !== "high" && <small>{robot.price.confidence === "medium" ? "需复核" : "估算"}</small>}
                </div>
              </td>
              {visibleColumns.includes("priceType") && <td>{robot.price.type}</td>}
              <td>{robot.category === "机器狗" ? robot.specs.speed : robot.specs.payloadKg}</td>
              {visibleColumns.includes("software") && <td>{robot.software.ros2 || robot.software.ros}</td>}
              <td><ScorePill score={robot.scores.research * 2} /></td>
              <td><ScorePill score={robot.scores.deployment * 2} /></td>
              <td><ConfidenceDots confidence={robot.price.confidence} /></td>
              {visibleColumns.includes("risk") && <td>{robot.risks[0]}</td>}
              {visibleColumns.includes("sources") && <td>{robot.sourceIds.length}</td>}
              <td><button className="detail-button" onClick={() => onOpenDetail(robot.id)}><Info size={14} />详情</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="tag-list">
      {tags.map((tag) => <span key={tag}>{tag}</span>)}
    </div>
  );
}

function ColumnMenu({ visibleColumns, toggleColumn }: { visibleColumns: ColumnKey[]; toggleColumn: (key: ColumnKey) => void }) {
  return (
    <div className="column-menu">
      {optionalColumns.map((item) => (
        <label key={item.key}>
          <input type="checkbox" checked={visibleColumns.includes(item.key)} onChange={() => toggleColumn(item.key)} />
          {item.label}
        </label>
      ))}
    </div>
  );
}

function RightPanel({
  rightListTag,
  setRightListTag,
  shortlist,
  selectedRobots,
  filteredSourceIds,
  enabledSourceFilters,
  toggleSourceFilter,
  setActiveTab
}: {
  rightListTag: string;
  setRightListTag: (value: string) => void;
  shortlist: Robot[];
  selectedRobots: Robot[];
  filteredSourceIds: Set<string>;
  enabledSourceFilters: SourceFilter[];
  toggleSourceFilter: (value: SourceFilter) => void;
  setActiveTab: (tab: Tab) => void;
}) {
  return (
    <aside className="right-panel">
      <section className="right-card">
        <div className="right-head">
          <h2>候选短名单</h2>
          <button onClick={() => setActiveTab("report")}>报告</button>
        </div>
        <div className="segmented">
          {shortlistGroups.map((item) => (
            <button key={item} className={rightListTag === item ? "active" : ""} onClick={() => setRightListTag(item)}>
              {item} <span>{robots.filter((robot) => robot.shortlistTags.includes(item)).length}</span>
            </button>
          ))}
        </div>
        <ol className="shortlist">
          {shortlist.slice(0, 3).map((robot, index) => (
            <li key={robot.id}>
              <span>{index + 1}</span>
              <CategoryThumb category={robot.category} compact />
              <div>
                <strong>{robot.name}</strong>
                <small>{robot.vendor}</small>
                <div><em>{robot.category}</em><em>{formatPrice(robot)}</em></div>
              </div>
              <ScoreMini research={robot.scores.research} deployment={robot.scores.deployment} />
            </li>
          ))}
        </ol>
        <button className="full-button" onClick={() => setActiveTab("report")}>查看短名单报告 <ChevronRight size={15} /></button>
      </section>

      <section className="right-card">
        <div className="right-head">
          <h2>来源追溯控制</h2>
          <button onClick={() => setActiveTab("sources")}>来源页</button>
        </div>
        <label className="threshold">
          <span>当前筛选来源</span>
          <b>{filteredSourceIds.size} 条</b>
        </label>
        <div className="source-grid">
          {sourceFilters.map((filter) => (
            <label key={filter}><input type="checkbox" checked={enabledSourceFilters.includes(filter)} onChange={() => toggleSourceFilter(filter)} />{filter}</label>
          ))}
        </div>
        <div className="keyword-box">
          <span>关键词</span>
          <p>ROS2，遥操作，京东，论文，招投标</p>
        </div>
      </section>

      <section className="right-card">
        <div className="right-head">
          <h2>最近数据更新</h2>
          <button onClick={() => setActiveTab("sources")}>更多</button>
        </div>
        <ul className="updates">
          <li><span>候选设备</span><b>{robots.length}</b><time>{meta.accessedDate}</time></li>
          <li><span>来源记录</span><b>{sources.length}</b><time>{meta.accessedDate}</time></li>
          <li><span>公开价</span><b>{robots.filter((robot) => robot.price.amount !== null).length}</b><time>{meta.accessedDate}</time></li>
          <li><span>对比选择</span><b>{selectedRobots.length}</b><time>当前</time></li>
        </ul>
      </section>
    </aside>
  );
}

function CompareGrid({ robots }: { robots: Robot[] }) {
  if (robots.length === 0) {
    return <EmptyState title="尚未选择对比型号" body="回到概览页勾选 1-4 个候选后，这里会显示横向参数表。" />;
  }

  const rows = [
    { label: "类别", value: (robot: Robot) => robot.category },
    { label: "市场层级", value: (robot: Robot) => robot.marketTier },
    { label: "核验状态", value: (robot: Robot) => `${robot.verificationStatus || "未标注"}：${robot.verificationNotes || "无备注"}` },
    { label: "发布时间", value: (robot: Robot) => `${robot.releaseDate}（${confidenceLabel(robot.releaseDateConfidence)}）` },
    { label: "标签", value: (robot: Robot) => robot.tags.join("、") },
    { label: "人民币价格", value: (robot: Robot) => formatPrice(robot) },
    { label: "价格口径", value: (robot: Robot) => robot.price.type },
    { label: "自由度", value: (robot: Robot) => robot.specs.dof },
    { label: "负载", value: (robot: Robot) => robot.specs.payloadKg },
    { label: "臂展/形态", value: (robot: Robot) => robot.specs.reachM },
    { label: "续航/速度", value: (robot: Robot) => `${robot.specs.endurance} / ${robot.specs.speed}` },
    { label: "传感器", value: (robot: Robot) => robot.specs.sensors },
    { label: "ROS/ROS2", value: (robot: Robot) => `${robot.software.ros}；${robot.software.ros2}` },
    { label: "SDK/仿真", value: (robot: Robot) => `${robot.software.sdk}；${robot.software.sim}` },
    { label: "科研评分", value: (robot: Robot) => `${robot.scores.research}/50` },
    { label: "落地评分", value: (robot: Robot) => `${robot.scores.deployment}/50` },
    { label: "采购渠道", value: (robot: Robot) => (robot.purchaseChannels || []).join("；") || "官网询价" }
  ];

  return (
    <div className="compare-scroll">
      <table className="compare-table">
        <thead>
          <tr>
            <th>维度</th>
            {robots.map((robot) => (
              <th key={robot.id}>
                <span>{robot.name}</span>
                <small>{robot.vendor}</small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              {robots.map((robot) => (
                <td key={`${robot.id}-${row.label}`}>{row.value(robot)}</td>
              ))}
            </tr>
          ))}
          <tr>
            <td>主要风险</td>
            {robots.map((robot) => (
              <td key={`${robot.id}-risks`}>{robot.risks.join("；")}</td>
            ))}
          </tr>
          <tr>
            <td>来源</td>
            {robots.map((robot) => (
              <td key={`${robot.id}-sources`}>{robot.sourceIds.join(", ")}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ReportCenter({ selectedRobots, setActiveTab }: { selectedRobots: Robot[]; setActiveTab: (tab: Tab) => void }) {
  const groupItems = (tag: string) => rankedShortlist(tag);
  const lowConfidencePrices = robots.filter((robot) => robot.price.confidence === "low").length;
  const unpriced = robots.filter((robot) => robot.price.amount === null).length;
  const formalQuote = robots.filter((robot) => robot.price.amount === null && robot.price.type.includes("正式报价")).length;
  const knownPriceCount = robots.filter((robot) => robot.price.amount !== null).length;
  const researchLeaders = rankedShortlist("科研平台", 4).map((robot) => robot.name).join("、");
  const teachingLeaders = rankedShortlist("教学平台", 3).map((robot) => robot.name).join("、");
  const deploymentLeaders = rankedShortlist("落地项目", 4).map((robot) => robot.name).join("、");
  const focusCount = robots.filter((robot) => robot.marketTier === "重点候选").length;
  const marketCount = robots.filter((robot) => robot.marketTier === "市场初筛").length;
  const verifiedCount = robots.filter((robot) => robot.verificationStatus === "官网核验").length;

  return (
    <section className="report-panel">
      <div className="panel-head">
        <div>
          <h2>报告中心</h2>
          <span>基于 v3 候选库动态汇总短名单、价格风险和采购动作</span>
        </div>
        <button className="panel-button" onClick={() => downloadText("学校机器人采购调研摘要-v3.md", buildMarkdownReport(), "text/markdown;charset=utf-8")}><Download size={15} />导出摘要</button>
      </div>
      <div className="report-grid">
        <article className="report-card wide">
          <h3>本轮结论</h3>
          <p>已形成 {robots.length} 个候选，其中重点候选 {focusCount} 个、市场初筛 {marketCount} 个，官网核验 {verifiedCount} 个，并保留 {sources.length} 条可追溯来源。科研平台优先比较 {researchLeaders}；教学平台优先看 {teachingLeaders}；落地项目重点核验 {deploymentLeaders} 的正式报价、售后和场地约束。</p>
          <div className="report-actions">
            <button onClick={() => setActiveTab("sources")}><Database size={15} />查看来源</button>
            <button onClick={() => setActiveTab("compare")}><BarChart3 size={15} />查看对比</button>
          </div>
        </article>
        <article className="report-card">
          <h3>价格风险</h3>
          <strong>{unpriced}</strong>
          <p>个型号没有公开价，其中 {formalQuote} 个已归类为厂商正式报价项；{lowConfidencePrices} 个价格为低置信估算或电商线索。</p>
        </article>
        <article className="report-card">
          <h3>当前对比</h3>
          <strong>{selectedRobots.length}</strong>
          <p>{selectedRobots.map((robot) => robot.name).join("、") || "尚未选择型号"}</p>
        </article>
      </div>
      <div className="report-lists">
        {shortlistGroups.map((tag) => (
          <section className="report-list" key={tag}>
            <h3>{tag}</h3>
            {groupItems(tag).map((robot) => (
              <article key={robot.id}>
                <CategoryThumb category={robot.category} compact />
                <div>
                  <strong>{robot.name}</strong>
                  <p>{robot.category} · {formatPrice(robot)} · 科研 {robot.scores.research}/50 · 落地 {robot.scores.deployment}/50</p>
                  <small>{robot.researchEvidence[0]}</small>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </section>
  );
}

function SourceTable({ enabledSourceFilters, filteredSourceIds }: { enabledSourceFilters: SourceFilter[]; filteredSourceIds: Set<string> }) {
  const [sourceQuery, setSourceQuery] = useState("");
  const [confidence, setConfidence] = useState("全部");
  const [currentOnly, setCurrentOnly] = useState(false);
  const filtered = sources.filter((source) => {
    const queryMatch = [source.id, source.title, source.type, source.confidence, source.notes].join(" ").toLowerCase().includes(sourceQuery.toLowerCase());
    const confidenceMatch = confidence === "全部" || confidence === confidenceLabel(source.confidence);
    const typeMatch = enabledSourceFilters.some((filter) => sourceMatchesType(source, filter));
    const scopeMatch = !currentOnly || filteredSourceIds.has(source.id);
    return queryMatch && confidenceMatch && typeMatch && scopeMatch;
  });

  return (
    <>
      <div className="source-toolbar">
        <div className="source-search">
          <Search size={17} />
          <input value={sourceQuery} onChange={(event) => setSourceQuery(event.target.value)} placeholder="搜索来源、类型或备注" />
        </div>
        <select value={confidence} onChange={(event) => setConfidence(event.target.value)}>
          <option>全部</option>
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>
        <label className="check-row current-source-toggle"><input type="checkbox" checked={currentOnly} onChange={(event) => setCurrentOnly(event.target.checked)} />仅当前筛选候选来源 <b>{filteredSourceIds.size}</b></label>
      </div>
      <div className="table-scroll">
        <table className="source-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>来源</th>
              <th>类型</th>
              <th>置信度</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((source) => (
              <tr key={source.id}>
                <td>{source.id}</td>
                <td><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={13} /></a></td>
                <td>{source.type}</td>
                <td><span className={`confidence ${source.confidence}`}>{confidenceLabel(source.confidence)}</span></td>
                <td>{source.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState title="没有匹配来源" body="请减少来源类型、置信度、关键词或当前候选来源范围限制。" />}
      </div>
    </>
  );
}

function exportSources(items: Source[]) {
  const rows = [["ID", "来源", "类型", "置信度", "URL", "备注"], ...items.map((source) => [source.id, source.title, source.type, confidenceLabel(source.confidence), source.url, source.notes])];
  downloadText(`来源追踪-${meta.accessedDate}.csv`, rows.map((row) => row.map(csvEscape).join(",")).join("\n"));
}

function buildMarkdownReport() {
  const focusCount = robots.filter((robot) => robot.marketTier === "重点候选").length;
  const marketCount = robots.filter((robot) => robot.marketTier === "市场初筛").length;
  const lines = [
    "# 学校机器人采购调研摘要 v3",
    "",
    `更新时间：${meta.accessedDate}`,
    "",
    `候选设备：${robots.length} 个；重点候选：${focusCount} 个；市场初筛：${marketCount} 个；官网核验：${robots.filter((robot) => robot.verificationStatus === "官网核验").length} 个；来源记录：${sources.length} 条；已收录公开价/估算价：${robots.filter((robot) => robot.price.amount !== null).length} 个；厂商正式报价项：${robots.filter((robot) => robot.price.amount === null && robot.price.type.includes("正式报价")).length} 个。`,
    "",
    "## 推荐短名单",
    ...shortlistGroups.flatMap((tag) => [
      "",
      `### ${tag}`,
      ...robots.filter((robot) => robot.shortlistTags.includes(tag)).sort((a, b) => b.scores.overall - a.scores.overall).slice(0, 5).map((robot, index) => `${index + 1}. ${robot.name}：${formatPrice(robot)}，${robot.marketTier}，发布时间 ${robot.releaseDate}，科研 ${robot.scores.research}/50，落地 ${robot.scores.deployment}/50。`)
    ]),
    "",
    "## 价格口径",
    "页面主价格统一为人民币；低置信电商线索和外币估算不作为正式报价。"
  ];
  return lines.join("\n");
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
}

function ScorePill({ score }: { score: number }) {
  const label = score >= 80 ? "高" : score >= 60 ? "中-高" : score >= 50 ? "中" : "低";
  return <span className={`score-pill ${score >= 80 ? "high" : score >= 60 ? "midhigh" : "mid"}`}>{label}</span>;
}

function ScoreMini({ research, deployment }: { research: number; deployment: number }) {
  return <div className="score-mini"><span>研 {research}</span><span>落 {deployment}</span></div>;
}

function ConfidenceDots({ confidence }: { confidence: Confidence }) {
  const count = confidence === "high" ? 5 : confidence === "medium" ? 3 : 1;
  return (
    <div className="confidence-dots" title={confidenceText(confidence)}>
      <span>{confidenceLabel(confidence)}</span>
      {Array.from({ length: 5 }).map((_, index) => <i key={index} className={index < count ? confidence : ""} />)}
    </div>
  );
}

function RobotDetail({ robot, onClose }: { robot: Robot; onClose: () => void }) {
  const linkedSources = robot.sourceIds.map((id) => sources.find((source) => source.id === id)).filter((source): source is Source => Boolean(source));

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true" aria-label={`${robot.name} 详情`}>
      <aside className="detail-drawer">
        <div className="detail-head">
          <div>
            <span className={`tag ${categoryClass(robot.category)}`}>{robot.category}</span>
            <h2>{robot.name}</h2>
            <p>{brandLabel(robot)} · {brandPlace(robot)}</p>
          </div>
          <button onClick={onClose} aria-label="关闭详情"><X size={18} /></button>
        </div>

        <div className="detail-grid">
          <DetailItem label="市场层级" value={robot.marketTier} />
          <DetailItem label="核验状态" value={robot.verificationStatus || "未标注"} />
          <DetailItem label="品牌所在地" value={`${robot.domesticPriority ? "国产" : "进口"} · ${brandPlace(robot)}`} />
          <DetailItem label="发布时间" value={`${robot.releaseDate}（${confidenceLabel(robot.releaseDateConfidence)}）`} />
          <DetailItem label="价格口径" value={`${formatPrice(robot)} · ${robot.price.type}`} />
          <DetailItem label="科研评分" value={`${robot.scores.research}/50`} />
          <DetailItem label="落地评分" value={`${robot.scores.deployment}/50`} />
        </div>

        <section className="detail-section">
          <h3>标签</h3>
          <TagList tags={robot.tags} />
        </section>

        <section className="detail-section">
          <h3>参数与软件</h3>
          <dl className="detail-list">
            <div><dt>形态</dt><dd>{robot.formFactor}</dd></div>
            <div><dt>负载</dt><dd>{robot.specs.payloadKg}</dd></div>
            <div><dt>自由度</dt><dd>{robot.specs.dof}</dd></div>
            <div><dt>ROS/ROS2</dt><dd>{robot.software.ros}；{robot.software.ros2}</dd></div>
            <div><dt>SDK/仿真</dt><dd>{robot.software.sdk}；{robot.software.sim}</dd></div>
          </dl>
        </section>

        <section className="detail-section">
          <h3>证据和风险</h3>
          {robot.verificationNotes && <p>{robot.verificationNotes}</p>}
          <p>{robot.researchEvidence[0]}</p>
          <p>{robot.deploymentEvidence[0]}</p>
          <ul>
            {robot.risks.map((risk) => <li key={risk}>{risk}</li>)}
          </ul>
        </section>

        <section className="detail-section">
          <h3>来源</h3>
          <a className="official-link" href={robot.officialUrl} target="_blank" rel="noreferrer">官网/产品页 <ExternalLink size={14} /></a>
          <div className="source-links">
            {linkedSources.slice(0, 8).map((source) => (
              <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.id} · {source.title}</a>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CategoryThumb({ category, compact = false }: { category: string; compact?: boolean }) {
  const robot = robots.find((item) => item.category === category);
  const src = robot?.image || "/assets/robots/robot-arm.png";
  return <img className={compact ? "robot-thumb compact" : "robot-thumb"} src={src} alt={category} />;
}

createRoot(document.getElementById("root")!).render(<App />);
