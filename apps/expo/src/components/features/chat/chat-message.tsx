import type {
  ChatCompletionMessageOrReactElement,
  ChatCompletionMessageParam,
} from "react-native-gen-ui";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

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
  const [key, setKey] = React.useState(0);

  const handleLikePress = () => {
    console.log("Like pressed");
    // Implement like functionality
  };

  const handleReplyPress = () => {
    console.log("Reply pressed");
    // Implement reply functionality
  };

  const handleSharePress = () => {
    console.log("Share pressed");
    // Implement share functionality
  };

  return (
    <Animated.View
      key={key}
      className={cn("flex", !isLastMessage && "pb-4")}
      entering={FadeIn.duration(500)}
    >
      <MessageContent message={message} />
      {/* {!React.isValidElement(message) &&
        (message as ChatCompletionMessageParam).role !== "system" && (
          <MessageToolbar
            message={message as ChatCompletionMessageParam}
            onLikePress={handleLikePress}
            onReplyPress={handleReplyPress}
            onSharePress={handleSharePress}
          />
        )} */}
      {isLastMessage && error && (
        <View className="self-start rounded-2xl bg-red-100 px-5 py-4">
          <Text className="text-red-500">{error.message}</Text>
        </View>
      )}
    </Animated.View>
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
    return <View>{message}</View>;
  }

  const m = message as ChatCompletionMessageParam;

  if (m.role === "system") {
    return null;
  }

  if (m.role === "function") {
    return null;
  }

  return (
    <View>
      <View
        style={{ flexShrink: 1 }}
        className={cn(
          "rounded-xl",
          m.role === "user"
            ? "ml-4 self-end bg-slate-900"
            : "mr-4 w-full self-start bg-white",
        )}
      >
        <ChatBubble message={m} />
      </View>
    </View>
  );
};

export default ChatMessage;
