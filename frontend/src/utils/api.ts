export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type JsonValue = Record<string, unknown> | null;

export const apiRequest = async <T = unknown>(
  endpoint: string,
  method: string = "GET",
  body?: Record<string, unknown>,
  auth: boolean = false
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    let data: JsonValue = null;

    try {
      data = (await res.json()) as JsonValue;
    } catch {
      data = null;
    }

    if (!res.ok) {
      const msg =
        (data && typeof data === "object" && "error" in data
          ? String(data.error)
          : null) ||
        (data && typeof data === "object" && "message" in data
          ? String(data.message)
          : null) ||
        `API request failed with status ${res.status}`;

      console.error("API error:", endpoint, res.status, data);
      throw new Error(msg);
    }

    return data as T;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "API request failed";
    console.error("Network/API error:", endpoint, message);
    throw new Error(message);
  }
};
