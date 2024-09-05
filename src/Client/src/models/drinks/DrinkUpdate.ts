import { FieldRules } from "../common/validation/FieldRules";
import { Schema, TypeFromSchema } from "../common/validation/Schema";

export const DrinkUpdateSchema = Schema({
  name: FieldRules.requiredStringWithMaxSize(30),
  code: FieldRules.requiredInteger(),
  type: FieldRules.requiredString(),
});

export type DrinkUpdate = TypeFromSchema<typeof DrinkUpdateSchema>;
export type DrinkUpdateWithId = DrinkUpdate & {
  drinkId: number;
};
