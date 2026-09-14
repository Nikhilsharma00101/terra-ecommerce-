'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ProductProvider } from '@/context/ProductContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { UIProvider } from '@/context/UIContext';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Lazy-load modals and overlays — not needed on initial paint
const SearchModal = dynamic(() =>
  import('@/components/search/SearchModal').then((m) => m.SearchModal),
  { ssr: false }
);
const MobileDrawer = dynamic(() =>
  import('@/components/layout/MobileDrawer').then((m) => m.MobileDrawer),
  { ssr: false }
);
const ToastContainer = dynamic(() =>
  import('@/components/ui/Toast').then((m) => m.ToastContainer),
  { ssr: false }
);
const CartAddedModal = dynamic(() =>
  import('@/components/cart/CartAddedModal').then((m) => m.CartAddedModal),
  { ssr: false }
);

export const ClientProviders: React.FC<{ children: React.ReactNode; initialProducts?: any[] }> = ({
  children,
  initialProducts,
}) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthProvider>
      <ProductProvider initialProducts={initialProducts}>
        <CartProvider>
          <WishlistProvider>
            <UIProvider>
              {!isAdminRoute && (
                <header className="fixed top-0 w-full z-50 flex flex-col">
                  <AnnouncementBar />
                  <Navbar />
                </header>
              )}
              <main className={`flex-1 ${!isAdminRoute && pathname !== '/' ? 'pt-[70px] lg:pt-[135px]' : ''}`}>
                {children}
              </main>
              {!isAdminRoute && <Footer />}
              {mounted && !isAdminRoute && (
                <>
                  <SearchModal />
                  <MobileDrawer />
                  <ToastContainer />
                  <CartAddedModal />
                </>
              )}
              {mounted && isAdminRoute && <ToastContainer />}
            </UIProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

