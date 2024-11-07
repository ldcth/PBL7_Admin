import { AdminLayout } from "@/components";
import { LinkApi } from "@/services";
import { ILink } from "@/types";
import { Table, Tag } from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import Link from "next/link";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import { DeleteIcon } from "@/assets/icons";
import Image from "next/image";
import { Button, Modal } from "antd";
import toast from "react-hot-toast";

const Page = () => {
  const [data, setData] = useState<ILink[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<ILink>();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGetData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await LinkApi.getAllLinks();
      if (res.data) setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteLink = useCallback(async () => {
    try {
      if (selected && selected.new) {
        setIsLoading(true);
        await LinkApi.deleteLinkById(selected?._id);
        toast.success("Delete success");
        await handleGetData();
      } else {
        toast.error("Can not delete link in completed state");
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete faile");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  }, [selected, handleGetData]);

  const handleOpenDelete = useCallback((link: ILink) => {
    setIsModalOpen(true);
    setSelected(link);
  }, []);

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <Content className="flex-1 p-6 bg-[#F5F6FA]">
      <span className="font-sans text-black text-2xl font-bold">
        Link Management
      </span>
      <div className="px-[20px] py-[10px] bg-white rounded-[8px] shadow-md mt-[30px] w-full">
        <p className="font-sans text-black text-xl font-normal pb-5 pt-2">
          Link Table
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
              title: "LINK",
              dataIndex: "name",
              key: "name",
              width: "30%",
              render: (value) => (
                <Link href={value} target="_blank" className="text-blue-500">
                  {value}
                </Link>
              ),
            },
            {
              title: "QUESTIONS",
              dataIndex: "questions",
              key: "questions",
              width: "10%",
              render: (value) => (
                <p className="font-sans font-medium text-base">{value}</p>
              ),
            },
            {
              title: "STATUS",
              dataIndex: "new",
              key: "new",
              width: "13%",
              render: (value) => (
                <Tag color={value ? "red" : "green"}>
                  {value ? "PENDING" : "COMPLETED"}
                </Tag>
              ),
            },
            {
              title: "CRAWL DAY",
              dataIndex: "createdAt",
              key: "createdAt",
              width: "15%",
              render: (value) => (
                <p className="font-sans font-medium text-base">
                  {dayjs(value).format("DD / MM / YYYY")}
                </p>
              ),
            },
            {
              title: "ACTION",
              dataIndex: "",
              key: "",
              render: (value, record, index) => (
                <div className="flex flex-row gap-3">
                  <div className="border-[1px] border-black rounded-[10px] flex flex-row">
                    <div className="cursor-pointer p-2">
                      <InfoCircleOutlined alt="detail" title="Detail" />
                    </div>
                    <div className="w-[0.5px] bg-black" />
                    <div
                      className="cursor-pointer p-2 content-center"
                      title="Delete"
                      onClick={() => {
                        handleOpenDelete(record);
                      }}
                    >
                      <Image
                        src={DeleteIcon}
                        width={16}
                        height={15}
                        alt="Delete Link"
                      />
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
      <Modal
        title="Confirm Delete"
        open={isModalOpen}
        centered
        onCancel={() => setIsModalOpen(false)}
        onOk={handleDeleteLink}
        okButtonProps={{
          disabled: isLoading,
          loading: isLoading,
        }}
        cancelButtonProps={{
          disabled: isLoading,
        }}
      >
        <p className="text-xl font-sans">
          Are you sure you want to delete this?
        </p>
      </Modal>
    </Content>
  );
};

export default Page;
Page.Layout = AdminLayout;
Page.requireAuth = true;
