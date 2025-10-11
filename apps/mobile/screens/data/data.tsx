import { format } from "date-fns";
import { SectionList, Text, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useGetMeals } from "@/hooks/use-get-meals";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";
import { NutrientRow } from "../image-nutrition/components/nutrient-row";

import type { Meal } from "@jumo-monorepo/interfaces/src/domain/meals.js";

export function DataScreen() {
  const styles = useThemedStyles(themedStyles);

  const { data: mealsGroupedByDay, isLoading } = useGetMeals({
    groupBy: "day",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const sections = mealsGroupedByDay
    ? Object.entries(mealsGroupedByDay)
        .map(([date, meals]) => ({
          title: date,
          data: meals,
          nutrients: aggregateNutrients(meals),
        }))
        .sort((a, b) => b.title.localeCompare(a.title))
    : [];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ThemedText>Loading meals...</ThemedText>
      </View>
    );
  }

  return (
    <SectionList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      sections={sections}
      keyExtractor={(item) => item.id}
      renderSectionHeader={({ section: { title, nutrients } }) => (
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">{formatDate(title)}</ThemedText>
          <NutrientRow nutrition={nutrients} />
        </View>
      )}
      renderItem={({ item }) => {
        const mealNutrients = aggregateNutrients([item]);
        return (
          <View style={styles.mealItem}>
            <View style={styles.mealHeader}>
              <ThemedText style={styles.mealName}>
                {item.name || "Unnamed meal"}
              </ThemedText>
              <ThemedText style={styles.mealTime}>
                {format(new Date(item.consumedAt), "h:mm a")}
              </ThemedText>
            </View>
            {item.items && item.items.length > 0 && (
              <View style={styles.itemsContainer}>
                {item.items.map((mealItem, index) => (
                  <Text key={index} style={styles.itemText}>
                    • {mealItem.quantity} {mealItem.unit}
                  </Text>
                ))}
              </View>
            )}
            <NutrientRow nutrition={mealNutrients} />
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <ThemedText>No meals found</ThemedText>
        </View>
      }
    />
  );
}

function aggregateNutrients(meals: Meal[]) {
  let energy = 0;
  let carbohydrates = 0;
  let proteins = 0;
  let fats = 0;

  meals.forEach((meal) => {
    if (meal.nutrients) {
      meal.nutrients.forEach((n) => {
        const nutrientName = n.nutrient.name.toLowerCase();
        if (nutrientName === "energy") energy += n.amount;
        if (nutrientName === "carbohydrates") carbohydrates += n.amount;
        if (nutrientName === "proteins") proteins += n.amount;
        if (nutrientName === "fats") fats += n.amount;
      });
    }
  });

  return {
    energy: Math.round(energy),
    carbohydrates: Math.round(carbohydrates * 10) / 10,
    proteins: Math.round(proteins * 10) / 10,
    fats: Math.round(fats * 10) / 10,
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateString === format(today, "yyyy-MM-dd")) {
    return "Today";
  } else if (dateString === format(yesterday, "yyyy-MM-dd")) {
    return "Yesterday";
  } else {
    return format(date, "EEEE, MMM d");
  }
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  sectionHeader: {
    paddingVertical: 12,
    backgroundColor: colors.background,
    gap: 8,
  },
  mealItem: {
    backgroundColor: colors.backgroundMuted,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mealName: {
    fontWeight: "600",
  },
  mealTime: {
    fontSize: 14,
    opacity: 0.7,
  },
  itemsContainer: {
    gap: 4,
  },
  itemText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 32,
  },
}));
