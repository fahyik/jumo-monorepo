import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";

interface NutritionData {
  name: string;
  description: string;
  nutritionPer100g: {
    carbohydrates: number;
    carbohydratesUnit: string;
    proteins: number;
    proteinsUnit: string;
    fats: number;
    fatsUnit: string;
    energy: number;
    energyUnit: string;
  };
  estimatedPortionSize: number;
  estimatedPortionSizeUnit: string;
  totalNutritionForEstimatedPortion: {
    carbohydrates: number;
    carbohydratesUnit: string;
    proteins: number;
    proteinsUnit: string;
    fats: number;
    fatsUnit: string;
    energy: number;
    energyUnit: string;
  };
  notes: string;
}

interface UploadResponse {
  success: boolean;
  data: NutritionData;
  reason?: string;
}

export default function ModalImage() {
  const { imageUri, mimeType } = useLocalSearchParams<{ imageUri: string; mimeType?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async () => {
    if (!imageUri) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: mimeType ?? "image/jpeg",
        name: "image",
      } as any);

      const token = (await supabase.auth.getSession()).data.session
        ?.access_token;

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/upload-photo`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: UploadResponse = await response.json();

      if (result.success) {
        setNutritionData(result.data);
      } else {
        setError(result.reason || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (imageUri) {
      uploadImage();
    }
  }, [imageUri]);

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

        {nutritionData && (
          <View style={{ gap: 16 }}>
            <View>
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}
              >
                {nutritionData.name}
              </Text>
              <Text style={{ fontSize: 16, color: "#666", lineHeight: 22 }}>
                {nutritionData.description}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "#f5f5f5",
                padding: 16,
                borderRadius: 8,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}
              >
                Nutrition per 100g
              </Text>
              <View style={{ gap: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Energy:</Text>
                  <Text style={{ fontWeight: "500" }}>
                    {nutritionData.nutritionPer100g.energy}{" "}
                    {nutritionData.nutritionPer100g.energyUnit}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Carbohydrates:</Text>
                  <Text style={{ fontWeight: "500" }}>
                    {nutritionData.nutritionPer100g.carbohydrates}{" "}
                    {nutritionData.nutritionPer100g.carbohydratesUnit}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Proteins:</Text>
                  <Text style={{ fontWeight: "500" }}>
                    {nutritionData.nutritionPer100g.proteins}{" "}
                    {nutritionData.nutritionPer100g.proteinsUnit}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Fats:</Text>
                  <Text style={{ fontWeight: "500" }}>
                    {nutritionData.nutritionPer100g.fats}{" "}
                    {nutritionData.nutritionPer100g.fatsUnit}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#e8f5e8",
                padding: 16,
                borderRadius: 8,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}
              >
                Estimated Portion ({nutritionData.estimatedPortionSize}
                {nutritionData.estimatedPortionSizeUnit})
              </Text>
              <View style={{ gap: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Energy:</Text>
                  <Text style={{ fontWeight: "500" }}>
                    {nutritionData.totalNutritionForEstimatedPortion.energy}{" "}
                    {nutritionData.totalNutritionForEstimatedPortion.energyUnit}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Carbohydrates:</Text>
                  <Text style={{ fontWeight: "500" }}>
                    {
                      nutritionData.totalNutritionForEstimatedPortion
                        .carbohydrates
                    }{" "}
                    {
                      nutritionData.totalNutritionForEstimatedPortion
                        .carbohydratesUnit
                    }
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Proteins:</Text>
                  <Text style={{ fontWeight: "500" }}>
                    {nutritionData.totalNutritionForEstimatedPortion.proteins}{" "}
                    {
                      nutritionData.totalNutritionForEstimatedPortion
                        .proteinsUnit
                    }
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Fats:</Text>
                  <Text style={{ fontWeight: "500" }}>
                    {nutritionData.totalNutritionForEstimatedPortion.fats}{" "}
                    {nutritionData.totalNutritionForEstimatedPortion.fatsUnit}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#fff3e0",
                padding: 16,
                borderRadius: 8,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}
              >
                Notes
              </Text>
              <Text style={{ fontSize: 14, color: "#666", lineHeight: 20 }}>
                {nutritionData.notes}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
