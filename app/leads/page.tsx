"use client";

import { useGetLeadsQuery } from "@/services/leadsApi";
import { Lead } from "@/types/leads";
import { Card, Col, Row, Typography, Select, DatePicker, Table, Tag } from "antd";
import { useState, useMemo } from "react";
import moment from "moment"; // For date manipulation
import { FaUsers, FaArrowUp, FaCalendarPlus, FaChartLine, FaHourglassHalf } from "react-icons/fa";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function LeadsDashboard() {
  const { data: allLeads, isLoading, isError } = useGetLeadsQuery();
  const [selectedMonth, setSelectedMonth] = useState<moment.Moment | null>(moment());
  const [selectedLeadType, setSelectedLeadType] = useState<string | undefined>(undefined);
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [selectedProblem, setSelectedProblem] = useState<string | undefined>(undefined);

  const leadTypes = Array.from(new Set(allLeads?.map(lead => lead.leadType)));
  const sources = Array.from(new Set(allLeads?.map(lead => lead.source)));
  const statuses = Array.from(new Set(allLeads?.map(lead => lead.status)));
  const states = Array.from(new Set(allLeads?.map(lead => lead.state).filter(Boolean))) as string[];
  const problems = Array.from(new Set(allLeads?.map(lead => lead.problem).filter(Boolean))) as string[];


  const filteredLeads = useMemo(() => {
    let leads = allLeads || [];

    // Filter by month
    if (selectedMonth) {
      leads = leads.filter(lead => moment(lead.createdAt).isSame(selectedMonth, 'month'));
    }

    // Filter by Lead Type
    if (selectedLeadType) {
      leads = leads.filter(lead => lead.leadType === selectedLeadType);
    }

    // Filter by Source
    if (selectedSource) {
      leads = leads.filter(lead => lead.source === selectedSource);
    }

    // Filter by Status
    if (selectedStatus) {
      leads = leads.filter(lead => lead.status === selectedStatus);
    }

    // Filter by State (for Patient Treatment and Fix My Teeth leads)
    if (selectedState) {
      leads = leads.filter(lead => lead.state === selectedState);
    }

    // Filter by Problem (for Patient Treatment and Fix My Teeth leads)
    if (selectedProblem) {
      leads = leads.filter(lead => lead.problem === selectedProblem);
    }

    return leads;
  }, [allLeads, selectedMonth, selectedLeadType, selectedSource, selectedStatus, selectedState, selectedProblem]);

  // --- Total Leads Overview ---
  const totalLeadsReceived = (allLeads || []).length;
  const newLeadsToday = (allLeads || []).filter(lead => moment(lead.createdAt).isSame(moment(), 'day')).length;
  const newLeadsThisMonth = (allLeads || []).filter(lead => moment(lead.createdAt).isSame(moment(), 'month')).length;

  const convertedLeads = (allLeads || []).filter(lead => lead.status === "Consultation completed").length; // Assuming "Consultation completed" implies conversion
  const conversionRate = totalLeadsReceived > 0 ? (convertedLeads / totalLeadsReceived) * 100 : 0;
  const pendingLeads = (allLeads || []).filter(lead => lead.status === "New" || lead.status === "Contacted" || lead.status === "Scheduled" || lead.status === "Follow-up required").length;

  const dashboardStats = [
    {
      label: "Total Leads Received",
      value: totalLeadsReceived,
      icon: <FaUsers size={32} />,
      gradient: "from-purple-400 to-pink-500",
    },
    {
      label: "New Leads Today",
      value: newLeadsToday,
      icon: <FaCalendarPlus size={32} />,
      gradient: "from-green-400 to-blue-500",
    },
    {
      label: "New Leads This Month",
      value: newLeadsThisMonth,
      icon: <FaCalendarPlus size={32} />,
      gradient: "from-yellow-400 to-amber-500",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate.toFixed(2)}%`,
      icon: <FaChartLine size={32} />,
      gradient: "from-teal-400 to-cyan-500",
    },
    {
      label: "Pending Leads",
      value: pendingLeads,
      icon: <FaHourglassHalf size={32} />,
      gradient: "from-red-400 to-orange-500",
    },
  ];

  // --- Lead Categories (Month wise) ---
  const leadsByCategoryAndMonth = useMemo(() => {
    const categories: { [key: string]: { [month: string]: number } } = {};
    (allLeads || []).forEach(lead => {
      const monthYear = moment(lead.createdAt).format('YYYY-MM');
      if (!categories[lead.leadType]) {
        categories[lead.leadType] = {};
      }
      categories[lead.leadType][monthYear] = (categories[lead.leadType][monthYear] || 0) + 1;
    });
    return categories;
  }, [allLeads]);

  // --- Lead Source Breakdown ---
  const leadSourceBreakdown = useMemo(() => {
    const sources: { [key: string]: number } = {};
    (allLeads || []).forEach(lead => {
      sources[lead.source] = (sources[lead.source] || 0) + 1;
    });
    return sources;
  }, [allLeads]);

  if (isLoading) return <div className="flex items-center justify-center min-h-screen text-lg">Loading Leads...</div>;
  if (isError) return <div className="flex items-center justify-center min-h-screen text-lg text-red-500">Error loading leads.</div>;

  // --- Status Tracking for Every Lead ---
  const leadStatusColumns = [
    {
      title: 'Lead ID',
      dataIndex: '_id',
      key: '_id',
      render: (text: string) => text.substring(0, 8) + '...',
    },
    {
      title: 'Type',
      dataIndex: 'leadType',
      key: 'leadType',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => text || 'N/A',
    },
    { 
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Problem',
      dataIndex: 'problem',
      key: 'problem',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={
        status === "New" ? "blue" :
        status === "Contacted" ? "geekblue" :
        status === "Scheduled" ? "purple" :
        status === "Diagnostics completed" ? "cyan" :
        status === "Consultation completed" ? "green" :
        status === "Lost / No response" ? "red" :
        "orange"
      }>{status}</Tag>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Title level={2} className="text-gray-800 mb-6">Leads Dashboard</Title>

      {/* Filters */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <DatePicker
              picker="month"
              placeholder="Select Month"
              value={selectedMonth}
              onChange={setSelectedMonth}
              className="w-full"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by Lead Type"
              allowClear
              onChange={setSelectedLeadType}
              value={selectedLeadType}
              className="w-full"
            >
              {leadTypes.map(type => <Option key={type} value={type}>{type}</Option>)}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by Source"
              allowClear
              onChange={setSelectedSource}
              value={selectedSource}
              className="w-full"
            >
              {sources.map(source => <Option key={source} value={source}>{source}</Option>)}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by Status"
              allowClear
              onChange={setSelectedStatus}
              value={selectedStatus}
              className="w-full"
            >
              {statuses.map(status => <Option key={status} value={status}>{status}</Option>)}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by State"
              allowClear
              onChange={setSelectedState}
              value={selectedState}
              className="w-full"
            >
              {states.map(state => <Option key={state} value={state}>{state}</Option>)}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by Problem"
              allowClear
              onChange={setSelectedProblem}
              value={selectedProblem}
              className="w-full"
            >
              {problems.map(problem => <Option key={problem} value={problem}>{problem}</Option>)}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Total Leads Overview */}
      <Title level={3} className="text-gray-700 mb-4">Total Leads Overview</Title>
      <Row gutter={[16, 16]} className="mb-6">
        {dashboardStats.map(({ label, value, icon, gradient }) => (
          <Col key={label} xs={24} sm={12} md={8} lg={5}>
            <Card
              className={`relative overflow-hidden rounded-lg shadow-lg border-0 text-white bg-gradient-to-r ${gradient} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{label}</p>
                  <p className="text-3xl font-bold">{value}</p>
                </div>
                <div className="text-4xl opacity-50">{icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Lead Categories */}
      <Title level={3} className="text-gray-700 mb-4">Lead Categories (Month-wise)</Title>
      <Card className="mb-6 shadow-lg rounded-lg">
        {Object.entries(leadsByCategoryAndMonth).map(([leadType, monthlyData]) => (
          <div key={leadType} className="mb-4">
            <Title level={4} className="text-gray-600">{leadType}</Title>
            <Row gutter={[16, 16]}>
              {Object.entries(monthlyData)
                .sort(([monthA], [monthB]) => moment(monthB).valueOf() - moment(monthA).valueOf())
                .map(([month, count]) => (
                  <Col key={month} xs={24} sm={12} md={8} lg={6}>
                    <Card size="small" className="bg-gray-100 shadow-sm">
                      <Text strong>{moment(month).format('MMMM YYYY')}:</Text> <Text>{count} leads</Text>
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>
        ))}
      </Card>

      {/* Lead Source Breakdown */}
      <Title level={3} className="text-gray-700 mb-4">Lead Source Breakdown</Title>
      <Card className="mb-6 shadow-lg rounded-lg">
        <Row gutter={[16, 16]}>
          {Object.entries(leadSourceBreakdown).map(([source, count]) => (
            <Col key={source} xs={24} sm={12} md={8} lg={6}>
              <Card size="small" className="bg-gray-100 shadow-sm">
                <Text strong>{source}:</Text> <Text>{count} leads</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Status Tracking for Every Lead */}
      <Title level={3} className="text-gray-700 mb-4">All Leads Tracking</Title>
      <Card className="shadow-lg rounded-lg">
        <Table
          dataSource={filteredLeads}
          columns={leadStatusColumns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
}
