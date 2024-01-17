import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { TRPCProvider } from "../utils/api";
import { supabase } from "../utils/supabase";

import "../styles.css";

import { SafeAreaView } from "react-native-safe-area-context";
import config from "gluestack.config";
import { cssInterop } from "nativewind";

cssInterop(SafeAreaView, { className: "style" });

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Oddval-Medium": require("../../assets/fonts/Oddval/Oddval-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <TRPCProvider>
        <BottomSheetModalProvider>
          <GluestackUIProvider config={config}>
            <Stack initialRouteName="(tabs)">
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen
                name="onboarding"
                options={{ headerShown: false }}
              />
            </Stack>
            <StatusBar />
          </GluestackUIProvider>
        </BottomSheetModalProvider>
      </TRPCProvider>
    </SessionContextProvider>
  );
}
