import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";

import { api } from "~/utils/api";
import { downloadPresignedUrl } from "~/utils/helpers/images";
import { supabase } from "~/utils/supabase";

export default function AnimalProfilePage() {
  const { slug } = useLocalSearchParams();
  const {
    data: animal,
    isLoading,
    error,
  } = api.animal.getById.useQuery({ id: slug as string });

  console.log("animal", animal);

  if (isLoading) {
    return <Text className="p-4 text-center">Loading...</Text>;
  }

  if (error) {
    return (
      <Text className="p-4 text-center text-red-500">
        Error: {error.message}
      </Text>
    );
  }

  if (!animal) {
    return <Text className="p-4 text-center">Animal not found</Text>;
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="h-72 w-full">
        <ImageCarousel animal={animal} />
      </View>
      <View className="p-4">
        <Text className="text-2xl font-bold">{animal.name}</Text>
        <Text className="mt-2 text-gray-600">{animal.species}</Text>

        {/* <Text className="mt-4">{animal.description}</Text> */}
        {/* Add more animal details here */}
      </View>
    </ScrollView>
  );
}

const ImageCarousel = ({ animal }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  React.useEffect(() => {
    const fetchImageUrl = async () => {
      if (animal.avatarUrl) {
        const url = await downloadPresignedUrl(
          supabase,
          animal.avatarUrl,
          "animal-profiles",
        );
        setImages([url]);
      }
    };

    fetchImageUrl();
  }, [animal.avatarUrl, supabase]);

  console.log("images", images);

  return (
    <View className="h-full w-full">
      {images.length > 0 && (
        <Image
          source={{ uri: images[activeIndex] }}
          style={{ width: "100%", height: "100%", borderRadius: 10 }}
          alt="Animal avatar"
        />
      )}
    </View>
  );
};
