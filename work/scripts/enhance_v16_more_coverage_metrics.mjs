import fs from "node:fs";

const DATA_PATHS = ["app/src/robotResearchData.json", "work/data/robot_research_data.json"];

const brandSources = {
  "Universal Robots": ["https://www.universal-robots.com/products/", "Universal Robots 官方产品目录"],
  "OMRON": ["https://automation.omron.com/en/us/products/family/TM-Collaborative-Robots", "OMRON TM 协作机器人官方入口"],
  "ROKAE": ["https://www.rokae.com/", "珞石机器人官方产品入口"],
  "FAIRINO": ["https://www.fairino.com/", "法奥机器人官方产品入口"],
  "Hans Robot": ["https://www.hansrobot.com/", "大族机器人官方产品入口"],
  "Mecademic": ["https://www.mecademic.com/", "Mecademic 官方产品入口"],
  "DENSO Robotics": ["https://www.densorobotics.com/", "DENSO Robotics 官方产品入口"],
  "Epson Robots": ["https://epson.com/For-Work/Robots/c/w150", "Epson Robots 官方产品入口"],
  "Staubli": ["https://www.staubli.com/global/en/robotics.html", "Staubli Robotics 官方产品入口"],
  "Niryo": ["https://niryo.com/", "Niryo 官方产品入口"],
  "Elephant Robotics": ["https://www.elephantrobotics.com/en/", "大象机器人官方产品入口"],
  "Trossen Robotics": ["https://www.trossenrobotics.com/", "Trossen Robotics 官方产品入口"],
  "Clearpath Robotics": ["https://clearpathrobotics.com/robots/", "Clearpath Robotics 官方产品入口"],
  "Robotnik": ["https://robotnik.eu/products/", "Robotnik 官方产品目录"],
  "PAL Robotics": ["https://pal-robotics.com/robots/", "PAL Robotics 官方产品目录"],
  "Keenon Robotics": ["https://www.keenon.com/", "擎朗智能官方产品入口"],
  "Pudu Robotics": ["https://www.pudurobotics.com/", "普渡机器人官方产品入口"],
  "Gaussian Robotics": ["https://www.gs-robot.com/", "高仙机器人官方产品入口"],
  "Slamtec": ["https://www.slamtec.com/", "思岚科技官方产品入口"],
  "Segway Robotics": ["https://robotics.segway.com/", "Segway Robotics 官方产品入口"],
  "Unitree": ["https://www.unitree.com/", "宇树科技官方产品入口"],
  "DEEP Robotics": ["https://www.deeprobotics.cn/", "云深处科技官方产品入口"],
  "ANYbotics": ["https://www.anybotics.com/", "ANYbotics 官方产品入口"],
  "Boston Dynamics": ["https://bostondynamics.com/", "Boston Dynamics 官方产品入口"],
  "RAIBO": ["https://www.raibot.com/", "RAIBO 官方产品入口"],
  "Fourier Intelligence": ["https://www.fftai.com/", "傅利叶智能官方产品入口"],
  "RobotEra": ["https://www.robotera.com/", "星动纪元官方产品入口"],
  "Galbot": ["https://www.galbot.com/", "银河通用官方产品入口"],
  "NEURA Robotics": ["https://www.neura-robotics.com/", "NEURA Robotics 官方产品入口"],
  "1X Technologies": ["https://www.1x.tech/", "1X Technologies 官方产品入口"],
  "Hanson Robotics": ["https://www.hansonrobotics.com/", "Hanson Robotics 官方产品入口"],
  "Open Robotics": ["https://www.openrobotics.org/", "Open Robotics 官方入口"],
  "Open Source Robotics Foundation": ["https://www.openrobotics.org/", "OSRF 官方入口"]
};

