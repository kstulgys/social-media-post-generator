export type Tone = "professional" | "casual" | "humorous" | "urgent" | "inspirational";

export type Platform = "twitter" | "instagram" | "linkedin";

export interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
  tone?: Tone;
  platforms?: Platform[];
  includeResearch?: boolean;
}

export interface SocialMediaPost {
  platform: Platform;
  content: string;
}

export interface FieldErrors {
  name?: string;
  description?: string;
  price?: string;
  platforms?: string;
}
