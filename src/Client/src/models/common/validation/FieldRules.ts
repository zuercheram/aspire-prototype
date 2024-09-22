import * as yup from "yup";

const MAX_SAFE_INTEGER = 2147483647;

const handleExponentialNotation = (v: unknown, o: unknown) =>
  typeof o === "string" && (o.indexOf("e") !== -1 || o.indexOf("E") !== -1)
    ? NaN
    : v;

const addRegexDelimiter = (regex: RegExp): RegExp => {
  const { source } = regex;
  const sourceWithLimits = `${!source.startsWith("^") ? "^" : ""}${source}${
    !source.endsWith("$") ? "$" : ""
  }`;
  const finalRegex = new RegExp(sourceWithLimits);

  return finalRegex;
};

export const FieldRules = {
  optionalString: () =>
    yup
      .string()
      .transform((v, o) => (o === null ? "" : v))
      .notRequired(),
  requiredString: () => yup.string().required(),
  requiredStringWithMaxSize: (limit: number) =>
    FieldRules.requiredString().max(limit),
  requiredStringWithMinSize: (limit: number) =>
    FieldRules.requiredString().min(limit),
  requiredStringWithFormat: (regex: RegExp): yup.StringSchema =>
    FieldRules.requiredString().matches(addRegexDelimiter(regex), {
      excludeEmptyString: true,
    }),

  optionalNumber: () =>
    yup
      .number()
      .transform((v, o) => {
        if (o === "" || Number.isNaN(o)) {
          return null;
        }
        return handleExponentialNotation(v, o);
      })
      .max(MAX_SAFE_INTEGER)
      .nullable(),

  requiredInteger: () =>
    yup
      .number()
      .required()
      .transform((v, o) => handleExponentialNotation(v, o))
      .max(MAX_SAFE_INTEGER),
  requiredPositiveInteger: () => FieldRules.requiredInteger().positive(),

  requiredDate: () =>
    yup
      .date()
      .transform((v, o) => (o === null ? undefined : v))
      .required(),
  optionalDate: () =>
    yup
      .date()
      .transform((v, o) => (o === "" ? null : v))
      .notRequired()
      .nullable(),
  optionalDateLaterThanField: (dateFieldName: string) =>
    FieldRules.optionalDate().min(yup.ref(dateFieldName)),
  optionalDateEarlierThanField: (dateFieldName: string) =>
    FieldRules.optionalDate().max(yup.ref(dateFieldName)),

  requiredBoolean: () => yup.boolean().required(),
  optionalBoolean: () => yup.boolean().nullable(),

  requiredFile: () => yup.mixed<File>().required(),
};
