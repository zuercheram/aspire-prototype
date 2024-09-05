import { ObjectSchema, SchemaDescription } from "yup";

import type { FormValuesObject } from "./FormValuesObject";

export const getRequiredFields = <T extends FormValuesObject>(
  schema: ObjectSchema<FormValuesObject> | undefined
): Record<keyof T, boolean> => {
  if (!schema) {
    return {} as Record<keyof T, boolean>;
  }

  const fields = schema.describe().fields as Record<keyof T, SchemaDescription>;
  return Object.entries(fields).reduce((newObj, [key, fieldDescription]) => {
    // eslint-disable-next-line no-param-reassign
    newObj[key as keyof T] = !fieldDescription.optional;
    return newObj;
  }, {} as Record<keyof T, boolean>);
};
