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

    // Parse the request body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Ensure required fields are present
    const payload = {
      ...body,
      stage: body.stage || 'OPEN',
      priority: body.priority || 'LOW'
    };

    console.log('Proxy sending payload:', payload); // For debugging

    // Make the request to the external API
    const response = await fetch(`${targetUrl}?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('API response:', data); // For debugging

    // Check for API-specific errors
    if (data.error) {
      return res.status(400).json(data);
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: {
        message: error.message || 'Internal server error'
      }
    });
  }
}