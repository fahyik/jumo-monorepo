import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModalImage() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [isLoading, setIsLoading] = useState(true);

  if (!imageUri) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No image to display</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "transparent",
        paddingHorizontal: 16,
        paddingTop: 24,
        gap: 16,
      }}
    >
      <View
        style={{
          width: "100%",
          height: "50%",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        {isLoading && <ActivityIndicator size="large" />}
      </View>
    </SafeAreaView>
  );
}
