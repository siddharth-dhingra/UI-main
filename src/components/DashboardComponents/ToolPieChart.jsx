/* eslint-disable react/prop-types */
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#ffc658'];

function ToolPieChart({ data, toolColorMap, excludedTools, toggleTool, onPieChartClick }) {
  // Create legend payload for custom legend rendering
  const legendPayload = data.map((entry, index) => ({
    value: entry.name,
    color: toolColorMap[entry.name] || COLORS[index % COLORS.length],
    payload: entry,
  }));

  const renderPieLegend = ({ payload }) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
      {payload.map((entry) => {
        const toolName = entry.value;
        const isExcluded = excludedTools.includes(toolName);
        const toolColor = toolColorMap[toolName] || entry.color;
        return (
          <div
            key={`legend-${toolName}`}
            onClick={() => toggleTool(toolName)}
            style={{
              cursor: 'pointer',
              textDecoration: isExcluded ? 'line-through' : 'none',
              marginRight: 16,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: toolColor, marginRight: 4 }} />
            {toolName} ({entry.payload.value})
          </div>
        );
      })}
    </div>
  );

  // Filter out excluded tools for display
  const displayedData = data.filter(d => !excludedTools.includes(d.name));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={displayedData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          onClick={onPieChartClick}
          label
        >
          {displayedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={toolColorMap[entry.name] || COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend content={renderPieLegend} payload={legendPayload} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default ToolPieChart;
