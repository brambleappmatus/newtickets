import { fetchClient } from '../utils/fetchClient';
import { TicketPayload, ApiResponse } from '../types/ticket';
import { formatCategoryId } from '../utils/categoryUtils';

export async function createTicket(payload: TicketPayload): Promise<ApiResponse> {
  // Validate required fields
  if (!payload.title?.trim()) {
    throw new Error('Title is required');
  }
  if (!payload.category?.trim()) {
    throw new Error('Category is required');
  }

  // Format the API payload according to requirements
  const apiPayload = {
    title: payload.title.trim(),
    category: formatCategoryId(payload.category),
    stage: 'OPEN',
    priority: 'LOW',
    // Optional fields
    ...(payload.description ? { comment: payload.description } : {}),
    ...(payload.status ? { statuses: [payload.status] } : {}),
    ...(payload.parentTicket ? { parent: payload.parentTicket } : {})
  };

  console.log('Sending ticket payload:', apiPayload); // For debugging

  return fetchClient('/tickets.json', {
    method: 'POST',
    body: JSON.stringify(apiPayload),
  });
}