import React, { FC, useEffect, useMemo, useState } from "react";
import { AdminLayoutProps } from "./AdminLayout.types";
import { Dropdown, Layout, Menu, MenuProps, theme } from "antd";
import {
  DashboardOutlined,
  SettingOutlined,
  FieldTimeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, logout } from "@/redux/reducers";

const { Header, Sider, Content } = Layout;
export const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector(authSelector);
  const dispatch = useDispatch();

  const itemsMenu = useMemo(() => {
    const menu: {
      key: string;
      icon: JSX.Element;
      label: string;
      onClick: () => void;
      danger?: boolean;
    }[] = [
      {
        key: "1",
        icon: <DashboardOutlined size={30} className="" />,
        label: "Dashboard",
        onClick: () => {
          router.push("/admin");
        },
      },
      {
        key: "2",
        icon: <LinkOutlined />,
        label: "Link ",
        onClick: () => {
          router.push("/admin/Link");
        },
      },
      {
        key: "3",
        icon: <UserOutlined />,
        label: "User",
        onClick: () => {
          router.push("/admin/User");
        },
      },
      {
        key: "4",
        icon: <FieldTimeOutlined />,
        label: "Crawl",
        onClick: () => {
          router.push("/admin/Crawl");
        },
      },
      {
        key: "5",
        icon: <FieldTimeOutlined />,
        label: "Finetune",
        onClick: () => {
          router.push("/admin/Finetune");
        },
      },
      {
        key: "6",
        icon: <SettingOutlined />,
        label: "Setting",
        onClick: () => {
          router.push("/admin/Setting");
        },
      },
    ];
    return menu;
  }, []);

  const openChangePassword = () => {};
  const openLogout = () => {
    dispatch(logout());
    router.push("/");
  };
  const router = useRouter();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link href="/account">Account</Link>,
    },
    {
      key: "2",
      label: <div onClick={openChangePassword}>Change password</div>,
    },
    {
      key: "3",
      label: <div onClick={openLogout}>Logout</div>,
    },
  ];

  const currentSelect = useMemo(() => {
    let select = "0";

    switch (router.pathname) {
      case "/admin":
        select = "1";
        break;
      case "/admin/Link":
        select = "2";
        break;
      case "/admin/User":
        select = "3";
        break;
      case "/admin/Crawl":
        select = "4";
        break;
      case "/admin/Finetune":
        select = "5";
        break;
      case "/admin/Setting":
        select = "6";
        break;
      case "/roles":
        select = "7";
        break;
      default:
        break;
    }
    return select;
  }, [router.pathname]);

  return (
    <Layout className="wrapper h-screen bg-blue-100">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="logo">
          <p className="text-white">Admin</p>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[currentSelect]}
          items={[...itemsMenu]}
          className="text-base"
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="bg-white flex p-0 justify-between items-center sticky top-0 z-10">
          <div className="ml-5">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </div>
          <Dropdown
            menu={{ items }}
            placement="bottomRight"
            arrow
            className="avatar"
          >
            <div className="mr-[20px]">
              <p className="mr-[10px] font-sans text-base font-medium cursor-pointer">
                {user?.name}
              </p>
            </div>
          </Dropdown>
        </Header>
        <div className="h-screen overflow-scroll">{children}</div>
      </Layout>
    </Layout>
  );
};
