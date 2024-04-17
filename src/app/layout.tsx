import AppBar from "@/app/appbar";
import Providers from "@/app/providers";
import Banner from "@/components/marketing/banner";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Script from "next/script";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.airoadmapgenerator.com/"),
  title: "AI Roadmap Generator",
  description: "Generate your roadmaps with AI.",
  openGraph: {
    images: "/opengraph-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <Providers>
          <NextTopLoader showSpinner={false} color="black" />
          <Banner />
          <AppBar />
          {children}
        </Providers>
      </body>
      <Script
        defer
        src="https://umami.milind.live/script.js"
        data-website-id="b901de55-a0bb-412b-b262-b0ed139f7f58"
      />
    </html>
  );
}
