import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export type OrderItem = {
  id: number;
  title: string;
  quantity: number;
  price: string;
  sku?: string | null;
};

export type OrderSummary = {
  id: number;
  name: string;
  number: number;
  createdAt: string;
  financialStatus: string;
  fulfillmentStatus: string | null;
  currency: string;
  totalPrice: string;
  subtotalPrice: string;
  lineItems: OrderItem[];
  shippingMethod?: "home" | "familymart" | "seveneleven" | string | null;
  merchantTradeNo?: string;
  tags?: string | null;
};

export type PrintWaybillRequest = {
  logisticsId?: string;
  merchantTradeNo?: string;
  preview?: boolean;
};

export type PrintWaybillResponse = {
  action: string;
  fields: Record<string, string>;
};

const orderClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  validateStatus: (status) => status >= 200 && status < 400,
});

const extractMessage = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return (
      err.response?.data?.message ||
      err.message ||
      "無法取得訂單資訊，請稍後再試"
    );
  }
  return err instanceof Error ? err.message : "無法取得訂單資訊，請稍後再試";
};

export async function fetchOrders(limit = 10): Promise<OrderSummary[]> {
  try {
    const { data } = await orderClient.get<{ orders: OrderSummary[] }>(
      "/api/orders/orders",
      { params: { limit } }
    );
    return data.orders;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export async function requestFamiWaybillPrint(
  payload: PrintWaybillRequest
): Promise<PrintWaybillResponse> {
  try {
    const { data } = await orderClient.post<PrintWaybillResponse>(
      "/api/logistics/fami/print-waybill",
      payload
    );
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export async function requestSevenWaybillPrint(
  payload: PrintWaybillRequest
): Promise<PrintWaybillResponse> {
  try {
    const { data } = await orderClient.post<PrintWaybillResponse>(
      "/api/logistics/seven/print-waybill",
      payload
    );
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}
