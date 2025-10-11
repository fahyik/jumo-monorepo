export const OFF_NUTRIENT_MAPPING: Record<
  string,
  { value: string; unit: string }
> = {
  energy: { value: "energy-kcal_value", unit: "energy-kcal_unit" },
  carbohydrate: { value: "carbohydrates_value", unit: "carbohydrates_unit" },
  protein: { value: "proteins_value", unit: "proteins_unit" },
  fat: { value: "fat_value", unit: "fat_unit" },
  salt: { value: "salt_value", unit: "salt_unit" },
  sugar: { value: "sugars_value", unit: "sugars_unit" },
  fiber: { value: "fiber_value", unit: "fiber_unit" },
  saturated_fat: {
    value: "saturated-fat_value",
    unit: "saturated-fat_unit",
  },
  sodium: { value: "sodium_value", unit: "sodium_unit" },
  alcohol: { value: "alcohol_value", unit: "alcohol_unit" },
};
