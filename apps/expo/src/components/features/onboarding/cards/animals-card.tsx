import React from "react";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Marquee } from "@animatereactnative/marquee";
import {
  Button,
  ButtonText,
  Center,
  HStack,
  KeyboardAvoidingView,
  Text,
  View,
  VStack,
} from "@gluestack-ui/themed";
import AnimatedLottieView from "lottie-react-native";

import { PageContainer } from "~/components/ui/page-container";
import Spacer from "~/components/ui/spacer";

const images = [
  require("../../../../../assets/images/animals/animals-one.jpg"),
  require("../../../../../assets/images/animals/animals-nine.jpg"),
  require("../../../../../assets/images/animals/animals-seven.jpg"),
  require("../../../../../assets/images/animals/animals-two.jpg"),
  require("../../../../../assets/images/animals/animals-three.jpg"),
  require("../../../../../assets/images/animals/animals-four.jpg"),
  require("../../../../../assets/images/animals/animals-five.jpg"),
  require("../../../../../assets/images/animals/animals-six.jpg"),
  require("../../../../../assets/images/animals/animals-eight.jpg"),
];

const AnimalsCard = () => {
  return (
    <VStack height="$full" width="$full">
      <Center height="$2/3">
        <AnimatedLottieView
          style={{ width: 500, height: 500, marginTop: 20 }}
          source={require("../../../../../assets/animations/all-animals-animation.json")}
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
            Vettee supports all of your animals!{" "}
          </Text>
          <Text textAlign="center" color="$slate800" mb={30}>
            Effortless pet care for every animal, from tabbies to terrapins. Our
            app adapts to every pet, ensuring their healthiest, happiest days.
          </Text>
        </VStack>
      </View>
    </VStack>
  );
};

export default AnimalsCard;
