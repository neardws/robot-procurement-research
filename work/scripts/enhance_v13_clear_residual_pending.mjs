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
  if (!robot) throw new Error(`Robot not found: ${id}`);
  const sourceIds = value.sourceIds || [];
  robot.sourceIds = mergeUnique(robot.sourceIds, sourceIds);
  robot.price.sourceIds = mergeUnique(robot.price.sourceIds, sourceIds);
  if (value.price) robot.price = { ...robot.price, ...value.price, sourceIds: mergeUnique(robot.price.sourceIds, sourceIds) };
  if (value.specs) robot.specs = { ...robot.specs, ...value.specs };
  if (value.software) robot.software = { ...robot.software, ...value.software };
  if (value.researchEvidence) robot.researchEvidence = mergeUnique(robot.researchEvidence, value.researchEvidence);
  if (value.risks) robot.risks = mergeUnique(robot.risks, value.risks);
  for (const key of ["verificationNotes", "verifiedAt", "releaseDate", "releaseDateConfidence"]) {
    if (value[key] !== undefined) robot[key] = value[key];
  }
}

function normalizePriceText(robot) {
  if (robot.price.amount === null) return;
  robot.price.range = robot.price.range
    .replaceAll("国内需询价", "国内需正式报价")
    .replaceAll("国内代理价需询价", "国内代理价需正式报价")
    .replaceAll("国内正式价需询价", "国内正式价需正式报价")
    .replaceAll("完整组合需询价", "完整组合需正式报价")
    .replaceAll("官网标准报价仍需询价", "官网标准报价仍需正式报价");
}

addSource("SRCV13001", "Robotnik RB-1 Base 官方产品页", "https://robotnik.eu/products/mobile-robots/rb-1-base/", "官网/产品规格", "high", "官方产品页核验 RB-1 Base 移动底盘、载荷、ROS/ROS2 和可扩展接口。");
addSource("SRCV13002", "Robotnik SUMMIT-XL 官方产品页", "https://robotnik.eu/products/mobile-robots/summit-xl/", "官网/产品规格", "high", "官方产品页核验 SUMMIT-XL 户外移动平台、载荷、ROS/ROS2 和传感器扩展接口。");
addSource("SRCV13003", "Unitree H1 官方规格页", "https://www.unitree.com/cn/h1/", "中文官网/产品规格", "high", "宇树 H1 官方页披露 H1-2 系列自由度、重量、续航、电池和运动性能，商业采购需正式报价。");
addSource("SRCV13004", "Boston Dynamics Atlas 官方页", "https://bostondynamics.com/atlas/", "官网/研发产品入口", "high", "Boston Dynamics 官方 Atlas 页面核验电动 Atlas 项目入口，但未披露学校采购型负载、SDK、价格和供货参数。");

for (const robot of data.robots) normalizePriceText(robot);

patch("robotnik-rb1-base", {
  specs: {
    dof: "差速/移动底盘",
    payloadKg: "约 50 kg 级，按配置确认",
    reachM: "移动平台不适用",
    speed: "按版本配置确认",
    endurance: "按电池配置确认",
    sensors: "LiDAR、RGB-D、IMU、GPS 等可扩展",
    compute: "ROS 控制计算平台按配置",
    safety: "室内移动平台，安全配置按项目确认"
  },
  software: {
    ros: "官方 ROS 支持",
    ros2: "官方 ROS2 支持",
    sdk: "Robotnik ROS/ROS2 packages / API",
    sim: "Gazebo / ROS 仿真资源"
  },
  verificationNotes: "Robotnik 官方 RB-1 Base 产品页确认移动底盘、ROS/ROS2 和可扩展接口；价格需厂商正式报价。",
  verifiedAt: accessedDate,
  sourceIds: ["SRCV13001"]
});

patch("robotnik-summit-xl", {
  specs: {
    dof: "四轮户外移动平台",
    payloadKg: "约 65 kg 级，按配置确认",
    reachM: "移动平台不适用",
    speed: "按版本配置确认",
    endurance: "按电池配置确认",
    sensors: "LiDAR、RGB-D、IMU、GPS/RTK 等可扩展",
    compute: "ROS 控制计算平台按配置",
    safety: "户外移动平台，安全配置按项目确认"
  },
  software: {
    ros: "官方 ROS 支持",
    ros2: "官方 ROS2 支持",
    sdk: "Robotnik ROS/ROS2 packages / API",
    sim: "Gazebo / ROS 仿真资源"
  },
  verificationNotes: "Robotnik 官方 SUMMIT-XL 产品页确认户外移动平台、ROS/ROS2 和可扩展传感器/载荷接口；价格需厂商正式报价。",
  verifiedAt: accessedDate,
  sourceIds: ["SRCV13002"]
});

patch("xiaomi-cyberone", {
  specs: {
    payloadKg: "官方未公开采购型负载",
    reachM: "官方未公开采购型臂展",
    repeatabilityMm: "非采购型展示参数，官方未披露",
    endurance: "官方未公开",
    weightKg: "官方未公开",
    compute: "官方未公开采购型计算配置"
  }
});

patch("unitree-g1-edu", {
  specs: {
    payloadKg: "人形开发平台，官方未公开额定负载",
    reachM: "人形平台臂展按版本确认",
    repeatabilityMm: "人形平台不适用/未公开",
    compute: "算力模块按 EDU 版本确认"
  }
});

