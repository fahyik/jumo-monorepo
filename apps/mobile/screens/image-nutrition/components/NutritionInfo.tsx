import { Text, View } from "react-native";

interface NutritionData {
  name: string;
  description: string;
  nutritionPer100g: {
    carbohydrates: number;
    carbohydratesUnit: string;
    proteins: number;
    proteinsUnit: string;
    fats: number;
    fatsUnit: string;
    energy: number;
    energyUnit: string;
  };
  estimatedPortionSize: number;
  estimatedPortionSizeUnit: string;
  totalNutritionForEstimatedPortion: {
    carbohydrates: number;
    carbohydratesUnit: string;
    proteins: number;
    proteinsUnit: string;
    fats: number;
    fatsUnit: string;
    energy: number;
    energyUnit: string;
  };
  notes: string;
}

interface NutritionInfoProps {
  data: NutritionData;
}

export function NutritionInfo({ data }: NutritionInfoProps) {
  return (
    <View style={{ gap: 16 }}>
      <View>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
          {data.name}
        </Text>
        <Text style={{ fontSize: 16, color: "#666", lineHeight: 22 }}>
          {data.description}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#f5f5f5",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
          Nutrition per 100g
        </Text>
        <View style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>Energy:</Text>
            <Text style={{ fontWeight: "500" }}>
              {data.nutritionPer100g.energy} {data.nutritionPer100g.energyUnit}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>Carbohydrates:</Text>
            <Text style={{ fontWeight: "500" }}>
              {data.nutritionPer100g.carbohydrates}{" "}
              {data.nutritionPer100g.carbohydratesUnit}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>Proteins:</Text>
            <Text style={{ fontWeight: "500" }}>
              {data.nutritionPer100g.proteins}{" "}
              {data.nutritionPer100g.proteinsUnit}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>Fats:</Text>
            <Text style={{ fontWeight: "500" }}>
              {data.nutritionPer100g.fats} {data.nutritionPer100g.fatsUnit}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#e8f5e8",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
          Estimated Portion ({data.estimatedPortionSize}
          {data.estimatedPortionSizeUnit})
        </Text>
        <View style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>Energy:</Text>
            <Text style={{ fontWeight: "500" }}>
              {data.totalNutritionForEstimatedPortion.energy}{" "}
              {data.totalNutritionForEstimatedPortion.energyUnit}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>Carbohydrates:</Text>
            <Text style={{ fontWeight: "500" }}>
              {data.totalNutritionForEstimatedPortion.carbohydrates}{" "}
              {data.totalNutritionForEstimatedPortion.carbohydratesUnit}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>Proteins:</Text>
            <Text style={{ fontWeight: "500" }}>
              {data.totalNutritionForEstimatedPortion.proteins}{" "}
              {data.totalNutritionForEstimatedPortion.proteinsUnit}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>Fats:</Text>
            <Text style={{ fontWeight: "500" }}>
              {data.totalNutritionForEstimatedPortion.fats}{" "}
              {data.totalNutritionForEstimatedPortion.fatsUnit}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#fff3e0",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Notes
        </Text>
        <Text style={{ fontSize: 14, color: "#666", lineHeight: 20 }}>
          {data.notes}
        </Text>
      </View>
    </View>
  );
}