const additions = [
  ["ur3e", "Universal Robots UR3e", "Universal Robots", "机械臂", "丹麦", false, "丹麦", ["协作臂", "科研平台"], "主流在售"],
  ["ur10e", "Universal Robots UR10e", "Universal Robots", "机械臂", "丹麦", false, "丹麦", ["协作臂", "工业臂"], "主流在售"],
  ["ur16e", "Universal Robots UR16e", "Universal Robots", "机械臂", "丹麦", false, "丹麦", ["协作臂", "工业臂"], "主流在售"],
  ["ur20", "Universal Robots UR20", "Universal Robots", "机械臂", "丹麦", false, "丹麦", ["协作臂", "工业臂"], "主流在售"],
  ["ur30", "Universal Robots UR30", "Universal Robots", "机械臂", "丹麦", false, "丹麦", ["协作臂", "工业臂"], "主流在售"],
  ["omron-tm5-700", "OMRON TM5-700", "OMRON", "机械臂", "日本", false, "日本", ["协作臂"], "主流在售"],
  ["omron-tm12", "OMRON TM12", "OMRON", "机械臂", "日本", false, "日本", ["协作臂", "工业臂"], "主流在售"],
  ["omron-tm14", "OMRON TM14", "OMRON", "机械臂", "日本", false, "日本", ["协作臂", "工业臂"], "主流在售"],
  ["rokae-xmate-er3", "ROKAE xMate ER3", "ROKAE", "机械臂", "中国", true, "北京", ["协作臂", "轻量臂"], "主流在售"],
  ["rokae-xmate-er7", "ROKAE xMate ER7", "ROKAE", "机械臂", "中国", true, "北京", ["协作臂", "轻量臂"], "主流在售"],
  ["rokae-xb7", "ROKAE XB7", "ROKAE", "机械臂", "中国", true, "北京", ["工业臂"], "主流在售"],
  ["fairino-fr3", "FAIRINO FR3", "FAIRINO", "机械臂", "中国", true, "深圳", ["协作臂"], "主流在售"],
  ["fairino-fr5", "FAIRINO FR5", "FAIRINO", "机械臂", "中国", true, "深圳", ["协作臂"], "主流在售"],
  ["fairino-fr10", "FAIRINO FR10", "FAIRINO", "机械臂", "中国", true, "深圳", ["协作臂", "工业臂"], "主流在售"],
  ["fairino-fr16", "FAIRINO FR16", "FAIRINO", "机械臂", "中国", true, "深圳", ["协作臂", "工业臂"], "主流在售"],
  ["hans-elfin-e05", "Hans Robot Elfin E05", "Hans Robot", "机械臂", "中国", true, "深圳", ["协作臂"], "主流在售"],
  ["hans-elfin-e10", "Hans Robot Elfin E10", "Hans Robot", "机械臂", "中国", true, "深圳", ["协作臂", "工业臂"], "主流在售"],
  ["hans-s-series", "Hans Robot S Series", "Hans Robot", "机械臂", "中国", true, "深圳", ["协作臂"], "主流在售"],
  ["mecademic-meca500", "Mecademic Meca500", "Mecademic", "机械臂", "加拿大", false, "加拿大", ["桌面机械臂", "科研平台"], "科研常用"],
  ["mecademic-mcs500", "Mecademic MCS500 SCARA", "Mecademic", "机械臂", "加拿大", false, "加拿大", ["桌面机械臂", "工业臂"], "主流在售"],
  ["denso-cobotta", "DENSO COBOTTA", "DENSO Robotics", "机械臂", "日本", false, "日本", ["桌面机械臂", "协作臂"], "科研常用"],
  ["denso-cobotta-pro-900", "DENSO COBOTTA PRO 900", "DENSO Robotics", "机械臂", "日本", false, "日本", ["协作臂", "工业臂"], "主流在售"],
  ["epson-vt6l", "Epson VT6L", "Epson Robots", "机械臂", "日本", false, "日本", ["工业臂"], "主流在售"],
  ["epson-ls3", "Epson LS3", "Epson Robots", "机械臂", "日本", false, "日本", ["工业臂"], "主流在售"],
  ["staubli-tx2-60", "Staubli TX2-60", "Staubli", "机械臂", "瑞士", false, "瑞士", ["工业臂"], "主流在售"],
  ["staubli-ts2-60", "Staubli TS2-60 SCARA", "Staubli", "机械臂", "瑞士", false, "瑞士", ["工业臂"], "主流在售"],
  ["niryo-ned2", "Niryo Ned2", "Niryo", "机械臂", "法国", false, "法国", ["桌面机械臂", "教育版", "开源/低成本"], "教育/低成本"],
  ["widowx-250s", "Trossen WidowX 250s", "Trossen Robotics", "机械臂", "美国", false, "美国", ["桌面机械臂", "开源/低成本"], "科研常用"],
  ["aloha-stationary", "ALOHA Stationary 双臂", "Trossen Robotics", "机械臂", "美国", false, "美国", ["双臂", "开源/低成本", "科研平台"], "开源/组合方案"],

  ["clearpath-dingo", "Clearpath Dingo", "Clearpath Robotics", "移动/复合机器人", "加拿大", false, "加拿大", ["轮式底盘", "科研平台"], "科研常用"],
  ["clearpath-turtlebot4", "Clearpath TurtleBot 4", "Clearpath Robotics", "移动/复合机器人", "加拿大", false, "加拿大", ["教学移动平台", "轮式底盘"], "教育/低成本"],
  ["robotnik-rb-1-base", "Robotnik RB-1 BASE", "Robotnik", "移动/复合机器人", "西班牙", false, "西班牙", ["轮式底盘", "科研平台"], "科研常用"],
  ["robotnik-rb-1-mobile-manipulator", "Robotnik RB-1 Mobile Manipulator", "Robotnik", "移动/复合机器人", "西班牙", false, "西班牙", ["移动操作"], "科研常用"],
  ["pal-stockbot", "PAL StockBot", "PAL Robotics", "移动/复合机器人", "西班牙", false, "西班牙", ["服务/巡检"], "主流在售"],
  ["keenon-t8", "Keenon T8", "Keenon Robotics", "移动/复合机器人", "中国", true, "上海", ["服务/巡检"], "主流在售"],
  ["keenon-t10", "Keenon T10", "Keenon Robotics", "移动/复合机器人", "中国", true, "上海", ["服务/巡检"], "主流在售"],
  ["keenon-butlerbot-w3", "Keenon Butlerbot W3", "Keenon Robotics", "移动/复合机器人", "中国", true, "上海", ["服务/巡检"], "主流在售"],
  ["pudu-bellabot", "Pudu BellaBot", "Pudu Robotics", "移动/复合机器人", "中国", true, "深圳", ["服务/巡检"], "主流在售"],
  ["pudu-kettybot", "Pudu KettyBot", "Pudu Robotics", "移动/复合机器人", "中国", true, "深圳", ["服务/巡检"], "主流在售"],
  ["pudu-cc1", "Pudu CC1", "Pudu Robotics", "移动/复合机器人", "中国", true, "深圳", ["服务/巡检"], "主流在售"],
  ["gaussian-scrubber-75", "Gaussian Scrubber 75", "Gaussian Robotics", "移动/复合机器人", "中国", true, "上海", ["服务/巡检"], "主流在售"],
  ["gaussian-vacuum-40", "Gaussian Vacuum 40", "Gaussian Robotics", "移动/复合机器人", "中国", true, "上海", ["服务/巡检"], "主流在售"],
  ["slamtec-athena2", "Slamtec Athena 2.0", "Slamtec", "移动/复合机器人", "中国", true, "上海", ["服务/巡检", "轮式底盘"], "主流在售"],
  ["segway-rmp-lite-220", "Segway RMP Lite 220", "Segway Robotics", "移动/复合机器人", "美国/中国", false, "美国/中国", ["轮式底盘", "科研平台"], "科研常用"],
  ["turtlebot3-burger", "TurtleBot3 Burger", "Open Robotics", "移动/复合机器人", "韩国/美国", false, "韩国/美国", ["教学移动平台", "开源/低成本"], "教育/低成本"],
  ["turtlebot3-waffle-pi", "TurtleBot3 Waffle Pi", "Open Robotics", "移动/复合机器人", "韩国/美国", false, "韩国/美国", ["教学移动平台", "开源/低成本"], "教育/低成本"],
  ["turtlebot4-lite", "TurtleBot4 Lite", "Open Source Robotics Foundation", "移动/复合机器人", "加拿大/美国", false, "加拿大/美国", ["教学移动平台", "开源/低成本"], "教育/低成本"],

  ["fourier-gr1-t2", "Fourier GR-1 T2", "Fourier Intelligence", "人形机器人", "中国", true, "上海", ["全尺寸", "科研开发套件"], "主流在售"],
  ["robotera-star1", "RobotEra STAR1", "RobotEra", "人形机器人", "中国", true, "北京", ["全尺寸", "工业/商用"], "主流在售"],
  ["robotera-xhand1", "RobotEra XHand1", "RobotEra", "人形机器人", "中国", true, "北京", ["科研开发套件"], "主流在售"],
  ["galbot-g1", "Galbot G1", "Galbot", "人形机器人", "中国", true, "北京", ["全尺寸", "科研开发套件"], "主流在售"],
  ["neura-4ne1", "NEURA 4NE-1", "NEURA Robotics", "人形机器人", "德国", false, "德国", ["全尺寸", "工业/商用"], "主流在售"],
  ["neura-mipa", "NEURA MiPA", "NEURA Robotics", "人形机器人", "德国", false, "德国", ["服务/巡检", "工业/商用"], "主流在售"],
  ["1x-neo", "1X NEO", "1X Technologies", "人形机器人", "挪威/美国", false, "挪威/美国", ["全尺寸", "工业/商用"], "主流在售"],
  ["1x-eve", "1X EVE", "1X Technologies", "人形机器人", "挪威/美国", false, "挪威/美国", ["全尺寸", "工业/商用"], "主流在售"],
  ["hanson-sophia", "Hanson Robotics Sophia", "Hanson Robotics", "人形机器人", "中国香港/美国", false, "中国香港/美国", ["全尺寸", "教育版"], "历史/供货待确认"],

  ["unitree-go1", "Unitree Go1", "Unitree", "机器狗", "中国", true, "杭州", ["消费级", "科研开发"], "历史/供货待确认"],
  ["unitree-b1", "Unitree B1", "Unitree", "机器狗", "中国", true, "杭州", ["工业巡检", "负载型"], "历史/供货待确认"],
  ["unitree-b2-w", "Unitree B2-W", "Unitree", "机器狗", "中国", true, "杭州", ["轮足/足式", "工业巡检", "负载型"], "主流在售"],
  ["deeprobotics-x20", "DEEP Robotics X20", "DEEP Robotics", "机器狗", "中国", true, "杭州", ["工业巡检", "负载型"], "主流在售"],
  ["deeprobotics-lynx", "DEEP Robotics Lynx", "DEEP Robotics", "机器狗", "中国", true, "杭州", ["轮足/足式", "工业巡检"], "主流在售"],
  ["anybotics-anymal-x", "ANYbotics ANYmal X", "ANYbotics", "机器狗", "瑞士", false, "瑞士", ["工业巡检", "负载型"], "主流在售"],
  ["boston-spot-enterprise", "Boston Dynamics Spot Enterprise", "Boston Dynamics", "机器狗", "美国", false, "美国", ["工业巡检", "负载型"], "主流在售"],
  ["raibo2", "RAIBO2", "RAIBO", "机器狗", "韩国", false, "韩国", ["科研开发", "负载型"], "科研常用"],
  ["robotis-darwin-op", "ROBOTIS DARwIn-OP", "Open Robotics", "人形机器人", "韩国/美国", false, "韩国/美国", ["小型人形", "开源人形", "教育版"], "历史/供货待确认"]
];

