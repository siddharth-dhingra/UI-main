// /* eslint-disable no-unused-vars */
// import { useEffect, useState } from 'react';
// import Qs from 'qs';
// import {
//   Row,
//   Col,
//   Select,
//   Button,
//   Table,
//   Drawer,
//   Typography,
//   message,
//   Descriptions,
//   Tag,
//   Pagination,
// } from 'antd';
// import axios from 'axios';

// const { Title, Text, Paragraph } = Typography;

// function getColorForValue(type, value) {
//   const colorMaps = {
//     toolType: {
//       CODESCAN: '#1890ff',
//       DEPENDABOT: '#0099e6',
//       SECRETSCAN: '#722ed1',
//     },
//     status: {
//       OPEN: '#52c41a',
//       CLOSED: '#52c41a',
//       FIXED: '#52c41a',
//       IGNORED: '#d46b08',
//     },
//     severity: {
//       CRITICAL: '#820014',
//       HIGH: '#cf1322',
//       MEDIUM: '#fa8c16',
//       LOW: '#faad14',
//       NOTE: '#8c8c8c',
//     },
//   };

//   const fallbackColor = '#595959';
//   return colorMaps[type]?.[value] || fallbackColor;
// }

// function FindingsPage() {
//   // Filter data
//   const [toolTypes, setToolTypes] = useState([]);
//   const [severities, setSeverities] = useState([]);
//   const [statuses, setStatuses] = useState([]);

//   // Currently selected filters (arrays)
//   const [selectedToolTypes, setSelectedToolTypes] = useState([]);
//   const [selectedSeverities, setSelectedSeverities] = useState([]);
//   const [selectedStatuses, setSelectedStatuses] = useState([]);

//   // Findings data
//   const [findings, setFindings] = useState([]);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [size, setSize] = useState(10);
//   const [hasNextPage, setHasNextPage] = useState(false);

//   // Drawer (modal) state
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [selectedFinding, setSelectedFinding] = useState(null);

//   // "View More" logic for certain descriptions
//   const [descriptionExpanded, setDescriptionExpanded] = useState(false);

//   useEffect(() => {
//     fetchFilterData();
//     fetchFindings(1);
//     // eslint-disable-next-line
//   }, []);

//   // Retrieve filter lists
//   const fetchFilterData = async () => {
//     try {
//       const [toolTypeResp, severityResp, statusResp] = await Promise.all([
//         axios.get('http://localhost:8083/filters/toolTypes'),
//         axios.get('http://localhost:8083/filters/severities'),
//         axios.get('http://localhost:8083/filters/statuses'),
//       ]);
//       setToolTypes(toolTypeResp.data || []);
//       setSeverities(severityResp.data || []);
//       setStatuses(statusResp.data || []);
//     } catch (error) {
//       console.error('Error fetching filter data:', error);
//       message.error('Failed to fetch filter data.');
//     }
//   };

//   // Retrieve findings
//   const fetchFindings = async (requestedPage, requestedSize) => {

//     const finalPage = requestedPage || page;
//     const finalSize = requestedSize || size;

//     try {
//       const params = {
//         page: finalPage,
//         size: finalSize,
//       };

//       if (selectedToolTypes.length > 0) params.toolTypes = selectedToolTypes;
//       if (selectedSeverities.length > 0) params.severities = selectedSeverities;
//       if (selectedStatuses.length > 0) params.statuses = selectedStatuses;

//       const response = await axios.get('http://localhost:8083/alerts/finding/search', {
//         params,
//         paramsSerializer: (p) => Qs.stringify(p, { arrayFormat: 'repeat' }),
//       });

//       const data = response.data || [];
//       setFindings(data);
//       setHasNextPage(data.length === size);
//       setPage(finalPage);
//     } catch (error) {
//       console.error('Error fetching findings:', error);
//       message.error('Failed to fetch findings.');
//     }
//   };

//   // Handle "Apply Filter"
//   const handleApplyFilter = () => {
//     fetchFindings(1);
//   };

//   // The "Scan" button click:
//   const handleScanClick = async () => {
//     try {
//       const requestBody = {
//         owner:"siddharth-dhingra",
//         repo:"juice-shop",
//         types:["ALL"]
//       };
//       const response = await axios.post('http://localhost:8083/alert/scan', requestBody);
//       message.success(response.data || 'Scan event sent successfully.');
//     } catch (error) {
//       console.error('Error initiating scan:', error);
//       message.error('Failed to initiate scan.');
//     }
//   };

