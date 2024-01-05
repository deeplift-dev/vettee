import React, { useState } from "react";
import { Text, View } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Stack } from "expo-router";

import { HomeHeader } from "~/components/ui/headers/dashboard-header";
import { PageContainer } from "~/components/ui/page-container";
import { BaseButton as Button} from "~/components/ui/buttons/base-button";

const CameraPage = () => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (permission?.granted === false) {
    return (
      <PageContainer>
        <View className="h-full w-full justify-center">
          <Text>No access to camera</Text>
          <Button variant="primary" onPress={() => requestPermission()}>Allow access</Button>
        </View>
      </PageContainer>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  }

  return (
    <PageContainer>
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home", headerShown: false }} />
      <View className="h-full w-full">
        <Camera type={type} />
      </View>
    </PageContainer>
  );
};

export default CameraPage;
