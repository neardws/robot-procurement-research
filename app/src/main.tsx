import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Columns3,
  CreditCard,
  Database,
  Download,
  ExternalLink,
  Info,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingCart,
  Store,
  X
} from "lucide-react";
import data from "./robotResearchData.json";
import "./styles.css";

declare global {
  interface Window {
    __robotResearchRoot?: ReturnType<typeof createRoot>;
  }
}

type Confidence = "high" | "medium" | "low";
type ReleaseConfidence = Confidence | "unknown";
type Tab = "overview" | "rankings" | "compare" | "report" | "retail" | "sources";
type SourceFilter = "官网" | "电商" | "GitHub" | "论文" | "招投标";
type OriginFilter = "全部" | "国产" | "进口";
type PriceBand = "全部" | "10万以下" | "10-30万" | "30-80万" | "80万以上" | "正式报价";
type ReleaseFilter = "全部" | "近1年" | "近3年" | "2020年以后" | "官网未披露";
type MarketTier = "重点候选" | "市场初筛";
type VerificationStatus = "官网核验" | "部分核验" | "未核验";
type ColumnKey = "formFactor" | "country" | "priceType" | "software" | "risk" | "sources" | "releaseDate" | "marketTier" | "verification" | "tags";
type CoverageTier = "主流在售" | "科研常用" | "教育/低成本" | "开源/组合方案" | "历史/供货待确认";

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
  coverageTier?: CoverageTier;
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
  academicMetrics?: {
    paperCount: number;
    citationCount: number;
    recentPaperCount: number;
    academicScore: number;
    topPaperTitles: string[];
    academicMetricSource: string;
    academicConfidence: Confidence | "unknown";
  };
  openSourceMetrics?: {
    repoCount: number;
    stars: number;
    forks: number;
    recentlyUpdatedRepos: number;
    officialRepoCount: number;
    openSourceScore: number;
    topRepos: string[];
    openSourceMetricSource: string;
    openSourceConfidence: Confidence | "unknown";
  };
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

type RetailSource = {
  id: string;
  title: string;
  url: string;
  type: string;
  confidence: Confidence;
  notes: string;
};

type RetailOption = {
  name: string;
  tier: string;
  form: string;
  role: string;
  maturity: string;
  procurement: string;
  price: string;
  fit: string;
  limits: string[];
  evidenceIds: string[];
};

type RetailCoverageRow = {
  scope: string;
  covered: string;
  conclusion: string;
  action: string;
};

type RetailOptionGroup = {
  title: string;
  subtitle: string;
  tiers: string[];
};

type RetailZone = {
  zone: string;
  area: string;
  setup: string;
  notes: string;
};

type RetailRoadmap = {
  phase: string;
  duration: string;
  work: string;
  gate: string;
};

type RetailNavItem = {
  id: string;
  label: string;
  kicker: string;
};

type RetailSpec = {
  label: string;
  value: string;
  detail: string;
};

type RetailShelfPlan = {
  item: string;
  spec: string;
  detail: string;
};

type RetailSkuPlan = {
  type: string;
  examples: string;
  quantity: string;
  handling: string;
  avoid: string;
};

type RetailArchitectureItem = {
  module: string;
  responsibility: string;
  interface: string;
};

type RetailProcessStep = {
  step: string;
  owner: string;
  action: string;
  output: string;
};

type RetailExceptionPlan = {
  scenario: string;
  systemAction: string;
  manualAction: string;
};

type RetailProcurementItem = {
  category: string;
  spec: string;
  phase: string;
  note: string;
};

type RetailBudgetRow = {
  item: string;
  range: string;
  note: string;
};

type RetailAcceptanceMetric = {
  metric: string;
  target: string;
  method: string;
};

const robots = data.robots as Robot[];
const sources = data.sources as Source[];
const sourceById = new Map(sources.map((source) => [source.id, source]));
const meta = data.meta as {
  version: string;
  accessedDate: string;
  updateSummary: string;
  exchangeRates?: Record<string, string | number>;
  sourceVerificationSummary?: {
    checked: number;
    ok: number;
    review: number;
    checkedAt: string;
  };
};

const categories = ["机械臂", "移动/复合机器人", "人形机器人", "机器狗"];
const shortlistGroups = ["科研平台", "教学平台", "落地项目"];
const sourceFilters: SourceFilter[] = ["官网", "电商", "GitHub", "论文", "招投标"];
const originFilters: OriginFilter[] = ["全部", "国产", "进口"];
const priceBands: PriceBand[] = ["全部", "10万以下", "10-30万", "30-80万", "80万以上", "正式报价"];
const releaseFilters: ReleaseFilter[] = ["全部", "近1年", "近3年", "2020年以后", "官网未披露"];
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

const retailRoute = "#/retail";

function getInitialTab(): Tab {
  return window.location.hash === retailRoute || window.location.hash.startsWith("#retail-") ? "retail" : "overview";
}

const retailSources: RetailSource[] = [
  {
    id: "R01",
    title: "Galbot G1 官方产品页",
    url: "https://www.galbot.com/g1",
    type: "厂商官网",
    confidence: "high",
    notes: "官网将 Commercial & Retail 场景描述为精确拣选、配送、24/7 库存管理和补货，并披露 0-2.4 m 覆盖、IP54 等关键信息。"
  },
  {
    id: "R02",
    title: "TELEXISTENCE 官方网站",
    url: "https://tx-inc.com/en/",
    type: "厂商官网/商业案例",
    confidence: "high",
    notes: "官网说明 2021 年与 FamilyMart 合作，并将机器人部署到 300 家门店；同页还展示便利店结账台抓取演示和饮料补货机器人数据平台。"
  },
  {
    id: "R03",
    title: "Simbe Tally 平台页",
    url: "https://www.simberobotics.com/platform/",
    type: "厂商官网",
    confidence: "high",
    notes: "Tally 定位为货架扫描和库存机器人，可多次扫描通道并识别缺货、价格错误和陈列偏差；不承担货架抓取。"
  },
  {
    id: "R04",
    title: "Amazon Just Walk Out 官方说明",
    url: "https://justwalkout.com/",
    type: "结账技术",
    confidence: "high",
    notes: "官方说明该技术组合 AI、计算机视觉、传感器融合和 RFID，在顾客离店时自动汇总和支付。"
  },
  {
    id: "R05",
    title: "2010 ADA Standards for Accessible Design",
    url: "https://www.ada.gov/law-and-regs/design-standards/2010-stds/",
    type: "场地/无障碍",
    confidence: "high",
    notes: "用于确定最低无障碍通行和收银服务台等公共空间约束；机器人通道应在此基础上预留更大安全宽度。"
  },
  {
    id: "R06",
    title: "ISO 13482:2014 personal care robots",
    url: "https://www.iso.org/standard/53820.html",
    type: "安全标准",
    confidence: "medium",
    notes: "面向服务/个人护理机器人安全要求，可作为公共零售空间内人机共处风险评估参考。"
  },
  {
    id: "R07",
    title: "ISO 3691-4 driverless industrial trucks",
    url: "https://www.iso.org/standard/70660.html",
    type: "安全标准",
    confidence: "medium",
    notes: "覆盖 AGV/AMR 等自动行驶车辆的安全要求和运行区域准备；零售场景应结合 ISO 13482 和本地法规使用。"
  },
  {
    id: "R08",
    title: "PUDU FlashBot Arm 官方产品页",
    url: "https://www.pudurobotics.com/en/products/flashbot-arm",
    type: "厂商官网",
    confidence: "high",
    notes: "FlashBot Arm 定位为半人形具身智能服务机器人，组合配送能力和双手操作，可按电梯、刷卡、开门并具备动态环境感知。"
  },
  {
    id: "R09",
    title: "Badger Technologies Digital Teammate",
    url: "https://www.badger-technologies.com/platform/robots.html",
    type: "厂商官网",
    confidence: "high",
    notes: "Badger 官方说明其机器人用于扫描货架、发现缺货、空货架、价格差异、陈列不一致，并支持零售环境自导航和系统集成。"
  },
  {
    id: "R10",
    title: "Brain Corp inventory management",
    url: "https://www.braincorp.com/inventory-management",
    type: "厂商官网",
    confidence: "high",
    notes: "BrainOS Sense Suite/ShelfOptix 提供机器人货架智能、库存可见性、RFID 和货架到销售洞察；现阶段更偏库存感知层。"
  },
  {
    id: "R11",
    title: "Locus Array 官方产品页",
    url: "https://locusrobotics.com/locusone/fleet/locus-array",
    type: "厂商官网",
    confidence: "high",
    notes: "Locus Array 是面向仓储履约的移动操作机器人，直接在货架通道内执行 picking、putaway、induction、drop-off 和 slotting。"
  },
  {
    id: "R12",
    title: "Brightpick Autopicker 官方发布",
    url: "https://brightpick.ai/brightpick-announces-brightpick-autopicker-the-worlds-first-commercially-available-autonomous-mobile-picking-robot-for-order-fulfillment/",
    type: "厂商官网/发布",
    confidence: "high",
    notes: "Brightpick Autopicker 面向电商和食品杂货履约，可在仓库通道中自主拣选并合单，适合暗店或后场微履约。"
  },
  {
    id: "R13",
    title: "Geek+ 机器人履约系统",
    url: "https://www.geekplus.com/en",
    type: "厂商官网",
    confidence: "high",
    notes: "Geek+ 提供 Shelf-to-Person、Tote-to-Person、Robot Arm Picking Station 等履约方案，偏仓储/暗店而非顾客前台货架。"
  },
  {
    id: "R14",
    title: "ForwardX Flex Series",
    url: "https://www.forwardx.com/flex-series/",
    type: "厂商官网",
    confidence: "high",
    notes: "ForwardX Flex 面向仓储和链式门店配送仓的辅助拣选，JD chain store warehouse 案例用于改善拣选效率和成本。"
  },
  {
    id: "R15",
    title: "Ocado Intelligent Automation OCADEX/Pick",
    url: "https://ocadointelligentautomation.com/systems/on-grid-robotic-pick",
    type: "厂商官网",
    confidence: "high",
    notes: "OCADEX/Pick 是 Ocado OSRS 网格系统上的机器人拣选臂，可从料箱中识别、拣选和装袋，适合大型食品杂货履约中心。"
  },
  {
    id: "R16",
    title: "Pio by AutoStore",
    url: "https://www.autostoresystem.com/pio-created-by-autostore",
    type: "厂商官网",
    confidence: "high",
    notes: "Pio 是 AutoStore 面向较小仓库空间和中小型电商/3PL 的紧凑自动化存储系统，适合后场库存和订单履约。"
  },
  {
    id: "R17",
    title: "RightHand Robotics RightPick",
    url: "https://righthandrobotics.com/products",
    type: "厂商官网",
    confidence: "high",
    notes: "RightPick 是面向订单履约的机器人拣选系统，适合料箱、输送线和工作站式拣选，不适合直接在开放前台货架中移动取货。"
  },
  {
    id: "R18",
    title: "Berkshire Grey Robotic Picking",
    url: "https://www.berkshiregrey.com/solutions/core-robotic-picking-system/",
    type: "厂商官网",
    confidence: "high",
    notes: "Berkshire Grey 提供机器人拣选、分拣和履约自动化，适合配送中心、零售补货和退货处理等后场流程。"
  },
  {
    id: "R19",
    title: "Covariant robotic picking",
    url: "https://covariant.ai/",
    type: "厂商官网",
    confidence: "high",
    notes: "Covariant 面向仓库拣选和物流自动化提供机器人基础模型和拣选能力，可作为后场抓取技术供应商观察对象。"
  },
  {
    id: "R20",
    title: "Takeoff Technologies micro fulfillment",
    url: "https://takeoff.com/",
    type: "微履约方案",
    confidence: "medium",
    notes: "Takeoff 聚焦食品杂货微履约中心，适合把门店后场改造成自动化履约节点，而不是前台顾客货架抓取。"
  },
  {
    id: "R21",
    title: "Galbot 香港 24/7 机器人便利店报道",
    url: "https://www.scmp.com/news/hong-kong/hong-kong-economy/article/3356255/hong-kong-open-first-convenience-store-operated-humanoid-robot-ai-push",
    type: "最新市场动态",
    confidence: "medium",
    notes: "2026 年 6 月报道显示 Galbot G1/Xiao Gai 进入香港 9 m² 胶囊便利店场景，覆盖补货、取物和结账展示；仍需以厂商 PoC 和合同能力为准。"
  },
  {
    id: "R22",
    title: "From Pixels to Shelf: supermarket stocking research",
    url: "https://arxiv.org/abs/2509.11740",
    type: "科研验证",
    confidence: "medium",
    notes: "2025 年研究用商用硬件复现超市场景货架上货/前移，实验成功率高，但也指出当前系统成本效益仍弱于人工，适合作为 PoC 风险参考。"
  }
];

