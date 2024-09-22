import { createContext } from "react";

import type { FormValuesObject } from "./FormValuesObject";

export interface DataContextContent<T extends FormValuesObject> {
  data?: Partial<T>;
}

export const DataContext = createContext<DataContextContent<FormValuesObject>>(
  {} as DataContextContent<FormValuesObject>
);
