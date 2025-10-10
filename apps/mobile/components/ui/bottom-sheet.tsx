import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { ReactNode, forwardRef, useCallback } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/providers/theme-provider";

interface BottomSheetProps {
  children: ReactNode;
}

export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ children }, ref) => {
    const { colors } = useTheme();

    const insets = useSafeAreaInsets();

    const renderBackdrop = useCallback(
      (props_: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props_}
          pressBehavior="close"
          disappearsOnIndex={-1}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["100%"]}
        enablePanDownToClose
        enableDynamicSizing={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        topInset={insets.top}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colors.background,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.backgroundMuted,
        }}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

BottomSheet.displayName = "BottomSheet";

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
});
