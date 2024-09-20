import React, { useRef, useState } from "react";
import { Keyboard, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import ChatHeader from "~/components/features/chat/chat-header";
import ChatMenu from "~/components/features/chat/chat-menu";
import ChatTool from "~/components/features/chat/chat-tool";
import { api } from "~/utils/api";

const ChatPage = () => {
  const { animalId, conversationId } = useLocalSearchParams<{
    animalId: string;
    conversationId: string;
    assistantId: string;
  }>();

  console.log("conversationId", conversationId);

  const chatMenuRef = useRef<ChatMenu>(null);

  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const { data: animal, isLoading } = api.animal.getById.useQuery({
    id: animalId,
  });

  const { data: profile, isLoading: isProfileLoading } =
    api.profile.getCurrentUserProfile.useQuery();

  const { data: conversation, isLoading: isConversationLoading } =
    api.conversation.getById.useQuery(
      {
        id: conversationId,
      },
      {
        enabled: !!conversationId,
      },
    );

  if (isLoading || isProfileLoading || isConversationLoading) {
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
        onPressTalkingAbout={() => {
          Keyboard.dismiss();
          chatMenuRef.current?.open();
        }}
      />
      {animal && profile && (
        <ChatTool
          animal={animal}
          profile={profile}
          conversation={conversation}
          queryConversationId={conversationId}
          selectedPrompt={selectedPrompt}
        />
      )}
      <ChatMenu ref={chatMenuRef} animalId={animalId} />
    </View>
  );
};

export default ChatPage;