//   // Table definition
//   const columns = [
//     {
//       title: 'ID',
//       dataIndex: 'id',
//       key: 'id',
//       width: 60,
//     },
//     {
//       title: 'Title',
//       dataIndex: 'title',
//       key: 'title',
//       width: 180,
//     },
//     {
//       title: 'Severity',
//       dataIndex: 'severity',
//       key: 'severity',
//       width: 100,
//       render: (val) => {
//         const color = getColorForValue('severity', val);
//         return (
//           <Tag style={{ backgroundColor: `${color}1A`, color, fontWeight: 'bold' }}>
//             {val}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       width: 100,
//       render: (val) => {
//         const color = getColorForValue('status', val);
//         return (
//           <Tag style={{ backgroundColor: `${color}1A`, color, fontWeight: 'bold' }}>
//             {val}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: 'Tool Type',
//       dataIndex: 'toolType',
//       key: 'toolType',
//       width: 120,
//       render: (val) => {
//         const color = getColorForValue('toolType', val);
//         return (
//           <Tag style={{ backgroundColor: `${color}1A`, color, fontWeight: 'bold' }}>
//             {val}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: 'Description',
//       dataIndex: 'description',
//       key: 'description',
//       render: (text) => {
//         const truncated = text?.length > 200 ? text.slice(0, 200) + '...' : text;
//         return <span>{truncated}</span>;
//       },
//     },
//   ];

//   // Row-click => show drawer
//   const onRowClick = (record) => {
//     setSelectedFinding(record);
//     setDrawerVisible(true);
//     setDescriptionExpanded(false);
//   };

//   // Ant Design <Pagination> logic
//   const totalItems = hasNextPage ? page * size + 1 : page * size;
//   const handlePaginationChange = (pageNumber) => {
//     fetchFindings(pageNumber);
//   };

//   // Drawer content
//   const renderDrawerContent = () => {
//     if (!selectedFinding) return null;

//     const isDependabot = selectedFinding.toolType === 'DEPENDABOT';
//     const maxLength = 150;
//     const fullDesc = selectedFinding.description || '';
//     const truncatedDesc =
//       fullDesc.length > maxLength ? fullDesc.slice(0, maxLength) + '...' : fullDesc;

//     const finalDescription =
//       isDependabot && !descriptionExpanded ? truncatedDesc : fullDesc;

//     return (
//       <Descriptions column={1} bordered size="middle" style={{ margin: '0 auto' }} labelStyle={{ fontWeight: 'bold', width: '120px' }}>
//         <Descriptions.Item label="ID">{selectedFinding.id}</Descriptions.Item>
//         <Descriptions.Item label="Title">{selectedFinding.title}</Descriptions.Item>
//         <Descriptions.Item label="Severity">
//           <Tag style={{
//             backgroundColor: `${getColorForValue('severity', selectedFinding.severity)}1A`,
//             color: getColorForValue('severity', selectedFinding.severity),
//             fontWeight: 'bold'
//           }}>
//             {selectedFinding.severity}
//           </Tag>
//         </Descriptions.Item>
//         <Descriptions.Item label="Status">
//           <Tag style={{
//             backgroundColor: `${getColorForValue('status', selectedFinding.status)}1A`,
//             color: getColorForValue('status', selectedFinding.status),
//             fontWeight: 'bold'
//           }}>
//             {selectedFinding.status}
//           </Tag>
//         </Descriptions.Item>
//         <Descriptions.Item label="Tool Type">
//           <Tag style={{
//             backgroundColor: `${getColorForValue('toolType', selectedFinding.toolType)}1A`,
//             color: getColorForValue('toolType', selectedFinding.toolType),
//             fontWeight: 'bold'
//           }}>
//             {selectedFinding.toolType}
//           </Tag>
//         </Descriptions.Item>
//         <Descriptions.Item label="Description">
//           <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
//             {finalDescription}
//           </Paragraph>
//           {isDependabot && fullDesc.length > maxLength && !descriptionExpanded && (
//             <Button type="link" onClick={() => setDescriptionExpanded(true)}>
//               View More
//             </Button>
//           )}
//         </Descriptions.Item>
//         <Descriptions.Item label="Location">
//           {selectedFinding.location || 'N/A'}
//         </Descriptions.Item>
//         <Descriptions.Item label="URL">
//           {selectedFinding.url ? (
//             <a href={selectedFinding.url} target="_blank" rel="noreferrer">
//               {selectedFinding.url}
//             </a>
//           ) : (
//             'N/A'
//           )}
//         </Descriptions.Item>
//         <Descriptions.Item label="CWE">
//           {selectedFinding.cwe || 'N/A'}
//         </Descriptions.Item>
//         {/* <Descriptions.Item label="All Data">
//           <pre style={{ background: '#f5f5f5', padding: 8 }}>
//             {JSON.stringify(selectedFinding, null, 2)}
//           </pre>
//         </Descriptions.Item> */}
//       </Descriptions>
//     );
//   };

