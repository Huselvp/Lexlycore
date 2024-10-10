// import { useEffect } from "react";
// import { useUser } from "../features/Authentication/useUser";
// import { Navigate, Outlet, useNavigate } from "react-router-dom";
// import Spinner from "./Spinner";

// const protectedRoute = ({ userRole }: { userRole: "ADMIN" | "SUSER" }) => {
//   const navigate = useNavigate();
//   const { isLoading, isAuthenticated, user } = useUser();
//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) navigate("/login");
//   }, [isLoading, isAuthenticated]);
//   if (isLoading) return <Spinner />;
//   if (!isLoading && !isAuthenticated) return null;
//   // @ts-ignore
//   if (user?.role !== userRole) return <Navigate to="/pageNotFound" />;
//   return <Outlet />;
// };

// export default protectedRoute;

import { useEffect } from "react";
import { useUser } from "../features/Authentication/useUser";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

// Define the type for the user roles
type UserRole = "ADMIN" | "SUSER";

interface ProtectedRouteProps {
  userRole: UserRole; // Use the defined type for userRole
}

const ProtectedRoute = ({ userRole }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, user } = useUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return null;

  // @ts-ignore
  if (user && user.role !== userRole) {
    return <Navigate to="/pageNotFound" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
