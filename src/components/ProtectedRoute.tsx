import {enrollServices} from "@/lib/services/enroll.services";
import {userServices} from "@/lib/services/user.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {login} from "@/redux/slice/userSlice";
import {Role} from "@/types";
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
      const enrollments = await enrollServices.getEnrollments(accessToken);

      // Set global state
      dispatch(
        login({
          id: response.data.id,
          name: response.data.fullName,
          email: response.data.email,
          username: response.data.username,
          image: response.data.userImage || undefined,
          type: response.data.userType,
          roles: response.data.roles.map((role: Role) => role.name),
          enrollments: enrollments,
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
