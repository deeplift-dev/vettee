"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, FileText, Mic, Play, RotateCcw, X } from "lucide-react";

import { RainbowButton } from "../ui/rainbow-button";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  duration?: number;
}

const animalCases = [
  {
    id: "dog",
    name: "Max the Labrador",
    icon: "🐶",
    problem: "Chronic itching and scratching",
    conversation: [
      {
        speaker: "owner",
        text: "Hi doctor, Max won't stop scratching himself.",
      },
      { speaker: "vet", text: "When did the itching start?" },
      { speaker: "owner", text: "About 2 weeks ago, it's getting worse." },
      { speaker: "vet", text: "Is he on any flea prevention?" },
      { speaker: "owner", text: "Yes, monthly tablets." },
    ],
    patientInfo: {
      name: "Max",
      species: "Dog (Labrador)",
      age: "5 years",
      weight: "28 kg",
    },
    vetQuestion:
      "What's the recommended long-term therapy for canine atopic dermatitis in a 28kg Labrador?",
    aiResponse:
      "For a 28kg Labrador with atopic dermatitis:\n\n• Start oclacitinib 0.4-0.6 mg/kg PO BID (11-17mg twice daily)\n• Implement strict flea control protocol\n• Use medicated shampoos (chlorhexidine/miconazole)\n• Consider allergen-specific immunotherapy for long-term management\n\n💡 Tip: Run a serum IgE panel first - if food allergens dominate, an elimination diet can significantly reduce medication dependency.",
  },
  {
    id: "cat",
    name: "Luna the Persian",
    icon: "🐱",
    problem: "Excessive drinking and urination",
    conversation: [
      { speaker: "owner", text: "Luna's been drinking tons of water lately." },
      { speaker: "vet", text: "How long has this been going on?" },
      {
        speaker: "owner",
        text: "About a week, and she's using the litter box more.",
      },
      { speaker: "vet", text: "Any weight changes?" },
      {
        speaker: "owner",
        text: "She seems a bit thinner despite eating normally.",
      },
    ],
    patientInfo: {
      name: "Luna",
      species: "Cat (Persian)",
      age: "8 years",
      weight: "4 kg",
    },
    vetQuestion:
      "What's the initial insulin dosing for a newly diagnosed 4kg diabetic cat?",
    aiResponse:
      "For a 4kg newly diagnosed diabetic cat:\n\n• Start with 0.25 U/kg glargine insulin every 12 hours\n• Round to 1 unit twice daily for this patient\n• Feed consistent low-carb diet before each injection\n• Schedule blood glucose curve in 7-10 days\n\n💡 Tip: Consider starting with insulin pens rather than syringes - many owners find them easier and more accurate for small doses.",
  },
  {
    id: "rabbit",
    name: "Nibbles the Holland Lop",
    icon: "🐰",
    problem: "Not eating pellets, soft stools",
    conversation: [
      { speaker: "owner", text: "Nibbles isn't eating his pellets anymore." },
      { speaker: "vet", text: "Is he eating hay and vegetables?" },
      {
        speaker: "owner",
        text: "He'll eat some hay, but avoids the hard pellets.",
      },
      { speaker: "vet", text: "Any changes in his droppings?" },
      { speaker: "owner", text: "They're softer and smaller than usual." },
    ],
    patientInfo: {
      name: "Nibbles",
      species: "Rabbit (Holland Lop)",
      age: "3 years",
      weight: "1.4 kg",
    },
    vetQuestion:
      "What's a safe anaesthetic protocol for dental work in a 1.4kg rabbit?",
    aiResponse:
      "Safe anaesthetic protocol for 1.4kg rabbit dental procedure:\n\n• Premedication: midazolam 0.5mg/kg + buprenorphine 0.05mg/kg IM\n• Induction: alfaxalone 5mg/kg IV slowly\n• Maintenance: 1.5-2% isoflurane with oxygen\n• Essential: active warming + pulse oximetry\n\n💡 Tip: Place intranasal oxygen cannula before induction - rabbits desaturate rapidly during apnoea periods.",
  },
];

