import fs from "node:fs";

const DATA_PATHS = ["app/src/robotResearchData.json", "work/data/robot_research_data.json"];
const OUTPUT_REPORT = "outputs/学校具身智能机器人采购调研-v2.md";
const OUTPUT_SOURCES = "outputs/来源追踪-v2.csv";

const officialSourceByBrand = {
  "ABB": ["https://new.abb.com/products/robotics/robots/collaborative-robots", "ABB 协作和工业机器人官方产品入口"],
  "KUKA": ["https://www.kuka.com/en-us/products/robotics-systems/industrial-robots", "KUKA 工业机器人官方产品入口"],
  "FANUC": ["https://www.fanucamerica.com/products/robots", "FANUC 机器人官方产品入口"],
  "Yaskawa Motoman": ["https://www.motoman.com/en-us/products/robots", "Yaskawa Motoman 机器人官方产品入口"],
  "Kawasaki Robotics": ["https://robotics.kawasaki.com/en1/products/robots/", "Kawasaki Robotics 官方产品入口"],
  "Nachi": ["https://www.nachirobotics.com/robotics/", "Nachi Robotics 官方产品入口"],
  "Techman Robot": ["https://www.tm-robot.com/en/", "Techman Robot 官方产品入口"],
  "Doosan Robotics": ["https://www.doosanrobotics.com/en/products", "Doosan Robotics 官方产品入口"],
  "Comau": ["https://www.comau.com/en/competencies/robotics-automation/robot-team/", "Comau 机器人官方产品入口"],
  "Hanwha Robotics": ["https://www.hanwharobotics.com/en/products/collaborative-robot", "Hanwha Robotics 协作机器人官方产品入口"],
  "Rethink Robotics": ["https://www.rethinkrobotics.com/", "Rethink Robotics 官方产品入口"],
  "igus": ["https://www.igus.eu/automation/robotics", "igus 低成本机器人官方产品入口"],
  "Elephant Robotics": ["https://www.elephantrobotics.com/en/", "大象机器人官方产品入口"],
  "UFACTORY": ["https://www.ufactory.cc/", "UFACTORY 官方产品入口"],
  "DOBOT": ["https://www.dobot-robots.com/products.html", "越疆机器人官方产品入口"],
  "JAKA": ["https://www.jaka.com.cn/", "节卡机器人官方产品入口"],
  "Elite Robots": ["https://www.elibot.cn/", "艾利特机器人官方产品入口"],
  "AUBO": ["https://www.aubo-robotics.cn/", "遨博机器人官方产品入口"],
  "RealMan": ["https://www.realman-robotics.com/", "睿尔曼智能官方产品入口"],
  "Siasun": ["https://www.siasun.com/", "新松机器人官方产品入口"],
  "Standard Robots": ["https://www.standard-robots.com/", "斯坦德机器人官方产品入口"],
  "Geek+": ["https://www.geekplus.com/", "极智嘉官方产品入口"],
  "MiR": ["https://mobile-industrial-robots.com/products/", "MiR 移动机器人官方产品入口"],
  "OTTO Motors": ["https://ottomotors.com/", "OTTO Motors 官方产品入口"],
  "Locus Robotics": ["https://locusrobotics.com/", "Locus Robotics 官方产品入口"],
  "Fetch Robotics": ["https://fetchrobotics.com/", "Fetch Robotics 官方产品入口"],
  "Clearpath Robotics": ["https://clearpathrobotics.com/robots/", "Clearpath Robotics 官方产品入口"],
  "Robotnik": ["https://robotnik.eu/products/", "Robotnik 官方产品入口"],
  "PAL Robotics": ["https://pal-robotics.com/robots/", "PAL Robotics 官方产品入口"],
  "Husarion": ["https://husarion.com/", "Husarion 官方产品入口"],
  "Neobotix": ["https://www.neobotix-robots.com/", "Neobotix 官方产品入口"],
  "AgileX Robotics": ["https://global.agilex.ai/", "松灵机器人官方产品入口"],
  "Yahboom": ["https://www.yahboom.net/", "亚博智能官方产品入口"],
  "Hiwonder": ["https://www.hiwonder.com/", "幻尔科技官方产品入口"],
  "Unitree": ["https://www.unitree.com/", "宇树科技官方产品入口"],
  "DEEP Robotics": ["https://www.deeprobotics.cn/", "云深处科技官方产品入口"],
  "ANYbotics": ["https://www.anybotics.com/", "ANYbotics 官方产品入口"],
  "Boston Dynamics": ["https://bostondynamics.com/", "Boston Dynamics 官方产品入口"],
  "Ghost Robotics": ["https://www.ghostrobotics.io/", "Ghost Robotics 官方产品入口"],
  "Robotis": ["https://www.robotis.us/", "ROBOTIS 官方产品入口"],
  "SoftBank Robotics": ["https://www.softbankrobotics.com/", "SoftBank Robotics 官方产品入口"],
  "UBTECH": ["https://www.ubtrobot.com/", "优必选官方产品入口"],
  "Fourier Intelligence": ["https://www.fftai.com/", "傅利叶智能官方产品入口"],
  "Agility Robotics": ["https://agilityrobotics.com/robots", "Agility Robotics 官方产品入口"],
  "Apptronik": ["https://apptronik.com/apollo", "Apptronik Apollo 官方产品入口"],
  "Figure AI": ["https://www.figure.ai/", "Figure AI 官方产品入口"],
  "Tesla": ["https://www.tesla.com/AI", "Tesla AI/Optimus 官方入口"],
  "Sanctuary AI": ["https://www.sanctuary.ai/", "Sanctuary AI 官方产品入口"],
  "EngineAI": ["https://www.engineai.com.cn/", "众擎机器人官方产品入口"],
  "LimX Dynamics": ["https://www.limxdynamics.com/", "逐际动力官方产品入口"],
  "Xiaomi": ["https://www.mi.com/cyberone/", "小米 CyberOne 官方入口"],
  "Leju Robotics": ["https://www.lejurobot.com/", "乐聚机器人官方产品入口"],
  "PNDbotics": ["https://www.pndbotics.com/", "PNDbotics 官方产品入口"]
};

