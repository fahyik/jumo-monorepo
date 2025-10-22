import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FoodInput } from "./food-input";

import { ThemedText } from "@/components/ThemedText";
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
        <ThemedText style={styles.errorText}>
          {error ? error.message : "An error occurred"}
        </ThemedText>
      </View>
    );
  }

  if (data === null || !data || data?.success === false) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          {data?.reason ? data?.reason : "An error occurred"}
        </ThemedText>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
  },
}));
