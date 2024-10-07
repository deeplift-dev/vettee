import { Button, HStack, Text, View, VStack } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { Redirect, useNavigation } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useRef, useState } from "react";
import type { Control, FieldErrors, UseFormWatch } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Keyboard } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import ImagePicker from "~/components/features/onboarding/image-picker";
import { OnboardingHeader } from "~/components/ui/headers/onboarding-header";
import BaseInput from "~/components/ui/inputs/input";
import BaseSelect from "~/components/ui/inputs/select";
import { PageContainer, useStore } from "~/components/ui/page-container";
import { api } from "~/utils/api";
import { animalSpecies } from "~/utils/data/animal-species";
import getYears from "~/utils/data/get-years";

const Animals = () => {
  return (
    <PageContainer>
      <View className="flex h-full w-full flex-col justify-between px-4">
        <OnboardingHeader canClose={true} />
        <View className="py-2" />
        <CarouselBody />
      </View>
    </PageContainer>
  );
};

export default Animals;

interface animalAttributes {
  weight: string;
  color: string;
  other: string;
  ailments: string;
}

interface FormData {
  animalName: string;
  animalType: string;
  animalAge: string;
  animalBreed?: string | undefined;
  animalAttributes?: animalAttributes[];
  animalPhoto?: string | undefined;
  animalBackgroundColors?: string[] | undefined;
  confidence: string;
}

interface CarouselItemProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  getValues: () => FormData;
  setValue: (name: keyof FormData, value: string) => void;
  navigateToSlide: (index: number) => void;
  isValid: boolean;
  watch: UseFormWatch<FormData>;
}

const CarouselBody = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      animalName: "",
      animalType: "dog",
      animalAge: "",
      animalBreed: "",
      animalPhoto: "",
      animalBackgroundColors: [],
      confidence: "",
      animalAttributes: [
        {
          weight: "",
          color: "",
          other: "",
        },
      ],
    },
  });

  const { mutate: createAnimal, isLoading: isCreatingAnimal } =
    api.animal.create.useMutation({
      onSuccess: async (data) => {
        navigation.navigate("index");
        Keyboard.dismiss();
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED")
          Alert.alert("Error", "You must be logged in to create a post");
      },
    });

  const carouselItems = [
    {
      id: 0,
      name: "intro",
      component: (
        <IntroCard navigateToSlide={(index) => setActiveIndex(index)} />
      ),
    },
    {
      id: 1,
      name: "identify-animal",
      component: (
        <BasicAnimalInfoCard
          navigateToSlide={(index) => setActiveIndex(index)}
          control={control}
          errors={errors}
          getValues={getValues}
          isValid={isValid}
          setValue={setValue}
          watch={watch}
        />
      ),
    },
    {
      id: 2,
      name: "animal-photo",
      component: (
        <UploadAnimalImages
          navigateToSlide={(index) => setActiveIndex(index)}
          getValues={getValues}
          control={control}
          errors={errors}
          setValue={setValue}
          isCreatingAnimal={isCreatingAnimal}
          onSaveAnimal={() => {
            createAnimal({
              name: getValues().animalName,
              species: getValues().animalType,
              avatarUrl: getValues().animalPhoto,
              yearOfBirth: Number(getValues().animalAge),
            });
          }}
        />
      ),
    },
  ];

  if (!carouselItems[activeIndex]) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <View className="flex h-full flex-row items-center justify-center">
      {carouselItems[activeIndex]?.component}
    </View>
  );
};

interface IntroCardProps {
  navigateToSlide: (index: number) => void;
}

