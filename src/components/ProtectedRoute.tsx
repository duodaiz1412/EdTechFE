import {adminServices} from "@/lib/services/admin.services";
import {userServices} from "@/lib/services/user.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {login} from "@/redux/slice/userSlice";
import {useQuery} from "@tanstack/react-query";
import {Navigate, Outlet} from "react-router-dom";

export default function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const {isLoading} = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await userServices.getUserInfo(accessToken);

      // Get user roles by admin api (FIX LATER)
      const roles = await adminServices.getUserRoles(
        accessToken,
        response.data.id,
      );

      // Set global state
      dispatch(
        login({
          id: response.data.id,
          name: response.data.fullName,
          email: response.data.email,
          username: response.data.username,
          image: response.data.userImage || undefined,
          type: response.data.userType,
          roles: roles,
        }),
      );
      return response;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}
