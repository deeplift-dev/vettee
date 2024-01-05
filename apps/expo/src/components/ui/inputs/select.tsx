import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
}

export default function Select({ value, onValueChange, items }: SelectProps) {
  return (
    <View className="h-60 w-full rounded-lg border border-gray-200 shadow">
      <Picker mode="dialog" selectedValue={value} onValueChange={onValueChange}>
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}
