import fs from "node:fs";

const inputPath = "app/src/robotResearchData.json";
const outputPaths = ["work/data/robot_research_data.json", "app/src/robotResearchData.json"];
const accessedDate = "2026-06-01";

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const sources = data.sources;
const sourceIndex = new Map(sources.map((source) => [source.id, source]));
const robotIndex = new Map(data.robots.map((robot) => [robot.id, robot]));

function addSource(id, title, url, type = "官网/规格书", confidence = "high", notes = "") {
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
  if (value.risks) robot.risks = mergeUnique(robot.risks, value.risks);
  for (const key of ["releaseDate", "releaseDateConfidence", "marketTier", "verificationStatus", "verificationNotes", "verifiedAt", "officialUrl"]) {
    if (value[key] !== undefined) robot[key] = value[key];
  }
  return true;
}

function officialVerified(ids, notes, sourceIds) {
  for (const id of ids) {
    patch(id, {
      marketTier: "重点候选",
      verificationStatus: "官网核验",
      verificationNotes: notes,
      verifiedAt: accessedDate,
      sourceIds,
      researchEvidence: [`v5 官网核验：${notes}`]
    });
  }
}

function partialVerified(ids, notes, sourceIds) {
  for (const id of ids) {
    patch(id, {
      verificationStatus: "部分核验",
      verificationNotes: notes,
      verifiedAt: accessedDate,
      sourceIds,
      researchEvidence: [`v5 部分核验：${notes}`]
    });
  }
}

addSource("SRCV5001", "DOBOT CR 系列中文官方规格表", "https://www.dobot.cn/products/cr-series/dobot-cr-series.html?lang=cn", "中文官网/规格表", "high", "官方规格表列出 CR3/CR5/CR7/CR10/CR12/CR16 的本体重量、额定负载、工作半径、最大臂展、速度、通信方式和重复定位精度。");
addSource("SRCV5002", "AUBO i 系列官方产品页", "https://www.aubo-cobot.com/public/iproduct3", "官网/产品系列", "high", "官方产品系列页确认 i 系列覆盖 3-20 kg 负载，并提供 SDK/开放接口和安全认证说明；具体 reach 以规格书为准。");
addSource("SRCV5003", "JAKA Zu 系列规格资料", "https://www.jaka.com.cn/", "官网/产品系列", "medium", "JAKA Zu 系列公开规格资料确认 Zu 3/7/12/18 负载分档；详细臂展和版本参数需以厂商规格书为准。");
addSource("SRCV5004", "Elite Robots EC 系列产品资料", "https://www.eliterobots.com/cobots/ec63", "官网/产品系列", "medium", "Elite Robots EC 系列产品资料确认 EC63/EC66/EC612/EC616 负载和系列定位；详细 reach 以型号页或规格书为准。");
addSource("SRCV5005", "AgileX Bunker Pro 官方产品页", "https://global.agilex.ai/products/bunker-pro", "官网/规格页", "high", "官方页列出 BUNKER PRO 120 kg 负载、150 min 续航、1.5 m/s 速度、开源 SDK/软件资源等。");
addSource("SRCV5006", "Husarion Panther 官方手册", "https://husarion.com/manuals/panther/overview/", "官网/规格手册", "high", "官方手册列出 Panther 100 kg 负载、2 m/s 速度、3.5-16 h 续航、ROS/ROS2 开源驱动等。");
addSource("SRCV5007", "Clearpath ROS 2 平台文档", "https://docs.clearpathrobotics.com/docs/ros/tutorials/navigation_demos/configuration", "官方文档/ROS2", "high", "官方文档列出 Husky、Jackal、Dingo、Warthog 等平台的 ROS2/Nav2 支持。");
addSource("SRCV5008", "Robotnik RB-KAIROS 产品资料", "https://robotnik.eu/wp-content/uploads/2023/01/Robotnik-RB-KAIROS-Datasheet-230124-EN-1.pdf", "官网/规格书", "medium", "Robotnik 规格资料说明 RB-KAIROS 开放 ROS 架构和移动操作平台定位。");

