import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

interface ProductData {
  product_name?: string;
  image_url?: string;
  nutriments?: {
    carbohydrates_100g?: number;
    proteins_100g?: number;
    fat_100g?: number;
  };
}

export default function Modal() {
  const params = useLocalSearchParams();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.barcode) {
      fetchProductData(params.barcode as string);
    }
  }, [params.barcode]);

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

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Product Information
      </Text>

      {params?.barcode && (
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Barcode: {params.barcode}
        </Text>
      )}

      {loading && (
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Loading product data...</Text>
        </View>
      )}

      {error && (
        <Text style={{ color: "red", fontSize: 16, marginVertical: 10 }}>
          {error}
        </Text>
      )}

      {productData && (
        <View>
          {productData.product_name && (
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              {productData.product_name}
            </Text>
          )}

          {productData.image_url && (
            <Image
              source={{ uri: productData.image_url }}
              style={{
                width: 200,
                height: 200,
                marginBottom: 20,
                alignSelf: "center",
              }}
              resizeMode="contain"
            />
          )}

          {productData.nutriments && (
            <View
              style={{
                backgroundColor: "#f5f5f5",
                padding: 15,
                borderRadius: 10,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
              >
                Nutritional Information (per 100g)
              </Text>

              {productData.nutriments.carbohydrates_100g !== undefined && (
                <Text style={{ fontSize: 16, marginBottom: 5 }}>
                  Carbohydrates: {productData.nutriments.carbohydrates_100g}g
                </Text>
              )}

              {productData.nutriments.proteins_100g !== undefined && (
                <Text style={{ fontSize: 16, marginBottom: 5 }}>
                  Proteins: {productData.nutriments.proteins_100g}g
                </Text>
              )}

              {productData.nutriments.fat_100g !== undefined && (
                <Text style={{ fontSize: 16, marginBottom: 5 }}>
                  Fat: {productData.nutriments.fat_100g}g
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
