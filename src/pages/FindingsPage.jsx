import { useEffect, useState } from 'react';
import { Row, Col, Typography, Pagination, message } from 'antd';

import FilterBar from '../components/FilterBar';
import FindingsTable from '../components/FindingsTable';
import FindingDrawer from '../components/FindingDrawer';
import AlertUpdateDrawer from '../components/AlertUpdateDrawer';

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

  // Drawer state for "Edit"
  const [updateDrawerVisible, setUpdateDrawerVisible] = useState(false);
  const [editFinding, setEditFinding] = useState(null);

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
      message.error('Findings not available.');
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

  // "Edit" click => open "Edit" drawer
  const onEditClick = (record) => {
    setEditFinding(record);
    setUpdateDrawerVisible(true);
  };

  // When user finishes editing, refresh table
  const handleEditSuccess = () => {
    // Option 1: Reload from server
    loadFindings(page, size);
    // Option 2: You could do local state update if you want, but re-fetch ensures accuracy
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
        onEditClick={onEditClick}
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

      {/* EDIT Drawer */}
      <AlertUpdateDrawer
        visible={updateDrawerVisible}
        onClose={() => setUpdateDrawerVisible(false)}
        finding={editFinding}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

export default FindingsPage;
