export const AI_NUTRIENT_MAPPING: Record<
  string,
  { value: string; unit: string }
> = {
  energy: { value: "energy", unit: "energyUnit" },
  carbohydrate: { value: "carbohydrates", unit: "carbohydratesUnit" },
  protein: { value: "proteins", unit: "proteinsUnit" },
  fat: { value: "fats", unit: "fatsUnit" },
  salt: { value: "salt", unit: "saltUnit" },
  sugar: { value: "sugar", unit: "sugarUnit" },
  fiber: { value: "fiber", unit: "fiberUnit" },
  saturated_fat: { value: "saturatedFat", unit: "saturatedFatUnit" },
  sodium: { value: "sodium", unit: "sodiumUnit" },
  alcohol: { value: "alcohol", unit: "alcoholUnit" },
};
