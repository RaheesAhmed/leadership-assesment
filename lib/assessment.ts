import {
  getLevelOneQuestions,
  getLevelTwoQuestions,
} from "@/utils/data_loader";
import { classifyResponsibilityLevel } from "@/lib/classifiers/responsibility-level";

// Initialize assessment state
export const initializeAssessment = (responsibilityLevel: any) => {
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
export const getNextQuestion = async (assessmentState: any) => {
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
export const handleResponse = async (assessmentState: any, response: any) => {
  const { capability, answers, wantsDeeperDive } = response;

  // Store the response
  assessmentState.responses[capability] = {
    ...assessmentState.responses[capability],
    levelOne: answers,
  };

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
  }

  // Move to next capability
  assessmentState.currentCapability += 1;
  return getNextQuestion(assessmentState);
};

// Start the assessment process
export const startAssessment = async (demographicResponses: any) => {
  try {
    // Classify responsibility level
    const level = await classifyResponsibilityLevel(demographicResponses);
    console.log("Classified level:", level);

    // Initialize assessment state
    const assessmentState = initializeAssessment(level);
    assessmentState.demographics = demographicResponses;

    // Get first question
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
export const processResponse = async (assessmentState: any, response: any) => {
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
