import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

import TypingAnimation from "../../../../assets/animations/loading/typing.json";

const Typing = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  return (
    <View className="relative flex w-20 items-center justify-center rounded-full bg-gray-200">
      <LottieView
        ref={animationRef}
        source={TypingAnimation}
        style={{
          width: 45,
          height: 35,
        }}
        loop
      />
    </View>
  );
};

export default Typing;
