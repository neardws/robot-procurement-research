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
      researchEvidence: [`v10 官网核验：${notes}`]
    });
  }
}

addSource("SRCV10001", "1X NEO 官方产品页", "https://www.1x.tech/neo", "官网/产品规格/订购", "high", "官方页核验 NEO 家用人形机器人、预订/订阅口径、重量、负载、续航、速度和远程/自主能力边界。");
addSource("SRCV10002", "Kepler Forerunner 官方产品页", "https://www.keplerrobotics.com/", "官网/产品入口", "high", "官方入口核验 Kepler Forerunner 人形机器人产品线；详细采购规格和 SDK 需向厂商确认。");
addSource("SRCV10003", "RobotEra 官方产品入口", "https://www.robotera.com/", "官网/产品入口", "high", "官方入口核验 RobotEra 人形机器人与灵巧操作产品线；XHand1 具体采购规格和接口需厂商确认。");
addSource("SRCV10004", "UBTECH Walker 官方产品资料", "https://www.ubtrobot.com/", "官网/产品入口", "high", "优必选官网核验 Walker 系列人形机器人和商用/展示应用；Walker X 面向采购的量产规格、价格和 SDK 需询价。");
addSource("SRCV10005", "AgiBot 官方产品入口", "https://www.agibot.com/", "官网/产品入口", "high", "智元官网核验 A2/A2-W 相关人形机器人产品线；详细规格、交付和开发接口需厂商确认。");
addSource("SRCV10006", "Agility Digit 官方机器人页", "https://agilityrobotics.com/robots", "官网/产品规格", "high", "官方页核验 Digit 物流人形机器人、箱体搬运定位、企业部署和 Agility Arc 系统；价格和 SDK 需询价。");
addSource("SRCV10007", "Apptronik Apollo 官方产品页", "https://apptronik.com/apollo", "官网/产品规格", "high", "官方页核验 Apollo 通用人形机器人、模块化电池、工业任务定位和企业合作路径；价格和 SDK 需询价。");
addSource("SRCV10008", "Booster Robotics A1 官方产品页", "https://www.boosterobotics.com/", "官网/产品规格", "high", "官方页核验 Booster A1 开源/开发者人形平台和科研教育定位；公开价格和具体接口需按版本确认。");
addSource("SRCV10009", "Figure 官方机器人页", "https://www.figure.ai/", "官网/产品入口", "high", "Figure 官网核验 Figure 02 / Figure 03 产品线、商业部署方向和 Helix 智能系统；开放采购与 SDK 未公开。");
addSource("SRCV10010", "NEURA 4NE-1 官方产品页", "https://www.neura-robotics.com/4ne1", "官网/产品入口", "high", "NEURA 官方页核验 4NE-1 人形机器人产品线；详细规格、开放采购和 SDK 需询价。");
addSource("SRCV10011", "ROBOTIS OP3 官方 e-Manual", "https://emanual.robotis.com/docs/en/platform/op3/introduction/", "官网/产品手册", "high", "官方 e-Manual 核验 OP3 小型开源人形机器人、ROS 包、硬件配置、教程和教育科研定位。");
addSource("SRCV10012", "Sanctuary Phoenix 官方产品页", "https://www.sanctuary.ai/phoenix", "官网/产品入口", "high", "官方页核验 Phoenix 通用人形机器人和 Carbon AI 控制系统；公开采购规格、价格和 SDK 未完整披露。");
addSource("SRCV10013", "Tesla AI 官方页面", "https://www.tesla.com/AI", "官网/产品入口", "medium", "Tesla 官方 AI 页面核验 Optimus 项目与招聘/演示口径；暂无学校采购、价格、SDK 或正式规格入口。");
addSource("SRCV10014", "Rainbow Robotics 官方产品页", "https://www.rainbow-robotics.com/", "官网/产品入口", "medium", "Rainbow 官方入口核验四足/机器人产品线；RBQ/RBQ-10 当前公开规格和采购页需厂商确认。");
addSource("SRCV10015", "Sony aibo 官方产品页", "https://us.aibo.com/", "官网/产品规格/价格", "high", "官方页核验 aibo ERS-1000 消费级机器狗、订购/配件、娱乐和教育展示边界；科研 SDK 和工业能力有限。");
addSource("SRCV10016", "Unitree Laikago 官方历史资料", "https://www.unitree.com/", "官网/产品入口", "medium", "宇树官网当前主推 Go2/B2/A2 等新款，Laikago 作为早期历史平台需确认存量和支持状态。");

