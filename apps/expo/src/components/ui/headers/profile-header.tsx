import { View } from "react-native";

import LogoText from "../logo/logo-text";

export default function ProfileHeader() {
  return (
    <View className="flex w-full flex-row justify-center px-4">
      <LogoText />
    </View>
  );
}
