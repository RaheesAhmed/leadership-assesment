import { NextResponse } from "next/server";
import { classifyResponsibilityLevel } from "@/lib/classifiers/responsibility-level";
import { demographicSchema } from "@/lib/validators/demographics";
import { classifierService } from "@/lib/services/classifier-service";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const maxDuration = 30;

export async function GET() {
  try {
    await classifierService.initialize();
    return Response.json({ response: "Server is Running..." });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to initialize classifier" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - No user ID" },
        { status: 401 }
      );
    }

    await classifierService.initialize();

    const demographic = await request.json();
    const { error, data } = demographicSchema.safeParse(demographic);

    if (error) {
      return NextResponse.json(
        { error: "Invalid demographics data", details: error },
        { status: 400 }
      );
    }

    const responsibilityLevel = await classifyResponsibilityLevel(data);

    // Create or update demographic and assessment in a transaction
    const [savedDemographic, assessment] = await prisma.$transaction([
      prisma.demographic.upsert({
        where: {
          userId: session.user.id,
        },
        update: {
          industry: data.industry,
          companySize: data.companySize.toString(),
          department: data.department,
          jobTitle: data.jobTitle,
          directReports: data.directReports.toString(),
          decisionLevel: data.decisionLevel,
          typicalProject: data.typicalProject,
          levelsToCEO: data.levelsToCEO.toString(),
          managesBudget: data.managesBudget.toString(),
        },
        create: {
          userId: session.user.id,
          industry: data.industry,
          companySize: data.companySize.toString(),
          department: data.department,
          jobTitle: data.jobTitle,
          directReports: data.directReports.toString(),
          decisionLevel: data.decisionLevel,
          typicalProject: data.typicalProject,
          levelsToCEO: data.levelsToCEO.toString(),
          managesBudget: data.managesBudget.toString(),
        },
      }),
      prisma.assessment.create({
        data: {
          userId: session.user.id,
          responsibilityLevel: {
            level: responsibilityLevel.level,
            role: responsibilityLevel.role,
            description: responsibilityLevel.description,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        responsibilityLevel: responsibilityLevel.level,
        role: responsibilityLevel.role,
        description: responsibilityLevel.description,
        versionInfo: responsibilityLevel.versionInfo,
        nextStep: "background",
        assessmentId: assessment.id,
      },
    });
  } catch (error) {
    console.error("Classification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to process assessment",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