//   return (
//     <div>
//       {/* Top Row with Title + Scan Button on the right */}
//       <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
//         <Col>
//           <Title level={3} style={{ margin: 0 }}>
//             Findings
//           </Title>
//         </Col>
//         <Col>
//           <Button type="primary" onClick={handleScanClick}>
//             Scan
//           </Button>
//         </Col>
//       </Row>

//       {/* Filter Section (center-aligned) */}
//       <Row justify="center" gutter={[16, 16]} style={{ marginBottom: 16 }}>
//         <Col>
//           <Text>Tool Type: </Text>
//           <Select
//             mode="multiple"
//             style={{ width: 200 }}
//             placeholder="Select ToolType(s)"
//             allowClear
//             value={selectedToolTypes}
//             onChange={setSelectedToolTypes}
//           >
//             {toolTypes.map((type) => (
//               <Select.Option key={type} value={type}>
//                 {type}
//               </Select.Option>
//             ))}
//           </Select>
//         </Col>
//         <Col>
//           <Text>Severity: </Text>
//           <Select
//             mode="multiple"
//             style={{ width: 200 }}
//             placeholder="Select Severity(ies)"
//             allowClear
//             value={selectedSeverities}
//             onChange={setSelectedSeverities}
//           >
//             {severities.map((sev) => (
//               <Select.Option key={sev} value={sev}>
//                 {sev}
//               </Select.Option>
//             ))}
//           </Select>
//         </Col>
//         <Col>
//           <Text>State: </Text>
//           <Select
//             mode="multiple"
//             style={{ width: 200 }}
//             placeholder="Select State(s)"
//             allowClear
//             value={selectedStatuses}
//             onChange={setSelectedStatuses}
//           >
//             {statuses.map((stat) => (
//               <Select.Option key={stat} value={stat}>
//                 {stat}
//               </Select.Option>
//             ))}
//           </Select>
//         </Col>
//         <Col>
//           <Button type="primary" onClick={handleApplyFilter}>
//             Apply Filter
//           </Button>
//         </Col>
//       </Row>

//       {/* Fixed-size table container -> scroll if overflow */}
//       <div style={{ maxHeight: '800px', overflowY: 'auto' }}>
//         <Table
//           columns={columns}
//           dataSource={findings}
//           justifyContent="center"
//           rowKey={(record) => record.id}
//           pagination={false}
//           onRow={(record) => ({ onClick: () => onRowClick(record) })}
//           style={{ cursor: 'pointer' }}
//           locale={{ emptyText: 'No entries found' }}
//         />
//       </div>

//       {/* Prettier pagination */}
//       <Row justify="center" style={{ marginTop: 16 }}>
//         <Pagination
//           current={page}
//           pageSize={size}
//           total={totalItems}
//           showLessItems={false}
//           hideOnSinglePage={false}
//           onChange={handlePaginationChange}
//           showSizeChanger={false}
//           // onChange={(pageNumber) => {
//           //   // keep the same page size (size) but change page
//           //   fetchFindings(pageNumber, size);
//           // }}
//           // // Turn on the size changer
//           // showSizeChanger
//           // // Called when user picks a new "items per page"
//           // onShowSizeChange={(currentPage, newSize) => {
//           //   setPage(1);         // typically reset to the first page
//           //   setSize(newSize);   // update local page-size state
//           //   fetchFindings(1, newSize); // fetch with new size from page 1
//           // }}
//         />
//       </Row>

//       {/* Bigger drawer width */}
//       <Drawer
//         title="Finding Details"
//         placement="right"
//         open={drawerVisible}
//         width={700}
//         onClose={() => setDrawerVisible(false)}
//       >
//         {renderDrawerContent()}
//       </Drawer>
//     </div>
//   );
// }

// export default FindingsPage;

// src/pages/FindingsPage.jsx
import { useEffect, useState } from 'react';
import { Row, Col, Typography, Pagination, message } from 'antd';

