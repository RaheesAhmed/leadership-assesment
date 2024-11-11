import OpenAI from "openai";
import { MessageContentText } from "openai/resources/beta/threads/messages/messages";

export const runtime = "edge";
export const maxDuration = 300;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistant_id = process.env.OPENAI_ASSISTANT_ID as string;

if (!assistant_id) {
  throw new Error("OPENAI_ASSISTANT_ID is not defined");
}

export async function POST(
  request: Request,
  { params }: { params: { threadid: string } }
) {
  try {
    const {
      userInfo,
      responsibilityLevel,
      assessmentAnswers,
      assessmentCompleted,
    } = await request.json();
    const threadId = (await openai.beta.threads.create()).id;

    if (
      !userInfo ||
      !responsibilityLevel ||
      !assessmentAnswers ||
      !assessmentCompleted
    ) {
      return new Response(
        JSON.stringify({ error: "Message content is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create message in the thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: `Generate the perolnized development plan for ${userInfo} here is the responsibility level: ${responsibilityLevel} and here are the answers to the assessment: ${assessmentAnswers} `,
    });

    // Create and wait for run
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistant_id,
      instructions: "Please provide a detailed and personalized response.",
    });

    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    while (
      (runStatus.status === "queued" || runStatus.status === "in_progress") &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      attempts++;
    }

    if (runStatus.status === "completed") {
      // Get the latest messages
      const messages = await openai.beta.threads.messages.list(threadId);
      const assistantMessage = messages.data[0];

      // Safely type check and extract the message content
      const messageContent = assistantMessage.content[0];
      let responseText = "";

      if (messageContent.type === "text") {
        responseText = (messageContent as MessageContentText).text.value;
      }

      return new Response(
        JSON.stringify({
          message: responseText,
          threadId: threadId,
          runId: run.id,
          status: runStatus.status,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      // Handle failed or timed out runs
      throw new Error(
        `Run failed or timed out. Status: ${runStatus.status}. Last error: ${
          runStatus.last_error?.message || "Unknown error"
        }`
      );
    }
  } catch (error: any) {
    console.error("Error in messages route:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.response?.data || error.stack,
      }),
      {
        status: error.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
