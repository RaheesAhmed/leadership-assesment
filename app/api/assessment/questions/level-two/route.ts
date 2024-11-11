import { getLevelTwoQuestions } from "@/utils/data_loader";
import { NextResponse } from "next/server";
import { classifierService } from "@/lib/services/classifier-service";
export async function POST(request: Request) {
  await classifierService.initialize();
  const { capability, level } = (await request.json()) as {
    capability: string;
    level: number;
  };
  const levelTwoQuestions = await getLevelTwoQuestions(capability, level);
  console.log("Level Two Questions:", levelTwoQuestions);
  return NextResponse.json({
    levelTwoQuestions: levelTwoQuestions,
  });
}
