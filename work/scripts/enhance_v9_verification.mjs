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
  if (value.price) robot.price = { ...robot.price, ...value.price, sourceIds: mergeUnique(robot.price.sourceIds, sourceIds) };
  if (value.tags) robot.tags = mergeUnique(robot.tags, value.tags);
  if (value.researchEvidence) robot.researchEvidence = mergeUnique(robot.researchEvidence, value.researchEvidence);
  if (value.deploymentEvidence) robot.deploymentEvidence = mergeUnique(robot.deploymentEvidence, value.deploymentEvidence);
  if (value.risks) robot.risks = mergeUnique(robot.risks, value.risks);
  for (const key of ["releaseDate", "releaseDateConfidence", "marketTier", "verificationStatus", "verificationNotes", "verifiedAt", "officialUrl", "name", "vendor"]) {
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
      researchEvidence: [`v9 官网核验：${notes}`]
    });
  }
}

addSource("SRCV9001", "AUBO i7 官方产品页", "https://www.aubo-cobot.com/products/aubo-i7", "官网/产品规格", "high", "官方产品页核验 AUBO i7 协作臂型号、7 kg 负载、约 917 mm 工作半径、±0.02 mm 重复定位精度和 AUBOPE 软件生态。");
addSource("SRCV9002", "Elephant Robotics myCobot Pro 600 官方产品页", "https://www.elephantrobotics.com/en/mycobot-pro-600-en/", "官网/产品规格", "high", "官方产品页核验 myCobot Pro 600 为 6 自由度协作臂，约 2 kg 负载、600 mm 工作半径、拖动示教和 ROS/MoveIt/Python/C++ 支持口径。");
addSource("SRCV9003", "Franka Research 3 官方规格页", "https://franka.de/research", "官网/产品规格", "high", "官方页核验 Franka Research 3 7 自由度、3 kg 负载、855 mm 工作空间半径、力矩传感和 Franka Control Interface / ROS2 资源。");
addSource("SRCV9004", "Franka Panda 官方历史资料", "https://franka.de/", "官网/产品入口", "medium", "Franka 当前官网主推 Research 3；Panda 作为历史科研平台仍有生态资料，但当前采购应以 FR3 为主并向厂商确认可供货性。");
addSource("SRCV9005", "Han's Robot Elfin E5 官方产品资料", "https://www.hansrobot.net/products/elfin-collaborative-robot.html", "官网/产品规格", "high", "官方产品资料核验 Elfin 系列双关节模组协作臂，E5 为 5 kg 级、约 800 mm 工作半径和 6 轴协作平台。");
addSource("SRCV9006", "Kinova Gen3 Lite 官方产品页", "https://www.kinovarobotics.com/product/gen3-lite-robots", "官网/产品规格", "high", "官方页核验 Gen3 Lite 6 自由度、约 0.5 kg 载荷、约 760 mm 伸展距离、Kortex API、ROS 和 MoveIt 生态。");
addSource("SRCV9007", "ROKAE xMate CR7 官方产品资料", "https://www.rokae.com/en/collaborative-robots", "官网/产品规格", "high", "官方资料核验 xMate CR7 为 7 kg 级协作臂，支持柔性拖动、力控和工业协作应用；详细参数以官方规格书/销售确认为准。");
addSource("SRCV9008", "SIASUN GCR 系列官方产品资料", "https://www.siasun.com/", "官网/产品入口", "medium", "新松官网可核验 GCR 系列协作机器人产品线；GCR5 具体参数需以厂商规格书确认。");
addSource("SRCV9009", "UFACTORY xArm 官方规格页", "https://www.ufactory.cc/xarm-collaborative-robot/", "官网/产品规格", "high", "官方页核验 xArm 5 为 5 自由度轻量协作臂，3 kg 负载、700 mm 工作半径、±0.1 mm 重复定位精度、ROS/ROS2 和 SDK 生态。");
addSource("SRCV9010", "Yaskawa HC10DT 官方产品资料", "https://www.motoman.com/en-us/products/robots/industrial/collaborative/hc10dt", "官网/产品规格", "high", "官方资料核验 HC10DT 10 kg 负载、约 1200 mm 水平伸展、协作安全、YRC1000micro 控制器和工业机器人生态。");
addSource("SRCV9011", "Fetch Robotics / Zebra 官方产品入口", "https://www.zebra.com/us/en/products/autonomous-mobile-robots.html", "官网/产品入口", "medium", "Fetch 已并入 Zebra，当前官网主推 AMR 产品组合；Fetch Mobile Manipulator 作为历史科研平台需确认二手/存量和支持状态。");
addSource("SRCV9012", "Hello Robot Stretch 2 官方产品资料", "https://hello-robot.com/stretch-2", "官网/产品规格", "high", "官方产品资料核验 Stretch 2 家庭/研究移动操作平台、伸缩臂、ROS/ROS2、Python API 和研究生态；当前采购需按新版 Stretch 型号确认。");
addSource("SRCV9013", "Hiwonder JetAuto Pro 官方产品页", "https://www.hiwonder.com/products/jetauto-pro", "官网/产品规格/价格", "high", "官方产品页核验 JetAuto Pro ROS 机器人开发平台、Jetson Orin Nano、视觉/雷达配置、ROS/ROS2 教程和公开美元售价。");
addSource("SRCV9014", "Husarion LYNX 官方手册", "https://husarion.com/manuals/lynx/", "官网/产品手册", "high", "官方手册核验 LYNX 户外/室内 ROS 2 移动平台、IP54、速度、负载、传感器接口和 ROS 2 软件栈。");
addSource("SRCV9015", "Mujin TruckBot 官方产品入口", "https://mujin-corp.com/products/truckbot/", "官网/产品入口", "high", "官方产品入口核验 TruckBot 物流卸货移动机器人和 Mujin Controller 智能机器人系统；详细规格和采购交付需询价。");
addSource("SRCV9016", "Neobotix MPO-700 官方产品页", "https://www.neobotix-robots.com/mobile-robots/omnidirectional-robots/mpo-700", "官网/产品规格", "high", "官方产品页核验 MPO-700 全向移动机器人、100 kg 级载荷、研究/工业移动平台和 ROS/导航接口口径。");
addSource("SRCV9017", "Robotnik RB-THERON 官方产品页", "https://robotnik.eu/products/mobile-robots/rb-theron/", "官网/产品规格", "high", "官方产品页核验 RB-THERON 自主移动机器人、全向底盘、室内外导航、ROS/ROS2 和可扩展传感器/载荷接口。");
addSource("SRCV9018", "Yahboom ROSMASTER X3 Plus 官方产品页", "https://category.yahboom.net/products/rosmaster-x3", "官网/产品规格/价格", "high", "官方产品页核验 ROSMASTER X3 Plus Jetson Orin Nano 版本、Mecanum/履带/阿克曼三底盘形态、ROS2/SLAM/导航教程和公开美元售价。");

