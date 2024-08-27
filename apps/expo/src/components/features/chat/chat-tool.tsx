import React from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";
import { OpenAI, useChat } from "react-native-gen-ui";
import Animated, { FadeIn } from "react-native-reanimated";
import { z } from "zod";

import type { RouterOutputs } from "~/utils/api";
import Typing from "~/components/ui/loaders/typing";
import Text from "~/components/ui/text";
import { api } from "~/utils/api";
import { initThreadPrompt } from "~/utils/chat/prompt-constants";
import ChatInput from "./chat-input";
import ChatMessage from "./chat-message";
import ChatSubmitButton from "./chat-submit-button";
import ConversationTitle from "./conversation-title";

const openAi = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  model: process.env.EXPO_PUBLIC_OPENAI_MODEL || "gpt-4o",
  // You can even set a custom basePath of your SSE server
});

const getAwarenessTool = {
  description: "Get awareness of the animal",
  // Parameters for the tool
  parameters: z.object({
    animalId: z.string(),
  }),
  // Render component for awareness - can yield loading state
  render: async function* (args) {
    // Fetch the awareness data (dummy data for now)
    const data = {
      awareness: "Low",
      animalId: args.animalId,
    };

    yield {
      component: <Text>Loading...</Text>,
    };

    // Return the final result
    return {
      // The data will be seen by the model
      data,
      // The component will be rendered to the user
      component: (
        <View
          key={args.animalId}
          style={{
            padding: 20,
            borderRadius: 40,
            backgroundColor: "rgba(20, 20, 20, 0.05)",
          }}
        >
          <Text className="text-2xl font-bold text-blue-500">
            🐾 Awareness data: {data.awareness}
          </Text>
        </View>
      ),
    };
  },
};

const getNearestEmergencyVetTool = {
  description: "Get the nearest emergency vet",
  // Parameters for the tool
  parameters: z.object({
    location: z.string(),
  }),
  // Render component for nearest emergency vet - can yield loading state
  render: async function* (args) {
    // Fetch the nearest emergency vet data (dummy data for now)
    const data = {
      vetName: "Emergency Vet Clinic",
      address: "123 Pet Street, Pet City",
      contact: "123-456-7890",
      location: args.location,
    };

    // Yield the loading state
    yield {
      component: <Text>Loading...</Text>,
    };

    // Return the final result
    return {
      // The data will be seen by the model
      data,
      // The component will be rendered to the user
      component: (
        <View
          key={args.location}
          style={{
            padding: 20,
            borderRadius: 40,
            backgroundColor: "rgba(20, 20, 20, 0.05)",
          }}
        >
          <Text className="text-2xl font-bold text-green-500">
            🏥 Nearest Emergency Vet: {data.vetName}
          </Text>
          <Text className="text-lg text-gray-700">Address: {data.address}</Text>
          <Text className="text-lg text-gray-700">Contact: {data.contact}</Text>
        </View>
      ),
    };
  },
};

const useCameraTool = {
  description: "Use the camera to take a photo",
  // No parameters needed for this tool
  parameters: z.object({}),
  // Render component for using the camera - can yield loading state
  render: async function* () {
    // Placeholder for camera functionality
    const takePhoto = async () => {
      // Logic to open the camera and take a photo
      // This is a placeholder and should be replaced with actual camera functionality
      return {
        uri: "https://example.com/photo.jpg",
      };
    };

    // Simulate taking a photo
    const photo = await takePhoto();

    // Yield the loading state
    yield {
      component: <Text>Loading...</Text>,
    };

    // Return the final result
    return {
      // The data will be seen by the model
      data: photo,
      // The component will be rendered to the user
      component: (
        <View className="w-full">
          <View className="w-full rounded-xl border-2 border-gray-100 bg-white p-1 shadow-sm">
            <Pressable
              onPress={() => {
                /* dummy function */
              }}
            >
              <View className="flex w-full flex-row items-center rounded-lg border border-gray-200 px-4 py-4">
                <Image
                  className="h-10 w-10"
                  source={require("../../../../assets/illustrations/album.png")}
                />
                <Text pl="$2" fontFamily="$mono">
                  Pick image from camera roll
                </Text>
              </View>
            </Pressable>
          </View>
          <View className="py-2" />
          <View className="rounded-xl border-2 border-gray-100 bg-white p-1 shadow-sm">
            <Pressable
              onPress={() => {
                /* dummy function */
              }}
            >
              <View className="flex w-full flex-row items-center rounded-lg border border-gray-200 px-4 py-4">
                <Image
                  className="h-10 w-10"
                  source={require("../../../../assets/illustrations/camera.png")}
                />
                <Text pl="$2" fontFamily="$mono">
                  Take a photo
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      ),
    };
  },
};

