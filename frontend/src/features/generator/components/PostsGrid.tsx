"use client";

import { SocialMediaPost } from "@/types";
import PostCard from "@/components/PostCard";

interface PostsGridProps {
  posts: SocialMediaPost[];
}

export function PostsGrid({ posts }: PostsGridProps) {
  if (posts.length === 0) return null;

  return (
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
  );
}
