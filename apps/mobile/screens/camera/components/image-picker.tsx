import * as ExpoImagePicker from "expo-image-picker";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Landscape } from "@/assets/icons/landscape";

interface ImagePickerProps {
  onImageSelect?: (asset: ExpoImagePicker.ImagePickerAsset) => void;
}

export function ImagePicker({ onImageSelect }: ImagePickerProps) {
  const pickImage = async () => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: false,
      exif: true,
    });

    if (!result.canceled) {
      onImageSelect?.(result.assets[0]);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pickImage}>
      <Landscape fill="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    padding: 4,
  },
});
