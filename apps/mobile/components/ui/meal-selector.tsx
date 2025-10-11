import { format } from "date-fns";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import type { Meal } from "@jumo-monorepo/interfaces/src/domain/meals.js";

import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

interface MealSelectorProps {
  meals: Meal[];
  onSelect: (meal: Meal) => void;
}

export function MealSelector({ meals, onSelect }: MealSelectorProps) {
  const styles = useThemedStyles(themedStyles);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMeals = meals.filter((meal) => {
    const mealName = meal.name || "Unnamed meal";
    return mealName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a meal</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search meals..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.list}>
        {filteredMeals.length > 0 ? (
          filteredMeals.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.mealItem}
              onPress={() => onSelect(item)}
              activeOpacity={0.7}
            >
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{item.name || "Unnamed meal"}</Text>
                <Text style={styles.mealTime}>
                  {format(new Date(item.consumedAt), "MMM d, h:mm a")}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? "No meals found" : "No meals available"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    flex: 1,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.backgroundMuted,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  mealItem: {
    backgroundColor: colors.backgroundMuted,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  mealInfo: {
    gap: 4,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  mealTime: {
    fontSize: 14,
    color: colors.textMuted,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
  },
}));
