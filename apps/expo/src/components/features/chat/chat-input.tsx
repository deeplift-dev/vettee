import React, { useState } from "react";
import { Platform, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Camera, X, Zap } from "lucide-react-native";

import { cn } from "~/utils/chat/cn";

interface ChatInputProps {
  input: string;
  onInputChange: (text: string) => void;
  onZapPress: (isVisible: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onInputChange,
  onZapPress,
}) => {
  const [isZapActive, setIsZapActive] = useState(false);

  const handleTextChange = (text: string) => {
    onInputChange(text);
  };

  const handleZapPress = () => {
    const newZapState = !isZapActive;
    setIsZapActive(newZapState);
    onZapPress(newZapState);
  };

  const handleClosePress = () => {
    setIsZapActive(false);
    onZapPress(false); // Add this line to hide the bottom view
  };

  return (
    <View className="relative">
      <View className="relative">
        <TextInput
          className={cn(
            Platform.OS === "ios" ? "py-4" : "py-2",
            `max-h-[100px] min-h-[46px] rounded-3xl border border-slate-300 bg-white px-5 ${
              input ? "" : "pr-24"
            }`,
          )}
          multiline
          value={input}
          inputMode="text"
          verticalAlign="middle"
          textAlignVertical="center"
          onChangeText={handleTextChange}
          placeholder="Message"
          autoFocus={true}
        />
        {!input && !isZapActive && (
          <>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="absolute right-14 top-1/2 -translate-y-1/2 transform"
            >
              <TouchableOpacity>
                <Camera size={24} className="text-slate-900" />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform"
            >
              <TouchableOpacity onPress={handleZapPress}>
                <Zap size={24} className="text-slate-900" />
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
        {isZapActive && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform"
          >
            <TouchableOpacity onPress={handleClosePress}>
              <X size={24} className="text-slate-900" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default ChatInput;
