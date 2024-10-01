export type ValidationParams = Record<string, string | number>;

type MessageWithParams = {
  key: string;
  params?: ValidationParams;
};

export type ValidationError = string | MessageWithParams;

export const isMessageWithParams = (
  validationError: ValidationError
): validationError is MessageWithParams =>
  (validationError as MessageWithParams).key !== undefined;
