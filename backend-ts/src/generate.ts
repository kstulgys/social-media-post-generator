import { callOpenAI } from "./openai";
import { Product, SocialMediaPost, Tone } from "./types";
import { config } from "./config";

const TONE_GUIDELINES: Record<Tone, string> = {
  professional: `
- Use formal, polished language
- Focus on value propositions and benefits
- Include relevant industry terminology
- Maintain credibility and authority
- Avoid slang or overly casual expressions`,
  casual: `
- Use friendly, conversational language
- Write as if talking to a friend
- Include relatable expressions
- Keep it light and approachable
- Use contractions naturally`,
  humorous: `
- Include wit, puns, or playful language
- Use unexpected twists or wordplay
- Keep it fun but still on-brand
- Don't force jokes - let humor flow naturally
- Balance humor with product value`,
  urgent: `
- Create a sense of time-sensitivity
- Use action words: "Now", "Today", "Limited", "Don't miss"
- Highlight scarcity or exclusivity
- Include strong calls-to-action
- Emphasize immediate benefits`,
  inspirational: `
- Use uplifting, motivational language
- Connect product to aspirations and goals
- Include empowering messages
- Focus on transformation and possibilities
- Use vivid, emotional imagery`,
};

export async function generateSocialMediaPosts(
  product: Product
): Promise<SocialMediaPost[]> {
  const prompt = buildPrompt(product);

  const posts = await callOpenAI(prompt);

  return posts;
}

function buildPrompt(product: Product): string {
  const { platforms, generation } = config;
  const tone = product.tone || 'professional';
  const toneGuidelines = TONE_GUIDELINES[tone];

  return `Generate exactly ${generation.defaultPostCount} social media posts for this product.

## Product Information
- **Name**: ${product.name}
- **Description**: ${product.description}
- **Price**: $${product.price.toFixed(2)}
${product.category ? `- **Category**: ${product.category}` : ""}

## Tone & Style: ${tone.charAt(0).toUpperCase() + tone.slice(1)}
${toneGuidelines}

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
- Value-focused content
- Include industry insights or statistics when relevant
- End with engagement question

## Output Format
Return a JSON object with a "posts" array. Each post must have:
- "platform": one of "twitter", "instagram", or "linkedin" (lowercase)
- "content": the post text

Generate at least one post per platform. Make each post unique, tailored to its platform's audience, and consistent with the ${tone} tone.
`;
}
