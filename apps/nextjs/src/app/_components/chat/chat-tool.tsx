"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Message, useChat } from "@ai-sdk/react";
import { Attachment } from "@ai-sdk/ui-utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { ArrowUp, ImageIcon, Loader2, XCircle } from "lucide-react";

import { api } from "~/trpc/react";
import { formatTranscriptions } from "../consults/helpers/format-transcription";
import ChatMessages from "./chat-messages";

interface ChatToolProps {
  isLoading?: boolean;
  onFinish: (message: Message) => void;
  initialMessages: Message[];
  sendUserMessage: (message: Message) => void;
  consultationId: string;
  refreshConsultation?: () => void;
}

export default function ChatTool({
  isLoading = false,
  onFinish,
  initialMessages,
  sendUserMessage,
  consultationId,
  refreshConsultation,
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

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

  const formattedMessages = useMemo(() => {
    return [...(messages ?? [])]
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
  }, [messages]);

  console.log("Formatted messages:", formattedMessages);

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

    // Initialize upload states
    setIsUploading(true);
    setUploadProgress(new Array(filesToUpload.length).fill(0));

    // For UI display we'll continue using the preview URLs temporarily
    const previewUrls = [...previewImages];

    // Upload files to Supabase bucket via our secure API route
    const fileUrls = await Promise.all(
      filesToUpload.map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("consultationId", consultationId);
        formData.append("messageId", messageId);

        try {
          // Create a custom fetch with progress tracking
          const xhr = new XMLHttpRequest();
          const uploadPromise = new Promise<any>((resolve, reject) => {
            xhr.open("POST", "/api/storage", true);

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                setUploadProgress((prev) => {
                  const newProgress = [...prev];
                  newProgress[index] = progress;
                  return newProgress;
                });
              }
            };

            xhr.onload = function () {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
              } else {
                reject(new Error(`HTTP Error: ${xhr.status}`));
              }
            };

            xhr.onerror = () => reject(new Error("Network Error"));
            xhr.send(formData);
          });

          const data = await uploadPromise;
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

    // Reset all upload-related states
    setInput("");
    setFiles(undefined);
    setFilesToUpload([]);
    setPreviewImages([]);
    setAttachments([]);
    setIsUploading(false);
    setUploadProgress([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Refresh consultation data to get updated messages
    if (refreshConsultation) {
      refreshConsultation();
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
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className={`h-16 w-16 rounded-md object-cover transition-all ${
                        isUploading ? "brightness-50" : "hover:brightness-90"
                      }`}
                    />

                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {uploadProgress[index] < 100 ? (
                          <div className="h-10 w-10">
                            <svg className="h-full w-full" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#ddd"
                                strokeWidth="2"
                                strokeDasharray="100, 100"
                              />
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#3dd339"
                                strokeWidth="2"
                                strokeDasharray={`${uploadProgress[index]}, 100`}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                              {uploadProgress[index]}%
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-full bg-lime-400/90 p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-gray-900"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 touch-manipulation items-center justify-center rounded-full bg-gray-900/90 text-gray-300 shadow-sm transition-all hover:bg-gray-800 hover:text-white md:opacity-0 md:group-hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
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
              disabled={isLoading || isUploading}
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
                disabled={isUploading}
              />
              <label
                htmlFor="image-upload"
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700/50 text-gray-300 transition-colors ${
                  isUploading
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-600/70 hover:text-gray-100"
                }`}
              >
                <ImageIcon className="h-4 w-4 text-lime-400" />
              </label>
              <motion.button
                whileHover={{ scale: isUploading ? 1 : 1.05 }}
                whileTap={{ scale: isUploading ? 1 : 0.95 }}
                type="submit"
                disabled={
                  isLoading ||
                  isUploading ||
                  (!input.trim() && previewImages.length === 0)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-black transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
