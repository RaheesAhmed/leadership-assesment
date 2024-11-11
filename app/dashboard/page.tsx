"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Loader2, Users, ClipboardList, LineChart, Brain } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface DashboardData {
  assessments: Array<{
    id: string;
    responsibilityLevel: {
      level: number;
      role: string;
    };
    createdAt: string;
  }>;
  demographic: any;
  developmentPlans: Array<{
    id: string;
    title: string;
    status: string;
    progress: number;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/users/assessments");
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
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
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Welcome Back! </h2>
          <p className="text-muted-foreground">Here's your progress overview</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-sm font-medium">
              Assessments Completed
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-white opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data?.assessments?.length || 0}
            </div>
            <p className="text-violet-100 text-sm mt-1">
              Latest:{" "}
              {data?.assessments?.[0]?.responsibilityLevel?.role || "None"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-sm font-medium">
              Profile Status
            </CardTitle>
            <Users className="h-4 w-4 text-white opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data?.demographic ? "Complete" : "Incomplete"}
            </div>
            <p className="text-pink-100 text-sm mt-1">
              {data?.demographic ? "Demographics updated" : "Update needed"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-sm font-medium">
              Development Plans
            </CardTitle>
            <LineChart className="h-4 w-4 text-white opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data?.developmentPlans?.length || 0}
            </div>
            <p className="text-orange-100 text-sm mt-1">
              Active plans:{" "}
              {data?.developmentPlans?.filter((p) => p.status === "active")
                .length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Recent Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.assessments?.slice(0, 3).map((assessment, index) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between py-4 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">
                    {assessment.responsibilityLevel?.role || "Assessment"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
                    Level {assessment.responsibilityLevel?.level || "N/A"}
                  </div>
                </div>
              </div>
            ))}
            {!data?.assessments?.length && (
              <p className="text-muted-foreground text-center py-4">
                No assessments completed yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Development Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.developmentPlans?.slice(0, 3).map((plan, index) => (
              <div
                key={plan.id}
                className="flex items-center justify-between py-4 border-b last:border-0"
              >
                <div className="flex-1 pr-4">
                  <div className="flex justify-between mb-1">
                    <p className="font-medium">
                      {plan.title || "Development Plan"}
                    </p>
                    <span className="text-sm text-muted-foreground">
                      {plan.progress}%
                    </span>
                  </div>
                  <Progress value={plan.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Started {new Date(plan.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {!data?.developmentPlans?.length && (
              <p className="text-muted-foreground text-center py-4">
                No development plans created yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
