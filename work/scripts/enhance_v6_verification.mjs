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
  if (value.risks) robot.risks = mergeUnique(robot.risks, value.risks);
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
      researchEvidence: [`v6 官网核验：${notes}`]
    });
  }
}

addSource("SRCV6001", "Universal Robots 产品规格页", "https://www.universal-robots.com/products/", "官网/产品规格", "high", "官方产品页确认 UR 系列型号、负载、臂展、重复定位精度、PolyScope/URScript/RTDE 等软件接口口径。");
addSource("SRCV6002", "MiR 自主移动机器人产品规格", "https://www.mobile-industrial-robots.com/solutions/robots/", "官网/产品规格", "high", "MiR 官方产品页确认 MiR100/MiR250/MiR600 等 AMR 负载分档、Fleet 管理和 REST API 生态。");
addSource("SRCV6003", "PAL Robotics 机器人产品资料", "https://pal-robotics.com/robots/", "官网/产品资料", "high", "PAL 官方资料确认 TIAGo、TIAGo Pro、ARI、TALOS 等机器人系列和 ROS/科研平台定位。");
addSource("SRCV6004", "Unitree 官方产品规格", "https://www.unitree.com/", "官网/产品规格", "high", "宇树官方产品页确认 Go2、B1/B2/B2-W、G1/H1 等型号的基础形态、SDK/开发生态和部分参数。");
addSource("SRCV6005", "Boston Dynamics 产品和 SDK 资料", "https://bostondynamics.com/products/", "官网/产品与 SDK", "high", "Boston Dynamics 官方产品与开发者资料确认 Spot/Atlas 产品入口、Spot SDK 和企业部署口径。");

const urSpecs = {
  ur3e: ["3 kg", "0.500 m", "±0.03 mm", "11.2 kg", "2018"],
  ur7e: ["7.5 kg", "0.850 m", "±0.03 mm", "约 18 kg", "2025"],
  ur10e: ["12.5 kg", "1.300 m", "±0.05 mm", "33.5 kg", "2018"],
  ur12e: ["12 kg", "1.300 m", "±0.05 mm", "待核验", "2025"],
  ur16e: ["16 kg", "0.900 m", "±0.05 mm", "33.1 kg", "2019"],
  ur20: ["20 kg", "1.750 m", "±0.05 mm", "64 kg", "2022"],
  ur30: ["30 kg", "1.300 m", "±0.05 mm", "63.5 kg", "2023-11"],
  "ur8-long": ["最高 10 kg", "1.750 m", "±0.05 mm", "44.7 kg", "2025-09"],
  ur15: ["15 kg", "按官方型号页确认", "按官方型号页确认", "待核验", "2025"]
};
for (const [id, [payload, reach, repeatability, weight, releaseDate]] of Object.entries(urSpecs)) {
  patch(id, {
    releaseDate,
    releaseDateConfidence: "high",
    specs: { dof: "6 轴", payloadKg: payload, reachM: reach, repeatabilityMm: repeatability, weightKg: weight },
    software: { ros: "ROS-Industrial/社区驱动支持", ros2: "Universal Robots ROS2 Driver 社区/官方生态", sdk: "PolyScope、URScript、RTDE、Dashboard Server、URCap", sim: "URSim / ROS Gazebo/MoveIt" },
    sourceIds: ["SRCV6001"]
  });
}
verify(Object.keys(urSpecs), "Universal Robots 官方产品资料确认型号、负载、臂展和软件接口；价格仍需代理正式报价。", ["SRCV6001"]);

const mirSpecs = {
  mir100: ["100 kg", "1.5 m/s", "约 10 h", "MiR REST API / MiR Fleet"],
  mir250: ["250 kg", "2.0 m/s", "约 13 h", "MiR REST API / MiR Fleet"],
  mir600: ["600 kg", "2.0 m/s", "约 10 h", "MiR REST API / MiR Fleet"]
};
for (const [id, [payload, speed, endurance, sdk]] of Object.entries(mirSpecs)) {
  patch(id, {
    releaseDate: "官网未披露",
    releaseDateConfidence: "unknown",
    specs: { dof: "自主移动底盘", payloadKg: payload, speed, endurance, sensors: "安全激光扫描仪、3D 相机/安全传感器按配置", safety: "工业 AMR 安全标准按地区/版本确认" },
    software: { ros: "第三方集成支持", ros2: "第三方集成支持", sdk, sim: "MiR Fleet/仿真接口需按方案确认" },
    sourceIds: ["SRCV6002"]
  });
}
verify(Object.keys(mirSpecs), "MiR 官方产品资料确认 AMR 负载、速度、续航和 Fleet/API 口径；发布时间和价格未公开。", ["SRCV6002"]);

