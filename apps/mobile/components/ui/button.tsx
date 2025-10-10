import { Pressable, Text, ViewStyle } from "react-native";

import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
}

export function Button({
  onPress,
  children,
  variant = "primary",
  style,
}: ButtonProps) {
  const styles = useThemedStyles(themedStyles);

  const buttonStyle =
    variant === "primary" ? styles.primaryButton : styles.secondaryButton;
  const textStyle =
    variant === "primary"
      ? styles.primaryButtonText
      : styles.secondaryButtonText;

  return (
    <Pressable style={[buttonStyle, style]} onPress={onPress}>
      {({ pressed }) => (
        <Text style={[textStyle, pressed && styles.buttonPressed]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  primaryButton: {
    backgroundColor: colors.tint,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.oppositeForeground,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: colors.backgroundMuted,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.7,
  },
}));
