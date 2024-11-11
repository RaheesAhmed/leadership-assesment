import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export const runtime = "edge";
export const maxDuration = 30;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistant_id = process.env.OPENAI_ASSISTANT_ID;

export async function GET(request: NextRequest) {
  try {
    if (!assistant_id) {
      return NextResponse.json(
        { error: "Assistant ID is not configured" },
        { status: 500 }
      );
    }

    const assistants = await openai.beta.assistants.retrieve(assistant_id);

    return NextResponse.json({ assistants });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
