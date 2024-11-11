"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Classification from "@/components/classification";
import LevelOneQuestions from "@/components/LevelOneQuestions";
import LevelTwoQuestions from "@/components/levelTwoQuestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface UserInfo {
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
}

interface ClassificationResult {
  responsibilityLevel: number;
  role: string;
  description: string;
  versionInfo: {
    "v1.0": string;
    "v2.0": string;
  };
  nextStep: string;
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

export default function AssessmentFlow() {
  const { isAuthenticated, isLoading } = useAuth();
  const [step, setStep] = useState<
    "intro" | "classification" | "levelOne" | "levelTwo" | "complete"
  >("intro");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [classificationResult, setClassificationResult] =
    useState<ClassificationResult | null>(null);
  const [levelOneResponses, setLevelOneResponses] = useState<
    AssessmentResponse[]
  >([]);
  const [currentCapability, setCurrentCapability] = useState<string | null>(
    null
  );
  const [skillRating, setSkillRating] = useState<number | null>(null);
  const [confidenceRating, setConfidenceRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Middleware will handle redirect
  }

  const handleClassificationComplete = async (
    info: UserInfo,
    result: ClassificationResult
  ) => {
    setIsSubmitting(true);
    try {
      setUserInfo(info);
      setClassificationResult(result);
      setStep("levelOne");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLevelOneComplete = async (responses: AssessmentResponse[]) => {
    setLevelOneResponses(responses);
    const lastResponse = responses[responses.length - 1];

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/assessment/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responses: responses,
          userInfo: userInfo,
          classificationResult: classificationResult,
          completedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate development plan");
      }

      const data = await response.json();

      localStorage.setItem("developmentPlan", JSON.stringify(data.plan));
      localStorage.setItem("developmentPlanGoals", JSON.stringify(data.goals));
      localStorage.setItem(
        "developmentPlanSkills",
        JSON.stringify(data.skills)
      );

      if (
        (lastResponse.rating && lastResponse.rating < 4) ||
        (lastResponse.reflectionRating && lastResponse.reflectionRating < 3)
      ) {
        setCurrentCapability(lastResponse.area);
        setSkillRating(lastResponse.rating || 0);
        setConfidenceRating(lastResponse.reflectionRating || 0);
        setStep("levelTwo");
      } else {
        setStep("complete");
      }
    } catch (error) {
      console.error("Error generating development plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate development plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLevelTwoComplete = (responses: AssessmentResponse[]) => {
    setLevelOneResponses((prev) => [...prev, ...responses]);
    setStep("complete");
  };

  const renderStep = () => {
    switch (step) {
      case "intro":
        return (
          <Card className="w-full max-w-4xl shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-t-xl">
              <CardTitle className="text-3xl font-bold text-center">
                Leadership Capability Assessment
              </CardTitle>
              <p className="text-blue-100 text-center mt-2">
                Discover Your Leadership Potential
              </p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <p className="text-lg text-gray-700">
                  Welcome to the Leadership Capability Assessment. This
                  comprehensive evaluation will help identify your leadership
                  strengths and areas for growth.
                </p>
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Assessment Journey
                  </h3>
                  <ol className="space-y-4">
                    {[
                      {
                        title: "Demographic Information",
                        description: "Help us understand your context",
                      },
                      {
                        title: "Core Assessment",
                        description: "Evaluate key leadership capabilities",
                      },
                      {
                        title: "Deep Dive (if needed)",
                        description: "Detailed exploration of specific areas",
                      },
                    ].map((step, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 text-left"
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {step.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="mt-8">
                <Button
                  onClick={() => setStep("classification")}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>Begin Assessment</span>
                  )}
                </Button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  Estimated completion time: 30-45 minutes
                </p>
              </div>
            </CardContent>
          </Card>
        );
      case "classification":
        return <Classification onComplete={handleClassificationComplete} />;
      case "levelOne":
        return classificationResult ? (
          <LevelOneQuestions
            level={classificationResult.responsibilityLevel}
            userInfo={userInfo}
            responsibilityLevel={{
              level: classificationResult.responsibilityLevel,
              description: classificationResult.description,
            }}
            onComplete={handleLevelOneComplete}
          />
        ) : null;
      case "levelTwo":
        return currentCapability &&
          skillRating !== null &&
          confidenceRating !== null ? (
          <LevelTwoQuestions
            level={classificationResult?.responsibilityLevel || 1}
            capability={currentCapability}
            skill={skillRating}
            confidence={confidenceRating}
            onComplete={handleLevelTwoComplete}
          />
        ) : null;
      case "complete":
        return (
          <Card className="w-full max-w-4xl shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-t-xl">
              <CardTitle className="text-3xl font-bold text-center">
                Assessment Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Congratulations!
                </h2>
                <p className="text-lg text-gray-700">
                  You've successfully completed the Leadership Capability
                  Assessment.
                </p>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg">
                  <p className="text-gray-700">
                    Your responses have been analyzed and your personalized
                    development plan is ready.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/dashboard")}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Generating Plan...</span>
                  </div>
                ) : (
                  <span>View Development Plan</span>
                )}
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl" // Added to ensure consistent width
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
