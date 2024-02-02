import React from "react";
import { SafeAreaView } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack } from "expo-router";
import {
  Box,
  Button,
  ButtonText,
  Center,
  Text,
  View,
  VStack,
} from "@gluestack-ui/themed";
import { useUser } from "@supabase/auth-helpers-react";

import { HomeHeader } from "~/components/ui/headers/dashboard-header";
import { PageContainer } from "~/components/ui/page-container";
import { theme } from "~/styles";
import { api } from "~/utils/api";
import { supabase } from "~/utils/supabase";

const Index = () => {
  const user = useUser();

  return (
    <View h="$full" w="$full">
      <LinearGradient
        // Background Linear Gradient
        colors={["#DEEEF2", "#FAECF8", "#DAE7F7"]}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />
      <SafeAreaView>
        {/* Changes page title visible on the header */}
        <Stack.Screen options={{ title: "Home", headerShown: false }} />
        <HomeHeader />
        <Center h="$2/3" w="$full">
          <Box w="$full" px="$10">
            <Box bg="$white" w="$full" p="$4" borderRadius="$lg">
              <VStack>
                <Text fontFamily="$mono" fontSize="$2xl" mb="$2">
                  Let's get started
                </Text>
                <Text mb="$8">Add an animal to get started with Vettee</Text>
                <Link asChild href="/animal-create">
                  <Button
                    width="$32"
                    size="md"
                    borderRadius="$full"
                    bgColor={theme.colors.primary}
                  >
                    <ButtonText fontFamily="$mono" color="$backgroundDark950">
                      Add animal
                    </ButtonText>
                  </Button>
                </Link>
              </VStack>
            </Box>
          </Box>
        </Center>
      </SafeAreaView>
    </View>
  );
};

export default Index;
