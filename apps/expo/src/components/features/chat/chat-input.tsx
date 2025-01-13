import React, { useState } from "react";
import { Platform, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";

import { cn } from "~/utils/chat/cn";

interface ChatInputProps {
  input: string;
  onInputChange: (text: string) => void;
  onZapPress: (isVisible: boolean) => void;
  onCameraPress: (isVisible: boolean) => void;
  cameraOpen: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onInputChange,
  onZapPress,
  onCameraPress,
  cameraOpen,
}) => {
  const [isZapActive, setIsZapActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(cameraOpen);

  const handleTextChange = (text: string) => {
    onInputChange(text);
  };

  const handleCameraPress = () => {
    const newCameraState = !isCameraActive;
    setIsCameraActive(newCameraState);
    onCameraPress(newCameraState);
  };

  const handleZapPress = () => {
    const newZapState = !isZapActive;
    setIsZapActive(newZapState);
    onZapPress(newZapState);
  };

  const handleClosePress = () => {
    setIsZapActive(false);
    setIsCameraActive(false);
    onZapPress(false);
    onCameraPress(false);
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
        {!input && !isZapActive && !isCameraActive && (
          <>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform"
            >
              <TouchableOpacity onPress={handleCameraPress}>
                <AntDesign name="camera" size={24} className="text-slate-900" />
              </TouchableOpacity>
            </Animated.View>
            {/* <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform"
            >
              <TouchableOpacity onPress={handleZapPress}>
                <Zap size={24} className="text-slate-900" />
              </TouchableOpacity>
            </Animated.View> */}
          </>
        )}
        {isZapActive ||
          (isCameraActive && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform"
            >
              <TouchableOpacity onPress={handleClosePress}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            </Animated.View>
          ))}
      </View>
    </View>
  );
};

export default ChatInput;
