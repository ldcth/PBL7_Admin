import instance from "./axios";

const getDashboardInfor = () => {
  return instance.get("/dashboard");
};

export const DashboardApi = {
  getDashboardInfor,
};
