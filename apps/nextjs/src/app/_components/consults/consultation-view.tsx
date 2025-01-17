"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff, Pause, Play, StopCircle } from "lucide-react";

import type { RouterOutputs } from "@acme/api";

import { Button } from "../ui/button";

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
        {/* Info Panel */}
        <div className="rounded-lg border border-white/20 bg-black/95 p-6">
          <h1 className="text-2xl font-semibold text-white">
            {consultation.title}
          </h1>

          <div className="mt-4 flex flex-col gap-2">
            <div className="text-sm text-white/70">
              Created: {new Date(consultation.createdAt).toLocaleString()}
            </div>

            {consultation.animal && (
              <div className="rounded-md border border-white/10 bg-white/5 p-3">
                <h2 className="font-medium text-white">Patient</h2>
                <div className="mt-1 text-sm text-white/70">
                  {consultation.animal.name} • {consultation.animal.species}
                  {consultation.animal.yearOfBirth &&
                    ` • Born ${consultation.animal.yearOfBirth}`}
                </div>
              </div>
            )}

            {consultation.owner && (
              <div className="rounded-md border border-white/10 bg-white/5 p-3">
                <h2 className="font-medium text-white">Owner</h2>
                <div className="mt-1 text-sm text-white/70">
                  {consultation.owner.firstName} {consultation.owner.lastName}
                  {consultation.owner.email && (
                    <div>{consultation.owner.email}</div>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-md border border-white/10 bg-white/5 p-3">
              <h2 className="font-medium text-white">Recording Consent</h2>
              <div className="mt-1 text-sm text-white/70">
                {consultation.consentedAt
                  ? `Consented at ${new Date(
                      consultation.consentedAt,
                    ).toLocaleString()}`
                  : "No consent provided"}
              </div>
            </div>
          </div>
        </div>

        {/* Recording Panel */}
        <div className="lg:col-span-2">
          <div className="flex h-full flex-col rounded-lg border border-white/20 bg-black/95 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Consultation Notes
              </h2>
              <div className="flex gap-2">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="bg-white/10 hover:bg-white/20"
                    disabled={!consultation.consentedAt}
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                ) : (
                  <>
                    {isPaused ? (
                      <Button
                        onClick={resumeRecording}
                        className="bg-white/10 hover:bg-white/20"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Resume
                      </Button>
                    ) : (
                      <Button
                        onClick={pauseRecording}
                        className="bg-white/10 hover:bg-white/20"
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={stopRecording} variant="destructive">
                      <StopCircle className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 flex-1">
              {!consultation.consentedAt && (
                <div className="flex h-full items-center justify-center rounded-md border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-white/70">
                    <MicOff className="h-5 w-5" />
                    Recording requires consent
                  </div>
                </div>
              )}
              {consultation.consentedAt && (
                <div className="h-full rounded-md border border-white/10 bg-white/5 p-4">
                  <div className="h-full overflow-y-auto whitespace-pre-wrap text-white">
                    {transcript || "Transcript will appear here..."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
