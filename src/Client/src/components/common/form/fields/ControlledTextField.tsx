import { ReactElement, ReactNode } from "react";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import type { FormValuesObject } from "../FormValuesObject";
import { useIsRequired } from "./hooks/useIsRequired";
import { ControlledInputProps } from "./ControlledInputProps";
import { useFieldIsEditable } from "./hooks/useFieldIsEditable";
import { useFieldValue } from "../hooks/useFieldValue";

export interface ControlledTextProps extends DisplayTextFieldProps {
  placeholder?: string;
  disabled?: boolean;
}

export interface DisplayTextFieldProps {
  label?: string;
  multiline?: boolean;
  icon?: ReactNode;
  rows?: number;
  noDashesWhenEmpty?: boolean;
}

const DisabledTextField = ({
  name,
  multiline,
  rows,
  label,
}: DisplayTextFieldProps & { name: string }) => {
  const value = useFieldValue(name);

  return (
    <TextField
      value={value ?? ""}
      variant="standard"
      multiline={multiline}
      rows={rows}
      disabled={true}
      label={label || ""}
      InputLabelProps={{ shrink: true }}
      fullWidth
      InputProps={{
        readOnly: true,
      }}
    />
  );
};

export const ControlledTextField = <T extends FormValuesObject>({
  name,
  label,
  placeholder,
  multiline,
  rows,
  disabled,
}: ControlledInputProps<T> & ControlledTextProps): ReactElement => {
  const fieldIsEditable = useFieldIsEditable(name);
  const required = useIsRequired(name);

  const displayProps = {
    label,
    multiline,
    rows,
  };

  if (!fieldIsEditable) {
    return <DisabledTextField name={name} {...displayProps} />;
  }

  return (
    <Controller
      name={name}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <TextField
          variant="standard"
          name={name}
          value={value ?? ""}
          disabled={disabled}
          onChange={onChange}
          inputRef={ref}
          required={required}
          placeholder={placeholder || ""}
          helperText={error?.message}
          error={error?.message !== undefined}
          fullWidth
          {...displayProps}
        />
      )}
    />
  );
};
