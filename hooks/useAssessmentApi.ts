import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { AssessmentResponse } from "@/types/assessment";

export function useAssessmentApi() {
  const [isLoading, setIsLoading] = useState(false);

  async function submitDemographics(data: any) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/assessment/demographic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit demographics");

      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit demographic information",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function getAssessmentBackground() {
    try {
      const response = await fetch("/api/assessment/background");
      if (!response.ok) throw new Error("Failed to fetch background info");
      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assessment background",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function getAssessmentInstructions() {
    try {
      const response = await fetch("/api/assessment/instructions");
      if (!response.ok) throw new Error("Failed to fetch instructions");
      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assessment instructions",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function generateDevelopmentPlan(data: {
    userInfo: any;
    responsibilityLevel: any;
    assessmentAnswers: AssessmentResponse[];
  }) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/assessment/development-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to generate development plan");

      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate development plan",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProgress(data: {
    assessmentId: string;
    stage: string;
    completed: boolean;
  }) {
    try {
      const response = await fetch("/api/assessment/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update progress");

      return await response.json();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  }

  return {
    isLoading,
    submitDemographics,
    getAssessmentBackground,
    getAssessmentInstructions,
    generateDevelopmentPlan,
    updateProgress,
  };
}
