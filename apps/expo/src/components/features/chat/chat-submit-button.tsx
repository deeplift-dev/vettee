import React from "react";
import { Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { Send } from "lucide-react-native";
import colors from "tailwindcss/colors";

import TypingAnimation from "../../../../assets/animations/loading/typing.json";

interface ChatSubmitButtonProps {
  isLoading: boolean;
  isStreaming: boolean;
  input: string;
  handleSubmit: (input: string) => void;
}

const ChatSubmitButton = ({
  isLoading,
  isStreaming,
  input,
  handleSubmit,
}: ChatSubmitButtonProps) => {
  return (
    <TouchableOpacity
      className="flex h-[46px] w-28 flex-row items-center justify-center gap-x-2 rounded-full border border-gray-200 bg-gray-50"
      disabled={isLoading}
      onPress={() => {
        handleSubmit(input);
      }}
    >
      {isStreaming ? (
        <LottieView
          source={TypingAnimation}
          resizeMode="cover"
          style={{
            width: 40,
            height: 18,
          }}
          autoPlay
          loop
        />
      ) : (
        <>
          <Send color={colors.sky[500]} size={16} />
          <Text className="text-md text-sky-500">Send</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default ChatSubmitButton;