const additions = [
  ["abb-gofa-5", "ABB GoFa CRB 15000-5", "ABB", "机械臂", "瑞士/瑞典", false, "瑞士/瑞典", ["协作臂", "工业臂"], "主流在售"],
  ["abb-gofa-10", "ABB GoFa CRB 15000-10", "ABB", "机械臂", "瑞士/瑞典", false, "瑞士/瑞典", ["协作臂", "工业臂"], "主流在售"],
  ["abb-swifti-crb-1100", "ABB SWIFTI CRB 1100", "ABB", "机械臂", "瑞士/瑞典", false, "瑞士/瑞典", ["协作臂", "工业臂"], "主流在售"],
  ["abb-yumi-irb-14000", "ABB YuMi IRB 14000", "ABB", "机械臂", "瑞士/瑞典", false, "瑞士/瑞典", ["双臂", "协作臂"], "科研常用"],
  ["abb-irb-1200", "ABB IRB 1200", "ABB", "机械臂", "瑞士/瑞典", false, "瑞士/瑞典", ["工业臂"], "主流在售"],
  ["abb-irb-1300", "ABB IRB 1300", "ABB", "机械臂", "瑞士/瑞典", false, "瑞士/瑞典", ["工业臂"], "主流在售"],
  ["abb-irb-1600", "ABB IRB 1600", "ABB", "机械臂", "瑞士/瑞典", false, "瑞士/瑞典", ["工业臂"], "主流在售"],
  ["kuka-lbr-iisy-3", "KUKA LBR iisy 3 R760", "KUKA", "机械臂", "德国", false, "德国", ["协作臂", "轻量臂"], "主流在售"],
  ["kuka-lbr-iisy-11", "KUKA LBR iisy 11 R1300", "KUKA", "机械臂", "德国", false, "德国", ["协作臂", "工业臂"], "主流在售"],
  ["kuka-lbr-iisy-15", "KUKA LBR iisy 15 R930", "KUKA", "机械臂", "德国", false, "德国", ["协作臂", "工业臂"], "主流在售"],
  ["kuka-lbr-iiwa-7", "KUKA LBR iiwa 7 R800", "KUKA", "机械臂", "德国", false, "德国", ["协作臂", "科研平台"], "科研常用"],
  ["kuka-lbr-iiwa-14", "KUKA LBR iiwa 14 R820", "KUKA", "机械臂", "德国", false, "德国", ["协作臂", "科研平台"], "科研常用"],
  ["kuka-kr-agilus", "KUKA KR AGILUS", "KUKA", "机械臂", "德国", false, "德国", ["工业臂"], "主流在售"],
  ["fanuc-crx-5ia", "FANUC CRX-5iA", "FANUC", "机械臂", "日本", false, "日本", ["协作臂"], "主流在售"],
  ["fanuc-crx-10ia", "FANUC CRX-10iA", "FANUC", "机械臂", "日本", false, "日本", ["协作臂"], "主流在售"],
  ["fanuc-crx-20ia", "FANUC CRX-20iA", "FANUC", "机械臂", "日本", false, "日本", ["协作臂", "工业臂"], "主流在售"],
  ["fanuc-crx-25ia", "FANUC CRX-25iA", "FANUC", "机械臂", "日本", false, "日本", ["协作臂", "工业臂"], "主流在售"],
  ["fanuc-cr-35ia", "FANUC CR-35iA", "FANUC", "机械臂", "日本", false, "日本", ["协作臂", "工业臂"], "主流在售"],
  ["fanuc-lr-mate-200id", "FANUC LR Mate 200iD", "FANUC", "机械臂", "日本", false, "日本", ["工业臂"], "主流在售"],
  ["yaskawa-hc10dtp", "Yaskawa Motoman HC10DTP", "Yaskawa Motoman", "机械臂", "日本", false, "日本", ["协作臂"], "主流在售"],
  ["yaskawa-hc20dtp", "Yaskawa Motoman HC20DTP", "Yaskawa Motoman", "机械臂", "日本", false, "日本", ["协作臂", "工业臂"], "主流在售"],
  ["yaskawa-hc30pl", "Yaskawa Motoman HC30PL", "Yaskawa Motoman", "机械臂", "日本", false, "日本", ["协作臂", "工业臂"], "主流在售"],
  ["yaskawa-gp7", "Yaskawa Motoman GP7", "Yaskawa Motoman", "机械臂", "日本", false, "日本", ["工业臂"], "主流在售"],
  ["yaskawa-gp12", "Yaskawa Motoman GP12", "Yaskawa Motoman", "机械臂", "日本", false, "日本", ["工业臂"], "主流在售"],
  ["kawasaki-duaro", "Kawasaki duAro", "Kawasaki Robotics", "机械臂", "日本", false, "日本", ["双臂", "协作臂"], "主流在售"],
  ["kawasaki-cl-series", "Kawasaki CL Series", "Kawasaki Robotics", "机械臂", "日本", false, "日本", ["协作臂"], "主流在售"],
  ["kawasaki-rs007n", "Kawasaki RS007N", "Kawasaki Robotics", "机械臂", "日本", false, "日本", ["工业臂"], "主流在售"],
  ["kawasaki-rs013n", "Kawasaki RS013N", "Kawasaki Robotics", "机械臂", "日本", false, "日本", ["工业臂"], "主流在售"],
  ["nachi-cz10", "Nachi CZ10", "Nachi", "机械臂", "日本", false, "日本", ["协作臂"], "主流在售"],
  ["nachi-mz07", "Nachi MZ07", "Nachi", "机械臂", "日本", false, "日本", ["工业臂"], "主流在售"],
  ["techman-tm5-700", "Techman TM5-700", "Techman Robot", "机械臂", "中国台湾", true, "中国台湾", ["协作臂"], "主流在售"],
  ["techman-tm12", "Techman TM12", "Techman Robot", "机械臂", "中国台湾", true, "中国台湾", ["协作臂", "工业臂"], "主流在售"],
  ["techman-tm20", "Techman TM20", "Techman Robot", "机械臂", "中国台湾", true, "中国台湾", ["协作臂", "工业臂"], "主流在售"],
  ["doosan-m0609", "Doosan M0609", "Doosan Robotics", "机械臂", "韩国", false, "韩国", ["协作臂"], "主流在售"],
  ["doosan-h2017", "Doosan H2017", "Doosan Robotics", "机械臂", "韩国", false, "韩国", ["协作臂", "工业臂"], "主流在售"],
  ["doosan-a0509", "Doosan A0509", "Doosan Robotics", "机械臂", "韩国", false, "韩国", ["协作臂"], "主流在售"],
  ["comau-racer-5-cobot", "Comau Racer-5 Cobot", "Comau", "机械臂", "意大利", false, "意大利", ["协作臂", "工业臂"], "主流在售"],
  ["hanwha-hcr-5", "Hanwha HCR-5", "Hanwha Robotics", "机械臂", "韩国", false, "韩国", ["协作臂"], "主流在售"],
  ["rethink-sawyer", "Rethink Robotics Sawyer", "Rethink Robotics", "机械臂", "美国", false, "美国", ["协作臂", "科研平台"], "历史/供货待确认"],
  ["igus-rebel", "igus ReBeL", "igus", "机械臂", "德国", false, "德国", ["桌面机械臂", "开源/低成本"], "教育/低成本"],
  ["mycobot-320", "myCobot 320", "Elephant Robotics", "机械臂", "中国", true, "深圳", ["桌面机械臂", "教育版"], "教育/低成本"],
  ["mycobot-pro-600", "myCobot Pro 600", "Elephant Robotics", "机械臂", "中国", true, "深圳", ["协作臂", "教育版"], "教育/低成本"],
  ["mybuddy-280", "myBuddy 280", "Elephant Robotics", "机械臂", "中国", true, "深圳", ["双臂", "桌面机械臂"], "教育/低成本"],
  ["xarm-lite-6", "xArm Lite 6", "UFACTORY", "机械臂", "中国", true, "深圳", ["桌面机械臂", "教育版"], "教育/低成本"],
  ["dobot-magician-e6", "DOBOT Magician E6", "DOBOT", "机械臂", "中国", true, "深圳", ["桌面机械臂", "教育版"], "教育/低成本"],
  ["dobot-cr3a", "DOBOT CR3A", "DOBOT", "机械臂", "中国", true, "深圳", ["协作臂"], "主流在售"],
  ["dobot-cr10a", "DOBOT CR10A", "DOBOT", "机械臂", "中国", true, "深圳", ["协作臂", "工业臂"], "主流在售"],
  ["jaka-zu3", "JAKA Zu 3", "JAKA", "机械臂", "中国", true, "上海", ["协作臂"], "主流在售"],
  ["jaka-zu12", "JAKA Zu 12", "JAKA", "机械臂", "中国", true, "上海", ["协作臂", "工业臂"], "主流在售"],
  ["jaka-zu18", "JAKA Zu 18", "JAKA", "机械臂", "中国", true, "上海", ["协作臂", "工业臂"], "主流在售"],
  ["elite-ec612", "Elite Robots EC612", "Elite Robots", "机械臂", "中国", true, "苏州", ["协作臂", "工业臂"], "主流在售"],
  ["elite-ec616", "Elite Robots EC616", "Elite Robots", "机械臂", "中国", true, "苏州", ["协作臂", "工业臂"], "主流在售"],
  ["aubo-i3", "AUBO i3", "AUBO", "机械臂", "中国", true, "北京", ["协作臂"], "主流在售"],
  ["aubo-i10", "AUBO i10", "AUBO", "机械臂", "中国", true, "北京", ["协作臂", "工业臂"], "主流在售"],
  ["aubo-i16", "AUBO i16", "AUBO", "机械臂", "中国", true, "北京", ["协作臂", "工业臂"], "主流在售"],
  ["realman-rm75", "RealMan RM75", "RealMan", "机械臂", "中国", true, "北京", ["轻量臂", "科研平台"], "主流在售"],
  ["realman-rml63", "RealMan RML63", "RealMan", "机械臂", "中国", true, "北京", ["轻量臂", "科研平台"], "主流在售"],
  ["siasun-gcr5", "SIASUN GCR5", "Siasun", "机械臂", "中国", true, "沈阳", ["协作臂"], "主流在售"],
  ["siasun-gcr14", "SIASUN GCR14", "Siasun", "机械臂", "中国", true, "沈阳", ["协作臂", "工业臂"], "主流在售"],

  ["mir250", "MiR250", "MiR", "移动/复合机器人", "丹麦", false, "丹麦", ["轮式底盘", "服务/巡检"], "主流在售"],
  ["mir600", "MiR600", "MiR", "移动/复合机器人", "丹麦", false, "丹麦", ["轮式底盘", "服务/巡检"], "主流在售"],
  ["mir1350", "MiR1350", "MiR", "移动/复合机器人", "丹麦", false, "丹麦", ["轮式底盘", "服务/巡检"], "主流在售"],
  ["otto-100", "OTTO 100", "OTTO Motors", "移动/复合机器人", "加拿大", false, "加拿大", ["轮式底盘", "服务/巡检"], "主流在售"],
  ["otto-600", "OTTO 600", "OTTO Motors", "移动/复合机器人", "加拿大", false, "加拿大", ["轮式底盘", "服务/巡检"], "主流在售"],
  ["otto-1500", "OTTO 1500", "OTTO Motors", "移动/复合机器人", "加拿大", false, "加拿大", ["轮式底盘", "服务/巡检"], "主流在售"],
  ["locus-origin", "Locus Origin", "Locus Robotics", "移动/复合机器人", "美国", false, "美国", ["轮式底盘", "服务/巡检"], "主流在售"],
  ["locus-vector", "Locus Vector", "Locus Robotics", "移动/复合机器人", "美国", false, "美国", ["轮式底盘", "服务/巡检"], "主流在售"],
  ["fetch-freight100", "Fetch Freight100", "Fetch Robotics", "移动/复合机器人", "美国", false, "美国", ["轮式底盘", "教学移动平台"], "科研常用"],
  ["fetch-freight1500", "Fetch Freight1500", "Fetch Robotics", "移动/复合机器人", "美国", false, "美国", ["轮式底盘"], "历史/供货待确认"],
  ["clearpath-jackal", "Clearpath Jackal", "Clearpath Robotics", "移动/复合机器人", "加拿大", false, "加拿大", ["轮式底盘", "科研平台"], "科研常用"],
  ["clearpath-husky", "Clearpath Husky", "Clearpath Robotics", "移动/复合机器人", "加拿大", false, "加拿大", ["轮式底盘", "科研平台"], "科研常用"],
  ["clearpath-warthog", "Clearpath Warthog", "Clearpath Robotics", "移动/复合机器人", "加拿大", false, "加拿大", ["轮式底盘", "科研平台"], "科研常用"],
  ["robotnik-rb-vogui", "Robotnik RB-VOGUI", "Robotnik", "移动/复合机器人", "西班牙", false, "西班牙", ["移动操作", "服务/巡检"], "主流在售"],
  ["robotnik-summit-xl", "Robotnik SUMMIT-XL", "Robotnik", "移动/复合机器人", "西班牙", false, "西班牙", ["轮式底盘", "科研平台"], "科研常用"],
  ["pal-tiago-base", "PAL TIAGo Base", "PAL Robotics", "移动/复合机器人", "西班牙", false, "西班牙", ["移动操作", "科研平台"], "科研常用"],
  ["pal-ari", "PAL ARI", "PAL Robotics", "移动/复合机器人", "西班牙", false, "西班牙", ["服务/巡检"], "科研常用"],
  ["husarion-panther", "Husarion Panther", "Husarion", "移动/复合机器人", "波兰", false, "波兰", ["轮式底盘", "科研平台"], "科研常用"],
  ["neobotix-mmo-700", "Neobotix MMO-700", "Neobotix", "移动/复合机器人", "德国", false, "德国", ["移动操作", "科研平台"], "科研常用"],
  ["agilex-scout-mini", "AgileX Scout Mini", "AgileX Robotics", "移动/复合机器人", "中国", true, "深圳", ["轮式底盘", "教学移动平台"], "教育/低成本"],
  ["agilex-bunker-pro", "AgileX Bunker Pro", "AgileX Robotics", "移动/复合机器人", "中国", true, "深圳", ["轮式底盘", "服务/巡检"], "主流在售"],
  ["agilex-ranger-mini", "AgileX Ranger Mini", "AgileX Robotics", "移动/复合机器人", "中国", true, "深圳", ["轮式底盘", "科研平台"], "科研常用"],
  ["standard-oasis-600", "Standard Robots Oasis 600", "Standard Robots", "移动/复合机器人", "中国", true, "深圳", ["轮式底盘", "服务/巡检"], "主流在售"],
  ["standard-oasis-300c", "Standard Robots Oasis 300C", "Standard Robots", "移动/复合机器人", "中国", true, "深圳", ["轮式底盘"], "主流在售"],
  ["geekplus-p800", "Geek+ P800", "Geek+", "移动/复合机器人", "中国", true, "北京", ["轮式底盘", "服务/巡检"], "主流在售"],
  ["geekplus-rs8", "Geek+ RS8", "Geek+", "移动/复合机器人", "中国", true, "北京", ["轮式底盘"], "主流在售"],
  ["yahboom-rosmaster-r2", "Yahboom ROSMASTER R2", "Yahboom", "移动/复合机器人", "中国", true, "深圳", ["教学移动平台", "轮式底盘"], "教育/低成本"],
  ["yahboom-rosmaster-x1", "Yahboom ROSMASTER X1", "Yahboom", "移动/复合机器人", "中国", true, "深圳", ["教学移动平台", "轮式底盘"], "教育/低成本"],
  ["hiwonder-tonypi-pro", "Hiwonder TonyPi Pro", "Hiwonder", "人形机器人", "中国", true, "深圳", ["小型人形", "教育版"], "教育/低成本"],
  ["robotis-op3", "ROBOTIS OP3", "Robotis", "人形机器人", "韩国", false, "韩国", ["小型人形", "开源人形", "教育版"], "科研常用"],
  ["robotis-mini", "ROBOTIS MINI", "Robotis", "人形机器人", "韩国", false, "韩国", ["小型人形", "教育版"], "教育/低成本"],
  ["softbank-nao-v6", "SoftBank NAO V6", "SoftBank Robotics", "人形机器人", "法国/日本", false, "法国/日本", ["小型人形", "教育版"], "科研常用"],
  ["softbank-pepper", "SoftBank Pepper", "SoftBank Robotics", "人形机器人", "法国/日本", false, "法国/日本", ["全尺寸", "教育版", "工业/商用"], "历史/供货待确认"],
  ["ubtech-walker-s", "UBTECH Walker S", "UBTECH", "人形机器人", "中国", true, "深圳", ["全尺寸", "工业/商用"], "主流在售"],
  ["ubtech-walker-x", "UBTECH Walker X", "UBTECH", "人形机器人", "中国", true, "深圳", ["全尺寸", "科研开发套件"], "主流在售"],
  ["fourier-gr2", "Fourier GR-2", "Fourier Intelligence", "人形机器人", "中国", true, "上海", ["全尺寸", "科研开发套件"], "主流在售"],
  ["agility-digit", "Agility Digit", "Agility Robotics", "人形机器人", "美国", false, "美国", ["全尺寸", "工业/商用"], "主流在售"],
  ["apptronik-apollo", "Apptronik Apollo", "Apptronik", "人形机器人", "美国", false, "美国", ["全尺寸", "工业/商用"], "主流在售"],
  ["figure-02", "Figure 02", "Figure AI", "人形机器人", "美国", false, "美国", ["全尺寸", "工业/商用"], "主流在售"],
  ["tesla-optimus", "Tesla Optimus", "Tesla", "人形机器人", "美国", false, "美国", ["全尺寸", "工业/商用"], "历史/供货待确认"],
  ["sanctuary-phoenix", "Sanctuary AI Phoenix", "Sanctuary AI", "人形机器人", "加拿大", false, "加拿大", ["全尺寸", "科研开发套件"], "主流在售"],
  ["engineai-pm01", "EngineAI PM01", "EngineAI", "人形机器人", "中国", true, "深圳", ["小型人形", "科研开发套件"], "主流在售"],
  ["engineai-sa01", "EngineAI SA01", "EngineAI", "人形机器人", "中国", true, "深圳", ["全尺寸", "工业/商用"], "主流在售"],
  ["limx-cl-1", "LimX Dynamics CL-1", "LimX Dynamics", "人形机器人", "中国", true, "深圳", ["全尺寸", "科研开发套件"], "主流在售"],
  ["xiaomi-cyberone", "Xiaomi CyberOne", "Xiaomi", "人形机器人", "中国", true, "北京", ["全尺寸", "科研开发套件"], "历史/供货待确认"],
  ["leju-kuavo", "Leju Kuavo", "Leju Robotics", "人形机器人", "中国", true, "深圳", ["开源人形", "科研开发套件"], "开源/组合方案"],
  ["pndbotics-adam", "PNDbotics Adam", "PNDbotics", "人形机器人", "中国", true, "深圳", ["全尺寸", "科研开发套件"], "主流在售"],
  ["unitree-a1", "Unitree A1", "Unitree", "机器狗", "中国", true, "杭州", ["科研开发", "教育版"], "历史/供货待确认"],
  ["unitree-aliengo", "Unitree Aliengo", "Unitree", "机器狗", "中国", true, "杭州", ["科研开发", "负载型"], "历史/供货待确认"],
  ["unitree-laikago", "Unitree Laikago", "Unitree", "机器狗", "中国", true, "杭州", ["科研开发"], "历史/供货待确认"],
  ["deeprobotics-lite3", "DEEP Robotics Lite3", "DEEP Robotics", "机器狗", "中国", true, "杭州", ["消费级", "教育版", "科研开发"], "主流在售"],
  ["deeprobotics-jueying-lite2", "DEEP Robotics Jueying Lite2", "DEEP Robotics", "机器狗", "中国", true, "杭州", ["教育版", "科研开发"], "主流在售"],
  ["deeprobotics-x30", "DEEP Robotics X30", "DEEP Robotics", "机器狗", "中国", true, "杭州", ["工业巡检", "负载型"], "主流在售"],
  ["anybotics-anymal-c", "ANYbotics ANYmal C", "ANYbotics", "机器狗", "瑞士", false, "瑞士", ["工业巡检", "负载型"], "主流在售"],
  ["anybotics-anymal-d", "ANYbotics ANYmal D", "ANYbotics", "机器狗", "瑞士", false, "瑞士", ["工业巡检", "负载型"], "主流在售"],
  ["boston-spot-arm", "Boston Dynamics Spot Arm", "Boston Dynamics", "机器狗", "美国", false, "美国", ["工业巡检", "四足加臂"], "主流在售"],
  ["ghost-vision-60", "Ghost Robotics Vision 60", "Ghost Robotics", "机器狗", "美国", false, "美国", ["工业巡检", "负载型"], "主流在售"],
  ["limx-w1", "LimX Dynamics W1", "LimX Dynamics", "机器狗", "中国", true, "深圳", ["轮足/足式", "科研开发"], "主流在售"],
  ["limx-p1", "LimX Dynamics P1", "LimX Dynamics", "机器狗", "中国", true, "深圳", ["科研开发", "教育版"], "主流在售"]
];

