import { View } from "react-native";
import { BlurView } from "expo-blur";

export function BlurCard({ children }: { children: React.ReactNode }) {
  return (
    <BlurView
      style={{
        width: "100%",
        height: "100%",
      }}
      intensity={300}
    >
      <View className="p-4">{children}</View>
    </BlurView>
  );
}
