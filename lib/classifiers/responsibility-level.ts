import { responsibilityLevelsData } from "@/utils/data_loader";
import { Demographics } from "@/types/assessment";

export async function classifyResponsibilityLevel(
  demographicInfo: Demographics
) {
  if (
    !responsibilityLevelsData ||
    !Array.isArray(responsibilityLevelsData) ||
    responsibilityLevelsData.length === 0
  ) {
    console.error("Responsibility levels data not loaded or empty");
    throw new Error("Responsibility levels data not loaded or empty");
  }

  const {
    name,
    industry,
    companySize,
    department,
    jobTitle,
    directReports,
    reportingRoles,
    decisionLevel,
    typicalProject,
    levelsToCEO,
    managesBudget,
  } = demographicInfo;

  // Check if required fields are present
  if (
    !jobTitle ||
    !decisionLevel ||
    directReports === undefined ||
    levelsToCEO === undefined
  ) {
    console.error("Missing required demographic information", demographicInfo);
    throw new Error("Missing required demographic information");
  }

  // Convert decisionLevel to lowercase for case-insensitive comparison
  const normalizedDecisionLevel = decisionLevel.toLowerCase();

  // Define weights for different factors
  const weights = {
    directReports: 0.3,
    decisionLevel: 0.3,
    levelsToCEO: 0.2,
    managesBudget: 0.1,
    companySize: 0.1,
  };

  // Calculate a score based on the input data
  let score = 0;
  score += Math.min(directReports / 10, 1) * weights.directReports;
  score +=
    (normalizedDecisionLevel === "strategic"
      ? 1
      : normalizedDecisionLevel === "tactical"
      ? 0.5
      : 0) * weights.decisionLevel;
  score += (1 - Math.min(levelsToCEO / 5, 1)) * weights.levelsToCEO;
  score += (managesBudget ? 1 : 0) * weights.managesBudget;
  score += Math.min(companySize / 1000, 1) * weights.companySize;

  console.log("Calculated score:", score);

  // Map the score to responsibility levels
  const levels = [
    "Individual Contributor",
    "Team Lead",
    "Supervisor",
    "Manager",
    "Senior Manager / Associate Director",
    "Director",
    "Senior Director / Vice President",
    "Senior Vice President",
    "Executive Vice President",
    "Chief Officer",
  ];

  const levelIndex = Math.min(
    Math.floor(score * levels.length),
    levels.length - 1
  );
  const classifiedLevel = levels[levelIndex];

  //console.log("Classified level:", classifiedLevel);

  // Find the matching level in responsibilityLevelsData
  const matchedLevel = responsibilityLevelsData.find(
    (level) =>
      (level["Role Name"] || level["Responsibility Level"]) === classifiedLevel
  );

  if (!matchedLevel) {
    console.error("Unable to find matching responsibility level", {
      classifiedLevel,
      responsibilityLevelsData,
    });
    throw new Error("Unable to find matching responsibility level");
  }

  const result = {
    role: classifiedLevel,
    level: levelIndex,
    description: matchedLevel.Description,
    versionInfo: {
      "v1.0": matchedLevel["v1.0"],
      "v2.0": matchedLevel["v2.0"],
    },
  };

  //console.log("Classification result:", result);
  return result;
}
