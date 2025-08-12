const baseUrl = import.meta.env.VITE_API_BASE_URL;

export interface ApiError {
  message: string;
  status?: number;
}

export async function apiFetch(path: string, options?: RequestInit): Promise<any> {
  const response = await fetch(`${baseUrl}${path}`, options);

  const contentType = response.headers.get('Content-Type');

  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error: ApiError = {
      message: data?.message || data || 'Något gick fel',
      status: response.status,
    };
    throw error;
  }

  return data;
}