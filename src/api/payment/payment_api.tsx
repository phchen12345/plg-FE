import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export type LogisticsMapTokenResponse = {
  action: string;
  fields: Record<string, string>;
};

export type LogisticsMapTokenRequest = {
  logisticsSubType: string;
  extraData?: string;
};

export type CreateOrderRequest = {
  items: {
    productId: number;
    quantity: number;
    name?: string;
    priceCents?: number;
  }[];
  shipping: {
    method: "home" | "familymart" | "seveneleven";
    address?: { city: string; district: string; detail: string };
    store?: {
      id: string;
      name: string;
      address: string;
      phone?: string;
      logisticsSubType?: string;
    } | null;
  };
};

export type CreateOrderResponse = { orderId: number; order: unknown };

export type CreateCheckoutRequest = {
  lines: {
    merchandiseId: string;
    quantity: number;
    attributes?: { key: string; value: string }[];
  }[];
  attributes?: { key: string; value: string }[];
  buyerIdentity?: Record<string, unknown>;
  note?: string;
};

export type CreateCheckoutResponse = {
  checkoutUrl: string;
  cartId: string;
};

const paymentClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  validateStatus: (status) => status >= 200 && status < 400,
});

const extractMessage = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return (
      err.response?.data?.message || err.message || "無法取得回應，請稍後重試"
    );
  }
  return err instanceof Error ? err.message : "發生未知錯誤";
};

export async function requestStoreMapToken(
  payload: LogisticsMapTokenRequest
): Promise<LogisticsMapTokenResponse> {
  try {
    const { data } = await paymentClient.post<LogisticsMapTokenResponse>(
      "/api/logistics/map-token",
      {
        logisticsSubType: payload.logisticsSubType,
        extraData: payload.extraData ?? "",
      }
    );
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export async function createCheckoutSession(
  payload: CreateCheckoutRequest
): Promise<CreateCheckoutResponse> {
  try {
    const { data } = await paymentClient.post<CreateCheckoutResponse>(
      "/api/storefront/checkout",
      payload
    );
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export async function createOrder(
  payload: CreateOrderRequest
): Promise<CreateOrderResponse> {
  try {
    const { data } = await paymentClient.post<CreateOrderResponse>(
      "/api/orders/orders",
      payload
    );
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}
