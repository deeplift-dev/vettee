import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Redirect, useRouter } from "expo-router";
import { Text, VStack } from "@gluestack-ui/themed";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { BaseButton } from "~/components/ui/buttons/base-button";
import { OnboardingHeader } from "~/components/ui/headers/onboarding-header";
import BaseInput from "~/components/ui/inputs/input";
import { PageContainer } from "~/components/ui/page-container";
import { api } from "~/utils/api";

const ExperienceOptions = [
  {
    label: "I'm new to caring for one or more of my animals",
    value: "beginner",
  },
  {
    label: "I have some experience caring for one or more of my animals",
    value: "intermediate",
  },
  {
    label: "I'm an experienced animal carer",
    value: "advanced",
  },
];

const Animals = () => {
  return (
    <PageContainer>
      <SafeAreaView>
        <View className="flex h-full w-full flex-col justify-between px-4">
          <OnboardingHeader canSkip={false} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            enabled
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              scrollEnabled={true}
            >
              <View className="py-6" />
              <CarouselBody />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </PageContainer>
  );
};

export default Animals;

const CarouselBody = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselItems = [
    {
      id: 0,
      name: "intro",
      component: (
        <IntroCard navigateToSlide={(index) => setActiveIndex(index)} />
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
  const router = useRouter();

  const {
    mutate: createProfile,
    error,
    isPending,
  } = api.profile.create.useMutation({
    onSuccess: async () => {
      Keyboard.dismiss();
      router.push({ pathname: "/", params: { onboardingSuccess: "true" } });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED")
        Alert.alert("Error", "You must be signed in to continue.");
    },
  });
  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required."),
    lastName: yup.string().required("Last name is required."),
  });

  type SchemaType = yup.InferType<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: SchemaType) => {
    createProfile({
      first_name: data.firstName,
      last_name: data.lastName,
    });
  };

  return (
    <VStack w="$full" px="$2">
      <CardHeader
        title="Hello! What's your name?"
        subtitle="We'll use this to personalize your experience."
      />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <BaseInput
            label="First Name"
            placeholder="First Name"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            errorText={errors?.firstName?.message}
            selection={0}
          />
        )}
        name="firstName"
      />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <BaseInput
            label="Last Name"
            placeholder="Last Name"
            onChangeText={onChange}
            value={value}
            errorText={errors?.lastName?.message}
            onBlur={onBlur}
            selection={1}
          />
        )}
        name="lastName"
      />
      <BaseButton
        onPress={handleSubmit(onSubmit)}
        isLoading={isPending}
        disabled={isPending}
      >
        Continue
      </BaseButton>
    </VStack>
  );
};

interface NavigationControlsProps {
  currentIndex: number;
  navigateToSlide?: (index: number) => void;
  onSubmit?: () => void;
  canProgress: boolean;
  canGoBack: boolean;
  isLoading?: boolean;
}

const CardHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <View>
      <Text
        fontFamily="$mono"
        fontSize="$2xl"
        pb="$4"
        lineHeight="$2xl"
        textAlign="center"
      >
        {title}
      </Text>
      <Text fontFamily="$body" textAlign="center">
        {subtitle}
      </Text>
      <View className="py-6" />
    </View>
  );
};
