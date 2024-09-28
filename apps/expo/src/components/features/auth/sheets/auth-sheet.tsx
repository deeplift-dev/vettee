import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
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

import { BaseButton } from "~/components/ui/buttons/base-button";
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
    try {
      const redirectTo = makeRedirectUri();
      console.log("Redirect URI:", redirectTo);

      const createSessionFromUrl = async (url: string) => {
        console.log("Creating session from URL:", url);
        const { params, errorCode } = QueryParams.getQueryParams(url);

        if (errorCode) {
          console.error("Error code in URL:", errorCode);
          throw new Error(errorCode);
        }

        const { code } = params;
        if (!code) {
          console.warn("No code found in URL params");
          return;
        }

        console.log("Exchanging code for session");
        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Error exchanging code for session:", error);
          throw error;
        }

        console.log("Session created successfully");
        router.replace("/(tabs)");
      };

      console.log("Initiating OAuth sign-in with Facebook");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
      });

      if (error) {
        console.error("Error initiating OAuth sign-in:", error);
        throw error;
      }

      if (!data?.url) {
        console.error("No URL returned from signInWithOAuth");
        throw new Error("No URL returned from signInWithOAuth");
      }

      console.log("Opening auth session in WebBrowser");
      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      console.log("WebBrowser result:", res);
      if (res.type === "success") {
        const { url } = res;
        await createSessionFromUrl(url);
      } else {
        console.warn("WebBrowser session was not successful:", res.type);
      }
    } catch (error) {
      console.error("Error in signInWithFacebook:", error);
      // Handle the error appropriately, e.g., show an alert to the user
      Alert.alert(
        "Sign-in Error",
        "An error occurred while signing in with Facebook. Please try again.",
      );
    }
  };

  const signInWithGoogle = async () => {};

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
          <BaseButton
            icon={<FontAwesome5 name="facebook" size={24} color="white" />}
            onPress={signInWithFacebook}
          >
            Continue with Facebook
          </BaseButton>
          <BaseButton
            icon={<FontAwesome5 name="google" size={24} color="white" />}
            onPress={() => router.replace("/(tabs)")}
          >
            Continue with Google
          </BaseButton>
        </VStack>
        <Divider my="$0.5" />
        <BaseButton variant="outline" onPress={() => nextStep("email")}>
          Continue with email
        </BaseButton>
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
