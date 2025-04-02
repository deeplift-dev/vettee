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
  attachments?: string[];
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
      className="mx-auto max-w-2xl rounded-lg bg-gray-800/30 px-3 py-2"
    >
      <div className="flex items-center gap-1.5">
        <InfoIcon className="h-3.5 w-3.5 text-blue-400/80" />
        <span className="text-xs font-medium text-blue-400/80">System</span>
      </div>
      <div className="mt-1.5 text-xs text-gray-400">
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
      className="no-scrollbar flex h-full flex-col space-y-4 overflow-y-auto px-1 py-3"
    >
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center">
          <p className="text-center text-xs text-gray-400/80">
            No messages yet. Start the conversation by typing below.
          </p>
        </div>
      ) : (
        messages.map((message, index) =>
          message.role === "system" ? (
            <SystemMessage key={message.id} message={message} />
          ) : (
            <motion.div
              key={`${message.id}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-2"
            >
              <ProfileAvatar profile={message.sender} />
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-medium text-gray-300">
                    {message.sender.firstName} {message.sender.lastName}
                  </span>
                  <span
                    className="text-[10px] text-gray-500"
                    suppressHydrationWarning
                  >
                    {new Date(message.createdAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-gray-200">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {message.attachments.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Attachment ${i + 1}`}
                        className="h-20 w-20 rounded-md object-cover transition-all hover:brightness-110"
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ),
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
