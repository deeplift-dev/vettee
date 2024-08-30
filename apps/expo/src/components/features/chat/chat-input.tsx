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

import Text from "~/components/ui/text";
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="gap mt-2 flex flex-row"
        >
          <View className="flex h-24 justify-center rounded-lg border border-slate-300 bg-white px-2">
            <Text className="mb-1 text-sm font-bold">Critical Response</Text>
            <Text fontSize={14}>Use for serious concerns about pet health</Text>
          </View>
          <View className="ml-1 flex h-24 justify-center rounded-lg border border-slate-300 bg-white px-2">
            <Text className="mb-1 text-sm font-bold">Add Vet</Text>
            <Text fontSize={14}>Add a real vet to the chat</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ChatInput;
