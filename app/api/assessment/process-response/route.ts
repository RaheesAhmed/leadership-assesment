import { NextResponse } from "next/server";
import { processResponse } from "@/utils/start_assesment";

export async function POST(req: Request) {
  try {
    const { assessmentState, response } = await req.json();
    const result = await processResponse(assessmentState, response);

    return NextResponse.json({
      assessmentState: result.assessmentState,
      nextQuestion: result.nextQuestion,
    });
  } catch (error) {
    console.error("Error processing response:", error);
    return NextResponse.json(
      { error: "Failed to process response" },
      { status: 500 }
    );
  }
}
