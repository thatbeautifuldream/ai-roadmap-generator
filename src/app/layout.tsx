import AppBar from "@/app/appbar";
import Providers from "@/app/providers";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"] });

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
      <body className={nunito.className}>
        <Providers>
          <AppBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
