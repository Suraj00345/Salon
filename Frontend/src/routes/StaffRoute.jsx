import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/auth.store";

export default function StaffRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toLowerCase();
  if (role !== "staff" && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
