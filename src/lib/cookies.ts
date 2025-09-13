// Cookie management utility
export class XCookie {
  private static readonly ACCESS_TOKEN_KEY = "access_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";
  private static readonly USER_KEY = "user";
  private static readonly USER_PROFILE_KEY = "user_profile";

  // Access Token methods
  static setAccessToken(token: string): void {
    this.setCookie(this.ACCESS_TOKEN_KEY, token, 7); // 7 days
  }

  static getAccessToken(): string | null {
    return this.getCookie(this.ACCESS_TOKEN_KEY);
  }

  static removeAccessToken(): void {
    this.removeCookie(this.ACCESS_TOKEN_KEY);
  }

  // Refresh Token methods
  static setRefreshToken(token: string): void {
    this.setCookie(this.REFRESH_TOKEN_KEY, token, 30); // 30 days
  }

  static getRefreshToken(): string | null {
    return this.getCookie(this.REFRESH_TOKEN_KEY);
  }

  static removeRefreshToken(): void {
    this.removeCookie(this.REFRESH_TOKEN_KEY);
  }

  // User methods
  static setUser(user: any): void {
    this.setCookie(this.USER_KEY, JSON.stringify(user), 7);
  }

  static getUser(): any | null {
    const userStr = this.getCookie(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static removeUser(): void {
    this.removeCookie(this.USER_KEY);
  }

  // User Profile methods
  static setUserProfile(profile: any): void {
    this.setCookie(this.USER_PROFILE_KEY, JSON.stringify(profile), 7);
  }

  static getUserProfile(): any | null {
    const profileStr = this.getCookie(this.USER_PROFILE_KEY);
    if (!profileStr) return null;
    try {
      return JSON.parse(profileStr);
    } catch {
      return null;
    }
  }

  static removeUserProfile(): void {
    this.removeCookie(this.USER_PROFILE_KEY);
  }

  // Clear all auth cookies
  static clearAllCookies(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUser();
    this.removeUserProfile();
  }

  // Private helper methods
  private static setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    // Chỉ thêm Secure flag cho HTTPS (production)
    const isProduction = import.meta.env.PROD;
    const isHttps =
      typeof window !== "undefined" && window.location.protocol === "https:";
    const secureFlag = isProduction && isHttps ? ";Secure" : "";

    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict${secureFlag}`;
  }

  private static getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private static removeCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}