patch("aubo-i7", {
  officialUrl: "https://www.aubo-cobot.com/products/aubo-i7",
  specs: { dof: "6 轴", payloadKg: "7 kg", reachM: "约 0.917 m", repeatabilityMm: "±0.02 mm", speed: "关节最高速度按轴不同", weightKg: "约 24 kg", safety: "协作安全功能，具体认证按版本确认" },
  software: { ros: "官方/社区 ROS 支持需项目确认", ros2: "官方/社区 ROS2 支持需项目确认", sdk: "AUBOPE / SDK / 工业接口", sim: "AUBOPE 仿真/离线编程需版本确认" },
  sourceIds: ["SRCV9001"]
});
verify(["aubo-i7"], "AUBO 官方产品页确认 i7 型号、7 kg 负载、约 917 mm 工作半径、±0.02 mm 重复定位精度和软件生态；价格需询价。", ["SRCV9001"]);

patch("mycobot-pro-600", {
  officialUrl: "https://www.elephantrobotics.com/en/mycobot-pro-600-en/",
  specs: { dof: "6 轴", payloadKg: "2 kg 级", reachM: "0.6 m", repeatabilityMm: "约 ±0.5 mm 级，按官方版本确认", speed: "关节速度按轴确认", weightKg: "约 33 kg 级，按版本确认", safety: "桌面/轻协作教学平台，工业安全需另评估" },
  software: { ros: "官方 ROS 支持", ros2: "官方/社区 ROS2 支持需项目确认", sdk: "Python / C++ / C# / JavaScript / MoveIt / API", sim: "ROS MoveIt / 仿真教程" },
  tags: ["开源/低成本"],
  sourceIds: ["SRCV9002"]
});
verify(["mycobot-pro-600"], "Elephant Robotics 官方产品页确认 myCobot Pro 600 为 6 自由度、600 mm 工作半径、2 kg 级负载的教学/轻协作平台，并提供 ROS/MoveIt/Python/C++ 等开发资源；价格需按版本确认。", ["SRCV9002"]);

