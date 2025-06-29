"use client";

import { useRef, useState } from "react";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";

export default function EmailSignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      inputRef.current?.focus();
      return;
    }
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 flex w-full max-w-md items-center gap-2"
    >
      {isExpanded ? (
        <>
          <Input
            ref={inputRef}
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#23F0C3]/50 focus-visible:border-[#23F0C3]/50 shadow-lg shadow-black/10 transition-all duration-300"
            aria-label="Email address"
            disabled={status === "loading" || status === "success"}
          />
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            isLoading={status === "loading"}
            disabled={status === "success"}
            className="group relative whitespace-nowrap overflow-hidden bg-gradient-to-r from-[#6363f1] to-[#23F0C3] text-white shadow-lg shadow-[#6363f1]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#23F0C3]/30 hover:scale-[1.02] active:scale-[0.98] border-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#23F0C3] to-[#6363f1] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative z-10">{status === "success" ? "Thanks!" : "Join"}</span>
          </Button>
        </>
      ) : (
        <Button
          type="button"
          onClick={() => {
            setIsExpanded(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          variant="secondary"
          size="lg"
          className="group relative w-full overflow-hidden bg-gradient-to-r from-[#6363f1] to-[#23F0C3] text-white shadow-lg shadow-[#6363f1]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#23F0C3]/30 hover:scale-[1.02] active:scale-[0.98] border-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#23F0C3] to-[#6363f1] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative z-10">Join early access</span>
        </Button>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {status === "success" && (
        <p className="mt-2 text-sm text-green-400">We'll be in touch soon!</p>
      )}
    </form>
  );
}
