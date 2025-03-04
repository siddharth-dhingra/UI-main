// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useState, useContext } from 'react';
// import { Row, Col, Typography, Table, Tag, Pagination } from 'antd';
// import { useSearchParams } from 'react-router-dom';

// import { fetchAllTickets } from '../api/ticketsAPI';
// import TicketDrawer from '../components/TicketComponents/TicketDrawer';
// import TicketCreateModal from '../components/TicketComponents/TicketCreateModal';
// import { UserContext } from '../context/UserContext';
// import { getColorForTicketStatus } from '../utils/colorUtils';

// const { Title } = Typography;

// function TicketsPage() {
//   const [tickets, setTickets] = useState([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [selectedTicketId, setSelectedTicketId] = useState(null);

//   const [searchParams, setSearchParams] = useSearchParams();
//   const { selectedTenantId } = useContext(UserContext);

//   // Pagination states (frontend uses 1-indexed page number)
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   useEffect(() => {
//     setTickets([]);
//     // On mount or if tenant changes, fetch tickets for page 1
//     if (selectedTenantId) {
//       loadTickets(1, pageSize);
//     }
//   }, [selectedTenantId]);

//   useEffect(() => {
//     // If the URL has ticketId, open the drawer for that ticket
//     const tid = searchParams.get('ticketId');
//     if (tid) {
//       setSelectedTicketId(tid);
//       setDrawerVisible(true);
//     }
//   }, [searchParams]);

// //   useEffect(() => {
// //     const tid = searchParams.get('ticketId');
// //     if (tid) {
// //       // Find the index of the ticket in the tickets array
// //       const index = tickets.findIndex(ticket => ticket.ticketId === tid);
// //       if (index !== -1) {
// //         // Compute which page this ticket should be on
// //         const computedPage = Math.floor(index / pageSize) + 1;
// //         if (computedPage !== page) {
// //           setPage(computedPage);
// //         }
// //       }
// //       setSelectedTicketId(tid);
// //       setDrawerVisible(true);
// //     }
// //   }, [searchParams, tickets, pageSize, page]);

// useEffect(() => {
//     // When the URL contains a ticketId, attempt to open the ticket drawer.
//     // If the ticket is not in the currently loaded page, try traversing pages.
//     const tid = searchParams.get('ticketId');
//     if (!tid) return;
    
//     const ticketOnPage = tickets.find(ticket => ticket.ticketId === tid);
//     if (ticketOnPage) {
//       // Ticket found on the current page—set and show drawer.
//       setSelectedTicketId(tid);
//       setDrawerVisible(true);
//     } else {
//       // Ticket not found on current page. Determine if there are more pages.
//       const maxPage = Math.ceil(totalItems / pageSize);
//       if (page < maxPage) {
//         // Load the next page and let the effect run again.
//         const nextPage = page + 1;
//         setPage(nextPage);
//         loadTickets(nextPage, pageSize);
//       } else {
//         // Reached the last page; if still not found, we can optionally
//         // try an individual fetch here. For now, we still set drawer visible.
//         setSelectedTicketId(tid);
//         setDrawerVisible(true);
//       }
//     }
//   }, [tickets, searchParams, page, totalItems, pageSize]);


//   async function loadTickets(requestedPage, requestedSize) {
//     // Backend API expects a 0-indexed page so subtract 1.
//     const finalPage = requestedPage || page;
//     const finalSize = requestedSize || pageSize;
//     setLoading(true);
//     try {
//       const data = await fetchAllTickets(selectedTenantId, finalPage - 1, finalSize);
//       // Adjust the property names if your backend uses different names (e.g., data.content or data.items)
//       setTickets(data.content || data.items || []);
//       setTotalItems(data.totalElements || data.totalItems || 0);
//       setPage(finalPage);
//       setPageSize(finalSize);
//     } catch (error) {
//       console.error('Error fetching tickets:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function onRowClick(record) {
//     setSelectedTicketId(record.ticketId);
//     setDrawerVisible(true);
//     // Set URL parameter for ticketId
//     setSearchParams((prevParams) => {
//       const newParams = new URLSearchParams(prevParams);
//       newParams.set('ticketId', record.ticketId);
//       return newParams;
//     });
//   }

//   function handleDrawerClose() {
//     setDrawerVisible(false);
//     setSearchParams((prevParams) => {
//       const newParams = new URLSearchParams(prevParams);
//       newParams.delete('ticketId');
//       return newParams;
//     });
//   }

//   // Table columns
//   const columns = [
//     {
//       title: 'Ticket ID',
//       dataIndex: 'ticketId',
//       key: 'ticketId',
//       width: 120,
//     },
//     {
//       title: 'Summary',
//       dataIndex: 'summary',
//       key: 'summary',
//       width: 300,
//     },
//     {
//       title: 'Description',
//       dataIndex: 'issueTypeDescription',
//       key: 'issueTypeDescription',
//       width: 300,
//       render: (text) => {
//         const truncated = text && text.length > 50 ? text.slice(0, 50) + '...' : text;
//         return <span>{truncated}</span>;
//       },
//     },
//     {
//       title: 'Status',
//       dataIndex: 'statusName',
//       key: 'statusName',
//       width: 120,
//       render: (val) => {
//         const color = getColorForTicketStatus(val);
//         return (
//           <Tag style={{ backgroundColor: `${color}1A`, color, fontWeight: 'bold' }}>
//             {val}
//           </Tag>
//         );
//       },
//     },
//   ];

//   return (
//     <div>
//       {/* Header */}
//       <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
//         <Col>
//           <Title level={3} style={{ margin: 0 }}>
//             Tickets
//           </Title>
//         </Col>
//       </Row>

//       {/* Tickets Table */}
//       <Table
//         dataSource={tickets}
//         columns={columns}
//         rowKey="ticketId"
//         loading={loading}
//         pagination={false}
//         scroll={{ y: 600 }}
//         onRow={(record) => ({
//           onClick: () => onRowClick(record),
//         })}
//         style={{ cursor: 'pointer' }}
//       />

//       {/* Pagination */}
//       <Row justify="center" style={{ marginTop: 16 }}>
//         <Pagination
//           current={page}
//           pageSize={pageSize}
//           total={totalItems}
//           onChange={(p, size) => loadTickets(p, size)}
//           showSizeChanger
//           onShowSizeChange={(current, newSize) => loadTickets(1, newSize)}
//         />
//       </Row>

//       {/* Ticket Drawer */}
//       {selectedTicketId && (
//         <TicketDrawer
//           visible={drawerVisible}
//           onClose={handleDrawerClose}
//           ticketId={selectedTicketId}
//         />
//       )}

//       {/* Ticket Create Modal */}
//       {searchParams.get('mode') === 'create' && (
//         <TicketCreateModal
//           visible={true}
//           onClose={() => {
//             searchParams.delete('mode');
//             setSearchParams(searchParams);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// export default TicketsPage;

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from 'react';
import { Row, Col, Typography, Table, Tag, Pagination, Card } from 'antd';
import { useSearchParams } from 'react-router-dom';

import { fetchAllTickets } from '../api/ticketsAPI';
import TicketDrawer from '../components/TicketComponents/TicketDrawer';
import TicketCreateModal from '../components/TicketComponents/TicketCreateModal';
import { UserContext } from '../context/UserContext';
import { getColorForTicketStatus } from '../utils/colorUtils';

const { Title } = Typography;

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedTenantId } = useContext(UserContext);

  // Pagination states (frontend uses 1-indexed page number)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setTickets([]);
    // On mount or if tenant changes, fetch tickets for page 1
    if (selectedTenantId) {
      loadTickets(1, pageSize);
    }
  }, [selectedTenantId]);

  useEffect(() => {
    // When the URL has ticketId, open the drawer for that ticket
    const tid = searchParams.get('ticketId');
    if (tid) {
      setSelectedTicketId(tid);
      setDrawerVisible(true);
    }
  }, [searchParams]);

  useEffect(() => {
    // When URL contains a ticketId, try to find it on the current page.
    // If not found, traverse pages until either the ticket is found or last page is reached.
    const tid = searchParams.get('ticketId');
    if (!tid) return;
    
    const ticketOnPage = tickets.find(ticket => ticket.ticketId === tid);
    if (ticketOnPage) {
      setSelectedTicketId(tid);
      setDrawerVisible(true);
    } else {
      const maxPage = Math.ceil(totalItems / pageSize);
      if (page < maxPage) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadTickets(nextPage, pageSize);
      } else {
        // Optionally, add an individual fetch if not found; here we simply open the drawer.
        setSelectedTicketId(tid);
        setDrawerVisible(true);
      }
    }
  }, [tickets, searchParams, page, totalItems, pageSize]);

  async function loadTickets(requestedPage, requestedSize) {
    // Backend expects a 0-indexed page so subtract 1.
    const finalPage = requestedPage || page;
    const finalSize = requestedSize || pageSize;
    setLoading(true);
    try {
      const data = await fetchAllTickets(selectedTenantId, finalPage - 1, finalSize);
      setTickets(data.content || data.items || []);
      setTotalItems(data.totalElements || data.totalItems || 0);
      setPage(finalPage);
      setPageSize(finalSize);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  function onRowClick(record) {
    setSelectedTicketId(record.ticketId);
    setDrawerVisible(true);
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set('ticketId', record.ticketId);
      return newParams;
    });
  }

  function handleDrawerClose() {
    setDrawerVisible(false);
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.delete('ticketId');
      return newParams;
    });
  }

  const columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketId',
      key: 'ticketId',
      width: 120,
      render: text => <strong>{text}</strong>,
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
      width: 300,
      render: text => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'issueTypeDescription',
      key: 'issueTypeDescription',
      width: 300,
      render: (text) => {
        const truncated = text && text.length > 50 ? text.slice(0, 50) + '...' : text;
        return <span>{truncated}</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 120,
      render: (val) => {
        const color = getColorForTicketStatus(val);
        return (
          <Tag style={{ backgroundColor: `${color}1A`, color, fontWeight: 'bold' }}>
            {val}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '80vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Tickets</Title>
        </Col>
      </Row>
      <Card
        bordered={false}
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          background: 'white',
          padding: '16px'
        }}
      >
        <Table
          dataSource={tickets}
          columns={columns}
          rowKey="ticketId"
          loading={loading}
          pagination={false}
          scroll={{ y: 600 }}
          onRow={(record) => ({
            onClick: () => onRowClick(record),
          })}
          style={{ cursor: 'pointer' }}
        />
        <Row justify="center" style={{ marginTop: 16 }}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={(p, size) => loadTickets(p, size)}
            showSizeChanger
            onShowSizeChange={(current, newSize) => loadTickets(1, newSize)}
          />
        </Row>
      </Card>
      {selectedTicketId && (
        <TicketDrawer
          visible={drawerVisible}
          onClose={handleDrawerClose}
          ticketId={selectedTicketId}
        />
      )}
      {searchParams.get('mode') === 'create' && (
        <TicketCreateModal
          visible={true}
          onClose={() => {
            searchParams.delete('mode');
            setSearchParams(searchParams);
          }}
        />
      )}
    </div>
  );
}

export default TicketsPage;
