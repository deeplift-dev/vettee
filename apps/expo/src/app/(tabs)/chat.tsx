import React, { useRef } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import ChatHeader from "~/components/features/chat/chat-header";
import ChatMenu from "~/components/features/chat/chat-menu";
import ChatTool from "~/components/features/chat/chat-tool";
import { api } from "~/utils/api";

const ChatPage = () => {
  const { animalId } = useLocalSearchParams<{
    animalId: string;
    threadId: string;
    assistantId: string;
  }>();

  const chatMenuRef = useRef<ChatMenu>(null);

  const { data: animal, isLoading } = api.animal.getById.useQuery({
    id: animalId,
  });

  const openAi = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    model: "gpt-4",
    // You can even set a custom basePath of your SSE server
  });

  const { data: profile, isLoading: isProfileLoading } =
    api.profile.getCurrentUserProfile.useQuery();

  if (isLoading || isProfileLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <View className="h-20 w-20 rounded-full bg-gray-200" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ChatHeader
        animal={animal}
        profile={profile}
        onPressTalkingAbout={() => chatMenuRef.current?.open()}
      />
      {animal && profile && <ChatTool animal={animal} profile={profile} />}
      <ChatMenu ref={chatMenuRef} />
    </View>
  );
};

export default ChatPage;
