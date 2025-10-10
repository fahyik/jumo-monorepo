import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { NutrientDisplay } from "./nutrient-display";
import { NutrientRow } from "./nutrient-row";

import { Button } from "@/components/ui/button";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

export interface AdjustedNutrition {
  energy: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
}

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
  providerFoodId: string;
  notes: string;
}

interface NutritionInfoProps {
  data: NutritionData;
  imageUri: string;
  onCreateMeal?: (
    nutritionData: NutritionData,
    portionSize: number,
    adjustedNutrition: AdjustedNutrition
  ) => void;
}

const PORTION_MULTIPLIERS = [
  { label: "0.5x", value: 0.5 },
  { label: "Estimated", value: 1 },
  { label: "1.5x", value: 1.5 },
  { label: "2x", value: 2 },
];

export function NutritionInfo({
  data,
  imageUri,
  onCreateMeal,
}: NutritionInfoProps) {
  const styles = useThemedStyles(themedStyles);
  const [multiplier, setMultiplier] = useState(1);

  // Calculate adjusted nutrition based on user's portion size
  const userPortionSize = data.estimatedPortionSize * multiplier;
  const ratio = multiplier;

  const adjustedNutrition = {
    energy: Math.round(data.totalNutritionForEstimatedPortion.energy * ratio),
    carbohydrates:
      Math.round(
        data.totalNutritionForEstimatedPortion.carbohydrates * ratio * 10
      ) / 10,
    proteins:
      Math.round(data.totalNutritionForEstimatedPortion.proteins * ratio * 10) /
      10,
    fats:
      Math.round(data.totalNutritionForEstimatedPortion.fats * ratio * 10) / 10,
  };

  const handleCreateNewMeal = () => {
    onCreateMeal?.(data, userPortionSize, adjustedNutrition);
  };

  const handleAddToExistingMeal = () => {
    console.log("Add to existing meal", {
      portionSize: userPortionSize,
      nutrition: adjustedNutrition,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{data.name}</Text>
        </View>
        <Image source={{ uri: imageUri }} style={styles.headerImage} />
      </View>
      <Text style={styles.description}>{data.description}</Text>

      <NutrientDisplay
        title="Nutrition per 100g"
        description={
          <View style={styles.notesSection}>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        }
        nutrition={{
          energy: data.nutritionPer100g.energy,
          carbohydrates: data.nutritionPer100g.carbohydrates,
          proteins: data.nutritionPer100g.proteins,
          fats: data.nutritionPer100g.fats,
        }}
      />

      <View style={styles.portionSection}>
        <Text style={styles.sectionTitle}>Your Portion</Text>
        <Text style={styles.notesText}>
          Adjust your portion size if you think the estimate is inaccurate.
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
                {data.estimatedPortionSize * option.value}
                {data.estimatedPortionSizeUnit}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <NutrientRow nutrition={adjustedNutrition} />
      </View>

      <View style={styles.buttonContainer}>
        <Button variant="primary" onPress={handleCreateNewMeal}>
          Create a new meal
        </Button>

        <Button variant="secondary" onPress={handleAddToExistingMeal}>
          Add to an existing meal
        </Button>
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
    backgroundColor: colors.background,
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
