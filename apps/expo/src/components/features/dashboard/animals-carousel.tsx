import React from "react";
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useNavigation } from "expo-router";
import { PlusCircleIcon } from "lucide-react-native";

import type { RouterOutputs } from "@acme/api";

import Text from "~/components/ui/text";
import AnimalCard from "./animal-card";

interface AnimalsCarouselProps {
  animals: RouterOutputs["profile"]["animals"];
  isLoading: boolean;
}

const AnimalsCarousel: React.FC<AnimalsCarouselProps> = ({
  animals,
  isLoading,
}) => {
  const navigation = useNavigation();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth * 0.9; // Calculate card width as 80% of screen width

  const handleEdit = (animalId: number) => {
    // Navigation or state update logic here
  };

  if (isLoading) {
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-around",
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <View
            key={index}
            style={{
              width: 100,
              height: 150,
              borderRadius: 10,
              backgroundColor: "#E0E0E0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#BDBDBD",
              }}
            />
            <View
              style={{
                marginTop: 10,
                width: 80,
                height: 20,
                borderRadius: 10,
                backgroundColor: "#BDBDBD",
              }}
            />
            <View
              style={{
                marginTop: 5,
                width: 50,
                height: 20,
                borderRadius: 10,
                backgroundColor: "#BDBDBD",
              }}
            />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className="my-4 w-full">
      <Animated.View
        className="mb-6 w-full flex-row items-center justify-between px-5"
        entering={FadeIn.duration(800)}
      >
        <Text variant="title" className="font-medium text-slate-700">
          My animals
        </Text>
        <Pressable
          onPress={() => navigation.navigate("animal-create")}
          className="flex flex-row items-center gap-x-2 rounded-xl bg-slate-900 px-3 py-3"
        >
          <PlusCircleIcon size={20} color="#ffff" />
          <Text className="font-semibold text-slate-50">Add animal</Text>
        </Pressable>
      </Animated.View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="w-full p-2"
        contentContainerStyle={{ flexDirection: "row" }}
      >
        {animals.map((animal: any, index: number) => (
          <Animated.View
            style={{ width: cardWidth }}
            className="mr-2"
            key={animal.id}
            entering={FadeIn.delay(100 * index).duration(500)}
          >
            <AnimalCard animal={animal} onEdit={() => handleEdit(animal.id)} />
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};
export default AnimalsCarousel;
