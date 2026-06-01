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
}

function verify(ids, notes, sourceIds, tier = "重点候选") {
  for (const id of ids) {
    patch(id, {
      marketTier: tier,
      verificationStatus: "官网核验",
      verificationNotes: notes,
      verifiedAt: accessedDate,
      sourceIds,
      researchEvidence: [`v8 官网核验：${notes}`]
    });
  }
}

addSource("SRCV8001", "DOBOT CR20A 官方规格页", "https://www.dobot-robots.com/products/cra-series/cr20a.html", "官网/产品规格", "high", "官方页核验 CR20A 20 kg 负载、1700 mm 工作半径、±0.05 mm 重复定位精度、IP54 和工业协作臂定位。");
addSource("SRCV8002", "DOBOT CRA 系列官方规格页", "https://www.dobot-robots.com/products/cra-series/cra.html?lang=en%3Ftype%3D57", "官网/产品规格", "high", "官方系列页核验 CR5A 等 CRA 型号、负载、工作半径、速度、重复定位精度和 DobotStudio Pro 软件口径。");
addSource("SRCV8003", "DOBOT Nova 2 官方规格页", "https://www.dobot-robots.com/products/nova-series/nova2.html", "官网/产品规格", "high", "官方页核验 Nova 2 的 2 kg 负载、625 mm 工作半径、1.6 m/s TCP 速度、±0.05 mm 重复定位精度和 CR/Nova 软件手册入口。");
addSource("SRCV8004", "DOBOT Nova 5 官方规格页", "https://www.dobot-robots.com/products/nova-series/nova5.html", "官网/产品规格", "high", "官方页核验 Nova 5 的 5 kg 负载、850 mm 工作半径、2 m/s TCP 速度、±0.05 mm 重复定位精度和 CR/Nova 软件手册入口。");
addSource("SRCV8005", "RealMan RML63 官方规格页", "https://realman-robotics.com/en/products/rml63.html", "官网/产品规格", "high", "官方页核验 RML63 6 自由度、3 kg 负载、900-917 mm 工作半径、±0.05 mm 重复定位精度和可选六维力版本。");
addSource("SRCV8006", "RealMan RM75 官方规格页", "https://www.realman-robotics.com/en/products/rm75.html", "官网/产品规格", "high", "官方页核验 RM75 7 自由度、5 kg 负载、610-627 mm 工作半径、±0.05 mm 重复定位精度和可选六维力版本。");
addSource("SRCV8007", "OMRON LD 系列官方规格页", "https://robotics.omron.com/products/mobile-robots/ld-series/", "官网/产品规格", "high", "官方页核验 LD-60、LD-90 负载、速度、续航、安全传感器、MobilePlanner 控制接口和 AMR 定位。");
addSource("SRCV8008", "TurtleBot 4 官方用户手册", "https://turtlebot.github.io/turtlebot4-user-manual/", "官网/用户手册", "high", "官方手册核验 TurtleBot 4 / Lite 为教育科研开源平台，搭载 iRobot Create 3 底盘、Raspberry Pi 4、ROS 2、OAK-D、2D LiDAR 和仿真/教程资源。");
addSource("SRCV8009", "LimX Dynamics 官方网站", "https://www.limxdynamics.com/en", "官网/产品入口", "high", "官网核验 LimX 当前产品组合和新闻；旧款 W1/P1 官方规格入口未在当前站点公开，需要询价确认。");
addSource("SRCV8010", "LimX Oli 官方规格页", "https://limxdynamics.com/en/oli/spec", "官网/产品规格", "high", "官方规格页核验 LimX Oli 31 自由度、约 55 kg、约 2 h 续航、单臂 3 kg 负载、控制器/传感器 API 和开发工具。");
addSource("SRCV8011", "Ghost Robotics Vision 60 官方规格页", "https://www.ghostrobotics.io/vision-60", "官网/产品规格", "high", "官方页核验 Vision 60 10 kg 载荷、3 h 级连续行走、IP67、NVIDIA Xavier、接口和 Mission Control/开放架构口径。");
addSource("SRCV8012", "Xiaomi CyberDog 官方参数页", "https://www.mi.com/cyberdog/specs", "官网/产品规格", "high", "小米官方参数页核验 CyberDog 工程探索版官方入口；具体采购可得性需按当前渠道确认。");
addSource("SRCV8013", "Xiaomi CyberOne 官方文章", "https://www.mi.com/global/discover/article?id=2700", "官网/发布文章", "medium", "小米官方文章核验 CyberOne 发布和人形机器人定位；当前量产、售价和采购交付信息未公开。");
addSource("SRCV8014", "EngineAI SA01 官方规格页", "https://www.engineai.com.cn/product-sa01.html", "官网/产品规格", "high", "官方页核验 SA01 全开源双足平台、12 自由度、15Ah 快拆电池、2 h 级续航和教育/开发定位。");
addSource("SRCV8015", "EngineAI SE01 官方规格页", "https://www.engineai.com.cn/product-se01", "官网/产品规格", "high", "官方页核验 SE01 全尺寸人形、拟人步态、视听感知、灵巧手、快拆电池和接口定位。");
addSource("SRCV8016", "Galbot G1 官方规格页", "https://www.galbot.com/g1", "官网/产品规格", "high", "官方页核验 Galbot G1 1730 mm 身高、双臂总 10 kg 负载、0-2.4 m 操作覆盖、10 h 续航、IP54 和 AGX Orin 计算平台。");
addSource("SRCV8017", "Galaxea R1 Pro 官方文档", "https://docs.galaxea-ai.com/Guide/R1Pro/hardware_introduction/R1Pro_Hardware_Introduction/", "官网/产品文档", "high", "官方文档核验 Galaxea R1 Pro 26 自由度、双臂移动平台、3.5 kg 额定单臂负载、5 kg 最大单臂负载、1680 Wh 电池和科研平台适用边界。");

