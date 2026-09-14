'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { useProducts } from '@/context/ProductContext';

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 999;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products } = useProducts();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<AddedCartItem | null>(null);
  const [isAddedNotificationOpen, setIsAddedNotificationOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('terra_cart');
      if (saved) {
        setItems(JSON.parse(saved));
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

  // Persist to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('terra_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (product: Product, quantity: number = 1) => {
    // Resolve product against latest DB product
    const latestProduct =
      products.find(
        (p) =>
          (p._id && product._id && p._id === product._id) ||
          (p.id && product.id && p.id === product.id) ||
          p.slug === product.slug
      ) || product;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          (item.product._id && latestProduct._id && item.product._id === latestProduct._id) ||
          (item.product.id && latestProduct.id && item.product.id === latestProduct.id) ||
          item.product.slug === latestProduct.slug
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, product: latestProduct, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product: latestProduct, quantity }];
    });
    setLastAddedItem({ product: latestProduct, quantity, timestamp: Date.now() });
    setIsAddedNotificationOpen(true);
    setIsCartOpen(true);
  };

  const matchesId = (product: Product, targetId: string) => {
    return (
      product.id === targetId ||
      product._id === targetId ||
      product.slug === targetId
    );
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
      prev.map((item) =>
        matchesId(item.product, productId) ? { ...item, quantity } : item
      )
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
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

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
