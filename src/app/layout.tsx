import type { Metadata, Viewport } from "next";
import { profile } from "@/lib/content";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profile.name} Portfolio`,
  description: `${profile.name}, ${profile.role}. Open to relocation. Portfolio and resume.`,
};

export const viewport: Viewport = {
  themeColor: "#040605",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
