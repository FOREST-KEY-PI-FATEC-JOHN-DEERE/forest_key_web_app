export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return !!token;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("profile");
  window.location.href = "/login";
}
