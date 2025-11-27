type Tone = 'professional' | 'casual' | 'humorous' | 'urgent' | 'inspirational';
type Platform = 'twitter' | 'instagram' | 'linkedin';

interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
  tone?: Tone;
  platforms?: Platform[];
  includeResearch?: boolean;
}

interface GeneratePostsResponse {
  posts: Array<{
    platform: "twitter" | "instagram" | "linkedin";
    content: string;
  }>;
  generated_at: string;
  count: number;
}

interface ValidationError {
  field: string;
  message: string;
}

interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: ValidationError[];
}

export interface ApiErrorDetails {
  code?: string;
  validationErrors?: ValidationError[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: ApiErrorDetails
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function generatePosts(
  product: Product
): Promise<GeneratePostsResponse> {
  let response: Response;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      }
    );
  } catch (networkError) {
    throw new ApiError(
      "Unable to connect to the server. Please check your connection.",
      0,
      { code: "NETWORK_ERROR" }
    );
  }

  if (!response.ok) {
    let errorData: ApiErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      throw new ApiError(
        "Server returned an invalid response",
        response.status,
        { code: "INTERNAL_ERROR" }
      );
    }

    throw new ApiError(
      errorData.error || "Request failed",
      response.status,
      {
        code: errorData.code,
        validationErrors: errorData.details,
      }
    );
  }

  return response.json();
}
