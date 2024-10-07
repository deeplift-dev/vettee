import React from "react";
import { Alert, SafeAreaView } from "react-native";
import { router } from "expo-router";
import {
  Box,
  Button,
  Center,
  Divider,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";
import { supabase } from "~/utils/supabase";
import { ModalHeading } from ".";

export default function AccountSettings() {
  const { session } = useSessionContext();

  const {
    data: profileData,
    isLoading: loadingProfile,
    error: profileError,
  } = api.profile.byId.useQuery(
    { id: session?.user?.id },
    { enabled: !!session?.user },
  );

  const { mutate: deleteProfile, isLoading: deletingProfile } =
    api.profile.deleteProfile.useMutation({
      onSuccess: () => {
        supabase.auth.signOut();
        router.replace("/");
      },
      onError: (error) => {
        console.error("Error deleting profile:", error);
        Alert.alert("Error", "Failed to delete profile. Please try again.");
      },
    });

  const profile = profileData?.[0];

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteProfile();
          },
        },
      ],
    );
  };

  if (loadingProfile) {
    return (
      <Center flex={1}>
        <Text>Loading...</Text>
      </Center>
    );
  }

  if (profileError || !profile) {
    return (
      <Center flex={1}>
        <Text>Error loading profile. Please try again.</Text>
      </Center>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <VStack space="xl" p="$4">
          <ModalHeading>Account Details</ModalHeading>
          <VStack space="md" bg="$gray100" p="$4" borderRadius="$lg">
            <Box mb="$4">
              <Text fontWeight="$bold" fontSize="$lg" color="$gray700">
                Email
              </Text>
              <Text fontSize="$md" color="$gray900">
                {profile.email}
              </Text>
            </Box>
            <Box mb="$4">
              <Text fontWeight="$bold" fontSize="$lg" color="$gray700">
                Name
              </Text>
              <Text
                fontSize="$md"
                color="$gray900"
              >{`${profile.firstName ?? ""} ${profile.lastName ?? ""}`}</Text>
            </Box>
            {profile.mobileNumber && (
              <Box mb="$4">
                <Text fontWeight="$bold" fontSize="$lg" color="$gray700">
                  Mobile Number
                </Text>
                <Text fontSize="$md" color="$gray900">
                  {profile.mobileNumber}
                </Text>
              </Box>
            )}
            <Box mb="$4">
              <Text fontWeight="$bold" fontSize="$lg" color="$gray700">
                Joined
              </Text>
              <Text fontSize="$md" color="$gray900">
                {new Date(profile.createdAt).toLocaleDateString()}
              </Text>
            </Box>
          </VStack>
          <Divider my="$4" />
          <Button
            rounded="$2xl"
            size="xl"
            backgroundColor="$red600"
            w="$full"
            onPress={handleDeleteAccount}
            isDisabled={deletingProfile}
          >
            <Text fontFamily="$mono" color="white" fontWeight="$bold">
              Delete Account
            </Text>
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
