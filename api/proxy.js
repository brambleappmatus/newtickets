// Serverless function to proxy API requests
module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).end();
  }

  try {
    const settings = JSON.parse(req.headers['x-api-settings'] || '{}');
    const instanceUrl = settings.instanceUrl || 'mstanotest.daktela.com';
    const accessToken = settings.apiKey || 'ffc90793e8738b0e648da603985c5f334cc4caf5';

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
    return res.status(500).json({ error: 'Internal server error' });
  }
};