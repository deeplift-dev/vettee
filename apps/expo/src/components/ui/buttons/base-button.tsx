import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import clsx from "clsx";

type ButtonVariant =
  | "default"
  | "secondary"
  | "primary"
  | "outline"
  | "ghost"
  | "destructive";

interface BaseButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: object;
  disabled?: boolean;
  isLoading?: boolean;
}

export function BaseButton({
  children,
  variant = "default",
  onPress,
  style,
  disabled,
  isLoading = false,
}: BaseButtonProps) {
  const isTextChild = typeof children === "string";

  const buttonClassName = clsx(
    "bg-slate-900 py-4 rounded-2xl items-center justify-center", // default styles
    {
      "bg-white border-gray-300 border": variant === "primary",
      "bg-slate-500 text-black": variant === "secondary",
      "bg-transparent border-gray-300 border text-black": variant === "outline",
      "bg-transparent": variant === "ghost",
      "bg-red-500": variant === "destructive",
      "opacity-40": disabled,
    },
  );

  const textClassName = clsx("text-center text-xl font-semibold", {
    "text-white": variant !== "secondary" && variant !== "outline",
    "text-slate-900": variant === "secondary" || variant === "outline",
    "text-opacity-60": disabled,
  });

  return (
    <TouchableOpacity
      className={buttonClassName}
      style={style}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : isTextChild ? (
        <Text className={textClassName}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
