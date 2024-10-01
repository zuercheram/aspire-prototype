import { ReactElement } from "react";

import { ControlledInputProps } from "../fields/ControlledInputProps";
import { ControlledSelectProps } from "../fields/ControlledSelect";
import { ControlledTextProps } from "../fields/ControlledTextField";

export type SelectDefinition<T> = ControlledInputProps<T> & {
  type: "select";
  fieldProps: ControlledSelectProps;
};

export type DatePickerDefinition<T> = ControlledInputProps<T> & {
  type: "date";
};

export type TextDefinition<T> = ControlledInputProps<T> & {
  type: "text";
  fieldProps?: ControlledTextProps;
};

type CheckboxDefinition<T> = ControlledInputProps<T> & {
  type: "checkbox";
};

export type NonFormFieldElementDefinition = {
  type: "non-form-field-element";
  component: ReactElement;
  name?: string;
  disabled?: boolean;
};

type Divider = {
  type: "divider";
  name?: string;
};

export type FieldDef<T> =
  | SelectDefinition<T>
  | DatePickerDefinition<T>
  | TextDefinition<T>
  | CheckboxDefinition<T>
  | NonFormFieldElementDefinition
  | Divider
  | null;
export type FieldDefinition<T> = FieldDef<T> | FieldDef<T>[] | null;

export interface FieldGroup<T> {
  title?: string;
  fields: FieldDefinition<T>[];
}
