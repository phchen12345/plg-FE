import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export type DialCode = { label: string; value: string };
export type EmailLoginRequest = {
  email: string;
  password: string;
};
export type LoginResponse = { userId: number; expiresIn: string };
export type RegisterRequest = {
  email: string;
  password: string;
  verificationCode: string;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  validateStatus: (status) => status >= 200 && status < 400,
});

const extractMessage = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || "請�?失�?，�?稍�??�試";
  }
  return err instanceof Error ? err.message : "請�?失�?，�?稍�??�試";
};

export async function fetchDialCodes(): Promise<DialCode[]> {
  try {
    const { data } = await apiClient.get<DialCode[]>("/api/dial-codes");
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export async function loginWithEmail(
  request: EmailLoginRequest
): Promise<{ userId: number }> {
  try {
    const { data } = await apiClient.post<{ userId: number }>(
      "/api/auth/login-email",
      request
    );
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export async function sendEmailCode(email: string): Promise<void> {
  try {
    await apiClient.post("/api/auth/send-email-code", { email });
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export async function register(request: RegisterRequest): Promise<void> {
  try {
    await apiClient.post("/api/auth/register-email", request);
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/api/auth/logout");
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export function startGoogleLogin() {
  window.location.href = `${API_BASE_URL}/api/auth/google`;
}
