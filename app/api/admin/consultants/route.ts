import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const consultants = await prisma.consultantProfile.findMany({
      include: {
        user: true,
        apiUsage: true,
      },
    });

    return NextResponse.json(consultants);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
