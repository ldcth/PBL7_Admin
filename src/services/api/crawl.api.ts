import { IFinetuning, IRecord } from "@/types";
import instance from "./axios";

const getCrawlHis = () => {
  return instance.get<IRecord[]>("/crawl");
};

const handleCrawlData = () => {
  return instance.post<IRecord>("/crawl");
};

const getListFinetuning = () => {
  return instance.get<IFinetuning[]>("/finetune");
};

const handleFinetuning = () => {
  return instance.post<IFinetuning>("/finetune");
};

export const CrawlApi = {
  handleCrawlData,
  getCrawlHis,
  handleFinetuning,
  getListFinetuning,
};
