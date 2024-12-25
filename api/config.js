// API configuration
export const DEFAULT_INSTANCE = 'mstanotest.daktela.com';
export const DEFAULT_TOKEN = 'ffc90793e8738b0e648da603985c5f334cc4caf5';

export function getApiConfig(headers) {
  try {
    const settings = JSON.parse(headers['x-api-settings'] || '{}');
    return {
      instanceUrl: settings.instanceUrl || DEFAULT_INSTANCE,
      accessToken: settings.apiKey || DEFAULT_TOKEN
    };
  } catch (error) {
    return {
      instanceUrl: DEFAULT_INSTANCE,
      accessToken: DEFAULT_TOKEN
    };
  }
}