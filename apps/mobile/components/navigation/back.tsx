import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { IconSymbol } from "../ui/IconSymbol";

import { createThemedStyles } from "@/lib/utils";
import { useTheme, useThemedStyles } from "@/providers/theme-provider";

export function BackButton() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(themedStyles);

  return (
    router.canGoBack() && (
      <View style={styles.container}>
        <BlurView
          intensity={80}
          tint="systemChromeMaterial"
          style={styles.blurContainer}
        >
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <IconSymbol size={14} name="chevron.left" color={colors.text} />
          </TouchableOpacity>
        </BlurView>
      </View>
    )
  );
}

const themedStyles = createThemedStyles(({ colors, isDark }) => ({
  container: {
    position: "absolute",
    top: 0,
    left: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d3d1d180",
    width: 40,
    height: 40,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  blurContainer: {
    width: 38,
    height: 38,
    borderRadius: 19, // Half of width/height for perfect circle
    overflow: "hidden",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
}));
