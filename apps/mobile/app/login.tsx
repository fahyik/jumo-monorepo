import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GoogleSignIn } from "@/components/auth/google-signin";

export default function Auth() {
  return (
    <SafeAreaView style={styles.container}>
      <GoogleSignIn></GoogleSignIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    height: "100%",
    justifyContent: "center",
  },
});
