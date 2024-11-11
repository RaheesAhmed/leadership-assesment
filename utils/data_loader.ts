import { promises as fs } from "fs";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "../data");

export let responsibilityLevelsData: any = null;
export let levelOneQuestions: any[] = [];
export let levelTwoQuestions: any[] = [];

let isDataLoaded = false;

export async function loadData() {
  try {
    [responsibilityLevelsData, levelOneQuestions, levelTwoQuestions] =
      await Promise.all([
        readResponsibilityLevelsData(),
        readLevelOneQuestions(),
        readLevelTwoQuestions(),
      ]);

    console.log("Loaded level one questions:", levelOneQuestions.length);
    console.log("Loaded level two questions:", levelTwoQuestions.length);

    if (!responsibilityLevelsData || responsibilityLevelsData.length === 0) {
      throw new Error(
        "Responsibility levels data is empty or not loaded correctly"
      );
    }

    isDataLoaded = true;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
}

async function readJSONFile(filename: string) {
  const filePath = path.join(dataDir, filename);
  const rawData = await fs.readFile(filePath, "utf8");
  return JSON.parse(rawData);
}

export async function readResponsibilityLevelsData() {
  const data = await readJSONFile("responsibility_level.json");
  return data;
}

export async function readLevelOneQuestions() {
  const questions = await readJSONFile("level_one_questions.json");
  console.log("Raw level one questions:", questions.length);
  const processedQuestions = questions.flatMap(processLevelOneQuestion);
  console.log("Processed level one questions:", processedQuestions.length);
  return processedQuestions;
}

function processLevelOneQuestion(question: any) {
  const capabilities = [
    "Building a Team",
    "Developing Others",
    "Leading a Team to Get Results",
    "Managing Performance",
    "Managing the Business",
    "Personal Development",
    "Communicating as a Leader",
    "Creating the Environment",
  ];

  const processedQuestions: any[] = [];

  capabilities.forEach((capability) => {
    const skillKey = Object.keys(question).find(
      (key) => key.includes(capability) && key.includes("(Skill)")
    );
    const confidenceKey = Object.keys(question).find(
      (key) => key.includes(capability) && key.includes("(Confidence)")
    );

    if (skillKey && confidenceKey) {
      processedQuestions.push({
        capability: capability,
        Lvl: question.Lvl,
        "Role Name": question[" Role Name"],
        question: question[skillKey],
        ratingQuestion: question[skillKey],
        reflection: question[confidenceKey],
      });
    }
  });

  return processedQuestions;
}

export async function readLevelTwoQuestions() {
  const questions = await readJSONFile("level_two_questions.json");
  console.log("Loaded level two questions:", questions.length);
  return questions;
}

export const getLevelOneQuestions = async (
  capability: string,
  level: number
) => {
  if (!isDataLoaded) {
    await loadData();
  }

  const questions = levelOneQuestions.filter(
    (q: any) => q.capability === capability && q.Lvl === level
  );
  return questions;
};

export async function getLevelTwoQuestions(
  capability: string,
  level: string | number
) {
  try {
    if (!isDataLoaded) {
      await loadData();
    }

    if (!levelTwoQuestions || !Array.isArray(levelTwoQuestions)) {
      console.error("Level two questions not properly loaded");
      return [];
    }

    const numericLevel =
      typeof level === "string" ? parseInt(level, 10) : level;

    const levelData = levelTwoQuestions.find((q) => q.Lvl === numericLevel);
    if (!levelData) {
      console.error(`No data found for level ${level}`);
      return [];
    }

    const capabilityKey = ` ${capability}`;
    const capabilityContent = levelData[capabilityKey];

    if (!capabilityContent) {
      console.error(
        `No content found for capability "${capability}" at level ${level}`
      );
      return [];
    }

    const themesAndFocusAreas = parseAllAreasForLevelTwo(capabilityContent);

    return themesAndFocusAreas.map((theme, index) => ({
      id: `${capability}-l2-${index}`,
      capability,
      level: numericLevel,
      question: `Regarding "${theme}", please describe your specific challenges and experiences:`,
      theme,
      type: "detailed",
      requiresReflection: true,
    }));
  } catch (error) {
    console.error("Error getting level two questions:", error);
    throw error;
  }
}

function parseAllAreasForLevelTwo(content) {
  if (typeof content !== "string") {
    return [];
  }

  const lines = content.split("\n");
  const themes = [];

  const contentLines = lines.filter(
    (line) => line.trim() && !line.trim().startsWith("Themes or Focus Areas:")
  );

  for (let line of contentLines) {
    const [header, ...descriptionParts] = line.split(":");
    if (descriptionParts.length > 0) {
      const description = descriptionParts.join(":").trim();
      if (header && description) {
        themes.push(`${header.trim()}: ${description}`);
      }
    }
  }

  return themes;
}
