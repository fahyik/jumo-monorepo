import { View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

export function NutrientRow({
  nutrition,
}: {
  nutrition: {
    energy: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
  };
}) {
  const styles = useThemedStyles(themedStyles);

  return (
    <View style={styles.container}>
      <View style={styles.macroItem}>
        <ThemedText style={styles.macroValue}>{nutrition.energy}</ThemedText>
        <ThemedText style={styles.macroLabel}>kcal</ThemedText>
      </View>
      <View style={styles.macroItem}>
        <ThemedText style={styles.macroValue}>
          {nutrition.carbohydrates}g
        </ThemedText>
        <ThemedText style={styles.macroLabel}>Carbs</ThemedText>
      </View>
      <View style={styles.macroItem}>
        <ThemedText style={styles.macroValue}>{nutrition.proteins}g</ThemedText>
        <ThemedText style={styles.macroLabel}>Protein</ThemedText>
      </View>
      <View style={styles.macroItem}>
        <ThemedText style={styles.macroValue}>{nutrition.fats}g</ThemedText>
        <ThemedText style={styles.macroLabel}>Fats</ThemedText>
      </View>
    </View>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  macroItem: {
    alignItems: "center",
    gap: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
}));
