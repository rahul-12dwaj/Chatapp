import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const { isAuthenticated } = useSelector((state) => state.currentUser);

  // 1. If user not authenticated → redirect
  if (!isAuthenticated) {
    return <Navigate to="/join" replace />;
  }

  // 2. Otherwise, show dashboard
  return <Outlet />;
}
