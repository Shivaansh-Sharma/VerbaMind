export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const apiRequest = async <T = unknown>(
  endpoint: string,
  method: string = "GET",
  body?: Record<string, unknown>, // ✅ safer than `any`
  auth: boolean = false
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API request failed");
  return data;
};
