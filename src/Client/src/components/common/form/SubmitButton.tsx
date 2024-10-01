import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SubmitButton = () => {
  const { t } = useTranslation("form");

  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button type="submit">
      {isSubmitting && (
        <CircularProgress
          sx={(theme) => ({
            marginRight: theme.spacing(1),
          })}
          size={15}
        />
      )}
      {t("submit")}
    </Button>
  );
};
