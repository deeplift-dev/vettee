import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import * as ExpoImagePicker from "expo-image-picker";
// import * as Clipboard from "expo-clipboard";
import { Text } from "@gluestack-ui/themed";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Amplify } from "aws-amplify";

import { downloadPresignedUrl, uploadImage } from "~/utils/helpers/images";
import amplifyconfig from "../../../amplifyconfiguration.json";

Amplify.configure(amplifyconfig);

interface ImagePickerProps {
  onUploadComplete: (params: { fileName: string; url: string }) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export default function ImagePicker({
  onUploadComplete,
  setIsLoading,
}: ImagePickerProps) {
  const [image, setImage] = useState(null);

  const supabase = useSupabaseClient();

  const checkPermissions = async () => {
    if (Constants?.platform?.ios) {
      const cameraRollStatus =
        await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus =
        await ExpoImagePicker.requestCameraPermissionsAsync();
      if (
        cameraRollStatus.status !== "granted" ||
        cameraStatus.status !== "granted"
      ) {
        alert("Sorry, we need these permissions to make this work!");
      }
    }
  };

  const takePhoto = async () => {
    await checkPermissions();
    const result = await ExpoImagePicker.launchCameraAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      base64: true,
    });

    await handleImagePicked(result);
  };

  const pickImage = async () => {
    await checkPermissions();
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    await handleImagePicked(result);
  };

  const handleImagePicked = async (
    pickerResult: ExpoImagePicker.ImagePickerResult,
  ) => {
    if (!pickerResult.assets?.[0]?.fileName) {
      alert("Issue picking image.");
      return;
    }

    try {
      setIsLoading(true);
      const img = await fetchImageFromUri(pickerResult.assets[0].uri);
      await uploadImage(
        supabase,
        "animal-profiles",
        pickerResult.assets[0].fileName,
        img,
      );
      const urlResult = await downloadPresignedUrl(
        supabase,
        pickerResult.assets[0].fileName,
        "animal-profiles",
      );

      if (!urlResult) throw new Error("Failed to get public URL");

      onUploadComplete({
        fileName: pickerResult.assets[0].fileName,
        url: urlResult,
      });
    } catch (e) {
      console.log(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImageFromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    return arrayBuffer;
  };

  return (
    <View className="w-full">
      <View className="w-full rounded-xl border-2 border-gray-100 bg-white p-1 shadow-sm">
        <Pressable onPress={pickImage}>
          <View className="flex w-full flex-row items-center rounded-lg border border-gray-200 px-4 py-4">
            <Image
              className="h-10 w-10"
              source={require("../../../../assets/illustrations/album.png")}
              alt="Album icon"
            />
            <Text pl="$2" fontFamily="$mono">
              Pick image from camera roll
            </Text>
          </View>
        </Pressable>
      </View>
      <View className="py-2" />
      <View className="rounded-xl border-2 border-gray-100 bg-white p-1 shadow-sm">
        <Pressable onPress={takePhoto}>
          <View className="flex w-full flex-row items-center rounded-lg border border-gray-200 px-4 py-4">
            <Image
              className="h-10 w-10"
              source={require("../../../../assets/illustrations/camera.png")}
              alt="Camera icon"
            />
            <Text pl="$2" fontFamily="$mono">
              Take a photo
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    marginHorizontal: 15,
  },
  percentage: {
    marginBottom: 10,
  },
  result: {
    paddingTop: 5,
  },
  info: {
    textAlign: "center",
    marginBottom: 20,
  },
});
