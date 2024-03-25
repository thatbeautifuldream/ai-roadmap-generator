import AppBar from "@/app/appbar";
import Providers from "@/app/providers";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  openGraph: {
    title: "AI Roadmap Generator",
    description: "Generate your roadmaps with AI.",
    url: "https://airoadmapgenerator.com",
    siteName: "AI Roadmap Generator",
    images: [
      {
        url: "https://airoadmapgenerator.com/opengraph-image.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
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
          <AppBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
