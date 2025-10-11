import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useRef } from "react";
import { Alert } from "react-native";

import { CreateMealForm } from "./create-meal-form";
import { AdjustedNutrition } from "./nutrition-info";

import { ProviderFood } from "@jumo-monorepo/interfaces";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { useCreateMeal } from "@/hooks/use-create-meal";

interface CreateMealButtonProps {
  nutritionData: ProviderFood;
  portionSize: number;
  adjustedNutrition: AdjustedNutrition;
  onSuccess?: () => void;
}

export function CreateMealButton({
  nutritionData,
  portionSize,
  adjustedNutrition,
  onSuccess,
}: CreateMealButtonProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const createMealMutation = useCreateMeal();

  const handlePress = () => {
    bottomSheetRef.current?.present();
  };

  const handleMealFormSubmit = async (
    mealName: string,
    notes: string,
    consumedAt: string
  ) => {
    try {
      await createMealMutation.mutateAsync({
        name: mealName,
        notes: notes || undefined,
        consumedAt,
        items: [
          {
            providerFoodId: nutritionData.id,
            quantity: portionSize,
            unit: nutritionData.foodData.servingSizeUnit,
          },
        ],
      });

      bottomSheetRef.current?.close();

      Alert.alert("Success", "Meal created successfully!", [
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
        error instanceof Error ? error.message : "Failed to create meal"
      );
    }
  };

  const handleMealFormCancel = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <>
      <Button variant="primary" onPress={handlePress}>
        Create a new meal
      </Button>
      <BottomSheet ref={bottomSheetRef}>
        <CreateMealForm
          onSubmit={handleMealFormSubmit}
          onCancel={handleMealFormCancel}
          foodName={nutritionData.foodData.name}
          portionSize={portionSize}
          portionUnit={nutritionData.foodData.servingSizeUnit}
          adjustedNutrition={adjustedNutrition}
          isSubmitting={createMealMutation.isPending}
        />
      </BottomSheet>
    </>
  );
}
