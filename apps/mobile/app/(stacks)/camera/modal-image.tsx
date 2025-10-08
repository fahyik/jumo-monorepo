import { useLocalSearchParams } from "expo-router";

import { ImageNutritionScreen } from "@/screens/image-nutrition/image-nutrition";

export default function ModalImage() {
  const { imageUri, mimeType } = useLocalSearchParams<{
    imageUri: string;
    mimeType?: string;
  }>();

  return <ImageNutritionScreen imageUri={imageUri} mimeType={mimeType} />;
}
