"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

import LogoText from "~/ui/logo-text";
import allAnimalsAnimation from "../../assets/animations/all-animals-animation.json";

export const runtime = "edge";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col justify-center overflow-auto bg-gray-950 py-24 text-white">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="bg-gradient-to-bl from-white via-slate-100 to-white bg-clip-text font-vetski text-xl leading-normal text-transparent md:text-xl">
              Vetskii
            </h1>
          </motion.div>
          <motion.p
            className="text-pretty mx-auto mt-2 max-w-lg bg-gradient-to-r from-lime-400 via-lime-300 to-green-400 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent sm:text-5xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            AI-powered support for veterinarians.
          </motion.p>
        </div>
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          <motion.div
            className="relative lg:row-span-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-px rounded-lg bg-gray-900 lg:rounded-l-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-lime-400 max-lg:text-center">
                  Expert veterinary assistance
                </p>
                <p className="mt-2 max-w-lg text-base/6 text-gray-300 max-lg:text-center">
                  Get instant support for diagnoses, treatment plans, and
                  complex cases. Vetski helps you make informed decisions
                  faster.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-800 shadow-2xl">
                  {/* <img
                    className="size-full object-cover object-top"
                    src="https://jtgxffbpsnibgzbhaewx.supabase.co/storage/v1/object/public/assets/landing-main.png?t=2024-10-07T04%3A08%3A46.647Z"
                    alt="Veterinarian using Vetski on a tablet"
                  /> */}
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-white/10 lg:rounded-l-[2rem]"></div>
          </motion.div>
          <motion.div
            className="relative max-lg:row-start-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute inset-px rounded-lg bg-gray-900 max-lg:rounded-t-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-lime-400 max-lg:text-center">
                  Early access
                </p>
                <p className="mt-2 max-w-lg text-base/6 text-gray-300 max-lg:text-center">
                  Vetski is currently in private beta. Sign up to join our
                  waitlist for exclusive early access.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                <form className="w-full max-w-sm">
                  <div className="flex items-center rounded-md border border-gray-700 bg-gray-800 px-2 py-2 shadow-sm">
                    <input
                      className="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-100 placeholder-gray-500 focus:outline-none"
                      type="email"
                      placeholder="Enter your email"
                      aria-label="Email"
                    />
                    <button
                      className="flex-shrink-0 rounded bg-lime-500 px-2 py-1 text-sm text-gray-900 hover:bg-lime-400"
                      type="button"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-white/10 max-lg:rounded-t-[2rem]"></div>
          </motion.div>
          <motion.div
            className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-px rounded-lg bg-gray-900"></div>
            <div className="relative flex h-96 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:h-full">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-lime-400 max-lg:text-center">
                  For all animal specialties
                </p>
                <p className="mt-2 max-w-lg text-base/6 text-gray-300 max-lg:text-center">
                  Whether you're a small animal vet, equine specialist, or
                  exotic pet expert, Vetski adapts to your specialty needs.
                </p>
              </div>
              <div className="relative flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
                <div className="absolute -bottom-[200px] lg:-bottom-[270px]">
                  <Lottie animationData={allAnimalsAnimation} />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-white/10"></div>
          </motion.div>
          <motion.div
            className="relative lg:row-span-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="absolute inset-px rounded-lg bg-gray-900 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-lime-400 max-lg:text-center">
                  AI-powered clinical insights
                </p>
                <p className="mt-2 max-w-lg text-base/6 text-gray-300 max-lg:text-center">
                  Access the latest research, diagnostic tools, and treatment
                  recommendations - all tailored to your patient's specific
                  case.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-800 shadow-2xl">
                  {/* <img
                    className="size-full object-cover object-top"
                    src="https://jtgxffbpsnibgzbhaewx.supabase.co/storage/v1/object/public/assets/landing-two.png"
                    alt="Vetski AI chat interface"
                  /> */}
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-white/10 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="flex w-full justify-center pt-24"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-row items-center space-x-4 py-4">
          <Link
            className="text-gray-400 transition-colors duration-300 hover:text-lime-400"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-gray-400 transition-colors duration-300 hover:text-lime-400"
            href="/terms"
          >
            Terms of Service
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
