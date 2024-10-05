import { Pressable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from "expo-constants";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Box, Divider, HStack, Text, View, VStack } from "@gluestack-ui/themed";

import { supabase } from "~/utils/supabase";

export default function Settings() {
  return (
    <View flex={1} flexDirection="column" w="$full">
      <View flex={1} w="$full" p="$4" flexDirection="column">
        <ModalHeading>Settings</ModalHeading>
        <SettingsMenus />
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const SettingsMenus = () => {
  const version = Constants?.expoConfig?.version;

  return (
    <VStack w="$full" h="$4/5" justifyContent="space-between">
      <VStack w="$full" bg="$blueGray200" rounded="$lg">
        <TouchableOpacity
          onPress={() => router.push("/settings/account-settings")}
        >
          <View mb="$2" borderRadius={10} px="$4" py="$4" w="$full">
            <Text w="$full" fontFamily="$mono">
              Account
            </Text>
          </View>
        </TouchableOpacity>
        <Divider />
        <View mb="$2" px="$4" py="$4" w="$full">
          <Text w="$full" fontFamily="$mono">
            Security & Privacy
          </Text>
        </View>
        <Divider />
        <TouchableOpacity onPress={() => supabase.auth.signOut()}>
          <View px="$4" py="$4" w="$full">
            <Text w="$full" fontFamily="$mono">
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </VStack>
      <Box>
        <Text w="$full" size="xs" textAlign="center">
          Version {version}
        </Text>
      </Box>
    </VStack>
  );
};

interface ModalHeadingProps {
  children: React.ReactNode;
}

export const ModalHeading = ({ children }: ModalHeadingProps) => {
  return (
    <HStack justifyContent="space-between" alignItems="center" mb="$6">
      <Text size="3xl" color="$black" fontFamily="$mono">
        {children}
      </Text>
      <Pressable onPress={() => router.back()}>
        <Text color="$blue500" fontWeight="$medium" fontFamily="$mono">
          Close
        </Text>
      </Pressable>
    </HStack>
  );
};
