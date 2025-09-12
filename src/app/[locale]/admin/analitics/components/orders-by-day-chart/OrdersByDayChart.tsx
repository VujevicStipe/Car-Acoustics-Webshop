"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface OrdersAnalyticsChartProps {
  orders: Order[];
}

export default function OrdersByDayChart({
  orders,
}: OrdersAnalyticsChartProps) {
  const ordersByDay: Record<string, { count: number; revenue: number }> = {};
  orders.forEach((order) => {
    const day = new Date(order.createdAt).toLocaleDateString("hr-HR"); // dd.mm.yyyy
    if (!ordersByDay[day]) ordersByDay[day] = { count: 0, revenue: 0 };
    ordersByDay[day].count += 1;
    ordersByDay[day].revenue += order.finalPrice;
  });

  const ordersByDayData = Object.entries(ordersByDay)
    .map(([date, { count, revenue }]) => ({
      date,
      count,
      revenue,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={ordersByDayData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" allowDecimals={false} />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
          strokeWidth={2}
          name="Narudžbe"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          stroke="#82ca9d"
          strokeWidth={2}
          name="Prihod (€)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
