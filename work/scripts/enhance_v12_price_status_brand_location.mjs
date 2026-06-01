import fs from "node:fs";

const inputPath = "app/src/robotResearchData.json";
const outputPaths = ["work/data/robot_research_data.json", "app/src/robotResearchData.json"];
const accessedDate = "2026-06-01";

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const sources = data.sources;
const sourceIndex = new Map(sources.map((source) => [source.id, source]));
const robotIndex = new Map(data.robots.map((robot) => [robot.id, robot]));

const brandMeta = {
  "1X": ["1X", "挪威/美国"],
  "开普勒机器人": ["开普勒机器人", "上海"],
  "开源组合方案": ["开源组合方案", "组合方案"],
  "乐聚机器人": ["乐聚机器人", "深圳"],
  "小米": ["小米", "北京"],
  "星动纪元": ["星动纪元", "北京"],
  "银河通用": ["银河通用", "北京"],
  "优必选": ["优必选", "深圳"],
  "智元机器人": ["智元机器人", "上海"],
  "众擎机器人": ["众擎机器人", "深圳"],
  "逐际动力": ["逐际动力", "深圳"],
  ABB: ["ABB", "瑞士/瑞典"],
  AgiBot: ["智元机器人", "上海"],
  AgileX: ["松灵机器人", "深圳"],
  Agility: ["Agility Robotics", "美国"],
  ANYbotics: ["ANYbotics", "瑞士"],
  Apptronik: ["Apptronik", "美国"],
  AUBO: ["遨博", "北京"],
  "Booster Robotics": ["Booster Robotics", "深圳"],
  Boston: ["Boston Dynamics", "美国"],
  Clearpath: ["Clearpath / ROBOTIS", "加拿大/韩国"],
  DEEPRobotics: ["云深处科技", "杭州"],
  DOBOT: ["越疆机器人", "深圳"],
  "Elephant Robotics": ["大象机器人", "深圳"],
  "Elite Robots": ["艾利特机器人", "苏州"],
  FANUC: ["FANUC", "日本"],
  Fetch: ["Fetch / Zebra", "美国"],
  Figure: ["Figure AI", "美国"],
  Fourier: ["傅利叶智能", "上海"],
  Franka: ["Franka Robotics", "德国"],
  "Franka Robotics": ["Franka Robotics", "德国/组合方案"],
  Ghost: ["Ghost Robotics", "美国"],
  "Han's Robot": ["大族机器人", "深圳"],
  "Hello Robot": ["Hello Robot", "美国"],
  Hiwonder: ["幻尔科技", "深圳"],
  Husarion: ["Husarion", "波兰"],
  JAKA: ["节卡机器人", "上海"],
  Kinova: ["Kinova", "加拿大"],
  KUKA: ["KUKA", "德国"],
  MiR: ["Mobile Industrial Robots", "丹麦"],
  Mujin: ["Mujin", "日本/美国"],
  Neobotix: ["Neobotix", "德国"],
  NEURA: ["NEURA Robotics", "德国"],
  NOETIX: ["千寻智能 NOETIX", "北京"],
  OMRON: ["OMRON", "日本"],
  "PAL Robotics": ["PAL Robotics", "西班牙"],
  Rainbow: ["Rainbow Robotics", "韩国"],
  "Rainbow Robotics": ["Rainbow Robotics", "韩国"],
  RealMan: ["睿尔曼智能", "北京"],
  RobotEra: ["星动纪元", "北京"],
  Robotis: ["ROBOTIS", "韩国"],
  Robotnik: ["Robotnik", "西班牙"],
  ROKAE: ["珞石机器人", "北京"],
  Sanctuary: ["Sanctuary AI", "加拿大"],
  SIASUN: ["新松机器人", "沈阳"],
  Sony: ["Sony", "日本"],
  Techman: ["达明机器人", "中国台湾"],
  Tesla: ["Tesla", "美国"],
  UBTECH: ["优必选", "深圳"],
  UFACTORY: ["UFACTORY", "深圳"],
  Unitree: ["宇树科技", "杭州"],
  "Universal Robots": ["Universal Robots", "丹麦"],
  Yahboom: ["亚博智能", "深圳"],
  Yaskawa: ["Yaskawa Motoman", "日本"]
};

