"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Clock,
  Star,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LevelTwoQuestions from "@/components/levelTwoQuestions";

interface Question {
  id: string;
  ratingQuestion: string;
  reflection: string;
  ratingDescription?: string;
  reflectionDescription?: string;
}

interface AreaData {
  area: string;
  questions: Question[];
}

interface LevelTwoQuestion {
  id: string;
  capability: string;
  level: number;
  question: string;
  theme: string;
  type: string;
  requiresReflection: boolean;
}

interface AssessmentResponse {
  questionId?: string;
  rating?: number;
  response: string;
  reflectionRating?: number;
  reflection?: string;
  question: {
    ratingQuestion?: string;
    reflection?: string;
    question?: string;
  };
  area: string;
}

interface Responses {
  [key: string]: string | number;
}

interface LevelOneQuestionsProps {
  level: number;
  userInfo: {
    [key: string]: string;
    name: string;
    industry: string;
    companySize: string;
    department: string;
    jobTitle: string;
    directReports: string;
    decisionLevel: string;
    typicalProject: string;
    levelsToCEO: string;
    managesBudget: string;
  } | null;
  responsibilityLevel: FormattedResponsibilityLevel;
  onComplete: (answers: AssessmentResponse[]) => void;
}

interface FormattedResponsibilityLevel {
  level: number;
  description: string;
}

