"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { SessionProvider } from "next-auth/react";
import * as React from "react";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";

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
        <Toaster position="bottom-right" richColors />
        {children}
        <GoogleAnalytics gaId="G-KGPW43F35B" />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export default Providers;