function addSource(id, title, url, type = "价格/品牌资料", confidence = "high", notes = "") {
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
  if (value.price) {
    robot.price = { ...robot.price, ...value.price, sourceIds: mergeUnique(robot.price.sourceIds, sourceIds) };
  } else if (sourceIds.length > 0) {
    robot.price.sourceIds = mergeUnique(robot.price.sourceIds, sourceIds);
  }
  if (value.researchEvidence) robot.researchEvidence = mergeUnique(robot.researchEvidence, value.researchEvidence);
  if (value.risks) robot.risks = mergeUnique(robot.risks, value.risks);
  for (const key of ["brandDisplayName", "brandLocation", "releaseDate", "releaseDateConfidence"]) {
    if (value[key] !== undefined) robot[key] = value[key];
  }
}

function setOfficialQuoteStatus(robot) {
  if (robot.price.amount !== null) return;
  const historical = robot.marketTier === "市场初筛" || /历史|停产|交付不明确|未公开|规格页不完整|趋势观察|存量|旧款/.test(`${robot.verificationNotes || ""} ${robot.risks.join(" ")}`);
  robot.price = {
    ...robot.price,
    label: historical ? "价格不公开/需确认可供货" : "厂商正式报价",
    range: historical ? "公开价格不可得，且当前采购/供货状态需厂商确认" : "官网未公开价格，采购需厂商或授权代理正式报价",
    type: historical ? "供货状态待确认" : "厂商正式报价项",
    confidence: robot.verificationStatus === "官网核验" ? "medium" : "low"
  };
}

addSource("SRCV12001", "TurtleBot 4 官方/授权渠道价格入口", "https://www.robotis.us/turtlebot-4/", "官方/授权渠道价格", "medium", "ROBOTIS/Clearpath 渠道可查 TurtleBot 4 系列公开美元价；不同套件、地区税费和教育折扣需以采购时渠道为准。");
addSource("SRCV12002", "ROBOTIS OP3 官方商城价格入口", "https://www.robotis.us/robotis-op3/", "官方商城价格", "medium", "ROBOTIS 官方商城可查 OP3 教育科研平台公开美元价；实际供货、配件和运费需复核。");
addSource("SRCV12003", "Unitree 官方中文价格页", "https://www.unitree.com/cn/go2/", "中文官网/官方价格", "high", "宇树中文官网披露 Go2 系列起售价口径；分版本精确采购价仍以官方页面和销售报价为准。");
addSource("SRCV12004", "Boston Dynamics Spot 历史公开售价资料", "https://bostondynamics.com/products/spot/", "官网/历史公开价格口径", "medium", "Spot 官方当前以联系销售为主，历史公开售价约 74,500 美元可作预算参考，正式采购仍需报价。");

for (const robot of data.robots) {
  const meta = brandMeta[robot.brandNormalized];
  if (meta) {
    robot.brandDisplayName = meta[0];
    robot.brandLocation = meta[1];
  } else {
    robot.brandDisplayName = robot.brandNormalized;
    robot.brandLocation = robot.domesticPriority ? robot.country : robot.country;
  }
  setOfficialQuoteStatus(robot);
}

