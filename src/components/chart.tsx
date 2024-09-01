import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from 'recharts';

export interface ChartProps {
  title: string;
  chartType: 'pie' | 'bar';
  data: Array<{ name: string; value: number }>;
  fullWidth?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Chart: React.FC<ChartProps> = ({ title, chartType, data, fullWidth = false }) => {
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={420}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value">
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className={`chart-container ${fullWidth ? 'w-full' : 'w-4/5'} mx-auto`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {chartType === 'pie' ? renderPieChart() : renderBarChart()}
    </div>
  );
};

export default Chart;
