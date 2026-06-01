import fs from "node:fs";

const inputPath = "app/src/robotResearchData.json";
const outputPaths = ["work/data/robot_research_data.json", "app/src/robotResearchData.json"];
const accessedDate = "2026-06-01";

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const sources = data.sources;
const sourceIndex = new Map(sources.map((source) => [source.id, source]));
const existingIds = new Set(data.robots.map((robot) => robot.id));

const categoryMap = {
  "复合型机器人": "移动/复合机器人",
  "机械狗": "机器狗"
};

const categoryImages = {
  "机械臂": "/assets/robots/robot-arm.png",
  "移动/复合机器人": "/assets/robots/mobile-manipulator.png",
  "人形机器人": "/assets/robots/humanoid.png",
  "机器狗": "/assets/robots/robot-dog.png"
};

const defaultTags = {
  "机械臂": ["协作臂"],
  "移动/复合机器人": ["移动操作"],
  "人形机器人": ["科研开发套件"],
  "机器狗": ["科研开发"]
};

const releaseHints = {
  "unitree-g1": ["2024-05", "medium"],
  "unitree-r1-air": ["2025-07", "medium"],
  "unitree-r1-d": ["2025-07", "medium"],
  "unitree-h1": ["2023", "medium"],
  "unitree-go2": ["2023", "medium"],
  "unitree-b2": ["2023", "medium"],
  "unitree-a2": ["2025", "medium"],
  "ur5e": ["2018", "medium"],
  "franka-research-3": ["2022", "medium"],
  "agilex-cobot-magic": ["2024", "medium"],
  "mobile-aloha": ["2024", "high"],
  "hello-robot-stretch-3": ["2023", "medium"]
};

