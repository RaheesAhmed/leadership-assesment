import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  BookOpen,
  Users,
  BarChart,
} from "lucide-react";

interface DevelopmentPlan {
  development_plan: {
    metadata: {
      version: string;
      generated_date: string;
      participant_id: string;
    };
    sections: {
      cover_page: {
        title: string;
        participant_name: string;
        assessment_date: string;
      };
      executive_summary: {
        overall_assessment: string;
        key_strengths: Array<{ strength: string; score: number }>;
        development_areas: Array<{ area: string; score: number }>;
        high_level_development_focus: string;
      };
      personal_profile: {
        demographic_information_analysis: {
          role: string;
          industry: string;
          years_of_experience: string;
          company_size: string;
        };
        assigned_responsibility_level: string;
        context_within_career_stage: string;
      };
      assessment_overview: {
        capability_scores: Record<string, number>;
        pattern_analysis: string;
        skill_vs_confidence_comparison: string;
        impact_analysis_for_target_role: string;
      };
      detailed_capability_analysis: Record<
        string,
        {
          importance: string;
          score_analysis: string;
          strengths: string;
          development_areas: string;
          recommendations: string[];
          resources: string;
        }
      >;
      personal_development_planning: {
        development_planning_template: {
          goals: string[];
          action_steps: string[];
        };
        goal_setting_framework: {
          examples: string[];
        };
        action_planning_guidance: {
          short_term_actions: string[];
          long_term_actions: string[];
        };
        progress_tracking_tools: string;
        success_metrics: string[];
      };
      additional_support: {
        tips_for_development_success: string;
        common_challenges_and_solutions: string;
        additional_learning_resources: string[];
        support_networks_and_communities: string;
      };
      conclusion: {
        motivational_closing_message: string;
        next_steps_outline: string;
        progress_tracking_suggestions: string;
        support_contact_information: string;
      };
    };
  };
}

export function PlanDisplay({ plan }: { plan: string }) {
  const cleanAndParsePlan = (planString: string) => {
    try {
      // Remove escaped characters and normalize the JSON string
      const cleanString = planString
        .replace(/\\n/g, "")
        .replace(/\\/g, "")
        .replace(/"\{/g, "{")
        .replace(/\}"/g, "}");

      return JSON.parse(cleanString);
    } catch (error) {
      console.error("Error parsing plan:", error);
      return null;
    }
  };

  const parsedPlan = cleanAndParsePlan(plan);

  if (!parsedPlan) {
    return (
      <div className="p-4 text-red-500">
        Error: Unable to parse development plan data
      </div>
    );
  }

  const { development_plan } = parsedPlan;

  const getScoreColor = (score: number) => {
    switch (score) {
      case 1:
        return "bg-red-100 text-red-800";
      case 2:
        return "bg-orange-100 text-orange-800";
      case 3:
        return "bg-blue-100 text-blue-800";
      case 4:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">
            {development_plan.sections.cover_page.title}
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {development_plan.sections.cover_page.participant_name}
            </Badge>
          </div>
          <p className="text-slate-500">
            Assessment Date:{" "}
            {development_plan.sections.cover_page.assessment_date}
          </p>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-slate-700">
              {development_plan.sections.executive_summary.overall_assessment}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Key Strengths */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Key Strengths
              </h3>
              {development_plan.sections.executive_summary.key_strengths.map(
                (strength, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                  >
                    <span className="text-slate-700">{strength.strength}</span>
                    <Badge className={getScoreColor(strength.score)}>
                      Score: {strength.score}
                    </Badge>
                  </div>
                )
              )}
            </div>

            {/* Development Areas */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-500" />
                Development Areas
              </h3>
              {development_plan.sections.executive_summary.development_areas.map(
                (area, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                  >
                    <span className="text-slate-700">{area.area}</span>
                    <Badge className={getScoreColor(area.score)}>
                      Score: {area.score}
                    </Badge>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capability Assessment */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-indigo-500" />
            Capability Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {Object.entries(
              development_plan.sections.assessment_overview.capability_scores
            ).map(([capability, score]) => (
              <div key={capability} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">
                    {capability}
                  </span>
                  <span className="text-sm text-slate-500">{score}/4</span>
                </div>
                <Progress value={(score / 4) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Planning */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            Development Planning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Goals */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Goals</h3>
            <div className="grid gap-3">
              {development_plan.sections.personal_development_planning.development_planning_template.goals.map(
                (goal, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-lg border border-slate-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-700">{goal}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Action Steps */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Action Steps</h3>
            <div className="grid gap-3">
              {development_plan.sections.personal_development_planning.action_planning_guidance.short_term_actions.map(
                (action, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                      <p className="text-slate-700">{action}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Support */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            Support & Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Tips for Success
              </h4>
              <p className="text-blue-800">
                {
                  development_plan.sections.additional_support
                    .tips_for_development_success
                }
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {development_plan.sections.additional_support.additional_learning_resources.map(
                (resource, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-indigo-500" />
                      <p className="text-slate-700">{resource}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conclusion */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-center text-indigo-900">
            Closing Thoughts
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg text-indigo-800">
            {development_plan.sections.conclusion.motivational_closing_message}
          </p>
          <p className="text-slate-600">
            {development_plan.sections.conclusion.next_steps_outline}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
