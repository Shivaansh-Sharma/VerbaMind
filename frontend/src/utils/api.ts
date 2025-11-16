export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // no JSON body
    }

    if (!res.ok) {
      const msg =
        data?.error ||
        data?.message ||
        `API request failed with status ${res.status}`;
      console.error("API error:", endpoint, res.status, data);
      throw new Error(msg);
    }

    return data as T;
  } catch (err: any) {
    console.error("Network/API error:", endpoint, err);
    throw new Error(err?.message || "API request failed");
  }
};
