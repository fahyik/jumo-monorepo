import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

import { useProductData } from "./hooks/useProductData";

interface BarcodeScreenProps {
  barcode?: string;
}

export function BarcodeScreen({ barcode }: BarcodeScreenProps) {
  const { productData, loading, error } = useProductData(barcode);

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Product Information
      </Text>

      {barcode && (
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Barcode: {barcode}
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
