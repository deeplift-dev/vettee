import React, { useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import type BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import AnimatedLottieView from "lottie-react-native";
import type { ChatCompletion } from "openai/resources";
import type { Control, FieldErrors, UseFormWatch } from "react-hook-form";
import { Controller, set, useForm } from "react-hook-form";

import ImagePicker from "~/components/features/onboarding/image-picker";
import CustomBottomSheet from "~/components/ui/bottom-sheet";
import { BaseButton } from "~/components/ui/buttons/base-button";
import { OnboardingHeader } from "~/components/ui/headers/onboarding-header";
import DismissKeyboard from "~/components/ui/inputs/dismiss-keyboard";
import Input from "~/components/ui/inputs/input";
import Select from "~/components/ui/inputs/select";
import { PageContainer, useStore } from "~/components/ui/page-container";
import MainSpinner from "~/components/ui/spinners/main-spinner";
import Text from "~/components/ui/text";
import { api } from "~/utils/api";
import formatToJson from "~/utils/assistant/format-content";
import { animalSpecies } from "~/utils/data/animal-species";

const Animals = () => {
  return (
    <PageContainer>
      <View className="flex h-full w-full flex-col justify-between px-4">
        <OnboardingHeader canSkip={false} />
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
  rarity: string;
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
        <CheckAnimalType
          navigateToSlide={(index) => setActiveIndex(index)}
          getValues={getValues}
          control={control}
          errors={errors}
          setValue={setValue}
        />
      ),
    },
    {
      id: 3,
      name: "animal-summary",
      component: (
        <ReviewAnimalDetails
          navigateToSlide={(index) => setActiveIndex(index)}
          getValues={getValues}
          errors={errors}
        />
      ),
    },
  ];

  if (!carouselItems[activeIndex]) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <View className="flex h-full flex-col items-center justify-between">
      {carouselItems[activeIndex]?.component}
    </View>
  );
};

interface IntroCardProps {
  navigateToSlide: (index: number) => void;
}

const IntroCard = ({ navigateToSlide }: IntroCardProps) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      className="mr-2 flex h-full flex-col justify-between rounded-t-2xl bg-white px-6 shadow-2xl"
    >
      <View>
        <View className="py-6" />
        <View>
          <Text fontSize={20} fontWeight="700" className="pb-6">
            First, let's get to know your pets.
          </Text>
          <Text fontSize={20} className="leading-normal text-black">
            We'll get some basic details about your animals. Their name, photo,
            age and some other basic details.
          </Text>
        </View>
        <View className="py-12" />
        <View className="flex flex-row justify-center">
          <AnimatedLottieView
            autoPlay
            style={{
              width: 220,
              height: 220,
              backgroundColor: "transparent",
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../../../assets/animations/complete-animation.json")}
          />
        </View>
      </View>
      <View className="align-center w-full pb-12">
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
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      className="flex h-full w-full flex-col justify-between rounded-t-2xl bg-white px-6 shadow-2xl"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <DismissKeyboard> */}
        <View className="py-6" />
        <View>
          <Text fontSize={20} fontWeight="700" className="pb-4">
            Let's start with the easy stuff.
          </Text>
        </View>
        <View className="pb-4">
          <View></View>
          <Text fontSize={20} className="w-full pb-4 text-left">
            What's your pet's name?
          </Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Fido"
                onBlur={onBlur}
                autoFocus={true}
                value={value}
                onChangeText={onChange}
              />
            )}
            name="animalName"
          />
          <Text className="pt-2 text-red-600">
            {errors?.animalName ? "This is a required field" : ""}
          </Text>
        </View>
        <View className="pb-4">
          <Text fontSize={20} className="w-full pb-4 text-left">
            What kind of animal do you have?
          </Text>
          <View
            style={{ paddingHorizontal: 12 }}
            className="rounded-lg border border-gray-200 px-2 py-2"
          >
            <Pressable
              className="flex w-full flex-row items-center justify-between"
              onPress={() => bottomSheetRef?.current?.expand()}
            >
              <Text fontSize={20} className="text-gray-700">
                {watch().animalType.charAt(0).toUpperCase() +
                  watch().animalType.slice(1)}
              </Text>
              <AntDesign name="down" size={20} color="black" />
            </Pressable>
          </View>
        </View>
        <View className="pb-4">
          <Text fontSize={20} className="w-full pb-4 text-left">
            How old is your pet?
          </Text>
          <Controller
            control={control}
            rules={{
              required: true,
              min: 1,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                inputMode="numeric"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
            name="animalAge"
          />
          <Text className="pt-2 text-red-600">
            {errors?.animalAge ? "This is a required field" : ""}
          </Text>
        </View>
        {/* </DismissKeyboard> */}
        <View className="align-center w-full pb-12">
          <NavigationControls
            currentIndex={1}
            canProgress={isValid}
            navigateToSlide={navigateToSlide}
          />
        </View>
      </ScrollView>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomBottomSheet
            handleSheetChanges={handleSheetChanges}
            ref={bottomSheetRef}
            snapPoints={["45%"]}
          >
            <View>
              <Select
                onValueChange={onChange}
                value={value}
                items={animalSpecies}
              />
              <Text className="pt-2 text-red-600">
                {errors?.animalType ? "This is a required field" : ""}
              </Text>
            </View>
            <BaseButton
              onPress={() => {
                onBlur();
                bottomSheetRef?.current?.close();
              }}
              variant="default"
            >
              <Text
                className="text-center text-white"
                fontSize={20}
                fontWeight="700"
              >
                Select
              </Text>
            </BaseButton>
          </CustomBottomSheet>
        )}
        name="animalType"
      />
    </Animated.View>
  );
};

