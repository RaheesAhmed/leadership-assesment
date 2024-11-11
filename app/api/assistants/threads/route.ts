import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "nodejs";

// Create a new thread
export async function POST() {
  const thread = await openai.beta.threads.create();
  console.log("Thread created:", thread.id);

  return Response.json({ threadId: thread.id });
}
