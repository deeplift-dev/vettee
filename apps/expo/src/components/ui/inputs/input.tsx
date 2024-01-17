import type { TextInputProps } from "react-native";
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
  Input,
  InputField,
  Text,
} from "@gluestack-ui/themed";

interface BaseInputProps extends TextInputProps {
  value: string;
  onChangeText: (value: string) => void;
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
  onBlur?: () => void;
}

export default function BaseInput(props: BaseInputProps) {
  return (
    <Box h="auto" w="$full">
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
        <Box borderWidth={1} borderColor="$blue100" borderRadius={10}>
          <Input size="xl" borderRadius={10} backgroundColor="white" py={0}>
            <InputField
              onBlur={props.onBlur}
              lineHeight="$md"
              fontSize="$lg"
              type="text"
              placeholder={props.placeholder}
              onChangeText={props.onChangeText}
            />
          </Input>
        </Box>
        <Text fontSize="$md" color="$red700" px={2}>
          {props.errorText}
        </Text>
        <FormControlHelper>
          <FormControlHelperText>{props.helperText}</FormControlHelperText>
        </FormControlHelper>
      </FormControl>
    </Box>
  );
}
