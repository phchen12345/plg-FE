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

export type LogisticsV2SelectionRequest = {
  logisticsSubType: string;
  logisticsType?: string;
  isCollection?: "Y" | "N";
  extraData?: string;
  selectionToken?: string;
};

export type LogisticsV2SelectionResponse = {
  isHtml?: boolean;
  html?: string;
  PlatformID?: string;
  MerchantID?: string;
  RqHeader?: { Timestamp?: string };
  TransCode?: number;
  TransMsg?: string;
  Data?: string | Record<string, unknown>;
  ParsedData?: Record<string, unknown>;
  selectionToken?: string;
};

export type LogisticsSelectionResult = {
  store?: {
    storeId: string;
    storeName?: string;
    storeAddress?: string;
    receiverPhone?: string;
    receiverCellPhone?: string;
    logisticsSubType?: string;
    raw?: Record<string, unknown>;
  };
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

export type ShopifyVariant = {
  id: number;
  gid: string;
  title: string;
  sku: string | null;
};

export type EcpayCheckoutResponse = {
  action: string;
  fields: Record<string, string>;
};

export type EcpayCheckoutOrderItem = {
  productId: number;
  quantity: number;
  name?: string;
  priceCents?: number;
  shopifyVariantId?: string | number | null;
};

type SelectedStore = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  logisticsSubType?: string;
};

export type EcpayCheckoutOrderShipping = {
  method: "home" | "familymart" | "seveneleven";
  address?: { city: string; district: string; detail: string };
  store?: SelectedStore | null;
};

export type EcpayCheckoutOrder = {
  items: EcpayCheckoutOrderItem[];
  shipping: EcpayCheckoutOrderShipping;
  totals: { subtotal: number; shippingFee: number; total: number };
};

export type EcpayCheckoutRequest = {
  tradeNo: string;
  totalAmount: string;
  description?: string;
  returnURL?: string;
  order: EcpayCheckoutOrder;
};

const paymentClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  validateStatus: (status) => status >= 200 && status < 400,
});

const extractMessage = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message;
  }
  return err instanceof Error ? err.message : "未知錯誤";
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

export async function requestLogisticsV2Selection(
  payload: LogisticsV2SelectionRequest
): Promise<LogisticsV2SelectionResponse> {
  try {
    const { data } = await paymentClient.post<LogisticsV2SelectionResponse>(
      "/api/logistics-new/selection",
      {
        logisticsSubType: payload.logisticsSubType,
        logisticsType: payload.logisticsType ?? "CVS",
        isCollection: payload.isCollection ?? "N",
        extraData: payload.extraData ?? "",
        selectionToken: payload.selectionToken ?? "",
      }
    );
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export async function fetchLogisticsSelectionResult(
  token: string
): Promise<LogisticsSelectionResult | null> {
  try {
    const { data } = await paymentClient.get<LogisticsSelectionResult>(
      `/api/logistics-new/selection-result/${token}`
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
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

export async function createEcpayCheckout(
  payload: EcpayCheckoutRequest
): Promise<EcpayCheckoutResponse> {
  try {
    const { data } = await paymentClient.post<EcpayCheckoutResponse>(
      "/api/ecpay/checkout",
      payload
    );
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}
