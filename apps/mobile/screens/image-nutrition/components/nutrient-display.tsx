import { ReactNode } from "react";
import { View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

interface NutrientDisplayProps {
  title: ReactNode;
  description?: ReactNode;
  nutrition: {
    energy: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
  };
}

export function NutrientDisplay({
  title,
  nutrition,
  description,
}: NutrientDisplayProps) {
  const styles = useThemedStyles(themedStyles);

  return (
    <View style={styles.container}>
      {typeof title === "string" ? (
        <ThemedText style={styles.title}>{title}</ThemedText>
      ) : (
        title
      )}

      {description &&
        (typeof description === "string" ? (
          <ThemedText style={styles.description}>{description}</ThemedText>
        ) : (
          description
        ))}

      <View style={styles.macrosRow}>
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
          <ThemedText style={styles.macroValue}>
            {nutrition.proteins}g
          </ThemedText>
          <ThemedText style={styles.macroLabel}>Protein</ThemedText>
        </View>
        <View style={styles.macroItem}>
          <ThemedText style={styles.macroValue}>{nutrition.fats}g</ThemedText>
          <ThemedText style={styles.macroLabel}>Fats</ThemedText>
        </View>
      </View>
    </View>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    backgroundColor: colors.backgroundMuted,
    padding: 16,
    borderRadius: 12,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
  },
  macrosRow: {
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
