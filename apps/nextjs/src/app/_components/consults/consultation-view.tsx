"use client";

import { useEffect, useRef, useState } from "react";
import { PencilIcon } from "lucide-react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import SpeechToText from "./speech-to-text";

interface ConsultationViewProps {
  consultation: RouterOutputs["consultation"]["getById"];
}

export default function ConsultationView({
  consultation,
}: ConsultationViewProps) {
  const { mutate: updateTitle } = api.consultation.updateTitle.useMutation();

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-7xl py-6 md:py-8">
        <div className="overflow-hidden rounded-2xl">
          <div className="border-b border-white/20 py-5">
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

          <div className="flex flex-col gap-8 py-4">
            <div>
              <h2 className="mb-4 text-xs font-light uppercase tracking-wide text-gray-100">
                Patient Information
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-100">Name</dt>
                  <dd className="text-gray-100">{consultation.animal?.name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-100">Species</dt>
                  <dd className="text-gray-100">
                    {consultation.animal?.species}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-100">Birth Year</dt>
                  <dd className="text-gray-100">
                    {consultation.animal?.yearOfBirth}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="mb-4 text-xs font-light uppercase tracking-wide text-gray-100">
                Consultation Details
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-100">Date</dt>
                  <dd className="text-gray-100">
                    {new Date(consultation.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-100">Veterinarian ID</dt>
                  <dd className="text-gray-100">
                    {consultation.veterinarianId}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-100">Owner ID</dt>
                  <dd className="text-gray-100">{consultation.ownerId}</dd>
                </div>
              </dl>
            </div>
          </div>

          {consultation.summary && (
            <div className="border-t border-gray-100 px-6 py-5 dark:border-gray-700 sm:p-8">
              <h2 className="mb-3 text-xs font-light uppercase tracking-wide text-gray-100">
                Summary
              </h2>
              <p className="text-sm leading-relaxed text-gray-100">
                {consultation.summary}
              </p>
            </div>
          )}
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
