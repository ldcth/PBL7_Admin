import { AdminLayout } from "@/components";
import { monthValue, timeOptions, weekValue } from "@/constants";
import { CrawlApi, SettingApi } from "@/services";
import { IRecord } from "@/types";
import { Button, Progress, Select, Switch, Table, Tabs, TabsProps } from "antd";
import { Content } from "antd/es/layout/layout";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [crawl, setCrawl] = useState<boolean>(true);
  const [type, setType] = useState<"month" | "week">("week");
  const [date, setDate] = useState<number>(0);
  const [time, setTime] = useState<string>("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [crawlLoading, setCrawlLoading] = useState(false);
  const [crawlData, setCrawlData] = useState<IRecord>();
  // const [progress, setProgress] = useState(0);

  const handleGetData = useCallback(async () => {
    try {
      const res = await SettingApi.getSetting();
      if (res.data) {
        setCrawl(res.data.crawl);
        setType(res.data.type);
        setDate(res.data.date);
        setTime(res.data.time);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    if (crawlLoading) {
    }
  }, [crawlLoading]);

  const options = useMemo(() => {
    if (type === "week") {
      return weekValue;
    } else {
      return monthValue();
    }
  }, [type, weekValue]);

  const handleSaveSetting = useCallback(async () => {
    try {
      setSaveLoading(true);
      await SettingApi.updateSetting({
        crawl: crawl,
        type: type,
        date: date,
        time: time,
      });
      toast.success("Update success");
    } catch (error) {
      toast.error("Faile to save!");
    } finally {
      setSaveLoading(false);
    }
  }, [type, date, time, crawl]);

  const handleCrawl = useCallback(async () => {
    try {
      setCrawlLoading(true);
      const res = await CrawlApi.handleCrawlData();
      setCrawlData(res.data);
      toast.success("Crawl success");
    } catch (error) {
    } finally {
      setCrawlLoading(false);
    }
  }, []);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <span className="font-medium font-sans text-base text-[#718EBF]">
          Auto crawl
        </span>
      ),
      children: (
        <>
          <div className="w-full mb-[20px] items-center flex">
            <Switch
              value={crawl}
              onChange={setCrawl}
              className={crawl ? "!bg-[#16DBCC]" : ""}
            />
            <span className="font-sans ml-4 font-normal text-base mt-1 text-[#232323]">
              Auto crawl
            </span>
          </div>
          <div className="flex flex-col gap-[20px]">
            <div className="w-full flex flex-row">
              <div className="w-[50%]">
                <p className="font-sans font-medium text-base mb-2">Crawl by</p>
                <Select
                  options={[
                    {
                      value: "month",
                      label: "Month",
                    },
                    {
                      value: "week",
                      label: "Week",
                    },
                  ]}
                  value={type}
                  onChange={(value) => {
                    setType(value);
                    setDate(value === "month" ? 1 : 0);
                  }}
                  disabled={!crawl}
                  className="w-[70%] h-[40px]"
                />
              </div>
              <div className="w-[50%]">
                <p className="font-sans font-medium text-base mb-2">
                  Day crawl
                </p>
                <Select
                  options={options}
                  value={date}
                  onChange={(val) => {
                    setDate(val);
                  }}
                  disabled={!crawl}
                  className="w-[70%] h-[40px]"
                />
              </div>
            </div>
            <div className="w-full flex flex-row">
              <div className="w-[50%]">
                <p className="font-sans font-medium text-base mb-2">Time</p>
                <Select
                  options={timeOptions("07:00", "18:30", 30)}
                  value={time}
                  onChange={(val) => {
                    setTime(val);
                  }}
                  disabled={!crawl}
                  className="w-[70%] h-[40px]"
                />
              </div>
            </div>
            <div className="">
              <Button
                type="primary"
                size="large"
                loading={saveLoading}
                disabled={saveLoading}
                onClick={handleSaveSetting}
              >
                <span>Save</span>
              </Button>
            </div>
          </div>
        </>
      ),
    },
    {
      key: "2",
      label: (
        <span className="font-medium font-sans text-base text-[#718EBF]">
          Manual crawl
        </span>
      ),
      children: (
        <div className="flex flex-row mt-[30px]">
          <div className="w-[30%]">
            <Button
              size="large"
              type="primary"
              onClick={handleCrawl}
              loading={crawlLoading}
              disabled={crawlLoading}
            >
              <span>Crawl</span>
            </Button>
          </div>
          <div className="w-[70%]">
            <Table
              loading={crawlLoading}
              columns={[
                {
                  title: "LINK",
                  key: "name",
                  dataIndex: "name",
                  render: (value) => (
                    <Link
                      href={value}
                      target="_blank"
                      className="text-blue-500"
                    >
                      {value}
                    </Link>
                  ),
                },
              ]}
              dataSource={crawlData?.links.map((e) => {
                return {
                  name: e,
                };
              })}
            />
            <p className="text-sm text-gray-500">
              Total answers:{" "}
              <span className="text-base font-medium">
                {crawlData?.answers ?? "..."}
              </span>
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Content className="flex-1 p-6 bg-[#F5F6FA]">
      <span className="font-sans text-black text-2xl font-bold">Settings</span>
      <div className="px-[20px] py-[20px] bg-white rounded-[12px] shadow-md mt-[30px] w-full min-h-[400px]">
        <Tabs items={items} />
      </div>
      {/* <div className="px-[20px] py-[20px] bg-white rounded-[8px] shadow-md mt-[30px] w-full">
        <p className="font-sans font-medium text-base mb-2">
          Click the button to crawl immediately
        </p>
        <Button size="large" type="primary">
          <span>Crawl</span>
        </Button>
      </div> */}
    </Content>
  );
};

export default Page;
Page.Layout = AdminLayout;
Page.requireAuth = true;
