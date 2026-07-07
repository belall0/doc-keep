import type { Metadata } from "next";

// @ts-expect-error CSS global import is handled by Next.js
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Permission Systems",
  description: "Demo App for different permission systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased dark">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
