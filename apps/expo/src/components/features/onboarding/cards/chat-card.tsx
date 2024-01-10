import React from "react";
import { Platform } from "react-native";
import { SvgUri, SvgXml } from "react-native-svg";
import { Center, Text, View, VStack } from "@gluestack-ui/themed";
import AnimatedLottieView from "lottie-react-native";

const ChatCard = () => {
  const isIOS = Platform.OS === "ios";
  return (
    <VStack height="$full" width="$full">
      <Center height="$2/3">
        {isIOS ? (
          <AnimatedLottieView
            style={{ width: 500, height: 500, marginTop: 20 }}
            source={require("../../../../../assets/animations/smart-chat-animation.json")}
            autoPlay
            loop
          />
        ) : (
          <SvgUri
            uri="https://jtgxffbpsnibgzbhaewx.supabase.co/storage/v1/object/public/assets/vet-chat.svg?t=2024-01-08T13%3A14%3A28.689Z"
            width={500}
            height={500}
            style={{ marginTop: 20 }}
          />
        )}
        <View height="$3.5" />
      </Center>
      <View height="$1/3" mt={60}>
        <VStack space="lg" px={60}>
          <Text
            textAlign="center"
            size="3xl"
            fontWeight="$medium"
            color="$black"
          >
            Instant super-powered chat{" "}
          </Text>
          <Text textAlign="center" color="$slate800" mb={30}>
            Get helpful, targeted advice about your animal. Our specifically
            trained AI model will help you triage issues your animal might have.
          </Text>
        </VStack>
      </View>
    </VStack>
  );
};

export default ChatCard;
