import type { Metadata } from "next";
import localFont from "next/font/local";

import "~/styles/globals.css";

import { headers } from "next/headers";
import { cache } from "react";

import { TRPCReactProvider } from "~/trpc/react";

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

console.log("SaansFont", SaansFont.variable);
console.log("OddvalFont", OddvalFont.variable);

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
    <html lang="en" className={`${OddvalFont.variable} ${SaansFont.variable}`}>
      <body className="font-sans bg-gray-50">
        <TRPCReactProvider headersPromise={getHeaders()}>
          {props.children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
