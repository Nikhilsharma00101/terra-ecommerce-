'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { Check, ShoppingBag } from 'lucide-react';

export function AboutQuickBuyButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 1200);
  };

  return (
    <button
      onClick={handleQuickBuy}
      className="bg-[#181817] text-white px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#2D4438] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
    >
      {added ? (
        <>
          <Check size={14} className="text-[#C4A482]" />
          <span>Added to Bag</span>
        </>
      ) : (
        <>
          <ShoppingBag size={14} />
          <span>Order Now • ₹{product.price}</span>
        </>
      )}
    </button>
  );
}
