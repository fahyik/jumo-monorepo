import { sql } from "../../db/index.js";
import { openFoodFactsClient } from "./client.js";

import type {
  Nutrient,
  ProviderFood,
  ProviderFoodData,
} from "@jumo-monorepo/interfaces";

// Cache TTL in days - repull data if older than this
const PROVIDER_FOOD_CACHE_TTL_DAYS = 30;

// Map OpenFoodFacts nutrient fields to our nutrient IDs
const OFF_NUTRIENT_MAPPING: Record<string, { value: string; unit: string }> = {
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

interface OpenFoodFactsNutriments {
  [key: string]: number | string | undefined;
}

interface OpenFoodFactsProduct {
  product_name?: string;
  generic_name?: string;
  image_url?: string;
  serving_size?: string;
  serving_quantity?: string;
  serving_quantity_unit?: string;
  nutriments?: OpenFoodFactsNutriments;
}

interface OpenFoodFactsResponse {
  data: {
    product?: OpenFoodFactsProduct;
    status: string;
  };
}

export async function getFoodByBarcode({
  barcode,
}: {
  barcode: string;
}): Promise<ProviderFood> {
  // Check if provider food already exists in database and is fresh (< TTL days old)
  const [existingFood] = await sql<ProviderFood[]>`
    SELECT
      id,
      provider,
      provider_id as "providerId",
      data,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM jumo.provider_foods
    WHERE provider = 'OFF'
      AND provider_id = ${barcode}
      AND updated_at > NOW() - ${PROVIDER_FOOD_CACHE_TTL_DAYS} * INTERVAL '1 day'
  `;

  if (existingFood) {
    return existingFood;
  }

  // Fetch nutrients from database
  const dbNutrients = await sql<Nutrient[]>`
    SELECT id, name, unit, translation_key as "translationKey", parent_id as "parentId", created_at as "createdAt", updated_at as "updatedAt"
    FROM jumo.nutrients
  `;

  const result = (await openFoodFactsClient.getProductV3(barcode, {
    fields: [
      "generic_name",
      "product_name",
      // @ts-expect-error NOTE: fields exist
      "nutriments",
      // @ts-expect-error NOTE: fields exist
      "image_url",
      "serving_quantity",
      "serving_quantity_unit",
      "serving_size",
    ],
  })) as OpenFoodFactsResponse;

  if (result.data.status !== "success" || !result.data.product) {
    throw new Error("Product not found");
  }

  const product = result.data.product;
  const nutriments = product.nutriments || {};

  // Helper function to convert units
  const convertUnit = (
    amount: number,
    fromUnit: string,
    toUnit: string
  ): number => {
    if (fromUnit === toUnit) return amount;

    // g to mg
    if (fromUnit === "g" && toUnit === "mg") {
      return amount * 1000;
    }

    // mg to g
    if (fromUnit === "mg" && toUnit === "g") {
      return amount / 1000;
    }

    // No conversion available, return original amount
    return amount;
  };

  // Extract nutrients using database nutrients and OFF mapping
  const nutrients: ProviderFoodData["nutrients"] = [];
  for (const dbNutrient of dbNutrients) {
    const offMapping = OFF_NUTRIENT_MAPPING[dbNutrient.id];

    let amount = 0;
    let providerNutrientId: string | null = null;

    if (offMapping) {
      const value = nutriments[offMapping.value];
      const providerUnit = nutriments[offMapping.unit];

      if (typeof value === "number") {
        amount = value;

        // Convert unit if provider unit exists and differs from db unit
        if (typeof providerUnit === "string") {
          amount = convertUnit(amount, providerUnit, dbNutrient.unit);
        }
      }

      providerNutrientId = offMapping.value;
    }

    nutrients.push({
      id: dbNutrient.id,
      providerNutrientId,
      unit: dbNutrient.unit,
      amount,
    });
  }

  // Transform to ProviderFoodData
  const data: ProviderFoodData = {
    name: product.product_name || "Unknown product name",
    description: product.generic_name || "",
    servingSize: product.serving_quantity || "0",
    servingSizeUnit: product.serving_quantity_unit || "g",
    nutrients,
    image: product.image_url
      ? { type: "external", url: product.image_url }
      : { type: "external", url: "" },
  };

  const [providerFood] = await sql<ProviderFood[]>`
    INSERT INTO jumo.provider_foods (provider, provider_id, raw_data, data)
    VALUES ('OFF', ${barcode}, ${sql.json(JSON.parse(JSON.stringify(result.data.product)))}, ${sql.json(JSON.parse(JSON.stringify(data)))}) 
    ON CONFLICT (provider, provider_id)
    DO UPDATE SET
      raw_data = EXCLUDED.raw_data,
      data = EXCLUDED.data,
      updated_at = NOW()
    RETURNING
      id,
      provider,
      provider_id as "providerId",
      data,
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;

  return providerFood;
}