const brandAliases = [
  ["Unitree", /宇树|Unitree/i],
  ["AgileX", /松灵|AgileX/i],
  ["DOBOT", /越疆|DOBOT/i],
  ["Universal Robots", /Universal Robots/i],
  ["Franka Robotics", /Franka/i],
  ["UFACTORY", /UFACTORY|xArm/i],
  ["DEEPRobotics", /云深处|DEEPRobotics/i],
  ["RealMan", /睿尔曼|RealMan/i],
  ["AUBO", /遨博|AUBO/i],
  ["JAKA", /节卡|JAKA/i],
  ["Elite Robots", /艾利特|Elite/i],
  ["Fourier", /傅利叶|Fourier/i],
  ["AgiBot", /智元|AgiBot/i],
  ["UBTECH", /优必选|UBTECH/i],
  ["Booster Robotics", /Booster/i],
  ["RobotEra", /星动纪元|RobotEra/i],
  ["Kinova", /Kinova/i],
  ["PAL Robotics", /PAL/i],
  ["Hello Robot", /Hello Robot/i],
  ["Robotnik", /Robotnik/i],
  ["Clearpath", /Clearpath/i],
  ["Elephant Robotics", /大象|Elephant/i],
  ["Hiwonder", /幻尔|Hiwonder/i],
  ["Yahboom", /亚博|Yahboom/i],
  ["ABB", /ABB/i],
  ["KUKA", /KUKA/i],
  ["FANUC", /FANUC/i],
  ["Yaskawa", /Yaskawa|安川/i],
  ["Techman", /Techman|达明/i],
  ["ROKAE", /ROKAE|珞石/i],
  ["Han's Robot", /Han's|大族/i],
  ["SIASUN", /SIASUN|新松/i],
  ["MiR", /Mobile Industrial Robots|MiR/i],
  ["OMRON", /OMRON|欧姆龙/i],
  ["LimX Dynamics", /逐际动力|LimX/i]
];

function slug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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

function sourceIdsFor(item) {
  return item.sourceIds.map((source) => {
    if (sourceIndex.has(source)) return source;
    return addSource(source, `${item.vendor} ${item.name} 官方资料`, item.officialUrl, "官网/产品页", "medium", "市场初筛候选的官方或产品系列入口；价格和详细配置需二次询价。");
  });
}

function enrich(robot) {
  const category = categoryMap[robot.category] || robot.category;
  const [releaseDate, releaseDateConfidence] = releaseHints[robot.id] || ["待核验", "unknown"];
  const tags = Array.from(new Set([...(robot.tags || []), ...(defaultTags[category] || []), ...(robot.shortlistTags || [])]));
  return {
    ...robot,
    category,
    image: categoryImages[category] || robot.image,
    releaseDate: robot.releaseDate || releaseDate,
    releaseDateConfidence: robot.releaseDateConfidence || releaseDateConfidence,
    marketTier: robot.marketTier || "重点候选",
    brandNormalized: robot.brandNormalized || normalizeBrand(robot.vendor),
    tags
  };
}

const marketCandidates = [
  ["ur3e", "Universal Robots UR3e", "Universal Robots", "机械臂", "3 kg 级小型协作臂", "丹麦", false, "https://www.universal-robots.com/products/ur3e/", "2018", "medium", ["协作臂", "轻量臂"], ["SRC046"]],
  ["ur7e", "Universal Robots UR7e", "Universal Robots", "机械臂", "7.5 kg 级协作臂", "丹麦", false, "https://www.universal-robots.com/products/ur7e/", "2025", "medium", ["协作臂"], ["SRC046"]],
  ["ur10e", "Universal Robots UR10e", "Universal Robots", "机械臂", "12.5 kg 级协作臂", "丹麦", false, "https://www.universal-robots.com/products/ur10e/", "2018", "medium", ["协作臂", "工业臂"], ["SRC046"]],
  ["ur12e", "Universal Robots UR12e", "Universal Robots", "机械臂", "12 kg 级协作臂", "丹麦", false, "https://www.universal-robots.com/products/ur12e/", "2025", "medium", ["协作臂"], ["SRC046"]],
  ["ur16e", "Universal Robots UR16e", "Universal Robots", "机械臂", "16 kg 级协作臂", "丹麦", false, "https://www.universal-robots.com/products/ur16e/", "2019", "medium", ["协作臂", "工业臂"], ["SRC046"]],
  ["ur20", "Universal Robots UR20", "Universal Robots", "机械臂", "20 kg 级新一代协作臂", "丹麦", false, "https://www.universal-robots.com/products/ur20/", "2022", "medium", ["协作臂", "工业臂"], ["SRC046"]],
  ["ur30", "Universal Robots UR30", "Universal Robots", "机械臂", "30 kg 级重载协作臂", "丹麦", false, "https://www.universal-robots.com/products/ur30/", "2023-11", "medium", ["协作臂", "工业臂"], ["SRC046"]],
  ["dobot-cr3", "DOBOT CR3", "越疆 DOBOT", "机械臂", "3 kg 协作机械臂", "中国", true, "https://www.dobot.cn/products/cr-series/dobot-cr-series.html?lang=cn", "待核验", "unknown", ["协作臂", "轻量臂"], ["SRC022"]],
  ["dobot-cr7", "DOBOT CR7", "越疆 DOBOT", "机械臂", "7 kg 协作机械臂", "中国", true, "https://www.dobot.cn/products/cr-series/dobot-cr-series.html?lang=cn", "待核验", "unknown", ["协作臂"], ["SRC022"]],
  ["dobot-cr10", "DOBOT CR10", "越疆 DOBOT", "机械臂", "10 kg 协作机械臂", "中国", true, "https://www.dobot.cn/products/cr-series/dobot-cr-series.html?lang=cn", "待核验", "unknown", ["协作臂", "工业臂"], ["SRC022"]],
  ["dobot-cr12", "DOBOT CR12", "越疆 DOBOT", "机械臂", "12 kg 协作机械臂", "中国", true, "https://www.dobot.cn/products/cr-series/dobot-cr-series.html?lang=cn", "待核验", "unknown", ["协作臂", "工业臂"], ["SRC022"]],
  ["dobot-cr16", "DOBOT CR16", "越疆 DOBOT", "机械臂", "16 kg 协作机械臂", "中国", true, "https://www.dobot.cn/products/cr-series/dobot-cr-series.html?lang=cn", "待核验", "unknown", ["协作臂", "工业臂"], ["SRC022"]],
  ["dobot-cr20a", "DOBOT CR20A", "越疆 DOBOT", "机械臂", "20 kg 级协作机械臂", "中国", true, "https://www.dobot.cn/products/cr-series/dobot-cr-series.html?lang=cn", "待核验", "unknown", ["协作臂", "工业臂"], ["SRC022"]],
  ["dobot-nova2", "DOBOT Nova 2", "越疆 DOBOT", "机械臂", "轻量商用协作臂", "中国", true, "https://www.dobot-robots.com/products/nova-series/nova2.html", "待核验", "unknown", ["协作臂", "轻量臂"], ["SRCV3001"]],
  ["dobot-nova5", "DOBOT Nova 5", "越疆 DOBOT", "机械臂", "商用协作臂", "中国", true, "https://www.dobot-robots.com/products/nova-series/nova5.html", "待核验", "unknown", ["协作臂"], ["SRCV3002"]],
  ["aubo-i3", "AUBO i3", "遨博 AUBO", "机械臂", "3 kg 协作机械臂", "中国", true, "https://www.aubo-robotics.cn/", "待核验", "unknown", ["协作臂", "轻量臂"], ["SRC025"]],
  ["aubo-i7", "AUBO i7", "遨博 AUBO", "机械臂", "7 kg 协作机械臂", "中国", true, "https://www.aubo-robotics.cn/", "待核验", "unknown", ["协作臂"], ["SRC025"]],
  ["aubo-i10", "AUBO i10", "遨博 AUBO", "机械臂", "10 kg 协作机械臂", "中国", true, "https://www.aubo-robotics.cn/", "待核验", "unknown", ["协作臂", "工业臂"], ["SRC025"]],
  ["jaka-mini", "JAKA MiniCobo", "节卡 JAKA", "机械臂", "迷你协作臂", "中国", true, "https://www.jaka.com.cn/", "待核验", "unknown", ["协作臂", "轻量臂"], ["SRC027"]],
  ["jaka-zu3", "JAKA Zu 3", "节卡 JAKA", "机械臂", "3 kg 协作机械臂", "中国", true, "https://www.jaka.com.cn/", "待核验", "unknown", ["协作臂"], ["SRC027"]],
  ["jaka-zu12", "JAKA Zu 12", "节卡 JAKA", "机械臂", "12 kg 协作机械臂", "中国", true, "https://www.jaka.com.cn/", "待核验", "unknown", ["协作臂", "工业臂"], ["SRC027"]],
  ["elite-ec63", "Elite Robots EC63", "艾利特 Elite Robots", "机械臂", "3 kg 协作臂", "中国", true, "https://www.elibot.cn/", "待核验", "unknown", ["协作臂"], ["SRC026"]],
  ["elite-ec612", "Elite Robots EC612", "艾利特 Elite Robots", "机械臂", "12 kg 协作臂", "中国", true, "https://www.elibot.cn/", "待核验", "unknown", ["协作臂", "工业臂"], ["SRC026"]],
  ["realman-rm65", "RealMan RM65", "睿尔曼 RealMan", "机械臂", "轻量 6 自由度机械臂", "中国", true, "https://www.realman-robotics.com/", "待核验", "unknown", ["轻量臂", "协作臂"], ["SRC028"]],
  ["realman-rm75", "RealMan RM75", "睿尔曼 RealMan", "机械臂", "轻量 7 自由度机械臂", "中国", true, "https://www.realman-robotics.com/", "待核验", "unknown", ["轻量臂", "协作臂"], ["SRC028"]],
  ["xarm-5", "xArm 5", "UFACTORY", "机械臂", "5 自由度轻量机械臂", "中国", true, "https://www.ufactory.cc/xarm-collaborative-robot/", "待核验", "unknown", ["协作臂", "轻量臂"], ["SRC018"]],
  ["mycobot-320", "myCobot 320", "大象机器人 Elephant Robotics", "机械臂", "桌面六轴机械臂", "中国", true, "https://www.elephantrobotics.com/en/mycobot-320/", "待核验", "unknown", ["桌面机械臂", "开源/低成本"], ["SRC030"]],
  ["mycobot-pro-600", "myCobot Pro 600", "大象机器人 Elephant Robotics", "机械臂", "教育/轻工业机械臂", "中国", true, "https://www.elephantrobotics.com/", "待核验", "unknown", ["桌面机械臂", "教学"], ["SRC030"]],
  ["franka-panda", "Franka Emika Panda", "Franka Robotics", "机械臂", "7 自由度经典科研机械臂", "德国", false, "https://franka.de/", "2016", "low", ["协作臂", "科研开发"], ["SRC044"]],

  ["unitree-go1", "Unitree Go1", "宇树科技 Unitree", "机器狗", "消费/教育四足机器人", "中国", true, "https://www.unitree.com/", "2021", "medium", ["消费级", "教育版"], ["SRC002"]],
  ["unitree-b1", "Unitree B1", "宇树科技 Unitree", "机器狗", "工业四足机器人", "中国", true, "https://www.unitree.com/", "待核验", "unknown", ["工业巡检", "负载型"], ["SRC006"]],
  ["unitree-laikago", "Unitree Laikago", "宇树科技 Unitree", "机器狗", "早期科研四足平台", "中国", true, "https://www.unitree.com/", "待核验", "unknown", ["科研开发"], ["SRC002"]],
  ["deeprobotics-lite3-motion", "DEEPRobotics Lite3 Motion", "云深处科技", "机器狗", "教育科研四足机器人", "中国", true, "https://www.deeprobotics.cn/robot/index/product2.html", "待核验", "unknown", ["教育版", "科研开发"], ["SRC011"]],
  ["deeprobotics-lite3-pro", "DEEPRobotics Lite3 Pro", "云深处科技", "机器狗", "科研四足机器人", "中国", true, "https://www.deeprobotics.cn/robot/index/product2.html", "待核验", "unknown", ["科研开发"], ["SRC011"]],
  ["anybotics-anymal-d", "ANYbotics ANYmal D", "ANYbotics", "机器狗", "工业巡检四足机器人", "瑞士", false, "https://www.anybotics.com/anymal-autonomous-legged-robot/", "待核验", "unknown", ["工业巡检"], ["SRCV3003"]],
  ["anybotics-anymal-x", "ANYbotics ANYmal X", "ANYbotics", "机器狗", "防爆工业巡检四足机器人", "瑞士", false, "https://www.anybotics.com/anymal-x/", "待核验", "unknown", ["工业巡检"], ["SRCV3004"]],
  ["boston-spot", "Boston Dynamics Spot", "Boston Dynamics", "机器狗", "工业/科研四足机器人", "美国", false, "https://bostondynamics.com/products/spot/", "2020", "medium", ["工业巡检", "科研开发"], ["SRCV3005"]],
  ["ghost-vision-60", "Ghost Robotics Vision 60", "Ghost Robotics", "机器狗", "户外四足机器人", "美国", false, "https://www.ghostrobotics.io/robots/vision-60", "待核验", "unknown", ["工业巡检", "负载型"], ["SRCV3006"]],
  ["rainbow-robotics-rbq", "Rainbow Robotics RBQ", "Rainbow Robotics", "机器狗", "四足机器人平台", "韩国", false, "https://www.rainbow-robotics.com/", "待核验", "unknown", ["科研开发"], ["SRCV3007"]],
  ["sony-aibo", "Sony aibo", "Sony", "机器狗", "消费级陪伴机器狗", "日本", false, "https://us.aibo.com/", "2018", "medium", ["消费级"], ["SRCV3008"]],
  ["xiaomi-cyberdog", "Xiaomi CyberDog", "小米 Xiaomi", "机器狗", "开源四足机器人", "中国", true, "https://www.mi.com/cyberdog", "2021", "medium", ["消费级", "科研开发"], ["SRC016"]],

  ["unitree-h1-2", "Unitree H1-2", "宇树科技 Unitree", "人形机器人", "全尺寸人形机器人", "中国", true, "https://www.unitree.com/cn/h1/", "待核验", "unknown", ["全尺寸", "科研开发套件"], ["SRC005"]],
  ["fourier-gr2", "Fourier GR-2", "傅利叶智能 Fourier", "人形机器人", "全尺寸人形机器人", "中国", true, "https://www.fftai.com/", "2024", "low", ["全尺寸", "科研开发套件"], ["SRC050"]],
  ["agibot-a2", "AgiBot A2", "智元机器人 AgiBot", "人形机器人", "远征系列人形机器人", "中国", true, "https://www.agibot.com/", "待核验", "unknown", ["全尺寸", "工业/商用"], ["SRC051"]],
  ["ubtech-walker-s1", "UBTECH Walker S1", "优必选 UBTECH", "人形机器人", "工业/商用人形机器人", "中国", true, "https://www.ubtrobot.com/", "待核验", "unknown", ["工业/商用", "全尺寸"], ["SRC052"]],
  ["engineai-se01", "EngineAI SE01", "众擎机器人 EngineAI", "人形机器人", "全尺寸人形机器人", "中国", true, "https://www.engineai.com.cn/", "待核验", "unknown", ["全尺寸", "科研开发套件"], ["SRC053"]],
  ["engineai-sa01", "EngineAI SA01", "众擎机器人 EngineAI", "人形机器人", "小型人形机器人", "中国", true, "https://www.engineai.com.cn/", "待核验", "unknown", ["小型人形", "教育版"], ["SRC053"]],
  ["booster-t1", "Booster T1", "Booster Robotics", "人形机器人", "科研开发人形机器人", "中国", true, "https://www.boosterobotics.com/", "待核验", "unknown", ["科研开发套件", "教育版"], ["SRC056"]],
  ["booster-a1", "Booster A1", "Booster Robotics", "人形机器人", "科研开发人形机器人", "中国", true, "https://www.boosterobotics.com/", "待核验", "unknown", ["科研开发套件"], ["SRC056"]],
  ["leju-kuavo", "Leju Kuavo", "乐聚机器人 Leju", "人形机器人", "开源鸿蒙人形机器人", "中国", true, "https://www.lejurobot.com/", "待核验", "unknown", ["开源人形", "科研开发套件"], ["SRC054", "SRC055"]],
  ["robotera-star1", "RobotEra STAR1", "星动纪元 RobotEra", "人形机器人", "全尺寸人形机器人", "中国", true, "https://www.robotera.com/", "待核验", "unknown", ["全尺寸", "科研开发套件"], ["SRC059"]],
  ["galbot-g1", "Galbot G1", "银河通用 Galbot", "人形机器人", "轮式/人形移动操作平台", "中国", true, "https://www.galbot.com/", "待核验", "unknown", ["工业/商用", "科研开发套件"], ["SRC058"]],
  ["kepler-forerunner", "Kepler Forerunner", "开普勒机器人", "人形机器人", "全尺寸人形机器人", "中国", true, "https://www.keplerrobotics.com/", "待核验", "unknown", ["全尺寸", "工业/商用"], ["SRC060"]],
  ["tesla-optimus", "Tesla Optimus", "Tesla", "人形机器人", "通用人形机器人", "美国", false, "https://www.tesla.com/AI", "2022", "medium", ["全尺寸", "工业/商用"], ["SRCV3009"]],
  ["figure-02", "Figure 02", "Figure AI", "人形机器人", "全尺寸人形机器人", "美国", false, "https://www.figure.ai/", "2024", "medium", ["全尺寸", "工业/商用"], ["SRCV3010"]],
  ["apptronik-apollo", "Apptronik Apollo", "Apptronik", "人形机器人", "商用人形机器人", "美国", false, "https://apptronik.com/apollo", "2023", "medium", ["全尺寸", "工业/商用"], ["SRCV3011"]],
  ["agility-digit", "Agility Robotics Digit", "Agility Robotics", "人形机器人", "物流人形机器人", "美国", false, "https://agilityrobotics.com/robots", "2020", "medium", ["工业/商用", "全尺寸"], ["SRCV3012"]],
  ["pal-talos", "PAL Robotics TALOS", "PAL Robotics", "人形机器人", "科研人形机器人", "西班牙", false, "https://pal-robotics.com/robots/talos/", "待核验", "unknown", ["科研开发套件", "全尺寸"], ["SRC064"]],
  ["robotis-op3", "ROBOTIS OP3", "Robotis", "人形机器人", "小型开源人形机器人", "韩国", false, "https://emanual.robotis.com/docs/en/platform/op3/introduction/", "待核验", "unknown", ["小型人形", "开源人形", "教育版"], ["SRCV3013"]],

  ["agilex-scout-mini", "AgileX Scout Mini", "松灵 AgileX", "移动/复合机器人", "小型户外移动底盘", "中国", true, "https://global.agilex.ai/products/scout-mini", "待核验", "unknown", ["轮式底盘", "科研开发"], ["SRC347"]],
  ["agilex-scout-2", "AgileX Scout 2.0", "松灵 AgileX", "移动/复合机器人", "四轮移动底盘", "中国", true, "https://global.agilex.ai/products/scout-2-0", "待核验", "unknown", ["轮式底盘", "服务/巡检"], ["SRC034"]],
  ["agilex-bunker-mini", "AgileX Bunker Mini", "松灵 AgileX", "移动/复合机器人", "履带式移动底盘", "中国", true, "https://global.agilex.ai/products/bunker-mini", "待核验", "unknown", ["轮式底盘", "服务/巡检"], ["SRC034"]],
  ["agilex-bunker-pro", "AgileX Bunker Pro", "松灵 AgileX", "移动/复合机器人", "重载履带式移动底盘", "中国", true, "https://global.agilex.ai/products/bunker-pro", "待核验", "unknown", ["轮式底盘", "服务/巡检"], ["SRC034"]],
  ["agilex-tracer", "AgileX Tracer", "松灵 AgileX", "移动/复合机器人", "室内移动底盘", "中国", true, "https://global.agilex.ai/pages/tracer", "待核验", "unknown", ["轮式底盘", "教学移动平台"], ["SRC349"]],
  ["agilex-hunter-se", "AgileX Hunter SE", "松灵 AgileX", "移动/复合机器人", "阿克曼移动底盘", "中国", true, "https://global.agilex.ai/products/hunter-se", "待核验", "unknown", ["轮式底盘"], ["SRC348"]],
  ["agilex-ranger-mini", "AgileX Ranger Mini", "松灵 AgileX", "移动/复合机器人", "全向移动底盘", "中国", true, "https://global.agilex.ai/", "待核验", "unknown", ["轮式底盘", "教学移动平台"], ["SRC034"]],
  ["clearpath-jackal", "Clearpath Jackal", "Clearpath Robotics", "移动/复合机器人", "户外 UGV", "加拿大", false, "https://clearpathrobotics.com/jackal-small-unmanned-ground-vehicle/", "待核验", "unknown", ["轮式底盘", "服务/巡检"], ["SRC345"]],
  ["clearpath-husky", "Clearpath Husky", "Clearpath Robotics", "移动/复合机器人", "户外 UGV", "加拿大", false, "https://clearpathrobotics.com/husky-unmanned-ground-vehicle-robot/", "待核验", "unknown", ["轮式底盘", "服务/巡检"], ["SRC346"]],
  ["turtlebot4-standard", "TurtleBot 4 Standard", "Robotis / Clearpath", "移动/复合机器人", "ROS2 教学移动平台", "韩国/加拿大", false, "https://turtlebot.github.io/turtlebot4-user-manual/", "2022", "low", ["教学移动平台", "轮式底盘"], ["SRC350"]],
  ["turtlebot4-lite", "TurtleBot 4 Lite", "Robotis / Clearpath", "移动/复合机器人", "ROS2 教学移动平台", "韩国/加拿大", false, "https://turtlebot.github.io/turtlebot4-user-manual/", "2022", "low", ["教学移动平台", "轮式底盘"], ["SRC350"]],
  ["robotnik-rb1-base", "Robotnik RB-1 Base", "Robotnik", "移动/复合机器人", "室内移动底盘", "西班牙", false, "https://robotnik.eu/products/mobile-robots/rb-1-base/", "待核验", "unknown", ["轮式底盘", "教学移动平台"], ["SRC118"]],
  ["robotnik-summit-xl", "Robotnik SUMMIT-XL", "Robotnik", "移动/复合机器人", "全地形移动平台", "西班牙", false, "https://robotnik.eu/products/mobile-robots/summit-xl/", "待核验", "unknown", ["轮式底盘", "服务/巡检"], ["SRC118"]],
  ["pal-tiago-pro", "PAL Robotics TIAGo Pro", "PAL Robotics", "移动/复合机器人", "双臂移动操作平台", "西班牙", false, "https://pal-robotics.com/robots/tiago-pro/", "待核验", "unknown", ["移动操作", "双臂移动平台"], ["SRC064"]],
  ["fetch-mobile-manipulator", "Fetch Mobile Manipulator", "Fetch Robotics / Zebra", "移动/复合机器人", "经典移动操作平台", "美国", false, "https://fetchrobotics.com/", "待核验", "unknown", ["移动操作"], ["SRCV3014"]],
  ["stretch-2", "Hello Robot Stretch 2", "Hello Robot", "移动/复合机器人", "移动操作科研平台", "美国", false, "https://hello-robot.com/", "待核验", "unknown", ["移动操作", "教学移动平台"], ["SRC061"]],
  ["limx-w1", "LimX Dynamics W1", "逐际动力 LimX Dynamics", "移动/复合机器人", "轮足机器人平台", "中国", true, "https://www.limxdynamics.com/", "待核验", "unknown", ["轮足/足式", "科研开发"], ["SRC017"]],
  ["limx-tron1", "LimX Dynamics TRON 1", "逐际动力 LimX Dynamics", "移动/复合机器人", "多形态双足/轮足平台", "中国", true, "https://www.limxdynamics.com/", "待核验", "unknown", ["轮足/足式", "科研开发"], ["SRC017"]],
  ["yahboom-rosmaster-x3-plus", "Yahboom ROSMASTER X3 Plus", "亚博智能 Yahboom", "移动/复合机器人", "ROS 教学移动平台", "中国", true, "https://category.yahboom.net/products/rosmaster-x3", "待核验", "unknown", ["教学移动平台", "轮式底盘"], ["SRC043"]],
  ["hiwonder-jetauto", "Hiwonder JetAuto", "幻尔 Hiwonder", "移动/复合机器人", "ROS 教学移动平台", "中国", true, "https://www.hiwonder.com/products/jetauto-pro", "待核验", "unknown", ["教学移动平台", "轮式底盘"], ["SRC040"]],

  ["abb-gofa-crb15000", "ABB GoFa CRB 15000", "ABB Robotics", "机械臂", "协作机械臂", "瑞士/瑞典", false, "https://new.abb.com/products/robotics/robots/collaborative-robots/gofa", "2021", "medium", ["协作臂", "工业臂"], ["SRCV3015"]],
  ["abb-yumi-irb14000", "ABB YuMi IRB 14000", "ABB Robotics", "机械臂", "双臂协作机器人", "瑞士/瑞典", false, "https://new.abb.com/products/robotics/robots/collaborative-robots/yumi", "2015", "medium", ["协作臂", "双臂"], ["SRCV3016"]],
  ["kuka-lbr-iiwa", "KUKA LBR iiwa", "KUKA", "机械臂", "7 自由度轻量协作臂", "德国", false, "https://www.kuka.com/en-de/products/robotics-systems/industrial-robots/lbr-iiwa", "2013", "low", ["协作臂", "轻量臂"], ["SRCV3017"]],
  ["kuka-lbr-iisy", "KUKA LBR iisy", "KUKA", "机械臂", "易用型协作机械臂", "德国", false, "https://www.kuka.com/en-de/products/robotics-systems/industrial-robots/lbr-iisy", "2022", "medium", ["协作臂", "轻量臂"], ["SRCV3018"]],
  ["fanuc-crx-10ia-l", "FANUC CRX-10iA/L", "FANUC", "机械臂", "10 kg 级协作臂", "日本", false, "https://www.fanucamerica.com/products/robots/series/collaborative-robots", "2019", "medium", ["协作臂", "工业臂"], ["SRCV3019"]],
  ["fanuc-crx-25ia", "FANUC CRX-25iA", "FANUC", "机械臂", "25 kg 级协作臂", "日本", false, "https://www.fanucamerica.com/products/robots/series/collaborative-robots", "待核验", "unknown", ["协作臂", "工业臂"], ["SRCV3019"]],
  ["yaskawa-hc10dt", "Yaskawa HC10DT", "Yaskawa Motoman", "机械臂", "10 kg 级协作臂", "日本", false, "https://www.motoman.com/en-us/products/robots/industrial/collaborative", "待核验", "unknown", ["协作臂", "工业臂"], ["SRCV3020"]],
  ["techman-tm5-700", "Techman TM5-700", "达明 Techman Robot", "机械臂", "协作机械臂", "中国台湾", false, "https://www.tm-robot.com/en/products/tm5-700/", "待核验", "unknown", ["协作臂", "轻量臂"], ["SRCV3021"]],
  ["techman-tm12", "Techman TM12", "达明 Techman Robot", "机械臂", "12 kg 级协作臂", "中国台湾", false, "https://www.tm-robot.com/en/products/tm12/", "待核验", "unknown", ["协作臂", "工业臂"], ["SRCV3022"]],
  ["rokae-xmate-cr7", "ROKAE xMate CR7", "珞石 ROKAE", "机械臂", "7 kg 协作机械臂", "中国", true, "https://www.rokae.com/", "待核验", "unknown", ["协作臂", "轻量臂"], ["SRCV3023"]],
  ["hans-elfin-e5", "Han's Robot Elfin E5", "大族机器人 Han's Robot", "机械臂", "5 kg 级协作臂", "中国", true, "https://www.hansrobot.net/", "待核验", "unknown", ["协作臂", "轻量臂"], ["SRCV3024"]],
  ["siasun-gcr5", "SIASUN GCR5", "新松机器人 SIASUN", "机械臂", "5 kg 级协作臂", "中国", true, "https://www.siasun.com/", "待核验", "unknown", ["协作臂", "工业臂"], ["SRCV3025"]],

  ["unitree-go2-edu", "Unitree Go2 EDU", "宇树科技 Unitree", "机器狗", "教育开发四足机器人", "中国", true, "https://www.unitree.com/go2/", "2023", "medium", ["教育版", "科研开发"], ["SRC002"]],
  ["unitree-b2-w", "Unitree B2-W", "宇树科技 Unitree", "机器狗", "轮足四足机器人", "中国", true, "https://www.unitree.com/b2-w/", "2024", "medium", ["轮足/足式", "负载型"], ["SRC006"]],
  ["deeprobotics-x20", "DEEPRobotics X20", "云深处科技", "机器狗", "工业级四足机器人", "中国", true, "https://www.deeprobotics.cn/en/index/product1.html", "待核验", "unknown", ["工业巡检", "负载型"], ["SRCV3026"]],
  ["deeprobotics-x30", "DEEPRobotics X30", "云深处科技", "机器狗", "工业巡检四足机器人", "中国", true, "https://www.deeprobotics.cn/en/index/product1.html", "待核验", "unknown", ["工业巡检", "负载型"], ["SRCV3026"]],
  ["anybotics-anymal-c", "ANYbotics ANYmal C", "ANYbotics", "机器狗", "工业巡检四足机器人", "瑞士", false, "https://www.anybotics.com/anymal-autonomous-legged-robot/", "待核验", "unknown", ["工业巡检", "科研开发"], ["SRCV3003"]],

  ["unitree-g1-edu", "Unitree G1 EDU", "宇树科技 Unitree", "人形机器人", "教育科研人形机器人", "中国", true, "https://www.unitree.com/g1/", "2024-05", "medium", ["科研开发套件", "教育版"], ["SRC001"]],
  ["boston-atlas-electric", "Boston Dynamics Atlas", "Boston Dynamics", "人形机器人", "电驱人形机器人", "美国", false, "https://bostondynamics.com/atlas/", "2024", "medium", ["全尺寸", "工业/商用"], ["SRCV3027"]],
  ["sanctuary-phoenix", "Sanctuary Phoenix", "Sanctuary AI", "人形机器人", "通用人形机器人", "加拿大", false, "https://www.sanctuary.ai/phoenix", "2023", "medium", ["全尺寸", "工业/商用"], ["SRCV3028"]],
  ["neura-4ne1", "NEURA 4NE-1", "NEURA Robotics", "人形机器人", "认知人形机器人", "德国", false, "https://www.neura-robotics.com/", "2024", "low", ["全尺寸", "工业/商用"], ["SRCV3029"]],
  ["1x-neo", "1X NEO", "1X Technologies", "人形机器人", "家用/服务人形机器人", "挪威/美国", false, "https://www.1x.tech/neo", "2024", "medium", ["全尺寸", "工业/商用"], ["SRCV3030"]],
  ["xiaomi-cyberone", "Xiaomi CyberOne", "小米 Xiaomi", "人形机器人", "全尺寸人形机器人", "中国", true, "https://www.mi.com/global/discover/article?id=2700", "2022", "medium", ["全尺寸", "科研开发套件"], ["SRCV3031"]],

  ["mir100", "MiR100", "Mobile Industrial Robots", "移动/复合机器人", "自主移动机器人", "丹麦", false, "https://www.mobile-industrial-robots.com/solutions/robots/", "待核验", "unknown", ["轮式底盘", "服务/巡检"], ["SRCV3032"]],
  ["mir250", "MiR250", "Mobile Industrial Robots", "移动/复合机器人", "自主移动机器人", "丹麦", false, "https://www.mobile-industrial-robots.com/solutions/robots/mir250/", "待核验", "unknown", ["轮式底盘", "服务/巡检"], ["SRCV3033"]],
  ["mir600", "MiR600", "Mobile Industrial Robots", "移动/复合机器人", "重载自主移动机器人", "丹麦", false, "https://www.mobile-industrial-robots.com/solutions/robots/mir600/", "待核验", "unknown", ["轮式底盘", "服务/巡检"], ["SRCV3034"]],
  ["omron-ld60", "OMRON LD-60", "OMRON Robotics", "移动/复合机器人", "室内 AMR 平台", "日本", false, "https://automation.omron.com/en/us/products/family/LD", "待核验", "unknown", ["轮式底盘", "服务/巡检"], ["SRCV3035"]],
  ["omron-ld90", "OMRON LD-90", "OMRON Robotics", "移动/复合机器人", "室内 AMR 平台", "日本", false, "https://automation.omron.com/en/us/products/family/LD", "待核验", "unknown", ["轮式底盘", "服务/巡检"], ["SRCV3035"]],
  ["kuka-kmp-600-s", "KUKA KMP 600-S", "KUKA", "移动/复合机器人", "工业移动平台", "德国", false, "https://www.kuka.com/en-de/products/mobility/mobile-platforms/kmp-600-s", "待核验", "unknown", ["轮式底盘", "服务/巡检"], ["SRCV3036"]],
  ["neobotix-mpo-700", "Neobotix MPO-700", "Neobotix", "移动/复合机器人", "全向移动机器人", "德国", false, "https://www.neobotix-robots.com/mobile-robots/omnidirectional-robots/mpo-700", "待核验", "unknown", ["轮式底盘", "教学移动平台"], ["SRCV3037"]],
  ["husarion-panther", "Husarion Panther", "Husarion", "移动/复合机器人", "ROS2 户外移动平台", "波兰", false, "https://husarion.com/manuals/panther/", "待核验", "unknown", ["轮式底盘", "教学移动平台"], ["SRCV3038"]]
];

const robots = data.robots.map(enrich);

for (const item of marketCandidates) {
  const [id, name, vendor, category, formFactor, country, domesticPriority, officialUrl, releaseDate, releaseDateConfidence, tags, rawSourceIds] = item;
  if (existingIds.has(id) || robots.some((robot) => robot.id === id)) continue;
  const sourceIds = sourceIdsFor({ id, name, vendor, officialUrl, sourceIds: rawSourceIds });
  robots.push({
    id,
    name,
    vendor,
    category,
    formFactor,
    country,
    domesticPriority,
    officialUrl,
    image: categoryImages[category],
    lastChecked: accessedDate,
    releaseDate,
    releaseDateConfidence,
    marketTier: "市场初筛",
    brandNormalized: normalizeBrand(vendor),
    tags: Array.from(new Set(tags)),
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
      dof: "待核验",
      payloadKg: "待核验",
      reachM: "待核验",
      repeatabilityMm: "待核验",
      speed: "待核验",
      endurance: "待核验",
      weightKg: "待核验",
      sensors: "待核验",
      compute: "待核验",
      safety: "待核验"
    },
    software: {
      ros: "待核验",
      ros2: "待核验",
      sdk: "待核验",
      sim: "待核验"
    },
    researchEvidence: ["市场初筛候选：已确认官网或产品系列入口，科研使用、SDK、ROS/ROS2 和论文证据需后续分批补强。"],
    deploymentEvidence: ["市场初筛候选：部署、维保、交付和售后需以厂商或代理正式资料为准。"],
    risks: ["信息深度低于重点候选，采购前必须补充正式报价、参数表和售后条款。"],
    scores: {
      research: 26,
      deployment: 26,
      overall: 52
    },
    shortlistTags: [],
    sourceIds
  });
}

