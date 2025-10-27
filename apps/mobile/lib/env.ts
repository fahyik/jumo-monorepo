import Constants from "expo-constants";

function getLocalIP(): string | null {
  // Try to extract IP from Expo's dev server host
  const debuggerHost = Constants.expoGoConfig?.debuggerHost;

  if (debuggerHost) {
    // debuggerHost format: "192.168.1.84:8081"
    return debuggerHost.split(":")[0];
  }

  return null;
}

function getBaseURL(envURL: string | undefined, port: number): string {
  if (!envURL) {
    throw new Error("Environment URL not configured");
  }

  if (__DEV__) {
    const localIP = getLocalIP();
    if (localIP) {
      return `http://${localIP}:${port}`;
    }
  }

  return envURL;
}

export const SUPABASE_URL = getBaseURL(
  process.env.EXPO_PUBLIC_SUPABSE_URL,
  54321
);

export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABSE_ANONYMOUS_KEY || "";

export const API_URL = getBaseURL(
  process.env.EXPO_PUBLIC_BACKEND_API_URL,
  3001
);