const ChatTool = ({ animal, profile }) => {
  type Conversation = RouterOutputs["conversation"]["create"];
  type ConversationMessage = RouterOutputs["conversation"]["saveMessage"];

  const [conversationTitle, setConversationTitle] = React.useState<
    string | null
  >(null);
  const [conversationId, setConversationId] = React.useState<string | null>(
    null,
  );
  const {
    mutate: getConversationTitle,
    isPending: isGettingConversationTitle,
  } = api.assistant.getConversationTitle.useMutation({
    onSuccess: (data) => {
      console.log("conversation response", data);
      console.log("conversation title", typeof data);
      if (data && typeof data === "string") {
        console.log("setting conversation title", data);
        setConversationTitle(data);
      }
    },
  });

  const { mutate: createConversation, isPending: isCreatingConversation } =
    api.conversation.create.useMutation({
      onSuccess: (data: Conversation) => {
        setConversationId(data[0]?.id);
      },
    });

  const { mutate: saveMessage, isPending: isSavingMessage } =
    api.conversation.saveMessage.useMutation({
      onSuccess: (data: ConversationMessage) => {
        console.log("message saved", data);
      },
    });

  const {
    input,
    error,
    isLoading,
    isStreaming,
    messages,
    handleSubmit,
    onInputChange,
  } = useChat({
    openAi,
    initialMessages: [
      {
        content: initThreadPrompt(
          animal.species,
          animal.name,
          animal.yearOfBirth,
        ),
        role: "system",
      },
      {
        content: "Hello, how can I help you today?",
        role: "assistant",
      },
    ],
    onError: (error) => {
      console.error("Error while streaming:", error);
    },
    onSuccess: (data) => {
      if (messageCount % 10 === 0 || messageCount === 4) {
        getConversationTitle({
          species: animal.species,
          name: animal.name,
          yearOfBirth: animal.yearOfBirth,
          messages: messages,
        });
      }

      if (messageCount === 2) {
        console.log("creating conversation");
        createConversation({
          animalId: animal.id,
          title: conversationTitle || "Conversation with " + animal.name,
          messages: messages,
        });
      }

      if (messageCount > 2 && conversationId) {
        saveMessage({
          conversationId: conversationId,
          message: {
            content: data[0]?.content,
            role: data[0]?.role,
          },
        });
      }
    },
    tools: {
      getAwareness: getAwarenessTool,
      getNearestEmergencyVet: getNearestEmergencyVetTool,
      useCamera: useCameraTool,
    },
  });

  const isThinking = React.useMemo(
    () => isLoading && !isStreaming,
    [isLoading, isStreaming],
  );

  const messageCount = messages.length;

  return (
    <View className="flex-1">
      <View className="absolute top-0 z-10 w-full">
        <ConversationTitle
          loading={isGettingConversationTitle}
          title={conversationTitle}
        />
      </View>
      {/* List of messages */}
      <FlatList
        data={messages}
        inverted
        contentContainerStyle={{
          flexDirection: "column-reverse",
          paddingHorizontal: 12,
        }}
        renderItem={({ item, index }) => (
          // Individual message component
          <Animated.View entering={FadeIn.duration(500)}>
            <Pressable onPress={() => console.log("Message pressed", item)}>
              <ChatMessage
                message={item}
                isLastMessage={index === messages.length - 1}
                isLoading={isLoading}
                isStreaming={isStreaming}
                error={error}
              />
            </Pressable>
          </Animated.View>
        )}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="w-full"
        keyboardVerticalOffset={150}
      >
        <View
          className="px-2"
          style={{ display: isThinking ? "flex" : "none" }}
        >
          <Typing />
        </View>

        <View className="flex flex-row items-start gap-x-2 p-3">
          {/* Text input field */}
          <View className="grow basis-0">
            <ChatInput input={input} onInputChange={onInputChange} />
          </View>

          {/* Submit button */}
          <View className="shrink-0">
            <ChatSubmitButton
              isLoading={isLoading}
              isStreaming={isStreaming}
              input={input}
              handleSubmit={handleSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatTool;
