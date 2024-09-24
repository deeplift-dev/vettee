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
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Button,
  ButtonText,
  Tabs,
  TabsTab,
  TabsTabList,
  TabsTabPanel,
  TabsTabPanels,
} from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";

import ImagePicker from "~/components/features/onboarding/image-picker";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";
import { downloadPresignedUrl } from "~/utils/helpers/images";
import { supabase } from "~/utils/supabase";

export default function AnimalProfilePage() {
  const { slug } = useLocalSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: animal,
    isLoading,
    error,
    refetch,
  } = api.animal.getById.useQuery({ id: slug as string });
  const { mutate: updateAnimal } = api.animal.updateAnimal.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  const handleSuccessfulUpload = async ({ fileName }: { fileName: string }) => {
    try {
      updateAnimal({
        id: animal?.id!,
        data: {
          avatarUrl: fileName,
        },
      });
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  useEffect(() => {
    if (animal) {
      opacity.value = withTiming(1, { duration: 1000 });
      translateY.value = withSpring(0);
    }
  }, [animal]);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

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
        <Tabs>
          <TabsTabList>
            <TabsTab>
              <View className="flex-row items-center gap-1 rounded-full bg-slate-200 px-2 py-1">
                <Ionicons name="chatbubbles-outline" size={20} color="black" />
                <Text>Recent Conversations</Text>
              </View>
            </TabsTab>
            <TabsTab>
              <View className="flex-row items-center gap-1 rounded-full bg-slate-200 px-2 py-1">
                <Ionicons name="medical-outline" size={20} color="black" />
                <Text>Health Summary</Text>
              </View>
            </TabsTab>
          </TabsTabList>
          <TabsTabPanels>
            <TabsTabPanel>
              <RecentConversations animalId={animal.id} />
            </TabsTabPanel>
            <TabsTabPanel>
              <SynthesizedData animalId={animal.id} />
            </TabsTabPanel>
          </TabsTabPanels>
        </Tabs>
      </View>
      <ImageUploadSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        handleSuccessfulUpload={handleSuccessfulUpload}
      />
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
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(100)}
        >
          <Image
            source={{ uri: images[activeIndex] }}
            style={{ width: "100%", height: "100%" }}
            alt="Animal avatar"
          />
        </Animated.View>
      ) : (
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(100)}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0.1, y: 1 }}
            colors={generateHarmoniousColors || []}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Animated.View>
      )}
    </View>
  );
};

const RecentConversations: React.FC<{ animalId: string }> = ({ animalId }) => {
  const router = useRouter();

  const {
    data: conversationsResponse,
    isLoading: conversationsLoading,
    refetch,
  } = api.conversation.listForAnimal.useQuery(
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

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (conversationsLoading) {
    return (
      <View className="p-4">
        <Skeleton className="mb-4" count={1} />
        <Skeleton count={5} height={40} />
      </View>
    );
  }

  return (
    <View className="p-4">
      {conversations.length > 0 && (
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(100)}
        >
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-lg font-bold">Recent Conversations</Text>
            <Link asChild href={`/(tabs)/chat?animalId=${animalId}`}>
              <Button
                size="sm"
                borderRadius="$xl"
                backgroundColor="$black"
                softShadow="1"
              >
                <ButtonText fontFamily="$mono" color="$white">
                  Start a New Chat
                </ButtonText>
              </Button>
            </Link>
          </View>
        </Animated.View>
      )}
      {conversations.length > 0 ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 350 }}>
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
          <Text className="mb-6 text-center text-gray-800">
            No recent conversations
          </Text>
          <Link asChild href={`/(tabs)/chat?animalId=${animalId}`}>
            <Button
              size="md"
              borderRadius="$xl"
              backgroundColor="$black"
              softShadow="1"
            >
              <ButtonText fontFamily="$mono" color="$white">
                Start a New Chat
              </ButtonText>
            </Button>
          </Link>
        </View>
      )}
    </View>
  );
};

interface ImageUploadSheetProps {
  isOpen: boolean;
  onClose: () => void;
  handleSuccessfulUpload: ({
    fileName,
    url,
  }: {
    fileName: string;
    url: string;
  }) => void;
}

const ImageUploadSheet: React.FC<ImageUploadSheetProps> = ({
  isOpen,
  onClose,
  handleSuccessfulUpload,
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
            onUploadComplete={(params) => {
              if (params.url) {
                handleSuccessfulUpload({
                  fileName: params.fileName,
                  url: params.url,
                });
                onClose();
              }
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

const SynthesizedData: React.FC<{ animalId: string }> = ({ animalId }) => {
  const {
    data: synthesizedData,
    isLoading,
    error,
  } = api.animal.getSynthesizedData.useQuery(
    {
      animalId,
    },
    {
      enabled: true,
    },
  );

  if (isLoading) {
    return (
      <View className="h-60 p-4">
        <Text>Loading pet health summary...</Text>
      </View>
    );
  }

  if (error) {
    return null;
  }

  if (!synthesizedData?.data) {
    return (
      <View className="h-60 p-4">
        <Text>No health summary available for this pet.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-4">
      <Animated.Text
        entering={FadeIn.duration(500)}
        className="mb-2 text-lg font-bold"
      >
        Pet Health Summary
      </Animated.Text>
      {Object.entries(synthesizedData.data).map(([key, value], index) => {
        if (Array.isArray(value) && value.length > 0) {
          return (
            <Animated.View
              key={key}
              entering={FadeIn.duration(500).delay(index * 100)}
            >
              <Text className="mt-2 font-semibold">
                {key
                  .split(/(?=[A-Z])/)
                  .join(" ")
                  .replace(/^\w/, (c) => c.toUpperCase())}
                :
              </Text>
              {value.map((item: string, itemIndex: number) => (
                <Animated.Text
                  key={itemIndex}
                  entering={FadeIn.duration(500).delay(
                    (index * value.length + itemIndex) * 100,
                  )}
                >
                  • {item.charAt(0).toUpperCase() + item.slice(1)}
                </Animated.Text>
              ))}
            </Animated.View>
          );
        } else if (
          typeof value === "number" ||
          (typeof value === "string" && value.trim() !== "")
        ) {
          return (
            <Animated.Text
              key={key}
              entering={FadeIn.duration(500).delay(index * 100)}
            >
              {key
                .split(/(?=[A-Z])/)
                .join(" ")
                .replace(/^\w/, (c) => c.toUpperCase())}
              : {value}
              {key === "weight" ? " kg" : ""}
            </Animated.Text>
          );
        }
        return null;
      })}
    </ScrollView>
  );
};
