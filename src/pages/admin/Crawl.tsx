import { AdminLayout } from "@/components";
import { CrawlApi } from "@/services";
import { IRecord } from "@/types";
import { Table, Tag } from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState<IRecord[]>();
  const [loading, setLoading] = useState(false);

  const handleGetData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await CrawlApi.getCrawlHis();
      if (res.data) setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <Content className="flex-1 p-6 bg-[#F5F6FA]">
      <span className="font-sans text-black text-2xl font-bold">
        Crawl Management
      </span>
      <div className="px-[20px] py-[10px] bg-white rounded-[8px] shadow-md mt-[30px] w-full">
        <p className="font-sans text-black text-xl font-normal pb-5 pt-2">
          Crawl Table
        </p>
        <Table
          dataSource={data}
          loading={loading}
          columns={[
            {
              title: "ID",
              dataIndex: "_id",
              key: "id",
              width: "10%",
              render: (value) => <p className="font-semibold">{value}</p>,
            },
            {
              title: "TOTAL ANSWERS",
              dataIndex: "answers",
              key: "answers",
              width: "20%",
            },
            {
              title: "LINKS",
              dataIndex: "links",
              key: "links",
              width: "50%",
              render: (value) => (
                <>
                  {value.map((e: string, index: number) => (
                    <>
                      <Link
                        href={value}
                        target="_blank"
                        className="text-blue-500"
                        key={index}
                      >
                        <p>{e}</p>
                      </Link>
                      <br></br>
                    </>
                  ))}
                </>
              ),
            },
            {
              title: "CRAWL DAY",
              dataIndex: "createdAt",
              key: "createdAt",
              width: "20%",
              render: (value) => (
                <p className="font-sans font-normal text-base">
                  {dayjs(value).format("HH:mm DD/MM/YYYY")}
                </p>
              ),
            },
          ]}
        />
      </div>
    </Content>
  );
};

export default Page;
Page.Layout = AdminLayout;
Page.requireAuth = true;
