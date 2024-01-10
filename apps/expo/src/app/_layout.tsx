import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { TRPCProvider } from "../utils/api";
import { supabase } from "../utils/supabase";

import "../styles.css";

import { SafeAreaView } from "react-native-safe-area-context";
import { DelaGothicOne_400Regular } from "@expo-google-fonts/dela-gothic-one";
import {
  Outfit_100Thin,
  Outfit_200ExtraLight,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
  useFonts,
} from "@expo-google-fonts/outfit";
import config from "gluestack.config";
import { cssInterop } from "nativewind";

cssInterop(SafeAreaView, { className: "style" });

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const [delaFontLoaded] = useFonts({
    DelaGothicOne_400Regular,
  });
  const [outfitFontLoaded] = useFonts({
    Outfit_100Thin,
    Outfit_200ExtraLight,
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
  });

  if (!outfitFontLoaded || !delaFontLoaded) {
    return null;
  }

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <TRPCProvider>
        <BottomSheetModalProvider>
          <GluestackUIProvider config={config}>
            <Stack initialRouteName="(tabs)">
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
