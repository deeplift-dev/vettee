import Animated, { FadeInUp, FadeOut } from "react-native-reanimated";
import { Box, Icon, Text, ThreeDotsIcon } from "@gluestack-ui/themed";

import ProfileButton from "~/components/features/dashboard/profile-button";
import LogoText from "../logo/logo-text";

export function HomeHeader() {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOut}
      className="flex w-full flex-row items-center justify-between px-4 py-2"
    >
      <LogoText />
      <Box>
        <ProfileButton />
      </Box>
    </Animated.View>
  );
}
