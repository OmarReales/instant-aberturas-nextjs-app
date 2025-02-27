// Admin authentication functions

export const setAdminAuth = () => {
  localStorage.setItem("adminAuth", "true");
};

export const getAdminAuth = () => {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem("adminAuth")
    : null;
};