patch("dobot-cr20a", {
  officialUrl: "https://www.dobot-robots.com/products/cra-series/cr20a.html",
  specs: {
    dof: "6 轴",
    payloadKg: "20 kg",
    reachM: "1.7 m",
    repeatabilityMm: "±0.05 mm",
    speed: "TCP 最高 2.0 m/s",
    weightKg: "73 kg",
    safety: "IP54，碰撞/过载保护按官方配置"
  },
  software: { ros: "第三方/社区适配需项目确认", ros2: "第三方/社区适配需项目确认", sdk: "DobotStudio Pro / TCP-IP / Modbus TCP / Profinet / EtherNet/IP", sim: "官方软件与第三方仿真需项目确认" },
  tags: ["重载协作臂"],
  sourceIds: ["SRCV8001"]
});
verify(["dobot-cr20a"], "DOBOT CR20A 官方规格页确认 20 kg 负载、1700 mm 工作半径、±0.05 mm 重复定位精度、IP54 和工业接口；价格需询价。", ["SRCV8001"]);

patch("dobot-cr5a", {
  officialUrl: "https://www.dobot-robots.com/products/cra-series/cra.html?lang=en%3Ftype%3D57",
  specs: {
    dof: "6 轴",
    payloadKg: "5 kg",
    reachM: "0.9 m",
    repeatabilityMm: "±0.02 mm",
    speed: "TCP 最高 2.0 m/s",
    weightKg: "25 kg",
    safety: "IP54，碰撞检测和协作安全按官方配置"
  },
  software: { ros: "第三方/社区适配需项目确认", ros2: "第三方/社区适配需项目确认", sdk: "DobotStudio Pro / 控制器接口 / Modbus TCP", sim: "官方软件与第三方仿真需项目确认" },
  sourceIds: ["SRCV8002"]
});
verify(["dobot-cr5a"], "DOBOT CRA 官方系列页确认 CR5A 型号、5 kg 负载、900 mm 工作半径、±0.02 mm 重复定位精度和 DobotStudio Pro 口径；价格需询价。", ["SRCV8002"]);

