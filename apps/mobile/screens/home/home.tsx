import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { GlassContainer, GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { BottomSideNav } from "@/components/navigation/bottom-side-nav";
import { createThemedStyles } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useThemedStyles } from "@/providers/theme-provider";

export function HomeScreen() {
  const styles = useThemedStyles(themedStyles);

  const bottomTabBarHeight = 0;
  const bounceAnimation = useSharedValue(-40);

  const { session } = useAuth();

  useEffect(() => {
    bounceAnimation.value = withSpring(0, { damping: 6, stiffness: 150 });
  }, [bounceAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceAnimation.value }],
  }));

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: bottomTabBarHeight,
          gap: 16,
        }}
      >
        <View
          style={{
            padding: 12,

            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Animated.View style={animatedStyle}>
            <Image
              source={require("@/assets/images/app/broccoli-face.png")}
              style={{ height: 120, width: 120 }}
            ></Image>
          </Animated.View>
          <ThemedText type="subtitle">
            Hello, {session?.user?.user_metadata?.name || session?.user?.email}{" "}
            !
          </ThemedText>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#bcbcbcff",
              height: 128,
              borderRadius: 16,
              padding: 16,
              justifyContent: "space-between",
              minWidth: 0,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                height: 40,
                width: 40,
                borderRadius: 48,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>P</Text>
            </View>

            <ThemedText>Protein</ThemedText>
            <ThemedText>0 of 128g</ThemedText>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#bcbcbcff",
              height: 128,
              borderRadius: 16,
              padding: 16,
              justifyContent: "space-between",
              minWidth: 0,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                height: 40,
                width: 40,
                borderRadius: 48,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>P</Text>
            </View>

            <ThemedText>Carbs</ThemedText>
            <ThemedText>0 of 68g</ThemedText>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#bcbcbcff",
              height: 128,
              borderRadius: 16,
              padding: 16,
              justifyContent: "space-between",
              minWidth: 0,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                height: 40,
                width: 40,
                borderRadius: 48,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>P</Text>
            </View>

            <ThemedText>Fats</ThemedText>
            <ThemedText>0 of 54g</ThemedText>
          </View>
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
}));
