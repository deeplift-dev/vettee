import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Center, View, VStack } from "@gluestack-ui/themed";
import AnimatedLottieView from "lottie-react-native";

import LogoText from "./logo/logo-text";

export default function LoadingFullscreen() {
  return (
    <View w="$full" h="$full">
      <LinearGradient
        colors={["#9BC0D2", "#ACB1F1", "#F9CAEF"]}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />
      <Center w="$full" h="$full">
        <LogoText />
      </Center>
    </View>
  );
}
