# Optimistic Updates with tRPC + TanStack Query

Update UI immediately before server confirms, roll back on error.

## Basic Pattern

```typescript
"use client";

import { useTRPC } from "@/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function TodoList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: todos } = useQuery(trpc.todo.list.queryOptions());

  const addTodo = useMutation(
    trpc.todo.create.mutationOptions({
      onMutate: async (newTodo) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: trpc.todo.list.queryKey() });

        // Snapshot previous value
        const previousTodos = queryClient.getQueryData(trpc.todo.list.queryKey());

        // Optimistically update
        queryClient.setQueryData(trpc.todo.list.queryKey(), (old) => [
          ...(old ?? []),
          { id: "temp-id", ...newTodo, createdAt: new Date() },
        ]);

        return { previousTodos };
      },
      onError: (err, newTodo, context) => {
        // Roll back on error
        queryClient.setQueryData(trpc.todo.list.queryKey(), context?.previousTodos);
      },
      onSettled: () => {
        // Refetch after mutation
        queryClient.invalidateQueries({ queryKey: trpc.todo.list.queryKey() });
      },
    })
  );

  return (
    <div>
      {todos?.map((todo) => (
        <div key={todo.id}>{todo.title}</div>
      ))}
      <button onClick={() => addTodo.mutate({ title: "New todo" })}>Add</button>
    </div>
  );
}
```

## Delete with Optimistic Update

```typescript
const deleteTodo = useMutation(
  trpc.todo.delete.mutationOptions({
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: trpc.todo.list.queryKey() });
      const previousTodos = queryClient.getQueryData(trpc.todo.list.queryKey());

      queryClient.setQueryData(trpc.todo.list.queryKey(), (old) =>
        old?.filter((todo) => todo.id !== deletedId)
      );

      return { previousTodos };
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(trpc.todo.list.queryKey(), context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: trpc.todo.list.queryKey() });
    },
  })
);
```

## Update with Optimistic Patch

```typescript
const updateTodo = useMutation(
  trpc.todo.update.mutationOptions({
    onMutate: async ({ id, ...updates }) => {
      await queryClient.cancelQueries({ queryKey: trpc.todo.list.queryKey() });
      const previousTodos = queryClient.getQueryData(trpc.todo.list.queryKey());

      queryClient.setQueryData(trpc.todo.list.queryKey(), (old) =>
        old?.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
      );

      return { previousTodos };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(trpc.todo.list.queryKey(), context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: trpc.todo.list.queryKey() });
    },
  })
);
```

## Using useUtils for Simpler API

```typescript
function TodoList() {
  const trpc = useTRPC();
  const utils = trpc.useUtils();

  const addTodo = useMutation(
    trpc.todo.create.mutationOptions({
      onMutate: async (newTodo) => {
        await utils.todo.list.cancel();
        const previousTodos = utils.todo.list.getData();

        utils.todo.list.setData(undefined, (old) => [
          ...(old ?? []),
          { id: "temp-id", ...newTodo },
        ]);

        return { previousTodos };
      },
      onError: (err, newTodo, context) => {
        utils.todo.list.setData(undefined, context?.previousTodos);
      },
      onSettled: () => {
        utils.todo.list.invalidate();
      },
    })
  );
}
```
