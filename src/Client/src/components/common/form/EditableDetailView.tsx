import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { BaseForm, FormProps } from "./BaseForm";
import { FormValuesObject } from "./FormValuesObject";
import { FieldGroup } from "./form-body/FieldDefinitions";
import { FormBody } from "./form-body/FormBody";
import { DataContextProvider } from "./DataContextProvider";
import { FormContextProvider } from "./FormContextProvider";
import { SubmitButton } from "./SubmitButton";
import { useAuth } from "../../../auth/useAuth";

type EditableDetailViewProps<
  TDetails extends FormValuesObject,
  TForm extends Partial<TDetails>
> = {
  title: string;
  data: TDetails;
  writeRequiredRoles?: string;
  formProps: FormProps<TForm>;
  formBodyDefinition: (FieldGroup<TDetails> | null)[];
};

const Body = <T extends FormValuesObject>({
  formBodyDefinition,
}: {
  formBodyDefinition: (FieldGroup<T> | null)[];
}) => (
  <CardContent>
    <FormBody fieldGroups={formBodyDefinition} />
  </CardContent>
);

export const EditableDetailView = <
  TDetails extends FormValuesObject,
  TForm extends Partial<TDetails>
>({
  title,
  data,
  writeRequiredRoles,
  formProps,
  formBodyDefinition,
}: EditableDetailViewProps<TDetails, TForm>) => {
  const [isEditable, setIsEditable] = useState(false);

  const { isSignedIn, isAuthorized } = useAuth({
    requiredRole: writeRequiredRoles,
  });

  const handleClick = () => {
    setIsEditable((current) => !current);
  };

  return (
    <DataContextProvider data={data}>
      <Card elevation={0}>
        <CardHeader
          title={title}
          action={
            isSignedIn && isAuthorized ? (
              <IconButton onClick={handleClick}>
                <EditIcon />
              </IconButton>
            ) : undefined
          }
        ></CardHeader>
        <FormContextProvider
          isEditable={isSignedIn && isAuthorized && isEditable}
          schema={formProps.schema}
        >
          {isEditable ? (
            <BaseForm<TForm> {...formProps}>
              <Body formBodyDefinition={formBodyDefinition} />
              <CardActions>
                <SubmitButton />
              </CardActions>
            </BaseForm>
          ) : (
            <Body formBodyDefinition={formBodyDefinition} />
          )}
        </FormContextProvider>
      </Card>
    </DataContextProvider>
  );
};
