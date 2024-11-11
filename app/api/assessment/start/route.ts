import { NextResponse } from "next/server";
import { startAssessment } from "@/lib/assessment";
import { classifierService } from "@/lib/services/classifier-service";

export async function POST(request: Request) {
  await classifierService.initialize();
  try {
    const demographicData = await request.json();

    const { assessmentState, nextQuestion } = await startAssessment(
      demographicData
    );
    return NextResponse.json({
      assessmentState,
      nextQuestion,
    });
  } catch (error) {
    console.error("Error starting assessment:", error);
    throw error;
  }
}
