import OpenAI from "openai";
import { Request } from "openai/src/_shims/node-types.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Send a new message to a thread
export async function POST(
  request: Request,
  { params: { threadId } }: { params: { threadId: string } }
) {
  const { toolCallOutputs, runId } = await request.json();

  const stream = openai.beta.threads.runs.submitToolOutputsStream(
    threadId,
    runId,
    // { tool_outputs: [{ output: result, tool_call_id: toolCallId }] },
    { tool_outputs: toolCallOutputs }
  );

  return new Response(stream.toReadableStream());
}
