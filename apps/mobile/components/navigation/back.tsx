import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { DynamicColorIOS, TouchableOpacity, View } from "react-native";

import { ChevronLeft } from "@/assets/icons/chevrons";
import { COLORS } from "@/constants/styles/colors";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

export function BackButton() {
  const router = useRouter();
  const styles = useThemedStyles(themedStyles);

  return (
    router.canGoBack() && (
      <View style={styles.container}>
        <GlassView
          style={[
            styles.blurContainer,
            {
              backgroundColor: isLiquidGlassAvailable() ? "none" : "white",
            },
          ]}
        >
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <ChevronLeft
              fill={DynamicColorIOS({
                dark: COLORS["dark"].text,
                light: COLORS["light"].text,
              })}
            />
          </TouchableOpacity>
        </GlassView>
      </View>
    )
  );
}

const themedStyles = createThemedStyles(() => ({
  container: {
    position: "absolute",
    top: 0,
    left: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#d3d1d180",
    width: 48,
    height: 48,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  blurContainer: {
    width: 50,
    height: 50,
    borderRadius: 25, // Half of width/height for perfect circle
    overflow: "hidden",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
}));
