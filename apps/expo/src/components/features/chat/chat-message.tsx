import type {
  ChatCompletionMessageOrReactElement,
  ChatCompletionMessageParam,
} from "react-native-gen-ui";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { cn } from "~/utils/chat/cn";
import ChatBubble from "./chat-bubble";

interface ChatMessageProps {
  message: ChatCompletionMessageOrReactElement;
  isLastMessage: boolean;
  isLoading: boolean;
  isStreaming: boolean;
  error?: Error;
}

const ChatMessage = ({
  message,
  isLastMessage,
  isLoading,
  isStreaming,
  error,
}: ChatMessageProps) => {
  return (
    <View className={cn("flex gap-y-2", !isLastMessage && "pb-4")}>
      <MessageContent message={message} />
      {isLastMessage && error && (
        <View className="self-start rounded-2xl bg-red-100 px-5 py-4">
          <Text className="text-red-500">{error.message}</Text>
        </View>
      )}
    </View>
  );
};

// The chat message component
const MessageContent = ({
  message,
}: {
  message: ChatCompletionMessageOrReactElement;
}) => {
  if (message == null) {
    return null;
  }

  if (React.isValidElement(message)) {
    console.log("made it ehre", message);
    return <View>{message}</View>;
  }

  const m = message as ChatCompletionMessageParam;

  if (m.role === "system") {
    return null;
  }

  if (m.role === "function") {
    return null;
    return (
      <View style={{ opacity: 0.4 }}>
        <Text>Only seen by the model:</Text>
        <Text>{m.content}</Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <ChatBubble message={m} />
    </Animated.View>
  );
};

export default ChatMessage;
