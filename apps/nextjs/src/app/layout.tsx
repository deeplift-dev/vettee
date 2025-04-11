import type { Metadata } from "next";
import localFont from "next/font/local";

import "~/styles/globals.css";

import { cache } from "react";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "./_components/ui/toaster";
import { setupChatAttachmentsBucket } from "./api/storage/setup-bucket";

const SaansFont = localFont({
  src: [
    {
      path: "../../assets/fonts/Saans/Saans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../assets/fonts/Saans/Saans-Regular.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../assets/fonts/Saans/Saans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../assets/fonts/Saans/Saans-Light.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-saans",
});

const OddvalFont = localFont({
  src: [
    {
      path: "../../assets/fonts/Oddval/Oddval-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-oddval",
});

const PacowFont = localFont({
  src: [
    {
      path: "../../assets/fonts/Pacow/Pacow.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-pacow",
});

export const metadata: Metadata = {
  title: "Vetskii | Every vet's favourite sidekick.",
  description: "Every vet's favourite sidekick.",
  openGraph: {
    title: "Vetskii",
    description: "Every vet's favourite sidekick.",
    url: "https://vetskii.com",
    siteName: "Vetskii",
  },
  twitter: {
    card: "summary_large_image",
    site: "@vetskii",
    creator: "@vetskii",
  },
  keywords: "veterinary, pets, support, Vetskii",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

// Lazy load headers
const getHeaders = cache(async () => headers());

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure the bucket exists with proper permissions
  await setupChatAttachmentsBucket();

  return (
    <html
      lang="en"
      className={`${OddvalFont.variable} ${SaansFont.variable} ${PacowFont.variable}`}
    >
      <body className="bg-gray-50 font-sans">
        <TRPCReactProvider headersPromise={getHeaders()}>
          {children}
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
