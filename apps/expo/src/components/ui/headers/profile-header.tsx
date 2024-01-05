import { Text, View } from "react-native";

export default function ProfileHeader() {
  return (
    <View className="flex w-full flex-row justify-center px-4">
      <Text
        style={{ fontFamily: "Unbounded_500Medium" }}
        className="text-center text-2xl text-gray-800"
      >
        Vettee
      </Text>
    </View>
  );
}
