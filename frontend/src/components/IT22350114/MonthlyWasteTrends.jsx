import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'; // Ensure to install this library
import "./ChartStyles.css";

const MonthlyWasteTrends = ({ data }) => {
  return (
    <div className="monthly-waste-trends p-4 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Monthly Waste Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
          <XAxis dataKey="month" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip />
          <Legend />
          <Bar dataKey="recyclable" fill="#84cc16" />
          <Bar dataKey="nonRecyclable" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyWasteTrends;
