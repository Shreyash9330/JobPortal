import { jwtDecode } from "jwt-decode";

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
};

export const getAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const { role, sub, exp } = jwtDecode(token);
    if (exp && exp * 1000 < Date.now()) {
      clearAuth();
      return null;
    }
    return { token, role, email: sub };
  } catch {
    clearAuth();
    return null;
  }
};
