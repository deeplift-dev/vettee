import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";

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
  const handleEdit = (animalId: number) => {
    console.log(`Edit animal with ID: ${animalId}`);
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
        className="w-full flex-row items-center justify-between px-5"
        entering={FadeIn.duration(800)}
      >
        <Text variant="subtitle" className="font-medium text-slate-700">
          My animals
        </Text>
        <Pressable
          onPress={() => navigation.navigate("animal-create")}
          className="rounded-xl border border-slate-300 bg-slate-900 px-2 py-1 shadow-sm"
        >
          <Text className="font-medium text-slate-50">Add animal</Text>
        </Pressable>
      </Animated.View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row p-2.5"
      >
        <View className="flex-row p-2.5">
          {animals.map((animal: any, index: number) => (
            <Animated.View
              className="max-w-full"
              key={animal.id}
              entering={FadeInDown.delay(100 * index).duration(500)}
              style={{ transform: [{ translateY: 30 * index }] }}
            >
              <AnimalCard
                animal={animal}
                onEdit={() => handleEdit(animal.id)}
              />
            </Animated.View>
          ))}
          <Pressable
            onPress={() => navigation.navigate("animal-create")}
            className=" mr-2 flex h-64 w-52 flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 bg-gray-200"
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0.1, y: 1 }}
              colors={["#00FFED", "#00B8BA"]}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                borderRadius: 10,
                opacity: 0.01,
              }}
            />
            <Feather name="plus-circle" size={24} color="#00B8BA" />
            <Text className="mt-4 text-center font-bold text-[#00B8BA]">
              Add New Animal
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};
export default AnimalsCarousel;
