"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "ai/react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  MessageSquareQuoteIcon,
  PencilIcon,
  TriangleIcon,
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

type Animal = RouterOutputs["animal"]["getById"];
type Owner = RouterOutputs["profile"]["byId"];

export default function ConsultationView({
  consultation,
}: ConsultationViewProps) {
  const { mutate: updateTitle } = api.consultation.updateTitle.useMutation();
  const { mutate: addMessage } = api.consultation.addMessage.useMutation({
    onSuccess: () => {
      console.log("^^updateMessages success");
    },
    onError: (error) => {
      console.error("^^updateMessages error", error);
    },
  });
  return (
    <div className="flex h-full min-h-screen w-full flex-col overflow-hidden px-2 md:px-0">
      <div className="z-10 mx-auto h-full w-full max-w-7xl bg-black md:py-8">
        <div className="overflow-hidden">
          <div className="border-b border-white/20 pb-4">
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
          </div>
          <div className="flex w-full flex-col justify-between border-b border-white/20 md:flex-row md:gap-6">
            <div className="flex flex-col md:w-1/2">
              <ConsultationDetails consultation={consultation} />
            </div>
            <div className="mx-auto flex w-1 flex-row justify-center">
              <div className="h-full w-1 border-l border-white/20"></div>
            </div>
            <div className="flex w-full flex-col md:w-1/2">
              <Transcription consultationId={consultation.id} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full"></div>
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
        className="w-full bg-transparent text-xl font-light text-gray-100 focus:outline-none sm:text-2xl"
      />
    );
  }

  return (
    <h1
      onClick={() => setIsEditing(true)}
      onMouseEnter={() => setShowEditIcon(true)}
      onMouseLeave={() => setShowEditIcon(false)}
      className="flex cursor-pointer items-center gap-2 text-xl font-light text-gray-100 hover:text-gray-300 sm:text-2xl"
    >
      {title}
      <PencilIcon
        className={`h-4 w-4 transition-opacity duration-200 ${
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
      <div className="w-full bg-transparent py-3 text-center text-sm text-white">
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
          <div>Loading transcriptions...</div>
        </div>
      </div>
    );
  }

  if (!transcriptions || transcriptions.transcriptions.length === 0)
    return null;

  const { formattedTranscriptions, transcriptionData } =
    formatTranscriptions(transcriptions);

  return (
    <motion.div
      className={`flex ${isExpanded ? "h-[500px] pb-4" : ""} flex-col gap-2 overflow-y-auto pr-2 text-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-center gap-2 bg-transparent py-3 text-center text-sm text-white"
      >
        <MessageSquareQuoteIcon className="h-4 w-4" />
        {isExpanded ? "Hide" : "Show"} transcription
      </button>

      {isExpanded &&
        formattedTranscriptions.map((transcription, i) => (
          <motion.div
            key={i}
            className="flex flex-col gap-1 font-mono text-gray-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <div className="text-xs text-gray-500">
              {new Date(transcription.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
            {transcription.segments.map(
              (segment: { speaker: string; text: string }, j: number) => (
                <motion.div
                  key={j}
                  className="text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.1 + j * 0.05 }}
                >
                  [{segment.speaker}] {segment.text}
                </motion.div>
              ),
            )}
          </motion.div>
        ))}
    </motion.div>
  );
};

const ConsultationDetails = ({
  consultation,
}: {
  consultation: RouterOutputs["consultation"]["getById"];
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/20">
        {consultation.consentedAt ? (
          <div className="flex w-40 items-center justify-center gap-1 border-r border-white/20">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        ) : (
          <div className="flex w-40 items-center justify-center gap-1 border-r border-white/20">
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
        <AddAnimalButton animal={consultation.animal} />
        <AddOwnerButton owner={consultation.owner} />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full flex-row items-center justify-center gap-2 py-3 text-white hover:text-gray-300"
        >
          <div
            className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
          >
            <TriangleIcon className="h-2 w-2" />
          </div>
          <span className="text-center text-sm">See more</span>
        </button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="pb-4"
        >
          <div className="bg-black">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-100">
              Patient Information
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-100">Name</dt>
                <dd className="text-gray-100">{consultation.animal?.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-100">Species</dt>
                <dd className="capitalize text-gray-100">
                  {consultation.animal?.species}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-100">Date of Birth</dt>
                <dd className="text-gray-100">
                  {consultation.animal?.yearOfBirth}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-100">Owner</dt>
                <dd className="text-gray-100">
                  {consultation.owner?.firstName} {consultation.owner?.lastName}
                </dd>
              </div>
            </dl>
          </div>
          <div className="my-4 border-b border-white/20"></div>
          <div>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-100">
              Consultation Information
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-100">Date created</dt>
                <dd className="text-gray-100">
                  {new Date(consultation.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-100">Veterinarian</dt>
                <dd className="text-gray-100">
                  {consultation.veterinarian?.firstName}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-100">Consented to recording</dt>
                <dd className="text-gray-100">
                  {consultation.consentedAt ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
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
        </motion.div>
      )}
    </div>
  );
};

const AddAnimalButton = ({ animal }: { animal: Animal }) => {
  if (!animal) {
    return (
      <button className="w-full border-l border-r border-white/20 bg-transparent py-3 text-center text-sm text-white">
        Add Animal
      </button>
    );
  }

  return (
    <button className="w-full border-l border-r border-white/20 bg-transparent py-3 text-center text-sm text-white">
      {animal.name}
    </button>
  );
};

const AddOwnerButton = ({ owner }: { owner: Owner }) => {
  if (!owner) {
    return (
      <button className="w-full border-r border-white/20 bg-transparent py-3 text-center text-sm text-white">
        Add Owner
      </button>
    );
  }

  return (
    <button className="w-full border-r border-white/20 bg-transparent py-3 text-center text-sm text-white">
      {owner?.firstName} {owner?.lastName}
    </button>
  );
};
