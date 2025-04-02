"use client";

import { useEffect, useRef, useState } from "react";
import { Message, useChat } from "ai/react";
import { motion } from "framer-motion";
import { ImageIcon, SendIcon } from "lucide-react";

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
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
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
  const [previewImages, setPreviewImages] = useState<string[]>([]);
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
    .map((message) => ({
      id: message.id,
      content: message.content,
      sender: {
        firstName: message.role === "assistant" ? "AI" : "You",
        lastName: "",
      },
      createdAt: message.createdAt,
      role: message.role,
      attachments: message.attachments || [],
    }));

  useEffect(() => {
    if (files) {
      const imageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewImages(imageUrls);
    } else {
      setPreviewImages([]);
    }
  }, [files]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-1">
        <ChatMessages messages={formattedMessages} />
      </div>
      <div className="mt-auto w-full shrink-0 border-t border-gray-800/30 pt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e, {
              experimental_attachments: files,
            });
            sendUserMessage({
              id: `msg-${Math.random().toString(36).substring(2, 15)}`,
              content: input,
              role: "user",
              attachments: files
                ? Array.from(files).map((file) => URL.createObjectURL(file))
                : [],
            });
            setFiles(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          className="mx-auto w-full"
        >
          {previewImages.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2 rounded-lg bg-gray-800/20 p-2">
              {previewImages.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    className="h-16 w-16 rounded-md object-cover transition-all hover:brightness-110"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex w-full items-center gap-2 rounded-lg bg-gray-800/10 p-1 backdrop-blur-sm">
            <textarea
              value={input}
              onChange={(e) => {
                handleInputChange(e);
              }}
              placeholder="Type your message..."
              className="h-full w-full resize-none bg-transparent px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none"
              disabled={isLoading}
              rows={1}
            />
            <div className="flex items-center gap-1 px-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
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
                <ImageIcon className="h-4 w-4" />
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/80 text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SendIcon className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
