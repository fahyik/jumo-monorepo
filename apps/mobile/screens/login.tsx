import { Image } from "expo-image";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelloWave } from "@/components/HelloWave";
import { ThemedView } from "@/components/ThemedView";
import { AppleSignIn } from "@/components/auth/apple-signin";
import { GoogleSignIn } from "@/components/auth/google-signin";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

export function LoginScreen() {
  const styles = useThemedStyles(themedStyles);

  const bounceAnimation = useSharedValue(-40);

  useEffect(() => {
    bounceAnimation.value = withSpring(0, { damping: 50, stiffness: 3000 });
  }, [bounceAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceAnimation.value }],
  }));

  return (
    <SafeAreaView edges={[]}>
      <ThemedView style={[styles.container]}>
        <View style={styles.content}>
          <Animated.View style={animatedStyle}>
            <Image
              source={require("@/assets/images/app/bear_workout.png")}
              style={{ height: 240, width: 240 }}
            ></Image>
          </Animated.View>
          <AppleSignIn></AppleSignIn>
          <GoogleSignIn></GoogleSignIn>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
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
}));