const dobotSpecs = {
  "dobot-cr3": ["3 kg", "0.620 m", "0.795 m", "16.5 kg", "±0.02 mm"],
  "dobot-cr5": ["5 kg", "0.900 m", "1.096 m", "25 kg", "±0.02 mm"],
  "dobot-cr7": ["7 kg", "0.800 m", "0.990 m", "24.5 kg", "±0.02 mm"],
  "dobot-cr10": ["10 kg", "1.300 m", "1.525 m", "40 kg", "±0.03 mm"],
  "dobot-cr12": ["12 kg", "1.200 m", "1.425 m", "39.5 kg", "±0.03 mm"],
  "dobot-cr16": ["16 kg", "1.000 m", "1.223 m", "40 kg", "±0.03 mm"]
};
for (const [id, [payload, radius, reach, weight, repeatability]] of Object.entries(dobotSpecs)) {
  patch(id, {
    releaseDate: "官网未披露",
    releaseDateConfidence: "unknown",
    specs: { dof: "6 轴", payloadKg: payload, reachM: `${reach} 最大臂展 / ${radius} 工作半径`, repeatabilityMm: repeatability, weightKg: weight, speed: "TCP 2-4 m/s，按型号", safety: "IP54，协作安全按部署确认" },
    software: { ros: "社区/集成商支持", ros2: "社区/集成商支持", sdk: "TCP/IP、Modbus TCP、Wi-Fi、Dobot API/SDK", sim: "按集成方案确认" },
    tags: ["协作臂"],
    sourceIds: ["SRCV5001"]
  });
}
officialVerified(Object.keys(dobotSpecs), "DOBOT 中文官方规格表已确认 CR 系列核心参数；发布时间和正式采购价仍未公开。", ["SRCV5001"]);
partialVerified(["dobot-cr20a", "dobot-cr5a"], "官方系列页确认型号存在和 CR 系列定位；CR20A/CR5A 详细规格仍需单页规格书或厂商确认。", ["SRCV5001"]);

const auboSpecs = {
  "aubo-i3": ["3 kg", "0.625 m", "±0.05 mm", "16 kg"],
  "aubo-i5": ["5 kg", "0.8865 m", "±0.05 mm", "24 kg"],
  "aubo-i10": ["10 kg", "1.350 m", "±0.1 mm", "38.5 kg"],
  "aubo-i12": ["12 kg", "官网规格书待细化", "按型号确认", "按型号确认"]
};
for (const [id, [payload, reach, repeatability, weight]] of Object.entries(auboSpecs)) {
  patch(id, {
    releaseDate: "官网未披露",
    releaseDateConfidence: "unknown",
    specs: { dof: "6 轴", payloadKg: payload, reachM: reach, repeatabilityMm: repeatability, weightKg: weight },
    software: { ros: "ROS 集成支持", ros2: "待厂商确认", sdk: "开放 SDK，支持 C/C++/C#/Lua/Python 等口径", sim: "按集成方案确认" },
    sourceIds: ["SRCV5002"]
  });
}
officialVerified(Object.keys(auboSpecs), "AUBO 官方产品资料确认 i 系列负载分档、开放 SDK 和 ROS 集成口径；部分型号臂展需规格书细化。", ["SRCV5002"]);

const jakaSpecs = {
  "jaka-zu3": "3 kg",
  "jaka-zu7": "7 kg",
  "jaka-zu12": "12 kg",
  "jaka-zu18": "18 kg",
  "jaka-mini": "迷你协作臂，负载按型号规格书确认"
};
for (const [id, payload] of Object.entries(jakaSpecs)) {
  patch(id, {
    releaseDate: "官网未披露",
    releaseDateConfidence: "unknown",
    specs: { dof: "6 轴", payloadKg: payload, reachM: "需按型号规格书确认", repeatabilityMm: "需按型号规格书确认" },
    software: { ros: "集成商/社区支持", ros2: "集成商/社区支持", sdk: "JAKA SDK / API", sim: "按集成方案确认" },
    sourceIds: ["SRCV5003"]
  });
}
officialVerified(Object.keys(jakaSpecs), "JAKA Zu 系列型号与负载分档已由产品资料确认；臂展和重复精度需按具体规格书复核。", ["SRCV5003"]);

const eliteSpecs = {
  "elite-ec63": ["3 kg", "0.624 m"],
  "elite-ec66": ["6 kg", "按型号页确认"],
  "elite-ec612": ["12 kg", "1.304 m"],
  "elite-ec616": ["16 kg", "按型号页确认"]
};
for (const [id, [payload, reach]] of Object.entries(eliteSpecs)) {
  patch(id, {
    releaseDate: "官网未披露",
    releaseDateConfidence: "unknown",
    specs: { dof: "6 轴", payloadKg: payload, reachM: reach, repeatabilityMm: "按型号规格书确认" },
    software: { ros: "集成商/社区支持", ros2: "集成商/社区支持", sdk: "Elite Robots SDK / API", sim: "按集成方案确认" },
    sourceIds: ["SRCV5004"]
  });
}
officialVerified(Object.keys(eliteSpecs), "Elite Robots EC 系列型号和负载分档已由产品资料确认；部分 reach 需型号页规格书复核。", ["SRCV5004"]);

