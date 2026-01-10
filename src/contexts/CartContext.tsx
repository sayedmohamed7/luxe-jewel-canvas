import { useState, createContext, useContext, ReactNode, useEffect, useCallback, useRef } from "react";
import { cartApi, wishlistApi, getApiErrorMessage } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  nameAr?: string;
  price: number;
  priceUSD?: number;
  image: string;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  nameAr?: string;
  price: number;
  priceUSD?: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  wishlist: WishlistItem[];
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
  syncWithBackend: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage keys
const CART_STORAGE_KEY = "lebijou_cart";
const WISHLIST_STORAGE_KEY = "lebijou_wishlist";
const GUEST_ID_KEY = "guest_id";

function getLocalCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function getLocalWishlist(): WishlistItem[] {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalWishlist(items: WishlistItem[]) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

function getGuestId(): string {
  let gid = localStorage.getItem(GUEST_ID_KEY);
  if (!gid) {
    gid = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, gid);
  }
  return gid;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => getLocalCart());
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => getLocalWishlist());
  const [isLoading, setIsLoading] = useState(false);
  const [guestId] = useState<string>(() => getGuestId());
  const { toast } = useToast();
  const pendingOpsRef = useRef<Map<string, AbortController>>(new Map());

  // Sync with localStorage on changes
  useEffect(() => {
    setLocalCart(items);
  }, [items]);

  useEffect(() => {
    setLocalWishlist(wishlist);
  }, [wishlist]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => !!user || !!localStorage.getItem("jwt_token"), [user]);

  // Sync with backend when user logs in
  useEffect(() => {
    if (user) {
      syncWithBackend();
    }
  }, [user]);

  // Sync with backend when authenticated
  const syncWithBackend = useCallback(async () => {
    if (!isAuthenticated()) return;

    setIsLoading(true);
    try {
      // Sync cart
      const backendCart = await cartApi.get();
      if (backendCart && Array.isArray(backendCart)) {
        const mappedCart: CartItem[] = backendCart.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.product?.name || "",
          nameAr: item.product?.nameAr,
          price: item.product?.prices?.find(p => p.currencyCode === "AED")?.amount || 0,
          priceUSD: item.product?.prices?.find(p => p.currencyCode === "USD")?.amount,
          image: item.product?.images?.find(i => i.isPrimary)?.url || item.product?.images?.[0]?.url || "",
          quantity: item.quantity,
        }));
        setItems(mappedCart);
      }

      // Sync wishlist
      const backendWishlist = await wishlistApi.get();
      if (backendWishlist && Array.isArray(backendWishlist)) {
        const mappedWishlist: WishlistItem[] = backendWishlist.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.product?.name || "",
          nameAr: item.product?.nameAr,
          price: item.product?.prices?.find(p => p.currencyCode === "AED")?.amount || 0,
          priceUSD: item.product?.prices?.find(p => p.currencyCode === "USD")?.amount,
          image: item.product?.images?.find(i => i.isPrimary)?.url || item.product?.images?.[0]?.url || "",
        }));
        setWishlist(mappedWishlist);
      }
    } catch (error) {
      console.error("Failed to sync with backend:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Optimistic add to cart
  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    // Optimistic update
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    // Sync with backend if authenticated
    if (isAuthenticated()) {
      const opId = `add-${item.productId}-${Date.now()}`;
      const controller = new AbortController();
      pendingOpsRef.current.set(opId, controller);

      cartApi.addItem(item.productId, 1)
        .then((response) => {
          // Update with real backend ID
          if (response) {
            setItems((prev) =>
              prev.map((i) =>
                i.productId === item.productId ? { ...i, id: response.id } : i
              )
            );
          }
        })
        .catch((error) => {
          // Rollback on failure
          console.error("Failed to add to cart:", error);
          setItems((prev) => {
            const existing = prev.find((i) => i.productId === item.productId);
            if (existing && existing.quantity === 1) {
              return prev.filter((i) => i.productId !== item.productId);
            }
            return prev.map((i) =>
              i.productId === item.productId ? { ...i, quantity: i.quantity - 1 } : i
            );
          });
          toast({
            title: "Error",
            description: getApiErrorMessage(error),
            variant: "destructive",
          });
        })
        .finally(() => {
          pendingOpsRef.current.delete(opId);
        });
    }
  }, [toast, isAuthenticated]);

  // Optimistic remove from cart
  const removeFromCart = useCallback((id: string) => {
    const removedItem = items.find((i) => i.id === id || i.productId === id);
    
    // Optimistic update
    setItems((prev) => prev.filter((i) => i.id !== id && i.productId !== id));

    // Sync with backend if authenticated
    if (isAuthenticated() && removedItem) {
      cartApi.removeItem(removedItem.id).catch((error) => {
        // Rollback on failure
        console.error("Failed to remove from cart:", error);
        if (removedItem) {
          setItems((prev) => [...prev, removedItem]);
        }
        toast({
          title: "Error",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      });
    }
  }, [items, toast, isAuthenticated]);

  // Optimistic quantity update
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    const previousItem = items.find((i) => i.id === id || i.productId === id);
    const previousQuantity = previousItem?.quantity || 1;

    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === id || i.productId === id ? { ...i, quantity } : i))
    );

    // Sync with backend if authenticated
    if (isAuthenticated() && previousItem) {
      cartApi.updateItem(previousItem.id, quantity).catch((error) => {
        // Rollback on failure
        console.error("Failed to update quantity:", error);
        setItems((prev) =>
          prev.map((i) => (i.id === id || i.productId === id ? { ...i, quantity: previousQuantity } : i))
        );
        toast({
          title: "Error",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      });
    }
  }, [items, removeFromCart, toast, isAuthenticated]);

  // Optimistic add to wishlist
  const addToWishlist = useCallback((item: WishlistItem) => {
    // Check if user is logged in for wishlist
    if (!isAuthenticated()) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    // Check if already in wishlist
    if (wishlist.some((i) => i.productId === item.productId)) return;

    // Optimistic update
    setWishlist((prev) => [...prev, item]);

    // Sync with backend if authenticated
    wishlistApi.addItem(item.productId)
      .then((response) => {
        // Update with real backend ID
        if (response) {
          setWishlist((prev) =>
            prev.map((i) =>
              i.productId === item.productId ? { ...i, id: response.id } : i
            )
          );
        }
      })
      .catch((error) => {
        // Rollback on failure
        console.error("Failed to add to wishlist:", error);
        setWishlist((prev) => prev.filter((i) => i.productId !== item.productId));
        toast({
          title: "Error",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      });
  }, [wishlist, toast, isAuthenticated]);

  // Optimistic remove from wishlist
  const removeFromWishlist = useCallback((productId: string) => {
    const removedItem = wishlist.find((i) => i.productId === productId);
    
    // Optimistic update
    setWishlist((prev) => prev.filter((i) => i.productId !== productId));

    // Sync with backend if authenticated
    if (isAuthenticated() && removedItem) {
      wishlistApi.removeItem(productId).catch((error) => {
        // Rollback on failure
        console.error("Failed to remove from wishlist:", error);
        if (removedItem) {
          setWishlist((prev) => [...prev, removedItem]);
        }
        toast({
          title: "Error",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      });
    }
  }, [wishlist, toast, isAuthenticated]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some((i) => i.productId === productId);
  }, [wishlist]);

  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
        syncWithBackend,
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
