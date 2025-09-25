import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "expo-router";
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

import { ThemedText } from "@/components/ThemedText";
import { BackButton } from "@/components/navigation/back";
import { supabase } from "@/lib/supabase";
import { createThemedStyles } from "@/lib/utils";
import { useTheme, useThemedStyles } from "@/providers/theme-provider";

export function ChatScreen() {
  const styles = useThemedStyles(themedStyles);
  const router = useRouter();
  const { colors } = useTheme();

  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, error, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/chat`,
      headers: async () => ({
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      }),
    }),
    onError: (error) => console.error(error, "ERROR"),
  });

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (error) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.keyboardAvoidingView]}
      >
        <BackButton />

        <ScrollView ref={scrollViewRef} style={styles.scrollView}>
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.messageContainer,
                m.role === "user"
                  ? styles.userMessageContainer
                  : styles.assistantMessageContainer,
              ]}
            >
              <View
                style={
                  m.role === "user" ? styles.userBubble : styles.assistantBubble
                }
              >
                {m.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return m.role === "user" ? (
                        <Text key={`${m.id}-${i}`} style={styles.userText}>
                          {part.text}
                        </Text>
                      ) : (
                        <ThemedText key={`${m.id}-${i}`}>
                          {part.text}
                        </ThemedText>
                      );
                  }
                })}
              </View>
            </View>
          ))}
          {(status === "streaming" || status === "submitted") && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0000ff" />
              <ThemedText style={styles.loadingText}>
                AI is thinking...
              </ThemedText>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            // placeholderTextColor={"lightgray"}
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

const themedStyles = createThemedStyles(({ colors, isDark }) => ({
  container: {
    flexDirection: "column",
    gap: 8,
    height: "100%",
    padding: 12,
  },
  messageInput: {
    backgroundColor: colors.backgroundMuted,
    padding: 16,
    borderRadius: 8,
    color: colors.text,
  },
  userBubble: {
    backgroundColor: colors.tint,
    alignSelf: "flex-end",
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  userText: {
    color: colors.oppositeForeground,
  },
  assistantBubble: {
    backgroundColor: colors.backgroundMuted,
    alignSelf: "flex-start",
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 8,
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  assistantMessageContainer: {
    justifyContent: "flex-start",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inputContainer: {
    padding: 8,
  },
  loadingContainer: {
    marginVertical: 8,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
}));
