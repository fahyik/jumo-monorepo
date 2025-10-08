import { useEffect, useState } from "react";

interface ProductData {
  product_name?: string;
  image_url?: string;
  nutriments?: {
    carbohydrates_100g?: number;
    proteins_100g?: number;
    fat_100g?: number;
  };
}

export function useProductData(barcode: string | undefined) {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductData = async (barcode: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://world.openfoodfacts.net/api/v2/product/${barcode}?product_type=food&fields=nutriments%2Cproduct_name%2Cimage_url`
      );
      const data = await response.json();

      if (data.status === 1 && data.product) {
        setProductData(data.product);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      setError("Failed to fetch product data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (barcode) {
      fetchProductData(barcode);
    }
  }, [barcode]);

  return { productData, loading, error };
}
