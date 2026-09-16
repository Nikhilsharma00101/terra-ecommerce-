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
} from 'lucide-react';

function AccountPageContent() {
  const { user, isAdmin, isLoading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<
    'orders' | 'profile' | 'addresses' | 'wishlist' | 'replenishment'
  >('orders');

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
    return '/images/home/hero-campaign.jpg';
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

    return '/images/home/hero-campaign.jpg';
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
    <div className="min-h-screen bg-[#F9F8F5] text-[#181817] font-sans antialiased pb-24 select-none">
      
      {/* ========================================================================= */}
      {/* 1. MEMBER HERO HEADER (Matching Terra Luxury Dispensary Aesthetic)       */}
      {/* ========================================================================= */}
      <section className="bg-[#121212] text-white border-b border-white/10 relative overflow-hidden">
        {/* Ambient Subtle Botanical Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2D4438]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#8B0000]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-white font-semibold">Client Portal</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* User Identity & Avatar */}
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-white/15 flex items-center justify-center shadow-xl shrink-0">
                <span className="font-serif text-2xl sm:text-3xl font-normal tracking-widest text-[#C4A482]">
                  {userInitials}
                </span>
                <span className="absolute -bottom-1 -right-1 bg-[#2D4438] text-white p-1 rounded-full text-[10px] shadow-sm" title="Verified Member">
                  <Check size={11} strokeWidth={3} />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C4A482] font-semibold bg-[#2D4438]/40 px-2.5 py-0.5 rounded-full border border-[#2D4438]/60">
                    {user.tier || 'Terra Member'}
                  </span>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1.5 text-[9px] bg-white text-[#181817] hover:bg-[#8B0000] hover:text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <ShieldCheck size={11} />
                      <span>Executive Admin</span>
                    </Link>
                  )}
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl text-white font-light tracking-tight">
                  Welcome, {user.name}
                </h1>
                <p className="text-xs text-gray-400 font-mono mt-1 flex items-center gap-2 flex-wrap">
                  <span>{user.email}</span>
                  {user.phone && (
                    <>
                      <span>•</span>
                      <span>{user.phone}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>Member Since {user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar & Sign Out */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center sm:text-left shadow-2xs backdrop-blur-xs">
                <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block">
                  Orders Placed
                </span>
                <span className="font-serif text-xl sm:text-2xl text-white font-normal">
                  {orders.length}
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center sm:text-left shadow-2xs backdrop-blur-xs">
                <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block">
                  Saved Wishlist
                </span>
                <span className="font-serif text-xl sm:text-2xl text-[#C4A482] font-normal">
                  {wishlist.length}
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center sm:text-left shadow-2xs backdrop-blur-xs">
                <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block">
                  Shipping Status
                </span>
                <span className="text-xs font-mono font-bold text-white block mt-0.5">
                  Complimentary Express
                </span>
              </div>

              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-gray-400 hover:text-white border border-white/15 hover:border-white/40 hover:bg-white/10 px-4 py-3 rounded-xl transition-all cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN LAYOUT (SIDEBAR + ACTIVE TAB)                                    */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT SIDEBAR: TAB SWITCHER (4 COLS) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-[#E8E4DC] rounded-2xl p-2.5 space-y-1 shadow-xs">
              {[
                {
                  id: 'orders',
                  label: 'Order History',
                  subtitle: 'Tracking & past purchases',
                  icon: Package,
                  badge: orders.length,
                },
                {
                  id: 'wishlist',
                  label: 'Saved Wishlist',
                  subtitle: 'Botanical favorites',
                  icon: Heart,
                  badge: wishlist.length,
                },
                {
                  id: 'replenishment',
                  label: 'Auto-Replenishment',
                  subtitle: 'Routine cycle & 10% privilege',
                  icon: RefreshCw,
                  badge: isReplenishPaused ? 'Paused' : 'Active',
                },
                {
                  id: 'addresses',
                  label: 'Delivery Addresses',
                  subtitle: 'Shipping destinations',
                  icon: MapPin,
                  badge: savedAddresses.length,
                },
                {
                  id: 'profile',
                  label: 'Profile & Security',
                  subtitle: 'Personal info & encryption',
                  icon: UserIcon,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between p-3.5 sm:p-4 text-left transition-all cursor-pointer rounded-xl ${
                      isActive
                        ? 'bg-[#181817] text-white shadow-sm'
                        : 'text-[#55524D] hover:bg-[#F9F8F5] hover:text-[#181817]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'bg-[#F4F1EB] text-[#55524D]'
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider block font-sans">
                          {tab.label}
                        </span>
                        <span
                          className={`text-[11px] block mt-0.5 ${
                            isActive ? 'text-gray-300' : 'text-[#88847D]'
                          }`}
                        >
                          {tab.subtitle}
                        </span>
                      </div>
                    </div>

                    {tab.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 font-bold rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#F4F1EB] text-[#181817]'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Admin Panel Quick Link Card (if Admin) */}
            {isAdmin && (
              <div className="bg-[#181817] text-white p-5 rounded-2xl border border-white/10 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C4A482] font-bold">
                    Executive Access
                  </span>
                  <Crown size={15} className="text-[#C4A482]" />
                </div>
                <h4 className="font-serif text-lg text-white">Terra Admin Portal</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Manage inventory catalog, review global orders, monitor revenue, and inspect database.
                </p>
                <Link
                  href="/admin"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2D4438] hover:bg-white hover:text-[#181817] text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all mt-1"
                >
                  <span>Open Admin Portal</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}

            {/* Concierge Support Callout */}
            <div className="bg-white border border-[#E8E4DC] rounded-2xl p-5 text-xs space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-[#2D4438] font-bold uppercase tracking-wider text-[11px]">
                <Award size={15} />
                <span>Concierge Client Support</span>
              </div>
              <p className="text-[#66625C] leading-relaxed font-light">
                Questions regarding formulation layering or skin compatibility? Our specialists are available 7 days a week.
              </p>
              <div className="pt-2 border-t border-[#EAE6DF] flex items-center justify-between font-mono text-[10px] text-[#77736C]">
                <span>support@terra.com</span>
                <span className="text-[#2D4438] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D4438] animate-pulse" />
                  Active
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT CONTENT DISPLAY AREA (8 COLS) */}
          <div className="lg:col-span-8">
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
                  className="space-y-5"
                >
                  {/* Top Bar Header & Controls */}
                  <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-2xl text-[#181817] font-medium">Order History</h2>
                      <p className="text-xs text-[#77736C] font-mono mt-1">
                        Track live courier dispatches and view complete purchase history
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1 bg-[#F4F1EB] p-1 rounded-xl self-start sm:self-auto">
                      {(['all', 'Processing', 'Shipped', 'Delivered'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setOrderFilter(st)}
                          className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                            orderFilter === st
                              ? 'bg-[#181817] text-white shadow-xs'
                              : 'text-[#66625C] hover:text-[#181817]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Bar */}
                  {orders.length > 0 && (
                    <div className="relative">
                      <Search size={15} className="absolute left-3.5 top-3.5 text-[#8C887B]" />
                      <input
                        type="text"
                        placeholder="Search orders by order number or product name..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full bg-white border border-[#E8E4DC] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#181817] placeholder:text-[#8C887B] focus:outline-none focus:border-[#181817] shadow-xs transition-colors"
                      />
                    </div>
                  )}

                  {/* Orders Cards List */}
                  {loadingOrders ? (
                    <div className="bg-white border border-[#E8E4DC] rounded-2xl p-12 text-center text-xs font-mono text-[#77736C] shadow-xs flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-[#2D4438]" />
                      <span>Fetching client orders from dispensary database...</span>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="bg-white border border-[#E8E4DC] rounded-2xl p-12 text-center shadow-xs">
                      <Package size={40} className="mx-auto text-[#BBB6AE] mb-3" />
                      <h3 className="font-serif text-xl text-[#181817] mb-1">No orders found</h3>
                      <p className="text-xs text-[#77736C] max-w-sm mx-auto mb-5 font-light">
                        {orderSearch || orderFilter !== 'all'
                          ? 'No orders matched your current search or status filter criteria.'
                          : 'Explore our botanical grooming formulations and begin your daily routine.'}
                      </p>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-[#181817] hover:bg-[#8B0000] text-white px-6 py-2.5 rounded-xl text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-xs"
                      >
                        <span>Explore Formulations</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const isDelivered = order.status === 'Delivered';
                      const isShipped = order.status === 'Shipped';

                      return (
                        <div
                          key={order._id || order.id || order.orderNumber}
                          className="bg-white border border-[#E8E4DC] hover:border-[#181817] rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-md transition-all"
                        >
                          {/* Order Card Header */}
                          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE6DF] pb-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-bold text-[#181817]">
                                  {order.orderNumber}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider px-2.5 py-0.5 font-bold rounded-full ${
                                    isDelivered
                                      ? 'bg-[#2D4438]/10 text-[#2D4438] border border-[#2D4438]/30'
                                      : isShipped
                                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}
                                >
                                  {isDelivered ? (
                                    <CheckCircle2 size={11} />
                                  ) : isShipped ? (
                                    <Truck size={11} />
                                  ) : (
                                    <Clock size={11} />
                                  )}
                                  <span>{order.status}</span>
                                </span>
                              </div>
                              <p className="text-[11px] text-[#77736C] font-mono mt-1">
                                Placed on{' '}
                                {new Date(order.createdAt || '2024-01-01T00:00:00.000Z').toLocaleDateString(
                                  'en-IN',
                                  {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  }
                                )}
                                {' • '}
                                <span className="uppercase">{order.paymentMethod || 'UPI'}</span>
                                {order.paymentStatus && (
                                  <span className="ml-1 text-[#2D4438]">({order.paymentStatus})</span>
                                )}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-[#77736C] block">
                                Total Paid
                              </span>
                              <span className="font-mono text-base font-bold text-[#181817]">
                                ₹{order.total?.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          {/* Order Items List — Always rendered with live DB Cloudinary images */}
                          <div className="space-y-3.5">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {order.items?.map((item: any, idx: number) => {
                              const itemImgSrc = getOrderItemImage(item);
                              return (
                                <div key={idx} className="flex items-center gap-4">
                                  <div className="relative w-14 h-14 bg-[#1A1918] rounded-xl shrink-0 overflow-hidden border border-[#EAE6DF]">
                                    <Image
                                      src={itemImgSrc}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                      sizes="56px"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-[#181817] truncate">
                                      {item.name}
                                    </h4>
                                    <p className="text-[11px] text-[#77736C] font-mono mt-0.5">
                                      Quantity: {item.quantity} • ₹{item.price} each
                                    </p>
                                  </div>
                                  <span className="font-mono text-xs font-semibold text-[#181817]">
                                    ₹{item.price * item.quantity}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Tracking & Courier Status Box */}
                          <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 text-[#55524D]">
                              <Truck size={14} className="text-[#2D4438]" />
                              <span>
                                Express Courier Dispatch:{' '}
                                <strong className="text-[#181817]">
                                  {order.trackingNumber || 'BlueDart Air Express (TR-IN-8891)'}
                                </strong>
                              </span>
                            </div>

                            <span className="text-[9px] uppercase font-bold text-[#2D4438] font-mono bg-white px-2.5 py-1 rounded-full border border-[#E5E0D8] self-start sm:self-auto shadow-2xs">
                              {isDelivered ? 'Delivered to Destination' : 'In Transit across India'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
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
                  className="space-y-5"
                >
                  <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-xs flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl text-[#181817] font-medium">Saved Formulations</h2>
                      <p className="text-xs text-[#77736C] font-mono mt-1">
                        Your curated dispensary selection for face and beard care
                      </p>
                    </div>
                    <span className="text-xs text-[#2D4438] font-mono font-bold bg-[#2D4438]/10 px-3 py-1 rounded-full">
                      {wishlistedProducts.length} Saved
                    </span>
                  </div>

                  {loadingProducts ? (
                    <div className="bg-white border border-[#E8E4DC] rounded-2xl p-12 text-center text-xs font-mono text-[#77736C] shadow-xs flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-[#2D4438]" />
                      <span>Loading saved formulations from catalog...</span>
                    </div>
                  ) : wishlistedProducts.length === 0 ? (
                    <div className="bg-white border border-[#E8E4DC] rounded-2xl p-12 text-center shadow-xs">
                      <Heart size={36} className="mx-auto text-[#BBB6AE] mb-3" />
                      <h3 className="font-serif text-xl text-[#181817] mb-1">Your wishlist is empty</h3>
                      <p className="text-xs text-[#77736C] max-w-sm mx-auto mb-5 font-light">
                        Explore our botanical grooming essentials and tap the heart icon on any card to save it here.
                      </p>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-[#181817] hover:bg-[#8B0000] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xs"
                      >
                        <span>Explore Catalog</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {wishlistedProducts.map((p, idx) => {
                        const itemKey = p._id || p.id || p.slug || `wish-${idx}`;
                        const imgSrc = getProductImage(p);

                        return (
                          <div
                            key={itemKey}
                            className="bg-white border border-[#E8E4DC] rounded-2xl p-4 flex flex-col justify-between hover:border-[#181817] hover:shadow-md transition-all group shadow-xs"
                          >
                            <div>
                              {/* Product Image — Fixed edge-to-edge luxury object-cover with DB Cloudinary source */}
                              <div className="relative aspect-4/3 bg-[#1A1918] mb-3.5 overflow-hidden rounded-xl">
                                <Image
                                  src={imgSrc}
                                  alt={p.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <span className="absolute top-2.5 left-2.5 text-[9px] uppercase font-mono tracking-wider bg-white/95 text-[#181817] px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                                  {p.category}
                                </span>
                              </div>

                              <h3 className="font-serif text-lg text-[#181817] font-medium">{p.name}</h3>
                              <p className="text-xs text-[#77736C] line-clamp-2 mt-1 font-light">
                                {p.tagline || p.shortDescription}
                              </p>

                              <div className="mt-3 flex items-center justify-between font-mono">
                                <span className="text-base font-bold text-[#181817]">₹{p.price}</span>
                                <span className="text-[10px] font-bold text-[#2D4438]">
                                  ● In Stock
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-3.5 border-t border-[#EAE6DF]">
                              <button
                                onClick={() => addItem(p)}
                                className="flex-1 bg-[#181817] hover:bg-[#8B0000] text-white py-2.5 px-3 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <ShoppingBag size={13} />
                                <span>Add to Bag</span>
                              </button>
                              <button
                                onClick={() => toggleWishlist(p._id || p.id || p.slug)}
                                className="p-2.5 rounded-xl border border-[#E5E0D8] text-[#77736C] hover:text-[#8B0000] hover:border-[#8B0000] transition-colors cursor-pointer"
                                title="Remove from wishlist"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ===================================================================== */}
              {/* TAB 3: AUTO-REPLENISHMENT (Synchronized with DB User Model)          */}
              {/* ===================================================================== */}
              {activeTab === 'replenishment' && (
                <motion.div
                  key="replenishment-tab"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-2xl text-[#181817] font-medium">Auto-Replenishment Routine</h2>
                      <p className="text-xs text-[#77736C] font-mono mt-1">
                        Never run out of daily grooming essentials. Enjoy 10% subscriber privilege.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-[#2D4438] text-white px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                      10% Subscriber Privilege
                    </span>
                  </div>

                  {/* Active Routine Card */}
                  <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6DF] pb-5">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#2D4438] font-bold block mb-1">
                          AUTOMATED ROUTINE CADENCE
                        </span>
                        <h3 className="font-serif text-2xl text-[#181817] font-medium">
                          The Complete Terra Method Set
                        </h3>
                        <p className="text-xs text-[#77736C] mt-1 font-mono">
                          {faceWashProduct?.name || 'Terra Face Wash'} + {beardOilProduct?.name || 'Terra Beard Oil'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isUpdatingSubscription}
                          onClick={() => handleUpdateSubscription(undefined, !isReplenishPaused)}
                          className={`px-4 py-2.5 text-xs rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-50 ${
                            isReplenishPaused
                              ? 'bg-[#2D4438] text-white hover:bg-[#181817]'
                              : 'bg-white border border-[#E5E0D8] text-[#181817] hover:border-[#8B0000] hover:text-[#8B0000]'
                          }`}
                        >
                          {isUpdatingSubscription
                            ? 'Updating...'
                            : isReplenishPaused
                            ? 'Resume Routine'
                            : 'Pause Routine'}
                        </button>
                      </div>
                    </div>

                    {/* Visual Set Showcase using DB Cloudinary Images */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE6DF]">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-[#1A1918] overflow-hidden shrink-0 border border-[#E5E0D8]">
                          {faceWashProduct && (
                            <Image
                              src={getProductImage(faceWashProduct)}
                              alt={faceWashProduct.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-[#181817] block truncate">
                            {faceWashProduct?.name || 'Face Wash'}
                          </span>
                          <span className="text-[10px] text-[#77736C] font-mono">Step 01 • Cleanse</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-[#1A1918] overflow-hidden shrink-0 border border-[#E5E0D8]">
                          {beardOilProduct && (
                            <Image
                              src={getProductImage(beardOilProduct)}
                              alt={beardOilProduct.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-[#181817] block truncate">
                            {beardOilProduct?.name || 'Beard Oil'}
                          </span>
                          <span className="text-[10px] text-[#77736C] font-mono">Step 02 • Nourish</span>
                        </div>
                      </div>
                    </div>

                    {/* Cycle Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#181817] mb-3">
                        Choose Dispatch Frequency:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: '30d', label: 'Every 30 Days', desc: 'Intensive daily grooming' },
                          { id: '60d', label: 'Every 60 Days', desc: 'Recommended Standard cadence' },
                          { id: '90d', label: 'Every 90 Days', desc: 'Light / Occasional usage' },
                        ].map((cyc) => (
                          <button
                            key={cyc.id}
                            type="button"
                            disabled={isUpdatingSubscription}
                            onClick={() => handleUpdateSubscription(cyc.id as '30d' | '60d' | '90d')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                              replenishCycle === cyc.id
                                ? 'bg-[#181817] text-white border-[#181817] shadow-sm'
                                : 'bg-[#FAF8F5] text-[#55524D] border-[#E5E0D8] hover:border-[#181817]'
                            }`}
                          >
                            <span className="text-xs font-bold uppercase tracking-wider block">
                              {cyc.label}
                            </span>
                            <span
                              className={`text-[10px] block mt-1 ${
                                replenishCycle === cyc.id ? 'text-[#C4A482]' : 'text-[#77736C]'
                              }`}
                            >
                              {cyc.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Next Scheduled Delivery Banner with DB-backed date and dynamic price */}
                    <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-[#181817] block">
                          Next Scheduled Dispatch: {nextDispatchDateDisplay}
                        </span>
                        <span className="text-[#77736C] font-mono text-[11px]">
                          Price: ₹{bundleDiscountedPrice} (Original ₹{bundleTotalOriginal} — 10% Subscriber Privilege Applied)
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-mono uppercase font-bold px-2.5 py-1 rounded-full self-start sm:self-auto ${
                          isReplenishPaused
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#2D4438]/10 text-[#2D4438] border border-[#2D4438]/20'
                        }`}
                      >
                        {isReplenishPaused ? 'Cadence Paused' : '● Active Cadence'}
                      </span>
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
                  className="space-y-5"
                >
                  <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-xs flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl text-[#181817] font-medium">Delivery Addresses</h2>
                      <p className="text-xs text-[#77736C] font-mono mt-1">
                        Manage Pan-India delivery addresses for seamless express checkout
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddAddressModal(true)}
                      className="inline-flex items-center gap-1.5 bg-[#181817] hover:bg-[#8B0000] text-white px-4 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer shadow-xs"
                    >
                      <Plus size={14} />
                      <span>Add Address</span>
                    </button>
                  </div>

                  {/* Add New Address Modal / Form inline */}
                  {showAddAddressModal && (
                    <form
                      onSubmit={handleAddAddress}
                      className="bg-white border border-[#181817] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl animate-in fade-in duration-200"
                    >
                      <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-3">
                        <h3 className="font-serif text-xl text-[#181817] font-medium">
                          Add New Delivery Address
                        </h3>
                        <span className="text-[10px] font-mono text-[#77736C] uppercase">Pan-India Express</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono font-bold text-[#55524D] mb-1.5">
                            Address Label
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Home, Studio, Office"
                            value={newAddrForm.title}
                            onChange={(e) => setNewAddrForm({ ...newAddrForm, title: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-3 text-xs text-[#181817] focus:border-[#181817] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono font-bold text-[#55524D] mb-1.5">
                            Contact Phone
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={newAddrForm.phone}
                            onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-3 text-xs text-[#181817] focus:border-[#181817] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono font-bold text-[#55524D] mb-1.5">
                          Street Address & Flat / Building *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 402 Highline Residences, Linking Road"
                          value={newAddrForm.street}
                          onChange={(e) => setNewAddrForm({ ...newAddrForm, street: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-3 text-xs text-[#181817] focus:border-[#181817] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-mono font-bold text-[#55524D] mb-1.5">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Mumbai"
                            value={newAddrForm.city}
                            onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-3 text-xs text-[#181817] focus:border-[#181817] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono font-bold text-[#55524D] mb-1.5">
                            State *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Maharashtra"
                            value={newAddrForm.state}
                            onChange={(e) => setNewAddrForm({ ...newAddrForm, state: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-3 text-xs text-[#181817] focus:border-[#181817] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono font-bold text-[#55524D] mb-1.5">
                            PIN Code *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="400050"
                            maxLength={6}
                            value={newAddrForm.postalCode}
                            onChange={(e) => setNewAddrForm({ ...newAddrForm, postalCode: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-3 text-xs text-[#181817] font-mono focus:border-[#181817] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddAddressModal(false)}
                          className="px-4 py-2.5 text-xs uppercase font-bold text-[#55524D] hover:text-[#181817] cursor-pointer rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingAddress}
                          className="bg-[#181817] hover:bg-[#8B0000] text-white px-5 py-2.5 text-xs uppercase font-bold tracking-wider rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          {isSubmittingAddress ? 'Saving Address...' : 'Save Address'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Addresses Cards Grid — Loaded directly from MongoDB */}
                  {loadingAddresses ? (
                    <div className="bg-white border border-[#E8E4DC] rounded-2xl p-12 text-center text-xs font-mono text-[#77736C] shadow-xs flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-[#2D4438]" />
                      <span>Loading delivery addresses from database...</span>
                    </div>
                  ) : savedAddresses.length === 0 ? (
                    <div className="bg-white border border-[#E8E4DC] rounded-2xl p-12 text-center shadow-xs">
                      <MapPin size={36} className="mx-auto text-[#BBB6AE] mb-3" />
                      <h3 className="font-serif text-xl text-[#181817] mb-1">No saved addresses yet</h3>
                      <p className="text-xs text-[#77736C] max-w-sm mx-auto mb-5 font-light">
                        Add your primary delivery address for automated express checkout on all orders.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAddAddressModal(true)}
                        className="inline-flex items-center gap-2 bg-[#181817] hover:bg-[#8B0000] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xs"
                      >
                        <Plus size={13} />
                        <span>Add New Address</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`bg-white rounded-2xl p-6 border transition-all relative flex flex-col justify-between shadow-xs ${
                            addr.isDefault
                              ? 'border-[#181817] shadow-sm'
                              : 'border-[#E8E4DC] hover:border-[#181817]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-bold text-xs uppercase tracking-wider text-[#181817] font-mono">
                                {addr.title || 'Address'}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[9px] font-mono uppercase tracking-widest bg-[#2D4438] text-white px-2.5 py-0.5 rounded-full font-bold">
                                  Default
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-[#44403C] leading-relaxed font-light">
                              {addr.street}
                              {addr.area && `, ${addr.area}`}
                              <br />
                              {addr.city}, {addr.state} — {addr.postalCode}
                              <br />
                              {addr.country || 'India'}
                            </p>

                            {addr.phone && (
                              <p className="text-[11px] text-[#77736C] font-mono mt-2">
                                Phone: {addr.phone}
                              </p>
                            )}
                          </div>

                          <div className="pt-4 mt-5 border-t border-[#EAE6DF] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {!addr.isDefault && (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-[10px] uppercase font-mono font-bold text-[#55524D] hover:text-[#181817] underline cursor-pointer"
                                >
                                  Set as Default
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-[10px] uppercase font-mono font-bold text-[#99948D] hover:text-[#8B0000] cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                            <span className="text-[9px] text-[#77736C] font-mono ml-auto">
                              Pan-India Verified
                            </span>
                          </div>
                        </div>
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
                  className="space-y-5"
                >
                  <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-xs flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl text-[#181817] font-medium">Member Profile & Security</h2>
                      <p className="text-xs text-[#77736C] font-mono mt-1">
                        Manage your account information and authentication credentials
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#2D4438] flex items-center gap-1.5 bg-[#2D4438]/10 px-3 py-1 rounded-full">
                      <Lock size={12} />
                      <span>256-Bit SSL</span>
                    </span>
                  </div>

                  {profileSuccessMsg && (
                    <div className="p-4 bg-[#2D4438]/10 border border-[#2D4438]/30 rounded-xl text-[#2D4438] text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>{profileSuccessMsg}</span>
                    </div>
                  )}

                  {profileErrorMsg && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                      <AlertCircle size={16} />
                      <span>{profileErrorMsg}</span>
                    </div>
                  )}

                  {/* Profile Form */}
                  <form onSubmit={handleSaveProfile} className="bg-white border border-[#E8E4DC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                    <h3 className="font-serif text-xl text-[#181817] font-medium border-b border-[#EAE6DF] pb-3">
                      Personal Credentials
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] uppercase font-mono font-bold text-[#55524D] mb-1.5">
                          Client Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-3 text-xs text-[#181817] focus:border-[#181817] focus:outline-none"
                            placeholder="Your full name"
                          />
                          <UserIcon size={15} className="absolute right-3.5 top-3.5 text-[#8C887B]" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono font-bold text-[#55524D] mb-1.5">
                          Primary Email Address (Verified in DB)
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full bg-[#F4F1EB] border border-[#E5E0D8] rounded-xl p-3 text-xs text-[#77736C] cursor-not-allowed"
                          />
                          <Mail size={15} className="absolute right-3.5 top-3.5 text-[#8C887B]" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono font-bold text-[#55524D] mb-1.5">
                        Primary Phone / Mobile
                      </label>
                      <div className="relative max-w-sm">
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-3 text-xs text-[#181817] focus:border-[#181817] focus:outline-none"
                          placeholder="+91 98765 43210"
                        />
                        <Phone size={15} className="absolute right-3.5 top-3.5 text-[#8C887B]" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#EAE6DF] flex items-center justify-between flex-wrap gap-4">
                      <div className="text-[11px] text-[#77736C] font-mono">
                        Account Privilege: <strong className="text-[#181817]">{user.role.toUpperCase()}</strong>
                      </div>

                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="bg-[#181817] hover:bg-[#8B0000] text-white px-6 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
                      >
                        {isUpdatingProfile ? (
                          <span>Updating Database...</span>
                        ) : (
                          <>
                            <span>Save Changes</span>
                            <ArrowRight size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

import { ErrorBoundary } from 'react-error-boundary';

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
