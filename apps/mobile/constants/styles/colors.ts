/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
export type Colors = {
  text: string;
  textMuted: string;
  foreground: string;
  oppositeForeground: string;
  background: string;
  backgroundMuted: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;

  danger: string;

  primary: string;
  primaryLighter: string;
  primaryDarker: string;
};

const tintColorLight = "#2b2d2eff";
const tintColorDark = "#e5d8d8ff";

export const COLORS: {
  light: Colors;
  dark: Colors;
} = {
  light: {
    text: "#11181C",
    textMuted: "#666",
    foreground: "#11181C",
    oppositeForeground: "#ECEDEE",
    background: "#F2F1ED",
    backgroundMuted: "#d4d3cfff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    danger: "#f94848ff",

    primary: "#EC6565",
    primaryLighter: "#fed8d8ff",
    primaryDarker: "#CB3030",
  },
  dark: {
    text: "#ECEDEE",
    textMuted: "#969494ff",
    foreground: "#ECEDEE",
    oppositeForeground: "#151515ff",
    background: "#151718",
    backgroundMuted: "#262626ff",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    danger: "#f94848ff",

    primary: "#EC6565",
    primaryLighter: "#2d0303ff",
    primaryDarker: "#CB3030",
  },
};
