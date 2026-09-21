'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '@/types';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';

export interface AddedCartItem {
  product: Product;
  quantity: number;
  timestamp: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  freeShippingProgress: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  lastAddedItem: AddedCartItem | null;
  isAddedNotificationOpen: boolean;
  closeAddedNotification: () => void;
  openAddedNotification: (product: Product, quantity?: number) => void;
  appliedCoupon: string | null;
  discountAmount: number;
  applyCoupon: (code: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 0;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products } = useProducts();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<AddedCartItem | null>(null);
  const [isAddedNotificationOpen, setIsAddedNotificationOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuth();
  const hasSyncedOnce = useRef(false);
  const [dbSyncComplete, setDbSyncComplete] = useState(false);

  // Reset sync state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      hasSyncedOnce.current = false;
      setDbSyncComplete(false);
    }
  }, [isAuthenticated]);

  // Helper to match IDs
  const matchesId = (product: Product, targetId: string) => {
    return (
      product.id === targetId ||
      product._id === targetId ||
      product.slug === targetId
    );
  };

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('terra_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem('terra_coupon');
      if (savedCoupon) {
        setAppliedCoupon(savedCoupon);
      }
    } catch (e) {
      console.error('Failed to parse cart from local storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Synchronize cart items with dynamic DB products whenever products or cart items change
  useEffect(() => {
    if (isLoaded && products.length > 0) {
      setItems((prevItems) => {
        let hasChanges = false;
        const updatedItems = prevItems.map((item) => {
          const matchedDbProduct = products.find(
            (p) =>
              (p._id && item.product._id && p._id === item.product._id) ||
              (p.id && item.product.id && p.id === item.product.id) ||
              p.slug === item.product.slug
          );

          if (matchedDbProduct) {
            // Check if price, compareAtPrice, or image changed
            if (
              item.product.price !== matchedDbProduct.price ||
              item.product.compareAtPrice !== matchedDbProduct.compareAtPrice ||
              item.product.featuredImage !== matchedDbProduct.featuredImage ||
              item.product.name !== matchedDbProduct.name
            ) {
              hasChanges = true;
              return {
                ...item,
                product: {
                  ...item.product,
                  ...matchedDbProduct,
                },
              };
            }
          }
          return item;
        });

        return hasChanges ? updatedItems : prevItems;
      });
    }
  }, [products, isLoaded]);

  // Sync DB cart on login
  useEffect(() => {
    if (isAuthenticated && isLoaded && products.length > 0 && !hasSyncedOnce.current) {
      hasSyncedOnce.current = true;
      fetch('/api/user/cart')
        .then((res) => (res.ok ? res.json() : { cart: [] }))
        .then((data) => {
          if (data.cart && Array.isArray(data.cart) && data.cart.length > 0) {
            setItems((prevItems) => {
              const merged = [...prevItems];
              let hasChanges = false;
              
              data.cart.forEach((dbItem: any) => {
                const existingIndex = merged.findIndex((i) => matchesId(i.product, dbItem.productId));
                if (existingIndex > -1) {
                  // Merge: take the max quantity to preserve guest items safely
                  if (merged[existingIndex].quantity < dbItem.quantity) {
                    merged[existingIndex].quantity = dbItem.quantity;
                    hasChanges = true;
                  }
                } else {
                  // Add from DB
                  const p = products.find((prod) => matchesId(prod, dbItem.productId));
                  if (p) {
                    merged.push({ product: p, quantity: dbItem.quantity });
                    hasChanges = true;
                  }
                }
              });
              return hasChanges ? merged : prevItems;
            });
          }
        })
        .catch((err) => console.error('Failed to fetch initial DB cart', err))
        .finally(() => {
          setDbSyncComplete(true);
        });
    }
  }, [isAuthenticated, isLoaded, products.length]);

  // Persist to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('terra_cart', JSON.stringify(items));
      if (appliedCoupon) {
        localStorage.setItem('terra_coupon', appliedCoupon);
      } else {
        localStorage.removeItem('terra_coupon');
      }
    }
  }, [items, appliedCoupon, isLoaded]);

  // Sync to DB
  useEffect(() => {
    if (isLoaded && isAuthenticated && dbSyncComplete) {
      const payload = items.map((i) => ({
        productId: i.product._id || i.product.id || i.product.slug,
        quantity: i.quantity,
      }));

      fetch('/api/user/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: payload }),
      }).catch((err) => console.error('Failed to sync cart to DB', err));
    }
  }, [items, isLoaded, isAuthenticated, dbSyncComplete]);

  const addItem = (product: Product, quantity: number = 1) => {
    // Resolve product against latest DB product
    const latestProduct =
      products.find(
        (p) =>
          (p._id && product._id && p._id === product._id) ||
          (p.id && product.id && p.id === product.id) ||
          p.slug === product.slug
      ) || product;

    let finalQuantity = quantity;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          (item.product._id && latestProduct._id && item.product._id === latestProduct._id) ||
          (item.product.id && latestProduct.id && item.product.id === latestProduct.id) ||
          item.product.slug === latestProduct.slug
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) => {
          if (idx === existingIndex) {
            let newQuantity = item.quantity + quantity;
            if (latestProduct.stock !== undefined && newQuantity > latestProduct.stock) {
              newQuantity = latestProduct.stock;
              finalQuantity = Math.max(0, newQuantity - item.quantity);
            }
            return { ...item, product: latestProduct, quantity: newQuantity };
          }
          return item;
        });
      }
      
      if (latestProduct.stock !== undefined && quantity > latestProduct.stock) {
        finalQuantity = latestProduct.stock;
      }
      
      // If stock is 0, don't add
      if (latestProduct.stock === 0) {
        return prev;
      }

      return [...prev, { product: latestProduct, quantity: finalQuantity }];
    });

    if (latestProduct.stock !== 0 && finalQuantity > 0) {
      setLastAddedItem({ product: latestProduct, quantity: finalQuantity, timestamp: Date.now() });
      setIsAddedNotificationOpen(true);
      setIsCartOpen(true);
    }
  };



  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => !matchesId(item.product, productId)));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (matchesId(item.product, productId)) {
          let newQuantity = quantity;
          if (item.product.stock !== undefined && newQuantity > item.product.stock) {
            newQuantity = item.product.stock;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    FREE_SHIPPING_THRESHOLD === 0 ? 100 : (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  const applyCoupon = async (code: string, email?: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, email })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.code);
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid coupon code.' };
    } catch (e) {
      return { success: false, error: 'Failed to validate coupon.' };
    }
  };

  const removeCoupon = () => setAppliedCoupon(null);

  let discountAmount = 0;
  if (appliedCoupon === 'WELCOME10') {
    discountAmount = Math.round(subtotal * 0.1);
  }
  discountAmount = Math.min(discountAmount, subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        remainingForFreeShipping,
        freeShippingProgress,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        lastAddedItem,
        isAddedNotificationOpen,
        closeAddedNotification: () => setIsAddedNotificationOpen(false),
        openAddedNotification: (product: Product, quantity: number = 1) => {
          setLastAddedItem({ product, quantity, timestamp: Date.now() });
          setIsAddedNotificationOpen(true);
        },
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
