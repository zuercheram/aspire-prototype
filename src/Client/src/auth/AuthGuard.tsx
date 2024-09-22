import { PropsWithChildren } from "react";
import { Box } from "@mui/material";
import { useAuth } from "./useAuth";

export interface AuthGuardProps {
  requiredRole?: string;
}

export const AuthGuard = ({
  requiredRole,
  children,
}: PropsWithChildren<AuthGuardProps>) => {
  const { isSignedIn, isAuthorized } = useAuth({ requiredRole });

  return isSignedIn && isAuthorized ? (
    <>{children}</>
  ) : (
    <Box pt={2}>Unauthorized - log in first or request the required roles</Box>
  );
};
