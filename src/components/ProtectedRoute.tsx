import {enrollServices} from "@/lib/services/enroll.services";
import {userServices} from "@/lib/services/user.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {login} from "@/redux/slice/userSlice";
import {Role} from "@/types";
import {useQuery} from "@tanstack/react-query";
import {Navigate, Outlet} from "react-router-dom";
import React from "react";

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="flex items-center gap-3"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
          <span className="text-sm text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

// Role-based guard
export const RoleProtectedRoute = ({
  children,
  requiredRole,
  redirectTo = "/",
}: {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}) => {
  const userInfo = useAppSelector((state) => state.user.data);

  if (requiredRole && !userInfo?.roles.includes(requiredRole)) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

// User type guard
export const TypeProtectedRoute = ({
  children,
  requiredType,
  redirectTo = "/",
}: {
  children: React.ReactNode;
  requiredType: string;
  redirectTo?: string;
}) => {
  const userInfo = useAppSelector((state) => state.user.data);

  if (userInfo?.type !== requiredType) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};
