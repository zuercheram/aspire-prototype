import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { FormBody } from "./form-body/FormBody";
import { BaseForm, FormProps } from "./BaseForm";
import { FieldGroup } from "./form-body/FieldDefinitions";
import { FormValuesObject } from "./FormValuesObject";
import { DataContextProvider } from "./DataContextProvider";
import { FormContextProvider } from "./FormContextProvider";
import { SubmitButton } from "./SubmitButton";

type DialogFormProps<T extends FormValuesObject> = {
  title?: string;
  initialData?: Partial<T>;
  formProps: FormProps<T>;
  formBodyDefinition: (FieldGroup<T> | null)[];
};

export const DialogForm = <T extends FormValuesObject>({
  title,
  initialData,
  formBodyDefinition,
  formProps,
}: DialogFormProps<T>) => {
  const navigate = useNavigate();
  const { t } = useTranslation("form");

  const handleClose = () => {
    navigate("../");
  };

  return (
    <DataContextProvider data={initialData ?? {}}>
      <Dialog open fullWidth onClose={handleClose}>
        {title && <DialogTitle>{title}</DialogTitle>}
        <FormContextProvider isEditable={true} schema={formProps.schema}>
          <BaseForm {...{ ...formProps, onServiceCallSuccess: handleClose }}>
            <DialogContent>
              <FormBody fieldGroups={formBodyDefinition} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>{t("cancel")}</Button>
              <SubmitButton />
            </DialogActions>
          </BaseForm>
        </FormContextProvider>
      </Dialog>
    </DataContextProvider>
  );
};
