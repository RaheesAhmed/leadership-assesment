import { NextResponse } from "next/server";
import { getLevelOneQuestionsByLevel } from "@/lib/get_all_questions";
import { classifierService } from "@/lib/services/classifier-service";

interface Params {
  level: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const level = await params.level;
    if (!level) {
      return NextResponse.json(
        { error: "Level parameter is required" },
        { status: 400 }
      );
    }

    await classifierService.initialize();
    const levelOneQuestions = await getLevelOneQuestionsByLevel({
      level: level,
    });

    if (!levelOneQuestions) {
      return NextResponse.json(
        { error: "No questions found for this level" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      assessmentQuestionsByLevel: levelOneQuestions,
    });
  } catch (error) {
    console.error("Error in GET questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
