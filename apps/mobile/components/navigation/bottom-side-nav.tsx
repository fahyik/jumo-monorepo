import { BlurView } from "expo-blur";
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
        bottom: (bottom ?? 0) + 20,
        right: 20,
        flexDirection: "column",
        gap: 16,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BlurView
        intensity={80}
        tint="systemChromeMaterial"
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link href="/(stacks)/chat" asChild>
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
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
      </BlurView>

      <BlurView
        intensity={80}
        tint="systemChromeMaterial"
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link href="/(stacks)/camera" asChild>
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
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
      </BlurView>
    </View>
  );
}
