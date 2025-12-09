import React from "react";
import {
  HomeOutlined,
  SettingOutlined,
  CameraOutlined,
  TeamOutlined,
  BankOutlined,
  QuestionCircleOutlined,
  CreditCardOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  MessageOutlined,
  BookOutlined,
  ApartmentOutlined,
  SolutionOutlined, // Make sure SolutionOutlined is imported
  CustomerServiceOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const getMenuItems = (collapsed: boolean): MenuProps["items"] => [
  getItem(
    <Link href="/">Home</Link>,
    "home",
    <HomeOutlined className="text-lg" />
  ),

  { type: "divider" },
  getItem(
    <span className="text-gray-50 text-xs uppercase">Main</span>,
    "grp-main",
    null,
    [],
    "group"
  ),

  getItem(
    <Link href="/clinics">Clinics</Link>,
    "clinics",
    <BankOutlined className="text-lg" />
  ),
  getItem(
    <Link href="/fix-my-teeth">Fix My Teeth</Link>,
    "fix-my-teeth",
    <SolutionOutlined className="text-lg" />
  ),
  getItem(
    <Link href="/plans">Plans</Link>,
    "plans",
    <CreditCardOutlined className="text-lg" />
  ),
  getItem(
    <Link href="/pop-up-form">Pop Up Form</Link>,
    "pop-up-form",
    <QuestionCircleOutlined className="text-lg" />
  ),
  getItem( // New Leads Dashboard item
    <Link href="/leads">Leads Dashboard</Link>,
    "leads",
    <SolutionOutlined className="text-lg" /> // Using SolutionOutlined as a placeholder, can be changed.
  ),

  { type: "divider" },
  getItem(
    <span className="text-gray-50 text-xs uppercase">Management</span>,
    "grp-management",
    null,
    [],
    "group"
  ),

  getItem(
    "Management",
    "management",
    <ApartmentOutlined className="text-lg" />,
    [
      getItem(<Link href="/users">Users</Link>, "users", <UserOutlined />),
      getItem(
        <Link href="/patients">Patients</Link>,
        "patients",
        <TeamOutlined />
      ),
      getItem(
        <Link href="/dentists">Dentists</Link>,
        "dentists",
        <MedicineBoxOutlined />
      ),
    ]
  ),

  getItem("Labs", "labs", <ExperimentOutlined className="text-lg" />, [
    getItem(
      <Link href="/cbct-opg-labs">CBCT OPG Labs</Link>,
      "cbct-opg-labs",
      <ExperimentOutlined />
    ),
    getItem(
      <Link href="/diagnostic-labs">Diagnostic Labs</Link>,
      "diagnostic-labs",
      <FileTextOutlined />
    ),
  ]),

  { type: "divider" },
  getItem(
    <span className="text-gray-50 text-xs uppercase">Content</span>,
    "grp-content",
    null,
    [],
    "group"
  ),

  getItem("Content", "content", <ReadOutlined className="text-lg" />, [
    getItem(<Link href="/blogs">Blogs</Link>, "blogs", <BookOutlined />),
    getItem(
      <Link href="/testimonials">Testimonials</Link>,
      "testimonials",
      <MessageOutlined />
    ),
  ]),

  { type: "divider" },
  getItem(
    <span className="text-gray-50 text-xs uppercase">Support</span>,
    "grp-support",
    null,
    [],
    "group"
  ),

  getItem(
    <Link href="/support">Support</Link>,
    "support",
    <CustomerServiceOutlined className="text-lg" />
  ),

  { type: "divider" },
  getItem(
    <span className="text-gray-50 text-xs uppercase">Settings</span>,
    "grp-settings",
    null,
    [],
    "group"
  ),

  getItem("Settings", "settings", <SettingOutlined className="text-lg" />, [
    getItem(
      <Link href="/website-images">Website Images</Link>,
      "website-images",
      <CameraOutlined />
    ),
    getItem(
      <Link href="/site-settings">Site Settings</Link>,
      "site-settings",
      <SettingOutlined />
    ),
  ]),
];
