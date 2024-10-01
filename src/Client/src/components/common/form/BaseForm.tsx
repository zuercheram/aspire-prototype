import { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ObjectSchema } from "yup";
import { useSnackbar } from "notistack";
import type { FormValuesObject } from "./FormValuesObject";
import { useI18nYupResolver } from "./hooks/useI18nYupResolver";
import { useData } from "./hooks/useData";

export type ServiceCall<T, TResponse = unknown> = (
  values: T
) => Promise<TResponse>;

export interface FormProps<T extends FormValuesObject> {
  serviceCall?: ServiceCall<T>;
  onServiceCallSuccess?: () => void;
  schema: ObjectSchema<T>;
}

export const BaseForm = <T extends FormValuesObject>({
  schema,
  serviceCall,
  children,
}: PropsWithChildren<FormProps<T>>) => {
  const data = useData<T>();

  const formMethods = useForm<T>({
    resolver: useI18nYupResolver(schema),
    // if no i18n is needed, can be replaced by yupResolver from package @hookform/resolvers/yup
    // resolver: yupResolver,
    values: data,
    // setting shouldUnregister to true makes the handleSubmit function only receive the value from non disabled input
    shouldUnregister: false,
    mode: "onChange",
  });

  const { handleSubmit } = formMethods;
  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = handleSubmit(async (values: T) => {
    if (serviceCall) {
      try {
        await serviceCall(values);
      } catch (error) {
        enqueueSnackbar(
          error instanceof Error ? error.message : "Unknown error occurred",
          {
            variant: "error",
          }
        );
      }
    }
    return Promise.resolve();
  });

  return (
    <FormProvider<T> {...formMethods}>
      <form onSubmit={submitHandler} noValidate>
        {children}
      </form>
    </FormProvider>
  );
};
