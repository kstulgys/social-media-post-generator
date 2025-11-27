import { Tone, Platform } from "@/types";

export const TONE_OPTIONS: { value: Tone; label: string; emoji: string }[] = [
  { value: "professional", label: "Professional", emoji: "💼" },
  { value: "casual", label: "Casual", emoji: "😊" },
  { value: "humorous", label: "Humorous", emoji: "😄" },
  { value: "urgent", label: "Urgent", emoji: "⚡" },
  { value: "inspirational", label: "Inspirational", emoji: "✨" },
];

export const CATEGORY_OPTIONS = [
  { value: "", label: "Select a category" },
  { value: "Health & Wellness", label: "Health & Wellness" },
  { value: "Technology", label: "Technology" },
  { value: "Fashion & Apparel", label: "Fashion & Apparel" },
  { value: "Beauty & Skincare", label: "Beauty & Skincare" },
  { value: "Food & Beverage", label: "Food & Beverage" },
  { value: "Home & Living", label: "Home & Living" },
  { value: "Sports & Fitness", label: "Sports & Fitness" },
  { value: "Electronics", label: "Electronics" },
  { value: "Travel & Leisure", label: "Travel & Leisure" },
  { value: "Education", label: "Education" },
  { value: "Finance & Business", label: "Finance & Business" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Pets & Animals", label: "Pets & Animals" },
  { value: "Automotive", label: "Automotive" },
  { value: "Other", label: "Other" },
] as const;

export const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: "twitter", label: "Twitter/X" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
];

export const DEFAULT_PLATFORMS: Platform[] = ["twitter", "instagram", "linkedin"];

export const ERROR_MESSAGES: Record<string, string> = {
  OPENAI_RATE_LIMIT: "We're experiencing high demand. Please try again in a moment.",
  OPENAI_INVALID_KEY: "Service configuration error. Please contact support.",
  OPENAI_TIMEOUT: "The request took too long. Please try again.",
  OPENAI_ERROR: "Failed to generate posts. Please try again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  PARSE_ERROR: "Failed to process the response. Please try again.",
  INTERNAL_ERROR: "Something went wrong. Please try again later.",
};

export const VALIDATION = {
  NAME_MAX_LENGTH: 200,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 2000,
  PRICE_MAX: 1000000,
} as const;
