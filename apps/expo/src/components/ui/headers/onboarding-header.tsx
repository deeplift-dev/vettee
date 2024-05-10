import Animated, { FadeInUp, FadeOut } from "react-native-reanimated";
import { Link } from "expo-router";
import { CloseIcon, Text } from "@gluestack-ui/themed";

import LogoText from "../logo/logo-text";

export function OnboardingHeader({
  canSkip = false,
  canClose = false,
}: {
  canSkip?: boolean;
  canClose?: boolean;
}) {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOut}
      className="flex w-full flex-row items-center justify-between"
    >
      <Animated.View sharedTransitionTag="logoTextTransition">
        <LogoText />
      </Animated.View>
      {canSkip && (
        <Link href="../">
          <Text size="lg" color="$black">
            Skip intro
          </Text>
        </Link>
      )}
      {canClose && (
        <Link href="../">
          <CloseIcon size="xl" />
        </Link>
      )}
    </Animated.View>
  );
}
