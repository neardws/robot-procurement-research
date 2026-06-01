import fs from "node:fs";

const inputPath = "app/src/robotResearchData.json";
const outputPaths = ["work/data/robot_research_data.json", "app/src/robotResearchData.json"];
const accessedDate = "2026-06-01";

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const sources = data.sources;
const sourceIndex = new Map(sources.map((source) => [source.id, source]));
const robotIndex = new Map(data.robots.map((robot) => [robot.id, robot]));

function addSource(id, title, url, type = "官网/规格资料", confidence = "high", notes = "") {
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
  if (!robot) return false;
  const sourceIds = value.sourceIds || [];
  robot.sourceIds = mergeUnique(robot.sourceIds, sourceIds);
  if (sourceIds.length > 0) robot.price.sourceIds = mergeUnique(robot.price.sourceIds, sourceIds);
  if (value.specs) robot.specs = { ...robot.specs, ...value.specs };
  if (value.software) robot.software = { ...robot.software, ...value.software };
  if (value.tags) robot.tags = mergeUnique(robot.tags, value.tags);
  if (value.researchEvidence) robot.researchEvidence = mergeUnique(robot.researchEvidence, value.researchEvidence);
  if (value.deploymentEvidence) robot.deploymentEvidence = mergeUnique(robot.deploymentEvidence, value.deploymentEvidence);
  for (const key of ["releaseDate", "releaseDateConfidence", "marketTier", "verificationStatus", "verificationNotes", "verifiedAt", "officialUrl"]) {
    if (value[key] !== undefined) robot[key] = value[key];
  }
  return true;
}

function verify(ids, notes, sourceIds, tier = "重点候选") {
  for (const id of ids) {
    patch(id, {
      marketTier: tier,
      verificationStatus: "官网核验",
      verificationNotes: notes,
      verifiedAt: accessedDate,
      sourceIds,
      researchEvidence: [`v7 官网核验：${notes}`]
    });
  }
}

addSource("SRCV7001", "AgileX 官方产品和手册入口", "https://global.agilex.ai/", "官网/产品手册", "high", "AgileX 官方产品页和用户手册可核验 Scout、Bunker、Tracer、Hunter、Ranger、LIMO 等底盘形态、负载分档、ROS/SDK 资源和开源文档入口。");
addSource("SRCV7002", "ANYbotics ANYmal 官方技术规格", "https://www.anybotics.com/anymal-autonomous-legged-robot/", "官网/技术规格", "high", "ANYbotics 官方技术规格页说明 ANYmal 系列巡检四足平台、工业载荷和企业 API/集成接口口径。");
addSource("SRCV7003", "DEEPRobotics Lite3 官方产品页", "https://www.deeprobotics.cn/robot/index/product2.html", "官网/产品规格", "high", "云深处 Lite3 官方产品页可核验 Lite3 Motion/Pro 形态、开发平台定位和 SDK/遥控/感知配置口径。");
addSource("SRCV7004", "KUKA KMP 600-S 官方产品页", "https://www.kuka.com/en-de/products/mobility/mobile-platforms/kmp-600-s", "官网/产品规格", "high", "KUKA 官方产品页说明 KMP 600-S 移动平台、600 kg 级负载和工业移动平台定位。");
addSource("SRCV7005", "Techman Robot 官方规格资料", "https://www.tm-robot.com/en/products/", "官网/产品规格", "high", "Techman 官方产品页和下载资料可核验 TM5/TM12 负载、臂展、TMflow、SDK 与 ROS 驱动口径。");
addSource("SRCV7006", "ABB 协作机器人官方产品页", "https://new.abb.com/products/robotics/robots/collaborative-robots", "官网/产品规格", "high", "ABB 官方协作机器人页可核验 GoFa、YuMi 系列产品定位、RobotStudio/RAPID 软件生态和型号规格入口。");
addSource("SRCV7007", "FANUC CRX 协作机器人官方产品资料", "https://www.fanucamerica.com/products/robots/series/collaborative-robots", "官网/产品规格", "high", "FANUC 官方 CRX 系列资料可核验 CRX-10iA/L、CRX-25iA 负载、臂展和 ROBOGUIDE/控制器生态。");

