import { useCallback, useRef, useState } from "react";
import { Image, Pressable, View } from "react-native";
import Constants from "expo-constants";
import * as ExpoImagePicker from "expo-image-picker";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { Skeleton } from "~/components/ui/skeleton";
import Text from "~/components/ui/text";
import { downloadPresignedUrl, uploadImage } from "~/utils/helpers/images";

export const useCameraTool = () => {
  const urlResultRef = useRef<string | null>(null);
  const urlResultPromiseRef = useRef<Promise<string | null> | null>(null);
  const urlResultResolveRef = useRef<((value: string | null) => void) | null>(
    null,
  );

  const resetState = useCallback(() => {
    urlResultRef.current = null;
    urlResultPromiseRef.current = null;
    urlResultResolveRef.current = null;
  }, []);

  const handleUrlResult = useCallback((result: string) => {
    console.log("handleUrlResult called with:", result);
    urlResultRef.current = result;
    if (urlResultResolveRef.current) {
      urlResultResolveRef.current(result);
    }
  }, []);

  const cameraToolObject = {
    description: "Use the camera to take a photo",
    parameters: z.object({}),
    render: async function* () {
      console.log("Rendering CameraToolComponent");
      yield <CameraToolComponent handleUrlResult={handleUrlResult} />;

      console.log("Waiting for urlResult to be set");
      if (!urlResultRef.current) {
        urlResultPromiseRef.current = new Promise((resolve) => {
          urlResultResolveRef.current = resolve;
        });
        yield urlResultPromiseRef.current;
      }

      const urlResult = urlResultRef.current;
      console.log("urlResult set:", urlResult);

      // Reset the state for the next use
      resetState();

      return {
        data: {
          type: "image_url",
          image_url: {
            url: urlResult,
          },
        },
        component: urlResult ? (
          <View>
            <Image
              source={{ uri: urlResult }}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>
        ) : (
          <Text>Failed to upload image. Please try again.</Text>
        ),
      };
    },
  };

  return { cameraToolObject };
};

const CameraToolComponent = ({
  handleUrlResult,
}: {
  handleUrlResult: (result: string) => void;
}) => {
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);

  const checkPermissions = async () => {
    console.log("Checking permissions");
    if (Constants?.platform?.ios) {
      const cameraRollStatus =
        await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus =
        await ExpoImagePicker.requestCameraPermissionsAsync();
      console.log("Camera roll status:", cameraRollStatus.status);
      console.log("Camera status:", cameraStatus.status);
      if (
        cameraRollStatus.status !== "granted" ||
        cameraStatus.status !== "granted"
      ) {
        alert("Sorry, we need these permissions to make this work!");
      }
    }
  };

  const handleImagePicked = async (
    pickerResult: ExpoImagePicker.ImagePickerResult,
  ) => {
    console.log("Image picked:", pickerResult);
    if (!pickerResult.assets?.[0]?.uri) {
      console.log("No image URI found");
      return;
    }

    try {
      setIsLoading(true);
      const img = await fetchImageFromUri(pickerResult.assets[0].uri);
      const fileExtension = pickerResult.assets[0].uri.split(".").pop();
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;

      console.log("Uploading image:", uniqueFileName);
      await uploadImage(supabase, "chat-images", uniqueFileName, img);
      console.log("Image uploaded successfully");

      const urlResult = await downloadPresignedUrl(
        supabase,
        uniqueFileName,
        "chat-images",
      );

      if (!urlResult) throw new Error("Failed to get public URL");

      console.log("Public URL obtained:", urlResult);
      handleUrlResult(urlResult);
    } catch (e) {
      console.error("Error in handleImagePicked:", e);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImageFromUri = async (uri: string) => {
    console.log("Fetching image from URI:", uri);
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    return arrayBuffer;
  };

  const takePhoto = async () => {
    console.log("Taking photo");
    await checkPermissions();
    const result = await ExpoImagePicker.launchCameraAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      base64: true,
    });

    console.log("Camera result:", result);
    await handleImagePicked(result);
  };

  const pickImage = async () => {
    console.log("Picking image from library");
    await checkPermissions();
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log("Image picker result:", result);
    await handleImagePicked(result);
  };

  if (isLoading) {
    return <Skeleton style={{ width: 200, height: 200 }} />;
  }

  return (
    <View className="w-full">
      <View className="w-full rounded-xl border-2 border-gray-100 bg-white p-1 shadow-sm">
        <Pressable onPress={pickImage} disabled={isLoading}>
          <View className="flex w-full flex-row items-center rounded-lg border border-gray-200 px-4 py-4">
            <Image
              className="h-10 w-10"
              source={require("../../../../../assets/illustrations/album.png")}
              alt="Album icon"
            />
            <Text className="pl-2 font-mono">Pick image from camera roll</Text>
          </View>
        </Pressable>
      </View>
      <View className="py-2" />
      <View className="rounded-xl border-2 border-gray-100 bg-white p-1 shadow-sm">
        <Pressable onPress={takePhoto} disabled={isLoading}>
          <View className="flex w-full flex-row items-center rounded-lg border border-gray-200 px-4 py-4">
            <Image
              className="h-10 w-10"
              source={require("../../../../../assets/illustrations/camera.png")}
              alt="Camera icon"
            />
            <Text className="pl-2 font-mono">Take a photo</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