patch("dobot-nova2", {
  officialUrl: "https://www.dobot-robots.com/products/nova-series/nova2.html",
  specs: {
    dof: "6 轴",
    payloadKg: "2 kg",
    reachM: "0.625 m",
    repeatabilityMm: "±0.05 mm",
    speed: "TCP 最高 1.6 m/s",
    weightKg: "11 kg",
    safety: "IP54，轻量商业协作臂"
  },
  software: { ros: "第三方/社区适配需项目确认", ros2: "第三方/社区适配需项目确认", sdk: "DobotStudio Pro / CRStudio App / TCP-IP / Modbus TCP", sim: "官方软件与第三方仿真需项目确认" },
  tags: ["商用协作臂"],
  sourceIds: ["SRCV8003"]
});
verify(["dobot-nova2"], "DOBOT Nova 2 官方规格页确认 2 kg 负载、625 mm 工作半径、±0.05 mm 重复定位精度和 CR/Nova 软件手册入口；价格需询价。", ["SRCV8003"]);

patch("dobot-nova5", {
  officialUrl: "https://www.dobot-robots.com/products/nova-series/nova5.html",
  specs: {
    dof: "6 轴",
    payloadKg: "5 kg",
    reachM: "0.85 m",
    repeatabilityMm: "±0.05 mm",
    speed: "TCP 最高 2.0 m/s",
    weightKg: "14 kg",
    safety: "IP54，轻量商业协作臂"
  },
  software: { ros: "第三方/社区适配需项目确认", ros2: "第三方/社区适配需项目确认", sdk: "DobotStudio Pro / CRStudio App / TCP-IP / Modbus TCP", sim: "官方软件与第三方仿真需项目确认" },
  tags: ["商用协作臂"],
  sourceIds: ["SRCV8004"]
});
verify(["dobot-nova5"], "DOBOT Nova 5 官方规格页确认 5 kg 负载、850 mm 工作半径、±0.05 mm 重复定位精度和 CR/Nova 软件手册入口；价格需询价。", ["SRCV8004"]);

patch("realman-rm63", {
  name: "RealMan RML63",
  officialUrl: "https://realman-robotics.com/en/products/rml63.html",
  specs: {
    dof: "6 轴",
    payloadKg: "3 kg",
    reachM: "0.9-0.917 m",
    repeatabilityMm: "±0.05 mm",
    speed: "TCP 最高 2.8 m/s",
    weightKg: "10-10.1 kg",
    safety: "轻量仿人构型，可选六维力版本"
  },
  software: { ros: "官方/社区资源需项目确认", ros2: "官方/社区资源需项目确认", sdk: "RealMan SDK / API / 开发文档", sim: "官方模型与仿真资源需按版本确认" },
  tags: ["长臂展"],
  sourceIds: ["SRCV8005"]
});
verify(["realman-rm63"], "RealMan 官方 RML63 规格页确认 6 自由度、3 kg 负载、900-917 mm 工作半径、±0.05 mm 重复定位精度和可选六维力版本；价格需询价。", ["SRCV8005"]);

patch("realman-rm75", {
  officialUrl: "https://www.realman-robotics.com/en/products/rm75.html",
  specs: {
    dof: "7 轴",
    payloadKg: "5 kg",
    reachM: "0.61-0.627 m",
    repeatabilityMm: "±0.05 mm",
    speed: "TCP 最高 1.8 m/s",
    weightKg: "7.8-7.9 kg",
    safety: "轻量仿人构型，可选六维力版本"
  },
  software: { ros: "官方/社区资源需项目确认", ros2: "官方/社区资源需项目确认", sdk: "RealMan SDK / API / 开发文档", sim: "官方模型与仿真资源需按版本确认" },
  sourceIds: ["SRCV8006"]
});
verify(["realman-rm75"], "RealMan 官方 RM75 规格页确认 7 自由度、5 kg 负载、610-627 mm 工作半径、±0.05 mm 重复定位精度和可选六维力版本；价格需询价。", ["SRCV8006"]);

