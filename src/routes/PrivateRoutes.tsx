import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface PrivateRouteProps {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, hasCompletedOnboarding } = useSelector((state: RootState) => state.auth);
  const path = window.location.pathname;

  if (!isAuthenticated) {
    return <Navigate to="/logga-in" replace />;
  }

  if (!hasCompletedOnboarding && path !== "/kom-igang") {
    return <Navigate to="/kom-igang" replace />;
  }

if (hasCompletedOnboarding && path === "/kom-igang") {
  return <Navigate to="/hem" replace />;
}

  return children;
}