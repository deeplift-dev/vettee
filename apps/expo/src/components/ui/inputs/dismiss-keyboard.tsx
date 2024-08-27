import { Keyboard, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface DismissKeyboardProps {
  children: React.ReactNode;
}

export default function DismissKeyboard(props: DismissKeyboardProps) {
  const { children } = props;
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableOpacity onPress={dismissKeyboard}>
      <View>{children}</View>
    </TouchableOpacity>
  );
}
