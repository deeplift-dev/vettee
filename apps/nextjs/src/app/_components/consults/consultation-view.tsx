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
  MoreHorizontal,
  PencilIcon,
  UserIcon,
  XCircle,
} from "lucide-react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import ChatTool from "../chat/chat-tool";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
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
    <div className="grid h-full grid-rows-[auto_1fr] bg-[#0A0A0A] px-2 sm:px-4 md:px-8">
      {/* Compact header section optimized for mobile */}
      <div className="z-10 mx-auto w-full max-w-7xl py-1">
        <div className="py-1.5 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col items-center sm:flex-row sm:justify-between">
            <div className="flex w-full items-center justify-between gap-1.5 md:justify-start">
              <MiniEditableTitle
                initialTitle={consultation.title}
                onSave={(newTitle) => {
                  updateTitle({
                    id: consultation.id,
                    title: newTitle,
                  });
                }}
              />
            </div>

            <div className="flex w-full items-center justify-start gap-1 md:justify-between">
              <div className="flex space-x-2 sm:items-center sm:gap-2">
                {consultation.animal && (
                  <span className="flex items-center text-xs text-white/70">
                    <Cat className="mr-1 h-3 w-3" />
                    {consultation.animal.name}
                  </span>
                )}
                {consultation.owner && (
                  <span className="flex items-center text-xs text-white/70">
                    <UserIcon className="mr-1 h-3 w-3" />
                    {consultation.owner.firstName}
                  </span>
                )}
              </div>
              <div className="flex flex-row items-center gap-2">
                <InfoButton consultation={consultation} />
                <MiniTranscriptionButton consultationId={consultation.id} />
                <SpeechToText
                  consultationId={consultation.id}
                  animalId={consultation.animalId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat section - optimized for vertical space */}
      <div className="relative overflow-hidden pb-1">
        <div className="mx-auto h-full w-full max-w-7xl">
          <div className="flex h-full rounded-lg border border-white/10 bg-white/5 p-2 shadow-sm backdrop-blur-sm sm:p-4">
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

// New dropdown menu for mobile
function DropdownMenu({
  consultation,
}: {
  consultation: RouterOutputs["consultation"]["getById"];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-xs text-white/70 hover:bg-white/10"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full z-20 mt-1 w-48 rounded-md border border-white/10 bg-[#0A0A0A]/95 py-1 text-xs shadow-lg backdrop-blur-md"
        >
          <div className="px-2 py-1 text-[10px] uppercase text-white/50">
            Patient Info
          </div>

          {consultation.animal && (
            <div className="flex items-center gap-2 px-3 py-1 text-white/80">
              <Cat className="h-3 w-3" />
              <span>{consultation.animal.name}</span>
            </div>
          )}

          {consultation.owner && (
            <div className="flex items-center gap-2 px-3 py-1 text-white/80">
              <UserIcon className="h-3 w-3" />
              <span>
                {consultation.owner.firstName} {consultation.owner.lastName}
              </span>
            </div>
          )}

          <div className="my-1 border-t border-white/10"></div>

          <div className="px-2 py-1 text-[10px] uppercase text-white/50">
            Actions
          </div>

          <button
            onClick={() => {
              // Toggle to transcription view
              setIsOpen(false);
              document
                .getElementById("mobile-transcription-modal")
                ?.classList.remove("hidden");
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-white/80 hover:bg-white/5"
          >
            <MessageSquareQuoteIcon className="h-3 w-3" />
            <span>View Transcriptions</span>
          </button>

          <button
            onClick={() => {
              // Toggle to consultation info
              setIsOpen(false);
              document
                .getElementById("mobile-info-modal")
                ?.classList.remove("hidden");
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-white/80 hover:bg-white/5"
          >
            <FileText className="h-3 w-3" />
            <span>View Consultation Details</span>
          </button>
        </motion.div>
      )}

      {/* Mobile Transcription Modal */}
      <div
        id="mobile-transcription-modal"
        className="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            document
              .getElementById("mobile-transcription-modal")
              ?.classList.add("hidden");
          }
        }}
      >
        <MobileTranscriptionView consultationId={consultation.id} />
      </div>

      {/* Mobile Info Modal */}
      <div
        id="mobile-info-modal"
        className="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            document
              .getElementById("mobile-info-modal")
              ?.classList.add("hidden");
          }
        }}
      >
        <MobileInfoView consultation={consultation} />
      </div>
    </div>
  );
}

