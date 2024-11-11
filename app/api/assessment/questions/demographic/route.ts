import { NextResponse } from "next/server";
import { DemographicQuestions } from "@/utils/demographic_questions";

export async function GET() {
  try {
    const questions = await DemographicQuestions();
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching demographic questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch demographic questions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Store demographic data
    // TODO: Add database storage logic here

    return NextResponse.json({
      success: true,
      message: "Demographic information saved successfully",
      data,
    });
  } catch (error) {
    console.error("Error saving demographic data:", error);
    return NextResponse.json(
      { error: "Failed to save demographic information" },
      { status: 500 }
    );
  }
}
