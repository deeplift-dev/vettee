import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, Divider, HStack, Text, View, VStack } from "@gluestack-ui/themed";
import Constants from "expo-constants";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { supabase } from "~/utils/supabase";

export default function Settings() {
  return (
    <View flex={1} flexDirection="column" w="$full">
      <View flex={1} w="$full" p="$4" flexDirection="column">
        <ModalHeading>Profile</ModalHeading>
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
      <VStack w="$full" bg="$gray200" rounded="$lg">
        <MenuItem label="Your details" showIcon={true} onPress={() => router.push("/settings/account-settings")} />
        <Divider />
        <MenuItem label="Logout" showIcon={false} onPress={() => supabase.auth.signOut()} />
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

const MenuItem = ({ label, showIcon = true, iconName = "chevron-forward", onPress }: { label: string; showIcon?: boolean; iconName?: string; onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View mb="$2" borderRadius={10} px="$4" py="$4" w="$full" flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text fontFamily="$mono">{label}</Text>
        {showIcon && <Ionicons name={iconName} size={16} color="black" />}
      </View>
    </TouchableOpacity>
  );
};
