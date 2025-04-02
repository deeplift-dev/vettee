"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "ai/react";
import { motion } from "framer-motion";
import {
  Cat,
  CheckCircle,
  ChevronDown,
  FileText,
  MessageSquareQuoteIcon,
  PencilIcon,
  UserIcon,
  XCircle,
} from "lucide-react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import ChatTool from "../chat/chat-tool";
import { formatTranscriptions } from "./helpers/format-transcription";
import SpeechToText from "./speech-to-text";

interface ConsultationViewProps {
  consultation: RouterOutputs["consultation"]["getById"];
}

export default function ConsultationView({
  consultation,
}: ConsultationViewProps) {
  const { mutate: updateTitle } = api.consultation.updateTitle.useMutation();
  const { mutate: addMessage } = api.consultation.addMessage.useMutation({
    onSuccess: (data) => {
      console.log("Message added successfully:", data);
    },
    onError: (error) => {
      console.error("Error adding message:", error);
    },
  });

  return (
    <div className="grid h-full grid-rows-[auto_1fr] bg-[#0A0A0A] px-4 md:px-8">
      {/* Ultra-compact header section */}
      <div className="z-10 mx-auto w-full max-w-7xl py-1">
        <div className="rounded-lg border border-white/10 bg-white/5 p-2 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MiniEditableTitle
                initialTitle={consultation.title}
                onSave={(newTitle) => {
                  updateTitle({
                    id: consultation.id,
                    title: newTitle,
                  });
                }}
              />

              <div className="ml-2 flex gap-1">
                <div
                  className={`h-2 w-2 rounded-full ${
                    consultation.consentedAt ? "bg-emerald-500" : "bg-red-500"
                  }`}
                ></div>

                {consultation.animal && (
                  <span className="flex items-center text-xs text-white/70">
                    <Cat className="mr-1 h-3 w-3" />
                    {consultation.animal.name}
                  </span>
                )}

                {consultation.owner && (
                  <span className="ml-2 flex items-center text-xs text-white/70">
                    <UserIcon className="mr-1 h-3 w-3" />
                    {consultation.owner.firstName}
                  </span>
                )}

                <InfoButton consultation={consultation} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MiniTranscriptionButton consultationId={consultation.id} />
              <SpeechToText
                consultationId={consultation.id}
                animalId={consultation.animalId}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chat section - scrollable */}
      <div className="relative overflow-hidden pb-2">
        <div className="mx-auto h-full w-full max-w-7xl">
          <div className="flex h-full rounded-lg border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm">
            <ChatTool
              consultationId={consultation.id}
              sendUserMessage={(message) => {
                addMessage({
                  id: consultation.id,
                  message: message,
                });
              }}
              initialMessages={consultation.messages as Message[]}
              onFinish={(message) => {
                try {
                  addMessage({
                    id: consultation.id,
                    message: message,
                  });
                } catch (error) {
                  console.error("Failed to update messages:", error);
                }
              }}
              isLoading={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// New minimal editable title
function MiniEditableTitle({
  initialTitle,
  onSave,
}: {
  initialTitle: string;
  onSave: (newTitle: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (title.trim() !== initialTitle) {
      onSave(title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setTitle(initialTitle);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        className="w-60 rounded-md bg-white/5 px-2 py-1 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/20"
      />
    );
  }

  return (
    <h1
      onClick={() => setIsEditing(true)}
      onMouseEnter={() => setShowEditIcon(true)}
      onMouseLeave={() => setShowEditIcon(false)}
      className="flex cursor-pointer items-center gap-1 text-sm font-medium text-white hover:text-white/90"
    >
      {title}
      <PencilIcon
        className={`h-3 w-3 text-white/50 transition-opacity duration-200 ${
          showEditIcon ? "opacity-100" : "opacity-0"
        }`}
      />
    </h1>
  );
}

// Mini transcription button
function MiniTranscriptionButton({
  consultationId,
}: {
  consultationId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: transcriptions, isLoading } =
    api.recording.getByConsultId.useQuery({
      consultId: consultationId,
    });

  if (isLoading) {
    return (
      <button className="flex items-center rounded-full bg-white/5 px-2 py-1 text-xs text-white/70">
        <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        <span>Loading</span>
      </button>
    );
  }

  const count = transcriptions?.transcriptions.length || 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-full bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
      >
        <MessageSquareQuoteIcon className="mr-1 h-3 w-3" />
        {count} {count === 1 ? "Transcript" : "Transcripts"}
      </button>

      {isOpen && transcriptions && transcriptions.transcriptions.length > 0 && (
        <motion.div
          className="absolute right-8 top-12 z-20 max-h-[400px] w-96 overflow-y-auto rounded-md border border-white/10 bg-[#0A0A0A]/95 p-3 shadow-lg backdrop-blur-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Transcriptions</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {formatTranscriptions(transcriptions).formattedTranscriptions.map(
              (transcription, i) => (
                <div
                  key={i}
                  className="border-b border-white/10 pb-3 last:border-0 last:pb-0"
                >
                  <div className="mb-1 text-xs font-medium text-white/50">
                    {new Date(transcription.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    {transcription.segments.map(
                      (
                        segment: { speaker: string; text: string },
                        j: number,
                      ) => (
                        <div
                          key={j}
                          className="rounded-md bg-white/5 p-2 text-white/90"
                        >
                          <span className="mb-1 block text-xs font-medium text-white/50">
                            {segment.speaker}
                          </span>
                          {segment.text}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}

// Info button for consultation details
function InfoButton({
  consultation,
}: {
  consultation: RouterOutputs["consultation"]["getById"];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 flex items-center rounded-full bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
      >
        <span>Info</span>
        <ChevronDown
          className={`ml-1 h-3 w-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute left-8 top-12 z-20 w-96 rounded-md border border-white/10 bg-[#0A0A0A]/95 p-3 shadow-lg backdrop-blur-md"
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">
              Consultation Details
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-white/70">
                Patient Information
              </h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-white/50">Name</dt>
                  <dd className="font-medium text-white">
                    {consultation.animal?.name || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-white/50">Species</dt>
                  <dd className="font-medium capitalize text-white">
                    {consultation.animal?.species || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-white/50">Date of Birth</dt>
                  <dd className="font-medium text-white">
                    {consultation.animal?.yearOfBirth || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-white/50">Owner</dt>
                  <dd className="font-medium text-white">
                    {consultation.owner
                      ? `${consultation.owner.firstName} ${consultation.owner.lastName}`
                      : "Not specified"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-white/10 pt-2">
              <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-white/70">
                Consultation Information
              </h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-white/50">Date created</dt>
                  <dd className="font-medium text-white">
                    {new Date(consultation.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-white/50">Veterinarian</dt>
                  <dd className="font-medium text-white">
                    {consultation.veterinarian?.firstName || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-white/50">Recording consent</dt>
                  <dd className="font-medium text-white">
                    {consultation.consentedAt ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Consented</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                        <span>Not consented</span>
                      </div>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
