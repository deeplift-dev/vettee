import React from "react";
import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="account-settings"
        options={{
          title: "Animal Profile",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
