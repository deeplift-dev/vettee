import { KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "@gluestack-ui/themed";
import { create } from "zustand";

export const useStore = create((set) => ({
  backgroundColors: "#E9F1EF",
  updateBackgroundColors: (backgroundColors) =>
    set(() => ({ backgroundColors: backgroundColors })),
}));

export function PageContainer({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: "light" | "dark";
}) {
  const backgroundColors = useStore((state) => state.backgroundColors);
  console.log("backgroundColors", backgroundColors);

  // Format backgroundColors to be an array if it's a string
  const formattedBackgroundColors = Array.isArray(backgroundColors)
    ? [...backgroundColors, "transparent"]
    : [backgroundColors, "white"];
  return (
    <>
      <LinearGradient
        colors={formattedBackgroundColors}
        style={{ width: "100%", height: "200%", position: "absolute" }}
      />
      <View height="$full">{children}</View>
    </>
  );
}
