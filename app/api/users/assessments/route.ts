import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - No user email" },
        { status: 401 }
      );
    }

    // Use a transaction to ensure data consistency
    const userData = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
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

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    });

    return NextResponse.json({
      assessments: userData.assessments,
      demographic: userData.demographic,
      developmentPlans: userData.developmentPlans,
    });
  } catch (error) {
    console.error("[ASSESSMENTS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    // Explicitly disconnect in development
    if (process.env.NODE_ENV === "development") {
      await prisma.$disconnect();
    }
  }
}
