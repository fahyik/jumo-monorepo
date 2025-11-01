import { useEffect, useState } from "react";
import { ScrollView, View, useColorScheme } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { HealthMetrics } from "./components/health-metrics";

import { ThemedText } from "@/components/ThemedText";
import { BottomSideNav } from "@/components/navigation/bottom-side-nav";
import { PixelBox } from "@/components/ui/pixel-box";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

export function HomeScreen() {
  const styles = useThemedStyles(themedStyles);

  const bottomTabBarHeight = 0;

  // Sprite animation setup
  const SPRITE_FRAMES = 16;
  const FRAME_WIDTH = 128; // Scaled down from 256
  const ANIMATION_DURATION = 500 * SPRITE_FRAMES;
  const spriteFrame = useSharedValue(0);

  // Typing animation setup
  const fullText = "Hello! We're feeling good today! :)";
  const [displayText, setDisplayText] = useState("");
  const colorScheme = useColorScheme();

  useEffect(() => {
    spriteFrame.value = 0;
    // Animate through sprite frames continuously
    spriteFrame.value = withRepeat(
      withTiming(SPRITE_FRAMES - 1, {
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
      }),
      -1, // infinite repeat
      false
    );

    return () => {
      cancelAnimation(spriteFrame);
    };
  }, [spriteFrame, ANIMATION_DURATION]);

  // Simple typing animation with setTimeout
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // 150ms per character

    return () => clearInterval(typingInterval);
  }, [fullText]);

  const spriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -Math.floor(spriteFrame.value) * FRAME_WIDTH }],
  }));

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: bottomTabBarHeight },
        ]}
      >
        <View style={styles.headerContainer}>
          <View
            style={[
              styles.spriteContainer,
              { width: FRAME_WIDTH, height: FRAME_WIDTH },
            ]}
          >
            <Animated.Image
              source={
                colorScheme === "dark"
                  ? require("../../assets/sprites/sprite_main_dark.png")
                  : require("../../assets/sprites/sprite_main.png")
              }
              style={[
                { height: FRAME_WIDTH, width: FRAME_WIDTH * SPRITE_FRAMES },
                spriteAnimatedStyle,
              ]}
            />
          </View>

          <PixelBox style={{ padding: 16, width: "100%" }}>
            <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>
              {displayText}
            </ThemedText>
          </PixelBox>
        </View>

        <HealthMetrics />
      </ScrollView>
      <BottomSideNav />
    </>
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
  scrollViewContent: {
    gap: 16,
  },
  headerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  headerImage: {
    height: 120,
    width: 120,
  },
  spriteContainer: {
    overflow: "hidden",
  },
  cardsRow: {
    flexDirection: "row",
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
    height: 128,
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
    minWidth: 0,
  },
  cardIcon: {
    backgroundColor: "white",
    height: 40,
    width: 40,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
}));
