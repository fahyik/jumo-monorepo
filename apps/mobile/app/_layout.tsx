import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { COLORS } from "@/constants/styles/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
// import "@/lib/polyfills";
import { AuthProvider, useAuth } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

SplashScreen.preventAutoHideAsync();

function App() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { session, isLoading } = useAuth();

  const ready = !isLoading && loaded;

  useEffect(() => {
    if (!ready) {
      SplashScreen.hide();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  const isLoggedIn = Boolean(session && session.user);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavThemeProvider
          value={
            colorScheme === "dark"
              ? {
                  ...DarkTheme,
                  colors: {
                    ...DarkTheme.colors,
                    background: COLORS.dark.background,
                  },
                }
              : DefaultTheme
          }
        >
          <ThemeProvider>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Protected guard={isLoggedIn}>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(stacks)"
                    options={{ headerShown: false }}
                  />
                </Stack.Protected>

                <Stack.Protected guard={!isLoggedIn}>
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                </Stack.Protected>

                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </BottomSheetModalProvider>
          </ThemeProvider>
        </NavThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  );
}
