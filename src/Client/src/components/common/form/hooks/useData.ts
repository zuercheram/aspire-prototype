import { FieldValues } from "react-hook-form";
import { useContext } from "react";
import { DataContext } from "../DataContext";

export const useData = <T extends FieldValues>() => {
  const { data } = useContext(DataContext);
  return data as T;
};
