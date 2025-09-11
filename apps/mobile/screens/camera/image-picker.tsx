import * as ExpoImagePicker from "expo-image-picker";
import { StyleSheet, TouchableOpacity } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";

interface ImagePickerProps {
  onImageSelect?: (asset: ExpoImagePicker.ImagePickerAsset) => void;
}

export function ImagePicker({ onImageSelect }: ImagePickerProps) {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onImageSelect?.(result.assets[0]);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pickImage}>
      <IconSymbol name="photo" color={"white"} size={32} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    padding: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "white",
  },
});