const categoryOrder = ["机械臂", "移动/复合机器人", "人形机器人", "机器狗"];
robots.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) || a.marketTier.localeCompare(b.marketTier, "zh-CN") || b.scores.overall - a.scores.overall);

const enhanced = {
  ...data,
  meta: {
    ...data.meta,
    version: "v3",
    accessedDate,
    updateSummary: "扩充市场初筛候选；新增发布时间、品牌归一、市场层级和细分类别标签；四大类统一为机械臂、移动/复合机器人、人形机器人、机器狗。"
  },
  sources,
  robots
};

for (const path of outputPaths) {
  fs.writeFileSync(path, JSON.stringify(enhanced, null, 2) + "\n");
}

const csvRows = [["id", "title", "type", "confidence", "url", "notes"], ...sources.map((source) => [source.id, source.title, source.type, source.confidence, source.url, source.notes])];
fs.writeFileSync("outputs/来源追踪-v2.csv", csvRows.map((row) => row.map(csvEscape).join(",")).join("\n") + "\n");

const counts = Object.fromEntries(categoryOrder.map((category) => [category, robots.filter((robot) => robot.category === category).length]));
const tiers = Object.fromEntries(["重点候选", "市场初筛"].map((tier) => [tier, robots.filter((robot) => robot.marketTier === tier).length]));

fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", `# 学校具身智能机器人采购调研 v3\n\n更新时间：${accessedDate}\n\n## 数据概览\n\n- 候选设备：${robots.length} 个\n- 来源记录：${sources.length} 条\n- 市场层级：重点候选 ${tiers["重点候选"]} 个，市场初筛 ${tiers["市场初筛"]} 个\n- 类别分布：${categoryOrder.map((category) => `${category} ${counts[category]} 个`).join("，")}\n- 新增字段：产品发布时间、发布时间置信度、品牌归一、市场层级、细分类别标签\n\n## 使用说明\n\n市场初筛候选用于扩大品牌和型号覆盖面；正式采购前仍需对目标短名单补充价格、SDK、ROS/ROS2、交付和售后条款。\n`);

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

console.log(JSON.stringify({ robots: robots.length, sources: sources.length, counts, tiers }, null, 2));
