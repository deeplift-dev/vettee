import React from "react";
import { Platform } from "react-native";
import { Image } from "expo-image";
import { Center, Text, View, VStack } from "@gluestack-ui/themed";
import AnimatedLottieView from "lottie-react-native";

const AnimalsCard = () => {
  const isIOS = Platform.OS === "ios";
  return (
    <VStack height="$full" width="$full">
      <Center height="$2/3">
        {isIOS ? (
          <AnimatedLottieView
            style={{ width: 400, height: 400, marginTop: 20 }}
            source={require("../../../../../assets/animations/all-animals-animation.json")}
            autoPlay
            loop
          />
        ) : (
          <Image
            source="https://jtgxffbpsnibgzbhaewx.supabase.co/storage/v1/object/public/assets/all-animals.png?t=2024-01-08T13%3A26%3A48.748Z"
            contentFit="cover"
            transition={1000}
            style={{ width: 400, height: 500, marginTop: 20 }}
            alt="All animals"
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
            Vettee supports all of your animals!{" "}
          </Text>
          <Text textAlign="center" mb={30}>
            Effortless pet care for every animal, from tabbies to terrapins. Our
            app adapts to every pet, ensuring their healthiest, happiest days.
          </Text>
        </VStack>
      </View>
    </VStack>
  );
};

export default AnimalsCard;