const repoMap = {
  "unitree-go2": ["abizovnuralem/go2_ros2_sdk", "unitreerobotics/unitree_ros2"],
  "unitree-g1": ["unitreerobotics/unitree_ros2"],
  "unitree-a1": ["unitreerobotics/unitree_ros", "unitreerobotics/unitree_legged_sdk"],
  "unitree-go1": ["unitreerobotics/unitree_ros", "unitreerobotics/unitree_legged_sdk"],
  "franka-research-3": ["frankaemika/franka_ros2", "frankaemika/libfranka"],
  "franka-panda": ["frankaemika/franka_ros", "frankaemika/libfranka"],
  "ur5e": ["UniversalRobots/Universal_Robots_ROS_Driver", "UniversalRobots/Universal_Robots_ROS2_Driver"],
  "ur3e": ["UniversalRobots/Universal_Robots_ROS_Driver", "UniversalRobots/Universal_Robots_ROS2_Driver"],
  "ur10e": ["UniversalRobots/Universal_Robots_ROS_Driver", "UniversalRobots/Universal_Robots_ROS2_Driver"],
  "ur20": ["UniversalRobots/Universal_Robots_ROS2_Driver"],
  "ufactory-xarm-6": ["xArm-Developer/xarm_ros", "xArm-Developer/xarm_ros2"],
  "ufactory-xarm-7": ["xArm-Developer/xarm_ros", "xArm-Developer/xarm_ros2"],
  "xarm-lite-6": ["xArm-Developer/xarm_ros", "xArm-Developer/xarm_ros2"],
  "mobile-aloha": ["MarkFzp/mobile-aloha"],
  "aloha-stationary": ["tonyzhaozh/aloha", "MarkFzp/mobile-aloha"],
  "hello-stretch-3": ["hello-robot/stretch_ros2", "hello-robot/stretch_ros"],
  "clearpath-husky": ["husky/husky"],
  "clearpath-jackal": ["jackal/jackal"],
  "clearpath-turtlebot4": ["turtlebot/turtlebot4"],
  "turtlebot3-burger": ["ROBOTIS-GIT/turtlebot3"],
  "turtlebot3-waffle-pi": ["ROBOTIS-GIT/turtlebot3"],
  "turtlebot4-lite": ["turtlebot/turtlebot4"],
  "robotis-op3": ["ROBOTIS-GIT/ROBOTIS-OP3", "ROBOTIS-GIT/ROBOTIS-OP3-Common"],
  "robotis-darwin-op": ["ROBOTIS-GIT/ROBOTIS-OP3"],
  "pal-tiago": ["pal-robotics/tiago_robot", "pal-robotics/tiago_tutorials"],
  "pal-tiago-base": ["pal-robotics/tiago_robot"],
  "widowx-250s": ["Interbotix/interbotix_ros_manipulators", "Interbotix/interbotix_ros_toolboxes"]
};

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function defaultAcademicMetrics() {
  return {
    paperCount: 0,
    citationCount: 0,
    recentPaperCount: 0,
    academicScore: 0,
    topPaperTitles: [],
    academicMetricSource: "未匹配：未找到足够可靠的型号级论文匹配",
    academicConfidence: "unknown"
  };
}

