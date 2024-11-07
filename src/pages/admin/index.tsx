import Image from "next/image";
import { Inter } from "next/font/google";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { DashboardApi, LinkApi } from "@/services";
import { AdminLayout, DashboardTotal } from "@/components";
import { Content } from "antd/es/layout/layout";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Table } from "antd";
import { IDashboard } from "@/types";
import dayjs from "dayjs";
import Link from "next/link";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Title,
  ArcElement
);

interface Props {}

const Page = ({}: Props) => {
  const [data, setData] = useState<IDashboard>();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await DashboardApi.getDashboardInfor();
      if (res.data) setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading", {
        duration: 1000000,
      });
    }
    return () => {
      toast.remove();
    };
  }, [isLoading]);

  useEffect(() => {
    handleGetData();
  }, []);

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const linksData = {
    labels,
    datasets: [
      {
        label: "Total Links",
        data: data?.links?.per_months,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const answersData = {
    labels,
    datasets: [
      {
        label: "Total Answers",
        data: data?.answers?.per_months,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const dataSource = useMemo(() => {
    return data?.links?.data.map((link, index) => {
      return {
        key: index.toString(),
        ...link,
      };
    });
  }, [data]);

  return (
    <Content className="flex-1 p-6 bg-[#F5F6FA]">
      <span className="font-sans text-black text-2xl font-bold">Dashboard</span>
      <DashboardTotal data={data} />
      <div className="flex flex-row gap-[20px] w-full">
        <div className="px-[20px] py-[10px] bg-white rounded-[8px] shadow-md mt-[30px] w-full">
          <Bar
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top" as const,
                },
                title: {
                  display: true,
                  text: "Number of Links crawled",
                },
              },
            }}
            data={linksData}
          />
        </div>
        <div className="px-[20px] py-[10px] bg-white rounded-[8px] shadow-md mt-[30px] w-full">
          <Bar
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top" as const,
                },
                title: {
                  display: true,
                  text: "Number of Answers crawled",
                },
              },
            }}
            data={answersData}
          />
        </div>
      </div>
      <div className="px-[20px] py-[20px] bg-white rounded-[8px] shadow-md mt-[30px] w-full flex-row flex justify-between">
        <div className="w-[35%] h-auto">
          <p className="text-gray-500 font-sans text-xl mb-5 text-center min-h-[60px]">
            Distribution of Responses with and without Feedback
          </p>
          <Pie
            className=""
            data={{
              labels: ["Responses with Feedback", "Responses without Feedback"],
              datasets: [
                {
                  label: "Total: ",
                  data: [data?.contents?.feedback, data?.contents?.no_feedback],
                  backgroundColor: ["#4049FF", "#E9EFFC"],
                  borderWidth: 0,
                  hoverBackgroundColor: ["#4049FF", "#E9EFFC"],
                },
              ],
            }}
          />
        </div>
        <div className="w-[35%] h-auto">
          <p className="text-gray-500 font-sans text-xl mb-5 text-center min-h-[60px]">
            Distribution of User Feedback {"\n"}
          </p>
          <Pie
            className=""
            data={{
              labels: [
                "Wrong answer",
                "Wrong explain",
                "Wrong both answer and explain",
              ],
              datasets: [
                {
                  label: "Total: ",
                  data: data?.contents?.type_feedback,
                  backgroundColor: ["#448EFC", "#1CCAB8", "#FFD56D"],
                  borderWidth: 0,
                  hoverBackgroundColor: ["#448EFC", "#1CCAB8", "#FFD56D"],
                },
              ],
            }}
          />
        </div>
      </div>
      <div className="px-[20px] py-[10px] bg-white rounded-[8px] shadow-md mt-[30px] w-full">
        <p className="font-sans text-black text-xl font-normal pb-5 pt-2">
          New Links
        </p>
        <Table
          dataSource={dataSource}
          columns={[
            {
              title: "Id",
              dataIndex: "_id",
              key: "id",
              width: "20%",
              render: (value) => <p className="font-semibold">{value}</p>,
            },
            {
              title: "Link",
              dataIndex: "name",
              key: "name",
              width: "40%",
              render: (value) => (
                <Link href={value} target="_blank">
                  {value}
                </Link>
              ),
            },
            {
              title: "Total questions",
              dataIndex: "questions",
              key: "questions",
              width: "20%",
            },
            {
              title: "Crawl day",
              dataIndex: "createdAt",
              key: "createdAt",
              width: "20%",
              render: (value) => <p>{dayjs(value).format("DD/MM/YYYY")}</p>,
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
