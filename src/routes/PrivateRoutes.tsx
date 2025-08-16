import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface PrivateRouteProps {
  children: JSX.Element;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;