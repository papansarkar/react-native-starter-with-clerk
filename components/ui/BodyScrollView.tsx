import { forwardRef } from "react";
import { ScrollView, ScrollViewProps, Platform } from "react-native";

export const BodyScrollView = forwardRef<any, ScrollViewProps>((props, ref) => {
  return (
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior='automatic'
      contentInset={{ bottom: 0 }}
      scrollIndicatorInsets={{ bottom: 0 }}
      // Android-specific props
      overScrollMode={Platform.OS === "android" ? "always" : undefined}
      showsVerticalScrollIndicator={true}
      style={Platform.OS === "android" ? { flex: 1 } : undefined}
      {...props}
      ref={ref}
    />
  );
});
