import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { OpenAI, useChat } from "react-native-gen-ui";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { nanoid } from "nanoid";

import type { RouterOutputs } from "~/utils/api";
import Typing from "~/components/ui/loaders/typing";
import Text from "~/components/ui/text";
import { api } from "~/utils/api";
import { initThreadPrompt } from "~/utils/chat/prompt-constants";
import ChatInput from "./chat-input";
import ChatMessage from "./chat-message";
import ChatSubmitButton from "./chat-submit-button";
import ConversationTitle from "./conversation-title";
import { PromptSuggestions } from "./prompt-suggestions";

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
  model: process.env.EXPO_PUBLIC_OPENAI_MODEL || "gpt-4o",
  // You can even set a custom basePath of your SSE server
});

// const useCameraTool = {
//   description: "Use the camera to take a photo",
//   // No parameters needed for this tool
//   parameters: z.object({}),
//   // Render component for using the camera - can yield loading state
//   render: async function* () {
//     // Placeholder for camera functionality
//     const takePhoto = async () => {
//       // Logic to open the camera and take a photo
//       // This is a placeholder and should be replaced with actual camera functionality
//       return {
//         uri: "https://example.com/photo.jpg",
//       };
//     };

//     // Simulate taking a photo
//     const photo = await takePhoto();

//     // Yield the loading state
//     yield {
//       component: <Text>Loading...</Text>,
//     };

//     // Return the final result
//     return {
//       // The data will be seen by the model
//       data: photo,
//       // The component will be rendered to the user
//       component: (
//         <View className="w-full">
//           <View className="w-full rounded-xl border-2 border-gray-100 bg-white p-1 shadow-sm">
//             <Pressable
//               onPress={() => {
//                 /* dummy function */
//               }}
//             >
//               <View className="flex w-full flex-row items-center rounded-lg border border-gray-200 px-4 py-4">
//                 <Image
//                   className="h-10 w-10"
//                   source={require("../../../../assets/illustrations/album.png")}
//                   alt="Album icon"
//                 />
//                 <Text pl="$2" fontFamily="$mono">
//                   Pick image from camera roll
//                 </Text>
//               </View>
//             </Pressable>
//           </View>
//           <View className="py-2" />
//           <View className="rounded-xl border-2 border-gray-100 bg-white p-1 shadow-sm">
//             <Pressable
//               onPress={() => {
//                 /* dummy function */
//               }}
//             >
//               <View className="flex w-full flex-row items-center rounded-lg border border-gray-200 px-4 py-4">
//                 <Image
//                   className="h-10 w-10"
//                   source={require("../../../../assets/illustrations/camera.png")}
//                   alt="Camera icon"
//                 />
//                 <Text pl="$2" fontFamily="$mono">
//                   Take a photo
//                 </Text>
//               </View>
//             </Pressable>
//           </View>
//         </View>
//       ),
//     };
//   },
// };

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
    setInitConversationId(nanoid());
  }, []);

  useEffect(() => {
    if (queryConversationId) {
      setConversationId(queryConversationId);
    }
  }, [queryConversationId]);

  const onHandleSubmit = async (msg: string) => {
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

    console.log("messageCount", messageCount);

    if ((messageCount + 1) % 2 === 0) {
      console.log("synthesizing conversation");
      synthesizeConversation({
        animalId: animal.id,
        messages: messages.concat({ role: "user", content: msg }),
      });
    }
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
      if (messageCount % 10 === 0 || messageCount === 1) {
        getConversationTitle({
          species: animal.species,
          name: animal.name,
          yearOfBirth: animal.yearOfBirth,
          messages: messages,
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
    },
  });

  const isThinking = React.useMemo(
    () => isLoading && !isStreaming,
    [isLoading, isStreaming],
  );

  const messageCount = messages.length;

  const [isBottomViewVisible, setIsBottomViewVisible] = useState(false);

  const handleZapPress = (isVisible: boolean) => {
    setIsBottomViewVisible(isVisible);
  };

  return (
    <View className="flex-1">
      <View className="absolute top-0 z-10 w-full">
        <ConversationTitle
          loading={isGettingConversationTitle}
          title={conversationTitle}
        />
      </View>
      {showPromptSuggestions && !conversationId && (
        <View className="absolute z-10 flex items-center justify-center">
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
        keyExtractor={(item, index) =>
          `message-${index}-${
            item.id ||
            (item.content ? item.content.substring(0, 10) : "no-content")
          }`
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="z-20 mb-8 w-full"
        keyboardVerticalOffset={150}
      >
        <View
          className="px-2"
          style={{ display: isThinking ? "flex" : "none" }}
        >
          <Typing />
        </View>

        <View className="flex flex-row items-start gap-1 p-3">
          {/* Text input field */}
          <View className="grow basis-0">
            <ChatInput
              input={input}
              onInputChange={onInputChange}
              onZapPress={handleZapPress}
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
                <Text className="mb-1 text-sm font-bold">
                  Critical Response
                </Text>
                <Text fontSize={14}>
                  Use for serious concerns about pet health
                </Text>
              </Animated.View>
              <Animated.View
                className="ml-1 flex h-24 justify-center rounded-lg border border-slate-300 bg-white px-2"
                entering={FadeIn.duration(300).delay(200)}
                exiting={FadeOut.duration(300)}
              >
                <Text className="mb-1 text-sm font-bold">Add Vet</Text>
                <Text fontSize={14}>Add a real vet to the chat</Text>
              </Animated.View>
            </ScrollView>
            <View className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent" />
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatTool;
