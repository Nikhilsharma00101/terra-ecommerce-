'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/types';
import { products as initialFallbackProducts } from '@/data/products';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  getProductBySlug: (slug: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const PRODUCTS_UPDATED_EVENT = 'terra_products_updated';

export const ProductProvider: React.FC<{ children: React.ReactNode; initialProducts?: Product[] }> = ({ children, initialProducts }) => {
  const hasServerProducts = !!(initialProducts && initialProducts.length > 0);
  const [products, setProducts] = useState<Product[]>(
    hasServerProducts ? initialProducts! : initialFallbackProducts
  );
  const [loading, setLoading] = useState<boolean>(!hasServerProducts);
  // Track whether we've been seeded from the server to avoid the redundant initial fetch
  const seededFromServer = useRef(hasServerProducts);

  const fetchProducts = useCallback(async () => {
    try {
      // Use standard caching — server sets Cache-Control headers, browser/CDN respects them
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.error('Failed to fetch dynamic products from DB context:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // If we already have server-provided products, skip the initial client fetch entirely.
    // Only fetch on explicit refreshProducts() calls (e.g., after admin mutations).
    if (seededFromServer.current) {
      setLoading(false);
    } else {
      fetchProducts();
    }

    const handleProductsUpdated = () => {
      fetchProducts();
    };

    window.addEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated);
    return () => {
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProductBySlug = useCallback(
    (slug: string): Product | undefined => {
      return products.find((p) => p.slug === slug || p.id === slug || p._id === slug);
    },
    [products]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        getProductBySlug,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
