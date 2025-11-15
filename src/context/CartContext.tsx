"use client";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import { fetchCartItemCount } from "@/api/cart/cart_api";

type CartState = { itemCount: number };
type CartAction =
  | { type: "SET_COUNT"; payload: number }
  | { type: "INCREMENT"; payload?: number }
  | { type: "DECREMENT"; payload?: number }
  | { type: "RESET" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_COUNT":
      return { itemCount: action.payload };
    case "INCREMENT":
      return { itemCount: state.itemCount + (action.payload ?? 1) };
    case "DECREMENT":
      return {
        itemCount: Math.max(0, state.itemCount - (action.payload ?? 1)),
      };
    case "RESET":
      return { itemCount: 0 };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { itemCount: 0 });

  useEffect(() => {
    fetchCartItemCount()
      .then((count) => dispatch({ type: "SET_COUNT", payload: count }))
      .catch(() => dispatch({ type: "SET_COUNT", payload: 0 }));
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
