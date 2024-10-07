"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Link from "next/link";
import LogoText from "~/ui/logo-text";
import allAnimalsAnimation from "../../assets/animations/all-animals-animation.json";
export const runtime = "edge";

export default function HomePage() {
  return (
    <div className="h-full flex flex-col justify-center overflow-auto py-24">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LogoText />
          </motion.div>
          <motion.p
            className="mx-auto mt-2 max-w-lg text-pretty text-center text-4xl font-medium tracking-tight text-gray-950 sm:text-5xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your companion in pet care.
          </motion.p>
        </div>
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          <motion.div
            className="relative lg:row-span-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Pet care at your fingertips
                </p>
                <p className="mt-2 max-w-lg text-base/6 text-gray-600 max-lg:text-center">
                  Get instant, personalised care and advice for your pets. Peace of mind for you, and happiness for your pets.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                  <img
                    className="size-full object-cover object-top"
                    src="https://jtgxffbpsnibgzbhaewx.supabase.co/storage/v1/object/public/assets/landing-main.png?t=2024-10-07T04%3A08%3A46.647Z"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
          </motion.div>
          <motion.div
            className="relative max-lg:row-start-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Coming soon
                </p>
                <p className="mt-2 max-w-lg text-base/6 text-gray-600 max-lg:text-center">
                  Vettee is currently in development. Add your email to know when we've launched.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                <form className="w-full max-w-sm">
                  <div className="flex items-center border border-gray-200 py-2 rounded-md px-2 shadow-sm">
                    <input
                      className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="email"
                      placeholder="Enter your email"
                      aria-label="Email"
                    />
                    <button
                      className="flex-shrink-0 bg-gray-900 hover:bg-gray-800 text-sm text-white py-1 px-2 rounded"
                      type="button"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
          </motion.div>
          <motion.div
            className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-px rounded-lg bg-white"></div>
            <div className="relative flex h-96 lg:h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">An app for all your animals</p>
                <p className="mt-2 max-w-lg text-base/6 text-gray-600 max-lg:text-center">
                  Whether you have a cat, dog, bird, or any other pet, Vettee is here to help you take care of them.
                </p>
              </div>
              <div className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2 relative">
                <div className="absolute -bottom-[200px] lg:-bottom-[270px]">
                  <Lottie animationData={allAnimalsAnimation} />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
          </motion.div>
          <motion.div
            className="relative lg:row-span-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Superpowered chat
                </p>
                <p className="mt-2 max-w-lg text-base/6 text-gray-600 max-lg:text-center">
                  Vettee learns more about your pets as you chat about them. 
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                  <img
                    className="size-full object-cover object-top"
                    src="https://jtgxffbpsnibgzbhaewx.supabase.co/storage/v1/object/public/assets/landing-two.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="lg:absolute bottom-0 w-full flex justify-center pt-12 lg:pt-0"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-row items-center space-x-4 py-4">
            <Link className="text-gray-500 hover:text-gray-700 transition-colors duration-300" href="/privacy">Privacy Policy</Link>
            <Link className="text-gray-500 hover:text-gray-700 transition-colors duration-300" href="/terms">Terms of Service</Link>
        </div>
      </motion.div>
    </div>
  )
}
