import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { generateSocialMediaPosts } from "./generate";
import { GenerateRequestSchema, formatZodErrors } from "./validation";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ hello: "world", timestamp: new Date().toISOString() });
});

// Generate social media posts
app.post("/api/generate", async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = GenerateRequestSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      error: "Validation failed",
      details: formatZodErrors(validationResult.error),
    });
    return;
  }

  const { product } = validationResult.data;

  const posts = await generateSocialMediaPosts(product);

  res.json({
    posts,
    generated_at: new Date().toISOString(),
    count: posts.length,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
