"use client";

import { useEffect, useRef, useState } from "react";
import { Message, useChat } from "@ai-sdk/react";
import { Attachment } from "@ai-sdk/ui-utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { ArrowUp, ImageIcon, XCircle } from "lucide-react";

import { api } from "~/trpc/react";
import { formatTranscriptions } from "../consults/helpers/format-transcription";
import ChatMessages from "./chat-messages";

interface ChatToolProps {
  isLoading?: boolean;
  onFinish: (message: Message) => void;
  initialMessages: Message[];
  sendUserMessage: (message: Message) => void;
  consultationId: string;
}

export default function ChatTool({
  isLoading = false,
  onFinish,
  initialMessages,
  sendUserMessage,
  consultationId,
}: ChatToolProps) {
  const { messages, input, handleInputChange, handleSubmit, append, setInput } =
    useChat({
      api: "/api/chat",
      onFinish: (message) => {
        onFinish(message);
      },
      initialMessages: initialMessages,
    });

  const { data: transcription } = api.recording.getByConsultId.useQuery(
    {
      consultId: consultationId,
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  const { mutate: syncTranscription } =
    api.recording.syncTranscription.useMutation({
      onSuccess: () => {
        console.log("Transcription synced successfully");
      },
      onError: (error) => {
        console.error("Error syncing transcription:", error);
      },
    });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasProcessedTranscription, setHasProcessedTranscription] =
    useState(false);

  useEffect(() => {
    if (
      !transcription ||
      transcription.transcriptions.length === 0 ||
      hasProcessedTranscription
    )
      return;

    const {
      concatenatedTranscription,
      synced,
      formattedTranscriptions,
      lastTranscriptionId,
    } = formatTranscriptions(transcription);

    if (!synced) {
      append(
        {
          role: "system",
          content: "Parsing consultation transcription...",
        },
        {
          body: {
            transcription: `Here is the transcription of the consultation so far, do not respond to this message, just use it as context: ${concatenatedTranscription}`,
          },
        },
      );

      syncTranscription({ consultationId, lastTranscriptionId });
      setHasProcessedTranscription(true);
    }
  }, [
    transcription,
    consultationId,
    hasProcessedTranscription,
    append,
    syncTranscription,
  ]);

  const formattedMessages = [...(initialMessages ?? []), ...(messages ?? [])]
    .filter((message) => message.role !== "data")
    .reduce((uniqueMessages, message) => {
      if (!uniqueMessages.some((m) => m.id === message.id)) {
        uniqueMessages.push(message);
      }
      return uniqueMessages;
    }, [])
    .map((message: ExtendedMessage) => ({
      id: message.id,
      content: message.content,
      sender: {
        firstName: message.role === "assistant" ? "Vetski" : "You",
        lastName: "",
      },
      createdAt: message.createdAt || new Date(),
      role: message.role,
      attachments: message.attachments || [],
      toolInvocations: message.toolInvocations,
      revisionId: message.revisionId,
    }));

  useEffect(() => {
    if (files) {
      setFilesToUpload(Array.from(files));
      const imageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewImages(imageUrls);
    } else {
      setPreviewImages([]);
    }
  }, [files]);

  const removeImage = (indexToRemove: number) => {
    const newFiles = filesToUpload.filter(
      (_, index) => index !== indexToRemove,
    );
    setFilesToUpload(newFiles);

    if (newFiles.length === 0) {
      setFiles(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      const dataTransfer = new DataTransfer();
      newFiles.forEach((file) => {
        dataTransfer.items.add(file);
      });
      setFiles(dataTransfer.files);
    }

    const newPreviewImages = previewImages.filter(
      (_, index) => index !== indexToRemove,
    );
    setPreviewImages(newPreviewImages);
  };

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() && filesToUpload.length === 0) return;

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // For UI display we'll continue using the preview URLs temporarily
    const previewUrls = [...previewImages];

    // Upload files to Supabase bucket via our secure API route
    const fileUrls = await Promise.all(
      filesToUpload.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("consultationId", consultationId);
        formData.append("messageId", messageId);

        try {
          const response = await fetch("/api/storage", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error uploading file:", errorData);
            return null;
          }

          const data = await response.json();
          return {
            name: data.name,
            type: data.type,
            size: data.size,
            url: data.url, // This is now a signed URL
            path: data.path, // Store path for future reference
          };
        } catch (error) {
          console.error("Error uploading file:", error);
          return null;
        }
      }),
    );

    // Filter out any failed uploads
    const successfulUploads = fileUrls.filter((url) => url !== null);

    // Create attachments array for AI SDK
    const aiAttachments: Attachment[] = successfulUploads.map((file) => ({
      name: file.name,
      contentType: file.type,
      url: file.url,
    }));

    // Set attachments for future use
    setAttachments(aiAttachments);

    console.log("Attachments for AI SDK:", aiAttachments);

    // Send the message with Supabase signed URLs
    sendUserMessage({
      id: messageId,
      content: input,
      role: "user",
      createdAt: new Date(),
      attachments: successfulUploads.map((file) => file.url),
      filePaths: successfulUploads.map((file) => file.path),
    });

    // Send attachments to OpenAI using the AI SDK format
    await handleSubmit(e, {
      experimental_attachments: aiAttachments,
    });

    setInput("");
    setFiles(undefined);
    setFilesToUpload([]);
    setPreviewImages([]);
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-1">
        <ChatMessages messages={formattedMessages} />
      </div>
      <div className="mt-auto w-full shrink-0 border-t border-gray-800/30 pt-3">
        <form onSubmit={handleChatSubmit} className="mx-auto w-full">
          {previewImages.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2 rounded-lg bg-gray-800/20 p-2">
              {previewImages.map((src, index) => (
                <div key={index} className="group relative">
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    className="h-16 w-16 rounded-md object-cover transition-all hover:brightness-90"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 touch-manipulation items-center justify-center rounded-full bg-gray-900/90 text-gray-300 shadow-sm transition-all hover:bg-gray-800 hover:text-white md:opacity-0 md:group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex w-full items-center gap-2 rounded-lg bg-gray-800/10 p-1 backdrop-blur-sm">
            <textarea
              value={input}
              onChange={(e) => {
                handleInputChange(e);
                e.target.style.height = "auto";
                const newHeight = Math.min(e.target.scrollHeight, 5 * 24);
                e.target.style.height = `${newHeight}px`;
              }}
              placeholder="Type your message..."
              className="h-auto min-h-[40px] w-full resize-none bg-transparent px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none"
              disabled={isLoading}
              autoFocus
              rows={1}
            />
            <div className="flex items-center gap-1 px-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFiles(e.target.files);
                  }
                }}
                multiple
                ref={fileInputRef}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700/50 text-gray-300 transition-colors hover:bg-gray-600/70 hover:text-gray-100"
              >
                <ImageIcon className="h-4 w-4 text-lime-400" />
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={
                  isLoading || (!input.trim() && previewImages.length === 0)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-black transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUp className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
