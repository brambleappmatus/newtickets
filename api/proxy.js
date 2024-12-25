import { getApiConfig } from './config.js';
import { CORS_HEADERS, handleCors } from './cors.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handleCors(req, res)) return;

  // Set CORS headers for all responses
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const { instanceUrl, accessToken } = getApiConfig(req.headers);
    
    // Build the target URL
    const targetUrl = `https://${instanceUrl}/api/v6/tickets.json`;
    const queryParams = new URLSearchParams({
      _method: 'POST',
      accessToken
    });

    // Make the request to the external API
    const response = await fetch(`${targetUrl}?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.body
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}