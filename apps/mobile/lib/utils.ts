import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { ThemeContextType } from "@/providers/theme-provider";

type StyleProp = ViewStyle | TextStyle | ImageStyle;
type StylesObject = Record<string, StyleProp>;

export const createThemedStyles = <T extends StylesObject>(
  styleFactory: (args: ThemeContextType) => T
) => {
  return (args: ThemeContextType) => StyleSheet.create(styleFactory(args));
};
