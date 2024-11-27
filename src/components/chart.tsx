import React, { useState, useEffect } from 'react';
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

// Our color palettes remain the same
const LIGHT_COLORS = [
  '#1e40af', // Blue-800
  '#047857', // Emerald-800
  '#b45309', // Amber-800
  '#be123c', // Rose-800
  '#6b21a8', // Purple-800
  '#0f766e', // Teal-800
  '#9f1239', // Red-800
  '#3730a3', // Indigo-800
  '#115e59', // Cyan-800
  '#854d0e', // Yellow-800
  '#7e22ce', // Violet-800
  '#166534', // Green-800
];

const DARK_COLORS = [
  '#60a5fa', // Blue-400
  '#34d399', // Emerald-400
  '#fcd34d', // Amber-300
  '#fb7185', // Rose-400
  '#c084fc', // Purple-400
  '#2dd4bf', // Teal-400
  '#f87171', // Red-400
  '#818cf8', // Indigo-400
  '#22d3ee', // Cyan-400
  '#facc15', // Yellow-400
  '#a78bfa', // Violet-400
  '#4ade80', // Green-400
];

export interface ChartProps {
  title: string;
  chartType: 'PieChart' | 'BarChart';
  data: Array<{ name: string; value: number }>;
  fullWidth?: boolean;
}

const Chart: React.FC<ChartProps> = ({ title, chartType, data, fullWidth = false }) => {
  // Add state to track the current theme
  const [currentColors, setCurrentColors] = useState(LIGHT_COLORS);

  // Function to check if dark mode is active
  const checkDarkMode = () => document.documentElement.classList.contains('dark');

  // Effect to update colors when theme changes
  useEffect(() => {
    // Initial theme check
    setCurrentColors(checkDarkMode() ? DARK_COLORS : LIGHT_COLORS);

    // Create a MutationObserver to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setCurrentColors(checkDarkMode() ? DARK_COLORS : LIGHT_COLORS);
        }
      });
    });

    // Start observing the document root for class changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Cleanup the observer on component unmount
    return () => observer.disconnect();
  }, []);

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: 'rgb(51, 65, 85)',
      border: 'none',
      borderRadius: '6px',
    },
    itemStyle: { color: '#fff' },
    labelStyle: { color: '#fff' },
  };

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={420}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884D8" label>
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={currentColors[index % currentColors.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend formatter={(value) => <span className="text-slate-700 dark:text-white">{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="dark:stroke-slate-600" />
        <XAxis dataKey="name" stroke="currentColor" tick={{ fill: 'currentColor' }} />
        <YAxis stroke="currentColor" tick={{ fill: 'currentColor' }} />
        <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
        <Legend />
        <Bar dataKey="value">
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={currentColors[index % currentColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className={`chart-container ${fullWidth ? 'w-full' : 'w-4/5'} mx-auto text-slate-700 dark:text-white`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {chartType === 'PieChart' ? renderPieChart() : renderBarChart()}
    </div>
  );
};

export default Chart;