const retailOptions: RetailOption[] = [
  {
    name: "Galbot G1 / Galaxea R1",
    tier: "前台主抓取",
    form: "轮式双臂移动操作平台",
    role: "首选验证线：完成货架识别、商品抓取、暂存交付和补货演示",
    maturity: "需要厂商 PoC / 方案集成",
    procurement: "向银河通用索取智慧零售场景报价、SKU 约束、成功率测试方案和售后条款；优先做 4-6 组货架样机验证。",
    price: "厂商正式报价；现有候选库中 G1/R1 未公开价格",
    fit: "官网已明确覆盖商业零售、高密货架操作、精确拣选和库存补货，是当前最贴近目标闭环的采购方向。",
    limits: ["必须限制首期 SKU 形态，先做瓶装、盒装、规则包装", "需要确认结账系统接口、远程运维、失败抓取回退和人机混行安全", "价格、交期和现场改造费用需厂商正式报价"],
    evidenceIds: ["R01", "R21"]
  },
  {
    name: "TELEXISTENCE Ghost / TX 系列",
    tier: "成熟补货案例",
    form: "便利店补货/固定化货架操作机器人",
    role: "成熟案例参考：饮料冷柜补货、便利店商品抓取和结账台演示",
    maturity: "商业部署案例成熟",
    procurement: "作为成熟零售机器人案例询价或对标，不把它默认等同为国内可直接采购整店方案。",
    price: "需正式商务沟通",
    fit: "FamilyMart 300 店部署说明其在真实便利店环境中具备规模化运营经验，适合作为补货和高频 SKU 作业标杆。",
    limits: ["公开资料偏案例，国内采购、开放接口和本地售后需单独确认", "更适合标准化冷柜/货架补货，不一定覆盖顾客下单后的全品类取货", "如要复现结账台抓取，需要明确是否是产品化能力还是展示演示"],
    evidenceIds: ["R02"]
  },
  {
    name: "Hello Robot Stretch 3",
    tier: "低成本原型",
    form: "轻量移动操作科研平台",
    role: "低成本原型：验证识别、导航、抓取策略和任务编排",
    maturity: "科研/教学验证",
    procurement: "采购 1 台做算法和货架结构验证；不建议作为无人零售正式运营主机。",
    price: "现有候选库估算约 ¥18.1 万起",
    fit: "预算低、改造空间大，适合先跑通软件闭环和 SKU 数据采集。",
    limits: ["轻载、速度和可靠性不适合直接承担连续商业运营", "货架高度、臂展和夹爪能力需要按 SKU 实测", "进口采购、交期和维保需确认"],
    evidenceIds: ["R01"]
  },
  {
    name: "AgileX Cobot Magic / xArm + 底盘组合",
    tier: "工程样机",
    form: "轮式复合机器人二次开发组合",
    role: "工程样机：用成熟底盘加机械臂搭建可控试点",
    maturity: "需要二次开发集成",
    procurement: "若预算或国产供应链优先，可采购底盘、协作臂、夹爪、视觉和调度系统进行集成。",
    price: "现有候选库估算约 30-60 万级，需按配置正式报价",
    fit: "工程可控、可替换部件多，适合学校或实验室团队掌握二次开发。",
    limits: ["需要团队承担抓取算法、安全联锁、支付接口和整机认证", "对真实货架鲁棒性弱于专用零售方案", "首期要把现场限定成半结构化环境"],
    evidenceIds: ["R06", "R07", "R22"]
  },
  {
    name: "PUDU FlashBot Arm",
    tier: "服务交互/试验",
    form: "半人形双臂服务机器人",
    role: "服务交互：可验证顾客交互、按钮/门禁/取放动作和封闭仓配送",
    maturity: "商用服务机器人新品",
    procurement: "作为二期交互和配送演示候选，不建议替代主抓取机器人；需要向普渡确认零售货架抓取 SDK、夹爪能力和价格。",
    price: "厂商正式报价；第三方价格线索需复核",
    fit: "官方定位包含配送和人形操作能力，适合作为门店服务机器人形态观察对象。",
    limits: ["公开资料没有证明其能稳定完成高密货架商品拣选", "更适合电梯、门禁、配送和交互，前台货架取货需专项 PoC", "需要确认双臂负载、抓取库、远程运维和商用安全责任"],
    evidenceIds: ["R08"]
  },
  {
    name: "Simbe Tally / 同类库存巡检机器人",
    tier: "库存巡检",
    form: "货架扫描机器人",
    role: "辅助系统：盘点、缺货识别、价格错误和陈列偏差检测",
    maturity: "商用成熟但不抓取",
    procurement: "可作为库存感知层或后续扩展模块，不应替代主抓取机器人采购。",
    price: "厂商正式报价",
    fit: "解决库存可见性和货位纠错，对机器人抓取成功率和补货效率有帮助。",
    limits: ["不能从货架上抓取商品", "需要与 POS/库存系统对接", "适合较大门店或多门店，不一定适合首个小样板间"],
    evidenceIds: ["R03"]
  },
  {
    name: "Badger Digital Teammate / Marty",
    tier: "库存巡检",
    form: "零售货架扫描机器人",
    role: "辅助系统：货架扫描、顶部库存、价格差异和陈列合规",
    maturity: "商用成熟但不抓取",
    procurement: "如果试点门店 SKU 多、人工盘点压力大，可与主抓取机器人分阶段组合；小样板间可先不采购。",
    price: "厂商正式报价",
    fit: "官方明确面向零售环境扫描货架，适合构建库存真实状态和补货任务列表。",
    limits: ["不能抓取商品", "价值依赖 POS/库存/陈列系统对接", "若门店很小，人工盘点可能更经济"],
    evidenceIds: ["R09"]
  },
  {
    name: "BrainOS Sense Suite / ShelfOptix",
    tier: "库存巡检",
    form: "机器人库存智能平台",
    role: "辅助系统：货架智能、RFID/视觉库存、货架到销售洞察",
    maturity: "商用库存感知平台",
    procurement: "作为连锁化或多门店阶段的库存层候选；首期样板间只需保留接口兼容性。",
    price: "服务/机器人正式报价",
    fit: "适合把货架状态数字化，提升机器人找货、缺货判断和补货优先级。",
    limits: ["不是货架抓取主机", "需和品牌、零售商、门店系统共同定义数据闭环", "采购形态可能是服务而不是单台机器人"],
    evidenceIds: ["R10"]
  },
  {
    name: "Pudu / Keenon / 送餐配送底盘",
    tier: "配送交互",
    form: "轮式配送/交互机器人",
    role: "末端交付：把已取商品送到顾客或结账区",
    maturity: "配送成熟，抓取不足",
    procurement: "只有在主抓取机器人与顾客动线分离时才考虑采购；第一期可先用固定取货台替代。",
    price: "厂商正式报价",
    fit: "导航、避障、语音/屏幕交互和商用维护成熟，可降低顾客交付环节难度。",
    limits: ["无法独立完成货架取货", "会增加多机器人调度复杂度", "如果场地小，固定交付台更简单"],
    evidenceIds: ["R06", "R07"]
  },
  {
    name: "Locus Array",
    tier: "暗店/仓储履约",
    form: "仓储通道内移动操作机器人",
    role: "后场履约：在货架通道内自主拣选、投放、上架和合单",
    maturity: "生产级履约方案",
    procurement: "如果智慧零售场景改为后场暗店或微履约中心，应进入正式 RFI；不建议放在顾客混行前台。",
    price: "RaaS/正式报价",
    fit: "官方定位是机器人到货物的通道内自主履约，SKU 覆盖和吞吐更强，适合后场自动化。",
    limits: ["面向仓储/履约中心，不是开放零售前台", "需要标准料箱、货架和 WMS/OMS 集成", "对 80-120 m² 展示样板间可能过重"],
    evidenceIds: ["R11"]
  },
  {
    name: "Brightpick Autopicker",
    tier: "暗店/仓储履约",
    form: "移动拣选与合单机器人",
    role: "后场履约：食品杂货/电商订单自动拣选和合单",
    maturity: "商业履约机器人",
    procurement: "适合评估暗店、校内小型电商履约或后场无人仓；若坚持前台货架取货则只作对标。",
    price: "RaaS/正式报价",
    fit: "官方明确面向 grocery order fulfillment，并能在仓库通道中自主拣选和合单。",
    limits: ["需要仓储货架和料箱式作业，不是开放式顾客货架", "对支付/顾客交互没有直接覆盖", "需要看国内交付和售后可得性"],
    evidenceIds: ["R12"]
  },
  {
    name: "Geek+ Shelf-to-Person / Robot Arm Picking Station",
    tier: "暗店/仓储履约",
    form: "货架到人/料箱到人 + 机器人拣选站",
    role: "后场履约：移动货架、机器人拣选站、排序和内部物流",
    maturity: "成熟仓储自动化",
    procurement: "适合较大后场或校内供应链实验室；前台智慧零售样板间只保留为规模化后场方案。",
    price: "正式方案报价",
    fit: "系统成熟、部署案例多，适合高 SKU 和高订单量场景。",
    limits: ["通常需要专门仓储区和 WMS，不是顾客可见货架抓取", "前期投入和场地要求高", "对小型展示店过重"],
    evidenceIds: ["R13"]
  },
  {
    name: "ForwardX Flex Series",
    tier: "辅助拣选/仓储",
    form: "视觉 AMR 辅助拣选车",
    role: "后场辅助：人机协同拣选、称重复核和门店配送仓搬运",
    maturity: "成熟 AMR，但通常人机协同",
    procurement: "如果保留人工拣货员，可作为低风险提升效率方案；不适合作为无人抓取主机。",
    price: "正式报价",
    fit: "链式门店仓案例能解决拣选效率和成本问题，可服务智慧零售后场补货。",
    limits: ["多数流程仍需人工拿取商品", "不是机械臂抓货架商品", "前台展示价值低于真正移动操作机器人"],
    evidenceIds: ["R14"]
  },
  {
    name: "Ocado OCADEX/Pick / OSRS",
    tier: "大型履约中心",
    form: "网格仓储 + 机器人拣选臂",
    role: "大型食品杂货履约：从料箱中识别、拣选和装袋",
    maturity: "大型系统成熟",
    procurement: "作为远期规模化食品杂货履约标杆，不进入首期智慧零售样板间采购。",
    price: "大型系统方案报价",
    fit: "食品杂货自动拣选能力强，可作为成熟上限案例。",
    limits: ["不是开放货架前台取货", "需要 Ocado OSRS 网格系统和大规模履约中心", "预算、面积、建设周期都超出首期场景"],
    evidenceIds: ["R15"]
  },
  {
    name: "Pio by AutoStore",
    tier: "后场微履约",
    form: "紧凑立库存储自动化",
    role: "后场库存：把前台货架转为后场料箱存储和人工/半自动拣选",
    maturity: "紧凑仓储系统",
    procurement: "如果目标从机器人前台抓货转为稳定履约，可作为小空间后场方案；不满足“从货架抓取”的展示目标。",
    price: "正式系统报价",
    fit: "适合小空间、高库存准确率和订单履约效率。",
    limits: ["不是机器人手臂从开放货架取货", "展示感弱，但运营稳定性可能更好", "需要重构货架和补货流程"],
    evidenceIds: ["R16"]
  },
  {
    name: "RightHand Robotics RightPick",
    tier: "固定拣选工作站",
    form: "固定式机器人拣选单元",
    role: "后场拣选：从料箱/输送线抓取商品并完成订单履约",
    maturity: "成熟履约组件",
    procurement: "若把货架取货改为后场料箱履约，可纳入 RFI；不作为前台移动机器人采购。",
    price: "正式方案报价",
    fit: "适合 SKU 包装差异较大的订单履约场景，可补足移动机器人抓取成功率不足的问题。",
    limits: ["需要后场工作站、料箱和输送/暂存流程", "不能在开放货架区自主移动取货", "顾客交互和结账仍需独立系统"],
    evidenceIds: ["R17"]
  },
  {
    name: "Berkshire Grey Robotic Picking",
    tier: "固定拣选工作站",
    form: "后场机器人拣选/分拣系统",
    role: "后场履约：订单拣选、补货分拣和退货处理",
    maturity: "生产级自动化系统",
    procurement: "适合作为连锁零售后场或配送中心升级方案；首期门店样板间只做技术对标。",
    price: "大型系统方案报价",
    fit: "覆盖零售履约的多个高吞吐环节，能提升后场自动化稳定性。",
    limits: ["场地和集成复杂度高", "不是顾客可见货架取货方案", "更适合集中式履约而非单店展示"],
    evidenceIds: ["R18"]
  },
  {
    name: "Covariant robotic picking",
    tier: "固定拣选工作站",
    form: "AI 拣选模型 + 工业机器人工作站",
    role: "后场抓取：提升复杂商品拣选泛化能力",
    maturity: "产业化技术供应商",
    procurement: "作为高泛化抓取技术供应商观察；若要做后场工作站，可与系统集成商共同评估。",
    price: "正式方案报价",
    fit: "通用抓取能力与零售 SKU 多样性相关，适合评估为后场拣选核心技术。",
    limits: ["不是整店移动取货产品", "落地依赖集成商、末端执行器和后场流程", "国内交付、数据合规和售后需确认"],
    evidenceIds: ["R19"]
  },
  {
    name: "Takeoff micro fulfillment",
    tier: "后场微履约",
    form: "食品杂货微履约中心",
    role: "后场履约：把门店订单转入自动化库存和拣选流程",
    maturity: "成熟方案但偏系统工程",
    procurement: "若项目目标从展示机器人取货转向稳定经营，可评估微履约路线；不满足前台抓取展示诉求。",
    price: "项目制正式报价",
    fit: "食品杂货场景贴合度高，适合将门店后场做成高效率履约节点。",
    limits: ["场景会从开放货架转为后场履约", "需要库存、订单、补货和门店改造整体投入", "机器人可见性和展示效果弱"],
    evidenceIds: ["R20"]
  },
  {
    name: "Unitree G1 / Go2 + Z1 等足式路线",
    tier: "展示/科研",
    form: "人形/四足加机械臂",
    role: "展示或科研：提升展演效果，验证非结构化移动",
    maturity: "展示/科研优先",
    procurement: "不建议作为首期智慧零售主采购路线；可作为二期展项或开放研究平台。",
    price: "公开价和组合价差异大，需按配置报价",
    fit: "形象展示强，适合科研传播和复杂地形研究。",
    limits: ["货架通道内稳定性、安全边界和抓取效率需大量实测", "与轮式平台相比维护和安全风险更高", "普通零售场地没有足式运动的必要性"],
    evidenceIds: ["R06", "R07"]
  }
];

