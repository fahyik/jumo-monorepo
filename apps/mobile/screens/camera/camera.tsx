import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ImagePicker } from "./image-picker";

import { BackButton } from "@/components/navigation/back";

const SCAN_COOLDOWN = 2000; // 2 seconds cooldown between scans

export function CameraScreen() {
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
          pathname: "/(stacks)/camera/modal-image",
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
      console.log(scan);
      showFocusBox(scan);

      router.navigate({
        pathname: "/(stacks)/camera/modal-barcode",
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
      <View
        style={{
          top: insets.top,
          position: "absolute",
        }}
      >
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

      <View
        style={[styles.optionsContainer, { height: insets.bottom * 2 + 72 }]}
      >
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: 16,
            transform: [{ translateY: "-50%" }],
          }}
        >
          <ImagePicker
            onImageSelect={(asset) => {
              setIsCameraActive(false);
              router.navigate({
                pathname: "/(stacks)/camera/modal-image",
                params: {
                  imageUri: asset.uri,
                  mimeType: asset.mimeType,
                },
              });
            }}
          />
        </View>
        <Pressable
          style={[
            styles.shutterBtn,
            {
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
            },
          ]}
          onPress={takePicture}
        >
          {({ pressed }) => (
            <View
              style={[
                {
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.shutterBtnInner,
                  {
                    backgroundColor: "white",
                  },
                ]}
              />
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
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
    // alignItems: "center",
    // minHeight: 120,
    bottom: 0,
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
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: "white",
    width: 72,
    height: 72,
    borderRadius: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 64,
  },
  focusBox: {
    position: "absolute",
    borderWidth: 4,
    borderColor: "#e7a325be",
  },
});
