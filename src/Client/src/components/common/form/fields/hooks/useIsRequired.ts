import { useContext } from "react";
import { FormContext } from "../../FormContext";

export const useIsRequired = <T extends Record<string, unknown>>(
  fieldName: keyof T
): boolean => {
  const { requiredFields } = useContext(FormContext);
  const isRequired = requiredFields[fieldName as string] ?? false;
  return isRequired;
};
