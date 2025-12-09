"use client";
import React from "react";
import { Button } from "antd";
import {
  PlusOutlined,
  UserAddOutlined,
  FileTextOutlined,
  EditOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: "Add Clinic",
      onClick: () => router.push("/clinics"),
      type: "primary",
      icon: <PlusOutlined />,
    },
    {
      label: "Dentists",
      onClick: () => router.push("/dentists"),
      type: "default",
      icon: <UserAddOutlined />,
    },
    {
      label: "Plans",
      onClick: () => router.push("/plans"),
      type: "default",
      icon: <FileTextOutlined />,
    },
    {
      label: "Write Blog",
      onClick: () => router.push("/blogs"),
      type: "default",
      icon: <EditOutlined />,
    },
    {
      label: "Enquiries",
      onClick: () => router.push("/enquiries"),
      type: "default",
      icon: <MailOutlined />,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {actions.map(({ label, onClick, type, icon }) => (
        <Button
          key={label}
          type={type as "primary" | "default"}
          icon={icon}
          onClick={onClick}
          className="transition-transform duration-300 ease-in-out hover:scale-105"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
