import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { DynamicColorIOS, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "../ui/IconSymbol";

import { COLORS } from "@/constants/styles/colors";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

export function ModalClose() {
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
            <IconSymbol
              size={14}
              name="xmark"
              color={DynamicColorIOS({
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
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  blurContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d3d1d180",
    width: 38,
    height: 38,
    overflow: "hidden",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
}));
