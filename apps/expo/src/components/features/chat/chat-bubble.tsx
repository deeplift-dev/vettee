import type { ChatCompletionMessageParam } from "react-native-gen-ui";
import React from "react";
import { View } from "react-native";
import colors from "tailwindcss/colors";

import { cn } from "~/utils/chat/cn";
import BubbleTail from "./bubble-tail";
import MarkdownDisplay from "./markdown-display";

interface ChatBubbleProps {
  message: ChatCompletionMessageParam;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  return (
    <View
      className={cn(
        "relative rounded-xl px-4",
        message.role === "user"
          ? "ml-14 self-end bg-slate-800"
          : "mr-14 self-start bg-gray-200",
      )}
      style={{ minHeight: 40 }} // Add a minimum height to ensure visibility
    >
      {message.role === "user" ? (
        <View className="absolute -bottom-1 -right-1 -scale-x-100">
          <BubbleTail color={colors.slate[700]} />
        </View>
      ) : (
        <View className="absolute -bottom-1 -left-1">
          <BubbleTail color={colors.gray[200]} />
        </View>
      )}
      <View className="flex-shrink py-3">
        {/* Wrap MarkdownDisplay in a flexible container */}
        <MarkdownDisplay
          textColor={message.role === "user" ? "white" : "black"}
        >
          {typeof message.content === "string" ? message.content : ""}
        </MarkdownDisplay>
      </View>
    </View>
  );
};

export default ChatBubble;
