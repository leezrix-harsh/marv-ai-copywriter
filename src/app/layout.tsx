import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marv AI Copywriter - Generate Compelling Copy in Seconds",
  description:
    "Create powerful, persuasive marketing copy with Marv AI Copywriter. Generate unique content that converts. Powered by advanced AI.",
  keywords: [
    "AI copywriter",
    "copy generator",
    "marketing copy",
    "AI writing",
    "content generation",
  ],
  authors: [{ name: "Marv AI" }],
  openGraph: {
    title: "Marv AI Copywriter - Generate Compelling Copy in Seconds",
    description:
      "Create powerful, persuasive marketing copy with Marv AI Copywriter.",
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
      <body>
        {children}
      </body>
    </html>
  );
}
