import React, { useRef, useState } from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AddIcon, Badge, BadgeIcon, BadgeText } from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";

import LogoText from "~/components/ui/logo/logo-text";

const ChatPage = () => {
  const { animalId, conversationId } = useLocalSearchParams<{
    animalId: string;
    conversationId: string;
  }>();
  const router = useRouter();

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello, how can I help you today?",
      sender: "ai",
      avatar:
        "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light",
    },
    {
      id: 2,
      text: "I need assistance with my account.",
      sender: "user",
      avatar:
        "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const bottomSheetRef = useRef(null);

  const handleSend = () => {
    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      avatar: "path/to/user/avatar.png",
    };
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <BlurView intensity={10000} style={styles.fullSize}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Animated.View>
            <LogoText />
          </Animated.View>
          <Button title="Options" onPress={openBottomSheet} />
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
          <View className="w-full border-t border-slate-300 bg-white">
            <View className="flex w-full flex-row items-center gap-2 self-start border-b border-slate-300 bg-slate-50 px-2 pb-2 pt-2">
              <View>
                <Text className="font-medium text-slate-600">Focus:</Text>
              </View>
              <View className="flex flex-row rounded-full border border-slate-300 bg-white px-2 py-1">
                <View className="h-6 w-6 rounded-full bg-slate-300"></View>
                <View className="ml-2 pt-0.5">
                  <Text>Jetson</Text>
                </View>
              </View>
            </View>
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
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["25%", "50%"]}
        enablePanDownToClose={true}
        onClose={closeBottomSheet}
      >
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
          <View style={styles.bottomSheetContent}>
            <Button title="Leave" onPress={() => router.back()} />
            <Button title="New" onPress={() => console.log("New")} />
            <Button title="Rename" onPress={() => console.log("Rename")} />
          </View>
        </TouchableWithoutFeedback>
      </BottomSheet>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  fullSize: {
    flex: 1,
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
