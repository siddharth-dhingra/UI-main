// import { Typography } from 'antd';

// const { Title, Paragraph } = Typography;

// function DashboardPage() {
//   return (
//     <div>
//       <Title level={3}>Dashboard</Title>
//       <Paragraph>Welcome to the Dashboard. Select Findings from the sidebar to view findings data.</Paragraph>
//     </div>
//   );
// }

// export default DashboardPage;

// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { Row, Col, message, Typography, Spin } from 'antd';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  ResponsiveContainer,
} from 'recharts';

import { fetchToolCounts, fetchStateCounts, fetchSeverityCounts, fetchCvssHistogram } from '../api/dashobardAPI';

const { Title } = Typography;

// Some colors for the charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#ffc658'];

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [toolData, setToolData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [cvssData, setCvssData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [toolCounts, stateCounts, severityCounts, cvssHist] = await Promise.all([
        fetchToolCounts(),
        fetchStateCounts(),
        fetchSeverityCounts(),
        fetchCvssHistogram(),
      ]);

      // Convert the results to arrays that Recharts can use
      // For example, toolCounts = {CODESCAN:10,DEPENDABOT:5} => [{name:"CODESCAN",value:10},...]
      const toolArr = Object.entries(toolCounts).map(([k, v]) => ({ name: k, value: v }));
      const stateArr = Object.entries(stateCounts).map(([k, v]) => ({ name: k, value: v }));
      const severityArr = Object.entries(severityCounts).map(([k, v]) => ({ name: k, value: v }));

      // For CVSS histogram: cvssHist => array of { key: number, count: number }
      // We'll rename "key" => "bucket" for clarity
      // e.g. { bucket: 0, count: 2 }, { bucket: 1, count: 5 }, ...
      const cvssArr = cvssHist.map((item) => ({
        bucket: item.key,
        count: item.count,
      }));

      setToolData(toolArr);
      setStateData(stateArr);
      setSeverityData(severityArr);
      setCvssData(cvssArr);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} style={{ background: '#fff', padding: 16 }}>
          <Title level={5}>Tool-wise Alerts (Pie Chart)</Title>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={toolData} 
                dataKey="value" 
                nameKey="name"
                label 
                outerRadius={100}
              >
                {toolData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Col>

        <Col xs={24} md={12} style={{ background: '#fff', padding: 16 }}>
          <Title level={5}>Alerts per State (Bar Chart)</Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stateData}>
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
          <Title level={5}>Alerts per Severity (Bar Chart)</Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityData}>
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
          <Title level={5}>CVSS Score Distribution (Histogram)</Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cvssData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bucket" name="Score Bucket" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ffc658" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
