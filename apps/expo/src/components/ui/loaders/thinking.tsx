import type { ViewStyle } from "react-native";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

import ThinkingAnimation from "../../../../assets/animations/loading/chatting.json";

interface ThinkingProps {
  size?: number;
  color?: string;
}

const Thinking: React.FC<ThinkingProps> = ({
  size = 48,
  color = "#000000",
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  const containerStyle: ViewStyle = {
    height: size,
    width: size,
  };

  return (
    <View style={[styles.animationContainer, containerStyle]}>
      <LottieView
        ref={animationRef}
        source={ThinkingAnimation}
        style={styles.lottieView}
        autoPlay
        loop
        colorFilters={[
          {
            keypath: "**",
            color: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    // The size is now controlled by the prop
  },
  lottieView: {
    width: "100%",
    height: "100%",
  },
});

export default Thinking;