patch("1x-neo", {
  officialUrl: "https://www.1x.tech/neo",
  releaseDate: "2024-10",
  releaseDateConfidence: "medium",
  specs: {
    dof: "全尺寸人形，详细自由度未公开",
    payloadKg: "轻载家用任务，约 70 kg 级整机负载边界需官方确认",
    reachM: "真人比例，精确臂展未公开",
    speed: "约 3 mph 级",
    endurance: "约 2-4 h 级，按版本确认",
    weightKg: "约 30 kg 级公开口径",
    sensors: "视觉/音频/触觉等家用感知口径",
    safety: "家用机器人，远程协助和隐私/安全边界需评估"
  },
  software: { ros: "未公开", ros2: "未公开", sdk: "未公开，用户侧以服务/订阅为主", sim: "未公开" },
  sourceIds: ["SRCV10001"],
  risks: ["NEO 面向家用/订阅场景，学校科研二次开发能力需要另行确认。"]
});
verify(["1x-neo"], "1X 官方 NEO 页面确认产品、订购/订阅口径和基础能力边界，但 SDK、科研开放接口和学校采购条款未公开。", ["SRCV10001"]);

patch("kepler-forerunner", {
  sourceIds: ["SRCV10002"],
  specs: { dof: "全尺寸人形，按厂商规格书确认", payloadKg: "需询价确认", reachM: "需询价确认", sensors: "视觉/力控/灵巧操作按型号确认", safety: "全尺寸人形，校园部署需隔离和急停方案" },
  software: { ros: "需厂商确认", ros2: "需厂商确认", sdk: "厂商开发接口需询价", sim: "需厂商确认" }
});
verify(["kepler-forerunner"], "Kepler 官网确认 Forerunner 人形机器人产品线；详细规格、开放接口、价格和交付需厂商确认。", ["SRCV10002"], "市场初筛");

patch("robotera-xhand1", {
  sourceIds: ["SRCV10003"],
  specs: { dof: "灵巧手/人形操作部件，具体自由度需厂商确认", payloadKg: "需询价确认", reachM: "手部/上肢模块按集成方案确认", sensors: "触觉/力控/视觉集成按版本确认", safety: "灵巧操作模块，夹持安全需项目评估" },
  software: { ros: "需厂商确认", ros2: "需厂商确认", sdk: "开发接口需询价", sim: "需厂商确认" }
});
verify(["robotera-xhand1"], "RobotEra 官网确认人形/灵巧操作产品线；XHand1 具体采购规格、接口和交付需厂商确认。", ["SRCV10003"], "市场初筛");

patch("ubtech-walker-x", {
  sourceIds: ["SRCV10004"],
  specs: { dof: "全尺寸人形，详细自由度需厂商确认", payloadKg: "需询价确认", reachM: "需询价确认", sensors: "视觉/语音/导航等商用展示口径", safety: "商用展示/服务场景，校园部署需厂商方案" },
  software: { ros: "未公开", ros2: "未公开", sdk: "企业合作接口需询价", sim: "未公开" }
});
verify(["ubtech-walker-x"], "优必选官网确认 Walker 系列人形机器人和商用/展示应用，但 Walker X 面向采购的规格、价格和 SDK 仍需询价。", ["SRCV10004"], "市场初筛");

