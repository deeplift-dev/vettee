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
            className="flex-1 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/60"
            aria-label="Email address"
            disabled={status === "loading" || status === "success"}
          />
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            isLoading={status === "loading"}
            disabled={status === "success"}
            className="whitespace-nowrap bg-white/10 text-white hover:bg-white/20"
          >
            {status === "success" ? "Thanks!" : "Join"}
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
          className="w-full bg-white/10 text-white hover:bg-white/20"
        >
          Join early access
        </Button>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {status === "success" && (
        <p className="mt-2 text-sm text-green-400">We'll be in touch soon!</p>
      )}
    </form>
  );
}
