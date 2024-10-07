import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, View } from "react-native";
import { OpenAI, useChat } from "react-native-gen-ui";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Image } from "expo-image";
import { z } from "zod";
import Typing from "~/components/ui/loaders/typing";
import Text from "~/components/ui/text";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { initThreadPrompt } from "~/utils/chat/prompt-constants";
import ImagePicker from "../onboarding/image-picker";
import ChatInput from "./chat-input";
import ChatMessage from "./chat-message";
import ChatSubmitButton from "./chat-submit-button";
import ConversationTitle from "./conversation-title";
import { PromptSuggestions } from "./prompt-suggestions";
import { useCameraTool } from "./tools/camera-tool";
type Conversation = RouterOutputs["conversation"]["create"];
type ConversationMessage = RouterOutputs["conversation"]["saveMessage"];
interface ChatToolProps {
  animal: {
    id: string;
    name: string;
    species: string;
  };
  conversation: Conversation;
  queryConversationId: string | null;
  selectedPrompt: string | null;
  onPromptUsed: () => void;
}

const openAi = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  model: "gpt-4o",
  // You can even set a custom basePath of your SSE server
});

const ChatTool: React.FC<ChatToolProps> = ({
  animal,
  conversation,
  queryConversationId,
}) => {
  const [conversationTitle, setConversationTitle] = React.useState<
    string | null
  >(null);

  const [conversationId, setConversationId] = React.useState<string | null>(
    null,
  );

  const [initConversationId, setInitConversationId] = React.useState<
    string | null
  >(null);

  const [showPromptSuggestions, setShowPromptSuggestions] = useState(true);

  const { mutate: updateConversationTitle } =
    api.conversation.updateConversationTitle.useMutation({
      onSuccess: (data) => {},
    });

  const {
    mutate: getConversationTitle,
    isPending: isGettingConversationTitle,
  } = api.assistant.getConversationTitle.useMutation({
    onSuccess: (data) => {
      if (data && typeof data === "string" && conversationId) {
        setConversationTitle(data);
        updateConversationTitle({
          title: data,
          id: conversationId,
        });
      }
    },
    onError: (err) => {
      console.log("error", err);
    },
  });

  const { mutate: synthesizeConversation } =
    api.assistant.synthesizeConversation.useMutation({
      onSuccess: (data) => {
        // You can add additional logic here, such as updating the UI to reflect the synthesized data
      },
      onError: (error) => {
        console.error("Error synthesizing conversation:", error);
      },
    });

  useEffect(() => {
    if (!conversationId) {
      setInitConversationId(nanoid());
    }
  }, []);

  useEffect(() => {
    if (queryConversationId) {
      setConversationId(queryConversationId);
      setInitConversationId(queryConversationId);
    }
  }, [queryConversationId]);

  const onHandleSubmit = async (msg: string | { type: string; text?: string; image_url?: { url: string } }[]) => {
    if (messageCount === 1) {
      setShowPromptSuggestions(false);
      createConversation({
        id: initConversationId,
        animalId: animal.id,
        title: conversationTitle || "Conversation with " + animal.name,
        messages: [
          {
            content: msg,
            role: "user",
            created_at: new Date().toISOString(),
            id: nanoid(),
          },
        ],
      });
    } else {
      saveMessage({
        conversationId: initConversationId!,
        message: {
          content: msg,
          role: "user",
        },
      });
    }
    handleSubmit(msg);
  };

  const { mutate: createConversation, isPending: isCreatingConversation } =
    api.conversation.create.useMutation({
      onSuccess: (data: Conversation) => {
        setConversationId(data[0].id);
      },
    });

  const { mutate: saveMessage, isPending: isSavingMessage } =
    api.conversation.saveMessage.useMutation({
      onSuccess: (data: ConversationMessage) => {},
    });

  const { cameraToolObject, isLoading: isCameraToolLoading } = useCameraTool();

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
    tools: {
      imageRenderer: {
        description: "Render an image in the chat",
        parameters: z.object({
          image: z.string(),
        }),
        render: async function* (args) {
          yield <ActivityIndicator size="small" color="#0000ff" />;
          console.log("args", args);

          return {
            component: (
              <Image
                source={{ uri: args.image }}
                style={{ width: 200, height: 200 }}
              />
            ),
            data: {
              instruction: "Display the provided image.",
              imageUrl: args.image,
            },
          };
        },
      },
    },
    initialMessages: conversation?.messages?.length
      ? conversation?.messages.map((msg) => ({
          content: msg.content || "",
          role: msg.role || "user",
          id: msg.id || undefined,
        }))
      : [
          {
            content: initThreadPrompt(
              animal.species,
              animal.name,
              animal.yearOfBirth,
            ),
            role: "system",
          },
        ],
    onError: (error) => {
      console.error("Error while streaming:", error);
    },
    onSuccess: (data) => {
      const updatedMessages = [...messages];
      if (data[0]) {
        updatedMessages.push(data[0]);
      }
      if (messageCount % 10 === 0 || messageCount === 1) {
        getConversationTitle({
          species: animal.species,
          name: animal.name,
          yearOfBirth: animal.yearOfBirth,
          messages: updatedMessages,
        });
      }

      if (messageCount > 0 && initConversationId) {
        const lastMessage = data[0];
        if (React.isValidElement(lastMessage)) {
          saveMessage({
            conversationId: initConversationId,
            message: {
              content: data[1]?.content || "",
              role: data[1]?.role || "assistant",
            },
          });
        } else {
          saveMessage({
            conversationId: initConversationId,
            message: {
              content: lastMessage?.content || "",
              role: lastMessage?.role || "assistant",
            },
          });
        }
      }

      if (messageCount > 1) {
        const filteredMessages = updatedMessages.filter(
          (msg) => typeof msg === "object" && "content" in msg && "role" in msg,
        );
        synthesizeConversation({
          animalId: animal.id,
          messages: filteredMessages,
        });
      }
    },
  });

  const isThinking = React.useMemo(
    () => isLoading && !isStreaming,
    [isLoading, isStreaming],
  );

  const messageCount = messages.length;

  const [isBottomViewVisible, setIsBottomViewVisible] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const handleZapPress = (isVisible: boolean) => {
    setIsBottomViewVisible(isVisible);
  };

  const handleCameraPress = () => {
    setIsCameraVisible(!isCameraVisible);
  };

  console.log("messages", messages);

  return (
    <View className="flex-1">
      <View className="absolute top-0 z-10 w-full">
        <ConversationTitle
          loading={isGettingConversationTitle}
          title={conversationTitle}
        />
      </View>
      {showPromptSuggestions && !conversationId && (
        <View className="z-10 flex items-center justify-center">
          <View className="w-full px-4">
            <PromptSuggestions
              animal={animal}
              promptSelected={(prompt) => {
                onHandleSubmit(prompt);
              }}
            />
          </View>
        </View>
      )}
      {/* List of messages */}
      <FlatList
        data={messages}
        inverted
        contentContainerStyle={{
          flexDirection: "column-reverse",
          paddingHorizontal: 12,
        }}
        renderItem={({ item, index }) => (
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
        keyExtractor={(item, index) => `message-${index}`}
      />
      <View className="px-2" style={{ display: isThinking ? "flex" : "none" }}>
        <Typing />
      </View>

      <View className="flex flex-row items-start gap-1 p-3">
        {/* Text input field */}
        <View className="grow basis-0">
          <ChatInput
            input={input}
            onInputChange={onInputChange}
            onZapPress={handleZapPress}
            onCameraPress={handleCameraPress}
            cameraOpen={isCameraVisible}
          />
        </View>

        {/* Submit button */}
        <View className="shrink-0">
          <ChatSubmitButton
            isLoading={isLoading}
            isStreaming={isStreaming}
            input={input}
            handleSubmit={async (msg) => {
              await onHandleSubmit(msg);
            }}
          />
        </View>
      </View>
      {isCameraVisible && (
        <Animated.View
          className="relative mx-4 mb-4"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          <ImagePicker
            onUploadComplete={(uploadParams) => {
              setIsCameraVisible(false);
              onHandleSubmit([
                {
                  type: "image_url",
                  image_url: {
                    url: uploadParams.url,
                  },
                },
              ])
            }}
          />
        </Animated.View>)}
      {isBottomViewVisible && (
        <Animated.View
          className="relative mx-4 mt-2"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex flex-row"
          >
            <Animated.View
              className="flex h-24 justify-center rounded-lg border border-slate-300 bg-white px-2"
              entering={FadeIn.duration(300).delay(100)}
              exiting={FadeOut.duration(300)}
            >
              <Text className="mb-1 text-sm font-bold">Critical Response</Text>
              <Text fontSize={14}>
                Use for serious concerns about pet health
              </Text>
            </Animated.View>
            <Pressable
              onPress={async () => {
                console.log("Add Vet");
              }}
            >
              <Animated.View
                className="ml-1 flex h-24 justify-center rounded-lg border border-slate-300 bg-white px-2"
                entering={FadeIn.duration(300).delay(200)}
                exiting={FadeOut.duration(300)}
              >
                <Text className="mb-1 text-sm font-bold">Add Vet</Text>
                <Text fontSize={14}>Add a real vet to the chat</Text>
              </Animated.View>
            </Pressable>
          </ScrollView>
          <View className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent" />
        </Animated.View>
      )}
    </View>
  );
};

export default ChatTool;
