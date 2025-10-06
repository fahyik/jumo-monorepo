export interface Nutrient {
  id: string;
  name: string;
  unit: string;
  translationKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderFood {
  id: string;
  provider: string;
  providerId: string;
  rawData: Record<string, unknown>;
  data: Record<string, unknown>;
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