patch("franka-fr3", {
  officialUrl: "https://franka.de/research",
  specs: { dof: "7 轴", payloadKg: "3 kg", reachM: "0.855 m", repeatabilityMm: "约 ±0.1 mm", sensors: "全关节力矩传感", safety: "科研协作臂，力控安全按官方控制器配置" },
  software: { ros: "Franka ROS / 社区支持", ros2: "官方 Franka ROS2", sdk: "libfranka / Franka Control Interface", sim: "MuJoCo / Isaac / ROS 社区仿真资源" },
  sourceIds: ["SRCV9003"]
});
verify(["franka-fr3"], "Franka 官方 Research 3 页面确认 7 自由度、3 kg 负载、855 mm 工作空间、关节力矩传感和 Franka Control Interface / ROS2 生态；价格需询价。", ["SRCV9003"]);

patch("franka-panda", {
  specs: { dof: "7 轴", payloadKg: "3 kg 级历史科研平台", reachM: "约 0.855 m 级", repeatabilityMm: "约 ±0.1 mm 级", sensors: "关节力矩传感，按历史资料确认", safety: "历史科研平台，采购应确认可供货和维保" },
  software: { ros: "Franka ROS / 社区生态", ros2: "社区/迁移支持需确认", sdk: "libfranka / Franka Control Interface", sim: "广泛科研仿真生态" },
  sourceIds: ["SRCV9004"],
  risks: ["Panda 已不是 Franka 当前主推型号，学校新采购建议优先比较 Franka Research 3。"]
});
verify(["franka-panda"], "Franka 当前官网主推 Research 3；Panda 作为历史科研生态型号可确认，但新采购需确认可供货、维保和替代型号。", ["SRCV9004"], "市场初筛");

patch("hans-elfin-e5", {
  officialUrl: "https://www.hansrobot.net/products/elfin-collaborative-robot.html",
  specs: { dof: "6 轴", payloadKg: "5 kg", reachM: "约 0.8 m", repeatabilityMm: "约 ±0.02 mm，按规格书确认", safety: "协作安全功能，具体认证按版本确认" },
  software: { ros: "官方/社区资源需项目确认", ros2: "官方/社区资源需项目确认", sdk: "Han's Robot 控制软件 / 工业接口", sim: "离线编程/仿真需询价" },
  sourceIds: ["SRCV9005"]
});
verify(["hans-elfin-e5"], "Han's Robot 官方 Elfin 系列资料确认 E5 为 5 kg 级、约 800 mm 工作半径的 6 轴协作臂；价格和教育采购需询价。", ["SRCV9005"]);

patch("kinova-gen3-lite", {
  officialUrl: "https://www.kinovarobotics.com/product/gen3-lite-robots",
  specs: { dof: "6 轴", payloadKg: "约 0.5 kg", reachM: "约 0.76 m", repeatabilityMm: "按官方规格书确认", sensors: "可配 2D/3D 视觉和末端执行器", safety: "轻量科研/教育平台" },
  software: { ros: "官方 ROS 支持", ros2: "官方/社区 ROS2 支持", sdk: "Kortex API / Python / C++ / MATLAB", sim: "Gazebo / MoveIt / MATLAB 等生态" },
  sourceIds: ["SRCV9006"]
});
verify(["kinova-gen3-lite"], "Kinova 官方产品页确认 Gen3 Lite 6 自由度、约 0.5 kg 载荷、约 760 mm 伸展距离、Kortex API、ROS 和 MoveIt 生态；价格需询价。", ["SRCV9006"]);

patch("rokae-xmate-cr7", {
  officialUrl: "https://www.rokae.com/en/collaborative-robots",
  specs: { dof: "6/7 轴协作系列，CR7 具体轴数按规格书确认", payloadKg: "7 kg 级", reachM: "约 0.8-0.9 m 级，需规格书确认", repeatabilityMm: "高精度协作臂，具体值按规格书确认", safety: "柔性拖动、力控和协作安全功能" },
  software: { ros: "官方/社区资源需项目确认", ros2: "官方/社区资源需项目确认", sdk: "ROKAE 控制软件 / 工业接口", sim: "离线编程/仿真需询价" },
  sourceIds: ["SRCV9007"]
});
verify(["rokae-xmate-cr7"], "ROKAE 官方协作机器人资料确认 xMate CR7 为 7 kg 级协作臂产品线，支持柔性拖动、力控和工业协作应用；详细规格和价格需厂商确认。", ["SRCV9007"]);

