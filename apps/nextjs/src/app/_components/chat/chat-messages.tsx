"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

import ProfileAvatar from "../ui/profile-avatar";

interface Message {
  id: string;
  content: string;
  sender: {
    firstName: string;
    lastName: string;
    image?: string | null;
  };
  createdAt: Date;
  role: "system" | "user" | "assistant";
}

interface ChatMessagesProps {
  messages: Message[];
}

const SystemMessage = ({ message }: { message: Message }) => {
  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl rounded-lg bg-gray-800/50 p-4"
    >
      <div className="flex items-center gap-2">
        <InfoIcon className="h-4 w-4 text-blue-400" />
        <span className="text-xs font-medium text-blue-400">
          System Message
        </span>
      </div>
      <div className="mt-2 text-sm text-gray-300">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set initial scroll position to bottom when component mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar h-[calc(100vh-154px)] space-y-10 overflow-auto py-4"
    >
      {messages.map((message, index) =>
        message.role === "system" ? (
          <SystemMessage key={message.id} message={message} />
        ) : (
          <motion.div
            key={`${message.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-3"
          >
            <ProfileAvatar profile={message.sender} />
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-200">
                  {message.sender.firstName} {message.sender.lastName}
                </span>
                <span
                  className="text-xs text-gray-400"
                  suppressHydrationWarning
                >
                  {new Date(message.createdAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-100">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ),
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
