import {authServices} from "../services/auth.services";

export const getAccessToken = async () => {
  let accessToken = localStorage.getItem("accessToken") || "";
  const accessTokenExp = JSON.parse(atob(String(accessToken?.split(".")[1])));

  if (accessTokenExp >= Date.now()) {
    const refreshToken = localStorage.getItem("refreshToken");
    const refreshTokenExp = JSON.parse(
      atob(String(refreshToken?.split(".")[1])),
    );
    if (refreshTokenExp >= Date.now()) return "";

    const response = await authServices.refresh(String(refreshToken));
    accessToken = response?.accessToken;
    localStorage.setItem("accessToken", String(accessToken));
    localStorage.setItem("refreshToken", String(response?.refreshToken));
  }
  return accessToken;
};
