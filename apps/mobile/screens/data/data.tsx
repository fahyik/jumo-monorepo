import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Image, ImageStyle } from "expo-image";
import { useEffect, useState } from "react";
import { RefreshControl, SectionList, StyleProp, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NutrientRow } from "../food-input/components/nutrient-row";

import type { Meal } from "@jumo-monorepo/interfaces";

import { ThemedText } from "@/components/ThemedText";
import { FONTS } from "@/constants/styles/fonts";
import { getMealItemImage } from "@/lib/queries/get-meal-item-image";
import { getMeals } from "@/lib/queries/get-meals";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

interface MealItemImageProps {
  image:
    | { type: "storage"; bucket: string; path: string }
    | { type: "external"; url: string };
  style: StyleProp<ImageStyle>;
}

function MealItemImage({ image, style }: MealItemImageProps) {
  const queryClient = useQueryClient();
  const [imageUri, setImageUri] = useState<string>("");

  useEffect(() => {
    const fetchImageUri = async () => {
      if (image.type === "external") {
        setImageUri(image.url);
      } else if (image.type === "storage") {
        try {
          const imagePath = image.path;
          const signedUrl = await queryClient.fetchQuery({
            queryKey: ["mealItemImage", imagePath],
            queryFn: () => getMealItemImage(imagePath),
            staleTime: Infinity,
          });
          setImageUri(signedUrl);
        } catch (error) {
          console.warn("Failed to fetch image:", error);
        }
      }
    };

    fetchImageUri();
  }, [image, queryClient]);

  return (
    <Image
      source={{ uri: imageUri }}
      style={style}
      contentFit="cover"
      placeholder={require("../../assets/images/app/egg-cracking.png")}
      placeholderContentFit="cover"
      transition={200}
    />
  );
}

export function DataScreen() {
  const styles = useThemedStyles(themedStyles);

  const options = {
    groupBy: "day" as const,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const {
    data: mealsGroupedByDay,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["meals", options],
    queryFn: async () => getMeals(options),
  });

  const sections = mealsGroupedByDay
    ? Object.entries(mealsGroupedByDay)
        .map(([date, meals]) => ({
          title: date,
          data: meals,
          nutrients: aggregateNutrients(meals),
        }))
        .sort((a, b) => b.title.localeCompare(a.title))
    : [];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ThemedText>Loading meals...</ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <SectionList
        contentContainerStyle={styles.contentContainer}
        sections={sections}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <ThemedText type="titleSmall">{formatDate(title)}</ThemedText>
          </View>
        )}
        renderItem={({ item }) => {
          const mealNutrients = aggregateNutrients([item]);
          return (
            <View style={styles.mealItem}>
              <View style={styles.mealHeader}>
                <ThemedText style={styles.mealName}>
                  {item.name || "Unnamed meal"}
                </ThemedText>
                <ThemedText style={styles.mealTime}>
                  {format(new Date(item.consumedAt), "h:mm a")}
                </ThemedText>
              </View>
              {item.items && item.items.length > 0 && (
                <View style={styles.itemsContainer}>
                  {item.items.map((mealItem, index) => (
                    <View key={index} style={styles.itemRow}>
                      <MealItemImage
                        image={mealItem.providerFood.foodData.image}
                        style={styles.itemThumbnail}
                      />
                      <ThemedText style={styles.itemText}>
                        {mealItem.providerFood.foodData.name}{" "}
                        {mealItem.quantity} {mealItem.unit}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              )}
              <NutrientRow nutrition={mealNutrients} />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText>No meals found</ThemedText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function aggregateNutrients(meals: Meal[]) {
  let energy = 0;
  let carbohydrates = 0;
  let proteins = 0;
  let fats = 0;

  meals.forEach((meal) => {
    if (meal.nutrients) {
      meal.nutrients.forEach((n) => {
        const nutrientName = n.nutrient.name.toLowerCase();
        if (nutrientName === "energy") {
          energy += n.amount;
        }
        if (nutrientName === "carbohydrates") {
          carbohydrates += n.amount;
        }
        if (nutrientName === "proteins") {
          proteins += n.amount;
        }
        if (nutrientName === "fats") {
          fats += n.amount;
        }
      });
    }
  });

  return {
    energy: Math.round(energy),
    carbohydrates: Math.round(carbohydrates * 10) / 10,
    proteins: Math.round(proteins * 10) / 10,
    fats: Math.round(fats * 10) / 10,
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateString === format(today, "yyyy-MM-dd")) {
    return "Today";
  } else if (dateString === format(yesterday, "yyyy-MM-dd")) {
    return "Yesterday";
  } else {
    return format(date, "EEEE, MMM d");
  }
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  sectionHeader: {
    paddingVertical: 12,
    backgroundColor: colors.background,
    gap: 8,
  },
  mealItem: {
    backgroundColor: colors.backgroundMuted,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mealName: {
    fontFamily: FONTS.bodyMedium,
  },
  mealTime: {
    fontSize: 14,
    opacity: 0.7,
  },
  itemsContainer: {
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemThumbnail: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  itemText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: colors.text,
    opacity: 0.8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 32,
  },
}));
