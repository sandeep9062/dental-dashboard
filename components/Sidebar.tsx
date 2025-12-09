"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Button, Typography } from "antd";
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getMenuItems } from "./menuItems";

const { Sider } = Layout;
const { Title } = Typography;

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const getSelectedKey = () => {
    if (pathname === "/") return "home";
    const pathSegments = pathname.split("/").filter(Boolean);
    return pathSegments.length > 0 ? pathSegments[0] : "";
  };

  const getSubMenuKey = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    if (["users", "patients", "dentists"].includes(pathSegments[0])) {
      return "management";
    }
    if (["cbct-opg-labs", "diagnostic-labs"].includes(pathSegments[0])) {
      return "labs";
    }
    if (["blogs", "testimonials"].includes(pathSegments[0])) {
      return "content";
    }
    if (["website-images", "site-settings"].includes(pathSegments[0])) {
      return "settings";
    }
    return "";
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(val) => !isMobile && setCollapsed(val)}
      collapsedWidth={isMobile ? 0 : 80}
      trigger={isMobile ? null : undefined}
      width={250}
      className="!bg-gray-900 min-h-screen shadow-2xl flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-3 group">
            <Avatar
              src="/logo.ico"
              size="large"
              className="p-1 bg-white shadow-md"
            />
            <Title
              level={5}
              className="!m-0 !text-white !font-bold tracking-wide group-hover:!text-blue-400 transition-colors"
            >
              Urja Dental Clinic
            </Title>
          </Link>
        )}
        {!isMobile && (
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined className="text-xl" />
              ) : (
                <MenuFoldOutlined className="text-xl" />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            className="!text-white hover:!bg-gray-800"
          />
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        defaultOpenKeys={[getSubMenuKey()]}
        className="flex-grow mt-4 bg-transparent border-0"
        items={getMenuItems(collapsed)}
      />

      <div className="p-4 mt-auto border-t border-gray-800">
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined className="text-lg" />}
          onClick={handleLogout}
          block
          className="flex items-center justify-center h-12 text-base font-semibold bg-red-600 border-0 rounded-lg shadow-md hover:bg-red-700"
        >
          {!collapsed && "Logout"}
        </Button>
      </div>
    </Sider>
  );
};
