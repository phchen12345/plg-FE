import axios from "axios";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export async function fetchCurrentUser() {
  const { data } = await axios.get(`${API_BASE_URL}/api/auth/me`, {
    withCredentials: true,
  });
  return data; // { userId, phoneCode, phone }
}
