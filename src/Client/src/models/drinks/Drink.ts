import { DrinkIngredient } from "./DrinkIngredient";

export interface Drink {
  drinkId: number;
  name: string;
  instructions: string | null;
  imageUrl: string | null;
  thumbUrl: string | null;
  category: string;
  type: string;
  glass: string | null;
  validFrom: Date | null;
  validTo: Date | null;
  code: number;
  volume: number | null;
  active: boolean;
  ingredients: DrinkIngredient[] | null;
}
