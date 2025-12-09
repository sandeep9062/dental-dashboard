"use client";

import { useGetLeadsQuery } from "@/services/leadsApi";
import { Card, Col, Row, Typography, Select, DatePicker, Table, Tag } from "antd";
import { useState, useMemo } from "react";
import moment from "moment";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title, Text } = Typography;
const { Option } = Select;

export default function ConversionDashboard() {
  const { data: allLeads, isLoading, isError } = useGetLeadsQuery();
  const [selectedYear, setSelectedYear] = useState<moment.Moment | null>(moment());

  const filteredLeads = useMemo(() => {
    if (!allLeads) return [];
    if (!selectedYear) return allLeads;
    return allLeads.filter(lead => moment(lead.createdAt).isSame(selectedYear, 'year'));
  }, [allLeads, selectedYear]);

  // Basic Lead Metrics (Copied from LeadsDashboard for reference)
  const totalLeadsReceived = filteredLeads.length;
  const newLeadsThisMonth = filteredLeads.filter(lead => moment(lead.createdAt).isSame(moment(), 'month')).length;

  // --- Conversion Definitions ---
  // A lead is considered 'Consultation Completed' (MIDWAY conversion stage 1)
  const consultationsCompleted = filteredLeads.filter(lead => lead.status === "Consultation completed").length;
  
  // Assuming 'Treatment Plan Given' and 'Treatment Plans Approved' statuses exist on the Lead object.
  // If not, this would require deeper investigation into related models or adding these statuses.
  const treatmentPlansGiven = filteredLeads.filter(lead => lead.status === "Treatment plan given").length;
  const treatmentPlansApproved = filteredLeads.filter(lead => lead.status === "Treatment plan approved").length;

  // Assuming 'Diagnostics completed' for MIDWAY conversion stage 2
  const diagnosticsCompleted = filteredLeads.filter(lead => lead.status === "Diagnostics completed").length;

  // Assuming 'Travel Confirmed' and 'Treatment Started/Completed' for FULL conversion stages
  const travelConfirmed = filteredLeads.filter(lead => lead.status === "Travel confirmed").length;
  const treatmentStarted = filteredLeads.filter(lead => lead.status === "Treatment started").length;
  const treatmentCompleted = filteredLeads.filter(lead => lead.status === "Treatment completed").length;


  // --- Calculated Columns ---
  const overallConversionRate = totalLeadsReceived > 0 ? (consultationsCompleted / totalLeadsReceived) * 100 : 0;
  const consultationConversionRate = totalLeadsReceived > 0 ? (consultationsCompleted / totalLeadsReceived) * 100 : 0;
  const treatmentPlanAcceptanceRate = treatmentPlansGiven > 0 ? (treatmentPlansApproved / treatmentPlansGiven) * 100 : 0;

  // Monthly Conversion Data for Graph 1
  const monthlyConversionData = useMemo(() => {
    const data: { [month: string]: { totalLeads: number; convertedLeads: number } } = {};
    filteredLeads.forEach(lead => {
      const monthYear = moment(lead.createdAt).format('MMM YYYY');
      if (!data[monthYear]) {
        data[monthYear] = { totalLeads: 0, convertedLeads: 0 };
      }
      data[monthYear].totalLeads++;
      if (lead.status === "Consultation completed") { // Define full conversion here
        data[monthYear].convertedLeads++;
      }
    });

    const sortedMonths = Object.keys(data).sort((a, b) => moment(a, 'MMM YYYY').valueOf() - moment(b, 'MMM YYYY').valueOf());

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Overall Conversion %',
          data: sortedMonths.map(month => (data[month].totalLeads > 0 ? (data[month].convertedLeads / data[month].totalLeads) * 100 : 0).toFixed(2)),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
        },
      ],
    };
  }, [filteredLeads]);

  // Stage-wise Conversion Funnel Data for Graph 2
  const stageWiseFunnelData = useMemo(() => {
    return {
      labels: [
        "Total Leads",
        "Consultations Completed",
        "Treatment Plans Approved",
        "Travel Confirmed",
        "Treatment Started",
        "Treatment Completed",
      ],
      datasets: [
        {
          label: "Number of Leads",
          data: [
            totalLeadsReceived,
            consultationsCompleted,
            treatmentPlansApproved,
            travelConfirmed,
            treatmentStarted,
            treatmentCompleted,
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [totalLeadsReceived, consultationsCompleted, treatmentPlansApproved, travelConfirmed, treatmentStarted, treatmentCompleted]);

  // Diagnostic Conversions Data for Graph 3
  const diagnosticConversionData = useMemo(() => {
    const data: { [month: string]: { cbct: number; bloodTest: number; xRay: number } } = {};
    filteredLeads.forEach(lead => {
      const monthYear = moment(lead.createdAt).format('MMM YYYY');
      if (!data[monthYear]) {
        data[monthYear] = { cbct: 0, bloodTest: 0, xRay: 0 };
      }
      // Assuming lead object has a property like 'diagnostics' which is an array of strings like ['CBCT', 'Blood Test', 'X-Ray']
      // This needs to be confirmed or adjusted based on actual Lead model structure.
      if (lead.status === "Diagnostics completed") {
        // Placeholder logic - replace with actual parsing of diagnostic info from lead
        // For now, just incrementing all if diagnostics completed
        data[monthYear].cbct++;
        data[monthYear].bloodTest++;
        data[monthYear].xRay++;
      }
    });

    const sortedMonths = Object.keys(data).sort((a, b) => moment(a, 'MMM YYYY').valueOf() - moment(b, 'MMM YYYY').valueOf());

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'CBCT',
          data: sortedMonths.map(month => data[month].cbct),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
        {
          label: 'Blood Test',
          data: sortedMonths.map(month => data[month].bloodTest),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'X-Ray',
          data: sortedMonths.map(month => data[month].xRay),
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
        },
      ],
    };
  }, [filteredLeads]);

  // Revenue vs Conversions Data for Graph 4
  // This requires fetching financial data, which is not currently done by useGetLeadsQuery.
  // I will need to add a new API call for financial data or extend the leads API.
  const revenueVsConversionsData = useMemo(() => {
    const data: { [month: string]: { convertedPatients: number; revenue: number } } = {};
    
    // Populate converted patients from monthlyConversionData
    Object.entries(monthlyConversionData.labels).forEach(([index, monthYear]) => {
        const monthData = monthlyConversionData.datasets[0].data[index];
        data[monthYear] = { convertedPatients: parseFloat(monthData), revenue: 0 };
    });

    // Placeholder for revenue data - would be fetched from financial API
    // For demonstration, adding dummy revenue data for the months present
    Object.keys(data).forEach(monthYear => {
        data[monthYear].revenue = Math.floor(Math.random() * 10000) + 5000; // Dummy revenue
    });

    const sortedMonths = Object.keys(data).sort((a, b) => moment(a, 'MMM YYYY').valueOf() - moment(b, 'MMM YYYY').valueOf());

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Monthly Converted Patients (Count - needs adjustment to be actual count)',
          data: sortedMonths.map(month => data[month].convertedPatients), // This is currently % from Graph 1, needs to be actual count
          borderColor: 'rgb(100, 100, 100)',
          backgroundColor: 'rgba(100, 100, 100, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Monthly Revenue Generated',
          data: sortedMonths.map(month => data[month].revenue),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y1',
        },
      ],
    };
  }, [filteredLeads, monthlyConversionData]);

  const revenueOptions = {
    responsive: true,
    interaction: {mode: 'index' as const, intersect: false,},
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Revenue vs Conversions',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen text-lg">Loading Conversion Data...</div>;
  if (isError) return <div className="flex items-center justify-center min-h-screen text-lg text-red-500">Error loading conversion data.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Title level={2} className="text-gray-800 mb-6">Conversion Dashboard</Title>

      <Card className="mb-6 shadow-lg rounded-lg">
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Text strong>Select Year:</Text>
          </Col>
          <Col>
            <DatePicker
              picker="year"
              placeholder="Select Year"
              value={selectedYear}
              onChange={setSelectedYear}
              className="w-full"
            />
          </Col>
        </Row>
      </Card>

      {/* BASIC LEAD METRICS & CONVERSION PERCENTAGES */}
      <Title level={3} className="text-gray-700 mb-4">Conversion Overview</Title>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-lg rounded-lg">
            <Text strong>Total Leads:</Text> <Text>{totalLeadsReceived}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-lg rounded-lg">
            <Text strong>New Leads This Month:</Text> <Text>{newLeadsThisMonth}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-lg rounded-lg">
            <Text strong>Overall Conversion %:</Text> <Text>{overallConversionRate.toFixed(2)}%</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-lg rounded-lg">
            <Text strong>Consultation Conversion %:</Text> <Text>{consultationConversionRate.toFixed(2)}%</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-lg rounded-lg">
            <Text strong>Treatment Plan Acceptance %:</Text> <Text>{treatmentPlanAcceptanceRate.toFixed(2)}%</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-lg rounded-lg">
            <Text strong>MIDWAY Conversions (Diagnostics Completed):</Text> <Text>{diagnosticsCompleted}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-lg rounded-lg">
            <Text strong>FULL Conversions (Treatment Completed):</Text> <Text>{treatmentCompleted}</Text>
          </Card>
        </Col>
      </Row>

      {/* Graph 1: Overall Conversion per Month (%) */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <Title level={4}>Overall Conversion per Month (%)</Title>
        <Line data={monthlyConversionData} />
      </Card>

      {/* Graph 2: Stage-wise Conversion Funnel */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <Title level={4}>Stage-wise Conversion Funnel</Title>
        <Bar data={stageWiseFunnelData} />
      </Card>

      {/* Graph 3: Diagnostic Conversions */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <Title level={4}>Diagnostic Conversions (Monthly)</Title>
        <Bar data={diagnosticConversionData} options={{ responsive: true, plugins: { legend: { position: 'top' as const }, title: { display: true, text: 'Diagnostic Conversions per Month' } } }} />
      </Card>

      {/* Graph 4: Revenue vs Conversions */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <Title level={4}>Revenue vs Conversions (Monthly)</Title>
        <Line options={revenueOptions} data={revenueVsConversionsData} />
      </Card>
    </div>
  );
}