patch("turtlebot4-lite", {
  price: {
    label: "约 US$1,795 起",
    amount: 13014,
    currency: "CNY",
    range: "按官方/授权渠道美元公开价约合人民币，未含税费、运费、汇率波动和教育折扣",
    type: "官方/授权渠道公开价折算",
    confidence: "medium"
  },
  sourceIds: ["SRCV12001"]
});
patch("turtlebot4-standard", {
  price: {
    label: "约 US$2,695 起",
    amount: 19539,
    currency: "CNY",
    range: "按官方/授权渠道美元公开价约合人民币，未含税费、运费、汇率波动和教育折扣",
    type: "官方/授权渠道公开价折算",
    confidence: "medium"
  },
  sourceIds: ["SRCV12001"]
});
patch("robotis-op3", {
  price: {
    label: "约 US$12,000 级",
    amount: 87000,
    currency: "CNY",
    range: "按 ROBOTIS 官方商城/渠道公开美元价约合人民币，未含税费、运费和区域供货差异",
    type: "官方商城公开价折算",
    confidence: "medium"
  },
  sourceIds: ["SRCV12002"]
});
patch("unitree-go2-air", {
  price: {
    label: "人民币 ¥9,997 起",
    amount: 9997,
    currency: "CNY",
    range: "按宇树 Go2 中文官网官方起售价口径，具体 Air/Pro/EDU 配置需下单时确认",
    type: "官方起售价",
    confidence: "high"
  },
  sourceIds: ["SRCV12003"]
});
patch("unitree-go2-pro", {
  price: {
    label: "Go2 系列 ¥9,997 起",
    amount: 9997,
    currency: "CNY",
    range: "按宇树 Go2 中文官网系列起售价口径，Pro 版正式价格需销售确认",
    type: "系列官方起售价",
    confidence: "medium"
  },
  sourceIds: ["SRCV12003"]
});
patch("unitree-go2-edu", {
  price: {
    label: "Go2 EDU 需正式报价",
    amount: null,
    currency: "CNY",
    range: "教育版配置、算力和售后差异较大，需宇树正式报价；Go2 系列官方起售价仅作下限参考",
    type: "厂商正式报价项",
    confidence: "medium"
  },
  sourceIds: ["SRCV12003"]
});
patch("boston-spot", {
  price: {
    label: "约 US$74,500 历史公开价",
    amount: 540125,
    currency: "CNY",
    range: "按 Spot 历史公开售价约 74,500 美元折算；当前官网需联系销售，正式采购必须重新报价",
    type: "历史公开价折算",
    confidence: "medium"
  },
  sourceIds: ["SRCV12004"]
});

data.meta = {
  ...data.meta,
  version: "v12",
  accessedDate,
  updateSummary: "补充价格状态和品牌所在地：将无公开价区分为厂商正式报价项/供货状态待确认，新增品牌中文显示名与所在地，国内到城市、国外到国家。"
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
fs.writeFileSync("outputs/学校具身智能机器人采购调研-v2.md", `# 学校具身智能机器人采购调研 v12\n\n更新时间：${accessedDate}\n\n## 数据概览\n\n- 候选设备：${data.robots.length} 个\n- 来源记录：${sources.length} 条\n- 市场层级：重点候选 ${tiers["重点候选"]} 个，市场初筛 ${tiers["市场初筛"]} 个\n- 核验状态：官网核验 ${verification["官网核验"]} 个，部分核验 ${verification["部分核验"]} 个，待核验 ${verification["待核验"]} 个\n- 价格状态：已收录公开价/估算价 ${priceStats.known} 个，厂商正式报价项 ${priceStats.formalQuote} 个，供货状态待确认 ${priceStats.supplyCheck} 个\n- 类别分布：${categoryOrder.map((category) => `${category} ${categoryCounts[category]} 个`).join("，")}\n\n## 使用说明\n\nv12 将“需询价/待核验”拆分为更准确的采购状态：公开价、厂商正式报价项、供货状态待确认。品牌筛选和表格显示新增中文品牌名与所在地；国产品牌显示城市，海外品牌显示国家或地区。\n`);

console.log(JSON.stringify({ robots: data.robots.length, sources: sources.length, tiers, verification, priceStats }, null, 2));
