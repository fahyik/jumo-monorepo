import * as Application from "expo-application";
import { isEmbeddedLaunch, updateId } from "expo-updates";
import { TouchableOpacity, View } from "react-native";
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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.button}
        onPress={signOut}
      >
        <ThemedText style={{ fontWeight: "bold" }}>Sign Out</ThemedText>
      </TouchableOpacity>

      <ThemedView style={{ paddingVertical: 16 }}>
        <ThemedText style={styles.versionText}>
          {`Version: ${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`}
        </ThemedText>
        <ThemedText style={styles.versionText}>
          {`Build: ${isEmbeddedLaunch === false ? updateId : null}`}
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    flexDirection: "column",
    gap: 8,
    height: "100%",
    padding: 12,
    backgroundColor: colors.background,
  },
  button: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.backgroundMuted,
    borderColor: colors.icon,
  },
  versionText: {
    fontSize: 12,
    lineHeight: 12 * 1.5,
  },
}));
