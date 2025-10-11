export function convertUnit(amount: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return amount;

  // g to mg
  if (fromUnit === "g" && toUnit === "mg") {
    return amount * 1000;
  }

  // mg to g
  if (fromUnit === "mg" && toUnit === "g") {
    return amount / 1000;
  }

  // No conversion available, return original amount
  return amount;
}