interface Attributes {
  weight: string;
  dimensions: string;
  color: string;
  other: string;
}

interface Prediction {
  type: string;
  confidence: string;
  comment: string;
  attributes: Attributes[];
  background_colors: string[];
}

const CheckAnimalType = ({
  navigateToSlide,
  getValues,
  setValue,
}: CarouselItemProps) => {
  const setBackground = useStore((state) => state.updateBackgroundColors);
  const [isLoading, setIsLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showField, setShowField] = useState(false);
  const { mutateAsync: checkAnimal, error } =
    api.assistant.checkAnimal.useMutation({
      async onSuccess() {},
    });

  const handleSuccessfulUpload = async (uri: string) => {
    try {
      setIsPredicting(true);
      setValue("animalPhoto", uri);
      const result: ChatCompletion | undefined = await checkAnimal({
        species: getValues().animalType,
        presignedUrl: uri,
      });

      if (!result) {
        throw new Error("Failed to identify animal");
      }

      const prediction: Prediction[] = formatToJson(result);

      if (!prediction[0]?.type) {
        throw new Error("Failed to identify animal");
      }

      const { attributes, type, background_colors, confidence } = prediction[0];

      if (
        prediction[0].type.toLowerCase() !==
        getValues().animalType.toLowerCase()
      ) {
        setBackground(background_colors);
        setValue("animalBreed", type);
        setValue("animalAttributes", attributes);
        setValue("confidence", confidence);
        return navigateToSlide(3);
      }
    } catch (error) {
      console.log("Error : ", error);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      className="flex h-full w-full flex-col justify-between rounded-t-2xl bg-white px-6 shadow-2xl"
    >
      <View>
        <View className="py-6" />
        <View>
          <Text fontSize={30} fontWeight="500" className="pb-6">
            Say cheese!
          </Text>
        </View>
        <Text fontSize={20} className="text-left font-medium text-black">
          Let's grab a nice, clear picture of {getValues().animalName} the{" "}
          {getValues().animalType}, we'll use it for their profile picture.
          We'll also use it to gather some more basic details about{" "}
          {getValues().animalName}.
        </Text>
        <View className="py-12"></View>
        <View className="flex flex-row justify-center">
          {isLoading || isPredicting ? (
            <View className="h-40 w-full rounded-xl border border-gray-200 p-4">
              <View className="flex h-full w-full flex-col items-center justify-center">
                {isLoading && <Text>Uploading photo</Text>}
                {isPredicting && <Text>Analysing photo</Text>}
                <View className="py-2" />
                <MainSpinner />
              </View>
            </View>
          ) : (
            <ImagePicker
              setIsLoading={setIsLoading}
              onUploadComplete={handleSuccessfulUpload}
            />
          )}
        </View>
      </View>
      <View className="align-center w-full pb-12">
        <NavigationControls
          currentIndex={2}
          navigateToSlide={navigateToSlide}
          canProgress={getValues().animalBreed !== ""}
        />
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
          />
        </View>
        <View className="py-4" />
        <View className="flex flex-col justify-between">
          <View className="flex w-full flex-col px-4">
            <Text fontSize={30} fontWeight="500">
              {getValues().animalName}
            </Text>
            <View className="flex flex-row items-center space-x-2 pb-4">
              <Text fontSize={20} className="mr-4 font-medium text-black">
                {getValues().animalBreed}
              </Text>
              <ConfidenceBadge confidence="High" />
            </View>
            <Text fontSize={16} className="font-medium text-black">
              {getValues().animalAttributes?.map((attribute) => {
                return attribute.other;
              })}
            </Text>
            <View className="py-4" />
            <Text fontSize={20} className="font-medium text-black">
              {getValues().animalAttributes?.map((attribute) => {
                return (
                  <View className="flex w-full flex-col">
                    <View className="flex w-full flex-row justify-between">
                      <AnimalStat label="Age" value={getValues().animalAge} />
                      <AnimalStat
                        label="Approx. weight"
                        value={`${attribute.weight / 1000} KG`}
                      />
                    </View>
                    <View className="flex w-full flex-row justify-between">
                      <AnimalStat label="Color" value={attribute.color} />
                      <AnimalStat
                        label="Rarity"
                        value={`${attribute.rarity} / 10`}
                      />
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
  canProgress: boolean;
  canGoBack: boolean;
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
    if (currentIndex === 3) {
      return;
    }

    navigateToSlide(currentIndex + 1);
  };

  return (
    <View
      className={`flex w-full flex-row justify-center ${
        currentIndex !== 0 && "justify-between"
      }`}
    >
      {currentIndex !== 0 && (
        <Pressable disabled={!canGoBack} onPress={() => previousSlide()}>
          <View
            className={`flex h-16 w-16 flex-row items-center justify-center rounded-full border border-gray-300 bg-white ${
              !canGoBack && "bg-gray-400"
            }`}
          >
            <AntDesign name="arrowleft" size={28} color="#9ca3af" />
          </View>
        </Pressable>
      )}
      <Pressable disabled={!canProgress} onPress={() => nextSlide()}>
        <View
          className={`flex h-16 w-16 flex-row items-center justify-center rounded-full bg-black ${
            !canProgress && "bg-gray-400"
          }`}
        >
          <AntDesign name="arrowright" size={28} color="white" />
        </View>
      </Pressable>
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

interface ConfidenceBadgeProps {
  confidence: "High" | "Medium" | "Low";
}

const ConfidenceBadge = ({ confidence }: ConfidenceBadgeProps) => {
  let badgeColor, textColor;
  switch (confidence) {
    case "High":
      badgeColor = "bg-green-50 border-green-600";
      textColor = "text-green-600";
      break;
    case "Medium":
      badgeColor = "bg-yellow-50 border-yellow-600";
      textColor = "text-yellow-600";
      break;
    case "Low":
      badgeColor = "bg-red-50 border-red-600";
      textColor = "text-red-600";
      break;
  }
  return (
    <View className={`rounded border ${badgeColor}`}>
      <Text fontSize={12} className={`px-2 py-1 ${textColor} shadow-lg`}>
        Confidence: {confidence}
      </Text>
    </View>
  );
};
