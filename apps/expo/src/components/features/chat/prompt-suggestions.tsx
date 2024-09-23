import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { api } from "~/utils/api";

const PromptSuggestions = ({
  animal,
  promptSelected,
}: {
  animal: any;
  promptSelected: (description: string) => void;
}) => {
  const {
    mutate: getPromptSuggestions,
    data: promptSuggestions,
    isPending,
  } = api.assistant.getPromptSuggestions.useMutation();

  useEffect(() => {
    getPromptSuggestions({
      species: animal.species,
      name: animal.name,
      yearOfBirth: animal.yearOfBirth,
    });
  }, [animal, getPromptSuggestions]);

  if (isPending || !promptSuggestions) {
    return (
      <View className="flex w-full pt-4">
        <Text className="text-center text-xl font-medium">
          Loading suggestions...
        </Text>
      </View>
    );
  }

  let prompts = [];
  try {
    const promptsData = JSON.parse(
      promptSuggestions.choices?.[0]?.message?.content || "{}",
    );
    prompts = promptsData.prompts || [];
  } catch (error) {
    console.error("Error parsing prompt suggestions:", error);
  }

  if (!prompts || prompts.length === 0) {
    return (
      <View className="pt-18 flex w-full">
        <Text className="text-center text-xl font-medium">
          No suggestions available
        </Text>
      </View>
    );
  }

  return (
    <View className="flex w-full pt-5">
      <Animated.View
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(100)}
      >
        <Text className="text-center text-xl font-medium">Quick questions</Text>
        <Text className="text-center text-base text-slate-500">
          Ask a question about {animal.name}
        </Text>
      </Animated.View>
      <View className="flex flex-row flex-wrap justify-between">
        {prompts.map((prompt: { description: string }, index: number) => (
          <Animated.View
            key={index}
            className="mb-4 h-28 w-[48%]"
            entering={FadeIn.duration(500).delay(index * 100)}
            exiting={FadeOut.duration(100)}
          >
            <PromptSuggestionCard
              prompt={prompt}
              onPromptSelected={promptSelected}
            />
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const PromptSuggestionCard = ({
  prompt,
  onPromptSelected,
}: {
  prompt: { description: string };
  onPromptSelected: (description: string) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPromptSelected(prompt.description);
      }}
      className="mt-4 flex h-full w-full flex-col justify-center rounded-lg border border-gray-200 bg-white p-2"
    >
      <Text>{prompt.description}</Text>
    </TouchableOpacity>
  );
};

export { PromptSuggestionCard, PromptSuggestions };
