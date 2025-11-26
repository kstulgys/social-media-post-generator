import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { generateSocialMediaPosts } from "./generate";
import { GenerateRequestSchema, formatZodErrors } from "./validation";
import { AppError, ApiErrorResponse } from "./types";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ hello: "world", timestamp: new Date().toISOString() });
});

// Generate social media posts
app.post("/api/generate", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = GenerateRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: formatZodErrors(validationResult.error),
      } as ApiErrorResponse);
      return;
    }

    const { product } = validationResult.data;

    const posts = await generateSocialMediaPosts(product);

    res.json({
      posts,
      generated_at: new Date().toISOString(),
      count: posts.length,
    });
  } catch (error) {
    next(error);
  }
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details,
    } as ApiErrorResponse);
    return;
  }

  // Handle unexpected errors
  res.status(500).json({
    error: "An unexpected error occurred",
    code: "INTERNAL_ERROR",
  } as ApiErrorResponse);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