const retailCoverageRows: RetailCoverageRow[] = [
  {
    scope: "前台开放货架抓取",
    covered: "Galbot G1/R1、Galbot 香港胶囊店动态、TELEXISTENCE 前台演示方向、工程组合样机",
    conclusion: "候选少，商业成熟度仍需 PoC；这是最贴近原始目标但风险最高的采购层。",
    action: "优先约厂商做限定 SKU 实测，不先签大额整店采购。"
  },
  {
    scope: "便利店冷柜/高频补货",
    covered: "TELEXISTENCE TX Ghost",
    conclusion: "真实零售场景经验最强，但偏补货和后场/冷柜作业，不等同于顾客下单全品类取货。",
    action: "作为成熟案例对标，重点询问国内交付、接口和可采购形态。"
  },
  {
    scope: "库存巡检与缺货识别",
    covered: "Simbe Tally、Badger Digital Teammate、BrainOS Sense/ShelfOptix",
    conclusion: "成熟度高，但只解决“看见货架”，不能替代机械臂抓取。",
    action: "二期或多门店阶段采购；首期保留数据接口即可。"
  },
  {
    scope: "顾客交互和末端配送",
    covered: "PUDU FlashBot Arm、Pudu/Keenon 配送底盘",
    conclusion: "导航、交互和配送成熟度较好，货架抓取能力不足。",
    action: "只在主抓取机器人与顾客动线分离时采购。"
  },
  {
    scope: "暗店/后场自动履约",
    covered: "Locus Array、Brightpick Autopicker、Geek+、ForwardX、Ocado、Pio、Takeoff",
    conclusion: "可用方案明显更多，也更成熟；但场景会从“前台货架取货”转为仓储/微履约。",
    action: "如果项目目标偏稳定运营而非展示前台抓取，应单独开后场方案线。"
  },
  {
    scope: "固定拣选工作站",
    covered: "RightHand Robotics、Berkshire Grey、Covariant",
    conclusion: "适合后场料箱、输送线和工作站，不适合开放货架移动取货。",
    action: "作为后场抓取备选技术纳入 RFI，不进入第一期前台主机。"
  },
  {
    scope: "足式/通用人形展示",
    covered: "Unitree、Fourier、UBTECH 等通用平台",
    conclusion: "展示和科研价值高，普通零售通道没有足式移动刚需。",
    action: "不列为首期主采购；可作为二期科普展示或算法平台。"
  }
];

