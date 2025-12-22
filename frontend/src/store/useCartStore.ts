import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  flavor?: string;
  filling?: string;
  size?: string;
  isCustomCake: boolean;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any, quantity: number, options?: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

// Generate unique ID for cart items (since same product might have different options)
export const generateCartId = (productId: number, options?: any) => {
  if (!options) return productId.toString();
  return `${productId}-${JSON.stringify(options)}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, options) => {
        const cartId = generateCartId(product.id, options);
        const existingItem = get().items.find((item: any) => item.cartId === cartId);

        if (existingItem) {
          set({
            items: get().items.map((item: any) =>
              item.cartId === cartId
                ? { ...item, quantity: Math.min(10, item.quantity + quantity) }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                cartId,
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: Math.min(10, quantity),
                isCustomCake: product.is_custom_cake,
                ...options,
              },
            ],
          });
        }
      },
      removeItem: (cartId) => {
        set({
          items: get().items.filter((item: any) => item.cartId !== cartId),
        });
      },
      updateQuantity: (cartId, quantity) => {
        set({
          items: get().items.map((item: any) =>
            item.cartId === cartId ? { ...item, quantity: Math.min(10, Math.max(1, quantity)) } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'natalie-bakery-cart',
    }
  )
);
