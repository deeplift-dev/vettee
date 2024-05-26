import React from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import type { RouterOutputs } from "@acme/api";

import Text from "~/components/ui/text";
import { downloadPresignedUrl } from "~/utils/helpers/images";

1;

interface AnimalCardProps {
  animal: RouterOutputs["profile"]["animals"][number];
  onEdit: () => void;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onEdit }) => {
  const router = useRouter();
  const supabase = useSupabaseClient();

  if (!animal) {
    return null;
  }

  const [imageUrl, setImageUrl] = React.useState(null);

  React.useEffect(() => {
    const fetchImageUrl = async () => {
      if (animal.avatarUrl) {
        const url = await downloadPresignedUrl(
          supabase,
          animal.avatarUrl,
          "animal-profiles",
        );
        setImageUrl(url);
      }
    };

    fetchImageUrl();
  }, [animal.avatarUrl, supabase]);

  console.log("imageUrl", imageUrl);
  return (
    <View className="w-94">
      <View className="relative mr-2 h-64 w-96 items-center rounded-xl border border-gray-300 bg-gray-200">
        <Image
          source={{ uri: imageUrl || undefined }}
          style={{ width: "100%", height: "100%", borderRadius: 10 }}
        />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0.1, y: 1 }}
          colors={["black", "transparent"]}
          style={{
            width: "100%",
            height: "45%",
            position: "absolute",
            borderRadius: 10,
          }}
        />
        <View className="absolute w-full px-4 pt-2">
          <Text className="font-medium text-white">{animal.name}</Text>
          {/* <Text className="text-xs text-white">{animal.species}</Text> */}
        </View>
        <View className="absolute bottom-0 w-full px-2 pb-2">
          <AnimalCardButtons animalId={animal.id} />
        </View>
      </View>
    </View>
  );
};

export default AnimalCard;

const AnimalCardButtons: React.FC<{ animalId: string }> = ({ animalId }) => {
  const router = useRouter();
  return (
    <View className="w-full flex-row items-center justify-between">
      <Pressable
        onPress={() => router.push({ pathname: `/chat`, params: { animalId } })}
        className="mr-1 flex w-1/2 flex-row items-center justify-center rounded-xl border border-gray-400 bg-gray-50 p-2.5 shadow-sm"
      >
        <AntDesign name="message1" size={16} color="black" />
        <Text className="pl-2 text-center font-medium text-slate-900">
          Chat
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("Profile")}
        className="mr-1 flex w-1/2 flex-row items-center justify-center rounded-xl border border-gray-400 bg-gray-50 p-2.5 shadow-sm"
      >
        <Ionicons name="paw" size={16} color="black" />
        <Text className="pl-2 text-center font-medium text-slate-900">
          Profile
        </Text>
      </Pressable>
    </View>
  );
};
