import API from "../API/API";

export const handleLogout = async () => {
  try {
    await API.get(`/profile/logout`);
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

const hidePath = [
  "/login",
  "/register",
  /^\/verify-email\/[^/]+$/,
  /^\/verify-email\/send\/[^/]+$/,
  "/forgot-password",
  /^\/forgot-password\/send\/[^/]+$/,
  /^\/reset-password\/[^/]+$/,
  /^\/profile\/switch\/professional\/[^/]+$/,
  /^\/profile\/delete\/account\/send\/[^/]+$/,
];

export const handlehide = (path: string) => {
  if (
    hidePath.some((p) =>
      typeof p === "string"
        ? p === path
        : p instanceof RegExp
        ? p.test(path)
        : false
    )
  ) {
    return "d-none";
  }
  return "";
};
