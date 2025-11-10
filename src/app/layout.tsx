// app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner"; // Import from sonner directly, not from components/ui
import WarningHeader from "../modules/shared/ui/warning-header";

export const metadata: Metadata = {
  title: "Dr/Tarek Exam platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          <WarningHeader />
          {children}
        </Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              success: "!bg-green-500 text-white!",
              error: "!bg-red-500 !text-white",
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