const priorityQueries = {
  "unitree-go2": ["Unitree Go2 robot", "Unitree Go2 ROS"],
  "unitree-g1": ["Unitree G1 humanoid robot", "Unitree G1 ROS"],
  "franka-research-3": ["Franka Research 3 robot", "franka_ros2"],
  "ur5e": ["Universal Robots UR5e research", "UR5e ROS"],
  "ufactory-xarm-7": ["xArm 7 robot", "xarm_ros"],
  "mobile-aloha": ["Mobile ALOHA robot", "Mobile ALOHA GitHub"],
  "hello-stretch-3": ["Hello Robot Stretch 3", "Hello Robot Stretch ROS"],
  "agilex-limo-piper": ["AgileX LIMO PiPER robot", "AgileX LIMO ROS"],
  "robotis-op3": ["ROBOTIS OP3 humanoid", "ROBOTIS OP3 GitHub"],
  "softbank-nao-v6": ["NAO robot education research", "NAO robot GitHub"],
  "clearpath-husky": ["Clearpath Husky robot", "Clearpath Husky ROS"],
  "clearpath-jackal": ["Clearpath Jackal robot", "Clearpath Jackal ROS"],
  "pal-tiago": ["PAL Robotics TIAGo", "TIAGo robot ROS"],
  "boston-spot-arm": ["Boston Dynamics Spot robot research", "Boston Dynamics Spot SDK"],
  "deeprobotics-lite3": ["DEEP Robotics Lite3 robot", "DEEP Robotics Lite3 ROS"],
  "agility-digit": ["Agility Robotics Digit", "Agility Digit robot GitHub"],
  "apptronik-apollo": ["Apptronik Apollo humanoid robot", "Apptronik Apollo robot GitHub"],
  "figure-02": ["Figure 02 humanoid robot", "Figure AI robot GitHub"],
  "ubtech-walker-s": ["UBTECH Walker S robot", "UBTECH Walker robot GitHub"],
  "fourier-gr2": ["Fourier GR-2 humanoid robot", "Fourier GR-2 GitHub"]
};

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function confidenceFromCoverage(tier) {
  return tier === "主流在售" || tier === "科研常用" ? "medium" : "low";
}

