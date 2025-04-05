"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { InfoIcon, Pill } from "lucide-react";
import ReactMarkdown from "react-markdown";

import LogoText from "~/ui/logo-text";
import ProfileAvatar from "../ui/profile-avatar";
import { MedicationInfoCard } from "./vet-tools/medication-info-card";

interface ToolInvocation {
  id: string;
  tool: string;
  toolInput: Record<string, any>;
  toolOutput?: any;
}

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
  revisionId?: string;
  toolResults?: {
    tool: string;
    result: any;
  }[];
  toolInvocations?: ToolInvocation[];
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

const MedicationToolResult = ({ result }: { result: any }) => {
  return <MedicationInfoCard medicationData={result} />;
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

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  console.log("Messages:", messages);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar flex h-full flex-col space-y-12 overflow-y-auto px-1 py-3"
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
              {message.role === "user" && (
                <ProfileAvatar profile={message.sender} />
              )}
              <div className="flex flex-1 flex-col">
                <div className="flex items-center space-x-1.5">
                  {message.role === "assistant" && (
                    <h1 className="bg-gradient-to-bl from-white via-slate-100 to-white bg-clip-text font-vetski text-xs leading-normal text-transparent">
                      Vetski
                    </h1>
                  )}
                  {message.role === "user" && (
                    <span className="text-xs font-medium text-gray-300">
                      {message.sender.firstName} {message.sender.lastName}
                    </span>
                  )}
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

                <div className="mt-0.5 text-sm text-gray-200">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>

                {message.toolInvocations &&
                  message.toolInvocations.length > 0 &&
                  message.toolInvocations.map((invocation, i) => (
                    <div key={invocation.id || i} className="mt-2">
                      {invocation.toolName === "displayMedicationInfo" &&
                        invocation.result && (
                          <MedicationToolResult result={invocation.result} />
                        )}
                      {invocation.tool === "calculate_medication_dose" &&
                        invocation.toolOutput && (
                          <div className="rounded-md bg-blue-900/20 p-3">
                            <div className="mb-2 text-lg font-bold text-blue-300">
                              Result: {invocation.toolOutput.result}{" "}
                              {invocation.toolOutput.unit}
                            </div>
                            <div className="mb-2 font-mono text-sm text-white">
                              {invocation.toolOutput.formula}
                            </div>
                            {invocation.toolOutput.explanation && (
                              <div className="text-xs text-gray-300">
                                {invocation.toolOutput.explanation
                                  .split("\n")
                                  .map((line: string, j: number) => (
                                    <p key={j} className="mb-1">
                                      {line}
                                    </p>
                                  ))}
                              </div>
                            )}
                            {invocation.toolOutput.warnings &&
                              invocation.toolOutput.warnings.length > 0 && (
                                <div className="mt-2 rounded bg-red-900/20 p-1.5 text-xs text-red-300">
                                  <span className="font-bold">
                                    ⚠️ Warning:{" "}
                                  </span>
                                  {invocation.toolOutput.warnings[0]}
                                </div>
                              )}
                          </div>
                        )}
                      {invocation.tool === "get_reference_values" &&
                        invocation.toolOutput && (
                          <div className="mt-2 rounded-md bg-gray-800/30 p-3">
                            <h4 className="mb-2 text-sm font-medium text-white">
                              Reference Values
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(invocation.toolOutput).map(
                                ([key, value]) =>
                                  key !== "note" ? (
                                    <div
                                      key={key}
                                      className="rounded-md bg-gray-800/50 p-2"
                                    >
                                      <span className="block font-medium text-gray-300">
                                        {key === "heartRate"
                                          ? "Heart Rate"
                                          : key === "respiratoryRate"
                                            ? "Respiratory Rate"
                                            : key === "crt"
                                              ? "CRT"
                                              : key.charAt(0).toUpperCase() +
                                                key.slice(1)}
                                      </span>
                                      <span className="text-white">
                                        {String(value)}
                                      </span>
                                    </div>
                                  ) : null,
                              )}
                            </div>
                            {invocation.toolOutput.note && (
                              <div className="mt-2 text-xs text-gray-300">
                                {invocation.toolOutput.note}
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  ))}

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
