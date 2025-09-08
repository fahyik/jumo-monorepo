import { useChat } from "@ai-sdk/react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const { messages, error, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: "http://localhost:3001/chat",
    }),
    onError: (error) => console.error(error, "ERROR"),
  });

  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (error) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
          marginBottom: tabBarHeight,
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, paddingHorizontal: 16 }}
        >
          {messages.map((m) => (
            <View key={m.id} style={{ marginVertical: 8 }}>
              <View>
                <Text style={{ fontWeight: 700 }}>{m.role}</Text>
                {m.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
                  }
                })}
              </View>
            </View>
          ))}
          {(status === "streaming" || status === "submitted") && (
            <View style={{ marginVertical: 8, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#0000ff" />
              <Text style={{ marginTop: 4, fontSize: 12, color: "#666" }}>
                AI is thinking...
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={{ marginTop: 0 }}>
          <TextInput
            style={{ padding: 16, backgroundColor: "white" }}
            placeholder="Say something..."
            value={input}
            onChange={(e) => setInput(e.nativeEvent.text)}
            onSubmitEditing={(e) => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput("");
            }}
            autoFocus={true}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
