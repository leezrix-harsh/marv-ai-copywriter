import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { createOllama } from "ollama-ai-provider-v2";

// Create Ollama provider - connects to local Ollama instance
const ollama = createOllama({
  baseURL: "http://localhost:11434/api",
});

// System prompt for copywriting - focused on AI Copywriting Generator
const SYSTEM_PROMPT = `You are Marv, an expert AI copywriter with years of experience in marketing, advertising, and content creation. Your specialty is creating compelling, persuasive, and engaging copy that converts readers into customers.

Guidelines:
1. Write clear, concise, and impactful copy
2. Use power words and emotional triggers appropriately
3. Focus on benefits over features
4. Create a sense of urgency when appropriate
5. Maintain brand voice consistency
6. Use active voice and strong verbs
7. Keep sentences and paragraphs short for readability
8. Include calls-to-action when relevant

Always provide ready-to-use copy that the user can immediately implement. Format your response cleanly without excessive explanations unless asked.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid prompt" },
        { status: 400 }
      );
    }

    // Use AI SDK's streamText for generating copywriting content
    const result = streamText({
      model: ollama("gpt-oss:120b-cloud"),
      system: SYSTEM_PROMPT,
      prompt: prompt,
    });

    // Return streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("API Error:", error);

    // Check if it's a connection error (Ollama not running)
    const errorMessage =
      error instanceof Error && error.message.includes("ECONNREFUSED")
        ? "Cannot connect to Ollama. Make sure Ollama is running (ollama serve)"
        : error instanceof Error
        ? error.message
        : "An unexpected error occurred";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
