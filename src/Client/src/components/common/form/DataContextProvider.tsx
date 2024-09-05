import { PropsWithChildren, ReactElement } from "react";

import { DataContext } from "./DataContext";
import type { FormValuesObject } from "./FormValuesObject";

interface FormContextProviderProps<T extends FormValuesObject> {
  data: Partial<T>;
}

export const DataContextProvider = <T extends FormValuesObject>({
  data,
  children,
}: PropsWithChildren<FormContextProviderProps<T>>): ReactElement => (
  <DataContext.Provider value={{ data }}>{children}</DataContext.Provider>
);
