"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DemographicQuestions } from "@/utils/demographic_questions";
import { useRouter } from "next/navigation";
import {
  demographicSchema,
  type DemographicFormData,
} from "@/lib/validators/demographics";
import { z } from "zod";
import { useSession } from "next-auth/react";
import {
  ClassificationProps,
  Question,
  ClassificationResult,
} from "@/types/types";
import { useAuth } from "@/hooks/useAuth";

const Classification: React.FC<ClassificationProps> = ({ onComplete }) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [userInfo, setUserInfo] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [classificationResult, setClassificationResult] =
    useState<ClassificationResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showKnowMoreOptions, setShowKnowMoreOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path[0]}: ${err.message}`)
        .join("\n");

      toast({
        title: "Please check your inputs",
        description: errorMessages,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to process your information: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const loadedQuestions = await DemographicQuestions();
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error("Failed to load questions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleInputChange = (id: string, value: string) => {
    setUserInfo((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const validateCurrentStep = () => {
    const currentQuestion = questions[currentStep];
    const value = userInfo[currentQuestion.id];

    if (!value || value.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.id]: "This field is required",
      }));
      return false;
    }

    if (currentQuestion.type === "number") {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        setErrors((prev) => ({
          ...prev,
          [currentQuestion.id]: "Please enter a valid positive number",
        }));
        return false;
      }
    }

    if (currentQuestion.id === "typicalProject" && value.length < 20) {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.id]: "Please provide at least 20 characters",
      }));
      return false;
    }

    return true;
  };

  const classifyUser = async (formData: Record<string, string>) => {
    try {
      if (!isAuthenticated) {
        toast({
          title: "Session Error",
          description: "Please sign in to continue",
          variant: "destructive",
        });
        router.push("/login");
        return null;
      }

      const payload: DemographicFormData = {
        name: formData.name,
        industry: formData.industry,
        companySize: Math.max(1, parseInt(formData.employeeCount) || 0),
        department: formData.department,
        jobTitle: formData.jobTitle,
        directReports: parseInt(formData.directReports) || 0,
        reportingRoles: formData.reportingRoles || "None",
        decisionLevel: (formData.decisionLevel.charAt(0).toUpperCase() +
          formData.decisionLevel.slice(1)) as
          | "Operational"
          | "Tactical"
          | "Strategic",
        typicalProject: formData.typicalProject,
        levelsToCEO: parseInt(formData.levelsToCEO) || 0,
        managesBudget: formData.managesBudget === "yes",
      };

      const validatedData = demographicSchema.parse(payload);

      const response = await fetch("/api/assessment/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to classify user");
      }

      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error("Error classifying user:", error);
      handleError(error);
      return null;
    }
  };

  const handleSkipAssessment = async () => {
    if (!validateCurrentStep()) return;
    setIsSubmitting(true);
    try {
      const result = await classifyUser(userInfo);
      if (result) {
        // Send only demographic and classification data to generate endpoint
        const response = await fetch("/api/assessment/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            demographicData: userInfo,
            classificationResult: result,
            isSkipped: true,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate assessment");
        }

        const data = await response.json();
        console.log("Development Plan:", data);
        localStorage.setItem("developmentPlan", JSON.stringify(data.plan));

        router.push("/dashboard");
        // Navigate to results or dashboard
        onComplete(userInfo, result);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowSampleData = () => {
    toast({
      title: "Sample Assessment",
      description: (
        <div className="space-y-2">
          <p>Here's what you can expect in the assessment:</p>
          <ul className="list-disc pl-4">
            <li>Leadership capability evaluation</li>
            <li>Skill-based questions</li>
            <li>Confidence assessment</li>
            <li>Detailed feedback and recommendations</li>
          </ul>
          <p>Average completion time: 30-45 minutes</p>
        </div>
      ),
      duration: 10000,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === questions.length - 1) {
      if (validateCurrentStep()) {
        setIsSubmitting(true);
        try {
          console.log("Submitting user info:", userInfo);
          const result = await classifyUser(userInfo);
          console.log("Classification result:", result);

          if (result) {
            setClassificationResult(result);
            setShowOptions(true);
          } else {
            throw new Error("No classification result received");
          }
        } catch (error) {
          console.error("Error in handleSubmit:", error);
          toast({
            title: "Error",
            description:
              "Failed to process your information. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      handleNext();
    }
  };

  const renderInput = (question: Question) => {
    switch (question.type) {
      case "text":
        return (
          <Input
            id={question.id}
            placeholder={question.placeholder}
            value={userInfo[question.id] || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(question.id, e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        );
      case "number":
        return (
          <Input
            id={question.id}
            type="number"
            placeholder={question.placeholder}
            value={userInfo[question.id] || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(question.id, e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        );
      case "textarea":
        return (
          <Textarea
            id={question.id}
            placeholder={question.placeholder}
            value={userInfo[question.id] || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleInputChange(question.id, e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
          />
        );
      case "select":
        return (
          <Select
            value={userInfo[question.id] || ""}
            onValueChange={(value) => handleInputChange(question.id, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "boolean":
        return (
          <div className="space-y-4">
            <RadioGroup
              value={userInfo[question.id]}
              onValueChange={(value) => handleInputChange(question.id, value)}
              className="flex space-x-4"
            >
              <div className="flex items-center">
                <RadioGroupItem
                  value="yes"
                  id={`${question.id}-yes`}
                  className="sr-only"
                />
                <Label
                  htmlFor={`${question.id}-yes`}
                  className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-200 ${
                    userInfo[question.id] === "yes"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem
                  value="no"
                  id={`${question.id}-no`}
                  className="sr-only"
                />
                <Label
                  htmlFor={`${question.id}-no`}
                  className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-200 ${
                    userInfo[question.id] === "no"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  No
                </Label>
              </div>
            </RadioGroup>
            {userInfo[question.id] === "yes" && question.additionalInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <Label
                  htmlFor={`${question.id}-additional`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {question.additionalInfo.question}
                </Label>
                <Input
                  id={`${question.id}-additional`}
                  type="text"
                  placeholder={question.additionalInfo.placeholder}
                  value={userInfo[`${question.id}-additional`] || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(
                      `${question.id}-additional`,
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </motion.div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const currentQuestion = questions[currentStep];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("User is not authenticated");
    router.push("/login");
    return null;
  }

  const renderOptions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 mt-6"
    >
      <Button
        onClick={() => setShowKnowMoreOptions(true)}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        Start Assessment
      </Button>
      <Button
        onClick={handleSkipAssessment}
        disabled={isSubmitting}
        variant="outline"
        className="w-full"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Skip Assessment
      </Button>
    </motion.div>
  );

  const renderKnowMoreOptions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 mt-6"
    >
      <Button
        onClick={() => onComplete(userInfo, classificationResult!)}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        Start Now
      </Button>
      <Button
        onClick={handleShowSampleData}
        variant="outline"
        className="w-full"
      >
        Know More
      </Button>
    </motion.div>
  );

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Demographic Information</h1>
          <p className="mt-2 text-blue-100">Help us understand you better</p>
        </div>
        <div className="p-6">
          {!classificationResult ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-full h-2 rounded-full ${
                        index < currentStep
                          ? "bg-blue-500"
                          : index === currentStep
                          ? "bg-blue-300"
                          : "bg-gray-200"
                      } transition-all duration-300 ease-in-out`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {questions.length}
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <Label
                        htmlFor={currentQuestion.id}
                        className="block text-lg font-medium mb-2 text-gray-700"
                      >
                        {currentQuestion.question}
                      </Label>
                      {renderInput(currentQuestion)}
                      {errors[currentQuestion.id] && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors[currentQuestion.id]}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  {currentStep < questions.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Submit
                    </Button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <p className="text-lg">
                  <strong>Responsibility Level:</strong>{" "}
                  {classificationResult.responsibilityLevel}
                </p>
                <p className="text-lg">
                  <strong>Role:</strong> {classificationResult.role}
                </p>
                <p className="text-lg">
                  <strong>Description:</strong>{" "}
                  {classificationResult.description}
                </p>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">Version Info:</p>
                  <div className="ml-4 space-y-2">
                    <p className="text-lg">
                      <strong>v1.0:</strong>{" "}
                      {classificationResult.versionInfo["v1.0"]}
                    </p>
                    <p className="text-lg">
                      <strong>v2.0:</strong>{" "}
                      {classificationResult.versionInfo["v2.0"]}
                    </p>
                  </div>
                </div>
                <p className="text-lg">
                  <strong>Next Step:</strong> {classificationResult.nextStep}
                </p>
              </div>

              {!showKnowMoreOptions && renderOptions()}
              {showKnowMoreOptions && renderKnowMoreOptions()}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classification;
