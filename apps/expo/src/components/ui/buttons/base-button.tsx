import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import Text from "../text";

type ButtonVariant = "default" | "secondary" | "primary";

export function BaseButton({
  children,
  variant,
  onPress,
  className,
  style,
  disabled,
}: {
  children: React.ReactNode;
  onPress: () => void;
  className?: string;
  variant: ButtonVariant;
  style?: any;
  disabled?: boolean;
}) {
  const variantStyles = {
    default: "rounded bg-slate-900 py-4 font-medium text-white",
    primary: "bg-white text-white border-gray-300 border",
    secondary: "bg-white-500 text-black",
  };
  const isTextChild = typeof children === "string";

  return (
    <TouchableOpacity className="w-full" onPress={onPress} disabled={disabled}>
      <View
        className={`
      w-full
      rounded
      font-bold
      ${className}
      ${variantStyles.default}
      ${variantStyles[variant]}
    `}
      >
        {isTextChild ? (
          <Text
            fontSize={20}
            className="w-full text-center text-gray-50"
            fontWeight="400"
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </TouchableOpacity>
  );
}
