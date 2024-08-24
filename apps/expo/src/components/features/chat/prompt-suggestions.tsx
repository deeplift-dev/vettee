import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const PromptSuggestions = ({
  animal,
  promptSelected,
  promptSuggestions,
}: {
  animal: any;
  promptSelected: (description: string) => void;
  promptSuggestions: any;
}) => {
  if (!promptSuggestions || promptSuggestions.length === 0) {
    return (
      <View className="flex w-full pt-24">
        <Text className="text-center text-xl font-medium">
          Loading suggestions...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex w-full pt-24">
      <View>
        <Text className="text-center text-xl font-medium">Quick questions</Text>
        <Text className="text-center text-base text-slate-500">
          Ask a question about your pet
        </Text>
      </View>
      <View className="flex flex-row flex-wrap justify-between">
        {promptSuggestions.prompts.map((prompt: any, index: number) => (
          <View key={index} className="mb-4 h-32 w-[48%]">
            <PromptSuggestionCard
              prompt={prompt}
              onPromptSelected={promptSelected}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const PromptSuggestionCard = ({
  prompt,
  onPromptSelected,
}: {
  prompt: { logo: string; description: string };
  onPromptSelected: (description: string) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPromptSelected(prompt.description)}
      className="mt-4 flex h-full w-full flex-col justify-center rounded-lg border border-gray-200 bg-white p-4"
    >
      {/* <Text>{prompt.logo}</Text> */}
      <Text>{prompt.description}</Text>
    </TouchableOpacity>
  );
};

export { PromptSuggestionCard, PromptSuggestions };
