export interface TicketPayload {
  parentTicket?: string;
  title: string;
  description?: string;
  category: string;
  status?: string;
}

export interface ApiResponse {
  result?: {
    name: string;
    [key: string]: any;
  };
  error?: {
    form?: Record<string, string>;
    message?: string;
  };
}