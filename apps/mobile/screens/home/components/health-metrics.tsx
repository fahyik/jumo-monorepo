import { View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { PixelBox } from "@/components/ui/pixel-box";
import { FONTS } from "@/constants/styles/fonts";
import { createThemedStyles } from "@/lib/utils";
import { useTheme, useThemedStyles } from "@/providers/theme-provider";

interface MetricRowProps {
  label: string;
  subLabel?: string;
  value: number;
  color: string;
}

function MetricRow({ label, subLabel = "", value, color }: MetricRowProps) {
  const styles = useThemedStyles(themedStyles);

  return (
    <View style={styles.metricRow}>
      <View
        style={{
          flexDirection: "row",
          width: "50%",
          justifyContent: "space-between",
        }}
      >
        <ThemedText style={styles.metricLabel}>{label}</ThemedText>
        <ThemedText style={styles.metricSublabel}>{subLabel}</ThemedText>
      </View>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${value}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

export function HealthMetrics() {
  const styles = useThemedStyles(themedStyles);

  const { colors } = useTheme();

  return (
    <PixelBox style={styles.container}>
      <MetricRow
        label="Sleep"
        subLabel="4h 23m"
        value={20}
        color={colors.primary}
      />
      <MetricRow label="Nutrition" value={60} color={colors.tint} />
      <MetricRow label="Energy" value={85} color={colors.tint} />
      <MetricRow label="Overall health" value={70} color={colors.tint} />
    </PixelBox>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    padding: 16,
    width: "100%",
    gap: 4,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metricLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
  },
  metricSublabel: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.backgroundMuted,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
}));
