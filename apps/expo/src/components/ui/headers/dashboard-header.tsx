import Animated, { FadeInUp, FadeOut } from "react-native-reanimated";
import { Box, Icon, Text, ThreeDotsIcon } from "@gluestack-ui/themed";

import ProfileButton from "~/components/features/dashboard/profile-button";

export function HomeHeader() {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOut}
      className="flex w-full flex-row items-center justify-between px-4 py-2"
    >
      <Text fontFamily="$heading" color="$black" size="2xl">
        Vettee
      </Text>
      <Box p="$4">
        <ProfileButton />
      </Box>
    </Animated.View>
  );
}