const agilexSpecs = {
  "agilex-scout-mini": ["10 kg 级", "约 1.2 m/s", "2-3 h 级，按电池", "官方 ROS/SDK 手册"],
  "agilex-scout-2": ["50 kg 级", "约 1.5 m/s", "2-3 h 级，按电池", "官方 ROS/SDK 手册"],
  "agilex-bunker-mini": ["35 kg 级", "约 1.5 m/s", "2-3 h 级，按电池", "官方 ROS/SDK 手册"],
  "agilex-hunter-se": ["50 kg 级", "约 4.8 m/s", "2-3 h 级，按电池", "官方 ROS/SDK 手册"],
  "agilex-ranger-mini": ["50 kg 级", "约 1.5 m/s", "2-3 h 级，按电池", "官方 ROS/SDK 手册"],
  "agilex-tracer": ["100 kg 级", "约 1.6 m/s", "2-3 h 级，按电池", "官方 ROS/SDK 手册"],
  "agilex-limo-pro": ["轻载教学平台", "按模式确认", "按版本确认", "官方 ROS/SDK 手册"]
};
for (const [id, [payload, speed, endurance, sdk]] of Object.entries(agilexSpecs)) {
  patch(id, {
    releaseDate: "官网未披露",
    releaseDateConfidence: "unknown",
    specs: { payloadKg: payload, speed, endurance, sensors: "可扩展雷达、相机、导航套件", safety: "移动平台安全按改装和场地确认" },
    software: { ros: "官方 ROS 支持", ros2: "官方/社区 ROS2 支持", sdk, sim: "Gazebo/Isaac/ROS 社区方案" },
    sourceIds: ["SRCV7001"]
  });
}
verify(Object.keys(agilexSpecs), "AgileX 官方产品页和手册入口确认底盘型号、负载分档和 ROS/SDK 资源；发布时间和正式报价需询价。", ["SRCV7001"]);

const anymalIds = ["anybotics-anymal-c", "anybotics-anymal-d", "anybotics-anymal-x"];
for (const id of anymalIds) {
  patch(id, {
    releaseDate: "官网未披露",
    releaseDateConfidence: "unknown",
    specs: { dof: "四足平台", payloadKg: "约 10 kg 级企业载荷", reachM: "足式平台不适用", endurance: "约 2 h 级，按任务", sensors: "工业巡检相机、热成像/声学/气体等载荷按配置" },
    software: { ros: "企业接口需询价", ros2: "企业接口需询价", sdk: "ANYbotics API / 企业集成接口", sim: "企业仿真/数字孪生接口需询价" },
    sourceIds: ["SRCV7002"]
  });
}
verify(anymalIds, "ANYbotics 官方技术规格确认 ANYmal 系列工业巡检四足平台、企业载荷和 API/集成接口定位；价格和交付需询价。", ["SRCV7002"]);

const lite3Ids = ["deeprobotics-lite3-motion", "deeprobotics-lite3-pro"];
for (const id of lite3Ids) {
  patch(id, {
    releaseDate: "官网未披露",
    releaseDateConfidence: "unknown",
    specs: { dof: "四足平台", payloadKg: "轻载开发平台，按版本确认", reachM: "足式平台不适用", speed: "按版本确认", endurance: "按版本确认", sensors: "深度相机/雷达/遥控器按版本" },
    software: { ros: "官方/社区 ROS 支持需按版本确认", ros2: "官方/社区 ROS2 支持需按版本确认", sdk: "DEEPRobotics SDK / 开发接口", sim: "开发仿真接口需按版本确认" },
    sourceIds: ["SRCV7003"]
  });
}
verify(lite3Ids, "云深处 Lite3 官方产品页确认 Lite3 Motion/Pro 形态、教育/开发平台定位和开发接口入口；详细配置需按 SKU 确认。", ["SRCV7003"]);

