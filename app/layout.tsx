import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Second Home — A field guide to feeling at home.",
  description:
    "Three personal discoveries in a new city, connected to the things you love. Powered by Qloo.",
  icons: {
    icon: "/second-home.svg",
    shortcut: "/second-home.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
