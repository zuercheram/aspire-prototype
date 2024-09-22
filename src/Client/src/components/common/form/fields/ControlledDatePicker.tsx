import { ReactElement } from "react";
import { Controller, Path } from "react-hook-form";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { isValid } from "date-fns";
import { deDE, enUS, PickersLocaleText } from "@mui/x-date-pickers/locales";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import type { FormValuesObject } from "../FormValuesObject";
import { ControlledInputProps } from "./ControlledInputProps";
import { useIsRequired } from "./hooks/useIsRequired";
import { useFieldIsEditable } from "./hooks/useFieldIsEditable";
import { useFieldValue } from "../hooks/useFieldValue";

// The Material UI DatePicker set the time part of the date object to the current time
// We don't need it since the ControlledDatePicker is only about picking a day
// Also set the date to equivalent UTC so the right date is sent when serialized
export const toUtcDateWithoutTime = (date: Date): Date => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new Date(Date.UTC(year, month, day));
};

export const transformDate = {
  date: (d: Date) => toUtcDateWithoutTime(d),
  "datetime-local": (d: Date) => d,
};

const localePerLanguage: Record<
  "de" | "en",
  Partial<PickersLocaleText<Date>>
> = {
  de: deDE.components.MuiLocalizationProvider.defaultProps.localeText,
  en: enUS.components.MuiLocalizationProvider.defaultProps.localeText,
};

interface ControlledDatePickerProps {
  type?: "date" | "datetime-local";
}

interface DisabledDatePickerProps {
  name: string;
  language: "en" | "de";
}

const DisabledDatePicker = ({ name, language }: DisabledDatePickerProps) => {
  const value = useFieldValue(name);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      localeText={localePerLanguage[language]}
    >
      <DatePicker
        value={value}
        disabled={true}
        slotProps={{
          textField: {
            variant: "standard",
            fullWidth: true,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export const ControlledDatePicker = <T extends FormValuesObject>({
  name,
  label,
  disabled,
  type = "date",
}: ControlledDatePickerProps & ControlledInputProps<T>): ReactElement => {
  const fieldIsEditable = useFieldIsEditable(name);
  const { i18n } = useTranslation();
  const required = useIsRequired(name);

  if (!fieldIsEditable) {
    return (
      <DisabledDatePicker name={name} language={i18n.language as "en" | "de"} />
    );
  }

  return (
    <Controller
      name={name as Path<T>}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          localeText={localePerLanguage[i18n.language as "en" | "de"]}
        >
          <DatePicker
            value={value ?? null}
            label={label}
            disabled={disabled}
            onChange={(date) => {
              if (date && isValid(date)) {
                onChange(transformDate[type](date));
              } else {
                onChange(null);
              }
            }}
            slotProps={{
              textField: {
                required,
                variant: "standard",
                error: error?.message !== undefined,
                helperText: error?.message,
                fullWidth: true,
              },
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};
