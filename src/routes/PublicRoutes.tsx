import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { JSX } from "react";

interface PublicRouteProps {
  children: JSX.Element;
  redirectTo?: string;
}

export default function PublicRoute({ children, redirectTo = "/home" }: PublicRouteProps) {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isLoggedIn ? <Navigate to={redirectTo} replace /> : children;
}
