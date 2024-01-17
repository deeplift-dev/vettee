import { useState } from "react";
import { Alert, Platform } from "react-native";
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
  KeyboardAvoidingView,
  set,
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

  const signInWithPassword = async () => {
    setIsLoading(true);
    const { error, data } = isSignUp
      ? await supabase.auth.signUp({
          email,
          password,
        })
      : await supabase.auth.signInWithPassword({
          email,
          password,
        });
    if (error) Alert.alert("There was an issue signing you in", error.message);
    else if (isSignUp && data.user) {
      Alert.alert("Check your email for a confirmation link.");
      setIsSignUp(false);
    }
    setIsLoading(false);
    setIsGeneratingProfile(true);

    console.log("made it to before call");
    const { data: profile } = await api.profile.byId.useQuery({
      id: data?.user?.id,
    });

    console.log("made it to after call");
    console.log("profile", profile);

    if (!profile) {
      const { error: profileError } = await api.profile.create.useMutation({
        id: data?.user?.id,
        input: {
          id: data?.user?.id,
          username: data?.user?.email,
          avatar: data?.user?.avatar_url,
        },
      });
      if (profileError) {
        Alert.alert("There was an issue creating your profile", error.message);
      }
    }

    setIsGeneratingProfile(false);

    if (data?.user) {
      router.replace("/(tabs)");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={300}
    >
      <VStack space="xl">
        <VStack space="xs">
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
          rounded="$full"
          isDisabled={isLoading}
          boxShadow="lg"
        >
          <ButtonText color="$black">Login</ButtonText>
        </Button>
      </VStack>
    </KeyboardAvoidingView>
  );
}
