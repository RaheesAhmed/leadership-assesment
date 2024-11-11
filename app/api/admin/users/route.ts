import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
          },
        },
        assessments: {
          select: {
            id: true,
            responsibilityLevel: true,
            createdAt: true,
          },
        },
        developmentPlans: {
          select: {
            id: true,
          },
        },
        subscription: {
          select: {
            planType: true,
            status: true,
          },
        },
        consultantProfile: {
          select: {
            companyName: true,
            website: true,
          },
        },
      },
    });

    console.log("Found users:", users); // Add this for debugging

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error); // Add this for debugging
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
