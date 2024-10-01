import { MenuItem, Select, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const languages = Object.keys(i18n.services.resourceStore.data);
  const theme = useTheme();
  return (
    <Select
      sx={{
        color: theme.palette.contrast.main,
        ".MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        ".MuiSvgIcon-root ": {
          fill: `${theme.palette.contrast.main} !important`,
        },
      }}
      variant="outlined"
      value={i18n.language}
      onChange={(e) => {
        i18n.changeLanguage(e.target.value);
        localStorage.setItem("lang", e.target.value);
      }}
    >
      {languages.map((lang) => (
        <MenuItem key={lang} value={lang}>
          {lang}
        </MenuItem>
      ))}
    </Select>
  );
};
