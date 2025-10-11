import { apiClient } from "../api";

import { GetFoodByBarcode } from "@jumo-monorepo/interfaces";

export async function getBarcode({ barcode }: { barcode: string }) {
  return apiClient<GetFoodByBarcode["response"]>(`/foods/barcode/${barcode}`);
}
