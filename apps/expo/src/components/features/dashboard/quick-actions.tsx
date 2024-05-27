import React from "react";
import { Pressable, View } from "react-native";
import { useNavigation } from "expo-router";

import Text from "~/components/ui/text";

const QuickActions = () => {
  const navigation = useNavigation();

  const actions = [
    { label: "Add Animal", navigateTo: "animal-create" },
    { label: "Chat", navigateTo: "chat" },
    { label: "Profile", navigateTo: "profile" },
    { label: "Settings", navigateTo: "settings" },
  ];

  // Randomize the actions to create a "bento box" style
  const shuffledActions = actions.sort(() => 0.5 - Math.random()).slice(0, 2);

  return (
    <View className="p-5">
      <Text variant="subtitle" className="font-medium text-slate-700">
        Quick actions
      </Text>
      <View className="grid grid-cols-2">
        {actions.map((action, index) => (
          <Pressable
            key={index}
            onPress={() => navigation.navigate(action.navigateTo)}
            className="m-1 rounded-lg border border-gray-300 bg-gray-50"
          >
            <Text className="p-2 text-sm font-medium text-slate-800">
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const BackgroundShapes = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: "#f0e1f4",
          opacity: 0.5,
        }}
      />
      <View
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor: "#e1f4f1",
          opacity: 0.5,
        }}
      />
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: "#f4f1e1",
          opacity: 0.5,
        }}
      />
    </View>
  );
};

export default QuickActions;
