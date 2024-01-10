import React from "react";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useUser } from "@supabase/auth-helpers-react";

import { HomeHeader } from "~/components/ui/headers/dashboard-header";
import { PageContainer } from "~/components/ui/page-container";
import { api } from "~/utils/api";
import { supabase } from "~/utils/supabase";

const Index = () => {
  const user = useUser();

  return (
    <PageContainer>
      <LinearGradient
        // Background Linear Gradient
        colors={["rgba(0,0,100,0.4)", "transparent"]}
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
          <Button
            className="absolute bottom-4 left-4"
            onPress={() => supabase.auth.signOut()}
          >
            <ButtonText>Sign Out</ButtonText>
          </Button>
        </View>
      </View>
    </PageContainer>
  );
};

export default Index;
