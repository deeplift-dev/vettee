import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOutLeft } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { AddIcon } from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";
import { ref } from "yup";

import LogoText from "~/components/ui/logo/logo-text";
import { api } from "~/utils/api";

const ChatPage = () => {
  const { animalId, conversationId } = useLocalSearchParams<{
    animalId: string;
    conversationId: string;
  }>();
  const router = useRouter();

  const { data: animal, isLoading } = api.animal.getById.useQuery({
    id: animalId,
  });

  useEffect(() => {
    initialiseChat(conversationId, animalId);
  }, [conversationId, animalId]);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [currentThreadId, setCurrentThreadId] = useState("");
  const [currentRunId, setCurrentRunId] = useState("");
  const [currentAssistantId, setCurrentAssistantId] = useState("");
  const bottomSheetRef = useRef(null);

  const { mutateAsync: createIntakeAssistant } =
    api.intakeAssistant.createAssistant.useMutation({
      async onSuccess(assistant) {
        console.log("Intake Assistant created successfully:", assistant);
      },
      async onError(error) {
        console.error("Error creating Intake Assistant:", error);
      },
    });

  const { mutateAsync: createIntakeThread } =
    api.intakeAssistant.createThread.useMutation({
      async onSuccess(thread) {
        console.log("Intake Thread created successfully:", thread);
      },
      async onError(error) {
        console.error("Error creating Intake Thread:", error);
      },
    });

  const { mutateAsync: createIntakeRun } =
    api.intakeAssistant.createRun.useMutation({
      async onSuccess(run) {
        console.log("Intake Run created successfully:", run);
      },
      async onError(error) {
        console.error("Error creating Intake Run:", error);
      },
    });

  const { mutateAsync: createMessage } =
    api.intakeAssistant.createMessage.useMutation({
      async onSuccess(message) {
        fetchMessages();
        console.log("Message created successfully:", message);
      },
      async onError(error) {
        console.error("Error creating message:", error);
      },
    });

  const { mutate: fetchRunSteps, data: runSteps } =
    api.intakeAssistant.getRunSteps.useMutation();

  const {
    data: threadMessages,
    error: fetchMessagesError,
    refetch: fetchMessages,
  } = api.intakeAssistant.getMessages.useQuery(
    {
      threadId: currentThreadId,
    },
    {
      enabled: !!currentThreadId,
    },
  );

  useEffect(() => {
    if (threadMessages?.data) {
      const formattedMessages = threadMessages.data.map((msg) => ({
        id: msg.id,
        text: msg.content.map((content) => content.text.value).join(" "),
        sender: msg.role,
        timestamp: new Date(msg.created_at * 1000).toLocaleString(),
      }));
      setMessages(formattedMessages);
    }
  }, [threadMessages]);

  useEffect(() => {
    if (currentThreadId && currentRunId) {
      fetchRunSteps({ threadId: currentThreadId, runId: currentRunId });
    }
  }, [currentThreadId, currentRunId, fetchRunSteps]);

  const handleSend = async () => {
    try {
      const messageResult = await createMessage({
        threadId: currentThreadId,
        role: "user",
        content: inputText,
      });

      createIntakeRun({
        threadId: currentThreadId,
        assistantId: currentAssistantId,
      });

      if (!messageResult) {
        throw new Error("Failed to send message");
      }

      fetchMessages();

      setInputText("");
    } catch (error) {
      console.error("Error in sending message: ", error);
    }
  };

  const pollMessages = () => {
    const interval = setInterval(() => {
      if (currentThreadId) {
        fetchMessages();
      } else {
        clearInterval(interval);
      }
    }, 5000); // Polling every 5 seconds

    return () => clearInterval(interval);
  };

  useEffect(() => {
    const stopPolling = pollMessages();
    return () => stopPolling();
  }, [currentThreadId, fetchMessages]);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const initialiseChat = (conversationId: string, animalId: string) => {
    if (conversationId) {
      // Fetch the existing conversation using the conversationId
      fetchConversation(conversationId);
    } else {
      // Initiate the intake sequence if no conversationId is provided
      initiateIntakeSequence();
    }
  };

  const fetchConversation = (conversationId: string) => {
    // Fetch the existing conversation from the server
    console.log("Fetching conversation...");
  };

  const initiateIntakeSequence = async () => {
    // Start the intake sequence
    // This will create a new conversation and send the first message
    const assistant = await createIntakeAssistant({
      name: "Intake Assistant",
      animalId: animalId,
    });
    const thread = await createIntakeThread();
    const run = await createIntakeRun({
      threadId: thread.id,
      assistantId: assistant.id,
    });

    setCurrentAssistantId(assistant.id);
    setCurrentThreadId(thread.id);
    setCurrentRunId(run.id);
  };

  const [viewVisible, setViewVisible] = useState(true);

  const hideViewAfterTimeout = (timeout) => {
    setTimeout(() => {
      setViewVisible(false);
    }, timeout);
  };

  useEffect(() => {
    // Hide the view after 5000 milliseconds (5 seconds)
    hideViewAfterTimeout(5000);
  }, []);

  return (
    <View style={styles.fullSize}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Animated.View>
            <LogoText />
          </Animated.View>
          <Pressable onPress={openBottomSheet}>
            <Feather name="more-horizontal" size={40} color="black" />
          </Pressable>
        </View>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView style={styles.messagesContainer}>
            {messages.map((message) => (
              <Animated.View
                key={message.id}
                entering={FadeIn}
                className="flex flex-col py-2"
              >
                <View className="flex flex-row items-center gap-2">
                  <View className="h-6 w-6 rounded-full bg-pink-300"></View>
                  <View>
                    <Text className="font-medium">{message.sender}</Text>
                  </View>
                </View>
                <Text style={styles.messageText}>{message.text}</Text>
              </Animated.View>
            ))}
          </ScrollView>
          {animal && (
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
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={handleSend}
                  placeholder="Type your message here..."
                  returnKeyType="send"
                />
              </View>
            </Animated.View>
          )}
        </KeyboardAvoidingView>
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

const styles = StyleSheet.create({
  fullSize: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageText: {
    flex: 1,
    padding: 5,
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 20,
    backgroundColor: "#FFF",
  },
  bottomSheetContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default ChatPage;
