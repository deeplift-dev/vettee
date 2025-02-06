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
}

export default function ChatTool({
  isLoading = false,
  onFinish,
  initialMessages,
  sendUserMessage,
}: ChatToolProps) {
  const { mutate: updateMessages } =
    api.consultation.updateMessages.useMutation();
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      onFinish(message);
    },
  });

  const formattedMessages = [
    ...(initialMessages ?? []),
    ...(messages ?? []),
  ].map((message) => ({
    id: message.id,
    content: message.content,
    sender: {
      firstName: message.role === "assistant" ? "AI" : "You",
      lastName: "",
    },
    createdAt: new Date(),
  }));

  return (
    <div className="absolute bottom-0 flex h-[70vh] flex-col">
      <ChatMessages messages={formattedMessages} />
      <div className="w-full border-t border-white/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("@input", input);
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
