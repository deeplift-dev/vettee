import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { create } from "zustand";

export const useStore = create((set) => ({
  backgroundColors: "#36d1EF",
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

  // Format backgroundColors to be an array if it's a string
  const formattedBackgroundColors = Array.isArray(backgroundColors)
    ? [...backgroundColors, "transparent"]
    : [backgroundColors, "white"];
  return (
    <>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 0.13 }}
        colors={formattedBackgroundColors}
        style={{ width: "100%", height: "200%", position: "absolute" }}
      />
      <SafeAreaView>{children}</SafeAreaView>
    </>
  );
}
