import { useData } from "../hooks/useData";
import { FormValuesObject } from "../FormValuesObject";

export const useFieldValue = <T extends FormValuesObject>(name: keyof T) => {
  const data = useData<T>();
  return data[name];
};
