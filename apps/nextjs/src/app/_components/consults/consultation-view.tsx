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
    <div className="flex flex-col overflow-y-hidden bg-[#0A0A0A] px-4 md:px-8">
      <div className="mx-auto w-full max-w-7xl py-4 md:py-6">
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-row items-center justify-between">
              <EditableTitle
                initialTitle={consultation.title}
                onSave={(newTitle) => {
                  updateTitle({
                    id: consultation.id,
                    title: newTitle,
                  });
                }}
              />
              <SpeechToText
                consultationId={consultation.id}
                animalId={consultation.animalId}
              />
            </div>
            <div className="flex w-full flex-col gap-8 md:flex-row">
              <div className="flex flex-col md:w-1/2">
                <ConsultationDetails consultation={consultation} />
              </div>
              <div className="hidden md:block">
                <div className="h-full w-px bg-white/10"></div>
              </div>
              <div className="flex w-full flex-col md:w-1/2">
                <Transcription consultationId={consultation.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-1/3">
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

interface EditableTitleProps {
  initialTitle: string;
  onSave: (newTitle: string) => void;
}

function EditableTitle({ initialTitle, onSave }: EditableTitleProps) {
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
        className="w-full rounded-md bg-white/5 px-3 py-2 text-xl font-medium text-white focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 sm:text-2xl"
      />
    );
  }

  return (
    <h1
      onClick={() => setIsEditing(true)}
      onMouseEnter={() => setShowEditIcon(true)}
      onMouseLeave={() => setShowEditIcon(false)}
      className="flex cursor-pointer items-center gap-2 text-xl font-medium text-white hover:text-white/90 sm:text-2xl"
    >
      {title}
      <PencilIcon
        className={`h-4 w-4 text-white/50 transition-opacity duration-200 ${
          showEditIcon ? "opacity-100" : "opacity-0"
        }`}
      />
    </h1>
  );
}

const Transcription = ({ consultationId }: { consultationId: string }) => {
  const {
    data: transcriptions,
    isFetching,
    isLoading,
  } = api.recording.getByConsultId.useQuery({
    consultId: consultationId,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading || isFetching) {
    return (
      <div className="w-full bg-transparent py-4 text-center text-sm text-white">
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <div className="text-white/70">Loading transcriptions...</div>
        </div>
      </div>
    );
  }

  if (!transcriptions || transcriptions.transcriptions.length === 0)
    return (
      <div className="flex w-full items-center justify-center py-4">
        <div className="flex flex-col items-center text-center">
          <FileText className="h-8 w-8 text-white/30" />
          <p className="mt-2 text-sm text-white/50">
            No transcriptions available
          </p>
        </div>
      </div>
    );

  const { formattedTranscriptions, transcriptionData } =
    formatTranscriptions(transcriptions);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium text-white">Transcription</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <MessageSquareQuoteIcon className="h-4 w-4" />
          {isExpanded ? "Hide" : "Show"} details
        </button>
      </div>

      {isExpanded && (
        <motion.div
          className="max-h-[400px] overflow-y-auto rounded-md border border-white/10 bg-white/5 p-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="space-y-4">
            {formattedTranscriptions.map((transcription, i) => (
              <motion.div
                key={i}
                className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className="mb-2 text-xs font-medium text-white/50">
                  {new Date(transcription.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                <div className="space-y-2 font-mono text-sm">
                  {transcription.segments.map(
                    (segment: { speaker: string; text: string }, j: number) => (
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
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ConsultationDetails = ({
  consultation,
}: {
  consultation: RouterOutputs["consultation"]["getById"];
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-white">
          Consultation Details
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          {isExpanded ? "Hide" : "Show"} details
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
          <div
            className={`h-2 w-2 rounded-full ${consultation.consentedAt ? "bg-emerald-500" : "bg-red-500"}`}
          ></div>
          {consultation.consentedAt ? "Recording consented" : "Not consented"}
        </div>

        {consultation.animal && (
          <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Cat className="h-3 w-3" />
            {consultation.animal.name}
          </div>
        )}

        {consultation.owner && (
          <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <UserIcon className="h-3 w-3" />
            {consultation.owner.firstName} {consultation.owner.lastName}
          </div>
        )}
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-md border border-white/10 bg-white/5 p-4"
        >
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/70">
                Patient Information
              </h3>
              <dl className="grid grid-cols-2 gap-3 text-sm">
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

            <div className="border-t border-white/10 pt-4">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/70">
                Consultation Information
              </h3>
              <dl className="grid grid-cols-2 gap-3 text-sm">
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
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Consented</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-red-500" />
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
    </div>
  );
};
