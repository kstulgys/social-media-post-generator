export interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
}

export type Platform = 'twitter' | 'instagram' | 'linkedin';

export interface SocialMediaPost {
  platform: Platform;
  content: string;
}

// Error types
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "OPENAI_ERROR"
  | "OPENAI_RATE_LIMIT"
  | "OPENAI_INVALID_KEY"
  | "OPENAI_TIMEOUT"
  | "PARSE_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export interface ApiErrorResponse {
  error: string;
  code: ErrorCode;
  details?: unknown;
}