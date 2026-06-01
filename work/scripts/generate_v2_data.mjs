import fs from "node:fs";

const accessedDate = "2026-05-31";
const fx = {
  USD: 7.25,
  EUR: 7.85,
  CHF: 8.05,
  AUD: 4.75
};

const categoryImages = {
  "机械臂": "/assets/robots/robot-arm.png",
  "人形机器人": "/assets/robots/humanoid.png",
  "机械狗": "/assets/robots/robot-dog.png",
  "复合型机器人": "/assets/robots/mobile-manipulator.png"
};

const sources = [];
const sourceIndex = new Map();

function source(id, title, url, type, confidence, notes) {
  if (sourceIndex.has(id)) {
    throw new Error(`Duplicate source id ${id}`);
  }
  const item = { id, title, url, type, confidence, notes };
  sourceIndex.set(id, item);
  sources.push(item);
  return id;
}

source("SRC001", "宇树 Go2 中文官方页", "https://www.unitree.com/cn/go2/", "中文官网/官方价格", "high", "官方页可见 Go2 起售价 9997 元，续航约 2-4 h 等信息。");
source("SRC002", "宇树 G1 中文官方页", "https://www.unitree.com/cn/g1/", "中文官网/官方价格", "high", "官方页可见 G1 起售价 8.5 万元、23-43 自由度、约 2 h 续航等信息。");
source("SRC003", "宇树 R1 中文官方页", "https://www.unitree.com/cn/R1", "中文官网/官方价格", "high", "官方页可见 R1 Air 售价 2.99 万元起、20-26 自由度、约 1 h 续航等信息。");
source("SRC004", "宇树 R1-D 中文官方页", "https://www.unitree.com/cn/R1-D", "中文官网/官方价格", "high", "官方页可见 R1-D 起售价 2.69 万元及双臂机器人定位。");
source("SRC005", "宇树 H1 中文官方页", "https://www.unitree.com/cn/h1/", "中文官网", "high", "官方页披露 H1 自由度、动力系统、864 Wh 电池等参数，价格需询价。");
source("SRC006", "宇树 B2 中文官方页", "https://www.unitree.com/cn/b2/", "中文官网", "high", "官方页说明 B2 工业四足机器人速度 6 m/s、持续负载 40 kg、续航 5 h 等。");
source("SRC007", "宇树 A2 中文官方页", "https://www.unitree.com/cn/A2", "中文官网", "high", "官方页说明 A2 约 42 kg、满载持续行走 3 h、空载 5 h、开放平台开发。");
source("SRC008", "宇树 Z1 中文官方页", "https://www.unitree.com/cn/z1/", "中文官网", "high", "官方页披露 Z1/Z1 Pro 6 轴、自重等信息，价格需询价。");
source("SRC009", "Unitree SDK2 GitHub", "https://github.com/unitreerobotics/unitree_sdk2", "GitHub/SDK", "medium", "宇树官方 SDK2，用于科研二次开发和控制接口判断。");
source("SRC010", "Unitree ROS2 GitHub", "https://github.com/unitreerobotics/unitree_ros2", "GitHub/ROS", "medium", "宇树官方 ROS2 相关仓库，用于判断 ROS2 生态。");

source("SRC011", "云深处 Lite3 中文官方页", "https://www.deeprobotics.cn/robot/index/product2.html", "中文官网/官方价格", "high", "官网页面含 Lite3 售价 16900 起、最大负载 10 kg、最高速度 3.3 m/s 等信息。");
source("SRC012", "云深处 X30 中文官方页", "https://www.deeprobotics.cn/robot/index/product1.html", "中文官网", "high", "官网页面含绝影 X30 系列持续行走负载、续航等参数，价格需询价。");
source("SRC013", "云深处 X20 中文官方页", "https://www.deeprobotics.cn/robot/index/product3.html", "中文官网", "high", "官网页面介绍绝影 X20 行业四足机器人、快速换电与行业应用能力。");
source("SRC014", "云深处山猫 M20 中文官方页", "https://www.deeprobotics.cn/robot/index/lynx.html", "中文官网", "high", "官网页面介绍轮足形态、速度和行业应用场景。");
source("SRC015", "云深处购买咨询页", "https://www.deeprobotics.cn/robot/index/buy.html", "采购渠道", "medium", "云深处官网采购咨询入口，未公开价格型号按需询价处理。");

source("SRC016", "小米 CyberDog 2 官方页", "https://www.mi.com/cyberdog-2", "中文官网/官方价格", "medium", "小米四足机器人官方产品入口；价格和在售状态需以页面访问时为准。");
source("SRC017", "逐际动力 LimX Dynamics 官方站", "https://www.limxdynamics.com/", "中文官网", "medium", "逐际动力轮足/足式平台官方入口，适合补充高校科研足式平台。");

source("SRC018", "UFACTORY xArm 官方产品页", "https://www.ufactory.cc/xarm-collaborative-robot/", "官网", "high", "xArm 协作机械臂官方产品页，含 xArm 5/6/7 系列参数。");
source("SRC019", "UFACTORY 官方商店", "https://store.ufactory.cc/", "官方价格", "medium", "官方商店可见部分 xArm 套装美元价；人民币为按访问日汇率估算。");
source("SRC020", "xArm ROS GitHub", "https://github.com/xArm-Developer/xarm_ros", "GitHub/ROS", "medium", "xArm 官方 ROS 仓库。");
source("SRC021", "xArm ROS2 GitHub", "https://github.com/xArm-Developer/xarm_ros2", "GitHub/ROS2", "medium", "xArm 官方 ROS2 仓库。");

source("SRC022", "越疆 CR5 官方页", "https://www.dobot-robots.com/products/cr-series/cr5.html", "官网", "high", "CR5 官方产品页，公开负载、臂展、重复定位精度等参数。");
source("SRC023", "越疆 MG400 官方页", "https://www.dobot-robots.com/products/desktop-robots/mg400.html", "官网", "high", "MG400 桌面机械臂官方页，适合教学和轻量开发。");
source("SRC024", "DOBOT 开发者 GitHub", "https://github.com/Dobot-Arm", "GitHub/SDK", "medium", "越疆官方开发仓库入口。");

source("SRC025", "遨博机器人中文官网", "https://www.aubo-robotics.cn/", "中文官网", "medium", "遨博协作机器人官方入口，i 系列参数和采购需按页面/销售确认。");
source("SRC026", "艾利特机器人中文官网", "https://www.elibot.cn/", "中文官网", "medium", "艾利特协作机器人官方入口，EC 系列参数和采购需按页面/销售确认。");
source("SRC027", "节卡机器人中文官网", "https://www.jaka.com.cn/", "中文官网", "medium", "节卡 Zu 系列协作机器人官方入口，价格需询价。");
source("SRC028", "睿尔曼智能官网", "https://www.realman-robotics.com/", "中文官网", "medium", "睿尔曼轻量机械臂和复合机器人官方入口。");
source("SRC029", "睿尔曼 GitHub", "https://github.com/RealManRobot", "GitHub/SDK", "medium", "睿尔曼开源/SDK 仓库入口。");

source("SRC030", "大象机器人 myCobot 280 官方页", "https://www.elephantrobotics.com/en/mycobot-280/", "官网", "high", "myCobot 280 官方产品页，适合教学和轻量科研。");
source("SRC031", "大象机器人官方商店", "https://shop.elephantrobotics.com/", "官方价格", "medium", "官方商店公开美元价，人民币价格按访问日汇率估算。");
source("SRC032", "Elephant Robotics myCobot ROS", "https://github.com/elephantrobotics/mycobot_ros", "GitHub/ROS", "medium", "大象机器人 ROS 仓库。");
source("SRC033", "pymycobot GitHub", "https://github.com/elephantrobotics/pymycobot", "GitHub/SDK", "medium", "大象机器人 Python SDK 仓库。");

source("SRC034", "松灵机器人 AgileX 中文站", "https://www.agilex.ai/", "中文官网", "medium", "松灵移动底盘、PiPER 机械臂和复合平台入口。");
source("SRC035", "AgileX PiPER 产品页", "https://global.agilex.ai/products/piper", "官网/手册", "medium", "PiPER 六自由度机械臂官方产品入口，价格需询价或按渠道核验。");
source("SRC036", "AgileX LIMO Pro 产品页", "https://global.agilex.ai/products/limo-pro", "官网", "medium", "LIMO Pro 移动底盘官方产品入口。");
source("SRC037", "AgileX Cobot Magic 产品页", "https://global.agilex.ai/products/cobot-magic", "官网", "medium", "移动复合机器人 Cobot Magic 官方入口。");
source("SRC038", "AgileX GitHub", "https://github.com/agilexrobotics", "GitHub/ROS", "medium", "松灵官方 GitHub 组织，含底盘 ROS/ROS2 生态。");

source("SRC039", "幻尔 JetArm 官方页", "https://www.hiwonder.com/products/jetarm", "官网/电商", "medium", "幻尔 JetArm 机械臂产品入口，价格需按页面访问核验。");
source("SRC040", "幻尔 JetAuto Pro 官方页", "https://www.hiwonder.com/products/jetauto-pro", "官网/电商", "medium", "幻尔 JetAuto Pro 复合平台入口。");
source("SRC041", "幻尔 JetRover 官方页", "https://www.hiwonder.com/products/jetrover", "官网/电商", "medium", "幻尔 JetRover 移动平台入口。");
source("SRC042", "亚博智能 DOFBOT 官方页", "https://category.yahboom.net/products/dofbot-jetson_nano", "官网/电商", "medium", "DOFBOT 教学机械臂入口，价格需按页面访问核验。");
source("SRC043", "亚博智能 ROSMASTER X3 官方页", "https://category.yahboom.net/products/rosmaster-x3", "官网/电商", "medium", "ROSMASTER X3 移动平台入口，适合教学和移动操作组合。");

source("SRC044", "Franka Research 3 官方页", "https://franka.de/research", "官网", "high", "经典科研机械臂官方页，国内采购通常需代理询价。");
source("SRC045", "Franka 文档门户", "https://franka.world/", "官方文档", "high", "Franka 生态和文档入口。");
source("SRC046", "Universal Robots UR5e 官方页", "https://www.universal-robots.com/products/ur5-robot/", "官网", "high", "UR5e 官方规格页。");
source("SRC047", "UR ROS2 Driver", "https://github.com/UniversalRobots/Universal_Robots_ROS2_Driver", "GitHub/ROS2", "medium", "Universal Robots 官方 ROS2 驱动。");
source("SRC048", "Kinova Gen3 官方页", "https://www.kinovarobotics.com/product/gen3-robots", "官网", "high", "Kinova Gen3 官方规格页。");
source("SRC049", "Kinova Kortex ROS", "https://github.com/Kinovarobotics/ros_kortex", "GitHub/ROS", "medium", "Kinova 官方 ROS/Kortex 仓库。");

source("SRC050", "傅利叶智能官网", "https://www.fftai.com/", "中文官网", "medium", "傅利叶 GR 系列人形机器人和康复机器人官方入口。");
source("SRC051", "智元机器人官网", "https://www.agibot.com/", "中文官网", "medium", "智元远征/灵犀系列官方入口。");
source("SRC052", "优必选官网", "https://www.ubtrobot.com/", "中文官网", "medium", "优必选 Walker 系列和工业服务机器人官方入口。");
source("SRC053", "众擎机器人官网", "https://www.engineai.com.cn/", "中文官网", "medium", "众擎 PM/SE 系列人形机器人官方入口。");
source("SRC054", "乐聚机器人官网", "https://www.lejurobot.com/", "中文官网", "medium", "乐聚 Kuavo 人形机器人官方入口。");
source("SRC055", "Kuavo 开源项目", "https://github.com/kuavo-robot", "GitHub/开源项目", "medium", "Kuavo 相关开源组织入口，适合科研复现判断。");
source("SRC056", "Booster Robotics 官网", "https://www.boosterobotics.com/", "官网", "medium", "Booster T/K 系列人形机器人官方入口。");
source("SRC057", "NOETIX Robotics 官网", "https://www.noetix.ai/", "官网", "medium", "NOETIX Bumi 等小型人形机器人官方入口。");
source("SRC058", "星海图 Galbot 官网", "https://www.galbot.com/", "中文官网", "medium", "Galbot 具身智能机器人官方入口。");
source("SRC059", "星动纪元 RobotEra 官网", "https://www.robotera.com/", "中文官网", "medium", "星动纪元人形机器人官方入口。");
source("SRC060", "开普勒机器人官网", "https://www.keplerrobotics.com/", "中文官网", "medium", "开普勒 Forerunner 系列人形机器人官方入口。");

source("SRC061", "Hello Robot Stretch 3 官方页", "https://hello-robot.com/stretch-3-product", "官网", "high", "移动操作经典科研平台官方规格页。");
source("SRC062", "Hello Robot Stretch 3 购买页", "https://hello-robot.com/stretch-3-shop", "官方价格", "medium", "Stretch 3 官方购买页，美元价按访问日汇率估算。");
source("SRC063", "HomeRobot GitHub", "https://github.com/facebookresearch/home-robot", "GitHub/科研项目", "medium", "Meta HomeRobot 项目使用 Stretch，支撑科研常用性判断。");
source("SRC064", "PAL Robotics TIAGo 官方页", "https://pal-robotics.com/robots/tiago/", "官网", "high", "TIAGo 移动操作平台官方页。");
source("SRC065", "Robotnik RB-KAIROS+ 官方页", "https://robotnik.eu/products/mobile-manipulators/rb-kairos/", "官网", "medium", "移动操作平台官方页，可配 UR 等机械臂。");
source("SRC066", "Mobile ALOHA 项目页", "https://mobile-aloha.github.io/", "论文/项目", "high", "Mobile ALOHA 低成本移动双臂操作项目页。");
source("SRC067", "ALOHA / ACT GitHub", "https://github.com/tonyzhaozh/act", "GitHub/科研项目", "medium", "ALOHA/ACT 相关开源代码，用于判断低成本遥操作生态。");
source("SRC068", "LeRobot GitHub", "https://github.com/huggingface/lerobot", "GitHub/科研项目", "medium", "Hugging Face LeRobot 开源机器人学习框架，可关联低成本机械臂/移动操作实验。");

source("SRC069", "京东宇树 Go2 检索页", "https://search.jd.com/Search?keyword=%E5%AE%87%E6%A0%91%20Go2", "京东官方/授权线索", "low", "后台浏览器检索到京东渠道线索；具体店铺和价格需页面复核或人工确认。");
source("SRC070", "京东 myCobot 检索页", "https://search.jd.com/Search?keyword=myCobot%20280", "京东官方/授权线索", "low", "后台浏览器检索到 myCobot 采购渠道线索；具体价格按页面复核。");
source("SRC071", "京东 AgileX LIMO 检索页", "https://search.jd.com/Search?keyword=AgileX%20LIMO", "京东官方/授权线索", "low", "后台浏览器检索到松灵 LIMO 采购线索；具体店铺和价格需复核。");
source("SRC072", "淘宝/天猫 Unitree Go2 检索", "https://s.taobao.com/search?q=Unitree%20Go2", "淘宝/天猫线索", "low", "仅作为型号和渠道线索，不作为确定报价。");
source("SRC073", "淘宝/天猫 myCobot 检索", "https://s.taobao.com/search?q=myCobot%20280", "淘宝/天猫线索", "low", "仅作为型号和渠道线索，不作为确定报价。");

source("SRC074", "中国政府采购网检索：机器狗", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E6%9C%BA%E5%99%A8%E7%8B%97", "招投标检索", "medium", "用于后续核验高校/政府采购中标价，当前不把检索页当确定报价。");
source("SRC075", "中国政府采购网检索：机械臂", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E6%9C%BA%E6%A2%B0%E8%87%82", "招投标检索", "medium", "用于后续核验高校/政府采购中标价，当前不把检索页当确定报价。");
source("SRC076", "百度学术检索：具身智能 机械臂", "https://xueshu.baidu.com/s?wd=%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD%20%E6%9C%BA%E6%A2%B0%E8%87%82", "中文论文入口", "low", "中文论文入口，后续需逐篇核验引用平台。");
source("SRC077", "百度学术检索：四足机器人 ROS", "https://xueshu.baidu.com/s?wd=%E5%9B%9B%E8%B6%B3%E6%9C%BA%E5%99%A8%E4%BA%BA%20ROS", "中文论文入口", "low", "中文论文入口，后续需逐篇核验引用平台。");

source("SRC078", "Interbotix ViperX 官方页", "https://www.trossenrobotics.com/viperx-300-robot-arm-6dof.aspx", "官网/官方价格", "high", "ALOHA 常用机械臂，官方美元价按访问日汇率估算。");
source("SRC079", "Robotis TurtleBot4 官方页", "https://www.robotis.us/turtlebot-4/", "官网", "medium", "移动底盘/教学平台补充来源，可与轻量机械臂组合。");
source("SRC080", "ROS-Industrial Universal Robots", "https://github.com/ros-industrial/universal_robot", "GitHub/ROS", "medium", "UR 机器人 ROS-Industrial 生态入口。");
source("SRC081", "DROID 大规模真实机械臂操作数据集", "https://droid-dataset.github.io/", "论文/数据集", "high", "项目页说明 DROID 使用 Franka Panda 7DoF 机械臂采集 76k 轨迹和 350 h 真实操作数据。");
source("SRC082", "Open X-Embodiment / RT-X 项目页", "https://robotics-transformer-x.github.io/", "论文/Benchmark", "high", "跨 22 种机器人形态、60 个数据集的机器人学习数据和 RT-X 模型入口。");
source("SRC083", "RoboMIND 项目页", "https://x-humanoid-robomind.github.io/", "中文/论文/数据集", "high", "RSS 2025 项目页，覆盖 Franka、UR5e、AgileX 双臂和天工人形等多具身操作数据。");
source("SRC084", "AgiBot World GitHub", "https://github.com/OpenDriveLab/AgiBot-World", "GitHub/论文/数据集", "medium", "智元相关大规模操作数据、Benchmark 和 GO-1 模型入口，页面列出 AgiBot、AgileX、双 Franka 等形态。");
source("SRC085", "RH20T 机器人操作数据集", "https://rh20t.github.io/", "论文/数据集", "high", "清华等团队的真实机器人操作数据集入口，可用于评估机械臂遥操作和模仿学习生态。");
source("SRC086", "ALOHA 双臂操作项目页", "https://tonyzhaozh.github.io/aloha/", "论文/项目", "high", "低成本双臂精细操作项目页，Mobile ALOHA 的前置平台和 ACT 代码生态来源。");
source("SRC087", "robomimic 项目页", "https://robomimic.github.io/", "论文/Benchmark", "high", "斯坦福/UT Austin 机器人示教学习框架，包含数据集、算法和代码入口。");
source("SRC088", "LIBERO 终身机器人学习 Benchmark", "https://libero-project.github.io/", "论文/Benchmark", "medium", "机器人操作终身学习 Benchmark 入口，用于判断算法复现实验生态。");
source("SRC089", "ManiSkill 机器人操作 Benchmark", "https://www.maniskill.ai/", "论文/Benchmark", "high", "机器人操作仿真和 Benchmark 平台，适合评估机械臂、夹爪和移动操作算法生态。");
source("SRC090", "MimicGen 项目页", "https://mimicgen.github.io/", "论文/项目", "high", "CoRL 2023 数据生成项目，页面展示 Panda、Sawyer、IIWA、UR5e 和移动厨房等任务。");
source("SRC091", "RoboCasa 项目页", "https://robocasa.ai/", "论文/Benchmark", "high", "面向通用机器人厨房任务的仿真和 Benchmark，支持移动操作、人形和四足加臂等多形态。");
source("SRC092", "RoboTwin 2.0 项目页", "https://robotwin-platform.github.io/", "论文/Benchmark", "high", "双臂操作仿真和 Benchmark 入口，适合评估复合型和双臂机器人研究适配度。");
source("SRC093", "OpenVLA 项目页", "https://openvla.github.io/", "论文/模型/代码", "high", "开源视觉-语言-动作模型入口，可作为机械臂和移动操作平台的软件生态参考。");
source("SRC094", "legged_gym GitHub", "https://github.com/leggedrobotics/legged_gym", "GitHub/科研项目", "medium", "足式机器人强化学习和 sim-to-real 常用训练环境入口。");
source("SRC095", "rsl_rl GitHub", "https://github.com/leggedrobotics/rsl_rl", "GitHub/科研项目", "medium", "足式机器人强化学习常用实现，与 legged_gym 生态配套。");
source("SRC096", "Humanoid-Gym GitHub", "https://github.com/roboterax/humanoid-gym", "GitHub/论文/科研项目", "medium", "人形机器人强化学习和零样本 sim-to-real 项目入口。");
source("SRC097", "Unitree RL Gym GitHub", "https://github.com/unitreerobotics/unitree_rl_gym", "GitHub/科研项目", "medium", "宇树官方强化学习实现，支持 Go2、H1、H1_2、G1，并包含仿真到实机流程。");
source("SRC098", "Unitree MuJoCo GitHub", "https://github.com/unitreerobotics/unitree_mujoco", "GitHub/仿真", "medium", "宇树官方 MuJoCo 仿真入口，面向 Unitree SDK2、ROS2 和实机控制验证。");
source("SRC099", "RoboCAS GitHub", "https://github.com/Zheng-Liming/RoboCAS-v0", "GitHub/论文/数据集", "medium", "复杂物体排列场景下的机器人操作 Benchmark 和数据集入口。");
source("SRC100", "BridgeData V2 项目页", "https://rail-berkeley.github.io/bridgedata/", "论文/数据集", "high", "Berkeley 真实机器人操作数据集入口，支持开放词汇、多任务机器人学习研究。");
source("SRC101", "Robot Manipulation Datasets 索引", "https://www.robot-manipulation.org/datasets", "学术资源索引", "medium", "机器人操作公开数据集索引，可作为后续持续扩源入口。");
source("SRC102", "Unitree 开发者 Guide GitHub", "https://github.com/unitreerobotics/unitree_guide", "GitHub/官方开发文档", "medium", "宇树官方开发者指南仓库入口，用于核验 SDK、运动控制和仿真接入路径。");
source("SRC103", "Unitree Z1 SDK GitHub", "https://github.com/unitreerobotics/z1_sdk", "GitHub/官方SDK", "medium", "宇树 Z1 机械臂官方 SDK 仓库。");
source("SRC104", "UFACTORY 开发者文档", "https://docs.ufactory.cc/", "官方开发文档", "high", "xArm 官方文档入口，包含 SDK、API、控制器和示例说明。");
source("SRC105", "xArm Python SDK GitHub", "https://github.com/xArm-Developer/xArm-Python-SDK", "GitHub/官方SDK", "medium", "xArm 官方 Python SDK 仓库。");
source("SRC106", "DOBOT CR TCP/IP Python", "https://github.com/Dobot-Arm/TCP-IP-CR-Python", "GitHub/官方SDK", "medium", "越疆 CR 系列 TCP/IP Python 示例仓库。");
source("SRC107", "DOBOT TCP-IP ROS 6Axis", "https://github.com/Dobot-Arm/TCP-IP-ROS-6AXis", "GitHub/ROS", "medium", "越疆六轴机械臂 ROS 接入示例仓库。");
source("SRC108", "睿尔曼 ROS2 开发文档", "https://develop.realman-robotics.com/robot/ros2/getStarted/", "中文官方开发文档", "high", "睿尔曼官方 ROS2 快速开始文档。");
source("SRC109", "Franka libfranka GitHub", "https://github.com/frankarobotics/libfranka", "GitHub/官方SDK", "medium", "Franka 官方 C++ 控制库入口，是科研控制链路的重要证据。");
source("SRC110", "Franka ROS2 GitHub", "https://github.com/frankarobotics/franka_ros2", "GitHub/ROS2", "medium", "Franka 官方 ROS2 包入口。");
source("SRC111", "Universal Robots 文档门户", "https://docs.universal-robots.com/", "官方开发文档", "high", "UR 官方开发者文档入口，包含 ROS、脚本和控制接口资料。");
source("SRC112", "Universal Robots Client Library", "https://github.com/UniversalRobots/Universal_Robots_Client_Library", "GitHub/官方SDK", "medium", "UR 官方 C++ 客户端库入口。");
source("SRC113", "Kinova Kortex GitHub", "https://github.com/Kinovarobotics/kortex", "GitHub/官方SDK", "medium", "Kinova Kortex API 官方仓库入口。");
source("SRC114", "Hello Robot 开发文档", "https://docs.hello-robot.com/", "官方开发文档", "high", "Stretch 官方文档入口，含 ROS2、Python API 和硬件维护资料。");
source("SRC115", "Stretch ROS2 GitHub", "https://github.com/hello-robot/stretch_ros2", "GitHub/ROS2", "medium", "Hello Robot Stretch ROS2 官方仓库。");
source("SRC116", "PAL Robotics 文档门户", "https://docs.pal-robotics.com/", "官方开发文档", "high", "PAL Robotics 官方文档入口，用于核验 TIAGo 软件栈和部署资料。");
source("SRC117", "TIAGo Robot GitHub", "https://github.com/pal-robotics/tiago_robot", "GitHub/ROS", "medium", "PAL Robotics TIAGo 机器人 ROS 描述和配置仓库。");
source("SRC118", "Robotnik GitHub", "https://github.com/RobotnikAutomation", "GitHub/ROS", "medium", "Robotnik 官方 GitHub 组织，含移动底盘和移动操作相关 ROS 包。");
source("SRC119", "LimX Dynamics GitHub", "https://github.com/limxdynamics", "GitHub/SDK", "medium", "逐际动力官方 GitHub 组织入口，用于核验足式/轮足平台开发资料。");
source("SRC120", "Booster Robotics GitHub", "https://github.com/BoosterRobotics", "GitHub/SDK", "medium", "Booster Robotics 官方 GitHub 组织入口。");
source("SRC121", "Booster Gym 项目页", "https://booster-gym.github.io/", "论文/仿真/科研项目", "high", "Booster Gym 人形机器人强化学习和仿真训练项目页。");
source("SRC122", "Fourier GR-1 SDK 文档", "https://fftai.github.io/fourier-grx-GR1/docs/quickstart/gr1.html", "官方开发文档", "medium", "傅利叶 GR-1 SDK 快速开始文档。");
source("SRC123", "DEEPRobotics Lite3 运动开发手册", "https://www.deeprobotics.us/wp-content/uploads/2025/10/Jueying-Lite3-Motion-Development-Manual-beta-V2.0.1-0.pdf", "官方手册/开发文档", "medium", "Lite3 运动开发手册 PDF，用于核验四足开发和控制接口。");
source("SRC124", "DeepRoboticsLab GitHub", "https://github.com/DeepRoboticsLab", "GitHub/SDK", "medium", "云深处相关 GitHub 组织入口，用于补充 SDK 和研究代码线索。");
source("SRC125", "Hiwonder GitHub", "https://github.com/hiwonder", "GitHub/教学代码", "medium", "幻尔官方 GitHub 组织，补充教学平台代码和示例来源。");
source("SRC126", "Yahboom GitHub", "https://github.com/YahboomTechnology", "GitHub/教学代码", "medium", "亚博智能官方 GitHub 组织，补充 ROSMASTER/DOFBOT 教学代码来源。");
source("SRC127", "MoveIt 官方站", "https://moveit.ai/", "ROS/运动规划框架", "high", "MoveIt 是机械臂和移动操作常用运动规划框架入口。");
source("SRC128", "MoveIt2 GitHub", "https://github.com/moveit/moveit2", "GitHub/ROS2/运动规划", "medium", "MoveIt2 官方仓库，适合判断 ROS2 机械臂研发适配度。");
source("SRC129", "ros2_control GitHub", "https://github.com/ros-controls/ros2_control", "GitHub/ROS2/控制框架", "medium", "ROS2 控制框架入口，用于判断可控性和二次开发生态。");
source("SRC130", "NVIDIA Isaac Sim", "https://developer.nvidia.com/isaac/sim", "仿真平台", "high", "NVIDIA Isaac Sim 官方入口，适合机器人仿真、合成数据和数字孪生评估。");
source("SRC131", "NVIDIA Isaac Lab", "https://isaac-sim.github.io/IsaacLab/", "仿真/强化学习框架", "high", "Isaac Lab 官方文档入口，适合人形、四足和操作强化学习。");
source("SRC132", "MuJoCo Menagerie", "https://github.com/google-deepmind/mujoco_menagerie", "GitHub/仿真模型库", "medium", "DeepMind MuJoCo 机器人模型库入口，可用于仿真模型覆盖判断。");
source("SRC133", "Polymetis GitHub", "https://github.com/facebookresearch/polymetis", "GitHub/科研控制框架", "medium", "Meta 机器人控制框架，常用于 Franka 等机械臂研究。");
source("SRC134", "Deoxys Control GitHub", "https://github.com/UT-Austin-RPL/deoxys_control", "GitHub/科研控制框架", "medium", "UT Austin Franka 控制框架入口，用于高频科研平台证据补充。");
source("SRC135", "BEHAVIOR Benchmark", "https://behavior.stanford.edu/", "论文/Benchmark", "high", "Stanford BEHAVIOR 具身 AI Benchmark，适合家庭/服务场景任务覆盖评估。");
source("SRC136", "CALVIN Benchmark", "https://calvin.cs.uni-freiburg.de/", "论文/Benchmark", "medium", "面向语言条件长程机器人操作的 Benchmark 入口。");
source("SRC137", "GraspNet", "https://graspnet.net/", "论文/数据集/抓取", "high", "抓取姿态估计和抓取数据集入口，适合夹爪类末端执行器评估。");
source("SRC138", "DexGraspNet", "https://pku-epic.github.io/DexGraspNet/", "论文/数据集/灵巧手", "high", "北京大学灵巧抓取数据集入口，适合灵巧手方案评估。");
source("SRC139", "UMI Gripper 项目页", "https://umi-gripper.github.io/", "论文/项目/遥操作", "high", "Universal Manipulation Interface 项目页，适合低成本遥操作和夹爪采集方案评估。");
source("SRC140", "Actuated UMI 项目页", "https://actuated-umi.github.io/", "论文/项目/遥操作", "high", "Actuated UMI 项目页，补充遥操作数据采集和端到端学习入口。");
source("SRC141", "GELLO 项目页", "https://wuphilipp.github.io/gello_site/", "论文/项目/遥操作", "high", "GELLO 低成本机械臂遥操作项目页。");
source("SRC142", "GELLO Software GitHub", "https://github.com/wuphilipp/gello_software", "GitHub/科研项目", "medium", "GELLO 软件仓库，用于判断可复现实验工具链。");
source("SRC143", "LEAP Hand 项目页", "https://leap-hand.github.io/", "论文/项目/灵巧手", "high", "低成本灵巧手研究平台项目页。");
source("SRC144", "LEAP Hand API GitHub", "https://github.com/leap-hand/LEAP_Hand_API", "GitHub/灵巧手SDK", "medium", "LEAP Hand API 仓库入口。");
source("SRC145", "DexCap 项目页", "https://dex-cap.github.io/", "论文/项目/灵巧操作", "high", "灵巧操作数据采集和模仿学习项目入口。");
source("SRC146", "Robotiq 2F-85/140 官方页", "https://robotiq.com/products/2f85-140-adaptive-robot-gripper", "末端执行器官网", "high", "Robotiq 二指自适应夹爪官方入口，常见于 UR、Kinova 等协作臂落地方案。");
source("SRC147", "OnRobot RG2 官方页", "https://onrobot.com/en/products/rg2-gripper", "末端执行器官网", "high", "OnRobot RG2 夹爪官方入口，适合协作臂末端选型。");
source("SRC148", "DH Robotics 英文官网", "https://en.dh-robotics.com/", "末端执行器官网", "medium", "大寰机器人末端执行器官网入口，含夹爪和灵巧手类产品线。");
source("SRC149", "因时机器人官网", "https://www.inspire-robots.com/", "末端执行器官网", "medium", "因时机器人灵巧手和夹爪产品入口。");
source("SRC150", "中国政府采购网检索：人形机器人", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA", "招投标检索", "medium", "用于后续核验人形机器人高校/政府采购和预算公开信息。");
source("SRC151", "中国政府采购网检索：四足机器人", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E5%9B%9B%E8%B6%B3%E6%9C%BA%E5%99%A8%E4%BA%BA", "招投标检索", "medium", "用于后续核验四足机器人采购公告、中标和预算信息。");
source("SRC152", "中国政府采购网检索：协作机器人", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E5%8D%8F%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA", "招投标检索", "medium", "用于后续核验机械臂/协作机器人高校采购价格。");
source("SRC153", "中国政府采购网检索：具身智能机器人", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD%E6%9C%BA%E5%99%A8%E4%BA%BA", "招投标检索", "medium", "用于后续跟踪具身智能相关采购公告。");
source("SRC154", "百度学术检索：人形机器人 具身智能", "https://xueshu.baidu.com/s?wd=%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA%20%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD", "中文论文入口", "low", "中文论文入口，后续需逐篇核验对应机器人型号。");
source("SRC155", "百度学术检索：移动操作机器人 具身智能", "https://xueshu.baidu.com/s?wd=%E7%A7%BB%E5%8A%A8%E6%93%8D%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA%20%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD", "中文论文入口", "low", "中文论文入口，后续需逐篇核验移动操作平台和任务场景。");
source("SRC156", "百度学术检索：灵巧手 机械臂 抓取", "https://xueshu.baidu.com/s?wd=%E7%81%B5%E5%B7%A7%E6%89%8B%20%E6%9C%BA%E6%A2%B0%E8%87%82%20%E6%8A%93%E5%8F%96", "中文论文入口", "low", "中文灵巧手和抓取论文入口，后续用于末端执行器扩展调研。");
source("SRC157", "上海大学具身智能机器人平台中标公告", "https://www.ccgp.gov.cn/cggg/dfgg/zbgg/202507/t20250712_24956479.htm", "高校采购/中标公告", "high", "中标公告列出 Galaxea R1 Pro、Unitree G1 EDU、AgileX Cobot Magic、定制平台，总金额 236 万元。");
source("SRC158", "同济大学通用人形机器人训练平台设备中标公告", "https://www.ccgp.gov.cn/cggg/zygg/zbgg/202412/t20241231_23994827.htm", "高校采购/中标公告", "high", "同济大学采购 10 台宇树 H1-2，公告列明单价 70 万元，总金额 825.66 万元。");
source("SRC159", "清华大学人形机器人采购项目中标公告", "https://www.ccgp.gov.cn/cggg/zygg/zbgg/202511/t20251117_25712683.htm", "高校采购/中标公告", "high", "清华大学采购 Booster T1 标准版 15 套和 Booster A1 标准版 4 套，公告列明单价 19.5 万元和 49 万元。");
source("SRC160", "华中科技大学人形机器人平台中标公告", "https://www.ccgp.gov.cn/cggg/zygg/zbgg/202504/t20250408_24412582.htm", "高校采购/中标公告", "high", "华中科技大学人形机器人平台中标公告，核心产品为具身智能人形操作机器人，单价 37 万元。");
source("SRC161", "东南大学人形机器人科研开发套件招标公告", "https://www.ccgp.gov.cn/cggg/zygg/gkzb/202601/t20260108_26051160.htm", "高校采购/招标公告", "high", "东南大学未来技术学院人形机器人科研开发套件，预算 99.5 万元，包含人形机器人、通用双足底盘、三指手和五指灵巧手。");
source("SRC162", "华东理工大学开源六自由度协作机器人平台中标公告", "https://www.ccgp.gov.cn/cggg/zygg/zbgg/202411/t20241127_23730315.htm", "高校采购/中标公告", "high", "开源三轴/六轴协作机械臂智能控制平台中标公告，总金额 478.8 万元。");
source("SRC163", "上海交通大学智能机器人与感知控制一体化平台中标公告", "https://www.ccgp.gov.cn/cggg/zygg/zbgg/202512/t20251215_25927204.htm", "高校采购/中标公告", "high", "上海交通大学智能机器人与感知控制一体化平台中标公告，总金额 278 万元。");
source("SRC164", "大连理工大学宁波研究院 Go2 四足机器人采购结果", "https://nbidut.dlut.edu.cn/info/1035/29510.htm", "高校采购/结果公告", "high", "Go2 四足机器人采购结果公示，规格为宇树 GO2-EDU 旗舰版，单价 8.99 万元。");
source("SRC165", "南通大学 Unitree Go2 机器狗竞价结果", "https://ztb.ntu.edu.cn/jjjg/7316.chtml", "高校采购/竞价结果", "medium", "南通大学竞价结果入口，采购内容为宇树 Unitree Go2 机器狗。");
source("SRC166", "北京理工大学四足机器狗采购意向", "https://cgyx.ccgp.gov.cn/cgyx/pub/proJ/details?projId=1a166249-5230-4ccf-8426-fc3aa81e60f4", "高校采购/采购意向", "medium", "北京理工大学采购意向，四足机器人 12 台，具体公告和成交需后续跟踪。");
source("SRC167", "华中科技大学机器人灵巧操作系统采购意向", "https://cgyx.ccgp.gov.cn/cgyx/pub/proJ/details?projId=f42ee1ca-27b1-44f5-8c9d-4d3678166989", "高校采购/采购意向", "medium", "采购意向列出仿生机械臂末端、六轴力矩传感器、数据手套、灵巧手与触觉感知系统，预算 178 万元。");
source("SRC168", "复旦大学智能机器人招标公告", "https://www.ccgp.gov.cn/cggg/zygg/gkzb/202410/t20241028_23469333.htm", "高校采购/招标公告", "medium", "复旦大学智能机器人招标公告，需求包含云具身智能移动抓取机器人和多机器人编队控制。");
source("SRC169", "辽宁科技大学具身智能实验室平台招标公告", "https://www.ccgp.gov.cn/cggg/dfgg/gkzb/202508/t20250812_25144644.htm", "高校采购/招标公告", "medium", "具身智能实验室平台招标，预算 186.88 万元，包含智能协作机器人平台、机器视觉实验平台和智能模块化运动机器人。");
source("SRC170", "东南大学柔性协作机械臂系统中标公告", "https://www.ccgp.gov.cn/cggg/zygg/zbgg/202411/t20241115_23627024.htm", "高校采购/中标公告", "high", "东南大学未来技术学院柔性协作机械臂系统中标公告，列明柔性协作臂单价 34.843 万元。");
source("SRC171", "工业机械臂采购成交公告", "https://www.ccgp.gov.cn/cggg/dfgg/cjgg/202501/t20250107_24025992.htm", "政府采购/成交公告", "medium", "工业机械臂采购成交公告，成交金额 12.66 万元，供应商为工博士机器人技术有限公司。");
source("SRC172", "启元实验室四足机器人远端计算和仿真平台招标公告", "https://www.ccgp.gov.cn/cggg/dfgg/qtgg/202503/t20250310_24273579.htm", "科研机构采购/招标公告", "medium", "四足机器人远端计算和仿真平台招标，预算 264 万元，适合作为四足机器人配套算力和仿真环境参考。");
source("SRC173", "Unitree Go2 室内自主导航与三维重建论文入口", "https://stars.library.ucf.edu/etd2024/389/", "论文/研究项目", "medium", "UCF 学位论文入口，使用 Unitree Go2 进行 ROS2 自主导航、SLAM 和室内三维重建。");
source("SRC174", "Unitree G1 真实人形机器人深度强化学习论文", "https://spj.science.org/doi/10.34133/research.1123", "论文/研究项目", "high", "Science Partner Journal Research 论文入口，描述在 Unitree G1 上进行真实人形机器人运动控制验证。");
source("SRC175", "Gait-Conditioned Reinforcement Learning for Humanoid Locomotion", "https://arxiv.org/abs/2505.20619", "论文/预印本", "medium", "arXiv 论文入口，真实 Unitree G1 上验证站立、行走和转换动作。");
source("SRC176", "RobotDancing 人形机器人长程动作跟踪论文", "https://arxiv.org/abs/2509.20717", "论文/预印本", "medium", "arXiv 论文入口，主要在 Unitree G1 上评估，并验证 H1/H1-2 迁移。");
source("SRC177", "KungfuBot 高动态人形全身控制论文", "https://arxiv.org/abs/2506.12851", "论文/预印本", "medium", "arXiv 论文入口，在 Unitree G1 上部署高动态技能控制。");
source("SRC178", "UniTracker 通用人形全身运动跟踪论文", "https://arxiv.org/abs/2507.07356", "论文/预印本", "medium", "arXiv 论文入口，使用 Unitree G1 进行真实世界运动跟踪评估。");
source("SRC179", "Franka Research 3 中文官方页", "https://franka.cn/Research", "中文官网", "high", "Franka Research 3 中文官方入口，说明其面向机器人控制和学习研究。");
source("SRC180", "Franka Research 3 中文硬件手册", "https://franka.de/hubfs/Hardware%20Manual%20Franka%20Research%203_Arm%20v2.1_R02210_1.0_ZH-Hans.pdf?hsLang=en", "中文官方手册", "high", "Franka Research 3 中文硬件手册 PDF，用于核验部署、安全和维护要求。");
source("SRC181", "ROS 文档：unitree_ros", "https://docs.ros.org/en/humble/p/unitree_ros/index.html", "ROS文档", "medium", "ROS Humble 文档入口，补充 Unitree Go1/四足 ROS 生态线索。");
source("SRC182", "Unitree Go2 Robot ROS2 GitHub", "https://github.com/Unitree-Go2-Robot/go2_robot", "GitHub/ROS2", "medium", "社区 Unitree Go2 ROS2 仓库入口，用于判断 Go2 自主导航和仿真生态。");
source("SRC183", "ROS Discourse：Unitree Go2 ROS2 Jazzy + Gazebo", "https://discourse.ros.org/t/new-open-source-release-for-quadruped-unitree-go2-ros-2-jazzy-gazebo-harmonic/43569", "ROS社区/项目", "medium", "ROS 社区关于 Unitree Go2、ROS2 Jazzy 和 Gazebo Harmonic 集成的讨论入口。");
source("SRC184", "百度学术检索：Unitree Go2 四足机器人 ROS", "https://xueshu.baidu.com/s?wd=Unitree%20Go2%20%E5%9B%9B%E8%B6%B3%E6%9C%BA%E5%99%A8%E4%BA%BA%20ROS", "中文论文入口", "low", "中文学术检索入口，用于持续追踪 Go2/四足机器人 ROS 论文。");
source("SRC185", "百度学术检索：Unitree G1 人形机器人 强化学习", "https://xueshu.baidu.com/s?wd=Unitree%20G1%20%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA%20%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0", "中文论文入口", "low", "中文学术检索入口，用于持续追踪 Unitree G1 和强化学习论文。");
source("SRC186", "百度学术检索：Franka 机械臂 操作学习", "https://xueshu.baidu.com/s?wd=Franka%20%E6%9C%BA%E6%A2%B0%E8%87%82%20%E6%93%8D%E4%BD%9C%E5%AD%A6%E4%B9%A0", "中文论文入口", "low", "中文学术检索入口，用于持续追踪 Franka/Panda 操作学习论文。");
source("SRC187", "百度学术检索：Mobile ALOHA 机器人", "https://xueshu.baidu.com/s?wd=Mobile%20ALOHA%20%E6%9C%BA%E5%99%A8%E4%BA%BA", "中文论文入口", "low", "中文学术检索入口，用于持续追踪 Mobile ALOHA 相关资料。");
source("SRC188", "CNKI 检索：人形机器人 具身智能", "https://kns.cnki.net/kns8s/defaultresult/index?kw=%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA%20%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD", "中文论文入口/CNKI", "low", "知网检索入口，作为中文论文持续追踪线索，具体论文需后续逐篇核验。");
source("SRC189", "万方检索：机械臂 具身智能", "https://s.wanfangdata.com.cn/paper?q=%E6%9C%BA%E6%A2%B0%E8%87%82%20%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD", "中文论文入口/万方", "low", "万方论文检索入口，作为机械臂与具身智能中文资料持续追踪线索。");
source("SRC190", "万方检索：移动操作机器人", "https://s.wanfangdata.com.cn/paper?q=%E7%A7%BB%E5%8A%A8%E6%93%8D%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA", "中文论文入口/万方", "low", "万方论文检索入口，作为移动操作机器人中文资料持续追踪线索。");
source("SRC191", "Unitree Go2 Robot 开源文档", "https://unitree-go2-robot.github.io/", "社区文档/ROS2", "medium", "Unitree Go2 ROS2 社区文档入口，面向遥操作、状态话题和服务封装。");
source("SRC192", "go2_ros2_sdk GitHub", "https://github.com/abizovnuralem/go2_ros2_sdk", "GitHub/ROS2", "medium", "Unitree Go2 非官方 ROS2 SDK 支持仓库，适合作为社区活跃度和二次开发线索。");
source("SRC193", "ROS Discourse：Unitree Go2 ROS2 Humble 实现", "https://discourse.ros.org/t/new-implementation-for-unitree-go-2-in-ros-2-humble/38465", "ROS社区/项目", "medium", "ROS 社区关于 Unitree Go2 ROS2 Humble 实现的讨论入口。");
source("SRC194", "unitree_go2_nav GitHub", "https://github.com/Sayantani-Bhattacharya/unitree_go2_nav", "GitHub/ROS2/导航", "medium", "Unitree Go2 自主导航和 SLAM 项目仓库。");
source("SRC195", "UCL 使用 Unitree G1 推进具身智能研究", "https://www.ucl.ac.uk/engineering/news/ucl-welcomes-humanoid-robot-advance-embodied-ai-research", "高校研究项目/案例", "high", "UCL 工程学院介绍其 Unitree G1 用于具身 AI 研究。");
source("SRC196", "Vision-Based Human Motion Imitation for Humanoid Robots", "https://repositorio.uniandes.edu.co/entities/publication/f5d8fd21-c9d7-4b10-ad78-5e07dd48bc10", "论文/学位论文", "medium", "学位论文入口，在 Unitree G1 上验证视觉人体动作模仿框架。");
source("SRC197", "G1 全身遥操作论文", "https://arxiv.org/abs/2605.12347", "论文/预印本", "medium", "Unitree G1 真实机器人全身遥操作系统论文入口。");
source("SRC198", "GR1 与 G1 跨具身策略微调论文", "https://arxiv.org/abs/2512.01358", "论文/预印本", "medium", "论文在 Fourier GR1 和 Unitree G1 两种人形平台上验证跨具身策略微调。");
source("SRC199", "G1 行走、奔跑和跌倒恢复统一控制论文", "https://arxiv.org/abs/2605.18611", "论文/预印本", "medium", "论文在真实 Unitree G1 上验证步行、奔跑和跌倒恢复统一策略。");
source("SRC200", "FRoM-W1 人形语言指令全身控制论文", "https://arxiv.org/abs/2601.12799", "论文/预印本", "medium", "FRoM-W1 在 Unitree H1 和 G1 上评估语言指令全身控制。");
source("SRC201", "DEEPRobotics X30 英文产品手册", "https://www.deeprobotics.us/wp-content/uploads/2025/08/DEEPRobotics-X30-Quadruped-Robot-4.10.2024-ENV.pdf", "官方手册/规格书", "high", "X30 英文手册，补充教育科研、巡检和规格参数入口。");
source("SRC202", "DEEPRobotics X30 应急救援方案手册", "https://www.deeprobotics.us/wp-content/uploads/2025/08/DEEPRobotics-X30-Quadruped-Robot-Hazard-Rescue-Solution-6.13.2024-ENV.pdf", "官方方案/落地案例", "medium", "X30 危险救援场景方案手册，用于落地项目适配参考。");
source("SRC203", "AgileX LIMO 官方文档", "https://docs.trossenrobotics.com/agilex_limo_docs/", "官方文档/ROS", "high", "AgileX LIMO 文档入口，说明其 ROS 教学、研发和 SLAM/导航能力。");
source("SRC204", "AgileX LIMO ROS GitHub", "https://github.com/agilexrobotics/limo_ros", "GitHub/ROS", "medium", "LIMO ROS1 官方仓库。");
source("SRC205", "AgileX LIMO ROS2 GitHub", "https://github.com/agilexrobotics/limo_ros2", "GitHub/ROS2", "medium", "LIMO ROS2 Humble 官方仓库，含驱动、bringup、消息和 Gazebo 仿真。");
source("SRC206", "AgileX 产品目录 PDF", "https://trossenrobotics.americommerce.com/Shared/Agilex/product-catalog-1.pdf", "产品目录/规格书", "medium", "AgileX 移动底盘和机器人平台产品目录。");
source("SRC207", "AgileX Cobot Magic 英文手册", "https://www.agilex-italia.it/wp-content/uploads/2025/09/COBOT-MAGIC-EN.pdf", "官方手册/规格书", "high", "Cobot Magic 英文资料，说明其基于 Mobile ALOHA 的开源移动双臂操作定位。");
source("SRC208", "RoboTwin Dual-Arm Challenge 论文", "https://arxiv.org/abs/2506.23351", "论文/Benchmark", "medium", "RoboTwin CVPR 2025 MEIS 双臂协作挑战论文，使用 AgileX Cobot Magic 真实平台。");
source("SRC209", "RoboTwin early version 论文", "https://arxiv.org/abs/2409.02920", "论文/Benchmark", "medium", "RoboTwin 早期版本论文，使用 Cobot Magic Robot 平台进行验证。");
source("SRC210", "RoboTwin 生成式数字孪生论文", "https://arxiv.org/abs/2504.13059", "论文/Benchmark", "medium", "RoboTwin 双臂机器人 Benchmark 论文，关联 Cobot Magic 和数字孪生任务生成。");
source("SRC211", "AgileX LIMO ROS2 RobotsUSA 渠道页", "https://www.robotsusa.com/Agilex-LIMOROS2-LIMO-ROS2.htm", "代理渠道/价格线索", "medium", "AgileX LIMO ROS2 渠道页，补充教育科研定位和采购可行性线索。");
source("SRC212", "AgileX LIMO ROS2 RobotLAB 渠道页", "https://www.robotlab.com/higher-ed-robots/store/limo-agilex", "代理渠道/价格线索", "medium", "RobotLAB LIMO ROS2 渠道页，页面可见高等教育用途和价格线索。");
source("SRC213", "ROS Robots：RB-KAIROS", "https://robots.ros.org/rb-kairos/", "ROS机器人索引", "high", "ROS Robots 对 RB-KAIROS 的索引页，列出 ROS2、研究、物流、250 kg 载荷和 RB-KAIROS+ 机械臂集成定位。");
source("SRC214", "Robotnik rbkairos_sim GitHub", "https://github.com/RobotnikAutomation/rbkairos_sim", "GitHub/ROS仿真", "medium", "RB-KAIROS ROS 仿真包。");
source("SRC215", "Robotnik RB-KAIROS+ 数据表", "https://www.roscomponents.com/wp-content/uploads/2024/11/Robotnik_Datasheet_RB-KAIROS_EN-1.pdf", "官方规格书", "high", "RB-KAIROS+ 移动操作机器人数据表，补充载荷、底盘和末端执行器信息。");
source("SRC216", "Hello Robot Stretch AI GitHub", "https://github.com/hello-robot/stretch_ai", "GitHub/科研项目", "medium", "Stretch AI 仓库，包含抓取、操作、建图、导航、LLM agent 和具身问答。");
source("SRC217", "Stretch 3 硬件指南", "https://docs.hello-robot.com/0.3/hardware/hardware_guide_stretch_3/", "官方硬件手册", "high", "Stretch 3 硬件指南，说明其研究用途、合规限制、运输和维护信息。");
source("SRC218", "Stretch with Stretch 移动操作康复论文", "https://arxiv.org/abs/2312.13279", "论文/研究项目", "medium", "Hello Robot Stretch RE1 用于物理治疗练习交互的研究入口。");
source("SRC219", "PAL Robotics TIAGo RL 研究案例", "https://pal-robotics.com/blog/research-simulated-reinforcement-learning-tiago/", "厂商研究案例/论文入口", "high", "PAL 官方博客介绍 TIAGo 强化学习、触觉数据和 NeuTouch 项目。");
source("SRC220", "TIAGo RL 论文", "https://arxiv.org/abs/2311.07260", "论文/研究项目", "medium", "TIAGo 触觉强化学习仿真环境论文入口。");
source("SRC221", "TIAGo Isaac Sim 集成论文", "https://arxiv.org/abs/2510.10273", "论文/仿真项目", "medium", "TIAGo++ Omni 在 Isaac Sim 中建模和速度曲线学习的论文入口。");
source("SRC222", "PAL OS TIAGo 文档", "https://docs.pal-robotics.com/edge/tiago.html", "官方开发文档", "high", "PAL OS TIAGo 文档入口，说明 TIAGo 基于 ROS2。");
source("SRC223", "TIAGo 研究平台导航案例", "https://pal-robotics.com/versatility-tiago-research-platform-navigation/", "厂商研究案例", "medium", "PAL 官方页面介绍 TIAGo 在多个欧盟研究项目中的导航和移动操作应用。");
source("SRC224", "TIAGo 医院场景实地部署论文", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9445435/", "论文/落地案例", "high", "开放论文介绍 TIAGo 在医院样本配送场景中的实地验证。");
source("SRC225", "Robot Zoo 多具身数据集", "https://huggingface.co/datasets/shareef14/robot-zoo", "数据集/多具身索引", "medium", "Hugging Face 多具身机器人数据集索引，包含 Stretch 3 等移动操作平台。");
source("SRC226", "UFACTORY 产品价格与参数清单 PDF", "https://assets.zyrosite.com/m6Lb1n8yxOiXQr53/ufactory-product-list-dOqDEyxRogfNgOKP.pdf", "官方/渠道价格清单", "medium", "xArm 5/6/7/Lite 6/850 价格、负载、臂展、附件和 ROS/ROS2 支持清单。");
source("SRC227", "xArm 6 Sonny Robotics 渠道页", "https://sonnyrobotics.com/products/ufactory-xarm-6", "代理渠道/价格线索", "medium", "xArm 6 渠道页，列出 5 kg 负载、700 mm 臂展、重复定位精度和 AUD 售价线索。");
source("SRC228", "RobotShop xArm 6 渠道页", "https://www.robotshop.com/products/ufactory-xarm-6-robot-manipulator-w-direct-drive-linear-motor", "代理渠道/价格线索", "medium", "RobotShop xArm 6 渠道页，用于交叉核验海外可采购性。");
source("SRC229", "robosuite 官方站", "https://robosuite.ai/", "仿真/机器人操作框架", "high", "Stanford robosuite 机器人操作仿真框架入口，常用于机械臂操作算法评估。");
source("SRC230", "RLBench GitHub", "https://github.com/stepjam/RLBench", "GitHub/Benchmark", "medium", "基于 CoppeliaSim 的机器人学习 Benchmark，覆盖多任务操作学习。");
source("SRC231", "SAPIEN 官方站", "https://sapien.ucsd.edu/", "仿真平台", "high", "SAPIEN 机器人仿真平台入口，适合具身交互、操作和可微/物理仿真评估。");
source("SRC232", "OmniGibson 官方站", "https://omnigibson.stanford.edu/", "仿真/具身环境", "high", "Stanford OmniGibson 具身环境入口，适合家庭服务和移动操作任务。");
source("SRC233", "Genesis 官方文档", "https://genesis-world.readthedocs.io/", "仿真/生成式物理平台", "medium", "Genesis 机器人和具身 AI 物理仿真平台文档入口。");
source("SRC234", "NVIDIA Isaac GR00T", "https://developer.nvidia.com/isaac/gr00t", "机器人基础模型/仿真", "high", "NVIDIA Isaac GR00T 官方入口，用于人形机器人基础模型和合成数据生态参考。");
source("SRC235", "MuJoCo 官方站", "https://mujoco.org/", "仿真平台", "high", "MuJoCo 官方入口，机器人控制、强化学习和仿真评估基础设施。");
source("SRC236", "CoppeliaSim 官方站", "https://www.coppeliarobotics.com/", "仿真平台", "medium", "CoppeliaSim 机器人仿真平台入口，RLBench 等任务生态依赖该平台。");
source("SRC237", "Octo 机器人基础模型项目页", "https://octo-models.github.io/", "论文/模型/代码", "high", "Octo 开源机器人策略项目页，用于 VLA/多机器人数据学习生态参考。");
source("SRC238", "Physical Intelligence π0", "https://www.physicalintelligence.company/blog/pi0", "机器人基础模型/研究项目", "medium", "π0 通用机器人基础模型介绍入口，可作为未来具身智能平台软件生态参考。");
source("SRC239", "OpenVLA GitHub", "https://github.com/openvla/openvla", "GitHub/模型/代码", "medium", "OpenVLA 官方代码仓库入口。");
source("SRC240", "LeRobot 文档", "https://huggingface.co/docs/lerobot/index", "官方文档/机器人学习框架", "high", "Hugging Face LeRobot 文档入口，覆盖数据采集、训练、回放和策略部署。");
source("SRC241", "Dobb-E 项目页", "https://dobb-e.com/", "论文/移动操作项目", "high", "家庭移动操作学习项目入口，使用 Hello Robot Stretch 进行真实家庭数据采集和评估。");
source("SRC242", "OK-Robot 项目页", "https://ok-robot.github.io/", "论文/移动操作项目", "high", "开放词汇移动操作项目入口，使用 Hello Robot Stretch 执行真实家庭抓取和放置任务。");
source("SRC243", "TidyBot 项目页", "https://tidybot.cs.princeton.edu/", "论文/移动操作项目", "high", "个性化整理任务移动操作项目入口，使用移动机械臂平台进行真实环境整理任务。");
source("SRC244", "HomeRobot 项目页", "https://home-robot.github.io/", "论文/移动操作项目", "medium", "Meta HomeRobot 项目页入口，补充 Stretch 相关移动操作任务和评估。");
source("SRC245", "Unitree Legged SDK GitHub", "https://github.com/unitreerobotics/unitree_legged_sdk", "GitHub/官方SDK", "medium", "宇树 Go1/A1 等四足机器人 SDK 仓库入口。");
source("SRC246", "go1_gym GitHub", "https://github.com/leggedrobotics/go1_gym", "GitHub/科研项目", "medium", "面向 Unitree Go1 的强化学习训练和部署项目入口。");
source("SRC247", "Walk These Ways GitHub", "https://github.com/Improbable-AI/walk-these-ways", "GitHub/科研项目", "medium", "MIT Improbable AI 面向 Unitree Go1 的可控步态学习项目。");
source("SRC248", "DribbleBot 项目页", "https://dribblebot.github.io/", "论文/四足机器人项目", "high", "四足机器人动态控球项目入口，使用 Unitree Go1 真实平台验证。");
source("SRC249", "Extreme Parkour 项目页", "https://extreme-parkour.github.io/", "论文/四足机器人项目", "high", "四足机器人极限跑酷项目入口，使用 Unitree A1/真实四足平台验证。");
source("SRC250", "京东检索：Unitree G1", "https://search.jd.com/Search?keyword=Unitree%20G1%20%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东 Unitree G1 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC251", "京东检索：宇树 R1", "https://search.jd.com/Search?keyword=%E5%AE%87%E6%A0%91%20R1%20%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东宇树 R1 检索入口，仅作渠道线索。");
source("SRC252", "京东检索：xArm 机械臂", "https://search.jd.com/Search?keyword=xArm%20%E6%9C%BA%E6%A2%B0%E8%87%82", "京东渠道线索", "low", "京东 xArm 机械臂检索入口，仅作渠道线索。");
source("SRC253", "京东检索：DOBOT CR5", "https://search.jd.com/Search?keyword=DOBOT%20CR5%20%E5%8D%8F%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东 DOBOT CR5 检索入口，仅作渠道线索。");
source("SRC254", "京东检索：Hiwonder JetAuto", "https://search.jd.com/Search?keyword=Hiwonder%20JetAuto", "京东渠道线索", "low", "京东 Hiwonder JetAuto 检索入口，仅作教学平台渠道线索。");
source("SRC255", "京东检索：Yahboom ROSMASTER", "https://search.jd.com/Search?keyword=Yahboom%20ROSMASTER", "京东渠道线索", "low", "京东 Yahboom ROSMASTER 检索入口，仅作教学平台渠道线索。");
source("SRC256", "淘宝检索：xArm 机械臂", "https://s.taobao.com/search?q=xArm%20%E6%9C%BA%E6%A2%B0%E8%87%82", "淘宝/天猫线索", "low", "淘宝 xArm 机械臂检索入口，仅作渠道线索。");
source("SRC257", "淘宝检索：DOBOT CR5", "https://s.taobao.com/search?q=DOBOT%20CR5%20%E5%8D%8F%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA", "淘宝/天猫线索", "low", "淘宝 DOBOT CR5 检索入口，仅作渠道线索。");
source("SRC258", "淘宝检索：Unitree G1", "https://s.taobao.com/search?q=Unitree%20G1%20%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA", "淘宝/天猫线索", "low", "淘宝 Unitree G1 检索入口，仅作渠道线索。");
source("SRC259", "淘宝检索：AgileX Cobot Magic", "https://s.taobao.com/search?q=AgileX%20Cobot%20Magic", "淘宝/天猫线索", "low", "淘宝 AgileX Cobot Magic 检索入口，仅作渠道线索。");
source("SRC260", "中国政府采购网检索：宇树", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E5%AE%87%E6%A0%91", "招投标检索", "medium", "中国政府采购网宇树关键词检索入口。");
source("SRC261", "中国政府采购网检索：Unitree", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=Unitree", "招投标检索", "medium", "中国政府采购网 Unitree 关键词检索入口。");
source("SRC262", "中国政府采购网检索：Franka", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=Franka", "招投标检索", "medium", "中国政府采购网 Franka 关键词检索入口。");
source("SRC263", "中国政府采购网检索：灵巧手", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E7%81%B5%E5%B7%A7%E6%89%8B", "招投标检索", "medium", "中国政府采购网灵巧手关键词检索入口。");
source("SRC264", "中国政府采购网检索：移动操作机器人", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E7%A7%BB%E5%8A%A8%E6%93%8D%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA", "招投标检索", "medium", "中国政府采购网移动操作机器人关键词检索入口。");
source("SRC265", "中国政府采购网检索：机器人数据采集", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86", "招投标检索", "medium", "中国政府采购网机器人数据采集关键词检索入口。");
source("SRC266", "智元 A2 SDK 文档入口", "https://open.agibot.com/docs/aimdk/a2", "官方开发文档", "high", "智元远征 A2 AimDK/SDK 文档入口，用于核验高校开发者计划和二次开发接口。");
source("SRC267", "智元 X2 AimDK 文档", "https://x2-aimdk.agibot.com/zh-cn/latest/index.html", "中文官方开发文档", "high", "智元灵犀 X2 任务编程与扩展框架文档。");
source("SRC268", "智元 ACoT-VLA 开源说明", "https://www.agibot.com.cn/article/315/detail/144.html", "厂商研究案例/开源模型", "high", "智元 ACoT-VLA 开源说明，关联 AgiBot World Challenge 和 Genie Sim 3.0。");
source("SRC269", "AgiBot ACoT-VLA GitHub", "https://github.com/AgibotTech/ACoT-VLA", "GitHub/模型/代码", "medium", "智元 ACoT-VLA 开源代码仓库。");
source("SRC270", "智元 A2 高校开发者征集计划", "https://www.agibot.com/article/161/detail/12.html", "高校开发者计划/厂商案例", "medium", "智元远征 A2 面向高校开发者和科研平台的计划入口。");
source("SRC271", "傅利叶 GR-2 SDK 概览", "https://support.fftai.com/en/docs/GR-X-Humanoid-Robot/GR2/SDK/Overview/", "官方开发文档", "high", "傅利叶 GR-X/GR-2 SDK 概览，说明 Aurora 中间件和头部功能 SDK。");
source("SRC272", "傅利叶 GR-2 产品介绍文档", "https://support.fftai.com/en/docs/GR-X-Humanoid-Robot/GR2/GR-2_Introduction/", "官方文档/规格", "high", "傅利叶 GR-2 官方介绍，列出身高、重量、自由度和灵巧手等信息。");
source("SRC273", "傅利叶 GR-1 介绍 PDF", "https://static-gcs.edit.site/users-files/df4d21bb10be49f662a9d538fa34ea02/fourier-gr-1-humanoid-robot-introduction-3%282%29.pdf?dl=1", "官方资料/规格", "medium", "傅利叶 GR-1 PDF 资料，说明开放平台和 SDK 支持。");
source("SRC274", "优必选 Walker S1 中文官方页", "https://www.ubtrobot.com/cn/humanoid/products/walker-s1/", "中文官网", "high", "优必选 Walker S1 官方产品页。");
source("SRC275", "UBTECH 年报/技术资料 PDF", "https://owebsite-cdn.ubtrobot.com/resources/file/2024/09/12/589867315187781.pdf", "厂商资料/年报", "medium", "优必选资料中介绍 Walker 系列、人形机器人全栈技术和百度大模型集成。");
source("SRC276", "UBTECH Walker S1 工业部署资料", "https://www.gtjai.com/en/docviewer?cat=press_releases&id=129921&lang=en", "厂商案例/产业部署", "medium", "资料提到 Walker S1 进入比亚迪工厂开展搬运任务训练。");
source("SRC277", "UBTECH Walker 稳定控制论文", "https://arxiv.org/abs/2108.06652", "论文/研究项目", "medium", "UBTECH Walker 人形机器人稳定控制论文入口。");
source("SRC278", "乐聚 Kuavo 英文官网", "https://www.lejurobot.com/", "官网/产品线", "high", "乐聚 Kuavo、研究场景、工业场景和训练场方案入口。");
source("SRC279", "Kuavo ROS-LLM 论文 PDF", "https://rosllm.github.io/resources/rosllm.pdf", "论文/研究项目", "medium", "ROS-LLM 论文资料，涉及 Leju 人形机器人等 ROS 与大模型集成场景。");
source("SRC280", "EngineAI GitHub 组织", "https://github.com/engineai-robotics", "GitHub/官方SDK", "medium", "众擎 EngineAI 官方 GitHub 组织，含 native SDK、ROS2 workspace、legged gym 和 humanoid 仓库。");
source("SRC281", "EngineAI PM01 AI Wiki", "https://aiwiki.ai/wiki/engineai_pm01", "第三方资料/参数价格", "medium", "EngineAI PM01 资料索引，列出 8.8 万元起、23/24 自由度、2 h 续航等信息，需采购前二次核验。");
source("SRC282", "EngineAI PM01 Robots Asia 渠道页", "https://www.robotsasia.com/as-hi/EngineAI-PM01.htm", "代理渠道/价格线索", "medium", "PM01 渠道页，面向开发者、研究者和教育用户。");
source("SRC283", "RobotEra GitHub 组织", "https://github.com/roboterax", "GitHub/官方SDK", "medium", "星动纪元/RobotEra GitHub 组织，含 STAR1 URDF、ROS2 SDK 和研究代码。");
source("SRC284", "RobotEra STAR1 URDF GitHub", "https://github.com/roboterax/models", "GitHub/机器人模型", "medium", "STAR1 URDF 模型仓库，说明 55 自由度等模型信息。");
source("SRC285", "RobotEra STAR1 产品 PDF", "https://www.robotera.com/upload/goods/20241208/f56791f6bd7fdd069e2c8552f4d3aeed.pdf", "官方规格书", "high", "RobotEra STAR1 产品 PDF，用于核验 55 自由度和高动态能力。");
source("SRC286", "RobotEra STAR1 Isaac Sim 3D 模型资料", "https://docs.isaacsim.omniverse.nvidia.com/6.0.0/_downloads/2d7ca91a64ebcdb7366797df8b7e2ae0/3D%20Content%20Sharing-RobotEra20250117.pdf", "仿真模型/官方资料", "medium", "RobotEra STAR1 3D 模型共享资料，适合仿真适配评估。");
source("SRC287", "银河通用 Galbot GitHub", "https://github.com/GalaxyGeneralRobotics", "GitHub/科研项目", "medium", "Galbot 官方 GitHub 组织，含 OpenWBT 和 OpenTrack 等项目。");
source("SRC288", "Galbot OpenWBT GitHub", "https://github.com/GalaxyGeneralRobotics/OpenWBT", "GitHub/遥操作项目", "medium", "OpenWBT 全身遥操作项目，支持 Unitree G1/H1 真实机器人和仿真环境。");
source("SRC289", "Galbot G1 Robots International 渠道页", "https://www.robotsinternational.com/Galbot-G1.htm", "代理渠道/价格线索", "medium", "Galbot G1 渠道页，列出 119995 美元价格线索和 47 自由度、10 h 续航等资料。");
source("SRC290", "Galbot G1 Sonny Robotics 渠道页", "https://sonnyrobotics.com/products/galbot-g1", "代理渠道/价格线索", "medium", "Galbot G1 渠道页，补充海外采购线索。");
source("SRC291", "Galbot G1 Robozaps 渠道页", "https://robozaps.com/products/galbot-g1", "代理渠道/价格线索", "low", "Galbot G1 渠道页，价格和配置需二次核验。");
source("SRC292", "Kinova Gen3 用户指南 PDF", "https://www.kinovarobotics.com/uploads/User-Guide-Gen3-R07.pdf", "官方手册/开发文档", "high", "Kinova Gen3 用户指南，含 ROS、Kortex API、Gazebo 和 MoveIt 说明。");
source("SRC293", "Kinova ROS2 Kortex GitHub", "https://github.com/Kinovarobotics/ros2_kortex", "GitHub/ROS2", "medium", "Kinova Gen3 ROS2 驱动仓库。");
source("SRC294", "Franka Research 3 Funduinoshop 渠道页", "https://funduinoshop.com/en/robotics/franka-robotics/franka-research-3/", "代理渠道/价格线索", "medium", "Franka Research 3 渠道页，列出 29750 欧元价格线索，采购前需向官方/代理核验。");
source("SRC295", "Franka Research 3 Ednex 渠道页", "https://www.ednexautomation.ai/franka/franka-research-3/", "代理渠道/价格线索", "medium", "Franka Research 3 教育和高阶科研渠道页。");
source("SRC296", "AGILOped 开源人形机器人论文", "https://arxiv.org/abs/2509.09364", "论文/开源人形平台", "medium", "AGILOped 开源人形机器人研究平台论文入口，作为低成本/开放平台标杆。");
source("SRC297", "iCub 行走场景论文", "https://arxiv.org/abs/1607.08525", "论文/经典科研平台", "medium", "iCub 经典人形科研平台论文入口，作为人形机器人研究标杆。");
source("SRC298", "NimbRo-OP ROS 开源人形平台论文", "https://arxiv.org/abs/1809.11051", "论文/经典科研平台", "medium", "NimbRo-OP ROS 开源人形平台论文入口。");
source("SRC299", "igus Humanoid Open Platform 论文", "https://arxiv.org/abs/1810.00948", "论文/经典科研平台", "medium", "igus 开源人形平台论文入口，作为低成本开放硬件标杆。");
source("SRC300", "HyperDog ROS2 四足开源平台论文", "https://arxiv.org/abs/2209.09171", "论文/开源四足平台", "medium", "基于 ROS2 和 micro-ROS 的开源四足机器人平台论文入口。");
source("SRC301", "ISO 10218-1:2025 工业机器人安全要求", "https://www.iso.org/standard/73933.html", "安全标准", "high", "ISO 10218-1:2025 工业机器人安全要求官方入口，用于协作臂和复合机器人安全审查。");
source("SRC302", "ISO/TS 15066:2016 协作机器人安全", "https://www.iso.org/standard/62996.html", "安全标准", "high", "ISO/TS 15066 协作机器人安全要求官方入口。");
source("SRC303", "Universal Robots Safety FAQ", "https://www.universal-robots.com/articles/ur/safety/safety-faq/", "厂商安全文档", "high", "UR 官方安全 FAQ，说明风险评估责任、ISO 10218-2 和 ISO/TS 15066 关系。");
source("SRC304", "Universal Robots 风险评估手册页", "https://www.universal-robots.com/manuals/EN/HTML/SW10_12_1/Content/prod-usr-man/complianceUR30/H_g5_sections/safety_g5/risk_assessment.htm", "厂商安全文档", "high", "UR 官方风险评估手册页，适合采购和部署验收时参考。");
source("SRC305", "Robotiq ISO/TS 15066 技术说明", "https://www.automate.org/robotics/tech-papers/iso-ts-15066-explained", "安全指南", "medium", "Robotiq/Automate 对 ISO/TS 15066 的说明，用于协作应用风险评估理解。");
source("SRC306", "Intel RealSense D455 官方规格", "https://www.intel.com/content/www/us/en/products/sku/205847/intel-realsense-depth-camera-d455/downloads.html", "传感器官网/规格", "high", "Intel RealSense D455 深度相机官方规格入口，含深度范围、分辨率和接口。");
source("SRC307", "RealSense D455 中文产品页", "https://www.realsenseai.com/cn/products/d455/", "传感器中文官网", "medium", "RealSense D455 中文产品页，适合国内采购和配置沟通。");
source("SRC308", "Stereolabs ZED 2i 官方商店", "https://store.stereolabs.com/products/zed-2i", "传感器官网/价格", "high", "ZED 2i 立体相机官方商店入口，含产品配置和价格线索。");
source("SRC309", "Ouster OS0 LiDAR 官方页", "https://ouster.com/products/hardware/os0-lidar-sensor", "传感器官网/激光雷达", "high", "Ouster OS0 短距超广角激光雷达官方页，适合移动机器人和巡检场景。");
source("SRC310", "Luxonis OAK-D Pro 官方商店", "https://shop.luxonis.com/products/oak-d-pro", "传感器官网/AI相机", "high", "OAK-D Pro 深度 AI 相机官方商店入口，支持板载神经网络推理。");
source("SRC311", "机器人深度相机实证比较论文", "https://arxiv.org/abs/2501.07421", "论文/传感器评测", "medium", "比较 RealSense D435/D455、ZED 2 和 OAK-D Pro 的机器人应用表现。");
source("SRC312", "ATI Force/Torque Sensors 官方页", "https://ati.novanta.com/products/force-torque-sensors/", "力控/六维力传感器官网", "high", "ATI 六维力/力矩传感器官方入口，适合精细操作和力控研究。");
source("SRC313", "Robotiq FT 300-S 官方页", "https://robotiq.com/products/ft-300-force-torque-sensor", "力控/六维力传感器官网", "high", "Robotiq FT 300-S 力/力矩传感器官方页。");
source("SRC314", "OnRobot HEX 六轴力传感器官方页", "https://onrobot.com/us/products/hex-6-axis-force-torque-sensor", "力控/六维力传感器官网", "high", "OnRobot HEX 6 轴力/力矩传感器官方页。");
source("SRC315", "WITTENSTEIN Resense 六轴力传感器", "https://www.wittenstein-group.com/int-en/press/article/haptic-sensors-from-resense-sense-of-touch-for-medical-service-and-industrial-robots", "触觉/六维力传感器官网", "medium", "Resense 小型六轴力/力矩传感器资料，适合灵巧手和小型末端执行器参考。");
source("SRC316", "CoinFT 微型六轴力传感器论文", "https://arxiv.org/abs/2503.19225", "论文/力控传感器", "medium", "CoinFT 微型六轴力/力矩传感器论文入口，用于灵巧操作和触觉扩展参考。");
source("SRC317", "NVIDIA Jetson AGX Orin 官方页", "https://www.nvidia.com/en-gb/autonomous-machines/embedded-systems/jetson-orin/", "边缘算力官网", "high", "Jetson AGX Orin 机器人边缘 AI 计算平台官方页。");
source("SRC318", "NVIDIA Isaac ROS 官方页", "https://developer.nvidia.com/isaac/ros", "机器人软件/边缘算力", "high", "NVIDIA Isaac ROS 官方入口，包含 CUDA 加速的 ROS2 机器人感知和 AI 模块。");
source("SRC319", "NVIDIA Jetson 开发者入口", "https://developer.nvidia.com/embedded", "边缘算力官网", "high", "NVIDIA Jetson 嵌入式 AI 计算平台开发者入口。");
source("SRC320", "Stanford CS223A Introduction to Robotics", "https://cs.stanford.edu/group/manips/teaching/cs223a/", "课程/机器人基础", "high", "Stanford CS223A 机器人基础课程，覆盖机械臂建模、控制和视觉伺服。");
source("SRC321", "Stanford SEE CS223A", "https://see.stanford.edu/Course/CS223A", "课程/机器人基础", "medium", "Stanford Engineering Everywhere CS223A 公开视频和课程材料入口。");
source("SRC322", "Drake 官方站", "https://drake.mit.edu/", "仿真/课程工具", "high", "MIT Drake 机器人建模、优化、控制和验证工具箱入口。");
source("SRC323", "CMU Foundations of Robotics Manipulation", "https://www.cmu.edu/online/foundations-robotic-interactions", "课程/机器人操作", "medium", "CMU 机器人操作和人机交互课程入口。");
source("SRC324", "CMU Robot Learning for Manipulation", "https://www.ri.cmu.edu/research-topic/robot-learning-for-manipulation/", "研究方向/课程入口", "medium", "CMU 机器人操作学习研究方向入口。");
source("SRC325", "AUBO SDK 文档", "https://docs.aubo-robotics.cn/arcs_api/en/index.html", "官方开发文档", "high", "AUBO SDK 英文文档入口，补充 AUBO i5 控制和开发能力。");
source("SRC326", "AUBO i5 用户手册 PDF", "https://www.aubo-cobot.com/public/assets/aubo/downloadsen/UM/AUBO-i5%20%26%20CB4%20user%20manual/AUBO-i5%20%26%20CB4%20user%20manual_V4.5.11_2021.05.19.pdf", "官方手册/规格", "high", "AUBO i5 用户手册，包含 SDK、ROS、API 等信息。");
source("SRC327", "ROS Index：aubo_robot", "https://index.ros.org/r/aubo_robot/", "ROS机器人索引", "medium", "AUBO ROS 包索引，含 aubo_i5_moveit_config 和 Gazebo 支持。");
source("SRC328", "JAKA SDK Quick Start", "https://www.jaka.com/docs/en/guide/SDK/JAKA%20SDK%20Quick%20Start%20-%20EN.html", "官方开发文档", "high", "JAKA SDK 快速开始文档。");
source("SRC329", "JAKA 下载中心", "https://www.jaka.com/en/download", "官方下载/SDK", "medium", "JAKA 下载中心，包含 SDK 和 ROS 资料入口。");
source("SRC330", "JAKA Zu 7 用户手册", "https://www.manualslib.com/manual/2431921/Jaka-Jaka-Zu-7.html", "用户手册/规格", "medium", "JAKA Zu 7 用户手册入口，作为规格和部署资料补充。");
source("SRC331", "Dobot CR5 数据表", "https://robotdobot.com/catalog_list/roboty/Dobot_CR5_datasheet_EN.pdf", "官方/渠道规格书", "medium", "DOBOT CR5 数据表，补充负载、轴数和接口信息。");
source("SRC332", "Dobot CR5 ROS GitHub", "https://github.com/WELLBEINGLWB/CR5_ROS", "GitHub/ROS", "medium", "DOBOT CR5 ROS 仓库镜像/入口，原说明指向 Dobot-Arm/CR5_ROS。");
source("SRC333", "Elite Robots EC66 RoboDK 模型页", "https://robodk.com/robot/Elite-Robots/EC66", "仿真/离线编程模型", "medium", "Elite EC66 RoboDK 模型页，用于离线编程和仿真生态判断。");
source("SRC334", "Elite Robots EC66 用户手册 PDF", "https://uploads.unchainedrobotics.de/media/file_upload/EC_UserManual_EC66_B2_Ver3.4.2_3925b309.pdf", "用户手册/规格", "medium", "Elite EC66 用户手册，补充 SDK、远程模式和安全资料。");
source("SRC335", "ROS 2 GitHub 组织", "https://github.com/ros2", "GitHub/ROS2基础设施", "high", "ROS2 官方 GitHub 组织，作为机器人软件生态基础来源。");
source("SRC336", "Allegro Hand 官方 Wiki", "http://wiki.wonikrobotics.com/AllegroHandWiki/index.php/Allegro_Hand", "灵巧手官网/文档", "medium", "Wonik Robotics Allegro Hand 官方 Wiki，常见于机械臂灵巧操作研究。");
source("SRC337", "Shadow Dexterous Hand 官方页", "https://www.shadowrobot.com/dexterous-hand-series/", "灵巧手官网", "high", "Shadow Robot 灵巧手系列官方入口，经典高端灵巧手研究平台。");
source("SRC338", "Shadow Hand PyBullet 训练环境", "https://github.com/RobinRipper/Shadow-Hand-OpenAI-Gym", "GitHub/灵巧手仿真", "medium", "Shadow Hand PyBullet Gym 环境，补充灵巧手仿真和强化学习线索。");
source("SRC339", "因时 RH56DFX 灵巧手中文页", "https://www.inspire-robots.com/productinfo/1831439.html", "灵巧手中文官网", "medium", "因时机器人 RH56DFX 五指灵巧手官方页。");
source("SRC340", "Inspire Hand RobotShop 渠道页", "https://www.robotshop.com/products/inspire-robots-dexterous-robot-hand", "灵巧手渠道/价格线索", "medium", "Inspire Robots 五指灵巧手 RobotShop 渠道页，补充海外采购线索。");
source("SRC341", "qbrobotics SoftHand Research", "https://qbrobotics.com/products/qb-softhand-research/", "灵巧手官网/研究平台", "high", "qb SoftHand Research 官方页，适合欠驱动软体灵巧手研究对照。");
source("SRC342", "Psyonic Ability Hand 官方页", "https://www.psyonic.io/ability-hand", "灵巧手官网", "medium", "Psyonic Ability Hand 官方入口，适合作为仿生灵巧手对照。");
source("SRC343", "GelSight Mini 官方页", "https://www.gelsight.com/gelsightmini/", "触觉传感器官网", "high", "GelSight Mini 触觉传感器官方入口，适合抓取和灵巧操作触觉扩展。");
source("SRC344", "GelSight Svelte Hand 项目页", "https://gelsight-svelte-hand.github.io/", "论文/触觉灵巧手项目", "high", "GelSight Svelte Hand 触觉灵巧手项目入口。");
source("SRC345", "Clearpath Jackal UGV 官方页", "https://clearpathrobotics.com/jackal-small-unmanned-ground-vehicle/", "移动底盘官网", "high", "Clearpath Jackal 小型无人地面车官方入口，常用于户外移动机器人科研。");
source("SRC346", "Clearpath Husky UGV 官方页", "https://clearpathrobotics.com/husky-unmanned-ground-vehicle-robot/", "移动底盘官网", "high", "Clearpath Husky UGV 官方入口，适合户外移动平台和移动操作对照。");
source("SRC347", "AgileX Scout Mini 官方页", "https://global.agilex.ai/products/scout-mini", "移动底盘官网", "medium", "AgileX Scout Mini 四轮差速/阿克曼移动底盘官方页。");
source("SRC348", "AgileX Hunter SE 官方页", "https://global.agilex.ai/products/hunter-se", "移动底盘官网", "medium", "AgileX Hunter SE 移动底盘官方页，可与机械臂集成。");
source("SRC349", "AgileX Tracer 官方页", "https://global.agilex.ai/products/tracer", "移动底盘官网", "medium", "AgileX Tracer 室内移动底盘官方页。");
source("SRC350", "TurtleBot4 ROS 文档", "https://turtlebot.github.io/turtlebot4-user-manual/", "官方文档/ROS2", "high", "TurtleBot4 官方用户手册，补充 ROS2 教学底盘资料。");
source("SRC351", "RoboNet 数据集项目页", "https://www.robonet.wiki/", "论文/数据集", "high", "RoboNet 多机器人操作数据集项目入口。");
source("SRC352", "RoboNet 论文", "https://arxiv.org/abs/1910.11215", "论文/数据集", "medium", "RoboNet 论文入口，跨机器人可泛化操作学习数据集。");
source("SRC353", "RT-1 项目页", "https://robotics-transformer1.github.io/", "论文/模型/数据", "high", "RT-1 Robotics Transformer 项目入口，作为机器人基础模型和数据集参考。");
source("SRC354", "RT-2 项目页", "https://robotics-transformer2.github.io/", "论文/模型/数据", "high", "RT-2 VLA 项目入口，作为视觉语言动作模型标杆。");
source("SRC355", "Open X-Embodiment GitHub", "https://github.com/google-deepmind/open_x_embodiment", "GitHub/数据集", "medium", "Open X-Embodiment 数据集和工具代码入口。");
source("SRC356", "RoboSet 项目页", "https://robopen.github.io/", "论文/数据集", "medium", "RoboSet/RobOpen 项目入口，补充多任务机械臂数据集线索。");
source("SRC357", "CMU RoboTool 项目页", "https://robotool.github.io/", "论文/机器人工具使用", "medium", "RoboTool 机器人工具使用和操作规划项目入口。");
source("SRC358", "SayCan 项目页", "https://say-can.github.io/", "论文/移动操作项目", "high", "SayCan 语言模型结合机器人技能的移动操作项目入口。");
source("SRC359", "VIMA 项目页", "https://vimalabs.github.io/", "论文/多模态机器人学习", "medium", "VIMA 多模态提示机器人操作项目入口。");
source("SRC360", "RoboCat 项目页", "https://www.deepmind.com/blog/robocat-a-self-improving-robotic-agent", "论文/机器人基础模型", "medium", "DeepMind RoboCat 机器人基础模型项目入口。");
source("SRC361", "中国机器人网", "https://www.robot-china.com/", "行业媒体/采购线索", "low", "国内机器人行业信息和采购线索入口，仅作辅助。");
source("SRC362", "中国机器人产业联盟", "https://www.cria.org.cn/", "行业协会/政策标准", "medium", "中国机器人产业联盟入口，适合政策、标准和产业动态追踪。");
source("SRC363", "上海机器人产业技术研究院", "https://www.srtii.com/", "行业研究机构", "medium", "上海机器人产业技术研究院入口，适合产业服务和场景落地信息跟踪。");
source("SRC364", "中国自动化学会机器人竞赛入口", "https://www.caa.org.cn/", "学会/竞赛入口", "medium", "中国自动化学会入口，后续可追踪机器人竞赛、会议和学术资源。");
source("SRC365", "IEEE Robotics and Automation Society", "https://www.ieee-ras.org/", "学会/论文会议入口", "high", "IEEE RAS 官方入口，覆盖 ICRA、IROS 等机器人学术会议资源。");
source("SRC366", "ROS 2 官方文档", "https://docs.ros.org/", "官方文档/ROS2", "high", "ROS 2 官方文档入口，适合核验机器人中间件生态。");
source("SRC367", "Gazebo 官方文档", "https://gazebosim.org/docs/latest/getstarted/", "官方文档/仿真", "high", "Gazebo 官方入门文档，适合移动机器人、机械臂和复合平台仿真。");
source("SRC368", "Nav2 官方文档", "https://docs.nav2.org/", "官方文档/导航", "high", "ROS 2 Navigation2 官方文档，适合移动底盘、四足和复合平台导航能力评估。");
source("SRC369", "SLAM Toolbox GitHub", "https://github.com/SteveMacenski/slam_toolbox", "GitHub/SLAM", "medium", "ROS2 SLAM Toolbox 仓库，适合室内建图和导航能力评估。");
source("SRC370", "Open RMF 官方站", "https://www.open-rmf.org/", "ROS/多机器人调度", "high", "Open Robotics Open-RMF 入口，适合多机器人协同、楼宇/校园调度和场景落地评估。");
source("SRC371", "Foxglove 文档", "https://docs.foxglove.dev/", "开发工具/可视化", "medium", "Foxglove 机器人数据可视化和调试工具文档入口。");
source("SRC372", "ROS-Industrial 官方站", "https://rosindustrial.org/", "ROS/工业机器人生态", "high", "ROS-Industrial 官方入口，适合工业机械臂、协作机器人和制造场景集成评估。");
source("SRC373", "Open Robotics Discourse", "https://discourse.ros.org/", "社区/ROS生态", "medium", "ROS 社区讨论入口，可追踪机器人平台包、驱动和集成问题。");
source("SRC374", "Meta-World Benchmark", "https://meta-world.github.io/", "论文/Benchmark", "high", "Meta-World 多任务机械臂操作 Benchmark 入口。");
source("SRC375", "Dex-Net 项目页", "https://berkeleyautomation.github.io/dex-net/", "论文/数据集/抓取", "high", "Dex-Net 抓取数据集和算法项目页。");
source("SRC376", "YCB Benchmarks", "https://www.ycbbenchmarks.com/", "数据集/物体集", "high", "YCB 物体和 Benchmark 官方入口，常用于抓取、识别和操作评估。");
source("SRC377", "BOP Challenge", "https://bop.felk.cvut.cz/", "Benchmark/6D位姿", "high", "BOP 6D 物体位姿估计 Benchmark，用于机器人抓取感知评估。");
source("SRC378", "Diffusion Policy 项目页", "https://diffusion-policy.cs.columbia.edu/", "论文/策略学习", "high", "Diffusion Policy 项目页，机器人模仿学习与操作策略训练常用方法。");
source("SRC379", "3D Diffusion Policy 项目页", "https://3d-diffusion-policy.github.io/", "论文/策略学习", "high", "3D Diffusion Policy 项目页，面向 3D 视觉机器人操作策略学习。");
source("SRC380", "MIT Robotic Manipulation 课程", "https://manipulation.mit.edu/", "课程/机器人操作", "high", "MIT Robotic Manipulation 课程，覆盖操作规划、感知和 Drake 工具链。");
source("SRC381", "Berkeley CS287 Advanced Robotics", "https://people.eecs.berkeley.edu/~pabbeel/cs287-fa19/", "课程/机器人学习", "medium", "Berkeley CS287 高级机器人课程入口。");
source("SRC382", "中国招标投标公共服务平台", "http://www.cebpubservice.com/", "招投标平台", "medium", "国家级招标投标信息平台，可补充非政府采购路径的机器人项目公告。");
source("SRC383", "ISO 13482 个人护理机器人安全", "https://www.iso.org/standard/53820.html", "安全标准", "high", "ISO 13482 个人护理机器人安全要求，适合服务机器人、人形和校园交互项目参考。");
source("SRC384", "Boston Dynamics Spot 官方页", "https://bostondynamics.com/products/spot/", "官网/四足机器人", "high", "Spot 官方产品页，作为高端四足落地标杆。");
source("SRC385", "Boston Dynamics Developer", "https://dev.bostondynamics.com/", "官方开发文档/SDK", "high", "Boston Dynamics 开发者文档入口，用于 Spot SDK 和 API 对照。");
source("SRC386", "ANYbotics ANYmal 官方页", "https://www.anybotics.com/anymal/", "官网/四足机器人", "high", "ANYmal 官方产品页，作为工业四足巡检标杆。");
source("SRC387", "Clearpath OutdoorNav", "https://clearpathrobotics.com/outdoornav/", "导航/落地方案", "medium", "Clearpath OutdoorNav 自动驾驶导航软件入口，适合户外移动平台和巡检项目参考。");
source("SRC388", "世界机器人大会", "https://www.worldrobotconference.com/", "行业会议/产业报告入口", "high", "世界机器人大会入口，可追踪中国机器人产业报告、展商和行业趋势。");
source("SRC389", "中国电子学会", "https://www.cie.org.cn/", "学会/产业报告入口", "medium", "中国电子学会入口，世界机器人大会和中国机器人产业发展报告相关组织。");
source("SRC390", "比地招标网机器人检索", "https://www.bidizhaobiao.com/search?keywords=%E6%9C%BA%E5%99%A8%E4%BA%BA", "招投标检索", "low", "比地招标网机器人关键词检索，仅作辅助线索。");
source("SRC391", "机电产品招标投标电子交易平台", "https://www.chinabidding.com/", "招投标平台", "medium", "机电产品招标投标电子交易平台，可补充机器人和仪器设备采购公告。");
source("SRC392", "RoboCup 官方入口", "https://www.robocup.org/", "竞赛/学术入口", "high", "RoboCup 官方入口，适合人形、四足、服务机器人竞赛和教育场景参考。");
source("SRC393", "IEEE ICRA 官方入口", "https://www.ieee-ras.org/conferences-workshops/fully-sponsored/icra", "会议/论文入口", "high", "IEEE ICRA 官方入口，机器人顶会来源追踪。");
source("SRC394", "IEEE IROS 官方入口", "https://www.ieee-ras.org/conferences-workshops/financially-co-sponsored/iros", "会议/论文入口", "high", "IEEE IROS 官方入口，机器人顶会来源追踪。");
source("SRC395", "Robotics Proceedings", "https://www.roboticsproceedings.org/", "论文会议索引", "high", "机器人会议论文开放索引，适合追踪 RSS、WAFR 等论文来源。");
source("SRC396", "Robotics Toolbox for Python", "https://petercorke.github.io/robotics-toolbox-python/", "开源算法工具", "medium", "Peter Corke Robotics Toolbox Python 文档入口，适合机器人建模、控制和教学。");
source("SRC397", "Pinocchio 官方文档", "https://stack-of-tasks.github.io/pinocchio/", "开源动力学库", "high", "Pinocchio 机器人动力学库入口，常用于机械臂、人形、四足控制和优化。");
source("SRC398", "OMPL 官方文档", "https://ompl.kavrakilab.org/", "开源运动规划库", "high", "Open Motion Planning Library 官方入口，常用于机械臂和移动机器人规划。");
source("SRC399", "Tesseract Robotics 文档", "https://tesseract-docs.readthedocs.io/", "开源运动规划/工业机器人", "medium", "Tesseract Robotics 文档入口，适合工业机械臂和轨迹规划生态评估。");
source("SRC400", "Open-RMF GitHub", "https://github.com/open-rmf", "GitHub/多机器人调度", "medium", "Open-RMF GitHub 组织，适合校园多机器人调度和设施集成评估。");
source("SRC401", "Robotics: Science and Systems 官方站", "https://roboticsconference.org/", "会议/论文入口", "high", "RSS 官方入口，机器人顶级学术会议，用于追踪操作、移动、四足、人形和具身智能论文。");
source("SRC402", "Conference on Robot Learning 官方站", "https://www.corl.org/", "会议/论文入口", "high", "CoRL 官方入口，机器人学习领域核心会议，用于追踪可复现实验、数据集和算法项目。");
source("SRC403", "OpenReview CoRL 论文入口", "https://openreview.net/group?id=robot-learning.org/CoRL/2025/Conference", "论文索引/OpenReview", "medium", "CoRL OpenReview 入口，可用于检索机器人学习论文、代码和评审信息。");
source("SRC404", "arXiv Robotics cs.RO", "https://arxiv.org/list/cs.RO/recent", "论文预印本入口", "medium", "arXiv Robotics 分类入口，用于持续追踪最新机器人预印本。");
source("SRC405", "IEEE Transactions on Robotics", "https://www.ieee-ras.org/publications/t-ro/", "期刊/论文入口", "high", "IEEE T-RO 官方入口，机器人领域核心期刊，用于追踪高质量平台验证论文。");
source("SRC406", "IEEE Robotics and Automation Letters", "https://www.ieee-ras.org/publications/ra-l/", "期刊/论文入口", "high", "IEEE RA-L 官方入口，机器人和自动化短论文核心来源。");
source("SRC407", "The International Journal of Robotics Research", "https://journals.sagepub.com/home/ijr", "期刊/论文入口", "high", "IJRR 官方入口，机器人研究核心期刊，用于追踪经典和长期影响力平台论文。");
source("SRC408", "Science Robotics", "https://www.science.org/journal/scirobotics", "期刊/论文入口", "high", "Science Robotics 官方入口，机器人高影响力论文来源；部分页面可能需要浏览器访问。");
source("SRC409", "RoboTurk 项目页", "https://roboturk.stanford.edu/", "论文/数据集/遥操作", "high", "Stanford RoboTurk 项目入口，真实机器人远程示教和操作数据集来源。");
source("SRC410", "FurnitureBench 项目页", "https://clvrai.github.io/furniture-bench/", "论文/Benchmark/操作", "high", "FurnitureBench 家具装配机器人 Benchmark，适合机械臂和双臂操作任务评估。");
source("SRC411", "RoboVerse 项目页", "https://roboverseorg.github.io/", "论文/Benchmark/具身智能", "medium", "RoboVerse 机器人仿真和具身任务入口，用于补充多任务操作与具身评估生态。");
source("SRC412", "VLABench 项目页", "https://vlabench.github.io/", "论文/Benchmark/VLA", "high", "VLABench 视觉语言动作 Benchmark 入口，适合评估具身大模型在机器人任务上的泛化能力。");
source("SRC413", "VLABench GitHub", "https://github.com/OpenMOSS/VLABench", "GitHub/Benchmark/VLA", "medium", "VLABench 代码仓库入口，用于判断 Benchmark 可复现性。");
source("SRC414", "RoboGen GitHub", "https://github.com/Genesis-Embodied-AI/RoboGen", "GitHub/研究项目/任务生成", "medium", "RoboGen 任务生成和具身智能研究项目入口，可作为仿真任务扩展参考。");
source("SRC415", "AI Habitat 官方站", "https://aihabitat.org/", "Benchmark/具身AI", "high", "AI Habitat 具身 AI 平台入口，适合导航、交互和移动操作任务评估。");
source("SRC416", "HumanoidBench 项目页", "https://humanoid-bench.github.io/", "论文/Benchmark/人形机器人", "high", "HumanoidBench 人形机器人 Benchmark 入口，用于评估人形平台动作、操作和泛化能力。");
source("SRC417", "HumanPlus 项目页", "https://humanoid-ai.github.io/", "论文/人形机器人项目", "high", "HumanPlus 人形机器人学习项目入口，使用真实人形平台进行动作和交互研究。");
source("SRC418", "HOVER 项目页", "https://hover-versatile-humanoid.github.io/", "论文/人形机器人项目", "high", "HOVER 多功能人形控制项目入口，用于评估人形平台全身控制和通用动作能力。");
source("SRC419", "Berkeley Humanoid 项目页", "https://berkeley-humanoid.com/", "论文/开源人形项目", "high", "Berkeley Humanoid 开源人形机器人项目入口，适合作为开放硬件和低成本科研平台对照。");
source("SRC420", "Berkeley Humanoid Lite 项目页", "https://lite.berkeley-humanoid.org/", "论文/开源人形项目", "medium", "Berkeley Humanoid Lite 轻量开源人形项目入口，适合教学和低成本平台参考。");
source("SRC421", "NIST Humanoid Robot Benchmark", "https://www.nist.gov/el/intelligent-systems-division-73500/humanoid-robot-baseline-performance-benchmark", "Benchmark/标准测试", "high", "NIST 人形机器人基准性能测试入口，适合人形平台能力验证和测试规范参考。");
source("SRC422", "RMA Legged Robots 项目页", "https://ashish-kmr.github.io/rma-legged-robots/", "论文/四足机器人项目", "high", "Rapid Motor Adaptation 足式机器人项目入口，适合四足机器人真实环境适应能力评估。");
source("SRC423", "Learning Agile Robotic Locomotion 项目页", "https://agility.csail.mit.edu/", "论文/四足机器人项目", "high", "MIT 四足敏捷运动学习项目入口，适合四足平台动态运动能力对照。");
source("SRC424", "Rapid Locomotion via RL 项目页", "https://leggedrobotics.github.io/rl-blindloco/", "论文/四足机器人项目", "high", "ETH 足式机器人强化学习运动控制项目入口，适合四足平台 sim-to-real 能力评估。");
source("SRC425", "Open6DOR 项目页", "https://pku-epic.github.io/Open6DOR/", "论文/Benchmark/操作", "high", "Open6DOR 6D 物体重排 Benchmark 入口，适合机械臂、夹爪和移动操作任务评估。");
source("SRC426", "MOKA 项目页", "https://moka-manipulation.github.io/", "论文/机器人操作项目", "medium", "MOKA 机器人操作项目入口，适合多模态操作策略和任务泛化参考。");
source("SRC427", "DexMimicGen 项目页", "https://dexmimicgen.github.io/", "论文/灵巧操作项目", "high", "DexMimicGen 灵巧操作数据生成项目入口，适合灵巧手和复杂操作方案评估。");
source("SRC428", "中国自动化学会机器人专业委员会", "https://www.caa.org.cn/article/205/908.html", "中文学会/学术入口", "medium", "中国自动化学会机器人专业委员会入口，适合中文学术活动和机器人方向专家资源追踪。");
source("SRC429", "中国人工智能学会具身智能专委会", "https://ceai.caai.cn/", "中文学会/具身智能入口", "medium", "中国人工智能学会具身智能专业委员会入口，适合跟踪国内具身智能学术活动。");
source("SRC430", "中国人工智能学会", "https://www.caai.cn/", "中文学会/学术入口", "medium", "中国人工智能学会入口，可作为国内 AI 与具身智能会议、专委会和活动追踪来源。");
source("SRC431", "《机器人》期刊官方站", "https://robot.sia.cn/", "中文期刊/论文入口", "high", "《机器人》期刊官方入口，适合追踪国内机器人研究论文和综述。");
source("SRC432", "中国汽车工程学会具身智能机器人分会", "https://www.sae-china.org/branch/385", "中文学会/产业学术入口", "medium", "中国汽车工程学会具身智能机器人分会入口，适合跟踪具身智能机器人产业和学术活动。");
source("SRC433", "AUBO Robot GitHub", "https://github.com/AuboRobot", "GitHub/官方SDK", "medium", "遨博官方 GitHub 组织入口，用于核验 AUBO 机械臂二次开发和示例代码。");
source("SRC434", "JAKA Cobot GitHub", "https://github.com/JakaCobot", "GitHub/官方SDK", "medium", "节卡官方 GitHub 组织入口，用于核验 JAKA 协作机器人 SDK、ROS 和示例代码。");
source("SRC435", "Elite Robots GitHub", "https://github.com/Elite-Robots", "GitHub/官方SDK", "medium", "艾利特官方 GitHub 组织入口，用于核验 Elite 机械臂开发生态。");
source("SRC436", "Elephant Robotics GitHub", "https://github.com/elephantrobotics", "GitHub/官方SDK", "medium", "大象机器人官方 GitHub 组织入口，用于核验 myCobot、myArm 等教学机械臂代码生态。");
source("SRC437", "Hiwonder 官方站", "https://www.hiwonder.com/", "教学机器人官网/渠道", "medium", "幻尔官方站入口，用于核验 JetAuto、JetRover 等教学与科研平台资料。");
source("SRC438", "Yahboom 官方站", "https://category.yahboom.net/", "教学机器人官网/渠道", "medium", "亚博智能官方站入口，用于核验 ROSMASTER、DOFBOT 等教学平台资料。");
source("SRC439", "AUBO 文档中心", "https://docs.aubo-robotics.cn/", "官方开发文档", "high", "遨博文档中心入口，用于核验 SDK、接口和开发资料。");
source("SRC440", "ROS Robots 索引", "https://robots.ros.org/", "ROS机器人索引", "high", "ROS Robots 官方索引入口，用于核验机器人平台是否有 ROS/ROS2 生态记录。");
source("SRC441", "ROS Index", "https://index.ros.org/", "ROS包索引", "high", "ROS Index 入口，用于检索机器人驱动、MoveIt 配置、导航和仿真包。");
source("SRC442", "GitHub Robotics Topic", "https://github.com/topics/robotics", "GitHub/开源索引", "medium", "GitHub robotics 主题入口，用于持续追踪开源机器人项目和社区活跃度。");
source("SRC443", "GitHub ROS2 Topic", "https://github.com/topics/ros2", "GitHub/ROS2索引", "medium", "GitHub ROS2 主题入口，用于持续追踪 ROS2 机器人包和生态。");
source("SRC444", "GitHub Robot Manipulation Topic", "https://github.com/topics/robot-manipulation", "GitHub/操作研究索引", "medium", "GitHub robot-manipulation 主题入口，用于追踪机械臂、抓取和移动操作开源项目。");
source("SRC445", "GitHub Quadruped Robot Topic", "https://github.com/topics/quadruped-robot", "GitHub/四足机器人索引", "medium", "GitHub quadruped-robot 主题入口，用于追踪四足机器人开源项目和仿真训练代码。");
source("SRC446", "GitHub Humanoid Robot Topic", "https://github.com/topics/humanoid-robot", "GitHub/人形机器人索引", "medium", "GitHub humanoid-robot 主题入口，用于追踪人形机器人开源项目和训练代码。");
source("SRC447", "标准信息公共服务平台", "https://std.samr.gov.cn/", "国家标准检索", "medium", "国家标准信息公共服务平台入口，用于核验机器人相关国标、推荐性标准和行业标准。");
source("SRC448", "中国机器人 CR 认证", "https://www.chinarobot.com/", "认证/安全合规", "medium", "中国机器人 CR 认证入口，适合评估机器人采购的认证、检测和合规要求。");
source("SRC449", "京东检索：遨博 AUBO i5", "https://search.jd.com/Search?keyword=%E9%81%A8%E5%8D%9A%20AUBO%20i5%20%E5%8D%8F%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东遨博 AUBO i5 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC450", "京东检索：节卡 JAKA Zu 7", "https://search.jd.com/Search?keyword=%E8%8A%82%E5%8D%A1%20JAKA%20Zu%207%20%E5%8D%8F%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东节卡 JAKA Zu 7 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC451", "京东检索：艾利特 EC66", "https://search.jd.com/Search?keyword=%E8%89%BE%E5%88%A9%E7%89%B9%20EC66%20%E5%8D%8F%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东艾利特 EC66 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC452", "京东检索：睿尔曼 RM65", "https://search.jd.com/Search?keyword=%E7%9D%BF%E5%B0%94%E6%9B%BC%20RM65%20%E6%9C%BA%E6%A2%B0%E8%87%82", "京东渠道线索", "low", "京东睿尔曼 RM65 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC453", "京东检索：宇树 Z1", "https://search.jd.com/Search?keyword=%E5%AE%87%E6%A0%91%20Z1%20%E6%9C%BA%E6%A2%B0%E8%87%82", "京东渠道线索", "low", "京东宇树 Z1 机械臂检索入口，仅作渠道线索，不作为确定报价。");
source("SRC454", "京东检索：云深处 Lite3", "https://search.jd.com/Search?keyword=%E4%BA%91%E6%B7%B1%E5%A4%84%20Lite3%20%E5%9B%9B%E8%B6%B3%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东云深处 Lite3 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC455", "京东检索：逐际 TRON1", "https://search.jd.com/Search?keyword=%E9%80%90%E9%99%85%20TRON1%20%E8%BD%AE%E8%B6%B3%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东逐际 TRON1 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC456", "京东检索：傅利叶 GR-1", "https://search.jd.com/Search?keyword=%E5%82%85%E5%88%A9%E5%8F%B6%20GR-1%20%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东傅利叶 GR-1 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC457", "京东检索：智元 A2", "https://search.jd.com/Search?keyword=%E6%99%BA%E5%85%83%20A2%20%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东智元 A2 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC458", "京东检索：乐聚 Kuavo", "https://search.jd.com/Search?keyword=%E4%B9%90%E8%81%9A%20Kuavo%20%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东乐聚 Kuavo 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC459", "京东检索：星动纪元 STAR1", "https://search.jd.com/Search?keyword=%E6%98%9F%E5%8A%A8%E7%BA%AA%E5%85%83%20STAR1%20%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东星动纪元 STAR1 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC460", "京东检索：Cobot Magic", "https://search.jd.com/Search?keyword=Cobot%20Magic%20%E6%9C%BA%E5%99%A8%E4%BA%BA", "京东渠道线索", "low", "京东 Cobot Magic 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC461", "淘宝检索：遨博 AUBO i5", "https://s.taobao.com/search?q=%E9%81%A8%E5%8D%9A%20AUBO%20i5%20%E5%8D%8F%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA", "淘宝/天猫线索", "low", "淘宝遨博 AUBO i5 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC462", "淘宝检索：节卡 JAKA Zu 7", "https://s.taobao.com/search?q=%E8%8A%82%E5%8D%A1%20JAKA%20Zu%207%20%E5%8D%8F%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA", "淘宝/天猫线索", "low", "淘宝节卡 JAKA Zu 7 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC463", "淘宝检索：艾利特 EC66", "https://s.taobao.com/search?q=%E8%89%BE%E5%88%A9%E7%89%B9%20EC66%20%E5%8D%8F%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA", "淘宝/天猫线索", "low", "淘宝艾利特 EC66 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC464", "淘宝检索：睿尔曼 RM65", "https://s.taobao.com/search?q=%E7%9D%BF%E5%B0%94%E6%9B%BC%20RM65%20%E6%9C%BA%E6%A2%B0%E8%87%82", "淘宝/天猫线索", "low", "淘宝睿尔曼 RM65 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC465", "淘宝检索：宇树 Z1", "https://s.taobao.com/search?q=%E5%AE%87%E6%A0%91%20Z1%20%E6%9C%BA%E6%A2%B0%E8%87%82", "淘宝/天猫线索", "low", "淘宝宇树 Z1 机械臂检索入口，仅作渠道线索，不作为确定报价。");
source("SRC466", "淘宝检索：云深处 Lite3", "https://s.taobao.com/search?q=%E4%BA%91%E6%B7%B1%E5%A4%84%20Lite3%20%E5%9B%9B%E8%B6%B3%E6%9C%BA%E5%99%A8%E4%BA%BA", "淘宝/天猫线索", "low", "淘宝云深处 Lite3 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC467", "淘宝检索：Unitree Go2", "https://s.taobao.com/search?q=Unitree%20Go2%20%E6%9C%BA%E5%99%A8%E7%8B%97", "淘宝/天猫线索", "low", "淘宝 Unitree Go2 检索入口，仅作渠道线索，不作为确定报价。");
source("SRC468", "淘宝检索：Hiwonder JetAuto", "https://s.taobao.com/search?q=Hiwonder%20JetAuto", "淘宝/天猫线索", "low", "淘宝 Hiwonder JetAuto 检索入口，仅作教学平台渠道线索。");
source("SRC469", "淘宝检索：Yahboom ROSMASTER", "https://s.taobao.com/search?q=Yahboom%20ROSMASTER", "淘宝/天猫线索", "low", "淘宝 Yahboom ROSMASTER 检索入口，仅作教学平台渠道线索。");
source("SRC470", "中国政府采购网检索：遨博", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E9%81%A8%E5%8D%9A", "招投标检索", "medium", "中国政府采购网遨博关键词检索入口，用于后续核验 AUBO 采购公告和中标价。");
source("SRC471", "中国政府采购网检索：节卡", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E8%8A%82%E5%8D%A1", "招投标检索", "medium", "中国政府采购网节卡关键词检索入口，用于后续核验 JAKA 采购公告和中标价。");
source("SRC472", "中国政府采购网检索：艾利特", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E8%89%BE%E5%88%A9%E7%89%B9", "招投标检索", "medium", "中国政府采购网艾利特关键词检索入口，用于后续核验 Elite 采购公告和中标价。");
source("SRC473", "中国政府采购网检索：睿尔曼", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E7%9D%BF%E5%B0%94%E6%9B%BC", "招投标检索", "medium", "中国政府采购网睿尔曼关键词检索入口，用于后续核验 RealMan 采购公告和中标价。");
source("SRC474", "中国政府采购网检索：宇树 Z1", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E5%AE%87%E6%A0%91%20Z1", "招投标检索", "medium", "中国政府采购网宇树 Z1 关键词检索入口，用于后续核验 Z1 采购公告和中标价。");
source("SRC475", "中国政府采购网检索：云深处", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E4%BA%91%E6%B7%B1%E5%A4%84", "招投标检索", "medium", "中国政府采购网云深处关键词检索入口，用于后续核验四足机器人采购公告和中标价。");
source("SRC476", "中国政府采购网检索：傅利叶", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E5%82%85%E5%88%A9%E5%8F%B6", "招投标检索", "medium", "中国政府采购网傅利叶关键词检索入口，用于后续核验 GR 系列采购公告。");
source("SRC477", "中国政府采购网检索：智元机器人", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E6%99%BA%E5%85%83%20%E6%9C%BA%E5%99%A8%E4%BA%BA", "招投标检索", "medium", "中国政府采购网智元机器人关键词检索入口，用于后续核验智元平台采购公告。");
source("SRC478", "中国政府采购网检索：乐聚机器人", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E4%B9%90%E8%81%9A%20%E6%9C%BA%E5%99%A8%E4%BA%BA", "招投标检索", "medium", "中国政府采购网乐聚机器人关键词检索入口，用于后续核验 Kuavo 采购公告。");
source("SRC479", "中国政府采购网检索：星动纪元", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E6%98%9F%E5%8A%A8%E7%BA%AA%E5%85%83", "招投标检索", "medium", "中国政府采购网星动纪元关键词检索入口，用于后续核验 STAR1 采购公告。");
source("SRC480", "中国政府采购网检索：幻尔机器人", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E5%B9%BB%E5%B0%94%20%E6%9C%BA%E5%99%A8%E4%BA%BA", "招投标检索", "medium", "中国政府采购网幻尔机器人关键词检索入口，用于后续核验教学复合平台采购公告。");
source("SRC481", "中国政府采购网检索：亚博智能", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E4%BA%9A%E5%8D%9A%E6%99%BA%E8%83%BD", "招投标检索", "medium", "中国政府采购网亚博智能关键词检索入口，用于后续核验 ROSMASTER/DOFBOT 教学平台采购公告。");
source("SRC482", "华东理工大学智能机器人综合实践平台中标公告", "https://czzx.ecust.edu.cn/cms/contentwh/download.htm?attachmentid=21c8af0cdab34fa6a6217164a0dcedba", "高校采购/中标公告", "high", "PDF 公告显示项目总中标金额 944 万元，核心货物为智元灵犀 X2 Ultra 旗舰版 3 套，货物单价 928340 元。");
source("SRC483", "复旦大学全尺寸通用人形机器人中标公告", "https://cz.fudan.edu.cn/cms/contentwh/download.htm?attachmentid=46f21da09046414c81f673dff6141ec5", "高校采购/中标公告", "high", "PDF 公告显示全尺寸通用人形机器人项目中标金额 64.69 万元，品牌宇树科技，型号 H1-2，数量 1 套，单价 646900 元。");
source("SRC484", "华东理工大学智能无人系统综合实训平台中标公告", "https://czzx.ecust.edu.cn/cms/contentwh/download.htm?attachmentid=dbb734362d664e4abb831b3648442340", "高校采购/中标公告", "high", "PDF 公告显示智能无人系统综合实训平台中标金额 415.139 万元，包含优必选多拟态具身智能教学机器人套装、智能管家机器人本体、人形机器人 TX20 等。");
source("SRC485", "西安科技大学机械臂智能与人机手臂协同创新平台中标公告", "https://www.xust.edu.cn/info/1256/21963.htm", "高校采购/中标公告", "medium", "公告列出六自由度协作机械臂、七自由度协作机械臂和力矩传感器等，Syrob5 单价 9.48 万元，KUKA LBR iiwa 7 R800 机械臂本体单价 28.6085 万元。");
source("SRC486", "复旦大学机器狗科研急需采购成交结果公告", "https://sh.zhiliaobiaoxun.com/article/86762963", "招投标聚合/成交公告", "medium", "页面显示复旦大学机器狗科研急需采购成交金额 41.05 万元，主要设备为杭州云深处 X30 四足机器人、双光云台和 5G 通讯模块。");
source("SRC487", "智元、宇树中标中国移动人形机器人采购订单", "https://finance.sina.com.cn/tech/roll/2025-07-11/doc-inffcpez2444641.shtml", "媒体/采购线索", "low", "媒体报道中移杭州 2025-2027 人形双足机器人代工服务采购总预算 1.2405 亿元，智元中选全尺寸包，宇树中选小尺寸人形、算力背包和五指灵巧手包；需以正式采购文件二次核验。");
source("SRC488", "苏州市职业大学智能机器人产教融合实训基地项目页", "https://czju.suzhou.gov.cn/zfcg/html/project/e75a3e7882564e8084876e7dad143bff.shtml", "政府采购项目页", "medium", "项目页显示智能机器人产教融合实训基地预算 280 万元，含招标公告、中标公告和采购合同入口，适合作为教学实训场景采购线索。");
source("SRC489", "myCobot 280 智能垃圾分类论文", "https://arxiv.org/abs/2604.14882", "论文/研究项目", "medium", "论文使用 MyCobot 280 Jetson Nano 机械臂、YOLOv8 和 ROS 路径规划构建智能垃圾分类系统，补充教学机械臂真实研究案例。");
source("SRC490", "AUBO-i5 多目标轨迹规划论文", "https://www.mdpi.com/2079-9292/9/5/859", "论文/机械臂研究", "high", "Electronics 论文以 AUBO-I5 协作机器人为实验对象，进行运动学建模和多目标轨迹规划。");
source("SRC491", "AUBO i5 与 DOBOT MG400 薄层色谱自动化平台论文", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9727146/", "论文/实验室自动化", "high", "开放论文使用 AUBO i5 和 DOBOT MG400 构建薄层色谱自动化平台，说明二者在实验室自动化中的研究和落地组合价值。");
source("SRC492", "JAKA ROS2 Instruction Manual", "https://www.jaka.com/docs/en/guide/V3/ROS/ROS2.html", "官方开发文档/ROS2", "high", "JAKA ROS2 文档说明当前 ROS2 包支持 JAKA Zu 7 等 6 轴协作机器人，并包含 MoveIt、RViz 可视化和仿真。");
source("SRC493", "RoboDK JAKA Zu7 模型页", "https://robodk.com/robot/JAKA/Zu7", "仿真/离线编程模型", "medium", "RoboDK JAKA Zu7 模型页列出 7 kg 负载、819 mm 臂展、0.02 mm 重复定位精度，可作为离线编程和仿真生态证据。");
source("SRC494", "睿尔曼机械臂视觉伺服开发指南", "https://develop.realman-robotics.com/AI/developerGuide/visualServo/", "中文官方开发文档/视觉伺服", "high", "睿尔曼官方视觉伺服开发指南，面向自动化生产、仓储物流、机器人抓取、科研和教育用户。");
source("SRC495", "睿尔曼 RM65 坐姿淋浴护理设备仿真论文", "https://pdf.hanspub.org/mos2025143_452572278.pdf", "中文论文/机械臂研究", "medium", "建模与仿真论文选用睿尔曼 RM65 系列六自由度机械臂，验证坐姿淋浴式智能化洗浴系统方案。");
source("SRC496", "LimX TRON1 中文官方产品页", "https://www.limxdynamics.com/zh/products/tron1", "中文官网/科研平台", "high", "逐际 TRON1 官方页说明其为多形态双足机器人和人形 RL 科研入门平台，支持开放 SDK、底层接口、Python 开发、NVIDIA Isaac、MuJoCo、Gazebo 和移动操作拓展套件。");
source("SRC497", "EngineAI PM01 中文官方产品页", "https://www.engineai.com.cn/product-pm01.html", "中文官网/参数", "high", "众擎 PM01 官方页列出身高、重量、23 自由度、约 2 h 续航、开源训练/部署代码和 ROS 部署框架线索。");
source("SRC498", "Fourier GR-2 官方介绍文档", "https://support.fftai.com/en/docs/GR-X-Humanoid-Robot/GR2/GR-2_Introduction/", "官方文档/规格", "high", "傅利叶 GR-2 文档列出 1.75 m、63 kg、最高 53 自由度、FSA 2.0 执行器和自研灵巧手等信息。");
source("SRC499", "Fourier GR-2 SDK 概览", "https://support.fftai.com/en/docs/GR-X-Humanoid-Robot/GR2/SDK/Overview/", "官方开发文档/SDK", "high", "傅利叶 GR-X SDK 文档说明 Aurora 中间件、Python 接口、DDS 通信、仿真/实机快速开始和 RL 策略部署示例。");
source("SRC500", "Xiaomi CyberDog ROS2 GitHub Raw", "https://raw.githubusercontent.com/MiRoboticsLab/cyberdog_ros2/master/README.md", "GitHub/ROS2源码", "medium", "小米 CyberDog ROS2 README 说明其基于 ROS2 实现多模态感知、人机交互、自主决策、定位导航和目标追踪等功能。");
source("SRC501", "TurtleBot4 GitHub README Raw", "https://raw.githubusercontent.com/turtlebot/turtlebot4/humble/README.md", "GitHub/ROS2源码", "medium", "TurtleBot4 common packages README，指向 TurtleBot 4 用户手册，补充 ROS2 原生教学平台代码证据。");
source("SRC502", "ROBOTIS OpenMANIPULATOR-X 文档", "https://emanual.robotis.com/docs/en/platform/openmanipulator_x/overview/", "官方文档/轻量机械臂", "high", "ROBOTIS OpenMANIPULATOR-X 官方文档，适合作为 TurtleBot4 加装轻量机械臂的教学/科研组合参考。");
source("SRC503", "DEEPRobotics X20 中文官方页", "https://www.deeprobotics.cn/robot/index/product3.html", "中文官网/规格", "high", "云深处 X20 官方页列出行业应用四足机器人参数，如 IP67、防护、续航、速度和外部接口等。");
source("SRC504", "DEEPRobotics 山猫 M20 中文官方页", "https://www.deeprobotics.cn/robot/index/lynx.html", "中文官网/规格", "high", "云深处山猫 M20 官方页列出轮足形态、33 kg 自重、15 kg 有效负载、2.5 h 有效负载续航、IP66 和激光雷达配置等参数。");
source("SRC505", "Yahboom ROSMASTER X3 教程", "https://www.yahboom.net/study/ROSMASTER-X3", "官方教程/ROS", "high", "亚博 ROSMASTER X3 教程页覆盖 ROS1 硬件、Linux、Docker、驱动库、运动控制、舵机控制和多机通信等课程内容。");
source("SRC506", "RealMan 轮式机器人产品页", "https://www.realman-robotics.com/en/main/core-products.html#wheeled-robots", "官网/复合机器人产品线", "medium", "睿尔曼英文产品页列出 Wheeled Robots、RealBOT、Humanoid、Single-Arm Lift、Dual-Arm Lift 等轮式复合机器人产品线。");
source("SRC507", "Booster Gym README Raw", "https://raw.githubusercontent.com/BoosterRobotics/booster_gym/main/README.md", "GitHub/科研项目", "medium", "Booster Gym README 说明其提供面向 Booster 机器人的强化学习框架，并关联 booster_train、booster_deploy 和 booster_assets。");
source("SRC508", "Diffusion Policy 项目页", "https://diffusion-policy.cs.columbia.edu/", "论文/机器人操作项目", "high", "RSS/IJRR 机器人操作项目页，覆盖 Push-T、Franka Kitchen、真实 UR5 任务和开源代码，是机械臂模仿学习的重要入口。");
source("SRC509", "3D Diffusion Policy 项目页", "https://3d-diffusion-policy.github.io/", "论文/机器人操作项目", "high", "RSS 2024 项目页，构建 3D 机器人操作模仿学习 Benchmark，包含真实灵巧手、夹爪和多类仿真任务。");
source("SRC510", "RVT Robotic View Transformer 项目页", "https://robotic-view-transformer.github.io/", "论文/Benchmark/操作", "high", "RVT 项目页提供论文、代码和真实/仿真操作任务，用于评估多视角 3D 机器人操作和少样本学习能力。");
source("SRC511", "PerAct 项目页", "https://peract.github.io/", "论文/Benchmark/操作", "high", "CoRL 2022 项目页，PerAct 在 RLBench 18 个任务和真实操作任务上验证语言条件 6DoF 操作策略。");
source("SRC512", "CLIPort 项目页", "https://cliport.github.io/", "论文/Benchmark/操作", "high", "CoRL 2021 项目页，CLIPort 面向语言条件桌面操作，提供论文和代码入口，可作为 UR5/夹爪类平台算法证据。");
source("SRC513", "RDT-1B 项目页", "https://rdt-robotics.github.io/rdt-robotics/", "论文/机器人基础模型", "high", "RDT-1B 项目页说明其基于 46 个数据集、100 万以上多机器人 episode 训练，并在 ALOHA 双臂上微调。");
source("SRC514", "Physical Intelligence openpi", "https://www.pi.website/blog/openpi", "GitHub/机器人基础模型", "medium", "Physical Intelligence openpi 页面说明开放 pi0 代码和权重，并支持 ALOHA、DROID 等常见研究平台微调和推理。");
source("SRC515", "Octo 模型 GitHub", "https://github.com/octo-models/octo", "GitHub/机器人基础模型", "medium", "Octo 开源仓库说明其基于约 80 万条机器人轨迹训练通用机器人策略，可用于判断跨具身模型生态。");
source("SRC516", "ManiFoundation 项目页", "https://manifoundationmodel.github.io/", "论文/机器人基础模型", "medium", "通用机器人操作基础模型项目页，作为多机器人、多物体接触合成和操作泛化方向参考。");
source("SRC517", "智元 ACoT-VLA 官方介绍", "https://www.agibot.com.cn/article/315/detail/144.html", "中文官网/论文/开源项目", "high", "智元官方介绍 ACoT-VLA 入选 CVPR 2026，并作为 AGIBOT WORLD CHALLENGE 官方基线模型开源，给出论文和 GitHub 入口。");
source("SRC518", "ACoT-VLA GitHub", "https://github.com/AgibotTech/ACoT-VLA", "GitHub/论文/机器人基础模型", "medium", "智元 ACoT-VLA 开源仓库入口，用于跟踪 AGIBOT WORLD CHALLENGE 机器人通用操控基线。");
source("SRC519", "OpenLET 具身智能开源数据集社区", "https://openlet.openatom.tech/", "中文开源社区/数据集", "high", "开放原子 OpenLET 聚焦具身智能与人形机器人真实数据开源，页面列出 Kuavo 相关数据转换、模仿学习、仿真和真机部署示例。");
source("SRC520", "ASAP 人形全身技能项目页", "https://agile.human2humanoid.com/", "论文/人形机器人项目", "high", "RSS 2025 项目页，ASAP 在真实 Unitree G1 上验证从仿真到真实的高动态全身技能迁移，并提供代码入口。");
source("SRC521", "APEX 人形高平台穿越项目页", "https://apex-humanoid.github.io/", "论文/人形机器人项目", "high", "APEX 项目页使用 29 自由度 Unitree G1 验证高平台攀爬、站起、趴下和跨技能切换。");
source("SRC522", "SteadyTray 人形托盘运输项目页", "https://steadytray.github.io/", "论文/人形机器人项目", "high", "SteadyTray 项目页展示 Unitree G1 在真实环境中执行托盘物体平衡运输任务，用于评估人形载物和动态平衡研究价值。");
source("SRC523", "HUSKY 人形滑板控制项目页", "https://husky-humanoid.github.io/", "论文/人形机器人项目", "high", "RSS 2026 项目页，HUSKY 在 Unitree G1 上验证滑板耦合动力学和全身控制，提供论文和代码入口。");
source("SRC524", "Perceptive Humanoid Parkour 项目页", "https://php-parkour.github.io/", "论文/人形机器人项目", "high", "RSS 2026 项目页，PHP 使用 Unitree G1 验证基于机载深度感知的长程跑酷、攀爬和多技能链式执行。");
source("SRC525", "Berkeley Humanoid 项目页", "https://berkeley-humanoid.com/", "论文/开源人形平台", "high", "Berkeley Humanoid 低成本中型人形研究平台项目页，提供论文、代码和 Isaac Lab 训练入口，适合作为开放平台标杆。");
source("SRC526", "Generalizable Humanoid Manipulation 项目页", "https://humanoid-manipulation.github.io/", "论文/人形操作项目", "medium", "人形上肢遥操作与 3D Diffusion Policy 项目页，面向人形机器人真实场景操作和数据效率评估。");
source("SRC527", "Psi0 Humanoid VLA GitHub", "https://github.com/physical-superintelligence-lab/Psi0", "GitHub/人形机器人基础模型", "medium", "Psi0 开源仓库说明其面向人形灵巧移动操作 VLA，可作为人形机器人基础模型方向跟踪入口。");
source("SRC528", "Barkour 四足敏捷 Benchmark", "https://research.google/blog/barkour-benchmarking-animal-level-agility-with-quadruped-robots/?m=1", "论文/四足机器人Benchmark", "high", "Google Research Barkour 页面提出四足机器人敏捷性 Benchmark，包含障碍路线、计分机制和论文入口。");
source("SRC529", "Extreme Parkour with Legged Robots", "https://extreme-parkour.github.io/", "论文/四足机器人项目", "high", "CMU 项目页展示低成本四足机器人通过单前向深度相机完成高跳、跨沟、倒立和复杂障碍穿越，并提供论文和代码入口。");
source("SRC530", "ANYmal Research 社区", "https://www.anymal-research.org/", "四足机器人研究社区", "high", "ANYmal Research 页面提供 ANYmal 研究社区、控制软件、仿真、文档和 ROS/Gazebo 兼容说明，是四足机器人科研生态标杆。");
source("SRC531", "ANYmal Parkour 论文入口", "https://arxiv.org/abs/2306.14874", "论文/四足机器人项目", "high", "ANYmal Parkour 论文入口，展示四足机器人通过学习式导航跨越连续复杂障碍，可作为高端四足平台科研对照。");
source("SRC532", "RobotRank 机器人控制 Benchmark", "https://www.robotrank.ai/", "Benchmark/四足与人形控制", "medium", "RobotRank 提供四足和人形机器人控制器云端评测、排行榜和多仿真环境支持，用于持续跟踪运动控制算法生态。");
source("SRC533", "Quadruped robot traversing 3D complex environments", "https://quad-traverse-go2.github.io/", "论文/四足机器人项目", "high", "项目页展示四足机器人在 3D 复杂环境中依靠本体感知完成碰撞响应和穿越，并提供论文、视频和附录入口。");
source("SRC534", "Dobb-E 项目页", "https://www.dobb-e.com/", "论文/移动操作项目", "high", "Dobb-E 项目页在 10 个真实家庭、109 个任务上使用 Hello Robot Stretch 验证家庭操作学习，并开放软件、模型、数据和硬件设计。");
source("SRC535", "Dobb-E 机器人控制文档", "https://docs.dobb-e.com/software/running-the-robot-server", "项目文档/移动操作", "medium", "Dobb-E 文档说明如何在 Hello Robot Stretch 上运行机器人控制服务，可用于评估 Stretch 实机复现实验链路。");
source("SRC536", "TidyBot++ 项目页", "https://tidybot2.github.io/", "论文/移动操作项目", "high", "CoRL 2024 项目页，TidyBot++ 是面向机器人学习的开源全向移动操作平台，支持任意机械臂和手机遥操作数据采集。");
source("SRC537", "OK-Robot 项目页", "https://ok-robot.github.io/", "论文/移动操作项目", "high", "OK-Robot 项目页展示基于开放知识模型的零样本家庭取放框架，在 10 个真实家庭进行 171 次任务评估，并提供代码入口。");
source("SRC538", "SayCan 项目页", "https://say-can.github.io/", "论文/移动操作项目", "high", "SayCan 项目页展示语言模型与机器人 affordance 结合的长程任务执行，是服务机器人和移动操作软件生态的重要参考。");
source("SRC539", "VoxPoser 项目页", "https://voxposer.github.io/", "论文/移动操作项目", "medium", "VoxPoser 项目页面向语言模型生成 3D 值地图与机器人操作规划，可作为移动操作和机械臂任务规划研究入口。");
source("SRC540", "Imperial Franka Panda 研究平台页", "https://www.imperial.ac.uk/robot-intelligence/robots/franka-emika-panda/", "高校实验室/机械臂研究", "medium", "Imperial College Robot Intelligence Lab 的 Franka Emika Panda 页面，列出 Panda 机械臂相关研究主题和实验室项目。");
source("SRC541", "政府采购检索：UR5e 机械臂", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=UR5e%20%E6%9C%BA%E6%A2%B0%E8%87%82", "招投标检索", "medium", "中国政府采购网 UR5e 机械臂关键词检索入口，用于持续核验进口协作臂高校采购案例。");
source("SRC542", "政府采购检索：Franka Research 3", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=Franka%20Research%203", "招投标检索", "medium", "中国政府采购网 Franka Research 3 关键词检索入口，用于跟踪力控科研机械臂采购公告。");
source("SRC543", "政府采购检索：Kinova Gen3", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=Kinova%20Gen3", "招投标检索", "medium", "中国政府采购网 Kinova Gen3 关键词检索入口，用于跟踪轻量科研机械臂采购公告。");
source("SRC544", "政府采购检索：DOBOT CR5", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=DOBOT%20CR5", "招投标检索", "medium", "中国政府采购网 DOBOT CR5 关键词检索入口，用于跟踪越疆协作机械臂采购价格。");
source("SRC545", "政府采购检索：DOBOT MG400", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=DOBOT%20MG400", "招投标检索", "medium", "中国政府采购网 DOBOT MG400 关键词检索入口，用于跟踪桌面工业机械臂采购价格。");
source("SRC546", "政府采购检索：myCobot 280", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=myCobot%20280", "招投标检索", "medium", "中国政府采购网 myCobot 280 关键词检索入口，用于跟踪桌面教学机械臂采购案例。");
source("SRC547", "政府采购检索：OpenMANIPULATOR-X", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=OpenMANIPULATOR-X", "招投标检索", "medium", "中国政府采购网 OpenMANIPULATOR-X 关键词检索入口，用于跟踪 TurtleBot4 加装机械臂组合采购线索。");
source("SRC548", "政府采购检索：Hello Robot Stretch", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=Hello%20Robot%20Stretch", "招投标检索", "medium", "中国政府采购网 Hello Robot Stretch 关键词检索入口，用于核验进口移动操作平台采购可得性。");
source("SRC549", "政府采购检索：Mobile ALOHA", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=Mobile%20ALOHA", "招投标检索", "medium", "中国政府采购网 Mobile ALOHA 关键词检索入口，用于跟踪开源移动双臂方案是否出现高校采购。");
source("SRC550", "政府采购检索：灵巧手", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E7%81%B5%E5%B7%A7%E6%89%8B", "招投标检索", "medium", "中国政府采购网灵巧手关键词检索入口，用于补充机械臂末端执行器采购线索。");
source("SRC551", "Booster Robotics 官方开源页", "https://www.booster.tech/open-source/", "官方开发文档/开源入口", "high", "Booster 官方开源页集中列出 T1/K1 手册、SDK、ROS2 SDK、RoboCup Demo、Booster Gym、Booster Train、Booster Deploy 和模型资产。");
source("SRC552", "Booster T1 Instruction Manual", "https://static.generation-robots.com/media/user-manual-booster-t1-en.pdf", "官方/渠道手册", "medium", "Booster T1 英文手册包含 SDK 概览、ROS2 通信机制、高层运动服务和底层控制接口说明。");
source("SRC553", "Booster Gym 论文", "https://arxiv.org/abs/2506.15132", "论文/人形机器人强化学习", "high", "Booster Gym 论文在 Booster T1 实机上验证端到端人形机器人强化学习和 sim-to-real 迁移。");
source("SRC554", "EngineAI GitHub 组织", "https://github.com/engineai-robotics", "GitHub/官方SDK", "medium", "众擎官方 GitHub 组织，包含 Native Control SDK 和人形机器人应用开发相关仓库。");
source("SRC555", "EngineAI Humanoid GitHub", "https://github.com/engineai-robotics/engineai_humanoid", "GitHub/官方开源项目", "medium", "EngineAI humanoid 仓库提供仿真、策略文件部署和机器人端文件路径说明，可用于 PM01/SA01 开发生态判断。");
source("SRC556", "PM01 使用手册 V1.0", "https://en-engineai-1304599088.cos.ap-guangzhou.myqcloud.com/uploads/upload/files/20251031/c15bec68ae58e2f5cd2901aad04e0750.pdf", "官方手册/规格", "high", "众擎 PM01 使用手册，补充安全、操作、维护和产品配置核验入口。");
source("SRC557", "EngineAI PM01 AI Wiki", "https://aiwiki.ai/wiki/engineai_pm01", "第三方资料/参数价格", "low", "AI Wiki 资料页汇总 PM01 身高、重量、自由度、续航、算力和 88000 元级价格线索；价格需以众擎官方或授权报价二次确认。");
source("SRC558", "RobotEra GitHub 组织", "https://github.com/roboterax", "GitHub/官方开源项目", "medium", "星动纪元 GitHub 组织，含 STAR1 模型、Robotera VLA、数据采集训练推理工作流等仓库。");
source("SRC559", "RobotEra STAR1 URDF GitHub", "https://github.com/roboterax/models", "GitHub/官方机器人模型", "medium", "RobotEra models 仓库提供 STAR1 humanoid robot URDF 描述，README 列出 55 自由度和机器人结构说明。");
source("SRC560", "RobotEra STAR1 官方规格 PDF", "https://www.robotera.com/upload/goods/20241208/f56791f6bd7fdd069e2c8552f4d3aeed.pdf", "官方规格书", "high", "RobotEra STAR1 官方 PDF 规格书，适合核验 STAR1 产品定位、自由度、运动能力和硬件参数。");
source("SRC561", "RobotEra XHAND1 官方规格 PDF", "https://www.robotera.com/upload/goods/20241208/2ab64afaae0098db948e9d4063951c28.pdf", "灵巧手官网/规格书", "high", "RobotEra XHAND1 灵巧手官方 PDF，说明支持人形机器人和机械臂，可作为星动纪元末端执行器与复合平台扩展证据。");
source("SRC562", "优必选 Walker S1 中文官方页", "https://www.ubtrobot.com/cn/humanoid/products/walker-s1", "中文官网/人形机器人", "high", "优必选 Walker S1 中文官方产品页，补充工业人形机器人官方规格和落地定位。");
source("SRC563", "优必选 Walker 英文官方页", "https://www.ubtrobot.com/en/humanoid/products/Walker", "官网/官方开发线索", "high", "优必选 Walker 英文页列出 Ubuntu、Linux RT Preempt、ROS、Android、URDF+Gazebo 等开发和仿真信息。");
source("SRC564", "优必选高职教育解决方案核心产品 PDF", "https://assets-new.ubtrobot.com/pc/static/cn/images/universities/%E4%BC%98%E5%BF%85%E9%80%89%E7%A7%91%E6%8A%80%E9%AB%98%E8%81%8C%E6%A0%A1%E6%95%99%E8%82%B2%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%E6%A0%B8%E5%BF%83%E4%BA%A7%E5%93%81.pdf", "官方教育方案/规格", "high", "优必选教育方案 PDF 提到 Walker 基于 ROS 和 Android 开发，提供 SDK、文档、Demo 和 PC 管理工具。");
source("SRC565", "Kuavo Humanoid SDK PyPI", "https://pypi.org/project/kuavo-humanoid-sdk/1.4.3b2197/", "官方/社区SDK", "medium", "kuavo-humanoid-sdk 提供机器人状态、手臂、头部、夹爪、灵巧手和步态控制接口，页面注明当前基于 ROS 环境。");
source("SRC566", "Kuavo Data Challenge 文档", "https://wanglishan.github.io/kuavo_data_challenge/", "中文文档/数据挑战", "medium", "Kuavo Data Challenge 文档覆盖数据准备、策略训练、仿真与真机部署流程，并关联 Kuavo SDK 与 OpenLET 社区。");
source("SRC567", "NOETIX Bumi 官方产品页", "https://noetixrobotics.com/en/product/n2/1262", "官网/官方规格", "high", "NOETIX Bumi 官方产品页列出 Lite/Air/Pro/Max/EDU 版本、约 98 cm、17 kg、21 自由度、2-3 h 续航和不同计算/通信配置。");
source("SRC568", "NOETIX Bumi 官方媒体页", "https://noetixrobotics.com/en/news/media/213", "官网/官方价格线索", "high", "NOETIX 官方媒体页说明 Bumi 定价 9998 元、约 94 cm、12 kg、21+ 自由度，面向教育、家庭和创客学习场景。");
source("SRC569", "NOETIX 公司介绍页", "https://noetixrobotics.com/en/about-us", "官网/公司资料", "high", "NOETIX 公司介绍页记录 Bumi、N2、E1 等产品发展节点、融资和央视春晚等应用案例。");
source("SRC570", "AgileX PiPER SDK GitHub", "https://github.com/agilexrobotics/piper_sdk", "GitHub/官方SDK", "medium", "松灵 PiPER 官方 SDK 仓库，包含 Python SDK、CAN 通信、双臂主从读取、UI 和接口文档。");
source("SRC571", "AgileX PiPER 中文使用手册", "https://new.agilex.ai/raw/upload/20241017/%EF%BC%88%E5%B7%B2%E5%8E%8B%E7%BC%A9%EF%BC%89%E6%AD%A3-PiPER%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C_%E4%B8%AD%E6%96%87%E7%89%880925_52071.pdf", "官方手册/机械臂", "high", "PiPER 机械臂中文快速使用手册，列出 SDK 与 ROS2 驱动入口，适合学校采购前核验二次开发路径。");
source("SRC572", "AgileX LIMO PRO ROS2 手册", "https://github.com/agilexrobotics/limo_pro_doc/blob/master/Limo%20Pro%20Ros2%20Foxy%20user%20manual%28EN%29.md", "官方文档/ROS2底盘", "medium", "LIMO PRO ROS2 Foxy 使用和开发手册，覆盖四种运动模式、SLAM、导航和 ROS2 工作区配置。");
source("SRC573", "AgileX 产品手册下载页", "https://global.agilex.ai/pages/manual", "官方手册/产品目录", "high", "松灵全球官网产品手册页，包含 LIMO、ROS1/ROS2 R&D Kit、Cobot Magic、Cobot S Kit 和多款底盘手册下载入口。");
source("SRC574", "AgileX Cobot Magic 渠道资料页", "https://www.robotsusa.com/Agilex-Cobotmagic-COBOT-Magic.htm", "代理渠道/复合机器人资料", "medium", "RobotsUSA Cobot Magic 页面说明其为开源移动操作平台，面向遥操作、机器人学习、数据采集、回放、可视化、训练和推理流程。");
source("SRC575", "PAL Robotics TIAGo ROS2 文档", "https://docs.pal-robotics.com/edge/tiago", "官方文档/ROS2移动操作", "high", "PAL OS 25.01 TIAGo 文档，覆盖硬件、传感器、控制器、导航、操作、人机交互和 ROS2 开发应用。");
source("SRC576", "TIAGo ROS Index 包", "https://index.ros.org/p/tiago_robot/", "ROS包索引/移动操作", "medium", "ROS Index tiago_robot 包显示 Humble 分支、Apache 2.0 许可、tiago_bringup、tiago_description 和控制配置包。");
source("SRC577", "PAL Robotics 文档中心", "https://pal-robotics.com/documentation/", "官方文档/机器人产品线", "high", "PAL Robotics 文档中心列出 TIAGo、TIAGo Pro、TIAGo Base、Kangaroo 等机器人文档入口。");
source("SRC578", "TIAGo ROS2 仿真教程", "https://pal-robotics.github.io/tiago-tutorial/tutorials_installation/simulation/index.html", "官方教程/ROS2仿真", "medium", "TIAGo ROS2 仿真教程说明可选择 pal-gripper、pal-hey5 等末端执行器并启动 Gazebo 仿真。");
source("SRC579", "Robotnik RB-KAIROS Datasheet", "https://www.roscomponents.com/wp-content/uploads/2024/11/Robotnik_Datasheet_RB-KAIROS_EN-1.pdf", "官方/渠道规格书", "medium", "RB-KAIROS 移动操作机器人规格书，列出移动底盘、UR 机械臂和 OnRobot VGC10 夹爪等配置线索。");
source("SRC580", "Hiwonder JetAuto Pro 官方商品页", "https://www.hiwonder.com/products/jetauto-pro", "官网/官方价格", "high", "JetAuto Pro 官方页显示 959.99 美元起，列出 ROS1/ROS2、SLAM 导航、6 自由度视觉机械臂、Jetson/Raspberry Pi 配置和 60 min 续航等参数。");
source("SRC581", "Hiwonder JetAuto Orin Nano 文档", "https://docs.hiwonder.com/projects/JetAuto/en/jetauto-orin-nano/index.html", "官方文档/ROS2复合平台", "high", "JetAuto/JetAuto Pro Orin Nano 文档覆盖 ROS 使用、运动控制课程、建图导航、硬件、系统框架和镜像烧录。");
source("SRC582", "Hiwonder JetRover ROS1 机械臂控制文档", "https://wiki.hiwonder.com/projects/JetRover/en/jetrover-jetson-nano/docs/11_ROS1-Robotic_Arm_Control.html", "官方文档/机械臂控制", "medium", "JetRover 文档说明 6DOF 机械臂、动作组、基础控制和安全状态评估流程。");
source("SRC583", "Hiwonder JetRover ROS2 机械臂控制课程", "https://wiki.hiwonder.com/projects/JetRover/en/jetrover-jetson-nano/docs/22_ROS2-Robot_Arm_Control_Course.html", "官方文档/ROS2机械臂控制", "medium", "JetRover ROS2 机械臂控制课程，补充 ROS2 下机械臂舵机偏差调整和控制流程。");
source("SRC584", "Hiwonder GitHub 组织", "https://github.com/Hiwonder", "GitHub/官方代码", "medium", "Hiwonder 官方 GitHub 组织，含 hiwonder_robot 等 ROS AI Robot 相关开源仓库。");
source("SRC585", "Yahboom ROSMASTER X3 GitHub", "https://github.com/YahboomTechnology/ROSMASTERX3", "GitHub/官方ROS2代码", "medium", "亚博 ROSMASTER X3 官方仓库，说明其为 Jetson/Raspberry Pi 平台的 ROS2 麦克纳姆轮教育机器人，支持雷达避障、3D 建图和导航。");
source("SRC586", "Yahboom ROSMASTER X3 教程下载页", "https://www.yahboom.net/study/ROSMASTER-X3", "官方教程/下载入口", "high", "亚博 ROSMASTER X3 教程页提供 Instruction Manual、SystemFile_ROS2 等资料下载入口。");
source("SRC587", "Inspire RH56 系列灵巧手用户手册", "https://en.inspire-robots.com/wp-content/uploads/2024/02/INSPIRE-ROBOTS-THE-DEXTEROUS-HAND-RH56-SERIES-USER-MANUAL.pdf", "灵巧手官网/手册", "high", "因时 RH56 系列灵巧手手册，包含寄存器、力反馈、控制接口等细节，适合机械臂/人形末端集成评估。");
source("SRC588", "UFACTORY + Inspire RH56DFX 集成文档", "https://docs.supportarticle.ufactory.cc/support_articles/developer/ufactory-RH56DFX.html", "官方开发文档/灵巧手集成", "high", "UFACTORY 文档展示 xArm 与 Inspire RH56DFX 左/右手集成应用，适合评估 xArm 复合平台末端扩展。");
source("SRC589", "DexRobot DexHand021 Concept", "https://www.dex-robot.com/en/dexhand", "灵巧手官网/研究平台", "high", "DexRobot DexHand021 Concept 页列出 18 自由度、多模态感知、一体化集成和可维护设计。");
source("SRC590", "DexRobot DexHand021 Mass Production", "https://www.dex-robot.com/en/productionDexhand", "灵巧手官网/量产平台", "high", "DexRobot DexHand021 量产页说明高自由度五指灵巧手、智能热管理、多模态感知和开放 SDK 支持。");
source("SRC591", "BrainCo RevoHand SDK 文档", "https://www.brainco-hz.com/docs/revolimb-hand/en/revo1/get_sdk.html", "灵巧手官网/SDK", "high", "强脑 RevoHand SDK 文档说明灵巧手 SDK 提供完整编程接口和控制功能，并指向 GitHub。");
source("SRC592", "Oymotion ROHand SDK 资源 PDF", "https://www.oymotion.com/upload/files/20251031145923ROHand_Links_EN-V1.0.5.pdf", "灵巧手官网/SDK资源", "medium", "傲意 ROHand 资源 PDF 汇总 UART/RS485/CAN 接口、C/C++ SDK、Python SDK 和驱动下载入口。");
source("SRC593", "DexCanvas 灵巧操作项目页", "https://dexcanvas.github.io/", "论文/灵巧操作数据集", "high", "DexCanvas 项目页提供灵巧手-物体交互数据集、论文、GitHub 和 Hugging Face 入口，用于评估灵巧手科研生态。");
source("SRC594", "ISO 10218-1:2025 工业机器人安全要求", "https://www.iso.org/standard/73933.html", "安全标准/工业机器人", "high", "ISO 10218-1:2025 涵盖工业机器人本体安全设计、风险降低和使用信息，是协作臂和工业机械臂采购安全审查基础。");
source("SRC595", "ISO/TS 15066 协作机器人安全规范", "https://www.iso.org/standard/62996.html", "安全标准/协作机器人", "high", "ISO/TS 15066:2016 补充协作工业机器人系统和工作环境安全要求，适用于人机共域协作场景。");
source("SRC596", "ISO 13482:2014 个人护理/服务机器人安全要求", "https://www.iso.org/standard/53820.html", "安全标准/服务机器人", "high", "ISO 13482:2014 覆盖移动服务机器人、物理辅助机器人和载人机器人安全要求，可作为校园服务/人形机器人安全参考。");
source("SRC597", "ISO/FDIS 13482 服务机器人安全要求", "https://www.iso.org/standard/83498.html", "安全标准/服务机器人", "medium", "ISO/FDIS 13482 是服务机器人安全要求新版草案状态，适合持续跟踪非工业人形/服务机器人合规趋势。");
source("SRC598", "ISO 3691-4:2023 无人驾驶工业车辆安全", "https://www.iso.org/fr/standard/83545.html", "安全标准/移动机器人", "high", "ISO 3691-4:2023 面向无人驾驶工业车辆及系统，覆盖 AGV/AMR 等移动机器人安全要求和验证。");
source("SRC599", "ANSI/RIA R15.08-1 工业移动机器人安全", "https://webstore.ansi.org/standards/ria/ansiriar15082020", "安全标准/移动机器人", "medium", "ANSI/RIA R15.08-1-2020 是工业移动机器人安全要求标准，可作为 AMR/移动底盘和复合平台采购安全参考。");
source("SRC600", "GB/T 5226.1-2019 机械电气安全", "https://www.codeofchina.com/standard/GBT5226.1-2019.html", "国家标准/电气安全", "medium", "GB/T 5226.1-2019 覆盖机械电气设备通用要求、急停、控制功能、保护接地和验证等条款，适用于实验室设备验收清单。");
source("SRC601", "陕西具身智能实训系统招标参数 PDF", "https://www.ccgp-shaanxi.gov.cn/gpx-bid-file/ZF_JGBM_000003/zone/2025/1/12/project/gpx-template/8a69c82c9a637a1c019cad8336824663.pdf?accessCode=ae0b88da45535cc78c2e6b432e2b044b", "招标文件/验收与售后", "medium", "具身智能实训系统招标文件含小型四足、人形、复合动作编排、二次开发支持和 7*24 售后等要求，可作为学校采购需求模板。");
source("SRC602", "广东具身智能训练场系统集成招标公告", "https://www.gdebidding.com/zbxxgg/183472.jhtml", "招标公告/验收运维", "medium", "广东具身智能训练场项目要求数据采集、数据管理、仿真、模型训练推理平台交付，6 个月完成全部功能初验并提供 2 年免费运维。");
source("SRC603", "台州具身智能概念验证中心采购公告", "https://www.tzpre.com/index.php/cms/item-view-id-41802.shtml", "招标公告/具身智能平台", "medium", "台州具身智能概念验证中心采购公告涉及 50 台具身机器人、算力、多维感知、遥操作设备、场景开发和数据采集软件许可。");
source("SRC604", "艾利特协作机器人实训平台采购部署手册", "https://www.elibot.com/tideflow/LpDHtj4l.html", "厂商指南/采购部署", "medium", "艾利特文章总结协作机器人实训平台采购中的需求分析、预算规划、场地准备、课程设计、师资培训和维护升级成本。");
source("SRC605", "中山大学设备采购合同验收培训通知", "https://sbc.sysu.edu.cn/article/1302", "高校流程/验收培训", "medium", "中山大学设备采购合同执行管理系统培训通知，说明设备类采购合同与设备验收流程需纳入学校管理系统。");
source("SRC606", "机器人设备采购合同验收范本", "https://max.book118.com/html/2025/1122/7160152133011013.shtm", "合同范本/验收培训", "low", "机器人设备采购合同范本描述设备本体、安装调试、技术培训、功能测试、外观检查和文件核实等验收要点，仅作低置信合同参考。");
source("SRC607", "RealSense D455 官方页", "https://www.intelrealsense.com/depth-camera-d455/", "传感器官网/深度相机", "high", "Intel RealSense D455 官方页，适合移动操作、机械臂视觉抓取和四足导航的深度相机配套评估。");
source("SRC608", "Orbbec Gemini 2 官方页", "https://www.orbbec.com/products/gemini-2-gemini-2-l/", "传感器官网/深度相机", "high", "奥比中光 Gemini 2/Gemini 2 L 官方页，作为国产 RGB-D 传感器配套来源。");
source("SRC609", "Hesai XT32 激光雷达官方页", "https://www.hesaitech.com/product/xt32/", "传感器官网/激光雷达", "high", "禾赛 XT32 激光雷达官方页，适合移动底盘、四足和室外导航方案配套评估。");
source("SRC610", "Livox Mid-360 官方页", "https://www.livoxtech.com/mid-360", "传感器官网/激光雷达", "high", "Livox Mid-360 官方页，常用于 SLAM、导航、四足和移动机器人低成本激光雷达方案。");
source("SRC611", "NVIDIA Jetson AGX Orin Developer Kit", "https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/", "边缘算力官网", "high", "NVIDIA Jetson AGX Orin 官方页，补充具身智能机器人边缘推理和多传感器处理算力来源。");
source("SRC612", "NVIDIA Isaac ROS 文档", "https://nvidia-isaac-ros.github.io/", "官方文档/机器人软件", "high", "NVIDIA Isaac ROS 文档覆盖视觉、SLAM、导航、DNN 推理和 ROS 2 加速，用于评估机器人软件栈和算力配套。");
source("SRC613", "Stanford ALOHA 2 项目页", "https://aloha-2.github.io/", "论文/双臂操作项目", "high", "ALOHA 2 项目页提供硬件改进、遥操作、数据采集、ACT 训练和部署入口，是学校自研双臂/移动操作平台的重要研究参考。");
source("SRC614", "Stanford Robot Utility Models 项目页", "https://robotutilitymodels.com/", "论文/机器人基础模型", "high", "RUM 项目页聚焦多机器人、多任务、多环境的 Robot Utility Models，可作为跨平台泛化和平台通用性判断依据。");
source("SRC615", "MOO 开放世界物体操作项目页", "https://robot-moo.github.io/", "论文/移动操作项目", "high", "MOO 面向开放世界物体操作，连接感知、语言和操作链路，适合评估 Stretch/TIAGo/自研复合平台的软件生态。");
source("SRC616", "RoboHive GitHub", "https://github.com/vikashplus/robohive", "GitHub/机器人学习框架", "medium", "RoboHive 提供真实和仿真机器人学习环境，覆盖 Franka、Adroit Hand、DManus 等平台，可作为机械臂和灵巧手研究工具链来源。");
source("SRC617", "RoboSet 项目页", "https://robopen.github.io/roboset/", "论文/数据集/遥操作", "high", "RoboSet 是大规模真实机器人遥操作数据集入口，含多任务操作和策略学习资料，用于评估示教数据采集生态。");
source("SRC618", "TACO Play 数据集入口", "https://www.tensorflow.org/datasets/catalog/taco_play", "论文/数据集/机械臂", "medium", "TACO Play 数据集入口记录 Franka Kitchen 相关真实交互数据，可补充 Franka 在长期操作学习中的科研证据。");
source("SRC619", "Language-Table GitHub", "https://github.com/google-research/language-table", "GitHub/数据集/语言条件操作", "medium", "Language-Table 仓库提供真实机器人语言条件操作数据集和多任务连续控制 Benchmark，适合作为 xArm/桌面机械臂语言控制研究对照。");
source("SRC620", "RT-1 Robotics Transformer 项目页", "https://robotics-transformer1.github.io/", "论文/机器人基础模型", "high", "RT-1 项目页展示真实机器人数据训练的 Robotics Transformer，可作为服务机器人和移动操作基础模型研究入口。");
source("SRC621", "BC-Z 论文入口", "https://arxiv.org/abs/2202.02005", "论文/机器人操作项目", "medium", "BC-Z 论文入口展示多任务行为克隆和语言/视觉条件操作策略，可作为真实操作数据采集与泛化评估来源。");
source("SRC622", "RoboTurk 项目页", "https://roboturk.stanford.edu/", "论文/遥操作数据集", "medium", "RoboTurk 项目页面向云端众包机器人遥操作数据采集，是低成本示教采集方案的早期标杆。");
source("SRC623", "HERMES 人形遥操作项目页", "https://gemcollector.github.io/HERMES/", "论文/人形操作项目", "high", "HERMES 项目页展示人形机器人全身遥操作和复杂操作任务，可作为人形上肢/全身操作研究入口。");
source("SRC624", "HumanPlus 论文 PDF", "https://humanoid-ai.github.io/HumanPlus.pdf", "论文/人形机器人项目", "medium", "HumanPlus 论文展示人形机器人从人类动作到真实机器人技能迁移，适合评估 Unitree H1/G1 等人形平台的科研通用性。");
source("SRC625", "Human2Humanoid 项目页", "https://human2humanoid.com/", "论文/人形机器人项目", "high", "Human2Humanoid 项目页展示从人体视频到人形机器人运动技能学习，是人形机器人运动学习和 sim-to-real 的重要入口。");
source("SRC626", "OmniH2O 项目页", "https://omni.human2humanoid.com/", "论文/人形机器人项目", "high", "OmniH2O 项目页展示人形机器人全身遥操作和实时跟踪，适合评估 Unitree H1/G1、Fourier GR 等平台的研究适配度。");
source("SRC627", "HumanoidBench 项目页", "https://humanoid-bench.github.io/", "论文/Benchmark/人形机器人", "high", "HumanoidBench 提供仿真人形机器人全身控制和操作基准，可作为人形平台算法复现实验对照。");
source("SRC628", "Humanoid Parkour Learning 项目页", "https://humanoid4parkour.github.io/", "论文/人形机器人项目", "high", "Humanoid Parkour Learning 项目页展示人形机器人复杂地形跑酷技能学习，用于评估人形运动控制研究热点。");
source("SRC629", "Expressive Whole-Body Control 项目页", "https://expressive-humanoid.github.io/", "论文/人形机器人项目", "medium", "Expressive Whole-Body Control 项目页展示人形机器人全身表达式运动控制，适合人形交互和动作生成方向跟踪。");
source("SRC630", "Open-TeleVision 项目页", "https://robot-tv.github.io/", "论文/人形遥操作项目", "high", "Open-TeleVision 项目页展示用于人形机器人遥操作的数据采集和控制框架，可作为人形平台二次开发生态证据。");
source("SRC631", "HugWBC 项目页", "https://hugwbc.github.io/", "论文/人形机器人项目", "medium", "HugWBC 项目页展示人形机器人全身控制与人机交互任务，用于补充人形落地前的控制研究证据。");
source("SRC632", "Learning Agile Soccer Skills for a Bipedal Robot 论文入口", "https://arxiv.org/abs/2304.13653", "论文/双足机器人项目", "medium", "双足机器人足球技能学习论文入口，适合把人形/双足运动能力与强化学习生态纳入对照。");
source("SRC633", "Berkeley Humanoid Lite GitHub", "https://github.com/HybridRobotics/Berkeley-Humanoid-Lite", "GitHub/开源人形硬件", "medium", "Berkeley Humanoid Lite 开源硬件仓库，适合作为低成本人形平台可制造性和开放硬件对照。");
source("SRC634", "Unitree Go2 Isaac Sim 项目文档", "https://docs.artefacts.com/example-projects/go2/", "项目文档/四足仿真", "medium", "Go2 Isaac Sim 项目文档展示 Unitree Go2 仿真接入流程，可作为 Go2 教学科研仿真生态证据。");
source("SRC635", "Learning Humanoid Locomotion over Challenging Terrain 项目页", "https://humanoid-challenging-terrain.github.io/", "论文/人形/四足运动项目", "high", "项目页覆盖复杂地形运动学习，可作为人形和四足平台共享的运动控制研究入口。");
source("SRC636", "Walk These Ways GitHub", "https://github.com/Improbable-AI/walk-these-ways", "GitHub/四足机器人项目", "medium", "Walk These Ways 仓库展示 Unitree Go1 真实平台的可控步态学习，代码已在四足研究中广泛复用。");
source("SRC637", "DayDreamer 项目页", "https://danijar.com/project/daydreamer/", "论文/四足机器人项目", "medium", "DayDreamer 项目页展示从少量真实交互中学习四足机器人运动等任务，可作为样本效率和真实机器人强化学习对照。");
source("SRC638", "Rapid Locomotion via Reinforcement Learning 项目页", "https://agility.csail.mit.edu/", "论文/四足机器人项目", "medium", "MIT 四足机器人敏捷运动项目页，作为 Unitree/ANYmal 等四足平台运动控制研究参考。");
source("SRC639", "Spot SDK GitHub", "https://github.com/boston-dynamics/spot-sdk", "GitHub/官方SDK/四足", "medium", "Boston Dynamics Spot SDK 官方仓库，适合把 Spot 作为高端落地四足平台的软件生态对照。");
source("SRC640", "ANYmal Perceptive Locomotion 项目页", "https://leggedrobotics.github.io/rl-perceptiveloco/", "论文/四足机器人项目", "high", "ANYmal 感知式运动项目页展示真实四足机器人复杂地形导航能力，是高端四足科研标杆。");
source("SRC641", "ANYmal Parkour 论文入口", "https://arxiv.org/abs/2306.14874", "论文/四足机器人项目", "high", "ANYmal Parkour 论文入口提供真实机器人复杂障碍穿越研究，适合高端四足运动能力对照。");
source("SRC642", "Open Dynamic Robot Initiative", "https://open-dynamic-robot-initiative.github.io/", "开源硬件/四足平台", "high", "Open Dynamic Robot Initiative 汇集开源执行器、Solo 四足、TriFinger 等研究硬件，可作为开源低成本四足和操作平台对照。");
source("SRC643", "HomeRobot OVMM 项目页", "https://ovmm.github.io/", "论文/移动操作项目", "high", "HomeRobot 开放词汇移动操作项目入口，汇集真实/仿真移动操作任务、代码和挑战赛资料，可作为持续扩源索引。");
source("SRC644", "Simbot Challenge 入口", "https://ai2thor.allenai.org/robothor/", "Benchmark/具身导航", "medium", "AI2-THOR/ RoboTHOR 入口覆盖导航、交互和具身任务评测，可作为移动机器人算法生态参考。");
source("SRC645", "Habitat 3.0 项目页", "https://aihabitat.org/habitat3/", "Benchmark/具身AI", "high", "Habitat 3.0 支持具身智能、多智能体、人机协作和导航/操作评估，适合移动操作与服务机器人算法对照。");
source("SRC646", "Habitat-Matterport 3D Semantics 数据集", "https://aihabitat.org/datasets/hm3d-semantics/", "数据集/具身导航", "medium", "HM3D-Semantics 是具身导航和室内语义理解常用数据集入口，适合移动平台感知导航课题配套。");
source("SRC647", "BEHAVIOR-1K 项目页", "https://behavior.stanford.edu/index.html", "Benchmark/具身任务", "high", "BEHAVIOR-1K 提供 1000 个日常任务和仿真/评测生态，可作为家庭服务与复合机器人任务库参考。");
source("SRC648", "Gibson Environment 项目页", "http://gibsonenv.stanford.edu/", "仿真/具身环境", "medium", "Gibson Environment 项目页提供真实扫描室内环境和导航/交互仿真资源，适合移动机器人和复合平台算法训练。");
source("SRC649", "AI2-THOR 官方站", "https://ai2thor.allenai.org/", "仿真/具身环境", "high", "AI2-THOR 是室内交互和具身 AI 常用仿真平台，可作为机器人导航、交互和任务规划算法生态来源。");
source("SRC650", "Open X-Embodiment Dataset GitHub", "https://github.com/google-deepmind/open_x_embodiment", "GitHub/多机器人数据集", "medium", "Open X-Embodiment 数据集仓库汇集多机器人数据转换和使用入口，可作为采购平台未来数据接入能力评估依据。");
source("SRC651", "DROID Dataset GitHub", "https://github.com/droid-dataset/droid", "GitHub/数据集/机械臂", "medium", "DROID 数据集仓库提供数据下载、处理和训练入口，补充 Franka/Panda 数据生态证据。");
source("SRC652", "RH20T GitHub", "https://github.com/rh20t/rh20t_api", "GitHub/数据集/机械臂", "medium", "RH20T API 仓库提供清华 RH20T 数据集读取和处理接口，补充真实遥操作数据链路。");
source("SRC653", "LeRobot 真实机器人入门文档", "https://huggingface.co/docs/lerobot/main/en/getting_started_real_world_robot", "官方文档/机器人学习框架", "high", "LeRobot 真实机器人文档覆盖数据采集、训练、回放和部署，是教学科研平台软件生态重要入口。");
source("SRC654", "Isaac Lab 官方文档", "https://isaac-sim.github.io/IsaacLab/", "官方文档/仿真训练", "high", "Isaac Lab 官方文档支持机器人强化学习、模仿学习和 sim-to-real，适合人形、四足和机械臂平台统一训练评估。");
source("SRC655", "MuJoCo Playground GitHub", "https://github.com/google-deepmind/mujoco_playground", "GitHub/仿真训练", "medium", "MuJoCo Playground 提供 JAX 强化学习环境和机器人任务示例，可作为四足、人形和机械臂仿真训练工具链。");
source("SRC656", "Baidu AI Studio 具身智能课程检索", "https://aistudio.baidu.com/aistudio/education/group/info/30135", "中文课程/具身智能", "low", "中文具身智能课程入口线索，用于后续补充学校课程建设和教学资源，具体内容需逐项核验。");
source("SRC657", "中国大学 MOOC 机器人学检索", "https://www.icourse163.org/search.htm?search=%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%AD%A6", "中文课程/机器人学", "low", "中文机器人学课程检索入口，可作为教学平台配套课程资源线索。");
source("SRC658", "OpenI 启智社区具身智能检索", "https://openi.pcl.ac.cn/explore/repos?q=%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD", "中文开源社区/具身智能", "low", "启智社区具身智能项目检索入口，适合持续追踪中文开源项目，但需逐项核验质量。");
source("SRC659", "Hiwonder JetRover 官方商品页价格", "https://www.hiwonder.com/products/jetrover", "官网/官方价格", "high", "JetRover 官方商品页元数据列出 779.99 美元价格，页面说明其为 ROS 教育复合机器人，含 Jetson/树莓派、三种底盘形态和 6 自由度机械臂。");
source("SRC660", "Yahboom ROSMASTER X3 官方商品页价格", "https://category.yahboom.net/products/rosmaster-x3", "官网/官方价格", "high", "ROSMASTER X3 官方商品页元数据列出 659 美元价格，页面说明其为 ROS2 麦克纳姆轮 AI 语音交互教育机器人，支持 Jetson Orin/Raspberry Pi 5。");
source("SRC661", "Yahboom DOFBOT Jetson Nano 官方商品页价格", "https://category.yahboom.net/products/dofbot-jetson_nano", "官网/官方价格", "high", "DOFBOT 官方商品页元数据列出 339 美元价格，页面说明其为基于 Jetson Nano 的 6DOF AI 视觉机械臂，支持 ROS2 和 Python。");
source("SRC662", "AgileX PiPER 全球官网价格", "https://global.agilex.ai/products/piper", "官网/官方价格", "high", "AgileX 全球官网 PiPER 商品页元数据列出 1999 美元价格，用于学校采购前的公开价估算。");
source("SRC663", "AgileX LIMO PRO 全球官网价格", "https://global.agilex.ai/products/limo-pro", "官网/官方价格", "high", "AgileX 全球官网 LIMO PRO 商品页元数据列出 3200 美元价格，用于 LIMO + PiPER 复合平台组合估算。");
source("SRC664", "Clearpath TurtleBot 4 发布价", "https://clearpathrobotics.com/blog/2022/05/clearpath-robotics-launches-turtlebot-4/", "官方发布/价格", "medium", "Clearpath 官方发布页列出 TurtleBot 4 Lite 与 Standard 发布价分别为 1195 美元和 1850 美元；当前采购需按代理或渠道复核。");
source("SRC665", "Robozaps TurtleBot 4 渠道价格", "https://robozaps.com/products/turtlebot-4", "代理渠道/价格线索", "medium", "Robozaps 渠道页列出 TurtleBot 4 价格区间 1495-3495 美元，仅作为海外渠道可采购性和价格线索。");
source("SRC666", "ROBOTIS OpenMANIPULATOR-X 官方价格", "https://www.robotis.us/openmanipulator-x-rm-x52-tnm/", "官网/官方价格", "high", "ROBOTIS 官方商品页列出 OpenMANIPULATOR-X RM-X52-TNM 价格 1629.09 美元，说明其为 ROS 开源机械臂，可与移动底盘集成。");
source("SRC667", "Diffusion Policy 论文入口", "https://arxiv.org/abs/2303.04137", "论文/机器人操作项目", "high", "Diffusion Policy arXiv 论文入口，覆盖 12 个真实与仿真操作任务，是机械臂、灵巧操作和移动操作策略学习的重要基线。");
source("SRC668", "Diffusion Policy GitHub", "https://github.com/real-stanford/diffusion_policy", "GitHub/机器人学习框架", "medium", "Diffusion Policy 官方代码仓库，适合评估机器人示教数据、策略训练和复现实验链路。");
source("SRC669", "RDT-1B 论文入口", "https://arxiv.org/abs/2410.07864", "论文/机器人基础模型", "high", "RDT-1B arXiv 论文入口，面向双臂操作和移动操作的 Diffusion Transformer 基础模型，补充项目页、模型和代码之外的正式论文证据。");
source("SRC670", "RDT-1B GitHub", "https://github.com/thu-ml/RoboticsDiffusionTransformer", "GitHub/机器人基础模型", "medium", "RDT-1B 官方 PyTorch 仓库，说明其可兼容单臂、双臂、末端位姿、关节控制和轮式移动操作等多种机器人形态。");
source("SRC671", "OpenPI GitHub", "https://github.com/Physical-Intelligence/openpi", "GitHub/机器人基础模型", "medium", "Physical Intelligence OpenPI 官方仓库，包含 pi0 系列 VLA 模型和机器人策略训练基础设施。");
source("SRC672", "pi0 论文入口", "https://arxiv.org/abs/2410.24164", "论文/机器人基础模型", "high", "Physical Intelligence pi0 arXiv 论文入口，提出 Vision-Language-Action Flow Model，用于多机器人形态的通用机器人控制研究。");
source("SRC673", "pi0 in the Wild 项目页", "https://penn-pal-lab.github.io/Pi0-Experiment-in-the-Wild/", "论文/机器人基础模型评测", "medium", "Penn PAL Lab 对 pi0 在真实 Franka 机械臂上的开放式实验评测入口，可用于判断 VLA 零样本与泛化能力风险。");
source("SRC674", "3D Diffusion Policy 论文入口", "https://arxiv.org/abs/2403.03954", "论文/机器人操作项目", "high", "DP3 arXiv 论文入口，使用单视角点云和 diffusion policy 做真实机器人操作，覆盖灵巧手和夹爪任务。");
source("SRC675", "3D Diffusion Policy GitHub", "https://github.com/YanjieZe/3D-Diffusion-Policy", "GitHub/机器人操作项目", "medium", "DP3 官方仓库，适合评估 3D 视觉、深度相机、点云输入和低样本模仿学习的软件可复现性。");
source("SRC676", "Improved 3D Diffusion Policy GitHub", "https://github.com/YanjieZe/Improved-3D-Diffusion-Policy", "GitHub/人形操作项目", "medium", "iDP3 官方仓库，面向 Fourier GR-1 等人形机器人真实操作任务，补充人形上肢操作和遥操作复现链路。");
source("SRC677", "FP3 3D Foundation Policy GitHub", "https://github.com/horipse01/3d-foundation-policy", "GitHub/机器人基础模型", "medium", "FP3 仓库说明其基于 DROID 数据预训练 3D point cloud 语言-视觉-动作策略，可作为机械臂 3D 基础策略跟踪入口。");
source("SRC678", "Act3D 项目页", "https://act3d.github.io/", "论文/机器人操作项目", "medium", "Act3D 项目页，面向 3D feature field 的机器人操作策略 Transformer，可作为 3D 视觉操作算法对照。");
source("SRC679", "OpenVLA 论文入口", "https://arxiv.org/abs/2406.09246", "论文/VLA模型", "high", "OpenVLA arXiv 论文入口，介绍 7B 开源 VLA 模型及 97 万真实机器人示教数据训练，适合评估机械臂与复合平台的软件接入。");
source("SRC680", "NVIDIA Isaac GR00T N1 研究页", "https://research.nvidia.com/publication/2025-03_nvidia-isaac-gr00t-n1-open-foundation-model-humanoid-robots", "论文/人形机器人基础模型", "high", "NVIDIA Research GR00T N1 页面，说明其在 Fourier GR-1 和 1X 人形机器人上进行语言条件双臂操作验证。");
source("SRC681", "NVIDIA Isaac-GR00T GitHub", "https://github.com/NVIDIA/Isaac-GR00T", "GitHub/人形机器人基础模型", "medium", "NVIDIA Isaac-GR00T 官方仓库，提供 GR00T N 系列人形机器人 VLA 模型训练和部署入口。");
source("SRC682", "GR00T N1 论文入口", "https://arxiv.org/abs/2503.14734", "论文/人形机器人基础模型", "high", "NVIDIA GR00T N1 arXiv 论文入口，面向通用人形机器人基础模型，补充开发者页和 GitHub 之外的正式论文证据。");
source("SRC683", "Intern Robotics GitHub", "https://github.com/InternRobotics", "GitHub/中文具身智能平台", "medium", "上海 AI 实验室 Intern Robotics GitHub 组织，覆盖操作、导航、感知、人形、遥操作和数据集等具身智能基础设施。");
source("SRC684", "Intern Robotics 文档", "https://internrobotics.github.io/", "文档/中文具身智能平台", "medium", "Intern Robotics 文档入口，介绍通用仿真平台 InternUtopia 和导航、操作、人形等工具库。");
source("SRC685", "InternVLA-A1 项目页", "https://internrobotics.github.io/internvla-a1.github.io/", "论文/中文VLA项目", "high", "上海 AI 实验室 InternVLA-A1 项目页，面向机器人操作的理解、生成和行动统一模型，提供论文、数据、代码和模型入口。");
source("SRC686", "XR-1 VLA 项目页", "https://xr-1-vla.github.io/", "论文/中文VLA项目", "high", "XR-1 项目页，面向跨机器人平台的视觉-语言-动作模型，关联 RoboMIND 和天工等机器人具身数据。");
source("SRC687", "XR-1 论文入口", "https://arxiv.org/abs/2511.02776", "论文/中文VLA项目", "medium", "XR-1 arXiv 入口，说明其面向异构数据和多机器人平台的统一视觉-运动表示学习。");
source("SRC688", "RoboMIND 2.0 论文入口", "https://arxiv.org/abs/2512.24653", "论文/数据集/中文项目", "medium", "RoboMIND 2.0 arXiv 入口，覆盖 31 万级双臂移动操作轨迹、六类机器人具身和 739 个复杂任务。");
source("SRC689", "AGIBOT WORLD 2026 官方开源介绍", "https://www.agibot.com.cn/article/315/detail/148.html", "中文官网/数据集", "high", "智元官方介绍 AGIBOT WORLD 2026 真实场景具身数据集开源，用于跟踪国产人形和操作数据生态。");
source("SRC690", "上海 AI 实验室具身智能开源周", "https://www.shlab.org.cn/news/5444209", "中文研究机构/开源项目", "high", "上海 AI 实验室具身智能开源周文章，集中介绍导航、操作、运动大模型、数据集和评测项目。");
source("SRC691", "上海 AI 实验室 Intern-Robotics 发布", "https://www.shlab.org.cn/news/5444187", "中文研究机构/具身平台", "high", "上海 AI 实验室 WAIC 2025 文章，介绍 Intern-Robotics 具身全栈引擎、Intern·Nav、Intern·Manip、Intern·Humanoid 等工具。");
source("SRC692", "上海交通大学 ScaleLab", "https://scalelab-sjtu.github.io/index.html", "高校实验室/具身智能", "medium", "上海交通大学空间认知与机器人自主学习实验室，研究大规模机器人具身操作数据集、灵巧手、低成本双臂和 Diffusion Policy。");
source("SRC693", "Embodied AI Hub 知识门户", "https://www.tabyue.com/", "中文学术资源导航", "low", "中文具身智能知识门户，汇集 OXE、DROID、AGIBOT WORLD、操作/导航/仿真数据集和开源项目导航；具体条目需逐项核验。");
source("SRC694", "RoboHub 人形机器人与具身智能资源导航", "https://aet123.com/", "中文学术资源导航", "low", "中文具身智能资源导航，覆盖 VLA、运动控制、灵巧操作、仿真平台、开源数据集和论文社区，适合作为持续扩源线索。");
source("SRC695", "Datawhale every-embodied GitHub", "https://github.com/datawhalechina/ai-hardware-robotics", "GitHub/中文课程项目", "medium", "Datawhale 具身智能实践项目，覆盖从 VLA/OpenVLA/SmolVLA/pi0 到低成本机器人实践，适合作为学校课程建设入口。");
source("SRC696", "RH20T 论文入口", "https://arxiv.org/abs/2307.00595", "论文/数据集/机械臂", "medium", "RH20T arXiv 入口，说明其包含 11 万级真实机器人接触丰富操作序列，补充清华 RH20T 项目页和 API 仓库证据。");
source("SRC697", "UMI on Legs 项目页", "https://umi-on-legs.github.io/", "论文/四足加臂/移动操作项目", "high", "UMI on Legs 项目页，展示将 UMI 示教数据和全身控制器迁移到带臂四足机器人，适合 Unitree Go2 + Z1 等复合形态对照。");
source("SRC698", "UMI on Legs GitHub", "https://github.com/real-stanford/umi-on-legs", "GitHub/四足加臂/移动操作项目", "medium", "UMI on Legs 官方仓库，提供四足机器人移动操作策略与全身控制复现实验入口。");
source("SRC699", "Unitree Go2 + 机械臂强化学习项目", "https://illuminate.uqcloud.net/project/016597BE8A", "高校研究项目/四足加臂", "medium", "UQ 项目页说明在 Unitree Go2 四足机器人加机械臂上开发 locomotion 与 manipulation 统一强化学习控制栈。");
source("SRC700", "Barkour Robot GitHub", "https://github.com/google-deepmind/barkour_robot", "GitHub/四足Benchmark", "medium", "Google DeepMind Barkour Robot 仓库，补充四足敏捷性 Benchmark 的开源硬件/控制实现入口。");
source("SRC701", "Unitree Go2 U 型楼梯强化学习论文", "https://arxiv.org/abs/2602.14473", "论文/四足机器人项目", "medium", "arXiv 论文入口，使用 Unitree Go2 通过两阶段强化学习训练 U 型楼梯攀爬能力。");
source("SRC702", "Go2 复杂 3D 环境穿越论文", "https://arxiv.org/abs/2404.18225", "论文/四足机器人项目", "medium", "arXiv 论文入口，使用 Unitree Go2 在复杂 3D 环境中基于有限感知进行穿越和碰撞响应。");
source("SRC703", "RLDX-1 GitHub", "https://github.com/RLWRLD/RLDX-1", "GitHub/机器人基础模型", "medium", "RLDX-1 官方仓库，覆盖 LIBERO、SIMPLER、RoboCasa、GR-1 Tabletop 等单臂、双臂和人形操作 Benchmark。");
source("SRC704", "RLDX-1-FT-GR1 Hugging Face", "https://huggingface.co/RLWRLD/RLDX-1-FT-GR1", "模型库/人形操作", "medium", "RLDX-1 针对 Fourier GR-1 Tabletop 24 任务人形操作 Benchmark 微调模型入口，可作为 GR-1 科研生态证据。");
source("SRC705", "RLDX-1 官方介绍", "https://www.rlwrld.ai/en/rldx-1", "官方项目/机器人基础模型", "medium", "RLWRLD RLDX-1 官方页，介绍多模态感知、触觉/力矩、长时记忆和人形/灵巧操作 Benchmark 结果。");
source("SRC706", "GR-1 Manipulation 项目页", "https://gr1-manipulation.github.io/", "论文/机器人操作项目", "medium", "GR-1 Manipulation 项目页，展示视频生成预训练用于视觉机器人操作，作为机器人基础模型与真实操作任务对照。");
source("SRC707", "RobotShop DOBOT MG400 商品页", "https://www.robotshop.com/products/dobot-mg400-robotic-arm", "代理渠道/价格线索", "medium", "RobotShop 商品页列 DOBOT MG400 价格 3,780 美元，并列出 ±0.05 mm 重复定位精度和配套夹爪附件价格。");
source("SRC708", "RobotLAB DOBOT CR5 Research 商品页", "https://www.robotlab.com/store/dobot-cr5", "代理渠道/价格线索", "medium", "RobotLAB 页面列 DOBOT CR5 Research 直接购买价格 22,980 美元，RaaS 起价 482 美元/月，含部署和初始培训线索。");
source("SRC709", "Devonics Universal Robots UR5e 商品页", "https://www.devonics.com/product-page/universal-robots-ur5e", "代理渠道/价格线索", "medium", "Devonics 商品页列 Universal Robots UR5e 价格 38,363 美元，作为海外渠道价格线索，国内需代理复核。");
source("SRC710", "Generation Robots Kinova Gen3 商品页", "https://www.generationrobots.com/en/404170-bras-robotique-gen-3-kinova.html", "代理渠道/价格线索", "medium", "Generation Robots 页面列 Kinova Gen3 Robotic Arm 起价 18,720 欧元含税，并提供 6/7 DoF、视觉和快接配置选择。");
source("SRC711", "RobotsUSA Unitree B2 商品页", "https://www.robotsusa.com/Unitree-B2-ROBOT-B2.htm", "代理渠道/价格线索", "medium", "RobotsUSA 页面列 Unitree B2 Robot Dog 价格 85,900 美元，作为海外渠道价格线索；官方和国内采购需另行报价。");
source("SRC712", "RobotsUSA Unitree A2 价格页", "https://www.robotsusa.com/Unitree-A2.htm", "代理渠道/价格线索", "medium", "RobotsUSA 页面列 Unitree A2 Standard 29,995 美元、A2 Pro 38,950 美元、A2-W 版本更高，作为海外渠道价格线索。");
source("SRC713", "Sourcewell STEMfinity Unitree 价格表", "https://files.sourcewell.org/public/Shared%20Documents/Solicitations/11090/00007504/Additional%20Documents/Sourcewell%20010725-STN%20Price%20List.pdf", "教育渠道/价格表", "medium", "Sourcewell/STEMfinity 价格表列 Unitree Go2 Pro 和 Unitree Z1 Robotic Arms 等教育渠道价格；具体配置和国内学校采购适用性需复核。");
source("SRC714", "AUBO i5 捷克渠道价格页", "https://www.aubo.cz/kolaborativni-roboty-aubo/aubo-i5/", "代理渠道/价格线索", "medium", "AUBO 捷克渠道页列 AUBO i5 价格 16,490 欧元，并列出 5 kg 负载、886 mm 臂展、±0.02 mm 重复定位精度等参数。");
source("SRC715", "Triple Automation JAKA Zu 7 商品页", "https://www.tripleautomation.com/product-page/jaka-zu-7-collaborative-robot", "代理渠道/价格线索", "medium", "Triple Automation 页面列 JAKA Zu 7 Collaborative Robot 价格 31,950 美元，作为海外渠道采购价格线索。");
source("SRC716", "Unchained Robotics Elite EC66 商品页", "https://unchainedrobotics.de/pl/products/robot/cobot/elite-ec66", "代理渠道/价格线索", "medium", "Unchained Robotics 页面列 Elite Robots EC66 价格 16,875 欧元未税，并列出 914 mm 臂展、6 kg 负载和 0.03 mm 重复定位精度。");
source("SRC717", "MYBOTSHOP RealMan RM65 机械臂商品页", "https://www.mybotshop.de/Realman-robotic-arm-RM65_1", "代理渠道/价格线索", "medium", "MYBOTSHOP 页面列 Realman robotic arm RM65 价格 16,099.95 欧元，作为海外渠道价格线索。");
source("SRC718", "MYBOTSHOP RealMan RM65 单臂移动复合机器人商品页", "https://www.mybotshop.de/Realman-Combound-Robot-Mobile-manipulator-RM65-single-arm_2", "代理渠道/价格线索", "medium", "MYBOTSHOP 页面列 Realman Combound Robot Mobile manipulator RM65 single arm 价格 41,599.95 欧元，作为睿尔曼移动复合机器人渠道价线索。");
source("SRC719", "Robozaps Fourier GR-1 商品页", "https://robozaps.com/products/gr-1", "代理渠道/价格线索", "low", "Robozaps 页面列 Fourier GR-1 价格 125,000 美元；人形机器人配置和供货差异大，仅作低置信渠道线索。");
source("SRC720", "HumanoidSpecs RobotEra STAR1 资料页", "https://humanoidspecs.com/robots/robotera-star1", "第三方资料/参数价格", "low", "HumanoidSpecs 资料页列 RobotEra STAR1 价格 120,000 美元、55 自由度和约 2 h 运行时间，价格需向厂商正式核验。");
source("SRC721", "RoboCup Humanoid Robot Program", "https://robotprogram.robocup.org/", "竞赛采购计划/价格线索", "medium", "RoboCup Humanoid Robot Program 页面列 Fourier GR-1、GR-1 Mini 和 Unitree G1/R1 面向队伍的常规价与优惠价，可作为科研竞赛采购参考。");
source("SRC722", "Generation Robots Robotnik RB-KAIROS 商品页", "https://www.generationrobots.com/en/404396-rb-kairos-indoor-autonomous-mobile-robot.html", "代理渠道/价格线索", "medium", "Generation Robots 页面列 Robotnik RB-KAIROS 移动底盘起价 50,400 欧元含税；RB-KAIROS+ 加机械臂完整方案需另行询价。");
source("SRC723", "TIAGo 研究平台 ICRA fact sheet", "https://www.ce.cit.tum.de/fileadmin/w00cgn/rsi/Files/ICRA19_workshop/fact_sheet_pal_robotics.pdf", "厂商资料/价格线索", "low", "PAL Robotics TIAGo fact sheet 列硬件配置起价 48,000 欧元；资料年份较早，当前配置和报价需向 PAL 正式确认。");
source("SRC724", "Robozaps AgiBot A2 商品页", "https://robozaps.com/products/agibot-a2", "代理渠道/价格线索", "low", "Robozaps 页面列 AgiBot A2 价格 120,000 美元；智元 A2 实际采购需以厂商正式报价为准。");
source("SRC725", "GrabaRobot 移动操作机器人价格指南", "https://www.grabarobot.com/robots/mobile-manipulator/price-guide/", "行业价格指南", "low", "GrabaRobot 2026 移动操作机器人价格指南给出研究级移动操作平台 3-6 万美元、工业级 6-12 万美元等分层区间，仅作预算框架参考。");
source("SRC726", "Robots-Australia Unitree Z1 商品页", "https://robots-australia.com.au/products/unitree-z1", "代理渠道/价格线索", "medium", "Robots-Australia 页面列 Unitree Z1 标准版 7,000 澳元、Z1 Pro 8,700 澳元，作为海外渠道价格线索。");
source("SRC727", "DEEP Robotics 美国商店 Lynx M20 Pro", "https://shop.deeprobotics.us/products/lynx-m20-pro", "官方商店/价格线索", "high", "DEEP Robotics 美国官方商店 Lynx M20 Pro 页面列 3,299 美元价格，作为山猫 M20 Pro 海外官方价线索。");
source("SRC728", "RobotShop LimX Dynamics TRON 1 EDU 商品页", "https://www.robotshop.com/products/limx-dynamics-tron-1-multi-modal-biped-robot-edu", "代理渠道/价格线索", "medium", "RobotShop 页面列 LimX Dynamics TRON 1 Multi-modal Biped Robot EDU 价格 16,995 美元，作为 TRON1 教育版渠道价线索。");
source("SRC729", "Reichelt LimX TRON1 EDU 商品页", "https://www.reichelt.com/de/en/shop/product/limx_tron1_edu_ai_robot_software_board-391438", "代理渠道/价格线索", "medium", "Reichelt 页面列 LimX TRON1 EDU 约 19,992.55 欧元，提供欧洲渠道价格交叉核验。");
source("SRC730", "Sourcewell STEMfinity Unitree Go1 EDU 价格表", "https://www.sourcewell-mn.gov/sites/default/files/2024-01/STEMfinity_010719-STN_Pricing_6.pdf", "教育渠道/价格表", "medium", "Sourcewell/STEMfinity 2024 价格表列 Unitree Go1 EDU Plus 11,900 美元、Go1 EDU 17,750 美元等教育渠道价格；需确认 Go1 当前是否仍可采购。");
source("SRC731", "Unitree Go1 官方历史页", "https://www.unitree.com/go1/", "官网/历史产品", "medium", "Unitree Go1 官方历史页面入口，用于确认上一代 Go1 的产品定位和在售/停售信息需向厂商复核。");
source("SRC732", "Robozaps Fourier GR-2 商品页", "https://robozaps.com/products/gr-2", "代理渠道/价格线索", "low", "Robozaps 页面列 Fourier GR-2 价格 125,000 美元；人形配置和供货差异大，仅作低置信渠道线索。");
source("SRC733", "HumanoidSpecs UBTECH Walker S1 资料页", "https://humanoidspecs.com/robots/ubtech-walker-s1", "第三方资料/参数价格", "low", "HumanoidSpecs 页面列 UBTECH Walker S1 价格约 110,000 美元，价格需向优必选正式核验。");
source("SRC734", "Robots-Australia Leju Kuavo 商品页", "https://robots-australia.com.au/products/leju-kuavo", "代理渠道/价格线索", "low", "Robots-Australia 页面列 Leju Kuavo 价格 80,000 澳元，作为海外渠道价格线索。");
source("SRC735", "Robots-Australia AgileX Cobot Magic 商品页", "https://robots-australia.com.au/products/agilex-cobot-magic", "代理渠道/价格线索", "low", "Robots-Australia 页面列 AgileX Cobot Magic 价格 99,999 澳元，复合平台配置差异大，仅作低置信渠道线索。");
source("SRC736", "AgileX Cobot Magic 使用手册", "https://github.com/agilexrobotics/agilex_docs/blob/master/cobot_magic/cobot_magic_user_manual.md", "官方文档/复合平台", "medium", "AgileX Cobot Magic 使用手册入口，补充复合平台规格、操作和集成验证来源。");
source("SRC737", "RobotsUSA DEEP Robotics X20 商品页", "https://www.robotsusa.com/DeepRobotics-X20-ROBOT-X20.htm", "代理渠道/询价线索", "medium", "RobotsUSA DEEP Robotics X20 页面作为海外渠道询价入口，未列公开价格；适合证明可采购渠道但不能作为确定报价。");
source("SRC738", "Robots-Australia AgileX Mobile Manipulator 商品页", "https://robots-australia.com.au/products/agilex-mobile-manipulator", "代理渠道/组合价格线索", "low", "Robots-Australia 页面列 AgileX Mobile Manipulator 价格 95,000 澳元，作为 xArm/AgileX 类移动操作组合的低置信预算线索。");
source("SRC739", "Franka Robotics Mobile FR3 Duo", "https://franka.de/mobile-fr3-duo", "官网/移动复合平台", "high", "Franka 官方 Mobile FR3 Duo 页面，说明其为双臂移动操作研究平台，可作为 Franka 移动组合的官方方案来源。");
source("SRC740", "Mobile FR3 Duo 产品手册", "https://franka.de/hubfs/20250403_Product%20Manual_Mobile%20FR3%20Duo_1.0_EN.pdf", "官方手册/移动复合平台", "high", "Mobile FR3 Duo 官方产品手册，补充移动 Franka 双臂平台的硬件、安全、运输和部署要求。");
source("SRC741", "Clearpath Jackal UGV 购买页", "https://clearpathrobotics.com/jackal-small-unmanned-ground-vehicle-robot/buy-jackal/", "官网/询价渠道", "medium", "Clearpath Jackal 官方购买/询价入口，可作为自研移动底盘备选采购渠道；页面通常需提交配置询价。");
source("SRC742", "ExBody2 人形全身控制项目页", "https://exbody2.github.io/", "论文/人形机器人项目", "high", "ExBody2 项目页展示真实人形机器人全身动作跟踪、行走、下蹲、拳击和搬箱等任务，可作为 Unitree G1 类平台运动控制研究入口。");
source("SRC743", "ZeroWBC 人形视觉运动控制项目页", "https://zerowbc.github.io/", "论文/人形机器人项目", "high", "ZeroWBC 项目页说明从人类第一视角视频生成自然人形机器人动作，并在 Unitree G1 上执行踢、坐、避障等场景交互。");
source("SRC744", "HUSKY 人形滑板控制项目页", "https://husky-humanoid.github.io/", "论文/人形机器人项目", "high", "HUSKY 项目页展示 Unitree G1 在真实滑板任务上的动态平衡和全身控制，是高动态人形控制的前沿入口。");
source("SRC745", "HUSKY arXiv 论文入口", "https://arxiv.org/abs/2602.03205", "论文/人形机器人项目", "medium", "HUSKY 预印本说明其在 Unitree G1 平台验证人形滑板系统，用于跟踪动态交互任务的论文证据。");
source("SRC746", "KungfuBot PBHC GitHub", "https://github.com/TeleHuman/PBHC", "GitHub/人形机器人项目", "medium", "KungfuBot 官方实现仓库，支持 KungfuBot 和 KungfuBot2 相关全身动作跟踪研究，并说明使用 Unitree G1 作为测试平台。");
source("SRC747", "CLAW 人形语言标注动作数据论文", "https://arxiv.org/abs/2604.11251", "论文/人形机器人数据", "medium", "CLAW 论文面向 Unitree G1 生成语言条件全身动作数据，可作为人形机器人数据构建和动作库研究入口。");
source("SRC748", "Unitree IL LeRobot GitHub", "https://github.com/unitreerobotics/unitree_il_lerobot", "GitHub/官方研究代码", "medium", "宇树官方 LeRobot 适配项目，用于 G1 双臂灵巧手数据采集、训练和测试，补充 G1 操作学习链路。");
source("SRC749", "Unitree WebRTC Connect GitHub", "https://github.com/legion1581/unitree_webrtc_connect", "GitHub/社区开发工具", "medium", "社区 WebRTC 驱动支持 Unitree Go2 与 G1 的高层控制、视频流和数据通道，可作为低门槛二次开发线索。");
source("SRC750", "Unitree Go2 Robot 文档站", "https://unitree-go2-robot.github.io/", "文档/ROS2/研究项目", "medium", "Rey Juan Carlos University 智能机器人实验室维护的 Go2 ROS2 文档站，覆盖状态、遥操作和动作接口等开源集成资料。");
source("SRC751", "Unitree-Go2-Robot GitHub 组织", "https://github.com/Unitree-Go2-Robot", "GitHub/ROS2/研究项目", "medium", "Unitree-Go2-Robot 组织提供 Go2 ROS2 集成、驱动、SLAM 和导航相关仓库，适合评估 Go2 科研社区生态。");
source("SRC752", "autonomy_stack_go2 GitHub", "https://github.com/jizhang-cmu/autonomy_stack_go2", "GitHub/四足自主导航", "medium", "CMU 相关 Go2 自主探索和导航栈，支持边建图边导航，适合校园巡检和自主移动研究评估。");
source("SRC753", "Go2 Navigation 项目页", "https://gfchen01.cc/project/go2-navigation/", "研究项目/四足导航", "medium", "Go2 Navigation 项目页展示仅使用 Unitree 原始 L1 激光雷达实现导航平台，适合评估 Go2 无改装自主导航可行性。");
source("SRC754", "McARL 四足泛化运动论文", "https://arxiv.org/abs/2505.18418", "论文/四足机器人项目", "medium", "McARL 论文从 Unitree Go1 策略迁移到 Go2 等不同形态四足机器人，用于判断 Go1/Go2 运动研究连续性。");
source("SRC755", "四足双足化移动操作论文", "https://arxiv.org/abs/2507.20382", "论文/四足移动操作", "medium", "Bipedalism for Quadrupedal Robots 论文在 Unitree Go2 上验证推车、探测障碍和载荷运输等任务，可作为四足移动操作证据。");
source("SRC756", "SysNav 跨具身导航项目页", "https://cmu-vln.github.io/", "论文/跨具身导航项目", "high", "SysNav 项目页面向轮式机器人、Unitree Go2 和 Unitree G1 的真实跨具身目标导航，适合对比机械狗、人形与轮式平台落地能力。");
source("SRC757", "Triple-zero Robot Agent GitHub", "https://github.com/triple-zeropp/Triple-zero-robot-agent", "GitHub/跨具身导航项目", "medium", "Triple-zero Robot Agent 仓库关联 Unitree G1 和 Go2 异构协作导航研究，补充多机器人/跨形态实验入口。");
source("SRC758", "Functional Manipulation Benchmark", "https://functional-manipulation-benchmark.github.io/files/index.html", "论文/机械臂Benchmark", "high", "FMB 项目页使用 Franka Panda 构建真实接触丰富操作 Benchmark，提供数据、控制栈和复现实验说明。");
source("SRC759", "FMB IJRR 论文入口", "https://journals.sagepub.com/doi/10.1177/02783649241276017", "论文/机械臂Benchmark", "high", "IJRR 论文说明 FMB 使用 Franka Panda 及多相机/力反馈配置，是评估高频科研机械臂的重要证据。");
source("SRC760", "FrankaPy CMU 论文入口", "https://www.ri.cmu.edu/publications/a-modular-robotic-arm-control-stack-for-research-franka-interface-and-frankapy/", "论文/机械臂控制栈", "medium", "CMU Franka-Interface 和 FrankaPy 技术报告说明其面向 Franka Panda 的模块化研究控制栈。");
source("SRC761", "LeRobot 论文入口", "https://arxiv.org/abs/2602.22818", "论文/开源机器人学习框架", "medium", "LeRobot 论文入口说明其面向端到端机器人学习的开源库和可复现实验流程，可关联教学机械臂、ALOHA 和 G1 等平台。");
source("SRC762", "Robot Control Stack 项目页", "https://robotcontrolstack.github.io/", "论文/机器人学习控制栈", "high", "Robot Control Stack 项目页覆盖 FR3/Panda、xArm7、UR5e 和 SO101 的真实机器人控制、数据采集和 VLA 推理。");
source("SRC763", "Robot Control Stack GitHub", "https://github.com/RobotControlStack/robot-control-stack", "GitHub/机器人学习控制栈", "medium", "Robot Control Stack 代码仓库提供 Gymnasium 风格接口、遥操作采集和远程模型推理，适合学校统一实验软件栈评估。");
source("SRC764", "HomeRobot Open Vocabulary Mobile Manipulation", "https://ovmm.github.io/", "论文/移动操作项目", "high", "HomeRobot OVMM 项目页提供仿真 Benchmark 和基于 Hello Robot Stretch 的真实移动操作软件栈。");
source("SRC765", "HomeRobot AAAI 论文入口", "https://ojs.aaai.org/index.php/AAAI-SS/article/view/27723", "论文/移动操作项目", "high", "AAAI Symposium 论文说明 HomeRobot 初始基于 Hello Robot Stretch，强调可复现移动操作研究平台。");
source("SRC766", "TidyBot++ 使用文档", "https://tidybot2.github.io/docs/", "项目文档/移动操作", "medium", "TidyBot++ 文档包含开源全向移动操作平台的装配、BOM 和使用说明，可作为自研复合机器人参考。");
source("SRC767", "URDF Hub 开源机器人模型库", "https://www.urdfhub.com/", "学术资源/仿真模型库", "medium", "URDF Hub 汇集 Franka Panda、UR5e、TurtleBot、Spot 等仿真模型，可作为课程和仿真实验模型入口。");
source("SRC768", "清华大学具身智能与机器人研究院", "https://eir.tsinghua.edu.cn/", "中文高校研究机构", "high", "清华大学具身智能与机器人研究院官网，作为国内具身智能研究布局、数据算力和多学科交叉方向跟踪入口。");
source("SRC769", "清华具身智能系统北京市重点实验室", "https://www.au.tsinghua.edu.cn/info/1221/4049.htm", "中文高校研究机构", "high", "清华自动化系具身智能系统北京市重点实验室入口，聚焦具身智能基础理论、核心技术和系统应用。");
source("SRC770", "上海交通大学 HIROL 类人智能实验室", "https://hirol.sjtu.edu.cn/", "中文高校实验室/具身智能", "high", "上海交通大学 HIROL 实验室入口，研究机器人类人感知、决策、运动规划、模仿学习和强化学习。");
source("SRC771", "北京大学 DexGraspNet 论文入口", "https://arxiv.org/abs/2210.02697", "论文/灵巧手数据集", "medium", "DexGraspNet 正式论文入口，补充灵巧手抓取数据集的论文证据，适合末端执行器和灵巧操作选型。");
source("SRC772", "信通院具身智能发展报告 2024", "https://www.caict.ac.cn/english/research/whitepapers/202411/P020241129533358612352.pdf", "中文产业/学术报告", "medium", "中国信通院具身智能发展报告，梳理国内外具身智能、数据集、机器人本体和标准趋势，可作宏观研究背景来源。");
source("SRC773", "Robotin 具身智能数据平台", "https://robotin.cc/", "中文数据平台/具身智能", "medium", "Robotin 具身智能数据平台入口，聚焦真实场景多模态交互数据，可作为后续商业数据来源和落地数据采集对照。");
source("SRC774", "OpenDataLab 论文入口", "https://arxiv.org/abs/2407.13773", "论文/开放数据平台", "medium", "OpenDataLab 论文说明开放数据平台和数据获取能力，可作为具身智能数据资产管理与下载基础设施参考。");
source("SRC775", "arXiv Robotics 最新论文入口", "https://arxiv.org/list/cs.RO/recent", "学术检索/机器人论文", "medium", "arXiv cs.RO 最新论文入口，用于持续追踪机械臂、人形、四足和移动操作方向的新论文。");
source("SRC776", "Semantic Scholar 检索：Unitree G1", "https://www.semanticscholar.org/search?q=Unitree%20G1%20humanoid%20robot&sort=relevance", "学术检索/人形机器人", "low", "Semantic Scholar 对 Unitree G1 人形机器人论文的检索入口，作为持续扩源线索，具体论文需逐篇核验。");
source("SRC777", "Semantic Scholar 检索：Unitree Go2", "https://www.semanticscholar.org/search?q=Unitree%20Go2%20quadruped%20robot&sort=relevance", "学术检索/四足机器人", "low", "Semantic Scholar 对 Unitree Go2 四足机器人论文的检索入口，适合持续追踪导航、SLAM、控制和移动操作论文。");
source("SRC778", "Semantic Scholar 检索：Franka Panda Manipulation", "https://www.semanticscholar.org/search?q=Franka%20Panda%20robot%20manipulation&sort=relevance", "学术检索/机械臂", "low", "Semantic Scholar 对 Franka/Panda 操作学习论文的检索入口，补充高频科研机械臂的持续扩源路径。");
source("SRC779", "Papers With Code：Robot Manipulation", "https://paperswithcode.com/task/robot-manipulation", "学术榜单/Benchmark", "medium", "Papers With Code 机器人操作任务页，适合跟踪开源代码、数据集和 Benchmark 结果。");
source("SRC780", "GitHub Topic：embodied-ai", "https://github.com/topics/embodied-ai", "GitHub/主题检索", "medium", "GitHub embodied-ai 主题入口，用于持续发现具身智能开源项目和课程代码。");
source("SRC781", "GitHub Topic：robot-learning", "https://github.com/topics/robot-learning", "GitHub/主题检索", "medium", "GitHub robot-learning 主题入口，用于持续发现机器人学习、模仿学习和强化学习开源项目。");
source("SRC782", "GitHub Topic：humanoid-robot", "https://github.com/topics/humanoid-robot", "GitHub/主题检索", "medium", "GitHub humanoid-robot 主题入口，用于追踪人形机器人硬件、仿真和控制开源项目。");
source("SRC783", "GitHub Topic：quadruped-robot", "https://github.com/topics/quadruped-robot", "GitHub/主题检索", "medium", "GitHub quadruped-robot 主题入口，用于追踪四足机器人控制、仿真、ROS 和开源硬件项目。");
source("SRC784", "GitHub Topic：lerobot", "https://github.com/topics/lerobot", "GitHub/主题检索", "medium", "GitHub lerobot 主题入口，用于持续跟踪 LeRobot 兼容机械臂、移动操作平台和教学项目。");
source("SRC785", "Open Source Robotics Alliance", "https://osralliance.org/", "开源机器人组织/生态", "high", "OSRA 负责 ROS、Gazebo、Open-RMF、ros-controls 等开源机器人项目治理，是评估机器人软件生态长期稳定性的关键入口。");
source("SRC786", "Open Robotics Discourse", "https://discourse.ros.org/", "开源机器人社区", "medium", "Open Robotics Discourse 是 ROS、Gazebo、Open-RMF 和开源机器人项目发布、讨论与社区支持入口。");
source("SRC787", "RoboCup@Home 官方入口", "https://athome.robocup.org/", "竞赛/服务机器人", "medium", "RoboCup@Home 服务机器人竞赛入口，可作为移动操作、导航、人机交互和落地任务评测参考。");
source("SRC788", "RoboCup Humanoid League", "https://humanoid.robocup.org/", "竞赛/人形机器人", "medium", "RoboCup Humanoid League 入口，用于跟踪人形机器人运动、感知和竞赛平台生态。");
source("SRC789", "RoboMaster 机甲大师官方入口", "https://www.robomaster.com/zh-CN", "竞赛/教学机器人", "medium", "RoboMaster 赛事和教育生态入口，可作为学校工程实践、机电控制、视觉和多机器人协作课程来源。");
source("SRC790", "中国自动化学会具身智能专委会", "https://www.caa.org.cn/article/205/916.html", "中文学会/具身智能", "high", "中国自动化学会具身智能专业委员会入口，适合作为国内学术组织、论坛和研究动态追踪来源。");
source("SRC791", "CCF 智能机器人专业委员会", "https://www.ccf.org.cn/Chapters/TC/TC_Listing/TCIR/2020-02-07/695008.shtml", "中文学会/智能机器人", "high", "中国计算机学会智能机器人专委会入口，覆盖智能机器人学术活动、竞赛和产学研协作。");
source("SRC792", "中国自动化学会共融机器人专委会", "https://www.caa.org.cn/article/205/1108.html", "中文学会/共融机器人", "medium", "中国自动化学会共融机器人专业委员会入口，适合跟踪人机协作、视觉推理、学习和机器人应用研究。");
source("SRC793", "智源具身智能与人形机器人论坛", "https://hub.baai.ac.cn/view/55074", "中文学术论坛/趋势", "medium", "智源社区具身智能与人形机器人论坛入口，覆盖世界模型、通用机器人脑、全身运动操作和产业落地趋势。");
source("SRC794", "中科院机器人与智能系统全国重点实验室", "https://rlab.sia.cas.cn/xwxx/kydt/202601/t20260123_821534.html", "中文科研机构/基金项目", "medium", "机器人与智能系统全国重点实验室国家自然科学基金重大项目新闻，补充国内机器人基础研究方向和资金布局线索。");
source("SRC795", "Awesome Embodied AI", "https://github.com/dustland/awesome-embodied-ai", "GitHub/学术资源导航", "medium", "具身智能和人形机器人资源导航，汇集论文、数据集、开源项目、公司和机器人等持续扩源入口。");
source("SRC796", "Awesome-Embodied-AI", "https://github.com/wadeKeith/Awesome-Embodied-AI", "GitHub/学术资源导航", "medium", "覆盖 VLA 模型、数据集、仿真器、Benchmark、工具包和安全主题的具身智能资源库。");
source("SRC797", "Awesome Humanoid Manipulation", "https://github.com/Tsunami-kun/awesome-humanoid-manipulation", "GitHub/人形操作资源导航", "medium", "人形上肢操作、双臂灵巧操作、手内操作和类人操作论文资源导航。");
source("SRC798", "Awesome Humanoid Robot Learning", "https://github.com/YanjieZe/awesome-humanoid-robot-learning", "GitHub/人形学习资源导航", "medium", "人形机器人学习论文清单入口，适合持续跟踪全身控制、运动操作和 sim-to-real 方向。");
source("SRC799", "Awesome Embodied AI Datasets", "https://github.com/freekatz/awesome-embodied-ai-datasets", "GitHub/数据集资源导航", "medium", "具身智能数据集资源导航，补充多机器人数据、操作数据和导航数据集持续扩源入口。");
source("SRC800", "OpenArm 官方页", "https://openarm.dev/", "开源硬件/机械臂", "high", "OpenArm 是面向 physical AI 的开源人形机械臂平台，公开 CAD、固件、控制代码和仿真工具，可作为低成本科研硬件对照。");
source("SRC801", "SO-ARM100 / SO-101 GitHub", "https://github.com/TheRobotStudio/SO-ARM100", "GitHub/开源机械臂", "high", "SO-100/SO-101 标准开源机械臂仓库，支持 LeRobot，适合教学、低成本遥操作和算法复现实验。");
source("SRC802", "LeRobot OpenArm 文档", "https://huggingface.co/docs/lerobot/main/openarm", "官方文档/开源机械臂", "medium", "Hugging Face LeRobot OpenArm 集成文档，用于判断 OpenArm 与端到端机器人学习框架的适配路径。");
source("SRC803", "LeRobot SO-101 文档", "https://huggingface.co/docs/lerobot/so101", "官方文档/开源机械臂", "medium", "LeRobot SO-101 文档入口，补充低成本开源机械臂的组装、标定、遥操作和数据采集流程。");
source("SRC804", "LeRobot Koch v1.1 文档", "https://huggingface.co/docs/lerobot/koch", "官方文档/低成本机械臂", "medium", "Koch v1.1 低成本 6 自由度机械臂文档，适合教学和模仿学习低成本平台对照。");
source("SRC805", "LeRobot LeKiwi 文档", "https://huggingface.co/docs/lerobot/lekiwi", "官方文档/低成本移动操作", "medium", "LeKiwi 是基于 SO-ARM 的低成本移动操作平台，文档覆盖组装、标定和运行流程。");
source("SRC806", "LeKiwi GitHub", "https://github.com/SIGRobotics-UIUC/LeKiwi", "GitHub/低成本移动操作", "medium", "LeKiwi 开源移动操作平台仓库，用于教学、自研复合机器人和低成本数据采集方案参考。");
source("SRC807", "Reachy 2 官方页", "https://www.pollen-robotics.com/reachy/", "开源人形机器人官网", "high", "Pollen Robotics Reachy 2 官方页，说明其开源、Python 控制、ROS2 Humble 和遥操作能力。");
source("SRC808", "LeRobot Reachy 2 文档", "https://huggingface.co/docs/lerobot/reachy2", "官方文档/开源人形机器人", "medium", "LeRobot Reachy 2 集成文档，覆盖遥操作、仿真和数据采集，是开源人形机器人教学科研参考。");
source("SRC809", "Reachy 2 双臂数据表", "https://www.pollen-robotics.com/wp-content/uploads/2025/02/Reachy2-Dual-arms-Datasheet.pdf", "官方规格书/开源人形机器人", "high", "Reachy 2 双臂官方数据表，补充开源人形机器人硬件规格、ROS2 软件和教育科研定位。");
source("SRC810", "LeRobot HopeJR 文档", "https://huggingface.co/docs/lerobot/hope_jr", "官方文档/开源人形机器人", "medium", "LeRobot HopeJR 文档入口，补充 Hugging Face / Robot Studio 开源人形硬件在教学和低成本研究中的线索。");
source("SRC811", "HOPEJr GitHub", "https://github.com/TheRobotStudio/HOPEJr", "GitHub/开源人形机器人", "medium", "HOPEJr 开源人形机器人仓库，适合作为低成本人形硬件和 LeRobot 生态跟踪入口。");
source("SRC812", "OpenLoong GitHub 组织", "https://github.com/loongOpen", "GitHub/开源人形机器人", "medium", "OpenLoong 开源组织入口，补充国内开源人形机器人控制和仿真资源。");
source("SRC813", "OpenLoong-Dyn-Control", "https://github.com/loongOpen/OpenLoong-Dyn-Control", "GitHub/人形机器人控制", "medium", "OpenLoong 动力学控制仓库，可作为国内人形控制算法和仿真复现入口。");
source("SRC814", "Robotics Toolbox for Python", "https://github.com/petercorke/robotics-toolbox-python", "GitHub/机器人教学工具", "medium", "Peter Corke Robotics Toolbox Python 仓库，适合机器人学课程、运动学、动力学和轨迹规划教学。");
source("SRC815", "PyBullet 官方站", "https://pybullet.org/wordpress/", "仿真/物理引擎", "medium", "PyBullet 物理仿真入口，用于低成本机器人仿真、强化学习和教学实验。");
source("SRC816", "RobotPerf 论文入口", "https://arxiv.org/abs/2309.09212", "论文/机器人算力Benchmark", "medium", "RobotPerf 提供基于 ROS2 的机器人计算系统性能 Benchmark，用于评估边缘计算、感知和控制部署能力。");
source("SRC817", "ROSClaw 论文入口", "https://arxiv.org/abs/2603.26997", "论文/ROS2 Agent 控制", "medium", "ROSClaw 论文提出将基础模型与 ROS2 机器人能力发现、动作校验和审计日志结合，适合 AI Agent 控制安全评估。");
source("SRC818", "Open Robotics 技术战略 2026", "https://osralliance.org/open-robotics-technology-strategy-for-2026/", "开源机器人生态/战略", "medium", "Open Robotics 2026 技术战略入口，说明 ROS、AI 机器人系统和开源平台的长期方向。");
source("SRC819", "工信部人形机器人创新发展指导意见", "https://www.miit.gov.cn/jgsj/kjs/wjfb/art/2023/art_50316f76a9b1454b898c7bb2a5846b79.html", "官方政策/人形机器人", "high", "工业和信息化部《人形机器人创新发展指导意见》官方入口，提出人形机器人关键技术、产品供给和场景应用发展目标。");
source("SRC820", "工信部人形机器人政策解读", "https://www.miit.gov.cn/zwgk/zcjd/art/2023/art_e3f5686c2f0d49f9968b7ae011d558e1.html", "官方政策解读/人形机器人", "high", "工信部对《人形机器人创新发展指导意见》的政策解读，用于理解产业链、标准、安全和应用导向。");
source("SRC821", "机器人+应用行动实施方案 PDF", "https://www.gov.cn/zhengce/zhengceku/2023-01/19/5738112/files/61a45b6de7f34f4197c4d6fe1b9106fb.pdf", "官方政策/机器人应用", "high", "《机器人+应用行动实施方案》官方 PDF，覆盖制造、农业、建筑、能源、医疗、养老、教育等机器人应用方向。");
source("SRC822", "人形机器人应急救援应用技术要求", "https://www.miit.gov.cn/jgsj/zbys/wjfb/art/2024/art_58dd1108fa614d97b83984232d36d56b.html", "官方政策/人形机器人应用", "high", "工信部装备工业一司关于人形机器人应急救援应用技术要求的官方入口，可作为落地场景能力约束参考。");
source("SRC823", "全国公共资源交易平台", "https://www.ggzy.gov.cn/", "公共资源交易平台", "high", "全国公共资源交易平台入口，用于持续追踪机器人、机械臂、人形机器人和四足机器人采购/招标公告。");
source("SRC824", "中国招标投标公共服务平台公告页", "https://bulletin.cebpubservice.com/", "招投标公告平台", "medium", "中国招标投标公共服务平台公告入口，可补充政府采购网以外的机器人招标公告来源。");
source("SRC825", "机电产品招标投标电子交易平台", "https://www.chinabidding.com/", "机电招投标平台", "medium", "机电产品招标投标电子交易平台入口，适合追踪工业机器人、机械臂和实验设备进口/招标线索。");
source("SRC826", "中央政府采购网", "https://www.zycg.gov.cn/", "政府采购平台", "high", "中央政府采购网入口，用于持续追踪中央单位机器人、机械臂和实验平台采购项目。");
source("SRC827", "政采云平台", "https://www.zcygov.cn/", "政府采购平台", "medium", "政采云平台入口，适合追踪地方高校、科研院所和政府单位机器人相关采购线索。");
source("SRC828", "教育装备采购网", "https://www.caigou.com.cn/", "教育采购平台", "medium", "教育装备采购网入口，用于跟踪学校机器人教学、科研平台和实验室设备采购信息。");
source("SRC829", "政府采购信息网", "https://www.caigou2003.com/", "政府采购资讯平台", "medium", "政府采购信息网入口，补充政策、采购动态和机器人设备采购资讯。");
source("SRC830", "中国政府采购网检索：机器人", "http://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E6%9C%BA%E5%99%A8%E4%BA%BA", "招投标检索", "medium", "中国政府采购网机器人关键词检索入口，用于持续发现机械臂、人形、四足和复合平台采购公告。");
source("SRC831", "CNIPA 中国专利检索系统", "https://pss-system.cponline.cnipa.gov.cn/", "专利检索入口", "low", "国家知识产权局中国专利检索系统入口；站点存在访问控制，适合作为人工核验机器人专利和厂商知识产权线索。");
source("SRC832", "Lens 专利检索：机器人", "https://www.lens.org/lens/search/patent/list?q=humanoid%20robot%20quadruped%20robot%20arm", "专利检索入口", "medium", "Lens 专利检索入口，关键词覆盖 humanoid robot、quadruped robot 和 robot arm，用于持续跟踪机器人专利布局。");
source("SRC833", "WIPO PATENTSCOPE 检索入口", "https://patentscope2.wipo.int/search/en/search.jsf", "专利检索入口", "medium", "WIPO PATENTSCOPE 国际专利检索入口，可用于核验机器人国际专利、PCT 申请和厂商专利布局。");
source("SRC834", "国家标准全文公开系统", "https://openstd.samr.gov.cn/bzgk/std", "国家标准检索", "high", "国家标准全文公开系统入口，用于检索机器人、机械安全、电气安全和实验室设备验收相关国标。");
source("SRC835", "ISO TC 299 Robotics", "https://www.iso.org/committee/5915511.html", "国际标准组织/机器人", "high", "ISO TC 299 Robotics 官方委员会入口，覆盖工业机器人、服务机器人、安全和术语等国际标准体系。");
source("SRC836", "ISO 8373:2021 机器人术语", "https://www.iso.org/standard/75539.html", "国际标准/机器人术语", "high", "ISO 8373 机器人与机器人装置术语标准入口，用于统一采购、验收和报告中的机器人分类表述。");
source("SRC837", "ISO 9283 工业机器人性能准则", "https://www.iso.org/standard/22244.html", "国际标准/性能测试", "high", "ISO 9283 工业机器人性能准则和测试方法入口，适合机械臂重复定位、路径精度和性能验收参考。");
source("SRC838", "ISO 10218-2:2025 机器人系统集成安全", "https://www.iso.org/standard/73934.html", "国际标准/机器人安全", "high", "ISO 10218-2:2025 机器人系统、应用和集成安全要求入口，适合复合平台和协作机械臂部署审查。");
source("SRC839", "ISO 3691-4 自动工业车辆安全", "https://www.iso.org/standard/83545.html", "国际标准/移动机器人安全", "high", "ISO 3691-4 无人驾驶工业车辆和系统安全入口，可作为轮式底盘、AMR 和移动复合机器人安全参考。");
source("SRC840", "中国质量认证中心 CQC", "https://www.cqc.com.cn/", "认证机构/产品认证", "medium", "中国质量认证中心入口，用于机器人整机、电气安全、充电器、电池和相关产品认证线索核验。");
source("SRC841", "TÜV SÜD Robotics 服务", "https://www.tuvsud.com/en/industries/manufacturing/machinery-and-robotics/robotics", "认证机构/机器人安全", "medium", "TÜV SÜD 机器人安全和合规服务入口，可作为 CE、机械安全、功能安全和协作机器人风险评估参考。");
source("SRC842", "国际机器人联合会 World Robotics", "https://ifr.org/worldrobotics", "产业报告/全球机器人", "high", "IFR World Robotics 官方入口，用于全球工业机器人和服务机器人市场、装机量与地区趋势背景。");
source("SRC843", "世界机器人大会", "https://www.worldrobotconference.com/", "产业会议/机器人", "high", "世界机器人大会官方入口，适合跟踪国内外机器人产品、论坛、赛事和产业趋势。");
source("SRC844", "北京人形机器人创新中心", "https://www.x-humanoid.com/", "中文创新中心/人形机器人", "high", "北京人形机器人创新中心官网入口，关联天工等人形机器人平台和国内人形机器人创新生态。");
source("SRC845", "HS 编码查询入口", "https://www.hsbianma.com/", "海关编码/进口线索", "low", "HS 编码查询入口，可辅助人工核验工业机器人、机械臂、传感器、控制器等进口编码和关税线索；正式采购需以海关/代理确认为准。");
source("SRC846", "清华大学具身智能机器人研究中心", "https://eir.tsinghua.edu.cn/", "中文高校/研究机构", "high", "清华大学具身智能机器人研究中心入口，用于追踪具身智能、机器人操作和科研平台建设方向。");
source("SRC847", "北京大学通用人工智能与机器人研究中心", "https://www.ai.pku.edu.cn/kxyj1/tyrgznyjs/jsznyjqryjzx.htm", "中文高校/研究机构", "high", "北京大学人工智能研究院通用人工智能与机器人研究中心入口，适合作为高校机器人科研方向和合作生态来源。");
source("SRC848", "清华叉院具身智能研究方向", "https://iiis.tsinghua.edu.cn/info/1215/4697.htm", "中文高校/研究方向", "medium", "清华大学交叉信息研究院具身智能相关研究方向入口，用于补充多模态决策、机器人学习和基础模型线索。");
source("SRC849", "上海交通大学 HIROL 类人智能实验室", "https://hirol.sjtu.edu.cn/", "中文高校实验室", "high", "上海交通大学 HIROL 类人智能实验室入口，覆盖人形、运动控制和具身智能相关研究。");
source("SRC850", "上海交通大学 RL2 实验室", "https://gaoyue.sjtu.edu.cn/", "中文高校实验室", "high", "上海交通大学 RL2 实验室入口，适合跟踪机器人学习、强化学习和操作控制研究项目。");
source("SRC851", "上海交通大学智能机器人与机器视觉实验室", "https://irmv.sjtu.edu.cn/cn", "中文高校实验室", "medium", "上海交通大学 IRMV 实验室入口，补充机器人感知、视觉和系统集成研究来源。");
source("SRC852", "上海科技大学 RIM Laboratory", "https://rim-laboratory.github.io/", "高校实验室/机器人智能", "medium", "上海科技大学 RIM Laboratory 入口，用于追踪机器人学习、移动操作和智能交互研究。");
source("SRC853", "中国工程科学：移动操作机器人关键技术综述", "https://www.engineering.org.cn/sscae/CN/1160096277969035886", "中文综述/移动操作", "high", "《中国工程科学》移动操作机器人关键技术综述入口，适合作为复合型机器人、移动底盘加机械臂方案的中文综述来源。");
source("SRC854", "DemoGen 项目页", "https://demo-generation.github.io/", "论文/机器人操作项目", "high", "DemoGen 项目页，面向机器人操作示教数据生成和泛化评估，可用于机械臂和移动操作科研适配判断。");
source("SRC855", "Real-World Offline Reinforcement Learning 项目页", "https://rwor.github.io/", "论文/真实机器人学习", "high", "真实机器人离线强化学习项目页，补充从数据到策略学习的机械臂研究证据。");
source("SRC856", "Open-TeleVision / Open-Teach 项目页", "https://open-teach.github.io/", "论文/遥操作/数据采集", "high", "Open-Teach 项目页，面向机器人遥操作和示教数据采集，适合评估教学科研平台的人机采集链路。");
source("SRC857", "Dex-UMI 项目页", "https://dex-umi.github.io/", "论文/灵巧操作/遥操作", "high", "Dex-UMI 项目页，补充灵巧手、末端执行器和人类示教采集的研究入口。");
source("SRC858", "DexMimicGen 项目页", "https://dexmimicgen.github.io/", "论文/灵巧操作/数据生成", "high", "DexMimicGen 项目页，面向灵巧操作数据生成和模仿学习，适合灵巧手与夹爪方案对照。");
source("SRC859", "DexMachina 项目页", "https://project-dexmachina.github.io/", "论文/灵巧操作项目", "high", "DexMachina 项目页，补充灵巧操作和真实机器人任务泛化研究入口。");
source("SRC860", "MobiPi 移动操作项目页", "https://mobipi.github.io/", "论文/移动操作项目", "high", "MobiPi 项目页，聚焦移动操作机器人策略学习和现实环境任务，可关联轮式底盘加机械臂方案。");
source("SRC861", "RMMI 移动操作项目页", "https://rmmi.github.io/", "论文/移动操作项目", "high", "RMMI 项目页，补充真实移动操作机器人研究入口，用于复合型平台科研适配评估。");
source("SRC862", "FARM 触觉机器人操作项目页", "https://tactile-farm.github.io/", "论文/触觉操作项目", "high", "FARM 项目页，面向触觉感知、机械臂操作和真实任务采集，适合末端传感器扩展评估。");
source("SRC863", "DexFlywheel 项目页", "https://dexflywheel.github.io/", "论文/灵巧操作项目", "high", "DexFlywheel 项目页，补充灵巧操作策略学习和真实机器人实验入口。");
source("SRC864", "CMU iControl Unitree G1 平台页", "https://icontrol.ri.cmu.edu/robot/g1.html", "高校研究项目/Unitree G1", "high", "CMU iControl Unitree G1 研究平台页，可作为 G1 在高校人形机器人研究中的使用证据。");
source("SRC865", "ASAP Agile Humanoid 项目页", "https://agile.human2humanoid.com/", "论文/人形机器人项目", "high", "ASAP Agile Humanoid 项目页，面向人形机器人敏捷运动控制，适合 Unitree G1/H1 运动研究评估。");
source("SRC866", "ASAP GitHub", "https://github.com/LeCAR-Lab/ASAP", "GitHub/人形机器人项目", "medium", "ASAP 开源仓库入口，用于核验人形机器人运动控制项目的可复现程度。");
source("SRC867", "HumanPlus 项目页", "https://humanoid-ai.github.io/", "论文/人形机器人项目", "high", "HumanPlus 项目页，面向人形机器人全身技能学习和真实平台验证，可作为 Unitree H1/G1 科研证据。");
source("SRC868", "HumanPlus GitHub", "https://github.com/MarkFzp/humanplus", "GitHub/人形机器人项目", "medium", "HumanPlus 开源仓库入口，补充人形机器人模仿学习和全身控制复现线索。");
source("SRC869", "HOVER 人形机器人控制项目页", "https://hover-versatile-humanoid.github.io/", "论文/人形机器人项目", "high", "HOVER 项目页，面向通用人形全身控制，适合评估人形平台运动控制科研通用性。");
source("SRC870", "Human2Humanoid 项目页", "https://human2humanoid.com/", "论文/人形机器人项目", "high", "Human2Humanoid 项目页，补充人体动作到人形机器人策略迁移的研究入口。");
source("SRC871", "ALMI Humanoid 项目页", "https://almi-humanoid.github.io/", "论文/人形机器人项目", "high", "ALMI 项目页，补充语言/动作条件下的人形机器人控制研究入口。");
source("SRC872", "KungfuBot 2 项目页", "https://kungfubot2-humanoid.github.io/", "论文/人形机器人项目", "high", "KungfuBot 2 项目页，面向高动态人形机器人技能学习，可作为 G1/H1 高动态任务研究线索。");
source("SRC873", "LATENT 人形机器人项目页", "https://zzk273.github.io/LATENT/", "论文/人形机器人项目", "high", "LATENT 项目页，补充人形机器人运动策略学习和真实平台验证入口。");
source("SRC874", "Frontiers：Unitree Go2 室内外导航研究", "https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2025.1601862/full", "论文/Unitree Go2", "high", "Frontiers in Robotics and AI 论文入口，使用 Unitree Go2 进行室内外导航和移动机器人研究。");
source("SRC875", "ANU：具身智能腿式机器人项目", "https://comp.anu.edu.au/study/projects/embodied-ai-on-a-legged-robot-platform/", "高校研究项目/四足机器人", "medium", "澳大利亚国立大学具身智能腿式机器人项目入口，可作为四足平台科研项目和学生课题来源。");
source("SRC876", "Walk These Ways 项目页", "https://gmargo11.github.io/walk-these-ways/", "论文/四足机器人控制", "high", "Walk These Ways 项目页，面向四足机器人多步态运动控制，是 Unitree A1/Go1 类平台常见研究参考。");
source("SRC877", "RMA Legged Robots 项目页", "https://ashish-kmr.github.io/rma-legged-robots/", "论文/四足机器人控制", "high", "RMA 项目页，面向腿式机器人快速运动适应，适合作为四足平台 sim-to-real 科研证据。");
source("SRC878", "Extreme Parkour 项目页", "https://extreme-parkour.github.io/", "论文/四足机器人高动态运动", "high", "Extreme Parkour 项目页，补充四足机器人复杂地形、高动态运动和强化学习研究入口。");
source("SRC879", "Jumping CoD 项目页", "https://yxyang.github.io/jumping_cod/", "论文/四足机器人跳跃控制", "high", "Jumping CoD 项目页，补充四足机器人跳跃和动态运动控制研究入口。");
source("SRC880", "Universal Robots Support", "https://www.universal-robots.com/support/", "厂商支持/售后维护", "high", "UR 官方支持入口，覆盖文档、下载、技术支持和售后维护线索。");
source("SRC881", "Universal Robots Academy", "https://academy.universal-robots.com/", "厂商培训/课程", "high", "UR 官方学院入口，适合核验协作机器人培训、课程和操作人员能力建设。");
source("SRC882", "Universal Robots On Demand Service", "https://www.universal-robots.com/services/on-demand-service/", "厂商服务/维保", "high", "UR 官方按需服务入口，用于评估协作机械臂维保、故障支持和停机风险。");
source("SRC883", "Franka Research 3 Product Manual", "https://franka.de/hubfs/Product%20Manual%20Franka%20Research%203_R02210_1.2_EN.pdf?hsLang=en", "官方手册/维护安全", "high", "Franka Research 3 官方产品手册，适合核验安装、维护、安全和实验室部署要求。");
source("SRC884", "Unitree Service Console", "https://serviceconsole.unitree.com/", "厂商售后服务入口", "high", "宇树官方服务控制台入口，可作为售后、维修和服务工单核验路径。");
source("SRC885", "Unitree 产品服务政策", "https://www.unitree.com/cn/mobile/terms/policy/", "厂商服务政策/保修", "high", "宇树中文产品服务政策入口，用于核验保修、退换、维修和售后边界。");
source("SRC886", "Unitree 维修服务条款", "https://www.unitree.com/cn/mobile/terms/repair/", "厂商维修政策", "high", "宇树中文维修服务条款入口，适合采购前核验维修流程、费用边界和保外风险。");
source("SRC887", "Unitree 联系与售后咨询", "https://www.unitree.com/cn/contact/", "厂商联系/售后", "high", "宇树中文联系入口，用于采购询价、售后咨询和服务响应核验。");
source("SRC888", "Unitree Z1 服务与保修", "https://dev-z1.unitree.com/appendix/service.html", "官方文档/保修", "high", "Unitree Z1 开发文档中的服务与保修页面，适合核验 Z1 机械臂售后条款。");
source("SRC889", "DOBOT Service", "https://www.dobot-robots.com/service?lang=en", "厂商服务/售后", "high", "越疆国际站服务入口，覆盖下载、支持、培训和售后服务线索。");
source("SRC890", "越疆工业机器人售后政策", "https://www.dobotcn.com/service/customer-service/industrial-policy/", "厂商售后政策/保修", "high", "越疆中文售后政策入口，用于核验协作机械臂维修、保修和服务范围。");
source("SRC891", "越疆下载中心", "https://www.dobotcn.com/service/download-center/", "官方下载/维护文档", "high", "越疆中文下载中心入口，适合获取手册、软件、固件和维护资料。");
source("SRC892", "节卡机器人技术文档 PDF", "https://www.jaka.com/profile/upload/2025/12/05/20251205141320A001.pdf", "官方文档/维护资料", "medium", "节卡机器人官网技术文档 PDF，适合补充安装、操作和维护核验；具体适用型号需打开文档确认。");
source("SRC893", "艾利特机器人快速开始文档", "https://docs.elibot.cn/cs/97375", "官方文档/培训", "medium", "艾利特机器人文档站快速开始入口，用于核验上手、操作培训和调试资料。");
source("SRC894", "睿尔曼开发者中心", "https://www.realman-robotics.cn/cn/main/developer-center.html", "官方开发文档/维护", "high", "睿尔曼开发者中心入口，覆盖 SDK、文档和二次开发资料，可辅助售后维护与系统集成评估。");
source("SRC895", "AgileX 联系入口", "https://global.agilex.ai/pages/contact-us", "厂商联系/售后", "medium", "松灵机器人国际站联系入口，用于核验移动底盘和复合机器人询价、售后和代理沟通路径。");
source("SRC896", "AgileX OEM Solution", "https://global.agilex.ai/products/oem-solution", "厂商方案/OEM集成", "medium", "松灵机器人 OEM 方案入口，适合评估底盘定制、复合机器人集成和项目交付能力。");
source("SRC897", "AgileX Scout Mini 文档", "https://docs.trossenrobotics.com/agilex_scout_mini_docs/index.html", "第三方文档/移动底盘维护", "medium", "Trossen Robotics AgileX Scout Mini 文档入口，补充移动底盘安装、操作和维护资料。");
source("SRC898", "Elephant Robotics Support", "https://www.elephantrobotics.com/support/", "厂商支持/售后", "high", "大象机器人官方支持入口，用于 myCobot 系列售后、文档和技术支持核验。");
source("SRC899", "myCobot 用户须知", "https://docs.elephantrobotics.com/docs/mycobot_280_pi_en/2-BasicSettings/3.UserNotice/3-UserInstructions.html", "官方文档/安全维护", "high", "myCobot 官方用户须知入口，适合核验低成本机械臂实验室安全、使用限制和维护注意事项。");
source("SRC900", "Hello Robot Stretch 电池维护指南", "https://docs.hello-robot.com/latest/hardware/battery_maintenance_guide_se3/", "官方文档/电池安全", "high", "Hello Robot Stretch 官方电池维护指南，适合核验移动操作平台锂电池维护、充电和安全要求。");
source("SRC901", "Hello Robot Stretch 3 硬件指南", "https://docs.hello-robot.com/0.3/hardware/hardware_guide_stretch_3/", "官方文档/硬件维护", "high", "Stretch 3 官方硬件指南，补充硬件结构、维护和现场部署资料。");
source("SRC902", "Hello Robot Stretch 入门指南", "https://docs.hello-robot.com/0.3/getting_started/hello_robot/", "官方文档/安全入门", "high", "Stretch 官方入门指南，适合作为移动操作平台开箱、初始化和安全培训资料。");
source("SRC903", "PAL Robotics TIAGo 文档", "https://docs.pal-robotics.com/edge/tiago.html", "官方文档/移动操作维护", "high", "PAL Robotics TIAGo 文档入口，补充经典移动操作平台部署、配置和维护来源。");
source("SRC904", "Illinois Robotics 机械臂安全规则", "https://robotics.illinois.edu/lab/robot-manipulator-safety-rules/", "高校实验室安全", "medium", "伊利诺伊大学机器人实验室机械臂安全规则入口，可作为学校实验室机械臂安全制度参考。");
source("SRC905", "MIT 锂离子电池安全指南", "https://ehs.mit.edu/lab-research-program/lithium-ion-battery-safety/", "高校实验室/电池安全", "high", "MIT EHS 锂离子电池安全指南，适合移动机器人、人形和四足平台电池安全管理参考。");
source("SRC906", "University of Vermont 电池安全", "https://www.uvm.edu/safety/battery-safety", "高校实验室/电池安全", "medium", "佛蒙特大学电池安全入口，补充锂电池存放、充电和事故风险控制参考。");
source("SRC907", "Iowa State University 电池安全", "https://www.ehs.iastate.edu/battery-safety", "高校实验室/电池安全", "medium", "爱荷华州立大学 EHS 电池安全入口，用于移动机器人和实验室设备电池管理参考。");
source("SRC908", "UDC Robotic Lab Safety Policies", "https://docs.udc.edu/seas/safety/Robotic-Lab_Safety-Policies_32_A05.pdf", "高校实验室安全/PDF", "medium", "UDC 机器人实验室安全政策 PDF，适合作为学校机器人实验室安全制度和操作准入参考。");
source("SRC909", "IATA Lithium Batteries", "https://www.iata.org/en/programs/cargo/dgr/lithium-batteries/", "运输合规/锂电池", "high", "IATA 锂电池运输规则入口，用于核验移动机器人、人形和四足平台跨境运输或空运限制。");
source("SRC910", "FAA PackSafe Lithium Batteries", "https://www.faa.gov/hazmat/packsafe/lithium-batteries", "运输合规/锂电池", "high", "FAA PackSafe 锂电池入口，适合核验随设备运输、电池容量和航空运输限制。");
source("SRC911", "ABB University 中国培训手册", "https://new.abb.com/docs/librariesprovider134/abb-university-lib/abb-university-cn/2021y-training-manual-v1-3.pdf?sfvrsn=d6574509_2", "厂商培训/工业机器人", "medium", "ABB University 中国培训手册 PDF，可作为工业机器人培训体系和课程设置对照。");
source("SRC912", "埃夫特机器人安全手册 PDF", "https://www.efort.com.cn/web/upload/2023/06/25/16876765529357wbmrx.pdf", "官方安全手册/工业机器人", "medium", "埃夫特官网机器人安全手册 PDF，补充国产工业机器人安全培训和操作规范参考。");
source("SRC913", "UFACTORY xArm Accessories", "https://www.ufactory.us/accessories", "官方配件/备件", "high", "UFACTORY 官方配件页，覆盖 xArm 夹爪、吸盘、末端执行器和附件，可用于核验备件与扩展采购。");
source("SRC914", "xArm Vacuum Gripper 文档", "https://docs.accessories.ufactory.cc/xArm_Vacuum_Gripper/1.Introduction.html", "官方配件文档/末端执行器", "high", "xArm 真空吸盘官方文档入口，适合核验末端执行器兼容、安装和维护资料。");
source("SRC915", "xArm Gripper User Manual", "https://www.ufactory.cc/wp-content/uploads/2023/04/xArm-Gripper-User-Manual-V1.11.0.pdf", "官方配件手册/夹爪", "high", "xArm 夹爪官方用户手册 PDF，补充夹爪安装、接线、维护和安全注意事项。");
source("SRC916", "DOBOT Accessories", "https://www.dobot-robots.com/products/accessories", "官方配件/备件", "high", "DOBOT 官方附件页，覆盖协作机器人末端执行器、视觉、传感器和配套附件采购线索。");
source("SRC917", "DOBOT OnRobot Accessories", "https://www.dobot-robots.com/ecosystem/accessories/592.html", "官方生态配件/夹爪", "high", "DOBOT 生态附件页，展示 OnRobot 夹爪等末端执行器适配线索。");
source("SRC918", "Elephant Robotics Accessories", "https://shop.elephantrobotics.com/collections/accessories", "官方商城/配件备件", "high", "大象机器人官方商城配件集合页，适合核验 myCobot 教学平台夹爪、吸盘、摄像头等附件采购。");
source("SRC919", "Unitree 官方商城", "https://shop.unitree.com/", "官方商城/配件线索", "medium", "宇树官方商城入口，可作为机器人整机、附件和售后配件采购线索；具体配件需按页面实时核验。");
source("SRC920", "RoboDK ISO 9283 机器人验证", "https://www.robodk.com/doc/en/Robot-Validation-ISO9283.html", "校准/精度测试/ISO9283", "medium", "RoboDK ISO 9283 机器人验证说明，适合作为机械臂精度、重复定位和验收测试方法参考。");
source("SRC921", "NIST 工业机器人精度退化分析", "https://www.nist.gov/publications/accuracy-degradation-analysis-industrial-robot-systems", "论文/校准/精度分析", "high", "NIST 工业机器人系统精度退化分析论文入口，用于评估长期使用后的精度、维护和校准需求。");
source("SRC922", "NIST 机器人现场精度提升与量化", "https://www.nist.gov/publications/efficiently-improving-and-quantifying-robot-accuracy-situ", "论文/校准/现场精度", "high", "NIST 关于现场提升和量化机器人精度的论文入口，补充学校实验室验收与复测方法来源。");
source("SRC923", "工业机器人性能试验应用规范征求意见稿", "https://std.samr.gov.cn/dcpspTools/gbPlan/download?path=%2Fzxd%2F2021002587%2F20_%E6%A0%87%E5%87%86%E8%B5%B7%E8%8D%89%2F20_DI_2021002587_%E5%B7%A5%E4%B8%9A%E6%9C%BA%E5%99%A8%E4%BA%BA+%E6%80%A7%E8%83%BD%E8%AF%95%E9%AA%8C%E5%BA%94%E7%94%A8%E8%A7%84%E8%8C%83.pdf", "国家标准草案/性能测试", "medium", "工业机器人性能试验应用规范征求意见稿下载入口，可作为国内机器人性能验收与测试条款参考。");
source("SRC924", "ROS-Industrial industrial_calibration", "https://github.com/ros-industrial/industrial_calibration", "GitHub/机器人标定", "medium", "ROS-Industrial 机器人标定仓库，适合评估机械臂、相机和传感器标定的软件生态。");
source("SRC925", "MoveIt Calibration", "https://github.com/moveit/moveit_calibration", "GitHub/手眼标定", "medium", "MoveIt Calibration 仓库，补充 ROS/MoveIt 机械臂手眼标定工具链来源。");
source("SRC926", "easy_handeye", "https://github.com/IFL-CAMP/easy_handeye", "GitHub/手眼标定", "medium", "easy_handeye 开源手眼标定工具，适合相机、机械臂和移动操作平台标定流程参考。");
source("SRC927", "University of Washington Equipment Insurance", "https://risk.uw.edu/insurance/equipment-insurance", "高校设备保险", "medium", "华盛顿大学设备保险入口，用于学校高价值机器人设备财产保险和风险管理制度参考。");
source("SRC928", "University of Utah Equipment Insurance", "https://riskmanagement.utah.edu/insurance/equipment-insurance.php", "高校设备保险", "medium", "犹他大学设备保险入口，补充科研设备保险、损坏和遗失风险管理参考。");
source("SRC929", "UT Dallas Equipment Insurance", "https://risk-safety.utdallas.edu/risk-and-insurance-programs/equipment-insurance/", "高校设备保险", "medium", "德州大学达拉斯分校设备保险入口，可作为学校机器人设备保险制度对照。");
source("SRC930", "MIT Property Claims", "https://insurance.mit.edu/services/insurance-coverage-claims/property/property-claims/", "高校财产保险/理赔", "medium", "MIT 财产保险理赔入口，用于高价值科研设备损坏、失窃和事故理赔流程参考。");
source("SRC931", "Kansas State University Equipment Insurance", "https://www.k-state.edu/risk/insurance/equipment.html", "高校设备保险", "medium", "堪萨斯州立大学设备保险入口，补充科研设备保险投保和风险管理做法。");
source("SRC932", "Stony Brook Research Equipment Insurance", "https://www.stonybrook.edu/centralservices/property-control/research-equipment-insurance/index.html", "高校科研设备保险", "medium", "石溪大学科研设备保险入口，可作为高价值机器人和实验平台保险覆盖参考。");
source("SRC933", "Georgia Tech Property Insurance", "https://procurement.gatech.edu/insurance/prop-insurance", "高校财产保险", "medium", "佐治亚理工采购部门财产保险入口，补充学校采购设备保险和财产风险管理来源。");
source("SRC934", "UTEP Equipment Insurance", "https://www.utep.edu/vpba/business-process-guidelines/insurance/eqt-insurance.html", "高校设备保险", "medium", "德州大学埃尔帕索分校设备保险入口，适合参考实验室设备投保、搬运和损坏风险。");
source("SRC935", "中国证券报：机器人保险服务创新", "https://www.cs.com.cn/yh/bx/2026/04/21/detail_2026042110005375.html", "中文保险/机器人责任线索", "low", "中文机器人保险新闻线索，提示人形机器人、服务机器人和场景责任风险已有保险服务探索；正式采购需向保险公司核验。");
source("SRC936", "绿的谐波官网", "https://www.leaderdrive.com/", "核心零部件/减速器", "high", "绿的谐波官网入口，适合核验协作机器人、人形机器人和机械臂关节减速器供应链来源。");
source("SRC937", "新松机器人核心零部件", "https://www.siasun.com/index.php?m=content&c=index&a=lists&catid=39", "核心零部件/机器人部件", "medium", "新松机器人核心零部件栏目入口，用于补充国产机器人零部件、控制器和系统集成供应链线索。");
source("SRC938", "埃斯顿机器人业务", "https://www.estun.com/robot/", "机器人整机/核心部件", "medium", "埃斯顿机器人业务入口，适合核验国产工业机器人、控制和伺服系统供应链背景。");
source("SRC939", "汇川技术伺服系统", "https://www.inovance.com/products/servo-system", "核心零部件/伺服系统", "high", "汇川技术伺服系统官方入口，可作为机器人伺服驱动、电机和控制部件国产供应链参考。");
source("SRC940", "灵足时代 RobStride", "https://www.robstride.com/", "核心零部件/关节模组", "high", "灵足时代官网入口，面向机器人关节模组和无框力矩电机等核心部件供应链核验。");
source("SRC941", "RobStride Joint Motor", "https://www.robstride.com/products/joint-motor", "核心零部件/关节电机", "high", "RobStride 关节电机产品页，适合人形、四足和复合机器人关节模组供应链评估。");
source("SRC942", "Galaxea R1 Lite", "https://galaxea-ai.com/r1-lite/", "复合平台/关节与部件线索", "medium", "Galaxea R1 Lite 入口，补充移动操作平台、轻量机械臂和核心部件集成线索。");
source("SRC943", "中国计量科学研究院机器人相关页面", "https://www.nim.ac.cn/node/795", "国家计量机构/机器人计量", "high", "中国计量科学研究院机器人相关页面，补充机器人计量、校准和测量能力来源。");
source("SRC944", "中国计量科学研究院", "https://www.nim.ac.cn/", "国家计量机构", "high", "国家计量基准与计量科学机构入口，用于采购验收、精度复测和校准服务体系核验。");
source("SRC945", "CNAS 在线服务", "https://www.cnas.org.cn/fzlm/zxfw/index.html", "CNAS认可/实验室查询", "high", "中国合格评定国家认可委员会在线服务入口，用于查询认可实验室和校准检测能力。");
source("SRC946", "CNAS 官网", "https://www.cnas.org.cn/", "CNAS认可机构", "high", "CNAS 官网入口，适合采购前核验第三方检测、校准机构的认可资质。");
source("SRC947", "国家认证认可信息公共服务平台", "https://cx.cnca.cn/", "认证认可查询/CMA线索", "medium", "国家认证认可信息公共服务平台入口，站点可能有访问限制，可作为人工核验 CMA/CNAS 资质入口。");
source("SRC948", "国家市场监督管理总局", "https://www.samr.gov.cn/", "监管机构/计量认证", "high", "国家市场监督管理总局入口，用于核验计量、认证认可、检验检测机构资质和相关监管政策。");
source("SRC949", "国家标准信息公共服务平台", "https://std.samr.gov.cn/", "国家标准/计量与测试", "high", "国家标准信息公共服务平台入口，用于检索机器人性能测试、计量和安全相关国家标准。");
source("SRC950", "中国机器人产业联盟", "https://www.cria.org.cn/", "行业组织/检测认证线索", "medium", "中国机器人产业联盟入口，用于持续追踪机器人检测认证、产业链和标准化活动线索。");
source("SRC951", "人保财险产品责任保险", "https://property.picc.com.cn/cpyfw/qybx/201912/t20191206_271889.html", "保险/产品责任险", "medium", "人保财险产品责任保险入口，可作为机器人供应商产品责任、学校采购责任边界和合同风险参考。");
source("SRC952", "湖南省：人形机器人综合保险案例", "https://www.hunan.gov.cn/hnszf/hnyw/zwdt/202604/t20260422_33828668.html", "政府信息/机器人责任保险", "medium", "湖南省政府门户关于人形机器人综合保险的案例入口，补充第三者责任、产品责任和场景责任风险线索。");
source("SRC953", "Renishaw Position Encoders", "https://www.renishaw.com/en/position-encoders--6331", "核心零部件/位置编码器", "high", "Renishaw 位置编码器官方入口，适合核验机械臂、人形和四足关节位置反馈核心部件供应链。");
source("SRC954", "Renishaw Encoders for Robotics", "https://info.renishaw.com/Encoders-Robotics", "核心零部件/机器人编码器", "high", "Renishaw 面向机器人应用的编码器资料入口，补充机器人关节精度、反馈和供应链来源。");
source("SRC955", "HEIDENHAIN 工业机器人编码器精度说明", "https://www.heidenhain.us/resources-and-news/industrial-robots-encoders-tool-accuracy/", "核心零部件/编码器/精度", "high", "HEIDENHAIN 关于工业机器人编码器与工具精度的资料入口，适合评估高精度机械臂和机器人关节反馈。");
source("SRC956", "HEIDENHAIN RCN 角度编码器", "https://www.heidenhain.com/products/encoders/angle-encoders/integral-bearing/rcn-2001-rcn-5001", "核心零部件/角度编码器", "high", "HEIDENHAIN RCN 系列角度编码器产品页，补充高精度旋转/角度反馈核心部件来源。");
source("SRC957", "Nikon MAR-HX50 绝对式编码器", "https://industry.nikon.com/zh-cn/products/absolute-encoders/mar-hx50-2/", "核心零部件/绝对式编码器", "high", "尼康中文绝对式编码器产品页，适合作为机器人关节位置传感器供应链参考。");
source("SRC958", "Sensata LP35 增量式旋转编码器", "https://www.sensata.com.cn/products/position-sensors-encoders/lp35-incremental-rotary-encoder-01300-010", "核心零部件/旋转编码器", "high", "Sensata 中文 LP35 增量式旋转编码器产品页，补充机器人位置传感器和反馈部件来源。");
source("SRC959", "ifm 绝对式编码器", "https://www.ifm.cn/cn/zh/shared/technologies/encoder/absolute-encoders", "核心零部件/绝对式编码器", "high", "ifm 中文绝对式编码器技术入口，适合核验工业机器人和移动底盘位置反馈部件。");
source("SRC960", "ZeroErr eCoder20 磁编码器", "https://zeroerr.cn/eCoder/eCoder20.html", "核心零部件/磁编码器", "medium", "ZeroErr eCoder20 磁编码器产品页，补充国产磁编码器和机器人关节反馈部件线索。");
source("SRC961", "中国保险行业协会责任保险示范条款", "https://www.iachina.cn/col/col5095/index.html", "保险条款/责任保险", "medium", "中国保险行业协会责任保险示范条款入口，用于学校机器人项目责任险条款和合同附件参考。");
source("SRC962", "中国保险行业协会责任保险附加条款", "https://www.iachina.cn/col/col7073/index.html", "保险条款/责任保险附加条款", "medium", "中国保险行业协会责任保险附加条款入口，补充公众责任、第三者责任和附加风险条款核验路径。");
source("SRC963", "人保财险公众责任保险条款 PDF", "https://mproperty.picc.com.cn/clauses_for_wap/tiaokuan/100266.pdf", "保险条款/公众责任险", "medium", "人保财险公众责任保险条款 PDF，适合作为学校开放场景机器人测试、演示和参观责任风险参考。");
source("SRC964", "AIG 公众责任保险", "https://www.aig.com.cn/commercial/products/casualty/public-liability", "保险/公众责任险", "medium", "AIG 公众责任保险入口，可作为场地开放、访客接触机器人和第三方损害风险的保险参考。");
source("SRC965", "中国银行公众责任险说明", "https://www.boc.cn/ebanking/bocnet_login/cs4/201911/t20191102_16966469.html", "保险/公众责任险", "medium", "中国银行公众责任险说明入口，补充公众责任、场地责任和学校演示场景风险管理线索。");
source("SRC966", "融盛保险公众责任保险", "https://www.erongsheng.com/gkxxpl/chanpin/zerenxian/696.html", "保险/公众责任险", "medium", "融盛保险公众责任保险入口，补充责任险产品和场地责任风险参考。");
source("SRC967", "太保财险公众责任保险条款 PDF", "https://property.cpic.com.cn/upload/resources/file/2021/08/23/60290.pdf", "保险条款/公众责任险", "medium", "太保财险公众责任保险条款 PDF，适合核验学校机器人开放测试、展演和第三方损害责任条款。");
source("SRC968", "宇立仪器机器人关节力传感器", "https://www.srisensor.com.cn/36.html", "核心零部件/关节力矩传感器", "high", "宇立仪器机器人关节力传感器入口，补充协作机械臂、人形和四足关节力控/碰撞检测部件来源。");
source("SRC969", "Bota Systems Torque Sensors", "https://botasys.com/torque-sensors/", "核心零部件/扭矩传感器", "high", "Bota Systems 扭矩传感器入口，适合机器人关节控制、力控和安全碰撞检测部件供应链核验。");
source("SRC970", "FUTEK 机器人关节扭矩传感器应用", "https://www.futek.com/applications/torque-sensors-for-robot-joint-control", "核心零部件/关节扭矩传感器", "high", "FUTEK 机器人关节控制扭矩传感器应用页，补充关节力矩反馈和安全控制来源。");
source("SRC971", "AL-ROBOT TSR-J 关节扭矩传感器", "https://al-robot.com/products/joint-torque-sensors-tsr-j-series", "核心零部件/关节扭矩传感器", "medium", "AL-ROBOT TSR-J 系列关节扭矩传感器产品页，适合核验机器人关节力矩传感器方案。");
source("SRC972", "睿尔曼 WHJ 扭矩关节模组", "https://realman-robotics.com/en/products/whj-torque-joint-modules.html", "核心零部件/力控关节模组", "high", "睿尔曼 WHJ 扭矩关节模组产品页，补充轻量机械臂和复合平台关节力控部件来源。");
source("SRC973", "TechSoft MJBX 关节模组", "https://techsoft-robots.com/product/joint-module/mjbx", "核心零部件/关节模组", "medium", "TechSoft MJBX 关节模组入口，补充国产/第三方机器人关节模组供应链线索。");
source("SRC974", "Macnica STREAL 安全传感器", "https://www.macnica.com/americas/mai/en/products/macnica-products/streal/streal-for-robotics-and-amrs/", "安全传感器/机器人与AMR", "medium", "Macnica STREAL 面向机器人和 AMR 的安全传感器入口，补充移动平台碰撞检测和安全感知来源。");
source("SRC975", "关节扭矩传感器接触检测论文", "https://arxiv.org/abs/2510.10843", "论文/关节传感器/接触检测", "medium", "关节扭矩传感器接触检测相关论文入口，可作为机器人接触安全和碰撞检测研究线索。");
source("SRC976", "基于关节扭矩传感器的机器人论文", "https://arxiv.org/abs/2603.16040", "论文/关节扭矩传感器", "medium", "关节扭矩传感器相关论文入口，补充力矩反馈和机器人控制研究证据。");
source("SRC977", "OMRON TM 协作机器人安全手册", "https://files.omron.eu/downloads/latest/manual/en/i688_tm_collaborative_robot_s_series_safety_manual_en.pdf?v=3", "厂商安全手册/碰撞检测", "medium", "OMRON TM 协作机器人安全手册 PDF，补充碰撞检测、安全功能和协作机器人风险评估参考。");
source("SRC978", "中国保险行业协会雇主责任保险示范条款", "https://wap.iachina.cn/art/2017/6/21/art_94_1591.html", "保险条款/雇主责任险", "medium", "中国保险行业协会雇主责任保险示范条款入口，适合学校机器人实验室教师、工程师和操作人员责任风险参考。");
source("SRC979", "中国保险行业协会雇主责任险附加条款", "https://www.iachina.cn/col/col4892/index.html", "保险条款/雇主责任险附加条款", "medium", "中国保险行业协会雇主责任险附加条款入口，补充实验室工作人员伤害和责任风险条款来源。");
source("SRC980", "中国保险行业协会雇主责任险 A 款", "https://www.iachina.cn/col/col6743/index.html", "保险条款/雇主责任险", "medium", "中国保险行业协会雇主责任险 A 款入口，适合作为学校操作人员安全责任和保险条款参考。");
source("SRC981", "太保财险雇主责任保险条款 PDF", "https://property.cpic.com.cn/upload/resources/file/2022/02/11/63031.pdf", "保险条款/雇主责任险", "medium", "太保财险雇主责任保险条款 PDF，补充机器人实验室工作人员、维护人员和教师操作责任风险来源。");
source("SRC982", "太保财险雇主责任附加条款 PDF", "https://www.cpic.com.cn/upload/resources/file/2025/07/11/88084.pdf", "保险条款/雇主责任附加条款", "medium", "太保财险雇主责任附加条款 PDF，适合核验附加赔偿、特殊作业和实验室责任条款。");
source("SRC983", "天安财险校方责任保险条款 PDF", "https://www.tianan-insurance.com/tianwebsite/2021-12-24/1640305712149.pdf", "保险条款/校方责任险", "medium", "天安财险校方责任保险条款 PDF，补充学校机器人课程、开放实验和学生安全责任风险参考。");
source("SRC984", "Oakland USD 学生意外保险", "https://www.ousd.org/business-services/finance-departments/risk-management/student-accident-insurance", "学校风险管理/学生安全", "medium", "Oakland Unified School District 学生意外保险入口，可作为学生参与机器人课程、竞赛和实验活动的安全保险参考。");
source("SRC985", "个人信息保护法官方解读入口", "https://www.samr.gov.cn/wljys/gzzd/art/2023/art_3ef1e889c1e644d4b65b5f5c7f432386.html", "法律法规/个人信息保护", "high", "市场监管总局个人信息保护法相关入口，用于机器人摄像头、语音、日志和账号数据处理合规参考。");
source("SRC986", "网络安全法官方全文入口", "https://www.cac.gov.cn/2016-11/07/c_1119867116.htm", "法律法规/网络安全", "high", "国家网信办网络安全法入口，适合核验机器人联网、远程控制、云服务和校园网络接入合规要求。");
source("SRC987", "未成年人网络保护条例", "https://www.gov.cn/zhengce/content/202310/content_6911288.htm", "法律法规/未成年人保护", "high", "国务院未成年人网络保护条例入口，用于学校机器人课程、摄像头/语音采集和学生数据处理合规参考。");
source("SRC988", "中小学幼儿园安全管理办法", "https://www.moe.gov.cn/jyb_xxgk/xxgk/zhengce/guizhang/202112/t20211206_585036.html", "教育法规/校园安全责任", "high", "教育部中小学幼儿园安全管理办法入口，可作为学校机器人实验室、课程、展示活动安全责任参考。");
source("SRC989", "中小学幼儿园安全防范要求解读", "https://www.samr.gov.cn/bzjss/bzjd/art/2022/art_5aa52a4e60a34f4cae44a25759b2c588.html", "国家标准解读/校园安全", "high", "市场监管总局 GB/T 29315《中小学幼儿园安全防范要求》解读，补充校园安全责任、视频监控和场地防护来源。");
source("SRC990", "GB/T 35273 个人信息安全规范", "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=4568F276E0F8346EB0FBA097AA0CE05E", "国家标准/个人信息安全", "high", "国家标准全文公开系统 GB/T 35273 个人信息安全规范入口，用于机器人采集视频、音频、账号和日志数据的合规参考。");
source("SRC991", "视频图像信息安全技术要求", "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=8BA17623D536F4A4B5D3662DF6D522F7", "国家标准/视频采集安全", "high", "国家标准全文公开系统视频图像信息安全技术要求入口，适合带摄像头机器人校园部署合规评估。");
source("SRC992", "全国信安标委 TC260", "https://www.tc260.org.cn/", "标准组织/数据安全与网络安全", "high", "全国信息安全标准化技术委员会入口，用于持续追踪个人信息、数据安全、AI 安全和网络安全标准。");
source("SRC993", "NIST SP 800-82 工控系统网络安全", "https://csrc.nist.gov/pubs/sp/800/82/r3/final", "网络安全/工控系统", "high", "NIST SP 800-82 工业控制系统安全指南，适合机器人控制器、远程维护和实验室网络分区参考。");
source("SRC994", "ISA/IEC 62443 标准系列", "https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards", "网络安全/工业自动化", "high", "ISA/IEC 62443 工业自动化与控制系统安全标准系列入口，用于机器人远程运维和系统集成安全评估。");
source("SRC995", "CISA Industrial Control Systems", "https://www.cisa.gov/topics/industrial-control-systems", "网络安全/工业控制系统", "high", "CISA 工业控制系统安全入口，补充机器人控制系统、远程访问和安全事件响应参考。");
source("SRC996", "ISO/IEC 27001 信息安全管理", "https://www.iso.org/standard/27001", "信息安全管理标准", "high", "ISO/IEC 27001 信息安全管理标准入口，可作为学校采购机器人云平台、运维服务商和数据处理方审查依据。");
source("SRC997", "NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework", "AI风险管理/安全治理", "high", "NIST AI 风险管理框架入口，用于评估 AI 机器人、智能体控制、视觉语言模型和自治行为风险。");
source("SRC998", "NIST Privacy Framework", "https://www.nist.gov/privacy-framework", "隐私治理框架", "high", "NIST 隐私框架入口，适合机器人摄像头、语音、遥操作日志和学生数据治理参考。");
source("SRC999", "国家网信办个人信息保护政策法规问答", "https://www.cac.gov.cn/2026-01/09/c_1769688003183197.htm", "法律法规/个人信息审计", "high", "国家网信办个人信息保护政策法规问答入口，适合机器人摄像头、麦克风、遥操作、账号和日志数据处理合规参考。");
source("SRC1000", "人脸识别技术应用安全管理办法", "https://www.gov.cn/zhengce/zhengceku/202503/content_7016075.htm", "法律法规/人脸识别", "high", "中国政府网人脸识别技术应用安全管理办法入口，用于带摄像头机器人在校园采集、识别和存储人脸信息时的合规核验。");
source("SRC1001", "GB/T 41819 国家标准信息入口", "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=E1F42B0EEB2056D4F4BBE25B3F627E75", "国家标准/生物识别数据安全", "high", "国家标准全文公开系统入口，补充人脸、生物识别等敏感个人信息处理和数据安全核验路径。");
source("SRC1002", "GB/T 41807 国家标准信息入口", "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=8F265BB41D33C698FB5E8D90A45CC5A6", "国家标准/声纹识别数据安全", "high", "国家标准全文公开系统入口，补充声纹、语音采集、麦克风数据和生物识别信息处理核验路径。");
source("SRC1003", "GB/T 40660 国家标准信息入口", "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=08B0E1CAAD5D61F66868F60D19DA85C3", "国家标准/生物特征识别信息保护", "high", "国家标准全文公开系统入口，适合作为机器人人脸、声纹、步态等生物特征识别信息保护的标准核验路径。");
source("SRC1004", "NIST SP 800-92 日志管理指南", "https://csrc.nist.gov/pubs/sp/800/92/final", "网络安全/日志审计", "high", "NIST SP 800-92 Guide to Computer Security Log Management，用于机器人控制器、云端平台、远程运维和账号操作的日志审计设计参考。");
source("SRC1005", "OPC UA Auditing 安全模型", "https://reference.opcfoundation.org/specs/OPC-10000-2/4.14", "工业通信/审计事件", "high", "OPC UA 安全模型审计章节入口，可作为工业机器人、控制器和边缘网关记录安全事件与审计事件的参考。");
source("SRC1006", "NIST SP 800-207 零信任架构", "https://csrc.nist.gov/pubs/sp/800/207/final", "网络安全/零信任", "high", "NIST Zero Trust Architecture，用于学校机器人远程访问、厂商维护账号、云服务接入和实验室网络分区的安全架构参考。");
source("SRC1007", "NIST SP 800-63 数字身份指南", "https://pages.nist.gov/800-63-4/", "网络安全/身份认证", "high", "NIST Digital Identity Guidelines，用于机器人平台账号权限、权限管理、身份认证、多因素认证和远程访问身份管理参考。");
source("SRC1008", "CIS Control 8 Audit Log Management", "https://www.cisecurity.org/controls/audit-log-management", "网络安全/日志审计", "high", "CIS 审计日志管理控制项入口，补充机器人平台、运维服务器和边缘计算设备的日志收集、保留和告警要求。");
source("SRC1009", "宇树官方开源入口", "https://www.unitree.com/cn/opensource/", "中文官网/开源项目", "high", "宇树官方开源入口，集中展示宇树机器人相关 SDK、仿真、强化学习、LeRobot 等开源资源。");
source("SRC1010", "Unitree LeRobot GitHub", "https://github.com/unitreerobotics/unitree_lerobot", "GitHub/官方研究代码", "medium", "宇树官方 LeRobot 仓库入口，补充 G1 等平台的数据采集、模仿学习和开源训练流程证据。");
source("SRC1011", "LeRobot Unitree G1 文档", "https://github.com/huggingface/lerobot/blob/main/docs/source/unitree_g1.mdx", "GitHub/开源文档", "medium", "Hugging Face LeRobot 的 Unitree G1 文档入口，用于核验 G1 接入 LeRobot 的遥操作、采集和训练链路。");
source("SRC1012", "ExtremControl 人形遥操作项目页", "https://extremcontrol.github.io/", "论文/人形机器人项目", "high", "ExtremControl 项目页，面向低延迟人形机器人遥操作，补充 Unitree G1 类平台在遥操作和全身控制研究中的证据。");
source("SRC1013", "HumanUP 人形站起项目页", "https://humanoid-getup.github.io/", "论文/人形机器人项目", "high", "HumanUP 项目页，面向真实人形机器人从多姿态自主站起，补充 Unitree G1 类平台在恢复能力和安全控制研究中的证据。");
source("SRC1014", "FRoM-W1 人形语言指令控制论文", "https://arxiv.org/abs/2601.12799", "论文/人形机器人项目", "medium", "FRoM-W1 论文入口，研究基于语言指令的人形全身控制开源框架，可作为 G1/H1 类平台基础模型控制方向参考。");
source("SRC1015", "IMU 动捕人形实时全身遥操作论文", "https://arxiv.org/abs/2605.12347", "论文/人形机器人遥操作", "medium", "人形机器人 IMU 动捕实时全身遥操作论文入口，包含仿真到实机验证，用于评估学校人形平台遥操作采集能力。");
source("SRC1016", "ULTRA 人形全身移动操作论文", "https://arxiv.org/abs/2603.03279", "论文/人形机器人移动操作", "medium", "ULTRA 论文入口，聚焦统一多模态人形全身移动操作控制，用于评估人形机器人从运动到操作的一体化研究价值。");
source("SRC1017", "Go2 楼梯攀爬强化学习论文", "https://arxiv.org/abs/2602.14473", "论文/四足机器人项目", "medium", "论文使用四足机器人进行 U 型楼梯攀爬强化学习研究，适合评估 Go2 类平台在建筑空间和复杂地形中的科研适配度。");
source("SRC1018", "Go2 动态步态迁移论文", "https://arxiv.org/abs/2510.10455", "论文/四足机器人项目", "medium", "动态四足步态论文入口，研究可变速度和步态切换，可作为 Unitree Go2/B2/A2 类四足平台运动控制证据。");
source("SRC1019", "Go2 垂向扰动鲁棒运动论文", "https://arxiv.org/abs/2510.13488", "论文/四足机器人项目", "medium", "论文研究四足机器人在垂向地面扰动下的运动鲁棒性，补充 Go2 类平台在非平整地形和扰动环境下的研究证据。");
source("SRC1020", "Dribble HRL 四足控球项目页", "https://dribble-hrl.github.io/", "论文/四足机器人项目", "high", "Dribble HRL 项目页，研究崎岖地形上的动态腿式控球与分层强化学习，可作为四足高动态操作任务标杆。");
source("SRC1021", "Stretch 设计论文 PMC", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10710733/", "论文/移动操作平台", "high", "Stretch 设计论文开放入口，说明其面向室内人类环境的紧凑轻量移动操作平台设计，是 Stretch 作为科研平台的重要依据。");
source("SRC1022", "Hello Robot GitHub 组织", "https://github.com/hello-robot", "GitHub/移动操作平台", "medium", "Hello Robot GitHub 组织入口，集中提供 Stretch ROS、Stretch AI、工具和示例代码，可作为移动操作科研复现生态来源。");
source("SRC1023", "ARIO 具身智能数据集项目页", "https://ario-dataset.github.io/", "论文/数据集/具身智能", "high", "ARIO 项目页，面向多模态真实场景具身智能数据，可作为学校建设具身数据采集和评测体系的中文/国产数据来源参考。");
source("SRC1024", "鹏城星云 ARIO 数据集入口", "https://data-starcloud.pcl.ac.cn/data-nav/embodied-ai/datasets/ario", "中文数据平台/具身智能", "medium", "鹏城星云数据服务平台 ARIO 数据集入口，补充国内具身智能数据集下载、治理和持续更新来源。");
source("SRC1025", "中国工程科学移动操作机器人综述", "https://www.engineering.org.cn/sscae/CN/1160096277969035886", "中文综述/移动操作", "high", "《中国工程科学》移动操作机器人系统发展研究入口，适合作为复合型机器人关键技术、系统架构和落地趋势的中文综述来源。");
source("SRC1026", "CCF CNCC 具身智能专题", "https://www.ccf.org.cn/Focus/2024-10-17/831346.shtml", "中文学术活动/具身智能", "medium", "CCF CNCC 具身智能专题入口，补充国内学术界对具身智能、人形机器人和大模型机器人方向的讨论来源。");
source("SRC1027", "NOETIX 官方开源入口", "https://noetixrobotics.com/opensource", "中文官网/开源项目", "high", "NOETIX 官方开源入口，补充 Bumi/N2/E1 系列人形平台的 SDK、开发资料和教学科研复现线索。");
source("SRC1028", "DEEPRobotics Lite3 美国官方页", "https://www.deeprobotics.us/products/lite-3/", "官网/四足机器人", "high", "云深处美国 Lite3 官方页，补充 Lite3 海外教育科研定位、参数和采购资料入口。");
source("SRC1029", "DEEPRobotics Lite3 Motion SDK", "https://github.com/DeepRoboticsLab/Lite3_MotionSDK", "GitHub/官方SDK/四足", "medium", "云深处 Lite3 Motion SDK 仓库入口，适合核验 Lite3 运动控制、二次开发和科研实验接入路径。");
source("SRC1030", "DEEPRobotics Lite3 ROS", "https://github.com/DeepRoboticsLab/Lite3_ROS", "GitHub/ROS/四足机器人", "medium", "云深处 Lite3 ROS 仓库入口，补充 Lite3 在 ROS 生态中的接口和实验复现来源。");
source("SRC1031", "DEEPRobotics 强化学习训练仓库", "https://github.com/DeepRoboticsLab/rl_training", "GitHub/强化学习/四足机器人", "medium", "DeepRoboticsLab 强化学习训练仓库入口，补充云深处四足平台在运动控制和 sim-to-real 研究中的代码线索。");
source("SRC1032", "RobotEra VLA GitHub", "https://github.com/roboterax/robotera_vla", "GitHub/人形机器人基础模型", "medium", "星动纪元 RobotEra VLA 仓库入口，补充 STAR1/人形平台的数据采集、训练和推理工作流来源。");
source("SRC1033", "RobotEra ROS2 SDK", "https://github.com/roboterax/ros2_sdk", "GitHub/ROS2/人形机器人", "medium", "RobotEra ROS2 SDK 仓库入口，补充 STAR1 人形机器人 ROS2 开发和系统集成来源。");
source("SRC1034", "starVLA 项目页", "https://starvla.github.io/", "论文/人形机器人基础模型", "high", "starVLA 项目页，面向乐高式具身智能开发，补充人形机器人基础模型和任务开发研究入口。");
source("SRC1035", "starVLA GitHub", "https://github.com/starVLA/starVLA", "GitHub/人形机器人基础模型", "medium", "starVLA 代码仓库入口，补充人形机器人 VLA 模型、数据和实验复现来源。");
source("SRC1036", "AgileX PiPER ROS GitHub", "https://github.com/agilexrobotics/piper_ros", "GitHub/ROS/机械臂", "medium", "松灵 PiPER ROS 工作空间仓库入口，补充 PiPER 机械臂在 ROS/移动操作组合中的开发证据。");
source("SRC1037", "Hiwonder JetAuto 大模型课程文档", "https://docs.hiwonder.com/projects/JetAuto/en/jetauto-orin-nano/docs/11.Large_AI_Model_Courses.html", "官方文档/具身智能课程", "high", "JetAuto Orin Nano 大模型课程文档，补充教学复合平台接入语音、大模型、视觉和任务执行课程的来源。");
source("SRC1038", "TurtleBot4 GitHub", "https://github.com/turtlebot/turtlebot4", "GitHub/ROS2移动底盘", "medium", "TurtleBot4 common packages 仓库入口，补充 ROS2 原生教学底盘的代码和实验复现来源。");
source("SRC1039", "ROBOTIS Open Manipulator GitHub", "https://github.com/ROBOTIS-GIT/open_manipulator", "GitHub/开源机械臂", "medium", "ROBOTIS Open Manipulator 仓库入口，补充 TurtleBot4 加装轻量机械臂组合的开源硬件和代码来源。");
source("SRC1040", "RealMan ROS2 RM Robot", "https://github.com/RealManRobot/ros2_rm_robot", "GitHub/ROS2/机械臂", "medium", "睿尔曼 ROS2 RM Robot 仓库入口，补充 RM65 和移动复合平台的 ROS2 接入与二次开发来源。");
source("SRC1041", "RealMan RM Models", "https://github.com/RealManRobot/rm_models", "GitHub/机器人模型/仿真", "medium", "睿尔曼 RM Models 仓库入口，补充 RM 系列机械臂和复合平台在仿真、URDF/模型侧的来源。");
source("SRC1042", "Gymnasium Robotics 官方文档", "https://robotics.farama.org/", "官方文档/强化学习环境", "high", "Farama Gymnasium Robotics 文档入口，提供 Fetch、Shadow Dexterous Hand、Maze 等机器人强化学习环境，适合教学和算法基准对照。");
source("SRC1043", "Gymnasium Robotics GitHub", "https://github.com/Farama-Foundation/Gymnasium-Robotics", "GitHub/强化学习环境", "medium", "Farama 官方 GitHub 仓库，补充 Gymnasium Robotics 环境源码、任务定义和可复现实验入口。");
source("SRC1044", "robosuite GitHub", "https://github.com/ARISE-Initiative/robosuite", "GitHub/机器人操作仿真", "medium", "ARISE Initiative robosuite 仓库，补充 Panda、Sawyer、IIWA、Jaco 等机械臂操作任务、控制器和 Benchmark 代码。");
source("SRC1045", "SAPIEN GitHub", "https://github.com/haosulab/SAPIEN", "GitHub/具身仿真平台", "medium", "SAPIEN Embodied AI Platform 仓库，补充具身交互、 articulated object 和物理仿真源码入口。");
source("SRC1046", "ManiSkill GitHub", "https://github.com/haosulab/ManiSkill", "GitHub/操作Benchmark", "medium", "ManiSkill 仓库提供基于 SAPIEN 的机器人操作任务、GPU 并行仿真和 Benchmark 实现，适合机械臂与移动操作研究复现。");
source("SRC1047", "BEHAVIOR-1K GitHub", "https://github.com/StanfordVL/BEHAVIOR-1K", "GitHub/具身任务Benchmark", "medium", "Stanford BEHAVIOR-1K 仓库，补充家庭日常任务 Benchmark、仿真环境和任务资产的可复现入口。");
source("SRC1048", "AI2-THOR GitHub", "https://github.com/allenai/ai2thor", "GitHub/具身仿真平台", "medium", "Allen AI AI2-THOR 开源仓库，补充室内导航、交互、物体操作和具身 AI 任务的源码入口。");
source("SRC1049", "ManipulaTHOR GitHub", "https://github.com/allenai/manipulathor", "GitHub/视觉操作Benchmark", "medium", "ManipulaTHOR 仓库面向带机械臂的移动机器人视觉操作任务，可作为复合型机器人感知-导航-抓取基准。");
source("SRC1050", "Real Robot Challenge 官方站", "https://real-robot-challenge.com/", "真实机器人挑战赛", "high", "Real Robot Challenge 官方入口，基于 TriFinger 真实平台评估样本效率、真实操作和 sim-to-real，是采购实验平台时判断 Benchmark 可落地性的参考。");
source("SRC1051", "TriFinger Simulation GitHub", "https://github.com/open-dynamic-robot-initiative/trifinger_simulation", "GitHub/真实机器人仿真", "medium", "Open Dynamic Robot Initiative TriFinger 仿真仓库，补充真实机器人挑战赛的仿真环境和控制接口来源。");
source("SRC1052", "NIST ARIAC 文档", "https://pages.nist.gov/ARIAC_docs/en/latest/", "Benchmark/工业机器人竞赛", "high", "NIST Agile Robotics for Industrial Automation Competition 文档入口，适合机械臂、移动操作和工业场景任务评测参考。");
source("SRC1053", "Drake GitHub", "https://github.com/RobotLocomotion/drake", "GitHub/机器人建模控制", "medium", "MIT RobotLocomotion Drake 仓库，补充机器人建模、优化、控制和验证工具链源码入口。");
source("SRC1054", "D4RL GitHub", "https://github.com/Farama-Foundation/D4RL", "GitHub/离线强化学习Benchmark", "medium", "Farama D4RL 仓库包含 Adroit Hand、Franka Kitchen 等离线强化学习任务，可作为灵巧手和机械臂算法数据基准。");
source("SRC1055", "SimplerEnv 项目页", "https://simpler-env.github.io/", "论文/仿真评测", "high", "SimplerEnv 项目页用于在仿真中评估真实机器人操作策略，适合 RT-1/RT-X/OpenVLA 类策略的采购平台横向评估。");
source("SRC1056", "RoboCasa GitHub", "https://github.com/robocasa/robocasa", "GitHub/移动操作Benchmark", "medium", "RoboCasa 仓库提供日常厨房任务、大规模仿真资产和机器人学习 Benchmark，可补充移动操作平台的可复现实验入口。");
source("SRC1057", "RLBench GitHub", "https://github.com/stepjam/RLBench", "GitHub/机器人操作Benchmark", "medium", "RLBench 仓库提供大规模语言条件机器人操作任务和学习环境，适合机械臂、夹爪和复合型机器人算法对照。");
source("SRC1058", "Berkeley RAIL 实验室", "https://rail.eecs.berkeley.edu/", "实验室/机器人学习项目", "high", "Berkeley RAIL 实验室入口，持续产出 BridgeData、RT 系列、机器人学习与具身智能项目，适合作为科研项目追踪源。");
source("SRC1059", "UT Austin RPL 实验室", "https://rpl.cs.utexas.edu/", "实验室/机器人感知学习", "high", "UT Austin Robot Perception and Learning Lab 入口，覆盖机器人操作、感知、移动操作和基础模型研究项目。");
source("SRC1060", "ETH Robotic Systems Lab", "https://rsl.ethz.ch/", "实验室/足式机器人", "high", "ETH Zurich Robotic Systems Lab 入口，ANYmal、腿足运动和户外自主系统研究活跃，可作为四足/轮足平台科研标杆。");
source("SRC1061", "MIT Robot Locomotion Group", "https://locomotion.csail.mit.edu/", "实验室/机器人运动控制", "high", "MIT Robot Locomotion Group 入口，聚焦腿足机器人、控制、规划和 Drake 生态，适合人形/四足平台研究跟踪。");
source("SRC1062", "MIT Biomimetic Robotics Lab", "https://biomimetics.mit.edu/", "实验室/腿足机器人", "high", "MIT Biomimetic Robotics Lab 入口，覆盖 Mini Cheetah 等腿足机器人研究，可作为四足硬件和运动控制对照来源。");
source("SRC1063", "Berkeley AI Research", "https://bair.berkeley.edu/", "实验室/机器人学习", "high", "BAIR 入口，覆盖机器人学习、具身智能和基础模型方向，可作为长期追踪论文、项目和数据集的研究源。");
source("SRC1064", "Franka 官方联系页", "https://franka.de/contact", "官网/询价联系", "high", "Franka Robotics 官方联系入口，可用于 Research 3、Mobile FR3 Duo 等设备的正式询价、交期和服务条款核验。");
source("SRC1065", "Franka 官方合作伙伴页", "https://franka.de/partners", "官网/合作伙伴", "high", "Franka 官方合作伙伴入口，用于核验采购、系统集成和服务支持网络；国内采购仍需确认授权代理和报价。");
source("SRC1066", "Kinova 官方联系页", "https://www.kinovarobotics.com/contact-us", "官网/询价联系", "high", "Kinova Robotics 官方联系入口，可用于 Gen3 机械臂正式询价、教育折扣、支持和交付周期核验。");
source("SRC1067", "Unitree B2 官方商店页", "https://shop.unitree.com/products/unitree-b2", "官方商店/询价线索", "high", "宇树海外官方商店 B2 页面显示 100,000 美元占位价，并明确写有 Contact us for the real price；应作为官方询价入口和预算上界线索，不作为确定成交价。");
source("SRC1068", "Unitree A2 官方商店页", "https://shop.unitree.com/products/unitree-a2", "官方商店/询价线索", "high", "宇树海外官方商店 A2 页面显示 100,000 美元占位价，并提示联系销售购买；应以宇树正式报价为准。");
source("SRC1069", "Unitree 官方经销商申请页", "https://shop.unitree.com/pages/become-a-distributor", "官方渠道/经销商", "medium", "宇树海外官方经销商申请页提供分销网络和联系表单，可作为核验授权渠道和区域代理的入口。");
source("SRC1070", "京东检索：宇树 B2 机器狗", "https://search.jd.com/Search?keyword=%E5%AE%87%E6%A0%91%20B2%20%E6%9C%BA%E5%99%A8%E7%8B%97", "京东渠道线索", "low", "京东宇树 B2 检索入口；页面可能触发验证，仅作渠道线索，不作为确定报价或授权证明。");
source("SRC1071", "京东检索：宇树 A2 机器狗", "https://search.jd.com/Search?keyword=%E5%AE%87%E6%A0%91%20A2%20%E6%9C%BA%E5%99%A8%E7%8B%97", "京东渠道线索", "low", "京东宇树 A2 检索入口；页面可能触发验证，仅作渠道线索，不作为确定报价或授权证明。");
source("SRC1072", "淘宝检索：宇树 B2 机器狗", "https://s.taobao.com/search?q=%E5%AE%87%E6%A0%91%20B2%20%E6%9C%BA%E5%99%A8%E7%8B%97", "淘宝/天猫线索", "low", "淘宝宇树 B2 检索入口，仅作型号、渠道和店铺线索；正式采购需核验官方或授权代理资质。");
source("SRC1073", "淘宝检索：宇树 A2 机器狗", "https://s.taobao.com/search?q=%E5%AE%87%E6%A0%91%20A2%20%E6%9C%BA%E5%99%A8%E7%8B%97", "淘宝/天猫线索", "low", "淘宝宇树 A2 检索入口，仅作型号、渠道和店铺线索；正式采购需核验官方或授权代理资质。");
source("SRC1074", "证券时报：CyberDog 2 售价报道", "https://www.stcn.com/article/detail/946961.html", "中文媒体/官方消息转述", "medium", "证券时报 e 公司报道称据小米消息，CyberDog 2 售价 12999 元并于小米商城开售；用于交叉核验 CyberDog 2 发布价。");
source("SRC1075", "京东检索：小米 CyberDog 2", "https://search.jd.com/Search?keyword=%E5%B0%8F%E7%B1%B3%20CyberDog%202", "京东渠道线索", "low", "京东小米 CyberDog 2 检索入口；页面可能触发验证，仅作渠道线索，不作为确定报价或在售证明。");
source("SRC1076", "淘宝检索：小米 CyberDog 2", "https://s.taobao.com/search?q=%E5%B0%8F%E7%B1%B3%20CyberDog%202", "淘宝/天猫线索", "low", "淘宝小米 CyberDog 2 检索入口，仅作渠道线索；应优先核验小米官方商城或官方客服在售状态。");
source("SRC1077", "小米 CyberDog 用户服务协议", "https://www.mi.com/article/detail/68bb66a6a1b2.html", "官方协议/服务条款", "medium", "小米 CyberDog 用户服务协议说明产品/服务适用范围、用户责任和服务条款，可作为 CyberDog 类消费开发平台的使用边界来源。");
source("SRC1078", "政府采购检索：宇树 B2", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E5%AE%87%E6%A0%91%20B2", "招投标检索", "medium", "中国政府采购网宇树 B2 关键词检索入口，用于持续核验高校/政府四足机器人采购公告和成交价。");
source("SRC1079", "政府采购检索：宇树 A2", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=%E5%AE%87%E6%A0%91%20A2", "招投标检索", "medium", "中国政府采购网宇树 A2 关键词检索入口，用于持续核验新一代四足机器人采购公告和成交价。");
source("SRC1080", "政府采购检索：CyberDog", "https://search.ccgp.gov.cn/bxsearch?searchtype=1&searchparam=CyberDog", "招投标检索", "medium", "中国政府采购网 CyberDog 关键词检索入口，用于判断小米四足机器人是否进入高校/政府采购案例。");
source("SRC1081", "Universal Robots AIM Processing 案例", "https://www.universal-robots.com/case-stories/aim-processing/", "厂商案例/产线部署", "high", "UR 官方案例显示 AIM Processing 使用 UR5 协作机器人处理托盘堆叠、传送带取件和机床上下料，生产率提升 400%，可作为 UR5e 落地成熟度对照。");
source("SRC1082", "DOBOT Heriot-Watt University 教学案例", "https://www.dobot-robots.com/insights/case-studies/innovating-engineering-technology-at-heriot-watt-university.html", "厂商案例/高校教学", "high", "DOBOT 官方案例介绍 Heriot-Watt University 使用 Magician E6 和 CR5 推进工程技术教学与实践教育，适合学校机器人实训采购参考。");
source("SRC1083", "DOBOT CR5 应用场景说明", "https://www.dobot-robots.com/insights/news/wide-applications-of-dobot-cr5-collaborative-robot.html", "厂商案例/协作臂应用", "medium", "DOBOT 官方文章汇总 CR5 协作机器人在自动化应用中的多场景使用，可补充 CR5 落地项目适配证据。");
source("SRC1084", "DEEPRobotics 工业巡检方案", "https://www.deeprobotics.us/industry/industrial-inspection/", "厂商方案/工业巡检", "high", "云深处海外官网工业巡检方案覆盖制造、化工、管道、隧道和受限空间等场景，适合 X30/X20/B2 类四足平台落地对照。");
source("SRC1085", "DEEPRobotics 戈壁风场巡检案例", "https://www.deeprobotics.us/news/deep-robotics-quadruped-robot-delivers-96-5-detection-accuracy-in-autonomous-wind-farm-inspections-across-the-gobi-desert/", "厂商案例/风电巡检", "high", "云深处案例说明四足机器人在宁夏戈壁无人风电站完成 200 多次自主巡检，并实现 96.5% 识别准确率，可作为户外巡检落地证据。");
source("SRC1086", "云深处 X30 行业应用发布", "https://www.deeprobotics.cn/robot/index/article/id/120.html", "中文厂商案例/行业应用", "high", "云深处中文文章说明 X30 面向电站、工厂、管廊巡检、应急救援、消防侦查和科研等场景，补充国产四足落地能力来源。");
source("SRC1087", "数字中国：Walker S1 工厂实训报道", "https://www.digitalchina.gov.cn/2025/xwzx/szkx/202504/t20250423_5008840.htm", "政府媒体/人形工厂案例", "medium", "数字中国建设峰会转载人民日报报道，说明 Walker S 系列进入吉利、比亚迪、富士康、顺丰等工厂实训，并获得超过 500 台意向订单。");
source("SRC1088", "北京经开区：Walker S1 享界工厂案例", "https://kfqgw.beijing.gov.cn/cxyzkfq/yzal/202503/t20250324_4245769.html", "政府信息/人形工厂案例", "medium", "北京经开区文章介绍 Walker S1 在享界超级工厂总装车间执行仪表线物料检测，检测准确率达 99%，补充人形机器人制造落地证据。");
source("SRC1089", "RealMan 机械臂赋能机器狗案例", "https://develop.realman-robotics.com/symbiosis/demo/robotDog/", "厂商案例/四足加臂", "high", "睿尔曼官方生态案例集成 Unitree B1、RM65-6F-V 机械臂和傲意灵巧手，展示机器狗加机械臂的移动操作原型。");
source("SRC1090", "RealMan 机器人闪电仓方案", "https://develop.realman-robotics.com/en/symbiosis/solutions/application/roboticLightningWarehouse/", "厂商方案/仓储应用", "high", "睿尔曼官方机器人闪电仓方案页，补充轻量机械臂、移动平台和仓储场景集成来源。");
source("SRC1091", "RealMan 仓储搬运机器人案例", "https://develop.realman-robotics.com/en/symbiosis/demo/warehousehandlingrobot/", "厂商案例/仓储搬运", "high", "睿尔曼官方仓储搬运机器人集成案例，用于评估移动复合机器人在仓储、搬运和视觉识别场景的落地适配。");
source("SRC1092", "Boston Dynamics Spot 工业巡检方案", "https://bostondynamics.com/solutions/inspection", "厂商方案/工业巡检", "high", "Boston Dynamics 官方工业巡检方案说明 Spot 用于常规和危险巡检、热成像和视觉检查，是四足巡检落地标杆。");
source("SRC1093", "Boston Dynamics 客户案例入口", "https://bostondynamics.com/case-studies/", "厂商案例/客户案例库", "high", "Boston Dynamics 客户案例库集中展示 Spot 等机器人从试点到规模化部署的案例，可作为国外高端落地对照来源。");
source("SRC1094", "ANYbotics 化工行业巡检方案", "https://www.anybotics.com/industries/robotic-inspection-for-chemicals/", "厂商方案/化工巡检", "high", "ANYbotics 官方化工行业巡检方案说明 ANYmal 用于复杂设施自动巡检、提升安全和效率，可作为工业四足落地标杆。");
source("SRC1095", "OMRON 移动复合机器人方案", "https://industrial.omron.co.uk/en/solutions/product-solutions/omron-mobile-manipulator-solution", "厂商方案/移动复合机器人", "high", "欧姆龙移动复合机器人方案结合协作臂和移动机器人，适合作为轮式底盘加机械臂落地架构对照。");
source("SRC1096", "MimicPlay 项目页", "https://mimic-play.github.io/", "论文/机器人操作项目", "high", "MimicPlay 面向长程模仿学习，通过观看人类 play 数据学习操作技能，可作为机械臂和移动操作平台示教数据策略参考。");
source("SRC1097", "FurnitureBench 项目页", "https://clvrai.github.io/furniture-bench/", "论文/真实机器人Benchmark", "high", "FurnitureBench 是真实家具装配机器人 Benchmark，用于评估长程、多阶段和精细操作能力，适合协作臂和双臂复合平台对照。");
source("SRC1098", "Transporter Networks 项目页", "https://transporternets.github.io/", "论文/机器人操作基线", "high", "Transporter Networks 是视觉重排和桌面操作经典基线，适合夹爪、桌面机械臂和教学平台做算法对照。");
source("SRC1099", "RT-Trajectory 项目页", "https://rt-trajectory.github.io/", "论文/机器人基础模型", "high", "RT-Trajectory 研究通过 hindsight trajectory sketches 改善机器人任务泛化，可作为 VLA/操作策略评估入口。");
source("SRC1100", "RoboFlamingo 项目页", "https://roboflamingo.github.io/", "论文/机器人基础模型", "high", "RoboFlamingo 将视觉语言基础模型用于机器人模仿学习，是评估开源 VLA、机械臂和移动操作软件生态的重要入口。");
source("SRC1101", "Open X-Embodiment 论文入口", "https://arxiv.org/abs/2310.08864", "论文/多机器人数据集", "high", "Open X-Embodiment 论文入口，补充跨多机器人形态数据集和 RT-X 模型的正式论文来源。");
source("SRC1102", "ReKep 项目页", "https://rekep-robot.github.io/", "论文/机器人操作规划", "high", "ReKep 使用时空关系关键点约束进行机器人操作推理，可作为机械臂、移动操作和语言条件规划研究入口。");
source("SRC1103", "ConceptGraphs 项目页", "https://concept-graphs.github.io/", "论文/3D场景图/规划", "high", "ConceptGraphs 面向开放词汇 3D 场景图和规划，适合移动操作机器人在真实空间中做语义建图与任务规划参考。");
source("SRC1104", "TidyBot 项目页", "https://tidybot.cs.princeton.edu/", "论文/移动操作项目", "high", "TidyBot 使用大语言模型学习个性化整理偏好并完成移动操作任务，可作为 Stretch、TIAGo 和自研复合平台家庭/服务任务参考。");
source("SRC1105", "RoboPoint 项目页", "https://robopoint.github.io/", "论文/机器人空间可供性", "high", "RoboPoint 面向机器人空间可供性预测，适合抓取、放置和移动操作任务中的视觉语言定位能力评估。");
source("SRC1106", "OK-Robot GitHub", "https://github.com/ok-robot/ok-robot", "GitHub/移动操作项目", "medium", "OK-Robot 开源仓库说明其在 Hello Robot Stretch 上完成开放词汇家庭取放任务，提供导航、操作和硬件模块代码入口。");
source("SRC1107", "Dobb-E GitHub", "https://github.com/notmahi/dobb-e", "GitHub/移动操作项目", "medium", "Dobb-E 开源仓库提供家庭机器人操作学习框架，可用于核验 Stretch 类平台的数据采集、训练和部署链路。");
source("SRC1108", "RoboAgent 项目页", "https://robopen.github.io/", "论文/机器人操作项目", "high", "RoboAgent 项目页展示利用语义增强和 action chunking 提升多任务机器人操作泛化，适合机械臂和复合平台策略学习参考。");
source("SRC1109", "RoboAgent 论文入口", "https://arxiv.org/abs/2309.01918", "论文/机器人操作项目", "medium", "RoboAgent arXiv 论文入口，补充样本高效机器人操作、语义增强和多任务泛化的正式论文来源。");
source("SRC1110", "RoboGen 项目页", "https://robogen-ai.github.io/", "论文/生成式仿真/机器人学习", "high", "RoboGen 通过生成式仿真自动提出任务、生成环境并学习技能，可作为学校建设仿真数据和自动化任务生成平台的参考。");
source("SRC1111", "UniManip 项目页", "https://henryhcliu.github.io/unimanip", "论文/机器人操作Agent", "medium", "UniManip 面向通用零样本机器人操作的 Agentic Operational Graph，可作为长程任务规划和操作执行链路研究入口。");
source("SRC1112", "HumanoidBench GitHub", "https://github.com/carlosferrazza/humanoid-bench", "GitHub/人形机器人Benchmark", "medium", "HumanoidBench 代码仓库提供高自由度人形全身运动和操作任务实现，适合 Unitree H1/G1、Fourier 等平台算法对照。");
source("SRC1113", "MaskedMimic 项目页", "https://research.nvidia.com/labs/par/maskedmimic/", "论文/人形机器人控制", "high", "MaskedMimic 面向统一物理角色控制和动作补全，适合作为人形机器人全身控制、文本控制和物体交互研究入口。");
source("SRC1114", "RMA 四足快速运动适应项目页", "https://ashish-kmr.github.io/rma-legged-robots/", "论文/四足机器人项目", "high", "RMA Rapid Motor Adaptation 项目页展示四足机器人在未见地形、载荷和磨损条件下实时适应，是四足控制经典研究入口。");
source("SRC1115", "RMA 论文入口", "https://arxiv.org/abs/2107.04034", "论文/四足机器人项目", "high", "RMA arXiv 论文说明其在 Unitree A1 上零微调部署，适合作为 Unitree Go1/Go2/B2 和同类四足平台运动控制对照。");
source("SRC1116", "DreamWaQ++ 项目页", "https://dreamwaqpp.github.io/", "论文/四足机器人项目", "high", "DreamWaQ++ 面向障碍感知四足运动和多模态强化学习，页面展示 Go1、ANYmal-C、Hound 等跨平台验证。");
source("SRC1117", "DreamWaQ 论文入口", "https://arxiv.org/abs/2301.10602", "论文/四足机器人项目", "medium", "DreamWaQ 论文入口，研究仅凭本体感觉和隐式地形想象实现鲁棒四足运动，可作为低传感器配置四足平台参考。");
source("SRC1118", "EmbodiedBench GitHub", "https://github.com/EmbodiedBench/EmbodiedBench", "GitHub/具身智能Benchmark", "medium", "EmbodiedBench 官方仓库用于评估多模态大模型作为具身 Agent 的高低层能力，补充 VLM/VLA 软件评测入口。");
source("SRC1119", "EmbodiedBench 项目页", "https://embodiedbench.github.io/", "论文/具身智能Benchmark", "high", "EmbodiedBench 项目页提供多模态大模型具身评测框架，适合学校统一评估导航、操作、推理和规划能力。");
source("SRC1120", "Genesis 机器人生成式仿真平台", "https://genesis-embodied-ai.github.io/", "GitHub/仿真平台/具身智能", "medium", "Genesis 是面向通用机器人与具身智能学习的生成式物理仿真平台，可作为机器人数据生成、仿真训练和任务自动生成工具链参考。");
source("SRC1121", "西安科技大学具身智能实训系统采购项目", "https://www.ccgp-shaanxi.gov.cn/freecms/site/shaanxi/ggxx/info/2026/8a69c8529c3053c1019c3b492bd75542.html?noticeId=28e0b383-04e8-11f1-8063-08c0eb20c666&noticeType=001011", "高校采购/招标公告", "high", "陕西省政府采购网公告，西安科技大学具身智能实训系统采购项目预算 49.67 万元，可作为学校建设具身智能实训平台的预算和招标模板参考。");
source("SRC1122", "阳光学院智能创新实验室具身机器人采购", "https://www.ygu.edu.cn/info/1125/4082.htm", "高校采购/招标公告", "medium", "阳光学院采购公告，项目名称为智能创新实验室具身机器人采购，补充民办高校具身机器人实验室采购场景线索。");
source("SRC1123", "西京学院机器人创新实验室具身机器人设备采购", "https://www.xijing.edu.cn/info/1160/15794.htm", "高校采购/招标公告", "medium", "西京学院采购公告，面向机器人创新实验室具身机器人设备采购，可作为高校创新实验室建设和设备清单调研入口。");
source("SRC1124", "哈工大苏州研究院具身智能训练场多负载机器人平台", "https://sri.hit.edu.cn/2025/0430/c17773a367984/page.htm", "高校/科研机构采购公告", "high", "哈工大苏州研究院具身智能训练场多负载机器人平台公开招标采购公告，补充多负载机器人平台、训练场和科研平台建设来源。");
source("SRC1125", "南华大学智能机器人及自动控制开发平台", "https://www.ccgp.gov.cn/cggg/dfgg/gkzb/202507/t20250716_24974821.htm", "高校采购/招标公告", "high", "中国政府采购网公告，南华大学智能机器人及自动控制开发平台项目公开招标，品目为教学仪器，适合补充机器人实训和自动控制平台采购线索。");
source("SRC1126", "四川职业技术学院机器人系统集成实训平台中标", "https://www.ccgp.gov.cn/cggg/dfgg/zbgg/202411/t20241129_23750267.htm", "高校采购/中标公告", "high", "中国政府采购网中标公告，四川职业技术学院机器人系统集成应用技术实训平台建设项目总中标金额 95 万元，可作为机械臂/系统集成实训采购预算参考。");
source("SRC1127", "大连理工大学 AI+3D 视觉机器人智能制造实训平台", "https://www.ccgp.gov.cn/cggg/zygg/gkzb/202411/t20241129_23751789.htm", "高校采购/招标公告", "high", "中国政府采购网中央公告，大连理工大学 AI+3D 视觉赋能机器人智能制造实训平台采购项目，补充视觉、机器人和人工智能实训平台建设来源。");
source("SRC1128", "齐鲁工业大学人形机器人实验室系统平台中标", "https://www.ccgp.gov.cn/cggg/dfgg/zbgg/202412/t20241215_23874457.htm", "高校采购/中标公告", "high", "中国政府采购网中标公告，齐鲁工业大学人形机器人实验室系统平台采购项目总中标金额 190.87 万元，补充人形实验室建设成交价来源。");
source("SRC1129", "中国软件评测中心人形机器人综合测评系统", "https://www.ccgp.gov.cn/cggg/zygg/gkzb/202602/t20260203_26144106.htm", "政府采购/测评系统招标", "high", "中国软件评测中心工业机器人（人形机器人）可靠性及智能化综合测评系统招标公告，适合作为人形机器人可靠性、智能化测评和验收体系来源。");
source("SRC1130", "警用四足机器人采购项目结果公告", "https://www.ccgp.gov.cn/cggg/dfgg/zbgg/202506/t20250630_24872220.htm", "政府采购/四足机器人中标", "high", "中国政府采购网结果公告，警用四足机器人采购项目总中标金额 186 万元，补充四足机器人在公共安全落地场景中的成交价和采购来源。");
source("SRC1131", "卫生健康能力提升四足/四轮足机器人购置中标", "https://www.ccgp.gov.cn/cggg/dfgg/zbgg/202512/t20251212_25911764.htm", "政府采购/四足机器人中标", "high", "中国政府采购网中标公告，卫生健康能力提升示范性项目第二包四足机器人、四轮足机器人购置总中标金额 61.56 万元，补充公共卫生场景采购价格来源。");
source("SRC1132", "华中科技大学人形机器人平台二次招标", "https://www.ccgp.gov.cn/cggg/zygg/gkzb/202503/t20250314_24299863.htm", "高校采购/招标公告", "high", "中国政府采购网公告，华中科技大学人形机器人平台第二次公开招标，补充高校人形机器人平台采购流程和招标要求来源。");
source("SRC1133", "复旦大学智能机器人采购项目二次招标", "https://www.ccgp.gov.cn/cggg/zygg/gkzb/202411/t20241121_23681705.htm", "高校采购/招标公告", "high", "中国政府采购网公告，复旦大学智能机器人采购项目第二次公开招标，品目为工业机器人，补充高校智能机器人平台采购入口。");
source("SRC1134", "宇树官方文档中心", "https://support.unitree.com/home/", "官方文档/支持中心", "high", "宇树官方文档中心入口，可集中核验 G1/H1/R1/Go2/B2/A2/Z1 等机器人应用开发、维护、升级和支持资料。");
source("SRC1135", "Unitree G1 应用下载页", "https://www.unitree.com/app/g1/", "官网/应用下载", "high", "Unitree G1 官方应用下载入口，补充移动端控制、用户工具和售后支持路径；具体版本需以页面当前下载项为准。");
source("SRC1136", "Unitree Go2 应用下载页", "https://www.unitree.com/app/go2/", "官网/应用下载", "high", "Unitree Go2 官方应用下载入口，补充四足机器人移动端控制和用户工具来源。");
source("SRC1137", "Unitree G1 应用开发文档", "https://support.unitree.com/home/en/G1_developer/application_development", "官方开发文档/人形机器人", "high", "宇树 G1 官方开发文档入口，用于核验应用开发、SDK 接入和学校二次开发能力。");
source("SRC1138", "Unitree Go2 应用开发文档", "https://support.unitree.com/home/en/developer/Application_development", "官方开发文档/四足机器人", "high", "宇树 Go2 官方应用开发文档入口，补充 Go2 高层开发、SDK 和控制链路核验来源。");
source("SRC1139", "Unitree Z1 SDK 操作文档", "https://support.unitree.com/home/en/Z1_developer/sdk_operation", "官方开发文档/机械臂", "high", "宇树 Z1 官方 SDK 操作文档入口，用于核验 Z1 机械臂和四足加臂组合的二次开发接口。");
source("SRC1140", "DEEP Robotics 产品总览", "https://www.deeprobotics.us/products/", "官网/四足机器人产品线", "high", "云深处海外官网产品总览入口，用于核验 Lite3、X20、X30、Lynx 等四足/轮足产品线和选型差异。");
source("SRC1141", "DEEP Robotics 下载中心", "https://www.deeprobotics.us/downloads/", "官网下载/手册资料", "high", "云深处海外官网下载中心，集中提供产品手册、用户手册和开发手册，适合采购前核验文档完备性。");
source("SRC1142", "DEEP Robotics 研究教育方案", "https://www.deeprobotics.us/industry/research-education/", "官网/科研教育方案", "high", "云深处研究教育方案页，补充 Lite3/X30 等四足平台面向教育科研、课程和开发者场景的官方定位。");
source("SRC1143", "Jueying Lite3 AI 用户手册", "https://www.deeprobotics.us/wp-content/uploads/2025/08/Jueying-Lite3-AI-User-Manual-V1.0.3-0.pdf", "官方手册/四足机器人", "high", "云深处 Lite3 AI 用户手册 PDF，用于核验 Lite3 操作、安全、配置和维护要求。");
source("SRC1144", "Jueying Lite3 感知开发手册", "https://www.deeprobotics.us/wp-content/uploads/2025/10/Jueying-Lite3-Perception-Development-Manual-beta-V2.2.2-0.pdf", "官方开发手册/四足机器人", "high", "云深处 Lite3 感知开发手册 PDF，补充感知、二次开发和科研实验接入来源。");
source("SRC1145", "Google Gemini Robotics 官方介绍", "https://blog.google/feed/gemini-robotics/", "官方研究项目/机器人基础模型", "high", "Google 官方介绍 Gemini Robotics 与 Gemini Robotics-ER，作为机器人 VLA、具身推理和通用操作能力的研究入口。");
source("SRC1146", "Gemini Robotics 论文入口", "https://arxiv.org/abs/2503.20020", "论文/机器人基础模型", "high", "arXiv 论文介绍 Gemini Robotics 可直接控制机器人，覆盖开放词汇指令、复杂操作和跨机器人形态适配。");
source("SRC1147", "Gemini Robotics On-Device 官方研究页", "https://deepmind.google/blog/gemini-robotics-on-device-brings-ai-to-local-robotic-devices/", "官方研究项目/端侧机器人模型", "high", "Google DeepMind 页面说明 On-Device 模型在 ALOHA 训练后可适配双臂 Franka FR3 和 Apptronik Apollo 人形机器人，是移动双臂、Franka 和人形平台的重要研究入口。");
source("SRC1148", "NVIDIA GR00T N1.5 项目页", "https://research.nvidia.com/labs/gear/gr00t-n1_5/", "论文/人形机器人基础模型", "high", "NVIDIA Research 页面介绍 GR00T N1.5 开放人形机器人基础模型，并展示在 GR-1 和 Unitree G1 数据上的后训练与操作评估。");
source("SRC1149", "SmolVLA 论文入口", "https://arxiv.org/abs/2506.01844", "论文/VLA模型/低成本机器人", "high", "SmolVLA 面向低成本、社区数据和可负担机器人平台，强调单 GPU 训练、消费级 GPU 或 CPU 部署，适合作为学校教学科研软件栈入口。");
source("SRC1150", "InternVLA-M1 项目页", "https://internrobotics.github.io/internvla-m1.github.io/", "论文/中文VLA项目", "high", "InternVLA-M1 项目页来自 InternRobotics，面向通用机器人策略的空间引导视觉-语言-动作框架，提供项目、论文和代码入口。");
source("SRC1151", "InternVLA-M1 论文入口", "https://arxiv.org/abs/2510.13778", "论文/中文VLA项目", "medium", "InternVLA-M1 arXiv 入口，补充上海 AI 实验室等中文科研生态在通用机器人策略上的正式论文来源。");
source("SRC1152", "InternData-M1 ModelScope 数据集", "https://www.modelscope.cn/datasets/InternRobotics/InternData-M1", "中文数据集/机器人操作", "medium", "ModelScope InternData-M1 数据集入口，可作为中文平台和国产科研生态下机器人操作数据、训练数据治理和下载流程来源。");
source("SRC1153", "InternDataEngine 文档", "https://internrobotics.github.io/InternDataEngine-Docs/", "项目文档/机器人数据引擎", "medium", "InternDataEngine 文档入口，补充机器人数据采集、转换和训练数据工程化工具链来源。");
source("SRC1154", "GraspFactory 项目页", "https://graspfactory.github.io/", "论文/抓取数据集", "high", "GraspFactory 项目页介绍面向 Franka Panda 和 Robotiq 2F85 的大规模 6-DoF 抓取数据集，适合机械臂、夹爪和抓取算法采购平台对照。");
source("SRC1155", "H2R 论文入口", "https://arxiv.org/abs/2505.11920", "论文/机器人数据增强", "medium", "H2R 通过把人类第一视角视频转换为机器人中心视觉数据来预训练机器人策略，可作为低数据量机械臂和移动操作研究入口。");
source("SRC1156", "OpenARM 官方中文社区", "https://openarm.cn/", "中文开源硬件/机械臂", "medium", "OpenARM 中文社区介绍经济型开源人形机械臂和国产供应链方案，可作为学校低成本开源机械臂、双臂半人形平台和 DIY 教学对照来源。");
source("SRC1157", "上海 AI 实验室具身智能开源周", "https://www.shlab.org.cn/news/5444209", "中文研究机构/开源项目", "high", "上海人工智能实验室文章集中发布导航、操作、运动大模型和数据集，适合持续追踪中文具身智能开源生态。");
source("SRC1158", "Whole-Body MPPI 项目页", "https://whole-body-mppi.github.io/", "论文/腿足机器人控制", "high", "ICRA 2025 项目页展示在真实四足机器人上部署全身采样式 MPC，用于箱体推动、攀爬和粗糙地形行走等接触丰富任务。");
source("SRC1159", "Online Embodiment Adaptation 项目页", "https://embodiment-adaptation.github.io/", "论文/四足机器人项目", "high", "项目页说明在 Unitree Go2 上进行真实世界在线形态适应，覆盖锁腿、加负载等异常形态变化，是 Go2 类平台运动控制研究入口。");
source("SRC1160", "LOVON 四足开放词汇导航论文", "https://arxiv.org/abs/2507.06747", "论文/四足开放词汇导航", "medium", "LOVON 结合 LLM 层级规划与开放词汇视觉检测，面向真实开放环境的长程物体导航，适合四足巡检和校园导航课题参考。");
source("SRC1161", "Inria Paris Robotics Lab Go2 平台页", "https://inria-paris-robotics-lab.github.io/Robots/Go2.html", "高校实验室/四足平台", "medium", "Inria Paris Robotics Lab 的 Unitree Go2 平台页，说明 Go2 已作为欧洲高校/实验室足式机器人研究硬件进入课题环境。");
source("SRC1162", "Stretch 设计论文 PMC", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10710733/", "论文/移动操作平台", "high", "The Design of Stretch 论文入口，系统说明 Stretch 作为室内人类环境轻量移动操作平台的设计取舍和硬件形态。");
source("SRC1163", "HomeRobot AAAI 论文入口", "https://ojs.aaai.org/index.php/AAAI-SS/article/view/27723", "论文/移动操作软件栈", "high", "AAAI Symposium 论文入口，介绍 HomeRobot 开源移动操作软件栈，作者来自 Meta AI、Hello Robot、Georgia Tech 和 UT Austin 等机构。");
source("SRC1164", "CMU Unitree Go2 自主栈 GitHub", "https://github.com/jizhang-cmu/autonomy_stack_go2", "GitHub/四足自主导航", "medium", "CMU 开源 Unitree Go2 自主栈，面向 Go2 的定位、建图、规划和自主移动，可作为校园导航与巡检复现实验入口。");
source("SRC1165", "AgiBot Research 研究入口", "https://www.agibot.com/research/", "中文厂商研究/具身智能", "high", "智元机器人研究入口，集中展示 AgiBot World、AgiBot Genie 等研究项目和数据/模型生态，适合评估智元人形平台科研延展性。");
source("SRC1166", "复旦大学全尺寸通用人形机器人合同 PDF", "https://jpg.zfcg.sh.gov.cn/sh-gov-open-doc/1035IC/9bf44943-4091-4054-8f52-cfebe9ae8244.pdf", "高校采购/合同PDF", "high", "上海政府采购合同 PDF，可补充复旦大学 Unitree H1-2 全尺寸通用人形机器人采购的合同级证据、付款和交付条款。");
source("SRC1167", "同济大学通用人形机器人训练平台招标公告", "https://xxgk.tongji.edu.cn/index.php?classid=4579&newsid=19220&t=show", "高校采购/招标公告", "high", "同济大学信息公开网页显示通用人形机器人训练平台预算 837.6 万元，合同签订后 60 个工作日内完成并验收交付，采购需求聚焦具身行为学习与发育能力。");
source("SRC1168", "同济大学机器人集群训练场", "https://robot.tongji.edu.cn/info/1297/2519.htm", "高校实验室/科研平台", "high", "同济大学智能机器人与计算感知实验室科研平台页说明建设百台级异构机器人本体及集群训练策略，服务示教学习、仿真迁移和真实世界强化学习。");
source("SRC1169", "河南警用四足机器人合同 PDF", "https://zhongmou.zfcg.henan.gov.cn/cmsweb81e27e/nas/webfile2024/henan/rootfiles/2025/08/21/409ced0c983e43cc966d788a4e21b4cd.pdf", "政府采购/合同PDF", "high", "河南政府采购合同 PDF，可补充警用四足机器人项目的合同级采购证据、交付和验收条款，适合公共安全落地项目参考。");
source("SRC1170", "河南四足/四轮足机器人合同 PDF", "https://erqi.zfcg.henan.gov.cn/cmsweb81e27e/henan/rootfiles/2025/11/12/fe4937f3d5d440bc93f1d48dfde568f4.pdf", "政府采购/合同PDF", "high", "河南政府采购合同 PDF，对应四足机器人和四轮足机器人购置项目，可用于核验公共服务场景下的采购、质保和交付要求。");
source("SRC1171", "深圳技术大学机器人智能控制实验平台招标", "https://bidding.sztu.edu.cn/info/1113/12314.htm", "高校采购/招标公告", "high", "深圳技术大学采购与招投标中心公告，机器人智能控制实验平台和工业机器人虚拟仿真平台预算 98.95 万元，明确不接受进口产品参与投标。");
source("SRC1172", "东南大学 UR5e 协作机械臂竞价结果", "https://zhejiang.chinamae.com/news/c8f14e8738d324ce15f8d48f0bd2ad7b.html", "高校采购/竞价结果", "medium", "浙江机电设备采购网页显示东南大学协作机械臂成交总额 19.1 万元，品牌优傲，型号 UR5e，送货时间合同签订后 7 天内。");
source("SRC1173", "NOETIX 官方开源入口", "https://noetixrobotics.com/opensource", "中文官网/开源项目", "high", "NOETIX 官方开源页集中展示 Bumi/N2/E1 系列开源资料，补充小型人形机器人 SDK、教学科研和二次开发证据。");
source("SRC1174", "NOETIX Bumi 官方产品页", "https://noetixrobotics.com/en/product/n2/1262", "官网/官方规格", "high", "NOETIX Bumi 官方产品页列出 Lite/Air/Pro/Max/EDU 等版本，以及身高、重量、自由度、续航和计算通信配置。");
source("SRC1175", "LimX TRON1 中文产品页", "https://www.limxdynamics.com/zh/products/tron1", "中文官网/科研平台", "high", "逐际动力 TRON1 中文官方页说明其为多形态双足机器人和人形 RL 科研入门平台，支持开放 SDK、底层接口、Python 开发、NVIDIA Isaac、MuJoCo 和 Gazebo。");
source("SRC1176", "CyberDog ROS2 GitHub", "https://github.com/MiRoboticsLab/cyberdog_ros2", "GitHub/ROS2源码", "medium", "小米 CyberDog ROS2 仓库提供 CyberDog ROS2 软件包入口，适合核验四足平台的感知、导航、交互和自主决策开源生态。");
source("SRC1177", "DeepRobotics Lite3 MotionSDK GitHub", "https://github.com/DeepRoboticsLab/Lite3_MotionSDK", "GitHub/官方SDK/四足", "medium", "云深处 Lite3 MotionSDK 仓库入口，补充 Lite3 运动控制、二次开发和科研实验接入路径。");
source("SRC1178", "Booster 官方开源页", "https://www.booster.tech/open-source/", "官方开发文档/开源入口", "high", "Booster 官方开源页集中列出 T1/K1 手册、SDK、ROS2 SDK、RoboCup Demo、Booster Gym、Booster Train、Booster Deploy 和模型资产。");
source("SRC1179", "Booster Gym 论文入口", "https://arxiv.org/abs/2506.15132", "论文/人形机器人强化学习", "high", "Booster Gym 论文介绍面向 Booster 机器人的端到端强化学习框架，并在 Booster T1 实机上验证 sim-to-real 迁移。");
source("SRC1180", "myCobot 320 Pi 官方商城页", "https://shop.elephantrobotics.com/collections/mycobot-pro/products/mycobot-pro-raspberry-pi", "官方商城/价格", "high", "大象机器人官方商城 myCobot 320 Pi 2022 页面列常规价 USD 2,499，并说明从中国仓 7-15 个工作日发货、1 kg 负载、6 自由度和科研教育定位。");
source("SRC1181", "myCobot 320 Pi 官方文档", "https://docs.elephantrobotics.com/docs/gitbook-en/2-serialproduct/2.2-320/2.2.2-PI.html", "官方文档/机械臂", "high", "大象机器人官方 GitBook myCobot 320-Pi 文档，补充产品参数、接口、首次使用和开发环境搭建资料。");
source("SRC1182", "EngineAI PM01 官方购买页", "https://en.engineai.com.cn/product-purchase.html", "官网/官方价格", "high", "众擎机器人官方购买页列 PM01 价格 ¥188000、SA01 价格 ¥42000，可作为 PM01 当前公开官方价来源。");
source("SRC1183", "EngineAI PM01 中文官方产品页", "https://www.engineai.com.cn/product-pm01", "中文官网/官方规格", "high", "众擎 PM01 官方产品页说明 23+ 自由度、腰部 320° 旋转、约 130 N·m 峰值关节扭矩、开放硬件底层接口和训练/部署代码支持。");
source("SRC1184", "复旦大学 Fourier GR-1 人形机器人成交公告", "https://cz.fudan.edu.cn/fudanstatic/zbgghw/20240816/2225.html", "高校采购/成交公告", "high", "复旦大学人形机器人成交公告列货物品牌为上海傅利叶智能科技有限公司、型号 GR-1、数量 1、货物单价 700000 元，成交金额 70 万元。");
source("SRC1185", "Fourier GR-2 官方文档", "https://support.fftai.com/en/docs/GR-X-Humanoid-Robot/GR2/GR-2_Introduction/", "官方文档/人形机器人", "high", "傅利叶文档中心 GR-2 介绍页，补充 GR-2 身高、体重、配置、操作指南、SDK 开发、遥操作、强化学习、仿真和开源技术入口。");
source("SRC1186", "优必选 Walker S1 官方产品页", "https://www.ubtrobot.com/cn/humanoid/products/walker-s1", "中文官网/官方规格", "high", "优必选 Walker S1 工业版人形机器人官方页，补充工业场景、人形产品线、解决方案和官方产品定位。");
source("SRC1187", "AGIBOT A2 Lite 官方商城页", "https://store.agibot.com/products/a2-lite", "官方商城/价格线索", "high", "智元 AGIBOT 官方商城 A2 Lite 页面列 Sale price USD 44,560，并说明 A2 Lite 为全尺寸、面向娱乐和商业表演的高性价比人形机器人；A2/Ultra 仍需按版本询价。");
source("SRC1188", "PAL Robotics TIAGo 官方产品页", "https://pal-robotics.com/robot/tiago/", "官网/移动操作平台", "high", "PAL Robotics TIAGo 官方页说明其是面向研究需求的移动操作机器人，提供特性、技术规格、软件和附件入口。");
source("SRC1189", "PAL OS TIAGo ROS2 文档", "https://docs.pal-robotics.com/edge/tiago", "官方文档/ROS2移动操作", "high", "PAL OS 25.01 TIAGo 文档覆盖 ROS2 平台下的硬件、传感器、控制器、导航、操作和人机交互开发资料。");
source("SRC1190", "ROS Robots TIAGo 索引", "https://robots.ros.org/tiago/", "ROS机器人索引", "medium", "ROS Robots TIAGo 页面标注其为 indoor service robot、mobile manipulator、research、education、MoveIt 和 deep learning 平台。");
source("SRC1191", "Robotnik RB-KAIROS 2025 数据表", "https://www.roscomponents.com/wp-content/uploads/2024/11/Robotnik_Datasheet_RB-KAIROS_2025_EN.pdf", "官方/渠道规格书", "high", "Robotnik/RB-KAIROS 2025 数据表 PDF，用于核验 RB-KAIROS 移动底盘、载重、传感器、ROS/ROS2 和可集成 UR 机械臂的规格。");
source("SRC1192", "ROS Robots RB-KAIROS 索引", "https://robots.ros.org/rb-kairos/", "ROS机器人索引", "medium", "ROS Robots RB-KAIROS 页面列 ROS2、Noetic、omnidirectional、industrial research、logistics 和 250 kg payload 等标签。");
source("SRC1193", "RobotEra STAR1 官方规格 PDF", "https://www.robotera.com/upload/goods/20241208/f56791f6bd7fdd069e2c8552f4d3aeed.pdf", "官方规格书/人形机器人", "high", "星动纪元 STAR1 官方产品 PDF，用于核验 STAR1 运动能力、自由度、硬件参数和官方产品定位。");
source("SRC1194", "panda-gym GitHub", "https://github.com/qgallouedec/panda-gym", "GitHub/机械臂学习环境", "medium", "panda-gym 提供基于 PyBullet 和 Gymnasium 的 Franka Panda 目标条件机器人学习环境，适合低门槛复现实验和课程作业。");
source("SRC1195", "panda-gym 论文入口", "https://arxiv.org/abs/2106.13687", "论文/机械臂学习环境", "medium", "panda-gym 论文介绍开源目标条件机器人学习环境，可作为 Franka/Panda 类机械臂教学和强化学习基线来源。");
source("SRC1196", "SimplerEnv 项目页", "https://simpler-env.github.io/", "论文/机器人操作Benchmark", "high", "SimplerEnv 项目页面向真实机器人操作策略在仿真中的复现评估，覆盖 RT-1、RT-1-X、Octo、Google Robot 和 WidowX/Bridge 等设置。");
source("SRC1197", "SimplerEnv GitHub", "https://github.com/simpler-env/SimplerEnv", "GitHub/机器人操作Benchmark", "medium", "SimplerEnv 仓库提供真实机器人操作策略仿真复现代码，适合学校统一评估 VLA/策略模型和机械臂数据集适配。");
source("SRC1198", "VLMaps 项目页", "https://vlmaps.github.io/", "论文/视觉语言导航", "high", "Visual Language Maps 项目页面向开放词汇机器人导航，可作为移动底盘、四足和移动操作平台语义导航研究入口。");
source("SRC1199", "VLMaps GitHub", "https://github.com/vlmaps/vlmaps", "GitHub/视觉语言导航", "medium", "VLMaps ICRA 2023 开源实现仓库，补充开放词汇语义地图和导航任务的软件复现入口。");
source("SRC1200", "OpenEQA 项目页", "https://open-eqa.github.io/", "论文/具身问答Benchmark", "high", "OpenEQA 面向基础模型时代的具身问答，适合评估移动机器人、四足和服务机器人在真实空间理解与问答任务中的能力。");
source("SRC1201", "ActionEQA 项目页", "https://actioneqa.github.io/", "论文/具身问答与行动接口", "high", "ActionEQA 将具身问答与行动接口结合，适合作为校园服务机器人和移动操作机器人高层任务评测入口。");
source("SRC1202", "3D Semantic Maps 移动操作项目页", "https://3dsmaps.github.io/", "论文/移动操作/语义地图", "high", "Open-vocabulary Mobile Manipulation with 3D Semantic Maps 项目页，面向未见动态环境中的开放词汇移动操作任务。");
source("SRC1203", "GeFF-B1 移动操作项目页", "https://geff-b1.github.io/", "论文/移动操作/特征场", "high", "Learning Generalizable Feature Fields for Mobile Manipulation 项目页，补充移动操作机器人在可泛化特征场和真实任务中的研究入口。");
source("SRC1204", "Wild Visual Navigation GitHub", "https://github.com/leggedrobotics/wild_visual_navigation", "GitHub/腿足机器人导航", "medium", "Wild Visual Navigation 仓库提供基于预训练模型和在线自监督的快速可通行性学习系统，适合四足巡检和野外导航研究对照。");
source("SRC1205", "CHAMP 四足 ROS 框架", "https://github.com/chvmp/champ", "GitHub/四足机器人ROS", "medium", "CHAMP 是开源四足 ROS 框架，可作为四足机器人教学、仿真和低成本开源平台对照。");
source("SRC1206", "legged_control GitHub", "https://github.com/qiayuanl/legged_control", "GitHub/腿足机器人控制", "medium", "legged_control 提供基于 OCS2 和 ros-controls 的 NMPC、WBC、状态估计和 sim-to-real 框架，适合四足/人形控制栈对照。");
source("SRC1207", "Motion Generation and Tracking 人形运动论文", "https://arxiv.org/abs/2604.17335", "论文/人形机器人运动控制", "medium", "论文入口讨论通过运动生成和运动跟踪学习全身人形移动能力，可作为 Unitree G1/H1、Fourier 和 Booster 类人形平台的算法对照。");
source("SRC1208", "Chasing Autonomy 人形跑步控制论文", "https://arxiv.org/abs/2603.25902", "论文/人形机器人运动控制", "medium", "Chasing Autonomy 论文入口面向可控人形跑步和动态重定向控制，补充高动态人形机器人运动控制研究来源。");
source("SRC1209", "Hello Robot Stretch 3 开源移动操作站", "https://hello-stretch3.com/", "官网/研究社区/移动操作", "high", "Hello Robot Stretch 3 站点强调开源移动操作平台、Embodied AI、教育、人机交互、文档和社区支持，适合采购前核验科研社区生态。");
source("SRC1210", "Hello Robot GitHub 组织", "https://github.com/hello-robot", "GitHub/移动操作平台", "medium", "Hello Robot GitHub 组织入口，集中提供 Stretch 相关 ROS2、AI、工具和示例代码仓库。");
source("SRC1211", "Unitree Go2 开放词汇语义记忆项目", "https://kylezthompson.com/projects/paws/", "研究项目/Unitree Go2", "medium", "Open Vocabulary Semantic Memory for Unitree Go2 项目页，补充 Go2 在开放词汇语义地图和空间记忆任务中的学生/研究项目证据。");
source("SRC1212", "RoboBrain 2.5 项目页", "https://superrobobrain.github.io/", "论文/具身智能基础模型", "high", "北京智源 RoboBrain 2.5 项目页，面向空间理解、时间推理、3D 操作轨迹和人形移动操作任务，适合作为中文具身智能基础模型入口。");
source("SRC1213", "RoboBrain 2.5 GitHub", "https://github.com/FlagOpen/RoboBrain2.5", "GitHub/具身智能基础模型", "medium", "GitHub API 核验存在的 RoboBrain 2.5 仓库，描述为 Depth in Sight, Time in Mind，用于跟踪代码、模型和技术报告更新。");
source("SRC1214", "DexVLA GitHub", "https://github.com/juruobenruo/DexVLA", "GitHub/灵巧操作VLA", "medium", "GitHub API 核验存在的 DexVLA 仓库，可作为灵巧操作、机械臂和人形末端操作方向的开源 VLA 跟踪入口。");
source("SRC1215", "WholeBodyVLA 项目页", "https://opendrivelab.com/WholeBodyVLA/", "论文/人形移动操作", "high", "WholeBodyVLA 项目页说明其在 Agibot X2 上实现端到端人形全身移动操作，覆盖双臂抓取、下蹲、转向、长程导航和地形泛化。");
source("SRC1216", "WholeBodyVLA GitHub", "https://github.com/OpenDriveLab/WholeBodyVLA", "GitHub/人形移动操作", "medium", "GitHub API 核验存在的 OpenDriveLab WholeBodyVLA 仓库，描述为 ICLR 2026 全身移动操作统一潜空间 VLA。");
source("SRC1217", "InternManip GitHub", "https://github.com/InternRobotics/InternManip", "GitHub/机械臂操作训练评测", "medium", "GitHub API 核验存在的 InternManip 仓库，描述为面向多数据集和 Benchmark 的机器人操作策略训练与评估套件。");
source("SRC1218", "InternNav GitHub", "https://github.com/InternRobotics/InternNav", "GitHub/导航基础模型", "medium", "GitHub API 核验存在的 InternNav 仓库，描述为 InternRobotics 面向通用导航基础模型的开放平台。");
source("SRC1219", "InternHumanoid GitHub", "https://github.com/InternRobotics/InternHumanoid", "GitHub/人形全身控制工具箱", "medium", "GitHub API 核验存在的 InternHumanoid 仓库，描述为面向人形机器人全身控制的一体化工具箱。");
source("SRC1220", "Awesome LLM Robotics", "https://github.com/GT-RIPL/Awesome-LLM-Robotics", "GitHub/机器人论文资源导航", "medium", "GitHub API 核验存在的 Awesome LLM Robotics 仓库，汇集大语言/多模态模型用于机器人和强化学习的论文、代码与项目网站。");
source("SRC1221", "Unitree 官方商城 G1", "https://shop.unitree.com/products/unitree-g1", "官方商城/采购渠道", "high", "Unitree 官方商城 G1 商品页可访问；页面价格有动态列表，采购前应以购物车配置或正式报价为准，不直接把抓取到的全局价格列表作为确定报价。");
source("SRC1222", "Unitree 官方商城 R1", "https://shop.unitree.com/products/unitree-r1", "官方商城/采购渠道", "high", "Unitree 官方商城 R1 商品页可访问；适合作为低价人形平台海外官方采购渠道核验入口。");
source("SRC1223", "Unitree 官方商城 B2", "https://shop.unitree.com/products/unitree-b2", "官方商城/采购渠道", "high", "Unitree 官方商城 B2 商品页可访问；B2 实际配置和价格需按版本、传感器和行业包向厂商确认。");
source("SRC1224", "Unitree 官方商城 A2", "https://shop.unitree.com/products/unitree-a2", "官方商城/采购渠道", "high", "Unitree 官方商城 A2 商品页可访问；适合作为 A2 系列官方采购渠道和配置核验入口。");
source("SRC1225", "Unitree 官方商城 Go2", "https://shop.unitree.com/products/unitree-go2", "官方商城/采购渠道", "high", "Unitree 官方商城 Go2 商品页可访问；与中文官网起售价共同作为 Go2 官方采购渠道来源。");
source("SRC1226", "Unitree 官方商城 Z1", "https://shop.unitree.com/products/unitree-z1", "官方商城/采购渠道", "high", "Unitree 官方商城 Z1 商品页可访问；适合作为 Z1 机械臂和四足加臂组合的官方采购渠道核验入口。");
source("SRC1227", "RobotsUSA AgileX LIMO ROS2 渠道页", "https://www.robotsusa.com/Agilex-LIMOROS2-LIMO-ROS2.htm", "代理渠道/价格线索", "medium", "RobotsUSA 页面可访问并显示 AgileX LIMO ROS2 Mobile Robot Platform 价格 USD 4,995，作为海外渠道价格交叉核验。");
source("SRC1228", "RobotLAB AgileX Limo ROS2 Rover", "https://www.robotlab.com/higher-ed-robots/store/limo-agilex", "教育渠道/价格线索", "medium", "RobotLAB 高等教育页面可访问并显示 AgileX Limo ROS2 Rover 价格 USD 2,895，作为教育渠道采购价格线索。");
source("SRC1229", "RobotLAB DOBOT CR5 Research", "https://www.robotlab.com/store/dobot-cr5", "教育渠道/价格线索", "medium", "RobotLAB 页面可访问并显示 Dobot CR5 Research 价格 USD 22,980、RaaS 起价 USD 482/月，补充 CR5 教育采购渠道。");
source("SRC1230", "Hiwonder JetAuto Pro 当前商品价", "https://www.hiwonder.com/products/jetauto-pro", "官网/官方价格", "high", "Hiwonder JetAuto Pro 官方商品页可访问并显示 USD 959.99 起，补充教学复合平台当前官方商品价格来源。");
source("SRC1231", "Hiwonder JetRover 当前商品价", "https://www.hiwonder.com/products/jetrover", "官网/官方价格", "high", "Hiwonder JetRover 官方商品页可访问并显示 USD 779.99 起，补充 JetRover 加臂方案当前官方商品价格来源。");
source("SRC1232", "Yahboom ROSMASTER X3 当前商品价", "https://category.yahboom.net/products/rosmaster-x3", "官网/官方价格", "high", "Yahboom ROSMASTER X3 官方商品页可访问并显示 USD 659 起，补充 ROS2 教学移动底盘当前商品价格来源。");
source("SRC1233", "Yahboom DOFBOT 当前商品价", "https://category.yahboom.net/products/dofbot-jetson_nano", "官网/官方价格", "high", "Yahboom DOFBOT Jetson Nano 官方商品页可访问并显示 USD 339 起，补充轻量机械臂和 ROSMASTER 加臂组合价格来源。");
source("SRC1234", "OpenVLA-OFT 项目页", "https://openvla-oft.github.io/", "论文/机器人基础模型", "high", "Stanford OpenVLA-OFT 项目页说明 OFT 微调方案、LIBERO 结果和 ALOHA 实机任务，是 VLA 适配学校自建平台的重要入口。");
source("SRC1235", "OpenVLA-OFT GitHub", "https://github.com/moojink/openvla-oft", "GitHub/机器人基础模型", "medium", "OpenVLA-OFT 官方代码仓库，用于核验 VLA 微调、ALOHA 实机评估和 LIBERO 复现实验链路。");
source("SRC1236", "OpenVLA-OFT 论文入口", "https://arxiv.org/abs/2502.19645", "论文/机器人基础模型", "high", "OpenVLA-OFT arXiv 论文记录优化微调方案、LIBERO 97.1% 平均成功率和双臂 ALOHA 实机评估。");
source("SRC1237", "Physical Intelligence π0.5 官方研究页", "https://www.pi.website/blog/pi05", "官方研究项目/机器人基础模型", "high", "Physical Intelligence 官方研究页介绍 π0.5 通过异构数据协同训练提升开放环境泛化，适合评估通用操作模型趋势。");
source("SRC1238", "π0.5 论文入口", "https://arxiv.org/abs/2504.16054", "论文/机器人基础模型", "high", "π0.5 arXiv 论文说明多机器人、语义预测和 Web 数据共同训练的 VLA 泛化方案。");
source("SRC1239", "SpatialVLA 项目页", "https://spatialvla.github.io/", "论文/中文VLA项目", "high", "SpatialVLA 项目页来自上海 AI 实验室、复旦、上海交大等，说明其使用 110 万真实机器人 episode 训练空间增强 VLA。");
source("SRC1240", "SpatialVLA GitHub", "https://github.com/SpatialVLA/SpatialVLA", "GitHub/中文VLA项目", "medium", "SpatialVLA 官方代码仓库，用于跟踪空间增强 VLA 的模型、数据处理和复现实验。");
source("SRC1241", "SpatialVLA 论文入口", "https://arxiv.org/abs/2501.15830", "论文/中文VLA项目", "high", "SpatialVLA arXiv 论文补充空间位置编码、自适应空间网格和跨机器人操作评估的正式论文来源。");
source("SRC1242", "TraceVLA 项目页", "https://tracevla.github.io/", "论文/VLA模型", "high", "TraceVLA 项目页说明用视觉轨迹提示增强 VLA 时空理解，并在 WidowX 实机任务和 SimplerEnv 上评估。");
source("SRC1243", "TraceVLA GitHub", "https://github.com/umd-huang-lab/tracevla", "GitHub/VLA模型", "medium", "TraceVLA 官方仓库提供基于 OpenVLA 的视觉轨迹提示微调实现、推理示例和模型入口。");
source("SRC1244", "ObjectVLA 项目页", "https://objectvla.github.io/", "论文/开放世界操作", "high", "ObjectVLA 项目页由美的、华东师范大学和上海大学等机构发布，关注无需每个新物体示教的开放世界物体操作。");
source("SRC1245", "PixelVLA 项目页", "https://wenqiliang.github.io/PixelVLA/", "论文/中文VLA项目", "high", "PixelVLA ICLR 2026 项目页说明像素级理解、文本+视觉提示和 Pixel-160K 数据集，适合精细抓取和视觉提示交互评估。");
source("SRC1246", "PixelVLA GitHub", "https://github.com/WenqiLiang/PixelVLA", "GitHub/中文VLA项目", "medium", "PixelVLA 代码仓库入口，用于跟踪像素级 VLA、数据集和训练实现。");
source("SRC1247", "LiLo-VLA 项目页", "https://yy-gx.github.io/LiLo-VLA/", "论文/长程机器人操作", "high", "LiLo-VLA 项目页提出把长程操作拆成到达模块和局部交互模块，并在 8 个真实长程任务上评估。");
source("SRC1248", "LiLo-VLA GitHub", "https://github.com/YY-GX/LiLo-VLA", "GitHub/长程机器人操作", "medium", "LiLo-VLA Benchmark 代码仓库，可作为长程任务、失败恢复和对象中心 VLA 评测入口。");
source("SRC1249", "NaVILA 项目页", "https://navila-bot.github.io/", "论文/腿足机器人导航", "high", "NaVILA RSS 2025 项目页说明将 VLA 与低层运动技能结合，用于四足/人形机器人语言导航。");
source("SRC1250", "NaVILA GitHub", "https://github.com/AnjieCheng/NaVILA", "GitHub/腿足机器人导航", "medium", "NaVILA 官方仓库提供腿足机器人视觉语言导航实现，可作为 Unitree Go2/H1 等平台导航研究入口。");
source("SRC1251", "OmniVLA 导航项目页", "https://omnivla-nav.github.io/", "论文/机器人导航基础模型", "high", "OmniVLA ICRA 2026 项目页介绍多模态目标条件导航 VLA，训练数据覆盖 9500 小时、10 个平台。");
source("SRC1252", "OmniVLA GitHub", "https://github.com/NHirose/OmniVLA", "GitHub/机器人导航基础模型", "medium", "OmniVLA 官方训练和推理代码仓库，可作为轮式、四足和移动操作平台的导航基础模型入口。");
source("SRC1253", "Xiaomi-Robotics-0 项目页", "https://xiaomi-robotics-0.github.io/", "论文/中文VLA项目", "high", "小米 Xiaomi-Robotics-0 项目页说明实时执行 VLA、异步推理和双臂拆积木/叠毛巾实机任务。");
source("SRC1254", "Xiaomi-Robotics-0 GitHub", "https://github.com/XiaomiRobotics/Xiaomi-Robotics-0", "GitHub/中文VLA项目", "medium", "Xiaomi-Robotics-0 官方仓库入口，用于跟踪模型、训练和实机部署代码。");
source("SRC1255", "LingBot-VLA 论文入口", "https://arxiv.org/abs/2601.18692", "论文/中文VLA项目", "high", "LingBot-VLA arXiv 论文说明其使用约 20000 小时真实双臂数据、9 种双臂配置和 GM-100 评测。");
source("SRC1256", "LingBot-VLA GitHub", "https://github.com/Robbyant/lingbot-vla", "GitHub/中文VLA项目", "medium", "LingBot-VLA 官方仓库入口，用于跟踪代码、模型、评测数据和后训练流程。");
source("SRC1257", "LingBot-VA 论文入口", "https://arxiv.org/abs/2601.21998", "论文/机器人世界模型", "high", "LingBot-VA arXiv 论文提出视频-动作世界模型和异步推理流程，面向长程真实操作和数据高效后训练。");
source("SRC1258", "LingBot-VA GitHub", "https://github.com/robbyant/lingbot-va", "GitHub/机器人世界模型", "medium", "LingBot-VA 官方仓库入口，补充视频世界模型、长程操作和真实机器人部署代码来源。");
source("SRC1259", "NORA-1.5 项目页", "https://declare-lab.github.io/nora-1.5", "论文/VLA模型", "high", "NORA-1.5 项目页说明基于世界模型和动作奖励做偏好训练，并在 Galaxea A1 实机上做跨具身迁移。");
source("SRC1260", "NORA GitHub", "https://github.com/declare-lab/nora", "GitHub/VLA模型", "medium", "NORA 官方开源仓库，基于 Qwen2.5-VL 和 FAST+ tokenizer，适合跟踪小型开源 VLA 方案。");
source("SRC1261", "VLA-0 项目页", "https://vla0.github.io/", "论文/VLA模型", "high", "VLA-0 项目页说明用文本形式表达动作、无需改造 VLM 架构，并在 SO-100 真实机器人任务上评估。");
source("SRC1262", "VLA-0 GitHub", "https://github.com/NVlabs/vla0", "GitHub/VLA模型", "medium", "NVIDIA VLA-0 代码仓库，补充轻量、低改造 VLA 训练和评估入口。");
source("SRC1263", "X Square Robot Wall-X GitHub", "https://github.com/X-Square-Robot/wall-x", "GitHub/中文VLA项目", "medium", "自变量机器人 Wall-X 仓库介绍 WALL 系列开源具身基础模型、LeRobot 数据准备、训练和评估工具链。");
source("SRC1264", "Hugging Face LeRobot WALL-OSS 文档", "https://huggingface.co/docs/lerobot/walloss", "官方文档/中文VLA项目", "medium", "Hugging Face LeRobot 文档说明 X Square Robot 的 WALL-OSS 已集成到 LeRobot 生态，可进行后训练、评估和部署，适合作为中文开源 VLA 工具链来源。");
source("SRC1265", "DexArt 项目页", "https://www.chenbao.tech/dexart/", "论文/灵巧操作Benchmark", "high", "DexArt 项目页来自上海交大、清华和 UC San Diego，面向带关节物体的灵巧操作泛化 Benchmark，适合评估机械臂搭配灵巧手的科研价值。");
source("SRC1266", "DexArt 论文入口", "https://arxiv.org/abs/2305.05706", "论文/灵巧操作Benchmark", "high", "DexArt arXiv 论文入口，补充灵巧操作、点云观察和未见物体泛化评测的正式论文来源。");
source("SRC1267", "DexArt GitHub", "https://github.com/Kami-code/dexart-release", "GitHub/灵巧操作Benchmark", "medium", "DexArt 开源仓库入口，适合核验任务环境、训练代码和机械臂/灵巧手操作复现实验。");
source("SRC1268", "AnyTeleop 项目页", "https://yzqin.github.io/anyteleop/", "论文/遥操作/灵巧手", "high", "AnyTeleop 项目页说明通用视觉式机器人臂手遥操作系统，面向不同机器人模型和部署环境的示教采集。");
source("SRC1269", "AnyTeleop 论文入口", "https://arxiv.org/abs/2307.04577", "论文/遥操作/灵巧手", "high", "AnyTeleop arXiv 论文入口，补充机械臂加灵巧手、人形上肢和复合机器人遥操作采集的论文证据。");
source("SRC1270", "Dex Retargeting GitHub", "https://github.com/dexsuite/dex-retargeting", "GitHub/遥操作/重定向", "medium", "AnyTeleop 项目页关联的重定向代码仓库，用于评估不同灵巧手、夹爪和人形手臂之间的动作映射可复现性。");
source("SRC1271", "BiGym 项目页", "https://chernyadev.github.io/bigym/", "论文/双臂移动操作Benchmark", "high", "BiGym 项目页介绍面向家庭环境的移动双臂示教驱动 Benchmark，覆盖 40 个任务和多种观察输入。");
source("SRC1272", "BiGym GitHub", "https://github.com/chernyadev/bigym", "GitHub/双臂移动操作Benchmark", "medium", "BiGym 开源仓库入口，适合核验移动双臂操作任务、数据格式和训练环境。");
source("SRC1273", "BiGym 论文 PDF", "https://chernyadev.github.io/bigym/static/paper/bigym_paper.pdf", "论文/双臂移动操作Benchmark", "medium", "BiGym 项目论文 PDF，补充移动双臂操作、家庭任务和示教数据 Benchmark 的论文材料。");
source("SRC1274", "ManiWAV 项目页", "https://mani-wav.github.io/", "论文/机器人操作项目", "high", "ManiWAV CoRL 2024 项目页，研究从野外音视频数据学习机器人操作，补充接触声音、视觉和策略学习结合的科研入口。");
source("SRC1275", "ManiWAV 论文入口", "https://arxiv.org/abs/2406.19464", "论文/机器人操作项目", "high", "ManiWAV arXiv 论文入口，适合评估机械臂、夹爪和复合机器人在音视频接触反馈任务中的研究可扩展性。");
source("SRC1276", "ManiWAV GitHub", "https://github.com/real-stanford/maniwav", "GitHub/机器人操作项目", "medium", "ManiWAV 官方代码仓库，用于跟踪音视频数据、策略训练和真实机器人操作复现实验。");
source("SRC1277", "OpenGalaxea GalaxeaVLA 项目页", "https://opengalaxea.github.io/GalaxeaVLA/", "论文/中文VLA项目", "high", "OpenGalaxea GalaxeaVLA 项目页，G0 入口已跳转到该页，展示开放世界机器人数据、VLA 和 Galaxea 平台研究链路。");
source("SRC1278", "GalaxeaVLA 论文入口", "https://arxiv.org/abs/2509.00576", "论文/中文VLA项目", "high", "GalaxeaVLA arXiv 论文入口，补充国产开放世界机器人数据和 VLA 模型的正式论文证据。");
source("SRC1279", "OpenGalaxea G0 GitHub", "https://github.com/OpenGalaxea/G0", "GitHub/中文VLA项目", "medium", "OpenGalaxea G0 仓库作为原 G0 网页占位入口，链接到 GalaxeaVLA 研究页和开放数据。");
source("SRC1280", "Galaxea Open World Dataset Hugging Face", "https://huggingface.co/datasets/OpenGalaxea/Galaxea-Open-World-Dataset", "数据集/中文VLA项目", "medium", "OpenGalaxea 项目页关联的 Hugging Face 数据集入口，用于核验开放世界机器人数据下载和版本更新。");
source("SRC1281", "Galaxea Open World Dataset ModelScope", "https://www.modelscope.cn/datasets/Galaxea/Galaxea-Open-World-Dataset", "数据集/中文VLA项目", "medium", "OpenGalaxea 项目页关联的 ModelScope 数据集入口，适合作为国内网络环境下的数据获取渠道。");
source("SRC1282", "Human2LocoMan 项目页", "https://human2locoman.github.io/", "论文/四足移动操作项目", "high", "Human2LocoMan RSS 2025 项目页，研究从人类预训练迁移到四足移动操作，页面提供论文、代码、数据集和模型入口。");
source("SRC1283", "Human2LocoMan 论文入口", "https://www.arxiv.org/abs/2506.16475", "论文/四足移动操作项目", "high", "Human2LocoMan arXiv 论文入口，补充四足加臂、跨具身模仿学习和移动操作策略的正式论文来源。");
source("SRC1284", "Human2LocoMan GitHub", "https://github.com/chrisyrniu/Human2LocoMan", "GitHub/四足移动操作项目", "medium", "Human2LocoMan 官方仓库入口，适合核验四足移动操作策略、模型和训练代码。");
source("SRC1285", "Human2LocoMan Hugging Face 数据集", "https://huggingface.co/datasets/chrisyrniu/human2locoman", "数据集/四足移动操作项目", "medium", "Human2LocoMan 项目页关联数据集入口，用于评估四足加臂示教数据和复现实验条件。");
source("SRC1286", "RoboVQA 项目页", "https://robovqa.github.io/", "论文/机器人长程推理数据集", "high", "RoboVQA CoRL 2023 项目页，面向多模态长程机器人推理，并强调可扩展到任意具身形态的数据采集。");
source("SRC1287", "RoboVQA 论文 PDF", "https://arxiv.org/pdf/2311.00899.pdf", "论文/机器人长程推理数据集", "high", "RoboVQA 论文 PDF，补充机器人视频问答、长程推理和多具身数据集的正式论文证据。");
source("SRC1288", "RoboVQA GitHub", "https://github.com/google-deepmind/robovqa", "GitHub/机器人长程推理数据集", "medium", "RoboVQA 官方代码仓库，用于核验数据处理、评测和机器人长程推理任务。");
source("SRC1289", "RoboVQA Hugging Face 数据集", "https://huggingface.co/datasets/Tianli/robovqa", "数据集/机器人长程推理", "medium", "RoboVQA 项目页关联 Hugging Face 数据集入口，适合作为服务机器人、移动操作和人形平台长程推理数据参考。");
source("SRC1290", "RoboInter 项目页", "https://lihaohn.github.io/RoboInter.github.io/", "论文/机器人操作中间表示", "high", "RoboInter 项目页说明其面向机器人操作的中间表示套件，包含 RoboInter-Data、RoboInter-VQA 和 VLA 工具，适合补充机械臂和复合平台的数据理解来源。");
source("SRC1291", "RoboInter GitHub", "https://github.com/InternRobotics/RoboInter", "GitHub/机器人操作中间表示", "medium", "InternRobotics RoboInter 仓库标题显示为 ICLR 2026 项目，补充机器人操作数据、VQA 和 VLA 工具链代码入口。");
source("SRC1292", "RoboVLMs 项目页", "https://robovlms.github.io/", "论文/VLA模型", "high", "RoboVLMs 项目页研究构建通用机器人策略 VLA 模型时的关键因素，覆盖仿真和真实机器人实验。");
source("SRC1293", "Open-TeleVision 项目页", "https://robot-tv.github.io/", "论文/遥操作/数据采集", "high", "Open-TeleVision CoRL 2024 项目页说明沉浸式主动视觉反馈遥操作，提供论文、视频、硬件和数据集入口，适合人形、双臂和移动操作平台采集。");
source("SRC1294", "Isaac-GR00T GitHub", "https://github.com/NVIDIA/Isaac-GR00T", "GitHub/人形机器人基础模型", "medium", "NVIDIA Isaac-GR00T 仓库当前标题显示为 GR00T N1.7 通用机器人基础模型，适合作为人形基础模型和训练代码持续跟踪入口。");
source("SRC1295", "Humanoid-Gym GitHub", "https://github.com/roboterax/humanoid-gym", "GitHub/人形机器人强化学习", "medium", "RobotEra Humanoid-Gym 仓库提供人形机器人强化学习与零样本 sim-to-real 训练入口，适合 STAR1、G1、H1 等平台对照。");
source("SRC1296", "大连理工宁波研究院 UR7e 机械臂采购检索", "https://www.baidu.com/s?wd=UR7e%E6%9C%BA%E6%A2%B0%E8%87%82%E9%87%87%E8%B4%AD%E7%BB%93%E6%9E%9C%E5%85%AC%E7%A4%BA%20%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E5%AE%81%E6%B3%A2%E7%A0%94%E7%A9%B6%E9%99%A2%20DGNB-HTSP2025081325", "中文采购检索入口", "low", "百度检索入口用于追踪大连理工大学宁波研究院 UR7e 机械臂采购结果公示和 DGNB-HTSP2025081325 编号；本条只作线索，不作为确定报价。");
source("SRC1297", "大连理工宁波研究院智能夹持及移动机器人采购检索", "https://www.baidu.com/s?wd=%E6%99%BA%E8%83%BD%E5%A4%B9%E6%8C%81%E5%8F%8A%E7%A7%BB%E5%8A%A8%E6%9C%BA%E5%99%A8%E4%BA%BA%E9%87%87%E8%B4%AD%E7%BB%93%E6%9E%9C%E5%85%AC%E7%A4%BA%20%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E5%AE%81%E6%B3%A2%E7%A0%94%E7%A9%B6%E9%99%A2%20DGNB-HTSP2025061280", "中文采购检索入口", "low", "百度检索入口用于追踪智能夹持及移动机器人采购结果公示和 DGNB-HTSP2025061280 编号，适合复合型机器人采购线索继续核验。");
source("SRC1298", "上海科技大学便捷人形机器人采购检索", "https://www.baidu.com/s?wd=%E4%B8%8A%E6%B5%B7%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%20%E4%BE%BF%E6%8D%B7%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA%20%E9%87%87%E8%B4%AD%E5%85%AC%E5%91%8A", "中文采购检索入口", "low", "百度检索入口用于追踪上海科技大学便捷人形机器人采购公告；采购型号、预算和成交价需以后续打开的校方公告为准。");
source("SRC1299", "浙大城市学院人形/四足机器人采购检索", "https://www.baidu.com/s?wd=%E6%B5%99%E5%A4%A7%E5%9F%8E%E5%B8%82%E5%AD%A6%E9%99%A2%20%E4%B8%AD%E5%9E%8B%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA%20%E7%A7%BB%E5%8A%A8%E6%8A%93%E5%8F%96%E5%9B%9B%E8%B6%B3%E6%9C%BA%E5%99%A8%E4%BA%BA%20QSZBE250075FHGK", "中文采购检索入口", "low", "检索入口用于追踪浙大城市学院中型人形机器人、巡检四足机器人和移动抓取四足机器人采购包，关联 QSZBE250075FHGK 编号。");
source("SRC1300", "深圳大学 G1 EDU 采购检索", "https://www.baidu.com/s?wd=%E6%B7%B1%E5%9C%B3%E5%A4%A7%E5%AD%A6%20G1%20edu-u4%20356000", "中文采购检索入口", "low", "检索入口用于追踪深圳大学 G1 EDU-U4 人形机器人采购线索和 356000 元价格信息，需以后续学校采购站或合同公告核验。");
source("SRC1301", "深圳大学 Go2 EDU 四足机器人采购检索", "https://www.baidu.com/s?wd=%E6%B7%B1%E5%9C%B3%E5%A4%A7%E5%AD%A6%20Go2%20EDU%20U3%20%E5%9B%9B%E8%B6%B3%E6%9C%BA%E5%99%A8%E4%BA%BA%20%E9%87%87%E8%B4%AD", "中文采购检索入口", "low", "检索入口用于追踪深圳大学 Go2 EDU U3 四足机器人采购线索，具体型号、配置和金额需进一步核验。");
source("SRC1302", "北京物资学院 DUAL-DOF7 具身智能机器人采购检索", "https://www.baidu.com/s?wd=%E5%8C%97%E4%BA%AC%E7%89%A9%E8%B5%84%E5%AD%A6%E9%99%A2%20DUAL-DOF7%20%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD%E6%9C%BA%E5%99%A8%E4%BA%BA", "中文采购检索入口", "low", "检索入口用于追踪北京物资学院 DUAL-DOF7 具身智能机器人采购线索，适合作为双臂/复合操作平台预算核验入口。");
source("SRC1303", "上海工程技术大学具身智能交互机器人平台检索", "https://www.baidu.com/s?wd=%E4%B8%8A%E6%B5%B7%E5%B7%A5%E7%A8%8B%E6%8A%80%E6%9C%AF%E5%A4%A7%E5%AD%A6%20%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD%E4%BA%A4%E4%BA%92%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%B9%B3%E5%8F%B0%20%E5%BF%AB%E9%80%9F%E9%87%87%E8%B4%AD%20%E6%88%90%E4%BA%A4", "中文采购检索入口", "low", "检索入口用于追踪上海工程技术大学具身智能交互机器人平台快速采购成交信息，具体采购清单需校方公告核验。");
source("SRC1304", "同济大学 Cobot Magic 采购检索", "https://www.baidu.com/s?wd=%E5%90%8C%E6%B5%8E%E5%A4%A7%E5%AD%A6%20Cobot%20Magic%20%E5%8F%8C%E8%87%82%E7%A7%BB%E5%8A%A8%E6%93%8D%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA%20%E9%87%87%E8%B4%AD", "中文采购检索入口", "low", "检索入口用于追踪同济大学 Cobot Magic 或双臂移动操作机器人采购线索，不作为确定报价。");
source("SRC1305", "中国移动人形双足机器人代工服务采购检索", "https://www.baidu.com/s?wd=%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A8%20%E4%BA%BA%E5%BD%A2%E5%8F%8C%E8%B6%B3%E6%9C%BA%E5%99%A8%E4%BA%BA%E4%BB%A3%E5%B7%A5%E6%9C%8D%E5%8A%A1%E9%87%87%E8%B4%AD%E9%A1%B9%E7%9B%AE%20%E5%AE%87%E6%A0%91%20%E6%99%BA%E5%85%83%201.2405%E4%BA%BF%E5%85%83", "中文采购检索入口", "low", "检索入口用于追踪中国移动人形双足机器人代工服务采购项目，关联宇树、智元和总预算报道；需以后续正式采购文件核验。");
source("SRC1306", "大连理工宁波研究院 UR7e 机械臂采购结果", "https://nbidut.dlut.edu.cn/info/1035/29510.htm", "高校采购/结果公告", "medium", "检索核验到大连理工大学宁波研究院 UR7e 机械臂采购结果公示，项目编号 DGNB-HTSP2025081325，公开信息显示成交金额约 296000 元；具体配置以校方页面为准。");
source("SRC1307", "大连理工宁波研究院智能夹持及移动机器人合同公告", "https://nbidut.dlut.edu.cn/info/1035/29030.htm", "高校采购/合同公告", "medium", "检索核验到智能夹持及移动机器人设备采购合同，项目编号 DGNB-HTSP2025061280，公开信息显示合同金额约 200000 元，作为移动复合平台采购对照。");
source("SRC1308", "大连理工宁波研究院 Go2 四足机器人采购结果", "https://nbidut.dlut.edu.cn/info/1035/29510.htm", "高校采购/结果公告", "medium", "大连理工大学宁波研究院采购结果线索显示 Go2 四足机器人项目 DGNB-HTSP2025101365，成交金额约 89900 元；与已收录 Go2 结果公告互为核验入口。");
source("SRC1309", "深圳大学 G1 EDU 人形机器人采购信息", "https://bidding.szu.edu.cn/info/1023/38592.htm", "高校采购/采购信息", "medium", "检索核验到深圳大学 G1 EDU-U4 人形机器人采购信息，公开线索显示价格约 356000 元；需以深圳大学采购站最终页面为准。");
source("SRC1310", "深圳大学 Go2 EDU U3 四足机器人采购信息", "https://bidding.szu.edu.cn/info/1023/39264.htm", "高校采购/采购信息", "medium", "检索核验到深圳大学 Go2 EDU U3 四足机器人采购信息，公开线索显示金额约 76000 元；具体版本和服务条款需以学校采购站为准。");
source("SRC1311", "浙大城市学院机器人采购项目中标公告", "https://www.hzcu.edu.cn/info/1131/34436.htm", "高校采购/中标公告", "medium", "浙大城市学院采购项目中标公告线索关联中型人形机器人、巡检四足机器人和移动抓取四足机器人，项目编号 QSZBE250075FHGK，适合作为人形/四足/复合平台采购案例。");
source("SRC1312", "北京物资学院 DUAL-DOF7 具身智能机器人采购公告", "https://cg.bwu.edu.cn/info/1011/4721.htm", "高校采购/采购公告", "medium", "北京物资学院采购公告线索显示 DUAL-DOF7 具身智能机器人，预算/成交线索约 63.4 万元，适合作为双臂复合操作平台采购对照。");
source("SRC1313", "上海工程技术大学具身智能交互机器人平台公告", "https://ztb.sues.edu.cn/72/69/c22438a291433/page.htm", "高校采购/成交公告", "medium", "上海工程技术大学招投标办公室页面用于核验具身智能交互机器人平台快速采购项目，适合作为学校交互机器人/人形平台建设案例。");
source("SRC1314", "上海科技大学便捷人形机器人采购公告", "https://www.shanghaitech.edu.cn/2025/0613/c1528a1111816/page.htm", "高校采购/采购公告", "medium", "上海科技大学采购公告线索用于核验便捷人形机器人采购项目，适合入门/中型人形机器人学校采购对照；具体金额和型号需以页面正文为准。");
source("SRC1315", "上海科技大学全尺寸人形机器人采购结果", "https://www.shanghaitech.edu.cn/2025/0611/c15929a1111770/page.htm", "高校采购/结果公告", "medium", "上海科技大学采购结果线索用于核验全尺寸人形机器人项目，适合 H1、GR、智元等全尺寸人形平台采购对照；具体供应商和金额需以校方页面为准。");
source("SRC1316", "Booster Robotics 官方开源页", "https://www.booster.tech/open-source/", "官方开发文档/开源入口", "high", "Booster 官方开源页集中列出 T1/K1 手册、SDK、ROS2 SDK、RoboCup Demo、Booster Gym、训练部署工具和模型资产，是 T1 教学科研二次开发的核心入口。");
source("SRC1317", "EngineAI PM01 中文官方产品页", "https://www.engineai.com.cn/product-pm01.html", "中文官网/官方规格", "high", "众擎 PM01 官方产品页可访问，页面描述 PM01 为全开放通用具身智能体，关联产品购买、政策条款和支持服务入口。");
source("SRC1318", "EngineAI humanoid GitHub", "https://github.com/engineai-robotics/engineai_humanoid", "GitHub/官方开源项目", "medium", "EngineAI 官方 humanoid 仓库可访问，补充 PM01/SA01 等人形平台的仿真、策略文件和部署代码入口。");
source("SRC1319", "RobotEra STAR1 官方产品页", "https://www.robotera.com/product/detail/16", "中文官网/官方规格", "high", "星动纪元 STAR1 官方产品页可访问，用于补充 STAR1 官方产品定位、参数、软硬件全栈能力和采购咨询入口。");
source("SRC1320", "RobotEra 官方开源页", "https://www.robotera.com/opensource", "中文官网/开源入口", "high", "星动纪元官方开源页可访问，适合跟踪 STAR1、RobotEra VLA、ROS2 SDK、模型和数据采集训练推理工作流。");
source("SRC1321", "LimX TRON1 中文官方产品页", "https://www.limxdynamics.com/zh/products/tron1", "中文官网/官方规格", "high", "逐际动力 TRON 1 中文官方产品页可访问，说明其为多形态双足机器人、人形 RL 科研入门平台，页面含参数、手册和订购咨询入口。");
source("SRC1322", "LimX TRON1 Isaac Lab 训练仓库", "https://github.com/limxdynamics/tron1-rl-isaaclab", "GitHub/官方训练代码", "medium", "LimX 官方 TRON1 Isaac Lab 外部扩展模板仓库可访问，用于评估 TRON1 人形/双足 RL 训练和仿真到实机链路。");
source("SRC1323", "LimX robot-description GitHub", "https://github.com/limxdynamics/robot-description", "GitHub/官方机器人模型", "medium", "LimX 官方 robot-description 仓库可访问，补充 TRON1、点足/轮足平台 URDF/模型描述和仿真集成来源。");
source("SRC1324", "LimX low-level SDK GitHub", "https://github.com/limxdynamics/pointfoot-sdk-lowlevel", "GitHub/官方SDK", "medium", "LimX low-level SDK 仓库可访问，补充逐际足式平台低层控制接口、实时控制和二次开发入口。");
source("SRC1325", "小米 CyberDog ROS2 GitHub", "https://github.com/MiRoboticsLab/cyberdog_ros2", "GitHub/官方ROS2", "medium", "小米 MiRoboticsLab CyberDog ROS2 仓库可访问，仓库标题说明其为 CyberDog ROS2 packages，补充 CyberDog/CyberDog2 开源生态对照。");
source("SRC1326", "小米 CyberDog workspace GitHub", "https://github.com/MiRoboticsLab/cyberdog_ws", "GitHub/官方工作空间", "medium", "小米 CyberDog workspace 仓库可访问，补充 CyberDog 项目源码组织、构建和开发环境入口。");
source("SRC1327", "小米 CyberDog simulation GitHub", "https://github.com/MiRoboticsLab/cyberdog_sim", "GitHub/官方仿真", "medium", "小米 CyberDog simulation 仓库可访问，补充 CyberDog/CyberDog2 类平台仿真和教学复现实验入口。");
source("SRC1328", "睿尔曼开发者中心", "https://www.realman-robotics.cn/cn/main/developer-center.html", "中文官方开发文档", "high", "睿尔曼开发者中心可访问，集中提供产品手册、技术文档和常见问题，覆盖 RM 机械臂、轮式机器人、单/双臂升降机器人等产品线。");
source("SRC1329", "RealMan ROS GitHub", "https://github.com/RealManRobot/rm_robot", "GitHub/官方ROS", "medium", "睿尔曼官方 rm_robot 仓库可访问，仓库标题说明其为 RealMan 机器人 ROS 支持包。");
source("SRC1330", "RealMan ROS2 GitHub", "https://github.com/RealManRobot/ros2_rm_robot", "GitHub/官方ROS2", "medium", "睿尔曼官方 ros2_rm_robot 仓库可访问，仓库标题说明其为 RealMan 机器人 ROS2 支持包。");
source("SRC1331", "睿尔曼硬件准备入门指南", "https://develop.realman-robotics.com/robot/quickUseManual/", "官方文档/硬件入门", "high", "睿尔曼开发文档的硬件准备入门指南可访问，补充 RM65/RM75/RML63 等机械臂和移动复合平台部署前检查来源。");
source("SRC1332", "Robotnik RB-KAIROS+ 官方产品页", "https://robotnik.eu/products/mobile-manipulators/rb-kairos/", "官网/移动操作平台", "high", "Robotnik RB-KAIROS+ 官方产品页可访问，页面标题标明其为 Pick & Place mobile manipulator，适合核验底盘、UR 机械臂和移动操作定位。");
source("SRC1333", "Robotnik RB-KAIROS common GitHub", "https://github.com/RobotnikAutomation/rbkairos_common", "GitHub/官方ROS", "medium", "RobotnikAutomation rbkairos_common 仓库可访问，补充 RB-KAIROS+ ROS 描述、配置和通用包来源。");
source("SRC1334", "Robotnik RB-KAIROS sim GitHub", "https://github.com/RobotnikAutomation/rbkairos_sim", "GitHub/官方ROS仿真", "medium", "RobotnikAutomation rbkairos_sim 仓库可访问，仓库标题说明其为 RB-Kairos ROS simulation packages，补充仿真评估入口。");
source("SRC1335", "ALOHA Unleashed 项目页", "https://aloha-unleashed.github.io/", "论文/双臂操作项目", "high", "ALOHA Unleashed 项目页可访问，页面标题为 ALOHA Unleashed: A Simple Recipe for Robot Dexterity，补充双臂精细操作、论文和项目入口。");
source("SRC1336", "XLeRobot GitHub", "https://github.com/Vector-Wangel/XLeRobot", "GitHub/低成本移动操作", "medium", "XLeRobot GitHub 仓库可通过 GitHub API 核验，作为 LeRobot 生态下低成本移动操作平台和课程型自研平台的研究线索。");
source("SRC1337", "YOR - Build Your Own Robot 项目页", "https://www.yourownrobot.ai/", "论文/低成本移动操作", "medium", "YOR 项目页可访问，页面标题为 YOR - Build Your Own Robot，适合评估学校自建低成本移动操作平台、教学平台和数据采集平台路线。");
source("SRC1338", "DEXOP 项目页", "https://dex-op.github.io/", "论文/灵巧操作项目", "high", "DEXOP 项目页可访问，页面标题为 DEXOP: A Device for Robotic Transfer of Dexterous Human Manipulation，补充灵巧手/遥操作迁移研究入口。");
source("SRC1339", "FlexiTac 触觉项目页", "https://flexitac.github.io/", "论文/触觉传感项目", "high", "FlexiTac 项目页可访问，页面标题为 FlexiTac: An Open-Source, Scalable Tactile Solution for Robotic Systems，补充触觉传感器和灵巧操作扩展来源。");
source("SRC1340", "Stanford REAL Lab", "https://real.stanford.edu/", "高校实验室/机器人学习", "high", "Stanford Robotics and Embodied Artificial Intelligence Lab 官网可访问，适合持续跟踪 ALOHA、Mobile ALOHA、DROID、机器人学习和移动操作项目。");
source("SRC1341", "CMU LeCAR Lab", "https://lecar-lab.github.io/", "高校实验室/腿足与人形机器人", "high", "CMU LeCAR Lab 官网可访问，适合跟踪腿足机器人、人形机器人、强化学习和 sim-to-real 项目。");
source("SRC1342", "CMU Humanoids@CMU", "http://humanoids.cs.cmu.edu/", "高校实验室/人形机器人", "high", "Humanoids@CMU 页面可访问，适合跟踪高校人形机器人平台、运动控制和具身智能研究项目。");
source("SRC1343", "CMU Intelligent Control Lab", "https://icontrol.ri.cmu.edu/", "高校实验室/机器人控制", "high", "CMU Intelligent Control Lab 官网可访问，补充 Unitree G1 等人形平台在高校控制研究中的入口。");
source("SRC1344", "哈工大机器人技术与系统国家重点实验室", "https://robot.hit.edu.cn/", "中文高校实验室/机器人", "high", "哈尔滨工业大学机器人技术与系统国家重点实验室官网可访问，适合跟踪国内机器人系统、空间机器人、特种机器人和智能装备研究。");
source("SRC1345", "北京大学智能机器人开放实验室", "https://robotics.pkusz.edu.cn/", "中文高校实验室/机器人", "high", "北京大学智能机器人开放实验室官网可访问，补充国内智能机器人、操作、移动和具身智能研究入口。");
source("SRC1346", "Duke General Robotics Lab", "https://www.generalroboticslab.com/", "高校实验室/通用机器人", "high", "Duke General Robotics Lab 官网可访问，页面标题为 General Robotics Lab，适合跟踪移动操作、通用机器人和开放研究项目。");
source("SRC1347", "OpenAlex robot manipulation 检索", "https://openalex.org/works?filter=default.search:robot%20manipulation", "学术数据库/论文检索", "medium", "OpenAlex 检索入口可访问，适合跨出版社追踪机器人操作论文、作者、机构和引用网络。");
source("SRC1348", "DBLP robot manipulation 检索", "https://dblp.org/search?q=robot%20manipulation", "学术数据库/计算机论文检索", "medium", "DBLP robot manipulation 检索页可访问，适合按会议、作者和年份追踪 ICRA/RSS/CoRL 等机器人论文。");
source("SRC1349", "SpringerLink robot manipulation 检索", "https://link.springer.com/search?query=robot+manipulation", "学术数据库/论文检索", "medium", "SpringerLink 检索页可访问，适合补充机器人操作、服务机器人和机械臂系统论文入口。");
source("SRC1350", "AMiner robot manipulation 检索", "https://www.aminer.cn/search/pub?q=robot%20manipulation", "学术数据库/中文可用论文检索", "low", "AMiner 检索页可访问，作为中文环境下追踪机器人操作论文、学者和机构的辅助入口；具体论文需逐篇核验。");
source("SRC1351", "维普网", "https://www.cqvip.com/", "中文论文数据库", "low", "维普网首页可访问，作为中文机器人、机械臂、四足和人形论文的补充检索入口；具体论文和引用平台需后续核验。");
source("SRC1352", "浙江政府采购网", "https://zfcg.czt.zj.gov.cn/", "地方政府采购平台", "high", "浙江政府采购网可访问，用于追踪浙江高校和科研单位机器人、机械臂、具身智能实验平台采购公告与合同。");
source("SRC1353", "广东政府采购网", "https://gdgpo.czt.gd.gov.cn/", "地方政府采购平台", "high", "广东政府采购网可访问，用于追踪广东高校、实验室和政府部门机器人相关采购公告。");
source("SRC1354", "上海市政府采购网", "https://www.zfcg.sh.gov.cn/", "地方政府采购平台", "high", "上海市政府采购网可访问，用于追踪复旦、同济、上海科技大学等本地高校机器人平台采购和合同信息。");
source("SRC1355", "北京市政府采购网", "http://www.ccgp-beijing.gov.cn/", "地方政府采购平台", "high", "北京市政府采购网可访问，用于追踪北京高校、科研院所和机器人创新平台采购公告。");
source("SRC1356", "江苏政府采购网", "http://www.ccgp-jiangsu.gov.cn/", "地方政府采购平台", "high", "江苏政府采购网可访问，用于追踪江苏高校和科研单位机械臂、人形机器人和复合机器人采购。");
source("SRC1357", "竞采星高校竞价网", "https://www.easyjcx.com/", "高校竞价/零星采购平台", "medium", "竞采星首页可访问，页面标题显示覆盖高校竞价、医院竞价、电子招投标和仪器设备采购，适合补充学校零星设备采购线索。");
source("SRC1358", "1688 检索：机械臂", "https://s.1688.com/selloffer/offer_search.htm?keywords=%E6%9C%BA%E6%A2%B0%E8%87%82", "1688渠道线索", "low", "1688 机械臂检索页可访问，仅作为国产低价渠道和配件线索；不能替代官方或授权报价。");
source("SRC1359", "1688 检索：机器狗", "https://s.1688.com/selloffer/offer_search.htm?keywords=%E6%9C%BA%E5%99%A8%E7%8B%97", "1688渠道线索", "low", "1688 机器狗检索页可访问，仅作为渠道和供应商线索；正式采购需核验品牌、授权、参数和售后。");
source("SRC1360", "Alibaba 检索：robot arm", "https://www.alibaba.com/trade/search?SearchText=robot+arm", "跨境电商/渠道线索", "low", "Alibaba robot arm 检索页可访问，用于补充海外低成本机械臂、夹爪和教学套件渠道线索；价格和授权需二次核验。");
source("SRC1361", "Alibaba 检索：quadruped robot", "https://www.alibaba.com/trade/search?SearchText=quadruped+robot", "跨境电商/渠道线索", "low", "Alibaba quadruped robot 检索页可访问，用于补充四足机器人和配件渠道线索；不作为确定报价。");
source("SRC1362", "ros2_control 官方文档", "https://control.ros.org/master/index.html", "官方文档/ROS2控制", "high", "ros2_control 官方文档可访问，适合评估机械臂、移动底盘和复合机器人的控制器、硬件接口和 ROS2 集成能力。");
source("SRC1363", "MoveIt Realtime Servo 文档", "https://moveit.picknik.ai/main/doc/examples/realtime_servo/realtime_servo_tutorial.html", "官方文档/机械臂实时控制", "high", "MoveIt Realtime Servo 文档可访问，补充机械臂遥操作、视觉伺服、实时速度控制和安全控制能力评估入口。");
source("SRC1364", "RoboStack", "https://robostack.github.io/", "开源机器人软件环境", "medium", "RoboStack 官网可访问，适合评估 ROS/机器人软件在 Conda 环境中的可复现安装、教学实验和多平台部署。");
source("SRC1365", "GitHub Topic：mobile-manipulation", "https://github.com/topics/mobile-manipulation", "GitHub/主题检索", "medium", "GitHub mobile-manipulation 主题页可访问，用于持续发现移动操作机器人、轮式底盘加机械臂和移动抓取开源项目。");
source("SRC1366", "GitHub Topic：dexterous-manipulation", "https://github.com/topics/dexterous-manipulation", "GitHub/主题检索", "medium", "GitHub dexterous-manipulation 主题页可访问，用于持续发现灵巧手、触觉、精细操作和遥操作开源项目。");
source("SRC1367", "GitHub Topic：vision-language-action", "https://github.com/topics/vision-language-action", "GitHub/主题检索", "medium", "GitHub vision-language-action 主题页可访问，用于持续追踪 VLA、机器人基础模型和策略部署开源项目。");
source("SRC1368", "GitHub Topic：humanoid-locomotion", "https://github.com/topics/humanoid-locomotion", "GitHub/主题检索", "medium", "GitHub humanoid-locomotion 主题页可访问，用于持续追踪人形机器人运动控制、全身控制和 sim-to-real 开源项目。");
source("SRC1369", "GitHub Topic：legged-locomotion", "https://github.com/topics/legged-locomotion", "GitHub/主题检索", "medium", "GitHub legged-locomotion 主题页可访问，用于持续追踪四足/双足运动控制、强化学习和仿真训练开源项目。");
source("SRC1370", "GitHub Topic：robot-simulation", "https://github.com/topics/robot-simulation", "GitHub/主题检索", "medium", "GitHub robot-simulation 主题页可访问，用于持续发现 Gazebo、MuJoCo、Isaac、Genesis 等仿真训练和数字孪生项目。");
source("SRC1371", "GitHub Topic：ros2-control", "https://github.com/topics/ros2-control", "GitHub/主题检索", "medium", "GitHub ros2-control 主题页可访问，用于持续追踪 ROS2 控制器、硬件接口和机器人驱动项目。");
source("SRC1372", "RobotLAB Higher Ed Robots", "https://www.robotlab.com/higher-ed-robots", "教育渠道/机器人采购", "medium", "RobotLAB Higher Ed Robots 页面可访问，面向高校 STEM 和机器人教学采购，可作为海外教育渠道、价格和服务包对照。");
source("SRC1373", "Robotics @ MIT", "https://robotics.mit.edu/", "高校研究入口/机器人", "high", "Robotics @ MIT 官网可访问，适合跟踪 MIT 机器人实验室、课程、论文和开放项目。");
source("SRC1374", "CMU Robotics Institute", "https://www.ri.cmu.edu/", "高校研究入口/机器人", "high", "CMU Robotics Institute 官网可访问，适合跟踪人形、四足、移动操作、感知和自动化方向的研究项目。");
source("SRC1375", "Stanford AI Lab", "https://ai.stanford.edu/", "高校研究入口/AI与机器人", "high", "Stanford AI Lab 页面可访问，适合跟踪 Stanford 机器人学习、具身智能和 AI/机器人交叉项目。");
source("SRC1376", "BAIR", "https://bair.berkeley.edu/", "高校研究入口/机器人学习", "high", "BAIR 官网可访问，补充 Berkeley 机器人学习、具身智能、基础模型和开源项目长期追踪入口。");
source("SRC1377", "Robohub", "https://robohub.org/", "机器人社区/行业学术资讯", "medium", "Robohub 官网可访问，适合追踪机器人研究、产业应用、访谈和开源社区动态；具体结论需回溯原始来源。");
source("SRC1378", "国家知识产权局", "https://www.cnipa.gov.cn/", "知识产权/专利商标入口", "high", "国家知识产权局官网可访问，用于跟踪机器人厂商专利、商标、知识产权政策和专利检索系统入口。");
source("SRC1379", "中国知识产权资讯网", "https://www.iprchn.com/", "知识产权资讯", "medium", "中国知识产权资讯网可访问，适合补充机器人厂商专利布局、知识产权争议和政策动态线索。");
source("SRC1380", "国家标准化管理委员会", "https://www.sac.gov.cn/", "标准化主管机构", "high", "国家标准化管理委员会官网可访问，用于追踪机器人、智能制造、安全与服务机器人相关国家标准发布和标准化动态。");
source("SRC1381", "全国标准信息公共服务平台", "https://std.samr.gov.cn/", "标准检索/国家标准", "high", "全国标准信息公共服务平台可访问，用于检索 GB/T、行业标准和机器人相关标准文本状态。");
source("SRC1382", "中国合格评定国家认可委员会", "https://www.cnas.org.cn/", "CNAS认可/实验室资质", "high", "CNAS 官网可访问，用于查询机器人检测、校准、计量和第三方实验室认可资质。");
source("SRC1383", "中国质量认证中心", "https://www.cqc.com.cn/", "认证机构/产品认证", "medium", "中国质量认证中心官网可访问，用于核验机器人整机、电气安全、电池、充电器和相关部件认证线索。");
source("SRC1384", "ModelScope 数据集检索：机器人", "https://modelscope.cn/datasets?name=%E6%9C%BA%E5%99%A8%E4%BA%BA", "中文模型/数据集平台", "medium", "ModelScope 数据集检索页可访问，适合发现国内机器人操作、具身智能和多模态数据集来源。");
source("SRC1385", "ModelScope 模型检索：具身智能", "https://modelscope.cn/models?name=%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD", "中文模型/数据集平台", "medium", "ModelScope 模型检索页可访问，适合发现中文具身智能、VLA、导航和机器人基础模型入口。");
source("SRC1386", "Gitee ROS2 仓库检索", "https://gitee.com/search?utf8=%E2%9C%93&q=ros2&type=repository", "Gitee/中文开源检索", "medium", "Gitee ROS2 检索入口可访问，适合补充国内网络环境下 ROS2 驱动、课程代码和国产机器人开源项目线索。");
source("SRC1387", "OSCHINA robot 开源项目检索", "https://www.oschina.net/project/tag/robot", "中文开源社区/项目检索", "low", "开源中国 robot 标签页可访问，作为中文开源机器人项目和工具库辅助检索入口；具体项目需逐项核验。");
source("SRC1388", "B站检索：ROS2 机器人", "https://search.bilibili.com/all?keyword=ROS2%20%E6%9C%BA%E5%99%A8%E4%BA%BA", "中文课程/视频检索", "low", "Bilibili ROS2 机器人检索页可访问，可作为课程、实操视频和教学资料线索；不作为产品参数或报价来源。");
source("SRC1389", "B站检索：具身智能 机器人", "https://search.bilibili.com/all?keyword=%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD%20%E6%9C%BA%E5%99%A8%E4%BA%BA", "中文课程/视频检索", "low", "Bilibili 具身智能机器人检索页可访问，用于追踪中文讲座、厂商演示和课程线索；关键结论需回溯原始来源。");
source("SRC1390", "中国大学 MOOC 机器人课程检索", "https://www.icourse163.org/search.htm?search=%E6%9C%BA%E5%99%A8%E4%BA%BA", "中文课程平台/机器人", "medium", "中国大学 MOOC 机器人课程检索页可访问，适合补充学校教学平台建设时的机器人学、ROS、自动控制课程资源。");
source("SRC1391", "学堂在线机器人课程检索", "https://www.xuetangx.com/search?query=%E6%9C%BA%E5%99%A8%E4%BA%BA", "中文课程平台/机器人", "medium", "学堂在线机器人课程检索页可访问，补充清华等高校课程资源和教学平台配套材料线索。");
source("SRC1392", "MIT OpenCourseWare robotics 检索", "https://ocw.mit.edu/search/?q=robotics", "课程平台/机器人", "medium", "MIT OpenCourseWare robotics 检索页可访问，适合补充机器人学、控制、感知和操作课程公开材料。");
source("SRC1393", "Coursera robotics 检索", "https://www.coursera.org/search?query=robotics", "课程平台/机器人", "low", "Coursera robotics 检索页可访问，可作为机器人课程和证书项目线索；课程质量和内容需逐门核验。");
source("SRC1394", "edX robotics 检索", "https://www.edx.org/search?q=robotics", "课程平台/机器人", "low", "edX robotics 检索页可访问，可作为机器人课程和在线教学资源线索；具体内容需逐门核验。");
source("SRC1395", "A3 Robotics", "https://www.automate.org/robotics", "行业协会/机器人自动化", "high", "Association for Advancing Automation Robotics 页面可访问，适合追踪工业机器人、自动化集成、标准和北美渠道生态。");
source("SRC1396", "IFR Service Robots", "https://ifr.org/service-robots", "产业报告/服务机器人", "high", "International Federation of Robotics 服务机器人页面可访问，补充服务机器人、人形和校园应用市场趋势入口。");
source("SRC1397", "中国数字科技馆机器人检索入口", "https://www.cdstm.cn/", "科普/公众教育入口", "low", "中国数字科技馆可访问，可作为学校展示、科普和公众教育场景的辅助资料入口；不作为采购或参数证据。");
source("SRC1398", "IEEE Xplore 检索：robot manipulation", "https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=robot%20manipulation", "学术数据库/论文检索", "medium", "IEEE Xplore 检索页可访问，用于持续追踪机械臂、移动操作、人形和四足机器人相关 IEEE 论文；具体论文需逐篇核验。");
source("SRC1399", "Nature Search：robotics", "https://www.nature.com/search?q=robotics", "学术数据库/论文检索", "medium", "Nature robotics 检索页可访问，适合补充高影响期刊和综述论文入口；页面检索结果需逐篇核验。");
source("SRC1400", "OpenReview 检索：embodied AI robotics", "https://openreview.net/search?term=embodied%20AI%20robotics", "论文索引/OpenReview", "medium", "OpenReview 检索页可访问，用于追踪 CoRL、ICLR、NeurIPS 等会议中的具身智能、VLA 和机器人学习论文。");
source("SRC1401", "PMLR Proceedings", "https://proceedings.mlr.press/", "会议论文集/机器学习", "medium", "Proceedings of Machine Learning Research 页面可访问，可作为 CoRL、AISTATS 等机器学习和机器人学习会议论文入口。");
source("SRC1402", "CVF Open Access", "https://openaccess.thecvf.com/menu", "会议论文集/视觉机器人", "medium", "CVF Open Access 页面可访问，用于追踪 CVPR/ICCV/ECCV 中的机器人视觉、VLA、具身感知和操作论文。");
source("SRC1403", "IJCAI Proceedings", "https://www.ijcai.org/proceedings/", "会议论文集/人工智能", "medium", "IJCAI Proceedings 页面可访问，可作为机器人规划、具身智能和多智能体方向论文补充入口。");
source("SRC1404", "AAAI Conference", "https://aaai.org/aaai-conference/", "会议论文入口/人工智能", "medium", "AAAI Conference 页面可访问，用于追踪具身智能、机器人推理、规划和服务机器人相关论文。");
source("SRC1405", "arXiv 检索：robot manipulation", "https://arxiv.org/search/cs?query=robot+manipulation&searchtype=all", "论文预印本检索", "medium", "arXiv robot manipulation 检索页可访问，用于持续追踪机械臂操作、遥操作、VLA 和机器人基础模型预印本。");
source("SRC1406", "中国科技论文在线", "https://www.paper.edu.cn/", "中文开放论文平台", "medium", "中国科技论文在线可访问，作为中文机器人、自动化、机械臂和具身智能论文的开放获取入口；具体论文需逐篇核验。");
source("SRC1407", "哈工大机器人技术与系统国家重点实验室", "https://robot.hit.edu.cn/", "高校实验室/机器人系统", "high", "哈尔滨工业大学机器人技术与系统国家重点实验室官网可访问，适合追踪机器人系统、空间机器人、服务机器人和高端装备研究项目。");
source("SRC1408", "清华大学智能产业研究院 AIR", "https://air.tsinghua.edu.cn/", "高校研究机构/AI与机器人", "high", "清华大学智能产业研究院官网可访问，可作为 AI、具身智能、机器人学习和产业化研究项目入口。");
source("SRC1409", "上海交通大学自主机器人实验室", "https://robotics.sjtu.edu.cn/", "高校实验室/自主机器人", "high", "上海交通大学自主机器人实验室官网可访问，适合跟踪自主机器人、移动机器人、机械臂和多机器人系统研究。");
source("SRC1410", "北京大学 EPIC Lab", "https://pku-epic.github.io/", "高校实验室/机器人感知操作", "high", "北京大学 EPIC Lab 页面可访问，适合追踪 DexGraspNet、DexArt、感知操作、灵巧抓取和仿真数据集相关研究。");
source("SRC1411", "Michigan Robotics Research", "https://robotics.umich.edu/research/", "高校研究入口/机器人", "high", "University of Michigan Robotics 研究页可访问，覆盖移动机器人、腿足、操作、自动化和人机交互等方向。");
source("SRC1412", "UW Robot Learning Lab", "https://robotlearning.cs.washington.edu/", "高校实验室/机器人学习", "high", "University of Washington Robot Learning Lab 官网可访问，适合追踪机器人学习、操作、语言条件策略和移动操作项目。");
source("SRC1413", "UC Berkeley Robot Learning Lab", "https://rll.berkeley.edu/", "高校实验室/机器人学习", "high", "UC Berkeley Robot Learning Lab 官网可访问，适合追踪机器人学习、强化学习、操作策略和真实机器人项目。");
source("SRC1414", "UW CSE Robotics", "https://robotics.cs.washington.edu/", "高校实验室/机器人", "high", "University of Washington CSE Robotics 页面可访问，补充移动机器人、操作、感知和机器人系统研究入口。");
source("SRC1415", "LL4MA Lab", "https://robot-learning.cs.utah.edu/", "高校实验室/机器人学习", "high", "Learning for Manipulation and Autonomy Lab 官网可访问，适合追踪机器人操作、移动操作、模仿学习和自主系统研究。");
source("SRC1416", "DexYCB Benchmark", "https://dex-ycb.github.io/", "论文/数据集/灵巧抓取", "high", "DexYCB 项目页可访问，页面标题说明其为手-物体抓取捕捉 Benchmark，适合评估灵巧手、视觉抓取和末端执行器研究生态。");
source("SRC1417", "GenSim2 项目页", "https://gensim2.github.io/", "论文/仿真/数据生成", "high", "GenSim2 项目页可访问，面向多模态和推理 LLM 扩展机器人数据生成，适合学校建设仿真任务生成和数据合成能力。");
source("SRC1418", "BridgeData V2 GitHub", "https://github.com/rail-berkeley/bridge_data_v2", "GitHub/机器人数据集", "medium", "BridgeData V2 仓库可访问，用于核验 Berkeley 真实机器人操作数据集下载、处理和训练入口。");
source("SRC1419", "Language Table GitHub", "https://github.com/google-research/language-table", "GitHub/语言条件操作Benchmark", "medium", "Google Research Language Table 仓库可访问，标题说明其为人类采集数据集和多任务连续控制 Benchmark，适合语言条件桌面操作课程和实验。");
source("SRC1420", "VIMA GitHub", "https://github.com/vimalabs/VIMA", "GitHub/多模态操作Benchmark", "medium", "VIMA 官方仓库可访问，补充多模态提示机器人操作算法、任务和代码复现入口。");
source("SRC1421", "CLIPort GitHub", "https://github.com/cliport/cliport", "GitHub/机器人操作Benchmark", "medium", "CLIPort 官方仓库可访问，补充语言条件桌面操作、what/where pathways 和代码复现入口。");
source("SRC1422", "Tensor2Robot GitHub", "https://github.com/google-research/tensor2robot", "GitHub/大规模机器人学习", "medium", "Tensor2Robot 仓库可访问，标题说明其为大规模机器人研究的分布式机器学习基础设施，可作为多机器人数据训练架构参考。");
source("SRC1423", "Robotics Transformer GitHub", "https://github.com/google-research/robotics_transformer", "GitHub/机器人基础模型", "medium", "Google Research Robotics Transformer 仓库可访问，补充 RT-1/RT 系列机器人基础模型代码和数据处理追踪入口。");
source("SRC1424", "robomimic GitHub", "https://github.com/ARISE-Initiative/robomimic", "GitHub/模仿学习框架", "medium", "robomimic 仓库可访问，标题说明其为机器人示教学习模块化框架，适合机械臂、移动操作和灵巧手示教数据训练。");
source("SRC1425", "MimicGen GitHub", "https://github.com/NVlabs/mimicgen", "GitHub/数据生成/模仿学习", "medium", "MimicGen 仓库可访问，补充示教数据生成、仿真任务和可复现实验代码入口。");
source("SRC1426", "Isaac Lab GitHub", "https://github.com/isaac-sim/IsaacLab", "GitHub/仿真训练平台", "medium", "Isaac Lab 仓库可访问，标题说明其为基于 NVIDIA Isaac Sim 的统一机器人学习框架，适合人形、四足和机械臂统一训练。");
source("SRC1427", "Universal Manipulation Interface GitHub", "https://github.com/real-stanford/universal_manipulation_interface", "GitHub/遥操作/数据采集", "medium", "Universal Manipulation Interface 仓库可访问，补充野外示教、遥操作数据采集和夹爪接口复现入口。");
source("SRC1428", "Scaling Up in Robot Learning GitHub", "https://github.com/real-stanford/scalingup", "GitHub/机器人数据生成", "medium", "Scaling Up in Robot Learning 仓库可访问，补充 CoRL 2023 数据生成与训练代码，适合评估机器人任务扩展和数据合成方法。");
source("SRC1429", "四川政府采购网", "https://www.ccgp-sichuan.gov.cn/", "地方政府采购平台", "high", "四川政府采购网可访问，用于追踪四川高校、职业院校和科研单位机器人、机械臂、实训平台采购公告与合同。");
source("SRC1430", "河南省政府采购网", "https://zfcg.henan.gov.cn/", "地方政府采购平台", "high", "河南省政府采购网可访问，页面标题可核验，用于追踪河南高校机器人、智能制造和具身智能设备采购。");
source("SRC1431", "山东省政府采购信息公开平台", "http://www.ccgp-shandong.gov.cn/", "地方政府采购平台", "high", "山东省政府采购信息公开平台可访问，适合追踪山东高校、实验室和职业院校机器人相关采购公告。");
source("SRC1432", "中国湖北政府采购网", "https://www.ccgp-hubei.gov.cn/", "地方政府采购平台", "high", "中国湖北政府采购网可访问，适合追踪武汉高校、科研单位和实验室机器人采购公告、成交和合同。");
source("SRC1433", "湖南政府采购监管平台", "http://www.ccgp-hunan.gov.cn/", "地方政府采购平台", "high", "湖南政府采购监管平台可访问，用于追踪湖南高校机器人、机械臂、智能制造和自动化实训平台采购。");
source("SRC1434", "陕西省政府采购网", "http://www.ccgp-shaanxi.gov.cn/", "地方政府采购平台", "high", "陕西省政府采购网可访问，适合追踪西安高校具身智能实训系统、人形机器人和四足机器人采购。");
source("SRC1435", "安徽政府采购网", "https://www.ccgp-anhui.gov.cn/", "地方政府采购平台", "high", "安徽政府采购网可访问，用于追踪安徽高校和科研机构机器人、智能制造、自动控制实验平台采购。");
source("SRC1436", "福建省政府采购网", "https://zfcg.czt.fujian.gov.cn/", "地方政府采购平台", "high", "福建省政府采购网可访问，用于追踪福建高校、职业院校和科研单位机器人相关采购公告；页面标题为空但站点响应正常。");
source("SRC1437", "重庆市政府采购网", "https://www.ccgp-chongqing.gov.cn/", "地方政府采购平台", "high", "重庆市政府采购网可访问，用于追踪重庆高校、科研机构和公共部门机器人设备采购。");
source("SRC1438", "天津市政府采购网", "http://www.ccgp-tianjin.gov.cn/", "地方政府采购平台", "high", "天津市政府采购网可访问，用于追踪天津高校和科研单位机械臂、机器狗、人形机器人及实验平台采购。");
source("SRC1439", "河北省政府采购网", "http://www.ccgp-hebei.gov.cn/", "地方政府采购平台", "medium", "河北省政府采购网可访问，页面标题为空但站点响应正常，可作为河北高校机器人采购线索入口。");
source("SRC1440", "辽宁政府采购网", "http://www.ccgp-liaoning.gov.cn/", "地方政府采购平台", "medium", "辽宁政府采购网可访问，页面标题为空但站点响应正常，适合追踪辽宁高校具身智能实验室和机器人平台采购。");
source("SRC1441", "广西政府采购网", "http://www.ccgp-guangxi.gov.cn/", "地方政府采购平台", "high", "广西政府采购网可访问，用于追踪广西高校和职业院校机器人、智能制造和自动化实训采购。");
source("SRC1442", "复旦大学采购与招标管理系统", "https://cz.fudan.edu.cn/", "高校采购/采购中心", "high", "复旦大学采购与招标管理系统可访问，适合追踪智能机器人、人形机器人、机器狗和移动抓取机器人采购公告与合同。");
source("SRC1443", "西安交通大学采购与招标管理办公室", "https://cgb.xjtu.edu.cn/", "高校采购/采购中心", "medium", "西安交通大学采购与招标管理办公室站点可访问；页面标题异常但域名与站点路径匹配，后续具体公告需逐页核验。");
source("SRC1444", "武汉大学采购与招投标管理中心", "https://zb.whu.edu.cn/", "高校采购/采购中心", "high", "武汉大学采购与招投标管理中心可访问，适合追踪机器人、人工智能实验平台和仪器设备采购公告。");
source("SRC1445", "深圳大学招投标管理中心", "https://bidding.szu.edu.cn/", "高校采购/采购中心", "high", "深圳大学招投标管理中心可访问，已出现 G1 EDU 等机器人采购信息，适合持续核验人形与教学机器人价格。");
source("SRC1446", "哈尔滨工业大学采购管理系统", "https://cgzx.hit.edu.cn/", "高校采购/采购中心", "medium", "哈尔滨工业大学采购管理系统可访问，页面标题为空但站点响应正常，适合追踪机器人国家重点实验室相关设备采购。");
source("SRC1447", "华东理工大学采购中心", "https://czzx.ecust.edu.cn/", "高校采购/采购中心", "medium", "华东理工大学采购中心站点可访问，返回华东理工大学页面标题；适合追踪智能无人系统、机器人实训平台和合同公告。");
source("SRC1448", "宇树科技文档中心", "https://support.unitree.com/", "官方文档/支持中心", "high", "宇树科技文档中心可访问，页面标题为宇树科技文档中心，适合集中核验 G1/H1/R1/Go2/B2/A2/Z1 的开发、维护和支持资料。");
source("SRC1449", "AgileX 联系入口", "https://global.agilex.ai/pages/contact-us", "厂商联系/售后", "medium", "AgileX 全球站 Contact Us 页面可访问，用于核验松灵移动底盘、复合平台、代理和售后沟通路径。");
source("SRC1450", "AgileX 支持入口", "https://global.agilex.ai/pages/support", "厂商支持/下载", "medium", "AgileX 全球站 Support 页面可访问，可作为移动底盘资料、下载和售后支持入口；具体文档需逐项核验。");
source("SRC1451", "AgileX LIMO 文档", "https://docs.trossenrobotics.com/agilex_limo_docs/", "官方/渠道文档/移动底盘", "high", "Trossen Robotics 维护的 AgileX LIMO 文档可访问，页面标题标明 AgileX LIMO Documentation，适合核验 LIMO 的部署、ROS 和维护资料。");
source("SRC1452", "UFACTORY 下载中心", "https://www.ufactory.cc/download/", "官方下载/SDK/手册", "high", "UFACTORY Download Center 可访问，适合核验 xArm 软件、固件、手册和二次开发资料。");
source("SRC1453", "UFACTORY 联系入口", "https://www.ufactory.cc/contact-us/", "厂商联系/售后", "high", "UFACTORY Contact Us 页面可访问，适合核验 xArm 正式询价、代理沟通和售后支持路径。");
source("SRC1454", "遨博智能下载中心", "https://download.aubo-robotics.cn/", "官方下载/文档", "high", "遨博智能下载站可访问，适合核验 AUBO 协作机器人软件、手册、驱动和维护资料。");
source("SRC1455", "遨博智能 Docs", "https://docs.aubo-robotics.cn/", "官方文档/协作机器人", "high", "遨博智能 Docs 可访问，适合核验协作臂接口、部署、开发和维护资料。");
source("SRC1456", "睿尔曼官网", "https://www.realman-robotics.cn/", "中文官网/支持入口", "high", "睿尔曼官网可访问，页面标题为睿尔曼智能首页，可作为 RM 系列机械臂、复合平台、联系与服务入口的总来源。");
source("SRC1457", "睿尔曼开发文档", "https://develop.realman-robotics.com/", "官方开发文档/机械臂", "high", "睿尔曼开发文档站可访问，适合核验 RM 系列机械臂、ROS/ROS2、SDK、模型和二次开发资料。");
source("SRC1458", "睿尔曼 GitHub 组织", "https://github.com/RealManRobot", "GitHub/官方SDK", "medium", "RealManRobot GitHub 组织可访问，补充 RM 系列机械臂和移动复合平台的 ROS、ROS2、模型和示例代码来源。");
source("SRC1459", "艾利特机器人官网", "https://www.elibot.com/", "中文官网/服务入口", "high", "艾利特机器人官网可访问，页面标题说明其为复合机器人与协作机器人专家，可作为 EC 系列、复合机器人和服务支持入口。");
source("SRC1460", "艾利特 ES/CS 技术文档", "https://docs.elibot.cn/cs/", "官方技术文档/协作机器人", "high", "艾利特 ES/CS 技术文档可访问，适合核验协作臂快速开始、控制接口、安装调试和维护资料。");
source("SRC1461", "节卡官网支持入口", "https://www.jaka.com/support.html", "官网/支持入口", "medium", "节卡 support.html 可访问并重定向至官网首页，可作为 JAKA 官方支持和联系入口线索；具体资料需从官网导航继续核验。");
source("SRC1462", "傅利叶文档中心", "https://support.fftai.com/", "官方文档/人形机器人", "high", "傅利叶文档中心可访问，页面标题为 Fourier 文档中心，适合核验 GR 系列人形机器人 SDK、介绍文档和维护资料。");
source("SRC1463", "众擎机器人官网", "https://www.engineai.com.cn/", "中文官网/人形机器人", "high", "ENGINEAI 众擎机器人官网可访问，可作为 PM01/SA01 等人形产品、购买入口、服务条款和支持资料总入口。");
source("SRC1464", "众擎 PM01 官方产品页", "https://www.engineai.com.cn/product-pm01.html", "官网/官方规格/支持线索", "high", "众擎 PM01 官方产品页可访问，页面标题标明 PM01 为全开放通用具身智能体，适合核验规格、购买入口和支持路径。");
source("SRC1465", "Booster Robotics 官网", "https://www.booster.tech/", "官网/开发者平台", "high", "Booster Robotics 官网可访问，页面标题强调 Made for Developers，可作为 T1/K1/A1 人形平台、开发者生态和联系入口。");
source("SRC1466", "Hello Robot 联系入口", "https://hello-robot.com/contact/", "厂商联系/售后", "high", "Hello Robot Contact 页面可访问，适合核验 Stretch 正式询价、教育采购、交付和售后沟通路径。");
source("SRC1467", "PAL Robotics Documentation", "https://pal-robotics.com/documentation/", "官方文档/移动操作", "high", "PAL Robotics Documentation 页面可访问，适合核验 TIAGo、移动操作平台、ROS 文档和维护资料。");
source("SRC1468", "Semantic Scholar robotics 检索", "https://www.semanticscholar.org/search?q=robotics&sort=relevance", "学术数据库/论文检索", "medium", "Semantic Scholar robotics 检索页可访问，适合按论文、作者、引用和相关主题持续追踪机器人学术成果；具体论文需逐篇核验。");
source("SRC1469", "DBLP robotics 检索", "https://dblp.org/search?q=robotics", "学术数据库/计算机论文检索", "medium", "DBLP robotics 检索页可访问，适合跟踪 ICRA、IROS、RSS、CoRL、NeurIPS、CVPR 等会议中的机器人论文记录。");
source("SRC1470", "arXiv 检索：embodied AI robotics", "https://arxiv.org/search/cs?query=embodied+AI+robotics&searchtype=all", "论文预印本检索", "medium", "arXiv embodied AI robotics 检索页可访问，用于持续追踪具身智能、VLA、机器人基础模型和移动操作预印本。");
source("SRC1471", "万方检索：机器人", "https://s.wanfangdata.com.cn/paper?q=%E6%9C%BA%E5%99%A8%E4%BA%BA", "中文论文入口/万方", "medium", "万方机器人论文检索页可访问，适合补充中文机械臂、人形、四足和移动操作论文入口；具体论文需逐篇核验。");
source("SRC1472", "自动化学报", "https://www.aas.net.cn/", "中文期刊/自动化与机器人", "high", "自动化学报官网可访问，适合作为中文自动化、机器人控制、感知和智能系统论文来源入口。");
source("SRC1473", "机械工程学报", "http://www.cjmenet.com.cn/", "中文期刊/机械工程与机器人", "medium", "机械工程学报站点可访问，可作为机械臂、机构设计、机器人系统与工程应用论文入口；页面标题为空，具体论文需逐项核验。");
source("SRC1474", "中国机械工程", "https://www.cmemo.org.cn/", "中文期刊/机械工程与机器人", "medium", "中国机械工程站点可访问，可作为机械臂、移动机器人、智能制造和机器人系统工程中文论文入口；具体论文需逐项核验。");
source("SRC1475", "Papers With Code robotics 数据集检索", "https://paperswithcode.com/datasets?query=robotics", "学术榜单/数据集检索", "low", "Papers With Code robotics 数据集检索入口用于发现论文、代码和数据集关联；后台请求超时，需用浏览器复核具体页面后再作高置信引用。");
source("SRC1476", "Papers With Code robot navigation 任务", "https://paperswithcode.com/task/robot-navigation", "学术榜单/机器人任务", "low", "Papers With Code robot navigation 任务入口用于持续追踪导航 Benchmark、论文和代码；后台请求超时，具体榜单需浏览器复核。");
source("SRC1477", "Hugging Face 机器人数据集检索", "https://huggingface.co/datasets?search=robot", "模型/数据集平台", "low", "Hugging Face robot 数据集检索入口用于发现 LeRobot、DROID、Open X、RoboVQA 等机器人数据资产；后台请求超时，具体数据集需逐项复核。");
source("SRC1478", "Hugging Face robotics 模型检索", "https://huggingface.co/models?search=robotics", "模型/数据集平台", "low", "Hugging Face robotics 模型检索入口用于追踪机器人基础模型、VLA 和策略模型；后台请求超时，具体模型需逐项复核。");
source("SRC1479", "Hugging Face LeRobot 组织页", "https://huggingface.co/lerobot", "模型/数据集平台/机器人学习", "low", "Hugging Face LeRobot 组织入口用于追踪机器人学习模型、数据集和社区资源；后台请求超时，需浏览器或官方文档逐项复核。");
source("SRC1480", "LeRobot Dataset V3 文档", "https://huggingface.co/docs/lerobot/lerobot-dataset-v3", "官方文档/机器人数据格式", "low", "LeRobot Dataset V3 文档入口用于评估学校采集数据、训练策略和复现实验的数据格式；后台请求超时，需浏览器核验当前文档内容。");
source("SRC1481", "OpenDataLab 开放数据平台", "https://opendatalab.com/", "中文数据平台/学术数据", "high", "OpenDataLab 平台可访问，页面标题说明其为开放数据平台，适合持续查找具身智能、视觉、机器人和多模态数据集。");
source("SRC1482", "OpenXLab 数据集入口", "https://openxlab.org.cn/datasets", "中文数据平台/模型数据", "medium", "OpenXLab 数据集入口可访问并返回 OpenDataLab 页面标题，适合追踪中文模型、数据集和具身智能开放资源。");
source("SRC1483", "Stanford AI Lab / Robotics", "https://robotics.stanford.edu/", "高校研究入口/机器人", "high", "Stanford robotics.stanford.edu 可访问并跳转至 Stanford AI Lab，可作为 Stanford 机器人、感知、操作和具身智能研究入口。");
source("SRC1484", "Stanford IRIS Research Group", "https://irislab.stanford.edu/", "高校实验室/机器人与交互", "high", "Stanford IRIS Research Group 页面可访问，适合追踪人机交互、可穿戴/遥操作、机器人学习和移动操作研究项目。");
source("SRC1485", "CMU Robotics Institute Research Overview", "https://www.ri.cmu.edu/research/", "高校研究入口/机器人", "high", "CMU Robotics Institute Research Overview 可访问，适合持续追踪机器人感知、运动、操作、人形和系统研究项目。");
source("SRC1486", "MIT Improbable AI GitHub 组织", "https://github.com/Improbable-AI", "GitHub/实验室项目", "medium", "MIT Improbable AI GitHub 组织可访问，集中收录四足运动、人形/腿足控制和机器人学习项目，适合 Unitree/四足平台科研生态追踪。");
source("SRC1487", "中国科学院自动化研究所", "http://www.ia.cas.cn/", "中文研究机构/自动化与机器人", "high", "中国科学院自动化研究所官网可访问，适合追踪智能系统、机器人感知、模式识别和具身智能相关研究项目。");
source("SRC1488", "中国科学院沈阳自动化研究所", "http://www.sia.cas.cn/", "中文研究机构/机器人", "high", "中国科学院沈阳自动化研究所官网可访问，适合追踪机器人系统、特种机器人、工业机器人和智能装备研究。");
source("SRC1489", "浙江大学控制科学与工程学院", "http://www.cse.zju.edu.cn/", "中文高校/控制与机器人", "high", "浙江大学控制科学与工程学院官网可访问，适合追踪控制、机器人、智能系统和自动化相关研究方向。");
source("SRC1490", "ALFRED Benchmark", "https://askforalfred.com/", "Benchmark/具身任务", "high", "ALFRED 项目页可访问，面向日常任务的 grounded instruction Benchmark，适合移动操作、服务机器人和人形平台高层任务评估。");
source("SRC1491", "TEACh Benchmark", "https://teachingalfred.github.io/", "Benchmark/具身交互任务", "high", "TEACh 项目页可访问，面向交互式对话和家庭任务完成，适合服务机器人、人形和移动操作平台的高层任务评估。");
source("SRC1492", "TEACh GitHub", "https://github.com/alexa/teach", "GitHub/具身任务数据集", "medium", "TEACh GitHub 仓库可访问，标题说明其为模拟家庭任务的人-人交互对话数据集，可作为具身任务复现实验入口。");
source("SRC1493", "Objaverse", "https://objaverse.allenai.org/", "数据集/3D资产", "medium", "Objaverse 页面可访问，可作为仿真训练、物体识别、抓取和具身交互任务的 3D 资产来源；不作为机器人硬件证据。");
source("SRC1494", "RLDS GitHub", "https://github.com/google-research/rlds", "GitHub/机器人数据格式", "medium", "Google Research RLDS 仓库可访问，补充机器人学习数据集通用格式和轨迹数据管理入口，适合学校统一采集与训练数据治理。");
source("SRC1495", "山西政府采购网", "http://www.ccgp-shanxi.gov.cn/", "地方政府采购平台", "high", "山西政府采购网可访问，页面标题可核验，适合追踪山西高校和科研单位机器人、智能制造、机械臂和实验平台采购公告。");
source("SRC1496", "内蒙古政府采购网", "https://www.ccgp-neimenggu.gov.cn/", "地方政府采购平台", "medium", "内蒙古政府采购网可访问，页面标题为空但站点响应正常，可作为内蒙古高校和公共机构机器人采购线索入口。");
source("SRC1497", "甘肃政府采购网", "https://www.ccgp-gansu.gov.cn/", "地方政府采购平台", "medium", "甘肃政府采购网可访问，页面标题为空但站点响应正常，可作为甘肃高校和科研单位机器人、自动化和实训设备采购线索入口。");
source("SRC1498", "新疆政府采购网", "http://www.ccgp-xinjiang.gov.cn/", "地方政府采购平台", "high", "新疆政府采购网可访问，页面标题可核验，适合追踪新疆高校、职业院校和公共部门机器人设备采购。");
source("SRC1499", "宁夏政府采购网", "https://www.ccgp-ningxia.gov.cn/", "地方政府采购平台", "high", "宁夏回族自治区政府采购网可访问，适合追踪宁夏高校和职业院校机器人、机械臂与智能制造实训设备采购。");
source("SRC1500", "青海省政府采购网", "http://www.ccgp-qinghai.gov.cn/", "地方政府采购平台", "high", "青海省政府采购网可访问，页面标题可核验，适合追踪青海高校和公共机构机器人、无人系统和实验设备采购。");
source("SRC1501", "黑龙江政府采购网", "https://hljcg.hlj.gov.cn/", "地方政府采购平台", "medium", "黑龙江政府采购网可访问，页面标题为空但站点响应正常，适合追踪哈尔滨及黑龙江高校机器人平台采购。");
source("SRC1502", "吉林省政府采购网", "http://www.ccgp-jilin.gov.cn/", "地方政府采购平台", "high", "吉林省政府采购网可访问，页面标题可核验，适合追踪吉林高校和科研单位机器人、自动化与智能制造采购。");
source("SRC1503", "西藏采购网", "http://www.ccgp-xizang.gov.cn/", "地方政府采购平台", "high", "西藏采购网可访问，页面标题可核验，可作为西藏地区高校和公共机构机器人/实验设备采购线索入口。");
source("SRC1504", "中山大学政府采购与招投标管理中心", "https://bidding.sysu.edu.cn/", "高校采购/采购中心", "high", "中山大学政府采购与招投标管理中心可访问，适合追踪机器人、AI 实验平台、智能制造和具身智能相关采购。");
source("SRC1505", "东南大学招标办公室", "https://zbb.seu.edu.cn/", "高校采购/招标中心", "medium", "东南大学招标办公室站点可访问，页面标题为电子评标系统，可作为东南大学机器人、机械臂和智能系统采购公告追踪入口。");
source("SRC1506", "百度爱采购检索：机械臂", "https://b2b.baidu.com/s?q=%E6%9C%BA%E6%A2%B0%E8%87%82", "百度爱采购/渠道线索", "low", "百度爱采购机械臂检索页可访问，页面标题显示批发价格和优质货源；仅作供应商发现和报价线索，不作为确定报价。");
source("SRC1507", "百度爱采购检索：机器狗", "https://b2b.baidu.com/s?q=%E6%9C%BA%E5%99%A8%E7%8B%97", "百度爱采购/渠道线索", "low", "百度爱采购机器狗检索页可访问，适合作为四足机器人供应商和价格线索；正式采购需核验品牌授权、参数和售后。");
source("SRC1508", "百度爱采购检索：人形机器人", "https://b2b.baidu.com/s?q=%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA", "百度爱采购/渠道线索", "low", "百度爱采购人形机器人检索页可访问，仅作为人形机器人供应商和低价渠道线索，不作为确定报价或授权证明。");
source("SRC1509", "百度爱采购检索：协作机器人", "https://b2b.baidu.com/s?q=%E5%8D%8F%E4%BD%9C%E6%9C%BA%E5%99%A8%E4%BA%BA", "百度爱采购/渠道线索", "low", "百度爱采购协作机器人检索页可访问，可补充国产协作臂供应商、系统集成商和配件渠道线索。");
source("SRC1510", "百度爱采购检索：灵巧手", "https://b2b.baidu.com/s?q=%E7%81%B5%E5%B7%A7%E6%89%8B", "百度爱采购/末端执行器线索", "low", "百度爱采购灵巧手检索页可访问，可作为机械臂末端执行器、灵巧手和夹爪供应商发现入口。");
source("SRC1511", "Made-in-China Robot Arm", "https://www.made-in-china.com/products-search/hot-china-products/Robot_Arm.html", "跨境B2B/渠道线索", "low", "Made-in-China Robot Arm 页面可访问，标题显示中国机器人臂批发、制造商和价格入口，仅作跨境供应商发现线索。");
source("SRC1512", "Made-in-China Quadruped Robot", "https://www.made-in-china.com/products-search/hot-china-products/Quadruped_Robot.html", "跨境B2B/渠道线索", "low", "Made-in-China Quadruped Robot 页面可访问，标题显示四足机器人批发、制造商和价格入口，仅作跨境供应商发现线索。");
source("SRC1513", "OFweek 机器人网", "https://robot.ofweek.com/", "行业媒体/机器人产业", "medium", "OFweek 机器人网可访问，适合追踪工业机器人、协作机器人、人形和服务机器人产业动态；页面编码异常但站点响应正常。");
source("SRC1514", "机器人在线", "https://www.imrobotic.com/", "行业平台/工业机器人", "medium", "机器人在线可访问，页面标题说明其为国内工业机器人服务平台，可作为工业机器人、协作臂和系统集成供应商线索入口。");
source("SRC1515", "中国机械工业联合会机经网", "https://www.mei.net.cn/", "行业协会/机械工业", "medium", "中国机械工业联合会机经网可访问，可作为机器人、智能制造、机械工业政策、统计和行业趋势辅助来源。");
source("SRC1516", "柳州职业技术大学具身智能机器人应用技术中心中标公告", "https://www.lzpu.edu.cn/tzgg/content_101451", "高校采购/中标公告", "high", "柳州职业技术大学具身智能机器人应用技术中心（一期）设备采购中标结果公告可访问，补充职业院校具身智能中心建设、设备采购和落地教学场景来源。");
source("SRC1517", "长沙理工大学工业具身机器人感知与控制平台中标公告", "https://www.csust.edu.cn/zcglc/info/1082/5186.htm", "高校采购/中标公告", "high", "长沙理工大学 2025 年央财专项工业具身机器人感知与控制平台中标（成交）公告可访问，补充工业具身机器人平台采购来源。");
source("SRC1518", "郑州大学具身智能与人形机器人概念验证中心中标公告", "https://www7.zzu.edu.cn/ztb/info/1127/19217.htm", "高校采购/中标公告", "high", "郑州大学计算机与人工智能学院、软件学院具身智能与人形机器人概念验证中心采购项目中标公告可访问，采购内容含工业型/服务型具身智能验证平台和编程平台。");
source("SRC1519", "台州具身智能机器人概念验证中心中标候选公告", "https://www.tzpre.com/index.php/cms/item-view-id-42440.shtml", "产业平台采购/中标候选", "medium", "台州市产权交易所具身智能机器人概念验证中心（一期）机器人及相关设备采购中标候选人公告可访问，补充城市级具身智能验证中心采购来源。");
source("SRC1520", "河南科技大学具身智能算法研究算力平台中标公告", "https://cwyzcglb.haust.edu.cn/info/1461/32571.htm", "高校采购/算力平台", "high", "河南科技大学具身智能算法研究算力平台中标（成交）公告可访问，补充具身智能算法训练、仿真和数据处理配套算力采购来源。");
source("SRC1521", "哈工大苏州研究院具身智能训练场多负载机器人平台中标公告", "https://sri.hit.edu.cn/2025/0522/c17773a370658/page.htm", "科研机构采购/中标公告", "high", "哈工大苏州研究院具身智能训练场多负载机器人平台中标公告可访问，中标金额 394 万元，主要标的含宇树/定制人形机器人和 H1-2 等训练场设备。");
source("SRC1522", "浙江理工大学人形机器人系统中标结果公告", "https://www.cnbiding.com.cn/news/0830833211599.html", "高校采购/中标公告", "medium", "浙江理工大学人形机器人系统中标结果公告可访问，页面列中标金额 206.3 万元、供应商宇树科技、规格型号 G1 EDU 旗舰版；第三方招标平台转载，需以校方/政府采购原文复核。");
source("SRC1523", "河南科技大学人形机器人控制研究平台中标公告", "https://cwyzcglb.haust.edu.cn/info/1461/34271.htm", "高校采购/成交公告", "high", "河南科技大学人形机器人控制研究平台中标（成交）公告可访问，成交金额 26.85 万元，补充中低价人形控制研究平台采购线索。");
source("SRC1524", "哈工大苏州研究院 40 自由度全尺寸人形机器人采购公告", "https://sri.hit.edu.cn/2025/0430/c17773a368028/page.htm", "科研机构采购/采购公告", "high", "哈工大苏州研究院 40 自由度全尺寸人形机器人快速采购公告可访问，预算 98 万元、数量 1 套、交付期 10 个工作日且不接受进口产品。");
source("SRC1525", "深圳大学人形机器人中标结果公告", "https://bidding.szu.edu.cn/info/1024/39589.htm", "高校采购/中标公告", "high", "深圳大学 SZUCG20250468EQ 人形机器人中标（成交）结果公告可访问，页面列投标报价和人形机器人采购项目，可作为中型/教学人形平台价格对照。");
source("SRC1526", "徐州工程学院人形机器人采购评审结果", "https://zbb.xzit.edu.cn/02/57/c3766a197207/pagem.htm", "高校采购/评审结果", "high", "徐州工程学院人形机器人采购评审结果公示可访问，拟中标价 16.36 万元，补充入门级人形机器人学校采购价格线索。");
source("SRC1527", "浙大城市学院中型人形机器人与四足机器狗采购成交公告", "https://www.hzcu.edu.cn/info/1132/35013.htm", "高校采购/成交公告", "high", "浙大城市学院中型人形机器人（开发版）、四足机器狗增强版和四足机器狗采购项目成交公告可访问，补充人形、四足和移动抓取四足平台同项目采购来源。");
source("SRC1528", "河南科技大学全尺寸双足人形机器人与仿生灵巧手成交公告", "https://cwyzcglb.haust.edu.cn/info/1451/36541.htm", "高校采购/成交公告", "high", "河南科技大学全尺寸双足人形机器人与仿生灵巧手采购项目成交公告可访问，成交金额 84.55 万元，补充人形机器人和仿生灵巧手组合采购线索。");

const robots = [];

function robot(item) {
  const defaults = {
    country: "中国",
    domesticPriority: true,
    specs: {
      dof: "需按配置确认",
      payloadKg: "需按配置确认",
      reachM: "需按配置确认",
      repeatabilityMm: "需按配置确认",
      speed: "需按配置确认",
      endurance: "需按配置确认",
      weightKg: "需按配置确认",
      sensors: "按版本配置",
      compute: "按版本配置",
      safety: "需按部署方案确认"
    },
    software: {
      ros: "需核验",
      ros2: "需核验",
      sdk: "厂商 SDK/接口需确认",
      sim: "需核验"
    },
    researchEvidence: ["具备二次开发或课程实验潜力，需按具体课题核验。"],
    deploymentEvidence: ["有厂商或渠道可采购/询价，适合进入采购咨询池。"],
    risks: ["公开资料不完整，采购前需让厂商提供正式规格书和报价单。"],
    shortlistTags: [],
    purchaseChannels: ["官网询价"],
    originalPrice: null,
    image: categoryImages[item.category],
    lastChecked: accessedDate
  };
  const merged = { ...defaults, ...item };
  merged.specs = { ...defaults.specs, ...(item.specs || {}) };
  merged.software = { ...defaults.software, ...(item.software || {}) };
  const priceConfidence = item.priceConfidence || (item.cnyAmount ? "medium" : "low");
  merged.price = {
    label: item.cnyAmount ? `人民币 ${formatCny(item.cnyAmount)}${item.priceSuffix || ""}` : (item.priceLabel || "需询价"),
    amount: item.cnyAmount ?? null,
    currency: "CNY",
    range: item.cnyRange || (item.cnyAmount ? `${formatCny(item.cnyAmount)} 起` : "需询价"),
    type: item.priceType || (item.cnyAmount ? "公开起售价/估算人民币" : "需询价"),
    confidence: priceConfidence,
    sourceIds: item.priceSourceIds || item.sourceIds.slice(0, 1),
    original: item.originalPrice || null
  };
  merged.sourceIds = Array.from(new Set([...(item.sourceIds || []), ...merged.price.sourceIds]));
  for (const id of merged.sourceIds) {
    if (!sourceIndex.has(id)) {
      throw new Error(`${merged.id} references missing source ${id}`);
    }
  }
  robots.push(merged);
}

function usd(value) {
  return Math.round(value * fx.USD / 100) * 100;
}

function eur(value) {
  return Math.round(value * fx.EUR / 100) * 100;
}

function aud(value) {
  return Math.round(value * fx.AUD / 100) * 100;
}

function formatCny(value) {
  if (value >= 10000) {
    return `¥${(value / 10000).toFixed(value % 10000 === 0 ? 0 : 1)}万`;
  }
  return `¥${value.toLocaleString("zh-CN")}`;
}

// 机械臂
robot({
  id: "unitree-z1",
  name: "Unitree Z1 / Z1 Pro",
  vendor: "宇树科技 Unitree",
  category: "机械臂",
  formFactor: "轻量 6 轴机械臂",
  officialUrl: "https://www.unitree.com/cn/z1/",
  cnyAmount: aud(7000),
  cnyRange: "约 ¥3.3 万起，按海外渠道 Z1 标准版 7,000 澳元估算；国内需宇树正式报价",
  originalPrice: "Robots-Australia Unitree Z1 页面列 Z1 AUD 7,000、Z1 Pro AUD 8,700，按 2026-06-01 估算汇率 1 AUD≈¥4.75；国内学校采购需向宇树或代理核验。",
  priceType: "代理渠道澳元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC726"],
  sourceIds: ["SRC008", "SRC009", "SRC010"],
  specs: { dof: "6 轴", payloadKg: "约 2-3 kg 级，按 Z1/Z1 Pro 确认", reachM: "约 0.74 m 级", repeatabilityMm: "需按版本确认", weightKg: "约 4.3 kg 起" },
  software: { ros: "可通过 Unitree 生态/社区接入", ros2: "Unitree ROS2 生态可用", sdk: "Unitree SDK", sim: "MuJoCo/Gazebo/Isaac 社区方案" },
  researchEvidence: ["常与宇树四足平台组合做移动操作、遥操作和强化学习。"],
  deploymentEvidence: ["国内采购与宇树四足生态配套便利，适合轻量末端操作。"],
  risks: ["公开价格缺失；与第三方底盘组合需确认机械、电源和控制接口。"],
  scores: { research: 39, deployment: 38, overall: 77 },
  shortlistTags: ["科研平台", "高性价比组合"],
  purchaseChannels: ["宇树官网询价", "京东/淘宝渠道线索需复核"]
});

robot({
  id: "mycobot-280",
  name: "myCobot 280",
  vendor: "大象机器人 Elephant Robotics",
  category: "机械臂",
  formFactor: "桌面 6 轴教学机械臂",
  officialUrl: "https://www.elephantrobotics.com/en/mycobot-280/",
  cnyAmount: usd(699),
  cnyRange: "约 ¥5,100 起，按官方美元价估算",
  originalPrice: "USD 699 起，按 2026-05-31 估算汇率 1 USD≈¥7.25",
  priceConfidence: "medium",
  priceSourceIds: ["SRC031"],
  sourceIds: ["SRC030", "SRC031", "SRC032", "SRC033", "SRC070", "SRC073"],
  specs: { dof: "6 轴", payloadKg: "约 0.25 kg", reachM: "约 0.28 m", repeatabilityMm: "约 ±0.5 mm 级", weightKg: "约 0.85 kg" },
  software: { ros: "官方/社区 ROS 支持", ros2: "社区支持", sdk: "pymycobot / Python / Arduino", sim: "MoveIt/Gazebo 社区方案" },
  researchEvidence: ["轻量、低成本，适合课程、视觉抓取入门和机器人学习样机。"],
  deploymentEvidence: ["适合教学演示，不适合工业负载和高精度生产。"],
  risks: ["负载和刚性有限；价格为外币估算，国内采购需核对授权渠道。"],
  scores: { research: 36, deployment: 32, overall: 68 },
  shortlistTags: ["教学平台", "高性价比组合"],
  purchaseChannels: ["官方商店", "京东/淘宝官方或授权渠道待复核"]
});

robot({
  id: "mycobot-320",
  name: "myCobot 320",
  vendor: "大象机器人 Elephant Robotics",
  category: "机械臂",
  formFactor: "桌面/轻量科研机械臂",
  officialUrl: "https://www.elephantrobotics.com/en/mycobot-320/",
  cnyAmount: usd(2499),
  cnyRange: "约 ¥18,100，按官方商城 myCobot 320 Pi 2022 USD 2,499 估算",
  originalPrice: "Elephant Robotics 官方商城 myCobot 320 Pi 2022 页面列 Regular price USD 2,499，按 2026-06-01 估算汇率 1 USD≈¥7.25；美国区页面有 USD 2,379 促销价，国内学校采购需核验税费、运费和授权渠道。",
  priceType: "官方商城美元价估算",
  priceConfidence: "high",
  priceSourceIds: ["SRC1180"],
  sourceIds: ["SRC031", "SRC032", "SRC033", "SRC070"],
  specs: { dof: "6 轴", payloadKg: "约 1 kg 级", reachM: "约 0.32 m", repeatabilityMm: "约 ±0.5 mm 级" },
  software: { ros: "官方/社区 ROS 支持", ros2: "社区支持", sdk: "pymycobot", sim: "MoveIt/Gazebo 社区方案" },
  researchEvidence: ["比 280 负载更高，适合轻量抓取、视觉控制和课程综合实验。"],
  deploymentEvidence: ["国内渠道较多，采购门槛低。"],
  risks: ["价格需授权渠道复核；不适合高刚性工业操作。"],
  scores: { research: 37, deployment: 34, overall: 71 },
  shortlistTags: ["教学平台"],
  purchaseChannels: ["官方商店", "京东/淘宝渠道待复核"]
});

robot({
  id: "ufactory-xarm-6",
  name: "xArm 6",
  vendor: "UFACTORY",
  category: "机械臂",
  formFactor: "6 轴协作机械臂",
  officialUrl: "https://www.ufactory.cc/xarm-collaborative-robot/",
  cnyAmount: usd(4999),
  cnyRange: "约 ¥36,200 起，按官方商店美元价估算",
  originalPrice: "USD 4999 级公开价线索，需按官方商店实时页核验",
  priceConfidence: "medium",
  priceSourceIds: ["SRC019"],
  sourceIds: ["SRC018", "SRC019", "SRC020", "SRC021"],
  specs: { dof: "6 轴", payloadKg: "5 kg", reachM: "约 0.70 m", repeatabilityMm: "约 ±0.1 mm", weightKg: "约 12 kg" },
  software: { ros: "官方 ROS 支持", ros2: "官方 ROS2 支持", sdk: "Python/C++/ROS SDK", sim: "MoveIt/Gazebo/Isaac 社区方案" },
  researchEvidence: ["在 Mobile ALOHA、低成本操作和机器人学习项目中出现频率高。"],
  deploymentEvidence: ["性价比较高，适合实验室操作研究和轻量落地样机。"],
  risks: ["人民币价需按中国渠道复核；安全认证和维保需采购前确认。"],
  scores: { research: 44, deployment: 40, overall: 84 },
  shortlistTags: ["科研平台", "落地项目", "高性价比组合"],
  purchaseChannels: ["官方商店", "国内代理/授权渠道询价"]
});

robot({
  id: "ufactory-xarm-7",
  name: "xArm 7",
  vendor: "UFACTORY",
  category: "机械臂",
  formFactor: "7 轴协作机械臂",
  officialUrl: "https://www.ufactory.cc/xarm-collaborative-robot/",
  cnyAmount: usd(6999),
  cnyRange: "约 ¥50,700 起，按官方商店美元价估算",
  originalPrice: "USD 6999 级公开价线索，需按官方商店实时页核验",
  priceConfidence: "medium",
  priceSourceIds: ["SRC019"],
  sourceIds: ["SRC018", "SRC019", "SRC020", "SRC021"],
  specs: { dof: "7 轴", payloadKg: "3.5 kg", reachM: "约 0.70 m", repeatabilityMm: "约 ±0.1 mm" },
  software: { ros: "官方 ROS 支持", ros2: "官方 ROS2 支持", sdk: "Python/C++/ROS SDK", sim: "MoveIt/Gazebo/Isaac 社区方案" },
  researchEvidence: ["冗余自由度适合灵巧操作、避障和模仿学习。"],
  deploymentEvidence: ["适合轻量操作、移动操作和教学科研共用。"],
  risks: ["对安全围栏、末端执行器和售后配置要单独报价。"],
  scores: { research: 45, deployment: 39, overall: 84 },
  shortlistTags: ["科研平台", "高性价比组合"],
  purchaseChannels: ["官方商店", "国内代理/授权渠道询价"]
});

robot({
  id: "dobot-cr5",
  name: "DOBOT CR5",
  vendor: "越疆 DOBOT",
  category: "机械臂",
  formFactor: "6 轴协作机械臂",
  officialUrl: "https://www.dobot-robots.com/products/cr-series/cr5.html",
  cnyAmount: usd(22980),
  cnyRange: "约 ¥16.7 万，按海外代理 CR5 Research 公开价估算；国内需越疆正式报价",
  originalPrice: "RobotLAB DOBOT CR5 Research 页面列 Buy Now Price USD 22,980，按 2026-06-01 估算汇率 1 USD≈¥7.25；国内教育价和配置需向越疆或授权代理核验。",
  priceType: "代理渠道美元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC708"],
  sourceIds: ["SRC022", "SRC024"],
  specs: { dof: "6 轴", payloadKg: "5 kg", reachM: "约 0.90 m", repeatabilityMm: "约 ±0.02 mm" },
  software: { ros: "有 ROS/SDK 生态", ros2: "需按型号确认", sdk: "Dobot SDK/API", sim: "DobotStudio/第三方仿真" },
  researchEvidence: ["国内协作臂常见，适合抓取、装配和教学实验。"],
  deploymentEvidence: ["国内售后和行业案例较多，落地项目适配好。"],
  risks: ["公开价格少，需正式报价和教育折扣确认。"],
  scores: { research: 37, deployment: 43, overall: 80 },
  shortlistTags: ["落地项目", "教学平台"],
  purchaseChannels: ["越疆官网询价", "授权代理"]
});

robot({
  id: "dobot-mg400",
  name: "DOBOT MG400",
  vendor: "越疆 DOBOT",
  category: "机械臂",
  formFactor: "桌面工业机械臂",
  officialUrl: "https://www.dobot-robots.com/products/desktop-robots/mg400.html",
  cnyAmount: usd(3780),
  cnyRange: "约 ¥2.7 万，按 RobotShop 海外渠道价估算；国内需授权渠道复核",
  originalPrice: "RobotShop DOBOT MG400 商品页列 USD 3,780，按 2026-06-01 估算汇率 1 USD≈¥7.25；不含国内税费、运保和教育折扣。",
  priceType: "代理渠道美元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC707"],
  sourceIds: ["SRC023", "SRC024"],
  specs: { dof: "4 轴", payloadKg: "0.5 kg", reachM: "约 0.44 m", repeatabilityMm: "约 ±0.05 mm" },
  software: { ros: "社区/SDK 可接入", ros2: "需核验", sdk: "DobotStudio / TCP-IP / SDK", sim: "官方软件和第三方方案" },
  researchEvidence: ["适合桌面自动化、视觉分拣和课程实验。"],
  deploymentEvidence: ["小型落地项目部署成本较低。"],
  risks: ["自由度有限，不适合复杂 6D 操作研究。"],
  scores: { research: 31, deployment: 39, overall: 70 },
  shortlistTags: ["教学平台", "落地项目"],
  purchaseChannels: ["越疆官网询价", "授权代理"]
});

robot({
  id: "aubo-i5",
  name: "AUBO i5",
  vendor: "遨博 AUBO",
  category: "机械臂",
  formFactor: "6 轴协作机械臂",
  officialUrl: "https://www.aubo-robotics.cn/",
  cnyAmount: eur(16490),
  cnyRange: "约 ¥12.9 万，按海外代理 16,490 欧元估算；国内正式价需询价",
  originalPrice: "AUBO 捷克渠道页列 AUBO i5 EUR 16,490，按 2026-06-01 估算汇率 1 EUR≈¥7.85；国内采购价需向遨博或授权代理核验。",
  priceType: "代理渠道欧元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC714"],
  sourceIds: ["SRC025"],
  specs: { dof: "6 轴", payloadKg: "5 kg", reachM: "约 0.89 m", repeatabilityMm: "约 ±0.02 mm" },
  software: { ros: "有 ROS 生态线索", ros2: "需核验", sdk: "厂商 SDK/API", sim: "需核验" },
  researchEvidence: ["国产协作臂代表，适合工业操作、课程和产教融合。"],
  deploymentEvidence: ["国内交付与服务便利，适合落地样线。"],
  risks: ["科研开源生态弱于 xArm/UR/Franka，采购前需确认接口开放度。"],
  scores: { research: 34, deployment: 42, overall: 76 },
  shortlistTags: ["落地项目"],
  purchaseChannels: ["官网询价", "授权代理"]
});

robot({
  id: "elite-ec66",
  name: "Elite EC66",
  vendor: "艾利特 Elite Robots",
  category: "机械臂",
  formFactor: "6 轴协作机械臂",
  officialUrl: "https://www.elibot.cn/",
  cnyAmount: eur(16875),
  cnyRange: "约 ¥13.3 万，按海外代理 16,875 欧元未税价估算；国内需询价",
  originalPrice: "Unchained Robotics Elite EC66 页面列 EUR 16,875 未税，按 2026-06-01 估算汇率 1 EUR≈¥7.85；国内教育价和配置需向艾利特或授权代理确认。",
  priceType: "代理渠道欧元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC716"],
  sourceIds: ["SRC026"],
  specs: { dof: "6 轴", payloadKg: "6 kg", reachM: "约 0.91 m", repeatabilityMm: "约 ±0.03 mm" },
  software: { ros: "需核验", ros2: "需核验", sdk: "厂商 SDK/API", sim: "需核验" },
  researchEvidence: ["适合国产协作臂横向对比和落地项目验证。"],
  deploymentEvidence: ["国内协作臂品牌，售后和集成渠道较明确。"],
  risks: ["科研论文和开源生态相对弱，需供应商提供开发资料。"],
  scores: { research: 31, deployment: 41, overall: 72 },
  shortlistTags: ["落地项目"],
  purchaseChannels: ["官网询价", "授权代理"]
});

robot({
  id: "jaka-zu7",
  name: "JAKA Zu 7",
  vendor: "节卡 JAKA",
  category: "机械臂",
  formFactor: "6 轴协作机械臂",
  officialUrl: "https://www.jaka.com.cn/",
  cnyAmount: usd(31950),
  cnyRange: "约 ¥23.2 万，按海外代理 31,950 美元估算；国内需询价",
  originalPrice: "Triple Automation JAKA Zu 7 页面列 USD 31,950，按 2026-06-01 估算汇率 1 USD≈¥7.25；国内采购价需向节卡或授权代理确认。",
  priceType: "代理渠道美元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC715"],
  sourceIds: ["SRC027"],
  specs: { dof: "6 轴", payloadKg: "7 kg", reachM: "约 0.82 m", repeatabilityMm: "约 ±0.02 mm" },
  software: { ros: "需核验", ros2: "需核验", sdk: "JAKA SDK/API", sim: "需核验" },
  researchEvidence: ["国产协作臂代表，适合产教融合和工程实践。"],
  deploymentEvidence: ["国内服务网络和行业应用案例较多。"],
  risks: ["开源研究生态需进一步核验。"],
  scores: { research: 32, deployment: 43, overall: 75 },
  shortlistTags: ["落地项目"],
  purchaseChannels: ["官网询价", "授权代理"]
});

robot({
  id: "realman-rm65",
  name: "RealMan RM65",
  vendor: "睿尔曼 RealMan",
  category: "机械臂",
  formFactor: "轻量 6 轴机械臂",
  officialUrl: "https://www.realman-robotics.com/",
  cnyAmount: eur(16099.95),
  cnyRange: "约 ¥12.6 万，按海外代理 RM65 机械臂公开价估算；国内需询价",
  originalPrice: "MYBOTSHOP Realman robotic arm RM65 页面列 EUR 16,099.95，按 2026-06-01 估算汇率 1 EUR≈¥7.85；国内学校采购价需向睿尔曼或代理核验。",
  priceType: "代理渠道欧元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC717"],
  sourceIds: ["SRC028", "SRC029"],
  specs: { dof: "6 轴", payloadKg: "约 5 kg 级，按版本确认", reachM: "约 0.6 m 级", repeatabilityMm: "需按版本确认" },
  software: { ros: "官方/社区 ROS 线索", ros2: "官方/社区 ROS2 线索", sdk: "厂商 SDK", sim: "需核验" },
  researchEvidence: ["轻量化机械臂适合移动操作、复合平台和具身智能应用样机。"],
  deploymentEvidence: ["国内厂商，适合与移动底盘集成。"],
  risks: ["价格、载荷和接口需按具体版本确认。"],
  scores: { research: 36, deployment: 39, overall: 75 },
  shortlistTags: ["科研平台", "落地项目"],
  purchaseChannels: ["官网询价"]
});

robot({
  id: "agilex-piper",
  name: "AgileX PiPER",
  vendor: "松灵 AgileX",
  category: "机械臂",
  formFactor: "轻量 6 轴机械臂",
  officialUrl: "https://global.agilex.ai/products/piper",
  cnyAmount: usd(1999),
  cnyRange: "约 ¥14,500 起，按全球官网美元价估算",
  originalPrice: "AgileX 全球官网 PiPER 商品页元数据列出 USD 1,999，按 2026-06-01 估算汇率 1 USD≈¥7.25；国内学校采购价需按正式报价核验。",
  priceType: "官网美元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC662"],
  sourceIds: ["SRC034", "SRC035", "SRC038"],
  specs: { dof: "6 轴", payloadKg: "约 1.5 kg 级，按手册确认", reachM: "约 0.6 m 级", repeatabilityMm: "需按手册确认" },
  software: { ros: "松灵 ROS 生态", ros2: "松灵 ROS2 生态线索", sdk: "AgileX SDK/ROS", sim: "Gazebo/ROS 方案" },
  researchEvidence: ["适合与 LIMO、Scout、Hunter 等底盘组成移动操作平台。"],
  deploymentEvidence: ["国内底盘生态完整，集成成本相对低。"],
  risks: ["公开价格缺失；末端夹爪和安全方案需单独报价。"],
  scores: { research: 38, deployment: 38, overall: 76 },
  shortlistTags: ["科研平台", "高性价比组合"],
  purchaseChannels: ["官网询价", "京东渠道线索待复核"]
});

robot({
  id: "franka-research-3",
  name: "Franka Research 3",
  vendor: "Franka Robotics",
  category: "机械臂",
  formFactor: "7 轴力控科研机械臂",
  country: "德国",
  domesticPriority: false,
  officialUrl: "https://franka.de/research",
  cnyAmount: eur(29750),
  cnyRange: "约 ¥23.4 万，按海外渠道 29,750 欧元估算；国内代理价需询价",
  originalPrice: "Funduinoshop Franka Research 3 渠道页列 EUR 29,750，按 2026-06-01 估算汇率 1 EUR≈¥7.85；国内代理、科研许可和服务包需另行报价。",
  priceType: "代理渠道欧元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC294"],
  sourceIds: ["SRC044", "SRC045"],
  specs: { dof: "7 轴", payloadKg: "3 kg", reachM: "约 0.855 m", repeatabilityMm: "约 ±0.1 mm", sensors: "关节力矩/力控能力强" },
  software: { ros: "成熟 ROS 生态", ros2: "ROS2 生态逐步完善", sdk: "libfranka / Franka Control Interface", sim: "MoveIt/Gazebo/Isaac 社区方案" },
  researchEvidence: ["国际机器人操作研究中使用频率极高，力控和模仿学习基准价值高。"],
  deploymentEvidence: ["科研通用性强，但国内采购、交期和维保成本较高。"],
  risks: ["价格高且需代理；出口、维保和停产/迭代风险需确认。"],
  scores: { research: 49, deployment: 31, overall: 80 },
  shortlistTags: ["科研平台"],
  purchaseChannels: ["国内代理询价"]
});

robot({
  id: "ur5e",
  name: "Universal Robots UR5e",
  vendor: "Universal Robots",
  category: "机械臂",
  formFactor: "6 轴协作机械臂",
  country: "丹麦",
  domesticPriority: false,
  officialUrl: "https://www.universal-robots.com/products/ur5-robot/",
  cnyAmount: usd(38363),
  cnyRange: "约 ¥27.8 万，按海外代理 UR5e 公开价估算；国内需代理询价",
  originalPrice: "Devonics Universal Robots UR5e 页面列 USD 38,363，按 2026-06-01 估算汇率 1 USD≈¥7.25；国内代理报价、税费和服务包需另行核验。",
  priceType: "代理渠道美元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC709"],
  sourceIds: ["SRC046", "SRC047", "SRC080"],
  specs: { dof: "6 轴", payloadKg: "5 kg", reachM: "0.85 m", repeatabilityMm: "约 ±0.03 mm" },
  software: { ros: "成熟 ROS-Industrial 生态", ros2: "官方 ROS2 驱动", sdk: "URScript / RTDE / ROS", sim: "URSim / MoveIt / Gazebo" },
  researchEvidence: ["协作机器人研究和移动操作基准中常见，生态稳定。"],
  deploymentEvidence: ["工业落地成熟，安全认证和集成商资源较好。"],
  risks: ["价格和维保成本较高，国内教育采购需代理报价。"],
  scores: { research: 45, deployment: 44, overall: 89 },
  shortlistTags: ["科研平台", "落地项目"],
  purchaseChannels: ["国内代理询价"]
});

robot({
  id: "kinova-gen3",
  name: "Kinova Gen3",
  vendor: "Kinova",
  category: "机械臂",
  formFactor: "轻量 6/7 轴科研机械臂",
  country: "加拿大",
  domesticPriority: false,
  officialUrl: "https://www.kinovarobotics.com/product/gen3-robots",
  cnyAmount: eur(18720),
  cnyRange: "约 ¥14.7 万起，按海外代理 18,720 欧元含税价估算；国内需询价",
  originalPrice: "Generation Robots Kinova Gen3 页面列 EUR 18,720 起，按 2026-06-01 估算汇率 1 EUR≈¥7.85；DoF、视觉模块和末端配置会影响最终价。",
  priceType: "代理渠道欧元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC710"],
  sourceIds: ["SRC048", "SRC049"],
  specs: { dof: "6/7 轴", payloadKg: "约 2-4 kg 级，按版本确认", reachM: "约 0.9 m 级", repeatabilityMm: "需按版本确认" },
  software: { ros: "官方 ROS/Kortex", ros2: "社区/官方支持线索", sdk: "Kortex API", sim: "MoveIt/Gazebo" },
  researchEvidence: ["轻量操作、移动操作和人机交互研究中使用较多。"],
  deploymentEvidence: ["科研价值高，国内采购需代理和售后确认。"],
  risks: ["价格高、交期和备件需提前确认。"],
  scores: { research: 43, deployment: 32, overall: 75 },
  shortlistTags: ["科研平台"],
  purchaseChannels: ["代理询价"]
});

// 人形机器人
robot({
  id: "unitree-g1",
  name: "Unitree G1",
  vendor: "宇树科技 Unitree",
  category: "人形机器人",
  formFactor: "全身人形开发平台",
  officialUrl: "https://www.unitree.com/cn/g1/",
  cnyAmount: 85000,
  cnyRange: "¥8.5 万元起，含税官方起售价",
  priceType: "官方起售价",
  priceConfidence: "high",
  priceSourceIds: ["SRC002"],
  sourceIds: ["SRC002", "SRC009", "SRC010"],
  specs: { dof: "23-43 自由度，按版本", payloadKg: "手臂约 2 kg", speed: "需按版本确认", endurance: "约 2 h", weightKg: "约 35 kg 级", sensors: "3D LiDAR/深度相机等按版本" },
  software: { ros: "开发者生态活跃", ros2: "Unitree ROS2 生态", sdk: "Unitree SDK", sim: "MuJoCo/Isaac/Gazebo 社区方案" },
  researchEvidence: ["价格相对可控，是高校人形机器人算法、运动控制和具身智能常见候选。"],
  deploymentEvidence: ["国内采购和售后便利，适合展示、科研平台和轻量应用验证。"],
  risks: ["真实落地还需场地安全、跌倒保护和培训；高配价格需询价。"],
  scores: { research: 45, deployment: 39, overall: 84 },
  shortlistTags: ["科研平台", "教学平台", "高性价比组合"],
  purchaseChannels: ["宇树官网购买/询价", "京东/淘宝线索需复核"]
});

robot({
  id: "unitree-r1-air",
  name: "Unitree R1 Air",
  vendor: "宇树科技 Unitree",
  category: "人形机器人",
  formFactor: "轻量人形机器人",
  officialUrl: "https://www.unitree.com/cn/R1",
  cnyAmount: 29900,
  cnyRange: "¥2.99 万元起，官方页面可见",
  priceType: "官方起售价",
  priceConfidence: "high",
  priceSourceIds: ["SRC003"],
  sourceIds: ["SRC003", "SRC009", "SRC010"],
  specs: { dof: "20-26 自由度", payloadKg: "手臂约 2 kg", endurance: "约 1 h", sensors: "头部双自由度增强环境感知" },
  software: { ros: "Unitree 生态线索", ros2: "Unitree ROS2 生态", sdk: "Unitree SDK", sim: "主流仿真平台支持线索" },
  researchEvidence: ["低价人形平台，适合教学、感知交互和基础运动实验。"],
  deploymentEvidence: ["采购门槛低，适合展示和课程平台。"],
  risks: ["科研接口、传感器和长期稳定性需按版本确认。"],
  scores: { research: 39, deployment: 35, overall: 74 },
  shortlistTags: ["教学平台", "高性价比组合"],
  purchaseChannels: ["宇树官网购买/询价"]
});

robot({
  id: "unitree-r1-d",
  name: "Unitree R1-D",
  vendor: "宇树科技 Unitree",
  category: "人形机器人",
  formFactor: "双臂轻量人形机器人",
  officialUrl: "https://www.unitree.com/cn/R1-D",
  cnyAmount: 26900,
  cnyRange: "¥2.69 万元起，官方页面可见",
  priceType: "官方起售价",
  priceConfidence: "high",
  priceSourceIds: ["SRC004"],
  sourceIds: ["SRC004", "SRC009", "SRC010"],
  specs: { dof: "双臂高自由度，按配置确认", payloadKg: "手臂 2-4 kg 级，按页面说明核验", endurance: "约 1 h 级", sensors: "按版本配置" },
  software: { ros: "Unitree 生态线索", ros2: "Unitree ROS2 生态", sdk: "Unitree SDK", sim: "主流仿真平台支持线索" },
  researchEvidence: ["低成本双臂人形形态，适合教学和具身智能入门。"],
  deploymentEvidence: ["价格低，适合批量课程或展示，但应用能力需实测。"],
  risks: ["版本定位较新，需确认供货周期和开放接口。"],
  scores: { research: 38, deployment: 34, overall: 72 },
  shortlistTags: ["教学平台", "高性价比组合"],
  purchaseChannels: ["宇树官网购买/询价"]
});

robot({
  id: "unitree-h1",
  name: "Unitree H1",
  vendor: "宇树科技 Unitree",
  category: "人形机器人",
  formFactor: "全尺寸高性能人形机器人",
  officialUrl: "https://www.unitree.com/cn/h1/",
  cnyAmount: 646900,
  cnyRange: "H1-2 高校采购单价 ¥64.69 万元；官网标准报价仍需询价",
  priceType: "高校采购中标单价",
  priceConfidence: "high",
  priceSourceIds: ["SRC483", "SRC158"],
  originalPrice: "复旦大学 2025 全尺寸通用人形机器人中标公告：Unitree H1-2 1 套，单价 646900 元；同济大学 2024 公告列 10 台 H1-2，单价 70 万元。H1/H1-2 配置差异需采购前确认。",
  sourceIds: ["SRC005", "SRC009", "SRC010"],
  specs: { dof: "27 自由度", payloadKg: "按版本确认", endurance: "864 Wh 可换电池", speed: "官方强调高动态运动", sensors: "3D LiDAR/相机等按版本" },
  software: { ros: "Unitree 生态线索", ros2: "Unitree ROS2 生态", sdk: "Unitree SDK", sim: "MuJoCo/Isaac 社区方案" },
  researchEvidence: ["适合高动态双足运动、全身控制和具身智能研究。"],
  deploymentEvidence: ["品牌和国内交付能力较强，适合高端平台建设。"],
  risks: ["成本、场地安全、维护和培训要求明显高于 G1/R1。"],
  scores: { research: 44, deployment: 35, overall: 79 },
  shortlistTags: ["科研平台"],
  purchaseChannels: ["宇树官网询价"]
});

robot({
  id: "fourier-gr1",
  name: "Fourier GR-1",
  vendor: "傅利叶智能 Fourier",
  category: "人形机器人",
  formFactor: "全尺寸人形机器人",
  officialUrl: "https://www.fftai.com/",
  cnyAmount: 700000,
  cnyRange: "¥70 万，按复旦大学 GR-1 人形机器人成交公告",
  originalPrice: "复旦大学 2024 人形机器人成交公告列货物品牌为上海傅利叶智能科技有限公司、型号 GR-1、数量 1、货物单价 700000 元；配置、服务和教育采购条款需以招标文件为准。",
  priceType: "高校采购成交单价",
  priceConfidence: "high",
  priceSourceIds: ["SRC1184"],
  sourceIds: ["SRC050"],
  specs: { dof: "40+ 自由度级，按版本确认", payloadKg: "按版本确认", sensors: "感知传感器按版本配置", compute: "机载算力按版本配置" },
  software: { ros: "需供应商确认", ros2: "需供应商确认", sdk: "厂商开发接口需确认", sim: "需确认" },
  researchEvidence: ["国内全尺寸人形代表，适合高端人形平台横向调研。"],
  deploymentEvidence: ["厂商具备人形和康复机器人产业化背景。"],
  risks: ["价格、交期和开放程度需正式询价。"],
  scores: { research: 40, deployment: 34, overall: 74 },
  shortlistTags: ["科研平台"],
  purchaseChannels: ["官网询价"]
});

robot({
  id: "fourier-gr2",
  name: "Fourier GR-2",
  vendor: "傅利叶智能 Fourier",
  category: "人形机器人",
  formFactor: "新一代全尺寸人形机器人",
  officialUrl: "https://www.fftai.com/",
  cnyAmount: usd(125000),
  cnyRange: "约 ¥90.6 万，按海外渠道 125,000 美元线索估算；国内需厂商正式报价",
  originalPrice: "Robozaps Fourier GR-2 页面列 USD 125,000；人形机器人版本、末端和开放接口差异大，国内采购需以傅利叶正式报价为准。",
  priceType: "代理渠道美元价线索",
  priceConfidence: "low",
  priceSourceIds: ["SRC732"],
  sourceIds: ["SRC050"],
  specs: { dof: "按版本确认", payloadKg: "按版本确认", sensors: "感知和灵巧手按版本", compute: "按版本配置" },
  software: { ros: "需供应商确认", ros2: "需供应商确认", sdk: "厂商开发接口需确认", sim: "需确认" },
  researchEvidence: ["可作为国内高端人形平台备选，适合运动控制和操作研究。"],
  deploymentEvidence: ["落地能力需结合厂商交付案例评估。"],
  risks: ["公开参数和价格不足，需重点询价和试用。"],
  scores: { research: 39, deployment: 32, overall: 71 },
  shortlistTags: ["科研平台"],
  purchaseChannels: ["官网询价"]
});

robot({
  id: "agibot-a2",
  name: "智元远征 A2",
  vendor: "智元机器人 AgiBot",
  category: "人形机器人",
  formFactor: "全尺寸人形/具身智能平台",
  officialUrl: "https://www.agibot.com/",
  cnyAmount: usd(44560),
  cnyRange: "约 ¥32.3 万，按 AGIBOT A2 Lite 官方商城 USD 44,560 估算；A2/A2 Ultra 需另行询价",
  originalPrice: "AGIBOT 官方商城 A2 Lite 页面列 Sale price USD 44,560，按 2026-06-01 估算汇率 1 USD≈¥7.25；A2 Lite 与远征 A2/A2 Ultra 配置不同，此处仅作为同系列低配官方价格线索。",
  priceType: "官方商城同系列低配价线索",
  priceConfidence: "medium",
  priceSourceIds: ["SRC1187"],
  sourceIds: ["SRC051"],
  specs: { dof: "按版本确认", payloadKg: "按版本确认", sensors: "视觉/力控/灵巧手按版本", compute: "按版本配置" },
  software: { ros: "需供应商确认", ros2: "需供应商确认", sdk: "开发接口需确认", sim: "需确认" },
  researchEvidence: ["国内具身智能热门厂商，适合关注通用机器人平台能力。"],
  deploymentEvidence: ["面向产业落地，适合高端应用展示和联合项目。"],
  risks: ["高校采购可得性、价格和开放权限需正式确认。"],
  scores: { research: 41, deployment: 37, overall: 78 },
  shortlistTags: ["科研平台", "落地项目"],
  purchaseChannels: ["官网询价"]
});

robot({
  id: "agibot-x2",
  name: "智元灵犀 X2",
  vendor: "智元机器人 AgiBot",
  category: "人形机器人",
  formFactor: "交互/服务型具身智能平台",
  officialUrl: "https://www.agibot.com/",
  cnyAmount: 928340,
  cnyRange: "X2 Ultra 旗舰版高校采购单价 ¥92.834 万元",
  priceType: "高校采购中标单价",
  priceConfidence: "high",
  priceSourceIds: ["SRC482"],
  originalPrice: "华东理工大学 2025 智能机器人综合实践平台中标公告：智元灵犀 X2 Ultra 旗舰版 3 套，单价 928340 元。",
  sourceIds: ["SRC051"],
  specs: { dof: "按版本确认", payloadKg: "按版本确认", sensors: "视觉/语音/交互传感器按版本", compute: "按版本配置" },
  software: { ros: "需供应商确认", ros2: "需供应商确认", sdk: "需供应商确认", sim: "需确认" },
  researchEvidence: ["适合人机交互、服务机器人和具身大模型展示研究。"],
  deploymentEvidence: ["更偏服务和展示场景，落地适配潜力较高。"],
  risks: ["开放能力和二次开发深度需重点确认。"],
  scores: { research: 36, deployment: 38, overall: 74 },
  shortlistTags: ["落地项目"],
  purchaseChannels: ["官网询价"]
});

robot({
  id: "ubtech-walker-s1",
  name: "UBTECH Walker S1",
  vendor: "优必选 UBTECH",
  category: "人形机器人",
  formFactor: "工业服务人形机器人",
  officialUrl: "https://www.ubtrobot.com/",
  cnyAmount: usd(110000),
  cnyRange: "约 ¥79.8 万，按第三方参数页 110,000 美元线索估算；优必选正式报价优先",
  originalPrice: "HumanoidSpecs UBTECH Walker S1 页面列约 USD 110,000；第三方价格需向优必选正式核验，尤其是教育/工业版本配置差异。",
  priceType: "第三方美元价线索",
  priceConfidence: "low",
  priceSourceIds: ["SRC733"],
  sourceIds: ["SRC052"],
  specs: { dof: "按版本确认", payloadKg: "按版本确认", sensors: "工业/服务传感器按版本", compute: "按版本配置" },
  software: { ros: "需供应商确认", ros2: "需供应商确认", sdk: "需供应商确认", sim: "需确认" },
  researchEvidence: ["国内人形产业化代表，可用于应用落地和人机协作研究。"],
  deploymentEvidence: ["厂商产业资源较强，适合落地应用调研。"],
  risks: ["未必适合开放科研；需确认开发权限、数据接口和价格。"],
  scores: { research: 34, deployment: 41, overall: 75 },
  shortlistTags: ["落地项目"],
  purchaseChannels: ["官网询价"]
});

robot({
  id: "engineai-pm01",
  name: "EngineAI PM01",
  vendor: "众擎机器人 EngineAI",
  category: "人形机器人",
  formFactor: "小型/中型人形机器人",
  officialUrl: "https://www.engineai.com.cn/",
  cnyAmount: 188000,
  cnyRange: "¥18.8 万，众擎官方购买页公开价",
  priceType: "官网公开价",
  priceConfidence: "high",
  priceSourceIds: ["SRC1182"],
  originalPrice: "EngineAI 众擎官方 Product Purchase 页面列 PM01 价格 ¥188000；采购前仍需核验税费、教育价、交付周期和国内合同条款。",
  sourceIds: ["SRC053"],
  specs: { dof: "按版本确认", payloadKg: "按版本确认", sensors: "视觉/IMU 按版本", compute: "按版本配置" },
  software: { ros: "需供应商确认", ros2: "需供应商确认", sdk: "需供应商确认", sim: "需确认" },
  researchEvidence: ["新兴国产人形平台，适合预算敏感型高校关注。"],
  deploymentEvidence: ["可作为展示、教学和轻量应用备选。"],
  risks: ["公开价格和教育采购渠道需复核。"],
  scores: { research: 35, deployment: 33, overall: 68 },
  shortlistTags: ["教学平台"],
  purchaseChannels: ["官网询价"]
});

robot({
  id: "leju-kuavo",
  name: "Kuavo 人形机器人",
  vendor: "乐聚机器人 Leju",
  category: "人形机器人",
  formFactor: "开源/开发者人形平台",
  officialUrl: "https://www.lejurobot.com/",
  cnyAmount: aud(80000),
  cnyRange: "约 ¥38 万，按海外渠道 80,000 澳元估算；国内需乐聚正式报价",
  originalPrice: "Robots-Australia Leju Kuavo 页面列 AUD 80,000，按 2026-06-01 估算汇率 1 AUD≈¥4.75；国内 Kuavo 版本、开源套件和教育价需向乐聚核验。",
  priceType: "代理渠道澳元价估算",
  priceConfidence: "low",
  priceSourceIds: ["SRC734"],
  sourceIds: ["SRC054", "SRC055"],
  specs: { dof: "按版本确认", payloadKg: "按版本确认", sensors: "视觉/IMU 按版本", compute: "按版本配置" },
  software: { ros: "开源项目线索", ros2: "开源项目线索", sdk: "GitHub/厂商接口", sim: "需确认" },
  researchEvidence: ["开源生态线索较强，适合学校做可复现实验和教学。"],
  deploymentEvidence: ["更偏开发者和教学平台，落地需看硬件成熟度。"],
  risks: ["价格、供货和稳定性需实机验证。"],
  scores: { research: 41, deployment: 31, overall: 72 },
  shortlistTags: ["科研平台", "教学平台"],
  purchaseChannels: ["官网询价"]
});

robot({
  id: "booster-t1",
  name: "Booster T1",
  vendor: "Booster Robotics",
  category: "人形机器人",
  formFactor: "开发者/竞赛人形平台",
  officialUrl: "https://www.boosterobotics.com/",
  cnyAmount: 195000,
  cnyRange: "Booster T1 标准版高校采购单价 ¥19.5 万元；Booster A1 标准版 ¥49 万元",
  priceType: "高校采购中标单价",
  priceConfidence: "high",
  priceSourceIds: ["SRC159"],
  originalPrice: "清华大学人形机器人采购项目中标公告：Booster T1 标准版 15 套，单价 195000 元；Booster A1 标准版 4 套，单价 490000 元。",
  sourceIds: ["SRC056"],
  specs: { dof: "按版本确认", payloadKg: "轻量平台", sensors: "视觉/IMU 按版本", compute: "按版本配置" },
  software: { ros: "需确认", ros2: "需确认", sdk: "开发者接口需确认", sim: "需确认" },
  researchEvidence: ["适合机器人足球、步态控制和教学竞赛场景。"],
  deploymentEvidence: ["落地应用能力有限，更偏研发和比赛。"],
  risks: ["中文采购渠道和售后需确认。"],
  scores: { research: 36, deployment: 28, overall: 64 },
  shortlistTags: ["教学平台"],
  purchaseChannels: ["官网询价"]
});

robot({
  id: "noetix-bumi",
  name: "NOETIX Bumi",
  vendor: "NOETIX",
  category: "人形机器人",
  formFactor: "小型人形机器人",
  officialUrl: "https://www.noetix.ai/",
  cnyAmount: 9998,
  cnyRange: "¥9,998，NOETIX 官方媒体页价格线索",
  priceType: "官方媒体价格线索",
  priceConfidence: "high",
  priceSourceIds: ["SRC568"],
  originalPrice: "NOETIX 官方媒体页称 Bumi 定价 9998 元；具体 Lite/Air/Pro/Max/EDU 版本价和学校采购价需正式确认。",
  sourceIds: ["SRC057"],
  specs: { dof: "按版本确认", payloadKg: "轻量平台", sensors: "按版本配置", compute: "按版本配置" },
  software: { ros: "需确认", ros2: "需确认", sdk: "需确认", sim: "需确认" },
  researchEvidence: ["小型低成本人形方向，适合教学和入门研究。"],
  deploymentEvidence: ["更适合展示和课程，不适合复杂真实任务。"],
  risks: ["渠道、价格和开放程度需重点核验。"],
  scores: { research: 32, deployment: 27, overall: 59 },
  shortlistTags: ["教学平台"],
  purchaseChannels: ["官网询价"]
});

robot({
  id: "robotera-star1",
  name: "RobotEra STAR1",
  vendor: "星动纪元 RobotEra",
  category: "人形机器人",
  formFactor: "全尺寸人形机器人",
  officialUrl: "https://www.robotera.com/",
  cnyAmount: usd(120000),
  cnyRange: "约 ¥87 万，按第三方资料 120,000 美元线索估算；星动纪元正式报价优先",
  originalPrice: "HumanoidSpecs RobotEra STAR1 页面列 USD 120,000；第三方价格需向星动纪元正式核验。",
  priceType: "第三方美元价线索",
  priceConfidence: "low",
  priceSourceIds: ["SRC720"],
  sourceIds: ["SRC059"],
  specs: { dof: "按版本确认", payloadKg: "按版本确认", sensors: "视觉/力控按版本", compute: "按版本配置" },
  software: { ros: "需确认", ros2: "需确认", sdk: "需确认", sim: "需确认" },
  researchEvidence: ["国内人形机器人新兴平台，可纳入高端科研关注池。"],
  deploymentEvidence: ["落地能力需看合作案例和供货。"],
  risks: ["价格和高校采购可得性需进一步核验。"],
  scores: { research: 36, deployment: 30, overall: 66 },
  shortlistTags: ["科研平台"],
  purchaseChannels: ["官网询价"]
});

// 机械狗
robot({
  id: "unitree-go2",
  name: "Unitree Go2 系列",
  vendor: "宇树科技 Unitree",
  category: "机械狗",
  formFactor: "四足机器人",
  officialUrl: "https://www.unitree.com/cn/go2/",
  cnyAmount: 9997,
  cnyRange: "官方起售价 ¥9,997；Go2-EDU 旗舰版高校采购单价 ¥8.99 万元",
  priceType: "官方起售价",
  priceConfidence: "high",
  priceSourceIds: ["SRC001", "SRC164"],
  originalPrice: "宇树官网 Go2 起售价 9997 元；大连理工大学宁波研究院采购结果显示 GO2-EDU 旗舰版单价 89900 元。",
  sourceIds: ["SRC001", "SRC009", "SRC010", "SRC069", "SRC072", "SRC077"],
  specs: { dof: "12", payloadKg: "按 Air/Pro/EDU 配置确认", speed: "约 5 m/s 级，按版本", endurance: "约 2-4 h 长续航版", weightKg: "约 15 kg 级", sensors: "深度相机/雷达按版本" },
  software: { ros: "EDU/社区 ROS 生态常见", ros2: "Unitree ROS2 生态", sdk: "Unitree SDK", sim: "MuJoCo/Isaac/Gazebo 社区方案" },
  researchEvidence: ["四足运动控制、导航、强化学习和移动感知项目中常见。"],
  deploymentEvidence: ["国内采购门槛低，适合巡检、展示和课程平台。"],
  risks: ["低价版本科研接口和传感器有限；EDU 高配需另行报价。"],
  scores: { research: 44, deployment: 42, overall: 86 },
  shortlistTags: ["科研平台", "教学平台", "高性价比组合"],
  purchaseChannels: ["宇树官网", "京东/淘宝官方或授权渠道待复核"]
});

robot({
  id: "unitree-b2",
  name: "Unitree B2",
  vendor: "宇树科技 Unitree",
  category: "机械狗",
  formFactor: "工业级四足机器人",
  officialUrl: "https://www.unitree.com/cn/b2/",
  cnyAmount: usd(85900),
  cnyRange: "约 ¥62.3 万，按海外渠道 85,900 美元估算；国内需宇树正式报价",
  originalPrice: "RobotsUSA Unitree B2 页面列 USD 85,900，按 2026-06-01 估算汇率 1 USD≈¥7.25；国内行业/教育采购价需向宇树核验。",
  priceType: "代理渠道美元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC711"],
  sourceIds: ["SRC006", "SRC009", "SRC010"],
  specs: { dof: "12", payloadKg: "持续负载 40 kg", speed: "6 m/s", endurance: "持续行走约 5 h", sensors: "工业感知按版本" },
  software: { ros: "开发者生态线索", ros2: "Unitree ROS2 生态", sdk: "Unitree SDK", sim: "MuJoCo/Isaac/Gazebo 社区方案" },
  researchEvidence: ["适合大负载四足、巡检和移动操作研究。"],
  deploymentEvidence: ["工业巡检和户外应用能力强，适合落地项目。"],
  risks: ["价格高且需询价；场地安全和保险要求更高。"],
  scores: { research: 40, deployment: 44, overall: 84 },
  shortlistTags: ["落地项目"],
  purchaseChannels: ["宇树官网询价"]
});

robot({
  id: "unitree-a2",
  name: "Unitree A2",
  vendor: "宇树科技 Unitree",
  category: "机械狗",
  formFactor: "行业级轻量四足平台",
  officialUrl: "https://www.unitree.com/cn/A2",
  cnyAmount: usd(29995),
  cnyRange: "约 ¥21.7 万起，按海外渠道 A2 Standard 29,995 美元估算；国内需询价",
  originalPrice: "RobotsUSA Unitree A2 页面列 A2 Standard USD 29,995、A2 Pro USD 38,950，按 2026-06-01 估算汇率 1 USD≈¥7.25；国内配置和教育价需核验。",
  priceType: "代理渠道美元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC712"],
  sourceIds: ["SRC007", "SRC009", "SRC010"],
  specs: { dof: "12", payloadKg: "按版本确认", speed: "高速关节电机，按版本确认", endurance: "满载约 3 h，空载约 5 h", weightKg: "约 42 kg" },
  software: { ros: "开发者生态线索", ros2: "Unitree ROS2 生态", sdk: "Unitree SDK", sim: "MuJoCo/Isaac/Gazebo 社区方案" },
  researchEvidence: ["新一代轻量行业四足，适合导航、巡检和负载实验。"],
  deploymentEvidence: ["兼顾负载和续航，适合校园/园区巡检样机。"],
  risks: ["新型号公开价格缺失，供货和教育价需核验。"],
  scores: { research: 39, deployment: 42, overall: 81 },
  shortlistTags: ["科研平台", "落地项目"],
  purchaseChannels: ["宇树官网询价"]
});

robot({
  id: "deeprobotics-lite3",
  name: "DEEPRobotics Lite3",
  vendor: "云深处科技",
  category: "机械狗",
  formFactor: "教育/科研四足机器人",
  officialUrl: "https://www.deeprobotics.cn/robot/index/product2.html",
  cnyAmount: 16900,
  cnyRange: "¥16,900 起，官网页面新闻区可见",
  priceType: "官网公开起售价线索",
  priceConfidence: "high",
  priceSourceIds: ["SRC011"],
  sourceIds: ["SRC011", "SRC015", "SRC077"],
  specs: { dof: "12", payloadKg: "最大负载 10 kg", speed: "最高 3.3 m/s", endurance: "页面显示 40 min，需核实具体版本", sensors: "感知处理器/传感器按版本" },
  software: { ros: "需按开发版确认", ros2: "需确认", sdk: "厂商 SDK/接口需确认", sim: "需确认" },
  researchEvidence: ["国产四足低成本选项，适合教学和步态/导航实验。"],
  deploymentEvidence: ["国内厂家，适合巡检和课程平台。"],
  risks: ["页面参数存在版本差异，采购前必须拿到正式规格书。"],
  scores: { research: 39, deployment: 39, overall: 78 },
  shortlistTags: ["教学平台", "高性价比组合"],
  purchaseChannels: ["云深处官网购买咨询"]
});

robot({
  id: "deeprobotics-x30",
  name: "DEEPRobotics 绝影 X30",
  vendor: "云深处科技",
  category: "机械狗",
  formFactor: "行业四足机器人",
  officialUrl: "https://www.deeprobotics.cn/robot/index/product1.html",
  cnyAmount: 410500,
  cnyRange: "复旦大学 X30 科研急需采购组合成交价 ¥41.05 万元",
  priceType: "高校采购成交总价/组合价",
  priceConfidence: "medium",
  priceSourceIds: ["SRC486"],
  originalPrice: "复旦大学机器狗科研急需采购：X30 四足机器人 1 台 + 双光云台 + 5G 通讯模块，成交金额 410500 元；该价格不是裸机标准单价。",
  sourceIds: ["SRC012", "SRC015"],
  specs: { dof: "12", payloadKg: "持续行走负载 5 kg 级，按页面核验", speed: "按版本确认", endurance: "约 1.5-2 h 级", sensors: "行业感知模块按版本" },
  software: { ros: "需厂商确认", ros2: "需厂商确认", sdk: "厂商 SDK/接口需确认", sim: "需确认" },
  researchEvidence: ["适合复杂地形、巡检和行业应用研究。"],
  deploymentEvidence: ["云深处在电力/工业巡检场景有落地定位。"],
  risks: ["价格未公开；科研接口开放程度需确认。"],
  scores: { research: 36, deployment: 43, overall: 79 },
  shortlistTags: ["落地项目"],
  purchaseChannels: ["云深处官网询价"]
});

robot({
  id: "deeprobotics-x20",
  name: "DEEPRobotics 绝影 X20",
  vendor: "云深处科技",
  category: "机械狗",
  formFactor: "行业四足机器人",
  officialUrl: "https://www.deeprobotics.cn/robot/index/product3.html",
  priceLabel: "需询价",
  sourceIds: ["SRC013", "SRC015"],
  specs: { dof: "12", payloadKg: "按版本确认", speed: "≥4 m/s 线索", endurance: "快速换电，按版本确认", sensors: "行业感知模块按版本" },
  software: { ros: "需厂商确认", ros2: "需厂商确认", sdk: "厂商 SDK/接口需确认", sim: "需确认" },
  researchEvidence: ["适合巡检和特殊任务平台研究。"],
  deploymentEvidence: ["行业应用定位明确，适合落地项目备选。"],
  risks: ["公开参数和价格需进一步核验。"],
  scores: { research: 34, deployment: 42, overall: 76 },
  shortlistTags: ["落地项目"],
  purchaseChannels: ["云深处官网询价"]
});

robot({
  id: "deeprobotics-lynx-m20",
  name: "DEEPRobotics 山猫 M20",
  vendor: "云深处科技",
  category: "机械狗",
  formFactor: "轮足机器人",
  officialUrl: "https://www.deeprobotics.cn/robot/index/lynx.html",
  cnyAmount: usd(3299),
  cnyRange: "约 ¥2.4 万，按 DEEP Robotics 美国官方商店 Lynx M20 Pro 3,299 美元估算；国内配置需核验",
  originalPrice: "DEEP Robotics 美国官方商店 Lynx M20 Pro 页面列 USD 3,299，按 2026-06-01 估算汇率 1 USD≈¥7.25；中国区价格、版本和服务需向云深处确认。",
  priceType: "海外官方商店美元价估算",
  priceConfidence: "high",
  priceSourceIds: ["SRC727"],
  sourceIds: ["SRC014", "SRC015"],
  specs: { dof: "轮足复合自由度，按版本确认", payloadKg: "按版本确认", speed: "5 m/s 级线索", endurance: "按版本确认", sensors: "行业感知模块按版本" },
  software: { ros: "需厂商确认", ros2: "需厂商确认", sdk: "厂商 SDK/接口需确认", sim: "需确认" },
  researchEvidence: ["轮足形态适合高速移动、复杂地形和控制研究。"],
  deploymentEvidence: ["兼顾轮式速度和足式通过性，适合园区/巡检应用。"],
  risks: ["形态较新，科研资料和价格需补充。"],
  scores: { research: 37, deployment: 39, overall: 76 },
  shortlistTags: ["科研平台", "落地项目"],
  purchaseChannels: ["云深处官网询价"]
});

robot({
  id: "xiaomi-cyberdog2",
  name: "小米 CyberDog 2",
  vendor: "小米 Xiaomi",
  category: "机械狗",
  formFactor: "消费/开发者四足机器人",
  officialUrl: "https://www.mi.com/cyberdog-2",
  cnyAmount: 12999,
  cnyRange: "约 ¥12,999，需以小米官方页面实时价格为准",
  priceType: "官方公开价线索",
  priceConfidence: "medium",
  priceSourceIds: ["SRC016"],
  sourceIds: ["SRC016"],
  specs: { dof: "12", payloadKg: "轻载，按官方版本确认", speed: "按版本确认", endurance: "按版本确认", sensors: "摄像头/深度/AI 传感器按版本" },
  software: { ros: "社区线索", ros2: "社区线索", sdk: "开发者接口需核验", sim: "需确认" },
  researchEvidence: ["适合低成本感知、交互和控制入门，不是工业级平台。"],
  deploymentEvidence: ["采购成本低，适合展示和课程。"],
  risks: ["科研开放度和长期供货不如专业四足平台。"],
  scores: { research: 31, deployment: 29, overall: 60 },
  shortlistTags: ["教学平台"],
  purchaseChannels: ["小米官方渠道"]
});

robot({
  id: "unitree-go1",
  name: "Unitree Go1",
  vendor: "宇树科技 Unitree",
  category: "机械狗",
  formFactor: "四足机器人（上一代科研常见平台）",
  officialUrl: "https://www.unitree.com/",
  cnyAmount: usd(11900),
  cnyRange: "约 ¥8.6 万起，按 Sourcewell Go1 EDU Plus 11,900 美元历史教育价估算；需确认是否仍可采购",
  originalPrice: "Sourcewell/STEMfinity 2024 价格表列 Unitree Go1 EDU Plus USD 11,900、Go1 EDU USD 17,750；Go1 为上一代平台，当前在售状态需向宇树或代理确认。",
  priceType: "历史教育渠道美元价估算",
  priceConfidence: "low",
  priceSourceIds: ["SRC730", "SRC731"],
  sourceIds: ["SRC009", "SRC010", "SRC077"],
  specs: { dof: "12", payloadKg: "轻载", speed: "按版本确认", endurance: "按版本确认" },
  software: { ros: "社区资料较多", ros2: "社区/迁移方案", sdk: "Unitree SDK", sim: "MuJoCo/Gazebo/Isaac 社区方案" },
  researchEvidence: ["历史论文和开源项目中出现较多，可作为科研标杆和二手/存量设备参考。"],
  deploymentEvidence: ["若已停产或供货减少，应优先考虑 Go2/A2。"],
  risks: ["在售状态不确定；新采购不建议优先。"],
  scores: { research: 38, deployment: 24, overall: 62 },
  shortlistTags: ["科研平台"],
  purchaseChannels: ["需向宇树或代理确认"]
});

robot({
  id: "limx-tron1",
  name: "LimX TRON1",
  vendor: "逐际动力 LimX Dynamics",
  category: "机械狗",
  formFactor: "轮足/双足可切换研究平台",
  officialUrl: "https://www.limxdynamics.com/",
  cnyAmount: usd(16995),
  cnyRange: "约 ¥12.3 万，按 RobotShop TRON 1 EDU 16,995 美元估算；国内需逐际正式报价",
  originalPrice: "RobotShop LimX Dynamics TRON 1 Multi-modal Biped Robot EDU 页面列 USD 16,995；Reichelt 欧洲渠道列约 EUR 19,992.55，可交叉参考。国内学校采购需向逐际动力核验。",
  priceType: "代理渠道美元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC728", "SRC729"],
  sourceIds: ["SRC017"],
  specs: { dof: "按版本确认", payloadKg: "按版本确认", speed: "按版本确认", sensors: "IMU/视觉按版本" },
  software: { ros: "需确认", ros2: "需确认", sdk: "厂商开发接口需确认", sim: "需确认" },
  researchEvidence: ["轮足/足式控制研究价值高，可作为高校前沿平台备选。"],
  deploymentEvidence: ["更偏科研和演示，落地需看场景。"],
  risks: ["价格、供货和开放生态需进一步核验。"],
  scores: { research: 36, deployment: 29, overall: 65 },
  shortlistTags: ["科研平台"],
  purchaseChannels: ["官网询价"]
});

robot({
  id: "unitree-b2-z1",
  name: "Unitree B2 + Z1 移动操作组合",
  vendor: "宇树科技 Unitree",
  category: "机械狗",
  formFactor: "四足平台加装机械臂",
  officialUrl: "https://www.unitree.com/cn/b2/",
  cnyAmount: usd(85900 + 6000),
  cnyRange: "约 ¥66.6 万起，按 B2 海外渠道价 + Z1 教育渠道价粗估；完整组合需正式询价",
  originalPrice: "B2 采用 RobotsUSA USD 85,900 渠道价；Z1 采用 Sourcewell/STEMfinity Unitree Z1 Robotic Arms 教育渠道价线索 USD 6,000 级。组合不含安装、末端、供电和安全集成。",
  priceType: "组合渠道价粗估",
  priceConfidence: "low",
  priceSourceIds: ["SRC711", "SRC713"],
  sourceIds: ["SRC006", "SRC008", "SRC009", "SRC010"],
  specs: { dof: "四足 12 + 机械臂 6 轴", payloadKg: "B2 持续负载 40 kg；臂端按 Z1 确认", speed: "6 m/s 平台能力", endurance: "按负载和电池配置确认" },
  software: { ros: "Unitree/社区组合方案", ros2: "Unitree ROS2 生态", sdk: "Unitree SDK", sim: "MuJoCo/Isaac/Gazebo 社区方案" },
  researchEvidence: ["适合移动操作、巡检开门/按键/取放等具身任务。"],
  deploymentEvidence: ["平台负载强，适合真实巡检项目原型。"],
  risks: ["组合安全、重心、末端工具和电源需系统集成验证。"],
  scores: { research: 42, deployment: 39, overall: 81 },
  shortlistTags: ["科研平台", "落地项目"],
  purchaseChannels: ["宇树官网组合询价"]
});

// 复合型机器人
robot({
  id: "agilex-limo-piper",
  name: "AgileX LIMO Pro + PiPER",
  vendor: "松灵 AgileX",
  category: "复合型机器人",
  formFactor: "轮式/履带底盘 + 机械臂",
  officialUrl: "https://www.agilex.ai/",
  cnyAmount: usd(5199),
  cnyRange: "约 ¥37,700 起，按 LIMO PRO + PiPER 全球官网美元价粗估",
  originalPrice: "AgileX 全球官网 LIMO PRO 元数据列 USD 3,200，PiPER 元数据列 USD 1,999，组合不含夹爪、相机、雷达、运保和集成服务；国内学校采购价需正式报价。",
  priceType: "组合公开价粗估",
  priceConfidence: "low",
  priceSourceIds: ["SRC662", "SRC663"],
  sourceIds: ["SRC034", "SRC035", "SRC036", "SRC038", "SRC071"],
  specs: { dof: "移动底盘 + 6 轴臂", payloadKg: "臂端约 1.5 kg 级，底盘按版本", speed: "按 LIMO Pro 配置", endurance: "按电池和负载确认", sensors: "激光雷达/深度相机按教学套装" },
  software: { ros: "松灵 ROS 生态", ros2: "松灵 ROS2 生态", sdk: "AgileX SDK/ROS", sim: "Gazebo/ROS 方案" },
  researchEvidence: ["适合导航、SLAM、抓取和移动操作课程，组合成本相对可控。"],
  deploymentEvidence: ["国内采购便利，可用于校园配送、巡检和操作样机。"],
  risks: ["组合价和稳定性需按套装确认；末端执行器另配。"],
  scores: { research: 42, deployment: 40, overall: 82 },
  shortlistTags: ["科研平台", "教学平台", "高性价比组合"],
  purchaseChannels: ["松灵官网询价", "京东渠道线索待复核"]
});

robot({
  id: "agilex-cobot-magic",
  name: "AgileX Cobot Magic",
  vendor: "松灵 AgileX",
  category: "复合型机器人",
  formFactor: "移动复合机器人",
  officialUrl: "https://global.agilex.ai/products/cobot-magic",
  cnyAmount: aud(99999),
  cnyRange: "约 ¥47.5 万，按海外渠道 99,999 澳元估算；国内松灵正式报价优先",
  originalPrice: "Robots-Australia AgileX Cobot Magic 页面列 AUD 99,999，按 2026-06-01 估算汇率 1 AUD≈¥4.75；完整配置、末端、传感器和服务需向松灵核验。",
  priceType: "代理渠道澳元价估算",
  priceConfidence: "low",
  priceSourceIds: ["SRC735"],
  sourceIds: ["SRC034", "SRC037", "SRC038"],
  specs: { dof: "移动底盘 + 双臂/单臂按配置", payloadKg: "按配置确认", speed: "按底盘配置", endurance: "按电池配置", sensors: "视觉/雷达按配置" },
  software: { ros: "松灵 ROS 生态", ros2: "松灵 ROS2 生态", sdk: "AgileX SDK/ROS", sim: "Gazebo/ROS 方案" },
  researchEvidence: ["面向移动操作和具身智能整机平台，降低自研集成工作量。"],
  deploymentEvidence: ["厂商整机方案更适合落地试点。"],
  risks: ["公开价格和详细规格少，需看样机和合同配置。"],
  scores: { research: 41, deployment: 42, overall: 83 },
  shortlistTags: ["科研平台", "落地项目"],
  purchaseChannels: ["松灵官网询价"]
});

robot({
  id: "hiwonder-jetauto-pro",
  name: "Hiwonder JetAuto Pro",
  vendor: "幻尔 Hiwonder",
  category: "复合型机器人",
  formFactor: "麦轮底盘 + 机械臂教学平台",
  officialUrl: "https://www.hiwonder.com/products/jetauto-pro",
  cnyAmount: usd(959.99),
  cnyRange: "约 ¥7,000 起，按官方美元价估算",
  originalPrice: "Hiwonder JetAuto Pro 官方商品页元数据列出 USD 959.99，按 2026-06-01 估算汇率 1 USD≈¥7.25；国内官方站/授权店价格需核验。",
  priceType: "官网美元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC580"],
  sourceIds: ["SRC040"],
  specs: { dof: "移动底盘 + 机械臂，按套装", payloadKg: "轻载教学", speed: "按底盘配置", sensors: "Jetson/深度相机/雷达按套装", compute: "Jetson 套装常见" },
  software: { ros: "ROS 教学套装", ros2: "需按版本确认", sdk: "Python/ROS 教程", sim: "教学示例" },
  researchEvidence: ["适合课程、SLAM、视觉抓取和 ROS 教学。"],
  deploymentEvidence: ["落地能力有限，更适合教学和原型。"],
  risks: ["电商价格动态变化，需人工核验官方店页面。"],
  scores: { research: 34, deployment: 30, overall: 64 },
  shortlistTags: ["教学平台", "高性价比组合"],
  purchaseChannels: ["幻尔官方商城/授权店待复核"]
});

robot({
  id: "hiwonder-jetrover-arm",
  name: "Hiwonder JetRover + 机械臂",
  vendor: "幻尔 Hiwonder",
  category: "复合型机器人",
  formFactor: "轮式底盘 + 轻量机械臂",
  officialUrl: "https://www.hiwonder.com/products/jetrover",
  cnyAmount: usd(779.99),
  cnyRange: "约 ¥5,700 起，按官方美元价估算",
  originalPrice: "Hiwonder JetRover 官方商品页元数据列出 USD 779.99，按 2026-06-01 估算汇率 1 USD≈¥7.25；国内官方站/授权店价格需核验。",
  priceType: "官网美元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC659"],
  sourceIds: ["SRC041", "SRC039"],
  specs: { dof: "移动底盘 + 轻量臂", payloadKg: "轻载教学", speed: "按底盘配置", sensors: "深度相机/雷达按套装", compute: "Jetson/树莓派按版本" },
  software: { ros: "ROS 教学套装", ros2: "需确认", sdk: "Python/ROS 教程", sim: "教学示例" },
  researchEvidence: ["适合移动机器人课程和低成本移动操作入门。"],
  deploymentEvidence: ["适合室内展示和教学，不适合高可靠落地。"],
  risks: ["承载和精度有限；价格需官方店复核。"],
  scores: { research: 32, deployment: 28, overall: 60 },
  shortlistTags: ["教学平台"],
  purchaseChannels: ["幻尔官方商城/授权店待复核"]
});

robot({
  id: "yahboom-rosmaster-x3-arm",
  name: "Yahboom ROSMASTER X3 + DOFBOT",
  vendor: "亚博智能 Yahboom",
  category: "复合型机器人",
  formFactor: "ROS 教学底盘 + 机械臂",
  officialUrl: "https://category.yahboom.net/products/rosmaster-x3",
  cnyAmount: usd(998),
  cnyRange: "约 ¥7,200 起，按 ROSMASTER X3 + DOFBOT 官方美元价粗估",
  originalPrice: "Yahboom ROSMASTER X3 官方商品页元数据列 USD 659，DOFBOT Jetson Nano 页元数据列 USD 339，组合价未包含额外支架、电源、运保和集成，国内授权店需复核。",
  priceType: "组合公开价粗估",
  priceConfidence: "low",
  priceSourceIds: ["SRC660", "SRC661"],
  sourceIds: ["SRC042", "SRC043"],
  specs: { dof: "移动底盘 + 轻量 机械臂", payloadKg: "轻载教学", speed: "按底盘配置", sensors: "雷达/相机按套装", compute: "Jetson/树莓派按套装" },
  software: { ros: "ROS 教学资料", ros2: "部分套装支持线索", sdk: "Python/ROS 教程", sim: "教学示例" },
  researchEvidence: ["适合机器人课程、SLAM 和视觉抓取入门。"],
  deploymentEvidence: ["成本低，适合教学；不建议作为严肃落地平台。"],
  risks: ["科研通用性和长期稳定性有限。"],
  scores: { research: 30, deployment: 27, overall: 57 },
  shortlistTags: ["教学平台", "高性价比组合"],
  purchaseChannels: ["亚博官方商城/授权店待复核"]
});

robot({
  id: "mobile-aloha",
  name: "Mobile ALOHA 组合",
  vendor: "开源组合方案",
  category: "复合型机器人",
  formFactor: "移动底盘 + 双臂遥操作",
  country: "组合方案",
  domesticPriority: false,
  officialUrl: "https://mobile-aloha.github.io/",
  cnyAmount: usd(32000),
  cnyRange: "约 ¥23 万级，按公开 BOM/美元价粗估",
  originalPrice: "Mobile ALOHA 公开低成本组合约 USD 32k 级，实际采购随底盘、臂和传感器变化",
  priceType: "研究项目 BOM 估算",
  priceConfidence: "low",
  priceSourceIds: ["SRC066", "SRC067", "SRC078"],
  sourceIds: ["SRC066", "SRC067", "SRC078"],
  specs: { dof: "移动底盘 + 双 6 轴臂", payloadKg: "臂端按 ViperX/xArm 配置", speed: "按底盘配置", sensors: "相机/遥操作设备", compute: "工作站/机载计算按方案" },
  software: { ros: "项目/社区方案", ros2: "需迁移", sdk: "ACT/ALOHA 代码", sim: "研究代码为主" },
  researchEvidence: ["模仿学习和移动操作领域标志性开源方案。"],
  deploymentEvidence: ["科研价值强，落地需重新工程化。"],
  risks: ["不是整机商品；需要强集成能力和安全改造。"],
  scores: { research: 49, deployment: 25, overall: 74 },
  shortlistTags: ["科研平台"],
  purchaseChannels: ["自研集成采购"]
});

robot({
  id: "hello-stretch-3",
  name: "Hello Robot Stretch 3",
  vendor: "Hello Robot",
  category: "复合型机器人",
  formFactor: "移动操作科研平台",
  country: "美国",
  domesticPriority: false,
  officialUrl: "https://hello-robot.com/stretch-3-product",
  cnyAmount: usd(24950),
  cnyRange: "约 ¥18 万起，按官方美元价估算",
  originalPrice: "USD 24,950 起，按 2026-05-31 估算汇率 1 USD≈¥7.25",
  priceType: "官方美元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC062"],
  sourceIds: ["SRC061", "SRC062", "SRC063"],
  specs: { dof: "移动底盘 + 升降臂 + 末端执行器", payloadKg: "轻载家居操作", reachM: "适合桌面/柜面操作", sensors: "深度相机/激光雷达按版本" },
  software: { ros: "成熟 ROS 生态", ros2: "ROS2 支持线索", sdk: "Hello Robot SDK", sim: "HomeRobot/仿真生态" },
  researchEvidence: ["家庭移动操作和 HomeRobot 研究中使用频率高。"],
  deploymentEvidence: ["科研成熟但国内采购和售后较复杂。"],
  risks: ["进口采购、交期、维保和人民币总拥有成本需评估。"],
  scores: { research: 47, deployment: 28, overall: 75 },
  shortlistTags: ["科研平台"],
  purchaseChannels: ["官方购买/进口代理询价"]
});

robot({
  id: "pal-tiago",
  name: "PAL Robotics TIAGo",
  vendor: "PAL Robotics",
  category: "复合型机器人",
  formFactor: "移动操作科研平台",
  country: "西班牙",
  domesticPriority: false,
  officialUrl: "https://pal-robotics.com/robots/tiago/",
  cnyAmount: eur(48000),
  cnyRange: "约 ¥37.7 万起，按较早 fact sheet 48,000 欧元估算；当前配置需 PAL 正式报价",
  originalPrice: "PAL Robotics TIAGo ICRA fact sheet 列硬件配置 from EUR 48,000；资料年份较早，当前单/双臂、末端、传感器和服务包价格需正式询价。",
  priceType: "历史资料欧元价线索",
  priceConfidence: "low",
  priceSourceIds: ["SRC723"],
  sourceIds: ["SRC064"],
  specs: { dof: "移动底盘 + 单/双臂按配置", payloadKg: "按配置确认", sensors: "雷达/相机/力控按配置", compute: "按配置" },
  software: { ros: "成熟 ROS 生态", ros2: "需按版本确认", sdk: "PAL 平台接口", sim: "Gazebo/MoveIt" },
  researchEvidence: ["欧洲服务机器人和移动操作研究经典平台。"],
  deploymentEvidence: ["科研成熟，但国内采购和服务成本高。"],
  risks: ["价格高，交付和维保需代理确认。"],
  scores: { research: 45, deployment: 27, overall: 72 },
  shortlistTags: ["科研平台"],
  purchaseChannels: ["官方/代理询价"]
});

robot({
  id: "robotnik-rb-kairos",
  name: "Robotnik RB-KAIROS+",
  vendor: "Robotnik",
  category: "复合型机器人",
  formFactor: "工业移动底盘 + UR 机械臂",
  country: "西班牙",
  domesticPriority: false,
  officialUrl: "https://robotnik.eu/products/mobile-manipulators/rb-kairos/",
  cnyAmount: eur(50400),
  cnyRange: "约 ¥39.6 万起，按 RB-KAIROS 移动底盘海外渠道价估算；加机械臂完整方案需询价",
  originalPrice: "Generation Robots RB-KAIROS 页面列 EUR 50,400 起；RB-KAIROS+ 加 UR 机械臂、夹爪和安全组件需另行报价。",
  priceType: "底盘渠道欧元价估算",
  priceConfidence: "low",
  priceSourceIds: ["SRC722"],
  sourceIds: ["SRC065", "SRC046", "SRC047"],
  specs: { dof: "移动底盘 + UR 机械臂", payloadKg: "按 UR5e/UR10e 配置", speed: "按底盘配置", sensors: "雷达/相机/安全传感器按配置" },
  software: { ros: "ROS 工业生态", ros2: "按版本确认", sdk: "Robotnik/UR 接口", sim: "ROS/Gazebo" },
  researchEvidence: ["工业移动操作和仓储自动化研究常见形态。"],
  deploymentEvidence: ["更偏落地，适合真实项目验证。"],
  risks: ["进口总价高，国内售后和集成商需确认。"],
  scores: { research: 39, deployment: 39, overall: 78 },
  shortlistTags: ["落地项目"],
  purchaseChannels: ["官方/代理询价"]
});

robot({
  id: "realman-mobile-manipulator",
  name: "睿尔曼移动复合机器人",
  vendor: "睿尔曼 RealMan",
  category: "复合型机器人",
  formFactor: "移动底盘 + 轻量机械臂",
  officialUrl: "https://www.realman-robotics.com/",
  cnyAmount: eur(41599.95),
  cnyRange: "约 ¥32.7 万，按海外渠道 RM65 单臂移动复合机器人价估算；国内需询价",
  originalPrice: "MYBOTSHOP Realman Combound Robot Mobile manipulator RM65 single arm 页面列 EUR 41,599.95，按 2026-06-01 估算汇率 1 EUR≈¥7.85；国内配置和售后需正式确认。",
  priceType: "代理渠道欧元价估算",
  priceConfidence: "medium",
  priceSourceIds: ["SRC718"],
  sourceIds: ["SRC028", "SRC029"],
  specs: { dof: "移动底盘 + RM 系列机械臂", payloadKg: "按机械臂/底盘配置", speed: "按底盘配置", sensors: "雷达/相机按配置" },
  software: { ros: "官方/社区线索", ros2: "官方/社区线索", sdk: "睿尔曼 SDK", sim: "需确认" },
  researchEvidence: ["国产轻量移动操作组合，适合具身智能样机。"],
  deploymentEvidence: ["国内集成交付便利，适合试点项目。"],
  risks: ["组合规格和价格需正式报价。"],
  scores: { research: 38, deployment: 40, overall: 78 },
  shortlistTags: ["科研平台", "落地项目"],
  purchaseChannels: ["官网询价"]
});

robot({
  id: "unitree-go2-z1",
  name: "Unitree Go2 + Z1",
  vendor: "宇树科技 Unitree",
  category: "复合型机器人",
  formFactor: "四足平台 + 轻量机械臂",
  officialUrl: "https://www.unitree.com/cn/go2/",
  cnyAmount: usd(7299 + 6000),
  cnyRange: "约 ¥9.6 万起，按 Go2 Pro 教育渠道价 + Z1 渠道价粗估；完整组合需询价",
  originalPrice: "Sourcewell/STEMfinity 价格表列 Unitree Go2 Pro 和 Unitree Z1 Robotic Arms 教育渠道价线索；组合不含机械安装、末端、电源、安全和调试。",
  priceType: "组合教育渠道价粗估",
  priceConfidence: "low",
  priceSourceIds: ["SRC713"],
  sourceIds: ["SRC001", "SRC008", "SRC009", "SRC010", "SRC069"],
  specs: { dof: "四足 12 + 机械臂 6 轴", payloadKg: "臂端约 2-3 kg 级，平台按版本", speed: "Go2 平台约 5 m/s 级", endurance: "按电池和负载确认" },
  software: { ros: "Unitree/社区组合方案", ros2: "Unitree ROS2 生态", sdk: "Unitree SDK", sim: "MuJoCo/Isaac/Gazebo 社区方案" },
  researchEvidence: ["适合低成本四足移动操作、巡检交互和具身任务。"],
  deploymentEvidence: ["Go2 成本低，适合校园演示和原型试点。"],
  risks: ["轻量底盘加臂后重心和稳定性需实测。"],
  scores: { research: 43, deployment: 36, overall: 79 },
  shortlistTags: ["科研平台", "教学平台", "高性价比组合"],
  purchaseChannels: ["宇树官网组合询价"]
});

robot({
  id: "xarm-agilex-base",
  name: "xArm + AgileX 底盘组合",
  vendor: "UFACTORY / 松灵 AgileX",
  category: "复合型机器人",
  formFactor: "移动底盘 + xArm 机械臂",
  officialUrl: "https://www.ufactory.cc/xarm-collaborative-robot/",
  cnyAmount: aud(95000),
  cnyRange: "约 ¥45.1 万，按海外 AgileX Mobile Manipulator 整机渠道价估算；具体 xArm/底盘组合需正式报价",
  originalPrice: "Robots-Australia AgileX Mobile Manipulator 页面列 AUD 95,000，按 2026-06-01 估算汇率 1 AUD≈¥4.75；具体 xArm 型号、底盘、末端、传感器和集成服务会显著影响价格。",
  priceType: "代理渠道组合价线索",
  priceConfidence: "low",
  priceSourceIds: ["SRC738"],
  sourceIds: ["SRC018", "SRC020", "SRC021", "SRC034", "SRC038"],
  specs: { dof: "移动底盘 + 6/7 轴臂", payloadKg: "按 xArm 6/7 和底盘配置", speed: "按 Scout/Hunter/Tracer 配置", sensors: "雷达/相机按集成方案" },
  software: { ros: "xArm + AgileX ROS 生态", ros2: "xArm + AgileX ROS2 生态", sdk: "双厂商 SDK/ROS", sim: "MoveIt/Gazebo/Isaac" },
  researchEvidence: ["Mobile ALOHA 类方案的国产可采购组合路径。"],
  deploymentEvidence: ["可在国内分别采购和集成，适合学校自研平台。"],
  risks: ["需要较强集成能力；安全认证和系统维护责任需明确。"],
  scores: { research: 44, deployment: 35, overall: 79 },
  shortlistTags: ["科研平台", "高性价比组合"],
  purchaseChannels: ["两家官网/代理分别询价"]
});

robot({
  id: "turtlebot4-arm",
  name: "TurtleBot 4 + 轻量机械臂",
  vendor: "Robotis / 组合方案",
  category: "复合型机器人",
  formFactor: "教学移动底盘 + 轻量臂",
  country: "组合方案",
  domesticPriority: false,
  officialUrl: "https://www.robotis.us/turtlebot-4/",
  cnyAmount: usd(3479.09),
  cnyRange: "约 ¥25,200 起，按 TurtleBot 4 Standard + OpenMANIPULATOR-X 美元价粗估",
  originalPrice: "Clearpath TurtleBot 4 发布页列 Standard 发布价 USD 1,850；ROBOTIS OpenMANIPULATOR-X 官方商品页列 USD 1,629.09；组合不含安装适配件、控制集成和运保。",
  priceType: "组合公开价粗估",
  priceConfidence: "low",
  priceSourceIds: ["SRC664", "SRC666"],
  sourceIds: ["SRC079", "SRC068", "SRC030", "SRC032"],
  specs: { dof: "移动底盘 + 轻量机械臂", payloadKg: "轻载教学", speed: "按底盘配置", sensors: "雷达/相机按套装", compute: "Raspberry Pi/NUC 按版本" },
  software: { ros: "ROS/ROS2 教学生态成熟", ros2: "TurtleBot 4 ROS2 原生", sdk: "ROS2", sim: "Gazebo/Ignition" },
  researchEvidence: ["ROS2 教学和移动机器人课程非常常见，可扩展轻量操作。"],
  deploymentEvidence: ["适合课程和低成本原型，不适合高负载落地。"],
  risks: ["机械臂集成需要自研；采购渠道需单独确认。"],
  scores: { research: 37, deployment: 27, overall: 64 },
  shortlistTags: ["教学平台"],
  purchaseChannels: ["代理/套件采购"]
});

robot({
  id: "franka-mobile-base",
  name: "Franka + 移动底盘自研组合",
  vendor: "Franka / 自研组合",
  category: "复合型机器人",
  formFactor: "高精度机械臂 + 移动底盘",
  country: "组合方案",
  domesticPriority: false,
  officialUrl: "https://franka.de/research",
  cnyAmount: eur(29750 + 50400),
  cnyRange: "约 ¥62.9 万起，按 Franka Research 3 机械臂 + 参考移动底盘渠道价粗估；完整移动平台需正式报价",
  originalPrice: "Franka Research 3 采用 Funduinoshop EUR 29,750 渠道价；移动底盘参考 Robotnik RB-KAIROS EUR 50,400 起价作为量级估算。Franka 官方 Mobile FR3 Duo 是双臂移动平台，未公开整机价格，实际需代理/厂商按配置报价。",
  priceType: "组件渠道价粗估",
  priceConfidence: "low",
  priceSourceIds: ["SRC294", "SRC722", "SRC739", "SRC740"],
  sourceIds: ["SRC044", "SRC045", "SRC034", "SRC066"],
  specs: { dof: "移动底盘 + 7 轴力控臂", payloadKg: "Franka 3 kg + 底盘按配置", speed: "按底盘配置", sensors: "力控/视觉/雷达按集成方案" },
  software: { ros: "Franka + 底盘 ROS 生态", ros2: "需按版本集成", sdk: "libfranka + 底盘 SDK", sim: "MoveIt/Gazebo/Isaac" },
  researchEvidence: ["高端移动操作实验价值强，适合力控和精细操作研究。"],
  deploymentEvidence: ["成本高，落地性取决于集成和安全方案。"],
  risks: ["进口采购和系统集成复杂，不适合快速低成本试点。"],
  scores: { research: 47, deployment: 25, overall: 72 },
  shortlistTags: ["科研平台"],
  purchaseChannels: ["代理询价 + 自研集成"]
});

const academicLinks = {
  "ur5e": ["SRC082", "SRC083", "SRC087", "SRC089", "SRC090"],
  "ufactory-xarm-6": ["SRC066", "SRC067", "SRC082", "SRC089", "SRC093"],
  "ufactory-xarm-7": ["SRC066", "SRC067", "SRC082", "SRC089", "SRC093"],
  "dobot-cr5": ["SRC082", "SRC089", "SRC101"],
  "franka-research-3": ["SRC081", "SRC082", "SRC083", "SRC085", "SRC087", "SRC089", "SRC093"],
  "unitree-z1": ["SRC082", "SRC089", "SRC093", "SRC098"],
  "aubo-i5": ["SRC082", "SRC089", "SRC101"],
  "agilex-piper": ["SRC066", "SRC082", "SRC083", "SRC084", "SRC089"],
  "jaka-zu7": ["SRC082", "SRC089", "SRC101"],
  "realman-rm65": ["SRC082", "SRC083", "SRC089", "SRC092"],
  "kinova-gen3": ["SRC082", "SRC087", "SRC089", "SRC093"],
  "elite-ec66": ["SRC082", "SRC089", "SRC101"],
  "mycobot-320": ["SRC068", "SRC089", "SRC101"],
  "dobot-mg400": ["SRC089", "SRC101"],
  "mycobot-280": ["SRC068", "SRC089", "SRC101"],

  "unitree-g1": ["SRC096", "SRC097", "SRC098"],
  "unitree-h1": ["SRC096", "SRC097", "SRC098"],
  "agibot-a2": ["SRC083", "SRC084", "SRC092"],
  "ubtech-walker-s1": ["SRC096"],
  "unitree-r1-air": ["SRC096", "SRC097", "SRC098"],
  "fourier-gr1": ["SRC096"],
  "agibot-x2": ["SRC083", "SRC084", "SRC092"],
  "unitree-r1-d": ["SRC096", "SRC097", "SRC098"],
  "leju-kuavo": ["SRC055", "SRC096"],
  "fourier-gr2": ["SRC096"],
  "engineai-pm01": ["SRC096"],
  "robotera-star1": ["SRC096"],
  "booster-t1": ["SRC096"],
  "noetix-bumi": ["SRC096"],

  "unitree-go2": ["SRC094", "SRC095", "SRC097", "SRC098"],
  "unitree-b2": ["SRC094", "SRC095", "SRC097", "SRC098"],
  "unitree-a2": ["SRC094", "SRC095", "SRC097", "SRC098"],
  "unitree-b2-z1": ["SRC082", "SRC089", "SRC094", "SRC097", "SRC098"],
  "deeprobotics-x30": ["SRC094", "SRC095"],
  "deeprobotics-lite3": ["SRC094", "SRC095"],
  "deeprobotics-x20": ["SRC094", "SRC095"],
  "deeprobotics-lynx-m20": ["SRC094", "SRC095"],
  "limx-tron1": ["SRC094", "SRC095"],
  "unitree-go1": ["SRC094", "SRC095", "SRC097"],
  "xiaomi-cyberdog2": ["SRC094", "SRC095"],

  "agilex-cobot-magic": ["SRC066", "SRC083", "SRC084", "SRC089", "SRC092", "SRC093"],
  "agilex-limo-piper": ["SRC066", "SRC083", "SRC084", "SRC089", "SRC092", "SRC093"],
  "unitree-go2-z1": ["SRC082", "SRC089", "SRC093", "SRC094", "SRC097", "SRC098"],
  "xarm-agilex-base": ["SRC066", "SRC067", "SRC082", "SRC083", "SRC089", "SRC093"],
  "robotnik-rb-kairos": ["SRC082", "SRC089", "SRC091"],
  "realman-mobile-manipulator": ["SRC082", "SRC083", "SRC089", "SRC092", "SRC093"],
  "hello-stretch-3": ["SRC063", "SRC082", "SRC091", "SRC093"],
  "mobile-aloha": ["SRC066", "SRC067", "SRC086", "SRC093"],
  "pal-tiago": ["SRC082", "SRC089", "SRC091"],
  "franka-mobile-base": ["SRC081", "SRC082", "SRC083", "SRC087", "SRC089", "SRC091", "SRC093"],
  "hiwonder-jetauto-pro": ["SRC068", "SRC089"],
  "turtlebot4-arm": ["SRC068", "SRC089", "SRC091"],
  "hiwonder-jetrover-arm": ["SRC068", "SRC089"],
  "yahboom-rosmaster-x3-arm": ["SRC068", "SRC089"]
};

const academicNotes = {
  "franka-research-3": "新增 DROID、RoboMIND、RH20T、robomimic、ManiSkill、OpenVLA 等论文/数据集入口，Franka/Panda 仍是通用操作研究高频平台。",
  "ur5e": "新增 RoboMIND、MimicGen、ManiSkill 等操作研究入口，UR5e 常作为工业协作臂基准或数据采集平台。",
  "unitree-g1": "新增 Humanoid-Gym、Unitree RL Gym、Unitree MuJoCo 入口，可追踪人形强化学习、仿真和实机迁移生态。",
  "unitree-h1": "新增 Humanoid-Gym、Unitree RL Gym、Unitree MuJoCo 入口，可追踪 H1/G1 人形运动控制研究生态。",
  "agibot-a2": "新增 AgiBot World、RoboMIND 和 RoboTwin 入口，用于判断智元系平台在大规模具身数据与操作 Benchmark 中的出现情况。",
  "agibot-x2": "新增 AgiBot World、RoboMIND 和 RoboTwin 入口，用于判断智元系平台在大规模具身数据与操作 Benchmark 中的出现情况。",
  "unitree-go2": "新增 legged_gym、rsl_rl、Unitree RL Gym 和 MuJoCo 入口，补充四足强化学习、仿真到实机和 ROS2 研究链路。",
  "unitree-b2": "新增 legged_gym、rsl_rl、Unitree RL Gym 和 MuJoCo 入口，补充四足强化学习、仿真到实机和 ROS2 研究链路。",
  "unitree-a2": "新增 legged_gym、rsl_rl、Unitree RL Gym 和 MuJoCo 入口，补充四足强化学习、仿真到实机和 ROS2 研究链路。",
  "mobile-aloha": "新增 ALOHA、Mobile ALOHA、ACT 和 OpenVLA 入口，补齐低成本移动双臂操作的论文、代码和模型链路。",
  "hello-stretch-3": "新增 Open X-Embodiment、RoboCasa 和 OpenVLA 入口，补充家庭移动操作与 VLA 研究生态。",
  "agilex-cobot-magic": "新增 RoboMIND、AgiBot World、RoboTwin、ManiSkill 和 OpenVLA 入口，用于对照国产复合型平台的科研可复现生态。",
  "agilex-limo-piper": "新增 RoboMIND、AgiBot World、RoboTwin、ManiSkill 和 OpenVLA 入口，用于对照国产复合型平台的科研可复现生态。"
};

const sourceBundles = {
  armDev: ["SRC127", "SRC128", "SRC129", "SRC130", "SRC137", "SRC146", "SRC147", "SRC148"],
  armResearch: ["SRC133", "SRC134", "SRC139", "SRC141", "SRC143", "SRC145"],
  humanoidDev: ["SRC130", "SRC131", "SRC132", "SRC154"],
  quadrupedDev: ["SRC130", "SRC131", "SRC132", "SRC151"],
  mobileManipulation: ["SRC127", "SRC128", "SRC129", "SRC130", "SRC135", "SRC136", "SRC139", "SRC141", "SRC146", "SRC147", "SRC155"],
  dexterousEndEffectors: ["SRC137", "SRC138", "SRC143", "SRC144", "SRC145", "SRC148", "SRC149", "SRC156"],
  governmentProcurementArms: ["SRC075", "SRC152"],
  governmentProcurementHumanoids: ["SRC150", "SRC153"],
  governmentProcurementQuadrupeds: ["SRC074", "SRC151"],
  teachingCode: ["SRC068", "SRC125", "SRC126"],
  cnAcademicArms: ["SRC076", "SRC186", "SRC189"],
  cnAcademicHumanoids: ["SRC154", "SRC185", "SRC188"],
  cnAcademicQuadrupeds: ["SRC077", "SRC184"],
  cnAcademicMobileManipulation: ["SRC155", "SRC187", "SRC190"],
  concreteArmProcurement: ["SRC162", "SRC170", "SRC171"],
  concreteHumanoidProcurement: ["SRC157", "SRC158", "SRC159", "SRC160", "SRC161"],
  concreteQuadrupedProcurement: ["SRC164", "SRC165", "SRC166", "SRC172"],
  concreteMobileProcurement: ["SRC157", "SRC163", "SRC168", "SRC169"],
  concreteDexterousProcurement: ["SRC161", "SRC167"],
  unitreeGo2Community: ["SRC191", "SRC192", "SRC193", "SRC194"],
  agilexLimoEcosystem: ["SRC203", "SRC204", "SRC205", "SRC206", "SRC211", "SRC212"],
  cobotMagicResearch: ["SRC207", "SRC208", "SRC209", "SRC210"],
  helloStretchResearch: ["SRC216", "SRC217", "SRC218", "SRC225"],
  tiagoResearch: ["SRC219", "SRC220", "SRC221", "SRC222", "SRC223", "SRC224"],
  robotnikResearch: ["SRC213", "SRC214", "SRC215"],
  xarmChannels: ["SRC226", "SRC227", "SRC228"]
};

sourceBundles.simulationStack = ["SRC229", "SRC230", "SRC231", "SRC232", "SRC233", "SRC235", "SRC236"];
sourceBundles.vlaFoundation = ["SRC237", "SRC238", "SRC239", "SRC240"];
sourceBundles.humanoidFoundation = ["SRC234", "SRC237", "SRC238", "SRC239", "SRC240"];
sourceBundles.stretchHomeResearch = ["SRC241", "SRC242", "SRC243", "SRC244"];
sourceBundles.unitreeQuadrupedResearch = ["SRC245", "SRC246", "SRC247", "SRC248", "SRC249"];
sourceBundles.robotArmChannelSearch = ["SRC252", "SRC253", "SRC256", "SRC257", "SRC262"];
sourceBundles.humanoidChannelSearch = ["SRC250", "SRC251", "SRC258", "SRC260", "SRC261"];
sourceBundles.mobileChannelSearch = ["SRC259", "SRC264", "SRC265"];
sourceBundles.teachingChannelSearch = ["SRC254", "SRC255"];
sourceBundles.endEffectorProcurementSearch = ["SRC263"];
sourceBundles.openHumanoidBenchmarks = ["SRC296", "SRC297", "SRC298", "SRC299"];
sourceBundles.openQuadrupedBenchmarks = ["SRC300"];
sourceBundles.agibotDev = ["SRC266", "SRC267", "SRC268", "SRC269", "SRC270"];
sourceBundles.fourierDev = ["SRC271", "SRC272", "SRC273"];
sourceBundles.ubtechResearch = ["SRC274", "SRC275", "SRC276", "SRC277"];
sourceBundles.lejuResearch = ["SRC278", "SRC279"];
sourceBundles.engineaiDev = ["SRC280", "SRC281", "SRC282"];
sourceBundles.roboteraDev = ["SRC283", "SRC284", "SRC285", "SRC286"];
sourceBundles.galbotResearch = ["SRC287", "SRC288", "SRC289", "SRC290", "SRC291"];
sourceBundles.kinovaDeepLinks = ["SRC292", "SRC293"];
sourceBundles.frankaChannels = ["SRC294", "SRC295"];
sourceBundles.safetyStandards = ["SRC301", "SRC302", "SRC303", "SRC304", "SRC305"];
sourceBundles.visionSensors = ["SRC306", "SRC307", "SRC308", "SRC309", "SRC310", "SRC311"];
sourceBundles.forceTorqueSensors = ["SRC312", "SRC313", "SRC314", "SRC315", "SRC316"];
sourceBundles.edgeCompute = ["SRC317", "SRC318", "SRC319"];
sourceBundles.roboticsCourses = ["SRC320", "SRC321", "SRC322", "SRC323", "SRC324"];
sourceBundles.roboticsInfrastructure = ["SRC322", "SRC335"];
sourceBundles.auboDeepLinks = ["SRC325", "SRC326", "SRC327"];
sourceBundles.jakaDeepLinks = ["SRC328", "SRC329", "SRC330"];
sourceBundles.dobotDeepLinks = ["SRC331", "SRC332"];
sourceBundles.eliteDeepLinks = ["SRC333", "SRC334"];
sourceBundles.dexterousHandsExtended = ["SRC336", "SRC337", "SRC338", "SRC339", "SRC340", "SRC341", "SRC342", "SRC343", "SRC344"];
sourceBundles.mobileBasesExtended = ["SRC345", "SRC346", "SRC347", "SRC348", "SRC349", "SRC350"];
sourceBundles.robotDataExtended = ["SRC351", "SRC352", "SRC353", "SRC354", "SRC355", "SRC356", "SRC357", "SRC358", "SRC359", "SRC360"];
sourceBundles.industryTracking = ["SRC361", "SRC362", "SRC363", "SRC364", "SRC365"];
sourceBundles.rosNavigationStack = ["SRC366", "SRC367", "SRC368", "SRC369", "SRC370", "SRC371", "SRC372", "SRC373"];
sourceBundles.manipulationBenchmarks = ["SRC374", "SRC375", "SRC376", "SRC377", "SRC378", "SRC379", "SRC380", "SRC381"];
sourceBundles.tenderPlatforms = ["SRC382"];
sourceBundles.serviceRobotSafety = ["SRC383"];
sourceBundles.quadrupedGlobalBenchmarks = ["SRC384", "SRC385", "SRC386", "SRC387"];
sourceBundles.industryConferences = ["SRC388", "SRC389", "SRC392", "SRC393", "SRC394", "SRC395"];
sourceBundles.extraTenderPlatforms = ["SRC390", "SRC391"];
sourceBundles.roboticsAlgorithmTools = ["SRC396", "SRC397", "SRC398", "SRC399"];
sourceBundles.multiRobotScheduling = ["SRC400"];
sourceBundles.roboticsPaperVenues = ["SRC401", "SRC402", "SRC403", "SRC404", "SRC405", "SRC406", "SRC407", "SRC408"];
sourceBundles.extraManipulationBenchmarks = ["SRC409", "SRC410", "SRC411", "SRC412", "SRC413", "SRC414", "SRC425", "SRC426"];
sourceBundles.extraDexterousResearch = ["SRC427"];
sourceBundles.extraEmbodiedBenchmarks = ["SRC411", "SRC412", "SRC413", "SRC414", "SRC415"];
sourceBundles.extraHumanoidResearch = ["SRC416", "SRC417", "SRC418", "SRC419", "SRC420", "SRC421"];
sourceBundles.extraQuadrupedResearch = ["SRC422", "SRC423", "SRC424"];
sourceBundles.cnAcademicOrganizations = ["SRC428", "SRC429", "SRC430", "SRC431", "SRC432"];
sourceBundles.openSourceDiscovery = ["SRC440", "SRC441", "SRC442", "SRC443"];
sourceBundles.armOpenSourceDiscovery = ["SRC440", "SRC441", "SRC442", "SRC443", "SRC444"];
sourceBundles.quadrupedOpenSourceDiscovery = ["SRC440", "SRC441", "SRC442", "SRC443", "SRC445"];
sourceBundles.humanoidOpenSourceDiscovery = ["SRC440", "SRC441", "SRC442", "SRC443", "SRC446"];
sourceBundles.cnStandardsCertification = ["SRC447", "SRC448"];
sourceBundles.auboProcurementExtended = ["SRC449", "SRC461", "SRC470"];
sourceBundles.jakaProcurementExtended = ["SRC450", "SRC462", "SRC471"];
sourceBundles.eliteProcurementExtended = ["SRC451", "SRC463", "SRC472"];
sourceBundles.realmanProcurementExtended = ["SRC452", "SRC464", "SRC473"];
sourceBundles.unitreeZ1ProcurementExtended = ["SRC453", "SRC465", "SRC474"];
sourceBundles.deeproboticsProcurementExtended = ["SRC454", "SRC466", "SRC475"];
sourceBundles.unitreeGo2ProcurementExtended = ["SRC467"];
sourceBundles.limxProcurementExtended = ["SRC455"];
sourceBundles.fourierProcurementExtended = ["SRC456", "SRC476"];
sourceBundles.agibotProcurementExtended = ["SRC457", "SRC477"];
sourceBundles.lejuProcurementExtended = ["SRC458", "SRC478"];
sourceBundles.roboteraProcurementExtended = ["SRC459", "SRC479"];
sourceBundles.cobotMagicProcurementExtended = ["SRC460"];
sourceBundles.hiwonderProcurementExtended = ["SRC468", "SRC480"];
sourceBundles.yahboomProcurementExtended = ["SRC469", "SRC481"];
sourceBundles.concreteProcurementRound2Arms = ["SRC485"];
sourceBundles.concreteProcurementRound2Humanoids = ["SRC482", "SRC483", "SRC484", "SRC487"];
sourceBundles.concreteProcurementRound2Quadrupeds = ["SRC486"];
sourceBundles.concreteProcurementRound2Teaching = ["SRC488"];
sourceBundles.auboResearchExtended = ["SRC490", "SRC491"];
sourceBundles.dobotResearchExtended = ["SRC491"];
sourceBundles.jakaResearchExtended = ["SRC492", "SRC493"];
sourceBundles.realmanResearchExtended = ["SRC494", "SRC495"];
sourceBundles.mycobotResearchExtended = ["SRC489"];
sourceBundles.limxTron1Extended = ["SRC496"];
sourceBundles.engineaiPm01Extended = ["SRC497"];
sourceBundles.fourierGr2Extended = ["SRC498", "SRC499"];
sourceBundles.cyberdogExtended = ["SRC500"];
sourceBundles.turtlebot4Extended = ["SRC501", "SRC502"];
sourceBundles.deeproboticsModelExtended = ["SRC503", "SRC504"];
sourceBundles.yahboomRosmasterExtended = ["SRC505"];
sourceBundles.realmanMobileExtended = ["SRC506"];
sourceBundles.boosterResearchExtended = ["SRC507"];
sourceBundles.newManipulationResearch = ["SRC508", "SRC509", "SRC510", "SRC511", "SRC512", "SRC513", "SRC514", "SRC515", "SRC516"];
sourceBundles.newAgibotResearch = ["SRC517", "SRC518"];
sourceBundles.openletKuavoResearch = ["SRC519"];
sourceBundles.newG1HumanoidResearch = ["SRC520", "SRC521", "SRC522", "SRC523", "SRC524"];
sourceBundles.openHumanoidPlatformsRound2 = ["SRC525", "SRC526", "SRC527"];
sourceBundles.newQuadrupedResearchRound2 = ["SRC528", "SRC529", "SRC530", "SRC531", "SRC532", "SRC533"];
sourceBundles.newStretchResearchRound2 = ["SRC534", "SRC535", "SRC537"];
sourceBundles.newMobileManipulationResearch = ["SRC536", "SRC538", "SRC539"];
sourceBundles.importArmProcurementSearch = ["SRC541", "SRC542", "SRC543"];
sourceBundles.dobotProcurementSearchRound3 = ["SRC544", "SRC545"];
sourceBundles.teachingArmProcurementSearchRound3 = ["SRC546", "SRC547"];
sourceBundles.mobileManipulationProcurementSearchRound3 = ["SRC548", "SRC549"];
sourceBundles.dexterousProcurementSearchRound3 = ["SRC550"];
sourceBundles.boosterDevRound4 = ["SRC551", "SRC552", "SRC553"];
sourceBundles.engineaiDevRound4 = ["SRC554", "SRC555", "SRC556", "SRC557"];
sourceBundles.roboteraDevRound4 = ["SRC558", "SRC559", "SRC560", "SRC561"];
sourceBundles.ubtechDevRound4 = ["SRC562", "SRC563", "SRC564"];
sourceBundles.kuavoDevRound4 = ["SRC565", "SRC566"];
sourceBundles.noetixDevRound4 = ["SRC567", "SRC568", "SRC569"];
sourceBundles.agilexMobileManipulationRound5 = ["SRC570", "SRC571", "SRC572", "SRC573", "SRC574"];
sourceBundles.tiagoDocsRound5 = ["SRC575", "SRC576", "SRC577", "SRC578"];
sourceBundles.robotnikDocsRound5 = ["SRC579"];
sourceBundles.hiwonderDocsRound5 = ["SRC580", "SRC581", "SRC582", "SRC583", "SRC584"];
sourceBundles.yahboomDocsRound5 = ["SRC585", "SRC586"];
sourceBundles.dexterousHandsRound5 = ["SRC587", "SRC588", "SRC589", "SRC590", "SRC591", "SRC592", "SRC593"];
sourceBundles.safetyRound6Industrial = ["SRC594", "SRC595", "SRC600"];
sourceBundles.safetyRound6Service = ["SRC596", "SRC597", "SRC600"];
sourceBundles.safetyRound6Mobile = ["SRC598", "SRC599", "SRC600"];
sourceBundles.procurementOpsRound6 = ["SRC601", "SRC602", "SRC603", "SRC604", "SRC605", "SRC606"];
sourceBundles.sensorComputeRound6 = ["SRC607", "SRC608", "SRC609", "SRC610", "SRC611", "SRC612"];
sourceBundles.researchRound7Manipulation = ["SRC613", "SRC614", "SRC616", "SRC617", "SRC618", "SRC619", "SRC620", "SRC621", "SRC622", "SRC650", "SRC651", "SRC652", "SRC653"];
sourceBundles.researchRound7Humanoids = ["SRC623", "SRC624", "SRC625", "SRC626", "SRC627", "SRC628", "SRC629", "SRC630", "SRC631", "SRC632", "SRC633", "SRC654", "SRC655"];
sourceBundles.researchRound7Quadrupeds = ["SRC634", "SRC635", "SRC636", "SRC637", "SRC638", "SRC639", "SRC640", "SRC641", "SRC642", "SRC654", "SRC655"];
sourceBundles.researchRound7MobileManipulation = ["SRC613", "SRC614", "SRC615", "SRC620", "SRC643", "SRC644", "SRC645", "SRC646", "SRC647", "SRC648", "SRC649", "SRC650", "SRC653", "SRC654"];
sourceBundles.researchRound7ChineseAcademicDiscovery = ["SRC656", "SRC657", "SRC658"];
sourceBundles.priceRound8TeachingComposite = ["SRC659", "SRC660", "SRC661", "SRC664", "SRC665", "SRC666"];
sourceBundles.priceRound8Agilex = ["SRC662", "SRC663"];
sourceBundles.researchRound9Manipulation = ["SRC667", "SRC668", "SRC669", "SRC670", "SRC671", "SRC672", "SRC673", "SRC674", "SRC675", "SRC677", "SRC678", "SRC679", "SRC696"];
sourceBundles.researchRound9Humanoids = ["SRC676", "SRC680", "SRC681", "SRC682", "SRC683", "SRC684", "SRC685", "SRC686", "SRC687", "SRC688", "SRC689", "SRC690", "SRC691", "SRC703", "SRC704", "SRC705", "SRC706"];
sourceBundles.researchRound9Quadrupeds = ["SRC697", "SRC698", "SRC699", "SRC700", "SRC701", "SRC702"];
sourceBundles.researchRound9MobileManipulation = ["SRC667", "SRC668", "SRC669", "SRC670", "SRC671", "SRC672", "SRC679", "SRC683", "SRC684", "SRC685", "SRC686", "SRC687", "SRC688", "SRC690", "SRC691", "SRC697", "SRC698", "SRC699", "SRC703", "SRC705"];
sourceBundles.researchRound9ChineseDiscovery = ["SRC683", "SRC684", "SRC685", "SRC686", "SRC687", "SRC688", "SRC689", "SRC690", "SRC691", "SRC692", "SRC693", "SRC694", "SRC695"];
sourceBundles.researchRound9UnitreeG1 = ["SRC520", "SRC521", "SRC522", "SRC523", "SRC524", "SRC680", "SRC681", "SRC682"];
sourceBundles.researchRound9FourierGR = ["SRC676", "SRC680", "SRC681", "SRC682", "SRC703", "SRC704", "SRC705", "SRC706"];
sourceBundles.researchRound9Go2Composite = ["SRC697", "SRC698", "SRC699", "SRC701", "SRC702"];
sourceBundles.priceRound10Arms = ["SRC707", "SRC708", "SRC709", "SRC710", "SRC714", "SRC715", "SRC716", "SRC717"];
sourceBundles.priceRound10Humanoids = ["SRC719", "SRC720", "SRC721", "SRC724"];
sourceBundles.priceRound10Quadrupeds = ["SRC711", "SRC712", "SRC713"];
sourceBundles.priceRound10Mobile = ["SRC718", "SRC722", "SRC723", "SRC725"];
sourceBundles.priceRound11Arms = ["SRC726"];
sourceBundles.priceRound11Humanoids = ["SRC732", "SRC733", "SRC734"];
sourceBundles.priceRound11Quadrupeds = ["SRC727", "SRC728", "SRC729", "SRC730", "SRC731"];
sourceBundles.priceRound11Mobile = ["SRC735", "SRC736"];
sourceBundles.priceRound12Quadrupeds = ["SRC737"];
sourceBundles.priceRound12Mobile = ["SRC738", "SRC739", "SRC740", "SRC741"];
sourceBundles.researchRound13Humanoids = ["SRC742", "SRC743", "SRC744", "SRC745", "SRC746", "SRC747", "SRC748", "SRC749"];
sourceBundles.researchRound13Quadrupeds = ["SRC749", "SRC750", "SRC751", "SRC752", "SRC753", "SRC754", "SRC755", "SRC756", "SRC757"];
sourceBundles.researchRound13Manipulation = ["SRC758", "SRC759", "SRC760", "SRC761", "SRC762", "SRC763", "SRC767", "SRC771"];
sourceBundles.researchRound13MobileManipulation = ["SRC756", "SRC761", "SRC762", "SRC763", "SRC764", "SRC765", "SRC766", "SRC767"];
sourceBundles.researchRound13ChineseAcademic = ["SRC768", "SRC769", "SRC770", "SRC772", "SRC773", "SRC774"];
sourceBundles.researchRound13UnitreeG1 = ["SRC742", "SRC743", "SRC744", "SRC745", "SRC746", "SRC747", "SRC748", "SRC749"];
sourceBundles.researchRound13Go2 = ["SRC749", "SRC750", "SRC751", "SRC752", "SRC753", "SRC754", "SRC755", "SRC756", "SRC757"];
sourceBundles.researchRound13Franka = ["SRC758", "SRC759", "SRC760", "SRC762", "SRC763"];
sourceBundles.researchRound13UnifiedControl = ["SRC761", "SRC762", "SRC763", "SRC767"];
sourceBundles.researchRound14AcademicDiscovery = ["SRC775", "SRC779", "SRC780", "SRC781", "SRC795", "SRC796", "SRC799"];
sourceBundles.researchRound14HumanoidDiscovery = ["SRC776", "SRC782", "SRC788", "SRC790", "SRC791", "SRC793", "SRC797", "SRC798"];
sourceBundles.researchRound14QuadrupedDiscovery = ["SRC777", "SRC783", "SRC790", "SRC791"];
sourceBundles.researchRound14ManipulationDiscovery = ["SRC778", "SRC779", "SRC800", "SRC801", "SRC802", "SRC803", "SRC804"];
sourceBundles.researchRound14MobileDiscovery = ["SRC787", "SRC789", "SRC805", "SRC806"];
sourceBundles.researchRound14OpenRobotics = ["SRC785", "SRC786", "SRC818"];
sourceBundles.researchRound14ChineseInstitutions = ["SRC790", "SRC791", "SRC792", "SRC793", "SRC794"];
sourceBundles.researchRound14OpenHardwareArms = ["SRC800", "SRC801", "SRC802", "SRC803", "SRC804"];
sourceBundles.researchRound14OpenHardwareHumanoids = ["SRC807", "SRC808", "SRC809", "SRC810", "SRC811", "SRC812", "SRC813"];
sourceBundles.researchRound14SoftwareStack = ["SRC814", "SRC815", "SRC816", "SRC817"];
sourceBundles.researchRound15Policy = ["SRC819", "SRC820", "SRC821", "SRC822"];
sourceBundles.researchRound15ProcurementPlatforms = ["SRC823", "SRC824", "SRC825", "SRC826", "SRC827", "SRC828", "SRC829", "SRC830"];
sourceBundles.researchRound15PatentSearch = ["SRC831", "SRC832", "SRC833"];
sourceBundles.researchRound15Standards = ["SRC834", "SRC835", "SRC836", "SRC837", "SRC838", "SRC839"];
sourceBundles.researchRound15Certification = ["SRC840", "SRC841"];
sourceBundles.researchRound15Industry = ["SRC842", "SRC843", "SRC844"];
sourceBundles.researchRound15ImportCompliance = ["SRC845"];
sourceBundles.researchRound15ArmCompliance = ["SRC837", "SRC838", "SRC840", "SRC841", "SRC845"];
sourceBundles.researchRound15MobileCompliance = ["SRC838", "SRC839", "SRC840", "SRC841", "SRC845"];
sourceBundles.researchRound16ChineseLabs = ["SRC846", "SRC847", "SRC848", "SRC849", "SRC850", "SRC851", "SRC852", "SRC853"];
sourceBundles.researchRound16ManipulationProjects = ["SRC854", "SRC855", "SRC856", "SRC857", "SRC858", "SRC859", "SRC862", "SRC863"];
sourceBundles.researchRound16MobileManipulationProjects = ["SRC853", "SRC860", "SRC861"];
sourceBundles.researchRound16HumanoidProjects = ["SRC849", "SRC864", "SRC865", "SRC866", "SRC867", "SRC868", "SRC869", "SRC870", "SRC871", "SRC872", "SRC873"];
sourceBundles.researchRound16QuadrupedProjects = ["SRC874", "SRC875", "SRC876", "SRC877", "SRC878", "SRC879"];
sourceBundles.researchRound16DexterousProjects = ["SRC857", "SRC858", "SRC859", "SRC862", "SRC863"];
sourceBundles.researchRound16UnitreeG1 = ["SRC864", "SRC865", "SRC866", "SRC869", "SRC870", "SRC871", "SRC872", "SRC873"];
sourceBundles.researchRound16UnitreeH1 = ["SRC865", "SRC866", "SRC867", "SRC868", "SRC869", "SRC870"];
sourceBundles.researchRound16Go2 = ["SRC874", "SRC875"];
sourceBundles.researchRound17ArmLifecycle = ["SRC880", "SRC881", "SRC882", "SRC883", "SRC889", "SRC890", "SRC891", "SRC892", "SRC893", "SRC894", "SRC898", "SRC899", "SRC904", "SRC911", "SRC912"];
sourceBundles.researchRound17MobileLifecycle = ["SRC884", "SRC885", "SRC886", "SRC887", "SRC895", "SRC896", "SRC897", "SRC900", "SRC901", "SRC902", "SRC903", "SRC905", "SRC906", "SRC907", "SRC908", "SRC909", "SRC910"];
sourceBundles.researchRound17BatterySafety = ["SRC900", "SRC905", "SRC906", "SRC907", "SRC909", "SRC910"];
sourceBundles.researchRound17LabSafety = ["SRC904", "SRC905", "SRC908", "SRC911", "SRC912"];
sourceBundles.researchRound17UnitreeOps = ["SRC884", "SRC885", "SRC886", "SRC887", "SRC888"];
sourceBundles.researchRound17DobotOps = ["SRC889", "SRC890", "SRC891"];
sourceBundles.researchRound17TeachingArmOps = ["SRC893", "SRC898", "SRC899"];
sourceBundles.researchRound17MobileManipulationOps = ["SRC895", "SRC896", "SRC897", "SRC900", "SRC901", "SRC902", "SRC903"];
sourceBundles.researchRound18Accessories = ["SRC913", "SRC914", "SRC915", "SRC916", "SRC917", "SRC918", "SRC919"];
sourceBundles.researchRound18Calibration = ["SRC920", "SRC921", "SRC922", "SRC923", "SRC924", "SRC925", "SRC926"];
sourceBundles.researchRound18Insurance = ["SRC927", "SRC928", "SRC929", "SRC930", "SRC931", "SRC932", "SRC933", "SRC934", "SRC935"];
sourceBundles.researchRound18ArmAccessories = ["SRC913", "SRC914", "SRC915", "SRC916", "SRC917", "SRC918"];
sourceBundles.researchRound18MobileAccessories = ["SRC919"];
sourceBundles.researchRound18MobileCalibration = ["SRC924", "SRC925", "SRC926"];
sourceBundles.researchRound19CoreComponents = ["SRC936", "SRC937", "SRC938", "SRC939", "SRC940", "SRC941", "SRC942"];
sourceBundles.researchRound19Metrology = ["SRC943", "SRC944", "SRC945", "SRC946", "SRC947", "SRC948", "SRC949", "SRC950"];
sourceBundles.researchRound19LiabilityInsurance = ["SRC951", "SRC952"];
sourceBundles.researchRound20Encoders = ["SRC953", "SRC954", "SRC955", "SRC956", "SRC957", "SRC958", "SRC959", "SRC960"];
sourceBundles.researchRound20PublicLiability = ["SRC961", "SRC962", "SRC963", "SRC964", "SRC965", "SRC966", "SRC967"];
sourceBundles.researchRound21TorqueSensors = ["SRC968", "SRC969", "SRC970", "SRC971", "SRC972", "SRC973", "SRC974", "SRC975", "SRC976", "SRC977"];
sourceBundles.researchRound21EmployerSchoolLiability = ["SRC978", "SRC979", "SRC980", "SRC981", "SRC982", "SRC983", "SRC984"];
sourceBundles.researchRound22DataPrivacy = ["SRC985", "SRC987", "SRC990", "SRC991", "SRC992", "SRC998"];
sourceBundles.researchRound22Cybersecurity = ["SRC986", "SRC993", "SRC994", "SRC995", "SRC996"];
sourceBundles.researchRound22AiRisk = ["SRC997"];
sourceBundles.researchRound22CampusSafety = ["SRC988", "SRC989"];
sourceBundles.researchRound23VoiceBiometricPrivacy = ["SRC999", "SRC1002", "SRC1003"];
sourceBundles.researchRound23FaceBiometricPrivacy = ["SRC999", "SRC1000", "SRC1001", "SRC1003"];
sourceBundles.researchRound23AuditRemoteAccess = ["SRC1004", "SRC1005", "SRC1006", "SRC1007", "SRC1008"];
sourceBundles.researchRound23UnitreeOpenResearch = ["SRC1009", "SRC1010", "SRC1011"];
sourceBundles.researchRound23HumanoidResearch = ["SRC1012", "SRC1013", "SRC1014", "SRC1015", "SRC1016"];
sourceBundles.researchRound23QuadrupedResearch = ["SRC1017", "SRC1018", "SRC1019", "SRC1020"];
sourceBundles.researchRound23MobileManipulationResearch = ["SRC1021", "SRC1022", "SRC1025"];
sourceBundles.researchRound23EmbodiedData = ["SRC1023", "SRC1024", "SRC1026"];
sourceBundles.researchRound24Noetix = ["SRC1027"];
sourceBundles.researchRound24DeepRobotics = ["SRC1028", "SRC1029", "SRC1030", "SRC1031"];
sourceBundles.researchRound24RobotEra = ["SRC1032", "SRC1033", "SRC1034", "SRC1035"];
sourceBundles.researchRound24AgilexPiper = ["SRC1036"];
sourceBundles.researchRound24TeachingComposite = ["SRC1037", "SRC1038", "SRC1039"];
sourceBundles.researchRound24RealMan = ["SRC1040", "SRC1041"];
sourceBundles.researchRound25SimulationBenchmarks = ["SRC1042", "SRC1043", "SRC1044", "SRC1045", "SRC1046", "SRC1053"];
sourceBundles.researchRound25EmbodiedBenchmarks = ["SRC1047", "SRC1048", "SRC1049", "SRC1055", "SRC1056", "SRC1057"];
sourceBundles.researchRound25RealRobotBenchmarks = ["SRC1050", "SRC1051", "SRC1052", "SRC1054"];
sourceBundles.researchRound25AcademicLabs = ["SRC1058", "SRC1059", "SRC1060", "SRC1061", "SRC1062", "SRC1063"];
sourceBundles.researchRound25ManipulationAcademic = [
  ...sourceBundles.researchRound25SimulationBenchmarks,
  ...sourceBundles.researchRound25RealRobotBenchmarks,
  ...sourceBundles.researchRound25AcademicLabs
];
sourceBundles.researchRound25MobileEmbodiedAcademic = [
  ...sourceBundles.researchRound25EmbodiedBenchmarks,
  "SRC1052",
  "SRC1058",
  "SRC1059",
  "SRC1063"
];
sourceBundles.researchRound25LeggedAcademic = ["SRC1042", "SRC1043", "SRC1053", "SRC1060", "SRC1061", "SRC1062", "SRC1063"];
sourceBundles.researchRound26FrankaChannels = ["SRC1064", "SRC1065"];
sourceBundles.researchRound26KinovaChannels = ["SRC1066"];
sourceBundles.researchRound26UnitreeIndustryChannels = ["SRC1067", "SRC1068", "SRC1069", "SRC1070", "SRC1071", "SRC1072", "SRC1073", "SRC1078", "SRC1079"];
sourceBundles.researchRound26CyberDogChannels = ["SRC1074", "SRC1075", "SRC1076", "SRC1077", "SRC1080"];
sourceBundles.researchRound27ArmDeploymentCases = ["SRC1081", "SRC1082", "SRC1083"];
sourceBundles.researchRound27QuadrupedDeploymentCases = ["SRC1084", "SRC1085", "SRC1086", "SRC1092", "SRC1093", "SRC1094"];
sourceBundles.researchRound27HumanoidDeploymentCases = ["SRC1087", "SRC1088"];
sourceBundles.researchRound27MobileManipulatorDeploymentCases = ["SRC1089", "SRC1090", "SRC1091", "SRC1095"];
sourceBundles.researchRound28ManipulationLearning = ["SRC1096", "SRC1097", "SRC1098", "SRC1099", "SRC1100", "SRC1101", "SRC1102", "SRC1105", "SRC1108", "SRC1109", "SRC1110", "SRC1111"];
sourceBundles.researchRound28MobileManipulation = ["SRC1102", "SRC1103", "SRC1104", "SRC1105", "SRC1106", "SRC1107", "SRC1110", "SRC1111"];
sourceBundles.researchRound28HumanoidBenchmarks = ["SRC1112", "SRC1113", "SRC1118", "SRC1119", "SRC1120"];
sourceBundles.researchRound28QuadrupedLocomotion = ["SRC1114", "SRC1115", "SRC1116", "SRC1117", "SRC1120"];
sourceBundles.researchRound28EmbodiedAgentBenchmarks = ["SRC1118", "SRC1119", "SRC1120"];
sourceBundles.researchRound29EmbodiedTrainingProcurement = ["SRC1121", "SRC1122", "SRC1123", "SRC1124"];
sourceBundles.researchRound29ArmTrainingProcurement = ["SRC1125", "SRC1126", "SRC1127", "SRC1133"];
sourceBundles.researchRound29HumanoidProcurement = ["SRC1128", "SRC1129", "SRC1132"];
sourceBundles.researchRound29QuadrupedProcurement = ["SRC1130", "SRC1131"];
sourceBundles.researchRound29MobileProcurement = ["SRC1121", "SRC1124", "SRC1127", "SRC1133"];
sourceBundles.researchRound30UnitreeOfficialSupport = ["SRC1134"];
sourceBundles.researchRound30UnitreeHumanoidDocs = ["SRC1134", "SRC1135", "SRC1137"];
sourceBundles.researchRound30UnitreeQuadrupedDocs = ["SRC1134", "SRC1136", "SRC1138"];
sourceBundles.researchRound30UnitreeArmDocs = ["SRC1134", "SRC1139"];
sourceBundles.researchRound30DeepRoboticsOfficialDocs = ["SRC1140", "SRC1141", "SRC1142"];
sourceBundles.researchRound30Lite3OfficialDocs = ["SRC1140", "SRC1141", "SRC1142", "SRC1143", "SRC1144"];
sourceBundles.researchRound31VlaFoundation = ["SRC1145", "SRC1146", "SRC1147", "SRC1149", "SRC1150", "SRC1151", "SRC1152", "SRC1153", "SRC1155", "SRC1157"];
sourceBundles.researchRound31ManipulationData = ["SRC1147", "SRC1149", "SRC1150", "SRC1151", "SRC1152", "SRC1153", "SRC1154", "SRC1155", "SRC1157"];
sourceBundles.researchRound31HumanoidResearch = ["SRC1147", "SRC1148", "SRC1150", "SRC1151", "SRC1152", "SRC1153", "SRC1157", "SRC1165"];
sourceBundles.researchRound31QuadrupedResearch = ["SRC1158", "SRC1159", "SRC1160", "SRC1161", "SRC1164"];
sourceBundles.researchRound31MobileManipulationResearch = ["SRC1147", "SRC1149", "SRC1150", "SRC1151", "SRC1152", "SRC1153", "SRC1155", "SRC1157", "SRC1162", "SRC1163"];
sourceBundles.researchRound31OpenArmTeaching = ["SRC1149", "SRC1156", "SRC1157"];
sourceBundles.researchRound32HumanoidProcurementContracts = ["SRC1166", "SRC1167", "SRC1168"];
sourceBundles.researchRound32QuadrupedProcurementContracts = ["SRC1169", "SRC1170"];
sourceBundles.researchRound32ArmTeachingProcurement = ["SRC1171", "SRC1172"];
sourceBundles.researchRound32NoetixDev = ["SRC1173", "SRC1174"];
sourceBundles.researchRound32LimxDev = ["SRC1175"];
sourceBundles.researchRound32CyberDogDev = ["SRC1176"];
sourceBundles.researchRound32DeepRoboticsDev = ["SRC1177"];
sourceBundles.researchRound32BoosterDev = ["SRC1178", "SRC1179"];
sourceBundles.researchRound33MyCobot320 = ["SRC1180", "SRC1181"];
sourceBundles.researchRound33EngineAI = ["SRC1182", "SRC1183"];
sourceBundles.researchRound33Fourier = ["SRC1184", "SRC1185"];
sourceBundles.researchRound33Ubtech = ["SRC1186"];
sourceBundles.researchRound33Agibot = ["SRC1187"];
sourceBundles.researchRound33Tiago = ["SRC1188", "SRC1189", "SRC1190"];
sourceBundles.researchRound33Robotnik = ["SRC1191", "SRC1192"];
sourceBundles.researchRound33RobotEra = ["SRC1193"];
sourceBundles.researchRound34ManipulationAcademic = ["SRC1194", "SRC1195", "SRC1196", "SRC1197"];
sourceBundles.researchRound34MobileSemanticNavigation = ["SRC1198", "SRC1199", "SRC1200", "SRC1201", "SRC1202", "SRC1203"];
sourceBundles.researchRound34LeggedControl = ["SRC1204", "SRC1205", "SRC1206", "SRC1211"];
sourceBundles.researchRound34HumanoidControl = ["SRC1206", "SRC1207", "SRC1208"];
sourceBundles.researchRound34StretchCommunity = ["SRC1209", "SRC1210"];
sourceBundles.researchRound35EmbodiedFoundation = ["SRC1212", "SRC1213", "SRC1220"];
sourceBundles.researchRound35ManipulationToolkits = ["SRC1214", "SRC1217", "SRC1220"];
sourceBundles.researchRound35NavigationToolkits = ["SRC1218", "SRC1220"];
sourceBundles.researchRound35HumanoidToolkits = ["SRC1215", "SRC1216", "SRC1219", "SRC1220"];
sourceBundles.researchRound36UnitreeOfficialShop = ["SRC1221", "SRC1222", "SRC1223", "SRC1224", "SRC1225", "SRC1226"];
sourceBundles.researchRound36AgilexEducationChannels = ["SRC1227", "SRC1228"];
sourceBundles.researchRound36TeachingCompositeOfficialPrices = ["SRC1230", "SRC1231", "SRC1232", "SRC1233"];
sourceBundles.researchRound36DobotEducationChannel = ["SRC1229"];
sourceBundles.researchRound37OpenVlaFinetune = ["SRC1234", "SRC1235", "SRC1236", "SRC1242", "SRC1243"];
sourceBundles.researchRound37PiFoundation = ["SRC1237", "SRC1238"];
sourceBundles.researchRound37ChineseVla = ["SRC1239", "SRC1240", "SRC1241", "SRC1244", "SRC1245", "SRC1246", "SRC1253", "SRC1254", "SRC1255", "SRC1256", "SRC1257", "SRC1258", "SRC1263", "SRC1264"];
sourceBundles.researchRound37LongHorizonManipulation = ["SRC1247", "SRC1248", "SRC1259", "SRC1260", "SRC1261", "SRC1262"];
sourceBundles.researchRound37NavigationFoundation = ["SRC1249", "SRC1250", "SRC1251", "SRC1252"];
sourceBundles.researchRound37ManipulationModels = [
  ...sourceBundles.researchRound37OpenVlaFinetune,
  ...sourceBundles.researchRound37PiFoundation,
  ...sourceBundles.researchRound37ChineseVla,
  ...sourceBundles.researchRound37LongHorizonManipulation
];
sourceBundles.researchRound37HumanoidModels = [
  ...sourceBundles.researchRound37PiFoundation,
  ...sourceBundles.researchRound37ChineseVla,
  "SRC1255",
  "SRC1256",
  "SRC1257",
  "SRC1258",
  "SRC1259",
  "SRC1260"
];
sourceBundles.researchRound37MobileModels = [
  ...sourceBundles.researchRound37OpenVlaFinetune,
  ...sourceBundles.researchRound37PiFoundation,
  ...sourceBundles.researchRound37ChineseVla,
  ...sourceBundles.researchRound37LongHorizonManipulation,
  ...sourceBundles.researchRound37NavigationFoundation
];
sourceBundles.researchRound38DexterousOperation = ["SRC1265", "SRC1266", "SRC1267", "SRC1268", "SRC1269", "SRC1270"];
sourceBundles.researchRound38BimanualMobile = ["SRC1271", "SRC1272", "SRC1273"];
sourceBundles.researchRound38AudioVisualOperation = ["SRC1274", "SRC1275", "SRC1276"];
sourceBundles.researchRound38GalaxeaVla = ["SRC1277", "SRC1278", "SRC1279", "SRC1280", "SRC1281"];
sourceBundles.researchRound38QuadrupedManipulation = ["SRC1282", "SRC1283", "SRC1284", "SRC1285"];
sourceBundles.researchRound38LongHorizonReasoning = ["SRC1286", "SRC1287", "SRC1288", "SRC1289"];
sourceBundles.researchRound38ArmAcademic = [
  ...sourceBundles.researchRound38DexterousOperation,
  ...sourceBundles.researchRound38AudioVisualOperation,
  ...sourceBundles.researchRound38LongHorizonReasoning
];
sourceBundles.researchRound38HumanoidAcademic = [
  ...sourceBundles.researchRound38DexterousOperation,
  ...sourceBundles.researchRound38GalaxeaVla,
  ...sourceBundles.researchRound38LongHorizonReasoning
];
sourceBundles.researchRound38QuadrupedAcademic = [
  ...sourceBundles.researchRound38QuadrupedManipulation,
  ...sourceBundles.researchRound38LongHorizonReasoning
];
sourceBundles.researchRound38CompositeAcademic = [
  ...sourceBundles.researchRound38DexterousOperation,
  ...sourceBundles.researchRound38BimanualMobile,
  ...sourceBundles.researchRound38AudioVisualOperation,
  ...sourceBundles.researchRound38GalaxeaVla,
  ...sourceBundles.researchRound38QuadrupedManipulation,
  ...sourceBundles.researchRound38LongHorizonReasoning
];
sourceBundles.researchRound39ManipulationAcademic = ["SRC1290", "SRC1291", "SRC1292", "SRC1293"];
sourceBundles.researchRound39HumanoidAcademic = ["SRC1292", "SRC1293", "SRC1294", "SRC1295"];
sourceBundles.researchRound39CompositeAcademic = ["SRC1290", "SRC1291", "SRC1292", "SRC1293"];
sourceBundles.researchRound39ProcurementArms = ["SRC1296"];
sourceBundles.researchRound39ProcurementHumanoids = ["SRC1298", "SRC1299", "SRC1300", "SRC1303", "SRC1305"];
sourceBundles.researchRound39ProcurementQuadrupeds = ["SRC1299", "SRC1301"];
sourceBundles.researchRound39ProcurementComposite = ["SRC1297", "SRC1299", "SRC1302", "SRC1303", "SRC1304"];
sourceBundles.researchRound40ProcurementArms = ["SRC1306"];
sourceBundles.researchRound40ProcurementHumanoids = ["SRC1309", "SRC1311", "SRC1313", "SRC1314", "SRC1315"];
sourceBundles.researchRound40ProcurementQuadrupeds = ["SRC1308", "SRC1310", "SRC1311"];
sourceBundles.researchRound40ProcurementComposite = ["SRC1307", "SRC1311", "SRC1312", "SRC1313"];
sourceBundles.researchRound41BoosterOfficial = ["SRC1316"];
sourceBundles.researchRound41EngineAiOfficial = ["SRC1317", "SRC1318"];
sourceBundles.researchRound41RobotEraOfficial = ["SRC1319", "SRC1320"];
sourceBundles.researchRound41LimxOfficial = ["SRC1321", "SRC1322", "SRC1323", "SRC1324"];
sourceBundles.researchRound41CyberDogOfficial = ["SRC1325", "SRC1326", "SRC1327"];
sourceBundles.researchRound41RealManOfficial = ["SRC1328", "SRC1329", "SRC1330", "SRC1331"];
sourceBundles.researchRound41RobotnikOfficial = ["SRC1332", "SRC1333", "SRC1334"];
sourceBundles.researchRound42BimanualMobile = ["SRC1335", "SRC1340"];
sourceBundles.researchRound42LowCostMobile = ["SRC1336", "SRC1337"];
sourceBundles.researchRound42DexterousTactile = ["SRC1338", "SRC1339"];
sourceBundles.researchRound42LeggedHumanoidLabs = ["SRC1341", "SRC1342", "SRC1343", "SRC1344"];
sourceBundles.researchRound42ChineseLabs = ["SRC1344", "SRC1345"];
sourceBundles.researchRound42GeneralRoboticsLabs = ["SRC1340", "SRC1345", "SRC1346"];
sourceBundles.researchRound43AcademicIndexes = ["SRC1347", "SRC1348", "SRC1349", "SRC1350", "SRC1351"];
sourceBundles.researchRound43ProcurementPlatforms = ["SRC1352", "SRC1353", "SRC1354", "SRC1355", "SRC1356", "SRC1357"];
sourceBundles.researchRound43IndustrialChannels = ["SRC1358", "SRC1359", "SRC1360", "SRC1361", "SRC1372"];
sourceBundles.researchRound43ArmChannels = ["SRC1358", "SRC1360", "SRC1372"];
sourceBundles.researchRound43QuadrupedChannels = ["SRC1359", "SRC1361"];
sourceBundles.researchRound43RosDevOps = ["SRC1362", "SRC1363", "SRC1364", "SRC1370", "SRC1371"];
sourceBundles.researchRound43OpenSourceDiscovery = ["SRC1365", "SRC1366", "SRC1367", "SRC1368", "SRC1369", "SRC1370", "SRC1371"];
sourceBundles.researchRound43ArmOpenSource = ["SRC1366", "SRC1367", "SRC1370", "SRC1371"];
sourceBundles.researchRound43MobileOpenSource = ["SRC1365", "SRC1366", "SRC1367", "SRC1370", "SRC1371"];
sourceBundles.researchRound43HumanoidOpenSource = ["SRC1367", "SRC1368", "SRC1370", "SRC1371"];
sourceBundles.researchRound43LeggedOpenSource = ["SRC1368", "SRC1369", "SRC1370", "SRC1371"];
sourceBundles.researchRound43ResearchInstitutes = ["SRC1373", "SRC1374", "SRC1375", "SRC1376"];
sourceBundles.researchRound43IndustryMedia = ["SRC1377"];
sourceBundles.researchRound44IpStandards = ["SRC1378", "SRC1379", "SRC1380", "SRC1381", "SRC1382", "SRC1383"];
sourceBundles.researchRound44ModelDataCn = ["SRC1384", "SRC1385"];
sourceBundles.researchRound44CnOpenSource = ["SRC1386", "SRC1387"];
sourceBundles.researchRound44CnCourses = ["SRC1388", "SRC1389", "SRC1390", "SRC1391"];
sourceBundles.researchRound44GlobalCourses = ["SRC1392", "SRC1393", "SRC1394"];
sourceBundles.researchRound44IndustryAssociations = ["SRC1395", "SRC1396"];
sourceBundles.researchRound44PublicEducation = ["SRC1397"];
sourceBundles.researchRound45AcademicIndexes = ["SRC1398", "SRC1399", "SRC1400", "SRC1401", "SRC1402", "SRC1403", "SRC1404", "SRC1405", "SRC1406"];
sourceBundles.researchRound45ResearchLabs = ["SRC1407", "SRC1408", "SRC1409", "SRC1410", "SRC1411", "SRC1412", "SRC1413", "SRC1414", "SRC1415"];
sourceBundles.researchRound45ManipulationProjects = ["SRC1416", "SRC1417", "SRC1418", "SRC1419", "SRC1420", "SRC1421", "SRC1422", "SRC1423", "SRC1424", "SRC1425", "SRC1427", "SRC1428"];
sourceBundles.researchRound45HumanoidProjects = ["SRC1400", "SRC1402", "SRC1404", "SRC1423", "SRC1426"];
sourceBundles.researchRound45QuadrupedProjects = ["SRC1400", "SRC1411", "SRC1426"];
sourceBundles.researchRound45MobileProjects = ["SRC1417", "SRC1418", "SRC1420", "SRC1422", "SRC1423", "SRC1424", "SRC1425", "SRC1426", "SRC1427", "SRC1428"];
sourceBundles.researchRound46ProvincialProcurement = ["SRC1429", "SRC1430", "SRC1431", "SRC1432", "SRC1433", "SRC1434", "SRC1435", "SRC1436", "SRC1437", "SRC1438", "SRC1439", "SRC1440", "SRC1441"];
sourceBundles.researchRound46UniversityProcurement = ["SRC1442", "SRC1443", "SRC1444", "SRC1445", "SRC1446", "SRC1447"];
sourceBundles.researchRound47UnitreeSupport = ["SRC1448"];
sourceBundles.researchRound47AgilexSupport = ["SRC1449", "SRC1450", "SRC1451"];
sourceBundles.researchRound47UfactorySupport = ["SRC1452", "SRC1453"];
sourceBundles.researchRound47AuboSupport = ["SRC1454", "SRC1455"];
sourceBundles.researchRound47RealmanSupport = ["SRC1456", "SRC1457", "SRC1458"];
sourceBundles.researchRound47EliteSupport = ["SRC1459", "SRC1460"];
sourceBundles.researchRound47JakaSupport = ["SRC1461"];
sourceBundles.researchRound47FourierSupport = ["SRC1462"];
sourceBundles.researchRound47EngineAiSupport = ["SRC1463", "SRC1464"];
sourceBundles.researchRound47BoosterSupport = ["SRC1465"];
sourceBundles.researchRound47HelloSupport = ["SRC1466"];
sourceBundles.researchRound47PalSupport = ["SRC1467"];
sourceBundles.researchRound47TeachingSupport = ["SRC1451", "SRC1452", "SRC1457", "SRC1466", "SRC1467"];
sourceBundles.researchRound48AcademicDiscovery = ["SRC1468", "SRC1469", "SRC1470", "SRC1471"];
sourceBundles.researchRound48CnJournals = ["SRC1472", "SRC1473", "SRC1474"];
sourceBundles.researchRound48ModelDataPlatforms = ["SRC1475", "SRC1476", "SRC1477", "SRC1478", "SRC1479", "SRC1480", "SRC1481", "SRC1482"];
sourceBundles.researchRound48ResearchInstitutes = ["SRC1483", "SRC1484", "SRC1485", "SRC1487", "SRC1488", "SRC1489"];
sourceBundles.researchRound48LeggedResearch = ["SRC1485", "SRC1486", "SRC1488"];
sourceBundles.researchRound48EmbodiedTaskBenchmarks = ["SRC1490", "SRC1491", "SRC1492", "SRC1493"];
sourceBundles.researchRound48RobotDataFormats = ["SRC1494"];
sourceBundles.researchRound48ManipulationAcademic = [
  ...sourceBundles.researchRound48AcademicDiscovery,
  ...sourceBundles.researchRound48CnJournals,
  ...sourceBundles.researchRound48ModelDataPlatforms,
  ...sourceBundles.researchRound48ResearchInstitutes,
  ...sourceBundles.researchRound48EmbodiedTaskBenchmarks,
  ...sourceBundles.researchRound48RobotDataFormats
];
sourceBundles.researchRound48HumanoidAcademic = [
  ...sourceBundles.researchRound48AcademicDiscovery,
  ...sourceBundles.researchRound48ModelDataPlatforms,
  ...sourceBundles.researchRound48ResearchInstitutes,
  ...sourceBundles.researchRound48LeggedResearch,
  ...sourceBundles.researchRound48EmbodiedTaskBenchmarks,
  ...sourceBundles.researchRound48RobotDataFormats
];
sourceBundles.researchRound48QuadrupedAcademic = [
  ...sourceBundles.researchRound48AcademicDiscovery,
  ...sourceBundles.researchRound48ModelDataPlatforms,
  ...sourceBundles.researchRound48LeggedResearch,
  ...sourceBundles.researchRound48EmbodiedTaskBenchmarks,
  ...sourceBundles.researchRound48RobotDataFormats
];
sourceBundles.researchRound48MobileAcademic = [
  ...sourceBundles.researchRound48AcademicDiscovery,
  ...sourceBundles.researchRound48ModelDataPlatforms,
  ...sourceBundles.researchRound48ResearchInstitutes,
  ...sourceBundles.researchRound48EmbodiedTaskBenchmarks,
  ...sourceBundles.researchRound48RobotDataFormats
];
sourceBundles.researchRound49ProvincialProcurement = ["SRC1495", "SRC1496", "SRC1497", "SRC1498", "SRC1499", "SRC1500", "SRC1501", "SRC1502", "SRC1503"];
sourceBundles.researchRound49UniversityProcurement = ["SRC1504", "SRC1505"];
sourceBundles.researchRound49ArmChannels = ["SRC1506", "SRC1509", "SRC1510", "SRC1511"];
sourceBundles.researchRound49HumanoidChannels = ["SRC1508"];
sourceBundles.researchRound49QuadrupedChannels = ["SRC1507", "SRC1512"];
sourceBundles.researchRound49CompositeChannels = ["SRC1506", "SRC1507", "SRC1509", "SRC1510", "SRC1511", "SRC1512"];
sourceBundles.researchRound49IndustryPlatforms = ["SRC1513", "SRC1514", "SRC1515"];
sourceBundles.researchRound49ArmProcurement = [
  ...sourceBundles.researchRound49ProvincialProcurement,
  ...sourceBundles.researchRound49UniversityProcurement,
  ...sourceBundles.researchRound49ArmChannels,
  ...sourceBundles.researchRound49IndustryPlatforms
];
sourceBundles.researchRound49HumanoidProcurement = [
  ...sourceBundles.researchRound49ProvincialProcurement,
  ...sourceBundles.researchRound49UniversityProcurement,
  ...sourceBundles.researchRound49HumanoidChannels,
  ...sourceBundles.researchRound49IndustryPlatforms
];
sourceBundles.researchRound49QuadrupedProcurement = [
  ...sourceBundles.researchRound49ProvincialProcurement,
  ...sourceBundles.researchRound49UniversityProcurement,
  ...sourceBundles.researchRound49QuadrupedChannels,
  ...sourceBundles.researchRound49IndustryPlatforms
];
sourceBundles.researchRound49CompositeProcurement = [
  ...sourceBundles.researchRound49ProvincialProcurement,
  ...sourceBundles.researchRound49UniversityProcurement,
  ...sourceBundles.researchRound49CompositeChannels,
  ...sourceBundles.researchRound49IndustryPlatforms
];
sourceBundles.researchRound50ConcreteProcurement = ["SRC1516", "SRC1517", "SRC1518", "SRC1519", "SRC1520", "SRC1521", "SRC1522", "SRC1523", "SRC1524", "SRC1525", "SRC1526", "SRC1527", "SRC1528"];
sourceBundles.researchRound50HumanoidProcurement = ["SRC1516", "SRC1518", "SRC1519", "SRC1520", "SRC1521", "SRC1522", "SRC1523", "SRC1524", "SRC1525", "SRC1526", "SRC1527", "SRC1528"];
sourceBundles.researchRound50QuadrupedProcurement = ["SRC1516", "SRC1519", "SRC1521", "SRC1527"];
sourceBundles.researchRound50CompositeProcurement = ["SRC1516", "SRC1517", "SRC1518", "SRC1519", "SRC1520", "SRC1521", "SRC1527", "SRC1528"];
sourceBundles.researchRound50ArmProcurement = ["SRC1516", "SRC1517", "SRC1518", "SRC1519", "SRC1520", "SRC1521", "SRC1528"];

const expandedLinks = {
  "ur5e": ["SRC111", "SRC112", ...sourceBundles.importArmProcurementSearch, ...sourceBundles.safetyStandards, ...sourceBundles.forceTorqueSensors, ...sourceBundles.dexterousHandsExtended, ...sourceBundles.dexterousHandsRound5, ...sourceBundles.robotDataExtended, ...sourceBundles.industryTracking, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.newManipulationResearch, ...sourceBundles.researchRound7Manipulation, ...sourceBundles.researchRound9Manipulation, ...sourceBundles.researchRound13UnifiedControl, ...sourceBundles.robotArmChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.researchRound27ArmDeploymentCases, ...sourceBundles.cnAcademicArms],
  "ufactory-xarm-6": ["SRC104", "SRC105", ...sourceBundles.xarmChannels, ...sourceBundles.safetyStandards, ...sourceBundles.forceTorqueSensors, ...sourceBundles.dexterousHandsExtended, ...sourceBundles.dexterousHandsRound5, ...sourceBundles.robotDataExtended, ...sourceBundles.industryTracking, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.armResearch, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.newManipulationResearch, ...sourceBundles.researchRound7Manipulation, ...sourceBundles.researchRound9Manipulation, ...sourceBundles.researchRound13UnifiedControl, ...sourceBundles.robotArmChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.researchRound27ArmDeploymentCases, ...sourceBundles.cnAcademicArms],
  "ufactory-xarm-7": ["SRC104", "SRC105", ...sourceBundles.xarmChannels, ...sourceBundles.safetyStandards, ...sourceBundles.forceTorqueSensors, ...sourceBundles.dexterousHandsExtended, ...sourceBundles.dexterousHandsRound5, ...sourceBundles.robotDataExtended, ...sourceBundles.industryTracking, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.armResearch, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.newManipulationResearch, ...sourceBundles.researchRound7Manipulation, ...sourceBundles.researchRound9Manipulation, ...sourceBundles.researchRound13UnifiedControl, ...sourceBundles.robotArmChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.researchRound27ArmDeploymentCases, ...sourceBundles.cnAcademicArms],
  "dobot-cr5": ["SRC024", "SRC106", "SRC107", "SRC708", ...sourceBundles.dobotDeepLinks, ...sourceBundles.dobotProcurementSearchRound3, ...sourceBundles.safetyStandards, ...sourceBundles.forceTorqueSensors, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.simulationStack, ...sourceBundles.robotArmChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.concreteProcurementRound2Arms, ...sourceBundles.researchRound27ArmDeploymentCases, ...sourceBundles.cnAcademicArms],
  "franka-research-3": ["SRC109", "SRC110", "SRC179", "SRC180", "SRC540", ...sourceBundles.frankaChannels, ...sourceBundles.researchRound26FrankaChannels, ...sourceBundles.importArmProcurementSearch, ...sourceBundles.safetyStandards, ...sourceBundles.forceTorqueSensors, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.armResearch, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.newManipulationResearch, ...sourceBundles.researchRound7Manipulation, ...sourceBundles.researchRound9Manipulation, ...sourceBundles.researchRound13Franka, ...sourceBundles.dexterousEndEffectors, ...sourceBundles.dexterousHandsRound5, ...sourceBundles.endEffectorProcurementSearch, ...sourceBundles.concreteDexterousProcurement, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.researchRound27ArmDeploymentCases, ...sourceBundles.cnAcademicArms],
  "unitree-z1": ["SRC102", "SRC103", "SRC713", "SRC726", ...sourceBundles.unitreeZ1ProcurementExtended, ...sourceBundles.safetyStandards, ...sourceBundles.forceTorqueSensors, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.simulationStack, ...sourceBundles.robotArmChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.researchRound27ArmDeploymentCases, ...sourceBundles.cnAcademicArms],
  "aubo-i5": ["SRC433", "SRC439", "SRC714", ...sourceBundles.auboDeepLinks, ...sourceBundles.auboResearchExtended, ...sourceBundles.auboProcurementExtended, ...sourceBundles.safetyStandards, ...sourceBundles.forceTorqueSensors, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.simulationStack, ...sourceBundles.robotArmChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.concreteProcurementRound2Arms, ...sourceBundles.cnAcademicArms],
  "agilex-piper": ["SRC104", "SRC105", ...sourceBundles.priceRound8Agilex, ...sourceBundles.researchRound24AgilexPiper, ...sourceBundles.safetyStandards, ...sourceBundles.forceTorqueSensors, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.simulationStack, ...sourceBundles.robotArmChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.researchRound27ArmDeploymentCases, ...sourceBundles.cnAcademicArms],
  "jaka-zu7": ["SRC434", "SRC715", ...sourceBundles.jakaDeepLinks, ...sourceBundles.jakaResearchExtended, ...sourceBundles.jakaProcurementExtended, ...sourceBundles.safetyStandards, ...sourceBundles.forceTorqueSensors, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.simulationStack, ...sourceBundles.robotArmChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.concreteProcurementRound2Arms, ...sourceBundles.cnAcademicArms],
  "realman-rm65": ["SRC029", "SRC108", "SRC717", ...sourceBundles.realmanResearchExtended, ...sourceBundles.realmanProcurementExtended, ...sourceBundles.safetyStandards, ...sourceBundles.forceTorqueSensors, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.simulationStack, ...sourceBundles.robotArmChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.concreteProcurementRound2Arms, ...sourceBundles.cnAcademicArms],
  "kinova-gen3": ["SRC113", ...sourceBundles.kinovaDeepLinks, ...sourceBundles.researchRound26KinovaChannels, ...sourceBundles.importArmProcurementSearch, ...sourceBundles.safetyStandards, ...sourceBundles.forceTorqueSensors, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.newManipulationResearch, ...sourceBundles.researchRound7Manipulation, ...sourceBundles.researchRound9Manipulation, ...sourceBundles.researchRound13UnifiedControl, ...sourceBundles.dexterousEndEffectors, ...sourceBundles.dexterousHandsRound5, ...sourceBundles.endEffectorProcurementSearch, ...sourceBundles.concreteDexterousProcurement, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.researchRound27ArmDeploymentCases, ...sourceBundles.cnAcademicArms],
  "elite-ec66": ["SRC435", "SRC716", ...sourceBundles.eliteDeepLinks, ...sourceBundles.eliteProcurementExtended, ...sourceBundles.safetyStandards, ...sourceBundles.forceTorqueSensors, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.simulationStack, ...sourceBundles.robotArmChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.concreteProcurementRound2Arms, ...sourceBundles.cnAcademicArms],
  "mycobot-320": ["SRC436", ...sourceBundles.mycobotResearchExtended, ...sourceBundles.teachingArmProcurementSearchRound3, ...sourceBundles.researchRound14OpenHardwareArms, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.teachingCode, ...sourceBundles.simulationStack, ...sourceBundles.teachingChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.concreteProcurementRound2Arms, ...sourceBundles.cnAcademicArms],
  "dobot-mg400": ["SRC024", "SRC106", "SRC707", ...sourceBundles.dobotDeepLinks, ...sourceBundles.dobotResearchExtended, ...sourceBundles.dobotProcurementSearchRound3, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.simulationStack, ...sourceBundles.robotArmChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.concreteProcurementRound2Arms, ...sourceBundles.cnAcademicArms],
  "mycobot-280": ["SRC436", ...sourceBundles.mycobotResearchExtended, ...sourceBundles.teachingArmProcurementSearchRound3, ...sourceBundles.researchRound14OpenHardwareArms, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.armDev, ...sourceBundles.teachingCode, ...sourceBundles.simulationStack, ...sourceBundles.teachingChannelSearch, ...sourceBundles.governmentProcurementArms, ...sourceBundles.concreteArmProcurement, ...sourceBundles.concreteProcurementRound2Arms, ...sourceBundles.cnAcademicArms],

  "unitree-g1": ["SRC102", "SRC121", "SRC157", "SRC174", "SRC175", "SRC176", "SRC177", "SRC178", "SRC195", "SRC196", "SRC197", "SRC198", "SRC199", "SRC200", ...sourceBundles.newG1HumanoidResearch, ...sourceBundles.researchRound23UnitreeOpenResearch, ...sourceBundles.researchRound23HumanoidResearch, ...sourceBundles.openHumanoidPlatformsRound2, ...sourceBundles.researchRound7Humanoids, ...sourceBundles.researchRound9Humanoids, ...sourceBundles.researchRound9UnitreeG1, ...sourceBundles.researchRound13UnitreeG1, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "unitree-h1": ["SRC102", "SRC121", "SRC158", "SRC176", "SRC200", "SRC483", "SRC487", ...sourceBundles.researchRound23UnitreeOpenResearch, ...sourceBundles.researchRound23HumanoidResearch, ...sourceBundles.openHumanoidPlatformsRound2, ...sourceBundles.researchRound7Humanoids, ...sourceBundles.researchRound13Humanoids, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "agibot-a2": ["SRC157", "SRC160", "SRC482", "SRC487", ...sourceBundles.agibotDev, ...sourceBundles.newAgibotResearch, ...sourceBundles.agibotProcurementExtended, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.dexterousEndEffectors, ...sourceBundles.concreteDexterousProcurement, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "ubtech-walker-s1": ["SRC733", ...sourceBundles.ubtechResearch, ...sourceBundles.ubtechDevRound4, ...sourceBundles.openHumanoidPlatformsRound2, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.openHumanoidBenchmarks, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "unitree-r1-air": ["SRC102", ...sourceBundles.researchRound23UnitreeOpenResearch, ...sourceBundles.researchRound23HumanoidResearch, ...sourceBundles.openHumanoidPlatformsRound2, ...sourceBundles.researchRound14OpenHardwareHumanoids, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "fourier-gr1": ["SRC122", "SRC198", ...sourceBundles.fourierDev, ...sourceBundles.openHumanoidPlatformsRound2, ...sourceBundles.fourierProcurementExtended, ...sourceBundles.researchRound9FourierGR, ...sourceBundles.researchRound23HumanoidResearch, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.openHumanoidBenchmarks, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "agibot-x2": ["SRC157", "SRC160", "SRC482", "SRC487", ...sourceBundles.agibotDev, ...sourceBundles.newAgibotResearch, ...sourceBundles.agibotProcurementExtended, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "unitree-r1-d": ["SRC102", ...sourceBundles.researchRound23UnitreeOpenResearch, ...sourceBundles.researchRound23HumanoidResearch, ...sourceBundles.openHumanoidPlatformsRound2, ...sourceBundles.researchRound14OpenHardwareHumanoids, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "leju-kuavo": ["SRC734", ...sourceBundles.lejuResearch, ...sourceBundles.openletKuavoResearch, ...sourceBundles.kuavoDevRound4, ...sourceBundles.lejuProcurementExtended, ...sourceBundles.openHumanoidPlatformsRound2, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.openHumanoidBenchmarks, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "fourier-gr2": ["SRC122", "SRC732", ...sourceBundles.fourierDev, ...sourceBundles.fourierGr2Extended, ...sourceBundles.openHumanoidPlatformsRound2, ...sourceBundles.fourierProcurementExtended, ...sourceBundles.researchRound9FourierGR, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.openHumanoidBenchmarks, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "engineai-pm01": [...sourceBundles.engineaiDev, ...sourceBundles.engineaiPm01Extended, ...sourceBundles.engineaiDevRound4, "SRC1027", ...sourceBundles.openHumanoidPlatformsRound2, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.openHumanoidBenchmarks, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "robotera-star1": [...sourceBundles.roboteraDev, ...sourceBundles.roboteraDevRound4, ...sourceBundles.researchRound24RobotEra, ...sourceBundles.roboteraProcurementExtended, ...sourceBundles.openHumanoidPlatformsRound2, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.openHumanoidBenchmarks, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "booster-t1": ["SRC120", "SRC121", "SRC159", ...sourceBundles.boosterResearchExtended, ...sourceBundles.boosterDevRound4, ...sourceBundles.openHumanoidPlatformsRound2, ...sourceBundles.researchRound23HumanoidResearch, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],
  "noetix-bumi": [...sourceBundles.noetixDevRound4, ...sourceBundles.researchRound24Noetix, ...sourceBundles.openHumanoidPlatformsRound2, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.humanoidDev, ...sourceBundles.humanoidFoundation, ...sourceBundles.humanoidChannelSearch, ...sourceBundles.governmentProcurementHumanoids, ...sourceBundles.concreteHumanoidProcurement, ...sourceBundles.researchRound27HumanoidDeploymentCases, ...sourceBundles.cnAcademicHumanoids],

  "unitree-go2": ["SRC102", "SRC164", "SRC165", "SRC173", "SRC181", "SRC182", "SRC183", ...sourceBundles.unitreeGo2ProcurementExtended, ...sourceBundles.newQuadrupedResearchRound2, ...sourceBundles.researchRound23UnitreeOpenResearch, ...sourceBundles.researchRound23QuadrupedResearch, ...sourceBundles.researchRound13Go2, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.unitreeGo2Community, ...sourceBundles.unitreeQuadrupedResearch, ...sourceBundles.openQuadrupedBenchmarks, ...sourceBundles.quadrupedDev, ...sourceBundles.concreteQuadrupedProcurement, ...sourceBundles.researchRound27QuadrupedDeploymentCases, ...sourceBundles.cnAcademicQuadrupeds],
  "unitree-b2": ["SRC102", "SRC166", "SRC245", ...sourceBundles.researchRound26UnitreeIndustryChannels, ...sourceBundles.newQuadrupedResearchRound2, ...sourceBundles.researchRound23QuadrupedResearch, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.openQuadrupedBenchmarks, ...sourceBundles.quadrupedDev, ...sourceBundles.concreteQuadrupedProcurement, ...sourceBundles.researchRound27QuadrupedDeploymentCases, ...sourceBundles.cnAcademicQuadrupeds],
  "unitree-a2": ["SRC102", "SRC166", "SRC245", "SRC249", ...sourceBundles.researchRound26UnitreeIndustryChannels, ...sourceBundles.newQuadrupedResearchRound2, ...sourceBundles.researchRound23QuadrupedResearch, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.openQuadrupedBenchmarks, ...sourceBundles.quadrupedDev, ...sourceBundles.concreteQuadrupedProcurement, ...sourceBundles.researchRound27QuadrupedDeploymentCases, ...sourceBundles.cnAcademicQuadrupeds],
  "unitree-b2-z1": ["SRC102", "SRC103", "SRC166", "SRC245", ...sourceBundles.researchRound26UnitreeIndustryChannels, ...sourceBundles.newQuadrupedResearchRound2, ...sourceBundles.researchRound23QuadrupedResearch, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.quadrupedDev, ...sourceBundles.mobileManipulation, ...sourceBundles.vlaFoundation, ...sourceBundles.concreteQuadrupedProcurement, ...sourceBundles.researchRound27QuadrupedDeploymentCases, ...sourceBundles.cnAcademicQuadrupeds],
  "deeprobotics-x30": ["SRC123", "SRC124", "SRC201", "SRC202", "SRC486", ...sourceBundles.deeproboticsModelExtended, ...sourceBundles.researchRound24DeepRobotics, ...sourceBundles.deeproboticsProcurementExtended, ...sourceBundles.newQuadrupedResearchRound2, ...sourceBundles.researchRound23QuadrupedResearch, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.openQuadrupedBenchmarks, ...sourceBundles.quadrupedDev, ...sourceBundles.concreteQuadrupedProcurement, ...sourceBundles.researchRound27QuadrupedDeploymentCases, ...sourceBundles.cnAcademicQuadrupeds],
  "deeprobotics-lite3": ["SRC123", "SRC124", "SRC201", ...sourceBundles.deeproboticsModelExtended, ...sourceBundles.researchRound24DeepRobotics, ...sourceBundles.deeproboticsProcurementExtended, ...sourceBundles.newQuadrupedResearchRound2, ...sourceBundles.researchRound23QuadrupedResearch, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.openQuadrupedBenchmarks, ...sourceBundles.quadrupedDev, ...sourceBundles.concreteQuadrupedProcurement, ...sourceBundles.researchRound27QuadrupedDeploymentCases, ...sourceBundles.cnAcademicQuadrupeds],
  "deeprobotics-x20": ["SRC123", "SRC124", "SRC201", "SRC202", "SRC737", ...sourceBundles.deeproboticsModelExtended, ...sourceBundles.researchRound24DeepRobotics, ...sourceBundles.deeproboticsProcurementExtended, ...sourceBundles.newQuadrupedResearchRound2, ...sourceBundles.researchRound23QuadrupedResearch, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.openQuadrupedBenchmarks, ...sourceBundles.quadrupedDev, ...sourceBundles.concreteQuadrupedProcurement, ...sourceBundles.researchRound27QuadrupedDeploymentCases, ...sourceBundles.cnAcademicQuadrupeds],
  "deeprobotics-lynx-m20": ["SRC123", "SRC124", "SRC202", "SRC727", ...sourceBundles.deeproboticsModelExtended, ...sourceBundles.researchRound24DeepRobotics, ...sourceBundles.deeproboticsProcurementExtended, ...sourceBundles.newQuadrupedResearchRound2, ...sourceBundles.researchRound23QuadrupedResearch, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.openQuadrupedBenchmarks, ...sourceBundles.quadrupedDev, ...sourceBundles.concreteQuadrupedProcurement, ...sourceBundles.researchRound27QuadrupedDeploymentCases, ...sourceBundles.cnAcademicQuadrupeds],
  "limx-tron1": ["SRC119", "SRC728", "SRC729", ...sourceBundles.limxTron1Extended, ...sourceBundles.limxProcurementExtended, ...sourceBundles.newQuadrupedResearchRound2, ...sourceBundles.researchRound23QuadrupedResearch, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.openQuadrupedBenchmarks, ...sourceBundles.quadrupedDev, ...sourceBundles.concreteQuadrupedProcurement, ...sourceBundles.researchRound27QuadrupedDeploymentCases, ...sourceBundles.cnAcademicQuadrupeds],
  "unitree-go1": ["SRC102", "SRC181", "SRC730", "SRC731", ...sourceBundles.researchRound26UnitreeIndustryChannels, ...sourceBundles.newQuadrupedResearchRound2, ...sourceBundles.researchRound23QuadrupedResearch, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.unitreeQuadrupedResearch, ...sourceBundles.openQuadrupedBenchmarks, ...sourceBundles.quadrupedDev, ...sourceBundles.concreteQuadrupedProcurement, ...sourceBundles.researchRound27QuadrupedDeploymentCases, ...sourceBundles.cnAcademicQuadrupeds],
  "xiaomi-cyberdog2": [...sourceBundles.cyberdogExtended, ...sourceBundles.researchRound26CyberDogChannels, ...sourceBundles.newQuadrupedResearchRound2, ...sourceBundles.researchRound23QuadrupedResearch, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.openQuadrupedBenchmarks, ...sourceBundles.quadrupedDev, ...sourceBundles.concreteQuadrupedProcurement, ...sourceBundles.researchRound27QuadrupedDeploymentCases, ...sourceBundles.cnAcademicQuadrupeds],

  "agilex-cobot-magic": ["SRC104", "SRC105", "SRC157", "SRC735", "SRC736", ...sourceBundles.cobotMagicProcurementExtended, ...sourceBundles.agilexMobileManipulationRound5, ...sourceBundles.researchRound24AgilexPiper, ...sourceBundles.priceRound8Agilex, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.forceTorqueSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.agilexLimoEcosystem, ...sourceBundles.cobotMagicResearch, ...sourceBundles.mobileManipulation, ...sourceBundles.mobileManipulationProcurementSearchRound3, ...sourceBundles.newMobileManipulationResearch, ...sourceBundles.researchRound23MobileManipulationResearch, ...sourceBundles.researchRound23EmbodiedData, ...sourceBundles.newManipulationResearch, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.mobileChannelSearch, ...sourceBundles.dexterousEndEffectors, ...sourceBundles.dexterousHandsRound5, ...sourceBundles.dexterousProcurementSearchRound3, ...sourceBundles.concreteDexterousProcurement, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "agilex-limo-piper": ["SRC104", "SRC105", ...sourceBundles.agilexMobileManipulationRound5, ...sourceBundles.researchRound24AgilexPiper, ...sourceBundles.priceRound8Agilex, ...sourceBundles.researchRound14MobileDiscovery, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.forceTorqueSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.agilexLimoEcosystem, ...sourceBundles.mobileManipulation, ...sourceBundles.newMobileManipulationResearch, ...sourceBundles.researchRound23MobileManipulationResearch, ...sourceBundles.researchRound23EmbodiedData, ...sourceBundles.newManipulationResearch, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.mobileChannelSearch, ...sourceBundles.dexterousEndEffectors, ...sourceBundles.dexterousHandsRound5, ...sourceBundles.concreteDexterousProcurement, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "unitree-go2-z1": ["SRC102", "SRC103", "SRC164", "SRC165", ...sourceBundles.newQuadrupedResearchRound2, ...sourceBundles.researchRound23UnitreeOpenResearch, ...sourceBundles.researchRound23QuadrupedResearch, ...sourceBundles.researchRound13Go2, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.forceTorqueSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.unitreeGo2Community, ...sourceBundles.mobileManipulation, ...sourceBundles.newMobileManipulationResearch, ...sourceBundles.researchRound23MobileManipulationResearch, ...sourceBundles.researchRound23EmbodiedData, ...sourceBundles.researchRound13MobileManipulation, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.quadrupedDev, ...sourceBundles.researchRound28QuadrupedLocomotion, ...sourceBundles.concreteQuadrupedProcurement, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "xarm-agilex-base": ["SRC104", "SRC105", "SRC738", ...sourceBundles.xarmChannels, ...sourceBundles.agilexMobileManipulationRound5, ...sourceBundles.researchRound24AgilexPiper, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.forceTorqueSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.agilexLimoEcosystem, ...sourceBundles.mobileManipulation, ...sourceBundles.newMobileManipulationResearch, ...sourceBundles.researchRound23MobileManipulationResearch, ...sourceBundles.researchRound23EmbodiedData, ...sourceBundles.newManipulationResearch, ...sourceBundles.researchRound13UnifiedControl, ...sourceBundles.researchRound13MobileManipulation, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.mobileChannelSearch, ...sourceBundles.dexterousEndEffectors, ...sourceBundles.dexterousHandsRound5, ...sourceBundles.concreteDexterousProcurement, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "robotnik-rb-kairos": ["SRC118", "SRC111", ...sourceBundles.robotnikDocsRound5, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.forceTorqueSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.robotnikResearch, ...sourceBundles.mobileManipulation, ...sourceBundles.newMobileManipulationResearch, ...sourceBundles.researchRound23MobileManipulationResearch, ...sourceBundles.researchRound23EmbodiedData, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "realman-mobile-manipulator": ["SRC029", "SRC108", ...sourceBundles.realmanMobileExtended, ...sourceBundles.researchRound24RealMan, ...sourceBundles.realmanProcurementExtended, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.forceTorqueSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.mobileManipulation, ...sourceBundles.newMobileManipulationResearch, ...sourceBundles.dexterousEndEffectors, ...sourceBundles.concreteDexterousProcurement, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "hello-stretch-3": ["SRC114", "SRC115", "SRC168", ...sourceBundles.newStretchResearchRound2, ...sourceBundles.researchRound23MobileManipulationResearch, ...sourceBundles.mobileManipulationProcurementSearchRound3, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.forceTorqueSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.helloStretchResearch, ...sourceBundles.stretchHomeResearch, ...sourceBundles.mobileManipulation, ...sourceBundles.newMobileManipulationResearch, ...sourceBundles.researchRound23MobileManipulationResearch, ...sourceBundles.researchRound23EmbodiedData, ...sourceBundles.researchRound13MobileManipulation, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "mobile-aloha": ["SRC139", "SRC140", "SRC141", "SRC142", ...sourceBundles.mobileManipulationProcurementSearchRound3, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.forceTorqueSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.mobileManipulation, ...sourceBundles.newMobileManipulationResearch, ...sourceBundles.researchRound23MobileManipulationResearch, ...sourceBundles.researchRound23EmbodiedData, ...sourceBundles.newManipulationResearch, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.dexterousEndEffectors, ...sourceBundles.dexterousHandsRound5, ...sourceBundles.dexterousProcurementSearchRound3, ...sourceBundles.concreteDexterousProcurement, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "pal-tiago": ["SRC116", "SRC117", ...sourceBundles.tiagoDocsRound5, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.forceTorqueSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.tiagoResearch, ...sourceBundles.mobileManipulation, ...sourceBundles.newMobileManipulationResearch, ...sourceBundles.researchRound23MobileManipulationResearch, ...sourceBundles.researchRound23EmbodiedData, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "franka-mobile-base": ["SRC109", "SRC110", "SRC179", "SRC180", "SRC540", "SRC739", "SRC740", "SRC741", ...sourceBundles.frankaChannels, ...sourceBundles.researchRound26FrankaChannels, ...sourceBundles.researchRound13Franka, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.forceTorqueSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.mobileManipulation, ...sourceBundles.newMobileManipulationResearch, ...sourceBundles.researchRound23MobileManipulationResearch, ...sourceBundles.researchRound23EmbodiedData, ...sourceBundles.researchRound13MobileManipulation, ...sourceBundles.newManipulationResearch, ...sourceBundles.simulationStack, ...sourceBundles.vlaFoundation, ...sourceBundles.armResearch, ...sourceBundles.dexterousEndEffectors, ...sourceBundles.dexterousHandsRound5, ...sourceBundles.concreteDexterousProcurement, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "hiwonder-jetauto-pro": ["SRC437", "SRC488", ...sourceBundles.hiwonderDocsRound5, ...sourceBundles.researchRound24TeachingComposite, ...sourceBundles.hiwonderProcurementExtended, ...sourceBundles.priceRound8TeachingComposite, ...sourceBundles.researchRound14MobileDiscovery, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.mobileManipulation, ...sourceBundles.teachingCode, ...sourceBundles.teachingChannelSearch, ...sourceBundles.simulationStack, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "turtlebot4-arm": [...sourceBundles.turtlebot4Extended, ...sourceBundles.researchRound24TeachingComposite, ...sourceBundles.priceRound8TeachingComposite, ...sourceBundles.researchRound14MobileDiscovery, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.mobileManipulation, ...sourceBundles.teachingCode, ...sourceBundles.teachingChannelSearch, ...sourceBundles.simulationStack, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "hiwonder-jetrover-arm": ["SRC437", "SRC488", ...sourceBundles.hiwonderDocsRound5, ...sourceBundles.researchRound24TeachingComposite, ...sourceBundles.hiwonderProcurementExtended, ...sourceBundles.priceRound8TeachingComposite, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.roboticsInfrastructure, ...sourceBundles.mobileManipulation, ...sourceBundles.teachingCode, ...sourceBundles.teachingChannelSearch, ...sourceBundles.simulationStack, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"],
  "yahboom-rosmaster-x3-arm": ["SRC438", "SRC488", ...sourceBundles.yahboomDocsRound5, ...sourceBundles.researchRound24TeachingComposite, ...sourceBundles.yahboomRosmasterExtended, ...sourceBundles.yahboomProcurementExtended, ...sourceBundles.priceRound8TeachingComposite, ...sourceBundles.safetyStandards, ...sourceBundles.visionSensors, ...sourceBundles.edgeCompute, ...sourceBundles.roboticsCourses, ...sourceBundles.mobileManipulation, ...sourceBundles.teachingCode, ...sourceBundles.teachingChannelSearch, ...sourceBundles.simulationStack, ...sourceBundles.concreteMobileProcurement, ...sourceBundles.researchRound27MobileManipulatorDeploymentCases, ...sourceBundles.cnAcademicMobileManipulation, "SRC153"]
};

const round30ModelLinks = {
  "unitree-g1": sourceBundles.researchRound30UnitreeHumanoidDocs,
  "unitree-h1": sourceBundles.researchRound30UnitreeHumanoidDocs,
  "unitree-r1-air": sourceBundles.researchRound30UnitreeHumanoidDocs,
  "unitree-r1-d": sourceBundles.researchRound30UnitreeHumanoidDocs,
  "unitree-go2": sourceBundles.researchRound30UnitreeQuadrupedDocs,
  "unitree-b2": sourceBundles.researchRound30UnitreeQuadrupedDocs,
  "unitree-a2": sourceBundles.researchRound30UnitreeQuadrupedDocs,
  "unitree-go1": sourceBundles.researchRound30UnitreeQuadrupedDocs,
  "unitree-b2-z1": [...sourceBundles.researchRound30UnitreeQuadrupedDocs, ...sourceBundles.researchRound30UnitreeArmDocs],
  "unitree-go2-z1": [...sourceBundles.researchRound30UnitreeQuadrupedDocs, ...sourceBundles.researchRound30UnitreeArmDocs],
  "unitree-z1": sourceBundles.researchRound30UnitreeArmDocs,
  "deeprobotics-lite3": sourceBundles.researchRound30Lite3OfficialDocs,
  "deeprobotics-x30": sourceBundles.researchRound30DeepRoboticsOfficialDocs,
  "deeprobotics-x20": sourceBundles.researchRound30DeepRoboticsOfficialDocs,
  "deeprobotics-lynx-m20": sourceBundles.researchRound30DeepRoboticsOfficialDocs
};

const round31ModelLinks = {
  "franka-research-3": ["SRC1147", "SRC1154", "SRC1155", ...sourceBundles.researchRound31VlaFoundation],
  "ur5e": sourceBundles.researchRound31ManipulationData,
  "ufactory-xarm-6": [...sourceBundles.researchRound31ManipulationData, "SRC1156"],
  "ufactory-xarm-7": [...sourceBundles.researchRound31ManipulationData, "SRC1156"],
  "kinova-gen3": sourceBundles.researchRound31ManipulationData,
  "unitree-z1": [...sourceBundles.researchRound31ManipulationData, "SRC1158"],
  "agilex-piper": [...sourceBundles.researchRound31ManipulationData, "SRC1156"],
  "mycobot-280": sourceBundles.researchRound31OpenArmTeaching,
  "mycobot-320": sourceBundles.researchRound31OpenArmTeaching,
  "dobot-mg400": sourceBundles.researchRound31OpenArmTeaching,
  "unitree-g1": [...sourceBundles.researchRound31HumanoidResearch, "SRC1148"],
  "unitree-h1": sourceBundles.researchRound31HumanoidResearch,
  "agibot-a2": [...sourceBundles.researchRound31HumanoidResearch, "SRC1165"],
  "agibot-x2": [...sourceBundles.researchRound31HumanoidResearch, "SRC1165"],
  "fourier-gr1": [...sourceBundles.researchRound31HumanoidResearch, "SRC1148"],
  "fourier-gr2": [...sourceBundles.researchRound31HumanoidResearch, "SRC1148"],
  "ubtech-walker-s1": sourceBundles.researchRound31HumanoidResearch,
  "leju-kuavo": sourceBundles.researchRound31HumanoidResearch,
  "booster-t1": sourceBundles.researchRound31HumanoidResearch,
  "engineai-pm01": sourceBundles.researchRound31HumanoidResearch,
  "robotera-star1": sourceBundles.researchRound31HumanoidResearch,
  "unitree-go2": sourceBundles.researchRound31QuadrupedResearch,
  "unitree-go1": sourceBundles.researchRound31QuadrupedResearch,
  "unitree-b2": sourceBundles.researchRound31QuadrupedResearch,
  "unitree-a2": sourceBundles.researchRound31QuadrupedResearch,
  "deeprobotics-lite3": sourceBundles.researchRound31QuadrupedResearch,
  "deeprobotics-x30": sourceBundles.researchRound31QuadrupedResearch,
  "deeprobotics-x20": sourceBundles.researchRound31QuadrupedResearch,
  "limx-tron1": sourceBundles.researchRound31QuadrupedResearch,
  "unitree-b2-z1": [...sourceBundles.researchRound31QuadrupedResearch, ...sourceBundles.researchRound31MobileManipulationResearch],
  "unitree-go2-z1": [...sourceBundles.researchRound31QuadrupedResearch, ...sourceBundles.researchRound31MobileManipulationResearch],
  "agilex-cobot-magic": sourceBundles.researchRound31MobileManipulationResearch,
  "agilex-limo-piper": sourceBundles.researchRound31MobileManipulationResearch,
  "xarm-agilex-base": sourceBundles.researchRound31MobileManipulationResearch,
  "robotnik-rb-kairos": sourceBundles.researchRound31MobileManipulationResearch,
  "realman-mobile-manipulator": sourceBundles.researchRound31MobileManipulationResearch,
  "hello-stretch-3": [...sourceBundles.researchRound31MobileManipulationResearch, "SRC1162", "SRC1163"],
  "mobile-aloha": [...sourceBundles.researchRound31MobileManipulationResearch, "SRC1147"],
  "pal-tiago": sourceBundles.researchRound31MobileManipulationResearch,
  "franka-mobile-base": [...sourceBundles.researchRound31MobileManipulationResearch, "SRC1147", "SRC1154"],
  "hiwonder-jetauto-pro": sourceBundles.researchRound31OpenArmTeaching,
  "hiwonder-jetrover-arm": sourceBundles.researchRound31OpenArmTeaching,
  "yahboom-rosmaster-x3-arm": sourceBundles.researchRound31OpenArmTeaching,
  "turtlebot4-arm": sourceBundles.researchRound31OpenArmTeaching
};

const round32ModelLinks = {
  "ur5e": sourceBundles.researchRound32ArmTeachingProcurement,
  "dobot-cr5": sourceBundles.researchRound32ArmTeachingProcurement,
  "dobot-mg400": sourceBundles.researchRound32ArmTeachingProcurement,
  "ufactory-xarm-6": sourceBundles.researchRound32ArmTeachingProcurement,
  "ufactory-xarm-7": sourceBundles.researchRound32ArmTeachingProcurement,
  "franka-research-3": sourceBundles.researchRound32ArmTeachingProcurement,
  "unitree-g1": sourceBundles.researchRound32HumanoidProcurementContracts,
  "unitree-h1": sourceBundles.researchRound32HumanoidProcurementContracts,
  "agibot-a2": sourceBundles.researchRound32HumanoidProcurementContracts,
  "agibot-x2": sourceBundles.researchRound32HumanoidProcurementContracts,
  "ubtech-walker-s1": sourceBundles.researchRound32HumanoidProcurementContracts,
  "fourier-gr1": sourceBundles.researchRound32HumanoidProcurementContracts,
  "fourier-gr2": sourceBundles.researchRound32HumanoidProcurementContracts,
  "leju-kuavo": sourceBundles.researchRound32HumanoidProcurementContracts,
  "engineai-pm01": sourceBundles.researchRound32HumanoidProcurementContracts,
  "robotera-star1": sourceBundles.researchRound32HumanoidProcurementContracts,
  "unitree-r1-air": sourceBundles.researchRound32HumanoidProcurementContracts,
  "unitree-r1-d": sourceBundles.researchRound32HumanoidProcurementContracts,
  "booster-t1": [
    ...sourceBundles.researchRound32HumanoidProcurementContracts,
    ...sourceBundles.researchRound32BoosterDev
  ],
  "noetix-bumi": [
    ...sourceBundles.researchRound32HumanoidProcurementContracts,
    ...sourceBundles.researchRound32NoetixDev
  ],
  "unitree-go2": sourceBundles.researchRound32QuadrupedProcurementContracts,
  "unitree-b2": sourceBundles.researchRound32QuadrupedProcurementContracts,
  "unitree-a2": sourceBundles.researchRound32QuadrupedProcurementContracts,
  "unitree-go1": sourceBundles.researchRound32QuadrupedProcurementContracts,
  "unitree-b2-z1": sourceBundles.researchRound32QuadrupedProcurementContracts,
  "unitree-go2-z1": sourceBundles.researchRound32QuadrupedProcurementContracts,
  "deeprobotics-x30": [
    ...sourceBundles.researchRound32QuadrupedProcurementContracts,
    ...sourceBundles.researchRound32DeepRoboticsDev
  ],
  "deeprobotics-lite3": [
    ...sourceBundles.researchRound32QuadrupedProcurementContracts,
    ...sourceBundles.researchRound32DeepRoboticsDev
  ],
  "deeprobotics-x20": [
    ...sourceBundles.researchRound32QuadrupedProcurementContracts,
    ...sourceBundles.researchRound32DeepRoboticsDev
  ],
  "deeprobotics-lynx-m20": [
    ...sourceBundles.researchRound32QuadrupedProcurementContracts,
    ...sourceBundles.researchRound32DeepRoboticsDev
  ],
  "limx-tron1": [
    ...sourceBundles.researchRound32QuadrupedProcurementContracts,
    ...sourceBundles.researchRound32LimxDev
  ],
  "xiaomi-cyberdog2": [
    ...sourceBundles.researchRound32QuadrupedProcurementContracts,
    ...sourceBundles.researchRound32CyberDogDev
  ],
  "agilex-cobot-magic": [
    ...sourceBundles.researchRound32HumanoidProcurementContracts,
    ...sourceBundles.researchRound32ArmTeachingProcurement
  ],
  "agilex-limo-piper": sourceBundles.researchRound32ArmTeachingProcurement,
  "xarm-agilex-base": sourceBundles.researchRound32ArmTeachingProcurement,
  "franka-mobile-base": [
    ...sourceBundles.researchRound32HumanoidProcurementContracts,
    ...sourceBundles.researchRound32ArmTeachingProcurement
  ],
  "hello-stretch-3": sourceBundles.researchRound32HumanoidProcurementContracts,
  "pal-tiago": sourceBundles.researchRound32HumanoidProcurementContracts,
  "mobile-aloha": sourceBundles.researchRound32HumanoidProcurementContracts,
  "realman-mobile-manipulator": sourceBundles.researchRound32HumanoidProcurementContracts,
  "robotnik-rb-kairos": sourceBundles.researchRound32ArmTeachingProcurement,
  "hiwonder-jetauto-pro": sourceBundles.researchRound32ArmTeachingProcurement,
  "hiwonder-jetrover-arm": sourceBundles.researchRound32ArmTeachingProcurement,
  "yahboom-rosmaster-x3-arm": sourceBundles.researchRound32ArmTeachingProcurement,
  "turtlebot4-arm": sourceBundles.researchRound32ArmTeachingProcurement
};

const round33ModelLinks = {
  "mycobot-320": sourceBundles.researchRound33MyCobot320,
  "engineai-pm01": sourceBundles.researchRound33EngineAI,
  "fourier-gr1": sourceBundles.researchRound33Fourier,
  "fourier-gr2": sourceBundles.researchRound33Fourier,
  "ubtech-walker-s1": sourceBundles.researchRound33Ubtech,
  "agibot-a2": sourceBundles.researchRound33Agibot,
  "robotera-star1": sourceBundles.researchRound33RobotEra,
  "pal-tiago": sourceBundles.researchRound33Tiago,
  "robotnik-rb-kairos": sourceBundles.researchRound33Robotnik,
  "franka-mobile-base": sourceBundles.researchRound33Robotnik,
  "xarm-agilex-base": sourceBundles.researchRound33Robotnik
};

const round34ModelLinks = {
  "franka-research-3": sourceBundles.researchRound34ManipulationAcademic,
  "ur5e": sourceBundles.researchRound34ManipulationAcademic,
  "ufactory-xarm-6": sourceBundles.researchRound34ManipulationAcademic,
  "ufactory-xarm-7": sourceBundles.researchRound34ManipulationAcademic,
  "kinova-gen3": sourceBundles.researchRound34ManipulationAcademic,
  "mycobot-280": ["SRC1194", "SRC1195", "SRC1196", "SRC1197"],
  "mycobot-320": ["SRC1194", "SRC1195", "SRC1196", "SRC1197"],
  "dobot-mg400": ["SRC1196", "SRC1197"],
  "dobot-cr5": ["SRC1196", "SRC1197"],
  "unitree-g1": [...sourceBundles.researchRound34HumanoidControl, "SRC1200", "SRC1201"],
  "unitree-h1": sourceBundles.researchRound34HumanoidControl,
  "fourier-gr1": sourceBundles.researchRound34HumanoidControl,
  "fourier-gr2": sourceBundles.researchRound34HumanoidControl,
  "booster-t1": sourceBundles.researchRound34HumanoidControl,
  "leju-kuavo": sourceBundles.researchRound34HumanoidControl,
  "engineai-pm01": sourceBundles.researchRound34HumanoidControl,
  "robotera-star1": sourceBundles.researchRound34HumanoidControl,
  "unitree-r1-air": sourceBundles.researchRound34HumanoidControl,
  "unitree-r1-d": sourceBundles.researchRound34HumanoidControl,
  "unitree-go2": [...sourceBundles.researchRound34LeggedControl, ...sourceBundles.researchRound34MobileSemanticNavigation],
  "unitree-go1": sourceBundles.researchRound34LeggedControl,
  "unitree-b2": [...sourceBundles.researchRound34LeggedControl, "SRC1198", "SRC1199"],
  "unitree-a2": sourceBundles.researchRound34LeggedControl,
  "deeprobotics-lite3": sourceBundles.researchRound34LeggedControl,
  "deeprobotics-x30": sourceBundles.researchRound34LeggedControl,
  "deeprobotics-x20": sourceBundles.researchRound34LeggedControl,
  "limx-tron1": sourceBundles.researchRound34LeggedControl,
  "xiaomi-cyberdog2": sourceBundles.researchRound34LeggedControl,
  "unitree-go2-z1": [
    ...sourceBundles.researchRound34LeggedControl,
    ...sourceBundles.researchRound34MobileSemanticNavigation
  ],
  "unitree-b2-z1": [
    ...sourceBundles.researchRound34LeggedControl,
    ...sourceBundles.researchRound34MobileSemanticNavigation
  ],
  "agilex-cobot-magic": [
    ...sourceBundles.researchRound34ManipulationAcademic,
    ...sourceBundles.researchRound34MobileSemanticNavigation
  ],
  "agilex-limo-piper": [
    ...sourceBundles.researchRound34ManipulationAcademic,
    ...sourceBundles.researchRound34MobileSemanticNavigation
  ],
  "xarm-agilex-base": [
    ...sourceBundles.researchRound34ManipulationAcademic,
    ...sourceBundles.researchRound34MobileSemanticNavigation
  ],
  "robotnik-rb-kairos": sourceBundles.researchRound34MobileSemanticNavigation,
  "realman-mobile-manipulator": [
    ...sourceBundles.researchRound34ManipulationAcademic,
    ...sourceBundles.researchRound34MobileSemanticNavigation
  ],
  "hello-stretch-3": [
    ...sourceBundles.researchRound34StretchCommunity,
    ...sourceBundles.researchRound34MobileSemanticNavigation
  ],
  "pal-tiago": sourceBundles.researchRound34MobileSemanticNavigation,
  "mobile-aloha": [
    ...sourceBundles.researchRound34ManipulationAcademic,
    ...sourceBundles.researchRound34MobileSemanticNavigation
  ],
  "franka-mobile-base": [
    ...sourceBundles.researchRound34ManipulationAcademic,
    ...sourceBundles.researchRound34MobileSemanticNavigation
  ],
  "hiwonder-jetauto-pro": sourceBundles.researchRound34MobileSemanticNavigation,
  "hiwonder-jetrover-arm": sourceBundles.researchRound34MobileSemanticNavigation,
  "yahboom-rosmaster-x3-arm": sourceBundles.researchRound34MobileSemanticNavigation,
  "turtlebot4-arm": sourceBundles.researchRound34MobileSemanticNavigation
};

const round35ModelLinks = {
  "franka-research-3": [
    ...sourceBundles.researchRound35EmbodiedFoundation,
    ...sourceBundles.researchRound35ManipulationToolkits
  ],
  "ur5e": [
    ...sourceBundles.researchRound35EmbodiedFoundation,
    ...sourceBundles.researchRound35ManipulationToolkits
  ],
  "ufactory-xarm-6": sourceBundles.researchRound35ManipulationToolkits,
  "ufactory-xarm-7": sourceBundles.researchRound35ManipulationToolkits,
  "kinova-gen3": sourceBundles.researchRound35ManipulationToolkits,
  "agilex-piper": sourceBundles.researchRound35ManipulationToolkits,
  "mycobot-280": sourceBundles.researchRound35ManipulationToolkits,
  "mycobot-320": sourceBundles.researchRound35ManipulationToolkits,
  "dobot-mg400": sourceBundles.researchRound35ManipulationToolkits,
  "unitree-z1": sourceBundles.researchRound35ManipulationToolkits,
  "unitree-g1": [
    ...sourceBundles.researchRound35EmbodiedFoundation,
    ...sourceBundles.researchRound35HumanoidToolkits
  ],
  "unitree-h1": sourceBundles.researchRound35HumanoidToolkits,
  "agibot-a2": [
    ...sourceBundles.researchRound35EmbodiedFoundation,
    ...sourceBundles.researchRound35HumanoidToolkits
  ],
  "agibot-x2": [
    ...sourceBundles.researchRound35EmbodiedFoundation,
    ...sourceBundles.researchRound35HumanoidToolkits
  ],
  "fourier-gr1": sourceBundles.researchRound35HumanoidToolkits,
  "fourier-gr2": sourceBundles.researchRound35HumanoidToolkits,
  "leju-kuavo": sourceBundles.researchRound35HumanoidToolkits,
  "booster-t1": sourceBundles.researchRound35HumanoidToolkits,
  "engineai-pm01": sourceBundles.researchRound35HumanoidToolkits,
  "robotera-star1": sourceBundles.researchRound35HumanoidToolkits,
  "unitree-r1-air": sourceBundles.researchRound35HumanoidToolkits,
  "unitree-r1-d": sourceBundles.researchRound35HumanoidToolkits,
  "unitree-go2": [
    ...sourceBundles.researchRound35EmbodiedFoundation,
    ...sourceBundles.researchRound35NavigationToolkits
  ],
  "unitree-b2": sourceBundles.researchRound35NavigationToolkits,
  "unitree-a2": sourceBundles.researchRound35NavigationToolkits,
  "deeprobotics-lite3": sourceBundles.researchRound35NavigationToolkits,
  "deeprobotics-x30": sourceBundles.researchRound35NavigationToolkits,
  "deeprobotics-x20": sourceBundles.researchRound35NavigationToolkits,
  "unitree-go2-z1": [
    ...sourceBundles.researchRound35EmbodiedFoundation,
    ...sourceBundles.researchRound35ManipulationToolkits,
    ...sourceBundles.researchRound35NavigationToolkits
  ],
  "unitree-b2-z1": [
    ...sourceBundles.researchRound35ManipulationToolkits,
    ...sourceBundles.researchRound35NavigationToolkits
  ],
  "agilex-cobot-magic": [
    ...sourceBundles.researchRound35EmbodiedFoundation,
    ...sourceBundles.researchRound35ManipulationToolkits,
    ...sourceBundles.researchRound35NavigationToolkits
  ],
  "agilex-limo-piper": [
    ...sourceBundles.researchRound35ManipulationToolkits,
    ...sourceBundles.researchRound35NavigationToolkits
  ],
  "xarm-agilex-base": [
    ...sourceBundles.researchRound35ManipulationToolkits,
    ...sourceBundles.researchRound35NavigationToolkits
  ],
  "robotnik-rb-kairos": sourceBundles.researchRound35NavigationToolkits,
  "realman-mobile-manipulator": [
    ...sourceBundles.researchRound35ManipulationToolkits,
    ...sourceBundles.researchRound35NavigationToolkits
  ],
  "hello-stretch-3": [
    ...sourceBundles.researchRound35EmbodiedFoundation,
    ...sourceBundles.researchRound35ManipulationToolkits,
    ...sourceBundles.researchRound35NavigationToolkits
  ],
  "mobile-aloha": [
    ...sourceBundles.researchRound35EmbodiedFoundation,
    ...sourceBundles.researchRound35ManipulationToolkits
  ],
  "pal-tiago": [
    ...sourceBundles.researchRound35NavigationToolkits,
    ...sourceBundles.researchRound35ManipulationToolkits
  ],
  "franka-mobile-base": [
    ...sourceBundles.researchRound35ManipulationToolkits,
    ...sourceBundles.researchRound35NavigationToolkits
  ],
  "hiwonder-jetauto-pro": sourceBundles.researchRound35NavigationToolkits,
  "hiwonder-jetrover-arm": sourceBundles.researchRound35NavigationToolkits,
  "yahboom-rosmaster-x3-arm": sourceBundles.researchRound35NavigationToolkits,
  "turtlebot4-arm": sourceBundles.researchRound35NavigationToolkits
};

const round36ModelLinks = {
  "dobot-cr5": sourceBundles.researchRound36DobotEducationChannel,
  "unitree-z1": ["SRC1226"],
  "unitree-g1": ["SRC1221"],
  "unitree-r1-air": ["SRC1222"],
  "unitree-r1-d": ["SRC1222"],
  "unitree-go2": ["SRC1225"],
  "unitree-b2": ["SRC1223"],
  "unitree-a2": ["SRC1224"],
  "unitree-b2-z1": ["SRC1223", "SRC1226"],
  "unitree-go2-z1": ["SRC1225", "SRC1226"],
  "agilex-limo-piper": sourceBundles.researchRound36AgilexEducationChannels,
  "xarm-agilex-base": sourceBundles.researchRound36AgilexEducationChannels,
  "agilex-cobot-magic": ["SRC1227"],
  "hiwonder-jetauto-pro": sourceBundles.researchRound36TeachingCompositeOfficialPrices,
  "hiwonder-jetrover-arm": ["SRC1231"],
  "yahboom-rosmaster-x3-arm": ["SRC1232", "SRC1233"],
  "turtlebot4-arm": sourceBundles.researchRound36TeachingCompositeOfficialPrices
};

const round37ModelLinks = {
  "franka-research-3": [
    ...sourceBundles.researchRound37OpenVlaFinetune,
    ...sourceBundles.researchRound37PiFoundation,
    ...sourceBundles.researchRound37ChineseVla,
    ...sourceBundles.researchRound37LongHorizonManipulation
  ],
  "ur5e": [
    ...sourceBundles.researchRound37OpenVlaFinetune,
    ...sourceBundles.researchRound37ChineseVla,
    ...sourceBundles.researchRound37LongHorizonManipulation
  ],
  "ufactory-xarm-6": sourceBundles.researchRound37ManipulationModels,
  "ufactory-xarm-7": sourceBundles.researchRound37ManipulationModels,
  "kinova-gen3": [
    ...sourceBundles.researchRound37OpenVlaFinetune,
    ...sourceBundles.researchRound37PiFoundation,
    ...sourceBundles.researchRound37LongHorizonManipulation
  ],
  "agilex-piper": sourceBundles.researchRound37ManipulationModels,
  "unitree-z1": [
    ...sourceBundles.researchRound37OpenVlaFinetune,
    ...sourceBundles.researchRound37ChineseVla,
    ...sourceBundles.researchRound37LongHorizonManipulation
  ],
  "mycobot-280": [
    "SRC1261",
    "SRC1262",
    "SRC1234",
    "SRC1235",
    "SRC1236",
    "SRC1263",
    "SRC1264"
  ],
  "mycobot-320": [
    "SRC1261",
    "SRC1262",
    ...sourceBundles.researchRound37OpenVlaFinetune,
    "SRC1263",
    "SRC1264"
  ],
  "dobot-cr5": sourceBundles.researchRound37ManipulationModels,
  "dobot-mg400": [
    "SRC1261",
    "SRC1262",
    ...sourceBundles.researchRound37OpenVlaFinetune
  ],
  "unitree-g1": [
    ...sourceBundles.researchRound37HumanoidModels,
    ...sourceBundles.researchRound37NavigationFoundation
  ],
  "unitree-h1": [
    ...sourceBundles.researchRound37HumanoidModels,
    ...sourceBundles.researchRound37NavigationFoundation
  ],
  "unitree-r1-air": sourceBundles.researchRound37HumanoidModels,
  "unitree-r1-d": sourceBundles.researchRound37HumanoidModels,
  "agibot-a2": [
    ...sourceBundles.researchRound37HumanoidModels,
    "SRC1244",
    "SRC1259",
    "SRC1260"
  ],
  "agibot-x2": [
    ...sourceBundles.researchRound37HumanoidModels,
    "SRC1244",
    "SRC1259",
    "SRC1260"
  ],
  "fourier-gr1": [
    ...sourceBundles.researchRound37HumanoidModels,
    "SRC1237",
    "SRC1238"
  ],
  "fourier-gr2": [
    ...sourceBundles.researchRound37HumanoidModels,
    "SRC1237",
    "SRC1238"
  ],
  "ubtech-walker-s1": sourceBundles.researchRound37HumanoidModels,
  "leju-kuavo": sourceBundles.researchRound37HumanoidModels,
  "booster-t1": sourceBundles.researchRound37HumanoidModels,
  "engineai-pm01": sourceBundles.researchRound37HumanoidModels,
  "robotera-star1": sourceBundles.researchRound37HumanoidModels,
  "noetix-bumi": [
    "SRC1261",
    "SRC1262",
    "SRC1263",
    "SRC1264"
  ],
  "unitree-go2": sourceBundles.researchRound37NavigationFoundation,
  "unitree-b2": sourceBundles.researchRound37NavigationFoundation,
  "unitree-a2": sourceBundles.researchRound37NavigationFoundation,
  "unitree-go1": sourceBundles.researchRound37NavigationFoundation,
  "deeprobotics-lite3": sourceBundles.researchRound37NavigationFoundation,
  "deeprobotics-x30": sourceBundles.researchRound37NavigationFoundation,
  "deeprobotics-x20": sourceBundles.researchRound37NavigationFoundation,
  "deeprobotics-lynx-m20": sourceBundles.researchRound37NavigationFoundation,
  "limx-tron1": sourceBundles.researchRound37NavigationFoundation,
  "xiaomi-cyberdog2": sourceBundles.researchRound37NavigationFoundation,
  "unitree-go2-z1": sourceBundles.researchRound37MobileModels,
  "unitree-b2-z1": sourceBundles.researchRound37MobileModels,
  "agilex-cobot-magic": sourceBundles.researchRound37MobileModels,
  "agilex-limo-piper": sourceBundles.researchRound37MobileModels,
  "xarm-agilex-base": sourceBundles.researchRound37MobileModels,
  "robotnik-rb-kairos": [
    ...sourceBundles.researchRound37NavigationFoundation,
    ...sourceBundles.researchRound37LongHorizonManipulation
  ],
  "realman-mobile-manipulator": sourceBundles.researchRound37MobileModels,
  "hello-stretch-3": sourceBundles.researchRound37MobileModels,
  "mobile-aloha": [
    ...sourceBundles.researchRound37OpenVlaFinetune,
    ...sourceBundles.researchRound37PiFoundation,
    ...sourceBundles.researchRound37ChineseVla,
    ...sourceBundles.researchRound37LongHorizonManipulation
  ],
  "pal-tiago": [
    ...sourceBundles.researchRound37NavigationFoundation,
    ...sourceBundles.researchRound37LongHorizonManipulation
  ],
  "franka-mobile-base": sourceBundles.researchRound37MobileModels,
  "hiwonder-jetauto-pro": [
    "SRC1261",
    "SRC1262",
    ...sourceBundles.researchRound37NavigationFoundation
  ],
  "hiwonder-jetrover-arm": [
    "SRC1261",
    "SRC1262",
    ...sourceBundles.researchRound37NavigationFoundation
  ],
  "yahboom-rosmaster-x3-arm": [
    "SRC1261",
    "SRC1262",
    ...sourceBundles.researchRound37NavigationFoundation
  ],
  "turtlebot4-arm": [
    "SRC1261",
    "SRC1262",
    ...sourceBundles.researchRound37NavigationFoundation
  ]
};

const round38ModelLinks = {
  "franka-research-3": [
    ...sourceBundles.researchRound38ArmAcademic,
    ...sourceBundles.researchRound38GalaxeaVla
  ],
  "ur5e": sourceBundles.researchRound38ArmAcademic,
  "ufactory-xarm-6": [
    ...sourceBundles.researchRound38ArmAcademic,
    ...sourceBundles.researchRound38GalaxeaVla
  ],
  "ufactory-xarm-7": [
    ...sourceBundles.researchRound38ArmAcademic,
    ...sourceBundles.researchRound38GalaxeaVla
  ],
  "dobot-cr5": sourceBundles.researchRound38ArmAcademic,
  "dobot-mg400": [
    ...sourceBundles.researchRound38AudioVisualOperation,
    ...sourceBundles.researchRound38LongHorizonReasoning
  ],
  "kinova-gen3": sourceBundles.researchRound38ArmAcademic,
  "agilex-piper": sourceBundles.researchRound38ArmAcademic,
  "unitree-z1": [
    ...sourceBundles.researchRound38ArmAcademic,
    ...sourceBundles.researchRound38QuadrupedManipulation
  ],
  "mycobot-280": [
    ...sourceBundles.researchRound38AudioVisualOperation,
    ...sourceBundles.researchRound38LongHorizonReasoning
  ],
  "mycobot-320": [
    ...sourceBundles.researchRound38AudioVisualOperation,
    ...sourceBundles.researchRound38LongHorizonReasoning
  ],
  "unitree-g1": sourceBundles.researchRound38HumanoidAcademic,
  "unitree-h1": sourceBundles.researchRound38HumanoidAcademic,
  "agibot-a2": sourceBundles.researchRound38HumanoidAcademic,
  "agibot-x2": sourceBundles.researchRound38HumanoidAcademic,
  "fourier-gr1": sourceBundles.researchRound38HumanoidAcademic,
  "fourier-gr2": sourceBundles.researchRound38HumanoidAcademic,
  "ubtech-walker-s1": sourceBundles.researchRound38HumanoidAcademic,
  "leju-kuavo": sourceBundles.researchRound38HumanoidAcademic,
  "booster-t1": sourceBundles.researchRound38HumanoidAcademic,
  "engineai-pm01": sourceBundles.researchRound38HumanoidAcademic,
  "robotera-star1": sourceBundles.researchRound38HumanoidAcademic,
  "unitree-r1-air": [
    ...sourceBundles.researchRound38GalaxeaVla,
    ...sourceBundles.researchRound38LongHorizonReasoning
  ],
  "unitree-r1-d": [
    ...sourceBundles.researchRound38GalaxeaVla,
    ...sourceBundles.researchRound38LongHorizonReasoning
  ],
  "noetix-bumi": sourceBundles.researchRound38LongHorizonReasoning,
  "unitree-go2": sourceBundles.researchRound38QuadrupedAcademic,
  "unitree-b2": sourceBundles.researchRound38QuadrupedAcademic,
  "unitree-a2": sourceBundles.researchRound38QuadrupedAcademic,
  "unitree-go1": sourceBundles.researchRound38QuadrupedAcademic,
  "deeprobotics-lite3": sourceBundles.researchRound38QuadrupedAcademic,
  "deeprobotics-x30": sourceBundles.researchRound38QuadrupedAcademic,
  "deeprobotics-x20": sourceBundles.researchRound38QuadrupedAcademic,
  "deeprobotics-lynx-m20": sourceBundles.researchRound38QuadrupedAcademic,
  "limx-tron1": sourceBundles.researchRound38QuadrupedAcademic,
  "unitree-go2-z1": sourceBundles.researchRound38CompositeAcademic,
  "unitree-b2-z1": sourceBundles.researchRound38CompositeAcademic,
  "agilex-cobot-magic": sourceBundles.researchRound38CompositeAcademic,
  "agilex-limo-piper": sourceBundles.researchRound38CompositeAcademic,
  "xarm-agilex-base": sourceBundles.researchRound38CompositeAcademic,
  "robotnik-rb-kairos": sourceBundles.researchRound38CompositeAcademic,
  "realman-mobile-manipulator": sourceBundles.researchRound38CompositeAcademic,
  "hello-stretch-3": sourceBundles.researchRound38CompositeAcademic,
  "mobile-aloha": sourceBundles.researchRound38CompositeAcademic,
  "pal-tiago": sourceBundles.researchRound38CompositeAcademic,
  "franka-mobile-base": sourceBundles.researchRound38CompositeAcademic,
  "hiwonder-jetauto-pro": [
    ...sourceBundles.researchRound38BimanualMobile,
    ...sourceBundles.researchRound38LongHorizonReasoning
  ],
  "hiwonder-jetrover-arm": [
    ...sourceBundles.researchRound38BimanualMobile,
    ...sourceBundles.researchRound38LongHorizonReasoning
  ],
  "yahboom-rosmaster-x3-arm": [
    ...sourceBundles.researchRound38BimanualMobile,
    ...sourceBundles.researchRound38LongHorizonReasoning
  ],
  "turtlebot4-arm": [
    ...sourceBundles.researchRound38BimanualMobile,
    ...sourceBundles.researchRound38LongHorizonReasoning
  ]
};

const round39ModelLinks = {
  "franka-research-3": sourceBundles.researchRound39ManipulationAcademic,
  "ur5e": [
    ...sourceBundles.researchRound39ManipulationAcademic,
    ...sourceBundles.researchRound39ProcurementArms
  ],
  "ufactory-xarm-6": sourceBundles.researchRound39ManipulationAcademic,
  "ufactory-xarm-7": sourceBundles.researchRound39ManipulationAcademic,
  "dobot-cr5": sourceBundles.researchRound39ManipulationAcademic,
  "kinova-gen3": sourceBundles.researchRound39ManipulationAcademic,
  "agilex-piper": sourceBundles.researchRound39ManipulationAcademic,
  "unitree-z1": [
    ...sourceBundles.researchRound39ManipulationAcademic,
    ...sourceBundles.researchRound39ProcurementComposite
  ],
  "unitree-g1": [
    ...sourceBundles.researchRound39HumanoidAcademic,
    ...sourceBundles.researchRound39ProcurementHumanoids,
    "SRC1300"
  ],
  "unitree-h1": [
    ...sourceBundles.researchRound39HumanoidAcademic,
    ...sourceBundles.researchRound39ProcurementHumanoids,
    "SRC1305"
  ],
  "agibot-a2": [
    ...sourceBundles.researchRound39HumanoidAcademic,
    ...sourceBundles.researchRound39ProcurementHumanoids,
    "SRC1305"
  ],
  "agibot-x2": [
    ...sourceBundles.researchRound39HumanoidAcademic,
    ...sourceBundles.researchRound39ProcurementHumanoids
  ],
  "fourier-gr1": [
    ...sourceBundles.researchRound39HumanoidAcademic,
    ...sourceBundles.researchRound39ProcurementHumanoids
  ],
  "fourier-gr2": [
    ...sourceBundles.researchRound39HumanoidAcademic,
    ...sourceBundles.researchRound39ProcurementHumanoids
  ],
  "ubtech-walker-s1": [
    ...sourceBundles.researchRound39HumanoidAcademic,
    ...sourceBundles.researchRound39ProcurementHumanoids
  ],
  "leju-kuavo": [
    ...sourceBundles.researchRound39HumanoidAcademic,
    ...sourceBundles.researchRound39ProcurementHumanoids
  ],
  "booster-t1": [
    ...sourceBundles.researchRound39HumanoidAcademic,
    ...sourceBundles.researchRound39ProcurementHumanoids
  ],
  "engineai-pm01": [
    ...sourceBundles.researchRound39HumanoidAcademic,
    ...sourceBundles.researchRound39ProcurementHumanoids
  ],
  "robotera-star1": [
    ...sourceBundles.researchRound39HumanoidAcademic,
    ...sourceBundles.researchRound39ProcurementHumanoids
  ],
  "unitree-r1-air": sourceBundles.researchRound39ProcurementHumanoids,
  "unitree-r1-d": sourceBundles.researchRound39ProcurementHumanoids,
  "unitree-go2": [
    ...sourceBundles.researchRound39ProcurementQuadrupeds,
    "SRC1301"
  ],
  "unitree-b2": sourceBundles.researchRound39ProcurementQuadrupeds,
  "unitree-a2": sourceBundles.researchRound39ProcurementQuadrupeds,
  "deeprobotics-lite3": sourceBundles.researchRound39ProcurementQuadrupeds,
  "deeprobotics-x30": sourceBundles.researchRound39ProcurementQuadrupeds,
  "limx-tron1": sourceBundles.researchRound39ProcurementQuadrupeds,
  "unitree-go2-z1": [
    ...sourceBundles.researchRound39CompositeAcademic,
    ...sourceBundles.researchRound39ProcurementQuadrupeds,
    ...sourceBundles.researchRound39ProcurementComposite,
    "SRC1301"
  ],
  "unitree-b2-z1": [
    ...sourceBundles.researchRound39CompositeAcademic,
    ...sourceBundles.researchRound39ProcurementQuadrupeds,
    ...sourceBundles.researchRound39ProcurementComposite
  ],
  "agilex-cobot-magic": [
    ...sourceBundles.researchRound39CompositeAcademic,
    ...sourceBundles.researchRound39ProcurementComposite,
    "SRC1304"
  ],
  "agilex-limo-piper": [
    ...sourceBundles.researchRound39CompositeAcademic,
    ...sourceBundles.researchRound39ProcurementComposite
  ],
  "xarm-agilex-base": [
    ...sourceBundles.researchRound39CompositeAcademic,
    ...sourceBundles.researchRound39ProcurementComposite,
    "SRC1296"
  ],
  "robotnik-rb-kairos": [
    ...sourceBundles.researchRound39CompositeAcademic,
    ...sourceBundles.researchRound39ProcurementComposite
  ],
  "realman-mobile-manipulator": [
    ...sourceBundles.researchRound39CompositeAcademic,
    ...sourceBundles.researchRound39ProcurementComposite,
    "SRC1302"
  ],
  "hello-stretch-3": [
    ...sourceBundles.researchRound39CompositeAcademic,
    ...sourceBundles.researchRound39ProcurementComposite
  ],
  "mobile-aloha": [
    ...sourceBundles.researchRound39CompositeAcademic,
    ...sourceBundles.researchRound39ProcurementComposite,
    "SRC1304"
  ],
  "pal-tiago": [
    ...sourceBundles.researchRound39CompositeAcademic,
    ...sourceBundles.researchRound39ProcurementComposite
  ],
  "franka-mobile-base": [
    ...sourceBundles.researchRound39CompositeAcademic,
    ...sourceBundles.researchRound39ProcurementComposite,
    "SRC1296"
  ]
};

const round40ModelLinks = {
  "ur5e": sourceBundles.researchRound40ProcurementArms,
  "franka-research-3": sourceBundles.researchRound40ProcurementArms,
  "xarm-agilex-base": [
    ...sourceBundles.researchRound40ProcurementArms,
    ...sourceBundles.researchRound40ProcurementComposite
  ],
  "franka-mobile-base": [
    ...sourceBundles.researchRound40ProcurementArms,
    ...sourceBundles.researchRound40ProcurementComposite
  ],
  "unitree-g1": [
    ...sourceBundles.researchRound40ProcurementHumanoids,
    "SRC1309",
    "SRC1314"
  ],
  "unitree-h1": [
    ...sourceBundles.researchRound40ProcurementHumanoids,
    "SRC1315"
  ],
  "agibot-a2": [
    ...sourceBundles.researchRound40ProcurementHumanoids,
    "SRC1315"
  ],
  "agibot-x2": sourceBundles.researchRound40ProcurementHumanoids,
  "fourier-gr1": sourceBundles.researchRound40ProcurementHumanoids,
  "fourier-gr2": sourceBundles.researchRound40ProcurementHumanoids,
  "ubtech-walker-s1": sourceBundles.researchRound40ProcurementHumanoids,
  "leju-kuavo": sourceBundles.researchRound40ProcurementHumanoids,
  "booster-t1": sourceBundles.researchRound40ProcurementHumanoids,
  "engineai-pm01": sourceBundles.researchRound40ProcurementHumanoids,
  "robotera-star1": sourceBundles.researchRound40ProcurementHumanoids,
  "unitree-r1-air": [
    "SRC1314",
    "SRC1311"
  ],
  "unitree-r1-d": [
    "SRC1314",
    "SRC1311"
  ],
  "unitree-go2": [
    ...sourceBundles.researchRound40ProcurementQuadrupeds,
    "SRC1308",
    "SRC1310"
  ],
  "unitree-b2": sourceBundles.researchRound40ProcurementQuadrupeds,
  "unitree-a2": sourceBundles.researchRound40ProcurementQuadrupeds,
  "unitree-go1": sourceBundles.researchRound40ProcurementQuadrupeds,
  "deeprobotics-lite3": sourceBundles.researchRound40ProcurementQuadrupeds,
  "deeprobotics-x30": sourceBundles.researchRound40ProcurementQuadrupeds,
  "limx-tron1": sourceBundles.researchRound40ProcurementQuadrupeds,
  "unitree-go2-z1": [
    ...sourceBundles.researchRound40ProcurementQuadrupeds,
    ...sourceBundles.researchRound40ProcurementComposite
  ],
  "unitree-b2-z1": [
    ...sourceBundles.researchRound40ProcurementQuadrupeds,
    ...sourceBundles.researchRound40ProcurementComposite
  ],
  "agilex-cobot-magic": sourceBundles.researchRound40ProcurementComposite,
  "agilex-limo-piper": sourceBundles.researchRound40ProcurementComposite,
  "robotnik-rb-kairos": sourceBundles.researchRound40ProcurementComposite,
  "realman-mobile-manipulator": [
    ...sourceBundles.researchRound40ProcurementComposite,
    "SRC1312"
  ],
  "hello-stretch-3": sourceBundles.researchRound40ProcurementComposite,
  "mobile-aloha": sourceBundles.researchRound40ProcurementComposite,
  "pal-tiago": sourceBundles.researchRound40ProcurementComposite
};

const round41ModelLinks = {
  "booster-t1": sourceBundles.researchRound41BoosterOfficial,
  "engineai-pm01": sourceBundles.researchRound41EngineAiOfficial,
  "robotera-star1": sourceBundles.researchRound41RobotEraOfficial,
  "limx-tron1": sourceBundles.researchRound41LimxOfficial,
  "xiaomi-cyberdog2": sourceBundles.researchRound41CyberDogOfficial,
  "realman-rm65": sourceBundles.researchRound41RealManOfficial,
  "realman-mobile-manipulator": sourceBundles.researchRound41RealManOfficial,
  "robotnik-rb-kairos": sourceBundles.researchRound41RobotnikOfficial,
  "franka-mobile-base": sourceBundles.researchRound41RobotnikOfficial,
  "xarm-agilex-base": sourceBundles.researchRound41RobotnikOfficial,
  "agilex-cobot-magic": [
    ...sourceBundles.researchRound41RealManOfficial,
    ...sourceBundles.researchRound41RobotnikOfficial
  ],
  "agilex-limo-piper": [
    ...sourceBundles.researchRound41RealManOfficial,
    ...sourceBundles.researchRound41RobotnikOfficial
  ],
  "unitree-go2": sourceBundles.researchRound41CyberDogOfficial,
  "unitree-b2": sourceBundles.researchRound41LimxOfficial,
  "unitree-a2": sourceBundles.researchRound41LimxOfficial,
  "unitree-go2-z1": [
    ...sourceBundles.researchRound41LimxOfficial,
    ...sourceBundles.researchRound41RealManOfficial
  ],
  "unitree-b2-z1": [
    ...sourceBundles.researchRound41LimxOfficial,
    ...sourceBundles.researchRound41RealManOfficial
  ],
  "fourier-gr1": [
    ...sourceBundles.researchRound41BoosterOfficial,
    ...sourceBundles.researchRound41RobotEraOfficial
  ],
  "fourier-gr2": [
    ...sourceBundles.researchRound41BoosterOfficial,
    ...sourceBundles.researchRound41RobotEraOfficial
  ],
  "unitree-g1": [
    ...sourceBundles.researchRound41BoosterOfficial,
    ...sourceBundles.researchRound41RobotEraOfficial,
    ...sourceBundles.researchRound41EngineAiOfficial
  ],
  "unitree-h1": [
    ...sourceBundles.researchRound41RobotEraOfficial,
    ...sourceBundles.researchRound41EngineAiOfficial
  ]
};

const round42ModelLinks = {
  "franka-research-3": [
    ...sourceBundles.researchRound42BimanualMobile,
    ...sourceBundles.researchRound42DexterousTactile,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ],
  "ur5e": [
    ...sourceBundles.researchRound42BimanualMobile,
    ...sourceBundles.researchRound42DexterousTactile,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ],
  "ufactory-xarm-6": [
    ...sourceBundles.researchRound42LowCostMobile,
    ...sourceBundles.researchRound42DexterousTactile,
    ...sourceBundles.researchRound42ChineseLabs
  ],
  "ufactory-xarm-7": [
    ...sourceBundles.researchRound42BimanualMobile,
    ...sourceBundles.researchRound42LowCostMobile,
    ...sourceBundles.researchRound42DexterousTactile,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ],
  "unitree-z1": [
    ...sourceBundles.researchRound42DexterousTactile,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ],
  "agilex-piper": [
    ...sourceBundles.researchRound42LowCostMobile,
    ...sourceBundles.researchRound42ChineseLabs
  ],
  "mycobot-280": sourceBundles.researchRound42LowCostMobile,
  "mycobot-320": [
    ...sourceBundles.researchRound42LowCostMobile,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ],
  "unitree-g1": [
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ],
  "unitree-h1": [
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ],
  "fourier-gr1": [
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42ChineseLabs
  ],
  "fourier-gr2": [
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42ChineseLabs
  ],
  "engineai-pm01": [
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42ChineseLabs
  ],
  "booster-t1": [
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42ChineseLabs
  ],
  "robotera-star1": [
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42ChineseLabs
  ],
  "unitree-r1-air": sourceBundles.researchRound42LeggedHumanoidLabs,
  "unitree-r1-d": sourceBundles.researchRound42LeggedHumanoidLabs,
  "unitree-go2": [
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ],
  "unitree-b2": sourceBundles.researchRound42LeggedHumanoidLabs,
  "unitree-a2": sourceBundles.researchRound42LeggedHumanoidLabs,
  "xiaomi-cyberdog2": [
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42ChineseLabs
  ],
  "limx-tron1": [
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42ChineseLabs
  ],
  "mobile-aloha": [
    ...sourceBundles.researchRound42BimanualMobile,
    ...sourceBundles.researchRound42LowCostMobile,
    ...sourceBundles.researchRound42DexterousTactile,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ],
  "agilex-cobot-magic": [
    ...sourceBundles.researchRound42BimanualMobile,
    ...sourceBundles.researchRound42LowCostMobile,
    ...sourceBundles.researchRound42DexterousTactile,
    ...sourceBundles.researchRound42ChineseLabs
  ],
  "agilex-limo-piper": [
    ...sourceBundles.researchRound42LowCostMobile,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ],
  "hello-stretch-3": [
    ...sourceBundles.researchRound42LowCostMobile,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ],
  "pal-tiago": [
    ...sourceBundles.researchRound42GeneralRoboticsLabs,
    ...sourceBundles.researchRound42DexterousTactile
  ],
  "robotnik-rb-kairos": [
    ...sourceBundles.researchRound42GeneralRoboticsLabs,
    ...sourceBundles.researchRound42DexterousTactile
  ],
  "realman-mobile-manipulator": [
    ...sourceBundles.researchRound42LowCostMobile,
    ...sourceBundles.researchRound42ChineseLabs
  ],
  "unitree-go2-z1": [
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42LowCostMobile,
    ...sourceBundles.researchRound42DexterousTactile
  ],
  "unitree-b2-z1": [
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42DexterousTactile
  ],
  "xarm-agilex-base": [
    ...sourceBundles.researchRound42LowCostMobile,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ],
  "franka-mobile-base": [
    ...sourceBundles.researchRound42BimanualMobile,
    ...sourceBundles.researchRound42GeneralRoboticsLabs
  ]
};

const round43ModelLinks = {
  "franka-research-3": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43ResearchInstitutes,
    ...sourceBundles.researchRound43ArmOpenSource
  ],
  "ur5e": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43ProcurementPlatforms,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "ufactory-xarm-6": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "ufactory-xarm-7": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43ArmOpenSource,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "dobot-cr5": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43ProcurementPlatforms,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "unitree-z1": [
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43ArmOpenSource,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "agilex-piper": [
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43ArmOpenSource,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "mycobot-280": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "mycobot-320": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43ArmChannels,
    ...sourceBundles.researchRound43ArmOpenSource
  ],
  "unitree-g1": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43HumanoidOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes,
    ...sourceBundles.researchRound43ProcurementPlatforms
  ],
  "unitree-h1": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43HumanoidOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes,
    ...sourceBundles.researchRound43ProcurementPlatforms
  ],
  "fourier-gr1": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43HumanoidOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes,
    ...sourceBundles.researchRound43ProcurementPlatforms
  ],
  "fourier-gr2": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43HumanoidOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes
  ],
  "agibot-a2": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43ProcurementPlatforms,
    ...sourceBundles.researchRound43ResearchInstitutes
  ],
  "agibot-x2": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43ArmChannels,
    ...sourceBundles.researchRound43ProcurementPlatforms
  ],
  "ubtech-walker-s1": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43ProcurementPlatforms,
    ...sourceBundles.researchRound43IndustryMedia
  ],
  "leju-kuavo": [
    ...sourceBundles.researchRound43HumanoidOpenSource,
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43ProcurementPlatforms
  ],
  "engineai-pm01": [
    ...sourceBundles.researchRound43HumanoidOpenSource,
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "booster-t1": [
    ...sourceBundles.researchRound43HumanoidOpenSource,
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43ResearchInstitutes
  ],
  "robotera-star1": [
    ...sourceBundles.researchRound43HumanoidOpenSource,
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43ResearchInstitutes
  ],
  "unitree-go2": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43LeggedOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes,
    ...sourceBundles.researchRound43QuadrupedChannels,
    ...sourceBundles.researchRound43ProcurementPlatforms
  ],
  "unitree-b2": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43LeggedOpenSource,
    ...sourceBundles.researchRound43QuadrupedChannels,
    ...sourceBundles.researchRound43ProcurementPlatforms
  ],
  "unitree-a2": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43LeggedOpenSource,
    ...sourceBundles.researchRound43QuadrupedChannels
  ],
  "deeprobotics-lite3": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43LeggedOpenSource,
    ...sourceBundles.researchRound43QuadrupedChannels
  ],
  "deeprobotics-x30": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43LeggedOpenSource,
    ...sourceBundles.researchRound43ProcurementPlatforms
  ],
  "xiaomi-cyberdog2": [
    ...sourceBundles.researchRound43LeggedOpenSource,
    ...sourceBundles.researchRound43QuadrupedChannels
  ],
  "limx-tron1": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43HumanoidOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes
  ],
  "mobile-aloha": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43MobileOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "agilex-cobot-magic": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43MobileOpenSource,
    ...sourceBundles.researchRound43ProcurementPlatforms,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "agilex-limo-piper": [
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43ArmOpenSource,
    ...sourceBundles.researchRound43ArmChannels,
    ...sourceBundles.researchRound43ProcurementPlatforms
  ],
  "hello-stretch-3": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43MobileOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes,
    ...sourceBundles.researchRound43IndustryMedia
  ],
  "pal-tiago": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43ResearchInstitutes
  ],
  "robotnik-rb-kairos": [
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43MobileOpenSource,
    ...sourceBundles.researchRound43ProcurementPlatforms,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "realman-mobile-manipulator": [
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43MobileOpenSource,
    ...sourceBundles.researchRound43ProcurementPlatforms,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "unitree-go2-z1": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43MobileOpenSource,
    ...sourceBundles.researchRound43QuadrupedChannels
  ],
  "unitree-b2-z1": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43MobileOpenSource,
    ...sourceBundles.researchRound43QuadrupedChannels
  ],
  "xarm-agilex-base": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43MobileOpenSource,
    ...sourceBundles.researchRound43ProcurementPlatforms,
    ...sourceBundles.researchRound43ArmChannels
  ],
  "franka-mobile-base": [
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43MobileOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes
  ],
  "hiwonder-jetauto-pro": [
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43ArmChannels,
    ...sourceBundles.researchRound43ProcurementPlatforms
  ],
  "turtlebot4-arm": [
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43MobileOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes
  ]
};

const round44ModelLinks = {
  "franka-research-3": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44GlobalCourses
  ],
  "ur5e": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44IndustryAssociations,
    ...sourceBundles.researchRound44GlobalCourses
  ],
  "ufactory-xarm-6": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses
  ],
  "ufactory-xarm-7": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses
  ],
  "dobot-cr5": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44IndustryAssociations
  ],
  "dobot-mg400": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnCourses
  ],
  "jaka-zu7": sourceBundles.researchRound44IpStandards,
  "aubo-i5": sourceBundles.researchRound44IpStandards,
  "elite-ec66": sourceBundles.researchRound44IpStandards,
  "realman-rm65": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnOpenSource
  ],
  "unitree-z1": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnOpenSource
  ],
  "agilex-piper": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses
  ],
  "mycobot-280": [
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44PublicEducation
  ],
  "mycobot-320": [
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44ModelDataCn
  ],
  "unitree-g1": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44IndustryAssociations
  ],
  "unitree-h1": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44IndustryAssociations,
    ...sourceBundles.researchRound44GlobalCourses
  ],
  "unitree-r1-air": [
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44PublicEducation
  ],
  "unitree-r1-d": [
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44ModelDataCn
  ],
  "agibot-a2": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnCourses
  ],
  "agibot-x2": [
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44PublicEducation
  ],
  "fourier-gr1": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44GlobalCourses
  ],
  "fourier-gr2": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44GlobalCourses
  ],
  "ubtech-walker-s1": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44IndustryAssociations,
    ...sourceBundles.researchRound44PublicEducation
  ],
  "leju-kuavo": [
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44ModelDataCn
  ],
  "booster-t1": [
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44GlobalCourses
  ],
  "engineai-pm01": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses
  ],
  "robotera-star1": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnCourses
  ],
  "unitree-go2": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44IndustryAssociations
  ],
  "unitree-b2": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44IndustryAssociations
  ],
  "unitree-a2": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44IndustryAssociations
  ],
  "unitree-go1": [
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses
  ],
  "deeprobotics-lite3": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnCourses
  ],
  "deeprobotics-x30": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44IndustryAssociations
  ],
  "xiaomi-cyberdog2": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44PublicEducation
  ],
  "limx-tron1": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44GlobalCourses
  ],
  "mobile-aloha": [
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44GlobalCourses
  ],
  "agilex-cobot-magic": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44IndustryAssociations
  ],
  "agilex-limo-piper": [
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44ModelDataCn
  ],
  "hello-stretch-3": [
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44GlobalCourses,
    ...sourceBundles.researchRound44IndustryAssociations
  ],
  "pal-tiago": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44GlobalCourses,
    ...sourceBundles.researchRound44IndustryAssociations
  ],
  "robotnik-rb-kairos": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44IndustryAssociations,
    ...sourceBundles.researchRound44GlobalCourses
  ],
  "realman-mobile-manipulator": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses
  ],
  "unitree-go2-z1": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses
  ],
  "unitree-b2-z1": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44IndustryAssociations
  ],
  "xarm-agilex-base": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses
  ],
  "franka-mobile-base": [
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44GlobalCourses,
    ...sourceBundles.researchRound44IndustryAssociations
  ],
  "hiwonder-jetauto-pro": [
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44PublicEducation
  ],
  "hiwonder-jetrover-arm": [
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44PublicEducation
  ],
  "yahboom-rosmaster-x3-arm": [
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44PublicEducation
  ],
  "turtlebot4-arm": [
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44GlobalCourses
  ]
};

const round45ModelLinks = {
  "franka-research-3": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45ManipulationProjects
  ],
  "ur5e": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ManipulationProjects,
    "SRC1409",
    "SRC1412",
    "SRC1413"
  ],
  "ufactory-xarm-6": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ManipulationProjects,
    "SRC1410",
    "SRC1415"
  ],
  "ufactory-xarm-7": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ManipulationProjects,
    "SRC1410",
    "SRC1415"
  ],
  "dobot-cr5": [
    ...sourceBundles.researchRound45AcademicIndexes,
    "SRC1419",
    "SRC1420",
    "SRC1421",
    "SRC1426"
  ],
  "dobot-mg400": [
    ...sourceBundles.researchRound45AcademicIndexes,
    "SRC1419",
    "SRC1420",
    "SRC1421"
  ],
  "kinova-gen3": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ManipulationProjects,
    "SRC1411",
    "SRC1415"
  ],
  "unitree-z1": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ManipulationProjects,
    ...sourceBundles.researchRound45QuadrupedProjects
  ],
  "agilex-piper": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ManipulationProjects,
    ...sourceBundles.researchRound45MobileProjects
  ],
  "mycobot-280": [
    "SRC1406",
    "SRC1419",
    "SRC1420",
    "SRC1421",
    "SRC1424"
  ],
  "mycobot-320": [
    "SRC1406",
    "SRC1419",
    "SRC1420",
    "SRC1421",
    "SRC1424"
  ],
  "unitree-g1": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45HumanoidProjects,
    ...sourceBundles.researchRound45MobileProjects
  ],
  "unitree-h1": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45HumanoidProjects
  ],
  "agibot-a2": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45HumanoidProjects,
    ...sourceBundles.researchRound45MobileProjects,
    "SRC1408"
  ],
  "agibot-x2": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45HumanoidProjects,
    ...sourceBundles.researchRound45MobileProjects,
    "SRC1408"
  ],
  "fourier-gr1": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45HumanoidProjects,
    "SRC1411"
  ],
  "fourier-gr2": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45HumanoidProjects,
    "SRC1411"
  ],
  "leju-kuavo": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45HumanoidProjects,
    "SRC1406"
  ],
  "booster-t1": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45HumanoidProjects,
    "SRC1406"
  ],
  "robotera-star1": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45HumanoidProjects,
    "SRC1426"
  ],
  "unitree-go2": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45QuadrupedProjects,
    ...sourceBundles.researchRound45MobileProjects
  ],
  "unitree-b2": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45QuadrupedProjects,
    "SRC1407",
    "SRC1411"
  ],
  "unitree-a2": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45QuadrupedProjects,
    "SRC1407",
    "SRC1411"
  ],
  "deeprobotics-lite3": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45QuadrupedProjects,
    "SRC1407",
    "SRC1411"
  ],
  "deeprobotics-x30": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45QuadrupedProjects,
    "SRC1407",
    "SRC1411"
  ],
  "limx-tron1": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45HumanoidProjects,
    ...sourceBundles.researchRound45QuadrupedProjects
  ],
  "mobile-aloha": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45ManipulationProjects,
    ...sourceBundles.researchRound45MobileProjects
  ],
  "agilex-cobot-magic": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45ManipulationProjects,
    ...sourceBundles.researchRound45MobileProjects
  ],
  "agilex-limo-piper": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ManipulationProjects,
    ...sourceBundles.researchRound45MobileProjects
  ],
  "hello-stretch-3": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45MobileProjects
  ],
  "pal-tiago": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45MobileProjects
  ],
  "robotnik-rb-kairos": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45MobileProjects,
    "SRC1411",
    "SRC1414"
  ],
  "realman-mobile-manipulator": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ManipulationProjects,
    ...sourceBundles.researchRound45MobileProjects,
    "SRC1406"
  ],
  "unitree-go2-z1": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ManipulationProjects,
    ...sourceBundles.researchRound45QuadrupedProjects,
    ...sourceBundles.researchRound45MobileProjects
  ],
  "unitree-b2-z1": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ManipulationProjects,
    ...sourceBundles.researchRound45QuadrupedProjects,
    ...sourceBundles.researchRound45MobileProjects
  ],
  "xarm-agilex-base": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ManipulationProjects,
    ...sourceBundles.researchRound45MobileProjects,
    "SRC1410",
    "SRC1415"
  ],
  "franka-mobile-base": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45ManipulationProjects,
    ...sourceBundles.researchRound45MobileProjects
  ],
  "hiwonder-jetauto-pro": [
    "SRC1406",
    "SRC1419",
    "SRC1420",
    "SRC1421",
    "SRC1426"
  ],
  "hiwonder-jetrover-arm": [
    "SRC1406",
    "SRC1419",
    "SRC1420",
    "SRC1421"
  ],
  "yahboom-rosmaster-x3-arm": [
    "SRC1406",
    "SRC1419",
    "SRC1420",
    "SRC1421"
  ],
  "turtlebot4-arm": [
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45MobileProjects,
    "SRC1414"
  ]
};

const round46ModelLinks = {
  "franka-research-3": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "ur5e": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "ufactory-xarm-6": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "ufactory-xarm-7": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "dobot-cr5": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "jaka-zu7": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "aubo-i5": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "elite-ec66": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "realman-rm65": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "mycobot-280": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    "SRC1445",
    "SRC1447"
  ],
  "unitree-g1": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "unitree-h1": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "agibot-a2": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "agibot-x2": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "fourier-gr1": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "fourier-gr2": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "booster-t1": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "engineai-pm01": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    "SRC1443",
    "SRC1445"
  ],
  "unitree-go2": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "unitree-b2": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "unitree-a2": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "deeprobotics-lite3": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "deeprobotics-x30": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "limx-tron1": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "mobile-aloha": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "agilex-cobot-magic": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "agilex-limo-piper": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "hello-stretch-3": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "pal-tiago": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "robotnik-rb-kairos": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "realman-mobile-manipulator": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "unitree-go2-z1": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "unitree-b2-z1": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "xarm-agilex-base": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "franka-mobile-base": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ],
  "hiwonder-jetauto-pro": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    "SRC1445",
    "SRC1447"
  ],
  "hiwonder-jetrover-arm": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    "SRC1445",
    "SRC1447"
  ],
  "yahboom-rosmaster-x3-arm": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    "SRC1445",
    "SRC1447"
  ],
  "turtlebot4-arm": [
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement
  ]
};

const round47ModelLinks = {
  "ufactory-xarm-6": sourceBundles.researchRound47UfactorySupport,
  "ufactory-xarm-7": sourceBundles.researchRound47UfactorySupport,
  "aubo-i5": sourceBundles.researchRound47AuboSupport,
  "jaka-zu7": sourceBundles.researchRound47JakaSupport,
  "elite-ec66": sourceBundles.researchRound47EliteSupport,
  "realman-rm65": sourceBundles.researchRound47RealmanSupport,
  "unitree-z1": sourceBundles.researchRound47UnitreeSupport,
  "agilex-piper": sourceBundles.researchRound47AgilexSupport,
  "unitree-g1": sourceBundles.researchRound47UnitreeSupport,
  "unitree-h1": sourceBundles.researchRound47UnitreeSupport,
  "unitree-r1-air": sourceBundles.researchRound47UnitreeSupport,
  "unitree-r1-d": sourceBundles.researchRound47UnitreeSupport,
  "fourier-gr1": sourceBundles.researchRound47FourierSupport,
  "fourier-gr2": sourceBundles.researchRound47FourierSupport,
  "booster-t1": sourceBundles.researchRound47BoosterSupport,
  "engineai-pm01": sourceBundles.researchRound47EngineAiSupport,
  "unitree-go2": sourceBundles.researchRound47UnitreeSupport,
  "unitree-b2": sourceBundles.researchRound47UnitreeSupport,
  "unitree-a2": sourceBundles.researchRound47UnitreeSupport,
  "unitree-go1": sourceBundles.researchRound47UnitreeSupport,
  "unitree-b2-z1": sourceBundles.researchRound47UnitreeSupport,
  "unitree-go2-z1": [
    ...sourceBundles.researchRound47UnitreeSupport,
    ...sourceBundles.researchRound47AgilexSupport
  ],
  "xiaomi-cyberdog2": sourceBundles.researchRound47TeachingSupport,
  "agilex-cobot-magic": [
    ...sourceBundles.researchRound47AgilexSupport,
    ...sourceBundles.researchRound47UfactorySupport
  ],
  "agilex-limo-piper": sourceBundles.researchRound47AgilexSupport,
  "xarm-agilex-base": [
    ...sourceBundles.researchRound47AgilexSupport,
    ...sourceBundles.researchRound47UfactorySupport
  ],
  "franka-mobile-base": [
    ...sourceBundles.researchRound47AgilexSupport,
    ...sourceBundles.researchRound47PalSupport
  ],
  "realman-mobile-manipulator": sourceBundles.researchRound47RealmanSupport,
  "hello-stretch-3": sourceBundles.researchRound47HelloSupport,
  "pal-tiago": sourceBundles.researchRound47PalSupport,
  "robotnik-rb-kairos": [
    ...sourceBundles.researchRound47PalSupport,
    ...sourceBundles.researchRound47AgilexSupport
  ],
  "hiwonder-jetauto-pro": sourceBundles.researchRound47TeachingSupport,
  "hiwonder-jetrover-arm": sourceBundles.researchRound47TeachingSupport,
  "yahboom-rosmaster-x3-arm": sourceBundles.researchRound47TeachingSupport,
  "turtlebot4-arm": sourceBundles.researchRound47TeachingSupport
};

const round48ModelLinks = {
  "franka-research-3": sourceBundles.researchRound48ManipulationAcademic,
  "ur5e": sourceBundles.researchRound48ManipulationAcademic,
  "ufactory-xarm-6": sourceBundles.researchRound48ManipulationAcademic,
  "ufactory-xarm-7": sourceBundles.researchRound48ManipulationAcademic,
  "dobot-cr5": [
    ...sourceBundles.researchRound48AcademicDiscovery,
    ...sourceBundles.researchRound48CnJournals,
    ...sourceBundles.researchRound48ModelDataPlatforms,
    ...sourceBundles.researchRound48RobotDataFormats
  ],
  "dobot-mg400": [
    ...sourceBundles.researchRound48AcademicDiscovery,
    ...sourceBundles.researchRound48CnJournals,
    ...sourceBundles.researchRound48ModelDataPlatforms,
    ...sourceBundles.researchRound48RobotDataFormats
  ],
  "kinova-gen3": sourceBundles.researchRound48ManipulationAcademic,
  "unitree-z1": sourceBundles.researchRound48ManipulationAcademic,
  "agilex-piper": sourceBundles.researchRound48ManipulationAcademic,
  "mycobot-280": [
    ...sourceBundles.researchRound48AcademicDiscovery,
    ...sourceBundles.researchRound48CnJournals,
    ...sourceBundles.researchRound48ModelDataPlatforms,
    "SRC1494"
  ],
  "mycobot-320": [
    ...sourceBundles.researchRound48AcademicDiscovery,
    ...sourceBundles.researchRound48CnJournals,
    ...sourceBundles.researchRound48ModelDataPlatforms,
    "SRC1494"
  ],
  "unitree-g1": sourceBundles.researchRound48HumanoidAcademic,
  "unitree-h1": sourceBundles.researchRound48HumanoidAcademic,
  "agibot-a2": sourceBundles.researchRound48HumanoidAcademic,
  "agibot-x2": sourceBundles.researchRound48HumanoidAcademic,
  "fourier-gr1": sourceBundles.researchRound48HumanoidAcademic,
  "fourier-gr2": sourceBundles.researchRound48HumanoidAcademic,
  "ubtech-walker-s1": sourceBundles.researchRound48HumanoidAcademic,
  "leju-kuavo": sourceBundles.researchRound48HumanoidAcademic,
  "booster-t1": sourceBundles.researchRound48HumanoidAcademic,
  "engineai-pm01": sourceBundles.researchRound48HumanoidAcademic,
  "robotera-star1": sourceBundles.researchRound48HumanoidAcademic,
  "unitree-r1-air": sourceBundles.researchRound48HumanoidAcademic,
  "unitree-r1-d": sourceBundles.researchRound48HumanoidAcademic,
  "unitree-go2": sourceBundles.researchRound48QuadrupedAcademic,
  "unitree-b2": sourceBundles.researchRound48QuadrupedAcademic,
  "unitree-a2": sourceBundles.researchRound48QuadrupedAcademic,
  "deeprobotics-lite3": sourceBundles.researchRound48QuadrupedAcademic,
  "deeprobotics-x30": sourceBundles.researchRound48QuadrupedAcademic,
  "deeprobotics-x20": sourceBundles.researchRound48QuadrupedAcademic,
  "deeprobotics-lynx-m20": sourceBundles.researchRound48QuadrupedAcademic,
  "limx-tron1": sourceBundles.researchRound48QuadrupedAcademic,
  "unitree-b2-z1": sourceBundles.researchRound48QuadrupedAcademic,
  "unitree-go2-z1": [
    ...sourceBundles.researchRound48QuadrupedAcademic,
    ...sourceBundles.researchRound48ManipulationAcademic
  ],
  "mobile-aloha": sourceBundles.researchRound48MobileAcademic,
  "agilex-cobot-magic": sourceBundles.researchRound48MobileAcademic,
  "agilex-limo-piper": sourceBundles.researchRound48MobileAcademic,
  "xarm-agilex-base": sourceBundles.researchRound48MobileAcademic,
  "realman-mobile-manipulator": sourceBundles.researchRound48MobileAcademic,
  "hello-stretch-3": sourceBundles.researchRound48MobileAcademic,
  "pal-tiago": sourceBundles.researchRound48MobileAcademic,
  "robotnik-rb-kairos": sourceBundles.researchRound48MobileAcademic,
  "franka-mobile-base": sourceBundles.researchRound48MobileAcademic,
  "hiwonder-jetauto-pro": sourceBundles.researchRound48MobileAcademic,
  "hiwonder-jetrover-arm": sourceBundles.researchRound48MobileAcademic,
  "yahboom-rosmaster-x3-arm": sourceBundles.researchRound48MobileAcademic,
  "turtlebot4-arm": sourceBundles.researchRound48MobileAcademic
};

const round49ModelLinks = {
  "franka-research-3": sourceBundles.researchRound49ArmProcurement,
  "ur5e": sourceBundles.researchRound49ArmProcurement,
  "ufactory-xarm-6": sourceBundles.researchRound49ArmProcurement,
  "ufactory-xarm-7": sourceBundles.researchRound49ArmProcurement,
  "dobot-cr5": sourceBundles.researchRound49ArmProcurement,
  "dobot-mg400": sourceBundles.researchRound49ArmProcurement,
  "jaka-zu7": sourceBundles.researchRound49ArmProcurement,
  "aubo-i5": sourceBundles.researchRound49ArmProcurement,
  "elite-ec66": sourceBundles.researchRound49ArmProcurement,
  "realman-rm65": sourceBundles.researchRound49ArmProcurement,
  "kinova-gen3": sourceBundles.researchRound49ArmProcurement,
  "unitree-z1": sourceBundles.researchRound49ArmProcurement,
  "agilex-piper": sourceBundles.researchRound49ArmProcurement,
  "mycobot-280": sourceBundles.researchRound49ArmProcurement,
  "mycobot-320": sourceBundles.researchRound49ArmProcurement,
  "unitree-g1": sourceBundles.researchRound49HumanoidProcurement,
  "unitree-h1": sourceBundles.researchRound49HumanoidProcurement,
  "agibot-a2": sourceBundles.researchRound49HumanoidProcurement,
  "agibot-x2": sourceBundles.researchRound49HumanoidProcurement,
  "fourier-gr1": sourceBundles.researchRound49HumanoidProcurement,
  "fourier-gr2": sourceBundles.researchRound49HumanoidProcurement,
  "ubtech-walker-s1": sourceBundles.researchRound49HumanoidProcurement,
  "leju-kuavo": sourceBundles.researchRound49HumanoidProcurement,
  "booster-t1": sourceBundles.researchRound49HumanoidProcurement,
  "engineai-pm01": sourceBundles.researchRound49HumanoidProcurement,
  "robotera-star1": sourceBundles.researchRound49HumanoidProcurement,
  "unitree-r1-air": sourceBundles.researchRound49HumanoidProcurement,
  "unitree-r1-d": sourceBundles.researchRound49HumanoidProcurement,
  "noetix-bumi": sourceBundles.researchRound49HumanoidProcurement,
  "unitree-go2": sourceBundles.researchRound49QuadrupedProcurement,
  "unitree-go1": sourceBundles.researchRound49QuadrupedProcurement,
  "unitree-b2": sourceBundles.researchRound49QuadrupedProcurement,
  "unitree-a2": sourceBundles.researchRound49QuadrupedProcurement,
  "deeprobotics-lite3": sourceBundles.researchRound49QuadrupedProcurement,
  "deeprobotics-x30": sourceBundles.researchRound49QuadrupedProcurement,
  "deeprobotics-x20": sourceBundles.researchRound49QuadrupedProcurement,
  "deeprobotics-lynx-m20": sourceBundles.researchRound49QuadrupedProcurement,
  "limx-tron1": sourceBundles.researchRound49QuadrupedProcurement,
  "xiaomi-cyberdog2": sourceBundles.researchRound49QuadrupedProcurement,
  "unitree-b2-z1": sourceBundles.researchRound49CompositeProcurement,
  "unitree-go2-z1": sourceBundles.researchRound49CompositeProcurement,
  "mobile-aloha": sourceBundles.researchRound49CompositeProcurement,
  "agilex-cobot-magic": sourceBundles.researchRound49CompositeProcurement,
  "agilex-limo-piper": sourceBundles.researchRound49CompositeProcurement,
  "xarm-agilex-base": sourceBundles.researchRound49CompositeProcurement,
  "realman-mobile-manipulator": sourceBundles.researchRound49CompositeProcurement,
  "hello-stretch-3": sourceBundles.researchRound49CompositeProcurement,
  "pal-tiago": sourceBundles.researchRound49CompositeProcurement,
  "robotnik-rb-kairos": sourceBundles.researchRound49CompositeProcurement,
  "franka-mobile-base": sourceBundles.researchRound49CompositeProcurement,
  "hiwonder-jetauto-pro": sourceBundles.researchRound49CompositeProcurement,
  "hiwonder-jetrover-arm": sourceBundles.researchRound49CompositeProcurement,
  "yahboom-rosmaster-x3-arm": sourceBundles.researchRound49CompositeProcurement,
  "turtlebot4-arm": sourceBundles.researchRound49CompositeProcurement
};

const round50ModelLinks = {
  "franka-research-3": sourceBundles.researchRound50ArmProcurement,
  "ur5e": sourceBundles.researchRound50ArmProcurement,
  "ufactory-xarm-6": sourceBundles.researchRound50ArmProcurement,
  "ufactory-xarm-7": sourceBundles.researchRound50ArmProcurement,
  "dobot-cr5": sourceBundles.researchRound50ArmProcurement,
  "jaka-zu7": sourceBundles.researchRound50ArmProcurement,
  "aubo-i5": sourceBundles.researchRound50ArmProcurement,
  "elite-ec66": sourceBundles.researchRound50ArmProcurement,
  "realman-rm65": sourceBundles.researchRound50ArmProcurement,
  "kinova-gen3": sourceBundles.researchRound50ArmProcurement,
  "unitree-z1": sourceBundles.researchRound50ArmProcurement,
  "agilex-piper": sourceBundles.researchRound50ArmProcurement,
  "unitree-g1": sourceBundles.researchRound50HumanoidProcurement,
  "unitree-h1": sourceBundles.researchRound50HumanoidProcurement,
  "agibot-a2": sourceBundles.researchRound50HumanoidProcurement,
  "agibot-x2": sourceBundles.researchRound50HumanoidProcurement,
  "fourier-gr1": sourceBundles.researchRound50HumanoidProcurement,
  "fourier-gr2": sourceBundles.researchRound50HumanoidProcurement,
  "ubtech-walker-s1": sourceBundles.researchRound50HumanoidProcurement,
  "leju-kuavo": sourceBundles.researchRound50HumanoidProcurement,
  "booster-t1": sourceBundles.researchRound50HumanoidProcurement,
  "engineai-pm01": sourceBundles.researchRound50HumanoidProcurement,
  "robotera-star1": sourceBundles.researchRound50HumanoidProcurement,
  "unitree-r1-air": sourceBundles.researchRound50HumanoidProcurement,
  "unitree-r1-d": sourceBundles.researchRound50HumanoidProcurement,
  "noetix-bumi": sourceBundles.researchRound50HumanoidProcurement,
  "unitree-go2": sourceBundles.researchRound50QuadrupedProcurement,
  "unitree-go1": sourceBundles.researchRound50QuadrupedProcurement,
  "unitree-b2": sourceBundles.researchRound50QuadrupedProcurement,
  "unitree-a2": sourceBundles.researchRound50QuadrupedProcurement,
  "deeprobotics-lite3": sourceBundles.researchRound50QuadrupedProcurement,
  "deeprobotics-x30": sourceBundles.researchRound50QuadrupedProcurement,
  "deeprobotics-x20": sourceBundles.researchRound50QuadrupedProcurement,
  "deeprobotics-lynx-m20": sourceBundles.researchRound50QuadrupedProcurement,
  "limx-tron1": sourceBundles.researchRound50QuadrupedProcurement,
  "unitree-b2-z1": sourceBundles.researchRound50CompositeProcurement,
  "unitree-go2-z1": sourceBundles.researchRound50CompositeProcurement,
  "mobile-aloha": sourceBundles.researchRound50CompositeProcurement,
  "agilex-cobot-magic": sourceBundles.researchRound50CompositeProcurement,
  "agilex-limo-piper": sourceBundles.researchRound50CompositeProcurement,
  "xarm-agilex-base": sourceBundles.researchRound50CompositeProcurement,
  "realman-mobile-manipulator": sourceBundles.researchRound50CompositeProcurement,
  "hello-stretch-3": sourceBundles.researchRound50CompositeProcurement,
  "pal-tiago": sourceBundles.researchRound50CompositeProcurement,
  "robotnik-rb-kairos": sourceBundles.researchRound50CompositeProcurement,
  "franka-mobile-base": sourceBundles.researchRound50CompositeProcurement,
  "hiwonder-jetauto-pro": sourceBundles.researchRound50CompositeProcurement,
  "hiwonder-jetrover-arm": sourceBundles.researchRound50CompositeProcurement,
  "yahboom-rosmaster-x3-arm": sourceBundles.researchRound50CompositeProcurement,
  "turtlebot4-arm": sourceBundles.researchRound50CompositeProcurement
};

const expandedNotes = {
  "franka-research-3": "补充 libfranka、Franka ROS2、Polymetis、Deoxys、MoveIt、Isaac、GraspNet/DexGraspNet/LEAP Hand 等开发、仿真和末端执行器入口，便于后续按课题链路评估。",
  "ur5e": "补充 UR 官方文档、UR Client Library、MoveIt/ros2_control、常见夹爪和招投标检索入口，增强落地和二次开发证据链。",
  "ufactory-xarm-6": "补充 xArm 官方文档、Python SDK、MoveIt/Isaac、UMI/GELLO 等遥操作和数据采集入口。",
  "ufactory-xarm-7": "补充 xArm 官方文档、Python SDK、MoveIt/Isaac、UMI/GELLO 等遥操作和数据采集入口。",
  "unitree-g1": "补充 Unitree Guide、Booster Gym、Isaac Lab、MuJoCo Menagerie 和中文招投标/论文检索入口。",
  "unitree-h1": "补充 Unitree Guide、Booster Gym、Isaac Lab、MuJoCo Menagerie 和中文招投标/论文检索入口。",
  "fourier-gr1": "补充 Fourier GR-1 SDK、Isaac Lab、MuJoCo Menagerie 和人形机器人中文论文/采购检索入口。",
  "booster-t1": "补充 Booster GitHub、Booster Gym、Isaac Lab 和人形机器人中文论文/采购检索入口。",
  "unitree-go2": "补充 Unitree Guide、Isaac Lab、MuJoCo Menagerie、Go2 ROS2 文档、自主导航、跨具身导航和四足机器人招投标检索入口。",
  "deeprobotics-lite3": "补充 Lite3 运动开发手册、DeepRoboticsLab GitHub、Isaac Lab 和四足机器人招投标检索入口。",
  "agilex-cobot-magic": "补充 MoveIt/ros2_control/Isaac、RoboCasa/CALVIN、UMI/GELLO、夹爪和灵巧手来源，支撑移动操作和末端扩展评估。",
  "mobile-aloha": "补充 UMI、Actuated UMI、GELLO、MoveIt/Isaac、灵巧手和夹爪入口，形成低成本遥操作到数据采集的来源链。",
  "hello-stretch-3": "补充 Stretch 官方文档、Stretch ROS2、RoboCasa/BEHAVIOR/CALVIN 和移动操作检索入口。",
  "pal-tiago": "补充 PAL 文档、TIAGo ROS、MoveIt/Isaac 和移动操作 Benchmark 入口。"
};

const researchRound13Notes = {
  "franka-research-3": "本轮新增 FMB、FrankaPy 和 Robot Control Stack，进一步强化 Franka/Panda 在接触丰富操作、研究控制栈和统一数据采集接口中的证据。",
  "ur5e": "本轮新增 Robot Control Stack、LeRobot 和 URDF Hub，补充 UR5e 在统一控制接口、教学复现和仿真模型中的来源。",
  "ufactory-xarm-6": "本轮新增 Robot Control Stack 和 LeRobot 论文入口，补充 xArm 作为低成本可复现实验机械臂的统一软件栈证据。",
  "ufactory-xarm-7": "本轮新增 Robot Control Stack 和 LeRobot 论文入口，补充 xArm7 在遥操作采集、VLA 推理和多平台控制栈中的适配证据。",
  "kinova-gen3": "本轮新增 Robot Control Stack 和 URDF Hub，补充 Kinova 在统一实验接口和仿真模型生态中的参考价值。",
  "unitree-g1": "本轮新增 ExBody2、ZeroWBC、HUSKY、KungfuBot、CLAW 和宇树 LeRobot 适配，覆盖高动态运动、视觉动作生成、语言条件动作数据和双臂操作学习。",
  "unitree-h1": "本轮新增 ExBody2、ZeroWBC、HUSKY、KungfuBot 和 CLaw 等人形控制入口，作为 H1/G1 同类人形运动研究生态的对照。",
  "unitree-go2": "本轮新增 Go2 ROS2 文档、自主导航栈、无改装导航项目、跨具身导航和四足移动操作论文入口，补强科研与落地导航证据。",
  "unitree-go2-z1": "本轮新增 Go2 自主导航、四足移动操作、SysNav 跨具身导航和移动操作控制栈入口，补充四足加臂复合形态研究证据。",
  "xarm-agilex-base": "本轮新增 Robot Control Stack、LeRobot、TidyBot++ 和 HomeRobot 相关入口，补充轮式底盘加机械臂的统一软件和自研复合平台证据。",
  "hello-stretch-3": "本轮新增 HomeRobot OVMM、HomeRobot 论文和 TidyBot++ 文档，进一步强化 Stretch 在家庭移动操作和开放词汇任务中的科研通用性。",
  "franka-mobile-base": "本轮新增 FMB、FrankaPy、Robot Control Stack、HomeRobot 和 TidyBot++ 等入口，补充 Franka 移动组合在操作学习与复合平台软件栈上的证据。"
};

const researchRound14Notes = {
  "mycobot-280": "本轮新增 OpenArm、SO-ARM100/SO-101、Koch 和 LeRobot 文档入口，补充低成本开源机械臂作为教学对照平台的来源。",
  "mycobot-320": "本轮新增 OpenArm、SO-ARM100/SO-101、Koch 和 LeRobot 文档入口，补充低成本开源机械臂作为教学对照平台的来源。",
  "unitree-r1-air": "本轮新增 Reachy 2、HopeJR、OpenLoong 和 LeRobot 人形硬件文档，补充开源人形平台作为教学科研对照的来源。",
  "unitree-r1-d": "本轮新增 Reachy 2、HopeJR、OpenLoong 和 LeRobot 人形硬件文档，补充开源人形平台作为教学科研对照的来源。",
  "agilex-limo-piper": "本轮新增 LeKiwi、RoboCup@Home 和 RoboMaster 等低成本移动操作/教学竞赛入口，补充学校自研复合平台参考来源。",
  "hiwonder-jetauto-pro": "本轮新增 LeKiwi、RoboCup@Home 和 RoboMaster 等教学与移动操作入口，补充课程和实训平台对照来源。",
  "turtlebot4-arm": "本轮新增 LeKiwi、RoboCup@Home 和 RoboMaster 等教学与移动操作入口，补充课程和实训平台对照来源。"
};

const researchRound15Notes = {
  "ur5e": "本轮新增 ISO 9283、ISO 10218-2、CQC/TÜV 认证、专利检索和进口编码入口，补强协作机械臂采购验收、合规和进口风险来源。",
  "franka-research-3": "本轮新增专利检索、国家标准、ISO 9283、ISO 10218-2 和进口编码入口，补强进口科研机械臂的验收和合规来源。",
  "kinova-gen3": "本轮新增专利检索、国际标准、认证和进口编码入口，补充进口高端机械臂采购的合规核验路径。",
  "unitree-g1": "本轮新增工信部人形机器人政策、北京人形机器人创新中心、专利检索、标准认证和产业报告入口，补充人形机器人采购的政策与合规背景。",
  "unitree-h1": "本轮新增工信部人形机器人政策、北京人形机器人创新中心、专利检索、标准认证和产业报告入口，补充高端人形平台采购的政策与合规背景。",
  "unitree-go2": "本轮新增公共资源交易、专利检索、移动机器人安全标准、认证和进口编码入口，补充四足平台在校园巡检/教学落地中的合规来源。",
  "unitree-go2-z1": "本轮新增机器人+应用政策、移动机器人安全标准、专利检索、认证和公共资源交易入口，补充四足加臂复合平台落地约束。",
  "xarm-agilex-base": "本轮新增机器人+应用政策、ISO 10218-2、ISO 3691-4、认证、专利和采购平台入口，补充轮式底盘加机械臂的系统集成合规来源。",
  "hello-stretch-3": "本轮新增服务/移动机器人合规、公共资源交易、专利检索和进口编码入口，补充移动操作科研平台的采购与落地约束。",
  "franka-mobile-base": "本轮新增机器人系统集成安全、移动机器人安全、专利、认证、进口编码和采购平台入口，补充移动 Franka 组合方案的验收风险来源。"
};

const researchRound16Notes = {
  "franka-research-3": "本轮新增 DemoGen、真实离线强化学习、Open-Teach、Dex-UMI 和中文高校实验室入口，进一步补强 Franka/Panda 在操作学习、遥操作和灵巧操作研究中的证据。",
  "ur5e": "本轮新增真实机器人学习、遥操作采集、触觉操作和高校实验室入口，补充 UR 平台作为通用协作臂研究设备的项目证据。",
  "ufactory-xarm-6": "本轮新增 DemoGen、Open-Teach、Dex-UMI、DexMimicGen 和中文高校实验室入口，补充 xArm 在低成本操作学习和遥操作实验中的参考价值。",
  "ufactory-xarm-7": "本轮新增机器人操作、灵巧操作和遥操作项目页，补强 xArm7 作为学校自建操作平台的科研证据链。",
  "kinova-gen3": "本轮新增触觉操作、真实强化学习和灵巧操作项目入口，补充 Kinova Gen3 在高端操作研究中的对照价值。",
  "mycobot-280": "本轮新增中文高校实验室、Open-Teach 和 DemoGen 等入口，补充低成本教学机械臂作为课程和示教采集对照平台的证据。",
  "unitree-g1": "本轮新增 CMU G1、ASAP、HOVER、Human2Humanoid、ALMI、KungfuBot 2 和 LATENT 等研究入口，强化 Unitree G1 在人形运动控制论文中的科研常用性。",
  "unitree-h1": "本轮新增 ASAP、HumanPlus、HOVER 和 Human2Humanoid 等项目入口，补充 Unitree H1 在全身控制、模仿学习和人形迁移研究中的证据。",
  "fourier-gr1": "本轮新增上海交大 HIROL、HumanPlus、HOVER 等人形研究入口，作为 GR 系列与 Unitree 平台对照的学术参考。",
  "booster-t1": "本轮新增 HIROL、ASAP 和开源人形项目入口，补充 Booster T1 在人形教学科研平台中的对照证据。",
  "unitree-go2": "本轮新增 Frontiers Go2 导航论文、ANU 腿式机器人课题以及经典四足控制项目入口，补充 Go2 在导航、SLAM 和腿式控制研究中的证据。",
  "unitree-b2": "本轮新增 RMA、Walk These Ways、Extreme Parkour 和 Jumping CoD 等四足控制项目入口，补充高负载四足平台的科研对照来源。",
  "unitree-a2": "本轮新增四足控制和复杂地形运动项目入口，补充 A2/B2 类高性能四足平台的研究评价维度。",
  "deeprobotics-lite3": "本轮新增经典四足控制项目和高校腿式机器人课题入口，补充 Lite3 作为国产四足教学科研平台的对照来源。",
  "agilex-cobot-magic": "本轮新增移动操作综述、MobiPi、RMMI、DemoGen 和高校实验室入口，补强双臂移动操作平台的科研证据。",
  "agilex-limo-piper": "本轮新增中文移动操作综述、MobiPi 和 RMMI 项目入口，补充轮式底盘加机械臂方案的移动操作研究证据。",
  "unitree-go2-z1": "本轮新增 Go2 导航论文、ANU 腿式机器人项目、移动操作综述和四足控制项目入口，补充四足加臂方案的移动操作与运动控制证据。",
  "xarm-agilex-base": "本轮新增移动操作综述、MobiPi、RMMI、DemoGen 和 Dex-UMI 入口，补充 xArm 加移动底盘组合的科研适配证据。",
  "hello-stretch-3": "本轮新增移动操作综述、MobiPi、RMMI 和中文高校实验室入口，进一步补强 Stretch 在家庭/服务移动操作研究中的证据。",
  "mobile-aloha": "本轮新增 Open-Teach、Dex-UMI、DexMimicGen、DexMachina 和触觉操作项目入口，补充双臂遥操作和数据采集链路证据。",
  "pal-tiago": "本轮新增移动操作综述、MobiPi、RMMI 和高校实验室入口，补充 TIAGo 作为经典移动操作科研平台的对照来源。",
  "franka-mobile-base": "本轮新增移动操作综述、MobiPi、RMMI、DemoGen、Dex-UMI 和高校实验室入口，补强移动 Franka 组合在复合型研究平台中的证据。"
};

const researchRound17Notes = {
  "ur5e": "本轮新增 UR 官方支持、Academy 培训、按需服务和高校机械臂安全规则，补强采购后的培训、维保和实验室准入证据。",
  "franka-research-3": "本轮新增 Franka Research 3 官方手册、高校机械臂安全规则和工业机器人培训/安全手册，补充高端科研机械臂部署与安全培训来源。",
  "dobot-cr5": "本轮新增越疆服务入口、售后政策、下载中心和工业机器人安全手册，补强国产协作臂售后维保和文档可得性。",
  "dobot-mg400": "本轮新增越疆服务、售后政策、下载中心和实验室安全资料，补充教学机械臂采购后的维护与安全培训来源。",
  "ufactory-xarm-6": "本轮新增通用机械臂实验室安全、工业机器人培训和安全手册入口，补充 xArm 学校部署的安全制度参考。",
  "ufactory-xarm-7": "本轮新增机械臂安全规则、培训手册和维护类来源，补充 xArm7 作为科研平台的运维风险评估依据。",
  "jaka-zu7": "本轮新增节卡技术文档 PDF、工业机器人培训和安全手册入口，补充节卡协作臂交付培训与维护资料来源。",
  "elite-ec66": "本轮新增艾利特快速开始文档、工业机器人培训和安全手册入口，补充上手培训、调试和安全操作资料。",
  "realman-rm65": "本轮新增睿尔曼开发者中心、机械臂实验室安全和工业机器人安全手册入口，补充二次开发与安全管理来源。",
  "mycobot-280": "本轮新增大象机器人支持入口、myCobot 用户须知和实验室机械臂安全规则，补强低成本教学机械臂的安全使用证据。",
  "mycobot-320": "本轮新增大象机器人支持入口、myCobot 用户须知和高校实验室安全来源，补充教学平台售后与安全边界。",
  "unitree-g1": "本轮新增宇树服务控制台、服务政策、维修条款、联系入口和锂电池安全/运输规则，补强人形机器人采购后的维修、电池和运输风险证据。",
  "unitree-h1": "本轮新增宇树售后政策、维修服务条款、锂电池安全和运输合规入口，补充高价值人形平台落地运维约束。",
  "unitree-go2": "本轮新增宇树售后/维修入口、锂电池安全、运输合规和机器人实验室安全政策，补充四足平台校园部署运维风险来源。",
  "unitree-b2": "本轮新增宇树售后政策、锂电池安全和运输合规入口，补充高负载四足平台交付、维修和运输约束。",
  "unitree-a2": "本轮新增宇树售后维修、锂电池安全和 IATA/FAA 运输规则，补充 A2/B2 类四足平台采购后运维依据。",
  "unitree-go2-z1": "本轮新增宇树 Z1 服务保修、宇树维修政策、电池安全和运输合规入口，补充四足加臂复合平台售后与安全来源。",
  "agilex-limo-piper": "本轮新增松灵联系/OEM 入口、AgileX 底盘文档、Hello Robot 电池维护和实验室安全资料，补充移动底盘加机械臂方案的交付维护来源。",
  "xarm-agilex-base": "本轮新增松灵 OEM/联系、AgileX 底盘文档、锂电池安全和机械臂实验室安全规则，补充轮式复合平台运维证据。",
  "agilex-cobot-magic": "本轮新增松灵 OEM/联系、AgileX 底盘文档、电池安全和机器人实验室安全资料，补强双臂移动平台的交付与维护风险来源。",
  "hello-stretch-3": "本轮新增 Stretch 电池维护、硬件指南、入门指南、锂电池安全和运输合规入口，补强移动操作平台采购后的安全运维证据。",
  "pal-tiago": "本轮新增 TIAGo 官方文档、锂电池安全和运输合规入口，补充经典移动操作平台维护与运输风险来源。",
  "franka-mobile-base": "本轮新增 Franka 手册、AgileX/移动平台运维、电池安全、机械臂安全规则和运输合规入口，补充自研移动 Franka 组合的系统级落地约束。"
};

const researchRound18Notes = {
  "ur5e": "本轮新增官方/生态配件、ISO 9283 精度测试、NIST 校准论文、ROS-Industrial 标定工具和高校设备保险入口，补强配件、校准和资产风险来源。",
  "franka-research-3": "本轮新增末端执行器配件、机器人精度退化/现场校准论文、MoveIt/ROS 标定工具和科研设备保险入口，补充高价值科研机械臂的全生命周期证据。",
  "ufactory-xarm-6": "本轮新增 xArm 官方配件、真空吸盘和夹爪手册、手眼标定工具和高校设备保险入口，补强学校自建操作平台的附件与标定来源。",
  "ufactory-xarm-7": "本轮新增 xArm 官方附件、末端执行器文档、ISO 9283 验证和手眼标定工具，补充 xArm7 采购后扩展和验收复测证据。",
  "dobot-cr5": "本轮新增 DOBOT 官方附件、OnRobot 生态配件、机器人性能测试和高校设备保险入口，补强协作臂夹爪扩展、验收和资产风险来源。",
  "dobot-mg400": "本轮新增 DOBOT 官方配件、夹爪生态、标定工具和设备保险入口，补充教学机械臂附件扩展和损坏风险管理来源。",
  "mycobot-280": "本轮新增大象机器人官方配件、手眼标定工具和设备保险入口，补充低成本教学机械臂附件采购与实验室资产管理来源。",
  "mycobot-320": "本轮新增大象机器人官方配件、机器人标定工具和高校设备保险入口，补强教学平台夹爪/相机扩展和资产风险来源。",
  "unitree-g1": "本轮新增宇树官方商城、手眼标定工具、高校设备保险和中文机器人保险线索，补充人形机器人配件、资产保险和责任风险证据。",
  "unitree-h1": "本轮新增宇树官方商城、高校科研设备保险和机器人保险服务线索，补充高价值人形平台财产险与场景责任风险参考。",
  "unitree-go2": "本轮新增宇树官方商城、移动机器人标定工具、高校设备保险和中文机器人保险线索，补充四足平台配件、标定和责任风险来源。",
  "unitree-b2": "本轮新增宇树官方商城、设备保险和机器人保险线索，补充高负载四足平台附件采购与资产风险来源。",
  "unitree-go2-z1": "本轮新增宇树商城、xArm/DOBOT 类末端配件、ROS/MoveIt 标定工具和保险入口，补充四足加臂平台的附件扩展、标定和责任风险。",
  "agilex-cobot-magic": "本轮新增机械臂配件、手眼标定工具、设备保险和机器人责任险线索，补充双臂移动操作平台附件、复测和资产风险来源。",
  "agilex-limo-piper": "本轮新增末端执行器配件、移动操作标定工具和高校设备保险入口，补充轮式底盘加机械臂方案的扩展与验收来源。",
  "xarm-agilex-base": "本轮新增 xArm 配件、夹爪/吸盘手册、ROS/MoveIt 标定工具和设备保险入口，补强 xArm 移动复合平台采购后的扩展与校准证据。",
  "hello-stretch-3": "本轮新增 ROS/MoveIt/easy_handeye 标定工具、高校设备保险和机器人保险线索，补充移动操作平台相机/机械臂标定与资产风险来源。",
  "pal-tiago": "本轮新增机器人标定工具、高校设备保险和财产理赔入口，补充 TIAGo 移动操作平台视觉标定和高价值设备保险来源。",
  "franka-mobile-base": "本轮新增末端配件、ISO 9283/NIST 精度校准、ROS/MoveIt 标定工具和高校设备保险入口，补充移动 Franka 组合验收、复测和资产风险来源。"
};

const researchRound19Notes = {
  "ur5e": "本轮新增核心零部件供应链、CNAS/计量机构和产品责任险入口，补充协作机械臂采购中的部件可得性、校准资质和责任边界证据。",
  "franka-research-3": "本轮新增减速器、伺服、关节模组、国家计量机构、CNAS 查询和产品责任险来源，补强进口科研机械臂的维护供应链和第三方校准资质核验。",
  "ufactory-xarm-6": "本轮新增核心零部件供应链、CNAS/国家计量入口和产品责任险线索，补充 xArm 作为自建科研平台的校准与责任风险证据。",
  "ufactory-xarm-7": "本轮新增国产伺服、关节模组、计量认证和产品责任险来源，补强 xArm7 的供应链与实验室责任风险评估。",
  "dobot-cr5": "本轮新增核心零部件、CNAS/CMA 查询、国家计量机构和产品责任险入口，补充越疆协作臂采购验收、校准和责任条款来源。",
  "dobot-mg400": "本轮新增零部件供应链、计量认证查询和产品责任险入口，补充桌面教学机械臂损坏、验收和责任风险来源。",
  "jaka-zu7": "本轮新增伺服/关节模组供应链、CNAS 和产品责任险入口，补充节卡协作臂采购后的校准资质和部件风险来源。",
  "realman-rm65": "本轮新增关节模组、核心零部件、国家计量机构和产品责任险入口，补充轻量机械臂维护、校准和责任风险证据。",
  "mycobot-280": "本轮新增核心零部件、CNAS 查询和产品责任险来源，补充教学机械臂低成本平台的安全责任和校准资质核验。",
  "unitree-g1": "本轮新增关节模组、伺服供应链、CNAS/计量入口、人保产品责任险和人形机器人综合保险案例，补充人形机器人高风险场景的责任边界。",
  "unitree-h1": "本轮新增机器人核心部件、计量认证查询和机器人综合保险案例，补充高价值人形平台的供应链、验收和第三者责任风险来源。",
  "fourier-gr1": "本轮新增关节模组、伺服、CNAS/计量机构和产品责任险入口，补充 GR 系列人形机器人采购中的核心部件与责任风险证据。",
  "unitree-go2": "本轮新增关节模组、核心零部件、计量认证、产品责任险和机器人综合保险案例，补充四足平台校园巡检/开放场景责任风险来源。",
  "unitree-b2": "本轮新增核心零部件供应链、CNAS/计量机构和责任险入口，补充高负载四足平台场地部署和第三者责任风险来源。",
  "unitree-a2": "本轮新增关节模组、减速器、国家计量和责任保险入口，补充高性能四足平台验收复测和责任风险证据。",
  "unitree-go2-z1": "本轮新增核心部件、计量认证、产品责任险和人形/机器人综合保险案例，补充四足加臂复合平台在开放环境中的责任风险。",
  "agilex-cobot-magic": "本轮新增核心部件供应链、CNAS/国家计量和责任险入口，补充双臂移动操作平台验收、校准和场景责任来源。",
  "xarm-agilex-base": "本轮新增核心零部件、机器人计量认证和产品责任险入口，补充轮式复合平台供应链、复测和责任边界证据。",
  "hello-stretch-3": "本轮新增核心部件、CNAS/计量入口和产品责任险来源，补充移动操作平台长期维护、相机/机械臂校准和责任风险证据。",
  "pal-tiago": "本轮新增核心部件供应链、计量机构和产品责任险入口，补充进口移动操作平台验收与责任风险来源。",
  "franka-mobile-base": "本轮新增核心零部件、CNAS/计量机构、产品责任险和机器人综合保险案例，补充移动 Franka 组合的系统级验收、校准和责任风险证据。"
};

const researchRound20Notes = {
  "ur5e": "本轮新增 Renishaw、HEIDENHAIN 等编码器来源，以及公众责任保险示范条款和条款 PDF，补充协作机械臂精度反馈和开放实验场地责任风险。",
  "franka-research-3": "本轮新增高精度位置/角度编码器、绝对式编码器和公众责任险条款，补充 Franka 类高精度科研平台的关节反馈与第三方责任证据。",
  "ufactory-xarm-6": "本轮新增编码器/位置传感器供应链和公众责任险条款，补充 xArm 学校实验室开放测试和设备精度反馈风险来源。",
  "ufactory-xarm-7": "本轮新增 Renishaw、HEIDENHAIN、Nikon、Sensata、ifm 等编码器入口和公众责任险条款，补充 xArm7 精度与场地责任证据。",
  "dobot-cr5": "本轮新增位置编码器、旋转编码器和公众责任保险条款入口，补充越疆协作臂关节反馈和演示场景责任风险来源。",
  "dobot-mg400": "本轮新增编码器供应链和公众责任险条款，补充桌面机械臂教学演示、参观体验和开放实验的责任风险证据。",
  "jaka-zu7": "本轮新增编码器/角度传感器和公众责任险条款，补充节卡协作臂精度反馈与场地开放风险来源。",
  "realman-rm65": "本轮新增编码器、磁编码器和责任保险条款入口，补充轻量机械臂位置反馈和开放实验责任风险证据。",
  "mycobot-280": "本轮新增位置编码器供应链和公众责任险条款，补充低成本教学机械臂在开放课堂、演示和参观中的责任风险。",
  "unitree-g1": "本轮新增编码器/关节反馈部件和公众责任险条款，补充人形机器人在开放实验、演示和校园场景中的第三方责任风险。",
  "unitree-h1": "本轮新增角度编码器、位置传感器和公众责任保险条款，补充高价值人形平台精度反馈和场地责任风险证据。",
  "fourier-gr1": "本轮新增编码器供应链和公众责任险条款，补充 GR 系列人形机器人关节反馈与开放场地责任风险来源。",
  "unitree-go2": "本轮新增编码器/位置传感器和公众责任保险条款，补充四足机器人校园巡检、展演和开放测试中的责任风险。",
  "unitree-b2": "本轮新增高精度编码器供应链和公众责任险条款，补充高负载四足平台行走安全和第三方责任风险来源。",
  "unitree-go2-z1": "本轮新增编码器、磁编码器、公众责任险条款和场地责任线索，补充四足加臂平台开放环境测试风险。",
  "agilex-cobot-magic": "本轮新增编码器/位置传感器和公众责任险条款，补充双臂移动平台在校园展示、实验和开放空间中的责任风险。",
  "xarm-agilex-base": "本轮新增编码器供应链和公众责任条款，补充 xArm 移动复合平台精度反馈、导航测试和场地责任证据。",
  "hello-stretch-3": "本轮新增编码器/位置传感器和公众责任险条款，补充移动操作平台开放场景部署和第三方损害责任风险。",
  "pal-tiago": "本轮新增编码器供应链和公众责任保险条款，补充 TIAGo 类移动操作平台的传感反馈与场地开放风险来源。",
  "franka-mobile-base": "本轮新增高精度编码器、公众责任险示范条款和条款 PDF，补充移动 Franka 组合精度反馈与开放测试责任风险。"
};

const researchRound21Notes = {
  "ur5e": "本轮新增关节扭矩传感器、碰撞检测安全手册、雇主责任险和校方责任险条款，补充协作机械臂力控安全和人员责任风险。",
  "franka-research-3": "本轮新增关节力矩传感器、力控关节模组、接触检测论文和雇主/校方责任条款，补充高端科研机械臂实验安全责任证据。",
  "ufactory-xarm-6": "本轮新增关节扭矩传感器、安全传感器和雇主责任险条款，补充 xArm 作为学校实验平台的力控安全与操作人员责任来源。",
  "ufactory-xarm-7": "本轮新增扭矩传感器、碰撞检测手册和学生/校方责任来源，补充 xArm7 开放实验和课程使用风险证据。",
  "dobot-cr5": "本轮新增关节扭矩传感器、OMRON 协作机器人安全手册和雇主责任险条款，补充国产协作臂力控安全和人员保障来源。",
  "dobot-mg400": "本轮新增关节传感器、碰撞检测和校方责任险条款，补充桌面教学机械臂学生安全与操作人员风险来源。",
  "jaka-zu7": "本轮新增扭矩/关节传感器和雇主责任险条款，补充节卡协作臂力控、安全停机和维护人员责任风险。",
  "realman-rm65": "本轮新增睿尔曼力控关节模组、关节扭矩传感器和雇主责任险条款，补充轻量机械臂力控安全来源。",
  "mycobot-280": "本轮新增关节扭矩传感器、学生意外保险和校方责任险条款，补充低成本教学平台课堂安全责任证据。",
  "unitree-g1": "本轮新增关节扭矩传感器、安全传感器、雇主责任险和校方责任险条款，补充人形机器人开放实验、演示和学生安全风险。",
  "unitree-h1": "本轮新增关节力矩传感器、碰撞检测论文和雇主/校方责任条款，补充大型人形平台与人员共处的安全责任证据。",
  "fourier-gr1": "本轮新增关节扭矩传感器、安全传感器和责任条款，补充 GR 系列人形机器人力控安全和场地人员保障来源。",
  "unitree-go2": "本轮新增扭矩传感器、安全传感器和学生/校方责任来源，补充四足机器人校园巡检、课程和开放测试安全责任证据。",
  "unitree-b2": "本轮新增关节传感器、碰撞检测和雇主责任险条款，补充高负载四足平台人员近距离作业风险来源。",
  "unitree-go2-z1": "本轮新增关节力矩传感器、安全传感器、雇主责任和校方责任条款，补充四足加臂平台接触安全与学生参与风险。",
  "agilex-cobot-magic": "本轮新增关节扭矩传感器、安全传感器、雇主责任险和学生安全来源，补充双臂移动平台开放实验责任风险。",
  "xarm-agilex-base": "本轮新增力控关节模组、扭矩传感器和校方责任险条款，补充轮式复合平台力控、安全和学生参与风险证据。",
  "hello-stretch-3": "本轮新增安全传感器、关节扭矩传感器和雇主/校方责任来源，补充移动操作平台与人员共处场景的安全责任证据。",
  "pal-tiago": "本轮新增关节/扭矩传感器、安全传感器和雇主责任险条款，补充 TIAGo 移动操作平台长期开放实验责任风险。",
  "franka-mobile-base": "本轮新增关节扭矩传感器、碰撞检测论文、安全手册和校方责任险条款，补充移动 Franka 组合接触安全与人员责任证据。"
};

const researchRound22Notes = {
  "ur5e": "本轮新增个人信息保护、网络安全、工业控制系统安全、校园安全和 AI 风险框架来源，补充协作机械臂联网、远程维护和日志审计合规证据。",
  "franka-research-3": "本轮新增个人信息安全规范、网络安全法、NIST/IEC 工控安全和隐私框架来源，补充高端科研平台远程控制、账号日志和实验数据治理证据。",
  "ufactory-xarm-6": "本轮新增数据安全、视频图像安全、网络安全和校园安全来源，补充 xArm 连接相机、云端 SDK 和课程实验中的隐私合规风险。",
  "ufactory-xarm-7": "本轮新增个人信息、视频采集、远程运维和工控网络安全来源，补充 xArm7 作为科研平台的网络接入和日志审计依据。",
  "dobot-cr5": "本轮新增网络安全法、IEC 62443、ISO 27001 和校园安全来源，补充越疆协作臂远程调试、云服务和实验室联网风险。",
  "dobot-mg400": "本轮新增个人信息安全、视频图像安全、校园安全和未成年人网络保护来源，补充桌面教学机械臂课堂使用合规依据。",
  "mycobot-280": "本轮新增个人信息保护、未成年人网络保护和校园安全来源，补充教学机械臂摄像头、账号和学生数据处理约束。",
  "unitree-g1": "本轮新增个人信息保护、视频图像安全、网络安全、AI 风险管理和校园安全来源，补充人形机器人摄像头、麦克风、远程控制和自治行为合规证据。",
  "unitree-h1": "本轮新增数据隐私、工控网络安全、AI 风险和校园安全来源，补充大型人形平台云端控制、日志审计和开放演示风险。",
  "fourier-gr1": "本轮新增个人信息安全、网络安全和 AI 风险框架来源，补充 GR 系列人形机器人视觉采集、远程运维和智能行为风险治理证据。",
  "unitree-go2": "本轮新增视频图像安全、网络安全法、NIST/IEC 工控安全和校园安全来源，补充四足机器人巡检、远程控制和校园视频采集合规风险。",
  "unitree-b2": "本轮新增网络安全、远程运维、视频采集和校园安全来源，补充高负载四足平台在校园巡检和开放场地部署中的合规证据。",
  "unitree-go2-z1": "本轮新增个人信息保护、视频图像安全、工控网络安全和 AI 风险框架，补充四足加臂平台视觉抓取、远程控制和自治操作治理来源。",
  "agilex-cobot-magic": "本轮新增数据隐私、网络安全、工业控制系统安全和 AI 风险来源，补充双臂移动平台摄像头、远程运维和任务日志审计证据。",
  "xarm-agilex-base": "本轮新增个人信息安全、视频图像安全、IEC 62443 和 ISO 27001 来源，补充轮式复合平台联网、相机采集和运维服务商审查依据。",
  "hello-stretch-3": "本轮新增隐私框架、视频图像安全、工控网络安全和校园安全来源，补充移动操作平台家庭/校园测试中的摄像头与日志合规风险。",
  "pal-tiago": "本轮新增数据保护、网络安全和 AI 风险管理来源，补充 TIAGo 类移动服务机器人远程维护、视觉采集和学生实验数据治理证据。",
  "franka-mobile-base": "本轮新增个人信息安全、视频图像安全、网络安全、工业控制系统安全和 AI 风险框架，补充移动 Franka 组合远程控制、视觉采集和日志审计来源。"
};

const researchRound23Notes = {
  "ur5e": "本轮新增声纹/人脸/生物识别、日志审计、零信任和身份认证来源，补充机械臂接相机、麦克风、远程维护账号和实验日志治理依据。",
  "franka-research-3": "本轮新增机器人平台日志审计、账号权限、零信任远程访问和生物识别数据合规来源，补强高端科研机械臂远程控制和数据采集治理。",
  "ufactory-xarm-6": "本轮新增日志审计、人脸/声纹数据安全和身份认证来源，补充 xArm 接入视觉、语音交互或云端训练时的合规证据。",
  "ufactory-xarm-7": "本轮新增日志审计、远程访问控制、生物特征信息保护和麦克风/人脸采集合规入口，补充科研操作平台的数据治理来源。",
  "dobot-cr5": "本轮新增 NIST 日志管理、OPC UA 审计事件和零信任架构来源，补强协作臂远程调试、账号权限和运维审计要求。",
  "dobot-mg400": "本轮新增语音/人脸数据合规、账号权限和日志管理来源，补充桌面教学机械臂课堂采集和学生实验账号治理。",
  "mycobot-280": "本轮新增声纹、人脸、生物特征识别和日志审计来源，补充低成本教学机械臂接摄像头/麦克风时的学生数据风险。",
  "unitree-g1": "本轮新增宇树官方开源、LeRobot/G1、ExtremControl、HumanUP、FRoM-W1、IMU 遥操作和 ULTRA 等入口，并补充麦克风、人脸识别、日志审计和远程访问合规来源。",
  "unitree-h1": "本轮新增宇树官方开源、LeRobot、人形遥操作、语言指令控制和全身移动操作论文入口，同时补充人形平台摄像头、麦克风和远程控制审计来源。",
  "unitree-r1-air": "本轮新增宇树官方开源、LeRobot、人形遥操作和全身控制论文入口，补充低价人形平台作为课程/科研样机的开源证据。",
  "unitree-r1-d": "本轮新增宇树官方开源、LeRobot、人形遥操作和全身控制论文入口，补充双臂人形样机的数据采集和操作学习证据。",
  "fourier-gr1": "本轮新增人形遥操作、语言指令控制、全身移动操作和 LeRobot 生态对照入口，补充 GR 系列在人形研究中的横向评估来源。",
  "fourier-gr2": "本轮新增人形遥操作、全身移动操作和具身数据来源，补充 GR-2 作为高自由度人形平台的科研对照证据。",
  "booster-t1": "本轮新增人形遥操作、全身控制和具身数据来源，补充 Booster T1 作为教学科研人形平台的项目证据链。",
  "unitree-go2": "本轮新增宇树官方开源、Go2 楼梯攀爬、动态步态、垂向扰动鲁棒性和 Dribble HRL 项目入口，并补充远程访问审计和视频/语音采集合规来源。",
  "unitree-b2": "本轮新增四足楼梯、动态步态、扰动鲁棒性和高动态控球等研究入口，补充 B2/A2 类四足平台的运动控制和复杂地形证据。",
  "unitree-a2": "本轮新增四足动态步态、扰动鲁棒性和复杂地形运动研究入口，补充 A2 高性能四足平台的科研对照来源。",
  "unitree-b2-z1": "本轮新增宇树官方开源、四足运动控制和移动操作综述入口，补充 B2+Z1 四足加臂平台的运动-操作一体化证据。",
  "deeprobotics-lite3": "本轮新增四足楼梯、动态步态、扰动鲁棒性和控球项目入口，补充国产四足平台与 Unitree/ANYmal 标杆的学术对照来源。",
  "agilex-cobot-magic": "本轮新增移动操作机器人中文综述、ARIO 数据集和具身智能学术入口，补强双臂移动操作平台的数据、任务和系统架构来源。",
  "agilex-limo-piper": "本轮新增移动操作中文综述、ARIO 数据集和具身智能专题入口，补充轮式底盘加机械臂方案的中文研究背景和数据来源。",
  "unitree-go2-z1": "本轮新增宇树官方开源、四足运动控制、移动操作综述和具身数据入口，补强四足加臂平台在科研和落地任务中的证据链。",
  "xarm-agilex-base": "本轮新增移动操作中文综述、ARIO 数据集、具身智能专题和日志审计/身份认证来源，补充自研轮式复合平台的数据与运维治理依据。",
  "hello-stretch-3": "本轮新增 Stretch 设计论文、Hello Robot GitHub、移动操作中文综述和 ARIO 数据集入口，进一步补强 Stretch 作为经典移动操作科研平台的证据。",
  "mobile-aloha": "本轮新增移动操作中文综述、ARIO 数据集和具身数据入口，补充 Mobile ALOHA 作为数据采集和双臂遥操作平台的横向背景来源。",
  "pal-tiago": "本轮新增移动操作中文综述、ARIO 数据集和审计/身份认证来源，补充 TIAGo 移动操作平台在学校开放实验中的数据治理与任务背景。",
  "franka-mobile-base": "本轮新增移动操作中文综述、ARIO 数据集、日志审计、零信任和生物识别合规来源，补强移动 Franka 组合的数据采集、远程控制和开放实验治理。"
};

const researchRound24Notes = {
  "agilex-piper": "本轮新增 PiPER ROS 工作空间入口，补充 PiPER 机械臂在 ROS 移动操作组合中的专属开发证据。",
  "engineai-pm01": "本轮新增 NOETIX/EngineAI 开源入口对照和 PM01 官方英文页核验结果，进一步补充低价人形平台的开源和教育科研可用性证据。",
  "robotera-star1": "本轮新增 RobotEra VLA、ROS2 SDK、starVLA 项目页和代码入口，补强 STAR1 在人形基础模型、数据采集和 ROS2 集成方面的证据链。",
  "noetix-bumi": "本轮新增 NOETIX 官方开源入口，补充 Bumi/N2/E1 系列在 SDK、教学科研和二次开发方面的来源。",
  "deeprobotics-lite3": "本轮新增 Lite3 美国官方页、Motion SDK、Lite3 ROS 和强化学习训练仓库，补强云深处 Lite3 作为国产四足科研教学平台的专属证据。",
  "deeprobotics-x30": "本轮新增 DeepRobotics 官方 SDK、ROS 和强化学习训练仓库，补充 X30 与 Lite3 同源生态下的开发和运动控制证据。",
  "deeprobotics-x20": "本轮新增 DeepRobotics SDK/ROS/强化学习训练入口，补充 X20 行业四足平台的开发生态来源。",
  "deeprobotics-lynx-m20": "本轮新增 DeepRobotics SDK、ROS 和强化学习训练入口，补充山猫 M20 轮足平台的软件生态和科研对照证据。",
  "agilex-cobot-magic": "本轮新增 PiPER ROS 工作空间，补充 Cobot Magic 双臂/移动操作平台的机械臂控制与 ROS 集成来源。",
  "agilex-limo-piper": "本轮新增 PiPER ROS 和 SDK 入口，补强 LIMO + PiPER 低成本复合平台的可复现实验链路。",
  "xarm-agilex-base": "本轮新增 PiPER ROS 作为同类国产轻量机械臂对照来源，补充 xArm + AgileX 自研组合的替代配置证据。",
  "realman-mobile-manipulator": "本轮新增睿尔曼 ROS2 RM Robot 和 RM Models 仓库，补强睿尔曼移动复合机器人在 ROS2、模型和仿真方面的专属证据。",
  "hiwonder-jetauto-pro": "本轮新增 JetAuto 大模型课程、TurtleBot4/Open Manipulator 参考仓库，补充教学复合平台在具身智能课程和 ROS2 代码方面的来源。",
  "hiwonder-jetrover-arm": "本轮新增 JetAuto 大模型课程和开源教学平台对照入口，补充 JetRover 机械臂课程与 ROS2 教学生态证据。",
  "turtlebot4-arm": "本轮新增 TurtleBot4 common packages 和 ROBOTIS Open Manipulator 仓库，补强 TurtleBot4 + 轻量机械臂组合的开源代码与教学复现来源。",
  "yahboom-rosmaster-x3-arm": "本轮新增 TurtleBot4/Open Manipulator 对照和 ROSMASTER X3 代码入口，补充亚博复合教学平台在 ROS2 课程和开源代码方面的证据。"
};

const researchRound25Notes = {
  "ur5e": "本轮新增 Gymnasium Robotics、robosuite、SAPIEN、ManiSkill、NIST ARIAC、Drake、D4RL、RLBench 和 Berkeley/UT Austin 实验室入口，补强 UR5e 在操作学习、工业评测和可复现实验中的学术证据。",
  "ufactory-xarm-6": "本轮新增 Gymnasium Robotics、ManiSkill、RLBench、SimplerEnv 和机器人学习实验室入口，补充 xArm 作为低成本科研机械臂的仿真评测和算法复现来源。",
  "ufactory-xarm-7": "本轮新增 robosuite、ManiSkill、RLBench、SimplerEnv 和 RAIL/RPL 实验室入口，补强 xArm7 在遥操作、VLA 评测和多任务操作研究中的来源。",
  "dobot-cr5": "本轮新增 NIST ARIAC、Drake、robosuite 和 ManiSkill 入口，补充 DOBOT 协作臂在工业任务、运动规划和教学仿真中的对照来源。",
  "franka-research-3": "本轮新增 robosuite、SAPIEN、ManiSkill、D4RL、Real Robot Challenge、TriFinger、RLBench 和 Berkeley/UT Austin 实验室入口，进一步强化 Franka/Panda 作为高频操作研究平台的证据。",
  "unitree-z1": "本轮新增 Gymnasium Robotics、Drake、ManiSkill 和工业/真实机器人 Benchmark 入口，补充 Unitree Z1 在四足加臂和移动操作组合中的算法评测来源。",
  "kinova-gen3": "本轮新增 robosuite、SAPIEN、ManiSkill、ARIAC、Drake 和 RLBench 入口，补强 Kinova Gen3 在服务机器人、移动操作和教学科研中的仿真评测来源。",
  "mycobot-280": "本轮新增 Gymnasium Robotics、D4RL、RLBench 和 Drake 入口，补充低成本教学机械臂在课程实验与算法基准中的对照来源。",
  "mycobot-320": "本轮新增 Gymnasium Robotics、D4RL、RLBench 和 Drake 入口，补充 myCobot 系列作为教学科研平台时的仿真、离线强化学习和任务评测来源。",
  "unitree-g1": "本轮新增 Gymnasium Robotics、Drake、Habitat/AI2-THOR/BEHAVIOR 代码入口，以及 ETH/MIT/BAIR 等实验室入口，补充人形机器人运动控制、具身任务和长期学术追踪来源。",
  "unitree-h1": "本轮新增 Drake、具身任务 Benchmark 代码入口和腿足机器人实验室入口，补强 H1/G1 类全尺寸人形在运动控制、仿真和人机协作任务中的学术证据。",
  "fourier-gr1": "本轮新增 Drake、Habitat/BEHAVIOR/AI2-THOR 具身任务入口和 MIT/ETH/BAIR 实验室来源，作为 GR 系列人形平台科研定位的横向对照。",
  "fourier-gr2": "本轮新增具身任务 Benchmark、Drake 和机器人学习实验室入口，补充 GR-2 高自由度人形在移动操作、仿真评测和学术项目跟踪中的来源。",
  "booster-t1": "本轮新增 Gymnasium Robotics、Drake、具身任务 Benchmark 和腿足机器人实验室入口，补充 Booster 教学科研人形平台的算法评测对照。",
  "unitree-go2": "本轮新增 Gymnasium Robotics、Drake、ETH RSL、MIT Locomotion、MIT Biomimetic Robotics 和 BAIR 入口，强化 Go2 类四足平台在腿足运动控制研究中的长期学术来源。",
  "unitree-b2": "本轮新增 ETH RSL、MIT Locomotion、MIT Biomimetic Robotics、Drake 和 Gymnasium Robotics 入口，补强 B2/A2 类高负载四足的科研标杆对照。",
  "unitree-a2": "本轮新增腿足机器人实验室、Drake 和通用强化学习环境入口，补充 A2 高性能四足平台的运动控制和仿真训练来源。",
  "deeprobotics-lite3": "本轮新增 ETH/MIT 腿足机器人实验室、Gymnasium Robotics 和 Drake 入口，补充 Lite3 与 Unitree/ANYmal 标杆平台的学术对照来源。",
  "deeprobotics-x30": "本轮新增 ETH RSL、MIT Locomotion、Drake 和 BAIR 入口，补充 X30 工业四足平台在巡检、复杂地形和腿足控制研究中的外部对照。",
  "unitree-go2-z1": "本轮新增 ManipulaTHOR、BEHAVIOR-1K、ARIAC、Drake、RoboCasa 和腿足实验室入口，补强四足加臂平台的导航-操作一体化评测来源。",
  "agilex-cobot-magic": "本轮新增 robosuite、SAPIEN、ManiSkill、BEHAVIOR-1K、ManipulaTHOR、RoboCasa、RLBench、ARIAC 和机器人学习实验室入口，补强双臂移动操作平台的仿真、任务和真实评测来源。",
  "agilex-limo-piper": "本轮新增 Gymnasium Robotics、ManiSkill、ManipulaTHOR、RoboCasa、RLBench 和 ARIAC 入口，补充 LIMO + PiPER 低成本复合平台在课程、移动操作和工业任务中的学术对照。",
  "xarm-agilex-base": "本轮新增 robosuite、ManiSkill、SimplerEnv、RoboCasa、RLBench 和 Berkeley/UT Austin 实验室入口，补强 xArm + AgileX 自研组合在 VLA 策略评测和移动操作研究中的证据。",
  "hello-stretch-3": "本轮新增 BEHAVIOR-1K、AI2-THOR、ManipulaTHOR、RoboCasa、SimplerEnv、RLBench 和 RAIL/RPL 实验室入口，进一步强化 Stretch 作为家庭移动操作科研平台的来源。",
  "mobile-aloha": "本轮新增 SimplerEnv、RoboCasa、RLBench、ManiSkill 和机器人学习实验室入口，补充 Mobile ALOHA 在真实策略评测、双臂操作和数据采集生态中的学术证据。",
  "pal-tiago": "本轮新增 BEHAVIOR-1K、AI2-THOR、ManipulaTHOR、RoboCasa、ARIAC 和 Drake 入口，补强 TIAGo 类移动服务机器人在导航、交互和操作任务中的评测来源。",
  "franka-mobile-base": "本轮新增 robosuite、SAPIEN、ManiSkill、RoboCasa、SimplerEnv、RLBench、ARIAC、Drake 和真实机器人挑战赛入口，补强移动 Franka 组合的算法复现和任务评测来源。",
  "hiwonder-jetauto-pro": "本轮新增 Gymnasium Robotics、AI2-THOR、RoboCasa 和 RLBench 入口，补充教学复合平台课程中可引用的公开仿真与任务评测来源。",
  "turtlebot4-arm": "本轮新增 AI2-THOR、ManipulaTHOR、RoboCasa、RLBench 和 Drake 入口，补充 TurtleBot4 + 机械臂组合在移动操作教学和具身任务中的对照来源。"
};

const researchRound26Notes = {
  "franka-research-3": "本轮新增 Franka 官方联系页和合作伙伴页，补充 Research 3 正式询价、授权代理和服务支持核验入口；现有渠道价格仍需代理书面报价确认。",
  "kinova-gen3": "本轮新增 Kinova 官方联系页，补充 Gen3 正式询价、教育折扣、交期和服务支持核验入口；海外渠道价仍只作预算线索。",
  "unitree-b2": "本轮新增 Unitree B2 官方商店页、经销商入口、京东/淘宝检索和政府采购检索；官方商店 100,000 美元应视为询价占位或预算上界，不作为确定报价。",
  "unitree-a2": "本轮新增 Unitree A2 官方商店页、经销商入口、京东/淘宝检索和政府采购检索；新型号采购应以宇树正式报价和配置清单为准。",
  "unitree-b2-z1": "本轮新增 B2/A2 官方商店、经销商和招投标检索入口，补充四足加臂组合采购时对底盘、Z1 机械臂和服务包分别报价的核验路径。",
  "unitree-go1": "本轮新增宇树官方商店和行业四足渠道检索入口，补充 Go1 上一代平台在售状态、替代型号和存量/教育渠道的核验路径。",
  "xiaomi-cyberdog2": "本轮新增 CyberDog 2 发布价媒体交叉核验、京东/淘宝检索、小米服务协议和政府采购检索入口；CyberDog 2 仍应按消费/开发者平台处理，不作为工业四足确定替代。",
  "franka-mobile-base": "本轮新增 Franka 官方联系和合作伙伴入口，补充 Mobile FR3 Duo 或自研移动 Franka 组合的正式询价、集成伙伴和售后路径。"
};

const researchRound27Notes = {
  "ur5e": "本轮新增 UR 官方产线案例，补充 UR5/UR5e 类协作臂在取放、机床上下料和生产提效场景中的落地证据。",
  "dobot-cr5": "本轮新增 DOBOT 高校工程教学案例和 CR5 应用场景说明，补充 CR5 用于学校实训、自动化教学和轻量产线的落地证据。",
  "dobot-mg400": "本轮新增 DOBOT 高校教学与协作臂应用案例，补充桌面机械臂从课程实验到小型自动化场景的落地参考。",
  "ufactory-xarm-6": "本轮新增协作臂产线、高校教学和移动复合方案对照案例，补充 xArm 类低成本协作臂从科研样机到落地项目的场景证据。",
  "ufactory-xarm-7": "本轮新增协作臂产线、高校教学和移动复合方案对照案例，补充 xArm7 作为自研复合平台机械臂的落地参照。",
  "jaka-zu7": "本轮新增协作臂产线和移动复合方案对照案例，补充节卡 Zu 系列在工业协作与系统集成中的落地参考。",
  "elite-ec66": "本轮新增协作臂产线、高校教学和移动复合方案对照案例，补充艾利特 EC66 落地项目评估时的行业参照。",
  "unitree-b2": "本轮新增云深处工业巡检、戈壁风电巡检、X30 行业应用、Spot 和 ANYmal 工业巡检标杆，补充 B2 类高负载四足在巡检和危险环境中的落地对照。",
  "unitree-a2": "本轮新增四足工业巡检和国外 Spot/ANYmal 标杆方案，补充 A2 类行业四足在园区、电力和复杂设施巡检中的落地参照。",
  "unitree-go2": "本轮新增四足工业巡检标杆和云深处应用案例，补充 Go2 从教学/科研向校园巡检原型迁移时的场景对照。",
  "unitree-go1": "本轮新增四足巡检标杆案例作为上一代 Go1 的应用对照，帮助判断新采购时是否应迁移到 Go2/A2/B2。",
  "deeprobotics-x30": "本轮新增云深处工业巡检方案、戈壁风电巡检案例和 X30 中文行业应用发布，强化 X30 在电力、风电、管廊、应急救援和消防侦查中的落地证据。",
  "deeprobotics-x20": "本轮新增云深处工业巡检和风电巡检案例，补充 X20/X30 同源行业四足平台的落地参照。",
  "deeprobotics-lite3": "本轮新增云深处行业巡检案例和 Spot/ANYmal 对照，补充 Lite3 从教育科研向行业四足平台升级时的应用参照。",
  "ubtech-walker-s1": "本轮新增 Walker S1 工厂实训报道和享界工厂物料检测案例，补充工业人形机器人进入汽车制造场景的落地证据。",
  "unitree-g1": "本轮新增 Walker S1 工厂实训案例作为人形平台产业落地对照，帮助区分 G1 的科研开发定位和工业人形部署要求。",
  "fourier-gr1": "本轮新增 Walker S1 工厂实训和工业人形案例对照，补充 GR 系列进入落地项目时需要关注的工厂任务、群体作业和安全边界。",
  "agilex-cobot-magic": "本轮新增睿尔曼四足加臂、仓储搬运、机器人闪电仓和欧姆龙移动复合方案，补充双臂/轮式复合平台在仓储、搬运和移动操作中的落地参照。",
  "agilex-limo-piper": "本轮新增移动复合机器人和仓储案例对照，补充 LIMO + PiPER 作为低成本落地原型时的任务场景参考。",
  "unitree-go2-z1": "本轮新增睿尔曼机器狗加臂案例、云深处巡检案例和移动复合方案对照，补充四足加臂方案在巡检、检测和移动操作中的落地证据。",
  "xarm-agilex-base": "本轮新增协作臂产线、仓储搬运、机器人闪电仓和欧姆龙移动复合方案，补充 xArm + AgileX 自研组合的落地场景参照。",
  "realman-mobile-manipulator": "本轮新增睿尔曼机器狗加臂、机器人闪电仓和仓储搬运案例，补强睿尔曼复合平台的官方应用集成证据。",
  "robotnik-rb-kairos": "本轮新增欧姆龙移动复合机器人和 Spot/ANYmal 工业巡检方案，补充移动底盘加机械臂在工业移动操作中的落地架构对照。",
  "hello-stretch-3": "本轮新增移动复合机器人、仓储和工业巡检方案作为落地对照，帮助区分 Stretch 的科研/家庭场景与工程化商用移动操作平台。",
  "pal-tiago": "本轮新增移动复合机器人和仓储场景对照，补充 TIAGo 类平台在服务、医院和移动操作落地时的工程参照。",
  "franka-mobile-base": "本轮新增协作臂产线、移动复合机器人、仓储和工业巡检标杆案例，补充移动 Franka 组合从科研平台走向落地项目时的系统集成参照。"
};

const researchRound28Notes = {
  "franka-research-3": "本轮新增 MimicPlay、FurnitureBench、RT-Trajectory、RoboFlamingo、ReKep、RoboAgent 和 Open X-Embodiment 论文入口，进一步补强 Franka/Panda 在操作学习、VLA 和真实机器人 Benchmark 中的高频科研证据。",
  "ur5e": "本轮新增 Transporter Networks、MimicPlay、FurnitureBench、RoboAgent、UniManip 和 RoboGen 等入口，补充 UR5e 类协作臂在桌面操作、长程任务和生成式仿真中的算法对照来源。",
  "ufactory-xarm-6": "本轮新增机器人操作学习、VLA、RoboAgent、ReKep 和 EmbodiedBench 入口，补充 xArm 作为低成本科研机械臂时的软件栈和任务泛化证据。",
  "ufactory-xarm-7": "本轮新增 RoboFlamingo、RT-Trajectory、Open X-Embodiment、ReKep 和 RoboAgent 等来源，补强 xArm7 在遥操作、VLA 策略评测和多任务操作研究中的参考价值。",
  "dobot-cr5": "本轮新增 Transporter Networks、FurnitureBench 和 RoboGen 等操作 Benchmark，补充 DOBOT 协作臂作为教学/实训平台时可复用的算法实验入口。",
  "kinova-gen3": "本轮新增 FurnitureBench、ReKep、RoboAgent 和 RoboGen 入口，补充 Kinova Gen3 在服务机器人、装配和长程操作任务中的研究对照。",
  "mycobot-280": "本轮新增 Transporter Networks、RoboGen 和 EmbodiedBench 等入口，补充低成本教学机械臂在桌面操作、仿真任务生成和具身 Agent 课程中的对照来源。",
  "unitree-g1": "本轮新增 HumanoidBench、MaskedMimic、EmbodiedBench 和 Genesis 入口，补充 G1 类人形机器人在全身控制、具身 Agent 评测和仿真训练中的科研证据。",
  "unitree-h1": "本轮新增 HumanoidBench、MaskedMimic、EmbodiedBench 和 Genesis 入口，补强 H1 类全尺寸人形在复杂运动、操作和仿真评测中的对照来源。",
  "fourier-gr1": "本轮新增 HumanoidBench、MaskedMimic 和 Genesis 入口，补充 GR-1/GR-2 类人形平台在全身控制和基础模型训练中的科研参考。",
  "fourier-gr2": "本轮新增 HumanoidBench、MaskedMimic、EmbodiedBench 和 Genesis 入口，补充 GR-2 面向高自由度人形操作与训练平台的学术对照。",
  "robotera-star1": "本轮新增 HumanoidBench、EmbodiedBench 和 Genesis 入口，补充 STAR1 与人形基础模型、仿真评测和具身 Agent 研究的横向对照。",
  "booster-t1": "本轮新增 HumanoidBench 和 EmbodiedBench 入口，补充 Booster T1 教学科研平台在人形 Benchmark 和课程评测中的参考来源。",
  "unitree-go2": "本轮新增 RMA、DreamWaQ++、DreamWaQ、EmbodiedBench 和 Genesis 入口，进一步补强 Go2 类四足在鲁棒运动、复杂地形和仿真训练中的科研证据。",
  "unitree-b2": "本轮新增 RMA、DreamWaQ++ 和 Genesis 入口，补充 B2 高负载四足在复杂地形运动控制和仿真训练中的学术对照。",
  "unitree-a2": "本轮新增 RMA、DreamWaQ++ 和 Genesis 入口，补充 A2 类高性能四足的运动控制、跨平台策略和仿真训练来源。",
  "deeprobotics-lite3": "本轮新增 RMA、DreamWaQ++、DreamWaQ 和 Genesis 入口，补充 Lite3 与 Unitree/ANYmal 四足运动控制论文生态的对照。",
  "deeprobotics-x30": "本轮新增 RMA、DreamWaQ++、EmbodiedBench 和 Genesis 入口，补充 X30 工业四足在科研课题中可参考的运动控制和仿真训练来源。",
  "unitree-go2-z1": "本轮新增 ReKep、ConceptGraphs、RoboPoint、RoboGen、RMA 和 DreamWaQ++ 入口，补强四足加臂方案在语义建图、移动操作和运动控制上的综合科研证据。",
  "agilex-cobot-magic": "本轮新增 MimicPlay、FurnitureBench、RT-Trajectory、RoboFlamingo、ReKep、ConceptGraphs、RoboPoint 和 RoboGen，补强双臂移动操作平台在长程任务、VLA 和真实装配 Benchmark 中的科研证据。",
	  "agilex-limo-piper": "本轮新增 ReKep、ConceptGraphs、TidyBot、RoboPoint、EmbodiedBench 和 Genesis 入口，补充 LIMO + PiPER 低成本复合平台在服务任务、语义规划和仿真训练中的研究参考。",
	  "xarm-agilex-base": "本轮新增 RoboFlamingo、RT-Trajectory、ReKep、RoboAgent、ConceptGraphs 和 EmbodiedBench，补强 xArm + AgileX 自研组合在 VLA、规划和移动操作评测中的证据链。",
  "unitree-b2-z1": "本轮新增四足运动控制、语义规划、移动操作和具身 Agent 评测入口，补充 B2 + Z1 四足加臂方案在复杂地形移动操作中的科研证据。",
  "robotnik-rb-kairos": "本轮新增 ReKep、ConceptGraphs、TidyBot、RoboPoint 和 EmbodiedBench 入口，补充 RB-KAIROS+ 类工业移动操作平台在语义规划和任务评测中的来源。",
  "realman-mobile-manipulator": "本轮新增 ReKep、ConceptGraphs、RoboPoint、RoboGen 和 EmbodiedBench 入口，补充睿尔曼移动复合平台在语义规划、抓放和移动操作评测中的研究参考。",
	  "hello-stretch-3": "本轮新增 TidyBot、OK-Robot GitHub、Dobb-E GitHub、ConceptGraphs、RoboPoint 和 EmbodiedBench，进一步补强 Stretch 在真实家庭、开放词汇移动操作和服务机器人任务中的高频科研入口。",
  "mobile-aloha": "本轮新增 MimicPlay、FurnitureBench、RoboFlamingo、RT-Trajectory、RoboAgent 和 RoboGen，补充 Mobile ALOHA 类双臂移动平台在长程模仿学习和基础模型策略中的研究对照。",
  "pal-tiago": "本轮新增 ReKep、ConceptGraphs、TidyBot、RoboPoint 和 EmbodiedBench 入口，补充 TIAGo 类移动服务机器人在语义规划、开放词汇任务和具身 Agent 评测中的来源。",
  "franka-mobile-base": "本轮新增操作学习、移动操作、VLA、ConceptGraphs、ReKep 和 EmbodiedBench 入口，补强移动 Franka 组合在真实操作、语义规划和多任务评测中的科研证据。"
};

const researchRound29Notes = {
  "ur5e": "本轮新增南华大学、大连理工、四川职院和复旦等中文采购公告，补充智能制造、3D 视觉和机器人系统集成实训平台的学校采购证据。",
  "dobot-cr5": "本轮新增机器人系统集成实训平台和智能机器人开发平台采购公告，补充协作臂/实训平台在学校建设中的预算与招标来源。",
  "dobot-mg400": "本轮新增高校具身智能实训系统和机器人系统集成平台采购公告，补充桌面机械臂/教学机械臂进入实验室建设的采购场景来源。",
  "ufactory-xarm-6": "本轮新增具身智能实训系统、智能机器人开发平台和系统集成实训平台采购公告，补充 xArm 类低成本协作臂在高校实验室采购中的对照来源。",
  "ufactory-xarm-7": "本轮新增中文高校智能机器人和系统集成平台采购公告，补充 xArm7 作为科研/实训机械臂配置时的预算和招标参考。",
  "franka-research-3": "本轮新增复旦大学智能机器人采购、南华大学智能机器人开发平台和具身智能训练场公告，补充高端科研机械臂在学校平台建设中的采购参照。",
  "unitree-z1": "本轮新增具身智能训练场、多负载机器人平台和复旦智能机器人采购公告，补充 Z1 或四足加臂方案在高校具身平台中的采购线索。",
  "agilex-piper": "本轮新增高校具身智能实训系统、训练场和智能制造实训平台采购公告，补充 PiPER 类轻量机械臂进入复合实训平台的采购证据。",
  "unitree-g1": "本轮新增齐鲁工业大学人形机器人实验室、华中科技大学人形机器人平台和中国软件评测中心人形测评系统公告，补充 G1 类人形采购、验收和测评体系来源。",
  "unitree-h1": "本轮新增人形机器人实验室系统平台、人形机器人平台和可靠性测评系统采购公告，补充 H1 类全尺寸人形进入高校实验室和测评平台的采购证据。",
  "fourier-gr1": "本轮新增人形机器人实验室和测评系统采购公告，补充 GR 系列作为高校人形平台采购时的预算、可靠性和验收对照。",
  "fourier-gr2": "本轮新增人形机器人实验室系统平台与测评系统公告，补充 GR-2 高自由度人形平台采购前的测评和验收参考。",
  "booster-t1": "本轮新增华中科技大学人形机器人平台和齐鲁工业大学人形实验室采购公告，补充 Booster 类教学科研人形平台的高校采购对照。",
  "robotera-star1": "本轮新增人形实验室、测评系统和具身智能训练场公告，补充 STAR1 类国产人形平台的学校采购与测评来源。",
  "unitree-go2": "本轮新增警用四足机器人、卫生健康四足/四轮足机器人和高校具身智能实训系统采购公告，补充 Go2 类四足在实训、公共安全和公共卫生场景中的采购来源。",
  "unitree-b2": "本轮新增警用四足机器人和四足/四轮足机器人中标公告，补充 B2/A2 类行业四足在政府场景中的价格和落地采购证据。",
  "unitree-a2": "本轮新增四足机器人政府中标公告和具身智能训练场采购公告，补充 A2 类高性能四足的采购预算和应用场景对照。",
  "deeprobotics-x30": "本轮新增警用四足、公共卫生四足/四轮足机器人采购公告，补充 X30 类工业四足在政府落地项目中的采购来源。",
  "deeprobotics-lite3": "本轮新增高校具身智能实训系统和政府四足机器人采购公告，补充 Lite3 类教育科研四足向落地试点迁移时的采购参考。",
  "agilex-cobot-magic": "本轮新增具身智能训练场、多负载机器人平台、AI+3D 视觉机器人智能制造实训平台和复旦智能机器人采购公告，补充双臂/复合型平台在高校建设中的采购证据。",
  "agilex-limo-piper": "本轮新增高校具身智能实训系统和智能制造实训平台公告，补充 LIMO + PiPER 类低成本复合平台的实验室建设采购来源。",
  "unitree-go2-z1": "本轮新增具身智能实训系统、多负载机器人平台和政府四足采购公告，补充四足加臂方案在学校实训和落地试点中的采购来源。",
  "xarm-agilex-base": "本轮新增智能机器人开发平台、AI+3D 视觉实训平台和复旦智能机器人采购公告，补充 xArm + AgileX 自研组合的高校采购场景来源。",
  "realman-mobile-manipulator": "本轮新增复旦智能机器人采购和具身智能训练场公告，补充移动复合机器人进入高校智能机器人平台建设的采购证据。",
  "hello-stretch-3": "本轮新增具身智能训练场、多负载机器人平台和复旦智能机器人采购公告，补充移动抓取/服务机器人平台在学校采购中的对照来源。",
  "mobile-aloha": "本轮新增具身智能训练场、多负载机器人平台和智能制造实训平台采购公告，补充低成本移动双臂/遥操作平台在高校平台建设中的采购参考。",
  "pal-tiago": "本轮新增具身智能训练场和智能机器人采购公告，补充 TIAGo 类服务移动操作平台进入高校实验室建设时的采购参照。",
  "franka-mobile-base": "本轮新增多负载机器人平台、智能制造实训平台和复旦智能机器人采购公告，补充移动 Franka 组合在高校综合机器人平台中的采购证据。"
};

const researchRound30Notes = {
  "unitree-g1": "本轮新增宇树官方文档中心、G1 应用下载和 G1 应用开发文档，补强 G1 买回学校后的工具链、SDK 接入和支持路径证据。",
  "unitree-h1": "本轮新增宇树官方文档中心和人形应用开发入口，补充 H1/G1 系列在人形控制、应用开发和售后支持上的官方核验路径。",
  "unitree-r1-air": "本轮新增宇树官方文档中心、G1/R1 相关应用下载和人形应用开发文档，补充 R1 Air 作为低价教学人形平台的开发支持来源。",
  "unitree-r1-d": "本轮新增宇树官方文档中心、应用下载和人形应用开发文档，补充 R1-D 双臂人形平台的工具链和二次开发支持来源。",
  "unitree-go2": "本轮新增宇树官方文档中心、Go2 应用下载和 Go2 应用开发文档，补强 Go2 用于课程、导航和校园巡检原型时的官方开发支持来源。",
  "unitree-go1": "本轮新增宇树官方文档中心和 Go2 应用开发入口作为升级对照，补充 Go1 存量平台迁移到 Go2/A2/B2 时的官方支持路径。",
  "unitree-b2": "本轮新增宇树官方文档中心和四足应用开发入口，补充 B2 行业四足采购后 SDK、维护和应用开发核验路径。",
  "unitree-a2": "本轮新增宇树官方文档中心和四足应用开发入口，补充 A2 新型号采购时对开发文档、应用工具和售后支持的核验来源。",
  "unitree-z1": "本轮新增宇树 Z1 SDK 操作文档，补强 Z1 机械臂和四足加臂组合在学校二次开发中的官方接口证据。",
  "unitree-b2-z1": "本轮新增宇树四足应用开发文档和 Z1 SDK 操作文档，补充 B2 + Z1 组合在移动操作、控制接口和维护支持上的官方来源。",
  "unitree-go2-z1": "本轮新增 Go2 应用开发文档、Go2 应用下载和 Z1 SDK 操作文档，补强 Go2 + Z1 四足加臂方案的官方开发证据链。",
  "deeprobotics-lite3": "本轮新增云深处产品总览、下载中心、研究教育方案、Lite3 AI 用户手册和感知开发手册，补强 Lite3 教学科研采购后的文档、维护和感知开发证据。",
  "deeprobotics-x30": "本轮新增云深处产品总览、下载中心和研究教育方案，补充 X30 与 Lite3/X20/山猫系列在官方资料和科研教育定位上的对照来源。",
  "deeprobotics-x20": "本轮新增云深处产品总览和下载中心，补充 X20 采购前对产品线、手册和维护资料完整性的核验路径。",
  "deeprobotics-lynx-m20": "本轮新增云深处产品总览和下载中心，补充山猫 M20 轮足平台采购前对官方手册和产品线定位的核验来源。"
};

const researchRound31Notes = {
  "franka-research-3": "本轮新增 Gemini Robotics On-Device、GraspFactory、SmolVLA、InternVLA-M1、H2R 和上海 AI 实验室入口，进一步补强 Franka/FR3/Panda 在机器人基础模型、抓取数据集和跨具身适配研究中的高频地位。",
  "ur5e": "本轮新增 SmolVLA、InternVLA-M1、InternData-M1、GraspFactory、H2R 和上海 AI 实验室入口，补充 UR5e 类协作臂在通用 VLA、抓取和数据工程研究中的对照来源。",
  "ufactory-xarm-6": "本轮新增 SmolVLA、InternVLA-M1、InternData-M1、OpenARM 中文社区和上海 AI 实验室来源，补充 xArm 类低成本机械臂在学校可负担 VLA 与开源硬件教学中的参考价值。",
  "ufactory-xarm-7": "本轮新增 SmolVLA、InternVLA-M1、InternData-M1、OpenARM 中文社区和上海 AI 实验室来源，补充 xArm7 在低成本遥操作、VLA 微调和开源硬件对照中的研究入口。",
  "kinova-gen3": "本轮新增机器人基础模型、抓取数据集和数据增强入口，补充 Kinova Gen3 在协作臂操作学习和跨平台策略评测中的学术对照价值。",
  "unitree-z1": "本轮新增 VLA、机器人数据引擎、Whole-Body MPPI 和抓取数据集入口，补充 Z1 或四足加臂组合在移动操作和接触丰富控制中的研究线索。",
  "agilex-piper": "本轮新增 SmolVLA、InternVLA-M1、OpenARM 和上海 AI 实验室入口，补充 PiPER 类轻量机械臂在低成本具身智能课程、VLA 微调和数据采集中的对照来源。",
  "mycobot-280": "本轮新增 SmolVLA、OpenARM 中文社区和上海 AI 实验室来源，补充 myCobot 与低成本开源机械臂在教学科研平台中的横向参考。",
  "mycobot-320": "本轮新增 SmolVLA、OpenARM 中文社区和上海 AI 实验室来源，补充 myCobot 320 作为可负担机械臂时与开源硬件和 VLA 课程生态的对照。",
  "dobot-mg400": "本轮新增 SmolVLA、OpenARM 中文社区和中文具身智能开源来源，补充 MG400 在桌面教学和低成本操作学习课程中的对照入口。",
  "unitree-g1": "本轮新增 GR00T N1.5、InternVLA-M1、AgiBot Research、上海 AI 实验室和 Gemini Robotics 相关入口，补强 Unitree G1 在人形基础模型、遥操作数据和通用策略研究中的高频证据。",
  "unitree-h1": "本轮新增 GR00T N1.5、InternVLA-M1、AgiBot Research 和上海 AI 实验室来源，补充 H1 类全尺寸人形在通用人形基础模型和运动/操作研究中的对照证据。",
  "agibot-a2": "本轮新增 AgiBot Research、InternVLA-M1、InternData-M1 和上海 AI 实验室入口，补充智元平台和中文具身智能数据/模型生态的来源链。",
  "agibot-x2": "本轮新增 AgiBot Research、InternVLA-M1、InternData-M1 和中文具身智能开源来源，补充灵犀 X2 类低成本人形在学校教学科研中的生态证据。",
  "fourier-gr1": "本轮新增 GR00T N1.5、Gemini Robotics、InternVLA-M1 和上海 AI 实验室入口，补充 GR-1 在人形双臂操作、基础模型和跨平台适配中的研究来源。",
  "fourier-gr2": "本轮新增 GR00T N1.5、InternVLA-M1 和中文具身智能开源来源，补充 GR-2 类高自由度人形在基础模型和遥操作数据方向的对照来源。",
  "ubtech-walker-s1": "本轮新增 InternVLA-M1、AgiBot Research、上海 AI 实验室和 Gemini Robotics 入口，补充 Walker S1 类落地人形在人形 VLA、测评和中文科研生态中的对照。",
  "leju-kuavo": "本轮新增 InternVLA-M1、GR00T N1.5、AgiBot Research 和上海 AI 实验室入口，补充 Kuavo 开源人形在基础模型和中文开源生态下的横向参考。",
  "booster-t1": "本轮新增 GR00T N1.5、InternVLA-M1 和上海 AI 实验室来源，补充 Booster T1 教学人形与通用人形策略、仿真和数据平台之间的研究连接。",
  "engineai-pm01": "本轮新增 GR00T N1.5、InternVLA-M1、AgiBot Research 和上海 AI 实验室来源，补充 PM01 类小型人形作为教学科研平台时的软件生态对照。",
  "robotera-star1": "本轮新增 GR00T N1.5、InternVLA-M1 和中文具身智能开源来源，补充 STAR1 类国产人形在基础模型、数据和评测生态中的对照入口。",
  "unitree-go2": "本轮新增 Go2 在线形态适应、LOVON、Whole-Body MPPI、Inria Go2 平台和 CMU Go2 自主栈，补强 Go2 在四足运动控制、开放词汇导航和校园巡检原型中的研究证据。",
  "unitree-go1": "本轮新增 Go2/Go1 可迁移的四足控制、开放词汇导航和自主栈入口，补充 Go1 存量平台向 Go2/B2 生态迁移时的研究对照。",
  "unitree-b2": "本轮新增四足全身控制、LOVON、在线形态适应和自主导航来源，补充 B2 类高负载四足在巡检和复杂环境移动中的研究证据。",
  "unitree-a2": "本轮新增 Go2 在线形态适应、Whole-Body MPPI、LOVON 和 CMU 自主栈来源，补充 A2 类新型四足平台在高机动和自主巡检算法上的迁移参考。",
  "deeprobotics-lite3": "本轮新增四足全身控制、开放词汇导航和形态适应项目，补充 Lite3 与 Go2/ANYmal 等平台在运动控制论文中的对照来源。",
  "deeprobotics-x30": "本轮新增 Whole-Body MPPI、LOVON 和在线形态适应入口，补充 X30 类工业四足在高负载巡检和开放词汇导航课题中的算法参考。",
  "deeprobotics-x20": "本轮新增四足控制、导航和形态适应论文入口，补充 X20 在工业四足研究和落地算法评估中的对照来源。",
  "limx-tron1": "本轮新增四足/轮足可参考的全身控制、开放词汇导航和形态适应来源，补充 TRON1 在轮足平台算法迁移中的研究入口。",
  "unitree-b2-z1": "本轮新增 Go2/B2 类四足控制来源和 VLA/移动操作数据入口，补充 B2 + Z1 四足加臂在复杂地形移动操作中的研究证据链。",
  "unitree-go2-z1": "本轮新增 Go2 形态适应、开放词汇导航、自主栈、InternVLA-M1 和 Gemini Robotics 入口，补强 Go2 + Z1 在校园导航、巡检抓取和移动操作研究中的来源。",
  "agilex-cobot-magic": "本轮新增 InternVLA-M1、InternData-M1、Gemini Robotics、SmolVLA、Stretch/HomeRobot 论文和上海 AI 实验室入口，补强 Cobot Magic 在双臂移动操作、数据工程和 VLA 研究中的证据。",
  "agilex-limo-piper": "本轮新增 SmolVLA、InternVLA-M1、InternDataEngine、OpenARM 和上海 AI 实验室入口，补充 LIMO + PiPER 低成本复合平台在课程、数据采集和 VLA 微调中的参考来源。",
  "xarm-agilex-base": "本轮新增 InternVLA-M1、SmolVLA、Gemini Robotics、OpenARM 和上海 AI 实验室入口，补强 xArm + AgileX 自研组合在低成本移动操作与通用策略研究中的证据。",
  "robotnik-rb-kairos": "本轮新增 VLA、InternDataEngine、HomeRobot 和 Stretch 论文入口，补充 RB-KAIROS+ 类工业移动操作平台在软件栈和任务评测中的对照来源。",
  "realman-mobile-manipulator": "本轮新增 InternVLA-M1、InternData-M1、HomeRobot 和上海 AI 实验室来源，补充睿尔曼移动复合平台在中文具身智能数据和移动操作软件栈中的研究对照。",
  "hello-stretch-3": "本轮新增 Stretch 设计论文、HomeRobot AAAI 论文、Gemini Robotics、SmolVLA、InternVLA-M1 和上海 AI 实验室来源，进一步强化 Stretch 在家庭移动操作和开源软件栈中的科研常用性。",
  "mobile-aloha": "本轮新增 Gemini Robotics On-Device、SmolVLA、InternVLA-M1、InternData-M1 和 H2R，补充 Mobile ALOHA 类双臂平台在端侧 VLA、低成本策略和人类视频数据增强中的研究入口。",
  "pal-tiago": "本轮新增 HomeRobot、Stretch 设计论文、VLA 和 InternDataEngine 入口，补充 TIAGo 类服务移动操作平台在开放软件栈和具身任务评测中的对照来源。",
  "franka-mobile-base": "本轮新增 Gemini Robotics On-Device、GraspFactory、InternVLA-M1、HomeRobot 和上海 AI 实验室来源，补充移动 Franka 组合在双臂/移动操作和基础模型适配中的研究证据。",
  "hiwonder-jetauto-pro": "本轮新增 OpenARM 中文社区、SmolVLA 和上海 AI 实验室入口，补充 JetAuto Pro 类教学复合平台在低成本开源硬件和中文具身课程中的参考来源。",
  "hiwonder-jetrover-arm": "本轮新增 OpenARM 中文社区、SmolVLA 和上海 AI 实验室入口，补充 JetRover 加臂方案在教学、低成本实验和开源硬件对照中的来源。",
  "yahboom-rosmaster-x3-arm": "本轮新增 OpenARM 中文社区、SmolVLA 和上海 AI 实验室入口，补充 ROSMASTER X3 加臂方案在教学与开源低成本具身实验中的参考来源。",
  "turtlebot4-arm": "本轮新增 OpenARM 中文社区、SmolVLA 和上海 AI 实验室入口，补充 TurtleBot4 加臂方案在教学、导航和低成本移动操作课程中的对照来源。"
};

const researchRound32Notes = {
  "ur5e": "本轮新增东南大学 UR5e 协作机械臂竞价结果和深圳技术大学机器人实验平台公告，补充高校协作臂真实成交价、交付时间、验收和国产/进口限制等采购证据。",
  "dobot-cr5": "本轮新增深圳技术大学机器人智能控制实验平台公告和东南大学协作臂竞价结果，补充高校实验平台建设中的机械臂预算、交付和招标约束参考。",
  "dobot-mg400": "本轮新增深圳技术大学机器人实验平台公告，补充桌面/教学机械臂在高校机器人智能控制和虚拟仿真平台建设中的采购参照。",
  "ufactory-xarm-6": "本轮新增高校机器人智能控制平台和 UR5e 竞价成交来源，补充 xArm 类协作臂做预算对照时可参考的学校采购条款。",
  "ufactory-xarm-7": "本轮新增深圳技术大学实验平台和东南大学协作臂竞价结果，补充 xArm7 作为科研机械臂备选时的高校采购预算和交付参考。",
  "franka-research-3": "本轮新增高校机器人实验平台采购和 UR5e 竞价结果，补充高端科研机械臂采购时可对照的教学平台预算、国产限制和验收条款。",
  "unitree-g1": "本轮新增复旦 H1-2 合同、同济人形机器人训练平台招标和同济机器人集群训练场，补充 G1/H1 类人形平台在学校人形训练场建设中的合同、预算和科研平台证据。",
  "unitree-h1": "本轮新增复旦全尺寸通用人形机器人合同 PDF、同济 837.6 万元训练平台招标和机器人集群训练场，补强 H1/H1-2 高校采购、交付验收和大规模训练平台来源。",
  "agibot-a2": "本轮新增同济人形机器人训练平台、复旦人形合同和机器人集群训练场来源，补充智元 A2 类高端人形在高校训练场和具身行为学习平台中的采购对照。",
  "agibot-x2": "本轮新增同济人形训练平台和复旦合同来源，补充智元 X2 类服务/交互人形在学校具身智能平台建设中的采购与合同对照。",
  "ubtech-walker-s1": "本轮新增同济训练平台、复旦合同和机器人集群训练场来源，补充 Walker S1 类落地人形在高校训练平台建设中的预算与验收参考。",
  "fourier-gr1": "本轮新增同济人形训练平台招标和复旦合同，补充 GR-1 类全尺寸人形进入高校平台采购时的预算、交付和合同条款对照。",
  "fourier-gr2": "本轮新增同济人形训练平台和机器人集群训练场来源，补充 GR-2 类人形作为高校训练场平台时的采购预算与科研平台证据。",
  "leju-kuavo": "本轮新增同济人形训练平台、复旦合同和机器人集群训练场来源，补充 Kuavo 开源人形在学校人形训练平台建设中的对照证据。",
  "engineai-pm01": "本轮新增同济训练平台和复旦合同来源，补充 PM01 类低价人形在学校人形平台采购预算和交付条款中的参考。",
  "robotera-star1": "本轮新增同济人形训练平台、复旦合同和机器人集群训练场来源，补充 STAR1 类国产人形在高校高端平台建设中的采购对照。",
  "unitree-r1-air": "本轮新增同济训练平台和复旦合同来源，补充 R1 Air 低价人形与高端人形训练平台之间的预算层级和采购定位对照。",
  "unitree-r1-d": "本轮新增同济训练平台和复旦合同来源，补充 R1-D 双臂低价人形在学校人形课程和训练平台中的预算对照。",
  "booster-t1": "本轮新增同济人形训练平台、Booster 官方开源页和 Booster Gym 论文，补强 T1 教学人形的采购预算、ROS2/SDK、强化学习和 sim-to-real 证据。",
  "noetix-bumi": "本轮新增 NOETIX 官方开源入口和 Bumi 官方产品页，补充 Bumi/N2/E1 小型人形的规格、SDK、开源资料和教学科研可复现证据。",
  "unitree-go2": "本轮新增河南警用四足和四足/四轮足合同 PDF，补充 Go2/B2/A2 类四足在公共安全和公共服务场景中的合同级采购、交付和质保条款参考。",
  "unitree-b2": "本轮新增警用四足机器人合同和四足/四轮足机器人合同 PDF，补强 B2 类行业四足在政府项目中的采购合同与验收证据。",
  "unitree-a2": "本轮新增四足机器人合同 PDF，补充 A2 类新型四足平台做行业采购时可参考的政府合同、交付和质保条款。",
  "unitree-go1": "本轮新增四足机器人政府合同来源，补充 Go1 存量平台与新一代 Go2/B2/A2 项目采购条款的对照。",
  "unitree-b2-z1": "本轮新增四足机器人政府合同 PDF，补充 B2 + Z1 四足加臂组合在公共安全、巡检和移动操作项目中的合同条款参考。",
  "unitree-go2-z1": "本轮新增四足机器人政府合同 PDF，补充 Go2 + Z1 四足加臂方案用于巡检抓取和校园试点时的采购条款对照。",
  "deeprobotics-x30": "本轮新增河南四足机器人合同 PDF 和 Lite3 MotionSDK 入口，补充 X30 类工业四足在政府采购合同、开发接口和科研实验接入上的证据。",
  "deeprobotics-lite3": "本轮新增政府四足合同 PDF 和 Lite3 MotionSDK GitHub，补充 Lite3 从教学科研到落地试点时的合同条款和开发接口来源。",
  "deeprobotics-x20": "本轮新增政府四足合同 PDF 和云深处 SDK 入口，补充 X20 类行业四足在公共安全/公共服务采购和二次开发中的证据。",
  "deeprobotics-lynx-m20": "本轮新增四足/四轮足机器人合同 PDF 和云深处 SDK 入口，补充山猫 M20 轮足形态在政府项目中的采购条款和开发接口对照。",
  "limx-tron1": "本轮新增 LimX TRON1 中文官方产品页和四足/四轮足政府合同，补充 TRON1 在多形态足式科研平台、SDK、仿真和落地采购条款中的证据。",
  "xiaomi-cyberdog2": "本轮新增 CyberDog ROS2 GitHub 和四足机器人合同来源，补充 CyberDog 类消费级四足在 ROS2 开源生态和采购条款中的参考。",
  "agilex-cobot-magic": "本轮新增同济人形训练平台、深圳技术大学机器人实验平台和复旦合同来源，补充 Cobot Magic 类双臂/复合平台在高校训练场和实训平台建设中的采购证据。",
  "agilex-limo-piper": "本轮新增深圳技术大学机器人智能控制实验平台，补充 LIMO + PiPER 类低成本复合平台在学校实验平台预算、国产限制和交付验收中的对照。",
  "xarm-agilex-base": "本轮新增深圳技术大学实验平台和东南大学 UR5e 竞价结果，补充 xArm + AgileX 自研组合在高校协作臂和移动操作平台采购中的预算对照。",
  "franka-mobile-base": "本轮新增同济训练平台、复旦合同和深圳技术大学机器人实验平台，补充移动 Franka 组合在高端人形/移动操作训练场和教学平台中的采购参考。",
  "hello-stretch-3": "本轮新增同济机器人集群训练场和训练平台招标，补充 Stretch 类移动操作平台在百台级异构机器人训练场和示教学习平台中的对照来源。",
  "pal-tiago": "本轮新增同济训练平台和机器人集群训练场来源，补充 TIAGo 类服务移动操作平台在学校集群训练场和具身行为学习中的采购对照。",
  "mobile-aloha": "本轮新增同济训练平台和机器人集群训练场来源，补充 Mobile ALOHA 类双臂移动平台在示教学习、仿真迁移和真实世界强化学习平台中的证据。",
  "realman-mobile-manipulator": "本轮新增同济训练平台和机器人集群训练场来源，补充睿尔曼移动复合平台在高校异构机器人训练场中的采购和科研平台对照。",
  "robotnik-rb-kairos": "本轮新增深圳技术大学机器人实验平台和东南大学 UR5e 竞价结果，补充 RB-KAIROS+ 类移动协作臂平台在工业机器人实训和协作臂采购中的预算对照。",
  "hiwonder-jetauto-pro": "本轮新增深圳技术大学机器人智能控制实验平台，补充 JetAuto Pro 类教学复合平台在国产实验平台采购中的预算和交付参考。",
  "hiwonder-jetrover-arm": "本轮新增深圳技术大学机器人智能控制实验平台，补充 JetRover 加臂方案在教学和虚拟仿真平台采购中的对照来源。",
  "yahboom-rosmaster-x3-arm": "本轮新增深圳技术大学机器人实验平台，补充 ROSMASTER X3 + DOFBOT 类教学平台在高校实验平台采购中的预算参考。",
  "turtlebot4-arm": "本轮新增深圳技术大学机器人智能控制实验平台，补充 TurtleBot4 加臂方案在教学、导航和虚拟仿真平台中的采购对照。"
};

const researchRound33Notes = {
  "mycobot-320": "本轮新增 myCobot 320 Pi 官方商城价和官方 GitBook 文档，价格可信度从低置信线索提升为官方商城美元价估算，并补充发货、负载、重复定位精度和开发环境资料。",
  "engineai-pm01": "本轮新增众擎 PM01 官方购买页和中文产品页，将 PM01 价格从第三方 8.8 万元线索修正为官网公开价 18.8 万元，并补充开放接口、训练/部署代码和产品规格证据。",
  "fourier-gr1": "本轮新增复旦大学 GR-1 人形机器人成交公告和傅利叶 GR-2 官方文档，将 GR-1 国内采购参考价更新为高校成交单价 70 万元，并补充 SDK、遥操作、强化学习和仿真资料。",
  "fourier-gr2": "本轮新增傅利叶 GR-2 官方文档和复旦 GR-1 成交公告，补充 GR 系列在高校采购价格、SDK 开发、遥操作、强化学习和仿真支持上的来源。",
  "ubtech-walker-s1": "本轮新增优必选 Walker S1 官方产品页，补充工业版人形机器人产品定位、应用场景和官方规格来源，价格仍需正式询价。",
  "agibot-a2": "本轮新增 AGIBOT A2 Lite 官方商城页，将智元 A2 系列价格从第三方线索改为同系列低配官方商城价线索，并明确 A2/A2 Ultra 仍需按版本询价。",
  "robotera-star1": "本轮新增 RobotEra STAR1 官方规格 PDF，补充 STAR1 官方硬件参数和产品定位来源，第三方美元价格仍需向厂商核验。",
  "pal-tiago": "本轮新增 PAL TIAGo 官方产品页、PAL OS ROS2 文档和 ROS Robots 索引，补强 TIAGo 在移动操作、研究教学、ROS2 开发和 MoveIt 生态中的来源。",
  "robotnik-rb-kairos": "本轮新增 Robotnik RB-KAIROS 2025 数据表和 ROS Robots 索引，补充 RB-KAIROS/RB-KAIROS+ 的 250 kg 载荷、ROS2、工业物流和移动协作臂集成来源。",
  "franka-mobile-base": "本轮新增 Robotnik RB-KAIROS 2025 数据表和 ROS Robots 索引，补充 Franka/UR 类机械臂搭配工业移动底盘时的载荷、ROS2 和集成架构参考。",
  "xarm-agilex-base": "本轮新增 RB-KAIROS 2025 数据表和 ROS Robots 索引，补充 xArm + AgileX 自研移动操作组合与成熟工业 AMR + 机械臂架构的对照来源。"
};

const researchRound34Notes = {
  "franka-research-3": "本轮新增 panda-gym、SimplerEnv 等可复现实验入口，补充 Franka/Panda 在强化学习、目标条件操作和真实策略仿真复现中的教学科研证据。",
  "ur5e": "本轮新增 SimplerEnv、panda-gym 等机械臂操作学习入口，补充 UR5e 类协作臂作为通用操作算法对照平台时的软件证据。",
  "ufactory-xarm-6": "本轮新增机械臂操作 Benchmark 和仿真复现入口，补充 xArm 类低成本协作臂用于课程、VLA 评测和机器人学习实验的来源。",
  "ufactory-xarm-7": "本轮新增 SimplerEnv 和机械臂学习环境入口，补充 xArm7 在自研移动操作和通用策略评估中的对照来源。",
  "kinova-gen3": "本轮新增机械臂操作学习和仿真复现来源，补充 Kinova Gen3 作为服务机器人操作平台时的算法对照入口。",
  "mycobot-280": "本轮新增 panda-gym 和 SimplerEnv 作为低成本桌面机械臂课程的算法对照来源，帮助区分教学平台和高精度科研平台边界。",
  "mycobot-320": "本轮新增机械臂学习环境和策略复现入口，补充 myCobot 320 用于教学科研时可参考的开源实验框架。",
  "dobot-mg400": "本轮新增 SimplerEnv 类操作策略评测入口，补充 MG400 桌面工业机械臂用于教学和算法验证时的软件对照。",
  "dobot-cr5": "本轮新增 SimplerEnv 类真实机器人策略复现入口，补充 CR5 在协作臂操作学习实验中的横向参考。",
  "unitree-g1": "本轮新增人形运动控制、legged_control、OpenEQA 和 ActionEQA 来源，补充 G1 在全身控制、具身问答和高层任务评测中的研究入口。",
  "unitree-h1": "本轮新增人形运动控制和 legged_control 来源，补充 H1 类全尺寸人形在高动态控制和全身运动研究中的算法对照。",
  "fourier-gr1": "本轮新增人形运动控制来源，补充 GR-1 与 Unitree G1/H1 等平台在人形基础运动研究中的横向参考。",
  "fourier-gr2": "本轮新增人形运动控制来源，补充 GR-2 在全身控制、运动跟踪和高动态运动方向的研究对照。",
  "booster-t1": "本轮新增人形运动控制和 legged_control 来源，补充 Booster T1 教学人形在运动控制课程和 sim-to-real 研究中的对照。",
  "leju-kuavo": "本轮新增人形运动控制来源，补充 Kuavo 开源人形在运动生成、运动跟踪和动态控制方向的参考入口。",
  "engineai-pm01": "本轮新增人形运动控制来源，补充 PM01 类小型人形在学校教学科研时可对照的算法栈。",
  "robotera-star1": "本轮新增人形运动控制来源，补充 STAR1 高动态人形在运动控制研究中的横向参考。",
  "unitree-r1-air": "本轮新增人形运动控制来源，补充 R1 Air 低价教学人形在课程实验中的算法对照。",
  "unitree-r1-d": "本轮新增人形运动控制来源，补充 R1-D 双臂低价人形在全身运动和操作任务中的参考入口。",
  "unitree-go2": "本轮新增 VLMaps、OpenEQA、ActionEQA、Wild Visual Navigation、CHAMP、legged_control 和 Go2 开放词汇语义记忆项目，补强 Go2 在语义导航、具身问答和四足控制中的研究证据。",
  "unitree-go1": "本轮新增 CHAMP、legged_control 和 Wild Visual Navigation，补充 Go1 存量四足平台向 Go2/B2 研究栈迁移时的开源控制与导航参考。",
  "unitree-b2": "本轮新增四足导航、CHAMP、legged_control 和 VLMaps 来源，补充 B2 高负载四足在巡检、语义导航和控制栈中的算法对照。",
  "unitree-a2": "本轮新增四足导航与控制框架来源，补充 A2 类高机动四足在自主巡检和腿足控制研究中的参考。",
  "deeprobotics-lite3": "本轮新增 CHAMP、legged_control 和 Wild Visual Navigation，补充 Lite3 在四足教学、控制和视觉导航研究中的对照来源。",
  "deeprobotics-x30": "本轮新增腿足控制和视觉导航来源，补充 X30 工业四足在复杂环境巡检算法评估中的研究入口。",
  "deeprobotics-x20": "本轮新增腿足控制和视觉导航来源，补充 X20 行业四足在移动控制与语义导航方向的算法对照。",
  "limx-tron1": "本轮新增 legged_control、CHAMP 和视觉导航来源，补充 TRON1 多形态足式平台在腿足控制研究中的迁移参考。",
  "xiaomi-cyberdog2": "本轮新增 CHAMP 和腿足控制框架来源，补充 CyberDog2 作为消费级/教学四足平台的开源算法对照。",
  "unitree-go2-z1": "本轮新增 Go2 语义记忆、VLMaps、OpenEQA、3D Semantic Maps、GeFF-B1 和腿足控制框架，补强 Go2 + Z1 在开放词汇移动操作、语义导航和四足加臂控制中的证据。",
  "unitree-b2-z1": "本轮新增移动语义导航、具身问答和腿足控制来源，补充 B2 + Z1 在复杂地形巡检抓取和移动操作中的研究对照。",
  "agilex-cobot-magic": "本轮新增 SimplerEnv、VLMaps、OpenEQA、3D Semantic Maps 和 GeFF-B1，补充 Cobot Magic 类双臂移动平台在开放词汇移动操作和策略评测中的来源。",
  "agilex-limo-piper": "本轮新增机械臂操作学习和移动语义导航来源，补充 LIMO + PiPER 低成本复合平台在课程、导航和操作研究中的参考。",
  "xarm-agilex-base": "本轮新增机械臂操作 Benchmark、VLMaps、OpenEQA 和移动操作语义地图来源，补强 xArm + AgileX 自研组合在通用软件栈和移动操作评测中的证据。",
  "robotnik-rb-kairos": "本轮新增开放词汇导航、具身问答和移动操作语义地图来源，补充 RB-KAIROS+ 类工业移动操作平台的软件评测入口。",
  "realman-mobile-manipulator": "本轮新增机械臂操作和移动语义导航来源，补充睿尔曼移动复合平台在中文学校项目之外的通用研究对照。",
  "hello-stretch-3": "本轮新增 Stretch 3 开源移动操作站、Hello Robot GitHub、VLMaps、OpenEQA、3D Semantic Maps 和 GeFF-B1，进一步补强 Stretch 的社区、代码和移动操作研究入口。",
  "pal-tiago": "本轮新增 VLMaps、OpenEQA、ActionEQA、3D Semantic Maps 和 GeFF-B1，补充 TIAGo 类服务机器人在语义导航、具身问答和开放词汇移动操作中的评测来源。",
  "mobile-aloha": "本轮新增 SimplerEnv、VLMaps、OpenEQA 和移动操作语义地图来源，补充 Mobile ALOHA 类双臂移动平台在通用策略和开放词汇任务中的对照。",
  "franka-mobile-base": "本轮新增 panda-gym、SimplerEnv、VLMaps、OpenEQA 和移动操作语义地图来源，补强移动 Franka 组合在机械臂学习与服务机器人任务之间的证据链。",
  "hiwonder-jetauto-pro": "本轮新增移动语义导航和具身问答来源，补充 JetAuto Pro 类教学复合平台做课程演示和低成本评测时的算法参考。",
  "hiwonder-jetrover-arm": "本轮新增移动语义导航和具身问答来源，补充 JetRover 加臂方案在低成本移动操作课程中的研究对照。",
  "yahboom-rosmaster-x3-arm": "本轮新增移动语义导航和具身问答来源，补充 ROSMASTER X3 加臂平台在课程实验和开源算法评测中的参考。",
  "turtlebot4-arm": "本轮新增 VLMaps、OpenEQA、ActionEQA 和移动操作语义地图来源，补充 TurtleBot4 + 轻量机械臂组合在 ROS2 教学和服务机器人评测中的来源。"
};

const researchRound35Notes = {
  "franka-research-3": "本轮新增 RoboBrain 2.5、DexVLA、InternManip 和 Awesome LLM Robotics，补充 Franka/Panda 类机械臂在具身基础模型、灵巧操作 VLA 和训练评测套件中的持续跟踪入口。",
  "ur5e": "本轮新增 RoboBrain 2.5、DexVLA、InternManip 和机器人论文资源导航，补充 UR5e 类协作臂在通用 VLA 与机器人操作训练评测中的学术来源。",
  "ufactory-xarm-6": "本轮新增 InternManip、DexVLA 和论文资源导航，补充 xArm 类低成本平台在多数据集策略训练、灵巧操作和评测复现方面的参考。",
  "ufactory-xarm-7": "本轮新增 InternManip 和 DexVLA，补充 xArm7 作为自研移动操作机械臂时可对接的开源训练评测入口。",
  "kinova-gen3": "本轮新增 InternManip、DexVLA 和机器人基础模型资源导航，补充 Kinova Gen3 在服务操作和跨平台策略评测中的学术对照。",
  "agilex-piper": "本轮新增 InternManip 和 DexVLA，补充 PiPER 类轻量机械臂在低成本操作学习、灵巧末端和课程评测中的来源。",
  "mycobot-280": "本轮新增 InternManip、DexVLA 和论文资源导航，补充 myCobot 类教学机械臂在低成本 VLA 课程中的参考入口。",
  "mycobot-320": "本轮新增 InternManip 和 DexVLA，补充 myCobot 320 在教学科研和灵巧操作软件生态中的对照。",
  "dobot-mg400": "本轮新增 InternManip 和机器人论文资源导航，补充 MG400 桌面机械臂在操作策略训练和评测中的通用来源。",
  "unitree-z1": "本轮新增 DexVLA 和 InternManip，补充 Z1 机械臂或四足加臂组合在灵巧操作和 VLA 评测中的来源。",
  "unitree-g1": "本轮新增 RoboBrain 2.5、WholeBodyVLA、InternHumanoid 和 Awesome LLM Robotics，补充 G1 在具身基础模型、人形全身控制和移动操作研究中的前沿入口。",
  "unitree-h1": "本轮新增 WholeBodyVLA、InternHumanoid 和机器人论文资源导航，补充 H1 类全尺寸人形在全身控制和移动操作基础模型中的对照来源。",
  "agibot-a2": "本轮新增 RoboBrain 2.5、WholeBodyVLA 和 InternHumanoid，补充智元 A2 类平台在中文具身基础模型与人形移动操作研究中的来源。",
  "agibot-x2": "本轮新增 WholeBodyVLA 项目页和 GitHub，明确其在 Agibot X2 上做端到端人形移动操作，强化 X2 作为国产人形研究平台的直接证据。",
  "fourier-gr1": "本轮新增 WholeBodyVLA、InternHumanoid 和论文资源导航，补充 GR-1 类平台在人形全身控制和 VLA 研究中的对照。",
  "fourier-gr2": "本轮新增 WholeBodyVLA 和 InternHumanoid，补充 GR-2 类高自由度人形在移动操作和全身控制研究中的横向参考。",
  "leju-kuavo": "本轮新增 InternHumanoid 和 WholeBodyVLA，补充 Kuavo 开源人形与全身控制工具链、移动操作 VLA 的对照来源。",
  "booster-t1": "本轮新增 InternHumanoid 和 Awesome LLM Robotics，补充 Booster T1 教学人形在全身控制课程和论文跟踪中的来源。",
  "engineai-pm01": "本轮新增 InternHumanoid 和人形移动操作 VLA 来源，补充 PM01 类小型人形在教学科研软件栈中的对照。",
  "robotera-star1": "本轮新增 WholeBodyVLA、InternHumanoid 和论文资源导航，补充 STAR1 类高动态人形在前沿人形控制研究中的来源。",
  "unitree-r1-air": "本轮新增 InternHumanoid 和 WholeBodyVLA，补充 R1 Air 低价人形在全身控制教学和基础模型方向的参考。",
  "unitree-r1-d": "本轮新增 InternHumanoid 和 WholeBodyVLA，补充 R1-D 双臂人形在移动操作和全身控制研究中的对照。",
  "unitree-go2": "本轮新增 RoboBrain 2.5、InternNav 和机器人论文资源导航，补充 Go2 在具身基础模型、导航基础模型和四足任务评测中的持续追踪入口。",
  "unitree-b2": "本轮新增 InternNav 和机器人论文资源导航，补充 B2 高负载四足在导航基础模型和巡检算法研究中的来源。",
  "unitree-a2": "本轮新增 InternNav 和论文资源导航，补充 A2 类新型四足在导航基础模型与高机动任务中的参考。",
  "deeprobotics-lite3": "本轮新增 InternNav 和论文资源导航，补充 Lite3 教育科研四足在通用导航和具身任务评测中的来源。",
  "deeprobotics-x30": "本轮新增 InternNav 和机器人论文资源导航，补充 X30 工业四足在复杂环境导航基础模型中的参考。",
  "deeprobotics-x20": "本轮新增 InternNav，补充 X20 行业四足在导航基础模型和落地巡检算法中的对照来源。",
  "unitree-go2-z1": "本轮新增 RoboBrain 2.5、InternManip、InternNav 和 DexVLA，补强 Go2 + Z1 在移动抓取、导航基础模型和灵巧操作 VLA 中的来源链。",
  "unitree-b2-z1": "本轮新增 InternManip、InternNav 和 DexVLA，补充 B2 + Z1 在复杂地形移动操作和巡检抓取中的算法评测来源。",
  "agilex-cobot-magic": "本轮新增 RoboBrain 2.5、InternManip、InternNav 和 DexVLA，补充 Cobot Magic 在中文具身基础模型、数据训练和双臂移动操作评测中的来源。",
  "agilex-limo-piper": "本轮新增 InternManip、InternNav 和 DexVLA，补充 LIMO + PiPER 在低成本移动操作、导航和训练评测套件中的参考。",
  "xarm-agilex-base": "本轮新增 InternManip、InternNav 和 DexVLA，补强 xArm + AgileX 自研复合平台在开源训练评测和导航基础模型中的证据。",
  "robotnik-rb-kairos": "本轮新增 InternNav 和机器人论文资源导航，补充 RB-KAIROS+ 类工业移动操作平台在通用导航模型和论文跟踪中的来源。",
  "realman-mobile-manipulator": "本轮新增 InternManip、InternNav 和 DexVLA，补充睿尔曼移动复合平台在机械臂操作、导航和 VLA 评测中的对照。",
  "hello-stretch-3": "本轮新增 RoboBrain 2.5、InternManip、InternNav 和机器人论文资源导航，补充 Stretch 在服务移动操作和具身基础模型评测中的持续追踪入口。",
  "mobile-aloha": "本轮新增 RoboBrain 2.5、InternManip、DexVLA 和论文资源导航，补充 Mobile ALOHA 类双臂平台在中文具身基础模型和操作训练套件中的来源。",
  "pal-tiago": "本轮新增 InternNav、InternManip 和机器人论文资源导航，补充 TIAGo 类服务机器人在导航基础模型与移动操作训练评测中的来源。",
  "franka-mobile-base": "本轮新增 InternManip、InternNav 和 DexVLA，补充移动 Franka 组合在机械臂操作、语义导航和移动操作 VLA 中的研究入口。",
  "hiwonder-jetauto-pro": "本轮新增 InternNav 和机器人论文资源导航，补充 JetAuto Pro 类教学复合平台在导航基础模型课程和具身任务评测中的参考。",
  "hiwonder-jetrover-arm": "本轮新增 InternNav，补充 JetRover 加臂平台在低成本导航与移动操作实验中的参考。",
  "yahboom-rosmaster-x3-arm": "本轮新增 InternNav，补充 ROSMASTER X3 加臂平台在 ROS2 教学、导航基础模型和移动操作实验中的来源。",
  "turtlebot4-arm": "本轮新增 InternNav 和机器人论文资源导航，补充 TurtleBot4 + 轻量机械臂组合在 ROS2 教学、导航和移动操作评测中的来源。"
};

const researchRound36Notes = {
  "dobot-cr5": "本轮新增 RobotLAB DOBOT CR5 Research 教育渠道价，页面显示 USD 22,980 和 RaaS 月费线索，补充 CR5 在学校科研采购中的海外渠道预算参考。",
  "unitree-z1": "本轮新增 Unitree 官方商城 Z1 商品页，补充 Z1 机械臂和四足加臂组合的官方采购渠道；页面动态价格需以配置页或正式报价为准。",
  "unitree-g1": "本轮新增 Unitree 官方商城 G1 商品页，补充 G1 人形平台的海外官方采购入口；页面价格列表不作为确定报价使用。",
  "unitree-r1-air": "本轮新增 Unitree 官方商城 R1 商品页，补充 R1 Air 低价人形平台海外官方采购渠道。",
  "unitree-r1-d": "本轮新增 Unitree 官方商城 R1 商品页，补充 R1-D 双臂人形平台海外官方采购渠道。",
  "unitree-go2": "本轮新增 Unitree 官方商城 Go2 商品页，补充 Go2 的官方商城采购入口，与中文官网价格共同核验。",
  "unitree-b2": "本轮新增 Unitree 官方商城 B2 商品页，补充 B2 行业四足平台官方采购渠道和配置询价入口。",
  "unitree-a2": "本轮新增 Unitree 官方商城 A2 商品页，补充 A2 四足平台官方采购渠道和版本配置核验入口。",
  "unitree-b2-z1": "本轮新增 Unitree B2 与 Z1 官方商城页，补充 B2 + Z1 组合采购时本体和机械臂均可从官方渠道核验。",
  "unitree-go2-z1": "本轮新增 Unitree Go2 与 Z1 官方商城页，补充 Go2 + Z1 组合的官方采购渠道和价格核验路径。",
  "agilex-limo-piper": "本轮新增 RobotsUSA 与 RobotLAB 的 AgileX LIMO ROS2 渠道价，分别显示 USD 4,995 和 USD 2,895，用于 LIMO + PiPER 自研组合预算交叉核验。",
  "xarm-agilex-base": "本轮新增 AgileX LIMO 海外教育渠道价，补充 xArm + AgileX 自研复合平台中底盘部分的预算依据。",
  "agilex-cobot-magic": "本轮新增 RobotsUSA Cobot Magic 渠道页，补充 Cobot Magic / Mobile ALOHA 类复合平台的海外采购渠道线索；完整双臂配置仍需正式询价。",
  "hiwonder-jetauto-pro": "本轮新增 Hiwonder JetAuto Pro 当前官方商品价 USD 959.99 起，并补充 Yahboom 对照价格，用于低成本教学复合平台预算核验。",
  "hiwonder-jetrover-arm": "本轮新增 Hiwonder JetRover 当前官方商品价 USD 779.99 起，补充 JetRover 加臂方案的官方价格来源。",
  "yahboom-rosmaster-x3-arm": "本轮新增 Yahboom ROSMASTER X3 和 DOFBOT 当前官方商品价，分别显示 USD 659 起和 USD 339 起，强化该组合的可追溯低成本预算依据。",
  "turtlebot4-arm": "本轮新增 Hiwonder 与 Yahboom 官方商品价作为低成本教学复合平台预算对照；TurtleBot4 + OpenMANIPULATOR 仍需以 Clearpath/ROBOTIS 或代理正式报价核验。"
};

const researchRound37Notes = {
  "franka-research-3": "本轮新增 OpenVLA-OFT、π0.5、SpatialVLA、TraceVLA、PixelVLA、LiLo-VLA、NORA 和 VLA-0 等来源，进一步补强 Franka/Panda 在 VLA 微调、长程操作和真实机器人策略评估中的科研高频地位。",
  "ur5e": "本轮新增 OpenVLA-OFT、SpatialVLA、TraceVLA、ObjectVLA、PixelVLA 和 LiLo-VLA 等 VLA/操作项目，补充 UR5e 类协作臂在开放世界物体操作和长程任务中的算法对照来源。",
  "ufactory-xarm-6": "本轮新增一批 VLA 微调、中文空间 VLA、对象操作、长程操作和轻量 VLA 来源，补充 xArm 低成本平台在学校自建数据采集与模型微调中的参考价值。",
  "ufactory-xarm-7": "本轮新增 OpenVLA-OFT、SpatialVLA、TraceVLA、PixelVLA、LiLo-VLA 和 VLA-0 等入口，补强 xArm7 在自研移动操作/VLA 评测中的证据链。",
  "kinova-gen3": "本轮新增 OpenVLA-OFT、π0.5、TraceVLA、LiLo-VLA、NORA 和 VLA-0 等来源，补充 Kinova Gen3 在高端服务操作和跨具身策略中的对照价值。",
  "agilex-piper": "本轮新增 VLA 微调、中文 VLA 和长程操作来源，补充 PiPER 类轻量机械臂作为低成本移动操作本体时的软件生态参考。",
  "unitree-z1": "本轮新增 VLA 微调、中文 VLA、TraceVLA、LiLo-VLA 和轻量 VLA 来源，补充 Z1 与四足加臂组合在抓取、巡检取放和模型微调中的研究入口。",
  "mycobot-280": "本轮新增 VLA-0、OpenVLA-OFT 和 Wall-X 等低成本/开源 VLA 来源，补充教学机械臂在入门级策略训练和课程复现中的参考。",
  "mycobot-320": "本轮新增 VLA-0、OpenVLA-OFT、TraceVLA 和 Wall-X 等来源，补充 myCobot 320 在教学科研中接入轻量 VLA 的路径。",
  "dobot-cr5": "本轮新增 OpenVLA-OFT、SpatialVLA、PixelVLA、LiLo-VLA、NORA 和 VLA-0 等来源，补充 CR5 在实训、开放物体操作和策略训练中的科研证据。",
  "dobot-mg400": "本轮新增 VLA-0 和 OpenVLA-OFT 等轻量 VLA 来源，补充 MG400 作为桌面教学机械臂时的模型微调和课程实验入口。",
  "unitree-g1": "本轮新增 π0.5、SpatialVLA、LingBot-VLA/VA、NORA、NaVILA 和 OmniVLA 等来源，补充 G1 在通用人形策略、双臂操作和语言导航中的前沿研究入口。",
  "unitree-h1": "本轮新增 π0.5、SpatialVLA、LingBot-VLA/VA、NORA、NaVILA 和 OmniVLA，补强 H1 类全尺寸平台在开放环境人形操作和导航中的横向研究证据。",
  "unitree-r1-air": "本轮新增中文 VLA、LingBot、NORA、VLA-0 和 Wall-X 等轻量模型来源，补充 R1 Air 低价人形样机在教学和数据采集中的软件对照。",
  "unitree-r1-d": "本轮新增中文 VLA、LingBot、NORA 和 VLA-0 等入口，补充 R1-D 双臂人形在入门级移动操作和策略微调中的研究参考。",
  "agibot-a2": "本轮新增 SpatialVLA、ObjectVLA、PixelVLA、LingBot、NORA 和 π0.5 等来源，补充智元 A2 类平台在中文 VLA、对象操作和双臂真实数据生态中的证据。",
  "agibot-x2": "本轮新增 SpatialVLA、ObjectVLA、PixelVLA、LingBot 和 NORA 等来源，补强 X2 作为国产低成本人形/移动操作平台的前沿模型入口。",
  "fourier-gr1": "本轮新增 π0.5、SpatialVLA、LingBot 和 NORA 等来源，补充 GR-1 在人形基础模型和双臂操作数据方向的对照证据。",
  "fourier-gr2": "本轮新增 π0.5、SpatialVLA、LingBot 和 NORA 等入口，补充 GR-2 高自由度人形在通用策略与开放环境操作中的研究参考。",
  "ubtech-walker-s1": "本轮新增中文 VLA、LingBot 和 NORA 等来源，补充 Walker S1 类落地人形在科研模型评估中的横向对照。",
  "leju-kuavo": "本轮新增 SpatialVLA、LingBot、NORA、VLA-0 和 Wall-X 等来源，补充 Kuavo 开源人形在中文 VLA 与低成本教学科研中的对照。",
  "booster-t1": "本轮新增中文 VLA、LingBot、NORA 和 VLA-0 等来源，补充 Booster T1 教学人形的软件栈与模型训练参考。",
  "engineai-pm01": "本轮新增中文 VLA、LingBot、NORA、VLA-0 和 Wall-X 等来源，补充 PM01 类小型人形作为教学科研平台的模型生态对照。",
  "robotera-star1": "本轮新增中文 VLA、LingBot、NORA 和 Wall-X 等来源，补充 STAR1 类高动态人形在通用策略和中文开源模型中的参考。",
  "noetix-bumi": "本轮新增 VLA-0 和 Wall-X 等轻量开源模型入口，补充 Bumi/N2 类小型人形在低成本教学科研中的软件对照。",
  "unitree-go2": "本轮新增 NaVILA 和 OmniVLA，补充 Go2 在视觉语言导航、跨平台导航基础模型和校园巡检任务中的研究入口。",
  "unitree-b2": "本轮新增 NaVILA 和 OmniVLA，补充 B2 高负载四足平台在语言导航和复杂场地巡检中的算法对照来源。",
  "unitree-a2": "本轮新增 NaVILA 和 OmniVLA，补充 A2 高性能四足在开放环境导航基础模型中的科研参考。",
  "deeprobotics-lite3": "本轮新增 NaVILA 和 OmniVLA，补充 Lite3 作为国产四足科研平台时在语言导航和跨平台导航中的对照来源。",
  "deeprobotics-x30": "本轮新增 NaVILA 和 OmniVLA，补充 X30 工业四足在巡检导航和开放词汇目标导航中的算法来源。",
  "unitree-go2-z1": "本轮新增 OpenVLA-OFT、π0.5、SpatialVLA、LiLo-VLA、NaVILA 和 OmniVLA，补强 Go2 + Z1 在导航-抓取一体化和开放世界移动操作中的来源链。",
  "unitree-b2-z1": "本轮新增 VLA 微调、中文 VLA、长程操作和导航基础模型来源，补充 B2 + Z1 复杂地形移动操作和巡检取放研究证据。",
  "agilex-cobot-magic": "本轮新增 OpenVLA-OFT、π0.5、SpatialVLA、PixelVLA、LingBot、LiLo-VLA、NORA 和导航基础模型来源，补强 Cobot Magic 在双臂移动操作、中文 VLA 和长程任务中的科研证据。",
  "agilex-limo-piper": "本轮新增 VLA 微调、中文 VLA、VLA-0、LiLo-VLA、NaVILA 和 OmniVLA，补充 LIMO + PiPER 低成本复合平台在课程、导航和移动操作中的来源。",
  "xarm-agilex-base": "本轮新增 OpenVLA-OFT、SpatialVLA、TraceVLA、PixelVLA、LiLo-VLA、NORA、NaVILA 和 OmniVLA，补强 xArm + AgileX 自研复合平台的数据采集、模型微调和导航评测来源。",
  "robotnik-rb-kairos": "本轮新增 NaVILA、OmniVLA、LiLo-VLA、NORA 和 VLA-0 等来源，补充 RB-KAIROS+ 类工业移动操作平台在导航和长程操作中的对照。",
  "realman-mobile-manipulator": "本轮新增中文 VLA、OpenVLA-OFT、LiLo-VLA、NORA 和导航基础模型入口，补充睿尔曼移动复合平台在国产生态和模型适配中的证据。",
  "hello-stretch-3": "本轮新增 π0.5、OpenVLA-OFT、TraceVLA、LiLo-VLA、NaVILA、OmniVLA 和 VLA-0 等来源，进一步补强 Stretch 在服务移动操作和导航策略评估中的科研常用性。",
  "mobile-aloha": "本轮新增 OpenVLA-OFT、π0.5、SpatialVLA、TraceVLA、PixelVLA、LiLo-VLA、LingBot 和 NORA，补充 Mobile ALOHA 类双臂平台在 VLA 微调和长程操作中的前沿来源。",
  "pal-tiago": "本轮新增 NaVILA、OmniVLA、LiLo-VLA、NORA 和 VLA-0，补充 TIAGo 类服务移动操作平台在导航基础模型和长程任务中的研究入口。",
  "franka-mobile-base": "本轮新增 VLA 微调、π0.5、中文 VLA、LiLo-VLA、NORA 和导航基础模型来源，补强移动 Franka 组合在服务移动操作、长程任务和策略训练中的证据链。",
  "hiwonder-jetauto-pro": "本轮新增 VLA-0、NaVILA 和 OmniVLA，补充 JetAuto Pro 类教学复合平台在低成本 VLA 和导航课程中的对照来源。",
  "hiwonder-jetrover-arm": "本轮新增 VLA-0、NaVILA 和 OmniVLA，补充 JetRover 加臂平台在低成本移动操作和导航模型课程中的参考。",
  "yahboom-rosmaster-x3-arm": "本轮新增 VLA-0、NaVILA 和 OmniVLA，补充 ROSMASTER X3 加臂平台在 ROS2 教学、轻量 VLA 和导航基础模型中的来源。",
  "turtlebot4-arm": "本轮新增 VLA-0、NaVILA 和 OmniVLA，补充 TurtleBot4 + 轻量机械臂组合在教学导航和移动操作评测中的对照来源。"
};

const researchRound38Notes = {
  "franka-research-3": "本轮新增 DexArt、AnyTeleop、ManiWAV、RoboVQA 和 OpenGalaxea/GalaxeaVLA，补充 Franka/Panda 在灵巧操作、遥操作采集、音视频接触反馈和通用 VLA 数据中的科研入口。",
  "ur5e": "本轮新增 DexArt、AnyTeleop、ManiWAV 和 RoboVQA，补充 UR5e 类协作臂在臂手遥操作、灵巧操作 Benchmark 和长程多模态推理中的研究证据。",
  "ufactory-xarm-6": "本轮新增灵巧操作、遥操作、音视频操作、RoboVQA 和 GalaxeaVLA 来源，补充 xArm 低成本平台做示教采集和 VLA 微调时的学术入口。",
  "ufactory-xarm-7": "本轮新增 DexArt、AnyTeleop、ManiWAV、RoboVQA 和 GalaxeaVLA，补强 xArm7 在灵巧手、夹爪和移动操作课题中的可复现实验来源。",
  "dobot-cr5": "本轮新增 DexArt、AnyTeleop、ManiWAV 和 RoboVQA，补充 CR5 在教学实训平台上延伸灵巧操作、音视频反馈和长程任务评测的参考。",
  "dobot-mg400": "本轮新增 ManiWAV 和 RoboVQA，补充 MG400 桌面教学机械臂在感知反馈和多模态任务理解课程中的对照来源。",
  "kinova-gen3": "本轮新增 DexArt、AnyTeleop、ManiWAV 和 RoboVQA，补充 Kinova Gen3 在服务操作、臂手遥操作和接触反馈任务中的科研证据。",
  "agilex-piper": "本轮新增 DexArt、AnyTeleop、ManiWAV 和 RoboVQA，补充 PiPER 类轻量机械臂接入遥操作采集、音视频操作和长程推理的研究参考。",
  "unitree-z1": "本轮新增灵巧操作、遥操作、ManiWAV、RoboVQA 和 Human2LocoMan，补充 Z1 与四足加臂组合在臂手控制和移动操作中的学术证据。",
  "mycobot-280": "本轮新增 ManiWAV 和 RoboVQA，补充低成本教学机械臂在多模态感知和长程推理任务中的课程对照来源。",
  "mycobot-320": "本轮新增 ManiWAV 和 RoboVQA，补充 myCobot 320 在多模态操作学习和机器人视频问答数据集中的教学科研入口。",
  "unitree-g1": "本轮新增 AnyTeleop、DexArt、GalaxeaVLA 和 RoboVQA，补充 G1 在人形遥操作、灵巧臂手、开放世界数据和长程推理中的科研证据。",
  "unitree-h1": "本轮新增 AnyTeleop、DexArt、GalaxeaVLA 和 RoboVQA，补强 H1 类全尺寸人形在臂手遥操作、VLA 数据和多模态推理任务中的对照来源。",
  "agibot-a2": "本轮新增 GalaxeaVLA、AnyTeleop、DexArt 和 RoboVQA，补充智元 A2 类平台在国产开放世界数据、灵巧操作和长程任务评测中的来源链。",
  "agibot-x2": "本轮新增 GalaxeaVLA、AnyTeleop 和 RoboVQA，补充灵犀 X2 类低成本人形在数据采集、模型训练和长程推理中的研究入口。",
  "fourier-gr1": "本轮新增 AnyTeleop、DexArt、GalaxeaVLA 和 RoboVQA，补充 GR-1 在人形操作、遥操作和开放世界数据方向的横向学术参考。",
  "fourier-gr2": "本轮新增 AnyTeleop、DexArt、GalaxeaVLA 和 RoboVQA，补充 GR-2 高自由度人形在灵巧操作和通用策略数据方向的评估来源。",
  "ubtech-walker-s1": "本轮新增 GalaxeaVLA、AnyTeleop 和 RoboVQA，补充 Walker S1 类落地人形在科研数据、遥操作和多模态推理中的对照入口。",
  "leju-kuavo": "本轮新增 AnyTeleop、GalaxeaVLA 和 RoboVQA，补充 Kuavo 开源人形在臂手遥操作、数据采集和具身推理中的来源。",
  "booster-t1": "本轮新增 AnyTeleop、GalaxeaVLA 和 RoboVQA，补充 Booster T1 教学人形平台在遥操作采集、VLA 数据和长程推理课程中的参考。",
  "engineai-pm01": "本轮新增 GalaxeaVLA 和 RoboVQA，补充 PM01 小型人形在开放世界数据和多模态推理任务中的软件生态对照。",
  "robotera-star1": "本轮新增 AnyTeleop、GalaxeaVLA 和 RoboVQA，补充 STAR1 类高动态人形在遥操作、VLA 数据和长程推理方向的研究来源。",
  "unitree-r1-air": "本轮新增 GalaxeaVLA 和 RoboVQA，补充 R1 Air 入门人形在开放世界数据和推理数据集中的教学科研参考。",
  "unitree-r1-d": "本轮新增 GalaxeaVLA 和 RoboVQA，补充 R1-D 双臂人形在数据采集和长程推理任务中的来源。",
  "unitree-go2": "本轮新增 Human2LocoMan 和 RoboVQA，补充 Go2 在四足移动操作、跨具身模仿学习和长程推理中的科研入口。",
  "unitree-b2": "本轮新增 Human2LocoMan 和 RoboVQA，补充 B2 高负载四足平台在移动操作和巡检推理任务中的研究对照。",
  "unitree-a2": "本轮新增 Human2LocoMan 和 RoboVQA，补充 A2 四足平台在开放环境移动操作和多模态推理中的来源。",
  "deeprobotics-lite3": "本轮新增 Human2LocoMan 和 RoboVQA，补充 Lite3 类国产四足平台与 Unitree/Google DeepMind 四足移动操作研究的对照入口。",
  "deeprobotics-x30": "本轮新增 Human2LocoMan 和 RoboVQA，补充 X30 工业四足在巡检移动操作和长程推理任务中的学术参考。",
  "unitree-go2-z1": "本轮新增 Human2LocoMan、DexArt、AnyTeleop、BiGym、GalaxeaVLA 和 RoboVQA，补强 Go2 + Z1 四足加臂平台在移动操作、遥操作采集和长程推理中的完整来源链。",
  "unitree-b2-z1": "本轮新增 Human2LocoMan、BiGym、GalaxeaVLA 和 RoboVQA，补充 B2 + Z1 在复杂场地移动操作和开放世界任务中的研究证据。",
  "agilex-cobot-magic": "本轮新增 BiGym、DexArt、AnyTeleop、ManiWAV、GalaxeaVLA 和 RoboVQA，补强 Cobot Magic/Mobile ALOHA 类双臂移动平台在学术 Benchmark 和数据采集中的来源。",
  "agilex-limo-piper": "本轮新增 BiGym、ManiWAV、GalaxeaVLA、Human2LocoMan 和 RoboVQA，补充 LIMO + PiPER 低成本复合平台在移动操作和多模态任务中的课程研究入口。",
  "xarm-agilex-base": "本轮新增 BiGym、DexArt、AnyTeleop、ManiWAV、GalaxeaVLA 和 RoboVQA，补强 xArm + AgileX 自研组合在双臂/单臂移动操作和数据采集方面的学术证据。",
  "robotnik-rb-kairos": "本轮新增 BiGym、GalaxeaVLA、Human2LocoMan 和 RoboVQA，补充 RB-KAIROS+ 类工业移动操作平台在开放世界任务和长程推理中的对照来源。",
  "realman-mobile-manipulator": "本轮新增 BiGym、DexArt、AnyTeleop、GalaxeaVLA 和 RoboVQA，补充睿尔曼移动复合平台在遥操作采集、灵巧操作和开放世界数据中的研究入口。",
  "hello-stretch-3": "本轮新增 BiGym、ManiWAV、GalaxeaVLA、Human2LocoMan 和 RoboVQA，进一步补强 Stretch 在家庭移动操作、感知反馈和长程推理中的科研常用性。",
  "mobile-aloha": "本轮新增 BiGym、DexArt、AnyTeleop、ManiWAV、GalaxeaVLA 和 RoboVQA，补充 Mobile ALOHA 类双臂平台在示教驱动移动操作、音视频反馈和多模态数据集中的证据。",
  "pal-tiago": "本轮新增 BiGym、GalaxeaVLA、Human2LocoMan 和 RoboVQA，补充 TIAGo 类服务移动操作平台在家庭任务、开放世界数据和长程推理中的学术入口。",
  "franka-mobile-base": "本轮新增 BiGym、DexArt、AnyTeleop、ManiWAV、GalaxeaVLA 和 RoboVQA，补强移动 Franka 组合在高端移动操作、灵巧操作和多模态推理中的研究证据。",
  "hiwonder-jetauto-pro": "本轮新增 BiGym 和 RoboVQA，补充 JetAuto Pro 类教学复合平台在移动操作 Benchmark 和机器人推理课程中的对照来源。",
  "hiwonder-jetrover-arm": "本轮新增 BiGym 和 RoboVQA，补充 JetRover 加臂平台在教学移动操作和多模态任务理解中的来源。",
  "yahboom-rosmaster-x3-arm": "本轮新增 BiGym 和 RoboVQA，补充 ROSMASTER X3 加臂平台在低成本移动操作课程和长程推理数据中的参考。",
  "turtlebot4-arm": "本轮新增 BiGym 和 RoboVQA，补充 TurtleBot4 + 机械臂组合在移动操作 Benchmark 和具身问答任务中的教学科研入口。"
};

const researchRound39Notes = {
  "franka-research-3": "本轮新增 RoboInter、RoboVLMs 和 Open-TeleVision，补充高端机械臂在中间表示、VLA 和遥操作数据采集中的来源。",
  "ur5e": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision 和大连理工宁波研究院 UR7e 采购检索入口，补充 UR 类协作臂的学术与中文采购追踪来源。",
  "ufactory-xarm-6": "本轮新增 RoboInter、RoboVLMs 和 Open-TeleVision，补充 xArm 类低成本机械臂在操作中间表示和遥操作数据采集中的研究入口。",
  "ufactory-xarm-7": "本轮新增 RoboInter、RoboVLMs 和 Open-TeleVision，补充 xArm7 在 VLA、VQA 和示教采集工具链中的学术来源。",
  "dobot-cr5": "本轮新增 RoboInter、RoboVLMs 和 Open-TeleVision，补充 DOBOT 协作臂在教学科研中接入通用操作模型和遥操作采集的参考。",
  "kinova-gen3": "本轮新增 RoboInter、RoboVLMs 和 Open-TeleVision，补充 Kinova Gen3 在服务操作和 VLA 研究中的数据与工具入口。",
  "agilex-piper": "本轮新增 RoboInter、RoboVLMs 和 Open-TeleVision，补充 PiPER 类轻量机械臂在低成本移动操作和遥操作采集中的学术证据。",
  "unitree-z1": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision 和中文复合平台采购检索入口，补充 Z1 及四足加臂方案的操作模型和采购追踪来源。",
  "unitree-g1": "本轮新增 RoboVLMs、Open-TeleVision、Isaac-GR00T、Humanoid-Gym，以及深圳大学/上海科技大学/浙大城市学院等中文采购检索入口，补充 G1 类人形的科研和采购追踪证据。",
  "unitree-h1": "本轮新增 RoboVLMs、Open-TeleVision、Isaac-GR00T、Humanoid-Gym 和中国移动人形采购检索入口，补充 H1 类全尺寸人形的基础模型、控制训练和采购趋势来源。",
  "agibot-a2": "本轮新增 RoboVLMs、Open-TeleVision、Isaac-GR00T 和中文采购检索入口，补充智元 A2 类平台在人形基础模型和行业采购趋势中的对照。",
  "agibot-x2": "本轮新增 RoboVLMs、Open-TeleVision、Isaac-GR00T 和中文采购检索入口，补充灵犀 X2 类低成本人形的研究与采购追踪来源。",
  "fourier-gr1": "本轮新增 RoboVLMs、Open-TeleVision、Isaac-GR00T、Humanoid-Gym 和中文采购检索入口，补充 GR-1 类人形在基础模型、遥操作和高校采购中的对照来源。",
  "fourier-gr2": "本轮新增 RoboVLMs、Open-TeleVision、Isaac-GR00T、Humanoid-Gym 和中文采购检索入口，补充 GR-2 类高自由度人形的训练工具和采购追踪来源。",
  "ubtech-walker-s1": "本轮新增 RoboVLMs、Open-TeleVision、Isaac-GR00T 和中文采购检索入口，补充 Walker S1 类落地人形在基础模型和行业采购中的对照。",
  "leju-kuavo": "本轮新增 RoboVLMs、Open-TeleVision、Isaac-GR00T 和中文采购检索入口，补充 Kuavo 开源人形在通用策略和高校采购追踪中的来源。",
  "booster-t1": "本轮新增 RoboVLMs、Open-TeleVision、Isaac-GR00T、Humanoid-Gym 和中文采购检索入口，补充 Booster T1 教学人形的基础模型和采购证据链。",
  "engineai-pm01": "本轮新增 RoboVLMs、Isaac-GR00T、Humanoid-Gym 和中文采购检索入口，补充 PM01 小型人形在训练框架和采购追踪中的对照。",
  "robotera-star1": "本轮新增 RoboVLMs、Open-TeleVision、Isaac-GR00T、Humanoid-Gym 和中文采购检索入口，补充 STAR1 类人形在 RobotEra 生态和基础模型训练中的证据。",
  "unitree-r1-air": "本轮新增中文人形采购检索入口，补充 R1 Air 入门人形的高校采购线索追踪。",
  "unitree-r1-d": "本轮新增中文人形采购检索入口，补充 R1-D 双臂人形的高校采购线索追踪。",
  "unitree-go2": "本轮新增深圳大学、浙大城市学院等四足机器人采购检索入口，补充 Go2 EDU/移动抓取四足方案的中文采购追踪来源。",
  "unitree-b2": "本轮新增四足机器人采购检索入口，补充 B2 类平台在高校巡检、移动抓取和行业应用中的采购线索。",
  "unitree-a2": "本轮新增四足机器人采购检索入口，补充 A2 类平台在学校和行业项目中的采购跟踪来源。",
  "deeprobotics-lite3": "本轮新增四足机器人采购检索入口，补充 Lite3 类国产教学四足平台的采购追踪来源。",
  "deeprobotics-x30": "本轮新增四足机器人采购检索入口，补充 X30 类工业四足平台的高校/行业采购线索。",
  "limx-tron1": "本轮新增四足机器人采购检索入口，补充 LimX TRON1 类轮足/四足平台的中文采购跟踪来源。",
  "unitree-go2-z1": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision 和四足/复合平台采购检索入口，补强 Go2 + Z1 的学术工具链和采购线索。",
  "unitree-b2-z1": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision 和四足/复合平台采购检索入口，补充 B2 + Z1 在复杂场地移动操作中的来源。",
  "agilex-cobot-magic": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision、同济 Cobot Magic 检索和上海工程技术大学交互机器人平台检索入口，补充双臂移动操作平台的研究和采购追踪。",
  "agilex-limo-piper": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision 和复合平台采购检索入口，补充 LIMO + PiPER 低成本方案的学术与采购线索。",
  "xarm-agilex-base": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision、大连理工 UR7e 和复合平台采购检索入口，补充 xArm/UR + 底盘自研方案的采购对照。",
  "robotnik-rb-kairos": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision 和复合平台采购检索入口，补充 RB-KAIROS+ 类工业移动操作平台的研究与采购来源。",
  "realman-mobile-manipulator": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision 和 DUAL-DOF7 采购检索入口，补充睿尔曼/双臂复合机器人在高校采购中的对照。",
  "hello-stretch-3": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision 和复合平台采购检索入口，补充 Stretch 类服务移动操作平台的 VLA 与采购追踪来源。",
  "mobile-aloha": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision、同济 Cobot Magic 和复合平台采购检索入口，补充 Mobile ALOHA 类双臂移动平台的研究与采购证据。",
  "pal-tiago": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision 和复合平台采购检索入口，补充 TIAGo 类服务移动操作平台的学术和采购追踪来源。",
  "franka-mobile-base": "本轮新增 RoboInter、RoboVLMs、Open-TeleVision、大连理工 UR7e 和复合平台采购检索入口，补充移动 Franka/UR 类高端复合平台的采购对照。"
};

const researchRound40Notes = {
  "ur5e": "本轮新增大连理工宁波研究院 UR7e 机械臂采购结果入口，将上一轮低置信检索线索补强为学校采购结果来源。",
  "franka-research-3": "本轮新增 UR7e 机械臂学校采购结果作为进口高端协作臂预算对照，补充 Franka/UR 类采购横向参考。",
  "xarm-agilex-base": "本轮新增 UR7e 机械臂、智能夹持及移动机器人和 DUAL-DOF7 等采购公告入口，补强自研移动复合平台的预算与配置参照。",
  "franka-mobile-base": "本轮新增 UR7e 机械臂和移动复合机器人采购公告入口，补充移动 Franka/UR 类高端复合方案的高校采购对照。",
  "unitree-g1": "本轮新增深圳大学 G1 EDU、上海科技大学便捷人形机器人、浙大城市学院和上海工程技术大学等学校公告入口，补强 G1 类中型/教学人形采购证据。",
  "unitree-h1": "本轮新增上海科技大学全尺寸人形机器人和多所高校人形采购公告入口，补充 H1 类全尺寸人形采购核验来源。",
  "agibot-a2": "本轮新增上海科技大学全尺寸人形机器人、浙大城市学院和上海工程技术大学等公告入口，补充智元 A2 类平台采购对照。",
  "agibot-x2": "本轮新增中型人形和具身智能交互机器人平台公告入口，补充 X2 类低成本人形采购线索。",
  "fourier-gr1": "本轮新增全尺寸/中型人形和具身智能交互机器人采购公告入口，补充 GR-1 类平台高校采购对照。",
  "fourier-gr2": "本轮新增全尺寸人形和具身智能交互机器人采购公告入口，补充 GR-2 类高自由度平台采购核验来源。",
  "ubtech-walker-s1": "本轮新增全尺寸人形和交互机器人平台采购公告入口，补充 Walker S1 类落地人形采购对照。",
  "leju-kuavo": "本轮新增中型人形和交互机器人平台公告入口，补充 Kuavo 开源人形采购线索。",
  "booster-t1": "本轮新增中型人形和交互机器人平台采购公告入口，补充 Booster T1 教学人形采购核验来源。",
  "engineai-pm01": "本轮新增中型/便捷人形采购公告入口，补充 PM01 小型人形学校采购线索。",
  "robotera-star1": "本轮新增中型人形、全尺寸人形和交互机器人采购公告入口，补充 STAR1 类高动态人形采购对照。",
  "unitree-r1-air": "本轮新增上海科技大学便捷人形机器人和浙大城市学院人形采购公告入口，补充入门人形采购线索。",
  "unitree-r1-d": "本轮新增便捷人形和中型人形采购公告入口，补充 R1-D 双臂入门人形采购核验来源。",
  "unitree-go2": "本轮新增大连理工宁波研究院 Go2、深圳大学 Go2 EDU U3 和浙大城市学院四足采购公告入口，补强 Go2 EDU/巡检/移动抓取采购来源。",
  "unitree-b2": "本轮新增浙大城市学院巡检四足和移动抓取四足公告入口，补充 B2 类高负载四足采购对照。",
  "unitree-a2": "本轮新增浙大城市学院四足机器人采购公告入口，补充 A2 类高性能四足采购线索。",
  "unitree-go1": "本轮新增 Go2/四足采购公告入口，补充 Go1 存量平台与新一代 Go2 教学采购对照。",
  "deeprobotics-lite3": "本轮新增深圳大学和浙大城市学院四足采购公告入口，补充 Lite3 类教学四足采购对照。",
  "deeprobotics-x30": "本轮新增浙大城市学院巡检四足采购公告入口，补充 X30 工业四足采购线索。",
  "limx-tron1": "本轮新增四足/轮足采购公告入口，补充 TRON1 类平台采购对照。",
  "unitree-go2-z1": "本轮新增 Go2 EDU、移动抓取四足、智能夹持及移动机器人和 DUAL-DOF7 公告入口，补强四足加臂形态的采购证据。",
  "unitree-b2-z1": "本轮新增移动抓取四足和智能夹持及移动机器人公告入口，补充 B2 + Z1 类高负载复合平台采购对照。",
  "agilex-cobot-magic": "本轮新增智能夹持及移动机器人、浙大城市学院移动抓取四足、北京物资学院 DUAL-DOF7 和上海工程技术大学平台公告入口，补强双臂/复合平台采购案例。",
  "agilex-limo-piper": "本轮新增智能夹持及移动机器人和 DUAL-DOF7 等公告入口，补充低成本移动操作组合采购对照。",
  "robotnik-rb-kairos": "本轮新增智能夹持及移动机器人和交互机器人平台公告入口，补充工业移动操作平台采购对照。",
  "realman-mobile-manipulator": "本轮新增 DUAL-DOF7、智能夹持及移动机器人和交互机器人平台公告入口，补充睿尔曼/双臂复合平台采购核验来源。",
  "hello-stretch-3": "本轮新增移动复合平台和交互机器人公告入口，补充 Stretch 类服务移动操作平台采购对照。",
  "mobile-aloha": "本轮新增智能夹持及移动机器人、DUAL-DOF7 和交互机器人平台公告入口，补充 Mobile ALOHA 类双臂移动操作采购证据。",
  "pal-tiago": "本轮新增移动复合平台和交互机器人公告入口，补充 TIAGo 类服务移动操作平台采购对照。"
};

const researchRound41Notes = {
  "booster-t1": "本轮新增 Booster 官方开源页，补强 T1/K1 手册、SDK、ROS2 SDK、训练部署工具和模型资产来源。",
  "engineai-pm01": "本轮新增众擎 PM01 中文官方产品页和 EngineAI humanoid GitHub，补强 PM01 官方规格、购买入口、仿真与部署代码来源。",
  "robotera-star1": "本轮新增 RobotEra STAR1 官方产品页和官方开源页，补充 STAR1 产品定位、软硬件全栈能力、VLA/SDK 和数据采集训练推理工作流来源。",
  "limx-tron1": "本轮新增 LimX TRON1 中文官方产品页、Isaac Lab 训练仓库、机器人描述仓库和低层 SDK，补强 TRON1 的官方规格、RL 训练和低层控制证据。",
  "xiaomi-cyberdog2": "本轮新增小米 CyberDog ROS2、workspace 和 simulation 仓库，补充 CyberDog/CyberDog2 类消费级四足在 ROS2、源码组织和仿真复现上的官方开源证据。",
  "realman-rm65": "本轮新增睿尔曼开发者中心、ROS/ROS2 仓库和硬件准备入门指南，补强 RM65 机械臂的官方文档、部署和二次开发来源。",
  "realman-mobile-manipulator": "本轮新增睿尔曼开发者中心、ROS/ROS2 仓库和硬件准备入门指南，补强睿尔曼移动复合平台的官方文档、部署和开发来源。",
  "robotnik-rb-kairos": "本轮新增 Robotnik RB-KAIROS+ 官方产品页、rbkairos_common 和 rbkairos_sim 仓库，补强 RB-KAIROS+ 的官方产品、ROS 包和仿真来源。",
  "franka-mobile-base": "本轮新增 Robotnik RB-KAIROS+ 官方产品页和 ROS/仿真仓库，补充 Franka/UR 类机械臂搭配工业移动底盘时的产品与仿真参考。",
  "xarm-agilex-base": "本轮新增 Robotnik RB-KAIROS+ 官方产品页和 ROS/仿真仓库，补充 xArm/UR + 移动底盘自研组合的工业移动操作对照来源。",
  "agilex-cobot-magic": "本轮新增睿尔曼和 Robotnik 官方开发/产品来源，用于对照 Cobot Magic 与其他移动复合机器人在 ROS2、移动底盘和双臂集成上的工程资料。",
  "agilex-limo-piper": "本轮新增睿尔曼和 Robotnik 官方开发/产品来源，补充 LIMO + PiPER 自研组合的移动操作平台工程对照。",
  "unitree-go2": "本轮新增小米 CyberDog 官方开源仓库作为消费级/教育四足 ROS2 与仿真生态对照。",
  "unitree-b2": "本轮新增 LimX TRON1 官方规格、训练仓库、模型描述和低层 SDK，补充高性能足式平台的官方开发资料对照。",
  "unitree-a2": "本轮新增 LimX TRON1 官方规格、训练仓库、模型描述和低层 SDK，补充 A2 类高性能四足与轮足/双足平台的开发生态对照。",
  "unitree-go2-z1": "本轮新增 LimX 官方开发资料和睿尔曼 ROS/ROS2 文档，补充四足加臂平台在低层控制、模型描述和机械臂集成上的官方对照。",
  "unitree-b2-z1": "本轮新增 LimX 官方开发资料和睿尔曼 ROS/ROS2 文档，补充高负载四足加臂平台在底层控制和机械臂集成方面的来源。",
  "fourier-gr1": "本轮新增 Booster 官方开源页和 RobotEra 官方产品/开源页，补充 GR-1 类人形平台横向比较时的官方 SDK、模型和开源资料参照。",
  "fourier-gr2": "本轮新增 Booster 官方开源页和 RobotEra 官方产品/开源页，补充 GR-2 类高自由度人形平台在基础模型和开源开发资料上的对照。",
  "unitree-g1": "本轮新增 Booster、RobotEra 和 EngineAI 官方开发/开源资料，补充 G1 类中型人形在 SDK、ROS2、训练部署和模型资产上的横向比较来源。",
  "unitree-h1": "本轮新增 RobotEra 和 EngineAI 官方开发/开源资料，补充 H1 类全尺寸人形在基础模型、开源代码和训练部署方面的对照来源。"
};

const researchRound42Notes = {
  "franka-research-3": "本轮新增 ALOHA Unleashed、DEXOP、FlexiTac 和 Stanford REAL Lab，补充双臂操作、灵巧操作、触觉传感和机器人学习入口。",
  "ur5e": "本轮新增 ALOHA Unleashed、DEXOP、FlexiTac 和通用机器人实验室入口，补充 UR 类协作臂在双臂操作和触觉操作研究中的对照来源。",
  "ufactory-xarm-7": "本轮新增 XLeRobot、YOR、ALOHA Unleashed、DEXOP 和 FlexiTac，补充 xArm 在低成本移动操作、双臂操作和灵巧操作中的科研入口。",
  "agilex-piper": "本轮新增 XLeRobot、YOR 和国内高校实验室入口，补充 PiPER 类低成本机械臂作为教学与自研移动操作平台的研究线索。",
  "mycobot-320": "本轮新增 XLeRobot、YOR 和通用机器人实验室入口，补充 MyCobot 类教学机械臂在课程、自研硬件和低成本数据采集中的对照来源。",
  "unitree-g1": "本轮新增 CMU LeCAR、Humanoids@CMU、CMU Intelligent Control Lab、哈工大和北大实验室入口，补充 G1 在高校人形和腿足控制研究中的追踪入口。",
  "unitree-h1": "本轮新增 CMU LeCAR、Humanoids@CMU 和 CMU Intelligent Control Lab，补充 H1 类全尺寸人形平台在高校控制和运动学习研究中的入口。",
  "fourier-gr2": "本轮新增 CMU/哈工大/北大等实验室入口，补充 GR-2 类高自由度人形平台横向评估时的学术跟踪来源。",
  "unitree-go2": "本轮新增 CMU LeCAR、Humanoids@CMU 和通用机器人实验室入口，补充 Go2 类四足平台在腿足控制、导航和移动操作研究中的来源。",
  "unitree-b2": "本轮新增 CMU LeCAR 和 Humanoids@CMU，补充 B2 类高性能四足平台在腿足运动、负载和移动操作研究中的对照入口。",
  "limx-tron1": "本轮新增 CMU LeCAR、哈工大和北大实验室入口，补充 TRON1 类双足/人形训练平台的学术追踪来源。",
  "mobile-aloha": "本轮新增 ALOHA Unleashed、XLeRobot、YOR、DEXOP、FlexiTac、Stanford REAL Lab 和通用机器人实验室入口，补强双臂移动操作和低成本复现实验链路。",
  "agilex-cobot-magic": "本轮新增 ALOHA Unleashed、XLeRobot、YOR、DEXOP、FlexiTac 和国内高校实验室入口，补强双臂复合平台在科研复现和教学数据采集中的来源。",
  "hello-stretch-3": "本轮新增 XLeRobot、YOR、Stanford REAL Lab、北大和 Duke General Robotics Lab，补充 Stretch 类移动操作平台在低成本自研与通用机器人研究中的对照入口。",
  "robotnik-rb-kairos": "本轮新增 Stanford REAL Lab、北大、Duke General Robotics Lab、DEXOP 和 FlexiTac，补充工业移动操作平台在学术研究和触觉/灵巧操作扩展上的参考入口。",
  "unitree-go2-z1": "本轮新增 CMU LeCAR、XLeRobot、YOR、DEXOP 和 FlexiTac，补充四足加臂平台在腿足移动操作、遥操作和末端感知研究中的来源。",
  "unitree-b2-z1": "本轮新增 CMU LeCAR、Humanoids@CMU、DEXOP 和 FlexiTac，补充高负载四足加臂平台在移动操作与末端灵巧扩展中的科研来源。"
};

const researchRound43Notes = {
  "franka-research-3": "本轮新增 OpenAlex、DBLP、SpringerLink、ROS2 控制、RoboStack、GitHub 主题和 MIT/CMU/Stanford/BAIR 入口，补充 Franka/Panda 的长期论文、软件和实验室追踪路径。",
  "ur5e": "本轮新增学术数据库、ROS2 控制、地方政府采购、1688/Alibaba 和 RobotLAB 等入口，补强 UR 类协作臂的论文检索、开发栈和采购渠道地图。",
  "ufactory-xarm-7": "本轮新增学术数据库、ROS2/MoveIt 实时控制、GitHub 操作主题和工业电商入口，补充 xArm 自研/教学/复合平台的持续扩源路径。",
  "dobot-cr5": "本轮新增学术数据库、地方政府采购平台、竞采星、1688/Alibaba 和 RobotLAB 入口，补充 CR5 在学校实训平台采购中的渠道和公告追踪。",
  "unitree-g1": "本轮新增学术数据库、GitHub humanoid-locomotion、MIT/CMU/Stanford/BAIR 和地方采购平台入口，补强 G1 的论文、开源训练和学校采购追踪来源。",
  "unitree-h1": "本轮新增学术数据库、人形开源主题、国际高校研究入口和地方采购平台，补充 H1 类全尺寸人形的科研热度与高校采购趋势追踪。",
  "fourier-gr1": "本轮新增学术数据库、人形开源主题、MIT/CMU/Stanford/BAIR 和地方采购平台入口，补充 GR 系列的人形研究与采购对照来源。",
  "agibot-a2": "本轮新增学术数据库、地方采购平台和高校研究入口，补充智元 A2 类国产人形进入学校科研平台时的论文和采购跟踪路径。",
  "unitree-go2": "本轮新增学术数据库、GitHub legged-locomotion、MIT/CMU/Stanford/BAIR、1688/Alibaba 和地方采购平台入口，补强 Go2 类四足的论文、开源和采购来源地图。",
  "unitree-b2": "本轮新增学术数据库、腿足开源主题、地方采购平台和跨境/工业渠道入口，补充 B2 类高负载四足的采购和研究追踪。",
  "deeprobotics-x30": "本轮新增学术数据库、腿足开源主题和地方采购平台，补充 X30 类工业四足在高校/政府采购与科研论文中的持续检索入口。",
  "limx-tron1": "本轮新增学术数据库、humanoid/legged GitHub 主题和 MIT/CMU/Stanford/BAIR 研究入口，补充 TRON1 类双足平台的开源生态追踪。",
  "mobile-aloha": "本轮新增学术数据库、ROS2 控制、mobile/dexterous/VLA GitHub 主题、MIT/CMU/Stanford/BAIR 和工业渠道入口，补强双臂移动操作平台的信息源地图。",
  "agilex-cobot-magic": "本轮新增学术数据库、ROS2 控制、移动操作 GitHub 主题、地方采购平台、1688/Alibaba 和 RobotLAB 入口，补充 Cobot Magic 的学术、开源、采购和渠道追踪。",
  "agilex-limo-piper": "本轮新增 ROS2 控制、移动操作 GitHub 主题、1688/Alibaba、RobotLAB、竞采星和地方采购平台入口，补充 LIMO + PiPER 低成本复合方案的采购与开源来源。",
  "hello-stretch-3": "本轮新增学术数据库、ROS2 控制、移动操作/VLA GitHub 主题、MIT/CMU/Stanford/BAIR 和 Robohub 入口，强化 Stretch 类服务移动操作平台的长期研究追踪。",
  "pal-tiago": "本轮新增学术数据库、ROS2 控制和国际高校研究入口，补充 TIAGo 类服务移动操作平台在论文、ROS 开发和实验室项目中的追踪来源。",
  "robotnik-rb-kairos": "本轮新增 ROS2 控制、移动操作/仿真 GitHub 主题、地方采购平台和工业渠道入口，补充 RB-KAIROS+ 的开发栈和采购来源地图。",
  "realman-mobile-manipulator": "本轮新增 ROS2 控制、移动操作 GitHub 主题、地方采购平台和 1688/Alibaba 渠道入口，补充睿尔曼复合平台的国内采购与开源生态追踪。",
  "unitree-go2-z1": "本轮新增学术数据库、ROS2 控制、移动操作/灵巧操作/腿足 GitHub 主题和工业渠道入口，补强 Go2 + Z1 四足加臂方案的综合来源。",
  "xarm-agilex-base": "本轮新增学术数据库、ROS2 控制、移动操作 GitHub 主题、地方采购平台和工业电商入口，补强 xArm + AgileX 自研移动操作组合的信息来源。",
  "franka-mobile-base": "本轮新增学术数据库、ROS2 控制、移动操作 GitHub 主题和国际高校研究入口，补充移动 Franka/UR 高端组合的论文与软件来源。",
  "hiwonder-jetauto-pro": "本轮新增 ROS2 控制、RoboStack、1688/Alibaba、RobotLAB 和地方采购平台，补充教学复合平台在课程采购和开源软件环境中的来源。",
  "turtlebot4-arm": "本轮新增 ROS2 控制、RoboStack、机器人仿真 GitHub 主题和国际高校研究入口，补充 TurtleBot4 + 机械臂教学组合的软件与课程来源。"
};

const researchRound44Notes = {
  "franka-research-3": "本轮新增国家知识产权局、国家标准化、CNAS/CQC、ModelScope、Gitee 和国际课程入口，补充高端科研机械臂在知识产权、标准认证、中文模型数据和课程建设上的来源地图。",
  "ur5e": "本轮新增知识产权、标准认证、中文开源和 A3 Robotics/IFR 等行业入口，补充 UR 类协作臂在工业自动化生态和合规采购中的追踪来源。",
  "ufactory-xarm-7": "本轮新增标准认证、ModelScope、Gitee/开源中国、B站和中文课程平台，补充 xArm 类国产低成本平台在中文科研教学中的资料来源。",
  "dobot-cr5": "本轮新增标准认证、中文课程平台和 A3 Robotics/IFR，补充 CR5 实训平台的课程、认证和行业自动化来源。",
  "mycobot-280": "本轮新增中国大学 MOOC、学堂在线、B站、Gitee 和公众科普入口，补充低成本教学机械臂的课程和展示资料来源。",
  "unitree-g1": "本轮新增知识产权、标准认证、ModelScope、Gitee、中文课程和行业协会入口，补充 G1 类人形平台从科研到教学落地的来源地图。",
  "unitree-h1": "本轮新增知识产权、标准认证、ModelScope、IFR/A3 和国际课程入口，补强 H1 类全尺寸人形的合规、产业和课程来源。",
  "agibot-a2": "本轮新增知识产权、ModelScope 和中文课程入口，补充智元 A2 类国产人形在中文数据模型和学校课程建设中的追踪来源。",
  "leju-kuavo": "本轮新增 Gitee/开源中国、中文课程和 ModelScope 入口，补充 Kuavo 开源人形在国内教学科研环境中的资料来源。",
  "unitree-go2": "本轮新增知识产权、标准认证、Gitee/B站/课程和服务机器人行业入口，补充 Go2 类四足在校园教学、巡检和公开展示中的来源链。",
  "unitree-b2": "本轮新增知识产权、标准认证和 A3/IFR 行业入口，补充 B2 类高负载四足的合规和行业应用信息来源。",
  "deeprobotics-x30": "本轮新增知识产权、标准认证和行业协会入口，补充 X30 类工业四足在巡检和行业落地中的合规来源。",
  "limx-tron1": "本轮新增知识产权、Gitee/开源中国和国际课程入口，补充 TRON1 类双足/人形科研平台的课程与开源追踪来源。",
  "mobile-aloha": "本轮新增 ModelScope、Gitee/开源中国、B站、中国大学 MOOC、学堂在线和国际课程入口，补充 Mobile ALOHA 类平台的中文教学和数据模型来源。",
  "agilex-cobot-magic": "本轮新增知识产权、标准认证、ModelScope、中文开源、课程和行业协会入口，补充 Cobot Magic 类复合平台的合规、教学和行业来源。",
  "agilex-limo-piper": "本轮新增 Gitee/开源中国、中文课程和 ModelScope 入口，补充 LIMO + PiPER 低成本复合平台在国内教学科研环境中的持续扩源路径。",
  "hello-stretch-3": "本轮新增 ModelScope、中文课程、国际课程和服务机器人行业入口，补充 Stretch 类服务移动操作平台的课程、数据和行业参考。",
  "pal-tiago": "本轮新增标准认证、国际课程和服务机器人行业入口，补充 TIAGo 类服务移动操作平台的合规与课程来源。",
  "robotnik-rb-kairos": "本轮新增标准认证、A3/IFR 和国际课程入口，补充 RB-KAIROS+ 类工业移动操作平台的合规、行业和课程来源。",
  "realman-mobile-manipulator": "本轮新增知识产权、标准认证、Gitee/开源中国和中文课程入口，补充睿尔曼复合平台的国内开源教学和合规来源。",
  "unitree-go2-z1": "本轮新增知识产权、标准认证、ModelScope、Gitee 和中文课程入口，补强 Go2 + Z1 四足加臂平台的合规、数据和教学来源。",
  "xarm-agilex-base": "本轮新增知识产权、标准认证、ModelScope、Gitee 和中文课程入口，补充 xArm + AgileX 自研移动操作组合的中文资料和合规来源。",
  "franka-mobile-base": "本轮新增知识产权、标准认证、ModelScope、国际课程和行业协会入口，补充移动 Franka/UR 类高端复合平台的合规与课程来源。",
  "hiwonder-jetauto-pro": "本轮新增中文课程、Gitee/开源中国和中国数字科技馆入口，补充 JetAuto Pro 类教学复合平台的课程和展示资料来源。",
  "turtlebot4-arm": "本轮新增中文课程、Gitee/开源中国和国际课程入口，补充 TurtleBot4 + 机械臂组合的 ROS2 教学和公开课程来源。"
};

const researchRound45Notes = {
  "franka-research-3": "本轮新增 IEEE/Nature/OpenReview/PMLR/CVF/arXiv、中国科技论文在线、哈工大/清华/上交/北大/密歇根/UW/Berkeley 等科研入口，以及 DexYCB、GenSim2、BridgeData、Language Table、VIMA、CLIPort、robomimic、MimicGen、UMI 等项目，进一步强化 Franka/Panda 在操作、抓取、遥操作和 VLA 研究中的高频来源链。",
  "ur5e": "本轮新增学术数据库、会议论文集和机器人学习项目入口，补充 UR 类协作臂在桌面操作、语言条件操作、大规模训练和工业研究中的长期检索路径。",
  "ufactory-xarm-6": "本轮新增 IEEE/arXiv、中文开放论文、EPIC/LL4MA 等实验室和 Language Table/VIMA/CLIPort/UMI 等项目，补充 xArm 类低成本科研机械臂的论文与代码入口。",
  "ufactory-xarm-7": "本轮新增学术数据库、实验室入口、BridgeData、GenSim2、robomimic、MimicGen 和遥操作工具链，补强 xArm7 在移动操作和数据采集研究中的来源。",
  "dobot-cr5": "本轮新增语言条件操作、VIMA、CLIPort 和 Isaac Lab 等入口，补充 DOBOT 类教学协作臂可复用的公开 Benchmark 和课程实验来源。",
  "kinova-gen3": "本轮新增 DexYCB、robomimic、MimicGen、UMI 和多所高校机器人实验室入口，补充 Kinova Gen3 在服务操作、抓取和遥操作研究中的对照来源。",
  "unitree-z1": "本轮新增机器人操作、四足控制、Isaac Lab 和大规模数据生成入口，补充 Z1 机械臂及四足加臂组合的移动操作研究链路。",
  "agilex-piper": "本轮新增 BridgeData、Language Table、VIMA、CLIPort、UMI、GenSim2 和 Isaac Lab，补充 PiPER 类低成本机械臂接入操作学习、遥操作和仿真训练的来源。",
  "mycobot-280": "本轮新增中国科技论文在线、Language Table、VIMA、CLIPort 和 robomimic，补充低成本教学机械臂可引用的公开课程与模仿学习入口。",
  "mycobot-320": "本轮新增中文开放论文、语言条件操作、VIMA、CLIPort 和 robomimic，补充 myCobot 作为教学科研平台的可复现实验来源。",
  "unitree-g1": "本轮新增 IEEE/OpenReview/PMLR/CVF/arXiv、多所高校机器人实验室、Isaac Lab、RT/大规模机器人学习和移动操作项目入口，补强 G1 在人形运动、操作、导航和基础模型研究中的持续扩源路径。",
  "unitree-h1": "本轮新增学术数据库、会议论文集、机器人实验室和 Isaac Lab 入口，补充 H1 类全尺寸人形在运动控制、仿真训练和具身基础模型方向的研究来源。",
  "agibot-a2": "本轮新增 OpenReview/CVF/arXiv、清华 AIR、Tensor2Robot、Robotics Transformer、Isaac Lab 和移动操作项目入口，补充智元 A2 类平台在国产具身模型与人形移动操作中的对照来源。",
  "agibot-x2": "本轮新增学术数据库、清华 AIR、Isaac Lab、RT/大规模机器人学习和移动操作项目入口，补充 X2 类低成本人形在学校课程和研究复现中的信息源。",
  "fourier-gr1": "本轮新增 IEEE/OpenReview/PMLR、Michigan Robotics 和 Isaac Lab 等入口，补充 GR-1 与 Unitree/Agibot 人形平台的学术对照路径。",
  "fourier-gr2": "本轮新增学术数据库、会议论文集、Michigan Robotics 和 Isaac Lab，补充 GR-2 高自由度平台在全身控制和人形操作研究中的来源。",
  "leju-kuavo": "本轮新增中文开放论文、OpenReview、Isaac Lab 和机器人基础模型代码入口，补充 Kuavo 开源人形的教学科研资料链。",
  "booster-t1": "本轮新增中文开放论文、OpenReview、PMLR/CVF 和 Isaac Lab，补充 Booster T1 作为教学人形平台时的课程与论文入口。",
  "robotera-star1": "本轮新增 IEEE/OpenReview/CVF/arXiv 和 Isaac Lab 仓库入口，补充 STAR1 类高动态人形在训练代码和学术对照上的来源。",
  "unitree-go2": "本轮新增学术数据库、Michigan/UW/Berkeley 等实验室、Isaac Lab、移动操作和机器人基础模型入口，补强 Go2 在四足控制、语义导航和四足加臂研究中的来源。",
  "unitree-b2": "本轮新增 IEEE/OpenReview/arXiv、哈工大/密歇根机器人研究入口和 Isaac Lab，补充 B2/A2 高负载四足在科研与巡检算法中的对照来源。",
  "unitree-a2": "本轮新增学术数据库、哈工大/密歇根研究入口和 Isaac Lab，补充 A2 类四足在高动态运动和场景巡检算法中的长期追踪路径。",
  "deeprobotics-lite3": "本轮新增 IEEE/OpenReview/arXiv、哈工大/密歇根和 Isaac Lab 入口，补充 Lite3 教学科研四足与 Unitree/ANYmal 生态的学术对照。",
  "deeprobotics-x30": "本轮新增学术数据库、哈工大/密歇根和 Isaac Lab，补充 X30 工业四足在复杂环境导航和巡检研究中的入口。",
  "limx-tron1": "本轮新增 OpenReview、CVF、Isaac Lab 和四足/人形研究入口，补充 TRON1 双足/人形平台的运动控制和仿真训练来源。",
  "mobile-aloha": "本轮新增学术数据库、多所机器人学习实验室、BridgeData、Language Table、VIMA、CLIPort、Tensor2Robot、Robotics Transformer、robomimic、MimicGen、Isaac Lab 和 UMI，强化 Mobile ALOHA 类双臂移动平台的数据、模型和遥操作来源链。",
  "agilex-cobot-magic": "本轮新增学术数据库、实验室入口、GenSim2、BridgeData、Language Table、VIMA、CLIPort、Tensor2Robot、RT、robomimic、MimicGen、Isaac Lab、UMI 和 Scaling Up，补强 Cobot Magic/Mobile ALOHA 类平台的科研通用性证据。",
  "agilex-limo-piper": "本轮新增语言条件操作、VIMA、CLIPort、UMI、Isaac Lab 和大规模机器人学习入口，补充 LIMO + PiPER 低成本复合平台的课程和研究项目来源。",
  "hello-stretch-3": "本轮新增学术数据库、机器人实验室、GenSim2、BridgeData、RT/大规模机器人学习、robomimic、MimicGen、Isaac Lab、UMI 和 Scaling Up，补强 Stretch 在家庭移动操作和服务机器人研究中的持续来源。",
  "pal-tiago": "本轮新增学术数据库、机器人实验室、移动操作项目、Isaac Lab 和机器人基础模型入口，补充 TIAGo 类服务机器人在移动操作、导航和人机交互论文中的追踪来源。",
  "robotnik-rb-kairos": "本轮新增 IEEE/OpenReview/arXiv、Michigan/UW 机器人入口、Isaac Lab 和移动操作训练项目，补充 RB-KAIROS+ 类工业移动操作平台的软件与科研对照来源。",
  "realman-mobile-manipulator": "本轮新增中文开放论文、机械臂操作 Benchmark、移动操作数据生成和遥操作项目入口，补充睿尔曼移动复合平台在国产科研课程中的扩源路径。",
  "unitree-go2-z1": "本轮新增操作学习、四足控制、移动操作、Isaac Lab、UMI 和机器人基础模型入口，补强 Go2 + Z1 四足加臂平台从运动到操作的一体化研究来源。",
  "unitree-b2-z1": "本轮新增学术数据库、操作学习、四足控制、移动操作和 Isaac Lab，补充 B2 + Z1 高负载四足加臂方案在巡检抓取和复杂场地移动操作中的研究入口。",
  "xarm-agilex-base": "本轮新增学术数据库、EPIC/LL4MA 等实验室、操作学习、移动操作、遥操作和仿真训练项目，补强 xArm + AgileX 自研复合平台的数据采集与模型训练来源。",
  "franka-mobile-base": "本轮新增多所机器人实验室、操作学习、移动操作、Tensor2Robot、RT、robomimic、MimicGen、Isaac Lab 和 UMI，补充移动 Franka/UR 高端复合平台的学术与软件来源。",
  "hiwonder-jetauto-pro": "本轮新增中文开放论文、Language Table、VIMA、CLIPort 和 Isaac Lab，补充 JetAuto Pro 类教学复合平台可对接的公开课程与仿真训练来源。",
  "hiwonder-jetrover-arm": "本轮新增中文开放论文、语言条件操作和 VIMA/CLIPort，补充 JetRover 加臂平台的低成本教学科研来源。",
  "yahboom-rosmaster-x3-arm": "本轮新增中文开放论文、Language Table、VIMA 和 CLIPort，补充 ROSMASTER X3 加臂平台在 ROS/移动操作课程中的参考来源。",
  "turtlebot4-arm": "本轮新增学术数据库、移动操作项目、Isaac Lab 和 UW CSE Robotics，补充 TurtleBot4 + 机械臂组合在 ROS2 教学、导航和移动操作研究中的来源。"
};

const researchRound46Notes = {
  "franka-research-3": "本轮新增四川、河南、山东、湖北、湖南、陕西、安徽、福建、重庆、天津、河北、辽宁、广西等省级政府采购平台，以及复旦、西安交大、武汉大学、深圳大学、哈工大和华东理工采购入口，补充高端科研机械臂的高校采购追踪底座。",
  "ur5e": "本轮新增多省政府采购平台和重点高校采购中心入口，补充 UR 类协作臂在高校实验平台、智能制造实训和移动操作组合中的价格与合同追踪路径。",
  "ufactory-xarm-6": "本轮新增省级采购平台和高校采购中心入口，补充 xArm 类国产/低成本科研机械臂在学校采购公告和竞价信息中的追踪来源。",
  "ufactory-xarm-7": "本轮新增省级政府采购与高校采购入口，补强 xArm7 在高校自研复合机器人、具身智能实训和机械臂课程平台采购中的来源底座。",
  "dobot-cr5": "本轮新增省级和高校采购入口，补充 DOBOT CR5 类协作臂在职业院校、自动化实训和智能制造平台中的采购追踪。",
  "jaka-zu7": "本轮新增省级政府采购和高校采购中心入口，补充节卡协作臂在学校实训平台和科研设备采购中的来源。",
  "aubo-i5": "本轮新增省级采购平台和高校采购中心入口，补充遨博协作臂采购价格、合同和售后条款的持续核验路径。",
  "elite-ec66": "本轮新增多省政府采购和高校采购入口，补充艾利特协作臂在高校/职教机器人实训平台中的采购线索。",
  "realman-rm65": "本轮新增省级采购和高校采购入口，补充睿尔曼机械臂在移动操作、双臂平台和科研设备采购中的追踪路径。",
  "mycobot-280": "本轮新增省级采购平台、深圳大学和华东理工采购入口，补充低成本教学机械臂在课程实验和零星采购中的线索。",
  "unitree-g1": "本轮新增省级政府采购平台和重点高校采购中心入口，补充 G1 EDU、人形机器人实验室和具身智能平台采购公告的持续追踪路径。",
  "unitree-h1": "本轮新增多省采购平台和高校采购中心入口，补充 H1/H1-2 全尺寸人形在高校采购、合同和交付条款中的核验来源。",
  "agibot-a2": "本轮新增省级与高校采购入口，补充智元 A2 类国产人形在学校采购和具身智能平台建设中的追踪来源。",
  "agibot-x2": "本轮新增多省采购平台和高校采购中心入口，补充 X2 类低成本人形在学校教学/交互平台采购中的线索。",
  "fourier-gr1": "本轮新增省级采购和高校采购中心入口，补充傅利叶 GR 系列在人形机器人训练平台和科研设备采购中的对照来源。",
  "fourier-gr2": "本轮新增省级与高校采购入口，补充 GR-2 高自由度人形在学校实验室和康复/服务机器人研究平台中的采购追踪。",
  "booster-t1": "本轮新增省级政府采购和高校采购中心入口，补充 Booster T1/A1 教学人形在学校批量采购和竞赛训练平台中的来源。",
  "engineai-pm01": "本轮新增多省采购平台、西安交大和深圳大学采购入口，补充 PM01 小型人形在高校采购和教学科研平台中的追踪来源。",
  "unitree-go2": "本轮新增省级采购平台和高校采购中心入口，补充 Go2 机器狗在高校竞价、实训平台、巡检试点和机器狗科研采购中的来源。",
  "unitree-b2": "本轮新增多省政府采购平台和高校采购入口，补充 B2 高负载四足在校园巡检、应急和科研平台采购中的核验路径。",
  "unitree-a2": "本轮新增省级与高校采购入口，补充 A2 新一代四足机器人在政府/学校采购公告中的持续追踪来源。",
  "deeprobotics-lite3": "本轮新增省级采购和高校采购中心入口，补充 Lite3 教学科研四足在高校实验和课程采购中的线索。",
  "deeprobotics-x30": "本轮新增省级政府采购与高校采购入口，补充 X30 工业四足在机器狗科研急需采购、巡检项目和合同公告中的追踪来源。",
  "limx-tron1": "本轮新增省级采购平台和高校采购中心入口，补充 TRON1 双足/人形平台在学校科研采购中的线索。",
  "mobile-aloha": "本轮新增省级与高校采购入口，补充 Mobile ALOHA 类低成本双臂移动操作平台在学校自研组合、训练场和实验平台采购中的追踪来源。",
  "agilex-cobot-magic": "本轮新增多省政府采购和高校采购中心入口，补充 Cobot Magic/Mobile ALOHA 类复合平台在具身智能训练场、双臂移动操作和实验平台采购中的来源。",
  "agilex-limo-piper": "本轮新增省级采购和高校采购入口，补充 LIMO + PiPER 低成本复合平台在课程实训、机器人集群和具身智能实验室中的采购追踪。",
  "hello-stretch-3": "本轮新增省级和高校采购中心入口，补充 Stretch 类进口移动操作平台在高校智能机器人采购中的可得性和替代方案对照来源。",
  "pal-tiago": "本轮新增省级采购和高校采购中心入口，补充 TIAGo 类服务移动操作平台在学校服务机器人和移动操作平台采购中的追踪路径。",
  "robotnik-rb-kairos": "本轮新增多省采购平台和高校采购中心入口，补充 RB-KAIROS+ 类工业移动操作平台在智能制造实训、移动协作臂和科研平台采购中的线索。",
  "realman-mobile-manipulator": "本轮新增省级政府采购和高校采购入口，补充睿尔曼移动复合机器人在高校双臂/移动操作平台采购中的追踪来源。",
  "unitree-go2-z1": "本轮新增省级采购和高校采购入口，补充 Go2 + Z1 四足加臂方案在机器狗、移动操作和具身智能训练平台采购中的来源。",
  "unitree-b2-z1": "本轮新增省级与高校采购入口，补充 B2 + Z1 高负载四足加臂方案在复杂场地巡检、抓取和实验平台采购中的追踪路径。",
  "xarm-agilex-base": "本轮新增省级政府采购和高校采购入口，补充 xArm + AgileX 自研移动操作组合在学校采购公告、合同和竞价信息中的核验来源。",
  "franka-mobile-base": "本轮新增省级采购和高校采购中心入口，补充 Franka/UR + 移动底盘高端复合平台在高校采购和训练场建设中的预算对照来源。",
  "hiwonder-jetauto-pro": "本轮新增省级采购平台、深圳大学和华东理工采购入口，补充 JetAuto Pro 类教学复合平台在高校课程和零星采购中的来源。",
  "hiwonder-jetrover-arm": "本轮新增省级采购平台、深圳大学和华东理工采购入口，补充 JetRover 加臂平台在低成本移动操作课程采购中的线索。",
  "yahboom-rosmaster-x3-arm": "本轮新增省级采购平台、深圳大学和华东理工采购入口，补充 ROSMASTER X3 加臂平台在学校 ROS/移动操作教学中的采购来源。",
  "turtlebot4-arm": "本轮新增省级政府采购和高校采购中心入口，补充 TurtleBot4 + 机械臂组合在 ROS2 教学、移动操作课程和进口替代对照中的采购追踪。"
};

const researchRound47Notes = {
  "ufactory-xarm-6": "本轮新增 UFACTORY 下载中心和联系入口，补充 xArm 采购后的软件、固件、手册、正式询价和售后沟通路径。",
  "ufactory-xarm-7": "本轮新增 UFACTORY 下载中心和联系入口，补强 xArm7 在学校二次开发、维护升级和正式采购沟通中的官方来源。",
  "aubo-i5": "本轮新增遨博下载中心和遨博 Docs，补充 AUBO 协作臂软件、文档、接口和维护资料的官方核验路径。",
  "jaka-zu7": "本轮新增节卡官网支持入口，补充 JAKA 协作臂售后、联系和资料导航线索；具体手册仍需从官网进一步核验。",
  "elite-ec66": "本轮新增艾利特官网和 ES/CS 技术文档，补充协作臂与复合机器人上手、安装、调试和维护资料来源。",
  "realman-rm65": "本轮新增睿尔曼官网、开发文档和 GitHub 组织，补充 RM65 机械臂 SDK、ROS/ROS2、模型和服务支持来源。",
  "unitree-z1": "本轮新增宇树文档中心，补充 Z1 机械臂和四足加臂组合的官方开发、维护和支持资料入口。",
  "agilex-piper": "本轮新增 AgileX 联系、支持和 LIMO 文档入口，补充 PiPER/移动底盘组合的售后沟通、资料下载和底盘维护来源。",
  "unitree-g1": "本轮新增宇树文档中心，补充 G1 EDU、人形应用开发、固件工具、维护和支持资料的集中核验路径。",
  "unitree-h1": "本轮新增宇树文档中心，补充 H1/H1-2 高价值人形平台开发、维护和售后支持资料入口。",
  "unitree-r1-air": "本轮新增宇树文档中心，补充 R1 Air 入门人形平台的官方应用、维护和支持资料来源。",
  "unitree-r1-d": "本轮新增宇树文档中心，补充 R1-D 双臂人形平台的应用开发、维护和支持资料来源。",
  "fourier-gr1": "本轮新增傅利叶文档中心，补充 GR 系列人形机器人 SDK、介绍、调试和维护资料入口。",
  "fourier-gr2": "本轮新增傅利叶文档中心，补充 GR-2 高自由度人形平台 SDK、介绍文档和维护资料来源。",
  "booster-t1": "本轮新增 Booster Robotics 官网，补充 T1/A1/K1 开发者平台、产品线和联系入口来源。",
  "engineai-pm01": "本轮新增众擎官网和 PM01 官方产品页，补充 PM01 规格、购买入口、政策条款和支持路径来源。",
  "unitree-go2": "本轮新增宇树文档中心，补充 Go2 官方应用开发、维护和支持资料入口。",
  "unitree-b2": "本轮新增宇树文档中心，补充 B2 高负载四足的开发、维护和售后支持来源。",
  "unitree-a2": "本轮新增宇树文档中心，补充 A2 新型号四足的官方支持、开发文档和维护资料入口。",
  "unitree-go1": "本轮新增宇树文档中心，补充 Go1 历史平台与 Go2/B2/A2 体系的官方支持路径参考。",
  "unitree-go2-z1": "本轮新增宇树文档中心、AgileX 支持和 LIMO 文档，补充 Go2 + Z1 或底盘加臂组合的官方支持与集成维护路径。",
  "unitree-b2-z1": "本轮新增宇树文档中心，补充 B2 + Z1 高负载四足加臂组合的开发、售后和维护支持来源。",
  "xiaomi-cyberdog2": "本轮新增教学/移动平台通用支持入口，作为 CyberDog2 这类消费级开发者平台和教学平台的支持生态对照。",
  "agilex-cobot-magic": "本轮新增 AgileX 联系、支持、LIMO 文档和 UFACTORY 资料入口，补充 Cobot Magic/Mobile ALOHA 类移动双臂平台的底盘、机械臂和售后支持来源。",
  "agilex-limo-piper": "本轮新增 AgileX 联系、支持和 LIMO 文档入口，补充 LIMO + PiPER 低成本复合平台的底盘维护和售后沟通路径。",
  "xarm-agilex-base": "本轮新增 AgileX 支持、LIMO 文档、UFACTORY 下载和联系入口，补充 xArm + AgileX 自研复合平台的分组件维护与正式询价来源。",
  "franka-mobile-base": "本轮新增 AgileX 和 PAL 文档/支持入口，补充 Franka/UR 类高端机械臂搭配移动底盘时的底盘、移动操作和服务机器人文档对照。",
  "realman-mobile-manipulator": "本轮新增睿尔曼官网、开发文档和 GitHub 组织，补充睿尔曼移动复合平台 SDK、ROS/ROS2、模型和集成维护来源。",
  "hello-stretch-3": "本轮新增 Hello Robot 联系入口，补充 Stretch 正式询价、教育采购、交付和售后沟通路径。",
  "pal-tiago": "本轮新增 PAL Robotics Documentation，补充 TIAGo 服务移动操作平台的官方 ROS 文档、部署和维护资料来源。",
  "robotnik-rb-kairos": "本轮新增 PAL 与 AgileX 文档/支持入口，补充 RB-KAIROS+ 类工业移动操作平台在移动底盘和服务机器人文档体系上的对照来源。",
  "hiwonder-jetauto-pro": "本轮新增教学复合平台通用支持入口，补充 JetAuto Pro 对移动底盘、机械臂和服务机器人文档生态的对照。",
  "hiwonder-jetrover-arm": "本轮新增教学复合平台通用支持入口，补充 JetRover 加臂平台在课程、底盘维护和文档体系上的参考。",
  "yahboom-rosmaster-x3-arm": "本轮新增教学复合平台通用支持入口，补充 ROSMASTER X3 加臂平台在 ROS/移动操作课程中的文档对照。",
  "turtlebot4-arm": "本轮新增教学复合平台通用支持入口，补充 TurtleBot4 + 机械臂组合在 ROS2、移动底盘和服务机器人文档生态中的来源。"
};

const researchRound48Notes = {
  "franka-research-3": "本轮新增 Semantic Scholar/DBLP/arXiv、中文期刊入口、Hugging Face/Papers With Code 数据平台、OpenDataLab/OpenXLab、Stanford/CMU/中科院等研究机构，以及 ALFRED/TEACh/Objaverse/RLDS，补强 Franka/Panda 在论文检索、数据格式和具身任务评测中的长期追踪来源。",
  "ur5e": "本轮新增学术数据库、中文期刊、机器人数据平台和具身任务 Benchmark，补充 UR5e 作为工业协作臂科研对照时的论文、代码、数据集和高层任务评估入口。",
  "ufactory-xarm-6": "本轮新增学术检索、中文期刊、Hugging Face/LeRobot、OpenDataLab/OpenXLab 和 RLDS，补充 xArm 低成本科研平台的数据采集、模型训练和中文论文追踪来源。",
  "ufactory-xarm-7": "本轮新增学术检索、数据平台、具身任务 Benchmark 和研究机构入口，补强 xArm7 在移动操作、遥操作采集和 VLA 微调中的持续扩源路径。",
  "dobot-cr5": "本轮新增中文期刊、万方检索、LeRobot/Hugging Face 和 Papers With Code 入口，补充 DOBOT 协作臂在教学实训和中文论文中的追踪来源。",
  "dobot-mg400": "本轮新增中文期刊、万方检索和机器人学习数据平台入口，补充 MG400 桌面教学机械臂在课程、轻量操作任务和论文检索中的来源。",
  "kinova-gen3": "本轮新增学术数据库、研究机构、具身 Benchmark 和机器人数据格式入口，补充 Kinova Gen3 在服务操作、医疗/辅助操作和移动操作研究中的持续追踪来源。",
  "unitree-z1": "本轮新增学术检索、数据平台、RLDS 和具身任务入口，补充 Z1 机械臂接入四足加臂、移动操作和通用机器人学习数据管线的来源。",
  "agilex-piper": "本轮新增 LeRobot/Hugging Face、OpenDataLab/OpenXLab、RLDS 和中文期刊入口，补充 PiPER 类低成本机械臂作为学校自建平台时的数据采集和复现来源。",
  "mycobot-280": "本轮新增中文期刊、Hugging Face/LeRobot、Papers With Code 和 RLDS，补充低成本教学机械臂在课程实验、数据格式和论文检索中的来源。",
  "mycobot-320": "本轮新增中文期刊、机器人数据平台和 LeRobot 入口，补充 myCobot 作为教学科研平台时的开源数据与论文跟踪来源。",
  "unitree-g1": "本轮新增 Semantic Scholar/DBLP/arXiv、Hugging Face/LeRobot、OpenDataLab/OpenXLab、MIT Improbable AI、CMU/Stanford/中科院和具身任务 Benchmark，补强 G1 在人形控制、操作和基础模型研究中的长期来源地图。",
  "unitree-h1": "本轮新增国际学术检索、模型数据平台、腿足实验室 GitHub、研究机构和具身任务 Benchmark，补充 H1 类全尺寸人形在运动控制、双臂操作和开放世界任务中的追踪入口。",
  "agibot-a2": "本轮新增学术数据库、中文研究机构、OpenDataLab/OpenXLab 和具身 Benchmark，补充智元 A2 类国产人形在中文数据、模型平台和论文追踪中的来源。",
  "agibot-x2": "本轮新增学术检索、中文期刊/数据平台和具身任务入口，补充灵犀 X2 类低成本人形平台在教学科研中的论文和模型生态来源。",
  "fourier-gr1": "本轮新增学术数据库、Hugging Face/LeRobot、GR00T 相关数据平台追踪入口、CMU/Stanford/中科院和具身 Benchmark，补充 GR-1 人形平台的软件生态对照。",
  "fourier-gr2": "本轮新增模型数据平台、研究机构和具身任务 Benchmark，补充 GR-2 高自由度人形在操作、交互和基础模型评估中的来源。",
  "ubtech-walker-s1": "本轮新增学术检索、中文研究机构和具身任务 Benchmark，补充 Walker S1 类落地人形在工业应用之外的科研对照来源。",
  "leju-kuavo": "本轮新增学术数据库、LeRobot/Hugging Face、OpenDataLab/OpenXLab 和腿足研究 GitHub 入口，补充 Kuavo 开源人形的课程和科研复现来源。",
  "booster-t1": "本轮新增学术检索、模型数据平台和具身任务 Benchmark，补充 Booster T1 教学人形在课程、算法评测和论文跟踪中的来源。",
  "engineai-pm01": "本轮新增学术检索、中文数据平台和具身任务入口，补充 PM01 小型人形作为教学科研平台的外部论文与模型生态对照。",
  "robotera-star1": "本轮新增学术检索、OpenDataLab/OpenXLab、CMU/Stanford 和具身任务 Benchmark，补充 STAR1 类高动态人形在基础模型和运动控制方向的追踪入口。",
  "unitree-r1-air": "本轮新增 LeRobot/Hugging Face、OpenDataLab/OpenXLab 和具身任务 Benchmark，补充 R1 Air 入门人形平台的课程和数据训练来源。",
  "unitree-r1-d": "本轮新增模型数据平台、学术检索和具身任务入口，补充 R1-D 双臂人形在遥操作、数据采集和任务评测中的来源。",
  "unitree-go2": "本轮新增学术检索、MIT Improbable AI GitHub、CMU/ETH/中科院研究机构、Hugging Face 数据平台和 ALFRED/TEACh 等具身任务入口，补强 Go2 在四足控制、导航和移动操作中的科研生态。",
  "unitree-b2": "本轮新增腿足研究 GitHub、CMU/中科院/沈阳自动化所和模型数据平台入口，补充 B2/A2 类高负载四足在巡检、户外自主和腿足控制中的研究来源。",
  "unitree-a2": "本轮新增学术检索、腿足研究项目和具身任务 Benchmark，补充 A2 新型号四足在运动控制与应用算法评估中的追踪来源。",
  "deeprobotics-lite3": "本轮新增学术检索、MIT Improbable AI GitHub、CMU/中科院和具身任务入口，补充 Lite3 与 Unitree/ANYmal 生态对照时的外部研究来源。",
  "deeprobotics-x30": "本轮新增腿足研究、中文研究机构和模型数据平台入口，补充 X30 工业四足在巡检、复杂地形和移动感知任务中的科研对照。",
  "deeprobotics-x20": "本轮新增学术检索、中文研究机构和具身 Benchmark，补充 X20/X30 同源四足平台的运动控制和巡检算法来源。",
  "deeprobotics-lynx-m20": "本轮新增腿足研究、数据平台和具身任务入口，补充轮足平台在导航、控制和场景理解方向的外部对照。",
  "limx-tron1": "本轮新增学术检索、腿足研究 GitHub 和模型数据平台，补充 TRON1 双足/人形过渡平台的运动控制研究来源。",
  "unitree-go2-z1": "本轮新增机器人数据平台、具身任务 Benchmark、RLDS、腿足研究和移动操作学术入口，补强 Go2 + Z1 四足加臂平台在导航-操作一体化中的数据和评测来源。",
  "unitree-b2-z1": "本轮新增四足/移动操作学术检索、模型数据平台和具身任务入口，补充 B2 + Z1 高负载四足加臂组合在复杂场地操作中的研究对照。",
  "mobile-aloha": "本轮新增学术检索、Hugging Face/LeRobot、OpenDataLab/OpenXLab、Stanford/CMU/中科院研究机构、ALFRED/TEACh/Objaverse 和 RLDS，补强 Mobile ALOHA 类双臂移动平台的数据、任务和模型生态。",
  "agilex-cobot-magic": "本轮新增学术数据库、模型数据平台、具身任务 Benchmark、RLDS 和国内外研究机构入口，补强 Cobot Magic/Mobile ALOHA 类复合平台在科研数据和任务评测中的来源链。",
  "agilex-limo-piper": "本轮新增 LeRobot/Hugging Face、中文数据平台、具身任务 Benchmark 和 RLDS，补充 LIMO + PiPER 低成本复合平台在课程、移动操作和数据采集中的来源。",
  "xarm-agilex-base": "本轮新增学术检索、中文期刊、模型数据平台、具身任务 Benchmark 和 RLDS，补充 xArm + AgileX 自研组合的长期论文、数据和任务评估入口。",
  "realman-mobile-manipulator": "本轮新增中文研究机构、OpenDataLab/OpenXLab、Hugging Face/LeRobot 和具身任务 Benchmark，补充睿尔曼移动复合平台在国产生态和学校自建任务中的研究来源。",
  "hello-stretch-3": "本轮新增 Stanford/CMU 研究入口、Hugging Face/LeRobot、ALFRED/TEACh/Objaverse 和 RLDS，进一步补强 Stretch 在家庭移动操作、服务机器人和具身任务评测中的科研通用性。",
  "pal-tiago": "本轮新增学术检索、研究机构、具身任务 Benchmark 和机器人数据格式入口，补充 TIAGo 类服务移动操作平台在导航、交互和任务规划中的研究来源。",
  "robotnik-rb-kairos": "本轮新增学术检索、中文研究机构、具身任务 Benchmark 和 RLDS，补充 RB-KAIROS+ 类工业移动操作平台在移动操作软件栈和任务评估中的对照来源。",
  "franka-mobile-base": "本轮新增研究机构、模型数据平台、ALFRED/TEACh/Objaverse 和 RLDS，补强移动 Franka/UR 组合在服务移动操作、真实数据采集和仿真资产中的来源。",
  "hiwonder-jetauto-pro": "本轮新增中文期刊、LeRobot/Hugging Face、具身任务 Benchmark 和 RLDS，补充 JetAuto Pro 类教学复合平台在课程实验和数据格式上的对照来源。",
  "hiwonder-jetrover-arm": "本轮新增中文论文入口、模型数据平台和具身任务 Benchmark，补充 JetRover 加臂平台在低成本移动操作课程中的参考来源。",
  "yahboom-rosmaster-x3-arm": "本轮新增中文期刊、Hugging Face 数据平台和具身任务入口，补充 ROSMASTER X3 加臂平台在 ROS/移动操作教学中的外部来源。",
  "turtlebot4-arm": "本轮新增学术检索、LeRobot/Hugging Face、ALFRED/TEACh/Objaverse 和 RLDS，补充 TurtleBot4 + 轻量机械臂组合在 ROS2 教学与服务机器人任务中的对照来源。"
};

const researchRound49Notes = {
  "franka-research-3": "本轮新增山西、内蒙古、甘肃、新疆、宁夏、青海、黑龙江、吉林、西藏等地方政府采购平台，以及中山大学、东南大学采购入口、百度爱采购、Made-in-China 和行业平台，补充高端机械臂采购渠道发现和高校公告追踪来源。",
  "ur5e": "本轮新增更多地方采购平台、高校采购入口、百度爱采购协作机器人/机械臂检索和行业平台，补充 UR 类协作臂在学校采购、系统集成和国产替代对照中的来源。",
  "ufactory-xarm-6": "本轮新增百度爱采购、Made-in-China、地方政府采购和高校采购入口，补充 xArm 低成本科研机械臂在国内渠道、配件和学校采购公告中的追踪路径。",
  "ufactory-xarm-7": "本轮新增国内 B2B 渠道、地方采购平台和行业媒体入口，补充 xArm7 作为自研移动操作机械臂时的供应商发现和招投标追踪来源。",
  "dobot-cr5": "本轮新增百度爱采购协作机器人、机械臂、Made-in-China 和省级/高校采购入口，补充 CR5 在学校实训与智能制造采购中的渠道来源。",
  "dobot-mg400": "本轮新增国内 B2B 机械臂渠道、行业平台和高校采购入口，补充 MG400 桌面机械臂的教学采购和配件供应线索。",
  "jaka-zu7": "本轮新增百度爱采购协作机器人、地方采购平台和行业媒体入口，补充节卡协作臂在国内学校与工业实训采购中的追踪来源。",
  "aubo-i5": "本轮新增百度爱采购协作机器人、政府采购平台和行业平台入口，补充遨博协作臂采购、系统集成商和售后渠道线索。",
  "elite-ec66": "本轮新增国内协作机器人渠道、地方政府采购和高校采购入口，补充艾利特 EC66 在学校实训和移动复合平台中的采购追踪。",
  "realman-rm65": "本轮新增机械臂、灵巧手和协作机器人渠道入口，以及多地采购平台，补充睿尔曼 RM65 本体、末端和复合平台采购线索。",
  "kinova-gen3": "本轮新增地方采购、高校采购和行业平台入口，补充 Kinova Gen3 进口科研机械臂在学校采购可得性和预算对照中的来源。",
  "unitree-z1": "本轮新增机械臂、协作机器人和灵巧手 B2B 渠道、政府采购入口和行业平台，补充 Z1 机械臂及四足加臂组合的采购线索。",
  "agilex-piper": "本轮新增机械臂和灵巧手渠道、地方采购平台和行业平台，补充 PiPER 低成本机械臂在学校自研复合平台中的供应商发现来源。",
  "mycobot-280": "本轮新增国内机械臂渠道、地方采购和高校采购入口，补充 myCobot 入门教学机械臂在课程采购和零星采购中的追踪来源。",
  "mycobot-320": "本轮新增国内机械臂 B2B 渠道、地方采购和行业平台入口，补充 myCobot 320 在教学科研采购中的渠道线索。",
  "unitree-g1": "本轮新增人形机器人百度爱采购入口、更多地方政府采购平台和高校采购中心，补充 G1 EDU 类人形平台在国内采购公告、渠道供应和行业动态中的追踪来源。",
  "unitree-h1": "本轮新增人形机器人渠道入口、地方采购平台和行业媒体，补充 H1/H1-2 全尺寸人形在高校采购、训练场建设和产业落地中的来源。",
  "agibot-a2": "本轮新增人形机器人 B2B 渠道、政府采购和高校采购入口，补充智元 A2 类国产人形在学校采购和产业动态中的追踪来源。",
  "agibot-x2": "本轮新增人形机器人渠道、地方政府采购和高校采购入口，补充 X2 类低成本人形在教学和交互平台采购中的来源。",
  "fourier-gr1": "本轮新增人形机器人渠道、地方采购和行业平台入口，补充傅利叶 GR 系列在高校、康复和服务机器人项目中的采购追踪来源。",
  "fourier-gr2": "本轮新增人形机器人渠道和采购平台，补充 GR-2 高自由度人形在学校科研平台和服务场景中的采购线索。",
  "ubtech-walker-s1": "本轮新增人形机器人渠道、地方政府采购和行业媒体入口，补充 Walker S1 类工业人形在采购和产业动态中的对照来源。",
  "leju-kuavo": "本轮新增人形机器人 B2B 渠道、地方采购和高校采购入口，补充 Kuavo 开源人形在学校教学科研采购中的线索。",
  "booster-t1": "本轮新增人形机器人渠道、政府采购平台和高校采购入口，补充 Booster T1/A1 教学人形在学校批量采购和竞赛训练场景中的来源。",
  "engineai-pm01": "本轮新增人形机器人渠道、地方采购和行业媒体入口，补充 PM01 小型人形作为教学开发平台的采购发现来源。",
  "robotera-star1": "本轮新增人形机器人渠道、政府采购和行业平台入口，补充 STAR1 类高动态人形在学校采购和产业落地中的追踪来源。",
  "unitree-r1-air": "本轮新增人形机器人渠道、地方采购和高校采购入口，补充 R1 Air 入门人形平台的采购线索。",
  "unitree-r1-d": "本轮新增人形机器人渠道和多地采购入口，补充 R1-D 双臂人形平台在国内学校采购中的追踪来源。",
  "noetix-bumi": "本轮新增人形机器人渠道和行业平台入口，补充 Bumi 类小型人形/桌面人形在教育采购中的外部线索。",
  "unitree-go2": "本轮新增机器狗百度爱采购、Made-in-China 四足、地方政府采购和行业平台入口，补充 Go2 类四足机器人在国内渠道、学校采购和巡检试点中的来源。",
  "unitree-go1": "本轮新增机器狗渠道和地方采购入口，补充 Go1 存量/二级渠道和替代型号对照线索。",
  "unitree-b2": "本轮新增机器狗 B2B 渠道、跨境四足渠道、地方采购和行业媒体入口，补充 B2 高负载四足在巡检、应急和科研采购中的渠道追踪。",
  "unitree-a2": "本轮新增机器狗/四足渠道、地方采购和行业平台入口，补充 A2 新型号在采购公告和供应商渠道中的持续追踪来源。",
  "deeprobotics-lite3": "本轮新增机器狗渠道、四足跨境供应商和省级采购入口，补充 Lite3 教学科研四足在学校采购中的外部线索。",
  "deeprobotics-x30": "本轮新增机器狗渠道、地方政府采购和行业平台，补充 X30 工业四足在巡检项目、科研急需采购和供应商发现中的来源。",
  "deeprobotics-x20": "本轮新增机器狗渠道和多地采购入口，补充 X20/X30 同源工业四足在项目采购中的追踪来源。",
  "deeprobotics-lynx-m20": "本轮新增机器狗/四足渠道和行业平台，补充山猫轮足平台的低价渠道和巡检应用线索。",
  "limx-tron1": "本轮新增四足/双足渠道、地方采购和行业媒体入口，补充 TRON1 轮足平台在学校科研采购中的来源。",
  "xiaomi-cyberdog2": "本轮新增机器狗渠道和地方采购入口，补充 CyberDog2 这类消费级开发者平台的存量渠道和采购可得性判断来源。",
  "unitree-go2-z1": "本轮新增机器狗、机械臂、协作机器人、灵巧手和跨境 B2B 渠道，以及地方采购平台，补充 Go2 + Z1 四足加臂组合分组件采购和供应商发现来源。",
  "unitree-b2-z1": "本轮新增四足、机械臂和末端执行器渠道、政府采购和行业平台，补充 B2 + Z1 高负载四足加臂组合的采购路径。",
  "mobile-aloha": "本轮新增机械臂、灵巧手、协作机器人、四足/移动底盘渠道、地方采购和高校采购入口，补充 Mobile ALOHA 类双臂移动平台的分组件采购来源。",
  "agilex-cobot-magic": "本轮新增复合平台所需的机械臂、协作机器人、灵巧手和 B2B 渠道，以及地方/高校采购入口，补充 Cobot Magic 在国内采购和系统集成中的来源。",
  "agilex-limo-piper": "本轮新增机械臂、灵巧手、B2B 渠道和采购平台，补充 LIMO + PiPER 低成本复合平台在学校零星采购和集成商渠道中的来源。",
  "xarm-agilex-base": "本轮新增机械臂、协作机器人、灵巧手和 Made-in-China 渠道，以及地方采购平台，补充 xArm + AgileX 自研组合的分组件供应和采购追踪来源。",
  "realman-mobile-manipulator": "本轮新增机械臂、协作机器人、灵巧手渠道、地方采购和行业平台，补充睿尔曼移动复合平台的采购与集成来源。",
  "hello-stretch-3": "本轮新增地方采购、高校采购、行业平台和移动操作相关渠道入口，补充 Stretch 类进口移动操作平台在国内采购公告与替代方案中的追踪来源。",
  "pal-tiago": "本轮新增地方采购、高校采购和行业平台入口，补充 TIAGo 类服务移动操作平台在学校采购中的可得性和国产替代对照来源。",
  "robotnik-rb-kairos": "本轮新增机械臂/协作机器人渠道、地方采购和行业平台，补充 RB-KAIROS+ 类工业移动操作平台在国内智能制造实训和系统集成采购中的来源。",
  "franka-mobile-base": "本轮新增机械臂、协作机器人、灵巧手渠道、地方采购和高校采购入口，补充移动 Franka/UR 高端复合平台的分组件采购和预算对照来源。",
  "hiwonder-jetauto-pro": "本轮新增国内机械臂/机器人渠道、地方采购和高校采购入口，补充 JetAuto Pro 类教学复合平台在学校课程采购中的外部线索。",
  "hiwonder-jetrover-arm": "本轮新增国内机器人渠道、地方采购和行业平台，补充 JetRover 加臂平台在低成本移动操作课程中的采购来源。",
  "yahboom-rosmaster-x3-arm": "本轮新增国内机器人渠道、地方采购和行业平台，补充 ROSMASTER X3 加臂平台在 ROS 教学和移动操作课程采购中的来源。",
  "turtlebot4-arm": "本轮新增地方采购、高校采购和行业渠道入口，补充 TurtleBot4 + 机械臂组合在 ROS2 教学和移动操作课程中的采购对照来源。"
};

const researchRound50Notes = {
  "franka-research-3": "本轮新增柳州职大、长沙理工、郑州大学、台州、河南科技、哈工大等具身智能平台具体中标/公告来源，补充高端机械臂在综合机器人平台和训练场项目中的预算与配置对照。",
  "ur5e": "本轮新增多个具身智能中心、工业具身机器人平台和概念验证中心公告，补充 UR 类协作臂在综合实验平台、智能制造和移动操作系统采购中的对照来源。",
  "ufactory-xarm-6": "本轮新增具身智能应用中心、工业具身平台和人形/服务型验证中心公告，补充 xArm 类低成本机械臂进入学校综合平台建设时的采购参照。",
  "ufactory-xarm-7": "本轮新增具身智能训练场和概念验证中心中标公告，补充 xArm7 作为自研复合平台机械臂时的预算、交付和采购场景来源。",
  "dobot-cr5": "本轮新增工业具身机器人感知与控制平台、具身智能中心和职业院校项目公告，补充 DOBOT CR5 类协作臂在实训和工业平台中的采购对照。",
  "jaka-zu7": "本轮新增具身智能中心和工业机器人平台采购公告，补充 JAKA 类协作臂在智能制造实训和工业具身平台中的采购来源。",
  "aubo-i5": "本轮新增具身智能应用中心和工业具身机器人平台公告，补充 AUBO 类协作臂在学校实验平台采购中的参照。",
  "elite-ec66": "本轮新增具身智能中心与概念验证平台公告，补充艾利特协作臂在高校实训和复合平台中的采购对照。",
  "realman-rm65": "本轮新增具身智能训练场、应用中心和仿生灵巧手组合采购来源，补充 RM65 类轻量臂及末端扩展在学校平台建设中的参照。",
  "kinova-gen3": "本轮新增具身智能和人形机器人概念验证中心、算法算力平台和训练场来源，补充 Kinova 作为进口高端操作臂的预算对照。",
  "unitree-z1": "本轮新增四足/人形/复合平台项目公告和灵巧手组合采购来源，补充 Z1 机械臂在四足加臂和训练场平台中的采购对照。",
  "agilex-piper": "本轮新增具身智能中心、工业具身平台和多负载机器人训练场公告，补充 PiPER 类轻量臂在低成本复合平台中的采购参照。",
  "unitree-g1": "本轮新增哈工大训练场、浙江理工 G1 EDU、深圳大学人形机器人、徐州工程学院、浙大城市学院和河南科技人形平台等具体公告，显著补强 G1/R1 类中型人形的高校采购价格链。",
  "unitree-h1": "本轮新增哈工大训练场多负载平台、40 自由度全尺寸人形采购、河南科技全尺寸双足和多所高校人形公告，补充 H1/H1-2 类全尺寸人形的预算、交付和训练场来源。",
  "agibot-a2": "本轮新增郑州大学具身智能与人形机器人概念验证中心、河南科技全尺寸双足与灵巧手、哈工大训练场和浙江理工/深圳大学人形采购公告，补充智元 A2 类高端人形采购对照。",
  "agibot-x2": "本轮新增柳州职大、郑州大学、浙大城市学院、徐州工程和深圳大学人形采购公告，补充 X2/中型人形在学校教学科研平台中的预算参照。",
  "fourier-gr1": "本轮新增哈工大 40 自由度全尺寸人形、河南科技全尺寸双足和多所高校人形采购公告，补充 GR-1 类全尺寸平台采购对照。",
  "fourier-gr2": "本轮新增全尺寸人形、具身智能训练场和概念验证中心公告，补充 GR-2 类高自由度人形进入高校平台建设的预算来源。",
  "ubtech-walker-s1": "本轮新增具身智能训练场、全尺寸人形和高校人形系统采购公告，补充 Walker S1 类工业人形在学校平台采购中的对照。",
  "leju-kuavo": "本轮新增全尺寸人形、仿生灵巧手和中型人形公告，补充 Kuavo 开源人形在高校采购和灵巧手组合项目中的参照。",
  "booster-t1": "本轮新增深圳大学、徐州工程、浙大城市学院等中低价人形采购公告，补充 Booster T1/A1 教学人形的价格和交付对照。",
  "engineai-pm01": "本轮新增中低价人形采购、概念验证中心和职业院校具身智能中心公告，补充 PM01 小型人形平台的学校采购对照。",
  "robotera-star1": "本轮新增全尺寸人形、训练场和人形系统采购公告，补充 STAR1 类高动态平台进入高校采购时的预算参照。",
  "unitree-r1-air": "本轮新增徐州工程、深圳大学、浙大城市学院和河南科技人形控制平台公告，补充 R1 Air 类入门人形的中低价采购线索。",
  "unitree-r1-d": "本轮新增人形控制平台、仿生灵巧手组合和中型人形采购公告，补充 R1-D 双臂人形的学校采购预算对照。",
  "noetix-bumi": "本轮新增中低价人形和具身智能应用中心公告，补充 Bumi 类桌面/小型人形教育采购的外部对照。",
  "unitree-go2": "本轮新增浙大城市学院四足机器狗采购、哈工大训练场和台州概念验证中心公告，补充 Go2/Go2 EDU 类四足在高校与产业验证中心采购中的来源。",
  "unitree-b2": "本轮新增训练场、多负载机器人平台和四足机器狗采购公告，补充 B2/A2 类高性能四足在训练场和巡检平台中的采购参照。",
  "unitree-a2": "本轮新增具身智能训练场、台州概念验证中心和四足机器狗公告，补充 A2 类新一代四足平台的采购对照。",
  "deeprobotics-lite3": "本轮新增浙大城市学院四足机器狗、柳州职大和台州概念验证中心公告，补充 Lite3 类教学四足在学校采购中的预算参照。",
  "deeprobotics-x30": "本轮新增具身智能训练场、台州概念验证中心和四足机器狗采购公告，补充 X30 类工业四足在巡检/训练场项目中的来源。",
  "deeprobotics-x20": "本轮新增训练场、概念验证中心和四足机器狗公告，补充 X20/X30 同源工业四足项目采购对照。",
  "deeprobotics-lynx-m20": "本轮新增四足/轮足相关采购公告和训练场来源，补充山猫轮足平台在学校与产业验证中心中的采购对照。",
  "limx-tron1": "本轮新增人形/双足与训练场公告，补充 TRON1 轮足/双足平台在高校人形实验中的预算对照。",
  "unitree-go2-z1": "本轮新增台州概念验证中心、浙大城市学院移动抓取四足和多负载训练场来源，补强 Go2 + Z1 四足加臂在真实采购中的场景证据。",
  "unitree-b2-z1": "本轮新增训练场、概念验证中心和移动抓取四足项目公告，补充 B2 + Z1 高负载四足加臂组合的采购对照。",
  "mobile-aloha": "本轮新增具身智能应用中心、工业具身平台、概念验证中心和训练场公告，补充 Mobile ALOHA 类双臂移动平台在学校综合平台建设中的采购参照。",
  "agilex-cobot-magic": "本轮新增郑州大学概念验证中心、台州概念验证中心、柳州职大、长沙理工和哈工大训练场公告，补强 Cobot Magic/双臂移动平台在具身智能平台采购中的来源。",
  "agilex-limo-piper": "本轮新增工业具身机器人平台、具身智能应用中心和多负载训练场公告，补充 LIMO + PiPER 低成本复合平台的采购对照。",
  "xarm-agilex-base": "本轮新增工业具身平台、概念验证中心和训练场公告，补充 xArm + AgileX 自研组合在高校平台采购中的预算来源。",
  "realman-mobile-manipulator": "本轮新增具身智能中心、台州概念验证中心和训练场公告，补充睿尔曼移动复合平台在综合平台建设中的采购对照。",
  "hello-stretch-3": "本轮新增具身智能训练场、概念验证中心和应用中心公告，补充 Stretch 类服务移动操作平台在学校异构平台中的对照。",
  "pal-tiago": "本轮新增概念验证中心、训练场和具身智能应用中心公告，补充 TIAGo 类服务移动操作平台在学校平台建设中的采购参照。",
  "robotnik-rb-kairos": "本轮新增工业具身机器人平台、概念验证中心和训练场公告，补充 RB-KAIROS+ 类工业移动操作平台的采购对照。",
  "franka-mobile-base": "本轮新增具身智能应用中心、工业平台、概念验证中心和训练场公告，补充移动 Franka/UR 高端复合平台在高校平台采购中的来源。",
  "hiwonder-jetauto-pro": "本轮新增柳州职大、长沙理工和郑州大学具身智能平台公告，补充 JetAuto Pro 类教学复合平台在职教/高校建设中的采购对照。",
  "hiwonder-jetrover-arm": "本轮新增具身智能应用中心和工业具身平台公告，补充 JetRover 加臂平台在低成本移动操作教学中的采购来源。",
  "yahboom-rosmaster-x3-arm": "本轮新增职业院校具身智能中心和工业具身机器人平台公告，补充 ROSMASTER X3 加臂平台在教学实训采购中的对照。",
  "turtlebot4-arm": "本轮新增柳州职大、长沙理工、郑州大学和训练场公告，补充 TurtleBot4 + 机械臂组合在 ROS2 教学和移动操作课程中的采购参照。"
};

const categoryWideLinks = {
  "机械臂": [
    ...sourceBundles.safetyRound6Industrial,
    ...sourceBundles.procurementOpsRound6,
    ...sourceBundles.sensorComputeRound6,
    ...sourceBundles.dexterousHandsExtended,
    ...sourceBundles.dexterousHandsRound5,
    ...sourceBundles.manipulationBenchmarks,
    ...sourceBundles.extraManipulationBenchmarks,
    ...sourceBundles.researchRound7Manipulation,
    ...sourceBundles.researchRound9Manipulation,
    ...sourceBundles.researchRound9ChineseDiscovery,
    ...sourceBundles.extraDexterousResearch,
    ...sourceBundles.roboticsAlgorithmTools,
    ...sourceBundles.roboticsPaperVenues,
    ...sourceBundles.cnAcademicOrganizations,
    ...sourceBundles.researchRound7ChineseAcademicDiscovery,
    ...sourceBundles.researchRound13Manipulation,
    ...sourceBundles.researchRound13ChineseAcademic,
    ...sourceBundles.researchRound14AcademicDiscovery,
    ...sourceBundles.researchRound14ManipulationDiscovery,
    ...sourceBundles.researchRound14OpenRobotics,
    ...sourceBundles.researchRound14ChineseInstitutions,
    ...sourceBundles.researchRound14SoftwareStack,
    ...sourceBundles.researchRound15Policy,
    ...sourceBundles.researchRound15ProcurementPlatforms,
    ...sourceBundles.researchRound15PatentSearch,
    ...sourceBundles.researchRound15Standards,
    ...sourceBundles.researchRound15Certification,
    ...sourceBundles.researchRound15Industry,
    ...sourceBundles.researchRound15ImportCompliance,
    ...sourceBundles.researchRound16ChineseLabs,
    ...sourceBundles.researchRound16ManipulationProjects,
    ...sourceBundles.researchRound16DexterousProjects,
    ...sourceBundles.researchRound17ArmLifecycle,
    ...sourceBundles.researchRound17LabSafety,
    ...sourceBundles.researchRound18ArmAccessories,
    ...sourceBundles.researchRound18Calibration,
    ...sourceBundles.researchRound18Insurance,
    ...sourceBundles.researchRound19CoreComponents,
    ...sourceBundles.researchRound19Metrology,
    ...sourceBundles.researchRound19LiabilityInsurance,
    ...sourceBundles.researchRound20Encoders,
    ...sourceBundles.researchRound20PublicLiability,
    ...sourceBundles.researchRound21TorqueSensors,
    ...sourceBundles.researchRound21EmployerSchoolLiability,
    ...sourceBundles.researchRound22DataPrivacy,
    ...sourceBundles.researchRound22Cybersecurity,
    ...sourceBundles.researchRound22AiRisk,
    ...sourceBundles.researchRound22CampusSafety,
    ...sourceBundles.researchRound23VoiceBiometricPrivacy,
	    ...sourceBundles.researchRound23FaceBiometricPrivacy,
	    ...sourceBundles.researchRound23AuditRemoteAccess,
	    ...sourceBundles.researchRound23EmbodiedData,
	    ...sourceBundles.researchRound25ManipulationAcademic,
	    ...sourceBundles.researchRound28ManipulationLearning,
	    ...sourceBundles.researchRound28EmbodiedAgentBenchmarks,
	    ...sourceBundles.researchRound29EmbodiedTrainingProcurement,
	    ...sourceBundles.researchRound29ArmTrainingProcurement,
	    ...sourceBundles.armOpenSourceDiscovery,
    ...sourceBundles.cnStandardsCertification,
    ...sourceBundles.industryConferences,
    ...sourceBundles.tenderPlatforms,
    ...sourceBundles.extraTenderPlatforms,
    ...sourceBundles.robotDataExtended,
    ...sourceBundles.researchRound38ArmAcademic,
    ...sourceBundles.researchRound39ManipulationAcademic,
    ...sourceBundles.researchRound41RealManOfficial,
    ...sourceBundles.researchRound42BimanualMobile,
    ...sourceBundles.researchRound42DexterousTactile,
    ...sourceBundles.researchRound42ChineseLabs,
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43ArmChannels,
    ...sourceBundles.researchRound43ArmOpenSource,
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44GlobalCourses,
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45ManipulationProjects,
    ...sourceBundles.researchRound48ManipulationAcademic,
    ...sourceBundles.researchRound49ArmProcurement,
    ...sourceBundles.researchRound50ArmProcurement,
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement,
    ...sourceBundles.researchRound39ProcurementArms,
    ...sourceBundles.researchRound40ProcurementArms,
    ...sourceBundles.industryTracking,
    ...sourceBundles.priceRound10Arms,
    ...sourceBundles.priceRound11Arms
  ],
  "人形机器人": [
    ...sourceBundles.safetyRound6Service,
    ...sourceBundles.procurementOpsRound6,
    ...sourceBundles.sensorComputeRound6,
    ...sourceBundles.serviceRobotSafety,
    ...sourceBundles.extraHumanoidResearch,
    ...sourceBundles.researchRound7Humanoids,
    ...sourceBundles.researchRound9Humanoids,
    ...sourceBundles.researchRound9ChineseDiscovery,
    ...sourceBundles.extraEmbodiedBenchmarks,
    ...sourceBundles.roboticsAlgorithmTools,
    ...sourceBundles.roboticsPaperVenues,
    ...sourceBundles.cnAcademicOrganizations,
    ...sourceBundles.researchRound7ChineseAcademicDiscovery,
    ...sourceBundles.researchRound13Humanoids,
    ...sourceBundles.researchRound13ChineseAcademic,
    ...sourceBundles.researchRound14AcademicDiscovery,
    ...sourceBundles.researchRound14HumanoidDiscovery,
    ...sourceBundles.researchRound14OpenRobotics,
    ...sourceBundles.researchRound14ChineseInstitutions,
    ...sourceBundles.researchRound14OpenHardwareHumanoids,
    ...sourceBundles.researchRound14SoftwareStack,
    ...sourceBundles.researchRound15Policy,
    ...sourceBundles.researchRound15ProcurementPlatforms,
    ...sourceBundles.researchRound15PatentSearch,
    ...sourceBundles.researchRound15Standards,
    ...sourceBundles.researchRound15Certification,
    ...sourceBundles.researchRound15Industry,
    ...sourceBundles.researchRound15ImportCompliance,
    ...sourceBundles.researchRound16ChineseLabs,
    ...sourceBundles.researchRound16HumanoidProjects,
    ...sourceBundles.researchRound17MobileLifecycle,
    ...sourceBundles.researchRound17BatterySafety,
    ...sourceBundles.researchRound17LabSafety,
    ...sourceBundles.researchRound18MobileAccessories,
    ...sourceBundles.researchRound18MobileCalibration,
    ...sourceBundles.researchRound18Insurance,
    ...sourceBundles.researchRound19CoreComponents,
    ...sourceBundles.researchRound19Metrology,
    ...sourceBundles.researchRound19LiabilityInsurance,
    ...sourceBundles.researchRound20Encoders,
    ...sourceBundles.researchRound20PublicLiability,
    ...sourceBundles.researchRound21TorqueSensors,
    ...sourceBundles.researchRound21EmployerSchoolLiability,
    ...sourceBundles.researchRound22DataPrivacy,
    ...sourceBundles.researchRound22Cybersecurity,
    ...sourceBundles.researchRound22AiRisk,
    ...sourceBundles.researchRound22CampusSafety,
    ...sourceBundles.researchRound23VoiceBiometricPrivacy,
    ...sourceBundles.researchRound23FaceBiometricPrivacy,
    ...sourceBundles.researchRound23AuditRemoteAccess,
    ...sourceBundles.researchRound23HumanoidResearch,
	    ...sourceBundles.researchRound23EmbodiedData,
	    ...sourceBundles.researchRound25EmbodiedBenchmarks,
	    ...sourceBundles.researchRound25LeggedAcademic,
	    ...sourceBundles.researchRound25AcademicLabs,
	    ...sourceBundles.researchRound28HumanoidBenchmarks,
	    ...sourceBundles.researchRound28EmbodiedAgentBenchmarks,
	    ...sourceBundles.researchRound29EmbodiedTrainingProcurement,
	    ...sourceBundles.researchRound29HumanoidProcurement,
	    ...sourceBundles.humanoidOpenSourceDiscovery,
    ...sourceBundles.cnStandardsCertification,
    ...sourceBundles.industryConferences,
    ...sourceBundles.tenderPlatforms,
    ...sourceBundles.extraTenderPlatforms,
    ...sourceBundles.robotDataExtended,
    ...sourceBundles.researchRound38HumanoidAcademic,
    ...sourceBundles.researchRound39HumanoidAcademic,
    ...sourceBundles.researchRound41BoosterOfficial,
    ...sourceBundles.researchRound41EngineAiOfficial,
    ...sourceBundles.researchRound41RobotEraOfficial,
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42ChineseLabs,
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43HumanoidOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes,
    ...sourceBundles.researchRound43ProcurementPlatforms,
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44IndustryAssociations,
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45HumanoidProjects,
    ...sourceBundles.researchRound45MobileProjects,
    ...sourceBundles.researchRound48HumanoidAcademic,
    ...sourceBundles.researchRound49HumanoidProcurement,
    ...sourceBundles.researchRound50HumanoidProcurement,
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement,
    ...sourceBundles.researchRound39ProcurementHumanoids,
    ...sourceBundles.researchRound40ProcurementHumanoids,
    ...sourceBundles.industryTracking,
    ...sourceBundles.priceRound10Humanoids,
    ...sourceBundles.priceRound11Humanoids
  ],
  "机械狗": [
    ...sourceBundles.safetyRound6Mobile,
    ...sourceBundles.procurementOpsRound6,
    ...sourceBundles.sensorComputeRound6,
    ...sourceBundles.rosNavigationStack,
    ...sourceBundles.quadrupedGlobalBenchmarks,
    ...sourceBundles.extraQuadrupedResearch,
    ...sourceBundles.researchRound7Quadrupeds,
    ...sourceBundles.researchRound9Quadrupeds,
    ...sourceBundles.researchRound9ChineseDiscovery,
    ...sourceBundles.extraEmbodiedBenchmarks,
    ...sourceBundles.serviceRobotSafety,
    ...sourceBundles.roboticsAlgorithmTools,
    ...sourceBundles.roboticsPaperVenues,
    ...sourceBundles.cnAcademicOrganizations,
    ...sourceBundles.researchRound7ChineseAcademicDiscovery,
    ...sourceBundles.researchRound13Quadrupeds,
    ...sourceBundles.researchRound13ChineseAcademic,
    ...sourceBundles.researchRound14AcademicDiscovery,
    ...sourceBundles.researchRound14QuadrupedDiscovery,
    ...sourceBundles.researchRound14OpenRobotics,
    ...sourceBundles.researchRound14ChineseInstitutions,
    ...sourceBundles.researchRound14SoftwareStack,
    ...sourceBundles.researchRound15Policy,
    ...sourceBundles.researchRound15ProcurementPlatforms,
    ...sourceBundles.researchRound15PatentSearch,
    ...sourceBundles.researchRound15Standards,
    ...sourceBundles.researchRound15Certification,
    ...sourceBundles.researchRound15Industry,
    ...sourceBundles.researchRound15ImportCompliance,
    ...sourceBundles.researchRound16ChineseLabs,
    ...sourceBundles.researchRound16QuadrupedProjects,
    ...sourceBundles.researchRound17MobileLifecycle,
    ...sourceBundles.researchRound17BatterySafety,
    ...sourceBundles.researchRound17LabSafety,
    ...sourceBundles.researchRound18MobileAccessories,
    ...sourceBundles.researchRound18MobileCalibration,
    ...sourceBundles.researchRound18Insurance,
    ...sourceBundles.researchRound19CoreComponents,
    ...sourceBundles.researchRound19Metrology,
    ...sourceBundles.researchRound19LiabilityInsurance,
    ...sourceBundles.researchRound20Encoders,
    ...sourceBundles.researchRound20PublicLiability,
    ...sourceBundles.researchRound21TorqueSensors,
    ...sourceBundles.researchRound21EmployerSchoolLiability,
    ...sourceBundles.researchRound22DataPrivacy,
    ...sourceBundles.researchRound22Cybersecurity,
    ...sourceBundles.researchRound22AiRisk,
    ...sourceBundles.researchRound22CampusSafety,
    ...sourceBundles.researchRound23VoiceBiometricPrivacy,
    ...sourceBundles.researchRound23FaceBiometricPrivacy,
    ...sourceBundles.researchRound23AuditRemoteAccess,
    ...sourceBundles.researchRound23QuadrupedResearch,
	    ...sourceBundles.researchRound23EmbodiedData,
	    ...sourceBundles.researchRound25LeggedAcademic,
	    ...sourceBundles.researchRound25AcademicLabs,
	    ...sourceBundles.researchRound28QuadrupedLocomotion,
	    ...sourceBundles.researchRound28EmbodiedAgentBenchmarks,
	    ...sourceBundles.researchRound29EmbodiedTrainingProcurement,
	    ...sourceBundles.researchRound29QuadrupedProcurement,
	    ...sourceBundles.quadrupedOpenSourceDiscovery,
    ...sourceBundles.cnStandardsCertification,
    ...sourceBundles.industryConferences,
    ...sourceBundles.tenderPlatforms,
    ...sourceBundles.extraTenderPlatforms,
    ...sourceBundles.mobileBasesExtended,
    ...sourceBundles.researchRound38QuadrupedAcademic,
    ...sourceBundles.researchRound41LimxOfficial,
    ...sourceBundles.researchRound41CyberDogOfficial,
    ...sourceBundles.researchRound42LeggedHumanoidLabs,
    ...sourceBundles.researchRound42GeneralRoboticsLabs,
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43LeggedOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes,
    ...sourceBundles.researchRound43QuadrupedChannels,
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44IndustryAssociations,
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45QuadrupedProjects,
    ...sourceBundles.researchRound48QuadrupedAcademic,
    ...sourceBundles.researchRound49QuadrupedProcurement,
    ...sourceBundles.researchRound50QuadrupedProcurement,
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement,
    ...sourceBundles.researchRound39ProcurementQuadrupeds,
    ...sourceBundles.researchRound40ProcurementQuadrupeds,
    "SRC365",
    ...sourceBundles.industryTracking,
    ...sourceBundles.priceRound10Quadrupeds,
    ...sourceBundles.priceRound11Quadrupeds,
    ...sourceBundles.priceRound12Quadrupeds
  ],
  "复合型机器人": [
    ...sourceBundles.safetyRound6Industrial,
    ...sourceBundles.safetyRound6Service,
    ...sourceBundles.safetyRound6Mobile,
    ...sourceBundles.procurementOpsRound6,
    ...sourceBundles.sensorComputeRound6,
    ...sourceBundles.dexterousHandsExtended,
    ...sourceBundles.dexterousHandsRound5,
    ...sourceBundles.mobileBasesExtended,
    ...sourceBundles.rosNavigationStack,
    ...sourceBundles.manipulationBenchmarks,
    ...sourceBundles.extraManipulationBenchmarks,
    ...sourceBundles.researchRound7Manipulation,
    ...sourceBundles.researchRound7MobileManipulation,
    ...sourceBundles.researchRound9Manipulation,
    ...sourceBundles.researchRound9MobileManipulation,
    ...sourceBundles.researchRound9ChineseDiscovery,
    ...sourceBundles.extraDexterousResearch,
    ...sourceBundles.extraEmbodiedBenchmarks,
    ...sourceBundles.serviceRobotSafety,
    ...sourceBundles.roboticsAlgorithmTools,
    ...sourceBundles.roboticsPaperVenues,
    ...sourceBundles.cnAcademicOrganizations,
    ...sourceBundles.researchRound7ChineseAcademicDiscovery,
    ...sourceBundles.researchRound13Manipulation,
    ...sourceBundles.researchRound13MobileManipulation,
    ...sourceBundles.researchRound13ChineseAcademic,
    ...sourceBundles.researchRound14AcademicDiscovery,
    ...sourceBundles.researchRound14ManipulationDiscovery,
    ...sourceBundles.researchRound14MobileDiscovery,
    ...sourceBundles.researchRound14OpenRobotics,
    ...sourceBundles.researchRound14ChineseInstitutions,
    ...sourceBundles.researchRound14OpenHardwareArms,
    ...sourceBundles.researchRound14SoftwareStack,
    ...sourceBundles.researchRound15Policy,
    ...sourceBundles.researchRound15ProcurementPlatforms,
    ...sourceBundles.researchRound15PatentSearch,
    ...sourceBundles.researchRound15Standards,
    ...sourceBundles.researchRound15Certification,
    ...sourceBundles.researchRound15Industry,
    ...sourceBundles.researchRound15ImportCompliance,
    ...sourceBundles.researchRound16ChineseLabs,
    ...sourceBundles.researchRound16ManipulationProjects,
    ...sourceBundles.researchRound16MobileManipulationProjects,
    ...sourceBundles.researchRound16DexterousProjects,
    ...sourceBundles.researchRound16QuadrupedProjects,
    ...sourceBundles.researchRound17ArmLifecycle,
    ...sourceBundles.researchRound17MobileLifecycle,
    ...sourceBundles.researchRound17BatterySafety,
    ...sourceBundles.researchRound17LabSafety,
    ...sourceBundles.researchRound18Accessories,
    ...sourceBundles.researchRound18Calibration,
    ...sourceBundles.researchRound18Insurance,
    ...sourceBundles.researchRound19CoreComponents,
    ...sourceBundles.researchRound19Metrology,
    ...sourceBundles.researchRound19LiabilityInsurance,
    ...sourceBundles.researchRound20Encoders,
    ...sourceBundles.researchRound20PublicLiability,
    ...sourceBundles.researchRound21TorqueSensors,
    ...sourceBundles.researchRound21EmployerSchoolLiability,
    ...sourceBundles.researchRound22DataPrivacy,
    ...sourceBundles.researchRound22Cybersecurity,
    ...sourceBundles.researchRound22AiRisk,
    ...sourceBundles.researchRound22CampusSafety,
    ...sourceBundles.researchRound23VoiceBiometricPrivacy,
    ...sourceBundles.researchRound23FaceBiometricPrivacy,
    ...sourceBundles.researchRound23AuditRemoteAccess,
    ...sourceBundles.researchRound23MobileManipulationResearch,
	    ...sourceBundles.researchRound23EmbodiedData,
	    ...sourceBundles.researchRound25ManipulationAcademic,
	    ...sourceBundles.researchRound25MobileEmbodiedAcademic,
	    ...sourceBundles.researchRound28ManipulationLearning,
	    ...sourceBundles.researchRound28MobileManipulation,
	    ...sourceBundles.researchRound28EmbodiedAgentBenchmarks,
	    ...sourceBundles.researchRound29EmbodiedTrainingProcurement,
	    ...sourceBundles.researchRound29MobileProcurement,
	    ...sourceBundles.researchRound29ArmTrainingProcurement,
	    ...sourceBundles.armOpenSourceDiscovery,
    ...sourceBundles.cnStandardsCertification,
    ...sourceBundles.industryConferences,
    ...sourceBundles.tenderPlatforms,
    ...sourceBundles.extraTenderPlatforms,
    ...sourceBundles.multiRobotScheduling,
    ...sourceBundles.robotDataExtended,
    ...sourceBundles.researchRound38CompositeAcademic,
    ...sourceBundles.researchRound39CompositeAcademic,
    ...sourceBundles.researchRound41RealManOfficial,
    ...sourceBundles.researchRound41RobotnikOfficial,
    ...sourceBundles.researchRound42BimanualMobile,
    ...sourceBundles.researchRound42LowCostMobile,
    ...sourceBundles.researchRound42DexterousTactile,
    ...sourceBundles.researchRound42GeneralRoboticsLabs,
    ...sourceBundles.researchRound43AcademicIndexes,
    ...sourceBundles.researchRound43ProcurementPlatforms,
    ...sourceBundles.researchRound43ArmChannels,
    ...sourceBundles.researchRound43RosDevOps,
    ...sourceBundles.researchRound43MobileOpenSource,
    ...sourceBundles.researchRound43ResearchInstitutes,
    ...sourceBundles.researchRound44IpStandards,
    ...sourceBundles.researchRound44ModelDataCn,
    ...sourceBundles.researchRound44CnOpenSource,
    ...sourceBundles.researchRound44CnCourses,
    ...sourceBundles.researchRound44GlobalCourses,
    ...sourceBundles.researchRound44IndustryAssociations,
    ...sourceBundles.researchRound45AcademicIndexes,
    ...sourceBundles.researchRound45ResearchLabs,
    ...sourceBundles.researchRound45ManipulationProjects,
    ...sourceBundles.researchRound45MobileProjects,
    ...sourceBundles.researchRound48MobileAcademic,
    ...sourceBundles.researchRound49CompositeProcurement,
    ...sourceBundles.researchRound50CompositeProcurement,
    ...sourceBundles.researchRound46ProvincialProcurement,
    ...sourceBundles.researchRound46UniversityProcurement,
    ...sourceBundles.researchRound39ProcurementComposite,
    ...sourceBundles.researchRound40ProcurementComposite,
    ...sourceBundles.industryTracking,
    ...sourceBundles.priceRound10Mobile,
    ...sourceBundles.priceRound11Mobile,
    ...sourceBundles.priceRound12Mobile
  ]
};

for (const robotItem of robots) {
	  const extraSourceIds = [
	    ...(academicLinks[robotItem.id] || []),
	    ...(expandedLinks[robotItem.id] || []),
	    ...(round30ModelLinks[robotItem.id] || []),
	    ...(round31ModelLinks[robotItem.id] || []),
	    ...(round32ModelLinks[robotItem.id] || []),
	    ...(round33ModelLinks[robotItem.id] || []),
	    ...(round34ModelLinks[robotItem.id] || []),
	    ...(round35ModelLinks[robotItem.id] || []),
	    ...(round36ModelLinks[robotItem.id] || []),
	    ...(round37ModelLinks[robotItem.id] || []),
	    ...(round38ModelLinks[robotItem.id] || []),
	    ...(round39ModelLinks[robotItem.id] || []),
	    ...(round40ModelLinks[robotItem.id] || []),
	    ...(round41ModelLinks[robotItem.id] || []),
	    ...(round42ModelLinks[robotItem.id] || []),
	    ...(round43ModelLinks[robotItem.id] || []),
	    ...(round44ModelLinks[robotItem.id] || []),
	    ...(round45ModelLinks[robotItem.id] || []),
	    ...(round46ModelLinks[robotItem.id] || []),
	    ...(round47ModelLinks[robotItem.id] || []),
	    ...(round48ModelLinks[robotItem.id] || []),
	    ...(round49ModelLinks[robotItem.id] || []),
	    ...(round50ModelLinks[robotItem.id] || []),
	    ...(categoryWideLinks[robotItem.category] || [])
	  ];
  robotItem.sourceIds = Array.from(new Set([...robotItem.sourceIds, ...extraSourceIds]));
  const notes = [
    academicNotes[robotItem.id],
    expandedNotes[robotItem.id],
    researchRound13Notes[robotItem.id],
    researchRound14Notes[robotItem.id],
    researchRound15Notes[robotItem.id],
    researchRound16Notes[robotItem.id],
    researchRound17Notes[robotItem.id],
    researchRound18Notes[robotItem.id],
    researchRound19Notes[robotItem.id],
    researchRound20Notes[robotItem.id],
    researchRound21Notes[robotItem.id],
    researchRound22Notes[robotItem.id],
    researchRound23Notes[robotItem.id],
    researchRound24Notes[robotItem.id],
	    researchRound25Notes[robotItem.id],
	    researchRound26Notes[robotItem.id],
	    researchRound27Notes[robotItem.id],
	    researchRound28Notes[robotItem.id],
	    researchRound29Notes[robotItem.id],
	    researchRound30Notes[robotItem.id],
	    researchRound31Notes[robotItem.id],
	    researchRound32Notes[robotItem.id],
	    researchRound33Notes[robotItem.id],
	    researchRound34Notes[robotItem.id],
	    researchRound35Notes[robotItem.id],
	    researchRound36Notes[robotItem.id],
	    researchRound37Notes[robotItem.id],
	    researchRound38Notes[robotItem.id],
	    researchRound39Notes[robotItem.id],
	    researchRound40Notes[robotItem.id],
	    researchRound41Notes[robotItem.id],
	    researchRound42Notes[robotItem.id],
	    researchRound43Notes[robotItem.id],
	    researchRound44Notes[robotItem.id],
	    researchRound45Notes[robotItem.id],
	    researchRound46Notes[robotItem.id],
	    researchRound47Notes[robotItem.id],
	    researchRound48Notes[robotItem.id],
	    researchRound49Notes[robotItem.id],
	    researchRound50Notes[robotItem.id]
	  ].filter(Boolean);
  for (const note of notes) {
    if (!robotItem.researchEvidence.includes(note)) {
      robotItem.researchEvidence = [...robotItem.researchEvidence, note];
    }
  }
}

for (const robotItem of robots) {
  for (const id of robotItem.sourceIds) {
    if (!sourceIndex.has(id)) {
      throw new Error(`${robotItem.id} references missing source ${id}`);
    }
  }
}

const categoryOrder = ["机械臂", "人形机器人", "机械狗", "复合型机器人"];

robots.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) || b.scores.overall - a.scores.overall);

const data = {
  meta: {
    project: "学校具身智能机器人采购调研",
    version: "v2",
    accessedDate,
    updateSummary: "中文网站优先扩充；价格统一人民币主显示；电商来源官方优先，普通店铺仅作低置信线索。",
    scoringWeights: { research: 50, deployment: 50 },
    exchangeRates: {
      note: "仅用于把外币公开价换算为人民币展示，不作为正式采购报价。",
      USD_CNY: fx.USD,
      EUR_CNY: fx.EUR,
      CHF_CNY: fx.CHF,
      date: accessedDate
    },
    confidenceLegend: {
      high: "官网、官方规格书、官方价格、正式论文或厂商文档",
      medium: "授权代理、招投标、实验室项目页、GitHub 或清晰第三方渠道",
      low: "媒体、论坛、动态电商检索、二手报价、非授权渠道或估算"
    }
  },
  sources,
  robots
};

fs.mkdirSync("work/data", { recursive: true });
fs.mkdirSync("outputs", { recursive: true });
fs.writeFileSync("work/data/robot_research_data.json", JSON.stringify(data, null, 2) + "\n");
fs.writeFileSync("app/src/robotResearchData.json", JSON.stringify(data, null, 2) + "\n");

const csvRows = [["id", "title", "type", "confidence", "url", "notes"], ...sources.map((s) => [s.id, s.title, s.type, s.confidence, s.url, s.notes])];
fs.writeFileSync("outputs/来源追踪-v2.csv", csvRows.map((row) => row.map(csvEscape).join(",")).join("\n") + "\n");

const counts = Object.fromEntries(categoryOrder.map((cat) => [cat, robots.filter((r) => r.category === cat).length]));
const priced = robots.filter((r) => r.price.amount !== null);
const sourceTypes = [...new Set(sources.map((s) => s.type))];
const shortlist = {
  科研平台: robots.filter((r) => r.shortlistTags.includes("科研平台")).sort((a, b) => b.scores.research - a.scores.research).slice(0, 8),
  教学平台: robots.filter((r) => r.shortlistTags.includes("教学平台")).sort((a, b) => b.scores.overall - a.scores.overall).slice(0, 8),
  落地项目: robots.filter((r) => r.shortlistTags.includes("落地项目")).sort((a, b) => b.scores.deployment - a.scores.deployment).slice(0, 8)
};

const report = `# 学校具身智能机器人采购调研 v2\n\n` +
`更新时间：${accessedDate}\n\n` +
`## 数据概览\n\n` +
`- 候选设备：${robots.length} 个\n` +
`- 来源记录：${sources.length} 条\n` +
`- 已有公开人民币价格或人民币估算：${priced.length} 个；其余标注为“需询价”或“电商价待核验”\n` +
`- 类别分布：${categoryOrder.map((cat) => `${cat} ${counts[cat]} 个`).join("，")}\n` +
`- 来源类型：${sourceTypes.join("、")}\n\n` +
`## 采购短名单建议\n\n` +
Object.entries(shortlist).map(([group, items]) => `### ${group}\n\n${items.map((r, i) => `${i + 1}. **${r.name}**（${r.category}，${r.vendor}）：${r.price.label}；科研 ${r.scores.research}/50，落地 ${r.scores.deployment}/50。`).join("\n")}`).join("\n\n") +
`\n\n## 价格口径\n\n` +
`- 页面主价格统一为人民币。外币公开价按 ${accessedDate} 估算汇率换算，仅用于预算量级判断。\n` +
`- 京东、淘宝/天猫检索页只作为渠道线索；未确认官方店和实时价格时，不作为确定报价。\n` +
`- 需要正式采购时，应要求厂商或授权代理提供盖章报价单、教育折扣、维保条款和交付周期。\n\n` +
`## 下一步建议\n\n` +
`1. 对短名单设备向官方/授权代理发起询价，收集教育价、维保和交期。\n` +
`2. 对科研平台要求提供 ROS/ROS2、SDK、仿真和样例代码清单。\n` +
`3. 对落地项目平台要求提供安全方案、培训、备件和场地约束。\n`;

fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", report);

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

console.log(JSON.stringify({ robots: robots.length, sources: sources.length, counts, priced: priced.length }, null, 2));
