import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOutLeft } from "react-native-reanimated";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { AddIcon } from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";

import LogoText from "~/components/ui/logo/logo-text";
import { api } from "~/utils/api";

const ChatPage = () => {
  const { animalId, threadId, assistantId } = useLocalSearchParams<{
    animalId: string;
    threadId: string;
    assistantId: string;
  }>();
  const router = useRouter();

  const { data: animal, isLoading } = api.animal.getById.useQuery({
    id: animalId,
  });

  const { data: profile, isLoading: isProfileLoading } =
    api.profile.getCurrentUserProfile.useQuery();

  console.log("Profile data:", profile);

  const createAssistant = api.assistant.createNew.useMutation({
    onSuccess: (data) => {
      router.setParams({ assistantId: data.id });
      createThread.mutate();
    },
    onError: (error) => {
      console.error("Error creating assistant:", error);
    },
  });

  const createThread = api.assistant.createThread.useMutation({
    onSuccess: (data) => {
      router.setParams({ threadId: data.id });
    },
    onError: (error) => {
      console.error("Error creating thread:", error);
    },
  });

  const createMessage = api.assistant.createMessage.useMutation({
    onSuccess: () => {
      createRun.mutate({
        threadId: threadId,
        assistantId: assistantId,
      });
    },
    onError: (error) => {
      console.error("Error creating message:", error);
    },
  });

  const createRun = api.assistant.createRun.useMutation({
    onSuccess: (data) => {
      pollRunUntilComplete(data.id);
    },
    onError: (error) => {
      console.error("Error creating run:", error);
    },
  });

  const pollRun = api.assistant.pollRun.useMutation({
    onSuccess: (data) => {
      console.log("Polling run data:", data);
    },
    onError: (error) => {
      console.error("Error polling run:", error);
    },
  });

  const getMessages = api.assistant.getMessages.useMutation({
    onSuccess: (data) => {
      const latestMessage = {
        id: data.body.data[0].id,
        text: data.body.data[0].content[0].text.value,
        sender: data.body.data[0].role,
      };
      setMessages((prevMessages) => [...prevMessages, latestMessage]);
    },
    onError: (error) => {
      console.error("Error fetching messages:", error);
    },
  });

  useEffect(() => {
    initialiseChat(threadId, animalId);
  }, [threadId, animalId]);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const bottomSheetRef = useRef(null);

  const handleSend = () => {
    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    createMessage.mutate({
      threadId: threadId,
      message: inputText,
    });
    setInputText("");
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const initialiseChat = (threadId: string, animalId: string) => {
    if (!threadId) {
      initiateIntakeSequence();
    } else {
      getMessages.mutate({
        threadId,
      });
    }
  };

  const initiateIntakeSequence = () => {
    try {
      createAssistant.mutate({
        animalId,
        name: "Experienced Vet",
        instructions:
          "You are highly experienced vet with kind and charming bedside humor.",
      });
    } catch (error) {
      console.error("Error initiating intake sequence:", error);
    }
  };

  const [viewVisible, setViewVisible] = useState(true);

  const hideViewAfterTimeout = (timeout: number) => {
    setTimeout(() => {
      setViewVisible(false);
    }, timeout);
  };

  useEffect(() => {
    hideViewAfterTimeout(5000);
  }, []);

  const pollRunUntilComplete = (runId: string) => {
    const interval = setInterval(() => {
      pollRun.mutate(
        {
          threadId: threadId,
          runId,
        },
        {
          onSuccess: (data) => {
            if (data.status === "completed") {
              clearInterval(interval);
              getMessages.mutate({
                threadId: threadId,
              });
            }
          },
          onError: (error) => {
            console.error(
              "Error polling run for runId:",
              runId,
              "error:",
              error,
            );
          },
        },
      );
    }, 1000);
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between p-2">
          <Animated.View>
            <LogoText />
          </Animated.View>
          <Pressable onPress={openBottomSheet}>
            <Feather name="more-horizontal" size={40} color="black" />
          </Pressable>
        </View>
        <ScrollView className="flex-1 p-2">
          {messages.map(
            (message: { id: number; text: string; sender: string }) => (
              <Animated.View
                key={message.id}
                entering={FadeIn}
                className={`mb-4 inline-flex flex-col rounded-xl bg-blue-50 px-2 py-2 ${
                  message.sender === "user"
                    ? "items-end self-end bg-lime-50"
                    : ""
                } ${
                  message.text.length < 20
                    ? "w-1/4"
                    : message.text.length < 50
                      ? "w-1/2"
                      : "w-3/4"
                }`}
              >
                <View
                  className={`inline-flex flex-row items-center gap-2 ${
                    message.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {message.sender === "user" ? (
                    <Image
                      source={profile?.[0]?.image ?? ""}
                      className="rounded-full"
                      style={{
                        width: 25,
                        height: 25,
                        borderRadius: 100,
                        borderWidth: 1,
                        borderColor: "#d3d3d3",
                      }}
                    />
                  ) : (
                    <View className="h-6 w-6 rounded-full bg-slate-300"></View>
                  )}
                  <View>
                    <Text className="font-medium">
                      {message.sender === "assistant"
                        ? "Vettee"
                        : profile?.[0]?.firstName}
                    </Text>
                  </View>
                </View>
                <Text
                  className={`rounded-2xl p-2 ${
                    message.sender === "user" ? "text-right" : ""
                  }`}
                >
                  {message.text}
                </Text>
              </Animated.View>
            ),
          )}
        </ScrollView>
        {animal && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            className="w-full"
          >
            <Animated.View
              entering={FadeIn.springify().duration(300).delay(500)}
              className="w-full border-t border-slate-300 bg-white"
            >
              <Animated.View
                entering={FadeIn.springify().duration(500).delay(700)}
                className="flex w-full flex-row items-center gap-2 self-start border-b border-slate-300 bg-slate-50 px-2 pb-2 pt-2"
              >
                {viewVisible ? (
                  <Animated.View
                    entering={FadeIn.springify().duration(400)}
                    exiting={FadeOutLeft.springify().duration(500)}
                    className="flex flex-row items-center gap-2"
                  >
                    <View>
                      <Text className="font-medium text-slate-600">
                        Talking about
                      </Text>
                    </View>
                    <View className="flex flex-row rounded-full border border-slate-300 bg-white px-2 py-1">
                      <>
                        <View className="h-6 w-6 rounded-full bg-slate-300"></View>
                        <View className="ml-2 pt-0.5">
                          <Text>{animal.name}</Text>
                        </View>
                      </>
                    </View>
                  </Animated.View>
                ) : (
                  <View className="flex flex-row rounded-full border border-slate-300 bg-white px-2 py-1">
                    <>
                      <View className="h-6 w-6 rounded-full bg-slate-300"></View>
                      <View className="ml-2 pt-0.5">
                        <Text>{animal.name}</Text>
                      </View>
                    </>
                  </View>
                )}
              </Animated.View>
              <View className="flex flex-row items-center justify-center gap-2 p-2">
                <View>
                  <AddIcon size="xl" />
                </View>
                <TextInput
                  className="flex-1 rounded-2xl border border-gray-300 bg-white p-2"
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={handleSend}
                  placeholder="Type your message here..."
                  returnKeyType="send"
                />
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["25%"]}
        enablePanDownToClose={true}
        onClose={closeBottomSheet}
      >
        <TouchableWithoutFeedback
          className="border-t border-gray-800 shadow"
          onPress={closeBottomSheet}
        >
          <View className="flex flex-col justify-between px-4 pt-2">
            <Pressable onPress={() => router.back()}>
              <View className="flex w-full flex-row items-center space-x-4 rounded-xl border border-gray-300 bg-white px-4 py-3">
                <AntDesign
                  className="mr-4"
                  name="logout"
                  size={20}
                  color="black"
                />
                <Text className="text-xl font-medium">Save chat and close</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => router.back()}>
              <View className="mt-2 flex w-full flex-row items-center space-x-4 rounded-xl border border-gray-300 bg-white px-4 py-3">
                <AntDesign
                  className="mr-4"
                  name="staro"
                  size={20}
                  color="black"
                />
                <Text className="text-xl font-medium">Add to favourites</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => router.back()}>
              <View className="mt-2 flex w-full flex-row items-center space-x-4 rounded-xl border border-gray-300 bg-white px-4 py-3">
                <Feather
                  className="mr-4"
                  name="settings"
                  size={20}
                  color="black"
                />
                <Text className="text-xl font-medium">Settings</Text>
              </View>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </BottomSheet>
    </View>
  );
};

export default ChatPage;
