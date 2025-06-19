"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import ImprovedDemo from "~/app/_components/marketing/improved-demo";
import EmailSignupForm from "./email-signup-form";
import AnimatedBackground from "./animated-background";

// Staggered entrance variants for hero copy
const heroContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const;

const heroItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
} as const;

export default function LandingHero() {
  return (
    <>
      <section className="relative -mt-14 flex min-h-screen w-full flex-col justify-center overflow-hidden">
        <div className="absolute right-0 top-0 flex items-center justify-center p-4">
          <Link
            href="/auth/login"
            className="rounded border border-gray-700 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 px-2 py-1 font-sans text-sm font-medium uppercase text-white transition-colors hover:from-gray-900 hover:to-gray-800"
          >
            Sign In
          </Link>
        </div>
        {/* Animated background */}
        <AnimatedBackground />

        {/* Two-column layout */}
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 p-6 md:grid-cols-2">
          {/* Left: Copy */}
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="flex w-full flex-col text-white"
          >
            <motion.div
              variants={heroItem}
              className="mb-4 font-vetski text-4xl font-bold"
            >
              Vetskii
            </motion.div>
            <motion.h1
              variants={heroItem}
              className="text-4xl font-medium md:text-5xl"
            >
              Treat with confidence.
              <br />
              Your intelligent veterinary assistant.
            </motion.h1>
            <motion.p variants={heroItem} className="text-s mt-4 text-lg">
              Vetskii is an intelligent veterinary assistant that listens passively to your
              conversations and provides expert guidance when you need it.
            </motion.p>
            <motion.div variants={heroItem} className="mt-4 w-full max-w-lg">
              <EmailSignupForm />
            </motion.div>
          </motion.div>

          {/* Right: Interactive demo */}
          <div className="flex w-full justify-center">
            <ImprovedDemo />
          </div>
        </div>
      </section>
    </>
  );
}