const IntroCard = ({ navigateToSlide }: IntroCardProps) => {
  const animationRef = useRef<LottieView>(null);

  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      className="flex h-full flex-col justify-between rounded-t-2xl px-6 py-6"
    >
      <View>
        <View>
          <Text
            fontFamily="$mono"
            fontSize="$2xl"
            pb="$4"
            lineHeight="$2xl"
            textAlign="center"
          >
            Let's get to know your pet
          </Text>
          <Text fontFamily="$body" textAlign="center">
            We'll ask for some basic details about your animal. Their name,
            photo, age and some other basic details.{" "}
          </Text>
        </View>
        <View className="py-12" />
        <View className="flex flex-row justify-center">
          <LottieView
            ref={animationRef}
            autoPlay
            loop
            style={{
              width: 220,
              height: 220,
              backgroundColor: "transparent",
            }}
            source={require("../../../assets/animations/complete-animation.json")}
          />
        </View>
      </View>
      <View className="pb-12">
        <NavigationControls
          canProgress={true}
          canGoBack={false}
          currentIndex={0}
          navigateToSlide={navigateToSlide}
        />
      </View>
    </Animated.View>
  );
};

const BasicAnimalInfoCard = ({
  navigateToSlide,
  control,
  errors,
  isValid,
  getValues,
  setValue,
  watch,
}: CarouselItemProps) => {
  // Watch the fields to trigger re-render when any of them change
  const animalName = watch("animalName");
  const animalType = watch("animalType");
  const animalAge = watch("animalAge");

  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      className="flex h-full w-full flex-col justify-between px-0 py-6"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <DismissKeyboard> */}
        <View>
          <Text
            fontFamily="$mono"
            fontSize="$2xl"
            pb="$4"
            lineHeight="$2xl"
            textAlign="center"
          >
            Starting with the easy stuff
          </Text>
        </View>
        <VStack className="p-4">
          <Animated.View entering={FadeInDown.duration(500).delay(100)}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <BaseInput
                  label="What's your pet's name?"
                  placeholder="Bingo"
                  onChangeText={(value) => {
                    setValue("animalName", value);
                  }}
                  value={value}
                  onBlur={onBlur}
                  errorText={errors?.animalName?.message}
                />
              )}
              name="animalName"
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <BaseSelect
                  label="What kind of animal do you have?"
                  placeholder="Select species"
                  items={animalSpecies}
                  onValueChange={(value) => {
                    onChange(value);
                    setValue("animalType", value);
                  }}
                  value={value}
                  errorText={errors?.animalType?.message}
                />
              )}
              name="animalType"
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(300)}>
            <Controller
              control={control}
              rules={{
                required: true,
                min: 1,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <BaseSelect
                  label="What year was your animal born?"
                  placeholder="2010"
                  items={getYears()}
                  onValueChange={(value) => {
                    onChange(value);
                    setValue("animalAge", value);
                  }}
                  value={value}
                  errorText={errors?.animalAge?.message}
                />
              )}
              name="animalAge"
            />
          </Animated.View>
        </VStack>
        {/* </DismissKeyboard> */}
        <View className="align-center w-full py-12">
          <NavigationControls
            currentIndex={1}
            canProgress={!!(isValid && animalName && animalType && animalAge)}
            navigateToSlide={navigateToSlide}
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
};

// const SpeciesOption = ({ onPress, children }) => {
//   return (
//     <Pressable onPress={onPress}>
//       <View px="$4" py="$4" bg="$blueGray200" w="$full">
//         <Text w="$full" fontFamily="$mono">
//           Logout
//         </Text>
//       </View>
//     </Pressable>
//   );
// };

// interface Attributes {
//   weight: string;
//   dimensions: string;
//   color: string;
//   other: string;
// }

// interface Prediction {
//   type: string;
//   confidence: string;
//   comment: string;
//   attributes: Attributes[];
//   background_colors: string[];
// }

interface UploadAnimalImagesProps {
  getValues: () => FormData;
  setValue: (name: keyof FormData, value: string) => void;
  onSaveAnimal: () => void;
  isCreatingAnimal: boolean;
}

