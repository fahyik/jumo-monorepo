import { useState } from "react";
import { Image, Text, TextInput, View } from "react-native";

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

export function NutritionInfo({
  data,
  imageUri,
  onCreateMeal,
}: NutritionInfoProps) {
  const styles = useThemedStyles(themedStyles);
  const [portionSize, setPortionSize] = useState(
    data.estimatedPortionSize.toString()
  );

  // Calculate adjusted nutrition based on user's portion size
  const userPortionSize = parseFloat(portionSize) || data.estimatedPortionSize;
  const ratio = userPortionSize / data.estimatedPortionSize;

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

      <View style={styles.section}>
        <Text style={[styles.sectionTitle]}>Nutrition per 100g</Text>
        <View style={styles.notesSection}>
          <Text style={styles.notesText}>{data.notes}</Text>
        </View>

        <View style={styles.nutrientList}>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Energy:</Text>
            <Text style={styles.nutrientValue}>
              {data.nutritionPer100g.energy} {data.nutritionPer100g.energyUnit}
            </Text>
          </View>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Carbohydrates:</Text>
            <Text style={styles.nutrientValue}>
              {data.nutritionPer100g.carbohydrates}{" "}
              {data.nutritionPer100g.carbohydratesUnit}
            </Text>
          </View>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Proteins:</Text>
            <Text style={styles.nutrientValue}>
              {data.nutritionPer100g.proteins}{" "}
              {data.nutritionPer100g.proteinsUnit}
            </Text>
          </View>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Fats:</Text>
            <Text style={styles.nutrientValue}>
              {data.nutritionPer100g.fats} {data.nutritionPer100g.fatsUnit}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.portionSection}>
        <View style={styles.portionHeaderRow}>
          <Text style={styles.sectionTitle}>Your Portion</Text>
          <View style={styles.portionInputContainer}>
            <TextInput
              style={styles.portionInput}
              value={portionSize}
              onChangeText={setPortionSize}
              keyboardType="decimal-pad"
              selectTextOnFocus
            />
            <Text style={styles.portionUnit}>
              {data.estimatedPortionSizeUnit}
            </Text>
          </View>
        </View>
        <View style={styles.nutrientList}>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Energy:</Text>
            <Text style={styles.nutrientValue}>
              {adjustedNutrition.energy}{" "}
              {data.totalNutritionForEstimatedPortion.energyUnit}
            </Text>
          </View>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Carbohydrates:</Text>
            <Text style={styles.nutrientValue}>
              {adjustedNutrition.carbohydrates}{" "}
              {data.totalNutritionForEstimatedPortion.carbohydratesUnit}
            </Text>
          </View>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Proteins:</Text>
            <Text style={styles.nutrientValue}>
              {adjustedNutrition.proteins}{" "}
              {data.totalNutritionForEstimatedPortion.proteinsUnit}
            </Text>
          </View>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Fats:</Text>
            <Text style={styles.nutrientValue}>
              {adjustedNutrition.fats}{" "}
              {data.totalNutritionForEstimatedPortion.fatsUnit}
            </Text>
          </View>
        </View>
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
  section: {
    backgroundColor: colors.backgroundMuted,
    padding: 16,
    borderRadius: 8,
  },
  portionSection: {
    backgroundColor: colors.backgroundMuted,
    padding: 16,
    borderRadius: 8,
  },
  portionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  portionInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  portionInput: {
    backgroundColor: "white",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    fontWeight: "600",
    minWidth: 60,
    textAlign: "center",
    color: colors.text,
  },
  portionUnit: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
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
    color: colors.danger,
  },
  buttonContainer: {
    gap: 12,
  },
}));
