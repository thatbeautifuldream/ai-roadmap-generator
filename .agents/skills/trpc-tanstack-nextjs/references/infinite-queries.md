# Infinite Queries with tRPC + TanStack Query

Paginated data loading with cursor-based pagination.

## Router Setup

```typescript
// trpc/routers/post.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../init";

export const postRouter = createTRPCRouter({
  infinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().nullish(), // Last item ID
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const items = await ctx.db.query.posts.findMany({
        limit: limit + 1, // Fetch one extra to check if more exist
        where: cursor
          ? (posts, { gt }) => gt(posts.id, cursor)
          : undefined,
        orderBy: (posts, { asc }) => asc(posts.id),
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
});
```

## Client Component

```typescript
"use client";

import { useTRPC } from "@/trpc";
import { useInfiniteQuery } from "@tanstack/react-query";

function PostList() {
  const trpc = useTRPC();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    trpc.post.infinite.infiniteQueryOptions(
      { limit: 20 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  );

  if (isLoading) return <div>Loading...</div>;

  const allPosts = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div>
      {allPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading more..." : "Load more"}
        </button>
      )}
    </div>
  );
}
```

## With Intersection Observer

```typescript
"use client";

import { useEffect, useRef } from "react";
import { useTRPC } from "@/trpc";
import { useInfiniteQuery } from "@tanstack/react-query";

function InfinitePostList() {
  const trpc = useTRPC();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.post.infinite.infiniteQueryOptions(
      { limit: 20 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allPosts = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div>
      {allPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
      <div ref={loadMoreRef}>
        {isFetchingNextPage && <span>Loading more...</span>}
      </div>
    </div>
  );
}
```

## Prefetching Infinite Queries

```typescript
// app/posts/page.tsx
import { prefetch, HydrateClient, trpc } from "@/trpc";
import { PostList } from "./post-list";

export default async function PostsPage() {
  prefetch(
    trpc.post.infinite.infiniteQueryOptions(
      { limit: 20 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  return (
    <HydrateClient>
      <PostList />
    </HydrateClient>
  );
}
```

## Bidirectional Infinite Query

```typescript
const {
  data,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  hasPreviousPage,
} = useInfiniteQuery(
  trpc.post.infinite.infiniteQueryOptions(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      getPreviousPageParam: (firstPage) => firstPage.previousCursor,
    }
  )
);
```
