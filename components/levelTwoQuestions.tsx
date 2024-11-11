"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AssessmentResponse } from "@/types/types";

interface LevelTwoQuestion {
  id: string;
  capability: string;
  level: number;
  question: string;
  theme: string;
  type: string;
  requiresReflection: boolean;
}

interface UserResponse {
  questionId: string;
  rating: number;
  answer: string;
}

interface LevelTwoQuestionsProps {
  level: number;
  capability: string;
  skill: number;
  confidence: number;
  onComplete: (responses: AssessmentResponse[]) => void;
}

export default function LevelTwoQuestions({
  level,
  capability,
  skill,
  confidence,
  onComplete,
}: LevelTwoQuestionsProps) {
  const [questions, setQuestions] = useState<LevelTwoQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const result = await fetchLevelTwoQuestions(
        level,
        capability,
        skill,
        confidence
      );
      if (result.length === 0) {
        // If no questions, notify parent to continue with previous state
        onComplete([]);
      }
    };
    fetchQuestions();
  }, [level, capability, skill, confidence]);

  const fetchLevelTwoQuestions = async (
    level: number,
    capability: string,
    skill: number,
    confidence: number
  ) => {
    try {
      const response = await fetch("/api/assessment/questions/level-two", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level,
          capability,
          answers: {
            skill,
            confidence,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch level two questions");
      }

      const data = await response.json();
      const questions = data.levelTwoQuestions;
      setQuestions(questions);
      setLoading(false);
      return questions;
    } catch (error) {
      console.error("Error fetching level two questions:", error);
      setError("Failed to load questions. Please try again.");
      setLoading(false);
      return [];
    }
  };

  const handleRatingChange = (rating: number) => {
    const updatedResponses = [...userResponses];
    const existingResponseIndex = updatedResponses.findIndex(
      (response) => response.questionId === questions[currentQuestionIndex].id
    );

    if (existingResponseIndex !== -1) {
      updatedResponses[existingResponseIndex].rating = rating;
    } else {
      updatedResponses.push({
        questionId: questions[currentQuestionIndex].id,
        rating: rating,
        answer: "",
      });
    }

    setUserResponses(updatedResponses);
  };

  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const updatedResponses = [...userResponses];
    const existingResponseIndex = updatedResponses.findIndex(
      (response) => response.questionId === questions[currentQuestionIndex].id
    );

    if (existingResponseIndex !== -1) {
      updatedResponses[existingResponseIndex].answer = event.target.value;
    } else {
      updatedResponses.push({
        questionId: questions[currentQuestionIndex].id,
        rating: 0,
        answer: event.target.value,
      });
    }

    setUserResponses(updatedResponses);
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsSubmitting(true);
      try {
        const formattedResponses: AssessmentResponse[] = userResponses.map(
          (response) => ({
            questionId: response.questionId,
            rating: response.rating,
            response: response.answer,
            question: {
              question:
                questions.find((q) => q.id === response.questionId)?.question ||
                "",
            },
            area: capability,
          })
        );

        await onComplete(formattedResponses);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-700">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-700">
              No Questions Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-700">
              There are no additional questions for this capability at the
              moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = userResponses.find(
    (response) => response.questionId === currentQuestion.id
  ) || {
    rating: 0,
    answer: "",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">
            Level {level} Deep Dive: {capability}
          </CardTitle>
          <CardDescription className="text-blue-100 text-lg">
            Let's explore this area in more detail to help you improve.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <Progress
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              className="h-2"
            />
            <p className="text-right text-sm text-gray-600 mt-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  {currentQuestion.theme}
                </h3>
                <p className="text-gray-700 text-lg mb-4">
                  {currentQuestion.question}
                </p>
                <div className="mb-6">
                  <p className="mb-2 font-medium text-gray-700">
                    Rate your experience:
                  </p>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                          star <= currentResponse.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 hover:text-yellow-200"
                        }`}
                        onClick={() => handleRatingChange(star)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="answer"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Answer:
                  </label>
                  <Textarea
                    id="answer"
                    value={currentResponse.answer}
                    onChange={handleAnswerChange}
                    placeholder="Type your answer here..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[150px]"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-gray-50 rounded-b-lg">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {currentQuestionIndex === questions.length - 1
              ? "Complete"
              : "Next"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
