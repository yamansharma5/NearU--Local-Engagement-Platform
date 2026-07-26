const ROLE_HOME = {
  BUSINESS: "/business",
  ADMIN: "/admin",
  USER: "/feed",
};

export function roleHome(role) {
  return ROLE_HOME[role] || "/feed";
}
