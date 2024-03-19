"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" richColors />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default Providers;
