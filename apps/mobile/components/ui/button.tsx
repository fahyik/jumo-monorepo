import { Pressable, Text, ViewStyle } from "react-native";

import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
  disabled?: boolean;
}

export function Button({
  onPress,
  children,
  variant = "primary",
  style,
  disabled = false,
}: ButtonProps) {
  const styles = useThemedStyles(themedStyles);

  const buttonStyle =
    variant === "primary" ? styles.primaryButton : styles.secondaryButton;
  const textStyle =
    variant === "primary"
      ? styles.primaryButtonText
      : styles.secondaryButtonText;

  return (
    <Pressable
      style={[buttonStyle, disabled && styles.buttonDisabled, style]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      {({ pressed }) => (
        <Text
          style={[
            textStyle,
            pressed && !disabled && styles.buttonPressed,
            disabled && styles.buttonTextDisabled,
          ]}
        >
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },
}));
