import type { ChatCompletionMessageParam } from "react-native-gen-ui";
import React from "react";
import { View } from "react-native";
import colors from "tailwindcss/colors";

import BubbleTail from "./bubble-tail";
import MarkdownDisplay from "./markdown-display";

interface ChatBubbleProps {
  message: ChatCompletionMessageParam;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  return (
    <View>
      {message.role === "user" ? (
        <View className="absolute -bottom-1 -right-1 -scale-x-100">
          <BubbleTail color={colors.slate[700]} />
        </View>
      ) : (
        <View className="absolute -bottom-1 -left-1">
          <BubbleTail color={colors.gray[200]} />
        </View>
      )}
      <MarkdownDisplay textColor={message.role === "user" ? "white" : "black"}>
        {typeof message.content === "string" ? message.content : ""}
      </MarkdownDisplay>
    </View>
  );
};

export default ChatBubble;
