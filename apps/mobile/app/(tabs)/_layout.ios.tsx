import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

import { useTheme } from "@/providers/theme-provider";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <NativeTabs
      tintColor={colors.tint}
      minimizeBehavior="onScrollDown"
      backgroundColor={"#ffffff55"}
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={{ default: "house", selected: "house.fill" }} drawable="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="data">
        <Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} drawable="chart" />
        <Label>Data</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} drawable="settings" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
