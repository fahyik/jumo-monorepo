import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useProductData } from "./hooks/useProductData";

import { ModalClose } from "@/components/navigation/modal-close";
import { getBarcode } from "@/lib/queries/get-barcode";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

interface BarcodeScreenProps {
  barcode?: string;
}

export function BarcodeScreen({ barcode }: BarcodeScreenProps) {
  const styles = useThemedStyles(themedStyles);
  const { productData, loading, error } = useProductData(barcode);

  const { data } = useQuery({
    queryKey: ["foods", "barcode", barcode],
    queryFn: async () => getBarcode({ barcode: barcode! }),
    enabled: !!barcode,
  });

  console.log(data);

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View style={[styles.modalCloseContainer, { top: insets.top }]}>
        <ModalClose />
      </View>
      <ScrollView style={[styles.container]}>
        <Text style={styles.title}>
          Product Information{" "}
          {barcode && <Text style={styles.barcodeText}>({barcode})</Text>}
        </Text>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading product data...</Text>
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {productData && (
          <View>
            {productData.product_name && (
              <Text style={styles.productName}>{productData.product_name}</Text>
            )}

            {productData.image_url && (
              <Image
                source={{ uri: productData.image_url }}
                style={styles.productImage}
                resizeMode="contain"
              />
            )}

            {productData.nutriments && (
              <View style={styles.nutrimentContainer}>
                <Text style={styles.nutrimentTitle}>
                  Nutritional Information (per 100g)
                </Text>

                {productData.nutriments.carbohydrates_100g !== undefined && (
                  <Text style={styles.nutrimentText}>
                    Carbohydrates: {productData.nutriments.carbohydrates_100g}g
                  </Text>
                )}

                {productData.nutriments.proteins_100g !== undefined && (
                  <Text style={styles.nutrimentText}>
                    Proteins: {productData.nutriments.proteins_100g}g
                  </Text>
                )}

                {productData.nutriments.fat_100g !== undefined && (
                  <Text style={styles.nutrimentText}>
                    Fat: {productData.nutriments.fat_100g}g
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.text,
  },
  barcodeText: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.text,
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: colors.textMuted,
  },
  errorText: {
    color: "#c62828",
    fontSize: 16,
    marginVertical: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: colors.text,
  },
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignSelf: "center",
  },
  nutrimentContainer: {
    backgroundColor: colors.backgroundMuted,
    padding: 15,
    borderRadius: 10,
  },
  nutrimentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.text,
  },
  nutrimentText: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.text,
  },
  modalCloseContainer: {
    position: "absolute",
    left: 0,
    right: 16,
    zIndex: 1,
  },
}));
