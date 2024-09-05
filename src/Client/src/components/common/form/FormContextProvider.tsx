import { PropsWithChildren, ReactElement, useMemo } from "react";
import { ObjectSchema } from "yup";

import { FormContext } from "./FormContext";
import type { FormValuesObject } from "./FormValuesObject";
import { getRequiredFields } from "./getRequiredFields";

interface FormContextProviderProps<T extends FormValuesObject> {
  schema: ObjectSchema<T>;
  isEditable: boolean;
}

export const FormContextProvider = <T extends FormValuesObject>({
  schema,
  isEditable,
  children,
}: PropsWithChildren<FormContextProviderProps<T>>): ReactElement => {
  const formInfo = useMemo(
    () => ({
      requiredFields: getRequiredFields<Partial<T>>(schema),
      formFields: Object.keys(schema.describe().fields),
    }),
    [schema]
  );

  return (
    <FormContext.Provider value={{ ...formInfo, isEditable }}>
      {children}
    </FormContext.Provider>
  );
};
