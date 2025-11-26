import OpenAI from "openai";
import { SocialMediaPost, AppError } from "./types";
import { config } from "./config";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new AppError(
        "OpenAI API key is not configured",
        "OPENAI_INVALID_KEY",
        500
      );
    }

    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: config.api.timeout,
      maxRetries: config.api.retries,
    });
  }

  return client;
}

export async function callOpenAI(prompt: string): Promise<SocialMediaPost[]> {
  const openaiClient = getClient();

  try {
    const response = await openaiClient.chat.completions.create({
      model: config.generation.model,
      messages: [
        {
          role: "system",
          content:
            "You are a social media marketing expert. Generate engaging, platform-appropriate posts. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: config.generation.temperature,
      max_tokens: config.generation.maxTokens,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new AppError(
        "OpenAI returned an empty response",
        "OPENAI_ERROR",
        502
      );
    }

    try {
      const parsed = JSON.parse(content);

      if (!parsed.posts || !Array.isArray(parsed.posts)) {
        throw new AppError(
          "OpenAI response missing posts array",
          "PARSE_ERROR",
          502
        );
      }

      return parsed.posts;
    } catch (parseError) {
      if (parseError instanceof AppError) {
        throw parseError;
      }
      throw new AppError(
        "Failed to parse OpenAI response as JSON",
        "PARSE_ERROR",
        502,
        { rawContent: content }
      );
    }
  } catch (error) {
    // Re-throw AppErrors as-is
    if (error instanceof AppError) {
      throw error;
    }

    // Handle OpenAI-specific errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        throw new AppError(
          "Invalid OpenAI API key",
          "OPENAI_INVALID_KEY",
          401
        );
      }

      if (error.status === 429) {
        throw new AppError(
          "OpenAI rate limit exceeded. Please try again later.",
          "OPENAI_RATE_LIMIT",
          429
        );
      }

      if (error.status === 408 || error.code === "ETIMEDOUT") {
        throw new AppError(
          "OpenAI request timed out. Please try again.",
          "OPENAI_TIMEOUT",
          408
        );
      }

      throw new AppError(
        error.message || "OpenAI API error",
        "OPENAI_ERROR",
        error.status || 502
      );
    }

    // Handle timeout errors
    if (error instanceof Error && error.message.includes("timeout")) {
      throw new AppError(
        "Request to OpenAI timed out. Please try again.",
        "OPENAI_TIMEOUT",
        408
      );
    }

    // Unknown errors
    throw new AppError(
      "An unexpected error occurred while generating posts",
      "INTERNAL_ERROR",
      500,
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
}
