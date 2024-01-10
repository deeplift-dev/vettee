import React from "react";
import { Platform } from "react-native";
import { SvgUri } from "react-native-svg";
import { Center, Text, View, VStack } from "@gluestack-ui/themed";
import AnimatedLottieView from "lottie-react-native";

const AnimalDash = () => {
  const isIOS = Platform.OS === "ios";
  return (
    <VStack height="$full" width="$full">
      <Center height="$2/3">
        {isIOS ? (
          <AnimatedLottieView
            style={{ width: "250%", marginTop: 25 }}
            source={require("../../../../../assets/animations/animal-dash-animation.json")}
            autoPlay
            loop
          />
        ) : (
          <SvgUri
            uri="https://jtgxffbpsnibgzbhaewx.supabase.co/storage/v1/object/public/assets/animal-profile.svg?t=2024-01-08T13%3A18%3A31.792Z"
            width={500}
            height={500}
            style={{ marginTop: 25 }}
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
            Your pet’s care, personalised{" "}
          </Text>
          <Text textAlign="center" mb={30}>
            We'll help you keep track of your pet's health and wellbeing, so you
            can focus on what matters most.
          </Text>
        </VStack>
      </View>
    </VStack>
  );
};

export default AnimalDash;
