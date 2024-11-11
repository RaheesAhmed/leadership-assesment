"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";

interface Rating {
  capability: string;
  rating: number;
  confidence: number;
  explanation?: string;
}

interface ResponsibilityLevel {
  level: number;
  role: string;
  description: string;
}

interface Assessment {
  id: string;
  responsibilityLevel: ResponsibilityLevel;
  ratings: Rating[];
  createdAt: string;
}

interface ApiResponse {
  assessments: Assessment[];
  demographic: any;
  developmentPlans: any[];
}

export default function AssessmentsPage() {
  const { isAuthenticated } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch("/api/users/assessments");
        if (!response.ok) {
          throw new Error("Failed to fetch assessments");
        }
        const data: ApiResponse = await response.json();
        setAssessments(data.assessments || []);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        setError("Failed to load assessments");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAssessments();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Assessments</h1>
      <div className="grid gap-6">
        {assessments.length > 0 ? (
          assessments.map((assessment) => (
            <Card key={assessment.id} className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Assessment from{" "}
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </h2>
                </div>
                {assessment.responsibilityLevel && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-lg mb-2">
                      Responsibility Level:{" "}
                      {assessment.responsibilityLevel.role}
                    </h3>
                    <p className="text-gray-600">
                      {assessment.responsibilityLevel.description}
                    </p>
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Level</span>
                        <span className="text-sm font-medium">
                          {assessment.responsibilityLevel.level}/10
                        </span>
                      </div>
                      <Progress
                        value={
                          (assessment.responsibilityLevel.level / 10) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {assessment.ratings.map((rating, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-lg">
                        {rating.capability}
                      </span>
                      <div className="space-x-4">
                        <span className="px-3 py-1 bg-blue-100 rounded-full">
                          Rating: {rating.rating}/5
                        </span>
                        <span className="px-3 py-1 bg-green-100 rounded-full">
                          Confidence: {rating.confidence}/5
                        </span>
                      </div>
                    </div>
                    {rating.explanation && (
                      <p className="text-gray-600 mt-2">{rating.explanation}</p>
                    )}
                    <div className="mt-2">
                      <Progress
                        value={(rating.rating / 5) * 100}
                        className="h-2 mb-1"
                      />
                      <div className="text-xs text-gray-500 text-right">
                        Proficiency Level
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6">
            <p className="text-center text-gray-600">
              No assessments completed yet
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
