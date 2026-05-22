import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  allowedRoles: string[];
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  let role: string | null = null;
  try {
    role = JSON.parse(userRaw)?.role ?? null;
  } catch {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/beranda" replace />;
  }

  return children;
};

export default ProtectedRoute;
