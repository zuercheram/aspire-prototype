export interface ControlledInputProps<T> {
  name: keyof T & string;
  label?: string;
  disabled?: boolean;
}
