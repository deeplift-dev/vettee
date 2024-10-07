import { Text } from "@gluestack-ui/themed";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Amplify } from "aws-amplify";
import Constants from "expo-constants";
import * as ExpoImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { downloadPresignedUrl, uploadImage } from "~/utils/helpers/images";
import amplifyconfig from "../../../amplifyconfiguration.json";

Amplify.configure(amplifyconfig);

interface ImagePickerProps {
  onUploadComplete: (params: { fileName: string; url: string }) => void;
  setIsLoading?: (isLoading: boolean) => void;
}

export default function ImagePicker({
  onUploadComplete,
  setIsLoading,
}: ImagePickerProps) {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
    if (!pickerResult.assets?.[0]?.uri) {
      return;
    }

    try {
      setIsUploading(true);
      const img = await fetchImageFromUri(pickerResult.assets[0].uri);
      const fileExtension = pickerResult.assets[0].uri.split(".").pop();
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;

      await uploadImage(supabase, "animal-profiles", uniqueFileName, img);
      const urlResult = await downloadPresignedUrl(
        supabase,
        uniqueFileName,
        "animal-profiles",
      );

      if (!urlResult) throw new Error("Failed to get public URL");

      onUploadComplete({
        fileName: uniqueFileName,
        url: urlResult,
      });
    } catch (e) {
      console.log(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchImageFromUri = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    return arrayBuffer;
  };

  return (
    <View className="w-full">
      <View className="w-full p-1">
        <Pressable onPress={pickImage} disabled={isUploading}>
          <View className="flex w-full flex-row items-center rounded-lg border bg-white border-gray-200 px-4 py-4">
            {isUploading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Image
                className="h-10 w-10"
                source={require("../../../../assets/illustrations/album.png")}
                alt="Album icon"
              />
            )}
            <Text pl="$2" fontFamily="$mono">
              Pick image from camera roll
            </Text>
          </View>
        </Pressable>
      </View>
      <View className="rounded-xl p-1">
        <Pressable onPress={takePhoto} disabled={isUploading}>
          <View className="flex w-full flex-row items-center rounded-lg bg-white border border-gray-200 px-4 py-4">
            {isUploading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Image
                className="h-10 w-10"
                source={require("../../../../assets/illustrations/camera.png")}
                alt="Camera icon"
              />
            )}
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