export default function LevelOneQuestions({
  level,
  userInfo,
  responsibilityLevel,
  onComplete,
}: LevelOneQuestionsProps) {
  const [assessmentData, setAssessmentData] = useState<AreaData[] | null>(null);
  const [levelTwoQuestions, setLevelTwoQuestions] = useState<
    LevelTwoQuestion[]
  >([]);
  const [currentArea, setCurrentArea] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [isLevelTwoVisible, setIsLevelTwoVisible] = useState(false);
  const [showLevelTwoPrompt, setShowLevelTwoPrompt] = useState(false);
  const [wantLevelTwo, setWantLevelTwo] = useState<boolean | null>(null);
  const [plan, setPlan] = useState<any>(null);
  const router = useRouter();

  // Add new state to track completed level two assessments
  const [completedLevelTwo, setCompletedLevelTwo] = useState<Set<string>>(
    new Set()
  );

  // Add new state at the top of the component
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/assessment/questions/level-one/${level}`
        );
        const data = await response.json();
        setAssessmentData(data.assessmentQuestionsByLevel);
      } catch (error) {
        console.error("Error fetching assessment data:", error);
        toast({
          title: "Error",
          description: "Failed to load assessment questions. Please try again.",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, [level]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setResponses((prev) => ({
      ...prev,
      [`${currentArea}-${currentQuestion}-${field}`]: value,
    }));

    const skillRating =
      field === "rating"
        ? Number(value)
        : Number(responses[`${currentArea}-${currentQuestion}-rating`]) || 0;
    const confidenceRating =
      field === "reflectionRating"
        ? Number(value)
        : Number(
            responses[`${currentArea}-${currentQuestion}-reflectionRating`]
          ) || 0;

    if (skillRating > 0 && confidenceRating > 0) {
      if (skillRating >= 4 && confidenceRating >= 3) {
        setShowLevelTwoPrompt(false);
        setIsLevelTwoVisible(false);
      } else {
        setShowLevelTwoPrompt(true);
      }
    }
  };

  const handleWantLevelTwo = (want: boolean) => {
    setWantLevelTwo(want);
    if (want) {
      setIsLevelTwoVisible(true);
      setShowLevelTwoPrompt(false);
    } else {
      // If they don't want level two, move to next question
      if (currentQuestion < assessmentData![currentArea].questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else if (currentArea < assessmentData!.length - 1) {
        setCurrentArea((prev) => prev + 1);
        setCurrentQuestion(0);
      } else {
        onComplete(formatResponsesForSubmission());
      }
    }
  };

  const formatResponsesForSubmission = (): AssessmentResponse[] => {
    if (!assessmentData) return [];

    const levelOneResponses = assessmentData.flatMap((area, areaIndex) =>
      area.questions.map((question, questionIndex) => ({
        rating: Number(responses[`${areaIndex}-${questionIndex}-rating`]) || 0,
        response:
          (responses[`${areaIndex}-${questionIndex}-response`] as string) || "",
        reflectionRating:
          Number(responses[`${areaIndex}-${questionIndex}-reflectionRating`]) ||
          0,
        reflection:
          (responses[`${areaIndex}-${questionIndex}-reflection`] as string) ||
          "",
        question: {
          ratingQuestion: question.ratingQuestion,
          reflection: question.reflection,
        },
        area: area.area,
      }))
    );

    const levelTwoResponses = levelTwoQuestions.map((question, index) => ({
      questionId: question.id,
      response: (responses[`levelTwo-${index}-response`] as string) || "",
      question: {
        question: question.question,
      },
      area: question.capability,
    }));

    return [...levelOneResponses, ...levelTwoResponses];
  };

  // Update the handleSubmitAssessment function
  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const formattedResponses = formatResponsesForSubmission();

      // Call onComplete with the final responses
      onComplete(formattedResponses);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLevelTwoComplete = (responses: AssessmentResponse[]) => {
    // If no responses (no questions available), just continue with level one
    if (responses.length === 0) {
      setIsLevelTwoVisible(false);
      setShowLevelTwoPrompt(false);

      // Move to next question in level one
      if (currentQuestion < assessmentData![currentArea].questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else if (currentArea < assessmentData!.length - 1) {
        setCurrentArea((prev) => prev + 1);
        setCurrentQuestion(0);
      } else {
        onComplete(formatResponsesForSubmission());
      }
      return;
    }

    // Add the current capability to completed level two assessments
    setCompletedLevelTwo(
      (prev) => new Set([...prev, assessmentData![currentArea].area])
    );

    // Save the responses
    const allResponses = formatResponsesForSubmission();
    const updatedResponses = [...allResponses, ...responses];

    // Return to level one questions
    setIsLevelTwoVisible(false);
    setShowLevelTwoPrompt(false);

    // Move to next question in level one
    if (currentQuestion < assessmentData![currentArea].questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else if (currentArea < assessmentData!.length - 1) {
      setCurrentArea((prev) => prev + 1);
      setCurrentQuestion(0);
    } else {
      onComplete(updatedResponses);
    }
  };

  const handleNext = async () => {
    if (!assessmentData) return;

    if (isLevelTwoVisible) {
      // This will be handled by LevelTwoQuestions component's onComplete
      return;
    }

    const skillRating =
      Number(responses[`${currentArea}-${currentQuestion}-rating`]) || 0;
    const confidenceRating =
      Number(responses[`${currentArea}-${currentQuestion}-reflectionRating`]) ||
      0;
    const currentCapability = assessmentData[currentArea].area;

    if (skillRating >= 4 && confidenceRating >= 3) {
      // Good ratings, proceed to next question
      if (currentQuestion < assessmentData[currentArea].questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else if (currentArea < assessmentData.length - 1) {
        setCurrentArea((prev) => prev + 1);
        setCurrentQuestion(0);
      } else {
        handleSubmitAssessment();
      }
    } else if (!completedLevelTwo.has(currentCapability)) {
      // Low ratings and haven't done level two for this capability yet
      setShowLevelTwoPrompt(true);
    } else {
      // Already completed level two for this capability, move to next question
      toast({
        title: "Note",
        description:
          "You've already completed the deep-dive questions for this capability. Moving to the next question.",
      });

      if (currentQuestion < assessmentData[currentArea].questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else if (currentArea < assessmentData.length - 1) {
        setCurrentArea((prev) => prev + 1);
        setCurrentQuestion(0);
      } else {
        handleSubmitAssessment();
      }
    }
  };

  const handlePrevious = () => {
    if (!assessmentData) return;

    if (!isLevelTwoVisible) {
      if (currentQuestion > 0) {
        setCurrentQuestion((prev) => prev - 1);
      } else if (currentArea > 0) {
        setCurrentArea((prev) => prev - 1);
        setCurrentQuestion(
          assessmentData[currentArea - 1].questions.length - 1
        );
      }
    } else {
      if (currentQuestion > 0) {
        setCurrentQuestion((prev) => prev - 1);
      } else {
        setIsLevelTwoVisible(false);
        setCurrentArea(assessmentData.length - 1);
        setCurrentQuestion(
          assessmentData[assessmentData.length - 1].questions.length - 1
        );
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    if (!assessmentData) return 0;

    const totalQuestions =
      assessmentData.reduce((acc, area) => acc + area.questions.length, 0) +
      (isLevelTwoVisible ? levelTwoQuestions.length : 0);

    const answeredQuestions = Object.keys(responses).filter(
      (key) => responses[key] !== ""
    ).length;

    return (answeredQuestions / totalQuestions) * 100;
  };

  const handleSave = () => {
    console.log("Saving responses:", responses);
    toast({
      title: "Progress Saved",
      description: "Your responses have been saved successfully.",
    });
  };

  if (!assessmentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const renderLevelOneQuestion = () => {
    const currentAreaData = assessmentData[currentArea];
    const currentQuestionData = currentAreaData.questions[currentQuestion];

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-blue-700">
            {currentAreaData.area}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-xl font-medium text-gray-900 mb-4 block">
              {currentQuestionData.ratingQuestion.split("\n\n")[0]}
            </Label>
            <div className="flex items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  onClick={() => handleInputChange("rating", rating)}
                  variant="outline"
                  className={`w-12 h-12 p-0 ${
                    (Number(
                      responses[`${currentArea}-${currentQuestion}-rating`]
                    ) || 0) >= rating
                      ? "bg-blue-500 text-white"
                      : "text-blue-500"
                  }`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      (Number(
                        responses[
                          `${currentArea}-${currentQuestion}-reflectionRating`
                        ]
                      ) || 0) >= rating
                        ? "fill-current"
                        : "stroke-current"
                    }`}
                  />
                </Button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Rate from 1 (Not Effectively) to 5 (Very Effectively)
            </p>
            <p className="text-gray-700 whitespace-pre-line text-lg">
              {currentQuestionData.ratingQuestion
                .split("\n\n")
                .slice(1)
                .join("\n\n")}
            </p>
            <Textarea
              id="response"
              value={
                responses[`${currentArea}-${currentQuestion}-response`] || ""
              }
              onChange={(e) => handleInputChange("response", e.target.value)}
              placeholder="Enter your response here"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[150px] text-lg mt-4"
            />
          </div>
          <div>
            <Label className="text-xl font-medium text-gray-900 mb-4 block">
              {currentQuestionData.reflection.split("\n\n")[0]}
            </Label>
            <div className="flex items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  onClick={() => handleInputChange("reflectionRating", rating)}
                  variant="outline"
                  className={`w-12 h-12 p-0 ${
                    (Number(
                      responses[
                        `${currentArea}-${currentQuestion}-reflectionRating`
                      ]
                    ) || 0) >= rating
                      ? "bg-blue-500 text-white"
                      : "text-blue-500"
                  }`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      (Number(
                        responses[
                          `${currentArea}-${currentQuestion}-reflectionRating`
                        ]
                      ) || 0) >= rating
                        ? "fill-current"
                        : "stroke-current"
                    }`}
                  />
                </Button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Rate from 1 (Not Confident) to 5 (Very Confident)
            </p>
            <p className="text-gray-700 mb-4 whitespace-pre-line text-lg">
              {currentQuestionData.reflection
                .split("\n\n")
                .slice(1)
                .join("\n\n")}
            </p>
            <Textarea
              id="reflection"
              value={
                responses[`${currentArea}-${currentQuestion}-reflection`] || ""
              }
              onChange={(e) => handleInputChange("reflection", e.target.value)}
              placeholder="Enter your reflection here"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[150px] text-lg"
            />
          </div>
          {showLevelTwoPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200"
            >
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                💡 Opportunity for Growth
              </h3>
              <p className="text-lg font-medium text-blue-700 mb-4">
                Would you like to develop your skills in this area?
              </p>
              <div className="flex space-x-4">
                <Button
                  onClick={() => handleWantLevelTwo(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 text-lg"
                >
                  Yes, I'd like to improve
                </Button>
                <Button
                  onClick={() => handleWantLevelTwo(false)}
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 font-semibold px-8 py-2 text-lg"
                >
                  No, continue
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderLevelTwoQuestion = () => {
    const currentQuestionData = levelTwoQuestions[currentQuestion];

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-blue-700">
            {currentQuestionData.capability}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-xl font-medium text-gray-900 mb-4 block">
              {currentQuestionData.question}
            </Label>
            <Textarea
              id="levelTwoResponse"
              value={responses[`levelTwo-${currentQuestion}-response`] || ""}
              onChange={(e) =>
                handleInputChange(
                  `levelTwo-${currentQuestion}-response`,
                  e.target.value
                )
              }
              placeholder="Enter your response here"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[150px] text-lg mt-4"
            />
          </div>
          {currentQuestionData.requiresReflection && (
            <div>
              <Label className="text-xl font-medium text-gray-900 mb-4 block">
                Reflect on your response:
              </Label>
              <Textarea
                id="levelTwoReflection"
                value={
                  responses[`levelTwo-${currentQuestion}-reflection`] || ""
                }
                onChange={(e) =>
                  handleInputChange(
                    `levelTwo-${currentQuestion}-reflection`,
                    e.target.value
                  )
                }
                placeholder="Enter your reflection here"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[150px] text-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {!isLevelTwoVisible ? (
        <Card className="w-full max-w-2xl">
          <CardHeader className="bg-blue-600 text-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold">
                Leadership Capability Assessment
              </CardTitle>
              <div className="flex items-center text-blue-100">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-lg">{formatTime(timeRemaining)}</span>
              </div>
            </div>
            <CardDescription className="text-blue-100 text-lg mt-2">
              {isLevelTwoVisible
                ? "Deep Dive Questions"
                : "Assess your leadership capabilities and identify areas for growth"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <Progress value={calculateProgress()} className="w-full h-3" />
              <p className="text-sm text-gray-600 mt-2">
                Progress: {Math.round(calculateProgress())}% complete
              </p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentArea}-${currentQuestion}-${isLevelTwoVisible}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {isLevelTwoVisible
                  ? renderLevelTwoQuestion()
                  : renderLevelOneQuestion()}
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                onClick={handlePrevious}
                disabled={
                  currentArea === 0 &&
                  currentQuestion === 0 &&
                  !isLevelTwoVisible
                }
                variant="outline"
                className="flex items-center text-lg"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                variant="outline"
                className="flex items-center text-lg"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Progress
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center text-lg"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {(isLevelTwoVisible &&
                  currentQuestion === levelTwoQuestions.length - 1) ||
                (!isLevelTwoVisible &&
                  currentArea === assessmentData.length - 1 &&
                  currentQuestion ===
                    assessmentData[currentArea].questions.length - 1)
                  ? "Complete"
                  : "Next"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <LevelTwoQuestions
          level={level + 1}
          capability={assessmentData[currentArea].area}
          skill={
            Number(responses[`${currentArea}-${currentQuestion}-rating`]) || 0
          }
          confidence={
            Number(
              responses[`${currentArea}-${currentQuestion}-reflectionRating`]
            ) || 0
          }
          onComplete={handleLevelTwoComplete}
        />
      )}
    </div>
  );
}
