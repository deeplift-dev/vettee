import React from "react";
import { SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack, useFocusEffect } from "expo-router";
import {
  Box,
  Button,
  ButtonText,
  Center,
  Text,
  View,
  VStack,
} from "@gluestack-ui/themed";

import AnimalsCarousel from "~/components/features/dashboard/animals-carousel";
import { HomeHeader } from "~/components/ui/headers/dashboard-header";
import { api } from "~/utils/api";

const Index = () => {
  const {
    data: animals,
    isLoading,
    error,
    refetch,
  } = api.profile.animals.useQuery();
  const hasAnimals = animals && animals.length > 0;

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

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
        {isLoading ? (
          <Center h="$2/3" w="$full">
            <Text>Loading...</Text>
          </Center>
        ) : hasAnimals ? (
          <>
            <AnimalsCarousel isLoading={isLoading} animals={animals} />
            {/* <QuickActions /> */}
          </>
        ) : (
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
                      size="md"
                      borderRadius="$xl"
                      backgroundColor="$black"
                      softShadow="1"
                    >
                      <ButtonText fontFamily="$mono" color="$white">
                        Add animal
                      </ButtonText>
                    </Button>
                  </Link>
                </VStack>
              </Box>
            </Box>
          </Center>
        )}
      </SafeAreaView>
    </View>
  );
};

export default Index;
