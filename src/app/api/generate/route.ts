import { NextRequest } from "next/server";
import { Ollama } from "ollama";

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

// Create Ollama client lazily to ensure env vars are loaded
function getOllamaClient() {
  const apiKey = process.env.OLLAMA_API_KEY;
  
  if (!apiKey) {
    throw new Error("OLLAMA_API_KEY is not configured");
  }
  
  return new Ollama({
    host: "https://ollama.com",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Please provide a valid prompt" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get Ollama client (ensures env vars are loaded)
    const ollama = getOllamaClient();

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await ollama.chat({
            model: "gpt-oss:120b",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: prompt },
            ],
            stream: true,
          });

          for await (const part of response) {
            controller.enqueue(encoder.encode(part.message.content));
          }

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          const errorMessage =
            error instanceof Error ? error.message : "An error occurred";
          controller.enqueue(encoder.encode(`Error: ${errorMessage}`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("API Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handle unsupported methods
export async function GET() {
  return new Response(
    JSON.stringify({ error: "Method not allowed. Use POST." }),
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
}