patch("omron-ld60", {
  officialUrl: "https://robotics.omron.com/products/mobile-robots/ld-series/",
  specs: {
    dof: "AMR 移动底盘",
    payloadKg: "60 kg",
    reachM: "移动平台不适用",
    speed: "最高 1.8 m/s",
    endurance: "15 h 空载 / 12 h 满载",
    sensors: "前安全激光、后声呐、前保险杠、障碍物避让",
    safety: "EN/ANSI/UL 等安全合规口径，按地区确认"
  },
  software: { ros: "工业接口/集成商支持", ros2: "工业接口/集成商支持", sdk: "MobilePlanner / AMR 控制接口", sim: "OMRON 工业仿真与集成工具需询价" },
  sourceIds: ["SRCV8007"]
});
patch("omron-ld90", {
  officialUrl: "https://robotics.omron.com/products/mobile-robots/ld-series/",
  specs: {
    dof: "AMR 移动底盘",
    payloadKg: "90 kg",
    reachM: "移动平台不适用",
    speed: "最高 1.35 m/s",
    endurance: "15 h 空载 / 12 h 满载",
    sensors: "前安全激光、后声呐、前保险杠、障碍物避让",
    safety: "EN/ANSI/UL 等安全合规口径，按地区确认"
  },
  software: { ros: "工业接口/集成商支持", ros2: "工业接口/集成商支持", sdk: "MobilePlanner / AMR 控制接口", sim: "OMRON 工业仿真与集成工具需询价" },
  sourceIds: ["SRCV8007"]
});
verify(["omron-ld60", "omron-ld90"], "OMRON 官方 LD 系列页确认 LD-60/LD-90 负载、速度、续航、安全传感器和 MobilePlanner 控制接口；价格需询价。", ["SRCV8007"]);

for (const id of ["turtlebot4-lite", "turtlebot4-standard"]) {
  patch(id, {
    officialUrl: "https://turtlebot.github.io/turtlebot4-user-manual/",
    marketTier: "重点候选",
    verificationStatus: "官网核验",
    verificationNotes: "TurtleBot 4 官方手册确认 Lite/Standard 两款为教育科研开源平台，搭载 ROS 2、Create 3、Raspberry Pi 4、OAK-D 和 2D LiDAR；采购价格按渠道确认。",
    verifiedAt: accessedDate,
    specs: {
      dof: "差速移动底盘",
      payloadKg: "轻载教学/科研平台",
      reachM: "移动平台不适用",
      sensors: "OAK-D / 2D LiDAR / IMU / Create 3 底盘传感",
      compute: "Raspberry Pi 4",
      safety: "教学科研平台，非工业安全 AMR"
    },
    software: { ros: "ROS 生态", ros2: "官方 ROS 2 支持", sdk: "TurtleBot 4 ROS 2 包 / 教程 / GitHub 资源", sim: "Gazebo / Ignition / RViz2" },
    sourceIds: ["SRCV8008"],
    researchEvidence: ["v8 官网核验：TurtleBot 4 官方手册确认 ROS 2、传感器、仿真和教程资源，适合教学科研采购比较。"]
  });
}

for (const id of ["limx-w1", "limx-p1"]) {
  patch(id, {
    officialUrl: "https://www.limxdynamics.com/en",
    verificationStatus: "部分核验",
    verificationNotes: "LimX 官网确认公司和当前产品线，但 W1/P1 旧款官方规格页在当前站点未公开；采购前需由厂商确认是否仍可供货、正式参数和开发接口。",
    verifiedAt: accessedDate,
    sourceIds: ["SRCV8009"],
    risks: ["W1/P1 当前官网规格入口不完整，适合保留为市场覆盖项，采购前必须确认可供货状态。"],
    researchEvidence: ["v8 部分核验：LimX 官网可确认厂商和产品线，W1/P1 旧款详细规格需厂商确认。"]
  });
}

