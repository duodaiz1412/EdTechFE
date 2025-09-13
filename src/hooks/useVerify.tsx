import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {authServices} from "@/lib/services/auth.services";
import {userServices} from "@/lib/services/user.services";
import {setCredentials, setLoading, setError} from "@/redux/slice/authSlice";
import {XCookie} from "@/lib/cookies";
import {User} from "@/types";

type VerifyStatus = "idle" | "verifying" | "success" | "error";

type UseVerifyOptions = {
  token?: string | null;
  auto?: boolean;
};

const useVerify = (options?: UseVerifyOptions) => {
  const {token, auto = true} = options || {};
  const dispatch = useDispatch();
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [message, setMessage] = useState<string>("");

  const run = async (inputToken?: string) => {
    const useToken = inputToken ?? token ?? undefined;
    if (!useToken) {
      setStatus("error");
      setMessage("Thiếu token xác thực");
      return false;
    }
    try {
      setStatus("verifying");
      dispatch(setLoading(true));

      // Bước 1: Verify token và lấy tokens
      const tokens = await authServices.verify(useToken);

      XCookie.setAccessToken(tokens.accessToken);
      XCookie.setRefreshToken(tokens.refreshToken);

      // Bước 3: Thử lấy user info
      try {
        const user = await userServices.getMe();
        dispatch(
          setCredentials({
            user: user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          }),
        );
      } catch {
        // Nếu getMe lỗi, vẫn set tokens và tạo user tạm
        const tempUser = {
          id: "temp",
          email: "user@example.com",
          username: "user",
          fullName: "User",
          enabled: true,
          userType: "WEBSITE_USER",
          roles: [],
        } as User;

        dispatch(
          setCredentials({
            user: tempUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          }),
        );
      }

      setStatus("success");
      setMessage("Xác thực thành công");
      return true;
    } catch (e: any) {
      const errMsg = e?.message || "Xác thực thất bại";
      setStatus("error");
      setMessage(errMsg);
      dispatch(setError(errMsg));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (auto && token) {
      // ignore result here; page có thể tự điều hướng sau
      run(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, auto]);

  return {status, message, run};
};

export default useVerify;
