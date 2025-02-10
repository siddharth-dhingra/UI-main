/* eslint-disable react/prop-types */
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function CvssLineChart({ data, onLineClick }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} onClick={onLineClick}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="bucket" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#ff7300" name="Count" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default CvssLineChart;
