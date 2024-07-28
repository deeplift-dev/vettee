import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Box,
  Button,
  Divider,
  Text,
  View,
  VStack,
} from "@gluestack-ui/themed";

import { supabase } from "~/utils/supabase";
import LoginFrom from "../forms/login-form";

interface AuthSheetProps {
  trigger: React.ReactNode;
}

type AuthStep = "intro" | "email" | "password" | "name";

export default function AuthSheet({ trigger }: AuthSheetProps) {
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);
  const [activeStep, setActiveStep] = useState<AuthStep>("intro");

  return (
    <Box>
      {trigger && (
        <TouchableOpacity onPress={() => setShowActionsheet(true)}>
          {trigger}
        </TouchableOpacity>
      )}
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        // zIndex={999}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ width: "100%" }}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent pb="$8" zIndex={999}>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <AuthSteps
              activeStep={activeStep}
              nextStep={(step) => setActiveStep(step)}
            />
          </ActionsheetContent>
        </KeyboardAvoidingView>
      </Actionsheet>
    </Box>
  );
}

const AuthButton = ({
  children,
  bg,
  textColor,
  onPress,
}: {
  children: React.ReactNode;
  bg?: string;
  textColor?: string;
  onPress?: () => void;
}) => {
  return (
    <Button
      bg={bg ?? "$black"}
      size="xl"
      height={55}
      rounded="$2xl"
      borderWidth={1}
      borderColor="$backgroundLight300"
      onPress={onPress}
    >
      {children}
    </Button>
  );
};

const IntroCard = ({ nextStep }: { nextStep: (step: AuthStep) => void }) => {
  const signInWithFacebook = async () => {
    const redirectTo = makeRedirectUri();

    const createSessionFromUrl = async (url: string) => {
      const { params, errorCode } = QueryParams.getQueryParams(url);

      console.log("params", params, errorCode);

      if (errorCode) throw new Error(errorCode);
      const { code } = params;

      console.log("code", code);

      if (!code) return;

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) throw error;

      router.replace("/(tabs)");
    };

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
    });

    console.log("data step one", data, error);
    console.log("redirect to", redirectTo);

    const res = await WebBrowser.openAuthSessionAsync(
      data?.url ?? "",
      redirectTo,
    );

    console.log("res step two", res);

    if (res.type === "success") {
      const { url } = res;
      await createSessionFromUrl(url);
    }
  };

  return (
    <View width="$full">
      <VStack space="md" px={20}>
        <Text textAlign="left" size="2xl" fontWeight="$medium" color="$black">
          Get started
        </Text>
        <Text textAlign="left" mb={20}>
          Sign in to your account to continue. Or create a new account.
        </Text>
        <VStack space="sm" justifyContent="space-between">
          {/* <AuthButton onPress={() => router.replace("/(tabs)")}>
            <HStack
              space="md"
              alignItems="center"
              justifyContent="center"
              width="100%"
              height="100%" // Added to center vertically
            >
              <AntDesign name="apple1" size={24} color="white" />
              <Text color="$white">Continue with Apple</Text>
            </HStack>
          </AuthButton> */}
          {/* <AuthButton onPress={signInWithFacebook}>
            <HStack space="md" alignItems="center" justifyContent="center">
              <Entypo name="facebook-with-circle" size={24} color="white" />
              <Text color="$white">Continue with Facebook</Text>
            </HStack>
          </AuthButton>
          <AuthButton onPress={() => router.replace("/(tabs)")}>
            <HStack space="md" alignItems="center" justifyContent="center">
              <Text color="$white">Continue with Google</Text>
            </HStack>
          </AuthButton> */}
        </VStack>
        <Divider my="$0.5" />
        <AuthButton
          onPress={() => nextStep("email")}
          bg="$white"
          textColor="$black"
        >
          <Text color="$black">Continue with Email</Text>
        </AuthButton>
      </VStack>
    </View>
  );
};

const EmailForm = ({ nextStep }: { nextStep: (step: AuthStep) => void }) => {
  return (
    <View width="$full" position="relative">
      <TouchableOpacity onPress={() => nextStep("intro")}>
        <Text px={20}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </Text>
      </TouchableOpacity>
      <VStack space="md" px={20} pt={10}>
        <Text textAlign="left" size="2xl" fontWeight="$medium" color="$black">
          Sign in with email
        </Text>
        <Text textAlign="left" mb={20}>
          Sign in to your account to continue. Or create a new account.
        </Text>
        <LoginFrom />
      </VStack>
    </View>
  );
};

interface AuthStepsProps {
  activeStep: AuthStep;
  nextStep?: (authStep: AuthStep) => void;
}

const AuthSteps = ({ activeStep, nextStep }: AuthStepsProps) => {
  switch (activeStep) {
    case "intro":
      return <IntroCard nextStep={nextStep} />;
    case "email":
      return <EmailForm nextStep={nextStep} />;
    default:
      return <IntroCard nextStep={nextStep} />;
  }
};
