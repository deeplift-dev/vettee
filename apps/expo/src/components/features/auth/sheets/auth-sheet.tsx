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
import * as AppleAuthentication from "expo-apple-authentication";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from 'expo-linking';
import { useURL } from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { BaseButton } from "~/components/ui/buttons/base-button";
import { supabase } from "~/utils/supabase";

interface AuthSheetProps {
  trigger: React.ReactNode;
}

type AuthStep = "intro" | "email" | "waiting";

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
              onClose={handleClose}
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

      const createSessionFromUrl = async (url: string) => {
        const { params, errorCode } = QueryParams.getQueryParams(url);

        if (errorCode) {
          throw new Error(errorCode);
        }

        const { code } = params;
        if (!code) {
          return;
        }

        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          throw error;
        }

        router.replace("/(tabs)");
      };

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
      });

      if (error) {
        throw error;
      }

      if (!data?.url) {
        throw new Error("No URL returned from signInWithOAuth");
      }

      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (res.type === "success") {
        const { url } = res;
        await createSessionFromUrl(url);
      } else {
        console.warn("WebBrowser session was not successful:", res.type);
      }
    } catch (error) {
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

      nextStep("waiting");
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

const WaitingForMagicLink = ({ nextStep, onClose }: { nextStep: (step: AuthStep) => void, onClose: () => void }) => {
  const url = useURL();

  const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) {
      console.error("Error code in URL:", errorCode);
      throw new Error(errorCode);
    }

    const { code } = params;
    if (!code) {
      return;
    }

    console.log("Exchanging code for session");
    const { data, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw error;
    }

    onClose();
    router.replace("/(tabs)");
  };

  useEffect(() => {
    if (url == null) return;
    const parsedUrl = Linking.parse(url.replace('#', '?'));
    const { code } = parsedUrl.queryParams;
    if (code) {
      createSessionFromUrl(url);
    }
  }, [url]);

  return (
    <View width="$full" position="relative">
      <TouchableOpacity onPress={() => nextStep("email")}>
        <Text px={20}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </Text>
      </TouchableOpacity>
      <VStack space="md" px={20} pt={10}>
        <Text textAlign="left" size="2xl" fontWeight="$medium" color="$black">
          Check your email
        </Text>
        <Text textAlign="left" mb={20}>
          We've sent you a magic link to sign in to your account.
        </Text>
      </VStack>
    </View>
  );
};

interface AuthStepsProps {
  activeStep: AuthStep;
  nextStep?: (authStep: AuthStep) => void;
}

const AuthSteps = ({ activeStep, nextStep, onClose }: AuthStepsProps) => {
  switch (activeStep) {
    case "intro":
      return <IntroCard nextStep={nextStep} />;
    case "email":
      return <EmailForm nextStep={nextStep} />;
    case "waiting":
      return <WaitingForMagicLink nextStep={nextStep} onClose={onClose} />;
    default:
      return <IntroCard nextStep={nextStep} />;
  }
};
