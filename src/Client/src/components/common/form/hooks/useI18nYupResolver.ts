import { useCallback } from "react";
import { ObjectSchema, ValidationError } from "yup";
import { useTranslation } from "react-i18next";
import { FieldError, FieldErrors } from "react-hook-form";
import { FormValuesObject } from "../FormValuesObject";
import { ValidationParams, isMessageWithParams } from "../ValidationError";
import { TranslationKey } from "../../../../i18n-resources";

export const useI18nYupResolver = <T extends FormValuesObject>(
  validationSchema: ObjectSchema<T>
) => {
  const { t } = useTranslation("form");

  return useCallback(
    async (data: T) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });
        return { values: values as T, errors: {} };
      } catch (validationErrors) {
        const errorObject = {} as Record<string, FieldError>;
        const errorList = (validationErrors as ValidationError).inner;
        errorList.forEach((error) => {
          let translationKey: string;
          let translationParams: ValidationParams | undefined;
          if (isMessageWithParams(error.message)) {
            translationKey = error.message.key;
            translationParams = error.message.params;
          } else {
            translationKey = error.message;
          }
          if (error.path && error.type) {
            errorObject[error.path] = {
              type: error.type,
              message: t(
                translationKey as TranslationKey<"form">,
                translationParams
              ) as string,
            };
          }
        });
        return { values: {}, errors: errorObject as FieldErrors<T> };
      }
    },
    [validationSchema, t]
  );
};
