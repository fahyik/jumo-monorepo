import { useLocalSearchParams } from "expo-router";

import { BarcodeScreen } from "@/screens/barcode/barcode";

export default function Modal() {
  const params = useLocalSearchParams();

  return <BarcodeScreen barcode={params.barcode as string | undefined} />;
}
