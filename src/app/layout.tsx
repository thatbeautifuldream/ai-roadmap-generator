import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
// import AppBar from "@/app/appbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Roadmap Generator",
  description: "Generate your roadmaps with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* <AppBar /> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
