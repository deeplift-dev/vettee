import React from "react";
import { Image } from "expo-image";
import { Marquee } from "@animatereactnative/marquee";
import { Box, Center, HStack, Text, View, VStack } from "@gluestack-ui/themed";

import LogoText from "~/components/ui/logo/logo-text";

const firstImages = [
  require("../../../../../assets/images/animals/animals-one.jpg"),
  require("../../../../../assets/images/animals/animals-nine.jpg"),
  require("../../../../../assets/images/animals/animals-seven.jpg"),
  require("../../../../../assets/images/animals/animals-two.jpg"),
  require("../../../../../assets/images/animals/animals-six.jpg"),
  require("../../../../../assets/images/animals/animals-eight.jpg"),
];

const secondImages = [
  require("../../../../../assets/images/animals/animals-three.jpg"),
  require("../../../../../assets/images/animals/animals-four.jpg"),
  require("../../../../../assets/images/animals/animals-five.jpg"),
];

const IntroCard = () => {
  return (
    <VStack height="$full">
      <Center height="$3/6">
        <Marquee spacing={20} speed={0.05}>
          <HStack space="lg">
            {secondImages.map((image, index) => (
              <Box
                key={index}
                width="$96"
                height="$96"
                rounded="$3xl"
                overflow="hidden"
                borderColor="$backgroundLight400"
                borderWidth={1}
              >
                <Image
                  source={image}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
                  alt="Animal"
                />
              </Box>
            ))}
          </HStack>
        </Marquee>
        <View height="$3.5" />
        <Marquee spacing={20} speed={0.1}>
          <HStack space="lg">
            {firstImages.map((image, index) => (
              <Box
                key={index}
                width="$40"
                height="$40"
                rounded="$3xl"
                overflow="hidden"
                borderColor="$backgroundLight400"
                borderWidth={1}
              >
                <Image
                  source={image}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
                  alt="Animal"
                />
              </Box>
            ))}
          </HStack>
        </Marquee>
      </Center>
      <View height="$3/6" mt={120}>
        <VStack space="lg" px={60}>
          <Text
            textAlign="center"
            size="2xl"
            fontWeight="$medium"
            color="$black"
          >
            Welcome to{"\n"}
            <LogoText />
          </Text>

          <Text textAlign="center" mb={30}>
            The ultimate companion for your companion. Access a unique, high
            quality pet care experience from the comfort of your home.
          </Text>
        </VStack>
      </View>
    </VStack>
  );
};

export default IntroCard;
