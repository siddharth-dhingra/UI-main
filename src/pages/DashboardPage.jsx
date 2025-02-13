/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import { Row, Col, Typography, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';

import ToolSelect from '../components/DashboardComponents/ToolSelect';
import StatsCards from '../components/DashboardComponents/StatsCards';
import ToolPieChart from '../components/DashboardComponents/ToolPieChart';
import StateBarChart from '../components/DashboardComponents/StateBarChart';
import SeverityBarChart from '../components/DashboardComponents/SeverityBarChart';
import CvssLineChart from '../components/DashboardComponents/CvssLineChart';

import { fetchToolCounts, fetchStateCounts, fetchSeverityCounts, fetchCvssHistogram } from '../api/dashobardAPI';
import { fetchFilterData } from '../api/findingsAPI';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { fillMissingStates, fillMissingSeverities } from '../utils/chartUtils';

const { Title } = Typography;
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#ffc658'];

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [toolData, setToolData] = useState([]);
  const [excludedTools, setExcludedTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState("ALL");
  const [stateData, setStateData] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [cvssData, setCvssData] = useState([]);
  const [toolColorMap, setToolColorMap] = useState({});
  const [filterData, setFilterData] = useState({
    toolTypes: [],
    severities: [],
    statuses: [],
  });

  const { selectedTenantId } = useContext(UserContext);

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

  // Load tool counts on mount
  useEffect(() => {
    loadToolCounts();
  }, []);

  // Load dashboard charts when selectedTool or filterData changes.
  useEffect(() => {
    if (filterData.statuses.length > 0 && filterData.severities.length > 0) {
      loadFilteredData(selectedTool);
    }
  }, [selectedTool, filterData, selectedTenantId]);

  async function loadToolCounts() {
    try {
      setLoading(true);
      const data = await fetchToolCounts(selectedTenantId);
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
        fetchStateCounts(selectedTenantId, tool),
        fetchSeverityCounts(selectedTenantId, tool),
        fetchCvssHistogram(selectedTenantId,tool),
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

  function handleStateBarClick(data) {
    if (!data) return;
    const status = data.name;
    const filters = { status };
    if (selectedTool !== 'ALL') filters.toolType = selectedTool;
    navigateToFindings(filters);
  }

  function handleSeverityBarClick(data) {
    if (!data) return;
    const severity = data.name;
    const filters = { severity };
    if (selectedTool !== 'ALL') filters.toolType = selectedTool;
    navigateToFindings(filters);
  }

  function handleCvssLineClick(e) {
    if (!e || !e.activePayload) return;
    const clickedItem = e.activePayload[0].payload;
    const cvssBucket = clickedItem.bucket;
    const filters = { cvssBucket };
    if (selectedTool !== 'ALL') filters.toolType = selectedTool;
    navigateToFindings(filters);
  }

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
      <ToolSelect
        selectedTool={selectedTool}
        onChange={setSelectedTool}
        toolTypes={filterData.toolTypes}
      />
      <StatsCards
        totalAlerts={totalAlerts}
        openAlerts={openAlerts}
        fixedAlerts={fixedAlerts}
        criticalAlerts={criticalAlerts}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} style={{ background: '#fff', padding: 16 }}>
          <Title level={5}>Tool-wise Alerts</Title>
          <ToolPieChart
            data={toolData}
            toolColorMap={toolColorMap}
            excludedTools={excludedTools}
            toggleTool={toggleTool}
            onPieChartClick={handlePieChartClick}
          />
        </Col>
        <Col xs={24} md={12} style={{ background: '#fff', padding: 16 }}>
          <Title level={5}>Alerts per State</Title>
          <StateBarChart data={stateData} onBarClick={handleStateBarClick} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12} style={{ background: '#fff', padding: 16 }}>
          <Title level={5}>Alerts per Severity</Title>
          <SeverityBarChart data={severityData} onBarClick={handleSeverityBarClick} />
        </Col>
        <Col xs={24} md={12} style={{ background: '#fff', padding: 16 }}>
          <Title level={5}>CVSS Score Distribution</Title>
          <CvssLineChart data={cvssData} onLineClick={handleCvssLineClick} />
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