patch("agibot-a2-w", {
  sourceIds: ["SRCV10005"],
  specs: { dof: "轮式双臂/人形平台，具体自由度需厂商确认", payloadKg: "需询价确认", reachM: "需询价确认", sensors: "视觉/导航/操作传感按型号确认", safety: "校园演示和科研需隔离/急停方案" },
  software: { ros: "需厂商确认", ros2: "需厂商确认", sdk: "开发接口需询价", sim: "需厂商确认" }
});
verify(["agibot-a2-w"], "智元官网确认 A2/A2-W 相关产品线和人形机器人方向；详细参数、价格、SDK 和交付需厂商确认。", ["SRCV10005"]);

patch("agility-digit", {
  officialUrl: "https://agilityrobotics.com/robots",
  specs: { dof: "双足人形物流平台", payloadKg: "16 kg 级搬运口径", reachM: "箱体搬运工作空间按任务确认", endurance: "企业部署按工况确认", weightKg: "约 65 kg 级公开口径", sensors: "视觉/感知和企业部署传感器按版本确认", safety: "仓储物流场景，需企业安全方案" },
  software: { ros: "未公开", ros2: "未公开", sdk: "Agility Arc / 企业接口需询价", sim: "企业仿真/部署接口需询价" },
  sourceIds: ["SRCV10006"]
});
verify(["agility-digit"], "Agility 官方机器人页确认 Digit 面向物流搬运和企业部署，具备箱体搬运定位和 Agility Arc 系统；价格与开放 SDK 需询价。", ["SRCV10006"]);

patch("apptronik-apollo", {
  officialUrl: "https://apptronik.com/apollo",
  specs: { dof: "全尺寸通用人形，详细自由度未公开", payloadKg: "约 25 kg 级公开口径", reachM: "真人比例，精确臂展需询价", endurance: "约 4 h 级公开口径，模块化电池", weightKg: "约 72.6 kg 级公开口径", sensors: "视觉/感知/力控按企业配置", safety: "工业/物流任务，需企业部署方案" },
  software: { ros: "未公开", ros2: "未公开", sdk: "企业合作接口需询价", sim: "企业仿真/部署接口需询价" },
  sourceIds: ["SRCV10007"]
});
verify(["apptronik-apollo"], "Apptronik 官方 Apollo 页面确认通用人形机器人、模块化电池和工业任务定位；价格、开放 SDK 和学校采购需询价。", ["SRCV10007"]);

patch("booster-a1", {
  officialUrl: "https://www.boosterobotics.com/",
  specs: { dof: "小型/中型人形开发平台，具体自由度按版本确认", payloadKg: "开发平台轻载，需厂商确认", reachM: "需厂商确认", endurance: "按电池版本确认", sensors: "视觉/IMU/关节传感按版本", safety: "开发者平台，场地安全需另行评估" },
  software: { ros: "官方/开源资源需版本确认", ros2: "官方/开源资源需版本确认", sdk: "开发者接口/开源资源需确认", sim: "仿真资源需版本确认" },
  sourceIds: ["SRCV10008"],
  tags: ["教育版", "开源人形"]
});
verify(["booster-a1"], "Booster Robotics 官网确认 A1 开发者/科研教育人形平台定位；具体接口、价格和交付需按版本确认。", ["SRCV10008"]);

patch("figure-02", {
  officialUrl: "https://www.figure.ai/",
  specs: { dof: "全尺寸人形，详细自由度未公开", payloadKg: "需官方确认", reachM: "需官方确认", endurance: "约 5 h 级公开口径", weightKg: "约 70 kg 级公开口径", sensors: "视觉/语音/端到端模型口径", safety: "企业试点平台，校园采购需官方确认" },
  software: { ros: "未公开", ros2: "未公开", sdk: "未公开，Helix 系统为官方封闭口径", sim: "未公开" },
  sourceIds: ["SRCV10009"],
  risks: ["Figure 当前主要面向企业试点和自有系统，开放采购和科研二次开发信息不足。"]
});
verify(["figure-02"], "Figure 官网确认 Figure 02/03 产品线和商业部署方向，但开放采购、价格和 SDK 未公开；适合市场跟踪，不宜直接作为近期学校采购重点。", ["SRCV10009"], "市场初筛");

