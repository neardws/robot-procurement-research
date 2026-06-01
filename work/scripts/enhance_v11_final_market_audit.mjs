import fs from "node:fs";

const inputPath = "app/src/robotResearchData.json";
const outputPaths = ["work/data/robot_research_data.json", "app/src/robotResearchData.json"];
const accessedDate = "2026-06-01";

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const sources = data.sources;
const sourceIndex = new Map(sources.map((source) => [source.id, source]));
const robotIndex = new Map(data.robots.map((robot) => [robot.id, robot]));

function addSource(id, title, url, type = "官网/资料入口", confidence = "medium", notes = "") {
  if (sourceIndex.has(id)) return id;
  const source = { id, title, url, type, confidence, notes };
  sources.push(source);
  sourceIndex.set(id, source);
  return id;
}

function mergeUnique(left = [], right = []) {
  return Array.from(new Set([...left, ...right].filter(Boolean)));
}

function patch(id, value) {
  const robot = robotIndex.get(id);
  if (!robot) throw new Error(`Robot not found: ${id}`);
  const sourceIds = value.sourceIds || [];
  robot.sourceIds = mergeUnique(robot.sourceIds, sourceIds);
  if (sourceIds.length > 0) robot.price.sourceIds = mergeUnique(robot.price.sourceIds, sourceIds);
  if (value.specs) robot.specs = { ...robot.specs, ...value.specs };
  if (value.software) robot.software = { ...robot.software, ...value.software };
  if (value.tags) robot.tags = mergeUnique(robot.tags, value.tags);
  if (value.researchEvidence) robot.researchEvidence = mergeUnique(robot.researchEvidence, value.researchEvidence);
  if (value.risks) robot.risks = mergeUnique(robot.risks, value.risks);
  for (const key of ["releaseDate", "releaseDateConfidence", "marketTier", "verificationStatus", "verificationNotes", "verifiedAt", "officialUrl"]) {
    if (value[key] !== undefined) robot[key] = value[key];
  }
}

addSource("SRCV11001", "LimX Dynamics 官方历史新闻与产品入口", "https://www.limxdynamics.com/en", "官网/历史新闻/产品入口", "medium", "LimX 官方网站可核验 W1/P1 历史发布和当前产品线；W1/P1 旧款规格页当前未公开，采购需按厂商确认。");
addSource("SRCV11002", "Ghost Robotics 官方当前产品入口", "https://www.ghostrobotics.io/vision-60", "官网/产品入口", "medium", "Ghost 官方当前公开产品以 Vision 60 为主；Spirit/SPUR 旧款或别名规格入口不足，采购应以 Vision 60 或厂商确认为准。");

for (const id of ["limx-w1", "limx-p1"]) {
  patch(id, {
    marketTier: "市场初筛",
    verificationStatus: "官网核验",
    verificationNotes: "LimX 官网和历史资料可确认 W1/P1 属于逐际动力早期足式/轮足产品线；当前官网未公开可采购规格页，采购前需由厂商确认是否仍供货、正式参数和开发接口。",
    verifiedAt: accessedDate,
    sourceIds: ["SRCV11001"],
    specs: {
      payloadKg: "历史型号，当前采购规格需厂商确认",
      reachM: "足式/轮足平台不适用",
      sensors: "历史配置需厂商确认",
      safety: "历史/早期平台，新采购建议优先比较 LimX Oli/TRON1 等当前公开型号"
    },
    software: {
      ros: "历史/开发接口需厂商确认",
      ros2: "历史/开发接口需厂商确认",
      sdk: "开发接口需询价",
      sim: "需厂商确认"
    },
    researchEvidence: ["v11 完成审计：LimX 官网可确认 W1/P1 历史产品线，但当前规格页不完整，因此保留市场初筛并明确历史/供货风险。"],
    risks: ["W1/P1 当前官网规格入口不完整，不能作为近期学校重点采购项；如需采购应要求厂商出具现行规格书和售后承诺。"]
  });
}

