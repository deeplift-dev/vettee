import type { PropsWithChildren } from "react";
import React from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ChatContainer = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      className="flex-1"
      style={{
        paddingBottom: insets.bottom, // Added extra padding
      }}
    >
      {children}
    </SafeAreaView>
  );
};

export default ChatContainer;