const retailOptionGroups: RetailOptionGroup[] = [
  {
    title: "前台抓取与补货主线",
    subtitle: "最贴近“机器人到货架取货”的路线，但商业成熟候选少，必须先做限定 SKU PoC。",
    tiers: ["前台主抓取", "成熟补货案例", "工程样机", "低成本原型", "服务交互/试验"]
  },
  {
    title: "库存巡检与配送辅助",
    subtitle: "能补强库存准确率、顾客交付和交互，但不能替代主抓取机器人。",
    tiers: ["库存巡检", "配送交互"]
  },
  {
    title: "暗店/后场履约路线",
    subtitle: "成熟方案更多，适合稳定运营；代价是场景从开放前台货架转向后场仓储/微履约。",
    tiers: ["暗店/仓储履约", "辅助拣选/仓储", "大型履约中心", "后场微履约"]
  },
  {
    title: "固定拣选工作站",
    subtitle: "适合料箱、输送线和工作站式订单履约，是后场抓取的替代路径。",
    tiers: ["固定拣选工作站"]
  },
  {
    title: "展示/科研路线",
    subtitle: "适合展演和科研传播，不作为首期商业闭环的主采购。",
    tiers: ["展示/科研"]
  }
];

const retailNavItems: RetailNavItem[] = [
  { id: "retail-scope", label: "方案边界", kicker: "30-40㎡" },
  { id: "retail-layout", label: "场地布局", kicker: "动线" },
  { id: "retail-shelves", label: "货架与 SKU", kicker: "商品池" },
  { id: "retail-architecture", label: "系统架构", kicker: "模块" },
  { id: "retail-flow", label: "业务流程", kicker: "闭环" },
  { id: "retail-exceptions", label: "异常处理", kicker: "兜底" },
  { id: "retail-procurement", label: "采购清单", kicker: "设备" },
  { id: "retail-budget", label: "预算框架", kicker: "成本" },
  { id: "retail-acceptance", label: "验收指标", kicker: "KPI" },
  { id: "retail-robots", label: "机器人路线", kicker: "选型" },
  { id: "retail-sources", label: "来源依据", kicker: "证据" }
];

const retailCoreSpecs: RetailSpec[] = [
  { label: "样板间面积", value: "30-40 m²", detail: "首期按单机器人、半结构化环境设计，不按完整便利店面积展开。" },
  { label: "货架数量", value: "4-6 组", detail: "每组 3-4 层，首期只开放中低层可抓区。" },
  { label: "SKU 数量", value: "30-60 个", detail: "以规则包装商品为主，每个 SKU 建立货位、重量和抓取参数。" },
  { label: "首期机器人", value: "1 台主机", detail: "轮式移动操作机器人承担取货；配送/巡检机器人暂不混入首期闭环。" },
  { label: "顾客动线", value: "不进货架区", detail: "顾客在入口下单和取货，机器人在货架通道内工作，减少混行风险。" },
  { label: "验收目标", value: "可演示可复测", detail: "重点验收限定 SKU 的抓取成功率、错拿率、单单时长和人工介入率。" }
];

const retailShelfPlans: RetailShelfPlan[] = [
  { item: "货架数量", spec: "4 组标准货架 + 1 组演示/补货架", detail: "30 m² 用 4 组；40 m² 可扩到 6 组。每组建议宽 900-1200 mm、深 350-450 mm。" },
  { item: "层板设置", spec: "每组 3-4 层", detail: "可抓层控制在 0.45-1.45 m；1.45 m 以上只做展示或人工补货，不纳入首期抓取。" },
  { item: "货位数量", spec: "60-90 个货位", detail: "每层 4-6 个货位，每个货位只放 1 个 SKU，前沿线固定，避免机器人在深堆商品中搜索。" },
  { item: "通道宽度", spec: "1.15-1.30 m", detail: "只允许单机器人作业；顾客不进入货架通道。若必须人机混行，通道需扩到 1.5 m 以上。" },
  { item: "视觉标记", spec: "货架码 + 货位码 + SKU 标签", detail: "每组货架有编号，每个货位有二维码/AprilTag/色块标记，用于定位和异常复核。" },
  { item: "补货规则", spec: "前沿 1 件可抓 + 后排库存", detail: "机器人只抓前沿位商品；后排库存由人工每日前移，避免机械臂伸入货架深处。" }
];

const retailSkuPlans: RetailSkuPlan[] = [
  { type: "瓶装饮料", examples: "330-550 ml 水、茶饮、功能饮料", quantity: "10-16 SKU", handling: "夹爪或抱夹；按瓶身中段抓取，称重复核", avoid: "玻璃瓶、外壁严重反光或易滚落陈列" },
  { type: "盒装零食", examples: "饼干盒、巧克力盒、纸盒彩糖", quantity: "8-14 SKU", handling: "夹爪从两侧取出；视觉识别正面包装", avoid: "软塌纸盒、开口包装、尺寸过薄商品" },
  { type: "罐装/杯装商品", examples: "咖啡罐、坚果罐、杯装冲饮", quantity: "6-10 SKU", handling: "夹爪夹取柱面或顶部，货位加防滚挡边", avoid: "堆叠罐、过重金属罐、易变形杯盖" },
  { type: "规则塑料包装", examples: "洗手液、小瓶日化、硬壳小物", quantity: "4-8 SKU", handling: "按轮廓抓取，必要时货位加限位框", avoid: "软袋、挂装、不规则透明包装" },
  { type: "展示但暂缓抓取", examples: "薯片袋、玻璃杯、散装小件、反光袋装", quantity: "只展示", handling: "用于解释二期扩展边界", avoid: "不纳入首期订单，不参与验收指标" }
];

const retailArchitectureItems: RetailArchitectureItem[] = [
  { module: "下单前端", responsibility: "顾客扫码或触屏选择 SKU、数量和取货方式", interface: "写入订单号、SKU 列表、支付状态和取货码" },
  { module: "SKU/货位库", responsibility: "维护 SKU 尺寸、重量、图片、可抓姿态、货架/层/列位置", interface: "给机器人返回货位坐标、抓取策略和复核阈值" },
  { module: "机器人调度", responsibility: "按订单拆分任务，规划货架访问顺序和失败重试策略", interface: "对接移动底盘、机械臂、夹爪和任务日志" },
  { module: "视觉识别", responsibility: "确认货架编号、货位、商品正面和抓取点", interface: "输出目标位姿、置信度和错位/缺货标记" },
  { module: "抓取控制", responsibility: "执行靠近、对准、抓取、退回和放入暂存篮", interface: "记录成功/失败、失败原因和图像快照" },
  { module: "暂存复核", responsibility: "通过称重、RFID 或二次视觉确认商品是否正确", interface: "把复核结果回写订单；失败时锁定取货并提示人工" },
  { module: "支付/POS", responsibility: "完成支付确认、退款、取消和交易记录", interface: "订单状态必须与暂存复核结果一致后才允许取货" },
  { module: "运维后台", responsibility: "人工接管、补货、异常处理、日志导出和 KPI 看板", interface: "给采购验收提供可追溯数据" }
];

const retailProcessSteps: RetailProcessStep[] = [
  { step: "1", owner: "顾客", action: "在入口屏或手机端选择 1-3 件商品", output: "生成订单和取货码" },
  { step: "2", owner: "系统", action: "校验库存、货位、机器人电量和通道状态", output: "可执行任务或缺货提示" },
  { step: "3", owner: "机器人", action: "移动到第一组货架，读取货架码和货位码", output: "确认目标货位" },
  { step: "4", owner: "视觉/机械臂", action: "识别目标商品并执行抓取，失败最多重试 2 次", output: "商品进入暂存篮或转人工" },
  { step: "5", owner: "复核模块", action: "称重/RFID/视觉复核暂存篮内容", output: "通过、错拿、缺货或需人工确认" },
  { step: "6", owner: "顾客", action: "扫码支付或确认已支付订单", output: "取货门/取货台放行" },
  { step: "7", owner: "后台", action: "记录任务耗时、抓取结果、异常和人工介入", output: "形成验收数据和补货任务" }
];

const retailExceptionPlans: RetailExceptionPlan[] = [
  { scenario: "抓取失败", systemAction: "同一货位最多重试 2 次，换抓取姿态；仍失败则标记失败原因", manualAction: "工作人员从补货口取出商品或取消该 SKU" },
  { scenario: "商品缺货/错位", systemAction: "视觉置信度不足或货位为空时停止抓取，更新库存疑似异常", manualAction: "人工确认货位并补货，后台修正库存" },
  { scenario: "抓错商品", systemAction: "暂存复核不通过，订单锁定，不允许顾客取货", manualAction: "人工取出错品，重新下发任务或退款" },
  { scenario: "商品掉落", systemAction: "机器人急停当前任务并拍照记录掉落位置", manualAction: "人工清理通道后恢复任务" },
  { scenario: "顾客取消/支付失败", systemAction: "未支付订单不放行取货；已抓商品进入退回或人工回收流程", manualAction: "人工回架并核销订单" },
  { scenario: "通道被挡", systemAction: "机器人等待 30 秒并语音/屏幕提示；超时转人工", manualAction: "现场移除障碍或切换演示任务" },
  { scenario: "机器人低电量", systemAction: "低于阈值不接新单，完成当前任务后返回充电", manualAction: "暂停演示或切换备用人工取货" },
  { scenario: "系统接口失败", systemAction: "订单进入待处理队列，不继续执行抓取", manualAction: "后台重试接口或人工完成订单" }
];