const UploadAnimalImages = ({
  getValues,
  setValue,
  onSaveAnimal,
  isCreatingAnimal,
}: UploadAnimalImagesProps) => {
  const setBackground = useStore((state) => state.updateBackgroundColors);
  const [isLoading, setIsLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [animalPhoto, setAnimalPhoto] = useState<string | null>(null);
  const [shouldShowControls, setShouldShowControls] = useState(false);
  const [showField, setShowField] = useState(false);

  const handleSuccessfulUpload = async ({ fileName, url }) => {
    try {
      setIsPredicting(true);
      setValue("animalPhoto", fileName);
      setAnimalPhoto(url);
    } catch (error) {
      console.log("Error : ", error);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      className="flex h-full w-full flex-col justify-between rounded-t-2xl px-6 py-4"
    >
      <View>
        <View>
          <Text
            fontFamily="$mono"
            fontSize="$2xl"
            pb="$4"
            lineHeight="$2xl"
            textAlign="center"
          >
            Say cheese!
          </Text>
        </View>
        <Text fontFamily="$body" textAlign="center">
          Let's grab a clear picture of {getValues().animalName} the{" "}
          {getValues().animalType}, we'll use it for their profile picture.
          We'll also use it to gather some additional basic details about{" "}
          {getValues().animalName}.
        </Text>
        <View className="py-12"></View>
        <View className="flex flex-row justify-center">
          {isLoading || isPredicting ? (
            <View className="flex w-full flex-col items-center justify-center pt-12">
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Uploading</Text>
            </View>
          ) : animalPhoto ? (
            <View>
              <View className="flex w-full flex-col items-center justify-center">
                <Animated.View entering={FadeIn.duration(900).delay(200)}>
                  <Image
                    source={{ uri: animalPhoto }}
                    style={{ width: 300, height: 300, borderRadius: 10 }}
                    placeholder={{ blurhash }}
                    alt="animal photo"
                  />
                </Animated.View>
                <View className="py-4"></View>
                <Animated.View entering={FadeIn.duration(500).delay(200)}>
                  <Button
                    w="$full"
                    rounded="$2xl"
                    size="xl"
                    backgroundColor="$red50"
                    onPress={() => setAnimalPhoto(null)}
                  >
                    <Text
                      width="$full"
                      fontFamily="$mono"
                      color="$red600"
                      textAlign="center"
                    >
                      Remove Image
                    </Text>
                  </Button>
                </Animated.View>
              </View>
              <View className="flex flex-row space-x-4"></View>
            </View>
          ) : (
            <VStack justifyContent="center" width="$full">
              <ImagePicker
                setIsLoading={setIsLoading}
                onUploadComplete={handleSuccessfulUpload}
              />
            </VStack>
          )}
        </View>
      </View>
      <View className="align-center w-full pb-12">
        <Button
          onPress={onSaveAnimal}
          rounded="$2xl"
          size="xl"
          bg={getValues().animalPhoto ? "$black" : "$lightgray"}
        >
          {isLoading || isCreatingAnimal ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : getValues().animalPhoto ? (
            <Text fontFamily="$mono" color="$white">
              Save
            </Text>
          ) : (
            <Text fontFamily="$mono" color="$black">
              Skip for now
            </Text>
          )}
        </Button>
      </View>
    </Animated.View>
  );
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const ReviewAnimalDetails = ({
  getValues,
  control,
  navigateToSlide,
}: CarouselItemProps) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      className="shadow-4xl flex h-full w-full flex-col justify-between rounded-t-2xl bg-white"
    >
      <View className="h-full border-gray-300">
        <View
          style={{ height: "40%" }}
          className="flex flex-row justify-center"
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            source={getValues().animalPhoto}
            placeholder={blurhash}
            contentFit="cover"
            transition={1000}
            alt="animal photo"
          />
        </View>
        <View className="py-4" />
        <View className="flex flex-col justify-between">
          <View className="flex w-full flex-col px-4">
            <HStack justifyContent="space-between">
              <Text fontSize={24} fontFamily="$mono" lineHeight="$2xl">
                {getValues().animalName}
              </Text>
              {/* <Button
                size="xs"
                borderRadius="$full"
                variant="outline"
                borderColor="$grey800"
              >
                <ButtonText fontSize="$sm" fontFamily="$mono" color="$black">
                  Edit
                </ButtonText>
              </Button> */}
            </HStack>
            <View className="flex flex-row items-center space-x-2 pb-4">
              <Text fontSize={20} className="mr-4 font-medium text-black">
                {getValues().animalBreed}
              </Text>
            </View>
            <Text fontSize={16} className="font-medium text-black">
              {getValues().animalAttributes?.map((attribute) => {
                return attribute.other;
              })}
            </Text>
            <Text fontSize={20} className="font-medium text-black">
              {getValues().animalAttributes?.map((attribute) => {
                return (
                  <View className="flex w-full flex-col">
                    <View className="flex w-full flex-row justify-between">
                      <AnimalStat label="Age" value={getValues().animalAge} />
                      <AnimalStat
                        label="Approx. weight"
                        value={`${Number(attribute.weight) / 1000} KG`}
                      />
                    </View>
                    <View className="flex w-full flex-col justify-between rounded-xl border border-gray-200 p-2">
                      <HStack>
                        <Text>Color</Text>
                        <Text>{attribute.color}</Text>
                      </HStack>
                      <Text>{attribute.ailments}</Text>
                    </View>
                  </View>
                );
              })}
            </Text>
          </View>
          <View className="py-4" />
          <View className="align-center w-full px-6 pb-12">
            <NavigationControls
              currentIndex={3}
              navigateToSlide={navigateToSlide}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

interface NavigationControlsProps {
  currentIndex: number;
  navigateToSlide: (index: number) => void;
  canProgress?: boolean;
  canGoBack?: boolean;
}

const NavigationControls = ({
  currentIndex,
  navigateToSlide,
  canProgress = true,
  canGoBack = true,
}: NavigationControlsProps) => {
  const previousSlide = () => {
    if (currentIndex === 0) {
      return;
    }

    navigateToSlide(currentIndex - 1);
  };

  const nextSlide = () => {
    navigateToSlide(currentIndex + 1);
  };

  return (
    <View className="px-3">
      <HStack space="sm">
        <Button
          rounded="$2xl"
          size="xl"
          bg="$black"
          w={currentIndex !== 0 ? "$1/2" : "$full"}
          isDisabled={!canProgress}
          onPress={() => nextSlide()}
        >
          <Text fontFamily="$mono" color="white">
            Continue
          </Text>
        </Button>
        {currentIndex !== 0 && (
          <Button
            rounded="$2xl"
            w="$1/2"
            size="xl"
            bg="$white"
            isDisabled={!canGoBack}
            borderWidth={1}
            borderColor="$gray600"
            onPress={() => previousSlide()}
          >
            <Text color="$black" fontFamily="$mono">
              Back
            </Text>
          </Button>
        )}
      </HStack>
    </View>
  );
};

interface AnimalStatProps {
  label: string;
  value: string;
}

const AnimalStat = ({ label, value }: AnimalStatProps) => {
  return (
    <View className="flex w-1/2 py-4">
      <View className="px-2">
        <Text className="text-left text-gray-700" fontWeight="600">
          {label}
        </Text>
      </View>
      <View className="px-2">
        <Text>{value}</Text>
      </View>
    </View>
  );
};

// interface ConfidenceBadgeProps {
//   confidence: "High" | "Medium" | "Low";
// }

// const ConfidenceBadge = ({ confidence }: ConfidenceBadgeProps) => {
//   let badgeColor, textColor;
//   switch (confidence) {
//     case "High":
//       badgeColor = "bg-green-50 border-green-600";
//       textColor = "text-green-600";
//       break;
//     case "Medium":
//       badgeColor = "bg-yellow-50 border-yellow-600";
//       textColor = "text-yellow-600";
//       break;
//     case "Low":
//       badgeColor = "bg-red-50 border-red-600";
//       textColor = "text-red-600";
//       break;
//   }
//   return (
//     <View className={`rounded border ${badgeColor}`}>
//       <Text fontSize={12} className={`px-2 py-1 ${textColor} shadow-lg`}>
//         Confidence: {confidence}
//       </Text>
//     </View>
//   );
// };
