import { useLocalSearchParams } from "expo-router";

import { FoodPhotoScreen } from "@/screens/food-input/food-photo-screen";

export default function Photo() {
  const { imageUri, mimeType } = useLocalSearchParams<{
    imageUri: string;
    mimeType?: string;
  }>();

  return <FoodPhotoScreen imageUri={imageUri} mimeType={mimeType} />;
}
