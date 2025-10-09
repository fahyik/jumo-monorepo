import { Text, View } from "react-native";

import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

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

interface NutritionInfoProps {
  data: NutritionData;
}

export function NutritionInfo({ data }: NutritionInfoProps) {
  const styles = useThemedStyles(themedStyles);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{data.name}</Text>
        <Text style={styles.description}>{data.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrition per 100g</Text>
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
        <Text style={styles.sectionTitle}>
          Estimated Portion ({data.estimatedPortionSize}
          {data.estimatedPortionSizeUnit})
        </Text>
        <View style={styles.nutrientList}>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Energy:</Text>
            <Text style={styles.nutrientValue}>
              {data.totalNutritionForEstimatedPortion.energy}{" "}
              {data.totalNutritionForEstimatedPortion.energyUnit}
            </Text>
          </View>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Carbohydrates:</Text>
            <Text style={styles.nutrientValue}>
              {data.totalNutritionForEstimatedPortion.carbohydrates}{" "}
              {data.totalNutritionForEstimatedPortion.carbohydratesUnit}
            </Text>
          </View>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Proteins:</Text>
            <Text style={styles.nutrientValue}>
              {data.totalNutritionForEstimatedPortion.proteins}{" "}
              {data.totalNutritionForEstimatedPortion.proteinsUnit}
            </Text>
          </View>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>Fats:</Text>
            <Text style={styles.nutrientValue}>
              {data.totalNutritionForEstimatedPortion.fats}{" "}
              {data.totalNutritionForEstimatedPortion.fatsUnit}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.notesTitle}>Notes</Text>
        <Text style={styles.notesText}>{data.notes}</Text>
      </View>
    </View>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
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
    backgroundColor: "#e8f5e8",
    padding: 16,
    borderRadius: 8,
  },
  notesSection: {
    backgroundColor: "#fff3e0",
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
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
  notesText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
}));
