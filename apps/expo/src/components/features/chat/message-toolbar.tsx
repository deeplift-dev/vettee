import type { ChatCompletionMessageParam } from "react-native-gen-ui";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Heart, RefreshCwIcon, Share2 } from "lucide-react-native";
import colors from "tailwindcss/colors";

interface MessageToolbarProps {
  message: ChatCompletionMessageParam;
  onLikePress: () => void;
  onReplyPress: () => void;
  onSharePress: () => void;
}

const MessageToolbar: React.FC<MessageToolbarProps> = ({
  message,
  onLikePress,
  onReplyPress,
  onSharePress,
}) => {
  const isUser = message.role === "user";

  return (
    <View
      className={`flex-row py-2 ${
        isUser ? "justify-end" : "justify-start"
      } gap-2`}
    >
      <TouchableOpacity onPress={onLikePress}>
        <Heart size={16} color={colors.gray[500]} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onReplyPress}>
        <RefreshCwIcon size={16} color={colors.gray[500]} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onSharePress}>
        <Share2 size={16} color={colors.gray[500]} />
      </TouchableOpacity>
    </View>
  );
};

export default MessageToolbar;
