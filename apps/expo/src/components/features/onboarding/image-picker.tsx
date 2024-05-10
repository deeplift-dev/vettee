import { useEffect, useState } from "react";
import { Button, Image, Pressable, StyleSheet, View } from "react-native";
// import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import * as ExpoImagePicker from "expo-image-picker";
import { Text } from "@gluestack-ui/themed";
import { Amplify } from "aws-amplify";
import { getUrl, uploadData } from "aws-amplify/storage";

import { BaseButton } from "~/components/ui/buttons/base-button";
import { api } from "~/utils/api";
import amplifyconfig from "../../../amplifyconfiguration.json";

Amplify.configure(amplifyconfig);

interface ImagePickerProps {
  onUploadComplete: (url: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export default function ImagePicker({
  onUploadComplete,
  setIsLoading,
}: ImagePickerProps) {
  const [image, setImage] = useState(null);

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
    });

    await handleImagePicked(result);
  };

  const pickImage = async () => {
    await checkPermissions();
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    await handleImagePicked(result);
  };

  const handleImagePicked = async (
    pickerResult: ExpoImagePicker.ImagePickerResult,
  ) => {
    if (pickerResult.canceled) {
      alert("Upload cancelled");
      return;
    }

    if (!pickerResult.assets?.[0]?.fileName) {
      alert("Issue picking image.");
      return;
    }
    console.log("pickerResult", pickerResult);

    try {
      setIsLoading(true);
      const img = await fetchImageFromUri(pickerResult.assets[0].uri);
      console.log("img", img);
      await uploadImage(pickerResult.assets[0].fileName, img);
      console.log("uploaded image");
      const urlResult = await downloadImage(pickerResult.assets[0].fileName);
      console.log("urlResult", urlResult);
      onUploadComplete(urlResult.url.toString());
    } catch (e) {
      console.log(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (
    filename: string,
    img: Blob | ArrayBufferView | ArrayBuffer | string,
  ) => {
    try {
      const result = await uploadData({
        key: filename,
        data: img,
      }).result;

      return result;
      console.log("Succeeded in uploading: ", result);
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const downloadImage = async (filename: string) => {
    const getUrlResult = await getUrl({
      key: filename,
      options: {
        accessLevel: "guest", // can be 'private', 'protected', or 'guest' but defaults to `guest`
        validateObjectExistence: false, // defaults to false
        expiresIn: 20, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
        // useAccelerateEndpoint: true, // Whether to use accelerate endpoint.
      },
    });

    return getUrlResult;
  };

  const fetchImageFromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const copyToClipboard = () => {
    // Clipboard.setString(image);
    alert("Copied image URL to clipboard");
  };

  return (
    <View className="w-full">
      {image && (
        <View>
          <Text style={styles.result} onPress={copyToClipboard}>
            <Image
              source={{ uri: image }}
              style={{ width: 250, height: 250 }}
            />
          </Text>
          <Text style={styles.info}>Long press to copy the image url</Text>
        </View>
      )}
      <View className="w-full rounded-xl border-2 border-gray-100 bg-white p-1 shadow-sm">
        <Pressable onPress={pickImage}>
          <View className="flex w-full flex-row items-center rounded-lg border border-gray-200 px-4 py-4">
            <Image
              className="h-10 w-10"
              source={require("../../../../assets/illustrations/album.png")}
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
