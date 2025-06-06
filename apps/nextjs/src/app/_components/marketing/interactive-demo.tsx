"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcwIcon } from "lucide-react";

import { RainbowButton } from "../ui/rainbow-button";

interface Message {
  role: "vet" | "ai";
  text: string;
}

interface AnimalDemo {
  id: string;
  label: string;
  icon: string; // Could be replaced with svg later
  conversation: Message[];
  tip?: string; // Optional proactive tip from the AI
}

interface TranscriptLine {
  speaker: "owner" | "vet";
  text: string;
}

const demos: AnimalDemo[] = [
  {
    id: "dog",
    label: "Dog",
    icon: "🐶",
    conversation: [
      {
        role: "vet",
        text: "Recommended long-term therapy for canine atopic dermatitis in a 28 kg Labrador?",
      },
      {
        role: "ai",
        text: "Start oclacitinib 0.4–0.6 mg/kg PO BID, strict flea control, medicated shampoos; consider allergen-specific immunotherapy for sustained relief.\nTip: run a serum IgE panel first – if food allergens dominate, an elimination diet can reduce drug reliance.",
      },
    ],
    tip: "Consider asking about diet and environmental allergens – eliminating triggers can reduce medication needs.",
  },
  {
    id: "cat",
    label: "Cat",
    icon: "🐱",
    conversation: [
      {
        role: "vet",
        text: "Initial glargine insulin dose for a newly diagnosed 4 kg diabetic cat?",
      },
      {
        role: "ai",
        text: "0.25 U/kg every 12 h → round to 1 U q12h; feed consistent low-carb diet and re-check a BG curve in 7–10 days.",
      },
    ],
  },
  {
    id: "rabbit",
    label: "Rabbit",
    icon: "🐰",
    conversation: [
      {
        role: "vet",
        text: "Safe anaesthetic protocol for a 1.4 kg rabbit requiring dental burring?",
      },
      {
        role: "ai",
        text: "Premed midazolam 0.5 mg/kg + buprenorphine 0.05 mg/kg IM, induce alfaxalone 5 mg/kg IV, maintain 1.5–2 % isoflurane with oxygen; provide active warming & oxygenation.\nTip: place an intranasal oxygen cannula before induction – rabbits desaturate quickly during apnoea.",
      },
    ],
    tip: "Check gut motility beforehand – rabbits with dental pain often have underlying GI stasis.",
  },
  {
    id: "horse",
    label: "Horse",
    icon: "🐴",
    conversation: [
      {
        role: "vet",
        text: "Core vaccination schedule for a 7-year-old competition horse in the UK?",
      },
      {
        role: "ai",
        text: "Influenza–tetanus: day 0, 4–6 weeks, 5 months then annual boosters; booster within 6 months + 21 days before FEI events. Add EHV & strangles as risk-based.",
      },
    ],
  },
];

// Extra meta information used only for the animated scene (kept separate so we
// don't have to change the original `demos` data structure).
const demoMeta: Record<
  string,
  {
    transcript: TranscriptLine[];
    details: { label: string; value: string }[];
  }
