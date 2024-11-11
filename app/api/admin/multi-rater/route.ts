import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const assessments = await prisma.multiRaterAssessment.findMany({
      include: {
        user: true,
        ratings: true,
      },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
