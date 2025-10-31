import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export function MiniChart({ data, color, height = 40 }: MiniChartProps) {
  const isPositive = data[data.length - 1] >= data[0];
  const chartColor = color || (isPositive ? '#16a34a' : '#dc2626');
  
  const chartData = data.map((value, index) => ({
    index,
    value
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={chartColor}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