> = {
  dog: {
    transcript: [
      {
        speaker: "owner",
        text: "Hi doctor, Max won't stop scratching.",
      },
      {
        speaker: "vet",
        text: "When did the itching start and is he on any flea prevention?",
      },
      {
        speaker: "owner",
        text: "A few weeks ago—he's on monthly tablets though.",
      },
      {
        speaker: "vet",
        text: "Okay, we'll examine his skin and discuss treatment options.",
      },
      {
        speaker: "owner",
        text: "Thanks doc, let me know if you need anything else from me.",
      },
      {
        speaker: "vet",
        text: "Will do – I may ask a few more questions once we've had a closer look.",
      },
      { speaker: "owner", text: "No worries, whatever helps." },
      {
        speaker: "vet",
        text: "I'll also prep some allergy tests in case we need them.",
      },
      { speaker: "owner", text: "Happy with that plan." },
      {
        speaker: "vet",
        text: "We'll also review his diet to rule out food triggers.",
      },
      {
        speaker: "owner",
        text: "He's on a chicken kibble—should I change it?",
      },
      {
        speaker: "vet",
        text: "Possibly to a hydrolysed protein; I'll give you options.",
      },
      { speaker: "owner", text: "Great, thank you." },
    ],
    details: [
      { label: "Name", value: "Max" },
      { label: "Species", value: "Dog" },
      { label: "Weight", value: "28 kg" },
      { label: "Age", value: "5 y" },
    ],
  },
  cat: {
    transcript: [
      { speaker: "owner", text: "Hello! Luna has been drinking a lot lately." },
      {
        speaker: "vet",
        text: "Increased thirst can point to diabetes. How old is she and roughly what does she weigh?",
      },
      {
        speaker: "owner",
        text: "She's eight and around four kilos.",
      },
      { speaker: "vet", text: "Thanks—we'll run a blood test to confirm." },
      { speaker: "owner", text: "Ok, I'll wait here while you do that." },
      {
        speaker: "vet",
        text: "Great, results take about ten minutes; I'll pop back shortly.",
      },
      { speaker: "owner", text: "I'll keep her calm in the meantime." },
      {
        speaker: "vet",
        text: "Perfect. We'll also run a quick urinalysis while we're at it.",
      },
      { speaker: "owner", text: "Thanks—let me know if you need anything." },
      {
        speaker: "vet",
        text: "Of course. We'll discuss insulin pens versus syringes too.",
      },
      { speaker: "owner", text: "I've never used pens before—sounds easier." },
      { speaker: "vet", text: "Many owners prefer them; I'll show you how." },
      { speaker: "owner", text: "Perfect, thanks." },
    ],
    details: [
      { label: "Name", value: "Luna" },
      { label: "Species", value: "Cat" },
      { label: "Weight", value: "4 kg" },
      { label: "Age", value: "8 y" },
    ],
  },
  rabbit: {
    transcript: [
      {
        speaker: "owner",
        text: "Hi, my rabbit Nibbles won't eat his pellets.",
      },
      {
        speaker: "vet",
        text: "That could be dental pain. How old is he and his approximate weight?",
      },
      {
        speaker: "owner",
        text: "He's two and about 1.4 kilos.",
      },
      {
        speaker: "vet",
        text: "Alright, we'll check his teeth under sedation.",
      },
      {
        speaker: "owner",
        text: "Is there anything I should do before the procedure?",
      },
      {
        speaker: "vet",
        text: "We'll keep him nil-by-mouth this morning and give you post-op feeding advice.",
      },
      { speaker: "owner", text: "Okay, thanks doctor." },
      {
        speaker: "vet",
        text: "We'll give you a call once he's awake and eating again.",
      },
      { speaker: "owner", text: "Appreciate the update." },
      {
        speaker: "vet",
        text: "No problem. We'll also send him home with pain relief.",
      },
      { speaker: "owner", text: "Okay, I'll keep an eye on him." },
      {
        speaker: "vet",
        text: "Give us a call if he hasn't eaten in six hours.",
      },
      { speaker: "owner", text: "Will do." },
    ],
    details: [
      { label: "Name", value: "Nibbles" },
      { label: "Species", value: "Rabbit" },
      { label: "Weight", value: "1.4 kg" },
      { label: "Age", value: "2 y" },
    ],
  },
  horse: {
    transcript: [
      {
        speaker: "owner",
        text: "Morning doc, Willow is due for her vaccines.",
      },
      {
        speaker: "vet",
        text: "Sure—when was her last influenza and tetanus booster?",
      },
      {
        speaker: "owner",
        text: "Last April, so just over a year ago.",
      },
      { speaker: "vet", text: "Great, we'll get her back on schedule today." },
      {
        speaker: "owner",
        text: "Perfect, I'll let the trainer know she's covered.",
      },
      {
        speaker: "vet",
        text: "If any issues crop up tonight, give us a ring – otherwise she can work tomorrow.",
      },
      { speaker: "owner", text: "Sounds good, thanks." },
      {
        speaker: "vet",
        text: "I'll update her vaccination card before you leave.",
      },
      { speaker: "owner", text: "Perfect—see you shortly." },
      { speaker: "vet", text: "We'll schedule her dental next month as well." },
      { speaker: "owner", text: "Good idea—she's due." },
      {
        speaker: "vet",
        text: "I'll email the booking options this afternoon.",
      },
      { speaker: "owner", text: "Thanks again!" },
    ],
    details: [
      { label: "Name", value: "Willow" },
      { label: "Species", value: "Horse" },
      { label: "Weight", value: "500 kg" },
      { label: "Age", value: "7 y" },
    ],
  },
} as const;