patch("ghost-spur", {
  marketTier: "市场初筛",
  verificationStatus: "官网核验",
  verificationNotes: "Ghost 官方当前公开产品以 Vision 60 为主；Spirit/SPUR 作为旧款或历史别名缺少当前官方规格页，采购前应以 Vision 60 当前规格或厂商正式确认为准。",
  verifiedAt: accessedDate,
  sourceIds: ["SRCV11002"],
  specs: {
    payloadKg: "历史型号，当前采购规格需厂商确认",
    reachM: "足式平台不适用",
    sensors: "历史配置需厂商确认",
    safety: "当前采购建议以 Vision 60 公开规格和厂商正式确认替代"
  },
  software: {
    ros: "企业接口需询价",
    ros2: "企业接口需询价",
    sdk: "企业接口需询价",
    sim: "企业仿真接口需询价"
  },
  researchEvidence: ["v11 完成审计：Ghost 官网当前以 Vision 60 为公开规格主体，Spirit/SPUR 保留为历史覆盖项并明确不作为重点采购。"],
  risks: ["Spirit/SPUR 当前官方规格入口不足，建议采购比较以 Vision 60 当前官方规格为主。"]
});

data.meta = {
  ...data.meta,
  version: "v11",
  accessedDate,
  updateSummary: "完成剩余市场初筛审计：LimX W1/P1 和 Ghost Spirit 已从部分核验改为官网核验的历史/供货风险项，剩余市场初筛均有明确保留原因。"
};

const categoryOrder = ["机械臂", "移动/复合机器人", "人形机器人", "机器狗"];
data.robots.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) || a.marketTier.localeCompare(b.marketTier, "zh-CN") || a.verificationStatus.localeCompare(b.verificationStatus, "zh-CN") || a.brandNormalized.localeCompare(b.brandNormalized, "zh-CN") || a.name.localeCompare(b.name, "zh-CN"));

for (const path of outputPaths) fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
const csvRows = [["id", "title", "type", "confidence", "url", "notes"], ...sources.map((source) => [source.id, source.title, source.type, source.confidence, source.url, source.notes])];
fs.writeFileSync("outputs/来源追踪-v2.csv", csvRows.map((row) => row.map(csvEscape).join(",")).join("\n") + "\n");

const counts = Object.fromEntries(categoryOrder.map((category) => [category, data.robots.filter((robot) => robot.category === category).length]));
const tiers = Object.fromEntries(["重点候选", "市场初筛"].map((tier) => [tier, data.robots.filter((robot) => robot.marketTier === tier).length]));
const verification = Object.fromEntries(["官网核验", "部分核验", "待核验"].map((status) => [status, data.robots.filter((robot) => robot.verificationStatus === status).length]));
const missingStats = {
  releaseUnknown: data.robots.filter((robot) => robot.releaseDateConfidence === "unknown").length,
  price: data.robots.filter((robot) => robot.price.amount === null).length,
  payload: data.robots.filter((robot) => String(robot.specs.payloadKg).includes("待核验") || String(robot.specs.payloadKg).includes("官网未披露")).length,
  sdk: data.robots.filter((robot) => String(robot.software.sdk).includes("待核验") || String(robot.software.sdk).includes("未公开")).length
};
fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", `# 学校具身智能机器人采购调研 v11\n\n更新时间：${accessedDate}\n\n## 数据概览\n\n- 候选设备：${data.robots.length} 个\n- 来源记录：${sources.length} 条\n- 市场层级：重点候选 ${tiers["重点候选"]} 个，市场初筛 ${tiers["市场初筛"]} 个\n- 核验状态：官网核验 ${verification["官网核验"]} 个，部分核验 ${verification["部分核验"]} 个，待核验 ${verification["待核验"]} 个\n- 类别分布：${categoryOrder.map((category) => `${category} ${counts[category]} 个`).join("，")}\n- 剩余缺口：发布时间未公开/未知 ${missingStats.releaseUnknown} 个，价格待询价 ${missingStats.price} 个，负载待核验/未披露 ${missingStats.payload} 个，SDK 待核验/未公开 ${missingStats.sdk} 个\n\n## 使用说明\n\nv11 完成剩余市场初筛审计。当前“市场初筛”不再代表未核验，而代表历史/停产平台、当前采购交付不明确、SDK 未公开、规格页不完整，或更适合趋势观察而不是近期学校重点采购的设备。\n`);

console.log(JSON.stringify({ robots: data.robots.length, sources: sources.length, counts, tiers, verification, missingStats }, null, 2));
