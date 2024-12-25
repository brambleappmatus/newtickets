import { getApiConfig } from '../config/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function fetchClient(endpoint: string, options: FetchOptions = {}) {
  const config = getApiConfig();
  const { params = {}, ...fetchOptions } = options;

  try {
    const response = await fetch('/api/proxy', {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Settings': JSON.stringify({
          instanceUrl: config.INSTANCE_URL,
          apiKey: config.ACCESS_TOKEN
        }),
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error?.form) {
        const formErrors = Object.entries(errorData.error.form)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        throw new Error(`Validation error: ${formErrors}`);
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}