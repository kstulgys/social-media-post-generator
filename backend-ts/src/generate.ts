import { callOpenAI } from "./openai";
import { Product, SocialMediaPost } from "./types";

const POST_COUNT = 5;

export async function generateSocialMediaPosts(
  product: Product
): Promise<SocialMediaPost[]> {
  const prompt = buildPrompt(product);

  const posts = await callOpenAI(prompt);

  return posts;
}

function buildPrompt(product: Product): string {
  return `Generate ${POST_COUNT} social media posts for this product:

Product: ${product.name}
Description: ${product.description}
Price: $${product.price}
${product.category ? `Category: ${product.category}` : ""}

Format each post as:
Platform: Content

Include posts for Twitter, Instagram, and LinkedIn. Use emojis and make them engaging.

Return response as JSON object, where the key is "posts" and the value is an array of objects.
Each object should have "platform" and "content" properties.
`;
}
