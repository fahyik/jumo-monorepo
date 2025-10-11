import { BlurView } from "expo-blur";
import { View, useColorScheme } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { NutritionInfo } from "./components/nutrition-info";

import { ProviderFood } from "@jumo-monorepo/interfaces";

import { ModalClose } from "@/components/navigation/modal-close";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

interface FoodPhotoScreenProps {
  providerFoodData: ProviderFood;
}

export function FoodInput({ providerFoodData }: FoodPhotoScreenProps) {
  const styles = useThemedStyles(themedStyles);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const blurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <Animated.View
        style={[styles.blurContainer, { height: insets.top }, blurStyle]}
        pointerEvents="none"
      >
        <BlurView
          intensity={40}
          tint={colorScheme === "dark" ? "dark" : "light"}
          style={styles.blurView}
        />
      </Animated.View>

      <View style={[styles.modalCloseContainer, { top: insets.top }]}>
        <ModalClose />
      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingTop: insets.top },
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {providerFoodData && <NutritionInfo data={providerFoodData} />}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  noImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    gap: 16,
  },
  blurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: "hidden",
  },
  blurView: {
    flex: 1,
  },
  modalCloseContainer: {
    position: "absolute",
    left: 0,
    right: 16,
    zIndex: 1,
  },
  imageWrapper: {
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
    paddingTop: 50,
  },
  scrollViewContent: {
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    textAlign: "center",
    color: colors.textMuted,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
}));