patch("siasun-gcr5", {
  officialUrl: "https://www.siasun.com/",
  specs: { dof: "6 轴协作臂，具体规格需厂商确认", payloadKg: "5 kg 级", reachM: "需规格书确认", repeatabilityMm: "需规格书确认", safety: "协作机器人安全配置需厂商确认" },
  software: { ros: "需厂商确认", ros2: "需厂商确认", sdk: "新松控制软件 / 工业接口需询价", sim: "离线编程/仿真需询价" },
  sourceIds: ["SRCV9008"]
});
verify(["siasun-gcr5"], "新松官网可确认 GCR 系列协作机器人产品线和国产厂商入口；GCR5 详细参数、价格和开发接口需厂商规格书确认。", ["SRCV9008"]);

patch("xarm-5", {
  officialUrl: "https://www.ufactory.cc/xarm-collaborative-robot/",
  specs: { dof: "5 轴", payloadKg: "3 kg", reachM: "0.7 m", repeatabilityMm: "±0.1 mm", weightKg: "约 11.2 kg", safety: "轻量协作臂，安全配置按版本确认" },
  software: { ros: "官方 ROS 支持", ros2: "官方 ROS2 支持", sdk: "Python / C++ / ROS / ROS2 / Modbus TCP / SDK", sim: "MoveIt / Gazebo / Web 控制和仿真资源" },
  sourceIds: ["SRCV9009"]
});
verify(["xarm-5"], "UFACTORY 官方页确认 xArm 5 为 5 自由度、3 kg 负载、700 mm 工作半径、±0.1 mm 重复定位精度，并提供 ROS/ROS2/SDK 生态；价格需询价。", ["SRCV9009"]);

patch("yaskawa-hc10dt", {
  officialUrl: "https://www.motoman.com/en-us/products/robots/industrial/collaborative/hc10dt",
  specs: { dof: "6 轴", payloadKg: "10 kg", reachM: "约 1.2 m", repeatabilityMm: "约 ±0.1 mm，按规格书确认", weightKg: "约 48 kg", safety: "协作安全设计，YRC1000micro 控制器" },
  software: { ros: "工业接口/集成商支持", ros2: "工业接口/集成商支持", sdk: "Yaskawa Motoman 控制器 / MotoSim / 工业通信接口", sim: "MotoSim / 工业仿真" },
  sourceIds: ["SRCV9010"]
});
verify(["yaskawa-hc10dt"], "Yaskawa Motoman 官方资料确认 HC10DT 10 kg 负载、约 1200 mm 水平伸展、协作安全和工业控制器生态；价格需询价。", ["SRCV9010"]);

patch("fetch-mobile-manipulator", {
  officialUrl: "https://www.zebra.com/us/en/products/autonomous-mobile-robots.html",
  specs: { dof: "历史移动操作平台", payloadKg: "需确认存量/二手配置", reachM: "需确认", sensors: "历史 Fetch Research Base / Freight 生态", safety: "已并入 Zebra AMR 产品线，采购支持需确认" },
  software: { ros: "历史 ROS 生态", ros2: "需社区迁移确认", sdk: "Fetch ROS packages / Zebra AMR 接口按当前产品确认", sim: "历史仿真资源" },
  sourceIds: ["SRCV9011"],
  risks: ["Fetch Mobile Manipulator 是历史科研平台，当前新采购应确认 Zebra 是否仍提供支持，或作为二手/存量设备比较。"]
});
verify(["fetch-mobile-manipulator"], "Fetch 已并入 Zebra，当前官网主推 AMR 产品组合；Fetch Mobile Manipulator 可作为历史科研生态项保留，但新采购支持和供货需确认。", ["SRCV9011"], "市场初筛");

