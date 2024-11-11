import { NextResponse } from "next/server";
import { getLevelOneQuestions } from "@/utils/get_all_questions";

export async function GET(request: Request) {
  const levelOneQuestions = await getLevelOneQuestions();
  return NextResponse.json({
    assessmentQuestions: levelOneQuestions,
  });
}