// Mobile-optimized transcription view
function MobileTranscriptionView({
  consultationId,
}: {
  consultationId: string;
}) {
  const { data: transcriptions, isLoading } =
    api.recording.getByConsultId.useQuery({
      consultId: consultationId,
    });

  return (
    <div className="absolute inset-x-2 bottom-16 top-16 rounded-lg border border-white/10 bg-[#0A0A0A] p-3 shadow-lg">
      <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-sm font-medium text-white">Transcriptions</h3>
        <button
          onClick={() =>
            document
              .getElementById("mobile-transcription-modal")
              ?.classList.add("hidden")
          }
          className="rounded-full bg-white/5 p-1 text-white/70 hover:bg-white/10"
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-20 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
      ) : !transcriptions || transcriptions.transcriptions.length === 0 ? (
        <div className="flex h-20 items-center justify-center text-sm text-white/50">
          No transcriptions available
        </div>
      ) : (
        <div className="h-full overflow-y-auto pb-6">
          <div className="space-y-3">
            {formatTranscriptions(transcriptions).formattedTranscriptions.map(
              (transcription, i) => (
                <div
                  key={i}
                  className="border-b border-white/10 pb-2 last:border-0 last:pb-0"
                >
                  <div className="mb-1 text-xs font-medium text-white/50">
                    {new Date(transcription.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    {transcription.segments.map(
                      (
                        segment: { speaker: string; text: string },
                        j: number,
                      ) => (
                        <div
                          key={j}
                          className="rounded-md bg-white/5 p-1.5 text-white/90"
                        >
                          <span className="block text-[10px] font-medium text-white/50">
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
        </div>
      )}
    </div>
  );
}

// Mobile-optimized info view
function MobileInfoView({
  consultation,
}: {
  consultation: RouterOutputs["consultation"]["getById"];
}) {
  return (
    <div className="absolute inset-x-2 bottom-16 top-16 rounded-lg border border-white/10 bg-[#0A0A0A] p-3 shadow-lg">
      <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-sm font-medium text-white">Consultation Details</h3>
        <button
          onClick={() =>
            document
              .getElementById("mobile-info-modal")
              ?.classList.add("hidden")
          }
          className="rounded-full bg-white/5 p-1 text-white/70 hover:bg-white/10"
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>

      <div className="h-full overflow-y-auto pb-6">
        <div className="space-y-3">
          <div>
            <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-white/70">
              Patient Information
            </h3>
            <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
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
                <dt className="text-xs text-white/50">Birth Year</dt>
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
            <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
              <div>
                <dt className="text-xs text-white/50">Date</dt>
                <dd className="font-medium text-white">
                  {new Date(consultation.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-white/50">Vet</dt>
                <dd className="font-medium text-white">
                  {consultation.veterinarian?.firstName || "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-white/50">Consent</dt>
                <dd className="font-medium text-white">
                  {consultation.consentedAt ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      <span>Yes</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <XCircle className="h-3 w-3 text-red-500" />
                      <span>No</span>
                    </div>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini editable title - Optimized for mobile
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

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onBlur={handleSubmit}
      onKeyDown={handleKeyDown}
      className="mr-2 w-full rounded-md bg-white/5 px-2 py-0.5 text-base font-medium text-white focus:outline-none sm:text-base"
    />
  ) : (
    <h1
      onClick={() => setIsEditing(true)}
      onMouseEnter={() => setShowEditIcon(true)}
      onMouseLeave={() => setShowEditIcon(false)}
      className="flex cursor-pointer items-center gap-1 space-x-2 truncate text-sm font-medium text-white hover:text-white/90"
    >
      <div className="w-full truncate">{title}</div>
      <PencilIcon
        className={`h-3 w-3 shrink-0 text-white/50 transition-opacity duration-200 ${
          showEditIcon ? "opacity-100" : "opacity-0"
        }`}
      />
    </h1>
  );
}

// Mini transcription button - Keep for desktop
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
      <button className="flex items-center rounded-full bg-white/5 px-1.5 py-0.5 text-xs text-white/70">
        <div className="mr-1 h-2.5 w-2.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        <span>Loading</span>
      </button>
    );
  }

  const count = transcriptions?.transcriptions.length || 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-full bg-white/5 px-1.5 py-0.5 text-xs text-white/70 hover:bg-white/10"
      >
        <MessageSquareQuoteIcon className="mr-1 h-2.5 w-2.5" />
        {count}
      </button>

      {isOpen && transcriptions && transcriptions.transcriptions.length > 0 && (
        <motion.div
          className="absolute right-8 top-8 z-20 max-h-[400px] w-80 overflow-y-auto rounded-md border border-white/10 bg-[#0A0A0A]/95 p-3 shadow-lg backdrop-blur-md"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
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

// Info button - Keep for desktop
function InfoButton({
  consultation,
}: {
  consultation: RouterOutputs["consultation"]["getById"];
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center rounded-full bg-white/5 px-1.5 py-0.5 text-xs text-white/70 hover:bg-white/10">
          <span>Info</span>
          <ChevronDown className="ml-1 h-2.5 w-2.5 transition-transform duration-200" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 rounded-md border border-white/10 bg-[#0A0A0A]/95 p-3 shadow-lg backdrop-blur-md"
        side="bottom"
        align="start"
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">
            Consultation Details
          </h3>
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
      </PopoverContent>
    </Popover>
  );
}