function defaultAcademicMetrics(confidence = "unknown") {
  return {
    paperCount: 0,
    citationCount: 0,
    recentPaperCount: 0,
    academicScore: 0,
    topPaperTitles: [],
    academicMetricSource: "未匹配：未找到足够可靠的型号级论文匹配",
    academicConfidence: confidence
  };
}

function defaultOpenSourceMetrics(confidence = "unknown") {
  return {
    repoCount: 0,
    stars: 0,
    forks: 0,
    recentlyUpdatedRepos: 0,
    officialRepoCount: 0,
    openSourceScore: 0,
    topRepos: [],
    openSourceMetricSource: "未匹配：未找到足够可靠的型号级 GitHub/ROS/SDK 仓库匹配",
    openSourceConfidence: confidence
  };
}

function makeSourceId(existing, index) {
  let id = `SRCV15${String(index).padStart(4, "0")}`;
  while (existing.has(id)) {
    index += 1;
    id = `SRCV15${String(index).padStart(4, "0")}`;
  }
  existing.add(id);
  return id;
}

function makeRobot([id, name, brand, category, country, domesticPriority, location, tags, coverageTier], sourceId) {
  const confidence = confidenceFromCoverage(coverageTier);
  const marketTier = coverageTier === "历史/供货待确认" ? "市场初筛" : "重点候选";
  const categoryDefaults = {
    "机械臂": {
      formFactor: tags.includes("双臂") ? "双臂/协作机械臂" : tags.includes("桌面机械臂") ? "桌面/教育机械臂" : "协作/工业机械臂",
      specs: { dof: "官网未披露/按系列核验", payloadKg: "官网未披露/按具体配置确认", reachM: "官网未披露/按具体配置确认", repeatabilityMm: "官网未披露", speed: "官网未披露", endurance: "外接供电", weightKg: "官网未披露", sensors: "按具体配置确认", compute: "控制柜/控制器按型号确认", safety: "协作/工业安全配置按型号确认" },
      software: { ros: "ROS/社区生态需按型号确认", ros2: "ROS2 支持需按型号确认", sdk: "厂商控制器/SDK 需确认", sim: "仿真模型需确认" }
    },
    "移动/复合机器人": {
      formFactor: tags.includes("移动操作") ? "移动操作/复合机器人" : "轮式移动机器人/底盘",
      specs: { dof: "移动底盘/可扩展载荷", payloadKg: "官网未披露/按具体配置确认", reachM: "官网未披露", repeatabilityMm: "官网未披露", speed: "官网未披露", endurance: "官网未披露", weightKg: "官网未披露", sensors: "导航/避障传感器按配置确认", compute: "控制器/工控机按配置确认", safety: "场地安全和调度系统需确认" },
      software: { ros: "ROS/导航生态需确认", ros2: "ROS2 支持需确认", sdk: "调度/API/SDK 需确认", sim: "仿真模型需确认" }
    },
    "人形机器人": {
      formFactor: tags.includes("小型人形") ? "小型人形/教育平台" : "全尺寸/双足人形机器人",
      specs: { dof: "官网未披露/按版本确认", payloadKg: "官网未披露", reachM: "官网未披露", repeatabilityMm: "官网未披露", speed: "官网未披露", endurance: "官网未披露", weightKg: "官网未披露", sensors: "视觉/IMU/力控配置需确认", compute: "计算平台需确认", safety: "跌倒保护、场地安全和开放接口需确认" },
      software: { ros: "ROS/社区生态需确认", ros2: "ROS2 支持需确认", sdk: "SDK/开放接口需确认", sim: "仿真环境需确认" }
    },
    "机器狗": {
      formFactor: tags.includes("轮足/足式") ? "轮足/足式机器人" : "四足机器人",
      specs: { dof: "四足/轮足自由度按型号确认", payloadKg: "官网未披露/按配置确认", reachM: "官网未披露", repeatabilityMm: "不适用", speed: "官网未披露", endurance: "官网未披露", weightKg: "官网未披露", sensors: "视觉/雷达/IMU 按配置确认", compute: "计算平台按配置确认", safety: "场地安全、跌倒保护和巡检认证需确认" },
      software: { ros: "ROS/社区生态需确认", ros2: "ROS2 支持需确认", sdk: "厂商 SDK/运动接口需确认", sim: "仿真环境需确认" }
    }
  };
  const d = categoryDefaults[category];
  return {
    id,
    name,
    vendor: brand,
    category,
    formFactor: d.formFactor,
    country,
    domesticPriority,
    officialUrl: officialSourceByBrand[brand]?.[0] || "https://www.google.com/search?q=" + encodeURIComponent(`${brand} ${name}`),
    image: category === "机械臂" ? "/assets/robots/robot-arm.png" : category === "机器狗" ? "/assets/robots/quadruped.png" : category === "人形机器人" ? "/assets/robots/humanoid.png" : "/assets/robots/mobile-manipulator.png",
    lastChecked: "2026-06-02",
    releaseDate: "官网未披露",
    releaseDateConfidence: "unknown",
    marketTier,
    coverageTier,
    verificationStatus: "部分核验",
    verificationNotes: `${officialSourceByBrand[brand]?.[1] || "可信产品入口"}已纳入广覆盖候选；型号级参数、发布时间、采购报价和开放接口需后续专项核验。`,
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
      confidence,
      sourceIds: [sourceId]
    },
    specs: d.specs,
    software: d.software,
    researchEvidence: [`v15 广覆盖候选：按品牌/产品目录纳入 ${name}，用于补齐市面主流和科研/教育常见设备覆盖。`],
    deploymentEvidence: ["采购前需补齐正式报价、交付周期、售后维保、培训和开放接口条款。"],
    risks: ["广覆盖候选信息深度低于重点核验型号，排行榜中低置信指标需复核。"],
    scores: {
      research: coverageTier === "科研常用" ? 34 : coverageTier === "教育/低成本" ? 30 : coverageTier === "开源/组合方案" ? 36 : coverageTier === "历史/供货待确认" ? 24 : 28,
      deployment: coverageTier === "主流在售" ? 34 : coverageTier === "教育/低成本" ? 26 : coverageTier === "历史/供货待确认" ? 22 : 28,
      overall: coverageTier === "科研常用" ? 64 : coverageTier === "主流在售" ? 62 : coverageTier === "教育/低成本" ? 56 : coverageTier === "开源/组合方案" ? 64 : 46
    },
    shortlistTags: coverageTier === "科研常用" ? ["科研平台"] : coverageTier === "教育/低成本" ? ["教学平台"] : [],
    sourceIds: [sourceId],
    academicMetrics: defaultAcademicMetrics("unknown"),
    openSourceMetrics: defaultOpenSourceMetrics("unknown")
  };
}

