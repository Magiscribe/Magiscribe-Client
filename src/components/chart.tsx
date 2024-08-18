import React from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface ChartData {
  name: string;
  value: number;
}

interface ChartProps {
  title: string;
  chartType: string;
  data: ChartData[];
}

const Chart: React.FC<ChartProps> = ({ title, chartType, data }) => {
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
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
    <div className="chart-container">
      <h3 className="text-center font-bold mb-4">{title}</h3>
      {chartType === 'PieChart' && renderPieChart()}
      {chartType === 'BarChart' && renderBarChart()}
      {chartType === 'Both' && (
        <div className="flex flex-wrap justify-around">
          <div className="w-full md:w-1/2">
            <h5 className="text-lg font-semibold mb-2">Pie Chart</h5>
            {renderPieChart()}
          </div>
          <div className="w-full md:w-1/2">
            <h5 className="text-lg font-semibold mb-2">Bar Chart</h5>
            {renderBarChart()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart;
