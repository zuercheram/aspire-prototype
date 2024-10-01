import { useContext } from "react";
import { FormContext } from "../../FormContext";

export const useFieldIsEditable = (name: string) => {
  const { isEditable, formFields } = useContext(FormContext);
  if (!isEditable) {
    return false;
  }
  return formFields.some((x) => x === name);
};
