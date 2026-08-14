import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// ... fonts ...
export const metadata: Metadata = {
  title: "PokeSync",
  description: "Browse Pokémon with search, sort, and detailed stats",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans pokedex-page-bg text-pokedex-text">
        {children}
      </body>
    </html>
  );
}