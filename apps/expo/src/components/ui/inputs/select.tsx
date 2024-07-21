import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  AlertCircleIcon,
  Box,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  ScrollView,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  View,
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  disabled?: boolean;
  invalid?: boolean;
  readonly?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  label: string;
  errorText?: string;
  helperText?: string;
}

export default function BaseSelect(props: SelectProps) {
  return (
    <Box h="$24" w="$full">
      <FormControl
        isDisabled={props.disabled}
        isInvalid={props.invalid}
        isReadOnly={props.readonly}
        isRequired={props.required}
      >
        <FormControlLabel mb="$2" px={2}>
          <FormControlLabelText fontFamily="$mono" fontSize="$lg">
            {props.label}
          </FormControlLabelText>
        </FormControlLabel>
        <Select
          isFocusVisible={true}
          isFocused={false}
          onValueChange={props.onValueChange}
        >
          <Box borderWidth={0.3} borderColor="$blue100" borderRadius={10}>
            <SelectTrigger
              variant="outline"
              size="xl"
              height={45}
              borderRadius={5}
              backgroundColor="white"
              py={0}
            >
              <SelectInput
                fontFamily="$mono"
                fontSize="$md"
                placeholder={
                  props.placeholder ? props.placeholder : "Select option"
                }
              />
            </SelectTrigger>
          </Box>
          <SelectPortal style={{ zIndex: 100000 }}>
            <SelectBackdrop />
            <SelectContent style={{ zIndex: 1000 }}>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <View w="$full" h="$full" pb="$4">
                <FlashList
                  estimatedItemSize={20}
                  data={props.items}
                  keyExtractor={(item, index) => `${item.value}-${index}`}
                  renderItem={(item) => (
                    <SelectItem
                      label={item.item.label}
                      value={item.item.value}
                    />
                  )}
                />
              </View>
            </SelectContent>
          </SelectPortal>
        </Select>
        <FormControlHelper>
          <FormControlHelperText>{props.helperText}</FormControlHelperText>
        </FormControlHelper>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{props.errorText}</FormControlErrorText>
        </FormControlError>
      </FormControl>
    </Box>
  );
}
