import instance from "./axios";

interface UpdateProps {
  time: string;
  date: number;
  type: "week" | "month";
  crawl: boolean;
}

const getSetting = () => {
  return instance.get("/settings");
};

const updateSetting = (data: UpdateProps) => {
  return instance.put(`/settings`, data);
};

export const SettingApi = {
  getSetting,
  updateSetting,
};
