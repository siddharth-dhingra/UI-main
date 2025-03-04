// /* eslint-disable react/prop-types */
// import { Drawer, Button, message, Descriptions } from 'antd';
// import { useEffect, useState, useContext } from 'react';
// import { fetchSingleTicket, markTicketDone } from '../../api/ticketsAPI';
// import { UserContext } from '../../context/UserContext';

// /**
//  * Props:
//  *  - visible (bool)
//  *  - onClose (fn)
//  *  - ticketId (string) => used to fetch the ticket details
//  */
// function TicketDrawer({ visible, onClose, ticketId }) {
//   const [ticket, setTicket] = useState(null);
//   const { selectedTenantId } = useContext(UserContext);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (visible && ticketId) {
//       loadTicketDetails(ticketId);
//     }
//   }, [visible, ticketId]);

//   async function loadTicketDetails(tid) {
//     setLoading(true);
//     try {
//       const data = await fetchSingleTicket(selectedTenantId, tid);
//       setTicket(data);
//       console.log(data)
//     } catch (err) {
//       console.error('Error fetching ticket:', err);
//       message.error('Could not fetch ticket details.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleMarkDone() {
//     if (!ticketId) return;
//     setLoading(true);
//     try {
//       await markTicketDone(selectedTenantId, ticketId);
//       message.success(`Ticket ${ticketId} marked as Done`);
//       // Optionally refetch or just update local state:
//       if (ticket) {
//         setTicket({ ...ticket, statusName: 'Done' });
//       }
//     } catch (err) {
//       console.error('Error marking ticket done:', err);
//       message.error('Could not mark ticket as done.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleViewFinding() {
//     // If you stored the finding ID in your TenantTicket or somewhere in the ticket object,
//     // let's assume you saved it as "ticket.findingId"
//     if (!ticket || !ticket.findingId) return;
//     const fid = ticket.findingId;
//     // navigate to /findings?findingId=...
//     window.location.href = `/findings?findingId=${fid}`;
//   }

//   return (
//     <Drawer
//       title={`Ticket Details - ${ticketId}`}
//       placement="right"
//       open={visible}
//       width={600}
//       onClose={onClose}
//     >
//       {loading && <div>Loading...</div>}
//       {!loading && ticket && (
//         <Descriptions column={1} bordered>
//           <Descriptions.Item label="Ticket ID">{ticket.ticketId}</Descriptions.Item>
//           <Descriptions.Item label="Issue Type">{ticket.issueTypeName}</Descriptions.Item>
//           <Descriptions.Item label="Summary">{ticket.summary}</Descriptions.Item>
//           <Descriptions.Item label="Description">{ticket.issueTypeDescription}</Descriptions.Item>
//           <Descriptions.Item label="Status">{ticket.statusName}</Descriptions.Item>
//         </Descriptions>
//       )}

//       <div style={{ marginTop: 16 }}>
//         {/* <Button
//           type="primary"
//           onClick={handleMarkDone}
//           disabled={ticket?.statusName === 'Done'}
//           style={{ marginRight: 8 }}
//         >
//           Mark as Done
//         </Button> */}

//         <Button onClick={handleViewFinding} disabled={!ticket?.findingId}>
//           View Finding
//         </Button>
//       </div>
//     </Drawer>
//   );
// }

// export default TicketDrawer;

import { Drawer, Button, message, Descriptions, Divider, Tag } from 'antd';
import { useEffect, useState, useContext } from 'react';
import { fetchSingleTicket, markTicketDone } from '../../api/ticketsAPI';
import { UserContext } from '../../context/UserContext';
import { getColorForTicketStatus } from '../../utils/colorUtils';

function TicketDrawer({ visible, onClose, ticketId }) {
  const [ticket, setTicket] = useState(null);
  const { selectedTenantId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && ticketId) {
      loadTicketDetails(ticketId);
    }
  }, [visible, ticketId]);

  async function loadTicketDetails(tid) {
    setLoading(true);
    try {
      const data = await fetchSingleTicket(selectedTenantId, tid);
      setTicket(data);
    } catch (err) {
      console.error('Error fetching ticket:', err);
      message.error('Could not fetch ticket details.');
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkDone() {
    if (!ticketId) return;
    setLoading(true);
    try {
      await markTicketDone(selectedTenantId, ticketId);
      message.success(`Ticket ${ticketId} marked as Done`);
      if (ticket) {
        setTicket({ ...ticket, statusName: 'Done' });
      }
    } catch (err) {
      console.error('Error marking ticket done:', err);
      message.error('Could not mark ticket as done.');
    } finally {
      setLoading(false);
    }
  }

  function handleViewFinding() {
    if (!ticket || !ticket.findingId) return;
    window.location.href = `/findings?findingId=${ticket.findingId}`;
  }

  return (
    <Drawer
      title={`Ticket Details - ${ticketId}`}
      placement="right"
      open={visible}
      width={600}
      onClose={onClose}
      bodyStyle={{ padding: '24px' }}
    >
      {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>}
      {!loading && ticket && (
        <>
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Ticket ID">
              <strong>{ticket.ticketId}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Issue Type">
              <Tag
                style={{
                  backgroundColor: `${getColorForTicketStatus(ticket.issueTypeName)}1A`,
                  color: getColorForTicketStatus(ticket.issueTypeName),
                  fontWeight: 'bold',
                }}
              >
                {ticket.issueTypeName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Summary">{ticket.summary}</Descriptions.Item>
            <Descriptions.Item label="Description">{ticket.issueTypeDescription}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                style={{
                  backgroundColor: `${getColorForTicketStatus(ticket.statusName)}1A`,
                  color: getColorForTicketStatus(ticket.statusName),
                  fontWeight: 'bold',
                }}
              >
                {ticket.statusName}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'flex-begin', marginTop: 16 }}>
            <Button type='primary' onClick={handleViewFinding} disabled={!ticket.findingId} style={{ marginRight: 8 }}>
              View Finding
            </Button>
            <Button type='dashed' onClick={onClose}>Close</Button>
          </div>
        </>
      )}
    </Drawer>
  );
}

export default TicketDrawer;

