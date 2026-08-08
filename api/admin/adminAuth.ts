const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_TOKEN_EXP_KEY = "admin_token_exp";
const ADMIN_USER_KEY = "admin_user";

/* ================= SAVE ================= */
export const saveAdminToken = (
  token: string,
  expiresInSeconds: number,
  user?: { name: string; email: string }
) => {
  const expiryTime = Date.now() + expiresInSeconds * 1000;

  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_TOKEN_EXP_KEY, expiryTime.toString());

  if (user) {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  }

  // for middleware
  document.cookie = `admin_token=${token}; path=/; max-age=${expiresInSeconds}`;
};

/* ================= TOKEN ================= */
export const getAdminToken = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const expiry = localStorage.getItem(ADMIN_TOKEN_EXP_KEY);

  if (!token || !expiry) return null;

  if (Date.now() > Number(expiry)) {
    clearAdminToken();
    return null;
  }

  return token;
};

/* ================= USER ================= */
export const getAdminUser = () => {
  const user = localStorage.getItem(ADMIN_USER_KEY);
  return user ? JSON.parse(user) : null;
};

/* ================= LOGOUT ================= */
export const clearAdminToken = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_EXP_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);

  document.cookie = "admin_token=; path=/; max-age=0";
};
