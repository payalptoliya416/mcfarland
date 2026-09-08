const TOKEN_KEY_User = "authtoken";
const TOKEN_TIME_KEY = "authtoken_time";
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const TOKEN_EXPIRY_SECONDS = TOKEN_EXPIRY_MS / 1000;

const redirectToUserSignIn = () => {
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/user/signin")) {
    const returnUrl = window.location.pathname + window.location.search;
    window.location.replace(`/user/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
  }
};

/* ================= SAVE TOKEN ================= */
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY_User, token);
    localStorage.setItem(TOKEN_TIME_KEY, Date.now().toString());
    document.cookie = `${TOKEN_KEY_User}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_EXPIRY_SECONDS}`;
  }
};

/* ================= GET TOKEN ================= */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(TOKEN_KEY_User);
  const time = localStorage.getItem(TOKEN_TIME_KEY);

  if (!token || !time) return null;

  const isExpired = Date.now() - Number(time) > TOKEN_EXPIRY_MS;

  if (isExpired) {
    clearToken();
    redirectToUserSignIn();
    return null;
  }

  return token;
};

/* ================= REMOVE TOKEN ================= */
export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY_User);
    localStorage.removeItem(TOKEN_TIME_KEY);
    document.cookie = `${TOKEN_KEY_User}=; path=/; max-age=0`;
  }
};

/* ================= IS LOGGED IN ================= */
export const isLoggedIn = () => {
  return !!getToken();
};

/* ================= AUTH ERROR CHECK ================= */
export const isAuthError = (err: any) => {
  const msg =
    err?.message ||
    err?.response?.data?.message ||
    err?.data?.message;

  return (
    msg === "Access denied. No token provided." ||
    msg === "Unauthenticated" ||
    msg === "Unauthorized"
  );
};

export const handleUserAuthFailure = () => {
  clearToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem("userdata");
    localStorage.removeItem("license_submitted");
  }
  redirectToUserSignIn();
};
