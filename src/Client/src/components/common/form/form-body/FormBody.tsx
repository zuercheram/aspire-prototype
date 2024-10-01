import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { PropsWithChildren } from "react";
import { FieldDef, FieldDefinition, FieldGroup } from "./FieldDefinitions";
import { ControlledSelect } from "../fields/ControlledSelect";
import { FormValuesObject } from "../FormValuesObject";
import { ControlledDatePicker } from "../fields/ControlledDatePicker";
import { ControlledTextField } from "../fields/ControlledTextField";
import { ControlledCheckbox } from "../fields/ControlledCheckbox";

interface FormBodyPropsWithDefinition<T> {
  fieldGroups: (FieldGroup<T> | null)[];
}

const StyledFieldset = styled("fieldset")(({ theme }) => ({
  border: "none",
  margin: theme.spacing(0),
  padding: theme.spacing(0),
}));

const renderField = <T extends FormValuesObject>(
  fieldDefinition: FieldDef<T> | null
) => {
  if (!fieldDefinition) {
    return null;
  }

  if (fieldDefinition.type === "divider") {
    return <Divider />;
  }

  switch (fieldDefinition.type) {
    case "select":
      return (
        <ControlledSelect<T>
          {...fieldDefinition}
          {...fieldDefinition.fieldProps}
        />
      );
    case "date":
      return <ControlledDatePicker<T> {...fieldDefinition} type="date" />;
    case "text":
      return (
        <ControlledTextField<T>
          {...fieldDefinition}
          {...fieldDefinition.fieldProps}
        />
      );
    case "checkbox":
      return <ControlledCheckbox<T> {...fieldDefinition} />;
    default:
      return null;
  }
};

const Item = ({ children }: PropsWithChildren) => (
  <Grid item sm md lg xs={12}>
    {children}
  </Grid>
);

const Container = ({ children }: PropsWithChildren) => (
  <Grid
    container
    spacing={3}
    sx={(theme) => ({ marginBottom: theme.spacing(1.5) })}
  >
    {children}
  </Grid>
);

const renderSingleFieldInLine = <T,>(fieldDefinition: FieldDef<T> | null) => {
  if (fieldDefinition === null) {
    return null;
  }

  return (
    <Container key={`${fieldDefinition.type}-${fieldDefinition.name}`}>
      <Item>{renderField(fieldDefinition)}</Item>
    </Container>
  );
};

const renderMultipleFieldsInLine = <T extends FormValuesObject>(
  fieldDefinitions: FieldDef<T>[]
) => {
  const nonNullFields = fieldDefinitions.filter((def) => def !== null);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const key = nonNullFields.map((x) => `${x!.type}-${x!.name}`).join("-");

  return (
    <Container key={key}>
      {nonNullFields.map((def) => (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <Item key={`${def!.type}-${def!.name}`}>{renderField(def)}</Item>
      ))}
    </Container>
  );
};

const renderInLine = <T extends FormValuesObject>(
  definitions: FieldDefinition<T>
) =>
  Array.isArray(definitions)
    ? renderMultipleFieldsInLine(definitions)
    : renderSingleFieldInLine(definitions);

export const FormBody = <T extends FormValuesObject>({
  fieldGroups,
}: FormBodyPropsWithDefinition<T>) => (
  <>
    {fieldGroups.map((group, index) => {
      if (group === null) {
        return null;
      }

      return (
        <Box mb={5} key={index}>
          {group.title && (
            <Box mb={1} key={group.title}>
              <Typography variant="h6">{group.title}</Typography>
            </Box>
          )}
          <StyledFieldset>
            {group.fields.map((definition) => renderInLine(definition))}
          </StyledFieldset>
        </Box>
      );
    })}
  </>
);
