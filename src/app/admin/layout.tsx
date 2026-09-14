import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terra Botanical — Executive Administration Portal',
  description: 'Enterprise Admin Portal for Terra grooming catalog, live orders, and database operations.',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F6F3ED] text-[#181817] font-sans antialiased selection:bg-[#2D4438] selection:text-[#F6F3ED]">
      {children}
    </div>
  );
}
