import {useAppSelector} from "@/redux/hooks";
import {Navigate, Outlet} from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
