# Web App Spec

## Purpose

The final Web App should help a school compare robot platforms for research, teaching, and deployment procurement decisions.

## Main Views

### Overview

- Category distribution: robotic arms, humanoids, quadrupeds, mobile manipulators, end effectors.
- Price range summary.
- Research adoption summary.
- Shortlist cards for research, teaching, and deployment.

### Browse And Filter

- Search by model, vendor, category, research topic, or software ecosystem.
- Filters:
  - Robot category.
  - Price range.
  - Domestic or imported.
  - ROS or ROS 2 support.
  - Payload, reach, DOF, mobility, endurance.
  - Dexterous hand or gripper support.
  - Research adoption level.
  - Procurement feasibility.

### Compare

- Select multiple robots.
- Compare specs, price, ecosystem, research signals, deployment risks, and source confidence.

### Robot Detail

- Product image.
- Official website.
- Key specs.
- Price and procurement notes.
- Research evidence.
- Software and simulator support.
- Accessories and end effectors.
- Deployment scenarios and risks.
- Source list.

### Sources

- Searchable table of all sources.
- Group by vendor, product, source type, and confidence.
- Show which claims each source supports.

## Data Inputs

- Candidate records should follow `work/robot_candidate_schema.json`.
- Comparison dimensions should follow `work/evaluation_matrix_template.csv`.
- Source evidence should follow `work/source_log_template.csv`.

## Design Direction

- Make the first screen an actual comparison dashboard, not a marketing landing page.
- Prioritize dense, readable procurement information.
- Use clear category filters and comparison tables.
- Keep evidence confidence visible so uncertain prices or non-official claims are not mistaken for confirmed facts.

