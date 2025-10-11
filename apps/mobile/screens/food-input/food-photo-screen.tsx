import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FoodInput } from "./food-input";
import { useImageUpload } from "./hooks/use-image-upload";

import { BouncingText } from "@/components/bouncing-text";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

interface FoodPhotoScreenProps {
  imageUri?: string;
  mimeType?: string;
}

export function FoodPhotoScreen({ imageUri, mimeType }: FoodPhotoScreenProps) {
  const styles = useThemedStyles(themedStyles);

  const { nutritionData, isLoading, error } = useImageUpload(
    imageUri,
    mimeType
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <BouncingText text="cracking..." withLogo />
      </View>
    );
  }

  if (error || nutritionData === null) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error ? error : "An error occurred"}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <FoodInput providerFoodData={nutritionData}></FoodInput>
    </SafeAreaView>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
}));