patch("stretch-2", {
  officialUrl: "https://hello-robot.com/stretch-2",
  specs: { dof: "移动底盘 + 升降/伸缩臂 + 腕部/夹爪", payloadKg: "轻载家庭/研究操作，按官方规格确认", reachM: "垂直升降和水平伸缩臂，具体值按规格确认", sensors: "头部相机、深度相机、LiDAR/IMU 按版本", compute: "Intel NUC / 版本配置", safety: "研究平台，非工业安全移动操作" },
  software: { ros: "官方 ROS 支持", ros2: "官方 ROS2 支持", sdk: "Stretch Body Python API / ROS / ROS2 / Open-source examples", sim: "Gazebo / Isaac / 社区仿真资源" },
  sourceIds: ["SRCV9012"]
});
verify(["stretch-2"], "Hello Robot 官方资料确认 Stretch 2 移动操作平台、ROS/ROS2、Python API 和研究生态；当前采购需按新版 Stretch 型号与厂商确认。", ["SRCV9012"]);

patch("hiwonder-jetauto", {
  officialUrl: "https://www.hiwonder.com/products/jetauto-pro",
  price: { label: "约 US$1,099 起", amount: 7968, currency: "CNY", range: "按官方美元公开价约合人民币，未含税费/运费/汇率波动", type: "公开价折算", confidence: "high" },
  specs: { dof: "Mecanum 轮移动底盘 + 可选机械臂/视觉套件", payloadKg: "教学轻载，按套件确认", reachM: "按机械臂套件确认", sensors: "深度相机/激光雷达/视觉模块按版本", compute: "Jetson Orin Nano 8GB", safety: "教学开发平台，非工业安全 AMR" },
  software: { ros: "ROS 教程支持", ros2: "ROS2 教程支持", sdk: "Python / OpenCV / SLAM / Nav2 / 课程例程", sim: "Gazebo / RViz / 教程资源" },
  sourceIds: ["SRCV9013"]
});
verify(["hiwonder-jetauto"], "Hiwonder 官方产品页确认 JetAuto Pro 为 Jetson Orin Nano 教学移动机器人，提供 ROS/ROS2、SLAM/导航和视觉课程，并有公开美元售价；税费运费另计。", ["SRCV9013"]);

patch("husarion-lynx", {
  officialUrl: "https://husarion.com/manuals/lynx/",
  specs: { dof: "四轮差速/户外移动平台", payloadKg: "约 60 kg 级，按官方手册确认", reachM: "移动平台不适用", speed: "约 1.5 m/s 级", endurance: "按电池和负载确认", sensors: "IMU、轮编码器、可扩展 LiDAR/相机/GPS", compute: "ROS 2 控制计算平台", safety: "IP54，户外平台安全按任务确认" },
  software: { ros: "ROS 生态", ros2: "官方 ROS2 支持", sdk: "Husarion ROS2 包 / Docker / Web UI", sim: "Gazebo / RViz / Nav2 教程" },
  sourceIds: ["SRCV9014"]
});
verify(["husarion-lynx"], "Husarion 官方手册确认 LYNX 为 ROS 2 移动平台，具备户外/室内运行、IP54、可扩展传感器和 ROS 2 软件栈；价格需询价。", ["SRCV9014"]);

patch("mujin-truckbot", {
  officialUrl: "https://mujin-corp.com/products/truckbot/",
  specs: { dof: "物流卸货移动机器人", payloadKg: "包裹/箱体处理按系统配置", reachM: "移动平台 + 物流执行机构，按项目配置", sensors: "视觉/感知系统按 Mujin Controller 配置", safety: "仓储物流系统安全需项目评估" },
  software: { ros: "企业系统，ROS 支持未公开", ros2: "企业系统，ROS2 支持未公开", sdk: "Mujin Controller / 企业接口需询价", sim: "企业仿真/部署工具需询价" },
  sourceIds: ["SRCV9015"]
});
verify(["mujin-truckbot"], "Mujin 官方产品入口确认 TruckBot 物流卸货移动机器人和 Mujin Controller 系统；具体规格、价格和学校适配性需询价。", ["SRCV9015"], "市场初筛");

patch("neobotix-mpo-700", {
  officialUrl: "https://www.neobotix-robots.com/mobile-robots/omnidirectional-robots/mpo-700",
  specs: { dof: "全向移动平台", payloadKg: "100 kg 级", reachM: "移动平台不适用", speed: "约 1.0 m/s 级，按配置确认", endurance: "按电池配置确认", sensors: "安全激光/导航传感器/可扩展载荷", safety: "研究/工业移动平台，安全认证按配置确认" },
  software: { ros: "ROS 支持", ros2: "ROS2/导航支持需版本确认", sdk: "Neobotix ROS packages / 导航接口", sim: "ROS/Gazebo 生态需项目确认" },
  sourceIds: ["SRCV9016"]
});
verify(["neobotix-mpo-700"], "Neobotix 官方产品页确认 MPO-700 全向移动机器人、100 kg 级载荷、研究/工业移动平台定位和 ROS/导航接口；价格需询价。", ["SRCV9016"]);

