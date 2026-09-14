'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If user is authenticated, fetch wishlist from DB
    if (user) {
      fetch('/api/user/profile')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user?.wishlist) {
            setWishlist(data.user.wishlist);
          }
        })
        .catch((e) => console.error('Wishlist DB sync error', e))
        .finally(() => setIsLoaded(true));
    } else {
      try {
        const saved = localStorage.getItem('terra_wishlist');
        if (saved) {
          setWishlist(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to parse wishlist from local storage', e);
      }
      setIsLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && !user) {
      localStorage.setItem('terra_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded, user]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    // Sync with DB if user is logged in
    if (user) {
      fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_wishlist', productId }),
      }).catch((err) => console.error('Failed to persist wishlist to DB', err));
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
