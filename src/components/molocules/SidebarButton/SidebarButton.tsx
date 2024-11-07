import React, { FC, useMemo } from "react";
import { SidebarButtonProps } from "./SidebarButton.types";
import Image from "next/image";
import { DefaultAvatarIcon, NewChatIcon, SmallLogoIcon } from "@/assets/icons";

const SidebarButton: FC<SidebarButtonProps> = ({
  text,
  type = "content",
  className,
  active = false,
  ...props
}) => {
  const icon = useMemo(() => {
    if (type === "action") {
      return (
        <div className="rounded-full min-w-[40px] h-[40px] bg-gray-200 border border-gray-200 flex items-center justify-center">
          <Image src={SmallLogoIcon} alt="Logo" className="w-[20px] h-[20px]" />
        </div>
      );
    }
    if (type === "user") {
      return (
        <div className="rounded-full min-w-[40px] h-[40px] bg-white border border-gray-200 flex items-center justify-center">
          <Image
            src={DefaultAvatarIcon}
            alt="Logo"
            className="w-[40px] h-[40px] rounded-full"
          />
        </div>
      );
    }
    return <></>;
  }, [type]);

  const descriptionIcon = useMemo(() => {
    if (type === "action") {
      return (
        <Image src={NewChatIcon} alt="New chat" className="w-[20px] h-[20px]" />
      );
    }

    return <></>;
  }, [type]);

  return (
    <div
      className={`flex flex-row items-center cursor-pointer p-[10px] hover:bg-gray-200 rounded-xl justify-between ${className} ${
        active && "bg-gray-200"
      }`}
      {...props}
    >
      <div className="flex flex-row items-center gap-3 whitespace-nowrap overflow-hidden">
        {icon}
        <span className="font-sans font-medium text-black text-base text-ellipsis w-full overflow-hidden ">
          {text}
        </span>
      </div>
      {descriptionIcon}
    </div>
  );
};

export default SidebarButton;