const retailProcurementItems: RetailProcurementItem[] = [
  { category: "主机器人", spec: "轮式移动操作机器人 1 台，含机械臂、夹爪/吸盘、视觉、调度 SDK", phase: "P1 必采", note: "合同写明限定 SKU PoC、接口开放、售后响应和失败日志。" },
  { category: "标准货架", spec: "4-6 组，900-1200 mm 宽，3-4 层，可贴货位码", phase: "P0 必采", note: "优先买可调层板和挡边货架，避免定制成本过高。" },
  { category: "货位标记", spec: "货架码、货位码、SKU 标签、前沿定位线", phase: "P0 必采", note: "这是降低识别和定位难度的关键，不应省略。" },
  { category: "下单终端", spec: "触屏一体机 1 台或扫码 H5 页面", phase: "P1 必采", note: "第一期用扫码/H5 更轻，触屏可作为展示增强。" },
  { category: "暂存复核", spec: "暂存篮 + 电子秤；RFID/二次视觉可选", phase: "P1 必采", note: "先用称重做低成本复核，RFID 用于高价值或多件订单。" },
  { category: "支付接口", spec: "二维码支付、订单状态回调、退款/取消接口", phase: "P1 必采", note: "无需一开始做复杂无人结账，先保证闭环可验收。" },
  { category: "安全与运维", spec: "急停按钮、围挡/地贴、摄像头、充电位、运维后台", phase: "P1 必采", note: "顾客不进货架通道，降低安全和保险风险。" },
  { category: "库存巡检/配送", spec: "Simbe/Badger/PUDU 等辅助机器人", phase: "二期可选", note: "首期不采购，避免多机器人调度把项目复杂化。" }
];

const retailBudgetRows: RetailBudgetRow[] = [
  { item: "主机器人与 PoC", range: "60-180 万", note: "取决于是否采购成熟移动操作平台、是否包含现场集成和售后。" },
  { item: "货架与场地搭建", range: "3-10 万", note: "包含货架、挡边、地贴、围挡、取货台、照明和基础装修。" },
  { item: "下单/支付/后台软件", range: "8-25 万", note: "H5 下单、订单管理、SKU/货位库、支付回调和后台日志。" },
  { item: "视觉/复核设备", range: "3-15 万", note: "称重最低成本；RFID 和多相机复核会增加成本。" },
  { item: "系统集成与调试", range: "15-50 万", note: "真实工作量集中在 SKU 标定、抓取策略、异常处理和验收日志。" },
  { item: "运维和风险预留", range: "10-20%", note: "用于备件、培训、二次改造和厂商现场支持。" }
];

const retailAcceptanceMetrics: RetailAcceptanceMetric[] = [
  { metric: "SKU 覆盖", target: "首期 30-60 个，至少 80% 可连续演示", method: "按 SKU 清单逐项记录可抓/不可抓原因" },
  { metric: "抓取成功率", target: "限定 SKU >=85%，核心 SKU >=90%", method: "每个核心 SKU 至少 20 次测试，记录失败原因" },
  { metric: "错拿率", target: "<=2%", method: "暂存复核和人工抽检双重记录" },
  { metric: "单单完成时间", target: "1 件订单 2-4 分钟；3 件订单 5-8 分钟", method: "从下单到取货放行全链路计时" },
  { metric: "人工介入率", target: "<=15%", method: "后台记录每次介入类型：抓取、库存、支付、通道、安全" },
  { metric: "连续运行", target: "每日演示 2 小时无致命故障", method: "连续订单压测和异常恢复记录" },
  { metric: "支付闭环", target: "订单、支付、复核、取货状态 100% 对账", method: "导出订单日志和支付回调日志核对" }
];

const retailZones: RetailZone[] = [
  {
    zone: "入口/取单区",
    area: "4-6 m²",
    setup: "二维码/触屏下单、取货码、顾客等待线和异常服务台",
    notes: "顾客只在入口和取货台交互，不进入机器人货架通道。"
  },
  {
    zone: "商品货架区",
    area: "14-18 m²",
    setup: "4-6 组标准货架，3-4 层，60-90 个货位，首期 30-60 个 SKU",
    notes: "可抓高度 0.45-1.45 m；每个货位只放 1 个 SKU，前沿位置固定。"
  },
  {
    zone: "机器人作业通道",
    area: "1.15-1.30 m 净宽",
    setup: "单机器人作业通道、货架定位标记、禁入地贴和急停覆盖",
    notes: "首期不做人机混行；如果顾客进入通道，宽度和安全成本都会明显上升。"
  },
  {
    zone: "暂存/结账区",
    area: "4-6 m²",
    setup: "暂存篮、电子秤/RFID/二次视觉复核、扫码支付和取货台",
    notes: "第一期先用扫码支付 + 复核放行；无人结账作为二期。"
  },
  {
    zone: "补货/维护区",
    area: "4-6 m²",
    setup: "充电位、人工补货台、备品备件、小型运维工位",
    notes: "所有失败抓取、缺货、支付异常都从这里人工接管。"
  }
];

const retailRoadmap: RetailRoadmap[] = [
  {
    phase: "P0 场景定义",
    duration: "1 周",
    work: "确定 30-40 m² 平面、4-6 组货架、30-60 个 SKU、顾客不进货架区的安全边界；向 2-3 家主线厂商发 PoC 问询。",
    gate: "形成 SKU/货架/货位/接口规格书，明确哪些商品首期不抓。"
  },
  {
    phase: "P1 最小闭环",
    duration: "2-4 周",
    work: "先搭 2 组货架、10-15 个核心 SKU，跑通下单、导航、识别、抓取、暂存复核和支付确认。",
    gate: "核心 SKU 抓取成功率 >=90%，错拿率 <=2%，每个异常都有人工接管路径。"
  },
  {
    phase: "P2 完整样板间",
    duration: "5-8 周",
    work: "扩到 4-6 组货架和 30-60 个 SKU，接入 SKU/货位库、库存、支付和日志看板。",
    gate: "完成 100 单试运行，统计单单时长、抓取失败、错拿、缺货和人工介入。"
  },
  {
    phase: "P3 采购固化",
    duration: "9-12 周",
    work: "根据样板间数据确定主机器人、复核硬件、软件接口、售后 SLA 和二期扩展预算。",
    gate: "签订正式报价、交期、培训、备件、远程运维、接口开放和安全责任边界。"
  }
];

const retailDecisionRows = [
  ["买什么机器人", "首期只买 1 台轮式移动操作主机做货架取货 PoC；库存巡检、配送、人形展示和后场履约系统都不进入首期主采购。"],
  ["场地怎么搭", "按 30-40 m² 半结构化样板间搭建，4-6 组货架、1.15-1.30 m 机器人通道，顾客不进入货架区。"],
  ["方案如何落地", "先用 30-60 个规则包装 SKU 跑通下单、抓取、暂存复核、扫码支付和人工接管，再根据数据决定扩容。"]
];
const retailSourceById = new Map(retailSources.map((source) => [source.id, source]));

function rankedShortlist(tag: string, limit = 5) {
  return robots
    .filter((robot) => robot.shortlistTags.includes(tag))
    .sort((a, b) => (tag === "落地项目" ? b.scores.deployment - a.scores.deployment : b.scores.overall - a.scores.overall))
    .slice(0, limit);
}

function confidenceLabel(confidence: ReleaseConfidence) {
  if (confidence === "unknown") return "官网未披露";
  return confidence === "high" ? "高" : confidence === "medium" ? "中" : "低";
}

