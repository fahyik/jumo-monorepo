import * as AppleAuthentication from "expo-apple-authentication";
import { Image } from "expo-image";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/providers/theme-provider";

export function AppleSignIn() {
  if (Platform.OS !== "ios") {
    return null;
  }

  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        styles.button,
        {
          backgroundColor: "#FFF",
          borderColor: "#0000007c",
        },
      ]}
      onPress={async () => {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          // Sign in via Supabase Auth.
          if (credential.identityToken) {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: "apple",
              token: credential.identityToken,
            });

            if (!error) {
              // User is signed in.
            }
          } else {
            throw new Error("No identityToken.");
          }
        } catch (e) {
          //@ts-expect-error FIXME
          if (e.code === "ERR_REQUEST_CANCELED") {
            // handle that the user canceled the sign-in flow
          } else {
            // handle other errors
          }
        }
      }}
    >
      <Image
        source={require("@/assets/images/apple.png")}
        style={{ width: 35, height: 35 }}
      />
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
        Sign in with Apple
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    width: "100%",
    height: 37,
  },
});
