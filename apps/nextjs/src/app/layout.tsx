import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import { cache } from "react";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Vettee",
  description: "The ultimate companion for your companions.",
  openGraph: {
    title: "Vettee",
    description: "The ultimate companion for your companions.",
    url: "https://vettee.vet",
    siteName: "Vettee",
  },
  twitter: {
    card: "summary_large_image",
    site: "@vettee",
    creator: "@vettee",
  },
};

// Lazy load headers
const getHeaders = cache(async () => headers());

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <TRPCReactProvider headersPromise={getHeaders()}>
          {props.children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
