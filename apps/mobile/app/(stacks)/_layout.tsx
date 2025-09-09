import { Stack } from "expo-router";

export default function StacksLayout() {
  return (
    <Stack>
      <Stack.Screen name="chat" options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen
        name="camera"
        options={{ headerShown: false }}
      ></Stack.Screen>
    </Stack>
  );
}
