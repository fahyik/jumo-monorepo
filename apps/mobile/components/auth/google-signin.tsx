import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Image } from "expo-image";
import { Text, TouchableOpacity } from "react-native";

import { supabase } from "@/lib/supabase";

export function GoogleSignIn() {
  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGNIN_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGNIN_WEB_CLIENT_ID,
  });
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={{
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#FFF",
        borderColor: "#0000007c",
        width: "100%",
        height: 37,
      }}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();

          if (userInfo.data?.idToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: userInfo.data.idToken,
            });

            if (error) {
              console.error(error);
            }
          } else {
            throw new Error("no ID token present!");
          }
        } catch (error: any) {
          console.log(error);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}
    >
      <Image
        source={require("@/assets/images/google.png")}
        style={{ width: 17, height: 17 }}
      />
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
}
