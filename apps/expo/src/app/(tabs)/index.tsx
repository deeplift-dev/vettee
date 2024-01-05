import React from "react";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";

import { HomeHeader } from "~/components/ui/headers/dashboard-header";
import { PageContainer } from "~/components/ui/page-container";
import { api } from "~/utils/api";

const Index = () => {
  const data = api.assistant.all.useQuery();

  return (
    <PageContainer>
      <LinearGradient
        // Background Linear Gradient
        colors={["rgba(0,0,600,0.4)", "transparent"]}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home", headerShown: false }} />
      <View className="h-full w-full px-4">
        <HomeHeader />
        <View className="my-4" />
        <View className="relative h-40 overflow-hidden rounded-lg">
          <BlurView
            style={{
              width: "100%",
              height: "100%",
            }}
            intensity={25}
          />
        </View>
      </View>
    </PageContainer>
  );
};

export default Index;
