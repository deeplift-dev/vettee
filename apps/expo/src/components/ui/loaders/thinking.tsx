import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

import ThinkingAnimation from "../../../../assets/animations/loading/chatting.json";

const Thinking = () => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        ref={animationRef}
        source={ThinkingAnimation}
        style={styles.lottieView}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    height: 48,
    width: 48,
  },
  lottieView: {
    width: "100%",
    height: "100%",
  },
});

export default Thinking;
