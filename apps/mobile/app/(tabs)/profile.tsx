import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { createThemedStyles } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useThemedStyles } from "@/providers/theme-provider";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const styles = useThemedStyles(themedStyles);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          onPress={signOut}
        >
          <ThemedText style={{ fontWeight: "bold" }}>Sign Out</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const themedStyles = createThemedStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      gap: 8,
      height: "100%",
      padding: 12,
    },
    button: {
      borderWidth: 1,
      padding: 12,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  })
);
