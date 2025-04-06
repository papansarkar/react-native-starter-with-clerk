import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const useHeaderOptions = (): NativeStackNavigationOptions => {
  // iOS-specific styling
  const iosOptions: NativeStackNavigationOptions = {
    // ios
    headerLargeTitle: true,
    headerTransparent: true,
    headerBlurEffect: "systemChromeMaterial",
    headerLargeTitleShadowVisible: false,
    headerShadowVisible: true,
    headerLargeStyle: {
      backgroundColor: "transparent",
    },
  };

  // Android-specific styling (mimicking iOS large title effect)
  const androidOptions: NativeStackNavigationOptions = {
    // Android
    headerTransparent: false,
    headerStyle: {
      // backgroundColor: "transparent", // Semi-transparent background
    },
    headerTitleStyle: {
      fontSize: 24,
      fontWeight: "bold",
    },
    headerShadowVisible: false,
    headerTitleAlign: "center",
  };

  return process.env.EXPO_OS === "ios" ? iosOptions : androidOptions;
};

export default useHeaderOptions;