function defaultOpenSourceMetrics() {
  return {
    repoCount: 0,
    stars: 0,
    forks: 0,
    recentlyUpdatedRepos: 0,
    officialRepoCount: 0,
    openSourceScore: 0,
    topRepos: [],
    openSourceMetricSource: "未匹配：未找到足够可靠的型号级 GitHub/ROS/SDK 仓库匹配",
    openSourceConfidence: "unknown"
  };
}

function categoryDefaults(category, tags) {
  if (category === "机械臂") return {
    formFactor: tags.includes("双臂") ? "双臂/协作机械臂" : tags.includes("桌面机械臂") ? "桌面/教育机械臂" : "协作/工业机械臂",
    specs: { dof: "官网未披露/按系列核验", payloadKg: "官网未披露/按具体配置确认", reachM: "官网未披露/按具体配置确认", repeatabilityMm: "官网未披露", speed: "官网未披露", endurance: "外接供电", weightKg: "官网未披露", sensors: "按具体配置确认", compute: "控制器按型号确认", safety: "协作/工业安全配置按型号确认" },
    software: { ros: "ROS/社区生态需确认", ros2: "ROS2 支持需确认", sdk: "厂商控制器/SDK 需确认", sim: "仿真模型需确认" }
  };
  if (category === "移动/复合机器人") return {
    formFactor: tags.includes("移动操作") ? "移动操作/复合机器人" : "轮式移动机器人/底盘",
    specs: { dof: "移动底盘/可扩展载荷", payloadKg: "官网未披露/按具体配置确认", reachM: "官网未披露", repeatabilityMm: "官网未披露", speed: "官网未披露", endurance: "官网未披露", weightKg: "官网未披露", sensors: "导航/避障传感器按配置确认", compute: "控制器/工控机按配置确认", safety: "场地安全和调度系统需确认" },
    software: { ros: "ROS/导航生态需确认", ros2: "ROS2 支持需确认", sdk: "调度/API/SDK 需确认", sim: "仿真模型需确认" }
  };
  if (category === "人形机器人") return {
    formFactor: tags.includes("小型人形") ? "小型人形/教育平台" : "全尺寸/双足人形机器人",
    specs: { dof: "官网未披露/按版本确认", payloadKg: "官网未披露", reachM: "官网未披露", repeatabilityMm: "官网未披露", speed: "官网未披露", endurance: "官网未披露", weightKg: "官网未披露", sensors: "视觉/IMU/力控配置需确认", compute: "计算平台需确认", safety: "跌倒保护、场地安全和开放接口需确认" },
    software: { ros: "ROS/社区生态需确认", ros2: "ROS2 支持需确认", sdk: "SDK/开放接口需确认", sim: "仿真环境需确认" }
  };
  return {
    formFactor: tags.includes("轮足/足式") ? "轮足/足式机器人" : "四足机器人",
    specs: { dof: "四足/轮足自由度按型号确认", payloadKg: "官网未披露/按配置确认", reachM: "官网未披露", repeatabilityMm: "不适用", speed: "官网未披露", endurance: "官网未披露", weightKg: "官网未披露", sensors: "视觉/雷达/IMU 按配置确认", compute: "计算平台按配置确认", safety: "场地安全、跌倒保护和巡检认证需确认" },
    software: { ros: "ROS/社区生态需确认", ros2: "ROS2 支持需确认", sdk: "厂商 SDK/运动接口需确认", sim: "仿真环境需确认" }
  };
}