patch("unitree-h1-2", {
  specs: {
    dof: "约 19 自由度，H1 系列按版本确认",
    payloadKg: "人形平台，官方未公开额定负载",
    reachM: "人形平台臂展按版本确认",
    repeatabilityMm: "人形平台不适用/未公开",
    speed: "官方披露 H1 系列可达约 3.3 m/s 级",
    endurance: "864 Wh 电池，约 2 h 级按任务确认",
    weightKg: "约 47 kg 级，按版本确认",
    compute: "算力模块按 EDU/科研版本确认"
  },
  verificationNotes: "宇树 H1 官方页披露 H1-2 系列自由度、重量、电池和运动性能；教育/科研配置与价格需厂商正式报价。",
  verifiedAt: accessedDate,
  sourceIds: ["SRCV13003"]
});

patch("boston-atlas-electric", {
  specs: {
    dof: "电动全尺寸人形，官方未公开采购型自由度",
    payloadKg: "官方未公开采购型负载",
    reachM: "官方未公开采购型臂展",
    repeatabilityMm: "非采购型展示参数，官方未披露",
    speed: "官方演示口径，未公开采购型速度",
    endurance: "官方未公开",
    weightKg: "官方未公开",
    sensors: "官方演示口径，采购型配置未公开",
    compute: "官方未公开",
    safety: "研发/展示平台，采购与部署安全口径未公开"
  },
  software: {
    ros: "未公开",
    ros2: "未公开",
    sdk: "未公开",
    sim: "未公开"
  },
  verificationNotes: "Boston Dynamics 官方 Atlas 页面确认电动 Atlas 项目入口，但未披露采购型规格、SDK、价格和供货参数；保留为趋势观察项。",
  verifiedAt: accessedDate,
  sourceIds: ["SRCV13004"],
  risks: ["Atlas 当前不是公开采购型学校平台，不能按正式候选报价或交付能力处理。"]
});

data.meta = {
  ...data.meta,
  version: "v13",
  accessedDate,
  updateSummary: "清理残留的需询价/待核验误导口径：公开价说明统一改为正式报价，补齐 Robotnik、Unitree H1-2、CyberOne、Atlas 的关键字段状态，并更新页面报告版本。"
};

const categoryOrder = ["机械臂", "移动/复合机器人", "人形机器人", "机器狗"];
data.robots.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) || a.marketTier.localeCompare(b.marketTier, "zh-CN") || a.verificationStatus.localeCompare(b.verificationStatus, "zh-CN") || a.brandDisplayName.localeCompare(b.brandDisplayName, "zh-CN") || a.name.localeCompare(b.name, "zh-CN"));

for (const path of outputPaths) fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
const csvRows = [["id", "title", "type", "confidence", "url", "notes"], ...sources.map((source) => [source.id, source.title, source.type, source.confidence, source.url, source.notes])];
fs.writeFileSync("outputs/来源追踪-v2.csv", csvRows.map((row) => row.map(csvEscape).join(",")).join("\n") + "\n");

const categoryCounts = Object.fromEntries(categoryOrder.map((category) => [category, data.robots.filter((robot) => robot.category === category).length]));
const tiers = Object.fromEntries(["重点候选", "市场初筛"].map((tier) => [tier, data.robots.filter((robot) => robot.marketTier === tier).length]));
const verification = Object.fromEntries(["官网核验", "部分核验", "待核验"].map((status) => [status, data.robots.filter((robot) => robot.verificationStatus === status).length]));
const priceStats = {
  known: data.robots.filter((robot) => robot.price.amount !== null).length,
  formalQuote: data.robots.filter((robot) => robot.price.amount === null && robot.price.type === "厂商正式报价项").length,
  supplyCheck: data.robots.filter((robot) => robot.price.amount === null && robot.price.type === "供货状态待确认").length
};
const undisclosedRelease = data.robots.filter((robot) => robot.releaseDateConfidence === "unknown" || robot.releaseDate === "官网未披露" || robot.releaseDate === "待核验").length;
fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", `# 学校具身智能机器人采购调研 v13\n\n更新时间：${accessedDate}\n\n## 数据概览\n\n- 候选设备：${data.robots.length} 个\n- 来源记录：${sources.length} 条\n- 市场层级：重点候选 ${tiers["重点候选"]} 个，市场初筛 ${tiers["市场初筛"]} 个\n- 核验状态：官网核验 ${verification["官网核验"]} 个，部分核验 ${verification["部分核验"]} 个，待核验 ${verification["待核验"]} 个\n- 价格状态：已收录公开价/估算价 ${priceStats.known} 个，厂商正式报价项 ${priceStats.formalQuote} 个，供货状态待确认 ${priceStats.supplyCheck} 个\n- 发布时间：官网未披露 ${undisclosedRelease} 个\n- 类别分布：${categoryOrder.map((category) => `${category} ${categoryCounts[category]} 个`).join("，")}\n\n## 使用说明\n\nv13 进一步清理页面和数据中的残留“需询价/待核验”误导口径。没有公开售价的设备被归类为厂商正式报价项或供货状态待确认；官网未披露的发布时间单独显示，不再等同于未核验。\n`);

console.log(JSON.stringify({ robots: data.robots.length, sources: sources.length, tiers, verification, priceStats, undisclosedRelease }, null, 2));
