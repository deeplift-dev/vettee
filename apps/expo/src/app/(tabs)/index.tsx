import React from "react";
import { SafeAreaView, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { Box, Button, ButtonText, Center, Text } from "@gluestack-ui/themed";
import { useUser } from "@supabase/auth-helpers-react";

import { HomeHeader } from "~/components/ui/headers/dashboard-header";
import { PageContainer } from "~/components/ui/page-container";
import { api } from "~/utils/api";
import { supabase } from "~/utils/supabase";

const Index = () => {
  const user = useUser();

  return (
    <View h="$full" w="$full">
      <LinearGradient
        // Background Linear Gradient
        colors={["#AAD6E1", "#DECAEC", "#9BB8EF"]}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />
      <SafeAreaView>
        {/* Changes page title visible on the header */}
        <Stack.Screen options={{ title: "Home", headerShown: false }} />
        <HomeHeader />
        <Center h="$full" w="$full">
          <Box w="$full" px="$10">
            <Box bg="$white" w="$full" p="$4" borderRadius="$lg">
              <Text>Add your first animal to get started</Text>
            </Box>
          </Box>
          <Button onPress={() => supabase.auth.signOut()}>
            <ButtonText>Sign Out</ButtonText>
          </Button>
        </Center>
      </SafeAreaView>
    </View>
  );
};

export default Index;