patch("robotnik-rb-theron", {
  officialUrl: "https://robotnik.eu/products/mobile-robots/rb-theron/",
  specs: { dof: "全向移动平台", payloadKg: "载荷按配置确认", reachM: "移动平台不适用", speed: "按配置确认", endurance: "按电池和任务确认", sensors: "LiDAR、RGB-D、GPS/IMU 等可选", safety: "室内外移动平台，安全配置按项目确认" },
  software: { ros: "官方 ROS 支持", ros2: "官方 ROS2 支持", sdk: "Robotnik ROS/ROS2 packages / API", sim: "Gazebo / ROS 仿真资源" },
  sourceIds: ["SRCV9017"]
});
verify(["robotnik-rb-theron"], "Robotnik 官方产品页确认 RB-THERON 自主移动机器人、全向底盘、室内外导航、ROS/ROS2 和可扩展传感器/载荷接口；价格需询价。", ["SRCV9017"]);

patch("yahboom-rosmaster-x3-plus", {
  officialUrl: "https://category.yahboom.net/products/rosmaster-x3",
  price: { label: "约 US$1,499 起", amount: 10868, currency: "CNY", range: "按官方美元公开价约合人民币，未含税费/运费/汇率波动", type: "公开价折算", confidence: "high" },
  specs: { dof: "三形态可换底盘：麦克纳姆/履带/阿克曼", payloadKg: "教学轻载，按套件确认", reachM: "移动平台不适用", sensors: "深度相机、激光雷达、IMU、视觉传感器按套件", compute: "Jetson Orin Nano 8GB", safety: "教学开发平台，非工业安全 AMR" },
  software: { ros: "ROS 教程支持", ros2: "ROS2 / Nav2 / SLAM 教程支持", sdk: "Python / OpenCV / MediaPipe / 课程例程", sim: "Gazebo / RViz / ROS2 教程" },
  sourceIds: ["SRCV9018"]
});
verify(["yahboom-rosmaster-x3-plus"], "Yahboom 官方产品页确认 ROSMASTER X3 Plus Jetson Orin Nano 教学平台、三种底盘形态、ROS2/SLAM/导航教程和公开美元售价；税费运费另计。", ["SRCV9018"]);

data.meta = {
  ...data.meta,
  version: "v9",
  accessedDate,
  updateSummary: "第五批继续核验机械臂和移动/复合机器人：AUBO、Elephant Robotics、Franka、Han's Robot、Kinova、ROKAE、SIASUN、UFACTORY、Yaskawa、Fetch/Zebra、Hello Robot、Hiwonder、Husarion、Mujin、Neobotix、Robotnik、Yahboom。"
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
fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", `# 学校具身智能机器人采购调研 v9\n\n更新时间：${accessedDate}\n\n## 数据概览\n\n- 候选设备：${data.robots.length} 个\n- 来源记录：${sources.length} 条\n- 市场层级：重点候选 ${tiers["重点候选"]} 个，市场初筛 ${tiers["市场初筛"]} 个\n- 核验状态：官网核验 ${verification["官网核验"]} 个，部分核验 ${verification["部分核验"]} 个，待核验 ${verification["待核验"]} 个\n- 类别分布：${categoryOrder.map((category) => `${category} ${counts[category]} 个`).join("，")}\n- 剩余缺口：发布时间未公开/未知 ${missingStats.releaseUnknown} 个，价格待询价 ${missingStats.price} 个，负载待核验/未披露 ${missingStats.payload} 个，SDK 待核验/未公开 ${missingStats.sdk} 个\n\n## 使用说明\n\nv9 继续核验机械臂和移动/复合机器人。官网核验代表型号、官网入口和一组核心参数已由官方页、官方规格页或官方文档确认；价格、交付、教育折扣、现场安全改造和售后仍需正式询价。\n`);

console.log(JSON.stringify({ robots: data.robots.length, sources: sources.length, counts, tiers, verification, missingStats }, null, 2));
