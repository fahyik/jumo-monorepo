import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NutritionInfo } from "./components/nutrition-info";
import { useImageUpload } from "./hooks/useImageUpload";

import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

interface ImageNutritionScreenProps {
  imageUri?: string;
  mimeType?: string;
}

export function ImageNutritionScreen({
  imageUri,
  mimeType,
}: ImageNutritionScreenProps) {
  const styles = useThemedStyles(themedStyles);
  const { nutritionData, isLoading, error } = useImageUpload(
    imageUri,
    mimeType
  );

  if (!imageUri) {
    return (
      <View style={styles.noImageContainer}>
        <Text>No image to display</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Analyzing your food...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}

        {nutritionData && <NutritionInfo data={nutritionData} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  noImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  imageContainer: {
    width: "100%",
    height: "40%",
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    gap: 16,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    textAlign: "center",
    color: colors.textMuted,
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