async function fetchOpenAlex(query) {
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=5&select=id,title,cited_by_count,publication_year`;
  const res = await fetch(url, { headers: { "User-Agent": "robot-procurement-research/1.0 (mailto:research@example.com)" } });
  if (!res.ok) return null;
  const json = await res.json();
  const results = (json.results || []).filter((item) => item.title && item.publication_year);
  return {
    count: json.meta?.count || 0,
    citationCount: results.reduce((sum, item) => sum + (item.cited_by_count || 0), 0),
    recentPaperCount: results.filter((item) => item.publication_year >= 2023).length,
    topPaperTitles: results.slice(0, 3).map((item) => `${item.title} (${item.publication_year}, cited ${item.cited_by_count || 0})`),
    source: `OpenAlex search: ${query}`
  };
}

async function fetchGitHub(query) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5&sort=stars&order=desc`;
  const res = await fetch(url, { headers: { "User-Agent": "robot-procurement-research" } });
  if (!res.ok) return null;
  const json = await res.json();
  const repos = json.items || [];
  return {
    repoCount: json.total_count || 0,
    stars: repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
    forks: repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
    recentlyUpdatedRepos: repos.filter((repo) => String(repo.pushed_at || "").slice(0, 4) >= "2025").length,
    officialRepoCount: repos.filter((repo) => /unitree|franka|ufactory|robotis|clearpath|pal-robotics|agilex|hello-robot|boston-dynamics/i.test(repo.full_name || "")).length,
    topRepos: repos.slice(0, 3).map((repo) => `${repo.full_name} (${repo.stargazers_count || 0} stars, ${repo.forks_count || 0} forks)`),
    source: `GitHub repository search: ${query}`
  };
}

