import { Text } from "react-native";
import Animated, { FadeInUp, FadeOut } from "react-native-reanimated";

export function HomeHeader() {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOut}
      className="flex w-full flex-row"
    >
      <Text>Vettee</Text>
    </Animated.View>
  );
}
