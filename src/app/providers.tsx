"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import * as React from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider baseUrl="https://www.airoadmapgenerator.com">
      <QueryClientProvider client={queryClient}>
        <Toaster position="bottom-right" richColors />
        {children}
        <GoogleAnalytics gaId="G-KGPW43F35B" />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default Providers;
