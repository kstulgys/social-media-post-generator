import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { generateSocialMediaPosts } from "./generate";
import { Product } from "./types";

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
  const product: Product = req.body.product;

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
