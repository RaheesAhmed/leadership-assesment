import { getLevelOneQuestions, getLevelTwoQuestions } from "./data_loader";
import { classifyResponsibilityLevel } from "@/lib/classifiers/responsibility-level";

// Define types
interface ResponsibilityLevel {
  level: string;
  // Add other properties if needed
}

interface AssessmentState {
  userLevel: string;
  currentCapability: number;
  capabilities: string[];
  responses: Record<
    string,
    {
      levelOne?: any;
      levelTwo?: any;
    }
  >;
  demographics: DemographicData | null;
  responsibilityLevel: ResponsibilityLevel;
}

interface DemographicData {
  name?: string;
  industry?: string;
  companySize?: number;
  department?: string;
  jobTitle?: string;
  directReports?: number;
  decisionLevel?: string;
  typicalProject?: string;
  levelsToCEO?: number;
  managesBudget?: boolean;
}

interface QuestionResponse {
  capability: string;
  answers: any;
  wantsDeeperDive: boolean;
  type?: "levelOne" | "levelTwo";
}

// Initialize assessment state
export const initializeAssessment = (
  responsibilityLevel: ResponsibilityLevel
): AssessmentState => {
  return {
    userLevel: responsibilityLevel.level,
    currentCapability: 0,
    capabilities: [
      "Building a Team",
      "Developing Others",
      "Leading a Team to Get Results",
      "Managing Performance",
      "Managing the Business (Business Acumen)",
      "Personal Development",
      "Communicating as a Leader",
      "Creating the Environment",
    ],
    responses: {},
    demographics: null,
    responsibilityLevel: responsibilityLevel,
  };
};

// Get the next question based on current state
export const getNextQuestion = async (assessmentState: AssessmentState) => {
  const { userLevel, currentCapability, capabilities } = assessmentState;

  if (currentCapability >= capabilities.length) {
    return { complete: true };
  }

  const currentCapabilityName = capabilities[currentCapability];

  try {
    const questions = await getLevelOneQuestions(
      currentCapabilityName,
      userLevel
    );
    return {
      capability: currentCapabilityName,
      questions,
      type: "levelOne",
      complete: false,
    };
  } catch (error) {
    console.error("Error getting questions:", error);
    throw error;
  }
};

// Handle response and determine next steps
export const handleResponse = async (
  assessmentState: AssessmentState,
  response: QuestionResponse
) => {
  const { capability, answers, wantsDeeperDive } = response;

  // Store the response based on the question type
  if (!assessmentState.responses[capability]) {
    assessmentState.responses[capability] = {};
  }

  if (response.type === "levelTwo") {
    assessmentState.responses[capability].levelTwo = answers;
    // Move to next capability after level two
    assessmentState.currentCapability += 1;
    return getNextQuestion(assessmentState);
  } else {
    // This is a level one response
    assessmentState.responses[capability].levelOne = answers;

    if (wantsDeeperDive) {
      try {
        const levelTwoQuestions = await getLevelTwoQuestions(
          capability,
          assessmentState.userLevel
        );
        return {
          capability,
          questions: levelTwoQuestions,
          type: "levelTwo",
          complete: false,
        };
      } catch (error) {
        console.error("Error getting level two questions:", error);
        throw error;
      }
    } else {
      // Move to next capability if no deeper dive
      assessmentState.currentCapability += 1;
      return getNextQuestion(assessmentState);
    }
  }
};

// Start the assessment process
export const startAssessment = async (
  demographicResponses: DemographicData
) => {
  try {
    const level = await classifyResponsibilityLevel(demographicResponses);
    console.log("Classified level:", level);

    const assessmentState = initializeAssessment(level);
    assessmentState.demographics = demographicResponses;

    const firstQuestion = await getNextQuestion(assessmentState);

    return {
      assessmentState,
      nextQuestion: firstQuestion,
      level,
    };
  } catch (error) {
    console.error("Error starting assessment:", error);
    throw error;
  }
};

// Process a response and get next question
export const processResponse = async (
  assessmentState: AssessmentState,
  response: QuestionResponse
) => {
  try {
    const nextQuestion = await handleResponse(assessmentState, response);

    return {
      assessmentState,
      nextQuestion,
      isComplete: nextQuestion.complete,
    };
  } catch (error) {
    console.error("Error processing response:", error);
    throw error;
  }
};

export const processAssessment = async (demographicData: DemographicData) => {
  const { assessmentState, nextQuestion } = await startAssessment(
    demographicData
  );
  return { assessmentState, nextQuestion };
};
