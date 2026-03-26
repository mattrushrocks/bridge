import { buildCompanionKnowledgeBase } from "@/lib/personaCompanionContent";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Missing OPENAI_API_KEY. Add it to your environment before using the persona companion chat.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { messages?: ChatMessage[] };
  const messages = (body.messages ?? []).filter(
    (message) =>
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim().length > 0,
  );

  const knowledgeBase = buildCompanionKnowledgeBase();
  const instructions = [
    "You are a research companion for a student project comparing Apple Music and Spotify personas.",
    "Answer using only the knowledge base you were given in this request.",
    "If the user asks for information that is not present, say that the project materials provided to you do not include it.",
    "Do not invent research findings, participant demographics, or assignment details.",
    "Be concise, clear, and useful for someone reading a printed poster or journey map.",
    "When useful, cite which persona or project section your answer comes from.",
    "Knowledge base:",
    knowledgeBase,
  ].join("\n\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5.2",
      instructions,
      input: messages.map((message) => ({
        role: message.role,
        content: [{ type: "input_text", text: message.content }],
      })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    return Response.json(
      {
        error: "OpenAI request failed.",
        details: errorText,
      },
      { status: response.status },
    );
  }

  const payload = (await response.json()) as {
    output_text?: string;
  };

  return Response.json({
    reply: payload.output_text ?? "I could not generate a response.",
  });
}