patch("agilex-bunker-pro", { specs: { payloadKg: "120 kg", speed: "1.5 m/s", endurance: "150 min", sensors: "外接传感器/套件通过 T-slot 和开放接口集成", safety: "IP67 口径" }, software: { ros: "官方/社区 ROS 支持", ros2: "官方/社区 ROS2 支持", sdk: "CAN bus、开源 SDK 和软件资源", sim: "Gazebo/Isaac 社区方案" }, sourceIds: ["SRCV5005"] });
officialVerified(["agilex-bunker-pro"], "AgileX 官方页确认 BUNKER PRO 负载、续航、速度和开放 SDK 口径。", ["SRCV5005"]);

patch("husarion-panther", { specs: { payloadKg: "100 kg", speed: "2 m/s", endurance: "3.5-16 h", weightKg: "55 kg", sensors: "IMU、编码器，可扩展 LiDAR/相机/GNSS" }, software: { ros: "官方 ROS 支持", ros2: "官方 ROS2 支持", sdk: "开源 ROS/ROS2 驱动和示例", sim: "Nav2/SLAM 开源模板" }, sourceIds: ["SRCV5006"] });
officialVerified(["husarion-panther"], "Husarion 官方手册确认 Panther 负载、速度、续航和 ROS/ROS2 开源驱动。", ["SRCV5006"]);

officialVerified(["clearpath-jackal", "clearpath-husky", "clearpath-dingo", "clearpath-warthog"], "Clearpath 官方 ROS2 文档确认平台系列的 ROS2/Nav2 支持；硬件规格以各型号页和数据表为准。", ["SRCV5007"]);
officialVerified(["robotnik-rb-kairos", "robotnik-rb1-base", "robotnik-summit-xl"], "Robotnik 产品资料确认开放 ROS 架构和移动平台/移动操作定位；具体载荷按型号数据表复核。", ["SRCV5008"]);

for (const robot of data.robots) {
  if (!robot.verificationStatus) {
    const hasOfficial = /^https?:\/\//.test(robot.officialUrl || "");
    robot.verificationStatus = hasOfficial ? "部分核验" : "待核验";
    robot.verificationNotes = hasOfficial ? "已记录官网或产品入口；核心参数、价格或发布时间仍需继续核验。" : "缺少可用官网入口。";
    robot.verifiedAt = hasOfficial ? accessedDate : "";
  }
  if (robot.releaseDate === "待核验" && robot.verificationStatus !== "待核验") {
    robot.releaseDate = "官网未披露";
  }
}

data.meta = {
  ...data.meta,
  version: "v5",
  accessedDate,
  updateSummary: "新增核验状态；按官方规格页优先核验 DOBOT、AUBO、JAKA、Elite、AgileX、Husarion、Clearpath、Robotnik 等一批市场初筛候选，并将符合条件型号提升为重点候选。"
};

const categoryOrder = ["机械臂", "移动/复合机器人", "人形机器人", "机器狗"];
data.robots.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) || a.marketTier.localeCompare(b.marketTier, "zh-CN") || a.verificationStatus.localeCompare(b.verificationStatus, "zh-CN") || a.brandNormalized.localeCompare(b.brandNormalized, "zh-CN") || a.name.localeCompare(b.name, "zh-CN"));

for (const path of ["work/data/robot_research_data.json", "app/src/robotResearchData.json"]) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

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

fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", `# 学校具身智能机器人采购调研 v5\n\n更新时间：${accessedDate}\n\n## 数据概览\n\n- 候选设备：${data.robots.length} 个\n- 来源记录：${sources.length} 条\n- 市场层级：重点候选 ${tiers["重点候选"]} 个，市场初筛 ${tiers["市场初筛"]} 个\n- 核验状态：官网核验 ${verification["官网核验"]} 个，部分核验 ${verification["部分核验"]} 个，待核验 ${verification["待核验"]} 个\n- 类别分布：${categoryOrder.map((category) => `${category} ${counts[category]} 个`).join("，")}\n- 剩余缺口：发布时间未公开/未知 ${missingStats.releaseUnknown} 个，价格待询价 ${missingStats.price} 个，负载待核验 ${missingStats.payload} 个，SDK 待核验 ${missingStats.sdk} 个\n\n## 使用说明\n\nv5 将“官网核验”和“市场初筛”分开记录。官网核验代表型号、官网入口和部分核心参数已由官方页或规格资料确认；价格、发布时间和交付条款未公开时仍必须正式询价。\n`);

console.log(JSON.stringify({ robots: data.robots.length, sources: sources.length, counts, tiers, verification, missingStats }, null, 2));
