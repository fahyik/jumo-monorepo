import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Link } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { IconSymbol } from "../ui/IconSymbol";

import { useTheme } from "@/providers/theme-provider";

export function BottomSideNav({ bottom }: { bottom?: number }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        position: "absolute",
        bottom: (bottom ?? 0) + 28 + (isLiquidGlassAvailable() ? 0 : 100),
        right: 28,
        flexDirection: "column",
        gap: 12,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GlassView
        style={{
          width: 48,
          height: 48,
          borderRadius: 30,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isLiquidGlassAvailable() ? "none" : "white",
        }}
      >
        <Link href="/(stacks)/chat" asChild>
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: "#d3d1d180",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconSymbol size={28} name="message.fill" color={colors.icon} />
          </TouchableOpacity>
        </Link>
      </GlassView>

      <GlassView
        style={{
          width: 48,
          height: 48,
          borderRadius: 30,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isLiquidGlassAvailable() ? "none" : "white",
        }}
      >
        <Link href="/(stacks)/camera" asChild>
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: "#d3d1d180",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconSymbol size={28} name="camera.fill" color={colors.icon} />
          </TouchableOpacity>
        </Link>
      </GlassView>
    </View>
  );
}
