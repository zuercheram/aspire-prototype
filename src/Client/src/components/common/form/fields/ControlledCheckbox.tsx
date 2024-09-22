import { ReactElement } from "react";
import { Controller, Path } from "react-hook-form";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import type { FormValuesObject } from "../FormValuesObject";
import { ControlledInputProps } from "./ControlledInputProps";
import { useFieldIsEditable } from "./hooks/useFieldIsEditable";
import { useFieldValue } from "../hooks/useFieldValue";

interface DisabledCheckboxProps {
  name: string;
  label?: string;
}

const DisabledCheckbox = ({ name, label }: DisabledCheckboxProps) => {
  const value = useFieldValue(name);
  return (
    <FormControl>
      <FormControlLabel
        disabled
        label={label}
        title={label}
        control={<Checkbox color="primary" checked={!!value} />}
      />
    </FormControl>
  );
};

export const ControlledCheckbox = <T extends FormValuesObject>({
  name,
  label,
  disabled,
}: ControlledInputProps<T>): ReactElement => {
  const fieldIsEditable = useFieldIsEditable(name);

  if (!fieldIsEditable) {
    return <DisabledCheckbox name={name} label={label} />;
  }

  return (
    <Controller
      name={name as Path<T>}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <FormControl error={error?.message !== undefined}>
          <FormControlLabel
            disabled={disabled}
            label={label}
            title={label}
            control={
              <Checkbox
                color="primary"
                onChange={(e) => onChange(e.target.checked)}
                checked={!!value}
              />
            }
          />
          {error?.message && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};
