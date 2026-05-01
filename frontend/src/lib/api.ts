// ported from gbthang - api helper - 2026-04-17
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

type ApiOptions = RequestInit & {
  token?: string | null;
  silent?: boolean; // if true, do not show toast on error
};

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export const api = async <T = unknown>(
  path: string,
  { token, silent, headers, ...rest }: ApiOptions = {}
): Promise<T> => {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await res.json() : null;

    if (!res.ok) {
      const message =
        (data && (data.message as string)) ||
        res.statusText ||
        "Something went wrong";
      const fieldErrors = (data && data.errors) as
        | Record<string, string>
        | undefined;

      if (!silent) toast.error(message);

      throw new ApiError(message, res.status, fieldErrors);
    }

    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const message =
      err instanceof Error ? err.message : "Network error. Please try again.";
    if (!silent) toast.error(message);
    throw new ApiError(message, 0);
  }
};
