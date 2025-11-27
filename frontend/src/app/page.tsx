"use client";

import { useState, useMemo } from "react";
import { generatePosts, ApiError } from "../api";
import PostCard from "../components/PostCard";

type Tone = "professional" | "casual" | "humorous" | "urgent" | "inspirational";
type Platform = "twitter" | "instagram" | "linkedin";

interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
  tone?: Tone;
  platforms?: Platform[];
  includeResearch?: boolean;
}

const TONE_OPTIONS: { value: Tone; label: string; emoji: string }[] = [
  { value: "professional", label: "Professional", emoji: "💼" },
  { value: "casual", label: "Casual", emoji: "😊" },
  { value: "humorous", label: "Humorous", emoji: "😄" },
  { value: "urgent", label: "Urgent", emoji: "⚡" },
  { value: "inspirational", label: "Inspirational", emoji: "✨" },
];

const CATEGORY_OPTIONS = [
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
];

const PLATFORM_OPTIONS: { value: Platform; label: string; icon: React.ReactNode }[] = [
  {
    value: "twitter",
    label: "Twitter/X",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

interface SocialMediaPost {
  platform: Platform;
  content: string;
}

interface FieldErrors {
  name?: string;
  description?: string;
  price?: string;
  platforms?: string;
}

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

  if (!product.price || product.price <= 0) {
    errors.price = "Price is required";
  } else if (product.price > 1000000) {
    errors.price = "Price must be less than $1,000,000";
  }

  if (!product.platforms || product.platforms.length === 0) {
    errors.platforms = "At least one platform must be selected";
  }

  return errors;
}

export default function Home() {
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    category: "",
    tone: "professional",
    platforms: ["twitter", "instagram", "linkedin"],
    includeResearch: false,
  });
  const [priceInput, setPriceInput] = useState("");
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
    setTouched({ name: true, description: true, price: true, platforms: true });

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
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Social Media</span>{" "}
            <span className="text-white">Post Generator</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Generate engaging, platform-optimized posts for your products with AI-powered insights.
          </p>
        </div>

        {/* Form Card */}
        <div className="card-dark p-6 sm:p-8 mb-8 glow">
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Product Name <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                className={`input-dark ${
                  touched.name && errors.name ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""
                }`}
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                onBlur={() => handleBlur("name")}
                placeholder="EcoBottle Pro"
                disabled={isLoading}
              />
              {touched.name && errors.name && (
                <p className="mt-2 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Description <span className="text-pink-500">*</span>
              </label>
              <textarea
                className={`input-dark min-h-[120px] resize-none ${
                  touched.description && errors.description
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                    : ""
                }`}
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                onBlur={() => handleBlur("description")}
                placeholder="Revolutionary reusable water bottle with built-in UV purification..."
                disabled={isLoading}
              />
              <div className="flex justify-between mt-2">
                {touched.description && errors.description ? (
                  <p className="text-sm text-red-400">{errors.description}</p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-zinc-500">{product.description.length}/2000</span>
              </div>
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Price <span className="text-pink-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    className={`input-dark pl-8 ${
                      touched.price && errors.price
                        ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                        : ""
                    }`}
                    value={priceInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty string, numbers, and max 2 decimal places
                      if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
                        setPriceInput(value);
                        setProduct({ ...product, price: value === "" ? 0 : parseFloat(value) || 0 });
                      }
                    }}
                    onBlur={() => handleBlur("price")}
                    placeholder="49.99"
                    disabled={isLoading}
                  />
                </div>
                {touched.price && errors.price && (
                  <p className="mt-2 text-sm text-red-400">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Category <span className="text-zinc-500">(optional)</span>
                </label>
                <div className="relative">
                  <select
                    className="input-dark appearance-none cursor-pointer pr-10"
                    value={product.category || ""}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    disabled={isLoading}
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-[#0f0f17]">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Tone & Style</label>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setProduct({ ...product, tone: option.value })}
                    disabled={isLoading}
                    className={`toggle-btn ${
                      product.tone === option.value ? "toggle-btn-active" : "toggle-btn-inactive"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="mr-1.5">{option.emoji}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Platforms <span className="text-pink-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {PLATFORM_OPTIONS.map((option) => {
                  const isSelected = product.platforms?.includes(option.value) ?? false;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        const currentPlatforms = product.platforms || [];
                        const newPlatforms = isSelected
                          ? currentPlatforms.filter((p) => p !== option.value)
                          : [...currentPlatforms, option.value];
                        setProduct({ ...product, platforms: newPlatforms });
                      }}
                      disabled={isLoading}
                      className={`toggle-btn flex items-center gap-2 ${
                        isSelected ? "toggle-btn-active" : "toggle-btn-inactive"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                      {isSelected && (
                        <svg className="h-4 w-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
              {touched.platforms && errors.platforms && (
                <p className="mt-2 text-sm text-red-400">{errors.platforms}</p>
              )}
            </div>

            {/* Research Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#0f0f17] rounded-xl border border-[#1f1f2e]">
              <div>
                <h4 className="text-sm font-medium text-white">Include Market Research</h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Search for trending hashtags, seasonal context, and market insights
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProduct({ ...product, includeResearch: !product.includeResearch })}
                disabled={isLoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  product.includeResearch
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-zinc-700"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    product.includeResearch ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-8">
            <button
              onClick={handleGeneratePosts}
              disabled={!isValid || isLoading}
              className="btn-gradient w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Posts
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="card-dark p-4 mb-8 border-red-500/30 bg-red-500/5">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-red-300">{error}</p>
                <button
                  onClick={handleGeneratePosts}
                  className="mt-2 text-sm text-red-400 hover:text-red-300 underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Generating Posts...</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card-dark overflow-hidden animate-pulse">
                  <div className="h-14 bg-zinc-800/50" />
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-full" />
                      <div>
                        <div className="h-4 w-24 bg-zinc-800 rounded mb-1.5" />
                        <div className="h-3 w-16 bg-zinc-800/50 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <div className="h-4 bg-zinc-800 rounded w-full" />
                      <div className="h-4 bg-zinc-800 rounded w-5/6" />
                      <div className="h-4 bg-zinc-800 rounded w-4/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Posts */}
        {!isLoading && posts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Generated Posts</h2>
              <span className="text-sm text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full">
                {posts.length} posts
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {posts.map((post, index) => (
                <PostCard key={index} platform={post.platform} content={post.content} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
