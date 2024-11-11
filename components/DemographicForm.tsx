"use client";

import { Question } from "@/types/types";
import React, { useState } from "react";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DemographicFormProps {
  questions: Question[];
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
  };
  currentStep: number;
  handleInputChange: (id: string, value: string) => void;
  errors: Record<string, string>;
  handleNext: () => void;
  handlePrevious: () => void;
  handleDemographicSubmit: (formData: FormData) => Promise<void>;
}

interface ClassificationResult {
  responsibilityLevel: number;
  role: string;
  description: string;
  versionInfo: {
    v1: string;
    v2: string;
  };
  nextStep: string;
}

const DemographicForm: React.FC<DemographicFormProps> = ({
  questions,
  userInfo,
  currentStep,
  handleInputChange,
  errors,
  handleNext,
  handlePrevious,
  handleDemographicSubmit,
}) => {
  const [classificationResult, setClassificationResult] =
    useState<ClassificationResult | null>(null);

  const currentQuestion = questions[currentStep];

  const classifyUser = async (userInfo: Record<string, string>) => {
    try {
      const response = await fetch("/api/assessment/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error("Failed to classify user");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error classifying user:", error);
      toast({
        title: "Error",
        description: "Failed to classify user. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === questions.length - 1) {
      const result = await classifyUser(userInfo);
      if (result) {
        setClassificationResult(result);
        handleDemographicSubmit(userInfo);
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
              id={question.id}
              value={userInfo[question.id]}
              onValueChange={(value) => {
                handleInputChange(question.id, value);
              }}
              className="flex space-x-4"
            >
              <div className="flex items-center">
                <RadioGroupItem
                  value="yes"
                  id={`${question.id}-yes`}
                  className="sr-only"
                  type="button"
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
                  type="button"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
                    className="min-h-[300px]" // Add a minimum height to maintain consistent form size
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
                      className="bg-green-500 hover:bg-green-600"
                    >
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
              <h2 className="text-2xl font-bold text-gray-800">
                Classification Result
              </h2>
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
                <div>
                  <p className="text-lg font-semibold">Version Info:</p>
                  <p className="ml-4">
                    <strong>v1.0:</strong> {classificationResult.versionInfo.v1}
                  </p>
                  <p className="ml-4">
                    <strong>v2.0:</strong> {classificationResult.versionInfo.v2}
                  </p>
                </div>
                <p className="text-lg">
                  <strong>Next Step:</strong> {classificationResult.nextStep}
                </p>
              </div>
              <Button
                onClick={() => {
                  /* Handle next step navigation */
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Continue to {classificationResult.nextStep}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemographicForm;
