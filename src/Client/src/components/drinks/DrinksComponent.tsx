import { Link as RouterLink, Outlet } from "react-router-dom";
import Button from "@mui/material/Button";
import { AuthGuard } from "../../auth/AuthGuard";
import { DrinksList } from "./DrinksList";

export const DrinksComponent = () => (
  <>
    <AuthGuard requiredRole="Drinks.Write">
      <Button component={RouterLink} to="./create">
        Create new drink
      </Button>
      <Outlet />
    </AuthGuard>
    <AuthGuard requiredRole="Drinks.Read">
      <DrinksList />
    </AuthGuard>
  </>
);
