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

const MonthlyWasteTrends = ({ data }) => {
  return (
    <div className="p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Monthly Waste Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="recyclable" fill="#4caf50" />
          <Bar dataKey="nonRecyclable" fill="#f44336" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyWasteTrends;
