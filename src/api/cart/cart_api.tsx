import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export type AddCartRequest = {
  productId: number;
  quantity: number;
};

export type CartItem = {
  productId: number;
  quantity: number;
  name?: string;
  priceCents?: number;
  imageUrl?: string | null;
  tag?: string | null;
  shopifyVariantId?: number | null;
};

export type AddCartResponse = {
  message: string;
  cart: CartItem[];
};

export type GetCartResponse = {
  cart: CartItem[];
};

const cartClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  validateStatus: (status) => status >= 200 && status < 400,
});

const extractMessage = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || "請求失敗，請稍後再試";
  }
  return err instanceof Error ? err.message : "請求失敗，請稍後再試";
};

export async function addToCart(
  payload: AddCartRequest
): Promise<AddCartResponse> {
  try {
    const { data } = await cartClient.post<AddCartResponse>(
      "/api/cart/items",
      payload
    );
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export async function fetchCart(): Promise<GetCartResponse> {
  try {
    const { data } = await cartClient.get<GetCartResponse>("/api/cart/items");
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export async function removeFromCart(
  productId: number
): Promise<AddCartResponse> {
  try {
    const { data } = await cartClient.delete<AddCartResponse>(
      `/api/cart/items/${productId}`
    );
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

// 取得購物車商品數量

export async function fetchCartItemCount(): Promise<number> {
  try {
    const { data } = await cartClient.get<{ count: number }>(
      "/api/cart/items/count"
    );
    return data.count;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}
