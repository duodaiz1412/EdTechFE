import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {IRootState} from "@/redux/store";
import {
  setCredentials,
  setCredentialsFromRefreshToken,
  setLoading,
  setError,
  logout,
  clearError,
} from "@/redux/slice/authSlice";
import {authServices} from "@/lib/services/auth.services";
import {ApiError} from "@/lib/api";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state: IRootState) => state.auth.loading);

  const token = useSelector((state: IRootState) => state.auth.token);
  const isAuthenticated = useSelector(
    (state: IRootState) => state.auth.isAuthenticated,
  );
  const user = useSelector((state: IRootState) => state.auth.user);
  const error = useSelector((state: IRootState) => state.auth.error);
  const refreshTokenValue = useSelector(
    (state: IRootState) => state.auth.refreshToken,
  );

  // Auth Actions
  const register = async (fullName: string, email: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      await authServices.register({fullName, email});

      dispatch(setLoading(false));
    } catch (err) {
      const error = err as ApiError;
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  };

  const login = async (email: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      await authServices.login({email});

      dispatch(setLoading(false));
    } catch (err) {
      const error = err as ApiError;
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  };

  const verify = async (token: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await authServices.verify(token);

      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        }),
      );

      dispatch(setLoading(false));

      return response;
    } catch (err) {
      const error = err as ApiError;
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      if (!refreshTokenValue) throw new Error("No refresh token");

      const response = await authServices.refreshToken(refreshTokenValue);

      dispatch(
        setCredentialsFromRefreshToken({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        }),
      );

      return response;
    } catch (err) {
      dispatch(logout());
      throw err;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    // State
    token,
    isAuthenticated,
    user,
    loading,
    error,

    // Actions
    register,
    login,
    verify,
    refreshToken,
    logout: handleLogout,
    clearError: clearAuthError,

    // Utils
    dispatch,
    navigate,
  };
};

export default useAuth;
