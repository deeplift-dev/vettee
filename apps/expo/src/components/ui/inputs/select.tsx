import { View } from "react-native";
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
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@gluestack-ui/themed";

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
          <FormControlLabelText fontWeight="bold" fontSize="$lg">
            {props.label}
          </FormControlLabelText>
        </FormControlLabel>
        <Select>
          <Box borderWidth={1} borderColor="$blue100" borderRadius={10}>
            <SelectTrigger
              variant="outline"
              size="xl"
              height={45}
              borderRadius={10}
              backgroundColor="white"
              py={0}
            >
              <SelectInput fontSize={18} placeholder="Select option" />
            </SelectTrigger>
          </Box>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {props.items.map((item) => (
                <SelectItem label={item.label} value={item.value} />
              ))}
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
