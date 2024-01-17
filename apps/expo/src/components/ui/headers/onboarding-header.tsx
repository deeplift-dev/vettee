import Animated, { FadeInUp, FadeOut } from "react-native-reanimated";
import { Text } from "@gluestack-ui/themed";

export function OnboardingHeader({ canSkip = true }: { canSkip: boolean }) {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOut}
      className="flex w-full flex-row items-center justify-between"
    >
      <Text fontFamily="$heading" fontSize={20}>
        Vettee
      </Text>
      {canSkip && (
        <Text fontSize={20} className="font-bold text-gray-900">
          Skip Intro
        </Text>
      )}
    </Animated.View>
  );
}
