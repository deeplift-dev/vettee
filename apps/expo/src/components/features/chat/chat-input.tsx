import React from "react";
import { Platform, TextInput } from "react-native";

import { cn } from "~/utils/chat/cn";

interface ChatInputProps {
  input: string;
  onInputChange: (text: string) => void;
}

const ChatInput = ({ input, onInputChange }: ChatInputProps) => {
  return (
    <TextInput
      className={cn(
        Platform.OS === "ios" ? "py-4" : "py-2",
        "min-h-[46px] rounded-3xl border border-gray-300 bg-white px-5",
      )}
      multiline
      value={input}
      inputMode="text"
      verticalAlign="middle"
      textAlignVertical="center"
      onChangeText={onInputChange}
      placeholder="Type a message..."
    />
  );
};

export default ChatInput;
