/* eslint-disable react/prop-types */
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function StateBarChart({ data, onBarClick }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        onClick={(e) => { if (e?.activePayload) onBarClick(e.activePayload[0].payload); }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" interval={0} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StateBarChart;
