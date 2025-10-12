const pkg = require("./package.json");

const BUILD = 1;
const VERSION_CODE = 1;

if (!process.env.APP_VARIANT) {
  console.warn(
    '🔴🔴 Env variable APP_VARIANT is undefined. Using "Development"\n[Ignore warning if app config is not required]'
  );
}

if (
  process.env.APP_VARIANT &&
  ["production", "preview", "development"].includes(process.env.APP_VARIANT) ===
    false
) {
  throw new Error(`Invalid value ${process.env.APP_VARIANT} for APP_VARIANT`);
}

function getVariantDefaults(appVariant) {
  switch (appVariant) {
    case "production":
      return {
        name: "Jumo",
        bundleId: "com.heyjumo.app",
        scheme: "heyjumo",
        ios: {
          associatedDomains: [],
          googleSignInUrlScheme: "",
        },
        android: {
          adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff",
          },
          googleServicesFile: "./google-services-prod.json",
          intentFilters: [],
        },
      };
    case "preview":
      return {
        name: "Jumo (Preview)",
        bundleId: "com.heyjumo.preview",
        scheme: "heyjumo",
        ios: {
          associatedDomains: [],
          googleSignInUrlScheme:
            "com.googleusercontent.apps.775079319916-84hqsredcutqo32otegrbflhfsa8n3bi",
        },
        android: {
          adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff",
          },
          googleServicesFile: "./google-services-dev.json",
          intentFilters: [],
        },
      };

    case "development":
    default:
      return {
        name: "Jumo (Dev)",
        bundleId: "com.heyjumo.dev",
        scheme: "heyjumo",
        ios: {
          associatedDomains: [],
          googleSignInUrlScheme:
            "com.googleusercontent.apps.775079319916-0iijlsjmhfrr23qt1jh422g000ceksdg",
        },
        android: {
          adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff",
          },
          googleServicesFile: "./google-services-dev.json",
          intentFilters: [],
        },
      };
  }
}

const defaults = getVariantDefaults(process.env.APP_VARIANT);

export default {
  expo: {
    name: defaults.name,
    slug: "jumo",
    version: pkg.version,
    orientation: "portrait",
    scheme: "heyjumo",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      ...(process.env.APP_VARIANT !== "production"
        ? { buildNumber: BUILD.toString() }
        : {}),
      icon: "./assets/app.icon",
      supportsTablet: true,
      bundleIdentifier: defaults.bundleId,
      usesAppleSignIn: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      ...(process.env.APP_VARIANT !== "production"
        ? { versionCode: VERSION_CODE }
        : {}),
      intentFilters: defaults.android.intentFilters,
      adaptiveIcon: defaults.android.adaptiveIcon,
      package: defaults.bundleId,
      edgeToEdgeEnabled: true,
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
      ],
    },
    web: {},
    plugins: [
      "expo-apple-authentication",
      "expo-router",
      "expo-web-browser",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon-light.png",
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/images/splash-icon-dark.png",
            backgroundColor: "#000000",
          },
          imageWidth: 200,
          resizeMode: "contain",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Allow $(PRODUCT_NAME) to access your photos for nutritional analysis",
        },
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: defaults.ios.googleSignInUrlScheme,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "b2c3a18b-aba6-4de0-8de0-89c9fa9e4cf8",
      },
    },
    updates: {
      url: "https://u.expo.dev/b2c3a18b-aba6-4de0-8de0-89c9fa9e4cf8",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    owner: "heyjumo",
  },
};
