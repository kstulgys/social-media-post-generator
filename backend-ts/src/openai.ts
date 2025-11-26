import OpenAI from "openai";
import { SocialMediaPost } from "./types";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000, // 30 second timeout
      maxRetries: 2,
    });
  }

  return client;
}

export async function callOpenAI(prompt: string): Promise<SocialMediaPost[]> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;

  if (content) {
    return JSON.parse(content).posts;
  }

  return [];
}