function nextSourceId(existing, index) {
  let id = `SRCV16${String(index).padStart(4, "0")}`;
  while (existing.has(id)) {
    index += 1;
    id = `SRCV16${String(index).padStart(4, "0")}`;
  }
  existing.add(id);
  return id;
}

function makeRobot(item, sourceId) {
  const [id, name, brand, category, country, domesticPriority, location, tags, coverageTier] = item;
  const defaults = categoryDefaults(category, tags);
  const marketTier = coverageTier === "历史/供货待确认" ? "市场初筛" : "重点候选";
  return {
    id,
    name,
    vendor: brand,
    category,
    formFactor: defaults.formFactor,
    country,
    domesticPriority,
    officialUrl: brandSources[brand]?.[0] || `https://www.google.com/search?q=${encodeURIComponent(`${brand} ${name}`)}`,
    image: category === "机械臂" ? "/assets/robots/robot-arm.png" : category === "机器狗" ? "/assets/robots/quadruped.png" : category === "人形机器人" ? "/assets/robots/humanoid.png" : "/assets/robots/mobile-manipulator.png",
    lastChecked: "2026-06-02",
    releaseDate: "官网未披露",
    releaseDateConfidence: "unknown",
    marketTier,
    coverageTier,
    verificationStatus: "部分核验",
    verificationNotes: `${brandSources[brand]?.[1] || "可信产品入口"}已纳入广覆盖候选；型号级参数、发布时间、采购报价和开放接口需后续专项核验。`,
    verifiedAt: "2026-06-02",
    brandNormalized: brand,
    brandDisplayName: brand,
    brandLocation: location,
    tags,
    purchaseChannels: ["官网/代理正式报价"],
    price: {
      label: coverageTier === "历史/供货待确认" ? "价格不公开/需确认可供货" : "价格不公开/厂商正式报价",
      amount: null,
      currency: "CNY",
      range: coverageTier === "历史/供货待确认" ? "公开价格不可得，且当前采购/供货状态需厂商确认" : "公开价格不可得，应索取教育/科研正式报价",
      type: coverageTier === "历史/供货待确认" ? "供货状态待确认" : "厂商正式报价项",
      confidence: coverageTier === "主流在售" || coverageTier === "科研常用" ? "medium" : "low",
      sourceIds: [sourceId]
    },
    specs: defaults.specs,
    software: defaults.software,
    researchEvidence: [`v16 广覆盖候选：按品牌/产品目录纳入 ${name}，用于补齐市面主流、科研常用和教育/开源设备覆盖。`],
    deploymentEvidence: ["采购前需补齐正式报价、交付周期、售后维保、培训和开放接口条款。"],
    risks: ["广覆盖候选信息深度低于重点核验型号，排行榜中低置信指标需复核。"],
    scores: {
      research: coverageTier === "科研常用" ? 34 : coverageTier === "教育/低成本" ? 30 : coverageTier === "开源/组合方案" ? 36 : coverageTier === "历史/供货待确认" ? 24 : 28,
      deployment: coverageTier === "主流在售" ? 34 : coverageTier === "教育/低成本" ? 26 : coverageTier === "历史/供货待确认" ? 22 : 28,
      overall: coverageTier === "科研常用" ? 64 : coverageTier === "主流在售" ? 62 : coverageTier === "教育/低成本" ? 56 : coverageTier === "开源/组合方案" ? 64 : 46
    },
    shortlistTags: coverageTier === "科研常用" ? ["科研平台"] : coverageTier === "教育/低成本" ? ["教学平台"] : [],
    sourceIds: [sourceId],
    academicMetrics: defaultAcademicMetrics(),
    openSourceMetrics: defaultOpenSourceMetrics()
  };
}

