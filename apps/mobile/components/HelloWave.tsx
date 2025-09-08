import { Image } from "expo-image";
import { useCallback, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";

interface HelloWaveProps {
  size?: number;
}

export function HelloWave({ size = 60 }: HelloWaveProps) {
  const rotationAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  const handlePress = useCallback(() => {
    rotationAnimation.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 150 }),
        withTiming(0, { duration: 150 })
      ),
      4 // Run the animation 4 times
    );
  }, [rotationAnimation]);

  useEffect(() => {
    setTimeout(() => {
      handlePress();
    }, 1000);
  }, [handlePress]);

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        <ThemedText style={styles.text}>
          <Image
            source={require("@/assets/images/app/avocado-face.png")}
            style={{ height: size, width: size }}
          ></Image>
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
