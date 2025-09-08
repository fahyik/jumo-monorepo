import { StyleSheet, View, useColorScheme } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import { GoogleSignIn } from "@/components/auth/google-signin";
import { Colors } from "@/constants/Colors";

export function LoginScreen() {
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <View style={styles.content}>
        <HelloWave size={120}></HelloWave>
        <GoogleSignIn></GoogleSignIn>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
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
});
