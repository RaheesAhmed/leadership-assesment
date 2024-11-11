import { readLevelOneQuestions } from "@/utils/data_loader";

export async function getLevelOneQuestions() {
  const levelOneQuestions = await readLevelOneQuestions();
  return levelOneQuestions;
}

export async function getLevelOneQuestionsByLevel({
  level,
}: {
  level: string;
}) {
  const levelOneQuestions = await readLevelOneQuestions();
  console.log("Total level one questions:", levelOneQuestions?.length || 0);

  // Normalize the level string and convert to number
  const normalizedLevel = parseInt(level);

  if (isNaN(normalizedLevel)) {
    console.warn("Invalid level provided:", level);
    return [];
  }

  console.log("Normalized level:", normalizedLevel);

  // Filter questions for the specified level
  const filteredQuestions = levelOneQuestions.filter(
    (q: any) => q.Lvl === normalizedLevel
  );

  // Group questions by capability area
  const questionsByArea = filteredQuestions.reduce(
    (acc: any, question: any) => {
      if (!acc[question.capability]) {
        acc[question.capability] = [];
      }
      acc[question.capability].push({
        question: question.question,
        ratingQuestion: question.ratingQuestion,
        reflection: question.reflection,
      });
      return acc;
    },
    {}
  );

  // Convert the grouped questions into the desired format
  const LevelOneQuestionsbyLevel = Object.entries(questionsByArea).map(
    ([area, questions]) => ({
      area,
      questions,
    })
  );

  return LevelOneQuestionsbyLevel;
}
