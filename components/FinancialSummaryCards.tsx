import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getFinancialSummary } from "../services/financialApi";

interface FinancialData {
  currentMonth: {
    revenue: { total: number };
    expenses: { total: number };
    profit: number;
  };
  growth: {
    revenue: number;
    expenses: number;
    profit: number;
  };
}

const FinancialSummaryCards: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    const fetchSummary = async () => {
      const currentDate = new Date();
      const month = (currentDate.getMonth() + 1).toString();
      const year = currentDate.getFullYear().toString();
      setSelectedMonth(month);
      setSelectedYear(year);
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const fetchFinancialData = async () => {
        try {
          const data = await getFinancialSummary(selectedMonth, selectedYear);
          setFinancialData(data);
        } catch (error) {
          console.error("Failed to fetch financial data:", error);
          setFinancialData(null);
        }
      };
      fetchFinancialData();
    }
  }, [selectedMonth, selectedYear]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: new Date(0, i).toLocaleString("en-US", { month: "long" }),
  }));

  const years = Array.from({ length: 5 }, (_, i) => ({
    value: (new Date().getFullYear() - i).toString(),
    label: (new Date().getFullYear() - i).toString(),
  }));

  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? "+" : "";
    const color = growth >= 0 ? "text-green-300" : "text-red-300"; // Adjusted for darker background
    return (
      <span className={color}>
        {`${sign}${growth.toFixed(2)}%`}
      </span>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="flex space-x-2 mb-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Revenue</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-white"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {financialData ? formatCurrency(financialData.currentMonth.revenue.total) : formatCurrency(0)}
          </div>
          <p className="text-xs text-white">
            {financialData ? formatGrowth(financialData.growth.revenue) : "0.00%"} from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-red-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Expenses</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-white"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {financialData ? formatCurrency(financialData.currentMonth.expenses.total) : formatCurrency(0)}
          </div>
          <p className="text-xs text-white">
            {financialData ? formatGrowth(financialData.growth.expenses) : "0.00%"} from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Profit</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-white"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {financialData ? formatCurrency(financialData.currentMonth.profit) : formatCurrency(0)}
          </div>
          <p className="text-xs text-white">
            {financialData ? formatGrowth(financialData.growth.profit) : "0.00%"} from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummaryCards;
