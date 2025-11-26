import { callOpenAI } from "./openai";
import { Product, SocialMediaPost } from "./types";
import { config } from "./config";

export async function generateSocialMediaPosts(
  product: Product
): Promise<SocialMediaPost[]> {
  const prompt = buildPrompt(product);

  const posts = await callOpenAI(prompt);

  return posts;
}

function buildPrompt(product: Product): string {
  const { platforms, generation } = config;

  return `Generate exactly ${generation.defaultPostCount} social media posts for this product.

## Product Information
- **Name**: ${product.name}
- **Description**: ${product.description}
- **Price**: $${product.price.toFixed(2)}
${product.category ? `- **Category**: ${product.category}` : ""}

## Platform Requirements

### ${platforms.twitter.name}
- Maximum ${platforms.twitter.maxLength} characters (strict limit)
- Use up to ${platforms.twitter.hashtagLimit} relevant hashtags
- Punchy, attention-grabbing copy
- Include a clear call-to-action

### ${platforms.instagram.name}
- Maximum ${platforms.instagram.maxLength} characters
- Use up to ${platforms.instagram.hashtagLimit} hashtags (place at end)
- Storytelling approach, lifestyle-focused
- Include emojis throughout
- Line breaks for readability

### ${platforms.linkedin.name}
- Maximum ${platforms.linkedin.maxLength} characters
- Use up to ${platforms.linkedin.hashtagLimit} professional hashtags
- Professional tone, value-focused
- Include industry insights or statistics when relevant
- End with engagement question

## Output Format
Return a JSON object with a "posts" array. Each post must have:
- "platform": one of "twitter", "instagram", or "linkedin" (lowercase)
- "content": the post text

Generate at least one post per platform. Make each post unique and tailored to its platform's audience.
`;
}
