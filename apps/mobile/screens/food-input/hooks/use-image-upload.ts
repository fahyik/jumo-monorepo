import { useEffect, useState } from "react";

import type { ProviderFood } from "@jumo-monorepo/interfaces";

import { API_URL } from "@/lib/env";
import { supabase } from "@/lib/supabase";

interface UploadResponse {
  success: boolean;
  data: ProviderFood;
  reason?: string;
}

// TODO: move to use tanstack mutation
export function useImageUpload(
  imageUri: string | undefined,
  mimeType?: string
) {
  const [isLoading, setIsLoading] = useState(true);
  const [nutritionData, setNutritionData] = useState<ProviderFood | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async () => {
    if (!imageUri) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: mimeType ?? "image/jpeg",
        name: "image",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const token = (await supabase.auth.getSession()).data.session
        ?.access_token;

      const response = await fetch(`${API_URL}/ai/upload-photo`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: UploadResponse = await response.json();

      if (result.success) {
        setNutritionData(result.data);
      } else {
        setError(result.reason || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (imageUri) {
      uploadImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUri]);

  return { nutritionData, isLoading, error };
}
