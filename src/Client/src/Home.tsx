import { useTranslation } from "react-i18next";

export const Home = () => {
  const { t } = useTranslation();
  return <p>{t("home.greeting")}</p>;
};
