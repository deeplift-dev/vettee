"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
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
}

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <div className="no-scrollbar h-[calc(100vh-154px)] space-y-10 overflow-auto py-4">
      {messages.map((message) => (
        <motion.div
          key={message.id}
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
              <span className="text-xs text-gray-400" suppressHydrationWarning>
                {new Date(message.createdAt).toLocaleTimeString(undefined, {
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
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
