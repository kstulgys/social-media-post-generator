import OpenAI from "openai";
import { Product, WebResearchResult, AppError } from "./types";

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
      timeout: 60000, // Longer timeout for web search
      maxRetries: 2,
    });
  }

  return client;
}

export async function performWebResearch(
  product: Product
): Promise<WebResearchResult> {
  const openaiClient = getClient();

  const searchQuery = buildSearchQuery(product);

  try {
    // Use the Responses API with web_search tool
    const response = await openaiClient.responses.create({
      model: "gpt-4o",
      input: `Research trending hashtags and market insights for a product in the social media marketing context.

Product: ${product.name}
Description: ${product.description}
Category: ${product.category || "General"}

Please search for:
1. Currently trending hashtags related to this product category
2. Recent market trends or news that could make social media posts more relevant
3. Popular marketing angles being used for similar products

Return your findings as a JSON object with this structure:
{
  "trendingHashtags": ["#hashtag1", "#hashtag2", ...],
  "marketInsights": ["insight 1", "insight 2", ...]
}

Focus on hashtags that are currently popular and insights that could make posts more timely and engaging.`,
      tools: [
        {
          type: "web_search",
        },
      ],
    });

    // Extract the text content from the response
    const output = response.output;
    let textContent = "";

    for (const item of output) {
      if (item.type === "message" && item.content) {
        for (const content of item.content) {
          if (content.type === "output_text") {
            textContent = content.text;
          }
        }
      }
    }

    if (!textContent) {
      console.warn("Web research returned no text content, using defaults");
      return getDefaultResearchResult(searchQuery);
    }

    // Try to parse JSON from the response
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          trendingHashtags: parsed.trendingHashtags || [],
          marketInsights: parsed.marketInsights || [],
          searchQuery,
        };
      }
    } catch {
      // If JSON parsing fails, extract hashtags and insights manually
      const hashtags = textContent.match(/#\w+/g) || [];
      return {
        trendingHashtags: [...new Set(hashtags)].slice(0, 10),
        marketInsights: [
          "Research completed but structured data extraction failed",
        ],
        searchQuery,
      };
    }

    return getDefaultResearchResult(searchQuery);
  } catch (error) {
    console.error("Web research failed:", error);

    // Return default results instead of failing the entire request
    return getDefaultResearchResult(searchQuery);
  }
}

function buildSearchQuery(product: Product): string {
  const category = product.category || "products";
  return `trending hashtags ${category} ${product.name} social media marketing 2024`;
}

function getDefaultResearchResult(searchQuery: string): WebResearchResult {
  return {
    trendingHashtags: [],
    marketInsights: [
      "Web research was skipped or unavailable - using standard generation",
    ],
    searchQuery,
  };
}
