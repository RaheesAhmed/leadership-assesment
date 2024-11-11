import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: true,
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
