import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Button,
} from "@gluestack-ui/themed";

import ImagePicker from "~/components/features/onboarding/image-picker";
import { api } from "~/utils/api";
import { downloadPresignedUrl } from "~/utils/helpers/images";
import { supabase } from "~/utils/supabase";

export default function AnimalProfilePage() {
  const { slug } = useLocalSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const {
    data: animal,
    isLoading,
    error,
  } = api.animal.getById.useQuery({ id: slug as string });

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    if (animal) {
      opacity.value = withTiming(1, { duration: 1000 });
      translateY.value = withSpring(0);
    }
  }, [animal]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

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
    <>
      <View className="h-[350px] w-full">
        <ImageCarousel animal={animal} setIsOpen={setIsOpen} />
      </View>
      <View className="flex-1 bg-white">
        <Animated.View style={animatedStyle} className="p-4">
          <Text className="text-2xl font-bold">{animal.name}</Text>
          <Text className="mt-2 capitalize text-gray-600">
            {animal.species}
          </Text>
        </Animated.View>
        <RecentConversations animalId={animal.id} />
      </View>
      <ImageUploadSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

const ImageCarousel = ({
  animal,
  setIsOpen,
}: {
  animal: any;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const scale = useSharedValue(0.8);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const generateHarmoniousColors = React.useMemo(() => {
    const colors = [
      ["#FFCCCB", "#FFE5CC", "#FFFFCC", "#CCFFDD"],
      ["#CCE8FF", "#FFCCCB", "#FFE5CC", "#FFFFCC"],
      ["#CCFFDD", "#CCE8FF", "#FFCCCB", "#FFE5CC"],
      ["#FFE5CC", "#FFFFCC", "#CCFFDD", "#CCE8FF"],
      ["#FFCCCB", "#FFE5CC", "#FFFFCC", "#CCFFDD"],
      ["#CCE8FF", "#FFCCCB", "#FFE5CC", "#FFFFCC"],
      ["#CCFFDD", "#CCE8FF", "#FFCCCB", "#FFE5CC"],
      ["#FFE5CC", "#FFFFCC", "#CCFFDD", "#CCE8FF"],
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }, []);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (animal.avatarUrl) {
        const url = await downloadPresignedUrl(
          supabase,
          animal.avatarUrl,
          "animal-profiles",
        );
        setImages([url]);
        setImageLoaded(true);
        scale.value = withSpring(1);
      }
    };

    fetchImageUrl();
  }, [animal.avatarUrl, supabase]);

  return (
    <View className="h-full w-full">
      <Pressable
        onPress={() => {
          setIsOpen(true);
        }}
        className="absolute bottom-4 right-4 z-10 rounded-full bg-white p-3"
      >
        <Ionicons name="image" size={24} color="black" />
      </Pressable>
      {imageLoaded ? (
        <Image
          source={{ uri: images[activeIndex] }}
          style={{ width: "100%", height: "100%" }}
          alt="Animal avatar"
        />
      ) : (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0.1, y: 1 }}
          colors={generateHarmoniousColors}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </View>
  );
};

const RecentConversations: React.FC<{ animalId: string }> = ({ animalId }) => {
  const router = useRouter();

  const { data: conversationsResponse, isLoading: conversationsLoading } =
    api.conversation.listForAnimal.useQuery(
      {
        limit: 10,
        page: 1,
        animalId,
      },
      {
        enabled: true,
      },
    );

  const conversations = conversationsResponse?.data || [];
  if (conversationsLoading) {
    return (
      <View className="mt-4 p-4">
        <Text>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View className="mt-4 flex-1 p-4">
      <Animated.View
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(100)}
      >
        <Text className="mb-2 text-lg font-bold">Recent Conversations</Text>
      </Animated.View>
      {conversations.length > 0 ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {conversations.map((conversation, index) => (
            <Animated.View
              key={conversation.id}
              entering={FadeIn.duration(500).delay(index * 100)}
              exiting={FadeOut.duration(100)}
            >
              <Pressable
                onPress={() =>
                  router.push(
                    `/(tabs)/chat?conversationId=${conversation.id}&animalId=${conversation.animalId}`,
                  )
                }
                className="mb-2 rounded-lg bg-gray-100 p-3"
              >
                <Text className="font-medium">
                  {conversation.title || "Untitled Conversation"}
                </Text>
                <Text className="text-sm text-gray-600">
                  {new Date(conversation.updatedAt).toLocaleDateString()}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center">
          <Text className="mb-4 text-gray-500">No recent conversations</Text>
          <Button
            onPress={() => router.push(`/(tabs)/chat?animalId=${animalId}`)}
          >
            Start a New Chat
          </Button>
        </View>
      )}
    </View>
  );
};

interface ImageUploadSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImageUploadSheet: React.FC<ImageUploadSheetProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ width: "100%" }}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent pb="$8" zIndex={999}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ImagePicker
            onUploadComplete={() => {
              // Handle upload complete
              onClose();
            }}
            setIsLoading={() => {
              // Handle loading state
            }}
          />
        </ActionsheetContent>
      </KeyboardAvoidingView>
    </Actionsheet>
  );
};