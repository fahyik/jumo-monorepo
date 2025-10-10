import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  useColorScheme,
} from "react-native";
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

import { CreateMealForm } from "./components/create-meal-form";
import { AdjustedNutrition, NutritionInfo } from "./components/nutrition-info";
import { useImageUpload } from "./hooks/use-image-upload";

import { ModalClose } from "@/components/navigation/modal-close";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

interface ImageNutritionScreenProps {
  imageUri?: string;
  mimeType?: string;
}

export function ImageNutritionScreen({
  imageUri,
  mimeType,
}: ImageNutritionScreenProps) {
  const styles = useThemedStyles(themedStyles);
  const colorScheme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [mealData, setMealData] = useState<{
    nutritionData: any;
    portionSize: number;
    adjustedNutrition: AdjustedNutrition;
  } | null>(null);

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

  const { nutritionData, isLoading, error } = useImageUpload(
    imageUri,
    mimeType
  );

  const handleCreateMeal = (
    nutritionData: any,
    portionSize: number,
    adjustedNutrition: AdjustedNutrition
  ) => {
    setMealData({ nutritionData, portionSize, adjustedNutrition });
    bottomSheetRef.current?.present();
  };

  const handleMealFormSubmit = (
    mealName: string,
    notes: string,
    consumedAt: Date
  ) => {
    if (mealData) {
      console.log("Meal created:", {
        mealName,
        notes,
        consumedAt,
        ...mealData,
      });
      setMealData(null);
    }
    bottomSheetRef.current?.close();
  };

  const handleMealFormCancel = () => {
    setMealData(null);
    bottomSheetRef.current?.close();
  };

  if (!imageUri) {
    return (
      <View style={styles.noImageContainer}>
        <Text>No image to display</Text>
      </View>
    );
  }

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

      {(isLoading || error) && (
        <View style={styles.imageWrapper}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
        </View>
      )}

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingTop: insets.top },
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Analyzing your food...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}

        {nutritionData && (
          <NutritionInfo
            data={nutritionData}
            imageUri={imageUri}
            onCreateMeal={handleCreateMeal}
          />
        )}
      </Animated.ScrollView>

      <BottomSheet ref={bottomSheetRef}>
        {mealData && (
          <CreateMealForm
            onSubmit={handleMealFormSubmit}
            onCancel={handleMealFormCancel}
            foodName={mealData.nutritionData.name}
            portionSize={mealData.portionSize}
            portionUnit={mealData.nutritionData.estimatedPortionSizeUnit}
            adjustedNutrition={mealData.adjustedNutrition}
          />
        )}
      </BottomSheet>
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
