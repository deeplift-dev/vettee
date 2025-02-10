"use client";

import { Message, useChat } from "ai/react";
import { motion } from "framer-motion";
import { SendIcon } from "lucide-react";

import { api } from "~/trpc/react";
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
  const { data: transcription } = api.recording.getByConsultId.useQuery(
    {
      consultId: consultationId,
    },
    {
      staleTime: Infinity, // Only refetch if data is explicitly invalidated
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch on component mount
      refetchOnReconnect: false, // Don't refetch on reconnect
    },
  );

  // useEffect(() => {
  //   const { concatenatedTranscription } = formatTranscriptions(transcription);
  //   if (concatenatedTranscription) {
  //     console.log("transcriptionData...", concatenatedTranscription);
  //     append(
  //       {
  //         role: "system",
  //         content: "Parsing consultation transcription...",
  //       },
  //       {
  //         body: {
  //           transcription: `Here is the transcription of the consultation so far, do not respond to this message, just use it as context: ${concatenatedTranscription}`,
  //         },
  //       },
  //     );
  //   }
  // }, [transcription]);

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      onFinish(message);
    },
  });

  const formattedMessages = [...(initialMessages ?? []), ...(messages ?? [])]
    .filter((message) => message.role !== "data")
    .map((message) => ({
      id: message.id,
      content: message.content,
      sender: {
        firstName: message.role === "assistant" ? "AI" : "You",
        lastName: "",
      },
      createdAt: new Date(),
    }));

  return (
    <div className="absolute bottom-0 flex h-full w-[95vw] max-w-screen-xl flex-col px-2 pt-[280px] md:w-[90vw] md:pt-[280px]">
      <ChatMessages messages={formattedMessages} />
      <div className="w-full border-t border-white/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
            sendUserMessage({
              id: `msg-${Math.random().toString(36).substring(2, 15)}`,
              content: input,
              role: "user",
            });
          }}
          className="mx-auto h-full"
        >
          <div className="flex h-full w-full items-center gap-4 bg-black">
            <textarea
              value={input}
              onChange={(e) => {
                handleInputChange(e);
              }}
              placeholder="Type your message..."
              className="h-full w-full resize-none rounded-lg bg-transparent px-4 py-2 text-gray-100 placeholder-gray-200 focus:outline-none focus:ring-0"
              disabled={isLoading}
              rows={4}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendIcon className="h-5 w-5" />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
