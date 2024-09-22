import format from "date-fns/format";
import { setLocale } from "yup";
import { isValid } from "date-fns";
import { TranslationKey } from "../i18n-resources";

type ErrorType =
  | "default"
  | "format"
  | "required"
  | "match"
  | "minString"
  | "maxString"
  | "minNumber"
  | "maxNumber"
  | "maxDate"
  | "minDate"
  | "mustBeNumber"
  | "invalidDate"
  | "oneOf"
  | "positive";

// cast to TranslationKey to make sure all message are defined in the translation file
const keys: { [k in ErrorType]: TranslationKey<["form"]> } = {
  default: "form:errors.default",
  format: "form:errors.format",
  invalidDate: "form:errors.invalidDate",
  match: "form:errors.format",
  maxDate: "form:errors.maxDate",
  maxNumber: "form:errors.maxValue",
  maxString: "form:errors.maxLength",
  minDate: "form:errors.minDate",
  minNumber: "form:errors.minValue",
  minString: "form:errors.minLength",
  mustBeNumber: "form:errors.mustBeNumber",
  oneOf: "form:errors.oneOf",
  positive: "form:errors.positiveNumber",
  required: "form:errors.required",
};

const mustBeKeysMap: { [k: string]: TranslationKey<["form"]> } = {
  number: keys.mustBeNumber,
  date: keys.invalidDate,
};

// message is either a string or a { key: string, params?: Record<string, string | number> } object
// if no i18n is needed, this can be removed to use default yup values, or replaced by hardcoded strings instead of translation keys
setLocale({
  mixed: {
    default: keys.default as string,
    required: keys.required as string,
    notType: ({ type }) => (mustBeKeysMap[type] || keys.format) as string,
    oneOf: ({ values }) => ({ key: keys.oneOf, params: { values } }),
  },
  string: {
    min: ({ min }) => ({ key: keys.minString, params: { min } }),
    max: ({ max }) => ({ key: keys.maxString, params: { max } }),
    matches: ({ regex }) => ({ key: keys.match, params: { regex } }),
  },
  number: {
    min: ({ min }) => ({ key: keys.minNumber, params: { min } }),
    max: ({ max }) => ({ key: keys.maxNumber, params: { max } }),
    positive: () => ({ key: keys.positive }),
  },
  date: {
    min: ({ min }) => ({
      key: keys.minNumber,
      params: {
        min:
          min instanceof Date && isValid(min) ? format(min, "dd.MM.yyyy") : min,
      },
    }),
    max: ({ max }) => ({
      key: keys.maxNumber,
      params: {
        max:
          max instanceof Date && isValid(max) ? format(max, "dd.MM.yyyy") : max,
      },
    }),
  },
});
