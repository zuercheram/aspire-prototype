import { useMemo } from "react";
import { ScrollTable } from "../common/scroll-table/ScrollTable";
import { Drink } from "../../models/drinks/Drink";
import { ColumnDefinition } from "../common/scroll-table/ColumnDefinition";

export const drinks: Drink[] = Array.from({ length: 10000 }).map((_, i) => ({
  drinkId: i,
  category: `Category-${i}`,
  active: i % 2 === 0,
  code: i * 2,
  glass: `glass-${
    i === 200 ? "aldskjaölsjfölsajföldsajföldsajfölkdjfölkdsajfölkdsajf" : i
  }`,
  name: `Drink-${i}`,
  type: `${(i % 2) + 1}`,
  ingredients: [],
  imageUrl: "",
  instructions: `Instructions-${i}`,
  thumbUrl: "",
  volume: i * 10,
  validFrom: new Date(2021, i % 11, i % 27),
  validTo: new Date(2022, i % 11, i % 27),
  number: i * 200.1452,
}));

export const DrinksList = () => {
  // const { drinkService } = useServices();
  // const drinks = useErrorHandledQuery(drinkService.fetchAllQueryConfig());

  const colDefs: ColumnDefinition<Drink>[] = useMemo(
    () => [
      {
        accessor: "drinkId",
        id: "drinkId",
        header: "Drink ID",
      },
      {
        accessor: "category",
        id: "category",
        header: "Category",
      },
      {
        accessor: "glass",
        id: "glass",
        header: "Glass",
      },
      {
        accessor: "type",
        id: "type",
        header: "Type",
      },
      {
        accessor: "name",
        id: "name",
        header: "Name",
      },
    ],
    []
  );

  return (
    <ScrollTable
      title="Drinks"
      rowLink={(row) => String(row.drinkId)}
      columnDefinitions={colDefs}
      data={drinks ?? []}
    />
  );
};
