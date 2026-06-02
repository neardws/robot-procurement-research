import fs from "node:fs";

const DATA_PATHS = ["app/src/robotResearchData.json", "work/data/robot_research_data.json"];
const CHECK_LIMIT = 80;
const CONCURRENCY = 8;
const TIMEOUT_MS = 4000;

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "robot-procurement-research/1.0" }
    });
    clearTimeout(timer);
    return { status: response.status, ok: response.status >= 200 && response.status < 400 };
  } catch (error) {
    clearTimeout(timer);
    return { status: null, ok: false, error: error.name || "fetch-error" };
  }
}

async function probeMany(sources) {
  const results = [];
  let cursor = 0;
  async function worker() {
    while (cursor < sources.length) {
      const source = sources[cursor++];
      const result = await probe(source.url);
      results.push({ id: source.id, title: source.title, url: source.url, ...result });
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results.sort((a, b) => a.id.localeCompare(b.id));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeReport(data) {
  const categories = data.robots.reduce((acc, robot) => ((acc[robot.category] = (acc[robot.category] || 0) + 1), acc), {});
  const tiers = data.robots.reduce((acc, robot) => ((acc[robot.coverageTier || "未标注"] = (acc[robot.coverageTier || "未标注"] || 0) + 1), acc), {});
  const academicMatched = data.robots.filter((robot) => robot.academicMetrics?.paperCount > 0).length;
  const openMatched = data.robots.filter((robot) => robot.openSourceMetrics?.repoCount > 0).length;
  const summary = data.meta.sourceVerificationSummary || {};
  fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", [
    `# 学校具身智能机器人采购调研（${data.meta.version}）`,
    "",
    `- 数据日期：${data.meta.accessedDate}`,
    `- 候选设备：${data.robots.length} 款`,
    `- 来源记录：${data.sources.length} 条`,
    `- 四大类：${Object.entries(categories).map(([key, value]) => `${key} ${value} 款`).join("；")}`,
    `- 覆盖层级：${Object.entries(tiers).map(([key, value]) => `${key} ${value} 款`).join("；")}`,
    `- 学术指标匹配：${academicMatched} 款；GitHub/开源指标匹配：${openMatched} 款`,
    `- 来源可访问抽查：${summary.checked || 0} 条，成功 ${summary.ok || 0} 条，需复核 ${summary.review || 0} 条`,
    "",
    "## 本次更新",
    "",
    data.meta.updateSummary,
    "",
    "## 排名口径",
    "",
    "- 学术热度使用外部论文检索的论文数、引用数和近三年论文数综合，不再按库内来源数量排序。",
    "- GitHub/开源生态使用明确仓库的 stars、forks、最近更新和官方/社区属性综合，不再按库内 GitHub 来源数量排序。",
    "- 未可靠匹配的候选保留 `未匹配` 状态，不填充不可复核热度。",
    "",
    "## 核查说明",
    "",
    "- 已抽查官网/品牌目录、OpenAlex、GitHub 和关键来源 URL 的可访问性。",
    "- 403/405/超时不直接判定为无效来源，但会保留 `sourceVerificationSummary.reviewItems` 供后续人工复核。"
  ].join("\n") + "\n");
}

function writeSources(data) {
  const rows = [["id", "title", "type", "confidence", "url", "notes"], ...data.sources.map((source) => [source.id, source.title, source.type, source.confidence, source.url, source.notes])];
  fs.writeFileSync("outputs/来源追踪-v2.csv", rows.map((row) => row.map(csvEscape).join(",")).join("\n") + "\n");
}

for (const path of DATA_PATHS) {
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  const prioritySources = [
    ...data.sources.filter((source) => /官网|官方|产品目录|GitHub|OpenAlex/i.test(`${source.type} ${source.title} ${source.notes}`)),
    ...data.sources
  ];
  const unique = [];
  const seen = new Set();
  for (const source of prioritySources) {
    if (!source.url || seen.has(source.id)) continue;
    seen.add(source.id);
    unique.push(source);
    if (unique.length >= CHECK_LIMIT) break;
  }
  const results = await probeMany(unique);
  const reviewItems = results.filter((item) => !item.ok).slice(0, 25);
  data.meta.version = "v17";
  data.meta.accessedDate = "2026-06-02";
  data.meta.updateSummary = "完成第二轮来源可访问性抽查，保留 300 款广覆盖候选；对官网/品牌目录、OpenAlex、GitHub 和关键来源进行 URL 级核查，并标记需复核条目。";
  data.meta.sourceVerificationSummary = {
    checked: results.length,
    ok: results.filter((item) => item.ok).length,
    review: results.filter((item) => !item.ok).length,
    checkedAt: "2026-06-02",
    reviewItems
  };
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  writeReport(data);
  writeSources(data);
}

const data = JSON.parse(fs.readFileSync(DATA_PATHS[0], "utf8"));
console.log(JSON.stringify(data.meta.sourceVerificationSummary, null, 2));
