/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from 'react';
import { Row, Col, Typography, Pagination, message } from 'antd';
import { useSearchParams } from 'react-router-dom';

import FilterBar from '../components/FindingComponents/FilterBar';
import FindingsTable from '../components/FindingComponents/FindingsTable';
import FindingDrawer from '../components/FindingComponents/FindingDrawer';
import AlertUpdateDrawer from '../components/FindingComponents/AlertUpdateDrawer';

import { fetchFilterData, fetchFindingsAPI } from '../api/findingsAPI';
import { UserContext } from '../context/UserContext';

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
  const [size, setSize] = useState(10);

  // Drawer state
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState(null);

  // "View More" logic for Dependabot
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [suggestionExpanded, setSuggestionExpanded] = useState(false);

  // Drawer state for "Edit"
  const [updateDrawerVisible, setUpdateDrawerVisible] = useState(false);
  const [editFinding, setEditFinding] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // Get the current user from context
  const { user } = useContext(UserContext);
  // Only SUPER_ADMIN can edit
  const canEdit = user && user.role === 'SUPER_ADMIN';
  console.log(canEdit)

  useEffect(() => {
    loadFilterData();
    loadFindings(1);
  }, []);

  useEffect(() => {
    const toolTypesParam = searchParams.getAll('toolType'); // e.g. ?toolType=CODESCAN&toolType=DEPENDABOT
    const severitiesParam = searchParams.getAll('severity');
    const statusesParam = searchParams.getAll('status');

    setSelectedToolTypes(toolTypesParam);
    setSelectedSeverities(severitiesParam);
    setSelectedStatuses(statusesParam);
  }, [searchParams]);

  useEffect(() => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      // Remove old filter parameters so we don't accumulate duplicates
      newParams.delete('toolType');
      newParams.delete('severity');
      newParams.delete('status');
      // Append the new filter values
      selectedToolTypes.forEach((tool) => newParams.append('toolType', tool));
      selectedSeverities.forEach((sev) => newParams.append('severity', sev));
      selectedStatuses.forEach((status) => newParams.append('status', status));
      return newParams;
    });
    loadFindings();
  }, [selectedToolTypes, selectedSeverities, selectedStatuses]);

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
      setTotalItems(data.totalItems);
      setPage(finalPage);
    } catch (error) {
      console.error('Error fetching findings:', error);
      message.error('Findings not available.');
    }
  };

  // Row click => show drawer and add findingId to URL
  const onRowClick = (record) => {
    setSelectedFinding(record);
    setDrawerVisible(true);
    setDescriptionExpanded(false);
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set('findingId', record.id);
      return newParams;
    });
  };

  function onDrawerClose() {
    setDrawerVisible(false);
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.delete('findingId');
      return newParams;
    });
  }

  useEffect(() => {
    const fid = searchParams.get('findingId');
    if (fid && findings.length > 0) {
      const found = findings.find(f => f.id === fid);
      if (found) {
        setSelectedFinding(found);
        setDrawerVisible(true);
      }
    }
  }, [findings, searchParams]);

  // "Edit" click => open "Edit" drawer (only if user can edit)
  const onEditClick = (record) => {
    setEditFinding(record);
    setUpdateDrawerVisible(true);
  };

  // When user finishes editing, refresh table
  const handleEditSuccess = () => {
    loadFindings(page, size);
  };

  // Pagination
  const handlePaginationChange = (pageNumber) => {
    loadFindings(pageNumber);
  };

  return (
    <div>
      {/* Top row: Title */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Findings
          </Title>
        </Col>
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
      />

      {/* Findings table */}
      <FindingsTable
        findings={findings}
        onRowClick={onRowClick}
        onEditClick={canEdit ? onEditClick : undefined} 
        canEdit={canEdit}
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
          showSizeChanger
          onShowSizeChange={(currentPage, newSize) => {
            setPage(1);
            setSize(newSize);
            loadFindings(1, newSize);
          }}
        />
      </Row>

      {/* Drawer for viewing */}
      <FindingDrawer
        visible={drawerVisible}
        onClose={onDrawerClose}
        selectedFinding={selectedFinding}
        descriptionExpanded={descriptionExpanded}
        setDescriptionExpanded={setDescriptionExpanded}
        suggestionExpanded={suggestionExpanded}
        setSuggestionExpanded={setSuggestionExpanded}
      />

      {/* EDIT Drawer */}
      {canEdit && <AlertUpdateDrawer
        visible={updateDrawerVisible}
        onClose={() => setUpdateDrawerVisible(false)}
        finding={editFinding}
        onSuccess={handleEditSuccess}
      />}
    </div>
  );
}

export default FindingsPage;
