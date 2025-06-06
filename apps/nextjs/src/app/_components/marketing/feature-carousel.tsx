"use client";

import { useEffect, useState } from "react";

const prompts = [
  "Correct dose of meloxicam for a 28 kg dog?",
  "Best administration route for dexmedetomidine in cats?",
  "Withdrawal period for ceftiofur in dairy cattle?",
  "Calculate fluid rate for a 4 kg dehydrated kitten.",
  "Rapid differential diagnoses for a lame dairy cow.",
];

export default function FeatureCarousel() {
  const [index, setIndex] = useState(0);

  // Cycle every 4 s
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % prompts.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-6 w-full max-w-xl overflow-hidden">
      {prompts.map((text, i) => (
        <span
          key={i}
          className={`absolute inset-0 flex items-center justify-center text-sm text-white/60 transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          {text}
        </span>
      ))}
    </div>
  );
}
