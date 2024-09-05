import { createContext } from "react";

import type { FormValuesObject } from "./FormValuesObject";

export interface FormContextContent<T extends FormValuesObject> {
  requiredFields: Record<keyof T, boolean>;
  formFields: string[];
  isEditable: boolean;
}

export const FormContext = createContext<FormContextContent<FormValuesObject>>(
  {} as FormContextContent<FormValuesObject>
);
