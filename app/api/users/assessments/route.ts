import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";

// Define types based on your actual data structure
interface ResponsibilityLevel {
  level: number;
  role: string;
  description: string;
}

interface DevelopmentPlanData {
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
    };
    // Add other sections as needed
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        assessments: {
          include: {
            ratings: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        demographic: true,
        developmentPlans: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!userData) {
      return new NextResponse("User not found", { status: 404 });
    }

    const response = {
      assessments: userData.assessments.map((assessment) => ({
        id: assessment.id,
        responsibilityLevel:
          (assessment.responsibilityLevel as ResponsibilityLevel) || {
            level: 0,
            role: "",
            description: "",
          },
        ratings: assessment.ratings.map((rating) => ({
          capability: rating.capability,
          rating: rating.rating,
          confidence: rating.confidence,
          explanation: rating.explanation || "",
        })),
        createdAt: assessment.createdAt.toISOString(),
      })),
      demographic: userData.demographic,
      developmentPlans: userData.developmentPlans.map((plan) => {
        let parsedPlan: DevelopmentPlanData;
        try {
          parsedPlan =
            typeof plan.plan === "string"
              ? JSON.parse(plan.plan)
              : (plan.plan as DevelopmentPlanData);
        } catch (e) {
          console.error("Error parsing plan:", e);
          parsedPlan = {
            metadata: {
              version: "",
              generated_date: "",
              participant_id: "",
            },
            sections: {
              cover_page: {
                title: "",
                participant_name: "",
                assessment_date: "",
              },
              executive_summary: {
                overall_assessment: "",
                key_strengths: [],
                development_areas: [],
              },
            },
          };
        }

        return {
          id: plan.id,
          title: plan.title || "Development Plan",
          description: plan.description || "",
          plan: parsedPlan,
          status: plan.status,
          startDate: plan.startDate?.toISOString() || null,
          endDate: plan.endDate?.toISOString() || null,
          progress: plan.progress,
          priority: plan.priority,
          createdAt: plan.createdAt.toISOString(),
          updatedAt: plan.updatedAt.toISOString(),
        };
      }),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[ASSESSMENTS_GET]", error);
    return new NextResponse(error.message || "Internal error", { status: 500 });
  }
}
