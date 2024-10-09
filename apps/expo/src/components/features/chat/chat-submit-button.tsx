import React from "react";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

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
      className="flex h-[46px] w-[46px] flex-row items-center justify-center gap-x-2 rounded-full border border-slate-300 bg-gray-50"
      disabled={isLoading || isStreaming}
      onPress={() => {
        handleSubmit(input);
      }}
    >
      {isStreaming ? (
        <LottieView
          source={TypingAnimation}
          resizeMode="cover"
          style={{
            width: 20,
            height: 20,
          }}
          autoPlay
          loop
        />
      ) : (
        <>
          <AntDesign name="arrowup" size={24} color="black" />
        </>
      )}
    </TouchableOpacity>
  );
};

export default ChatSubmitButton;
