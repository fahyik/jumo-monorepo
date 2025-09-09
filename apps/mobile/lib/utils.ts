import { Colors } from "@/constants/styles/colors";

export const createThemedStyles = <T>(
  styleFactory: (args: { colors: Colors; isDark: boolean }) => T
) => styleFactory;
