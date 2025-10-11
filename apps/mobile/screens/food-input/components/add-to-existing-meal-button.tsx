import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useRef } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

import { AdjustedNutrition } from "./nutrition-info";

import { ProviderFood } from "@jumo-monorepo/interfaces";
import type { Meal } from "@jumo-monorepo/interfaces/src/domain/meals.js";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { MealSelector } from "@/components/ui/meal-selector";
import { addItemToMeal } from "@/lib/queries/add-item-to-meal";
import { getMeals } from "@/lib/queries/get-meals";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

interface AddToExistingMealButtonProps {
  nutritionData: ProviderFood;
  portionSize: number;
  adjustedNutrition: AdjustedNutrition;
  onSuccess?: () => void;
}

export function AddToExistingMealButton({
  nutritionData,
  portionSize,
  adjustedNutrition,
  onSuccess,
}: AddToExistingMealButtonProps) {
  const styles = useThemedStyles(themedStyles);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();

  const { data: meals, isLoading } = useQuery({
    queryKey: ["meals", {}],
    queryFn: async () => getMeals({}),
  });

  const addItemMutation = useMutation({
    mutationFn: addItemToMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
  });

  const handlePress = () => {
    bottomSheetRef.current?.present();
  };

  const handleMealSelect = async (meal: Meal) => {
    try {
      await addItemMutation.mutateAsync({
        mealId: meal.id,
        providerFoodId: nutritionData.id,
        quantity: portionSize,
        unit: nutritionData.foodData.servingSizeUnit,
      });

      bottomSheetRef.current?.close();

      Alert.alert("Success", "Item added to meal successfully!", [
        {
          text: "OK",
          onPress: () => {
            onSuccess?.();
            router.replace("/(tabs)/data");
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to add item to meal"
      );
    }
  };

  return (
    <>
      <Button variant="secondary" onPress={handlePress}>
        Add to an existing meal
      </Button>
      <BottomSheet ref={bottomSheetRef}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading meals...</Text>
          </View>
        ) : meals && meals.length > 0 ? (
          <MealSelector meals={meals} onSelect={handleMealSelect} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No meals available</Text>
            <Text style={styles.emptySubtext}>
              Create your first meal to add items to it
            </Text>
          </View>
        )}
      </BottomSheet>
    </>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  loadingContainer: {
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
}));
