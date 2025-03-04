import axios from 'axios';

const TICKETS_BASE_URL = 'http://localhost:8083/tickets';

/**
 * Fetch all tickets for the given tenantId.
 */
export async function fetchAllTickets(tenantId, page = 0, size = 10) {
  const resp = await axios.get(`${TICKETS_BASE_URL}`, {
    params: { tenantId, page, size },
    withCredentials: true,
  });
  return resp.data; // returns an array of JiraTicketDTO
}

/**
 * Fetch a single ticket by ticketId for the given tenantId.
 */
export async function fetchSingleTicket(tenantId, ticketId) {
  const resp = await axios.get(`${TICKETS_BASE_URL}/single`, {
    params: { tenantId, ticketId },
    withCredentials: true,
  });
  return resp.data; // returns JiraTicketDTO
}

/**
 * Create a ticket for a specific finding.
 * summary + description come from the user (prefilled from the finding).
 */
export async function createTicket(tenantId, findingId, summary, description) {
  const resp = await axios.post(`${TICKETS_BASE_URL}/create`, null, {
    params: { tenantId, findingId, summary, description },
    withCredentials: true,
  });
  return resp.data; // e.g., "Jira ticket created successfully with ID: CRM-11"
}

/**
 * Mark a given ticket as Done.
 */
export async function markTicketDone(tenantId, ticketId) {
  const resp = await axios.post(`${TICKETS_BASE_URL}/done`, null, {
    params: { tenantId, ticketId },
    withCredentials: true,
  });
  return resp.data; // e.g., "Ticket CRM-11 status updated to Done"
}
