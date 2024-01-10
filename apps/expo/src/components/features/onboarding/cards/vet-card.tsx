import React from "react";
import { Platform } from "react-native";
import { SvgUri } from "react-native-svg";
import { Center, Text, View, VStack } from "@gluestack-ui/themed";
import AnimatedLottieView from "lottie-react-native";

const VetCard = () => {
  const isIOS = Platform.OS === "ios";

  return (
    <VStack height="$full" width="$full">
      <Center height="$2/3">
        {isIOS ? (
          <AnimatedLottieView
            style={{ width: 400, height: 400, marginTop: 20 }}
            source={require("../../../../../assets/animations/vet-chat-animation.json")}
            autoPlay
            loop
          />
        ) : (
          <SvgUri
            uri="https://jtgxffbpsnibgzbhaewx.supabase.co/storage/v1/object/public/assets/vet-chat.svg?t=2024-01-08T13%3A14%3A28.689Z"
            width={500}
            height={500}
            style={{ paddingTop: 40 }}
          />
        )}
        <View height="$3.5" />
      </Center>
      <View height="$1/3" mt={40}>
        <VStack space="lg" px={60}>
          <Text
            textAlign="center"
            size="2xl"
            fontWeight="$medium"
            color="$black"
          >
            Connect effortlessly with your local vet{" "}
          </Text>
          <Text textAlign="center" mb={30}>
            Vettee takes the pain out of visits to the vet, even the late night
            visits you didn’t plan for.
          </Text>
        </VStack>
      </View>
    </VStack>
  );
};

export default VetCard;
