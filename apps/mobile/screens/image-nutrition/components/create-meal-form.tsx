import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";

import { Button } from "@/components/ui/button";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

interface CreateMealFormProps {
  onSubmit: (mealName: string, notes: string, consumedAt: Date) => void;
  onCancel: () => void;
  foodName: string;
  portionSize: number;
  portionUnit: string;
  adjustedNutrition: {
    energy: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
  };
}

export function CreateMealForm({
  onSubmit,
  onCancel,
  foodName,
  portionSize,
  portionUnit,
  adjustedNutrition,
}: CreateMealFormProps) {
  const styles = useThemedStyles(themedStyles);
  const [mealName, setMealName] = useState("");
  const [notes, setNotes] = useState("");
  const [consumedAt, setConsumedAt] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleSubmit = () => {
    if (mealName.trim()) {
      onSubmit(mealName, notes, consumedAt);
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Meal</Text>

      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Adding to meal:</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 4 }}>
            <Text style={styles.foodName}>{foodName}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.portionText}>
              {portionSize} {portionUnit}
            </Text>
          </View>
        </View>

        <View style={styles.macrosRow}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{adjustedNutrition.energy}</Text>
            <Text style={styles.macroLabel}>kcal</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>
              {adjustedNutrition.carbohydrates}g
            </Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{adjustedNutrition.proteins}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{adjustedNutrition.fats}g</Text>
            <Text style={styles.macroLabel}>Fats</Text>
          </View>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Time of meal</Text>
        <TouchableOpacity
          style={styles.dateButton}
          activeOpacity={0.7}
          onPress={() => {
            setIsDatePickerOpen(true);
          }}
        >
          <Text style={styles.dateButtonText}>
            {formatDateTime(consumedAt)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Meal Name</Text>
        <BottomSheetTextInput
          style={styles.input}
          value={mealName}
          onChangeText={setMealName}
          placeholder="e.g., Breakfast, Lunch, Snack..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Notes (Optional)</Text>
        {/* NOTE: keyboard doesnt scroll up for multi-line inputs */}
        <BottomSheetTextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any notes about this meal..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <DatePicker
        modal
        minuteInterval={5}
        open={isDatePickerOpen}
        date={consumedAt}
        onConfirm={(date) => {
          setIsDatePickerOpen(false);
          setConsumedAt(date);
        }}
        onCancel={() => {
          setIsDatePickerOpen(false);
        }}
        mode="datetime"
        maximumDate={new Date()}
      />

      <View style={styles.buttonGroup}>
        <Button variant="primary" onPress={handleSubmit}>
          Create Meal
        </Button>
        <Button variant="secondary" onPress={onCancel}>
          Cancel
        </Button>
      </View>
    </View>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  previewCard: {
    backgroundColor: colors.backgroundMuted,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  portionText: {
    fontSize: 20,
    fontWeight: "200",
    color: colors.text,
  },
  macrosRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  macroItem: {
    alignItems: "center",
    gap: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  formGroup: {
    gap: 8,
    zIndex: 100,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  input: {
    backgroundColor: colors.backgroundMuted,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  dateButton: {
    backgroundColor: colors.backgroundMuted,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 200,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 8,
  },
}));
