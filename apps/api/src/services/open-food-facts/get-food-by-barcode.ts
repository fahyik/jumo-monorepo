import { sql } from "../../db/index.js";
import { logger } from "../../logger.js";
import { convertUnit } from "../../utils/unit-converter.js";
import { openFoodFactsClient } from "./client.js";
import { OFF_NUTRIENT_MAPPING } from "./mapping.js";

import type {
  Nutrient,
  ProviderFood,
  ProviderFoodData,
} from "@jumo-monorepo/interfaces";

const PROVIDER_FOOD_CACHE_TTL_DAYS = 30;

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
  product_quantity?: string;
  product_quantity_unit?: string;
  nutriments?: OpenFoodFactsNutriments;
}

interface OpenFoodFactsResponse {
  data: {
    product?: OpenFoodFactsProduct;
    status: string;
  };
  error: unknown;
}

export async function getFoodByBarcode({
  barcode,
  options,
}: {
  barcode: string;
  options?: {
    forceRefresh: boolean;
  };
}): Promise<
  { success: true; data: ProviderFood } | { success: false; reason: string }
> {
  // Check if provider food already exists in database and is fresh (< TTL days old)
  const [existingFood] = await sql<ProviderFood[]>`
    SELECT
      id,
      provider,
      provider_id as "providerId",
      data as "foodData",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM jumo.provider_foods
    WHERE provider = 'OpenFoodFacts'
      AND provider_id = ${barcode}
      ${options?.forceRefresh ? sql`AND FALSE` : sql`AND updated_at > NOW() - ${PROVIDER_FOOD_CACHE_TTL_DAYS} * INTERVAL '1 day'`}
    ;`;

  if (existingFood) {
    return { success: true, data: existingFood };
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
      "product_quantity",
      "product_quantity_unit",
    ],
  })) as OpenFoodFactsResponse;

  if (result.error) {
    logger.error("Error fetching product open food facts client", result.error);
    return { success: false, reason: "SERVER_ERROR" };
  }

  if (
    !["success", "success_with_warnings"].includes(result.data.status) ||
    !result.data.product
  ) {
    logger.warn("Product not found", result);
    return { success: false, reason: "PRODUCT_NOT_FOUND" };
  }

  const product = result.data.product;
  const nutriments = product.nutriments || {};

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

  const data: ProviderFoodData = {
    name: product.product_name || "Unknown product name",
    description: product.generic_name || "",
    servingSize: parseFloat(product.serving_quantity ?? "0") || 0,
    servingSizeUnit: product.serving_quantity_unit || "g",
    productQuantity: parseFloat(product.product_quantity ?? "0") || 0,
    productQuantityUnit: product.product_quantity_unit || "g",
    nutrients,
    image: product.image_url
      ? { type: "external", url: product.image_url }
      : { type: "external", url: "" },
  };

  const [providerFood] = await sql<ProviderFood[]>`
    INSERT INTO jumo.provider_foods (provider, provider_id, raw_data, data)
    VALUES ('OpenFoodFacts', ${barcode}, ${sql.json(JSON.parse(JSON.stringify(result.data.product)))}, ${sql.json(JSON.parse(JSON.stringify(data)))}) 
    ON CONFLICT (provider, provider_id)
    DO UPDATE SET
      raw_data = EXCLUDED.raw_data,
      data = EXCLUDED.data,
      updated_at = NOW()
    RETURNING
      id,
      provider,
      provider_id as "providerId",
      data as "foodData",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;

  return { success: true, data: providerFood };
}