export default function ImprovedDemo() {
  const [selectedCase, setSelectedCase] = useState(animalCases[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileModal, setIsMobileModal] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const steps: DemoStep[] = [
    {
      id: "listening",
      title: "Passive Listening",
      description: "Vetskii listens to your consultation without interruption",
      icon: Mic,
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <div className="h-2 w-2 animate-ping rounded-full bg-red-500" />
            <span className="font-mono text-sm">Recording consultation...</span>
          </div>
          <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg bg-black/20 p-4">
            {selectedCase.conversation.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.8 }}
                className={`text-sm ${
                  line.speaker === "owner" ? "text-blue-300" : "text-green-300"
                }`}
              >
                <strong>
                  {line.speaker === "owner" ? "Owner" : "Dr. Sarah"}:
                </strong>{" "}
                "{line.text}"
              </motion.div>
            ))}
          </div>
        </div>
      ),
      duration: 4000,
    },
    {
      id: "analyzing",
      title: "Smart Analysis",
      description: "Real-time extraction of patient information and context",
      icon: Brain,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-teal-400">
            <div className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
            <span className="font-mono text-sm">Analyzing conversation...</span>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-white/5 p-4">
            {Object.entries(selectedCase.patientInfo).map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  {key}
                </div>
                <div className="text-sm font-medium text-white">{value}</div>
              </motion.div>
            ))}
          </div>
          <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-3">
            <div className="mb-1 text-xs font-semibold text-orange-400">
              Key Symptoms Detected
            </div>
            <div className="text-sm text-white/80">{selectedCase.problem}</div>
          </div>
        </div>
      ),
      duration: 3000,
    },
    {
      id: "assistant",
      title: "Intelligent Assistant",
      description: "Get instant expert recommendations and insights",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border border-lime-400/30 bg-lime-400/10 p-3">
            <div className="mb-2 text-xs font-semibold text-lime-400">
              Vet Question
            </div>
            <div className="text-sm text-white/90">
              {selectedCase.vetQuestion}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-lg border border-white/10 bg-white/5 p-4"
          >
            <div className="mb-2 text-xs font-semibold text-emerald-400">
              Assistant Response
            </div>
            <div className="whitespace-pre-line text-sm leading-relaxed text-white/80">
              {selectedCase.aiResponse}
            </div>
          </motion.div>
        </div>
      ),
      duration: 6000,
    },
  ];

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    if (window.innerWidth < 768) {
      setIsMobileModal(true);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIsMobileModal(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const closeModal = () => {
    setIsMobileModal(false);
    resetDemo();
  };

  const DemoContent = () => (
    <div className="w-full max-w-2xl">
      {/* Animal selector */}
      <div className="relative mb-6 flex h-16 justify-center gap-2 px-4 sm:gap-3">
        {animalCases.map((animal, index) => {
          const isSelected = animal.id === selectedCase.id;
          const selectedIndex = animalCases.findIndex(
            (a) => a.id === selectedCase.id,
          );

          return (
            <motion.button
              key={animal.id}
              onClick={() => {
                setSelectedCase(animal);
                if (isPlaying) {
                  // If demo is playing, restart it with the new animal
                  setCurrentStep(0);
                } else {
                  resetDemo();
                }
              }}
              animate={{
                x: isSelected ? (selectedIndex - index) * -50 : 0, // Move selected to center (reduced from -60 to -50)
                scale: isSelected ? 1.2 : isPlaying ? 0.7 : 1,
                opacity: isSelected ? 1 : isPlaying ? 0.3 : 1,
                zIndex: isSelected ? 10 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl transition-all duration-200 sm:h-12 sm:w-12 sm:text-2xl ${
                isSelected
                  ? "border-2 border-lime-400 bg-gradient-to-br from-lime-400/30 to-emerald-400/30 shadow-lg shadow-lime-400/25"
                  : "border border-white/20 bg-white/5 hover:bg-white/10"
              }`}
            >
              {animal.icon}
            </motion.button>
          );
        })}
      </div>

      {/* Case info - only show when demo is playing */}
      {isPlaying && (
        <div className="mb-6 text-center">
          <h3 className="mb-1 text-xl font-semibold text-white">
            {selectedCase.name}
          </h3>
          <p className="text-white/60">{selectedCase.problem}</p>
        </div>
      )}

      {/* Demo controls */}
      {!isPlaying ? (
        <div className="mb-6 text-center">
          <RainbowButton onClick={startDemo} className="px-8 py-4 text-lg">
            <div className="flex items-center gap-3">
              <Play className="h-5 w-5" />
              Start Demo
            </div>
          </RainbowButton>
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => goToStep(idx)}
                className={`h-2 w-8 cursor-pointer rounded-full transition-all duration-300 hover:bg-lime-300 ${
                  idx <= currentStep ? "bg-lime-400" : "bg-white/20"
                }`}
                title={step.title}
              />
            ))}
          </div>
          <button
            onClick={resetDemo}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      )}

      {/* Demo step content */}
      <AnimatePresence mode="wait">
        {isPlaying && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-300 bg-gradient-to-br from-lime-400 to-emerald-400 px-4">
                {React.createElement(steps[currentStep].icon, {
                  className: "h-5 w-5 text-black",
                })}
              </div>
              <div>
                <h4 className="font-semibold text-white">
                  {steps[currentStep].title}
                </h4>
                <p className="text-sm text-white/60">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>
            {steps[currentStep].content}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual navigation buttons */}
      {isPlaying && (
        <div className="mt-6 flex flex-wrap justify-center gap-2 px-2">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => goToStep(idx)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs transition-all duration-200 sm:gap-2 sm:px-3 sm:text-sm ${
                idx === currentStep
                  ? "bg-lime-400 font-medium text-black"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {React.createElement(step.icon, {
                className: "h-3.5 w-3.5 sm:h-4 sm:w-4",
              })}
              <span className="whitespace-nowrap">{step.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Modal */}
      <AnimatePresence>
        {isMobileModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 z-50 flex flex-col rounded-2xl border border-white/20 bg-[#0A0A0A]"
            >
              {/* Close button */}
              <div className="absolute right-4 top-4 z-10">
                <button
                  onClick={closeModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-4">
                <DemoContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop version */}
      <div className="hidden md:block">
        <DemoContent />
      </div>

      {/* Mobile preview (shows when not in modal) */}
      <div className="md:hidden">
        {!isMobileModal && (
          <div className="text-center">
            <div className="mb-4 text-lg font-semibold text-white">
              Interactive Demo
            </div>
            <p className="mb-6 text-white/60">
              See how Vetskii assists with real veterinary consultations
            </p>
            
            {/* Mobile animal selector */}
            <div className="mb-6 flex justify-center gap-2 relative h-16 px-4">
              {animalCases.map((animal, index) => {
                const isSelected = animal.id === selectedCase.id;
                const selectedIndex = animalCases.findIndex(a => a.id === selectedCase.id);
                
                return (
                  <motion.button
                    key={animal.id}
                    onClick={() => {
                      setSelectedCase(animal);
                      resetDemo();
                    }}
                    animate={{
                      x: isSelected ? (selectedIndex - index) * -40 : 0,
                      scale: isSelected ? 1.2 : 1,
                      opacity: isSelected ? 1 : 0.7,
                      zIndex: isSelected ? 10 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.4,
                    }}
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-lg transition-all duration-200 border ${
                      isSelected
                        ? "border-2 border-lime-400 bg-gradient-to-br from-lime-400/30 to-emerald-400/30 shadow-lg shadow-lime-400/25"
                        : "border border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {animal.icon}
                  </motion.button>
                );
              })}
            </div>
            
            <RainbowButton onClick={startDemo} className="px-6 py-3">
              <div className="flex items-center gap-3">
                <Play className="h-4 w-4" />
                Start Demo
              </div>
            </RainbowButton>
          </div>
        )}
      </div>
    </>
  );
}
