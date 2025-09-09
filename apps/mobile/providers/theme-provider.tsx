import { ReactNode, createContext, useContext } from "react";

import { COLORS, Colors } from "@/constants/styles/colors";
import { Spacings } from "@/constants/styles/spacings";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ThemeContextType {
  colors: Colors;
  spacings: Spacings;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ThemeContext.Provider
      value={{
        colors: isDark ? COLORS["dark"] : COLORS["light"],
        spacings: {},
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export function useThemedStyles<T>(
  styleFactory: (args: { colors: Colors; isDark: boolean }) => T
): T {
  const { colors, isDark } = useTheme();
  return styleFactory({ colors, isDark });
}
