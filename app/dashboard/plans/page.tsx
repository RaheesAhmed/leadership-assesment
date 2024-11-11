"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Target,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  Book,
  Lightbulb,
  Users,
  ArrowRight,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DetailedCapability {
  resources: string;
  strengths: string;
  importance: string;
  recommendations: string[];
  confidence_level: number;
  development_areas: string;
  focus_areas_analysis: {
    subcategories: string[];
    role_specific_importance: string;
    self_assessment_interpretation: string;
  };
  current_proficiency_level: number;
}

export default function DevelopmentPlansPage() {
  const { isAuthenticated } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/users/assessments");
        const data = await response.json();
        setPlans(data.developmentPlans || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setError("Failed to load development plans");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPlans();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>No development plans found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          Your Development Plans
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedPlan(plan)}
            >
              <CardHeader>
                <CardTitle>{plan.title || "Development Plan"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Created: {new Date(plan.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      plan.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {plan.status || "in_progress"}
                  </span>
                  <Progress value={plan.progress || 0} className="w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const plan = selectedPlan.plan?.development_plan;
  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => setSelectedPlan(null)}
          className="mb-4"
          variant="ghost"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Plans
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Invalid plan data structure</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderCapabilityDetails = (
    capability: DetailedCapability,
    title: string
  ) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium text-primary mb-2">Current Level</h4>
          <Progress
            value={(capability.current_proficiency_level / 5) * 100}
            className="h-2"
          />
          <span className="text-sm text-muted-foreground mt-1 inline-block">
            {capability.current_proficiency_level}/5
          </span>
        </div>

        <div>
          <h4 className="font-medium text-primary mb-2">Strengths</h4>
          <p className="text-muted-foreground">{capability.strengths}</p>
        </div>

        <div>
          <h4 className="font-medium text-primary mb-2">Development Areas</h4>
          <p className="text-muted-foreground">
            {capability.development_areas}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-primary mb-2">Recommendations</h4>
          <ul className="list-disc list-inside text-muted-foreground">
            {capability.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-primary mb-2">Resources</h4>
          <p className="text-muted-foreground">{capability.resources}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        onClick={() => setSelectedPlan(null)}
        className="mb-6"
        variant="ghost"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Plans
      </Button>

      {/* Cover Section */}
      <Card className="mb-8 bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground">
        <CardContent className="p-8">
          <h1 className="text-4xl font-bold mb-4">
            {plan.sections?.cover_page?.title || "Development Plan"}
          </h1>
          <p className="text-xl mb-2">
            {plan.sections?.cover_page?.participant_name}
          </p>
          <p className="text-sm opacity-80">
            Generated:{" "}
            {new Date(
              plan.sections?.cover_page?.assessment_date ||
                plan.metadata?.generated_date
            ).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="support" className="hidden lg:block">
            Support
          </TabsTrigger>
          <TabsTrigger value="conclusion" className="hidden lg:block">
            Conclusion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {plan.sections?.executive_summary?.overall_assessment}
              </p>
              <p className="text-primary font-medium">
                Focus Area:{" "}
                {plan.sections?.executive_summary?.high_level_development_focus}
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plan.sections?.executive_summary?.key_strengths.map(
                    (strength, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">
                            {strength.strength}
                          </span>
                          <span className="text-green-600">
                            {strength.score}/5
                          </span>
                        </div>
                        <Progress
                          value={(strength.score / 5) * 100}
                          className="h-2"
                        />
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Development Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 text-orange-500 mr-2" />
                  Development Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plan.sections?.executive_summary?.development_areas.map(
                    (area, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{area.area}</span>
                          <span className="text-orange-600">
                            {area.score}/5
                          </span>
                        </div>
                        <Progress
                          value={(area.score / 5) * 100}
                          className="h-2"
                        />
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-primary mb-2">
                    Career Context
                  </h3>
                  <p className="text-muted-foreground">
                    {
                      plan.sections?.personal_profile
                        ?.context_within_career_stage
                    }
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-primary mb-2">Industry</h3>
                    <p className="text-muted-foreground">
                      {
                        plan.sections?.personal_profile
                          ?.demographic_information_analysis?.industry
                      }
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-2">Role</h3>
                    <p className="text-muted-foreground">
                      {
                        plan.sections?.personal_profile
                          ?.demographic_information_analysis?.["role/title"]
                      }
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-2">
                      Company Size
                    </h3>
                    <p className="text-muted-foreground">
                      {
                        plan.sections?.personal_profile
                          ?.demographic_information_analysis?.company_size
                      }
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-2">
                      Experience
                    </h3>
                    <p className="text-muted-foreground">
                      {
                        plan.sections?.personal_profile
                          ?.demographic_information_analysis
                          ?.years_of_experience
                      }{" "}
                      years
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capabilities">
          <Card>
            <CardHeader>
              <CardTitle>Capability Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(
                  plan.sections?.assessment_overview?.capability_scores
                ).map(([capability, score], index) => (
                  <div key={index} className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{capability}</span>
                      <span className="text-primary">{score}/5</span>
                    </div>
                    <Progress value={(score / 5) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Detailed Capability Analysis
            </h2>
            {Object.entries(plan.sections?.detailed_capability_analysis).map(
              ([key, capability]) => renderCapabilityDetails(capability, key)
            )}
          </div>
        </TabsContent>

        <TabsContent value="development">
          <Card>
            <CardHeader>
              <CardTitle>Development Planning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-primary mb-2">
                  Short-term Actions
                </h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {plan.sections?.personal_development_planning?.action_planning_guidance?.short_term_actions.map(
                    (action, idx) => (
                      <li key={idx}>{action}</li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-primary mb-2">
                  Long-term Actions
                </h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {plan.sections?.personal_development_planning?.action_planning_guidance?.long_term_actions.map(
                    (action, idx) => (
                      <li key={idx}>{action}</li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-primary mb-2">
                  Success Metrics
                </h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {plan.sections?.personal_development_planning?.success_metrics.map(
                    (metric, idx) => (
                      <li key={idx}>{metric}</li>
                    )
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>Additional Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-primary mb-2 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Tips for Success
                </h3>
                <p className="text-muted-foreground">
                  {
                    plan.sections?.additional_support
                      ?.tips_for_development_success
                  }
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-primary mb-2 flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  Learning Resources
                </h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {plan.sections?.additional_support?.additional_learning_resources.map(
                    (resource, idx) => (
                      <li key={idx}>{resource}</li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-primary mb-2 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Common Challenges
                </h3>
                <p className="text-muted-foreground">
                  {
                    plan.sections?.additional_support
                      ?.common_challenges_and_solutions
                  }
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-primary mb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Support Networks
                </h3>
                <p className="text-muted-foreground">
                  {
                    plan.sections?.additional_support
                      ?.support_networks_and_communities
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conclusion">
          <Card>
            <CardHeader>
              <CardTitle>Next Steps & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-primary mb-2 flex items-center">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Next Steps
                </h3>
                <p className="text-muted-foreground">
                  {plan.sections?.conclusion?.next_steps_outline}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-primary mb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Support Contact
                </h3>
                <p className="text-muted-foreground">
                  {plan.sections?.conclusion?.support_contact_information}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-primary mb-2 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Progress Tracking
                </h3>
                <p className="text-muted-foreground">
                  {plan.sections?.conclusion?.progress_tracking_suggestions}
                </p>
              </div>

              <div>
                <p className="text-lg font-medium text-primary mt-6 italic">
                  {plan.sections?.conclusion?.motivational_closing_message}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Metadata */}
      <Card className="mt-8 bg-muted">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            <span className="mr-4">Version: {plan.metadata?.version}</span>
            <span className="mr-4">
              Participant ID: {plan.metadata?.participant_id}
            </span>
            <span>
              Generated:{" "}
              {new Date(plan.metadata?.generated_date).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
