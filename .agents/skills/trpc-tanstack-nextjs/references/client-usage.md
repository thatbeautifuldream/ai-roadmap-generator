# Client Component Usage

## Basic Queries

```typescript
"use client";

import { useTRPC } from "@/trpc";
import { useQuery } from "@tanstack/react-query";

function FeatureList() {
  const trpc = useTRPC();

  // Simple query
  const { data, isLoading, error } = useQuery(trpc.feature.list.queryOptions());

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

## Query with Input

```typescript
function FeatureDetail({ id }: { id: string }) {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.feature.get.queryOptions({ id }));

  return <div>{data?.name}</div>;
}
```

## Mutations

```typescript
import { useMutation } from "@tanstack/react-query";

function CreateFeature() {
  const trpc = useTRPC();
  const utils = trpc.useUtils();

  const mutation = useMutation(
    trpc.feature.create.mutationOptions({
      onSuccess: () => {
        // Invalidate and refetch
        utils.feature.list.invalidate();
      },
    })
  );

  return (
    <button
      onClick={() => mutation.mutate({ name: "New Feature" })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Creating..." : "Create"}
    </button>
  );
}
```

## Mutation with Form

```typescript
function CreateFeatureForm() {
  const trpc = useTRPC();
  const utils = trpc.useUtils();
  const [name, setName] = useState("");

  const mutation = useMutation(
    trpc.feature.create.mutationOptions({
      onSuccess: () => {
        utils.feature.list.invalidate();
        setName("");
      },
      onError: (error) => {
        alert(error.message);
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Feature name"
      />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create"}
      </button>
      {mutation.error && <p className="error">{mutation.error.message}</p>}
    </form>
  );
}
```

## useUtils for Cache Operations

```typescript
function FeatureActions({ id }: { id: string }) {
  const trpc = useTRPC();
  const utils = trpc.useUtils();

  const deleteMutation = useMutation(
    trpc.feature.delete.mutationOptions({
      onSuccess: () => {
        // Invalidate list
        utils.feature.list.invalidate();
        // Remove from cache
        utils.feature.get.invalidate({ id });
      },
    })
  );

  // Prefetch on hover
  const handleHover = () => {
    utils.feature.get.prefetch({ id });
  };

  return (
    <div onMouseEnter={handleHover}>
      <button onClick={() => deleteMutation.mutate({ id })}>Delete</button>
    </div>
  );
}
```

## Dependent Queries

```typescript
function UserFeatures({ userId }: { userId: string }) {
  const trpc = useTRPC();

  const { data: user } = useQuery(trpc.user.get.queryOptions({ id: userId }));

  // Only fetch features when user is loaded
  const { data: features } = useQuery({
    ...trpc.feature.listByUser.queryOptions({ userId }),
    enabled: !!user,
  });

  return (
    <div>
      <h2>{user?.name}'s Features</h2>
      {features?.map((f) => <div key={f.id}>{f.name}</div>)}
    </div>
  );
}
```

## Query with Select

```typescript
function FeatureNames() {
  const trpc = useTRPC();

  // Transform/filter data
  const { data: names } = useQuery({
    ...trpc.feature.list.queryOptions(),
    select: (data) => data.map((f) => f.name),
  });

  return <div>{names?.join(", ")}</div>;
}
```

## Suspense Queries

```typescript
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

function FeatureListSuspense() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.feature.list.queryOptions());

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// Wrap with Suspense boundary
function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeatureListSuspense />
    </Suspense>
  );
}
```
