import { ReactElement } from "react";
import { Controller } from "react-hook-form";

import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import { useTranslation } from "react-i18next";
import { useFieldIsEditable } from "./hooks/useFieldIsEditable";
import { useFieldValue } from "../hooks/useFieldValue";
import { ControlledInputProps } from "./ControlledInputProps";
import type { FormValuesObject } from "../FormValuesObject";
import { useIsRequired } from "./hooks/useIsRequired";

export interface MenuItems {
  value: string | number;
  text: string;
  active?: boolean;
}

export interface ControlledSelectProps {
  disabled?: boolean;
  menuItems: MenuItems[];
  onAfterChange?: (value?: unknown) => void;
  showInactiveOptions?: boolean;
  isLoading?: boolean;
}

interface DisabledTextFieldWithSelectValueProps {
  name: string;
  label?: string;
  menuItems: MenuItems[];
}

const DisabledTextFieldWithSelectValue = ({
  name,
  label,
  menuItems,
}: DisabledTextFieldWithSelectValueProps) => {
  const value = useFieldValue(name);

  const optionValue = menuItems.find(
    (item) => String(item.value) === String(value)
  );

  return (
    <TextField
      value={optionValue?.text ?? ""}
      variant="standard"
      disabled={true}
      label={label || ""}
      InputLabelProps={{ shrink: true }}
      fullWidth
    />
  );
};

export const ControlledSelect = <T extends FormValuesObject>({
  name,
  label,
  menuItems,
  disabled,
  isLoading,
  showInactiveOptions,
}: ControlledInputProps<T> & ControlledSelectProps): ReactElement => {
  const fieldIsEditable = useFieldIsEditable(name);
  const required = useIsRequired(name);
  const { t } = useTranslation();

  if (!fieldIsEditable) {
    return (
      <DisabledTextFieldWithSelectValue
        name={name}
        label={label}
        menuItems={menuItems}
      />
    );
  }

  return (
    <Controller
      name={name}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <Autocomplete
          disabled={disabled}
          value={
            menuItems.find((i) => String(i.value) === String(value)) ?? null
          }
          fullWidth
          clearOnEscape={true}
          clearOnBlur={false}
          options={
            showInactiveOptions
              ? menuItems
              : menuItems.filter((i) => i.active !== false)
          }
          getOptionLabel={(option) => option.text}
          isOptionEqualToValue={(option, val) =>
            String(option.value) === (String(val?.value) ?? "")
          }
          getOptionDisabled={(option) => option.active === false}
          loading={isLoading}
          onChange={(_, option) => {
            onChange(option?.value ?? "");
          }}
          renderInput={(params) => {
            const { InputProps, ...newParams } = params;

            if (isLoading) {
              InputProps.endAdornment = (
                <CircularProgress
                  size={15}
                  sx={(theme) => ({
                    marginRight: theme.spacing(2),
                  })}
                />
              );
            }
            return (
              <>
                <TextField
                  error={!disabled && error?.message !== undefined}
                  helperText={!disabled ? error?.message : undefined}
                  {...newParams}
                  label={label}
                  InputProps={InputProps}
                  required={required}
                  variant="standard"
                  InputLabelProps={{
                    title: label || "",
                  }}
                />
                <input value={value ?? ""} hidden readOnly ref={ref} />
              </>
            );
          }}
          noOptionsText={t("typeAhead.noOptions")}
        />
      )}
    />
  );
};
