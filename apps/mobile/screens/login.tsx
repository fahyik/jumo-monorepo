import { Image } from "expo-image";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/ThemedView";
import { AppleSignIn } from "@/components/auth/apple-signin";
import { GoogleSignIn } from "@/components/auth/google-signin";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

export function LoginScreen() {
  const styles = useThemedStyles(themedStyles);

  const bounceAnimation = useSharedValue(0);

  useEffect(() => {
    bounceAnimation.value = withDelay(
      1000,
      withSpring(1, { damping: 80, stiffness: 3000 })
    );
  }, [bounceAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounceAnimation.value }],
  }));

  return (
    <SafeAreaView edges={[]}>
      <ThemedView style={[styles.container]}>
        <View style={styles.content}>
          <Animated.View style={animatedStyle}>
            <Image
              source={require("@/assets/images/icon-egg.png")}
              style={{ height: 280, width: 280 }}
            ></Image>
          </Animated.View>
          <AppleSignIn></AppleSignIn>
          <GoogleSignIn></GoogleSignIn>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const themedStyles = createThemedStyles(() => ({
  container: {
    padding: 12,
    height: "100%",
    justifyContent: "center",
  },
  content: {
    gap: 12,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
  },
}));