async function fetchRepo(fullName) {
  const res = await fetch(`https://api.github.com/repos/${fullName}`, { headers: { "User-Agent": "robot-procurement-research" } });
  if (!res.ok) return null;
  const repo = await res.json();
  return {
    fullName: repo.full_name,
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    pushedAt: repo.pushed_at,
    htmlUrl: repo.html_url
  };
}

function scoreOpen(metrics) {
  metrics.openSourceRawScore = Math.round(Math.log10(metrics.stars + 1) * 35 + Math.log10(metrics.forks + 1) * 20 + Math.min(metrics.repoCount, 50) * 0.4 + metrics.recentlyUpdatedRepos * 3 + metrics.officialRepoCount * 5);
}

function normalize(robots, metricKey, rawKey, scoreKey) {
  const byCat = new Map();
  for (const robot of robots) {
    const raw = robot[metricKey]?.[rawKey] || 0;
    if (!byCat.has(robot.category)) byCat.set(robot.category, []);
    if (raw > 0) byCat.get(robot.category).push(raw);
  }
  for (const robot of robots) {
    const max = Math.max(...(byCat.get(robot.category) || []), 0);
    robot[metricKey][scoreKey] = max > 0 ? Math.round(((robot[metricKey][rawKey] || 0) / max) * 100) : 0;
  }
}