function confidenceText(confidence: ReleaseConfidence) {
  if (confidence === "unknown") return "官网未披露";
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
  return robot.price.type.includes("正式报价") ? "正式报价" : "供货确认";
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

function releaseSortValue(robot: Robot) {
  if (robot.releaseDateConfidence === "unknown" || robot.releaseDate === "官网未披露") return null;
  const match = robot.releaseDate?.match(/(\d{4})(?:-(\d{1,2}))?/);
  if (!match) return null;
  return Number(match[1]) * 100 + Number(match[2] || "1");
}

function matchesReleaseFilter(robot: Robot, filter: ReleaseFilter) {
  if (filter === "全部") return true;
  const year = releaseYear(robot);
  if (filter === "官网未披露") return robot.releaseDate === "官网未披露" || robot.releaseDateConfidence === "unknown" || year === null;
  if (year === null) return false;
  if (filter === "近1年") return year >= 2025;
  if (filter === "近3年") return year >= 2023;
  return year >= 2020;
}

function matchesPriceBand(robot: Robot, band: PriceBand) {
  const amount = robot.price.amount;
  if (band === "全部") return true;
  if (band === "正式报价") return amount === null;
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

function paperSourceCount(robot: Robot) {
  return robot.sourceIds
    .map((id) => sourceById.get(id))
    .filter((source): source is Source => Boolean(source))
    .filter((source) => /论文|学术|paper|arxiv|ICRA|IROS|IEEE|项目/i.test(`${source.type} ${source.title} ${source.notes}`))
    .length;
}

function academicScore(robot: Robot) {
  return robot.academicMetrics?.academicScore || null;
}

function academicLabel(robot: Robot) {
  const metrics = robot.academicMetrics;
  if (!metrics || metrics.paperCount === 0) return "未匹配";
  return `${metrics.academicScore}/100 · ${metrics.paperCount} 篇 · 引用 ${metrics.citationCount} · 近三年 ${metrics.recentPaperCount}`;
}

function openSourceCount(robot: Robot) {
  return robot.sourceIds
    .map((id) => sourceById.get(id))
    .filter((source): source is Source => Boolean(source))
    .filter((source) => /GitHub|ROS|ROS2|SDK|开源|代码|仿真/i.test(`${source.type} ${source.title} ${source.notes} ${source.url}`))
    .length;
}

function openSourceScore(robot: Robot) {
  return robot.openSourceMetrics?.openSourceScore || null;
}

function openSourceLabel(robot: Robot) {
  const metrics = robot.openSourceMetrics;
  if (!metrics || metrics.repoCount === 0) return "未匹配";
  return `${metrics.openSourceScore}/100 · ${metrics.repoCount} 库 · ${metrics.stars} stars · ${metrics.forks} forks`;
}

function metricConfidenceLabel(confidence: Confidence | "unknown" | undefined) {
  if (confidence === "high") return "高置信";
  if (confidence === "medium") return "中置信";
  if (confidence === "low") return "低置信";
  return "未匹配";
}

function valueScore(robot: Robot) {
  if (robot.price.amount === null || robot.price.amount <= 0) return null;
  return robot.scores.overall / (robot.price.amount / 10000);
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

function cleanProcurementText(value: string) {
  return value;
}

function procurementAction(robot: Robot) {
  if (robot.price.amount !== null) return robot.price.confidence === "high" ? "复核配置、税费、运费和教育折扣" : "复核价格来源并索取正式报价";
  if (robot.price.type === "供货状态待确认") return "先确认是否仍可供货，再索取配置报价";
  return "索取教育/科研正式报价、交付周期、维保和培训条款";
}

function exportRobots(items: Robot[]) {
  const rows = [
    ["型号", "类别", "厂商", "品牌", "品牌所在地", "国产/进口", "市场层级", "核验状态", "核验备注", "发布时间", "发布时间置信度", "标签", "人民币价格", "价格口径", "采购动作", "价格置信度", "负载/能力", "科研评分", "落地评分", "来源ID", "官网"],
    ...items.map((robot) => [
      robot.name,
      robot.category,
      robot.vendor,
      brandLabel(robot),
      brandPlace(robot),
      robot.domesticPriority ? "国产" : "进口",
      robot.marketTier,
      robot.verificationStatus || "未标注",
      cleanProcurementText(robot.verificationNotes || ""),
      robot.releaseDate,
      confidenceLabel(robot.releaseDateConfidence),
      robot.tags.join(";"),
      formatPrice(robot),
      robot.price.type,
      procurementAction(robot),
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

function exportQuoteList() {
  const rows = [
    ["ID", "型号", "品牌", "所在地", "类别", "价格状态", "官网", "采购动作", "核验备注"],
    ...robots.filter((robot) => robot.price.amount === null).map((robot) => [
      robot.id,
      robot.name,
      brandLabel(robot),
      brandPlace(robot),
      robot.category,
      robot.price.type,
      robot.officialUrl,
      procurementAction(robot),
      cleanProcurementText(robot.verificationNotes || "")
    ])
  ];
  downloadText(`正式报价清单-${meta.accessedDate}.csv`, rows.map((row) => row.map(csvEscape).join(",")).join("\n"));
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
  const [activeTab, setActiveTabState] = useState<Tab>(getInitialTab);
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

  useEffect(() => {
    function syncTabFromHash() {
      setActiveTabState(getInitialTab());
    }
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  function setActiveTab(tab: Tab) {
    setActiveTabState(tab);
    if (tab === "retail") {
      if (window.location.hash !== retailRoute) window.history.pushState(null, "", retailRoute);
      return;
    }
    if (window.location.hash === retailRoute) {
      window.history.pushState(null, "", window.location.pathname + window.location.search);
    }
  }

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
  const knownReleaseCount = robots.filter((robot) => robot.releaseDateConfidence !== "unknown" && robot.releaseDate !== "官网未披露").length;
  const undisclosedReleaseCount = robots.filter((robot) => robot.releaseDateConfidence === "unknown" || robot.releaseDate === "官网未披露").length;
  const isRetailPage = activeTab === "retail";

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
      <div className={isRetailPage ? "retail-page-layout" : "layout-grid"}>
        {!isRetailPage && (
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
        )}
        <main className={isRetailPage ? "dashboard-main retail-page-main" : "dashboard-main"}>
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
                <MetricCard label="发布时间" value={String(knownReleaseCount)} detail={`已标注；${undisclosedReleaseCount} 个官网未披露`} />
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
                    <button onClick={exportQuoteList}><Download size={15} /> 报价清单</button>
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

          {activeTab === "rankings" && (
            <RankingCenter robots={filteredRobots} selectedIds={selectedIds} onToggle={toggleSelected} onOpenDetail={setDetailRobotId} />
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

          {activeTab === "retail" && <RetailScenarioPage setActiveTab={setActiveTab} />}

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
        {!isRetailPage && (
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
        )}
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
        <button className={activeTab === "rankings" ? "active" : ""} onClick={() => setActiveTab("rankings")}>排行榜</button>
        <button className={activeTab === "compare" ? "active" : ""} onClick={() => setActiveTab("compare")}>对比分析</button>
        <button className={activeTab === "report" ? "active" : ""} onClick={() => setActiveTab("report")}>报告中心</button>
        <button className={activeTab === "retail" ? "active" : ""} onClick={() => setActiveTab("retail")}>智能零售</button>
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

type RankingConfig = {
  id: string;
  title: string;
  subtitle: string;
  empty: string;
  getValue: (robot: Robot) => number | null;
  formatValue: (value: number, robot: Robot) => string;
  confidence?: (robot: Robot) => Confidence | "unknown" | undefined;
  sourceNote?: (robot: Robot) => string;
};

function RankingCenter({
  robots,
  selectedIds,
  onToggle,
  onOpenDetail
}: {
  robots: Robot[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onOpenDetail: (id: string) => void;
}) {
  const rankingConfigs: RankingConfig[] = [
    {
      id: "paper",
      title: "论文/学术使用热度",
      subtitle: "按外部论文检索的论文数、引用数和近三年论文数综合排序",
      empty: "当前筛选下没有可靠学术指标匹配，请放宽类别/品牌或后续补充论文检索。",
      getValue: academicScore,
      formatValue: (_value, robot) => academicLabel(robot),
      confidence: (robot) => robot.academicMetrics?.academicConfidence,
      sourceNote: (robot) => robot.academicMetrics?.academicMetricSource || "未匹配"
    },
    {
      id: "open",
      title: "GitHub/开源生态",
      subtitle: "按明确 GitHub 仓库的 stars、forks、最近更新和官方/社区属性综合排序",
      empty: "当前筛选下没有可靠开源指标匹配，请放宽筛选或补充官方/ROS 仓库。",
      getValue: openSourceScore,
      formatValue: (_value, robot) => openSourceLabel(robot),
      confidence: (robot) => robot.openSourceMetrics?.openSourceConfidence,
      sourceNote: (robot) => robot.openSourceMetrics?.openSourceMetricSource || "未匹配"
    },
    {
      id: "overall",
      title: "综合推荐",
      subtitle: "按综合评分排序，兼顾科研和落地适配",
      empty: "当前筛选下没有候选可排行。",
      getValue: (robot) => robot.scores.overall,
      formatValue: (value) => `${value}/100`
    },
    {
      id: "research",
      title: "科研适配",
      subtitle: "按科研评分排序，优先展示适合实验室和课程研发的型号",
      empty: "当前筛选下没有候选可排行。",
      getValue: (robot) => robot.scores.research * 2,
      formatValue: (value) => `${value}/100`
    },
    {
      id: "deployment",
      title: "落地适配",
      subtitle: "按落地评分排序，优先展示部署、维护和场景适配更稳的型号",
      empty: "当前筛选下没有候选可排行。",
      getValue: (robot) => robot.scores.deployment * 2,
      formatValue: (value) => `${value}/100`
    },
    {
      id: "value",
      title: "性价比",
      subtitle: "仅统计已收录公开价或估算价的型号，按每万元综合分排序",
      empty: "当前筛选下没有可计算价格的型号，请切换价格筛选或放宽品牌/类别。",
      getValue: valueScore,
      formatValue: (value) => `${value.toFixed(1)} 每万元综合分`
    },
    {
      id: "new",
      title: "近年发布新品",
      subtitle: "按已核验发布时间从新到旧排序，排除官网未披露",
      empty: "当前筛选下没有明确发布时间的型号，请选择全部或放宽类别/品牌。",
      getValue: releaseSortValue,
      formatValue: (_value, robot) => robot.releaseDate
    }
  ];

  const academicMatched = robots.filter((robot) => (robot.academicMetrics?.paperCount || 0) > 0).length;
  const openSourceMatched = robots.filter((robot) => (robot.openSourceMetrics?.repoCount || 0) > 0).length;
  const valueReadyCount = robots.filter((robot) => valueScore(robot) !== null).length;
  const coverageText = [...new Set(robots.map((robot) => robot.coverageTier).filter(Boolean))].slice(0, 3).join(" / ") || "未标注";
  const sourceVerificationText = meta.sourceVerificationSummary
    ? `来源可访问抽查 ${meta.sourceVerificationSummary.checked} 条，成功 ${meta.sourceVerificationSummary.ok} 条，需复核 ${meta.sourceVerificationSummary.review} 条`
    : "来源可访问抽查尚未记录";

  function rankingItems(config: RankingConfig) {
    return robots
      .map((robot) => ({ robot, value: config.getValue(robot) }))
      .filter((item): item is { robot: Robot; value: number } => item.value !== null && item.value > 0)
      .sort((a, b) => b.value - a.value || b.robot.scores.overall - a.robot.scores.overall || b.robot.sourceIds.length - a.robot.sourceIds.length)
      .slice(0, 10);
  }

  return (
    <section className="ranking-panel">
      <div className="panel-head">
        <div>
          <h2>排行榜</h2>
          <span>外部热度指标优先；库内来源数量仅作为证据覆盖说明</span>
        </div>
      </div>
      <div className="ranking-summary">
        <MetricCard label="当前筛选候选" value={String(robots.length)} detail={`全库 ${data.robots.length} 个`} />
        <MetricCard label="学术指标匹配" value={String(academicMatched)} detail="OpenAlex/Semantic Scholar 口径" />
        <MetricCard label="开源指标匹配" value={String(openSourceMatched)} detail="GitHub 仓库 API 口径" />
        <MetricCard label="可算性价比" value={String(valueReadyCount)} detail="有公开价或估算价" />
      </div>
      <div className="ranking-note">
        <strong>数据口径说明</strong>
        <p>当前筛选覆盖层级：{coverageText}。论文/开源榜只使用可复核外部指标；未匹配候选不填假数，低置信结果显示“需复核”。{sourceVerificationText}。</p>
      </div>
      {robots.length === 0 ? (
        <EmptyState title="当前筛选下没有候选" body="请减少品牌、价格、发布时间、标签或来源筛选条件后再查看排行榜。" />
      ) : (
        <div className="ranking-grid">
          {rankingConfigs.map((config) => (
            <RankingCard
              key={config.id}
              config={config}
              items={rankingItems(config)}
              selectedIds={selectedIds}
              onToggle={onToggle}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function RankingCard({
  config,
  items,
  selectedIds,
  onToggle,
  onOpenDetail
}: {
  config: RankingConfig;
  items: Array<{ robot: Robot; value: number }>;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onOpenDetail: (id: string) => void;
}) {
  return (
    <article className="ranking-card">
      <div className="ranking-card-head">
        <div>
          <h3>{config.title}</h3>
          <p>{config.subtitle}</p>
        </div>
        <span>Top {Math.min(items.length, 10)}</span>
      </div>
      {items.length === 0 ? (
        <EmptyState title="暂无排行结果" body={config.empty} />
      ) : (
        <ol className="ranking-list">
          {items.map(({ robot, value }, index) => {
            const selected = selectedIds.includes(robot.id);
            return (
              <li key={robot.id}>
                <span className="rank-number">{index + 1}</span>
                <CategoryThumb category={robot.category} compact />
                <div className="ranking-main">
                  <strong>{robot.name}</strong>
                  <p>{brandLabel(robot)} · {brandPlace(robot)} · {robot.category}</p>
                  <div>
                    <em>{config.formatValue(value, robot)}</em>
                    <em>{robot.marketTier}</em>
                    {robot.coverageTier && <em>{robot.coverageTier}</em>}
                    <em>{robot.price.type}</em>
                    {config.confidence && <em className={config.confidence(robot) === "high" ? "metric-ok" : "metric-review"}>{metricConfidenceLabel(config.confidence(robot))}{config.confidence(robot) !== "high" ? " · 需复核" : ""}</em>}
                  </div>
                  {config.sourceNote && <small>{config.sourceNote(robot)}</small>}
                </div>
                <div className="ranking-actions">
                  <button onClick={() => onOpenDetail(robot.id)}><Info size={13} />详情</button>
                  <button className={selected ? "selected" : ""} onClick={() => onToggle(robot.id)}>{selected ? "已选" : "加入对比"}</button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </article>
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
          <span>基于 {meta.version} 候选库动态汇总短名单、价格状态和采购动作</span>
        </div>
        <button className="panel-button" onClick={() => downloadText(`学校机器人采购调研摘要-${meta.version}.md`, buildMarkdownReport(), "text/markdown;charset=utf-8")}><Download size={15} />导出摘要</button>
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
          <h3>报价动作</h3>
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
                  <small>{cleanProcurementText(robot.researchEvidence[0] || "")}</small>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </section>
  );
}

function RetailScenarioPage({ setActiveTab }: { setActiveTab: (tab: Tab) => void }) {
  const optionGroups = retailOptionGroups.map((group) => ({
    ...group,
    items: retailOptions.filter((option) => group.tiers.includes(option.tier))
  })).filter((group) => group.items.length > 0);

  return (
    <section className="retail-panel">
      <aside className="retail-toc" aria-label="智能零售方案目录">
        <strong>落地目录</strong>
        <nav>
          {retailNavItems.map((item) => (
            <a href={`#${item.id}`} key={item.id}>
              <span>{item.kicker}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="retail-content">
        <div className="retail-hero" id="retail-scope">
          <div className="retail-hero-copy">
            <span className="retail-eyebrow">30-40 m² 单机器人样板间</span>
            <h1>智能零售机器人落地方案</h1>
            <p>首期不是做完整无人便利店，而是做一个可采购、可演示、可验收的半结构化样板间：顾客在入口下单，机器人在封闭货架通道内取货，暂存复核后完成支付和取货。</p>
            <div className="retail-hero-actions">
              <button className="panel-button" onClick={() => downloadText("智能零售机器人落地方案.md", buildRetailMarkdown(), "text/markdown;charset=utf-8")}><Download size={15} />导出方案</button>
              <button className="panel-button" onClick={() => setActiveTab("sources")}><Database size={15} />通用候选库</button>
            </div>
          </div>
          <div className="retail-flow" aria-label="智能零售任务链路">
            {[
              [ShoppingCart, "下单", "扫码/触屏选择 1-3 件商品"],
              [Store, "取货", "机器人按货位抓取前沿商品"],
              [PackageCheck, "复核", "称重/RFID/视觉确认暂存篮"],
              [CreditCard, "放行", "支付成功后顾客取货"]
            ].map(([Icon, title, body]) => (
              <div className="retail-flow-step" key={String(title)}>
                {React.createElement(Icon as typeof ShoppingCart, { size: 20 })}
                <strong>{title as string}</strong>
                <span>{body as string}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="retail-spec-grid">
          {retailCoreSpecs.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>

        <section className="retail-section">
          <div className="panel-head">
            <div>
              <h2>三项落地判断</h2>
              <span>把场景先收窄到能在 30-40 m² 内稳定复测的范围</span>
            </div>
          </div>
          <div className="retail-decision-grid">
            {retailDecisionRows.map(([title, body]) => (
              <article key={title}>
                <strong>{title}</strong>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="retail-section" id="retail-layout">
          <div className="panel-head">
            <div>
              <h2>场地布局</h2>
              <span>30 m² 做最小闭环，40 m² 做完整展示；顾客不进入机器人货架通道</span>
            </div>
          </div>
          <div className="retail-layout-grid">
            <div className="retail-plan-diagram compact-plan" aria-label="30-40 平米智能零售样板间布局示意">
              <div className="zone zone-entry">入口/下单<br />4-6 m²</div>
              <div className="zone zone-shelves-a">货架 A-B<br />规则包装</div>
              <div className="zone zone-aisle">机器人通道<br />1.15-1.30 m</div>
              <div className="zone zone-shelves-b">货架 C-F<br />30-60 SKU</div>
              <div className="zone zone-checkout">暂存/支付/取货<br />4-6 m²</div>
              <div className="zone zone-service">补货/维护/充电<br />4-6 m²</div>
            </div>
            <div className="retail-zone-list">
              {retailZones.map((zone) => (
                <article key={zone.zone}>
                  <div>
                    <strong>{zone.zone}</strong>
                    <span>{zone.area}</span>
                  </div>
                  <p>{zone.setup}</p>
                  <small>{zone.notes}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="retail-section" id="retail-shelves">
          <div className="panel-head">
            <div>
              <h2>货架与 SKU 规划</h2>
              <span>首期不是 SKU 越多越好，而是每个 SKU 都能定义抓取、复核和异常策略</span>
            </div>
          </div>
          <div className="retail-detail-grid">
            {retailShelfPlans.map((item) => (
              <article key={item.item}>
                <strong>{item.item}</strong>
                <b>{item.spec}</b>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="table-scroll">
            <table className="source-table retail-plan-table">
              <thead>
                <tr>
                  <th>SKU 类别</th>
                  <th>示例</th>
                  <th>数量</th>
                  <th>抓取/复核</th>
                  <th>首期暂缓</th>
                </tr>
              </thead>
              <tbody>
                {retailSkuPlans.map((item) => (
                  <tr key={item.type}>
                    <td>{item.type}</td>
                    <td>{item.examples}</td>
                    <td>{item.quantity}</td>
                    <td>{item.handling}</td>
                    <td>{item.avoid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="retail-section" id="retail-architecture">
          <div className="panel-head">
            <div>
              <h2>系统架构</h2>
              <span>下单、货位、机器人、复核、支付和人工接管必须形成同一条数据链</span>
            </div>
          </div>
          <div className="retail-architecture">
            {retailArchitectureItems.map((item) => (
              <article key={item.module}>
                <strong>{item.module}</strong>
                <p>{item.responsibility}</p>
                <small>{item.interface}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="retail-section" id="retail-flow">
          <div className="panel-head">
            <div>
              <h2>业务流程</h2>
              <span>每一步都要有输入、执行者和可记录输出，方便采购验收</span>
            </div>
          </div>
          <div className="retail-process">
            {retailProcessSteps.map((item) => (
              <article key={item.step}>
                <span>{item.step}</span>
                <div>
                  <strong>{item.owner}</strong>
                  <p>{item.action}</p>
                  <small>{item.output}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="retail-section" id="retail-exceptions">
          <div className="panel-head">
            <div>
              <h2>异常处理</h2>
              <span>样板间能不能落地，关键看失败时能否稳定兜底</span>
            </div>
          </div>
          <div className="retail-exception-grid">
            {retailExceptionPlans.map((item) => (
              <article key={item.scenario}>
                <strong>{item.scenario}</strong>
                <p>{item.systemAction}</p>
                <small>{item.manualAction}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="retail-section" id="retail-procurement">
          <div className="panel-head">
            <div>
              <h2>采购清单</h2>
              <span>首期只买支撑闭环的设备，巡检/配送/展示类机器人放到二期</span>
            </div>
          </div>
          <div className="table-scroll">
            <table className="source-table retail-plan-table">
              <thead>
                <tr>
                  <th>采购项</th>
                  <th>规格</th>
                  <th>阶段</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                {retailProcurementItems.map((item) => (
                  <tr key={item.category}>
                    <td>{item.category}</td>
                    <td>{item.spec}</td>
                    <td>{item.phase}</td>
                    <td>{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="retail-section" id="retail-budget">
          <div className="panel-head">
            <div>
              <h2>预算框架</h2>
              <span>先按样板间预算拆项，正式采购前再向厂商拿精确报价</span>
            </div>
          </div>
          <div className="retail-budget-grid">
            {retailBudgetRows.map((item) => (
              <article key={item.item}>
                <span>{item.item}</span>
                <strong>{item.range}</strong>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="retail-section" id="retail-acceptance">
          <div className="panel-head">
            <div>
              <h2>实施路径与验收</h2>
              <span>每个阶段都要留下可复测数据，而不是只看一次演示效果</span>
            </div>
          </div>
          <div className="retail-roadmap">
            {retailRoadmap.map((item, index) => (
              <article key={item.phase}>
                <span>{index + 1}</span>
                <div>
                  <strong>{item.phase}</strong>
                  <time>{item.duration}</time>
                  <p>{item.work}</p>
                  <small>{item.gate}</small>
                </div>
              </article>
            ))}
          </div>
          <div className="table-scroll">
            <table className="source-table retail-plan-table">
              <thead>
                <tr>
                  <th>指标</th>
                  <th>目标</th>
                  <th>验证方法</th>
                </tr>
              </thead>
              <tbody>
                {retailAcceptanceMetrics.map((item) => (
                  <tr key={item.metric}>
                    <td>{item.metric}</td>
                    <td>{item.target}</td>
                    <td>{item.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="retail-section" id="retail-robots">
          <div className="panel-head">
            <div>
              <h2>机器人采购路线</h2>
              <span>按前台抓取、巡检配送、后场履约、固定拣选和展示科研分层，不把配送或盘点机器人误当作抓取主机</span>
            </div>
          </div>
          <div className="retail-coverage-grid">
            {retailCoverageRows.map((row) => (
              <article key={row.scope}>
                <strong>{row.scope}</strong>
                <p>{row.covered}</p>
                <small>{row.conclusion}</small>
                <em>{row.action}</em>
              </article>
            ))}
          </div>
          <div className="retail-option-groups">
            {optionGroups.map((group, index) => (
              <div className="retail-option-group" key={group.title}>
                <div className="retail-option-group-head">
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.subtitle}</p>
                  </div>
                  <span>{group.items.length} 类候选</span>
                </div>
                <div className={index === 0 ? "retail-option-grid" : "retail-support-grid"}>
                  {group.items.map((option) => <RetailOptionCard key={option.name} option={option} compact={index !== 0} />)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="retail-section" id="retail-sources">
          <div className="panel-head">
            <div>
              <h2>来源与不确定项</h2>
              <span>关键判断来自厂商官网、公开案例、结账技术和安全/无障碍约束；估算项已明确标注</span>
            </div>
          </div>
          <RetailSourceTable />
        </section>
      </div>
    </section>
  );
}

function RetailOptionCard({ option, compact = false }: { option: RetailOption; compact?: boolean }) {
  return (
    <article className={compact ? "retail-option compact" : "retail-option"}>
      <div className="retail-option-head">
        <div>
          <h3>{option.name}</h3>
          <p>{option.form}</p>
        </div>
        <div className="retail-option-badges">
          <span>{option.tier}</span>
          <span>{option.maturity}</span>
        </div>
      </div>
      <strong>{option.role}</strong>
      <p>{option.fit}</p>
      <dl>
        <div><dt>采购动作</dt><dd>{option.procurement}</dd></div>
        <div><dt>价格口径</dt><dd>{option.price}</dd></div>
      </dl>
      <ul>
        {option.limits.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <div className="retail-evidence">
        {option.evidenceIds.map((id) => {
          const source = retailSourceById.get(id);
          return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer">{id}<ExternalLink size={12} /></a> : <span key={id}>{id}</span>;
        })}
      </div>
    </article>
  );
}

function RetailSourceTable() {
  return (
    <div className="table-scroll">
      <table className="source-table retail-source-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>来源</th>
            <th>类型</th>
            <th>置信度</th>
            <th>用途</th>
          </tr>
        </thead>
        <tbody>
          {retailSources.map((source) => (
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
    </div>
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
  const rows = [["ID", "来源", "类型", "置信度", "URL", "备注"], ...items.map((source) => [source.id, source.title, source.type, confidenceLabel(source.confidence), source.url, cleanProcurementText(source.notes)])];
  downloadText(`来源追踪-${meta.accessedDate}.csv`, rows.map((row) => row.map(csvEscape).join(",")).join("\n"));
}

function buildMarkdownReport() {
  const focusCount = robots.filter((robot) => robot.marketTier === "重点候选").length;
  const marketCount = robots.filter((robot) => robot.marketTier === "市场初筛").length;
  const lines = [
    `# 学校机器人采购调研摘要 ${meta.version}`,
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
    "页面主价格统一为人民币；低置信电商线索和外币估算不作为正式报价。无公开价格的型号已经进入正式报价清单或供货确认清单。"
  ];
  return lines.join("\n");
}

function buildRetailMarkdown() {
  const lines = [
    "# 智能零售机器人落地方案",
    "",
    "## 方案边界",
    "首期建设 30-40 m² 单机器人样板间，顾客不进入货架作业区。目标是可采购、可演示、可复测，不追求完整无人便利店。",
    ...retailCoreSpecs.map((item) => `- ${item.label}：${item.value}。${item.detail}`),
    "",
    "## 核心判断",
    ...retailDecisionRows.map(([title, body]) => `- ${title}：${body}`),
    "",
    "## 场地布局",
    ...retailZones.map((zone) => `- ${zone.zone}（${zone.area}）：${zone.setup}。${zone.notes}`),
    "",
    "## 货架规划",
    ...retailShelfPlans.map((item) => `- ${item.item}：${item.spec}。${item.detail}`),
    "",
    "## SKU 规划",
    ...retailSkuPlans.map((item) => `- ${item.type}：${item.examples}；数量 ${item.quantity}；抓取/复核：${item.handling}；暂缓：${item.avoid}`),
    "",
    "## 系统架构",
    ...retailArchitectureItems.map((item) => `- ${item.module}：${item.responsibility}。接口：${item.interface}`),
    "",
    "## 业务流程",
    ...retailProcessSteps.map((item) => `- ${item.step}. ${item.owner}：${item.action}。输出：${item.output}`),
    "",
    "## 异常处理",
    ...retailExceptionPlans.map((item) => `- ${item.scenario}：系统处理：${item.systemAction}；人工兜底：${item.manualAction}`),
    "",
    "## 采购清单",
    ...retailProcurementItems.map((item) => `- ${item.category}：${item.spec}；阶段：${item.phase}；备注：${item.note}`),
    "",
    "## 预算框架",
    ...retailBudgetRows.map((item) => `- ${item.item}：${item.range}。${item.note}`),
    "",
    "## 实施路径",
    ...retailRoadmap.map((item) => `- ${item.phase}（${item.duration}）：${item.work} 验收：${item.gate}`),
    "",
    "## 验收指标",
    ...retailAcceptanceMetrics.map((item) => `- ${item.metric}：目标 ${item.target}；验证方法：${item.method}`),
    "",
    "## 机器人采购路线",
    ...retailCoverageRows.map((row) => `- ${row.scope}：已覆盖 ${row.covered}。结论：${row.conclusion} 动作：${row.action}`),
    ...retailOptions.flatMap((option) => [
      "",
      `### ${option.name}`,
      `- 层级：${option.tier}`,
      `- 形态：${option.form}`,
      `- 角色：${option.role}`,
      `- 成熟度：${option.maturity}`,
      `- 采购动作：${option.procurement}`,
      `- 价格口径：${option.price}`,
      `- 适配理由：${option.fit}`,
      `- 限制：${option.limits.join("；")}`,
      `- 来源：${option.evidenceIds.join("、")}`
    ]),
    "",
    "## 来源",
    ...retailSources.map((source) => `- ${source.id} ${source.title}：${source.url}`)
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
          <DetailItem label="采购动作" value={procurementAction(robot)} />
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
          {robot.verificationNotes && <p>{cleanProcurementText(robot.verificationNotes)}</p>}
          <p>{cleanProcurementText(robot.researchEvidence[0] || "")}</p>
          <p>{cleanProcurementText(robot.deploymentEvidence[0] || "")}</p>
          <ul>
            {robot.risks.map((risk) => <li key={risk}>{cleanProcurementText(risk)}</li>)}
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

const rootElement = document.getElementById("root")!;
const root = window.__robotResearchRoot ?? createRoot(rootElement);
window.__robotResearchRoot = root;
root.render(<App />);
