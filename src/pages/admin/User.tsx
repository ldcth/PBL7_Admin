import { DeleteIcon } from "@/assets/icons";
import { AdminLayout } from "@/components";
import { AuthApi } from "@/services";
import { IUser } from "@/types";
import { Modal, Table } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await AuthApi.getAllUser();
      if (res.data) setData(res.data);
    } catch (error) {
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
      <span className="font-sans text-black text-2xl font-bold">
        User Management
      </span>
      <div className="px-[20px] py-[10px] bg-white rounded-[8px] shadow-md mt-[30px] w-full">
        <Table
          dataSource={data}
          loading={isLoading}
          columns={[
            {
              title: "ID",
              dataIndex: "_id",
              key: "id",
              width: "15%",
            },
            {
              title: "NAME",
              dataIndex: "name",
              key: "name",
              width: "25%",
            },
            {
              title: "EMAIL",
              dataIndex: "email",
              key: "email",
              width: "25%",
            },
            {
              title: "SIGN UP DATE",
              dataIndex: "createdAt",
              key: "createdAt",
              width: "20%",
              render: (value) => (
                <p className="font-sans text-base">
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
                        //   handleOpenDelete(record);
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
      {/* <Modal
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
  </Modal> */}
    </Content>
  );
};

export default Page;
Page.Layout = AdminLayout;
Page.requireAuth = true;
