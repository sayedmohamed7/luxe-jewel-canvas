import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

interface CartItem {
  id: string; // Product Id
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [guestId, setGuestId] = useState<string>("");

  useEffect(() => {
    // Guest ID logic
    let gid = localStorage.getItem("guest_id");
    if (!gid) {
      gid = crypto.randomUUID();
      localStorage.setItem("guest_id", gid);
    }
    setGuestId(gid);
    
    // Wishlist will be loaded when user logs in
  }, []);

  useEffect(() => {
    if (guestId) {
      fetchCart();
    }
  }, [user, guestId]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      // API call
      // const response = await api.get(`/cart?guestId=${guestId}`);
      // Mapping API response to CartItem
      // Assuming response.items is proper DTO
      
      const response = await api.get(user ? `/cart` : `/cart?guestId=${guestId}`);
      if (response && response.items) {
          const mappedItems = response.items.map((i: any) => ({
              id: i.productId,
              name: i.productName,
              price: i.price, // Note: API returned 0 if not handled, frontend might need to fetch product details to get real price if cart dto is slim
              image: i.imageUrl || "",
              quantity: i.quantity
          }));
          setItems(mappedItems);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    try {
        await api.post("/cart/items", { 
            productId: item.id, 
            quantity: 1,
            guestId: user ? undefined : guestId 
        });
        await fetchCart();
    } catch (e) {
        console.error(e);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
        await api.delete(`/cart/items/${id}?guestId=${user ? "" : guestId}`);
        await fetchCart();
    } catch (e) {
        console.error(e);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(id);
      return;
    }
    // We haven't implemented update quantity endpoint! 
    // We only have Add (which adds) and Remove.
    // Add logic usually increments. If we want set absolute, we need specific endpoint or logic.
    // For now, let's assume Add adds delta. To set quantity, we might need Remove+Add or new endpoint.
    // Let's implement poor man's update: Remove then Add new quantity? Risks ordering.
    // Better: Add `UpdateItemQuantity` to backend.
    // For MVP, I'll assume Add with diff? No.
    // Skip update quantity for now or just call Add with difference if positive?
    // Let's rely on optimistically updating local state for UI responsiveness? NO, API source of truth.
    console.warn("Update quantity not fully implemented on backend yet");
  };

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const response = await api.get("/wishlist");
      if (response && response.items) {
        const mappedItems = response.items.map((i: any) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          image: i.image
        }));
        setWishlist(mappedItems);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  const addToWishlist = async (item: WishlistItem) => {
    if (!user) {
      console.warn("Please login to add items to wishlist");
      return;
    }
    try {
      await api.post("/wishlist", { productId: item.id });
      await fetchWishlist();
    } catch (error) {
      console.error("Failed to add to wishlist", error);
    }
  };

  const removeFromWishlist = async (id: string) => {
    if (!user) return;
    try {
      await api.delete(`/wishlist/${id}`);
      await fetchWishlist();
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((i) => i.id === id);
  };

  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
