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
import colors from 'tailwindcss/colors';

// Type for our color arrays
type ChartColors = string[];

const LIGHT_COLORS: ChartColors = [
  colors.blue[600],
  colors.emerald[600],
  colors.amber[600],
  colors.rose[600],
  colors.purple[600],
  colors.teal[600],
  colors.red[600],
  colors.indigo[600],
  colors.cyan[600],
  colors.yellow[600],
  colors.violet[600],
  colors.green[600],
];

const DARK_COLORS: ChartColors = [
  colors.blue[400],
  colors.emerald[400],
  colors.amber[400],
  colors.rose[400],
  colors.purple[400],
  colors.teal[400],
  colors.red[400],
  colors.indigo[400],
  colors.cyan[400],
  colors.yellow[400],
  colors.violet[400],
  colors.green[400],
];

export interface ChartProps {
  title: string;
  chartType: 'PieChart' | 'BarChart';
  data: Array<{ name: string; value: number }>;
  fullWidth?: boolean;
}

const Chart: React.FC<ChartProps> = ({ title, chartType, data, fullWidth = false }) => {
  const [currentColors, setCurrentColors] = useState<ChartColors>(LIGHT_COLORS);

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
      backgroundColor: colors.slate[600],
      border: 'none',
      borderRadius: '6px',
    },
    itemStyle: { color: colors.white },
    labelStyle: { color: colors.white },
  };

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={420}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill={colors.slate[400]}
          label
        >
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
        <Tooltip {...tooltipStyle} cursor={{ fill: colors.white, opacity: 0.1 }} />
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
