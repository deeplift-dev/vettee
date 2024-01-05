import type { FC } from "react";
import React from "react";
import { View } from "react-native";

interface SpacerProps {
  size: number | string;
  horizontal?: boolean;
}

const Spacer: FC<SpacerProps> = ({ horizontal = false, size }) => {
  const defaultValue = "auto";

  return (
    <View
      style={{
        width: horizontal ? size : defaultValue,
        height: !horizontal ? size : defaultValue,
      }}
    />
  );
};

export default Spacer;
