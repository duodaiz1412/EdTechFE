import {useAppSelector} from "@/redux/hooks";
import {useEffect} from "react";
import {Navigate, Outlet} from "react-router-dom";
import {toast} from "react-toastify";

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Require login to access");
    }
  }, [isAuthenticated]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