patch("neura-4ne1", {
  officialUrl: "https://www.neura-robotics.com/4ne1",
  specs: { dof: "全尺寸人形，具体自由度需官方确认", payloadKg: "需询价确认", reachM: "需询价确认", sensors: "认知机器人传感器和安全感知按版本确认", safety: "协作/工业场景，需厂商安全方案" },
  software: { ros: "未公开", ros2: "未公开", sdk: "NEURA 企业接口需询价", sim: "未公开" },
  sourceIds: ["SRCV10010"]
});
verify(["neura-4ne1"], "NEURA 官方页确认 4NE-1 人形机器人产品线；详细规格、开放采购和 SDK 需询价。", ["SRCV10010"], "市场初筛");

patch("robotis-op3", {
  officialUrl: "https://emanual.robotis.com/docs/en/platform/op3/introduction/",
  specs: { dof: "小型人形平台，20 自由度级口径", payloadKg: "教学轻载", reachM: "小型人形不适用，精确尺寸见官方手册", endurance: "按电池和动作确认", weightKg: "约 3.5 kg 级", sensors: "摄像头、IMU、DYNAMIXEL 舵机反馈", compute: "Intel NUC / OpenCR 等官方配置", safety: "教育科研平台，非工业人形" },
  software: { ros: "官方 ROS 支持", ros2: "社区/迁移支持需确认", sdk: "ROBOTIS Framework / DYNAMIXEL SDK / ROS packages", sim: "Gazebo / ROS 教程资源" },
  sourceIds: ["SRCV10011"],
  tags: ["开源人形", "教育版"]
});
verify(["robotis-op3"], "ROBOTIS 官方 e-Manual 确认 OP3 小型开源人形机器人、ROS 包、硬件配置、教程和教育科研定位；价格按渠道确认。", ["SRCV10011"]);

patch("sanctuary-phoenix", {
  officialUrl: "https://www.sanctuary.ai/phoenix",
  specs: { dof: "全尺寸人形，手部/上肢操作为重点", payloadKg: "需官方确认", reachM: "需官方确认", sensors: "视觉/触觉/操作感知按 Phoenix 配置", safety: "企业试点平台，校园采购需官方确认" },
  software: { ros: "未公开", ros2: "未公开", sdk: "Carbon AI / 企业接口需询价", sim: "未公开" },
  sourceIds: ["SRCV10012"]
});
verify(["sanctuary-phoenix"], "Sanctuary 官方 Phoenix 页面确认通用人形机器人和 Carbon AI 控制系统；公开采购规格、价格和 SDK 未完整披露。", ["SRCV10012"], "市场初筛");

patch("tesla-optimus", {
  officialUrl: "https://www.tesla.com/AI",
  specs: { dof: "全尺寸人形，正式产品规格未公开", payloadKg: "未公开", reachM: "未公开", sensors: "Tesla 视觉/AI 演示口径", compute: "Tesla 自研 AI/自动驾驶相关口径，未面向采购公开", safety: "内部研发/展示阶段，学校采购不可按公开商品处理" },
  software: { ros: "未公开", ros2: "未公开", sdk: "未公开", sim: "未公开" },
  sourceIds: ["SRCV10013"],
  risks: ["Optimus 暂无公开学校采购、价格、SDK 或正式规格入口，建议仅作趋势观察。"]
});
verify(["tesla-optimus"], "Tesla 官方 AI 页面确认 Optimus 项目，但暂无学校采购、价格、SDK 或正式规格入口；仅保留为市场趋势项。", ["SRCV10013"], "市场初筛");

for (const id of ["rainbow-robotics-rbq", "rainbow-rbq-10"]) {
  patch(id, {
    officialUrl: "https://www.rainbow-robotics.com/",
    specs: { dof: "四足平台，具体型号规格需厂商确认", payloadKg: "需厂商确认", reachM: "足式平台不适用", sensors: "四足平台传感器按型号确认", safety: "科研/巡检场景需厂商安全方案" },
    software: { ros: "需厂商确认", ros2: "需厂商确认", sdk: "企业接口需询价", sim: "需厂商确认" },
    sourceIds: ["SRCV10014"]
  });
}
verify(["rainbow-robotics-rbq", "rainbow-rbq-10"], "Rainbow 官方入口确认机器人产品线；RBQ/RBQ-10 公开规格和学校采购口径不足，需厂商确认参数、SDK 和交付。", ["SRCV10014"], "市场初筛");