patch("limx-ollie", {
  name: "LimX Oli",
  officialUrl: "https://limxdynamics.com/en/oli/spec",
  releaseDate: "2025-07",
  releaseDateConfidence: "medium",
  marketTier: "重点候选",
  verificationStatus: "官网核验",
  verificationNotes: "LimX Oli 官方规格页确认 31 自由度、约 55 kg、约 2 h 续航、单臂 3 kg 负载、传感器/API/开发工具；价格按版本询价。",
  verifiedAt: accessedDate,
  specs: {
    dof: "31 自由度",
    payloadKg: "单臂最高 3 kg",
    reachM: "臂长约 0.7 m",
    speed: "最高 5 km/h",
    endurance: "约 2 h",
    weightKg: "≤55 kg",
    sensors: "IMU、头部/胸部/腕部/髋部深度相机、LiDAR 按版本",
    compute: "RK3588 + Orin NX/AGX Orin 背包按版本",
    safety: "手持急停，具体认证按版本确认"
  },
  software: { ros: "开发接口需版本确认", ros2: "开发接口需版本确认", sdk: "Controller API / Sensor API / 低级运动控制 API / 高级运动控制 API", sim: "Studio 可选包，一键仿真验证" },
  tags: ["全尺寸", "科研开发套件", "工业/商用"],
  sourceIds: ["SRCV8010"],
  researchEvidence: ["v8 官网核验：LimX Oli 官方规格页确认全尺寸人形硬件、传感器、API 和开发工具。"]
});

patch("ghost-vision-60", {
  officialUrl: "https://www.ghostrobotics.io/vision-60",
  specs: {
    dof: "四足平台，12 电机",
    payloadKg: "10 kg",
    reachM: "足式平台不适用",
    speed: "标准 0.9 m/s，冲刺约 2.4 m/s",
    endurance: "约 3.15 h 连续行走 / 21 h 待机",
    weightKg: "51 kg",
    sensors: "RGB 相机、D435 深度相机、RTK GPS、外部载荷接口",
    compute: "NVIDIA Xavier 32GB / 2TB NVMe",
    safety: "IP67，-40 至 55 摄氏度工作口径，按地区和场景确认"
  },
  software: { ros: "开放架构/集成接口需项目确认", ros2: "开放架构/集成接口需项目确认", sdk: "Mission Control / end-user integration architecture", sim: "企业仿真接口需询价" },
  sourceIds: ["SRCV8011"]
});
verify(["ghost-vision-60"], "Ghost Robotics Vision 60 官方规格页确认 10 kg 载荷、3 h 级连续行走、IP67、NVIDIA Xavier 和 Mission Control/开放架构口径；价格需询价。", ["SRCV8011"]);

patch("ghost-spur", {
  marketTier: "市场初筛",
  verificationStatus: "部分核验",
  verificationNotes: "Ghost 官网当前重点公开 Vision 60，Spirit/SPUR 旧款规格入口不完整；保留为历史/市场覆盖项，采购前应以 Vision 60 或厂商确认型号为准。",
  verifiedAt: accessedDate,
  sourceIds: ["SRCV8011"],
  risks: ["Spirit/SPUR 当前官方规格入口不足，建议采购比较以 Vision 60 当前官方规格为主。"],
  researchEvidence: ["v8 部分核验：Ghost 官网可核验厂商和 Vision 60 当前平台，Spirit/SPUR 需继续向厂商确认。"]
});

patch("xiaomi-cyberdog", {
  officialUrl: "https://www.mi.com/cyberdog/specs",
  releaseDate: "2021-08",
  releaseDateConfidence: "medium",
  marketTier: "重点候选",
  verificationStatus: "官网核验",
  verificationNotes: "小米官方参数页确认 CyberDog 工程探索版入口；公开资料显示为早期开发者探索机型，当前采购可得性需渠道确认。",
  verifiedAt: accessedDate,
  specs: {
    dof: "四足平台",
    payloadKg: "轻载开发平台，按官方参数/实物确认",
    reachM: "足式平台不适用",
    speed: "公开发布资料约 3.2 m/s，需以官方参数页核验",
    sensors: "摄像头、超声波、触摸、GPS/定位等多传感器",
    compute: "NVIDIA Jetson Xavier NX 口径，需以官方参数页确认",
    safety: "开发者探索版，非工业巡检安全平台"
  },
  software: { ros: "开源/社区资源需项目确认", ros2: "开源/社区资源需项目确认", sdk: "小米开源社区/开发者资源需确认当前可用性", sim: "社区仿真资源需确认" },
  sourceIds: ["SRCV8012"],
  researchEvidence: ["v8 官网核验：小米官方 CyberDog 参数页确认工程探索版官方入口；现货采购和开发资源需复核。"]
});

