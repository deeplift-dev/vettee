import React from "react";
import { Stack } from "expo-router";

export default function AnimalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Animal Profile",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