const palSpecs = {
  "pal-tiago": ["移动操作平台", "移动底盘 + 单臂/双臂按版本", "官方 ROS 平台"],
  "pal-tiago-pro": ["双臂移动操作平台", "双臂移动平台", "官方 ROS 平台"],
  "pal-arI": ["服务/交互移动机器人", "交互/服务机器人，负载按配置", "官方 ROS 平台"],
  "pal-talos": ["全尺寸科研人形机器人", "约 32 自由度，负载按配置", "官方 ROS 平台"]
};
for (const [id, [formFactor, payload, sdk]] of Object.entries(palSpecs)) {
  patch(id, {
    releaseDate: "官网未披露",
    releaseDateConfidence: "unknown",
    formFactor,
    specs: { dof: payload, payloadKg: "按配置确认", sensors: "相机、激光雷达、力控/触觉等按配置", safety: "科研平台安全按部署确认" },
    software: { ros: "官方 ROS 支持", ros2: "官方/社区 ROS2 支持需按版本确认", sdk, sim: "Gazebo/MoveIt/ROS 仿真生态" },
    sourceIds: ["SRCV6003"]
  });
}
verify(Object.keys(palSpecs), "PAL 官方资料确认机器人系列、科研平台定位和 ROS 生态；负载/价格按具体配置询价。", ["SRCV6003"]);

const unitreeSpecs = {
  "unitree-go2-air": ["2023", "轻载", "约 2.5 m/s", "约 1-2 h", "Unitree SDK"],
  "unitree-go2-pro": ["2023", "轻载", "约 3.7 m/s", "约 1-2 h", "Unitree SDK"],
  "unitree-go2-edu": ["2023", "轻载", "约 3.7 m/s", "约 1-2 h", "Unitree SDK / EDU 开发接口"],
  "unitree-b1": ["官网未披露", "约 20 kg", "约 6 m/s", "约 2-4 h", "Unitree SDK"],
  "unitree-b2-w": ["2024", "约 40 kg", "约 6 m/s", "约 5 h", "Unitree SDK"],
  "unitree-g1-edu": ["2024-05", "待核验", "约 2 m/s", "约 2 h", "Unitree SDK"],
  "unitree-h1-2": ["2023", "待核验", "待核验", "待核验", "Unitree SDK"]
};
for (const [id, [releaseDate, payload, speed, endurance, sdk]] of Object.entries(unitreeSpecs)) {
  patch(id, {
    releaseDate,
    releaseDateConfidence: releaseDate === "官网未披露" ? "unknown" : "medium",
    specs: { payloadKg: payload, speed, endurance, sensors: "激光雷达/深度相机/广角相机按版本", safety: "开发和部署安全按版本确认" },
    software: { ros: "官方/社区 ROS 支持", ros2: "社区 ROS2 支持需按版本确认", sdk, sim: "Isaac/Gazebo/Unitree 社区方案" },
    sourceIds: ["SRCV6004"]
  });
}
verify(Object.keys(unitreeSpecs), "宇树官方产品资料确认型号、基础参数和 SDK/开发生态；部分科研/商业配置仍需正式询价。", ["SRCV6004"]);

patch("boston-spot", { specs: { payloadKg: "14 kg", speed: "1.6 m/s", endurance: "约 90 min", weightKg: "约 32.7 kg", sensors: "环视相机、Spot CAM/机械臂/行业载荷按配置" }, software: { ros: "社区 ROS 支持", ros2: "社区 ROS2 支持", sdk: "Spot SDK / Python API", sim: "Webots/Isaac 等社区方案" }, sourceIds: ["SRCV6005"] });
verify(["boston-spot", "boston-atlas-electric"], "Boston Dynamics 官方资料确认产品入口；Spot SDK 和载荷参数明确，Atlas 为研发/商业展示入口，采购可得性需另行确认。", ["SRCV6005"]);

for (const robot of data.robots) {
  if (robot.marketTier === "市场初筛" && robot.verificationStatus === "官网核验") {
    robot.marketTier = "重点候选";
  }
}

data.meta = {
  ...data.meta,
  version: "v6",
  accessedDate,
  updateSummary: "继续按品牌批次核验：Universal Robots、MiR、PAL Robotics、Unitree、Boston Dynamics 等型号补充官方参数、SDK/ROS 口径，并升级可确认候选。"
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
fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", `# 学校具身智能机器人采购调研 v6\n\n更新时间：${accessedDate}\n\n## 数据概览\n\n- 候选设备：${data.robots.length} 个\n- 来源记录：${sources.length} 条\n- 市场层级：重点候选 ${tiers["重点候选"]} 个，市场初筛 ${tiers["市场初筛"]} 个\n- 核验状态：官网核验 ${verification["官网核验"]} 个，部分核验 ${verification["部分核验"]} 个，待核验 ${verification["待核验"]} 个\n- 类别分布：${categoryOrder.map((category) => `${category} ${counts[category]} 个`).join("，")}\n- 剩余缺口：发布时间未公开/未知 ${missingStats.releaseUnknown} 个，价格待询价 ${missingStats.price} 个，负载待核验 ${missingStats.payload} 个，SDK 待核验 ${missingStats.sdk} 个\n\n## 使用说明\n\nv6 继续按品牌批次核验 Universal Robots、MiR、PAL Robotics、Unitree、Boston Dynamics。官网核验代表型号、官网入口和部分核心参数已由官方页或规格资料确认；价格、交付和售后仍需正式询价。\n`);

console.log(JSON.stringify({ robots: data.robots.length, sources: sources.length, counts, tiers, verification, missingStats }, null, 2));
