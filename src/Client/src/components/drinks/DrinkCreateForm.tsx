import { DrinkCreateSchema } from "../../models/drinks/DrinkCreate";
import { useServices } from "../../ServiceContextProvider";
import { DialogForm } from "../common/form/DialogForm";

export const DrinkCreateForm = () => {
  const { create } = useServices().drinkService;

  return (
    <DialogForm
      formProps={{
        schema: DrinkCreateSchema,
        serviceCall: create,
      }}
      formBodyDefinition={[
        {
          title: "Attributes",
          fields: [{ type: "text", name: "name", label: "Name" }],
        },
        {
          title: "Validity",
          fields: [
            [
              { type: "date", name: "validFrom", label: "Valid from" },
              { type: "date", name: "validTo", label: "Valid to" },
            ],
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
                    text: "option1",
                    value: 1,
                  },
                  {
                    text: "option2",
                    value: 2,
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
