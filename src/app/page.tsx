import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Later:
// import { AuthProvider } from "@/modules/auth/components/AuthProvider";
// import { Header } from "@/shared/components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "PokeSync",
    template: "%s | PokeSync",  // e.g. "Collection | PokeSync"
  },
  description: "Sync and manage your Pokémon collection across devices.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold">Welcome to PokeSync</h1>
    </div>
  );
}