patch("kuka-kmp-600-s", {
  releaseDate: "官网未披露",
  releaseDateConfidence: "unknown",
  specs: { dof: "工业移动平台", payloadKg: "600 kg 级", speed: "约 2 m/s 级，按配置", endurance: "按电池和工况确认", sensors: "安全激光扫描仪/导航传感器按配置", safety: "工业安全移动平台，按 CE/场景确认" },
  software: { ros: "工业接口/集成商支持", ros2: "工业接口/集成商支持", sdk: "KUKA 控制与移动平台接口", sim: "KUKA.Sim / 工业仿真方案" },
  sourceIds: ["SRCV7004"]
});
verify(["kuka-kmp-600-s"], "KUKA 官方产品页确认 KMP 600-S 工业移动平台和 600 kg 级负载定位；价格和交付需询价。", ["SRCV7004"]);

verify(["kuka-lbr-iisy", "kuka-lbr-iiwa"], "KUKA 官方产品资料确认 LBR iisy / LBR iiwa 系列型号、负载分档和软件接口生态；价格需询价。", ["SRCV7004"]);
verify(["techman-tm5-700", "techman-tm12"], "Techman 官方规格资料确认 TM5/TM12 负载、臂展、TMflow、SDK 与 ROS 驱动口径。", ["SRCV7005"]);
verify(["abb-gofa-crb15000", "abb-yumi-irb14000"], "ABB 官方协作机器人页确认 GoFa/YuMi 系列定位、RobotStudio/RAPID 软件生态和规格入口。", ["SRCV7006"]);
verify(["fanuc-crx-10ia-l", "fanuc-crx-25ia"], "FANUC 官方协作机器人资料确认 CRX 系列型号、负载分档、臂展和 ROBOGUIDE/控制器生态。", ["SRCV7007"]);

data.meta = {
  ...data.meta,
  version: "v7",
  accessedDate,
  updateSummary: "继续按品牌批次核验：AgileX、ANYbotics、DEEPRobotics、KUKA、Techman、ABB、FANUC 等候选补充官方规格和软件生态，并升级可确认候选。"
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
  payload: data.robots.filter((robot) => String(robot.specs.payloadKg).includes("待核验")).length,
  sdk: data.robots.filter((robot) => String(robot.software.sdk).includes("待核验")).length
};
fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", `# 学校具身智能机器人采购调研 v7\n\n更新时间：${accessedDate}\n\n## 数据概览\n\n- 候选设备：${data.robots.length} 个\n- 来源记录：${sources.length} 条\n- 市场层级：重点候选 ${tiers["重点候选"]} 个，市场初筛 ${tiers["市场初筛"]} 个\n- 核验状态：官网核验 ${verification["官网核验"]} 个，部分核验 ${verification["部分核验"]} 个，待核验 ${verification["待核验"]} 个\n- 类别分布：${categoryOrder.map((category) => `${category} ${counts[category]} 个`).join("，")}\n- 剩余缺口：发布时间未公开/未知 ${missingStats.releaseUnknown} 个，价格待询价 ${missingStats.price} 个，负载待核验 ${missingStats.payload} 个，SDK 待核验 ${missingStats.sdk} 个\n\n## 使用说明\n\nv7 继续核验 AgileX、ANYbotics、DEEPRobotics、KUKA、Techman、ABB、FANUC。官网核验代表型号、官网入口和部分核心参数已由官方页或规格资料确认；价格、交付和售后仍需正式询价。\n`);

console.log(JSON.stringify({ robots: data.robots.length, sources: sources.length, counts, tiers, verification, missingStats }, null, 2));