function writeOutputs(data) {
  const sourceRows = [["id", "title", "type", "confidence", "url", "notes"], ...data.sources.map((source) => [source.id, source.title, source.type, source.confidence, source.url, source.notes])];
  fs.writeFileSync("outputs/来源追踪-v2.csv", sourceRows.map((row) => row.map(csvEscape).join(",")).join("\n") + "\n");
  const cats = data.robots.reduce((acc, robot) => ((acc[robot.category] = (acc[robot.category] || 0) + 1), acc), {});
  const tiers = data.robots.reduce((acc, robot) => ((acc[robot.coverageTier || "未标注"] = (acc[robot.coverageTier || "未标注"] || 0) + 1), acc), {});
  const academicMatched = data.robots.filter((robot) => robot.academicMetrics?.paperCount > 0).length;
  const openMatched = data.robots.filter((robot) => robot.openSourceMetrics?.repoCount > 0).length;
  fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", [
    `# 学校具身智能机器人采购调研（${data.meta.version}）`,
    "",
    `- 数据日期：${data.meta.accessedDate}`,
    `- 候选设备：${data.robots.length} 款`,
    `- 来源记录：${data.sources.length} 条`,
    `- 四大类：${Object.entries(cats).map(([key, value]) => `${key} ${value} 款`).join("；")}`,
    `- 覆盖层级：${Object.entries(tiers).map(([key, value]) => `${key} ${value} 款`).join("；")}`,
    `- 学术指标匹配：${academicMatched} 款；GitHub/开源指标匹配：${openMatched} 款`,
    "",
    "## 本次更新",
    "",
    data.meta.updateSummary,
    "",
    "## 排名口径",
    "",
    "- 学术热度使用外部论文检索的论文数、引用数和近三年论文数综合，不再按库内来源数量排序。",
    "- GitHub/开源生态使用明确仓库的 stars、forks、最近更新和官方/社区属性综合，不再按库内 GitHub 来源数量排序。",
    "- 未可靠匹配的候选保留 `未匹配` 状态，不填充不可复核热度。"
  ].join("\n") + "\n");
}

