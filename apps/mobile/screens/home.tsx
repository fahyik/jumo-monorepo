import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { createThemedStyles } from "@/lib/utils";
import { useTheme, useThemedStyles } from "@/providers/theme-provider";

export function HomeScreen() {
  const styles = useThemedStyles(themedStyles);
  const { colors } = useTheme();
  const bottomTabBarHeight = useBottomTabBarHeight();

  const bounceAnimation = useSharedValue(-40);

  useEffect(() => {
    bounceAnimation.value = withSpring(0, { damping: 6, stiffness: 150 });
  }, [bounceAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceAnimation.value }],
  }));

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: bottomTabBarHeight,
        }}
      >
        <View
          style={{
            padding: 12,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Animated.View style={animatedStyle}>
            <Image
              source={require("@/assets/images/app/broccoli-face.png")}
              style={{ height: 120, width: 120 }}
            ></Image>
          </Animated.View>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: bottomTabBarHeight + 20,
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
    </SafeAreaView>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    flexDirection: "column",
    gap: 8,
    height: "100%",
    padding: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    flexDirection: "column",
  },
}));
