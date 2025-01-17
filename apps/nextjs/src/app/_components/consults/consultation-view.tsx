"use client";

import { useEffect, useState } from "react";

import type { RouterOutputs } from "@acme/api";

import SpeechToText from "./speech-to-text";

interface ConsultationViewProps {
  consultation: RouterOutputs["consultation"]["getById"];
}

export default function ConsultationView({
  consultation,
}: ConsultationViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );

  useEffect(() => {
    if (typeof window !== "undefined" && "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript((prev) => prev + finalTranscript);
      };

      setRecognition(recognition);
    }
  }, []);

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
      setIsPaused(false);
    }
  };

  const pauseRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recognition) {
      recognition.start();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      setIsPaused(false);
      // Here you might want to save the transcript
      console.log("Final transcript:", transcript);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SpeechToText />
      </div>
    </div>
  );
}
