"use client";

import { useState, useMemo } from "react";
import { generatePosts, ApiError } from "@/api";
import { Product, SocialMediaPost, Tone, Platform } from "@/types";
import { CATEGORY_OPTIONS, ERROR_MESSAGES, DEFAULT_PLATFORMS, VALIDATION } from "@/constants";
import { validateProduct, isValidPriceInput } from "@/utils/validation";
import { Input, Textarea, Select, Toggle, Button } from "@/components/ui";
import { BoltIcon } from "@/components/icons";
import {
  ToneSelector,
  PlatformSelector,
  ErrorAlert,
  LoadingSkeleton,
  PostsGrid,
} from "@/features/generator/components";

const INITIAL_PRODUCT: Product = {
  name: "",
  description: "",
  price: 0,
  category: "",
  tone: "professional",
  platforms: DEFAULT_PLATFORMS,
  includeResearch: false,
};

export default function Home() {
  const [product, setProduct] = useState<Product>(INITIAL_PRODUCT);
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

  const updateProduct = <K extends keyof Product>(field: K, value: Product[K]) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (value: string) => {
    if (isValidPriceInput(value)) {
      setPriceInput(value);
      updateProduct("price", value === "" ? 0 : parseFloat(value) || 0);
    }
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
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Social Media</span>{" "}
            <span className="text-white">Post Generator</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Generate engaging, platform-optimized posts for your products with AI-powered insights.
          </p>
        </header>

        {/* Form Card */}
        <div className="card-dark p-6 sm:p-8 mb-8 glow">
          <div className="space-y-6">
            {/* Product Name */}
            <Input
              label="Product Name"
              required
              value={product.name}
              onChange={(e) => updateProduct("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="EcoBottle Pro"
              disabled={isLoading}
              error={touched.name ? errors.name : undefined}
            />

            {/* Description */}
            <Textarea
              label="Description"
              required
              value={product.description}
              onChange={(e) => updateProduct("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              placeholder="Revolutionary reusable water bottle with built-in UV purification..."
              disabled={isLoading}
              error={touched.description ? errors.description : undefined}
              showCount
              maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
            />

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Price"
                required
                prefix="$"
                inputMode="decimal"
                value={priceInput}
                onChange={(e) => handlePriceChange(e.target.value)}
                onBlur={() => handleBlur("price")}
                placeholder="49.99"
                disabled={isLoading}
                error={touched.price ? errors.price : undefined}
              />

              <Select
                label="Category"
                options={CATEGORY_OPTIONS}
                value={product.category || ""}
                onChange={(e) => updateProduct("category", e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Tone Selection */}
            <ToneSelector
              value={product.tone || "professional"}
              onChange={(tone: Tone) => updateProduct("tone", tone)}
              disabled={isLoading}
            />

            {/* Platform Selection */}
            <PlatformSelector
              value={product.platforms || []}
              onChange={(platforms: Platform[]) => updateProduct("platforms", platforms)}
              disabled={isLoading}
              error={touched.platforms ? errors.platforms : undefined}
            />

            {/* Research Toggle */}
            <Toggle
              label="Include Market Research"
              description="Search for trending hashtags, seasonal context, and market insights"
              checked={product.includeResearch ?? false}
              onChange={(checked) => updateProduct("includeResearch", checked)}
              disabled={isLoading}
            />
          </div>

          {/* Generate Button */}
          <div className="mt-8">
            <Button
              onClick={handleGeneratePosts}
              disabled={!isValid}
              isLoading={isLoading}
              icon={<BoltIcon />}
              className="w-full sm:w-auto"
            >
              Generate Posts
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && <ErrorAlert message={error} onRetry={handleGeneratePosts} />}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Generated Posts */}
        {!isLoading && <PostsGrid posts={posts} />}
      </div>
    </main>
  );
}
