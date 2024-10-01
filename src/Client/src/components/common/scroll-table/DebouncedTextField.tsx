import { TextField, TextFieldProps } from "@mui/material";
import { useState, useEffect } from "react";

export const DebouncedTextField = ({
  value: initialValue,
  onChange,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
} & Omit<TextFieldProps, "onChange">) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, 200);

    return () => clearTimeout(timeout);
  }, [onChange, value]);

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
