import React from "react";
import { Center, Text, View, VStack } from "@gluestack-ui/themed";
import AnimatedLottieView from "lottie-react-native";

const AnimalDash = () => {
  return (
    <VStack height="$full" width="$full">
      <Center height="$2/3">
        <AnimatedLottieView
          style={{ width: "250%", marginTop: 25 }}
          source={require("../../../../../assets/animations/animal-dash-animation.json")}
          autoPlay
          loop
        />
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
            Your pet’s care, personalised{" "}
          </Text>
          <Text textAlign="center" color="$slate800" mb={30}>
            Vettee takes the pain out of visits to the vet, even the ones you
            didn’t plan for.
          </Text>
        </VStack>
      </View>
    </VStack>
  );
};

export default AnimalDash;
