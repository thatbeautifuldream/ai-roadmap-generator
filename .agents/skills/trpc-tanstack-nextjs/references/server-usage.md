# Server Component Patterns

## Prefetching with Hydration

Prefetch data on server, hydrate on client for instant load.

```typescript
// app/features/page.tsx
import { prefetch, HydrateClient, trpc } from "@/trpc";
import { FeatureList } from "./feature-list";

export default async function FeaturesPage() {
  // Prefetch on server
  prefetch(trpc.feature.list.queryOptions());

  return (
    <HydrateClient>
      {/* Client component uses cached data */}
      <FeatureList />
    </HydrateClient>
  );
}
```

## Prefetch Multiple Queries

```typescript
export default async function DashboardPage() {
  // Prefetch in parallel
  prefetch(trpc.feature.list.queryOptions());
  prefetch(trpc.user.stats.queryOptions());
  prefetch(trpc.activity.recent.queryOptions({ limit: 10 }));

  return (
    <HydrateClient>
      <Dashboard />
    </HydrateClient>
  );
}
```

## Direct Server Calls with getCaller

Use when you need data directly in server component (no client hydration).

```typescript
// app/features/[id]/page.tsx
import { getCaller } from "@/trpc";
import { notFound } from "next/navigation";

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caller = await getCaller();

  const feature = await caller.feature.get({ id });

  if (!feature) notFound();

  return (
    <div>
      <h1>{feature.name}</h1>
      <p>{feature.description}</p>
    </div>
  );
}
```

## Mixing Server Calls + Prefetch

```typescript
export default async function FeaturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caller = await getCaller();

  // Direct call for page data
  const feature = await caller.feature.get({ id });

  if (!feature) notFound();

  // Prefetch related data for client components
  prefetch(trpc.feature.related.queryOptions({ id }));
  prefetch(trpc.comment.list.queryOptions({ featureId: id }));

  return (
    <div>
      <h1>{feature.name}</h1>
      <HydrateClient>
        <RelatedFeatures featureId={id} />
        <Comments featureId={id} />
      </HydrateClient>
    </div>
  );
}
```

## Parallel Data Fetching

```typescript
export default async function Page() {
  const caller = await getCaller();

  // Parallel fetch with Promise.all
  const [features, users, stats] = await Promise.all([
    caller.feature.list(),
    caller.user.list(),
    caller.analytics.stats(),
  ]);

  return (
    <div>
      <FeatureSection features={features} />
      <UserSection users={users} />
      <StatsSection stats={stats} />
    </div>
  );
}
```

## Server Actions with tRPC

```typescript
// app/features/actions.ts
"use server";

import { getCaller } from "@/trpc";
import { revalidatePath } from "next/cache";

export async function createFeature(formData: FormData) {
  const caller = await getCaller();

  const name = formData.get("name") as string;

  await caller.feature.create({ name });

  revalidatePath("/features");
}

export async function deleteFeature(id: string) {
  const caller = await getCaller();

  await caller.feature.delete({ id });

  revalidatePath("/features");
}
```

```typescript
// Usage in component
function CreateForm() {
  return (
    <form action={createFeature}>
      <input name="name" required />
      <button type="submit">Create</button>
    </form>
  );
}
```

## Generating Metadata

```typescript
// app/features/[id]/page.tsx
import { getCaller } from "@/trpc";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const caller = await getCaller();
  const feature = await caller.feature.get({ id });

  return {
    title: feature?.name ?? "Feature Not Found",
    description: feature?.description,
  };
}
```

## Static Generation

```typescript
// app/features/[id]/page.tsx
import { getCaller } from "@/trpc";

export async function generateStaticParams() {
  const caller = await getCaller();
  const features = await caller.feature.list();

  return features.map((f) => ({ id: f.id }));
}
```
