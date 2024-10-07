import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type {
  ChatCompletionMessageOrReactElement,
  ChatCompletionMessageParam,
} from "react-native-gen-ui";
import ImageViewing from "react-native-image-viewing";
import Animated, { FadeIn } from "react-native-reanimated";

import { Image } from "expo-image";
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
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
      <MessageContent
        message={message}
        onImagePress={(url) => {
          console.log("url", url);
          setImageUrl(url);
          setIsViewerVisible(true);
        }}
      />
      <ImageViewing
        images={imageUrl ? [{ uri: imageUrl }] : []}
        imageIndex={0}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
      />
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
  onImagePress,
}: {
  message: ChatCompletionMessageOrReactElement;
  onImagePress: (url: string) => void;
}) => {
  if (message == null) {
    return null;
  }
  if (message.content[0].type === "image_url" && message.content[0].image_url.url) {
    return (
      <Pressable onPress={() => onImagePress(message.content[0].image_url.url)}>
        <View className="flex w-full h-64 rounded-xl bg-white items-center justify-center">
          <Image
            source={{ uri: message.content[0].image_url.url }}
            style={{ width: "100%", height: "100%", flex: 1, borderRadius: 16 }}
            contentFit="cover"
            transition={1000}
          />
        </View>
      </Pressable>
    );
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
