import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextStyle,
  useColorScheme,
  ViewStyle,
  View,
} from "react-native";
import { appleBlue, zincColors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";

type ButtonVariant = "filled" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  variant = "filled",
  size = "md",
  disabled = false,
  loading = false,
  children,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const sizeStyles: Record<
    ButtonSize,
    { height: number; fontSize: number; padding: number }
  > = {
    sm: { height: 36, fontSize: 14, padding: 12 },
    md: { height: 44, fontSize: 16, padding: 16 },
    lg: { height: 55, fontSize: 18, padding: 20 },
  };

  const getVariantStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    };

    switch (variant) {
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: isDark ? zincColors[50] : zincColors[900],
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: isDark ? zincColors[700] : zincColors[300],
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return isDark ? zincColors[700] : zincColors[200];
    }

    switch (variant) {
      case "filled":
        return isDark ? zincColors[900] : zincColors[50];
      case "outline":
      case "ghost":
        return appleBlue;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        getVariantStyle(),
        {
          height: sizeStyles[size].height,
          paddingHorizontal: sizeStyles[size].padding,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
      android_ripple={
        variant !== "ghost"
          ? {
              color: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
              borderless: false,
            }
          : null
      }
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: leftIcon || rightIcon ? "space-between" : "center",
            width: "100%",
          }}
        >
          {leftIcon && (
            <View>
              {React.cloneElement(leftIcon as React.ReactElement, {
                color: getTextColor(),
              })}
            </View>
          )}
          <ThemedText
            style={StyleSheet.flatten([
              {
                fontSize: sizeStyles[size].fontSize,
                color: getTextColor(),
                textAlign: "center",
                marginBottom: 0,
                fontWeight: "700",
              },
              textStyle,
            ])}
          >
            {children}
          </ThemedText>
          {rightIcon && (
            <View>
              {React.cloneElement(rightIcon as React.ReactElement, {
                color: getTextColor(),
              })}
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default Button;
