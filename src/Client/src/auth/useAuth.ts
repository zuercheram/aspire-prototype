import { useContext } from "react";
import { AuthGuardProps } from "./AuthGuard";
import { AuthContext } from "./AuthContext";

export const useAuth = ({ requiredRole }: AuthGuardProps) => {
  const authContext = useContext(AuthContext);
  const isSignedIn = authContext.authData?.isAuthenticated ?? false;
  const isAuthorized =
    (!requiredRole || authContext.authData?.roles.includes(requiredRole)) ??
    false;

  return { isSignedIn, isAuthorized };
};