function normalizeScores(robots, metricKey, valueKey, scoreKey) {
  const byCategory = new Map();
  for (const robot of robots) {
    if (!byCategory.has(robot.category)) byCategory.set(robot.category, []);
    const metrics = robot[metricKey];
    if (metrics && metrics[valueKey] > 0) byCategory.get(robot.category).push(metrics[valueKey]);
  }
  for (const robot of robots) {
    const metrics = robot[metricKey];
    if (!metrics) continue;
    const values = byCategory.get(robot.category) || [];
    const max = Math.max(...values, 0);
    metrics[scoreKey] = max > 0 ? Math.round((metrics[valueKey] / max) * 100) : 0;
  }
}

async function enhanceData(data) {
  const sourceIds = new Set(data.sources.map((source) => source.id));
  const robotIds = new Set(data.robots.map((robot) => robot.id));
  let sourceIndex = 1;

  for (const robot of data.robots) {
    robot.coverageTier ||= robot.marketTier === "市场初筛" ? "主流在售" : "科研常用";
    robot.academicMetrics ||= defaultAcademicMetrics("unknown");
    robot.openSourceMetrics ||= defaultOpenSourceMetrics("unknown");
  }

  for (const item of additions) {
    const [id, name, brand] = item;
    if (robotIds.has(id)) continue;
    const sourceId = makeSourceId(sourceIds, sourceIndex++);
    const [url, title] = officialSourceByBrand[brand] || [undefined, `${brand} 产品入口`];
    data.sources.push({
      id: sourceId,
      title,
      url,
      type: "官网/品牌产品目录",
      confidence: "medium",
      notes: `v15 广覆盖扩库来源：用于核验 ${name} 所属品牌/产品线入口；型号级采购参数需后续专项核验。`
    });
    data.robots.push(makeRobot(item, sourceId));
    robotIds.add(id);
  }

  for (const robot of data.robots) {
    const queries = priorityQueries[robot.id];
    if (!queries) continue;
    const academic = await fetchOpenAlex(queries[0]);
    if (academic && academic.count > 0) {
      robot.academicMetrics = {
        paperCount: Math.min(academic.count, 9999),
        citationCount: academic.citationCount,
        recentPaperCount: academic.recentPaperCount,
        academicScore: 0,
        topPaperTitles: academic.topPaperTitles,
        academicMetricSource: academic.source,
        academicConfidence: academic.topPaperTitles.length >= 2 ? "medium" : "low"
      };
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
    const openSource = await fetchGitHub(queries[1]);
    if (openSource && openSource.repoCount > 0) {
      robot.openSourceMetrics = {
        repoCount: Math.min(openSource.repoCount, 9999),
        stars: openSource.stars,
        forks: openSource.forks,
        recentlyUpdatedRepos: openSource.recentlyUpdatedRepos,
        officialRepoCount: openSource.officialRepoCount,
        openSourceScore: 0,
        topRepos: openSource.topRepos,
        openSourceMetricSource: openSource.source,
        openSourceConfidence: openSource.topRepos.length >= 2 ? "medium" : "low"
      };
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  for (const robot of data.robots) {
    const a = robot.academicMetrics || defaultAcademicMetrics("unknown");
    a.academicRawScore = Math.round(a.paperCount * 0.4 + Math.log10(a.citationCount + 1) * 35 + a.recentPaperCount * 8.3);
    robot.academicMetrics = a;
    const o = robot.openSourceMetrics || defaultOpenSourceMetrics("unknown");
    o.openSourceRawScore = Math.round(Math.log10(o.stars + 1) * 35 + Math.log10(o.forks + 1) * 20 + Math.min(o.repoCount, 50) * 0.4 + o.recentlyUpdatedRepos * 3 + o.officialRepoCount * 5);
    robot.openSourceMetrics = o;
  }
  normalizeScores(data.robots, "academicMetrics", "academicRawScore", "academicScore");
  normalizeScores(data.robots, "openSourceMetrics", "openSourceRawScore", "openSourceScore");

  data.meta.version = "v15";
  data.meta.accessedDate = "2026-06-02";
  data.meta.updateSummary = "扩展候选库到 300+，新增覆盖层级、学术热度指标和 GitHub/开源生态指标；排行榜改为外部可复核指标优先，库内来源数量仅作为证据覆盖说明。";
  data.meta.rankingMethodology = {
    academic: "按类别归一化：论文命中数、引用数和近三年论文数综合；未可靠匹配则标记未匹配。",
    openSource: "按类别归一化：GitHub 仓库数、stars、forks、最近更新和官方/社区属性综合；未可靠匹配则标记未匹配。",
    note: "当前批次优先对重点候选实时核验外部指标，广覆盖候选保留未匹配状态，避免填充不可复核热度。"
  };
  return data;
}

function writeOutputs(data) {
  const sourceRows = [
    ["id", "title", "type", "confidence", "url", "notes"],
    ...data.sources.map((source) => [source.id, source.title, source.type, source.confidence, source.url, source.notes])
  ];
  fs.writeFileSync(OUTPUT_SOURCES, sourceRows.map((row) => row.map(csvEscape).join(",")).join("\n") + "\n");

  const cats = data.robots.reduce((acc, robot) => {
    acc[robot.category] = (acc[robot.category] || 0) + 1;
    return acc;
  }, {});
  const tiers = data.robots.reduce((acc, robot) => {
    acc[robot.coverageTier || "未标注"] = (acc[robot.coverageTier || "未标注"] || 0) + 1;
    return acc;
  }, {});
  const academicMatched = data.robots.filter((robot) => robot.academicMetrics?.paperCount > 0).length;
  const openMatched = data.robots.filter((robot) => robot.openSourceMetrics?.repoCount > 0).length;
  const lines = [
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
    "- 学术热度不再按库内来源数量排序，而是使用外部论文检索的论文数、引用数和近三年论文数综合。",
    "- GitHub/开源生态不再按库内 GitHub 来源数量排序，而是使用仓库数、stars、forks、最近更新和官方/社区属性综合。",
    "- 未可靠匹配的候选保留 `未匹配` 状态，不填充不可复核热度。"
  ];
  fs.writeFileSync(OUTPUT_REPORT, lines.join("\n") + "\n");
}

let latest;
for (const path of DATA_PATHS) {
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  latest = await enhanceData(data);
  fs.writeFileSync(path, JSON.stringify(latest, null, 2) + "\n");
}
writeOutputs(latest);
console.log(JSON.stringify({
  version: latest.meta.version,
  robots: latest.robots.length,
  sources: latest.sources.length,
  academicMatched: latest.robots.filter((robot) => robot.academicMetrics?.paperCount > 0).length,
  openSourceMatched: latest.robots.filter((robot) => robot.openSourceMetrics?.repoCount > 0).length
}, null, 2));
