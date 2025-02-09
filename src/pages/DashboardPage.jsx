/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Row, Col, message, Typography, Spin, Select, Card } from 'antd';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line,
  ResponsiveContainer
} from 'recharts';

import {
  fetchToolCounts,
  fetchStateCounts,
  fetchSeverityCounts,
  fetchCvssHistogram
} from '../api/dashobardAPI';
import { fetchFilterData } from '../api/findingsAPI';  // Import filter API

import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#ffc658'];

/* 
  Update helper functions to accept dynamic lists instead 
  of relying on hardcoded arrays.
*/
function fillMissingStates(stateCounts, allStates) {
  return allStates.map(st => ({
    name: st,
    value: stateCounts[st] || 0,
  }));
}

function fillMissingSeverities(sevCounts, allSeverities) {
  return allSeverities.map(sv => ({
    name: sv,
    value: sevCounts[sv] || 0,
  }));
}

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [toolData, setToolData] = useState([]);
  const [excludedTools, setExcludedTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState("ALL");

  const [stateData, setStateData] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [cvssData, setCvssData] = useState([]);
  const [toolColorMap, setToolColorMap] = useState({});

  // New state to hold filter options fetched from the findings API.
  const [filterData, setFilterData] = useState({
    toolTypes: [],
    severities: [],
    statuses: [],
  });

  const navigate = useNavigate();

  // Load filter options on mount
  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const data = await fetchFilterData();
        setFilterData(data);
      } catch (error) {
        console.error("Error fetching filter options", error);
        message.error("Failed to load filter options");
      }
    }
    loadFilterOptions();
  }, []);

  // Load tool counts
  useEffect(() => {
    loadToolCounts(); 
  }, []);

  // Load dashboard charts (state, severity, CVSS) when selectedTool or filterData changes.
  useEffect(() => {
    // Ensure that filterData has been loaded before trying to fill missing values
    if (filterData.statuses.length > 0 && filterData.severities.length > 0) {
      loadFilteredData(selectedTool); 
    }
  }, [selectedTool, filterData]);

  async function loadToolCounts() {
    try {
      setLoading(true);
      const data = await fetchToolCounts(); 
      const arr = Object.entries(data).map(([k, v]) => ({ name: k, value: v }));
      setToolData(arr);
      const colorMap = {};
      arr.forEach((tool, index) => {
        colorMap[tool.name] = COLORS[index % COLORS.length];
      });
      setToolColorMap(colorMap);
    } catch (error) {
      console.error("Error fetching tool counts", error);
      message.error("Failed to load tool counts");
    } finally {
      setLoading(false);
    }
  }

  async function loadFilteredData(tool) {
    try {
      setLoading(true);
      const [rawStates, rawSeverities, rawCvss] = await Promise.all([
        fetchStateCounts(tool),
        fetchSeverityCounts(tool),
        fetchCvssHistogram(tool),
      ]);
      const filledStates = fillMissingStates(rawStates, filterData.statuses);
      const filledSeverities = fillMissingSeverities(rawSeverities, filterData.severities);
      const cvssArr = rawCvss.map(item => ({
        bucket: item.key,
        count: item.count,
      }));
      setStateData(filledStates);
      setSeverityData(filledSeverities);
      setCvssData(cvssArr);
    } catch (error) {
      console.error('Error fetching filtered data', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  const totalAlerts = stateData.reduce((sum, s) => sum + s.value, 0);
  const openAlerts = stateData.find(s => s.name === "OPEN")?.value || 0;
  const fixedAlerts = stateData.find(s => s.name === "FIXED")?.value || 0;
  const criticalAlerts = severityData.find(s => s.name === "CRITICAL")?.value || 0;

  const displayedPieData = toolData.filter(d => !excludedTools.includes(d.name));

  function toggleTool(toolName) {
    if (excludedTools.includes(toolName)) {
      setExcludedTools(excludedTools.filter(t => t !== toolName));
    } else {
      setExcludedTools([...excludedTools, toolName]);
    }
  }

  function navigateToFindings(filters) {
    const searchParams = new URLSearchParams(filters);
    navigate(`/findings?${searchParams.toString()}`);
  }

  function handlePieChartClick(data) {
    if (!data) return;
    const toolName = data.name;
    navigateToFindings({ toolType: toolName });
  }

  /** Drill down on State Bar Chart: filter by state (and current tool if set). */
  function handleStateBarClick(data) {
    if (!data) return;
    const status = data.name;
    const filters = { status };
    if (selectedTool !== 'ALL') filters.toolType = selectedTool;
    navigateToFindings(filters);
  }

  /** Drill down on Severity Bar Chart: filter by severity (and current tool if set). */
  function handleSeverityBarClick(data) {
    if (!data) return;
    const severity = data.name;
    const filters = { severity };
    if (selectedTool !== 'ALL') filters.toolType = selectedTool;
    navigateToFindings(filters);
  }

  /** Drill down on CVSS Line Chart: filter by a CVSS bucket (and current tool if set). */
  function handleCvssLineClick(e) {
    if (!e || !e.activePayload) return;
    const clickedItem = e.activePayload[0].payload;
    const cvssBucket = clickedItem.bucket;
    const filters = { cvssBucket };
    if (selectedTool !== 'ALL') filters.toolType = selectedTool;
    navigateToFindings(filters);
  }

  function renderPieLegend({ payload }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
        {payload.map((entry) => {
          const toolName = entry.value;
          const isExcluded = excludedTools.includes(toolName);
          // Get the color from our computed toolColorMap
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
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  backgroundColor: toolColor,
                  marginRight: 4,
                }}
              />
              {toolName} ({entry.payload.value})
            </div>
          );
        })}
      </div>
    );
  }

  const legendPayload = toolData.map((entry, index) => ({
    value: entry.name,
    color: toolColorMap[entry.name] || COLORS[index % COLORS.length],
    payload: entry,
  }));

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={3}>Dashboard</Title>

      <Row style={{ marginBottom: 16 }}>
         <Col>
           <span style={{ marginRight: 8 }}>Select Tool:</span>
           <Select
            value={selectedTool}
            onChange={setSelectedTool}
            style={{ width: 200 }}
          >
            {/* Always include an option to view "ALL" */}
            <Option value="ALL">ALL</Option>
            {/* Build options dynamically from the fetched filter data */}
            {filterData.toolTypes.map(tool => (
              <Option key={tool} value={tool}>{tool}</Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} md={6}>
          <Card 
            title="Total Alerts" 
            style={{ textAlign: 'center', background: '#fafafa' }}
            headStyle={{ background:'#fafafa' }}
          >
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>{totalAlerts}</Title>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card 
            title="Open Alerts" 
            style={{ textAlign: 'center', background: '#fafafa' }}
            headStyle={{ background:'#fafafa' }}
          >
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>{openAlerts}</Title>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card 
            title="Fixed Alerts"
            style={{ textAlign: 'center', background: '#fafafa' }}
            headStyle={{ background:'#fafafa' }}
          >
            <Title level={4} style={{ margin: 0, color: '#faad14' }}>{fixedAlerts}</Title>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card 
            title="Critical Alerts"
            style={{ textAlign: 'center', background: '#fafafa' }}
            headStyle={{ background:'#fafafa' }}
          >
            <Title level={4} style={{ margin: 0, color: '#f5222d' }}>{criticalAlerts}</Title>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} style={{ background: '#fff', padding: 16 }}>
          <Title level={5}>Tool-wise Alerts</Title>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={displayedPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                onClick={(data, index) => handlePieChartClick(data, index)}
                label
              >
                {displayedPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={toolColorMap[entry.name] || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend content={renderPieLegend} payload={legendPayload} />
            </PieChart>
          </ResponsiveContainer>
        </Col>

        <Col xs={24} md={12} style={{ background: '#fff', padding: 16 }}>
          <Title level={5}>Alerts per State</Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={stateData}
              onClick={(e) => { if(e?.activePayload) handleStateBarClick(e.activePayload[0].payload); }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12} style={{ background: '#fff', padding: 16 }}>
          <Title level={5}>Alerts per Severity</Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={severityData}
              onClick={(e) => { if(e?.activePayload) handleSeverityBarClick(e.activePayload[0].payload); }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Col>

        <Col xs={24} md={12} style={{ background: '#fff', padding: 16 }}>
          <Title level={5}>CVSS Score Distribution</Title>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cvssData} onClick={handleCvssLineClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bucket" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#ff7300" name="Count" />
            </LineChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
