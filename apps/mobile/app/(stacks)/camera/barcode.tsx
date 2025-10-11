import { useLocalSearchParams } from "expo-router";

import { BarcodeScreen } from "@/screens/food-input/barcode-screen";

export default function Modal() {
  const params = useLocalSearchParams();

  return <BarcodeScreen barcode={params.barcode as string | undefined} />;
}
