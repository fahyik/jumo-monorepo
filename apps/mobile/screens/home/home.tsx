import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { BottomSideNav } from "@/components/navigation/bottom-side-nav";
import { createThemedStyles } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useTheme, useThemedStyles } from "@/providers/theme-provider";

export function HomeScreen() {
  const styles = useThemedStyles(themedStyles);

  const bottomTabBarHeight = 0;
  const bounceAnimation = useSharedValue(-200);

  const { session } = useAuth();

  const { colors } = useTheme();

  useEffect(() => {
    bounceAnimation.value = withSpring(0, { damping: 60, stiffness: 1500 });
  }, [bounceAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceAnimation.value }],
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
          <Animated.View style={animatedStyle}>
            <Image
              source={require("@/assets/images/app/watermelon-skipping.png")}
              style={styles.headerImage}
            ></Image>
          </Animated.View>
          <ThemedText type="subtitle">
            Hello, {session?.user?.user_metadata?.name || session?.user?.email}{" "}
            !
          </ThemedText>
        </View>

        <View style={styles.headerContainer}>
          <ThemedText type="default">
            Click on the camera to record your meal
          </ThemedText>
          <ThemedText type="default">or the message icon to chat</ThemedText>
        </View>
      </ScrollView>

      <BottomSideNav bottom={bottomTabBarHeight}></BottomSideNav>
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
    padding: 12,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  headerImage: {
    height: 120,
    width: 120,
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
