import { openFoodFactsClient } from "./client.js";

export function getFoodByBarcode({ barcode }: { barcode: string }) {
  return openFoodFactsClient.getProductV3(barcode, {
    // @ts-expect-error NOTE: fields exist
    fields: ["generic_name", "product_name", "nutriments", "image_url"],
  });
}
