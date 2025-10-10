export interface Nutrient {
  id: string;
  name: string;
  unit: string;
  translationKey?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProviderFoodNutrientPer100g {
  id: string;
  providerNutrientId: string | null;
  unit: string;
  amount: number;
}

export interface ProviderFoodData {
  name: string;
  description: string;
  notes?: string;
  servingSize: number;
  servingSizeUnit: string;
  nutrients: ProviderFoodNutrientPer100g[];
  image:
    | {
        type: "storage";
        bucket: string;
        path: string;
      }
    | { type: "external"; url: string };
}

export interface ProviderFood {
  id: string;
  provider: string;
  providerId: string;
  rawData: Record<string, unknown> | null;
  foodData: ProviderFoodData;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: string;
  userId: string;
  name?: string;
  notes?: string;
  consumedAt: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  items?: MealItem[];
  nutrients?: { nutrient: Nutrient; amount: number }[];
}

export interface MealItem {
  id: string;
  userId: string;
  mealId: string;
  providerFoodId: string;
  quantity: number;
  unit: string;
  nutrients: { nutrient: Nutrient; amount: number }[];
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
