import React, { FC, useCallback, useEffect, useState } from "react";
import { DashboardTotalProps } from "./DashboardTotal.types";
import { convertNumber } from "@/utils";
import Image from "next/image";
import {
  DashboardAnswersIcon,
  DashboardLinkIcon,
  DashboardPendingIcon,
  DashboardUserIcon,
  GrownDownIcon,
  GrownUpIcon,
} from "@/assets/icons";

const DashboardTotal: FC<DashboardTotalProps> = ({ data }) => {
  return (
    <div className="flex-row gap-5 flex mt-3">
      <div className="bg-white w-full p-[20px] rounded-[8px] shadow-md flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <div className="gap-[10px] flex-col flex">
            <span className="text-sm text-black ">Total User</span>
            <span className="text-3xl text-black font-bold">
              {convertNumber(data?.users?.total)}
            </span>
          </div>
          <div className="w-[60px] h-[60px] justify-center flex items-center bg-[#d8d7fa] rounded-[16px]">
            <Image src={DashboardUserIcon} alt="user" width={32} height={24} />
          </div>
        </div>
        <div className="flex flex-row items-center">
          <Image
            src={data?.users?.growth ? GrownUpIcon : GrownDownIcon}
            alt="grown-up"
            width={24}
            height={24}
          />
          <span
            className={`${
              data?.users?.growth ? "text-[#00B69B]" : "text-[#F93C65]"
            } text-sm font-sans font-normal px-1`}
          >
            {data?.users?.value}
          </span>
          <span className="text-black text-sm font-sans font-normal">
            Up from yesterday
          </span>
        </div>
      </div>
      <div className="bg-white w-full p-[20px] rounded-[8px] shadow-md flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <div className="gap-[10px] flex-col flex">
            <span className="text-sm text-black ">Total Links</span>
            <span className="text-3xl text-black font-bold">
              {convertNumber(data?.links?.total)}
            </span>
          </div>
          <div className="w-[60px] h-[60px] justify-center flex items-center bg-[#ffe8b1] rounded-[16px]">
            <Image src={DashboardLinkIcon} alt="link" width={32} height={24} />
          </div>
        </div>
        <div className="flex flex-row items-center">
          <Image
            src={data?.links?.growth ? GrownUpIcon : GrownDownIcon}
            alt="grown-up"
            width={24}
            height={24}
          />
          <span
            className={`${
              data?.links?.growth ? "text-[#00B69B]" : "text-[#F93C65]"
            } text-sm font-sans font-normal px-1`}
          >
            {data?.links?.value}
          </span>
          <span className="text-black text-sm font-sans font-normal">
            {data?.links?.growth ? "Up" : "Down"} from last month
          </span>
        </div>
      </div>
      <div className="bg-white w-full p-[20px] rounded-[8px] shadow-md flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <div className="gap-[10px] flex-col flex">
            <span className="text-sm text-black ">Total Answers</span>
            <span className="text-3xl text-black font-bold">
              {convertNumber(data?.answers?.total)}
            </span>
          </div>
          <div className="w-[60px] h-[60px] justify-center flex items-center bg-[#a9fed3] rounded-[16px]">
            <Image
              src={DashboardAnswersIcon}
              alt="answers"
              width={28}
              height={28}
            />
          </div>
        </div>
        <div className="flex flex-row items-center">
          <Image
            src={data?.answers?.growth ? GrownUpIcon : GrownDownIcon}
            alt="grown-up"
            width={24}
            height={24}
          />
          <span
            className={`${
              data?.answers?.growth ? "text-[#00B69B]" : "text-[#F93C65]"
            } text-sm font-sans font-normal px-1`}
          >
            {data?.answers?.value}
          </span>
          <span className="text-black text-sm font-sans font-normal">
            {data?.answers?.growth ? "Up" : "Down"} from last month
          </span>
        </div>
      </div>
      <div className="bg-white w-full p-[20px] rounded-[8px] shadow-md flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <div className="gap-[10px] flex-col flex">
            <span className="text-sm text-black ">Total Answers Pending</span>
            <span className="text-3xl text-black font-bold">
              {convertNumber(data?.pending?.total)}
            </span>
          </div>
          <div className="w-[60px] h-[60px] justify-center flex items-center bg-[#ffcab6] rounded-[16px]">
            <Image
              src={DashboardPendingIcon}
              alt="pending"
              width={28}
              height={30}
            />
          </div>
        </div>
        {/* <div className="flex flex-row items-center">
          <Image src={GrownUpIcon} alt="grown-up" width={24} height={24} />
          <span className="text-[#00B69B] text-sm font-sans font-normal px-1">
            8.5%
          </span>
          <span className="text-black text-sm font-sans font-normal">
            Up from yesterday
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardTotal;
