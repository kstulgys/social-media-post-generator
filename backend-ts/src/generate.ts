import { callOpenAI } from "./openai";
import { Product, SocialMediaPost, Tone, Platform, ALL_PLATFORMS, WebResearchResult } from "./types";
import { config } from "./config";
import { performWebResearch } from "./webResearch";

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
  // Perform web research if requested
  let researchResult: WebResearchResult | null = null;
  if (product.includeResearch) {
    researchResult = await performWebResearch(product);
  }

  const prompt = buildPrompt(product, researchResult);

  const posts = await callOpenAI(prompt);

  // Filter posts to only include selected platforms
  const selectedPlatforms = product.platforms || ALL_PLATFORMS;
  return posts.filter(post => selectedPlatforms.includes(post.platform));
}

function buildPlatformRequirements(selectedPlatforms: Platform[]): string {
  const { platforms } = config;
  const requirements: string[] = [];

  if (selectedPlatforms.includes('twitter')) {
    requirements.push(`### ${platforms.twitter.name}
- Maximum ${platforms.twitter.maxLength} characters (strict limit)
- Use up to ${platforms.twitter.hashtagLimit} relevant hashtags
- Punchy, attention-grabbing copy
- Include a clear call-to-action`);
  }

  if (selectedPlatforms.includes('instagram')) {
    requirements.push(`### ${platforms.instagram.name}
- Maximum ${platforms.instagram.maxLength} characters
- Use up to ${platforms.instagram.hashtagLimit} hashtags (place at end)
- Storytelling approach, lifestyle-focused
- Include emojis throughout
- Line breaks for readability`);
  }

  if (selectedPlatforms.includes('linkedin')) {
    requirements.push(`### ${platforms.linkedin.name}
- Maximum ${platforms.linkedin.maxLength} characters
- Use up to ${platforms.linkedin.hashtagLimit} professional hashtags
- Value-focused content
- Include industry insights or statistics when relevant
- End with engagement question`);
  }

  return requirements.join('\n\n');
}

function buildResearchSection(research: WebResearchResult): string {
  const sections: string[] = [];

  // Add seasonal context first (most important for timing)
  if (research.seasonalContext) {
    const { currentSeason, upcomingEvents, marketingAngles } = research.seasonalContext;
    let seasonSection = `### Seasonal & Holiday Context (IMPORTANT)
**Current Season/Period**: ${currentSeason}`;
    
    if (upcomingEvents && upcomingEvents.length > 0) {
      seasonSection += `\n**Upcoming Events/Holidays**:\n${upcomingEvents.map(e => `- ${e}`).join('\n')}`;
    }
    
    if (marketingAngles && marketingAngles.length > 0) {
      seasonSection += `\n**Recommended Marketing Angles**:\n${marketingAngles.map(a => `- ${a}`).join('\n')}`;
    }
    
    sections.push(seasonSection);
  }

  if (research.trendingHashtags.length > 0) {
    sections.push(`### Trending Hashtags (from web research)
Use these currently trending hashtags when relevant:
${research.trendingHashtags.join(', ')}`);
  }

  if (research.marketInsights.length > 0 && !research.marketInsights[0].includes('skipped')) {
    sections.push(`### Market Insights (from web research)
Consider these current market trends:
${research.marketInsights.map(insight => `- ${insight}`).join('\n')}`);
  }

  if (sections.length === 0) {
    return '';
  }

  return `## Web Research Results
${sections.join('\n\n')}

**Important**: Incorporate the seasonal context, trending hashtags, and market insights naturally into your posts. Tailor the messaging to current events, holidays, and seasonal themes to maximize engagement and relevance.

`;
}

function buildPrompt(product: Product, research: WebResearchResult | null): string {
  const { generation } = config;
  const tone = product.tone || 'professional';
  const toneGuidelines = TONE_GUIDELINES[tone];
  const selectedPlatforms = product.platforms || ALL_PLATFORMS;
  
  // Generate configured number of posts per platform
  const postsPerPlatform = generation.postsPerPlatform;
  const totalPosts = postsPerPlatform * selectedPlatforms.length;

  const researchSection = research ? buildResearchSection(research) : '';

  return `Generate exactly ${totalPosts} social media posts for this product.

## Product Information
- **Name**: ${product.name}
- **Description**: ${product.description}
- **Price**: $${product.price.toFixed(2)}
${product.category ? `- **Category**: ${product.category}` : ""}

## Tone & Style: ${tone.charAt(0).toUpperCase() + tone.slice(1)}
${toneGuidelines}

${researchSection}## Platform Requirements
Generate posts ONLY for these platforms: ${selectedPlatforms.join(', ')}

${buildPlatformRequirements(selectedPlatforms)}

## Output Format
Return a JSON object with a "posts" array. Each post must have:
- "platform": one of ${selectedPlatforms.map(p => `"${p}"`).join(', ')} (lowercase)
- "content": the post text

Generate ${postsPerPlatform} post(s) per platform. Make each post unique, tailored to its platform's audience, and consistent with the ${tone} tone.
`;
}
