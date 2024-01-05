import React, { forwardRef, useCallback, useMemo, useRef } from "react";
import { Button, Pressable, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoints?: string[];
  handleSheetChanges?: (index: number) => void;
}

type Ref = BottomSheet | null;

const CustomBottomSheet = forwardRef<Ref, BottomSheetProps>(
  ({ children, snapPoints, handleSheetChanges }, ref) => {
    // variables
    const _snapPoints = snapPoints ?? useMemo(() => ["20%", "35%"], []);

    // renders
    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={_snapPoints}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
      >
        <View className="flex">{children}</View>
      </BottomSheet>
    );
  },
);

CustomBottomSheet.displayName = "BottomSheet";

export default CustomBottomSheet;
