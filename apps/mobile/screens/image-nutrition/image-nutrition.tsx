import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NutritionInfo } from "./components/NutritionInfo";
import { useImageUpload } from "./hooks/useImageUpload";

interface ImageNutritionScreenProps {
  imageUri?: string;
  mimeType?: string;
}

export function ImageNutritionScreen({ imageUri, mimeType }: ImageNutritionScreenProps) {
  const { nutritionData, isLoading, error } = useImageUpload(imageUri, mimeType);

  if (!imageUri) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No image to display</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "transparent",
        paddingHorizontal: 16,
        paddingTop: 24,
        gap: 16,
      }}
    >
      <View
        style={{
          width: "100%",
          height: "40%",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </View>

      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          gap: 16,
        }}
      >
        {isLoading && (
          <View style={{ alignItems: "center", padding: 20 }}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 10, textAlign: "center" }}>
              Analyzing your food...
            </Text>
          </View>
        )}

        {error && (
          <View
            style={{ padding: 16, backgroundColor: "#ffebee", borderRadius: 8 }}
          >
            <Text style={{ color: "#c62828", textAlign: "center" }}>
              Error: {error}
            </Text>
          </View>
        )}

        {nutritionData && <NutritionInfo data={nutritionData} />}
      </ScrollView>
    </SafeAreaView>
  );
}
