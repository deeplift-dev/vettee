import type { TextInputProps } from "react-native";
import {
  Box,
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
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
          <FormControlLabelText fontFamily="$mono" fontSize="$lg">
            {props.label}
          </FormControlLabelText>
        </FormControlLabel>
        <Box borderWidth={0.2} borderColor="$blue50" borderRadius={10}>
          <Input size="lg" borderRadius={10} backgroundColor="white" py={0}>
            <InputField
              onBlur={props.onBlur}
              lineHeight="$sm"
              fontSize="$md"
              type="text"
              fontFamily="$mono"
              placeholder={props.placeholder}
              onChangeText={props.onChangeText}
            />
          </Input>
        </Box>
        <FormControlHelper>
          <FormControlHelperText>{props.helperText}</FormControlHelperText>
        </FormControlHelper>
      </FormControl>
    </Box>
  );
}
