import { OpenFoodFacts } from "@openfoodfacts/openfoodfacts-nodejs";

export const openFoodFactsClient = new OpenFoodFacts(fetch);
