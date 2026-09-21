'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Search,
  Plus,
  Lock,
  Mail,
  Phone,
  Crown,
  ShoppingBag,
  Trash2,
  Check,
  Award,
  AlertCircle,
  Loader2,
  Star,
  X,
} from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

function AccountPageContent() {
  const { user, isAdmin, isLoading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<
    'orders' | 'profile' | 'addresses' | 'wishlist' | 'replenishment'
  >('orders');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);

  useEffect(() => {
    if (tabParam && ['orders', 'profile', 'addresses', 'wishlist', 'replenishment'].includes(tabParam)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tabParam as 'orders' | 'profile' | 'addresses' | 'wishlist' | 'replenishment');
    }
  }, [tabParam]);

  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  // Database Data States — Zero Mock / Hardcoded Data
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [replenishCycle, setReplenishCycle] = useState<'30d' | '60d' | '90d'>('60d');
  const [isReplenishPaused, setIsReplenishPaused] = useState(false);
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);

  // Search & Filter state for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'Processing' | 'Shipped' | 'Delivered'>('all');

  // Address Form State
  const [newAddrForm, setNewAddrForm] = useState({
    title: 'Home',
    street: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    phone: '',
    isDefault: false,
  });

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Review Modal State
  const [reviewModalItem, setReviewModalItem] = useState<any | null>(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    content: '',
    skinType: 'Normal / Combination',
    author: user?.name || '',
    location: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [userReviews, setUserReviews] = useState<any[]>([]);

  const openReviewModal = (item: any) => {
    setReviewModalItem(item);
    setReviewForm({ rating: 5, title: '', content: '', skinType: 'Normal / Combination', author: user?.name || '', location: '' });
    setReviewSuccess(false);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalItem) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: reviewForm.author || user?.name,
          email: user?.email,
          location: reviewForm.location,
          skinType: reviewForm.skinType,
          rating: reviewForm.rating,
          title: reviewForm.title,
          content: reviewForm.content,
          productSlug: reviewModalItem.productId,
          productName: reviewModalItem.name,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setReviewSuccess(true);
      setUserReviews(prev => [...prev, { productSlug: reviewModalItem.productId, productName: reviewModalItem.name }]);
      setTimeout(() => {
        setReviewModalItem(null);
        setReviewSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // 1. Fetch Real Products from MongoDB Database
  useEffect(() => {
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => console.error('AccountPage products fetch error:', err))
      .finally(() => setLoadingProducts(false));
  }, []);

  // 2. Fetch User Profile, Addresses & Subscription from MongoDB Database
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/account');
      return;
    }

    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
      });

      // Fetch dynamic user record from MongoDB
      fetch('/api/user/profile')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) {
            setProfileData({
              name: data.user.name || user.name || '',
              phone: data.user.phone || user.phone || '',
            });

            // Set real MongoDB saved addresses
            setSavedAddresses(data.user.addresses || []);

            // Set real MongoDB subscription data
            if (data.user.subscription) {
              setSubscriptionData(data.user.subscription);
              setReplenishCycle(data.user.subscription.frequency || '60d');
              setIsReplenishPaused(data.user.subscription.status === 'paused');
            }
          }
        })
        .catch((err) => console.error('Failed to load user profile from DB:', err))
        .finally(() => setLoadingAddresses(false));

      // Fetch real customer orders from MongoDB
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) {
            setOrders(data.orders);
          }
        })
        .catch((err) => console.error('Failed to load orders from DB:', err))
        .finally(() => setLoadingOrders(false));

      // Fetch user's submitted reviews
      if (user.email) {
        fetch(`/api/reviews?email=${encodeURIComponent(user.email)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.reviews) {
              setUserReviews(data.reviews);
            }
          })
          .catch((err) => console.error('Failed to load user reviews from DB:', err));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isLoading]);

  // Robust DB Product Image Resolver
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getProductImage = (p: any): string => {
    if (p?.featuredImage && typeof p.featuredImage === 'string' && p.featuredImage.trim() !== '') {
      return p.featuredImage;
    }
    if (p?.images && Array.isArray(p.images) && p.images.length > 0 && p.images[0]?.url) {
      return p.images[0].url;
    }
    if (p?.secondaryImage && typeof p.secondaryImage === 'string' && p.secondaryImage.trim() !== '') {
      return p.secondaryImage;
    }
    return '/images/home/hero-products.jpeg';
  };

  // Robust Order Item Image Resolver — Always matches against live MongoDB products first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getOrderItemImage = (item: any): string => {
    const itemName = (item?.name || '').toLowerCase().trim();
    const itemPid = (item?.productId || item?.slug || '').toString().toLowerCase().trim();

    // 1. Primary: Match against loaded MongoDB products by ID, slug, or normalized name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbProduct = products.find((p: any) => {
      const pId = (p._id || p.id || '').toString().toLowerCase();
      const pSlug = (p.slug || '').toLowerCase();
      const pName = (p.name || '').toLowerCase().trim();

      if (itemPid && (pId === itemPid || pSlug === itemPid)) return true;
      if (item?.slug && pSlug === item.slug.toLowerCase()) return true;
      if (itemName && (pName === itemName || pSlug === itemName)) return true;

      // Keyword matching for Face Wash, Beard Oil, The Method Set
      if ((itemName.includes('face') || itemName.includes('wash') || itemPid.includes('face')) && (p.category === 'Face' || pSlug.includes('face'))) {
        return true;
      }
      if ((itemName.includes('beard') || itemName.includes('oil') || itemPid.includes('beard')) && (p.category === 'Beard' || pSlug.includes('beard'))) {
        return true;
      }
      if ((itemName.includes('method') || itemName.includes('routine') || itemName.includes('set') || itemName.includes('bundle')) && (p.isBundle || pSlug.includes('method') || p.category === 'Sets')) {
        return true;
      }

      return false;
    });

    if (dbProduct) {
      const dbImg = getProductImage(dbProduct);
      if (dbImg && dbImg.trim() !== '') {
        return dbImg;
      }
    }

    // 2. Secondary: If item itself has a valid Cloudinary/HTTP URL from database
    if (item?.image && typeof item.image === 'string' && item.image.startsWith('http')) {
      return item.image;
    }

    // 3. Fallback: First DB product image or default
    if (products.length > 0) {
      return getProductImage(products[0]);
    }

    return '/images/home/hero-products.jpeg';
  };

  // Matched wishlist products from DB
  const wishlistedProducts = useMemo(() => {
    if (products.length === 0 || wishlist.length === 0) return [];
    return products.filter(
      (p) =>
        (p._id && wishlist.includes(p._id)) ||
        (p.id && wishlist.includes(p.id)) ||
        (p.slug && wishlist.includes(p.slug))
    );
  }, [products, wishlist]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
      const matchesQuery =
        !orderSearch ||
        o.orderNumber?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        o.items?.some((i: any) => i.name?.toLowerCase().includes(orderSearch.toLowerCase()));
      return matchesFilter && matchesQuery;
    });
  }, [orders, orderFilter, orderSearch]);

  // DB Products for Auto-Replenishment Method Set
  const faceWashProduct = products.find(
    (p) => p.category === 'Face' || p.slug === 'face-wash' || p.slug === 'terra-face-wash'
  ) || products[0];

  const beardOilProduct = products.find(
    (p) => p.category === 'Beard' || p.slug === 'beard-oil' || p.slug === 'terra-beard-oil'
  ) || products[1];

  const bundleTotalOriginal = (faceWashProduct?.price || 699) + (beardOilProduct?.price || 599);
  const bundleDiscountedPrice = Math.round(bundleTotalOriginal * 0.9); // 10% privilege

  // Format Next Dispatch Date from DB or frequency
  const nextDispatchDateDisplay = useMemo(() => {
    if (subscriptionData?.nextDispatchDate) {
      const d = new Date(subscriptionData.nextDispatchDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    }
    const daysToAdd = replenishCycle === '30d' ? 30 : replenishCycle === '90d' ? 90 : 60;
    const future = new Date();
    future.setDate(future.getDate() + daysToAdd);
    return future.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [subscriptionData, replenishCycle]);

  // =========================================================================
  // DB HANDLERS: Fully Persistent to MongoDB
  // =========================================================================

  // 1. ADD ADDRESS TO DB
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrForm.street || !newAddrForm.city || !newAddrForm.postalCode) return;
    setIsSubmittingAddress(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_address',
          address: newAddrForm,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.addresses) {
          setSavedAddresses(data.addresses);
        }
        setShowAddAddressModal(false);
        setNewAddrForm({
          title: 'Home',
          street: '',
          city: '',
          state: 'Maharashtra',
          postalCode: '',
          phone: '',
          isDefault: false,
        });
      }
    } catch (err) {
      console.error('Failed to save address to DB:', err);
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  // 2. SET DEFAULT ADDRESS IN DB
  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_default_address', addressId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.addresses) {
          setSavedAddresses(data.addresses);
        }
      }
    } catch (err) {
      console.error('Failed to set default address in DB:', err);
    }
  };

  // 3. DELETE ADDRESS IN DB
  const handleDeleteAddress = async (addressId: string) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_address', addressId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.addresses) {
          setSavedAddresses(data.addresses);
        }
      }
    } catch (err) {
      console.error('Failed to delete address from DB:', err);
    }
  };

  // 4. UPDATE SUBSCRIPTION ROUTINE IN DB
  const handleUpdateSubscription = async (frequency?: '30d' | '60d' | '90d', isPaused?: boolean) => {
    const nextFreq = frequency || replenishCycle;
    const nextStatus = isPaused !== undefined ? (isPaused ? 'paused' : 'active') : (isReplenishPaused ? 'paused' : 'active');

    setIsUpdatingSubscription(true);
    setReplenishCycle(nextFreq);
    if (isPaused !== undefined) setIsReplenishPaused(isPaused);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_subscription',
          subscription: {
            frequency: nextFreq,
            status: nextStatus,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.subscription) {
          setSubscriptionData(data.subscription);
        }
      }
    } catch (err) {
      console.error('Failed to update subscription in DB:', err);
    } finally {
      setIsUpdatingSubscription(false);
    }
  };

  // 5. UPDATE PROFILE IN DB
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setProfileData({
            name: data.user.name || '',
            phone: data.user.phone || '',
          });
        }
        await refreshUser();
        setProfileSuccessMsg('Profile changes saved successfully to database.');
        setTimeout(() => setProfileSuccessMsg(''), 4000);
      } else {
        const errData = await res.json();
        setProfileErrorMsg(errData.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Failed to save profile to DB:', err);
      setProfileErrorMsg('Connection error saving profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F8F5] py-32 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#181817] border-t-[#8B0000] rounded-full animate-spin" />
        <div className="text-xs uppercase font-mono tracking-widest text-[#77736C]">
          Authenticating Member Session...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F8F5] py-32 flex flex-col items-center justify-center space-y-4">
        <div className="text-xl font-bold text-red-600">Session Expired or Invalid</div>
        <p className="text-gray-500">Your session could not be verified. Redirecting to login...</p>
        <button onClick={() => { window.location.href = '/login'; }} className="px-4 py-2 mt-4 bg-[#181817] text-white rounded-xl text-xs uppercase font-bold tracking-wider cursor-pointer shadow-xs">
          Click here if not redirected
        </button>
        {/* Force native redirect if Next.js router.push failed silently */}
        <script dangerouslySetInnerHTML={{ __html: `setTimeout(function() { window.location.href = '/login'; }, 2000);` }} />
      </div>
    );
  }

  const userInitials = (user.name || 'Terra Member')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1A1C1A] font-sans antialiased pb-24">
      
      {/* Mobile Back Button (Only visible on mobile when a tab is active) */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'hidden' : 'flex'} bg-[#F4F4F0] sticky top-0 z-40 border-b border-[#E2E3DF] px-4 py-4 items-center gap-3 shadow-sm`}>
        <button 
          onClick={() => setMobileMenuOpen(true)} 
          className="p-1 -ml-1 text-[#45464C] hover:text-[#1A1C1A] transition-colors rounded-md hover:bg-[#E2E3DF]"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-serif text-lg text-[#1A1C1A]">
          {activeTab === 'orders' ? 'Order History' : 
           activeTab === 'wishlist' ? 'Saved Wishlist' : 
           activeTab === 'replenishment' ? 'Auto-Replenish' : 
           activeTab === 'addresses' ? 'Delivery Addresses' : 'Profile & Security'}
        </span>
      </div>

      <div className={`w-full max-w-[1440px] mx-auto px-0 pt-0 ${!mobileMenuOpen ? 'hidden lg:block' : 'block'}`}>

        {/* Top Welcome & Tier Header Area */}
        <div className="bg-[#F4F4F0] rounded-none p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#baebd1] text-[#3e6b57] text-[11px] font-semibold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3A6753]"></span>
                    {user.tier || 'Terra Member'}
                  </span>

                </div>
                <div className="flex items-center gap-3 sm:gap-4 mt-1 min-w-0 w-full">
                  {user.image && (
                    <div className="relative w-10 h-10 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 border-2 border-[#FFFFFF]">
                      <Image src={user.image} alt={user.name} fill className="object-cover" />
                    </div>
                  )}
                  <h1 className="font-serif text-xl sm:text-5xl text-[#1A1C1A] tracking-tight font-normal truncate w-full">
                    Welcome back, <span className="italic font-light text-[#8B0000]">{user.name.split(' ')[0]}</span>
                  </h1>
                </div>
              <p className="hidden sm:block text-[13px] text-[#45464C] max-w-xl mt-2 leading-relaxed">
                Welcome to your private Terra sanctuary. Manage your artisanal skincare formulations, curate future acquisitions, and oversee your customized replenish cadence.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex-1 lg:flex-none justify-center inline-flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg bg-[#8B0000]/10 text-[#8B0000] hover:bg-[#8B0000]/20 transition-colors text-[11px] sm:text-[12px] font-medium uppercase tracking-wider text-center"
                >
                  <ShieldCheck size={16} className="shrink-0" />
                  <span className="truncate">Admin Console</span>
                </Link>
              )}
              <button
                onClick={() => logout()}
                className="flex-1 lg:flex-none justify-center inline-flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg bg-[#E2E3DF] text-[#45464C] hover:text-[#1A1C1A] hover:bg-[#dadad6] transition-colors text-[11px] sm:text-[12px] font-medium uppercase tracking-wider text-center"
              >
                <LogOut size={16} className="shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>


        </div>
      </div>

        {/* ========================================================================= */}
        {/* 2. MAIN LAYOUT (SIDEBAR + ACTIVE TAB)                                    */}
        {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-0 pt-0 lg:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ASYMMETRIC 3-COLUMN SIDEBAR */}
          <div className={`lg:col-span-4 xl:col-span-3 flex flex-col gap-4 ${!mobileMenuOpen ? 'hidden lg:flex' : 'flex'}`}>
            {/* Navigation Card */}
            <div className="bg-[#FFFFFF] rounded-xl p-2 shadow-sm flex flex-col gap-1">
                {[
                  { id: 'orders', label: 'Order History', icon: Package, badge: orders.length > 0 ? `${orders.length} Active` : undefined },
                  { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, badge: wishlist.length > 0 ? wishlist.length : undefined },
                  { id: 'replenishment', label: 'Auto-Replenish', icon: RefreshCw, badge: !isReplenishPaused ? 'Active' : undefined },
                  { id: 'addresses', label: 'Delivery Addresses', icon: MapPin, badge: savedAddresses.length > 0 ? savedAddresses.length : undefined },
                  { id: 'profile', label: 'Profile & Security', icon: ShieldCheck, badge: 'Verified' },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all ${isActive
                        ? 'bg-[#000000] text-[#FFFFFF] font-medium'
                        : 'text-[#45464C] hover:bg-[#F4F4F0] hover:text-[#1A1C1A]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} className={isActive ? 'text-[#FFFFFF]' : 'text-[#45464C]'} />
                        <span className="text-[15px] font-medium">{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${isActive ? 'bg-[#2f312e] text-[#FFFFFF]' : 'bg-[#EEEEEA] text-[#45464C]'
                          }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

            {/* Curated Additions Section */}
            <div className="mt-6 mb-8 lg:mb-0 px-2 block">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#77736C] mb-4">Curated Additions</h3>
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {products.map((product, i) => (
                  <Link href={`/products/${product.slug}`} key={product.slug || i} className="group flex gap-3 p-3 bg-[#FFFFFF] rounded-xl border border-[#E5E0D8]/50 shadow-xs hover:border-[#D5D0C8] transition-colors">
                    <div className="relative w-16 h-20 bg-[#F4F4F0] rounded-lg overflow-hidden shrink-0">
                      <Image src={getProductImage(product)} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#77736C] mb-0.5">{product.category}</span>
                      <h4 className="font-serif text-[15px] text-[#181817] group-hover:text-[#3A6753] transition-colors leading-tight">{product.name}</h4>
                      <span className="text-[11px] font-medium text-[#181817] mt-1.5">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

              {/* Curatorial Quote Accent */}
              <div className="p-4 bg-[#EEEEEA] rounded-xl hidden lg:block">
                <p className="font-serif text-lg italic text-[#1A1C1A] font-normal leading-relaxed">
                  "Skincare is not vanity; it is the quiet ritual of self-preservation."
                </p>
                <span className="text-[11px] uppercase tracking-widest text-[#45464C] block mt-3 font-medium">
                  — Terra Pharmacopoeia Notes
                </span>
              </div>
            </div>

            {/* RIGHT CONTENT DISPLAY AREA (9 COLS) */}
          <div className={`lg:col-span-9 lg:pl-6 ${mobileMenuOpen ? 'hidden lg:block' : 'block'}`}>
            <AnimatePresence mode="wait">

                {/* ===================================================================== */}
                {/* TAB 1: ORDER HISTORY                                                  */}
                {/* ===================================================================== */}
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-2xl text-[#1A1C1A]">Order Archives</h2>
                        <p className="text-[13px] text-[#45464C]">Review lifetime deliveries, track packages in formulation, and download archival invoices.</p>
                      </div>
                    </div>

                    {/* Filter & Search Controls */}
                    <div className="bg-[#FFFFFF] rounded-xl p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
                        {(['all', 'Processing', 'Shipped', 'Delivered'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => setOrderFilter(st)}
                            className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider transition-all whitespace-nowrap ${orderFilter === st
                              ? 'bg-[#000000] text-[#FFFFFF]'
                              : 'bg-[#F4F4F0] text-[#45464C] hover:text-[#1A1C1A]'
                              }`}
                          >
                            {st === 'all' ? `All (${orders.length})` : st}
                          </button>
                        ))}
                      </div>
                      {orders.length > 0 && (
                        <div className="relative w-full md:w-64">
                          <Search size={16} className="absolute left-3 top-2 text-[#c6c6cd]" />
                          <input
                            type="text"
                            placeholder="Search orders or items..."
                            value={orderSearch}
                            onChange={(e) => setOrderSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 bg-[#F4F4F0] rounded-lg text-[13px] text-[#1A1C1A] placeholder:text-[#c6c6cd] focus:outline-none focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#E2E3DF] transition-colors"
                          />
                        </div>
                      )}
                    </div>

                    {/* Orders List */}
                    <div className="flex flex-col gap-4">
                      {loadingOrders ? (
                        <div className="py-12 text-center text-sm text-[#45464C] flex flex-col items-center gap-2">
                          <Loader2 size={24} className="animate-spin text-[#3A6753]" />
                          <span>Fetching archival orders...</span>
                        </div>
                      ) : filteredOrders.length === 0 ? (
                        <div className="p-12 bg-[#FFFFFF] rounded-xl text-center shadow-sm">
                          <Package size={48} className="mx-auto text-[#c6c6cd] mb-3" strokeWidth={1} />
                          <h3 className="font-serif text-xl text-[#1A1C1A]">No records matching your search</h3>
                          <p className="text-[13px] text-[#45464C] mt-1 max-w-sm mx-auto mb-4">
                            Try adjusting your query or filter pills to review other time periods.
                          </p>
                          {orderFilter !== 'all' ? (
                            <button
                              onClick={() => setOrderFilter('all')}
                              className="px-4 py-2 bg-[#000000] text-[#FFFFFF] rounded-lg text-[12px] uppercase tracking-wider font-medium"
                            >
                              Reset Filters
                            </button>
                          ) : (
                            <Link
                              href="/shop"
                              className="inline-block px-4 py-2 bg-[#000000] text-[#FFFFFF] rounded-lg text-[12px] uppercase tracking-wider font-medium"
                            >
                              Explore Catalog
                            </Link>
                          )}
                        </div>
                      ) : (
                        filteredOrders.map((order) => {
                          const isDelivered = order.status === 'Delivered';
                          const isShipped = order.status === 'Shipped';
                          const isProcessing = order.status === 'Processing';

                          return (
                            <article
                              key={order._id || order.id || order.orderNumber}
                              className="bg-[#FFFFFF] rounded-xl p-5 md:p-6 shadow-sm transition-all hover:shadow-md"
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#E2E3DF] gap-2">
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="text-[15px] text-[#1A1C1A] font-semibold">
                                    Order #{order.orderNumber}
                                  </span>
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${isDelivered ? 'bg-[#baebd1] text-[#3e6b57]' : isShipped ? 'bg-[#F4F4F0] text-[#1A1C1A]' : 'bg-[#E2E3DF] text-[#45464C]'
                                    }`}>
                                    {isDelivered && <CheckCircle2 size={12} />}
                                    {isShipped && <Truck size={12} />}
                                    {isProcessing && <Clock size={12} />}
                                    <span>{order.status}</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-[13px] text-[#45464C]">
                                    Placed {new Date(order.createdAt || '2024-01-01').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                  <span className="text-[15px] text-[#1A1C1A] font-medium">₹{order.total?.toLocaleString('en-IN')}</span>
                                </div>
                              </div>

                              {/* Premium Animated Visual Progress Stepper */}
                              <div className="py-8 px-2 sm:px-4">
                                <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                                  {/* Background Track */}
                                  <div className="absolute left-0 top-5 h-1 w-full bg-[#F4F4F0] rounded-full z-0"></div>
                                  
                                  {/* Animated Fill Track */}
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: isDelivered ? '100%' : isShipped ? '66%' : '33%' }}
                                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                                    className="absolute left-0 top-5 h-1 bg-[#3A6753] rounded-full z-0 shadow-[0_0_8px_rgba(58,103,83,0.4)]"
                                  ></motion.div>

                                  {/* Steps */}
                                  {[
                                    { label: 'Placed', active: true, icon: CheckCircle2 },
                                    { label: 'Formulated', active: isShipped || isDelivered, icon: isShipped || isDelivered ? CheckCircle2 : Package },
                                    { label: 'Dispatched', active: isShipped || isDelivered, icon: isDelivered ? CheckCircle2 : isShipped ? Truck : Truck },
                                    { label: 'Delivered', active: isDelivered, icon: isDelivered ? CheckCircle2 : MapPin }
                                  ].map((step, idx) => {
                                    const isCurrentStep = 
                                      (idx === 3 && isDelivered) || 
                                      (idx === 2 && isShipped && !isDelivered) || 
                                      (idx === 1 && !isShipped && !isDelivered);

                                    return (
                                      <div key={idx} className="flex flex-col items-center gap-3 z-10 w-16 sm:w-24">
                                        <div className="bg-[#FFFFFF] px-2 py-1 relative">
                                          {isCurrentStep && (
                                            <motion.div 
                                              initial={{ scale: 0.8, opacity: 0 }}
                                              animate={{ scale: 1.5, opacity: 0 }}
                                              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                                              className="absolute inset-0 rounded-full bg-[#3A6753]/20 z-0 m-1"
                                            />
                                          )}
                                          <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.3 + (idx * 0.15), type: "spring", stiffness: 200 }}
                                            className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-sm border-2 transition-colors duration-700 z-10 ${
                                              step.active 
                                                ? 'bg-[#3A6753] border-[#3A6753] text-[#FFFFFF]' 
                                                : 'bg-[#FFFFFF] border-[#E2E3DF] text-[#c6c6cd]'
                                            }`}
                                          >
                                            <step.icon size={16} className={isCurrentStep && !isDelivered ? "animate-pulse" : ""} />
                                          </motion.div>
                                        </div>
                                        <motion.span 
                                          initial={{ opacity: 0, y: 5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.4, delay: 0.6 + (idx * 0.1) }}
                                          className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-center ${
                                            step.active ? 'text-[#1A1C1A]' : 'text-[#c6c6cd]'
                                          }`}
                                        >
                                          {step.label}
                                        </motion.span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Products List */}
                              <div className="flex flex-col gap-4">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {order.items?.map((item: any, idx: number) => {
                                  const itemImgSrc = getOrderItemImage(item);
                                  return (
                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-lg bg-[#F4F4F0] overflow-hidden flex-shrink-0">
                                          <Image src={itemImgSrc} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                          <h3 className="text-[15px] text-[#1A1C1A] font-medium">{item.name}</h3>
                                          <p className="text-[13px] text-[#45464C]">Qty: {item.quantity} · ₹{item.price}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 self-start sm:self-auto mt-2 sm:mt-0">
                                        {isDelivered && !userReviews.some(r => r.productSlug === item.productId || r.productSlug === item.slug) && (
                                          <button
                                            onClick={() => openReviewModal(item)}
                                            className="px-4 py-2 rounded-lg bg-[#000000] text-[#FFFFFF] hover:opacity-90 text-[12px] uppercase tracking-wider flex items-center gap-1.5 transition-opacity"
                                          >
                                            <Star size={14} />
                                            Leave a Review
                                          </button>
                                        )}
                                        {!isDelivered && isShipped && (
                                          <button className="px-4 py-2 rounded-lg bg-[#F4F4F0] text-[#1A1C1A] hover:bg-[#E2E3DF] text-[12px] uppercase tracking-wider transition-colors">
                                            Track Status
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Order Card Footer */}
                              <div className="pt-4 mt-4 border-t border-[#E2E3DF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px] text-[#45464C]">
                                <div className="flex items-center gap-2">
                                  <ShieldCheck size={16} />
                                  <span>{order.paymentMethod || 'UPI'} Payment Confirmed</span>
                                </div>
                                <span>{order.trackingNumber ? `Courier: ${order.trackingNumber}` : 'Standard Shipping'}</span>
                              </div>
                            </article>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ===================================================================== */}
                {/* TAB 2: SAVED WISHLIST                                                 */}
                {/* ===================================================================== */}
                {activeTab === 'wishlist' && (
                  <motion.div
                    key="wishlist-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-2xl text-[#1A1C1A]">Curated Wishlist</h2>
                        <p className="text-[13px] text-[#45464C]">Archived selections reserved for personal formulation or gifting.</p>
                      </div>
                      <span className="text-[12px] uppercase tracking-widest text-[#45464C] font-medium self-start sm:self-auto">
                        {wishlistedProducts.length} Items Saved
                      </span>
                    </div>

                    {loadingProducts ? (
                      <div className="py-12 text-center text-sm text-[#45464C] flex flex-col items-center gap-2">
                        <Loader2 size={24} className="animate-spin text-[#3A6753]" />
                        <span>Loading saved formulations...</span>
                      </div>
                    ) : wishlistedProducts.length === 0 ? (
                      <div className="p-12 bg-[#FFFFFF] rounded-xl text-center shadow-sm">
                        <Heart size={48} className="mx-auto text-[#c6c6cd] mb-3" strokeWidth={1} />
                        <h3 className="font-serif text-xl text-[#1A1C1A]">Your curatorial wishlist is empty</h3>
                        <p className="text-[13px] text-[#45464C] mt-1 max-w-sm mx-auto mb-4">
                          Explore our formulations to preserve your customized regimens.
                        </p>
                        <Link
                          href="/shop"
                          className="inline-block px-6 py-2.5 bg-[#000000] text-[#FFFFFF] rounded-lg text-[12px] uppercase tracking-wider font-medium"
                        >
                          Explore Catalog
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {wishlistedProducts.map((p, idx) => {
                          const itemKey = p._id || p.id || p.slug || `wish-${idx}`;
                          const imgSrc = getProductImage(p);

                          return (
                            <article
                              key={itemKey}
                              className="bg-[#FFFFFF] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                            >
                              <div className="relative h-64 bg-[#F4F4F0] overflow-hidden group">
                                <Image
                                  src={imgSrc}
                                  alt={p.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <button
                                  onClick={() => toggleWishlist(p._id || p.id || p.slug)}
                                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FFFFFF]/80 backdrop-blur-md text-[#45464C] hover:text-[#8B0000] flex items-center justify-center transition-colors"
                                  title="Remove item"
                                >
                                  <X size={16} />
                                </button>
                                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md text-[10px] uppercase tracking-wider text-[#1A1C1A] font-medium">
                                  {p.category || 'Formulation'}
                                </div>
                              </div>

                              <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                                <div>
                                  <h3 className="text-[15px] text-[#1A1C1A] font-medium leading-tight">{p.name}</h3>
                                  <p className="text-[13px] text-[#45464C] mt-1 line-clamp-2">
                                  {p.shortDescription || 'Artisanal formulation.'}
                                </p>
                                  <span className="text-[15px] text-[#1A1C1A] font-semibold block mt-2">₹{p.price}</span>
                                </div>
                                <div className="pt-2">
                                  <button
                                    onClick={() => addItem(p)}
                                    className="w-full py-2.5 px-3 rounded-lg bg-[#000000] text-[#FFFFFF] hover:opacity-90 text-[12px] uppercase tracking-wider text-center transition-opacity flex items-center justify-center gap-2 font-medium"
                                  >
                                    <ShoppingBag size={14} />
                                    Add to Bag
                                  </button>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'replenishment' && (
                  <motion.div
                    key="replenishment-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Privilege Banner */}
                    <div className="bg-[#baebd1] text-[#3e6b57] p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <ShieldCheck size={28} className="shrink-0" />
                        <div>
                          <h4 className="text-[15px] font-semibold">Client Privilege Status</h4>
                          <p className="text-[13px] text-[#3e6b57]/90 mt-1">
                            10% Perpetual Savings & Complimentary Seasonal Gifting included on your active cadence.
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex w-fit text-[11px] uppercase tracking-widest bg-[#3e6b57] text-[#ffffff] px-3 py-1.5 rounded-full font-medium">
                        VIP Guaranteed
                      </span>
                    </div>

                    {/* Subscription Card Container */}
                    <div className="bg-[#FFFFFF] rounded-xl p-5 md:p-8 shadow-sm flex flex-col gap-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E2E3DF] gap-4">
                        <div>
                          <span className="text-[11px] uppercase tracking-widest text-[#3A6753] font-medium block">
                            Bespoke Subscription Routine
                          </span>
                          <h3 className="font-serif text-2xl text-[#1A1C1A] mt-1">The Complete Terra Method Set</h3>
                        </div>

                        {/* Pause / Resume Toggle */}
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] uppercase tracking-wider text-[#3A6753] font-semibold">
                            {isReplenishPaused ? 'Routine Paused' : 'Routine Active'}
                          </span>
                          <button
                            disabled={isUpdatingSubscription}
                            onClick={() => handleUpdateSubscription(undefined, !isReplenishPaused)}
                            className={`w-12 h-6 rounded-full p-0.5 transition-colors relative focus:outline-none ${isReplenishPaused ? 'bg-[#E2E3DF]' : 'bg-[#3A6753]'
                              }`}
                          >
                            <span
                              className={`block w-5 h-5 rounded-full bg-[#FFFFFF] transition-transform ${isReplenishPaused ? 'translate-x-0' : 'translate-x-6 shadow-sm'
                                }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Products Bundled Showcase */}
                      <div>
                        <span className="text-[11px] uppercase tracking-widest text-[#45464C] block mb-3 font-medium">
                          Artisanal Formulas in this Bundle
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3 bg-[#F4F4F0] rounded-lg flex items-center gap-4">
                            <div className="w-14 h-14 rounded-md bg-[#E2E3DF] overflow-hidden shrink-0 relative">
                              {faceWashProduct && (
                                <Image src={getProductImage(faceWashProduct)} alt={faceWashProduct.name} fill className="object-cover" />
                              )}
                            </div>
                            <div>
                              <h5 className="text-[15px] text-[#1A1C1A] font-medium leading-tight">
                                {faceWashProduct?.name || 'Face Wash'}
                              </h5>
                              <span className="text-[11px] text-[#45464C] mt-1 block">Step 01 • Cleanse</span>
                            </div>
                          </div>
                          <div className="p-3 bg-[#F4F4F0] rounded-lg flex items-center gap-4">
                            <div className="w-14 h-14 rounded-md bg-[#E2E3DF] overflow-hidden shrink-0 relative">
                              {beardOilProduct && (
                                <Image src={getProductImage(beardOilProduct)} alt={beardOilProduct.name} fill className="object-cover" />
                              )}
                            </div>
                            <div>
                              <h5 className="text-[15px] text-[#1A1C1A] font-medium leading-tight">
                                {beardOilProduct?.name || 'Beard Oil'}
                              </h5>
                              <span className="text-[11px] text-[#45464C] mt-1 block">Step 02 • Nourish</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cadence Frequency Selector */}
                      <div>
                        <span className="text-[11px] uppercase tracking-widest text-[#45464C] block mb-3 font-medium">
                          Replenishment Cadence Frequency
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { id: '30d', label: 'Every 30 Days', desc: 'Rapid Cellular Renewal' },
                            { id: '60d', label: 'Every 60 Days', desc: 'Optimal Seasonal Cycle' },
                            { id: '90d', label: 'Every 90 Days', desc: 'Gentle Maintenance' },
                          ].map((cyc) => {
                            const isSelected = replenishCycle === cyc.id;
                            return (
                              <button
                                key={cyc.id}
                                disabled={isUpdatingSubscription}
                                onClick={() => handleUpdateSubscription(cyc.id as '30d' | '60d' | '90d')}
                                className={`p-4 rounded-xl text-left transition-all ${isSelected
                                  ? 'bg-[#000000] text-[#FFFFFF] shadow-sm'
                                  : 'bg-[#F4F4F0] text-[#1A1C1A] hover:bg-[#E2E3DF]'
                                  }`}
                              >
                                <span className="text-[15px] font-semibold flex items-center justify-between">
                                  {cyc.label}
                                  {isSelected && <CheckCircle2 size={18} />}
                                </span>
                                <span className={`text-[13px] mt-1 block ${isSelected ? 'text-[#FFFFFF]/80' : 'text-[#45464C]'}`}>
                                  {cyc.desc}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dispatch & Billing Schedule Summary */}
                      <div className="p-5 bg-[#F4F4F0] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] uppercase tracking-widest text-[#45464C] font-medium">Next Dispatch Date</span>
                          <span className="font-serif text-2xl text-[#1A1C1A]">
                            {isReplenishPaused ? 'Paused' : nextDispatchDateDisplay}
                          </span>
                          <span className="text-[13px] text-[#45464C]">Dispatched via Standard Delivery to primary address</span>
                        </div>

                        <div className="flex flex-col md:items-end gap-1.5">
                          <span className="text-[11px] uppercase tracking-widest text-[#45464C] font-medium">Next Auto-Charge Total</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl text-[#1A1C1A] font-semibold">₹{bundleDiscountedPrice}</span>
                            <span className="text-[13px] line-through text-[#c6c6cd]">₹{bundleTotalOriginal}</span>
                            <span className="text-[11px] text-[#3A6753] font-medium">(10% VIP applied)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ===================================================================== */}
                {/* TAB 4: SAVED ADDRESSES (100% Persisted in MongoDB User Document)       */}
                {/* ===================================================================== */}
                {activeTab === 'addresses' && (
                  <motion.div
                    key="addresses-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-2xl text-[#1A1C1A]">Registered Addresses</h2>
                        <p className="text-[13px] text-[#45464C]">Manage global shipping destinations and preferred couriers.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddAddressModal(true)}
                        className="flex items-center gap-2 bg-[#000000] text-[#FFFFFF] px-4 py-2 rounded-lg text-[12px] uppercase tracking-wider font-medium hover:opacity-90 transition-opacity self-start sm:self-auto"
                      >
                        <Plus size={16} />
                        <span>New Address</span>
                      </button>
                    </div>

                    {/* Add New Address Form inline */}
                    {showAddAddressModal && (
                      <form
                        onSubmit={handleAddAddress}
                        className="bg-[#FFFFFF] p-6 rounded-xl shadow-sm border border-[#E2E3DF] space-y-6 animate-in fade-in duration-200"
                      >
                        <div className="flex items-center justify-between border-b border-[#E2E3DF] pb-4">
                          <h3 className="font-serif text-xl text-[#1A1C1A]">Add Delivery Address</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] uppercase tracking-wider text-[#45464C] font-medium">Address Label</label>
                            <input
                              type="text"
                              placeholder="e.g. Studio, Home"
                              value={newAddrForm.title}
                              onChange={(e) => setNewAddrForm({ ...newAddrForm, title: e.target.value })}
                              className="bg-[#F4F4F0] text-[#1A1C1A] text-[13px] px-3 py-2.5 rounded-lg border-none focus:ring-1 focus:ring-[#E2E3DF] outline-none transition-shadow w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] uppercase tracking-wider text-[#45464C] font-medium">Contact Phone</label>
                            <input
                              type="tel"
                              placeholder="+91 98765 43210"
                              value={newAddrForm.phone}
                              onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                              className="bg-[#F4F4F0] text-[#1A1C1A] text-[13px] px-3 py-2.5 rounded-lg border-none focus:ring-1 focus:ring-[#E2E3DF] outline-none transition-shadow w-full"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] uppercase tracking-wider text-[#45464C] font-medium">Street Address & Flat / Building *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 402 Highline Residences, Linking Road"
                            value={newAddrForm.street}
                            onChange={(e) => setNewAddrForm({ ...newAddrForm, street: e.target.value })}
                            className="bg-[#F4F4F0] text-[#1A1C1A] text-[13px] px-3 py-2.5 rounded-lg border-none focus:ring-1 focus:ring-[#E2E3DF] outline-none transition-shadow w-full"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] uppercase tracking-wider text-[#45464C] font-medium">City *</label>
                            <input
                              type="text"
                              required
                              placeholder="Mumbai"
                              value={newAddrForm.city}
                              onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                              className="bg-[#F4F4F0] text-[#1A1C1A] text-[13px] px-3 py-2.5 rounded-lg border-none focus:ring-1 focus:ring-[#E2E3DF] outline-none transition-shadow w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] uppercase tracking-wider text-[#45464C] font-medium">State *</label>
                            <input
                              type="text"
                              required
                              placeholder="Maharashtra"
                              value={newAddrForm.state}
                              onChange={(e) => setNewAddrForm({ ...newAddrForm, state: e.target.value })}
                              className="bg-[#F4F4F0] text-[#1A1C1A] text-[13px] px-3 py-2.5 rounded-lg border-none focus:ring-1 focus:ring-[#E2E3DF] outline-none transition-shadow w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] uppercase tracking-wider text-[#45464C] font-medium">PIN Code *</label>
                            <input
                              type="text"
                              required
                              placeholder="400050"
                              maxLength={6}
                              value={newAddrForm.postalCode}
                              onChange={(e) => setNewAddrForm({ ...newAddrForm, postalCode: e.target.value })}
                              className="bg-[#F4F4F0] text-[#1A1C1A] text-[13px] px-3 py-2.5 rounded-lg border-none focus:ring-1 focus:ring-[#E2E3DF] outline-none transition-shadow w-full"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddAddressModal(false)}
                            className="px-4 py-2 text-[12px] uppercase tracking-wider font-medium text-[#45464C] hover:text-[#1A1C1A] transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmittingAddress}
                            className={`bg-[#000000] text-[#FFFFFF] px-6 py-2 rounded-lg text-[12px] uppercase tracking-wider font-medium transition-opacity ${isSubmittingAddress ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                              }`}
                          >
                            {isSubmittingAddress ? 'Saving...' : 'Save Address'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Addresses Cards Grid */}
                    {loadingAddresses ? (
                      <div className="py-12 text-center text-sm text-[#45464C] flex flex-col items-center gap-2">
                        <Loader2 size={24} className="animate-spin text-[#3A6753]" />
                        <span>Loading delivery addresses...</span>
                      </div>
                    ) : savedAddresses.length === 0 ? (
                      <div className="p-12 bg-[#FFFFFF] rounded-xl text-center shadow-sm">
                        <MapPin size={48} className="mx-auto text-[#c6c6cd] mb-3" strokeWidth={1} />
                        <h3 className="font-serif text-xl text-[#1A1C1A]">No addresses registered</h3>
                        <p className="text-[13px] text-[#45464C] mt-1 max-w-sm mx-auto mb-4">
                          Add a primary delivery address for automated express checkout.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowAddAddressModal(true)}
                          className="inline-flex items-center gap-2 bg-[#000000] text-[#FFFFFF] px-6 py-2.5 rounded-lg text-[12px] uppercase tracking-wider font-medium"
                        >
                          <Plus size={16} />
                          <span>Add New Address</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedAddresses.map((addr) => (
                          <article
                            key={addr.id}
                            className={`bg-[#FFFFFF] rounded-xl p-5 shadow-sm border flex flex-col relative overflow-hidden transition-all hover:shadow-md ${addr.isDefault
                              ? 'border-[#3A6753]'
                              : 'border-[#E2E3DF] hover:border-[#1A1C1A]/20'
                              }`}
                          >
                            {addr.isDefault && (
                              <div className="absolute top-0 right-0 bg-[#3A6753] text-[#FFFFFF] text-[10px] uppercase tracking-widest font-medium px-3 py-1 rounded-bl-lg">
                                Primary Default
                              </div>
                            )}
                            <div className="flex flex-col h-full justify-between gap-5">
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <MapPin size={16} className={addr.isDefault ? 'text-[#3A6753]' : 'text-[#45464C]'} />
                                  <span className="text-[13px] uppercase tracking-wider text-[#1A1C1A] font-semibold">
                                    {addr.title || 'Address'}
                                  </span>
                                </div>
                                <p className="text-[14px] text-[#45464C] leading-relaxed">
                                  {addr.street}
                                  {addr.area && `, ${addr.area}`}
                                  <br />
                                  {addr.city}, {addr.state} — {addr.postalCode}
                                  <br />
                                  {addr.country || 'India'}
                                </p>
                                {addr.phone && (
                                  <p className="text-[13px] text-[#45464C] mt-3 pt-3 border-t border-[#E2E3DF] border-dashed">
                                    Contact: {addr.phone}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-3 pt-4 border-t border-[#E2E3DF]">
                                {!addr.isDefault && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetDefaultAddress(addr.id)}
                                    className="px-3 py-1.5 bg-[#F4F4F0] hover:bg-[#E2E3DF] text-[#1A1C1A] rounded-md text-[11px] uppercase tracking-wider font-medium transition-colors"
                                  >
                                    Make Primary
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAddress(addr.id)}
                                  className="px-3 py-1.5 text-[#8B0000] hover:bg-red-50 rounded-md text-[11px] uppercase tracking-wider font-medium transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ===================================================================== */}
                {/* TAB 5: PROFILE & SECURITY (Synchronized with DB User Model)           */}
                {/* ===================================================================== */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-2xl text-[#1A1C1A]">Client Identity</h2>
                        <p className="text-[13px] text-[#45464C]">Manage authenticated sessions and personal dossier.</p>
                      </div>
                      <span className="flex items-center gap-1.5 text-[#3e6b57] text-[11px] uppercase tracking-widest font-medium bg-[#baebd1]/50 px-3 py-1.5 rounded-full self-start sm:self-auto">
                        <Lock size={14} />
                        Verified Secure
                      </span>
                    </div>

                    {profileSuccessMsg && (
                      <div className="p-4 bg-[#baebd1]/30 border border-[#baebd1] rounded-xl text-[#3e6b57] text-[13px] font-medium flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        <span>{profileSuccessMsg}</span>
                      </div>
                    )}

                    {profileErrorMsg && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-[#8B0000] text-[13px] font-medium flex items-center gap-2">
                        <AlertCircle size={18} />
                        <span>{profileErrorMsg}</span>
                      </div>
                    )}

                    {/* Profile Form */}
                    <div className="bg-[#FFFFFF] rounded-xl p-5 md:p-8 shadow-sm">
                      <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] uppercase tracking-wider text-[#45464C] font-medium">Legal Name</label>
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                              className="bg-[#F4F4F0] text-[#1A1C1A] text-[14px] px-4 py-3 rounded-lg border-none focus:ring-1 focus:ring-[#E2E3DF] outline-none transition-shadow w-full"
                              placeholder="Your full name"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] uppercase tracking-wider text-[#45464C] font-medium">Primary Email Address</label>
                            <div className="relative">
                              <input
                                type="email"
                                value={user.email}
                                disabled
                                className="bg-[#E2E3DF]/50 text-[#45464C] text-[14px] px-4 py-3 rounded-lg border-none outline-none w-full cursor-not-allowed pr-10"
                              />
                              <CheckCircle2 size={16} className="absolute right-3 top-3.5 text-[#3A6753]" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 max-w-md">
                          <label className="text-[11px] uppercase tracking-wider text-[#45464C] font-medium">Direct Contact Line</label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="bg-[#F4F4F0] text-[#1A1C1A] text-[14px] px-4 py-3 rounded-lg border-none focus:ring-1 focus:ring-[#E2E3DF] outline-none transition-shadow w-full"
                            placeholder="+91 98765 43210"
                          />
                        </div>

                        <div className="pt-6 mt-2 border-t border-[#E2E3DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="text-[12px] text-[#45464C]">
                            Account Level: <span className="font-semibold text-[#1A1C1A] uppercase tracking-wider ml-1 px-2 py-1 bg-[#F4F4F0] rounded-md">{user.role}</span>
                          </div>

                          <button
                            type="submit"
                            disabled={isUpdatingProfile}
                            className={`bg-[#000000] text-[#FFFFFF] px-8 py-2.5 rounded-lg text-[12px] uppercase tracking-wider font-medium transition-opacity ${isUpdatingProfile ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                              }`}
                          >
                            {isUpdatingProfile ? 'Saving Protocol...' : 'Update Identity'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Review Modal */}
        <AnimatePresence>
          {reviewModalItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setReviewModalItem(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 0 }}
                className="bg-white border border-[#E5E0D8] text-[#181817] shadow-2xl max-w-xl w-full p-5 sm:p-10 relative z-10 my-auto max-h-[90vh] overflow-y-auto rounded-2xl"
              >
                <button
                  onClick={() => setReviewModalItem(null)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 p-1 cursor-pointer z-20 text-[#77736C] hover:text-[#181817]"
                >
                  <X size={20} />
                </button>
                {reviewSuccess ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-14 h-14 text-white bg-[#2D4438] rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="font-serif text-2xl text-[#181817]">Review Submitted</h3>
                    <p className="text-xs max-w-sm mx-auto font-light leading-relaxed text-[#55524D]">
                      Thank you! Your verified review is pending admin approval and will be published shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submitReview} className="space-y-6">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest block mb-1 text-[#2D4438]">
                        VERIFIED PRACTITIONER REVIEW
                      </span>
                      <h3 className="font-serif text-2xl text-[#181817]">Review {reviewModalItem.name}</h3>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider mb-2 text-[#55524D]">Efficacy Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="p-1 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star size={24} className={star <= reviewForm.rating ? 'fill-[#C4A482] text-[#C4A482]' : 'fill-transparent text-[#DDD8CF]'} />
                          </button>
                        ))}
                        <span className="font-mono text-xs font-semibold ml-2 text-[#2D4438]">{reviewForm.rating}.0 / 5.0</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 text-[#55524D]">Skin / Hair Profile</label>
                        <input
                          type="text"
                          value={reviewForm.skinType}
                          onChange={(e) => setReviewForm({ ...reviewForm, skinType: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-lg focus:outline-none bg-[#FBF9F5] border border-[#DDD8CF] text-[#181817] focus:border-[#2D4438]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 text-[#55524D]">Display Name *</label>
                        <input
                          type="text"
                          required
                          value={reviewForm.author}
                          onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-lg focus:outline-none bg-[#FBF9F5] border border-[#DDD8CF] text-[#181817] focus:border-[#2D4438]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 text-[#55524D]">Location (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Delhi"
                          value={reviewForm.location}
                          onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-lg focus:outline-none bg-[#FBF9F5] border border-[#DDD8CF] text-[#181817] focus:border-[#2D4438]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 text-[#55524D]">Headline Title *</label>
                        <input
                          type="text"
                          required
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-lg focus:outline-none bg-[#FBF9F5] border border-[#DDD8CF] text-[#181817] focus:border-[#2D4438]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 text-[#55524D]">Detailed Experience *</label>
                        <textarea
                          required
                          rows={4}
                          value={reviewForm.content}
                          onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-lg focus:outline-none bg-[#FBF9F5] border border-[#DDD8CF] text-[#181817] focus:border-[#2D4438]"
                        />
                      </div>
                    </div>
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button type="button" onClick={() => setReviewModalItem(null)} className="px-5 py-3 text-xs uppercase tracking-widest font-medium text-[#77736C] hover:text-[#181817] cursor-pointer">Cancel</button>
                      <button type="submit" disabled={isSubmittingReview} className={`text-white px-8 py-3 text-xs uppercase tracking-[0.2em] font-semibold transition-colors rounded-xl shadow-xs relative ${isSubmittingReview ? 'bg-[#181817] opacity-90 cursor-not-allowed' : 'bg-[#181817] hover:bg-[#2D4438] cursor-pointer'}`}>
                        {isSubmittingReview ? (
                          <div className="flex items-center gap-2 justify-center">
                            <svg className="animate-spin h-4 w-4 text-[#F6F3ED]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                              <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>SUBMITTING...</span>
                          </div>
                        ) : (
                          'SUBMIT REVIEW'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
      );
}
      export default function AccountPage() {
  return (
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className="min-h-screen bg-[#F9F8F5] py-32 flex flex-col items-center justify-center space-y-4 px-6 text-center">
            <div className="text-3xl mb-4">🚨</div>
            <h2 className="text-xl font-bold text-red-600">Account Dashboard Crashed</h2>
            <pre className="bg-gray-100 p-4 mt-4 text-xs max-w-2xl overflow-auto text-left rounded shadow border border-gray-300">
              {(error as Error)?.message || String(error)}
              {'\n'}
              {(error as Error)?.stack}
            </pre>
            <button
              onClick={() => {
                resetErrorBoundary();
                window.location.href = '/login';
              }}
              className="mt-6 px-6 py-2.5 bg-[#181817] text-white uppercase text-xs font-bold tracking-wider rounded-xl cursor-pointer"
            >
              Go back to Sign In
            </button>
          </div>
        )}
      >
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#F9F8F5] py-32 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-2 border-[#181817] border-t-[#8B0000] rounded-full animate-spin" />
              <div className="text-xs uppercase font-mono tracking-widest text-[#77736C]">
                Loading Client Portal...
              </div>
            </div>
          }
        >
          <AccountPageContent />
        </Suspense>
      </ErrorBoundary>
      );
}
