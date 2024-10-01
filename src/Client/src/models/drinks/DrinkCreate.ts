import { FieldRules } from "../common/validation/FieldRules";
import { Schema, TypeFromSchema } from "../common/validation/Schema";

export const DrinkCreateSchema = Schema({
  name: FieldRules.requiredStringWithMaxSize(30),
  volume: FieldRules.optionalNumber(),
  validFrom: FieldRules.optionalDateEarlierThanField("validTo"),
  validTo: FieldRules.optionalDateLaterThanField("validFrom"),
  active: FieldRules.optionalBoolean(),
  type: FieldRules.requiredInteger(),
});

export type DrinkCreate = TypeFromSchema<typeof DrinkCreateSchema>;