patch("sony-aibo", {
  officialUrl: "https://us.aibo.com/",
  price: { label: "约 US$2,899 起", amount: 21018, currency: "CNY", range: "按官方美国公开价约合人民币，未含税费/运费/服务订阅", type: "公开价折算", confidence: "high" },
  specs: { dof: "消费级娱乐机器狗", payloadKg: "不适合作为负载平台", reachM: "足式娱乐平台不适用", endurance: "按官方电池/使用场景确认", sensors: "摄像头、麦克风、触摸和运动传感器", safety: "消费娱乐/展示平台，非科研开放四足底盘" },
  software: { ros: "未公开", ros2: "未公开", sdk: "aibo API/应用生态有限，需确认当前区域可用性", sim: "未公开" },
  sourceIds: ["SRCV10015"],
  risks: ["aibo 适合展示和消费级互动，不适合作为机器人运动控制或负载研究主平台。"]
});
verify(["sony-aibo"], "Sony 官方 aibo 页面确认消费级机器狗、订购价格和娱乐/互动定位；科研 SDK 与工业能力有限。", ["SRCV10015"], "市场初筛");

patch("unitree-laikago", {
  officialUrl: "https://www.unitree.com/",
  specs: { dof: "早期四足平台", payloadKg: "历史资料需确认", reachM: "足式平台不适用", sensors: "历史开发平台配置需确认", safety: "当前采购建议优先比较 Go2/B2/A2 等新款" },
  software: { ros: "历史 SDK/ROS 资源需确认", ros2: "需社区迁移确认", sdk: "历史 Unitree SDK，当前支持需确认", sim: "历史/社区仿真资源" },
  sourceIds: ["SRCV10016"],
  risks: ["Laikago 为早期历史平台，当前官网主推新款，学校新采购不建议作为重点候选。"]
});
verify(["unitree-laikago"], "宇树官网当前主推 Go2/B2/A2 等新款，Laikago 作为早期历史平台需确认存量和支持状态；建议仅作历史/市场覆盖项。", ["SRCV10016"], "市场初筛");

data.meta = {
  ...data.meta,
  version: "v10",
  accessedDate,
  updateSummary: "第六批核验剩余人形机器人、机器狗和历史平台：1X、Kepler、RobotEra、UBTECH、AgiBot、Agility、Apptronik、Booster、Figure、NEURA、ROBOTIS、Sanctuary、Tesla、Rainbow、Sony、Unitree 等。"
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
fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", `# 学校具身智能机器人采购调研 v10\n\n更新时间：${accessedDate}\n\n## 数据概览\n\n- 候选设备：${data.robots.length} 个\n- 来源记录：${sources.length} 条\n- 市场层级：重点候选 ${tiers["重点候选"]} 个，市场初筛 ${tiers["市场初筛"]} 个\n- 核验状态：官网核验 ${verification["官网核验"]} 个，部分核验 ${verification["部分核验"]} 个，待核验 ${verification["待核验"]} 个\n- 类别分布：${categoryOrder.map((category) => `${category} ${counts[category]} 个`).join("，")}\n- 剩余缺口：发布时间未公开/未知 ${missingStats.releaseUnknown} 个，价格待询价 ${missingStats.price} 个，负载待核验/未披露 ${missingStats.payload} 个，SDK 待核验/未公开 ${missingStats.sdk} 个\n\n## 使用说明\n\nv10 完成剩余人形机器人、机器狗和历史平台的官网状态核验。市场初筛现在主要代表：历史/停产平台、当前采购交付不明确、SDK 未公开、或更适合趋势观察而不是近期学校重点采购的设备。\n`);

console.log(JSON.stringify({ robots: data.robots.length, sources: sources.length, counts, tiers, verification, missingStats }, null, 2));