type Phase =
  | "idle"
  | "recording"
  | "transcribing"
  | "extracting"
  | "tip"
  | "typing"
  | "thinking"
  | "answer";

// Small uppercase heading that separates each phase visually
const SectionLabel = ({ children }: { children: ReactNode }) => (
  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-lime-300/70">
    {children}
  </div>
);

// Framer Motion variants for staggered species button entrance
const speciesContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      when: "beforeChildren",
    },
  },
} as const;

const speciesItem = {
  hidden: { opacity: 0, y: 10, scale: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 240, damping: 18 },
  },
} as const;

export default function InteractiveDemo() {
  const [selectedId, setSelectedId] = useState<string>(demos[0]!.id);
  const currentDemo = (demos.find((d) => d.id === selectedId) ?? demos[0])!;
  const currentMeta = demoMeta[currentDemo.id]!;
  const ownerName = useMemo(() => {
    const names = [
      "Alex",
      "Sam",
      "Taylor",
      "Jordan",
      "Casey",
      "Riley",
      "Jamie",
      "Morgan",
      "Avery",
      "Parker",
    ];
    return names[Math.floor(Math.random() * names.length)];
  }, [selectedId]);
  const vetQuestion = currentDemo.conversation[0]?.text ?? "";
  const aiAnswer = currentDemo.conversation[1]?.text ?? "";

  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleLines, setVisibleLines] = useState(0);
  const [typedText, setTypedText] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);
  // Tracks whether the sequence has been run at least once
  const hasStartedRef = useRef(false);
  const isListening =
    phase !== "idle" &&
    phase !== "recording" &&
    visibleLines < currentMeta.transcript.length;
  const showTip =
    currentDemo.tip && ["tip", "typing", "thinking", "answer"].includes(phase);
  const showTranscriptBlur = visibleLines < 3;

  // Helper to clear all queued timers/intervals
  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  // Reset animation whenever the user picks a different animal
  useEffect(() => {
    clearTimers();
    setPhase("idle");
    setVisibleLines(0);
    setTypedText("");

    if (hasStartedRef.current) {
      // Automatically start for the new demo after a brief tick
      const id = setTimeout(startSequence, 200);
      timers.current.push(id);
    }
  }, [selectedId]);

  // Clean-up on unmount
  useEffect(() => clearTimers, []);

  const startSequence = () => {
    clearTimers();
    setVisibleLines(0);
    setTypedText("");
    setPhase("recording");
    hasStartedRef.current = true;
    timers.current.push(setTimeout(() => setPhase("transcribing"), 4000));
  };

  // Continuously reveal transcript lines while listening
  useEffect(() => {
    if (isListening) {
      const id = setTimeout(() => {
        setVisibleLines((v) => v + 1);

        // If we've shown enough lines to fill the details panel, kick off the next phase early
        if (
          phase === "transcribing" &&
          visibleLines + 1 === currentMeta.details.length
        ) {
          const nextPhase = currentDemo.tip ? "tip" : "typing";
          timers.current.push(
            setTimeout(() => setPhase(nextPhase as Phase), 200),
          );
        }
      }, 3000);
      timers.current.push(id);
    } else if (
      phase === "transcribing" &&
      visibleLines >= currentMeta.transcript.length
    ) {
      // Finished transcript → immediately proceed (skip long pause)
      const next = currentDemo.tip ? "tip" : "typing";
      timers.current.push(setTimeout(() => setPhase(next as Phase), 100));
    }
  }, [isListening, phase, visibleLines, currentMeta]);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [visibleLines]);

  // Compute how many details to show based on how many transcript lines we have processed
  const detailVisibleCount = Math.min(visibleLines, currentMeta.details.length);

  // Show details panel then advance
  useEffect(() => {
    if (phase === "extracting") {
      const next = currentDemo.tip ? "tip" : "typing";
      const id = setTimeout(() => setPhase(next as Phase), 3000);
      timers.current.push(id);
    }
  }, [phase, currentDemo]);

  // Show proactive tip then advance to typing
  useEffect(() => {
    if (phase === "tip") {
      const id = setTimeout(() => setPhase("typing"), 3600);
      timers.current.push(id);
    }
  }, [phase]);

  // Typing animation for the vet's question
  useEffect(() => {
    if (phase === "typing") {
      const full = vetQuestion;
      let idx = 0;
      const interval = setInterval(() => {
        idx++;
        setTypedText(full.slice(0, idx));
        if (idx === full.length) {
          clearInterval(interval);
          timers.current.push(setTimeout(() => setPhase("thinking"), 800));
        }
      }, 70);
      timers.current.push(interval as unknown as ReturnType<typeof setTimeout>);
    }
  }, [phase, vetQuestion]);

  // Move from thinking to answer after a brief delay
  useEffect(() => {
    if (phase === "thinking") {
      const id = setTimeout(() => setPhase("answer"), 2400);
      timers.current.push(id);
    }
  }, [phase]);

  const isDialog = useMemo(() => {
    return window.innerWidth < 640 && phase !== "idle";
  }, [phase]);

  return (
    <>
      {isDialog && phase !== "idle" && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
      <div
        className={`${
          isDialog
            ? "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
            : "mt-8 flex w-full justify-center"
        }`}
      >
        {isDialog && (
          <div className="absolute right-0 top-0">
            <button
              onClick={() => setPhase("idle")}
              className="rounded bg-gradient-to-br from-black/50 to-black/0 px-2 py-1 font-sans text-sm font-medium uppercase text-white hover:bg-black/10"
            >
              Close
            </button>
          </div>
        )}
        <div className="w-full max-w-xl p-6 shadow-lg backdrop-blur-sm">
          {/* Top row: species selector */}
          <motion.div
            variants={speciesContainer}
            initial="hidden"
            animate="show"
            className="flex w-full justify-center gap-2"
          >
            {demos.map((d) => (
              <motion.button
                variants={speciesItem}
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl transition-colors duration-200 ${
                  d.id === selectedId
                    ? "border border-lime-800 text-[#0A0A0A] shadow-lime-800"
                    : "text-white hover:bg-white/10"
                }`}
                aria-label={d.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{d.icon}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Scene */}
          <div className="mt-6 space-y-5">
            {/* Idle */}
            {phase === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.4,
                }}
                className="flex w-full justify-center"
              >
                <RainbowButton onClick={startSequence}>
                  Start consultation
                </RainbowButton>
              </motion.div>
            )}

            {/* Recording */}
            {phase === "recording" && (
              <div className="flex items-center justify-center gap-2 font-mono text-sm text-red-400">
                <span className="h-2 w-2 animate-ping rounded-full bg-red-500" />
                Recording…
              </div>
            )}

            {/* Extracted details */}
            {(phase === "transcribing" ||
              phase === "extracting" ||
              phase === "tip" ||
              phase === "typing" ||
              phase === "thinking" ||
              phase === "answer") && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-white/5 p-3 text-xs text-white/80 backdrop-blur-sm"
              >
                <div className="grid grid-cols-4 gap-2">
                  {currentMeta.details.map((d, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="font-medium text-white">{d.label}</span>
                      {i < detailVisibleCount ? (
                        <motion.span
                          key={`${d.label}-shown`}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          {d.value}
                        </motion.span>
                      ) : (
                        <span className="opacity-50">—</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Transcript bubbles */}
            {phase !== "idle" && phase !== "recording" && (
              <>
                <SectionLabel>Transcript</SectionLabel>
                {isListening && (
                  <div className="mt-1 flex items-center gap-2 font-mono text-xs text-teal-300">
                    <span className="h-2 w-2 animate-ping rounded-full bg-teal-300" />
                    Listening & annotating…
                  </div>
                )}
                <div className="relative">
                  <div
                    ref={transcriptRef}
                    className="scrollbar-hide relative h-40 space-y-1 overflow-y-auto pr-1 pt-2"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {currentMeta.transcript
                      .slice(0, visibleLines)
                      .map((line, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${line.speaker === "owner" ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[80%] pb-2 font-mono text-sm ${
                              line.speaker === "owner"
                                ? "text-white/70"
                                : "text-blue-300"
                            }`}
                          >
                            {`${line.speaker === "owner" ? ownerName : "Dr Jesse"}: "${line.text}"`}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </>
            )}

            {/* Typing bubble → simulated textarea */}
            {(phase === "typing" || phase === "thinking") && (
              <>
                <SectionLabel>Chat</SectionLabel>
                {phase === "typing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <textarea
                      readOnly
                      rows={2}
                      value={`${typedText}${typedText.length < vetQuestion.length ? "|" : ""}`}
                      className="w-full max-w-[80%] resize-none rounded-md border border-lime-400/40 bg-black/30 px-3 py-3 font-mono text-sm text-white shadow-inner placeholder:text-white/40 focus:border-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-400/70"
                    />
                  </motion.div>
                )}
              </>
            )}

            {/* Thinking state */}
            {phase === "thinking" && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] rounded-lg bg-lime-400 px-4 py-2 text-sm text-black shadow backdrop-blur-sm">
                    {vetQuestion}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div className="flex items-center gap-2 rounded-lg bg-[#1F1F1F] px-4 py-2 text-sm text-white/60 backdrop-blur-sm">
                    <span className="animate-pulse">Thinking…</span>
                  </div>
                </motion.div>
              </>
            )}

            {/* Final conversation */}
            {phase === "answer" && (
              <>
                <SectionLabel>Chat</SectionLabel>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] rounded-lg bg-lime-400 px-4 py-2 text-sm text-black shadow backdrop-blur-sm">
                    {vetQuestion}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex justify-end"
                >
                  <div className="rounded-lg bg-[#1F1F1F] px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                    {aiAnswer}
                  </div>
                </motion.div>
              </>
            )}

            {/* Replay */}
            {false && (
              <button
                onClick={startSequence}
                className="mx-auto mt-4 text-xs text-white/60 transition-colors hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <RotateCcwIcon className="h-4 w-4" />
                  Replay
                </div>
              </button>
            )}

            {/* Proactive tip */}
            {showTip && (
              <>
                <SectionLabel>AI Tip</SectionLabel>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] rounded-lg bg-[#1F1F1F] px-4 py-2 text-xs text-teal-200 backdrop-blur-sm">
                    {currentDemo.tip}
                  </div>
                </motion.div>
              </>
            )}

            {/* Replay */}
            {phase === "answer" && (
              <button
                onClick={startSequence}
                className="mx-auto mt-4 text-xs text-white/60 transition-colors hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <RotateCcwIcon className="h-4 w-4" />
                  Replay
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