patch("xiaomi-cyberone", {
  officialUrl: "https://www.mi.com/global/discover/article?id=2700",
  releaseDate: "2022-08",
  releaseDateConfidence: "medium",
  marketTier: "市场初筛",
  verificationStatus: "官网核验",
  verificationNotes: "小米官方文章确认 CyberOne 发布和人形机器人定位，但未提供面向采购的量产规格、售价和交付信息；保留市场覆盖项。",
  verifiedAt: accessedDate,
  specs: {
    dof: "全尺寸人形，详细自由度未公开",
    payloadKg: "官网未披露",
    reachM: "官网未披露",
    speed: "官网未披露",
    sensors: "视觉/听觉感知演示口径",
    safety: "展示/研发平台，采购交付需官方确认"
  },
  software: { ros: "未公开", ros2: "未公开", sdk: "未公开", sim: "未公开" },
  sourceIds: ["SRCV8013"],
  risks: ["CyberOne 暂无公开量产采购参数，学校采购不宜作为近期主选。"],
  researchEvidence: ["v8 官网核验：小米官方文章确认 CyberOne 发布，但采购型规格与交付仍未公开。"]
});

patch("engineai-sa01", {
  officialUrl: "https://www.engineai.com.cn/product-sa01.html",
  releaseDate: "2024-07",
  releaseDateConfidence: "medium",
  marketTier: "重点候选",
  verificationStatus: "官网核验",
  verificationNotes: "EngineAI SA01 官方页确认全开源双足平台、12 自由度、15Ah 快拆电池、2 h 级续航和教育/开发定位；价格和交付需询价。",
  verifiedAt: accessedDate,
  specs: {
    dof: "12 自由度",
    payloadKg: "双足平台，负载需询价",
    reachM: "无上肢/按版本确认",
    endurance: "超过 2 h",
    sensors: "IMU 等，具体传感器按版本确认",
    safety: "开发/教育双足平台，场地安全需另行评估"
  },
  software: { ros: "开源软件框架，ROS/ROS2 需按发布包确认", ros2: "开源软件框架，ROS/ROS2 需按发布包确认", sdk: "全栈开源/开发接口", sim: "运动算法与仿真资源需按官方发布包确认" },
  sourceIds: ["SRCV8014"],
  researchEvidence: ["v8 官网核验：EngineAI SA01 官方页确认开源双足平台定位和关键硬件信息。"]
});

patch("engineai-se01", {
  officialUrl: "https://www.engineai.com.cn/product-se01",
  releaseDate: "2024-10",
  releaseDateConfidence: "medium",
  marketTier: "重点候选",
  verificationStatus: "官网核验",
  verificationNotes: "EngineAI SE01 官方页确认全尺寸人形、拟人步态、视听感知、灵巧手、快拆电池和接口定位；精确采购参数和报价需询价。",
  verifiedAt: accessedDate,
  specs: {
    dof: "全尺寸人形，详细自由度按官方规格确认",
    payloadKg: "灵巧手/上肢负载需询价",
    reachM: "真人比例，精确臂展需询价",
    endurance: "约 2 h 级口径，按版本确认",
    sensors: "激光雷达、深度摄像头、红外摄像头、IMU、力控传感器",
    safety: "全尺寸人形平台，教学演示需隔离和急停方案"
  },
  software: { ros: "开发接口需询价", ros2: "开发接口需询价", sdk: "官方接口/开发支持需询价", sim: "仿真与训练工具需询价" },
  sourceIds: ["SRCV8015"],
  researchEvidence: ["v8 官网核验：EngineAI SE01 官方页确认全尺寸人形、感知和灵巧手定位。"]
});

