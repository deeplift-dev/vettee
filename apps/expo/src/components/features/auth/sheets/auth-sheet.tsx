import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as AppleAuthentication from "expo-apple-authentication";
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
  Divider,
  Input,
  InputField,
  Text,
  View,
  VStack,
} from "@gluestack-ui/themed";

import { BaseButton } from "~/components/ui/buttons/base-button";
import { supabase } from "~/utils/supabase";

interface AuthSheetProps {
  trigger: React.ReactNode;
}

type AuthStep = "intro" | "email";

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
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
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

  const signInWithApple = async () => {
    if (Platform.OS !== "ios") {
      Alert.alert(
        "Not Available",
        "Apple Sign In is only available on iOS devices.",
      );
      return;
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const {
          error,
          data: { user },
        } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });

        if (error) {
          console.error("Error signing in with Apple:", error);
          Alert.alert(
            "Sign-in Error",
            "An error occurred while signing in with Apple. Please try again.",
          );
        } else if (user) {
          console.log("Successfully signed in with Apple");
          router.replace("/(tabs)");
        }
      } else {
        throw new Error("No identityToken.");
      }
    } catch (error: any) {
      if (error.code === "ERR_REQUEST_CANCELED") {
        console.log("Apple sign-in was cancelled");
      } else {
        console.error("Error in Apple sign-in:", error);
        Alert.alert(
          "Sign-in Error",
          "An unexpected error occurred. Please try again.",
        );
      }
    }
  };

  return (
    <View width="$full">
      <VStack space="md" px={20}>
        <Text textAlign="left" size="2xl" fontWeight="$medium" color="$black">
          Get started
        </Text>
        <Text textAlign="left" mb={20}>
          Sign in or create an account to continue.
        </Text>
        <VStack space="sm" justifyContent="space-between">
          <BaseButton
            icon={<FontAwesome5 name="facebook" size={24} color="white" />}
            onPress={signInWithFacebook}
          >
            Continue with Facebook
          </BaseButton>
          {Platform.OS === "ios" && (
            <BaseButton
              icon={<FontAwesome5 name="apple" size={24} color="white" />}
              onPress={signInWithApple}
            >
              Continue with Apple
            </BaseButton>
          )}
        </VStack>
        <Divider my="$0.5" />
        <BaseButton
          disabled={true}
          variant="outline"
          onPress={() => nextStep("email")}
        >
          Continue with email
        </BaseButton>
      </VStack>
    </View>
  );
};

const EmailForm = ({ nextStep }: { nextStep: (step: AuthStep) => void }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignInWithMagicLink = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const redirectTo = makeRedirectUri();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) throw error;

      Alert.alert(
        "Check your email",
        "We've sent you a magic link to sign in to your account.",
      );
      nextStep("intro");
    } catch (error) {
      console.error("Error sending magic link:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View width="$full" position="relative">
      <TouchableOpacity onPress={() => nextStep("intro")}>
        <Text px={20}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </Text>
      </TouchableOpacity>
      <VStack space="md" px={20} pt={10}>
        <Text textAlign="left" size="2xl" fontWeight="$medium" color="$black">
          Sign in or Sign up
        </Text>
        <Text textAlign="left" mb={20}>
          Enter your email to receive a magic link for instant access.
        </Text>
        <VStack space="xl">
          <VStack space="xs">
            <Text lineHeight="$xs">Email</Text>
            <Input size="xl">
              <InputField
                autoCapitalize="none"
                autoComplete="off"
                keyboardType="email-address"
                type="text"
                onChangeText={setEmail}
                lineHeight="$lg"
              />
            </Input>
          </VStack>
        </VStack>
        <BaseButton onPress={handleSignInWithMagicLink} isLoading={isLoading}>
          Send Magic Link
        </BaseButton>
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
