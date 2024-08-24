import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Camera, X, Zap } from "lucide-react-native";

import { cn } from "~/utils/chat/cn";

interface ChatInputProps {
  input: string;
  onInputChange: (text: string) => void;
}

const ChatInput = ({ input, onInputChange }: ChatInputProps) => {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const handleTextChange = (text: string) => {
    onInputChange(text);
  };

  const handleZapPress = () => {
    setShowQuickActions(true);
  };

  const handleClosePress = () => {
    setShowQuickActions(false);
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
        />
        {!input && !showQuickActions && (
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
        {showQuickActions && (
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
      {showQuickActions && (
        <ScrollView horizontal className="mt-2">
          <View className="m-2 h-24 w-24 rounded-lg bg-gray-200" />
          <View className="m-2 h-24 w-24 rounded-lg bg-gray-200" />
          <View className="m-2 h-24 w-24 rounded-lg bg-gray-200" />
          <View className="m-2 h-24 w-24 rounded-lg bg-gray-200" />
          <View className="m-2 h-24 w-24 rounded-lg bg-gray-200" />
        </ScrollView>
      )}
    </View>
  );
};

export default ChatInput;
