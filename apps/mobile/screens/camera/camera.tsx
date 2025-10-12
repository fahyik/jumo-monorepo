import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Button, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ImagePicker } from "./components/image-picker";

import { BackButton } from "@/components/navigation/back";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

const SCAN_COOLDOWN = 2000; // 2 seconds cooldown between scans

export function CameraScreen() {
  const styles = useThemedStyles(themedStyles);

  const [permission, requestPermission] = useCameraPermissions();
  const [scannedBarcode, setScannedBarcode] =
    useState<BarcodeScanningResult | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);

  const ref = useRef<CameraView>(null);
  const focusOpacity = useRef(new Animated.Value(0)).current;
  const lastScanTime = useRef<number>(0);

  const insets = useSafeAreaInsets();

  const router = useRouter();

  const takePicture = async () => {
    try {
      const photo = await ref.current?.takePictureAsync();

      if (photo?.uri) {
        setIsCameraActive(false);
        router.navigate({
          pathname: "/(stacks)/camera/photo",
          params: {
            imageUri: photo.uri,
            mimeType: `image/${photo.format}`,
          },
        });
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  };

  const showFocusBox = useCallback(
    (barcode: BarcodeScanningResult) => {
      setScannedBarcode(barcode);
      setIsScanning(false); // Stop scanning temporarily

      // Animate focus box appearance
      Animated.sequence([
        Animated.timing(focusOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(focusOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Clear the barcode state and re-enable scanning after animation completes
      setTimeout(() => {
        setScannedBarcode(null);
        setIsScanning(true); // Re-enable scanning
      }, 1900); // 200ms + 1500ms + 200ms
    },
    [focusOpacity]
  );

  const handleBarcodeScanned = useCallback(
    (scan: BarcodeScanningResult) => {
      setIsCameraActive(false);
      const now = Date.now();

      // Throttle: Only process if enough time has passed since last scan
      if (now - lastScanTime.current < SCAN_COOLDOWN) {
        return;
      }

      // Don't process if we're already showing a scanned barcode
      if (!isScanning) {
        return;
      }

      lastScanTime.current = now;
      showFocusBox(scan);

      router.navigate({
        pathname: "/(stacks)/camera/barcode",
        params: {
          barcode: scan.data,
        },
      });
    },
    [isScanning, router, showFocusBox]
  );

  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);
    }, [])
  );

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.backButtonContainer, { top: insets.top }]}>
        <BackButton />
      </View>

      <CameraView
        ref={ref}
        style={styles.camera}
        active={isCameraActive}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8"],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      {scannedBarcode && scannedBarcode.bounds && (
        <Animated.View
          style={[
            styles.focusBox,
            {
              opacity: focusOpacity,
              left: scannedBarcode.bounds.origin.x - 24,
              top: scannedBarcode.bounds.origin.y - 24,
              width: scannedBarcode.bounds.size.width + 48,
              height: scannedBarcode.bounds.size.height + 48,
            },
          ]}
        />
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Take a photo or scan the barcode of what you are eating
        </Text>
      </View>

      <View
        style={[styles.optionsContainer, { height: insets.bottom * 2 + 72 }]}
      >
        <View style={styles.imagePickerContainer}>
          <ImagePicker
            onImageSelect={(asset) => {
              setIsCameraActive(false);
              router.navigate({
                pathname: "/(stacks)/camera/photo",
                params: {
                  imageUri: asset.uri,
                  mimeType: asset.mimeType,
                },
              });
            }}
          />

          {/* <Pressable
            style={{ backgroundColor: "red", height: 50, width: 50 }}
            onPress={() => handleBarcodeScanned({ data: "3270160694631" })}
          >
            {({ pressed }) => (
              <View
                style={[styles.shutterBtnOuter, { opacity: pressed ? 0.5 : 1 }]}
              ></View>
            )}
          </Pressable> */}
        </View>
        <Pressable style={styles.shutterBtn} onPress={takePicture}>
          {({ pressed }) => (
            <View
              style={[styles.shutterBtnOuter, { opacity: pressed ? 0.5 : 1 }]}
            >
              <View style={styles.shutterBtnInner} />
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const themedStyles = createThemedStyles(({ colors }) => ({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: colors.text,
  },
  backButtonContainer: {
    position: "absolute",
  },
  camera: {
    flex: 1,
    backgroundColor: "black",
  },
  optionsContainer: {
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "#ffffff1b",
    width: "100%",
    bottom: 0,
  },
  imagePickerContainer: {
    position: "absolute",
    top: "50%",
    left: 16,
    transform: [{ translateY: "-50%" }],
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  shutterBtn: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: "white",
    width: 72,
    height: 72,
    borderRadius: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnOuter: {
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 64,
    backgroundColor: "white",
  },
  focusBox: {
    position: "absolute",
    borderWidth: 4,
    borderColor: "#e7a325be",
  },
  infoBox: {
    position: "absolute",
    bottom: 160,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    backgroundColor: colors.background,
    opacity: 0.7,
    borderRadius: 12,
    padding: 8,
    width: "50%",
  },

  infoText: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
    textAlign: "center",
  },
}));
