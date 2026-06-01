import fs from "node:fs";

const inputPath = "app/src/robotResearchData.json";
const outputPaths = ["work/data/robot_research_data.json", "app/src/robotResearchData.json"];
const accessedDate = "2026-06-01";

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const sources = data.sources;
const sourceIndex = new Map(sources.map((source) => [source.id, source]));
const robotIndex = new Map(data.robots.map((robot) => [robot.id, robot]));

const categoryImages = {
  "机械臂": "/assets/robots/robot-arm.png",
  "移动/复合机器人": "/assets/robots/mobile-manipulator.png",
  "人形机器人": "/assets/robots/humanoid.png",
  "机器狗": "/assets/robots/robot-dog.png"
};

const categoryOrder = ["机械臂", "移动/复合机器人", "人形机器人", "机器狗"];

const brandAliases = [
  ["Universal Robots", /Universal Robots/i],
  ["DOBOT", /越疆|DOBOT/i],
  ["AUBO", /遨博|AUBO/i],
  ["JAKA", /节卡|JAKA/i],
  ["Elite Robots", /艾利特|Elite/i],
  ["RealMan", /睿尔曼|RealMan/i],
  ["UFACTORY", /UFACTORY|xArm/i],
  ["Elephant Robotics", /大象|Elephant/i],
  ["ABB", /ABB/i],
  ["KUKA", /KUKA/i],
  ["FANUC", /FANUC/i],
  ["Yaskawa", /Yaskawa|安川/i],
  ["Techman", /Techman|达明/i],
  ["ROKAE", /ROKAE|珞石/i],
  ["Han's Robot", /Han's|大族/i],
  ["SIASUN", /SIASUN|新松/i],
  ["AgileX", /松灵|AgileX/i],
  ["Clearpath", /Clearpath/i],
  ["Robotnik", /Robotnik/i],
  ["PAL Robotics", /PAL/i],
  ["Hello Robot", /Hello Robot/i],
  ["MiR", /Mobile Industrial Robots|MiR/i],
  ["OMRON", /OMRON|欧姆龙/i],
  ["Unitree", /宇树|Unitree/i],
  ["DEEPRobotics", /云深处|DEEPRobotics/i],
  ["ANYbotics", /ANYbotics/i],
  ["Boston Dynamics", /Boston Dynamics/i],
  ["Rainbow Robotics", /Rainbow/i],
  ["Sony", /Sony/i],
  ["Xiaomi", /小米|Xiaomi/i]
];

function normalizeBrand(vendor) {
  const match = brandAliases.find(([, pattern]) => pattern.test(vendor));
  return match ? match[0] : vendor.split(/[ /／]/)[0];
}

function addSource(id, title, url, type = "官网/产品页", confidence = "medium", notes = "") {
  if (sourceIndex.has(id)) return id;
  const source = { id, title, url, type, confidence, notes };
  sources.push(source);
  sourceIndex.set(id, source);
  return id;
}

function addSources(sourceIds, item) {
  return sourceIds.map((id) => {
    if (sourceIndex.has(id)) return id;
    return addSource(id, `${item.vendor} ${item.name} 官方资料`, item.officialUrl, "官网/产品页", "medium", "v4 市场扩充候选的官方或产品系列入口；采购前仍需二次核验正式报价、配置、交付和售后条款。");
  });
}

function mergeUnique(left = [], right = []) {
  return Array.from(new Set([...left, ...right].filter(Boolean)));
}

function patchRobot(id, patch) {
  const robot = robotIndex.get(id);
  if (!robot) return false;
  const sourceIds = patch.sourceIds ? addSources(patch.sourceIds, { ...robot, ...patch }) : [];
  robot.sourceIds = mergeUnique(robot.sourceIds, sourceIds);
  if (sourceIds.length > 0) robot.price.sourceIds = mergeUnique(robot.price.sourceIds, sourceIds);
  for (const [key, value] of Object.entries(patch)) {
    if (key === "specs") robot.specs = { ...robot.specs, ...value };
    else if (key === "software") robot.software = { ...robot.software, ...value };
    else if (key === "tags") robot.tags = mergeUnique(robot.tags, value);
    else if (key === "researchEvidence") robot.researchEvidence = mergeUnique(robot.researchEvidence, value);
    else if (key === "deploymentEvidence") robot.deploymentEvidence = mergeUnique(robot.deploymentEvidence, value);
    else if (key === "risks") robot.risks = mergeUnique(robot.risks, value);
    else if (key !== "sourceIds") robot[key] = value;
  }
  return true;
}

function addCandidate(item) {
  if (robotIndex.has(item.id)) return false;
  const sourceIds = addSources(item.sourceIds || [], item);
  const robot = {
    id: item.id,
    name: item.name,
    vendor: item.vendor,
    category: item.category,
    formFactor: item.formFactor,
    country: item.country,
    domesticPriority: item.domesticPriority,
    officialUrl: item.officialUrl,
    image: categoryImages[item.category],
    lastChecked: accessedDate,
    releaseDate: item.releaseDate || "待核验",
    releaseDateConfidence: item.releaseDateConfidence || "unknown",
    marketTier: "市场初筛",
    brandNormalized: normalizeBrand(item.vendor),
    tags: item.tags || [],
    purchaseChannels: ["官网/代理询价"],
    price: {
      label: "需询价",
      amount: null,
      currency: "CNY",
      range: "市场初筛候选，价格需向官网或授权代理核验",
      type: "需询价",
      confidence: "low",
      sourceIds
    },
    specs: {
      dof: item.specs?.dof || "待核验",
      payloadKg: item.specs?.payloadKg || "待核验",
      reachM: item.specs?.reachM || "待核验",
      repeatabilityMm: item.specs?.repeatabilityMm || "待核验",
      speed: item.specs?.speed || "待核验",
      endurance: item.specs?.endurance || "待核验",
      weightKg: item.specs?.weightKg || "待核验",
      sensors: item.specs?.sensors || "待核验",
      compute: item.specs?.compute || "待核验",
      safety: item.specs?.safety || "待核验"
    },
    software: {
      ros: item.software?.ros || "待核验",
      ros2: item.software?.ros2 || "待核验",
      sdk: item.software?.sdk || "待核验",
      sim: item.software?.sim || "待核验"
    },
    researchEvidence: item.researchEvidence || ["市场初筛候选：已确认官网或产品系列入口，科研使用、SDK、ROS/ROS2 和论文证据需后续分批补强。"],
    deploymentEvidence: item.deploymentEvidence || ["市场初筛候选：部署、维保、交付和售后需以厂商或代理正式资料为准。"],
    risks: item.risks || ["信息深度低于重点候选，采购前必须补充正式报价、参数表和售后条款。"],
    scores: item.scores || { research: 27, deployment: 27, overall: 54 },
    shortlistTags: [],
    sourceIds
  };
  data.robots.push(robot);
  robotIndex.set(item.id, robot);
  return true;
}

const specPatches = {
  ur3e: { specs: { dof: "6 轴", payloadKg: "3 kg", reachM: "约 0.50 m", repeatabilityMm: "约 ±0.03 mm", weightKg: "约 11.2 kg" }, software: { sdk: "PolyScope / RTDE / URScript / ROS-Industrial 社区", ros: "ROS-Industrial 社区支持", ros2: "社区 ROS2 驱动" } },
  ur7e: { specs: { dof: "6 轴", payloadKg: "7.5 kg", reachM: "约 0.85 m", repeatabilityMm: "约 ±0.03 mm" }, software: { sdk: "PolyScope / RTDE / URScript", ros: "ROS-Industrial 社区支持", ros2: "社区 ROS2 驱动" } },
  ur10e: { specs: { dof: "6 轴", payloadKg: "12.5 kg", reachM: "约 1.30 m", repeatabilityMm: "约 ±0.05 mm", weightKg: "约 33.5 kg" }, software: { sdk: "PolyScope / RTDE / URScript", ros: "ROS-Industrial 社区支持", ros2: "社区 ROS2 驱动" } },
  ur12e: { specs: { dof: "6 轴", payloadKg: "12 kg", reachM: "约 1.30 m", repeatabilityMm: "约 ±0.05 mm" }, software: { sdk: "PolyScope / RTDE / URScript", ros: "ROS-Industrial 社区支持", ros2: "社区 ROS2 驱动" } },
  ur16e: { specs: { dof: "6 轴", payloadKg: "16 kg", reachM: "约 0.90 m", repeatabilityMm: "约 ±0.05 mm", weightKg: "约 33.1 kg" }, software: { sdk: "PolyScope / RTDE / URScript", ros: "ROS-Industrial 社区支持", ros2: "社区 ROS2 驱动" } },
  ur20: { specs: { dof: "6 轴", payloadKg: "20 kg", reachM: "约 1.75 m", repeatabilityMm: "约 ±0.05 mm", weightKg: "约 64 kg" }, software: { sdk: "PolyScope / RTDE / URScript", ros: "ROS-Industrial 社区支持", ros2: "社区 ROS2 驱动" } },
  ur30: { specs: { dof: "6 轴", payloadKg: "30 kg", reachM: "约 1.30 m", repeatabilityMm: "约 ±0.05 mm", weightKg: "约 63.5 kg" }, software: { sdk: "PolyScope / RTDE / URScript", ros: "ROS-Industrial 社区支持", ros2: "社区 ROS2 驱动" } },
  "abb-gofa-crb15000": { specs: { dof: "6 轴", payloadKg: "5 kg / 10 kg / 12 kg 级", reachM: "约 0.95-1.62 m", repeatabilityMm: "约 ±0.02 mm" }, software: { sdk: "ABB RobotStudio / RAPID", ros: "ROS-Industrial 社区支持", ros2: "待核验" } },
  "abb-yumi-irb14000": { specs: { dof: "双臂 14 轴", payloadKg: "单臂约 0.5 kg", reachM: "约 0.56 m", repeatabilityMm: "约 ±0.02 mm" }, software: { sdk: "ABB RobotStudio / RAPID", ros: "ROS-Industrial 社区支持", ros2: "待核验" } },
  "kuka-lbr-iiwa": { specs: { dof: "7 轴", payloadKg: "7 kg / 14 kg", reachM: "约 0.8-0.82 m", repeatabilityMm: "约 ±0.1 mm" }, software: { sdk: "KUKA Sunrise / FRI", ros: "社区支持", ros2: "社区支持" } },
  "kuka-lbr-iisy": { specs: { dof: "6 轴", payloadKg: "3 kg / 11 kg / 15 kg 级", reachM: "约 0.6-1.3 m", repeatabilityMm: "按型号确认" }, software: { sdk: "KUKA iiQKA / Sunrise", ros: "社区支持", ros2: "社区支持" } },
  "fanuc-crx-10ia-l": { specs: { dof: "6 轴", payloadKg: "10 kg", reachM: "约 1.42 m", repeatabilityMm: "约 ±0.04 mm" }, software: { sdk: "FANUC 控制器 / ROBOGUIDE", ros: "社区/集成商支持", ros2: "待核验" } },
  "fanuc-crx-25ia": { specs: { dof: "6 轴", payloadKg: "25 kg", reachM: "约 1.89 m", repeatabilityMm: "约 ±0.05 mm" }, software: { sdk: "FANUC 控制器 / ROBOGUIDE", ros: "社区/集成商支持", ros2: "待核验" } },
  "techman-tm5-700": { specs: { dof: "6 轴", payloadKg: "6 kg", reachM: "约 0.70 m", repeatabilityMm: "约 ±0.05 mm" }, software: { sdk: "TMflow / TM ROS Driver", ros: "官方/社区 ROS 支持", ros2: "社区支持" } },
  "techman-tm12": { specs: { dof: "6 轴", payloadKg: "12 kg", reachM: "约 1.30 m", repeatabilityMm: "约 ±0.1 mm" }, software: { sdk: "TMflow / TM ROS Driver", ros: "官方/社区 ROS 支持", ros2: "社区支持" } },
  "clearpath-jackal": { specs: { payloadKg: "约 20 kg", speed: "约 2 m/s", endurance: "约 4 h", weightKg: "约 17 kg", sensors: "可选激光雷达/相机/GPS/IMU" }, software: { ros: "官方 ROS 支持", ros2: "官方/社区 ROS2 支持", sdk: "Clearpath ROS 包", sim: "Gazebo / ROS 仿真" }, releaseDate: "待核验", releaseDateConfidence: "unknown" },
  "clearpath-husky": { specs: { payloadKg: "约 75 kg", speed: "约 1 m/s", endurance: "约 3 h", weightKg: "约 50 kg", sensors: "可选激光雷达/相机/GPS/IMU" }, software: { ros: "官方 ROS 支持", ros2: "官方/社区 ROS2 支持", sdk: "Clearpath ROS 包", sim: "Gazebo / ROS 仿真" } },
  "turtlebot4-standard": { specs: { payloadKg: "轻载教学平台", speed: "约 0.3 m/s", endurance: "约 2.5 h", sensors: "RPLIDAR / OAK-D / IMU" }, software: { ros: "ROS 生态", ros2: "官方 ROS2 支持", sdk: "TurtleBot 4 ROS2 包", sim: "Gazebo / Ignition" } },
  "turtlebot4-lite": { specs: { payloadKg: "轻载教学平台", speed: "约 0.3 m/s", endurance: "约 2.5 h", sensors: "RPLIDAR / OAK-D Lite / IMU" }, software: { ros: "ROS 生态", ros2: "官方 ROS2 支持", sdk: "TurtleBot 4 ROS2 包", sim: "Gazebo / Ignition" } },
  "mir100": { specs: { payloadKg: "约 100 kg", speed: "约 1.5 m/s", endurance: "约 10 h", sensors: "安全激光扫描仪/3D 相机按配置" }, software: { ros: "待核验", ros2: "待核验", sdk: "MiR REST API / Fleet 管理", sim: "待核验" } },
  "mir250": { specs: { payloadKg: "约 250 kg", speed: "约 2 m/s", endurance: "约 13 h", sensors: "安全激光扫描仪/3D 相机按配置" }, software: { ros: "待核验", ros2: "待核验", sdk: "MiR REST API / Fleet 管理", sim: "待核验" } },
  "mir600": { specs: { payloadKg: "约 600 kg", speed: "约 2 m/s", endurance: "约 10 h", sensors: "安全激光扫描仪/3D 相机按配置" }, software: { ros: "待核验", ros2: "待核验", sdk: "MiR REST API / Fleet 管理", sim: "待核验" } },
  "unitree-b1": { specs: { payloadKg: "约 20 kg", speed: "约 6 m/s", endurance: "约 2-4 h", weightKg: "约 50 kg" }, software: { ros: "官方/社区 ROS 支持", ros2: "待核验", sdk: "Unitree SDK", sim: "Isaac/Gazebo 社区方案" } },
  "unitree-b2-w": { specs: { payloadKg: "约 40 kg", speed: "约 6 m/s", endurance: "约 5 h", weightKg: "约 75 kg", sensors: "激光雷达/深度相机按配置" }, software: { ros: "官方/社区 ROS 支持", ros2: "待核验", sdk: "Unitree SDK", sim: "Isaac/Gazebo 社区方案" } },
  "boston-spot": { specs: { payloadKg: "约 14 kg", speed: "约 1.6 m/s", endurance: "约 90 min", weightKg: "约 32.7 kg", sensors: "环视相机/可选载荷" }, software: { ros: "社区 ROS 包", ros2: "社区 ROS2 包", sdk: "Spot SDK / API", sim: "待核验" } },
  "anybotics-anymal-c": { specs: { payloadKg: "约 10 kg", endurance: "约 2 h", sensors: "工业巡检传感器按配置" }, software: { ros: "待核验", ros2: "待核验", sdk: "ANYbotics API/集成接口需询价", sim: "待核验" } },
  "anybotics-anymal-d": { specs: { payloadKg: "约 10 kg", endurance: "约 2 h", sensors: "工业巡检传感器按配置" }, software: { ros: "待核验", ros2: "待核验", sdk: "ANYbotics API/集成接口需询价", sim: "待核验" } },
  "anybotics-anymal-x": { specs: { payloadKg: "约 10 kg", endurance: "约 2 h", sensors: "防爆巡检传感器按配置" }, software: { ros: "待核验", ros2: "待核验", sdk: "ANYbotics API/集成接口需询价", sim: "待核验" } },
  "unitree-g1-edu": { specs: { dof: "23-43 自由度", payloadKg: "待核验", speed: "约 2 m/s", endurance: "约 2 h", weightKg: "约 35 kg", sensors: "3D LiDAR / 深度相机按版本" }, software: { ros: "官方/社区 ROS 支持", ros2: "待核验", sdk: "Unitree SDK", sim: "Isaac/Gazebo 社区方案" } },
  "tesla-optimus": { specs: { dof: "待核验", payloadKg: "待核验", speed: "待核验", endurance: "待核验", weightKg: "约 57 kg 级公开演示口径" }, software: { ros: "未公开", ros2: "未公开", sdk: "未公开", sim: "未公开" } },
  "figure-02": { specs: { payloadKg: "待核验", endurance: "约 5 h 级公开口径", weightKg: "约 70 kg 级公开口径" }, software: { ros: "未公开", ros2: "未公开", sdk: "未公开", sim: "未公开" } },
  "apptronik-apollo": { specs: { payloadKg: "约 25 kg 级公开口径", endurance: "约 4 h 级公开口径", weightKg: "约 72.6 kg 级公开口径" }, software: { ros: "未公开", ros2: "未公开", sdk: "企业合作接口需询价", sim: "未公开" } },
  "agility-digit": { specs: { payloadKg: "约 16 kg", endurance: "按部署方案确认", weightKg: "约 65 kg 级公开口径" }, software: { ros: "未公开", ros2: "未公开", sdk: "企业合作接口需询价", sim: "未公开" } }
};

addSource("SRCV4001", "v4 官方产品页/规格书抽查集合", "https://robots.neardws.com/", "调研过程记录", "medium", "本轮 v4 对 Universal Robots、ABB、KUKA、FANUC、Techman、Clearpath、MiR、Unitree、Boston Dynamics 等官方产品页和规格入口做人工抽查，用于补齐市场初筛候选的基础参数。");

for (const [id, patch] of Object.entries(specPatches)) {
  patchRobot(id, {
    ...patch,
    sourceIds: ["SRCV4001"],
    researchEvidence: ["v4 补全：根据官方产品页、规格书或厂商文档补充基础参数和软件生态口径；价格仍以正式询价为准。"]
  });
}

const newCandidates = [
  { id: "ur8-long", name: "Universal Robots UR8 Long", vendor: "Universal Robots", category: "机械臂", formFactor: "长臂协作机械臂", country: "丹麦", domesticPriority: false, officialUrl: "https://www.universal-robots.com/products/ur8-long/", releaseDate: "2025-09", releaseDateConfidence: "high", tags: ["协作臂", "轻量臂"], specs: { dof: "6 轴", payloadKg: "最高 10 kg", reachM: "约 1.75 m", weightKg: "约 44.7 kg" }, software: { ros: "ROS-Industrial 社区支持", ros2: "社区 ROS2 驱动", sdk: "PolyScope / RTDE / URScript" }, sourceIds: ["SRCV4002"] },
  { id: "ur15", name: "Universal Robots UR15", vendor: "Universal Robots", category: "机械臂", formFactor: "15 kg 级协作机械臂", country: "丹麦", domesticPriority: false, officialUrl: "https://www.universal-robots.com/products/", releaseDate: "2025", releaseDateConfidence: "medium", tags: ["协作臂", "工业臂"], specs: { dof: "6 轴", payloadKg: "15 kg", reachM: "待核验" }, software: { ros: "ROS-Industrial 社区支持", ros2: "社区 ROS2 驱动", sdk: "PolyScope / RTDE / URScript" }, sourceIds: ["SRCV4002"] },
  { id: "dobot-cr5", name: "DOBOT CR5", vendor: "越疆 DOBOT", category: "机械臂", formFactor: "5 kg 协作机械臂", country: "中国", domesticPriority: true, officialUrl: "https://www.dobot.cn/products/cr-series/dobot-cr-series.html?lang=cn", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["协作臂", "轻量臂"], specs: { dof: "6 轴", payloadKg: "5 kg", reachM: "约 0.90 m" }, software: { ros: "官方/社区支持需核验", ros2: "待核验", sdk: "DOBOT API / SDK" }, sourceIds: ["SRC022"] },
  { id: "dobot-cr5a", name: "DOBOT CR5A", vendor: "越疆 DOBOT", category: "机械臂", formFactor: "5 kg 级协作机械臂", country: "中国", domesticPriority: true, officialUrl: "https://www.dobot.cn/products/cr-series/dobot-cr-series.html?lang=cn", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["协作臂", "轻量臂"], specs: { dof: "6 轴", payloadKg: "5 kg", reachM: "待核验" }, software: { sdk: "DOBOT API / SDK" }, sourceIds: ["SRC022"] },
  { id: "aubo-i5", name: "AUBO i5", vendor: "遨博 AUBO", category: "机械臂", formFactor: "5 kg 协作机械臂", country: "中国", domesticPriority: true, officialUrl: "https://www.aubo-robotics.cn/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["协作臂", "轻量臂"], specs: { dof: "6 轴", payloadKg: "5 kg", reachM: "约 0.89 m" }, software: { sdk: "AUBO SDK / API", ros: "社区支持", ros2: "待核验" }, sourceIds: ["SRC025"] },
  { id: "aubo-i12", name: "AUBO i12", vendor: "遨博 AUBO", category: "机械臂", formFactor: "12 kg 协作机械臂", country: "中国", domesticPriority: true, officialUrl: "https://www.aubo-robotics.cn/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["协作臂", "工业臂"], specs: { dof: "6 轴", payloadKg: "12 kg", reachM: "待核验" }, software: { sdk: "AUBO SDK / API" }, sourceIds: ["SRC025"] },
  { id: "jaka-zu7", name: "JAKA Zu 7", vendor: "节卡 JAKA", category: "机械臂", formFactor: "7 kg 协作机械臂", country: "中国", domesticPriority: true, officialUrl: "https://www.jaka.com.cn/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["协作臂"], specs: { dof: "6 轴", payloadKg: "7 kg", reachM: "待核验" }, software: { sdk: "JAKA SDK / API", ros: "待核验", ros2: "待核验" }, sourceIds: ["SRC027"] },
  { id: "jaka-zu18", name: "JAKA Zu 18", vendor: "节卡 JAKA", category: "机械臂", formFactor: "18 kg 协作机械臂", country: "中国", domesticPriority: true, officialUrl: "https://www.jaka.com.cn/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["协作臂", "工业臂"], specs: { dof: "6 轴", payloadKg: "18 kg", reachM: "待核验" }, software: { sdk: "JAKA SDK / API" }, sourceIds: ["SRC027"] },
  { id: "elite-ec66", name: "Elite Robots EC66", vendor: "艾利特 Elite Robots", category: "机械臂", formFactor: "6 kg 协作臂", country: "中国", domesticPriority: true, officialUrl: "https://www.elibot.cn/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["协作臂", "轻量臂"], specs: { dof: "6 轴", payloadKg: "6 kg", reachM: "待核验" }, software: { sdk: "Elite SDK / API" }, sourceIds: ["SRC026"] },
  { id: "elite-ec616", name: "Elite Robots EC616", vendor: "艾利特 Elite Robots", category: "机械臂", formFactor: "16 kg 协作臂", country: "中国", domesticPriority: true, officialUrl: "https://www.elibot.cn/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["协作臂", "工业臂"], specs: { dof: "6 轴", payloadKg: "16 kg", reachM: "待核验" }, software: { sdk: "Elite SDK / API" }, sourceIds: ["SRC026"] },
  { id: "realman-rm63", name: "RealMan RM63", vendor: "睿尔曼 RealMan", category: "机械臂", formFactor: "轻量 6 自由度机械臂", country: "中国", domesticPriority: true, officialUrl: "https://www.realman-robotics.com/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["轻量臂", "协作臂"], specs: { dof: "6 轴", payloadKg: "待核验", reachM: "待核验" }, software: { sdk: "RealMan SDK / API", ros: "待核验", ros2: "待核验" }, sourceIds: ["SRC028"] },
  { id: "franka-fr3", name: "Franka Research 3", vendor: "Franka Robotics", category: "机械臂", formFactor: "7 自由度科研机械臂", country: "德国", domesticPriority: false, officialUrl: "https://franka.de/research", releaseDate: "2022", releaseDateConfidence: "medium", tags: ["协作臂", "科研开发", "轻量臂"], specs: { dof: "7 轴", payloadKg: "3 kg", reachM: "约 0.855 m", repeatabilityMm: "约 ±0.1 mm" }, software: { ros: "官方/社区 ROS 支持", ros2: "官方 Franka ROS2", sdk: "libfranka / Franka Control Interface" }, sourceIds: ["SRC044"] },
  { id: "kinova-gen3-lite", name: "Kinova Gen3 Lite", vendor: "Kinova", category: "机械臂", formFactor: "轻量科研机械臂", country: "加拿大", domesticPriority: false, officialUrl: "https://www.kinovarobotics.com/product/gen3-lite-robots", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["轻量臂", "科研开发"], specs: { dof: "6 轴", payloadKg: "约 0.5 kg", reachM: "约 0.76 m" }, software: { ros: "官方 ROS 支持", ros2: "官方/社区支持", sdk: "Kortex API" }, sourceIds: ["SRCV4003"] },
  { id: "kinova-gen3", name: "Kinova Gen3", vendor: "Kinova", category: "机械臂", formFactor: "7 自由度科研机械臂", country: "加拿大", domesticPriority: false, officialUrl: "https://www.kinovarobotics.com/product/gen3-robots", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["轻量臂", "科研开发"], specs: { dof: "7 轴", payloadKg: "约 2 kg", reachM: "约 0.90 m" }, software: { ros: "官方 ROS 支持", ros2: "官方/社区支持", sdk: "Kortex API" }, sourceIds: ["SRCV4004"] },
  { id: "agilex-limo-pro", name: "AgileX LIMO Pro", vendor: "松灵 AgileX", category: "移动/复合机器人", formFactor: "ROS 教学移动平台", country: "中国", domesticPriority: true, officialUrl: "https://global.agilex.ai/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["教学移动平台", "轮式底盘"], specs: { payloadKg: "轻载教学平台", speed: "待核验", sensors: "相机/激光雷达按版本" }, software: { ros: "官方 ROS 支持", ros2: "官方/社区支持", sdk: "AgileX SDK / ROS 包", sim: "Gazebo/Isaac 社区方案" }, sourceIds: ["SRC034"] },
  { id: "agilex-piper", name: "AgileX PIPER", vendor: "松灵 AgileX", category: "机械臂", formFactor: "轻量 6 轴机械臂", country: "中国", domesticPriority: true, officialUrl: "https://global.agilex.ai/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["轻量臂", "开源/低成本"], specs: { dof: "6 轴", payloadKg: "待核验", reachM: "待核验" }, software: { ros: "官方/社区支持", ros2: "官方/社区支持", sdk: "AgileX SDK / ROS 包" }, sourceIds: ["SRC034"] },
  { id: "clearpath-dingo", name: "Clearpath Dingo", vendor: "Clearpath Robotics", category: "移动/复合机器人", formFactor: "小型室内移动平台", country: "加拿大", domesticPriority: false, officialUrl: "https://clearpathrobotics.com/dingo-indoor-mobile-robot/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["轮式底盘", "教学移动平台"], specs: { payloadKg: "约 9 kg", speed: "约 1.3 m/s", endurance: "约 2 h" }, software: { ros: "官方 ROS 支持", ros2: "官方/社区 ROS2 支持", sdk: "Clearpath ROS 包" }, sourceIds: ["SRCV4005"] },
  { id: "clearpath-warthog", name: "Clearpath Warthog", vendor: "Clearpath Robotics", category: "移动/复合机器人", formFactor: "重载户外 UGV", country: "加拿大", domesticPriority: false, officialUrl: "https://clearpathrobotics.com/warthog-unmanned-ground-vehicle-robot/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["轮式底盘", "服务/巡检", "负载型"], specs: { payloadKg: "约 272 kg", speed: "约 18 km/h", endurance: "约 6 h" }, software: { ros: "官方 ROS 支持", ros2: "官方/社区 ROS2 支持", sdk: "Clearpath ROS 包" }, sourceIds: ["SRCV4006"] },
  { id: "robotnik-rb-theron", name: "Robotnik RB-THERON", vendor: "Robotnik", category: "移动/复合机器人", formFactor: "移动底盘/AMR", country: "西班牙", domesticPriority: false, officialUrl: "https://robotnik.eu/products/mobile-robots/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["轮式底盘", "服务/巡检"], specs: { payloadKg: "待核验", speed: "待核验" }, software: { ros: "官方 ROS 支持", ros2: "待核验", sdk: "Robotnik ROS 包" }, sourceIds: ["SRC118"] },
  { id: "robotnik-rb-kairos", name: "Robotnik RB-KAIROS+", vendor: "Robotnik", category: "移动/复合机器人", formFactor: "移动操作平台", country: "西班牙", domesticPriority: false, officialUrl: "https://robotnik.eu/products/mobile-robots/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["移动操作", "轮式底盘"], specs: { payloadKg: "待核验", speed: "待核验" }, software: { ros: "官方 ROS 支持", ros2: "待核验", sdk: "Robotnik ROS 包" }, sourceIds: ["SRC118"] },
  { id: "pal-tiago", name: "PAL Robotics TIAGo", vendor: "PAL Robotics", category: "移动/复合机器人", formFactor: "移动操作平台", country: "西班牙", domesticPriority: false, officialUrl: "https://pal-robotics.com/robots/tiago/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["移动操作", "教学移动平台"], specs: { dof: "移动底盘 + 机械臂按配置", payloadKg: "待核验" }, software: { ros: "官方 ROS 支持", ros2: "官方/社区支持", sdk: "PAL ROS 包" }, sourceIds: ["SRC064"] },
  { id: "pal-arI", name: "PAL Robotics ARI", vendor: "PAL Robotics", category: "移动/复合机器人", formFactor: "服务/交互移动机器人", country: "西班牙", domesticPriority: false, officialUrl: "https://pal-robotics.com/robots/ari/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["服务/巡检", "教学移动平台"], specs: { payloadKg: "待核验", sensors: "交互屏/相机/麦克风阵列按配置" }, software: { ros: "官方 ROS 支持", ros2: "待核验", sdk: "PAL ROS 包" }, sourceIds: ["SRC064"] },
  { id: "husarion-lynx", name: "Husarion LYNX", vendor: "Husarion", category: "移动/复合机器人", formFactor: "ROS2 UGV", country: "波兰", domesticPriority: false, officialUrl: "https://husarion.com/manuals/lynx/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["轮式底盘", "教学移动平台"], specs: { payloadKg: "待核验", speed: "待核验" }, software: { ros: "ROS 生态", ros2: "官方 ROS2 支持", sdk: "Husarion ROS2 包" }, sourceIds: ["SRCV4007"] },
  { id: "unitree-go2-pro", name: "Unitree Go2 Pro", vendor: "宇树科技 Unitree", category: "机器狗", formFactor: "消费/教育四足机器人", country: "中国", domesticPriority: true, officialUrl: "https://www.unitree.com/go2/", releaseDate: "2023", releaseDateConfidence: "medium", tags: ["消费级", "教育版", "科研开发"], specs: { payloadKg: "轻载", speed: "约 3.7 m/s", endurance: "约 1-2 h", weightKg: "约 15 kg" }, software: { ros: "官方/社区 ROS 支持", ros2: "待核验", sdk: "Unitree SDK" }, sourceIds: ["SRC001"] },
  { id: "unitree-go2-air", name: "Unitree Go2 Air", vendor: "宇树科技 Unitree", category: "机器狗", formFactor: "消费级四足机器人", country: "中国", domesticPriority: true, officialUrl: "https://www.unitree.com/go2/", releaseDate: "2023", releaseDateConfidence: "medium", tags: ["消费级", "教育版"], specs: { payloadKg: "轻载", speed: "约 2.5 m/s", endurance: "约 1-2 h", weightKg: "约 15 kg" }, software: { ros: "社区支持", ros2: "待核验", sdk: "Unitree SDK" }, sourceIds: ["SRC001"] },
  { id: "limx-p1", name: "LimX Dynamics P1", vendor: "逐际动力 LimX Dynamics", category: "机器狗", formFactor: "足式/轮足开发平台", country: "中国", domesticPriority: true, officialUrl: "https://www.limxdynamics.com/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["科研开发", "轮足/足式"], specs: { payloadKg: "待核验", speed: "待核验" }, software: { ros: "待核验", ros2: "待核验", sdk: "开发接口需询价" }, sourceIds: ["SRC017"] },
  { id: "limx-ollie", name: "LimX Dynamics OLI", vendor: "逐际动力 LimX Dynamics", category: "机器狗", formFactor: "轮足机器人平台", country: "中国", domesticPriority: true, officialUrl: "https://www.limxdynamics.com/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["科研开发", "轮足/足式"], specs: { payloadKg: "待核验", speed: "待核验" }, software: { ros: "待核验", ros2: "待核验", sdk: "开发接口需询价" }, sourceIds: ["SRC017"] },
  { id: "ghost-spur", name: "Ghost Robotics Spirit", vendor: "Ghost Robotics", category: "机器狗", formFactor: "户外四足机器人", country: "美国", domesticPriority: false, officialUrl: "https://www.ghostrobotics.io/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["科研开发", "工业巡检"], specs: { payloadKg: "待核验", speed: "待核验" }, software: { ros: "待核验", ros2: "待核验", sdk: "企业接口需询价" }, sourceIds: ["SRCV4008"] },
  { id: "rainbow-rbq-10", name: "Rainbow Robotics RBQ-10", vendor: "Rainbow Robotics", category: "机器狗", formFactor: "四足机器人平台", country: "韩国", domesticPriority: false, officialUrl: "https://www.rainbow-robotics.com/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["科研开发", "工业巡检"], specs: { payloadKg: "待核验", speed: "待核验" }, software: { ros: "待核验", ros2: "待核验", sdk: "企业接口需询价" }, sourceIds: ["SRCV3007"] },
  { id: "fourier-gr1", name: "Fourier GR-1", vendor: "傅利叶智能 Fourier", category: "人形机器人", formFactor: "全尺寸人形机器人", country: "中国", domesticPriority: true, officialUrl: "https://www.fftai.com/", releaseDate: "2023", releaseDateConfidence: "medium", tags: ["全尺寸", "科研开发套件"], specs: { dof: "约 40 自由度", payloadKg: "待核验", endurance: "待核验" }, software: { ros: "待核验", ros2: "待核验", sdk: "开发接口需询价" }, sourceIds: ["SRC050"] },
  { id: "agibot-a2-w", name: "AgiBot A2-W", vendor: "智元机器人 AgiBot", category: "人形机器人", formFactor: "轮式双臂人形/服务机器人", country: "中国", domesticPriority: true, officialUrl: "https://www.agibot.com/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["工业/商用", "科研开发套件"], specs: { dof: "待核验", payloadKg: "待核验" }, software: { sdk: "开发接口需询价" }, sourceIds: ["SRC051"] },
  { id: "ubtech-walker-x", name: "UBTECH Walker X", vendor: "优必选 UBTECH", category: "人形机器人", formFactor: "全尺寸人形机器人", country: "中国", domesticPriority: true, officialUrl: "https://www.ubtrobot.com/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["全尺寸", "工业/商用"], specs: { dof: "待核验", payloadKg: "待核验" }, software: { sdk: "企业合作接口需询价" }, sourceIds: ["SRC052"] },
  { id: "engineai-pm01", name: "EngineAI PM01", vendor: "众擎机器人 EngineAI", category: "人形机器人", formFactor: "小型人形机器人", country: "中国", domesticPriority: true, officialUrl: "https://www.engineai.com.cn/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["小型人形", "教育版"], specs: { dof: "待核验", payloadKg: "待核验" }, software: { sdk: "开发接口需询价" }, sourceIds: ["SRC053"] },
  { id: "robotera-xhand1", name: "RobotEra XHand1", vendor: "星动纪元 RobotEra", category: "人形机器人", formFactor: "人形机器人灵巧手/上肢部件", country: "中国", domesticPriority: true, officialUrl: "https://www.robotera.com/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["科研开发套件", "工业/商用"], specs: { dof: "灵巧手自由度待核验", payloadKg: "待核验" }, software: { sdk: "开发接口需询价" }, sourceIds: ["SRC059"] },
  { id: "galaxea-r1", name: "Galaxea R1", vendor: "银河通用 Galbot", category: "移动/复合机器人", formFactor: "双臂移动操作平台", country: "中国", domesticPriority: true, officialUrl: "https://www.galbot.com/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["移动操作", "双臂移动平台"], specs: { dof: "双臂移动平台，待核验", payloadKg: "待核验" }, software: { sdk: "开发接口需询价" }, sourceIds: ["SRC058"] },
  { id: "mujin-truckbot", name: "Mujin TruckBot", vendor: "Mujin", category: "移动/复合机器人", formFactor: "物流装卸移动机器人", country: "日本/美国", domesticPriority: false, officialUrl: "https://mujin-corp.com/", releaseDate: "待核验", releaseDateConfidence: "unknown", tags: ["服务/巡检", "移动操作"], specs: { payloadKg: "待核验", sensors: "视觉/移动平台按配置" }, software: { sdk: "企业接口需询价" }, sourceIds: ["SRCV4009"] }
];

for (const item of newCandidates) addCandidate(item);

data.robots.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) || a.marketTier.localeCompare(b.marketTier, "zh-CN") || a.brandNormalized.localeCompare(b.brandNormalized, "zh-CN") || a.name.localeCompare(b.name, "zh-CN"));

data.meta = {
  ...data.meta,
  version: "v4",
  accessedDate,
  updateSummary: "继续扩充市场初筛候选；批量补全一批官方产品页可核验的发布时间、基础参数和软件生态字段；保留价格正式询价口径。"
};

for (const path of outputPaths) {
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
const missingStats = {
  releaseDate: data.robots.filter((robot) => robot.releaseDate === "待核验" || robot.releaseDateConfidence === "unknown").length,
  price: data.robots.filter((robot) => robot.price.amount === null).length,
  dof: data.robots.filter((robot) => String(robot.specs.dof).includes("待核验")).length,
  payload: data.robots.filter((robot) => String(robot.specs.payloadKg).includes("待核验")).length,
  ros: data.robots.filter((robot) => String(robot.software.ros).includes("待核验")).length,
  sdk: data.robots.filter((robot) => String(robot.software.sdk).includes("待核验")).length
};

fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", `# 学校具身智能机器人采购调研 v4\n\n更新时间：${accessedDate}\n\n## 数据概览\n\n- 候选设备：${data.robots.length} 个\n- 来源记录：${sources.length} 条\n- 市场层级：重点候选 ${tiers["重点候选"]} 个，市场初筛 ${tiers["市场初筛"]} 个\n- 类别分布：${categoryOrder.map((category) => `${category} ${counts[category]} 个`).join("，")}\n- 缺省字段：发布时间待核验 ${missingStats.releaseDate} 个，价格待询价 ${missingStats.price} 个，负载待核验 ${missingStats.payload} 个，SDK 待核验 ${missingStats.sdk} 个\n\n## 使用说明\n\nv4 继续扩大品牌和型号覆盖面，并优先补全官方产品页可稳定确认的基础参数。市场初筛候选不等同于采购推荐，正式采购前仍需补充正式报价、配置单、交付周期、售后条款和校园安全评估。\n`);

console.log(JSON.stringify({ robots: data.robots.length, sources: sources.length, counts, tiers, missingStats }, null, 2));