for (const path of DATA_PATHS) {
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  const sourceIds = new Set(data.sources.map((source) => source.id));
  const robotIds = new Set(data.robots.map((robot) => robot.id));
  let index = 1;
  for (const item of additions) {
    const [id, name, brand] = item;
    if (robotIds.has(id)) continue;
    const sourceId = nextSourceId(sourceIds, index++);
    const [url, title] = brandSources[brand] || [`https://www.google.com/search?q=${encodeURIComponent(`${brand} ${name}`)}`, `${brand} 产品入口`];
    data.sources.push({ id: sourceId, title, url, type: "官网/品牌产品目录", confidence: "medium", notes: `v16 广覆盖扩库来源：用于核验 ${name} 所属品牌/产品线入口；型号级采购参数需后续专项核验。` });
    data.robots.push(makeRobot(item, sourceId));
    robotIds.add(id);
  }

  for (const robot of data.robots) {
    robot.coverageTier ||= robot.marketTier === "市场初筛" ? "主流在售" : "科研常用";
    robot.academicMetrics ||= defaultAcademicMetrics();
    robot.openSourceMetrics ||= defaultOpenSourceMetrics();
    const repos = repoMap[robot.id];
    if (!repos) {
      scoreOpen(robot.openSourceMetrics);
      continue;
    }
    const repoDetails = [];
    for (const repo of repos) {
      const detail = await fetchRepo(repo);
      if (detail) repoDetails.push(detail);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    if (repoDetails.length > 0) {
      robot.openSourceMetrics = {
        repoCount: repoDetails.length,
        stars: repoDetails.reduce((sum, repo) => sum + repo.stars, 0),
        forks: repoDetails.reduce((sum, repo) => sum + repo.forks, 0),
        recentlyUpdatedRepos: repoDetails.filter((repo) => String(repo.pushedAt || "").slice(0, 4) >= "2025").length,
        officialRepoCount: repoDetails.filter((repo) => /unitree|franka|universalrobots|xarm|hello-robot|robotis|pal-robotics|turtlebot|interbotix/i.test(repo.fullName)).length,
        openSourceScore: 0,
        topRepos: repoDetails.map((repo) => `${repo.fullName} (${repo.stars} stars, ${repo.forks} forks)`),
        openSourceMetricSource: `GitHub repository API: ${repoDetails.map((repo) => repo.fullName).join(", ")}`,
        openSourceConfidence: "high"
      };
    }
    scoreOpen(robot.openSourceMetrics);
  }
  normalize(data.robots, "academicMetrics", "academicRawScore", "academicScore");
  normalize(data.robots, "openSourceMetrics", "openSourceRawScore", "openSourceScore");
  data.meta.version = "v16";
  data.meta.accessedDate = "2026-06-02";
  data.meta.updateSummary = "候选库扩展到 300+，补充更多机械臂、移动机器人、人形机器人和机器狗；开源生态指标改用明确 GitHub 仓库 API 指标，排行榜不再依赖库内证据数量。";
  data.meta.rankingMethodology = {
    academic: "按类别归一化：论文命中数、引用数和近三年论文数综合；未可靠匹配则标记未匹配。",
    openSource: "按类别归一化：明确 GitHub 仓库的 stars、forks、最近更新和官方/社区属性综合；未可靠匹配则标记未匹配。",
    note: "库内来源数量仅作为证据覆盖说明，不作为客观热度排名主指标。"
  };
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  writeOutputs(data);
}

const data = JSON.parse(fs.readFileSync(DATA_PATHS[0], "utf8"));
console.log(JSON.stringify({
  version: data.meta.version,
  robots: data.robots.length,
  sources: data.sources.length,
  academicMatched: data.robots.filter((robot) => robot.academicMetrics?.paperCount > 0).length,
  openSourceMatched: data.robots.filter((robot) => robot.openSourceMetrics?.repoCount > 0).length
}, null, 2));
