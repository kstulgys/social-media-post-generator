"use client";

import { useState, useMemo } from "react";
import { generatePosts, ApiError } from "../api";

interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
}

interface SocialMediaPost {
  platform: "twitter" | "instagram" | "linkedin";
  content: string;
}

interface FieldErrors {
  name?: string;
  description?: string;
  price?: string;
}

const PLATFORM_ICONS = {
  twitter: "𝕏",
  instagram: "📷",
  linkedin: "💼",
};

const ERROR_MESSAGES: Record<string, string> = {
  OPENAI_RATE_LIMIT: "We're experiencing high demand. Please try again in a moment.",
  OPENAI_INVALID_KEY: "Service configuration error. Please contact support.",
  OPENAI_TIMEOUT: "The request took too long. Please try again.",
  OPENAI_ERROR: "Failed to generate posts. Please try again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  PARSE_ERROR: "Failed to process the response. Please try again.",
  INTERNAL_ERROR: "Something went wrong. Please try again later.",
};

function validateProduct(product: Product): FieldErrors {
  const errors: FieldErrors = {};

  if (!product.name.trim()) {
    errors.name = "Product name is required";
  } else if (product.name.length > 200) {
    errors.name = "Product name must be 200 characters or less";
  }

  if (!product.description.trim()) {
    errors.description = "Description is required";
  } else if (product.description.length < 10) {
    errors.description = "Description must be at least 10 characters";
  } else if (product.description.length > 2000) {
    errors.description = "Description must be 2000 characters or less";
  }

  if (product.price < 0) {
    errors.price = "Price must be a positive number";
  } else if (product.price > 1000000) {
    errors.price = "Price must be less than $1,000,000";
  }

  return errors;
}

export default function Home() {
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    category: "",
  });
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errors = useMemo(() => validateProduct(product), [product]);
  const isValid = Object.keys(errors).length === 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleGeneratePosts = async () => {
    // Mark all fields as touched to show any errors
    setTouched({ name: true, description: true, price: true });

    if (!isValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await generatePosts(product);
      setPosts(result.posts);
    } catch (err) {
      if (err instanceof ApiError) {
        const errorCode = err.details?.code || "INTERNAL_ERROR";
        setError(ERROR_MESSAGES[errorCode] || err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Social Media Post Generator</h1>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded-md ${
              touched.name && errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            onBlur={() => handleBlur("name")}
            placeholder="EcoBottle Pro"
            disabled={isLoading}
          />
          {touched.name && errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full px-3 py-2 border rounded-md ${
              touched.description && errors.description
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            rows={4}
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            onBlur={() => handleBlur("description")}
            placeholder="Revolutionary reusable water bottle with built-in UV purification..."
            disabled={isLoading}
          />
          {touched.description && errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            {product.description.length}/2000 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className={`w-full px-3 py-2 border rounded-md ${
              touched.price && errors.price
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: parseFloat(e.target.value) || 0 })
            }
            onBlur={() => handleBlur("price")}
            placeholder="49.99"
            min="0"
            step="0.01"
            disabled={isLoading}
          />
          {touched.price && errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Category (optional)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md border-gray-300"
            value={product.category || ""}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            placeholder="Health & Wellness"
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        onClick={handleGeneratePosts}
        disabled={!isValid || isLoading}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating...
          </>
        ) : (
          "Generate Posts"
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-red-500 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={handleGeneratePosts}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Generating Posts...</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 border rounded-lg animate-pulse"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && posts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Generated Posts</h2>
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {PLATFORM_ICONS[post.platform]}
                  </span>
                  <span className="font-medium text-sm text-gray-600 capitalize">
                    {post.platform}
                  </span>
                  <span className="text-xs text-gray-400">
                    {post.content.length} chars
                  </span>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
