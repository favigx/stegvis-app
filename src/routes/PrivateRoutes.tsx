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
    return <Navigate to="/login" replace />;
  }

  if (!hasCompletedOnboarding && path !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

if (hasCompletedOnboarding && path === "/onboarding") {
  return <Navigate to="/home" replace />;
}

  return children;
}