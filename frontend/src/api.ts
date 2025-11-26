interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
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
  details?: ValidationError[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: ValidationError[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function generatePosts(
  product: Product
): Promise<GeneratePostsResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    }
  );

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json();
    throw new ApiError(
      errorData.error || "Request failed",
      response.status,
      errorData.details
    );
  }

  return response.json();
}
