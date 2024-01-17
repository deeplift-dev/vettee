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
import {
  Button,
  ButtonSpinner,
  ButtonText,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { OnboardingHeader } from "~/components/ui/headers/onboarding-header";
import BaseInput from "~/components/ui/inputs/input";
import BaseSelect from "~/components/ui/inputs/select";
import { PageContainer } from "~/components/ui/page-container";
import { theme } from "~/styles";
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
  const user = api.auth.me.useQuery();
  const router = useRouter();

  const {
    mutate: createProfile,
    error,
    isPending,
  } = api.profile.create.useMutation({
    onSuccess: async () => {
      Keyboard.dismiss();
      router.push("/");
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED")
        Alert.alert("Error", "You must be logged in to create a post");
    },
  });

  const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
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
    <VStack w="$full">
      <CardHeader
        title="Hi! What should we call you?"
        subtitle="We need to know your name to get started."
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
      <View className="align-center w-full pb-12">
        <NavigationControls
          canProgress={isPending ? false : true}
          canGoBack={false}
          currentIndex={0}
          onSubmit={handleSubmit(onSubmit)}
          isLoading={isPending}
        />
      </View>
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

const NavigationControls = ({
  currentIndex,
  navigateToSlide,
  onSubmit,
  canProgress = true,
  canGoBack = true,
  isLoading = false,
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
        <Button
          size="xl"
          bg={theme.colors.primary}
          width="$full"
          disabled={!canGoBack}
          onPress={() => previousSlide()}
        >
          <ButtonText color="$black">Continue</ButtonText>
        </Button>
      )}
      <Button
        width="$full"
        bg={canProgress ? theme.colors.primary : "$green300"}
        size="xl"
        disabled={!canProgress}
        isLoading={true}
        onPress={() => {
          onSubmit ? onSubmit() : nextSlide();
        }}
      >
        {isLoading ? (
          <ButtonSpinner mr="$1" />
        ) : (
          <ButtonText color="$black">Continue</ButtonText>
        )}
      </Button>
    </View>
  );
};

const CardHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <VStack mb="$6">
      <Text lineHeight={30} fontSize={30} fontFamily="$mono" mb="$4">
        {title}
      </Text>
      <Text fontSize={16} color="$coolGray500">
        {subtitle}
      </Text>
    </VStack>
  );
};
