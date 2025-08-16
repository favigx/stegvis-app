const baseUrl = import.meta.env.VITE_API_BASE_URL;

export interface ApiError {
  message: string;
  status?: number;
}

export async function apiFetch(input: RequestInfo, init?: RequestInit) {
    const url = typeof input === "string" ? `${baseUrl}${input}` : input;

    const defaultInit: RequestInit = {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...init?.headers,
        },
        ...init,
    };

    const response = await fetch(url, defaultInit);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Något gick fel" }));
        throw new Error(error.message);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}
