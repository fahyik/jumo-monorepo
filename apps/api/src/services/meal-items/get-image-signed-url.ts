import { logger } from "../../logger.js";
import { supabase } from "../../supabase.js";

import type { GetMealItemImage } from "@jumo-monorepo/interfaces";

const BUCKET = "user-photo-uploads";
const EXPIRY_TIME_SECONDS = 3600;

export async function getImageSignedUrl(
  imagePath: string
): Promise<GetMealItemImage["response"]> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(imagePath, EXPIRY_TIME_SECONDS);

  if (data && data.signedUrl) {
    return { success: true, data: { url: data.signedUrl } };
  }

  logger.warn("Failed to generate signed url", {
    imagePath,
    error,
  });
  return {
    success: false,
    reason: "UNABLE_TO_GET_IMAGE_URL",
  };
}
