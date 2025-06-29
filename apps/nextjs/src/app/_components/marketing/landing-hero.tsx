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
            className="group relative overflow-hidden rounded px-4 py-2 font-sans text-sm font-medium text-white transition-all duration-300 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-[#6363f1]/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6363f1]/20 to-[#23F0C3]/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative z-10">Sign In</span>
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
            className="flex w-full flex-col text-white relative"
          >
            {/* Subtle backdrop for text content */}
            <div className="absolute inset-0 -inset-4 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl backdrop-blur-sm border border-white/[0.05] shadow-2xl shadow-black/20" />
            <motion.div
              variants={heroItem}
              className="mb-4 font-vetski text-4xl font-bold relative z-10"
            >
              <span className="bg-gradient-to-r from-[#23F0C3] to-[#6363f1] bg-clip-text text-transparent">
                Vetskii
              </span>
            </motion.div>
            <motion.h1
              variants={heroItem}
              className="text-4xl font-medium md:text-5xl relative z-10"
            >
              Treat with confidence.
              <br />
              <span className="text-[#23F0C3]">Your intelligent</span> veterinary assistant.
            </motion.h1>
            <motion.p variants={heroItem} className="text-s mt-4 text-lg text-white/80 relative z-10">
              Vetskii is an intelligent veterinary assistant that listens passively to your
              conversations and provides expert guidance when you need it.
            </motion.p>
            <motion.div variants={heroItem} className="mt-4 w-full max-w-lg relative z-10">
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
