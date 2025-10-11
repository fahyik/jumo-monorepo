import { useEffect, useMemo, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { AddToExistingMealButton } from "./add-to-existing-meal-button";
import { CreateMealButton } from "./create-meal-button";
import { NutrientDisplay } from "./nutrient-display";
import { NutrientRow } from "./nutrient-row";

import { ProviderFood } from "@jumo-monorepo/interfaces";

import { supabase } from "@/lib/supabase";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

export interface AdjustedNutrition {
  energy: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
}

interface NutritionInfoProps {
  data: ProviderFood;
}

export function NutritionInfo({ data }: NutritionInfoProps) {
  const styles = useThemedStyles(themedStyles);
  const [multiplier, setMultiplier] = useState(1);
  const [imageUri, setImageUri] = useState<string>("");

  const PORTION_MULTIPLIERS = useMemo(
    () => [
      { label: "0.5x", value: 0.5 },
      { label: data.provider !== "OFF" ? "Estimated" : "1x", value: 1 },
      { label: "1.5x", value: 1.5 },
      { label: "2x", value: 2 },
    ],
    [data.provider]
  );

  useEffect(() => {
    const fetchImageUri = async () => {
      if (data.foodData.image.type === "external") {
        setImageUri(data.foodData.image.url);
      } else if (data.foodData.image.type === "storage") {
        const { data: imageUrl } = await supabase.storage
          .from(data.foodData.image.bucket)
          .getPublicUrl(data.foodData.image.path);

        if (imageUrl?.publicUrl) {
          setImageUri(imageUrl.publicUrl);
        }
      }
    };

    fetchImageUri();
  }, [data.foodData.image]);

  // Calculate adjusted nutrition based on user's portion size
  const userPortionSize = data.foodData.servingSize * multiplier;
  const ratio = multiplier;

  const energyPer100g =
    data.foodData.nutrients.find((n) => n.id === "energy")?.amount ?? 0;
  const proteinsPer100g =
    data.foodData.nutrients.find((n) => n.id === "protein")?.amount ?? 0;
  const fatsPer100g =
    data.foodData.nutrients.find((n) => n.id === "fat")?.amount ?? 0;
  const carbsPer100g =
    data.foodData.nutrients.find((n) => n.id === "carbohydrate")?.amount ?? 0;

  const adjustedNutrition = {
    energy: Math.round(((energyPer100g * userPortionSize) / 100) * 100) / 100,
    carbohydrates: Math.round(((carbsPer100g * userPortionSize) / 100) * 100) / 100,
    proteins: Math.round(((proteinsPer100g * userPortionSize) / 100) * 100) / 100,
    fats: Math.round(((fatsPer100g * userPortionSize) / 100) * 100) / 100,
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{data.foodData.name}</Text>
          <Text style={styles.description}>{data.foodData.description}</Text>
        </View>
        <Image source={{ uri: imageUri }} style={styles.headerImage} />
      </View>

      <NutrientDisplay
        title="Nutrition per 100g"
        description={
          data.foodData.notes ? (
            <View style={styles.notesSection}>
              <Text style={styles.notesText}>{data.foodData.notes}</Text>
            </View>
          ) : null
        }
        nutrition={{
          energy: energyPer100g,
          carbohydrates: carbsPer100g,
          proteins: proteinsPer100g,
          fats: fatsPer100g,
        }}
      />

      <View style={styles.portionSection}>
        <Text style={styles.sectionTitle}>Your Portion</Text>
        <Text style={styles.notesText}>
          Adjust your portion size if you think it is inaccurate.
        </Text>

        <View style={styles.portionButtons}>
          {PORTION_MULTIPLIERS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.portionButton,
                multiplier === option.value && styles.portionButtonSelected,
              ]}
              onPress={() => setMultiplier(option.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.portionButtonText,
                  multiplier === option.value &&
                    styles.portionButtonTextSelected,
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  styles.portionButtonSubtext,
                  multiplier === option.value &&
                    styles.portionButtonSubtextSelected,
                ]}
              >
                {data.foodData.servingSize * option.value}
                {data.foodData.servingSizeUnit}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <NutrientRow nutrition={adjustedNutrition} />
      </View>

      <View style={styles.buttonContainer}>
        <CreateMealButton
          nutritionData={data}
          portionSize={userPortionSize}
          adjustedNutrition={adjustedNutrition}
        />

        <AddToExistingMealButton
          nutritionData={data}
          portionSize={userPortionSize}
          adjustedNutrition={adjustedNutrition}
        />
      </View>
    </View>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    gap: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerImage: {
    width: "25%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  description: {
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 22,
  },
  portionSection: {
    backgroundColor: colors.backgroundMuted,
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  portionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  portionButton: {
    flex: 1,
    backgroundColor: colors.oppositeForeground,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
  },
  portionButtonSelected: {
    backgroundColor: colors.tint,
  },
  portionButtonText: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.textMuted,
  },
  portionButtonTextSelected: {
    color: colors.background,
  },
  portionButtonSubtext: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  portionButtonSubtextSelected: {
    color: colors.background,
    opacity: 0.8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  nutrientList: {
    gap: 8,
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nutrientLabel: {
    color: colors.text,
  },
  nutrientValue: {
    fontWeight: "500",
    color: colors.text,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.text,
  },
  notesSection: { paddingVertical: 8 },
  notesText: {
    fontSize: 12,
    lineHeight: 12,
    color: colors.textMuted,
  },
  buttonContainer: {
    gap: 12,
  },
}));
