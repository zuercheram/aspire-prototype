import { InferType, ISchema, object, ObjectShape } from "yup";

export const Schema = <TShape extends ObjectShape>(spec?: TShape | undefined) =>
  object(spec);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypeFromSchema<T extends ISchema<any, any, any, any>> =
  InferType<T>;
