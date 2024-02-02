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
  const [logoFontLoaded] = useFonts({
    "Oddval-Medium": require("../../assets/fonts/Oddval/Oddval-Medium.ttf"),
  });

  const [bodyFontLoaded] = useFonts({
    "Saans-Regular": require("../../assets/fonts/Saans/Saans-Regular.ttf"),
    "Saans-Light": require("../../assets/fonts/Saans/Saans-Light.ttf"),
    "Saans-Medium": require("../../assets/fonts/Saans/Saans-Medium.ttf"),
  });

  if (!logoFontLoaded || !bodyFontLoaded) {
    return null;
  }

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <TRPCProvider>
        <GluestackUIProvider config={config}>
          <BottomSheetModalProvider>
            <Stack initialRouteName="(tabs)">
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen
                name="onboarding"
                options={{ headerShown: false }}
              />
            </Stack>
            <StatusBar />
          </BottomSheetModalProvider>
        </GluestackUIProvider>
      </TRPCProvider>
    </SessionContextProvider>
  );
}
