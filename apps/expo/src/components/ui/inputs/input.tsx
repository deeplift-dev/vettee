import type { TextInputProps } from "react-native";
import { TextInput, View } from "react-native";

interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export default function Input(props: InputProps) {
  return (
    <View
      className={`h-12 w-full rounded-lg border border-gray-200 shadow ${props.className}`}
    >
      <TextInput style={{ fontSize: 20 }} className="h-full px-4" {...props} />
    </View>
  );
}
