import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";

import ProfileHeader from "~/components/ui/headers/profile-header";
import { PageContainer } from "~/components/ui/page-container";
import Text from "~/components/ui/text";

const SettingsPage = () => {
  return (
    <PageContainer>
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home", headerShown: false }} />
      <View className="h-full w-full">
        <ProfileHeader />
        <PageHeader />
      </View>
    </PageContainer>
  );
};

const PageHeader = () => {
  return (
    <View className="py-6 px-4">
      <Text variant={"title"} className="text-gray-300">
        Profile
      </Text>
    </View>
  );
};

export default SettingsPage;
