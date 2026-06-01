# Robot Procurement Research

高校具身智能机器人采购选型调研数据与静态网页。

## 内容

- `app/`：Vite + React 静态网页，用于浏览、筛选、对比和导出候选机器人。
- `app/src/robotResearchData.json`：网页使用的数据快照。
- `work/data/robot_research_data.json`：同源研究数据。
- `work/scripts/`：数据生成与增强脚本。
- `outputs/`：调研报告、来源追踪表和页面视觉资源。

## 当前数据口径

- 候选设备：152 款
- 来源记录：1565 条
- 四大类：机械臂、移动/复合机器人、人形机器人、机器狗
- 市场层级：重点候选、市场初筛
- 价格口径：公开价、估算价、需询价分开记录；低置信来源不作为正式采购报价。

## 本地运行

```bash
cd app
npm install
npm run dev
```

构建：

```bash
cd app
npm run build
```

## 说明

本项目用于采购调研和候选池初筛。市场初筛候选主要用于扩大品牌和型号覆盖面，正式采购前仍需向厂商或授权代理二次核验价格、配置、交付、售后、教学/科研授权和安全条款。
