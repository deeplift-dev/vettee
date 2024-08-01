import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import {
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

import { BaseButton } from "~/components/ui/buttons/base-button";
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

    if (data?.user) {
      router.replace("/(tabs)");
    }
  };

  return (
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
      <BaseButton disabled={isLoading} onPress={signInWithPassword}>
        Login
      </BaseButton>
      {/* <Button
        onPress={signInWithPassword}
        bg={"$black"}
        size="xl"
        height={55}
        rounded="$2xl"
        borderWidth={1}
        borderColor="$backgroundLight300"
        isDisabled={isLoading}
      >
        {isLoading ? (
          <Text color="$white">Loading...</Text>
        ) : (
          <Text color="$white">Login</Text>
        )}
      </Button> */}
    </VStack>
  );
}
