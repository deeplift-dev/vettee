import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import {
  Button,
  ButtonText,
  EyeIcon,
  EyeOffIcon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { theme } from "~/styles";
import { api } from "~/utils/api";

export default function LoginForm() {
  const supabase = useSupabaseClient();

  const [showPassword, setShowPassword] = useState(false);
  const handleState = () => setShowPassword(!showPassword);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);

  const { data: profile, refetch: refetchProfile } = api.profile.byId.useQuery(
    { id: "" },
    { enabled: false },
  );

  const createProfileMutation = api.profile.create.useMutation();

  const signInWithPassword = async () => {
    setIsLoading(true);
    const { error, data } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert("There was an issue signing you in", error.message);
      setIsLoading(false);
      return;
    }

    if (isSignUp && data.user) {
      Alert.alert("Check your email for a confirmation link.");
      setIsSignUp(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsGeneratingProfile(true);

      // Refetch profile with the user's ID
      await refetchProfile({ id: data?.user?.id });

      if (!profile) {
        const result = await createProfileMutation.mutateAsync({});

        if (result.error) {
          Alert.alert(
            "There was an issue creating your profile",
            result.error.message,
          );
        }
      }
    } catch (error) {
      console.log(
        "An error occurred",
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsGeneratingProfile(false);
      setIsLoading(false);
    }

    if (data?.user) {
      router.replace("/(tabs)");
    }
  };

  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  return (
    <VStack space="xl">
      <VStack space="xs">
        <Text>{baseUrl}</Text>
        <Text lineHeight="$xs">Email</Text>
        <Input size="xl">
          <InputField
            autoCapitalize="none"
            autoComplete="off"
            type="text"
            onChangeText={setEmail}
            lineHeight="$lg"
          />
        </Input>
      </VStack>
      <VStack space="xs">
        <Text lineHeight="$xs">Password</Text>
        <Input size="xl">
          <InputField
            type={showPassword ? "text" : "password"}
            onChangeText={setPassword}
            lineHeight="$lg"
          />
          <InputSlot pr="$3" onPress={handleState}>
            <InputIcon
              as={showPassword ? EyeIcon : EyeOffIcon}
              color="$darkBlue500"
            />
          </InputSlot>
        </Input>
      </VStack>
      <Button
        onPress={signInWithPassword}
        bg={theme.colors.primary}
        size="xl"
        height={55}
        rounded="$2xl"
        isDisabled={isLoading}
        boxShadow="lg"
      >
        {isLoading ? (
          <ButtonText color="$black">Loading...</ButtonText>
        ) : (
          <ButtonText color="$black">Login</ButtonText>
        )}
      </Button>
    </VStack>
  );
}
