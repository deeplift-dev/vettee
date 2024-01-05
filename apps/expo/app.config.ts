import type { ExpoConfig } from "@expo/config";

// if (
//   !process.env.EXPO_PUBLIC_SUPABASE_URL ||
//   !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
// ) {
//   throw new Error(
//     "Please provide SUPABASE_URL and SUPABASE_ANON_KEY in your .env file",
//   );
// }

const defineConfig = (): ExpoConfig => ({
  name: "vettee",
  slug: "vettee",
  scheme: "vettee",
  version: "0.0.1",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#18181A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "vettee.deeplift.com",
    supportsTablet: true,
    usesAppleSignIn: true,
  },
  android: {
    package: "vettee.deeplift.com",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#18181A",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "abaabb10-5b91-4094-9b26-627e411dd851",
    },
  },
  plugins: [
    "expo-router",
    "./expo-plugins/with-modify-gradle.js",
    "expo-apple-authentication",
  ],
});

export default defineConfig;
