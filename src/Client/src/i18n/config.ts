import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import generalEn from "./en/general.json";
import generalDe from "./de/general.json";
import formEn from "./en/form.json";
import formDe from "./de/form.json";
import testEntityEn from "./en/testEntity.json";
import testEntityDe from "./de/testEntity.json";

export const defaultNS = "general";

export const resources = {
  en: {
    general: generalEn,
    form: formEn,
    testEntity: testEntityEn,
  },
  de: {
    general: generalDe,
    form: formDe,
    testEntity: testEntityDe,
  },
};

i18next.use(initReactI18next).init({
  lng: localStorage.getItem("lang") ?? "en",
  resources,
  defaultNS,
});
