import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/useColorScheme";
import "@/lib/polyfills";
import { AuthProvider, useAuth } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";

function App() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { session, isLoading } = useAuth();

  if (!loaded || isLoading) {
    // Async font loading and auth loading
    return null;
  }

  const isLoggedIn = Boolean(session && session.user);

  return (
    <SafeAreaProvider>
      <NavThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <ThemeProvider>
          <Stack>
            <Stack.Protected guard={isLoggedIn}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>

            <Stack.Protected guard={!isLoggedIn}>
              <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack.Protected>

            <Stack.Screen name="+not-found" />
          </Stack>

          <StatusBar style="auto" />
        </ThemeProvider>
      </NavThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
