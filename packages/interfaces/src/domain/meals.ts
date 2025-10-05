export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

export enum MeasurementUnit {
  GRAMS = 'g',
  MILLILITERS = 'ml',
  OUNCES = 'oz',
  CUPS = 'cups',
  TABLESPOONS = 'tbsp',
  TEASPOONS = 'tsp',
  PIECES = 'pieces',
  SERVING = 'serving',
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface MealItem {
  id: string;
  mealId: string;
  foodName: string;
  quantity: number;
  unit: MeasurementUnit;
  nutrition: NutritionInfo;
  brand?: string;
  barcode?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: string;
  userId: string;
  type: MealType;
  consumedAt: Date;
  name?: string;
  notes?: string;
  photoUrls?: string[];
  items: MealItem[];
  createdAt: Date;
  updatedAt: Date;
}
