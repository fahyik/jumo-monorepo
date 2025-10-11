import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FoodInput } from "./food-input";

import { BouncingText } from "@/components/bouncing-text";
import { getBarcode } from "@/lib/queries/get-barcode";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

export function BarcodeScreen({ barcode }: { barcode?: string }) {
  const styles = useThemedStyles(themedStyles);

  const { data, isLoading, error } = useQuery({
    queryKey: ["foods", "barcode", barcode],
    queryFn: async () => getBarcode({ barcode: barcode! }),
    enabled: !!barcode,
  });

  console.log(barcode, error);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <BouncingText text="cracking..." withLogo />
      </View>
    );
  }

  if (error || !barcode) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error ? error.message : "An error occurred"}
        </Text>
      </View>
    );
  }

  if (data === null || !data || data?.success === false) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{"An error occurred"}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <FoodInput providerFoodData={data.data}></FoodInput>
    </SafeAreaView>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
}));
