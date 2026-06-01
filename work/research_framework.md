# Research Framework

## Assumptions

- The buyer is a school selecting physical robot platforms.
- The research must serve both academic research and practical deployment projects.
- The final deliverable should be an interactive Web App, not only a static report.
- Current model availability, pricing, specifications, and vendor claims must be verified online before being treated as evidence.

## Success Criteria

1. Scope is defined before vendor comparison.
   - Verify by completing `work/scenario_constraints.md`.
2. Evaluation dimensions are stable before scoring.
   - Verify by using `work/evaluation_matrix_template.csv`.
3. Candidate data is structured for the final Web App.
   - Verify each candidate can fit `work/robot_candidate_schema.json`.
4. Vendor claims and research-use claims are traceable.
   - Verify every material claim has a row in `work/source_log_template.csv`.
5. Recommendations are scenario-specific.
   - Verify each shortlist maps to research, teaching, or deployment needs.

## Candidate Categories

- Robotic arms.
- Humanoid robots.
- Quadruped robots.
- Mobile manipulators.
- End effectors, including dexterous hands and grippers, when relevant to a robot configuration.

## Work Sequence

1. Define school needs, budget, lab constraints, and target research directions.
2. Lock evaluation criteria and scoring notes.
3. Build a candidate longlist by category.
4. Verify official specifications, pricing, and procurement availability.
5. Verify research adoption through papers, project pages, labs, GitHub repositories, and benchmarks.
6. Score candidates with confidence levels.
7. Produce shortlists for research, teaching, and deployment pilots.
8. Build the Web App from the cleaned dataset and source log.

## Research Adoption Signals

- Appears in peer-reviewed papers or widely cited preprints.
- Used by multiple universities or robotics labs.
- Has ROS, ROS 2, SDK, simulator, public datasets, or example code.
- Supports common research tasks such as manipulation, navigation, locomotion, imitation learning, reinforcement learning, teleoperation, data collection, and human-robot interaction.
- Has enough documentation for students and researchers to reproduce experiments.

## Practical Deployment Signals

- Stable hardware and clear maintenance path.
- Available spare parts and responsive support.
- Safety features appropriate for a school lab.
- Clear integration interfaces.
- Reasonable total cost of ownership.
- Deployable in realistic campus, lab, inspection, logistics, service, or demonstration scenarios.

