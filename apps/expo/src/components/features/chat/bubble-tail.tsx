import type { ColorValue } from "react-native";
import React from "react";
import Svg, { Circle } from "react-native-svg";

const BubbleTail = ({ color }: { color: ColorValue }) => {
  return (
    <Svg width="30" height="30" viewBox="0 0 30 30" fill="none" opacity={0.5}>
      <Circle cx="3.5" cy="26" r="3" fill={color} />
    </Svg>
  );
};

export default BubbleTail;
