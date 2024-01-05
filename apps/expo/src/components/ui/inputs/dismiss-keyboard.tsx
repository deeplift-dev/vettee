import { Keyboard, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

interface DismissKeyboardProps {
  children: React.ReactNode;
}

export default function DismissKeyboard(props: DismissKeyboardProps) {
  const { children } = props;
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View>{children}</View>
    </TouchableWithoutFeedback>
  );
}