import FilterBar from '../components/FilterBar';
import FindingsTable from '../components/FindingsTable';
import FindingDrawer from '../components/FindingDrawer';

import {
  fetchFilterData,
  fetchFindingsAPI,
} from '../api/findingsAPI';

const { Title } = Typography;

function FindingsPage() {
  // Filter data
  const [toolTypes, setToolTypes] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // Selected filters
  const [selectedToolTypes, setSelectedToolTypes] = useState([]);
  const [selectedSeverities, setSelectedSeverities] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Findings data
  const [findings, setFindings] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  // Pagination
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [size, setSize] = useState(10);

  // Drawer state
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState(null);

  // "View More" logic for Dependabot
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [suggestionExpanded, setsuggestionExpanded] = useState(false);

  useEffect(() => {
    loadFilterData();
    loadFindings(1);
    // eslint-disable-next-line
  }, []);

  // Fetch filter lists
  const loadFilterData = async () => {
    try {
      const data = await fetchFilterData();
      setToolTypes(data.toolTypes);
      setSeverities(data.severities);
      setStatuses(data.statuses);
    } catch (error) {
      console.error('Error fetching filter data:', error);
      message.error('Failed to fetch filter data.');
    }
  };

  // Fetch findings
  const loadFindings = async (requestedPage, requestedSize) => {
    const finalPage = requestedPage || page;
    const finalSize = requestedSize || size;

    try {
      const data = await fetchFindingsAPI({
        page: finalPage,
        size: finalSize,
        selectedToolTypes,
        selectedSeverities,
        selectedStatuses,
      });

      setFindings(data.items);
      setTotalItems(data.totalItems)
      setPage(finalPage);
    } catch (error) {
      console.error('Error fetching findings:', error);
      message.error('Failed to fetch findings.');
    }
  };

  // Handle "Apply Filter"
  const handleApplyFilter = () => {
    loadFindings(1);
  };

  // Handle "Scan" button
  // const handleScanClick = async () => {
  //   try {
  //     const respMsg = await initiateScan();
  //     message.success(respMsg || 'Scan event sent successfully.');
  //   } catch (error) {
  //     console.error('Error initiating scan:', error);
  //     message.error('Failed to initiate scan.');
  //   }
  // };

  // Row click => show drawer
  const onRowClick = (record) => {
    setSelectedFinding(record);
    setDrawerVisible(true);
    setDescriptionExpanded(false);
  };

  // Pagination
  // const totalItems = hasNextPage ? page * size + 1 : page * size;
  // console.log(totalItems)
  const handlePaginationChange = (pageNumber) => {
    loadFindings(pageNumber);
  };

  return (
    <div>
      {/* Top row: Title + Scan Button */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Findings
          </Title>
        </Col>
        {/* <Col>
          <Button type="primary" onClick={handleScanClick}>
            Scan
          </Button>
        </Col> */}
      </Row>

      {/* Filter bar */}
      <FilterBar
        toolTypes={toolTypes}
        severities={severities}
        statuses={statuses}
        selectedToolTypes={selectedToolTypes}
        selectedSeverities={selectedSeverities}
        selectedStatuses={selectedStatuses}
        onToolTypesChange={setSelectedToolTypes}
        onSeveritiesChange={setSelectedSeverities}
        onStatusesChange={setSelectedStatuses}
        onApplyFilter={handleApplyFilter}
      />

      {/* Findings table */}
      <FindingsTable
        findings={findings}
        onRowClick={onRowClick}
      />

      {/* Pagination */}
      <Row justify="center" style={{ marginTop: 16 }}>
        <Pagination
          current={page}
          pageSize={size}
          total={totalItems}
          showLessItems={false}
          hideOnSinglePage={false}
          onChange={handlePaginationChange}
          // showSizeChanger={false}
          showSizeChanger
          // Called when user picks a new "items per page"
          onShowSizeChange={(currentPage, newSize) => {
            setPage(1);         // typically reset to the first page
            setSize(newSize);   // update local page-size state
            loadFindings(1, newSize);
          }}
        />
      </Row>

      {/* Drawer */}
      <FindingDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        selectedFinding={selectedFinding}
        descriptionExpanded={descriptionExpanded}
        setDescriptionExpanded={setDescriptionExpanded}
        suggestionExpanded={suggestionExpanded}
        setSuggestionExpanded={setsuggestionExpanded}
      />
    </div>
  );
}

export default FindingsPage;
