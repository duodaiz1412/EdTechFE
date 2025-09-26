import {useAppSelector} from "@/redux/hooks";
import {Outlet} from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="loading loading-xl"></div>
    </div>
  );
}
