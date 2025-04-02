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
  const [hasProcessedTranscription, setHasProcessedTranscription] = useState(false);

  useEffect(() => {
    if (!transcription || transcription.transcriptions.length === 0 || hasProcessedTranscription) return;
    
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
  }, [transcription, consultationId, hasProcessedTranscription, append, syncTranscription]);

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
      <div className="flex-grow overflow-y-auto pb-4">
        <ChatMessages messages={formattedMessages} />
      </div>
      <div className="w-full border-t border-white/20 pt-4">
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
          <div className="mt-2 flex gap-2">
            {previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index}`}
                className="h-16 w-16 rounded object-cover"
              />
            ))}
          </div>
          <div className="flex w-full items-center gap-4 rounded-lg bg-gray-800 p-4 shadow-lg">
            <textarea
              value={input}
              onChange={(e) => {
                handleInputChange(e);
              }}
              placeholder="Type your message..."
              className="h-full w-full resize-none rounded-lg bg-gray-900 px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
              rows={4}
            />
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
            <label htmlFor="image-upload" className="cursor-pointer">
              <ImageIcon className="h-5 w-5 text-white" />
            </label>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendIcon className="h-5 w-5" />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
