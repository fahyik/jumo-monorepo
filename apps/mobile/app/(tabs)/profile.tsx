import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/providers/auth-provider";

export default function TabTwoScreen() {
  const { signOut } = useAuth();
  return (
    <SafeAreaView style={[styles.titleContainer]}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
        onPress={signOut}
      >
        <Text style={{ fontWeight: "bold" }}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    gap: 8,
    height: "100%",
    padding: 12,
  },
});
