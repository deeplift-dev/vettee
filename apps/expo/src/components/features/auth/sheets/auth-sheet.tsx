import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { makeRedirectUri } from "expo-auth-session";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Box,
  Button,
  ButtonText,
  Divider,
  HStack,
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

      <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={999}>
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
      height={65}
      rounded="$lg"
      borderWidth={1}
      borderColor="$backgroundLight300"
      onPress={onPress}
    >
      <ButtonText color={textColor ?? "$white"} fontWeight="medium">
        {children}
      </ButtonText>
    </Button>
  );
};

const IntroCard = ({ nextStep }: { nextStep: (step: AuthStep) => void }) => {
  const signInWithFacebook = async () => {
    WebBrowser.maybeCompleteAuthSession(); // required for web only
    const redirectTo = makeRedirectUri();

    const createSessionFromUrl = async (url: string) => {
      const { params, errorCode } = QueryParams.getQueryParams(url);

      if (errorCode) throw new Error(errorCode);
      const { access_token, refresh_token } = params;

      if (!access_token) return;

      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      if (error) throw error;
      return data.session;
    };

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
    });

    const res = await WebBrowser.openAuthSessionAsync(
      data?.url ?? "",
      redirectTo,
    );

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
        <HStack justifyContent="space-between" px="$10">
          <AuthButton onPress={() => router.replace("/(tabs)")}>
            <AntDesign name="apple1" size={24} color="white" />
          </AuthButton>
          <AuthButton
            bg="$blue700"
            textColor="$white"
            onPress={signInWithFacebook}
          >
            <Entypo name="facebook-with-circle" size={24} color="white" />
          </AuthButton>
          <AuthButton bg="$white" textColor="$white">
            <AntDesign name="google" size={24} color="black" />
          </AuthButton>
        </HStack>
        <Divider my="$0.5" />
        <AuthButton
          onPress={() => nextStep("email")}
          bg="$white"
          textColor="$black"
        >
          Continue with Email
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
