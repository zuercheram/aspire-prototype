import { useParams } from "react-router-dom";
import { useServices } from "../../ServiceContextProvider";
import { Drink } from "../../models/drinks/Drink";
import {
  DrinkUpdate,
  DrinkUpdateSchema,
} from "../../models/drinks/DrinkUpdate";
import { EditableDetailView } from "../common/form/EditableDetailView";
import { drinks } from "./DrinksList";

export const DrinkDetails = () => {
  const { update } = useServices().drinkService;

  const { id } = useParams();
  const drinkId = Number(id);
  const drink = drinks.find((d) => d.drinkId === drinkId);

  return (
    <EditableDetailView<Drink, DrinkUpdate>
      title={`Update drink ${id}`}
      writeRequiredRoles="Drinks.Write"
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      data={drink!}
      formProps={{
        schema: DrinkUpdateSchema,
        serviceCall: (values) => update(drinkId, values),
      }}
      formBodyDefinition={[
        {
          title: "Attributes",
          fields: [
            { type: "text", name: "name", label: "Name" },
            [
              { type: "text", name: "volume", label: "Volume" },
              { type: "text", name: "code", label: "Code" },
            ],
          ],
        },
        {
          fields: [{ type: "divider" }],
        },
        {
          title: "Validity",
          fields: [
            [
              { type: "date", name: "validFrom", label: "Valid from" },
              { type: "date", name: "validTo", label: "Valid to" },
            ],
            { type: "checkbox", name: "active", label: "Is active" },
          ],
        },
        {
          title: "Additional information",
          fields: [
            {
              type: "select",
              name: "type",
              label: "Type",
              fieldProps: {
                menuItems: [
                  {
                    text: "type-1",
                    value: "1",
                  },
                  {
                    text: "type-2",
                    value: "2",
                  },
                ],
              },
            },
          ],
        },
      ]}
    />
  );
};
