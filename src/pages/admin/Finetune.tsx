import { AdminLayout } from "@/components";
import { CrawlApi } from "@/services";
import { IFinetuning } from "@/types";
import { Button, Table, Tag } from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [data, setData] = useState<IFinetuning[]>();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await CrawlApi.getListFinetuning();
      if (res.data) setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFinetune = useCallback(async () => {
    try {
      setIsLoading(true);
      await CrawlApi.handleFinetuning();
      await handleGetData();
      toast.success("Finetune model success!");
    } catch (error) {
      toast.error("Finetune model fail!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <Content className="flex-1 p-6 bg-[#F5F6FA]">
      <div className="flex flex-row justify-between w-full">
        <span className="font-sans text-black text-2xl font-bold">
          Finetune Management
        </span>
        <Button
          type="primary"
          onClick={handleFinetune}
          loading={isLoading}
          disabled={isLoading}
        >
          Finetune
        </Button>
      </div>
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
              title: "TOTAL DATA",
              dataIndex: "answers",
              key: "answers",
              width: "20%",
            },
            {
              title: "RESULT",
              dataIndex: "result",
              key: "result",
              width: "50%",
              render: (value) => (
                <Link href={value} target="_blank" className="text-blue-500">
                  <p>{value}</p>
                </Link>
              ),
            },
            {
              title: "DAY",
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
