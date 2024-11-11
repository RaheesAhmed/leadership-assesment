import { NextResponse } from "next/server";
import { getLevelOneQuestions } from "@/lib/get_all_questions";
import { classifierService } from "@/lib/services/classifier-service";

export async function GET(request: Request) {
  await classifierService.initialize();
  const levelOneQuestions = await getLevelOneQuestions();
  return NextResponse.json({
    assessmentQuestions: levelOneQuestions,
  });
}
