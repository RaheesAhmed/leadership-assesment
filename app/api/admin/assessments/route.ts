import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const assessments = await prisma.assessment.findMany({
      include: {
        user: true,
        ratings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
