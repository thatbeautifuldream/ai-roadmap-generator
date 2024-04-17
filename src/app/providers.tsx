"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { ViewTransitions } from "next-view-transitions";

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        appearance={{
          baseTheme: neobrutalism,
          variables: {
            colorPrimary: "black",
          },
        }}
      >
        <ViewTransitions>
          <Toaster position="bottom-right" richColors duration={4000} />
          {children}
          <GoogleAnalytics gaId="G-KGPW43F35B" />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </ViewTransitions>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export default Providers;
