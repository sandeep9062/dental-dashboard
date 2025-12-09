"use client";

import { Typography, Card, Button } from "antd";
import {
  FaMoneyBillWave,
  FaArrowDown,
  FaArrowUp,
  FaUsers,
  FaFile,
  FaBriefcase,
  FaEnvelopeOpenText,
  FaBullseye,
} from "react-icons/fa";
import millify from "millify";

import { useGetBlogsQuery } from "@/services/blogsApi";
import { useGetClinicsQuery } from "@/services/clinicApi";
import { useGetContactsQuery } from "@/services/contactApi";
import { useGetSupportsQuery } from "@/services/supportApi";
import { useGetCbctOpgLabsQuery } from "@/services/cbctOpgLabs";
import { useGetAllDentistsQuery } from "@/services/dentalApi";
import { useGetDiagnosticLabsQuery } from "@/services/diagnosticLabApi";
import { useGetUsersQuery } from "@/services/userApi";

import { useGetAllPatientsQuery } from "@/services/patientsApi";
import { useGetNotificationsQuery } from "@/services/notificationApi";

import Charts from "@/components/Charts";

import NotificationsPanel from "@/components/NotificationsPanel";
import QuickActions from "@/components/QuickActions";
import FinancialSummaryCards from "@/components/FinancialSummaryCards"; // Added this line

const { Title } = Typography;

export default function Home() {
  const { data: notifications, isFetching: isFetchingNotifications } = useGetNotificationsQuery();
  const { data: blogsData, isFetching: isFetchingBlogs } = useGetBlogsQuery();

  const { data: usersData, isFetching: isFetchingUsers } = useGetUsersQuery();

  const { data: clinicsData, isFetching: isFetchingClinics } =
    useGetClinicsQuery();

  const { data: dentistsData, isFetching: isFetchingDentists } =
    useGetAllDentistsQuery();
  const { data: patientsData, isFetching: isFetchingPatients } =
    useGetAllPatientsQuery();

  const { data: contactsData, isFetching: isFetchingContacts } =
    useGetContactsQuery();

  const { data: supportsData, isFetching: isFetchingSupports } =
    useGetSupportsQuery();
  const { data: cbctOpgData, isFetching: isFetchingCbctOpg } =
    useGetCbctOpgLabsQuery();
  const { data: diagnosticLabsData, isFetching: isFetchingDiagnostic } =
    useGetDiagnosticLabsQuery();

  if (
    isFetchingBlogs ||
    isFetchingClinics ||
    isFetchingDentists ||
    isFetchingUsers ||
    isFetchingContacts ||
    isFetchingPatients ||
    isFetchingSupports ||
    isFetchingCbctOpg ||
    isFetchingDiagnostic ||
    isFetchingNotifications
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  // Ensure data is always an array

  const blogs = blogsData || [];
  const users = usersData || [];
  const clinics = clinicsData || [];
  const dentists = dentistsData || [];
  const contacts = contactsData?.contacts || [];
  const supports = supportsData || [];
  const cbctOpg = cbctOpgData || [];
  const patients = patientsData || [];
  const diagnostic = diagnosticLabsData || [];

  // Removed hardcoded financial totals
  // const totalRevenue = 22020;
  // const totalExpenses = 12121;
  // const totalProfit = 1212;

  const dashboardStats = [
    // Removed existing Revenue, Expenses, Profit cards from here
    // { 
    //   label: "Revenue",
    //   value: totalRevenue,
    //   icon: <FaMoneyBillWave size={32} />,
    //   gradient: "from-green-400 to-blue-500",
    // },
    // {
    //   label: "Expenses",
    //   value: totalExpenses,
    //   icon: <FaArrowDown size={32} />,
    //   gradient: "from-red-400 to-yellow-500",
    // },
    // {
    //   label: "Profit",
    //   value: totalProfit,
    //   icon: <FaArrowUp size={32} />,
    //   gradient: "from-teal-400 to-cyan-500",
    // },
    {
      label: "Total Users",
      value: users.length,
      icon: <FaUsers size={32} />,
      gradient: "from-purple-400 to-pink-500",
    },

    {
      label: "Total Clinics",
      value: clinics.length,
      icon: <FaUsers size={32} />,
      gradient: "from-purple-400 to-pink-500",
    },

    {
      label: "Total Dentists",
      value: dentists.length,
      icon: <FaUsers size={32} />,
      gradient: "from-purple-400 to-pink-500",
    },
    {
      label: "Total Patients",
      value: patients.length,
      icon: <FaUsers size={32} />,
      gradient: "from-purple-400 to-pink-500",
    },

    {
      label: "Diagnostic Labs",
      value: diagnostic.length,
      icon: <FaUsers size={32} />,
      gradient: "from-purple-400 to-pink-500",
    },

    {
      label: "Cbct & Opg Labs",
      value: cbctOpg.length,
      icon: <FaUsers size={32} />,
      gradient: "from-purple-400 to-pink-500",
    },

    {
      label: "Total Enquiries",
      value: contacts.length,
      icon: <FaEnvelopeOpenText size={32} />,
      gradient: "from-orange-400 to-red-500",
    },
    {
      label: "Support and Help",
      value: supports.length,
      icon: <FaEnvelopeOpenText size={32} />,
      gradient: "from-orange-400 to-red-500",
    },
    {
      label: "Total Blogs",
      value: blogs.length,
      icon: <FaFile size={32} />,
      gradient: "from-yellow-400 to-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl p-4 mx-auto sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between mb-8 sm:flex-row sm:items-center">
          <div>
            <Title level={2} className="font-bold text-gray-800">
              Welcome to Admin Panel
            </Title>
            <p className="text-gray-500">
              Here's a snapshot of your business performance.
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Financial Summary Cards (New Section) */}
        <div className="mb-8">
          <FinancialSummaryCards />
        </div>

        {/* Other Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dashboardStats.map(({ label, value, icon, gradient }) => (
              <Card
                key={label}
                className={`relative overflow-hidden rounded-lg shadow-lg border-0 text-white bg-gradient-to-r ${gradient} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{label}</p>
                    <p className="text-3xl font-bold">{millify(value)}</p>
                  </div>
                  <div className="text-4xl opacity-50">{icon}</div>
                </div>
              </Card>
            ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Charts */}
          <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-2">
            <Charts />
          </div>

          {/* Right Column: Notifications and other stats */}
          <div className="space-y-8">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <NotificationsPanel notifications={notifications} />
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}
