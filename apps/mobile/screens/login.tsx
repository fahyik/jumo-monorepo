import { StyleSheet, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import { ThemedView } from "@/components/ThemedView";
import { GoogleSignIn } from "@/components/auth/google-signin";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

export function LoginScreen() {
  const styles = useThemedStyles(themedStyles);

  return (
    <ThemedView style={[styles.container]}>
      <View style={styles.content}>
        <HelloWave size={120}></HelloWave>
        <GoogleSignIn></GoogleSignIn>
      </View>
    </ThemedView>
  );
}

const themedStyles = createThemedStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      padding: 12,
      height: "100%",
      justifyContent: "center",
    },
    content: {
      gap: 16,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);