patch("galbot-g1", {
  officialUrl: "https://www.galbot.com/g1",
  marketTier: "重点候选",
  verificationStatus: "官网核验",
  verificationNotes: "Galbot G1 官方规格页确认 1730 mm 身高、双臂总 10 kg 负载、0-2.4 m 操作覆盖、10 h 续航、IP54 和 AGX Orin 计算平台；价格需询价。",
  verifiedAt: accessedDate,
  specs: {
    dof: "腿部/腰部/颈部 6 + 双臂 14 + 四轮底盘",
    payloadKg: "单臂 5 kg，总 10 kg",
    reachM: "水平约 1.9 m，垂直 0-2.1/2.4 m 覆盖",
    endurance: "满电约 10 h",
    weightKg: "约 80 kg",
    sensors: "头部双目、腕部深度相机、RGB 相机、IMU、3D LiDAR、超声波",
    compute: "NVIDIA AGX Orin 64GB / 275 TOPS",
    safety: "IP54，结构化场景为主"
  },
  software: { ros: "官方接口需询价", ros2: "官方接口需询价", sdk: "Embosar/官方开发接口需询价", sim: "仿真和数据接口需询价" },
  tags: ["移动操作", "双臂移动平台"],
  sourceIds: ["SRCV8016"],
  researchEvidence: ["v8 官网核验：Galbot G1 官方规格页确认双臂移动操作、续航、传感器和计算平台。"]
});

patch("galaxea-r1", {
  name: "Galaxea R1 Pro",
  officialUrl: "https://docs.galaxea-ai.com/Guide/R1Pro/hardware_introduction/R1Pro_Hardware_Introduction/",
  marketTier: "重点候选",
  verificationStatus: "官网核验",
  verificationNotes: "Galaxea R1 Pro 官方文档确认 26 自由度、双臂移动平台、3.5 kg 额定单臂负载、5 kg 最大单臂负载、1680 Wh 电池和科研使用边界；价格按渠道确认。",
  verifiedAt: accessedDate,
  specs: {
    dof: "26 自由度",
    payloadKg: "单臂额定 3.5 kg@0.5 m，最大 5 kg@0.5 m",
    reachM: "垂直 0-2.0 m，水平 0.716 m/带夹爪 0.861 m",
    endurance: "1680 Wh 电池，实际续航按任务",
    weightKg: "96 kg 含电池",
    sensors: "双目相机、腕部相机、底盘相机、360° LiDAR",
    compute: "NVIDIA Jetson AGX Orin 32GB",
    safety: "官方文档声明面向有经验的科研用户，非普通消费家用"
  },
  software: { ros: "官方文档/用户指南支持", ros2: "官方文档/用户指南支持", sdk: "Galaxea 文档、遥操作、导航和开发指南", sim: "官方文档/仿真资源需按版本确认" },
  sourceIds: ["SRCV8017"],
  researchEvidence: ["v8 官网核验：Galaxea R1 Pro 官方文档确认科研双臂移动平台硬件规格和使用边界。"]
});

data.meta = {
  ...data.meta,
  version: "v8",
  accessedDate,
  updateSummary: "第四批继续核验 DOBOT、RealMan、OMRON、TurtleBot、LimX、Ghost、Xiaomi、EngineAI、Galbot/Galaxea 等剩余市场初筛；能由官网规格确认的升级为重点候选，旧款或采购信息不足的保留市场初筛并写明缺口。"
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
fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", `# 学校具身智能机器人采购调研 v8\n\n更新时间：${accessedDate}\n\n## 数据概览\n\n- 候选设备：${data.robots.length} 个\n- 来源记录：${sources.length} 条\n- 市场层级：重点候选 ${tiers["重点候选"]} 个，市场初筛 ${tiers["市场初筛"]} 个\n- 核验状态：官网核验 ${verification["官网核验"]} 个，部分核验 ${verification["部分核验"]} 个，待核验 ${verification["待核验"]} 个\n- 类别分布：${categoryOrder.map((category) => `${category} ${counts[category]} 个`).join("，")}\n- 剩余缺口：发布时间未公开/未知 ${missingStats.releaseUnknown} 个，价格待询价 ${missingStats.price} 个，负载待核验/未披露 ${missingStats.payload} 个，SDK 待核验/未公开 ${missingStats.sdk} 个\n\n## 使用说明\n\nv8 继续核验 DOBOT、RealMan、OMRON、TurtleBot、LimX、Ghost、Xiaomi、EngineAI、Galbot/Galaxea。官网核验代表型号、官网入口和一组核心参数已由官方页、官方规格页或官方文档确认；价格、交付、教育折扣、现场安全改造和售后仍需正式询价。\n`);

console.log(JSON.stringify({ robots: data.robots.length, sources: sources.length, counts, tiers, verification, missingStats }, null, 2));
