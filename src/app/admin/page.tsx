'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Database,
  ShieldCheck,
  TrendingUp,
  Clock,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  RefreshCw,
  Search,
  Check,
  X,
  DollarSign,
  Box,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  ArrowLeft as MoveLeft,
  ArrowRight as MoveRight,
  Image as ImageIcon,
  Loader2,
  Truck,
  MapPin,
  CreditCard,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Printer,
  Copy,
  CheckCircle2,
  AlertCircle,
  FileText,
  CheckCheck,
  Menu,
  ChevronDown,
  Activity,
  Star,
  MessageSquare,
} from 'lucide-react';

interface AdminSelectOption<T extends string = string> {
  value: T;
  label: string;
  badge?: string;
  dotColor?: string;
  icon?: React.ReactNode;
}

interface AdminSelectProps<T extends string = string> {
  value: T;
  onChange: (val: T) => void;
  options: AdminSelectOption<T>[];
  variant?: 'default' | 'modal' | 'status-order' | 'status-payment';
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  align?: 'left' | 'right';
  title?: string;
}

function AdminCustomSelect<T extends string = string>({
  value,
  onChange,
  options,
  variant = 'default',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  disabled = false,
  align = 'left',
  title,
}: AdminSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('keydown', handleKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  let triggerClasses = '';
  if (variant === 'modal') {
    triggerClasses = `w-full bg-[#FAF8F5] border border-[#DDD8CF] hover:border-[#2D4438] p-3 text-sm text-[#181817] flex items-center justify-between gap-2 transition-colors ${
      isOpen ? 'border-[#2D4438] bg-[#FFFFFF]' : ''
    }`;
  } else if (variant === 'status-order') {
    const isDelivered = value === 'Delivered';
    const isShipped = value === 'Shipped';
    const isCancelled = value === 'Cancelled';
    const colorStyle = isDelivered
      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
      : isShipped
      ? 'bg-sky-50 text-sky-800 border-sky-300'
      : isCancelled
      ? 'bg-rose-50 text-rose-800 border-rose-300'
      : 'bg-amber-50 text-amber-900 border-amber-300';
    triggerClasses = `text-xs font-bold uppercase px-2.5 py-1.5 border flex items-center justify-between gap-2 transition-all ${colorStyle}`;
  } else if (variant === 'status-payment') {
    const isPaid = value === 'Paid';
    const isFailed = value === 'Failed';
    const colorStyle = isPaid
      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
      : isFailed
      ? 'bg-rose-50 text-rose-800 border-rose-300'
      : 'bg-amber-50 text-amber-900 border-amber-300';
    triggerClasses = `text-[11px] font-bold uppercase px-2.5 py-1 border flex items-center justify-between gap-2 transition-all ${colorStyle}`;
  } else {
    triggerClasses = `bg-[#FFFFFF] border border-[#DDD8CF] hover:border-[#2D4438] text-xs font-semibold text-[#181817] px-3 py-1.5 flex items-center justify-between gap-2.5 transition-colors shadow-2xs ${
      isOpen ? 'border-[#2D4438]' : ''
    }`;
  }

  return (
    <div
      ref={ref}
      className={`relative ${className.includes('w-full') ? 'w-full block' : 'inline-block'} ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`${triggerClasses} ${buttonClassName} cursor-pointer disabled:opacity-50`}
        title={title}
      >
        <div className="flex items-center gap-1.5 truncate">
          {selectedOption?.dotColor && (
            <span className={`w-1.5 h-1.5 rounded-full ${selectedOption.dotColor} shrink-0`} />
          )}
          {selectedOption?.icon}
          <span className="truncate">{selectedOption?.label || value}</span>
        </div>
        <ChevronDown
          size={12}
          className={`shrink-0 transition-transform duration-200 text-[#77736C] ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-1 min-w-[160px] bg-[#FAF8F5] border border-[#DDD8CF] shadow-[0_16px_36px_-6px_rgba(0,0,0,0.2)] p-1 z-50 animate-in fade-in zoom-in-95 duration-100 ${menuClassName}`}
        >
          <div className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between ${
                    variant === 'modal' ? 'px-3 py-2 text-sm' : 'px-2.5 py-1.5 text-xs'
                  } text-left cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#2D4438] text-white font-medium'
                      : 'text-[#181817] hover:bg-[#F0EAE1]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.dotColor && (
                      <span className={`w-2 h-2 rounded-full ${opt.dotColor} shrink-0`} />
                    )}
                    {opt.icon}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {isSelected && <Check size={12} className="text-white shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<
    'overview' | 'products' | 'orders' | 'users' | 'database' | 'reviews'
  >('overview');

  // Navigation & UI State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Stats
  const [stats, setStats] = useState<any /* eslint-disable-line @typescript-eslint/no-explicit-any */>({
    totalRevenue: 0,
    totalOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    productsCount: 0,
    lowStockCount: 0,
    usersCount: 0,
    recentOrders: [],
    dbStatus: { connected: false, state: 'Checking...', hasUri: false },
  });

  // Products
  const [products, setProducts] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */>([]);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSlugAuto, setIsSlugAuto] = useState(true);

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Orders
  const [orders, setOrders] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('All');
  const [orderSortBy, setOrderSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<{ [key: string]: string }>({});

  // Order Details Modal State
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [modalTrackingInput, setModalTrackingInput] = useState('');
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState(false);
  const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState(false);
  const [modalTrackingSaved, setModalTrackingSaved] = useState(false);
  const [modalViewTab, setModalViewTab] = useState<'overview' | 'invoice'>('overview');

  // Users
  const [usersList, setUsersList] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */>([]);

  // Reviews
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [updatingReviewStatus, setUpdatingReviewStatus] = useState<string | null>(null);
  const [isReviewEditModalOpen, setIsReviewEditModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({
    title: '',
    content: '',
    rating: 5,
    author: '',
    date: '',
    location: '',
  });
  const [reviewCurrentPage, setReviewCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  
  const indexOfLastReview = reviewCurrentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewsList.slice(indexOfFirstReview, indexOfLastReview);
  const totalReviewPages = Math.ceil(reviewsList.length / reviewsPerPage);

  // Database feedback
  const [dbActionMessage, setDbActionMessage] = useState('');
  const [dbActionLoading, setDbActionLoading] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);

  // Product Form State
  const [productForm, setProductForm] = useState<{
    name: string;
    slug: string;
    category: 'Face' | 'Beard' | 'Sets';
    purpose: 'Cleanse' | 'Nourish' | 'The Method';
    tagline: string;
    shortDescription: string;
    fullDescription: string;
    price: number;
    compareAtPrice: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
    size: string;
    stock: number;
    featuredImage: string;
    secondaryImage?: string;
    badge: string;
    images: Array<{ url: string; alt: string; caption?: string }>;
  }>({
    name: '',
    slug: '',
    category: 'Face',
    purpose: 'Cleanse',
    tagline: '',
    shortDescription: '',
    fullDescription: '',
    price: 699,
    compareAtPrice: '',
    size: '100ml',
    stock: 100,
    featuredImage: '',
    secondaryImage: '',
    badge: 'Bestseller',
    images: [],
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Stats error:', e);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products?all=true');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error('Products error:', e);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Orders error:', e);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users || []);
      }
    } catch (e) {
      console.error('Users error:', e);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      // Pass status=all to fetch pending, approved, and rejected reviews (assuming backend supports it or we just fetch without status to get all)
      // Actually backend defaults to approved. We need to pass status='all' if we want all, wait, looking at `api/reviews/route.ts`...
      // It sets `status = searchParams.get('status') || 'approved'`. So passing `status=` fetches all, wait, let me use `status=` (empty string).
      // Ah wait, `api/reviews/route.ts` does: `if (status) { query.status = status; }` so if we pass `status=` it won't filter by status!
      const res = await fetch('/api/reviews?status=all');
      if (res.ok) {
        const data = await res.json();
        setReviewsList(data.reviews || []);
      }
    } catch (e) {
      console.error('Reviews error:', e);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/login?redirect=/admin&error=admin_required');
      return;
    }

    if (isAdmin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStats();
      fetchProducts();
      fetchOrders();
      fetchUsers();
      fetchReviews();
    }
  }, [user, isAdmin, isLoading, router, fetchStats, fetchProducts, fetchOrders, fetchUsers, fetchReviews]);

  useEffect(() => {
    if (selectedOrder) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalTrackingInput(selectedOrder.trackingNumber || '');
      setModalTrackingSaved(false);
      setModalViewTab('overview');
    }
  }, [selectedOrder]);

  // Product Actions
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setIsSlugAuto(true);
    setUploadError('');
    setProductForm({
      name: '',
      slug: '',
      category: 'Face',
      purpose: 'Cleanse',
      tagline: '',
      shortDescription: '',
      fullDescription: '',
      price: 699,
      compareAtPrice: '',
      size: '100ml',
      stock: 100,
      featuredImage: '',
      secondaryImage: '',
      badge: '',
      images: [],
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
    setEditingProduct(p);
    setIsSlugAuto(false);
    setUploadError('');
    const existingImages =
      Array.isArray(p.images) && p.images.length > 0
        ? p.images
        : p.featuredImage
        ? [{ url: p.featuredImage, alt: p.name || 'Product', caption: '' }]
        : [];

    setProductForm({
      name: p.name,
      slug: p.slug,
      category: p.category,
      purpose: p.purpose,
      tagline: p.tagline || '',
      shortDescription: p.shortDescription || '',
      fullDescription: p.fullDescription || '',
      price: p.price,
      compareAtPrice: p.compareAtPrice || '',
      size: p.size || '',
      stock: p.stock !== undefined ? p.stock : 100,
      featuredImage: p.featuredImage || (existingImages[0]?.url || ''),
      secondaryImage: p.secondaryImage || (existingImages[1]?.url || ''),
      badge: p.badge || '',
      images: existingImages,
    });
    setIsProductModalOpen(true);
  };

  const handleUploadFiles = async (files: FileList | File[]) => {
    setUploadError('');
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));

    if (fileArray.length === 0) {
      setUploadError('Please select valid image files.');
      return;
    }

    const currentImages = productForm.images || [];
    if (currentImages.length >= 5) {
      setUploadError('Maximum limit of 5 images per product reached.');
      return;
    }

    const availableSlots = 5 - currentImages.length;
    const filesToUpload = fileArray.slice(0, availableSlots);

    if (fileArray.length > availableSlots) {
      setUploadError(`Only ${availableSlots} more image(s) can be added (max 5 total).`);
    }

    setUploadingImage(true);

    try {
      const newImages = [...currentImages];
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          newImages.push({
            url: data.url,
            alt: productForm.name || 'Product Image',
            caption: '',
          });
        } else {
          setUploadError(data.error || 'Failed to upload image to Cloudinary.');
        }
      }

      setProductForm({
        ...productForm,
        images: newImages,
        featuredImage: newImages[0]?.url || productForm.featuredImage,
        secondaryImage: newImages[1]?.url || '',
      });
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      console.error('Upload error:', err);
      setUploadError('Network error uploading image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const images = [...(productForm.images || [])];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const temp = images[index];
    images[index] = images[targetIndex];
    images[targetIndex] = temp;

    setProductForm({
      ...productForm,
      images,
      featuredImage: images[0]?.url || productForm.featuredImage,
      secondaryImage: images[1]?.url || '',
    });
  };

  const handleRemoveImage = (index: number) => {
    const images = [...(productForm.images || [])];
    images.splice(index, 1);
    setProductForm({
      ...productForm,
      images,
      featuredImage: images[0]?.url || '',
      secondaryImage: images[1]?.url || '',
    });
  };

  const notifyProductsUpdated = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('terra_products_updated'));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        compareAtPrice:
          productForm.compareAtPrice && productForm.compareAtPrice !== ''
            ? Number(productForm.compareAtPrice)
            : undefined,
        stock: Number(productForm.stock),
        featuredImage:
          productForm.images && productForm.images.length > 0
            ? productForm.images[0].url
            : productForm.featuredImage || '',
        secondaryImage:
          productForm.images && productForm.images.length > 1
            ? productForm.images[1].url
            : '',
      };

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct._id || editingProduct.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsProductModalOpen(false);
          fetchProducts();
          // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStats();
          notifyProductsUpdated();
        } else {
          const err = await res.json();
          alert(err.error || 'Failed to update product');
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsProductModalOpen(false);
          fetchProducts();
          // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStats();
          notifyProductsUpdated();
        } else {
          const err = await res.json();
          alert(err.error || 'Failed to create product');
        }
      }
    } catch (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      alert(e.message || 'Error saving product');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (idOrSlug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${idOrSlug}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
        // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStats();
        notifyProductsUpdated();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete');
      }
    } catch (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      alert(e.message || 'Failed to delete');
    }
  };
  // Review Updates
  const handleUpdateReviewStatus = async (reviewId: string, status: 'pending' | 'approved' | 'rejected') => {
    setUpdatingReviewStatus(reviewId);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchReviews();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update review status');
      }
    } catch (e) {
      console.error('Update review status error:', e);
    } finally {
      setUpdatingReviewStatus(null);
    }
  };
  const handleOpenEditReview = (r: any) => {
    setEditingReviewId(r._id);
    
    // Extract local YYYY-MM-DD safely to avoid UTC timezone shifts
    let localDateStr = '';
    if (r.createdAt || r.date) {
      const d = new Date(r.createdAt || r.date);
      if (!isNaN(d.getTime())) {
        localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }
    }

    setReviewForm({
      title: r.title || '',
      content: r.content || '',
      rating: r.rating || 5,
      author: r.author || '',
      location: r.location || '',
      date: localDateStr,
    });
    setIsReviewEditModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReviewId) return;
    setIsSavingReview(true);
    try {
      const res = await fetch(`/api/reviews/${editingReviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      if (res.ok) {
        fetchReviews();
        setIsReviewEditModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update review');
      }
    } catch (e) {
      console.error('Save review error:', e);
    } finally {
      setIsSavingReview(false);
    }
  };

  // Order Updates
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingOrderStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchOrders();
        // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStats();
        if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderNumber === orderId)) {
          setSelectedOrder((prev: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (e) {
      console.error('Update status error:', e);
    } finally {
      setUpdatingOrderStatus(false);
    }
  };

  const handleUpdatePaymentStatus = async (
    orderId: string,
    paymentStatus: 'Paid' | 'Pending' | 'Failed'
  ) => {
    setUpdatingPaymentStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });
      if (res.ok) {
        fetchOrders();
        // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStats();
        if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderNumber === orderId)) {
          setSelectedOrder((prev: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (prev ? { ...prev, paymentStatus } : null));
        }
      }
    } catch (e) {
      console.error('Update payment status error:', e);
    } finally {
      setUpdatingPaymentStatus(false);
    }
  };

  const handleSaveTracking = async (orderId: string, directTracking?: string) => {
    const tracking = directTracking !== undefined ? directTracking : trackingInputs[orderId];
    if (!tracking) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: tracking, status: 'Shipped' }),
      });
      if (res.ok) {
        if (directTracking !== undefined) {
          setModalTrackingSaved(true);
          setTimeout(() => setModalTrackingSaved(false), 2500);
        } else {
          alert(`Tracking number #${tracking} saved.`);
        }
        fetchOrders();
        // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStats();
        if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderNumber === orderId)) {
          setSelectedOrder((prev: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
            prev ? { ...prev, trackingNumber: tracking, status: 'Shipped' } : null
          );
        }
      }
    } catch (e) {
      console.error('Tracking update error:', e);
    }
  };

  const handleCopyText = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  // Dynamic Product Image Resolver for Order Items
  const resolveOrderItemImage = (
    item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
  ): { image: string; slug: string; category: string; productName: string } => {
    const itemName = (item?.name || '').trim();
    const normalizedName = itemName.toLowerCase();
    const itemPid = (item?.productId || item?.slug || '').toString().toLowerCase().trim();

    // 1. Search in live admin products state
    const matched = products.find((p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
      const pId = (p._id || p.id || '').toString().toLowerCase();
      const pSlug = (p.slug || '').toLowerCase();
      const pName = (p.name || '').toLowerCase().trim();

      if (itemPid && (pId === itemPid || pSlug === itemPid)) return true;
      if (item?.slug && pSlug === item.slug.toLowerCase()) return true;
      if (normalizedName && (pName === normalizedName || pSlug === normalizedName)) return true;

      if (
        (normalizedName.includes('face') || normalizedName.includes('wash')) &&
        (p.category === 'Face' || pSlug.includes('face'))
      )
        return true;
      if (
        (normalizedName.includes('beard') || normalizedName.includes('oil')) &&
        (p.category === 'Beard' || pSlug.includes('beard'))
      )
        return true;
      if (
        (normalizedName.includes('method') ||
          normalizedName.includes('set') ||
          normalizedName.includes('routine')) &&
        (p.category === 'Sets' || pSlug.includes('method') || p.isBundle)
      )
        return true;

      return false;
    });

    const slug =
      matched?.slug ||
      (normalizedName.includes('beard')
        ? 'beard-oil'
        : normalizedName.includes('face')
        ? 'face-wash'
        : 'sets');
    const category = matched?.category
      ? `${matched.category} Care`
      : normalizedName.includes('beard')
      ? 'Beard Care'
      : normalizedName.includes('face')
      ? 'Face Care'
      : 'The Routine';
    const productName = matched?.name || itemName || 'Terra Grooming Product';

    if (matched) {
      const dbImg =
        (matched.featuredImage &&
          typeof matched.featuredImage === 'string' &&
          matched.featuredImage.trim()) ||
        (matched.images &&
          Array.isArray(matched.images) &&
          matched.images.length > 0 &&
          matched.images[0]?.url) ||
        (matched.secondaryImage &&
          typeof matched.secondaryImage === 'string' &&
          matched.secondaryImage.trim());
      if (dbImg) return { image: dbImg, slug, category, productName };
    }

    if (item?.image && typeof item.image === 'string' && item.image.trim() !== '') {
      return { image: item.image, slug, category, productName };
    }

    return { image: '/images/home/hero-products.jpeg', slug, category, productName };
  };

  const amountToWords = (amount: number): string => {
    const num = Math.round(amount || 0);
    if (num <= 0) return 'Zero Rupees Only';
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function convert(n: number): string {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
    }

    return `${convert(num).trim()} Rupees Only`;
  };

  const getItemHsn = (itemName: string): string => {
    const n = (itemName || '').toLowerCase();
    if (n.includes('beard') || n.includes('oil')) return '33059040';
    if (n.includes('wash') || n.includes('cleanse')) return '33049910';
    return '33049990';
  };

  // User Role Promotion
  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change this user's role to ${newRole.toUpperCase()}?`)) {
      return;
    }
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (e) {
      console.error('Role update error:', e);
    }
  };

  // Database Actions



  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchProducts(),
        fetchOrders(),
        fetchUsers(),
      ]);
    } catch (e) {
      console.error('Refresh error:', e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const { totalBeardOil, totalFaceWash } = React.useMemo(() => {
    let beard = 0;
    let face = 0;
    orders.forEach((order) => {
      if (order.status !== 'Cancelled') {
        order.items?.forEach((item: any) => {
          const name = (item.name || '').toLowerCase();
          const qty = item.quantity || 1;
          const isSet = name.includes('set') || name.includes('method') || name.includes('duo');
          const isBeard = name.includes('beard');
          const isFace = name.includes('face') || name.includes('cleanse');
          
          if (isSet) {
            beard += qty;
            face += qty;
          } else {
            if (isBeard) beard += qty;
            if (isFace) face += qty;
          }
        });
      }
    });
    return { totalBeardOil: beard, totalFaceWash: face };
  }, [orders]);

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F6F3ED] flex items-center justify-center text-[#181817]">
        <div className="text-center space-y-3">
          <ShieldCheck size={40} className="mx-auto text-[#2D4438] animate-pulse" />
          <p className="text-sm font-semibold tracking-wider uppercase text-[#57534E]">
            Checking Admin Access...
          </p>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((p) => {
    // 1. Category Filter
    if (productCategoryFilter !== 'All') {
      if (productCategoryFilter === 'LowStock') {
        if ((p.stock ?? 100) > 15) return false;
      } else if (p.category?.toLowerCase() !== productCategoryFilter.toLowerCase()) {
        return false;
      }
    }
    // 2. Search Query Filter
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase().trim();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCategory = p.category?.toLowerCase().includes(q);
      const matchSlug = p.slug?.toLowerCase().includes(q);
      const matchTagline = p.tagline?.toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchSlug && !matchTagline) return false;
    }
    return true;
  });

  const filteredOrders = orders
    .filter((o) => {
      // 1. Status Filter
      if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) {
        return false;
      }
      // 2. Payment Filter
      if (orderPaymentFilter !== 'All') {
        if (orderPaymentFilter === 'Paid' && o.paymentStatus !== 'Paid') return false;
        if (orderPaymentFilter === 'Pending' && o.paymentStatus !== 'Pending') return false;
        if (orderPaymentFilter === 'Failed' && o.paymentStatus !== 'Failed') return false;
        if (
          orderPaymentFilter === 'COD' &&
          !o.paymentMethod?.toLowerCase().includes('cash') &&
          !o.paymentMethod?.toLowerCase().includes('cod')
        )
          return false;
      }
      // 3. Search Query Filter
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const matchOrderNo = o.orderNumber?.toLowerCase().includes(q);
        const matchCustomer = o.customerName?.toLowerCase().includes(q);
        const matchEmail = o.customerEmail?.toLowerCase().includes(q);
        const matchPhone = o.customerPhone?.toLowerCase().includes(q);
        const matchCity = o.shippingAddress?.city?.toLowerCase().includes(q);
        const matchState = o.shippingAddress?.state?.toLowerCase().includes(q);
        const matchTracking = o.trackingNumber?.toLowerCase().includes(q);
        const matchItem = o.items?.some((it: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => it.name?.toLowerCase().includes(q));
        if (
          !matchOrderNo &&
          !matchCustomer &&
          !matchEmail &&
          !matchPhone &&
          !matchCity &&
          !matchState &&
          !matchTracking &&
          !matchItem
        ) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (orderSortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (orderSortBy === 'oldest') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      if (orderSortBy === 'amount_high') {
        return (b.total || 0) - (a.total || 0);
      }
      if (orderSortBy === 'amount_low') {
        return (a.total || 0) - (b.total || 0);
      }
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F6F3ED] text-[#181817] font-sans antialiased">
      {/* ================= MOBILE DRAWER BACKDROP & MENU ================= */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#FAF8F5] border-r border-[#DDD8CF] flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[#DDD8CF] bg-[#F4EFEA]/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Logo variant="full" markHeight={28} />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-[#57534E] hover:text-[#181817] hover:bg-[#EAE5DC] rounded-xs"
              title="Close Menu"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#DDD8CF]/70">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-widest text-[#2D4438] uppercase">
              <ShieldCheck size={13} className="text-[#2D4438]" />
              <span>Admin Panel</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 bg-[#EAE5DC] text-[#44403C] border border-[#DDD8CF]">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  stats.dbStatus?.connected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>Live Store</span>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Group 1: OVERVIEW */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C887B] px-3 block mb-2 font-mono">
              Overview
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveSection('overview');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  activeSection === 'overview'
                    ? 'bg-[#2D4438] text-[#FAF8F5] shadow-xs'
                    : 'text-[#44403C] hover:bg-[#EAE5DC] hover:text-[#181817]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={16} strokeWidth={2} />
                  <span>Dashboard</span>
                </div>
                <ChevronRight
                  size={14}
                  className={activeSection === 'overview' ? 'opacity-100' : 'opacity-30'}
                />
              </button>
            </div>
          </div>

          {/* Group 2: COMMERCE */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C887B] px-3 block mb-2 font-mono">
              Store
            </span>
            <div className="space-y-1">
              {/* Products */}
              <button
                onClick={() => {
                  setActiveSection('products');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  activeSection === 'products'
                    ? 'bg-[#2D4438] text-[#FAF8F5] shadow-xs'
                    : 'text-[#44403C] hover:bg-[#EAE5DC] hover:text-[#181817]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package size={16} strokeWidth={2} />
                  <span>Products</span>
                </div>
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-xs ${
                    activeSection === 'products'
                      ? 'bg-white/20 text-[#FAF8F5]'
                      : 'bg-[#EAE5DC] text-[#44403C]'
                  }`}
                >
                  {products.length}
                </span>
              </button>

              {/* Orders */}
              <button
                onClick={() => {
                  setActiveSection('orders');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  activeSection === 'orders'
                    ? 'bg-[#2D4438] text-[#FAF8F5] shadow-xs'
                    : 'text-[#44403C] hover:bg-[#EAE5DC] hover:text-[#181817]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={16} strokeWidth={2} />
                  <span>Orders</span>
                </div>
                {stats.processingOrders > 0 ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                    {stats.processingOrders} pending
                  </span>
                ) : (
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-xs ${
                      activeSection === 'orders'
                        ? 'bg-white/20 text-[#FAF8F5]'
                        : 'bg-[#EAE5DC] text-[#44403C]'
                    }`}
                  >
                    {orders.length}
                  </span>
                )}
              </button>

              {/* Customers */}
              <button
                onClick={() => {
                  setActiveSection('users');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  activeSection === 'users'
                    ? 'bg-[#2D4438] text-[#FAF8F5] shadow-xs'
                    : 'text-[#44403C] hover:bg-[#EAE5DC] hover:text-[#181817]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users size={16} strokeWidth={2} />
                  <span>Customers</span>
                </div>
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-xs ${
                    activeSection === 'users'
                      ? 'bg-white/20 text-[#FAF8F5]'
                      : 'bg-[#EAE5DC] text-[#44403C]'
                  }`}
                >
                  {usersList.length || stats.usersCount}
                </span>
              </button>

              {/* Reviews */}
              <button
                onClick={() => {
                  setActiveSection('reviews');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  activeSection === 'reviews'
                    ? 'bg-[#2D4438] text-[#FAF8F5] shadow-xs'
                    : 'text-[#44403C] hover:bg-[#EAE5DC] hover:text-[#181817]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star size={16} strokeWidth={2} />
                  <span>Reviews</span>
                </div>
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-xs ${
                    activeSection === 'reviews'
                      ? 'bg-white/20 text-[#FAF8F5]'
                      : 'bg-[#EAE5DC] text-[#44403C]'
                  }`}
                >
                  {reviewsList.filter(r => r.status === 'pending').length > 0 ? (
                    <span className="text-amber-600 bg-amber-100 px-1 py-0.5 animate-pulse">
                      {reviewsList.filter(r => r.status === 'pending').length} pending
                    </span>
                  ) : (
                    reviewsList.length
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Group 3: SYSTEM */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C887B] px-3 block mb-2 font-mono">
              System
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveSection('database');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  activeSection === 'database'
                    ? 'bg-[#2D4438] text-[#FAF8F5] shadow-xs'
                    : 'text-[#44403C] hover:bg-[#EAE5DC] hover:text-[#181817]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database size={16} strokeWidth={2} />
                  <span>System Settings</span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    stats.dbStatus?.connected ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Sidebar Metric Widget */}
          <div className="p-3.5 bg-[#F4EFEA] border border-[#DDD8CF] space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase font-bold text-[#57534E]">
              <span>Total Sales</span>
              <DollarSign size={13} className="text-[#2D4438]" />
            </div>
            <div className="font-serif text-xl font-bold text-[#181817] tracking-tight">
              ₹{stats.totalRevenue?.toLocaleString('en-IN')}
            </div>
            <div className="flex justify-between text-[11px] pt-1.5 border-t border-[#DDD8CF] text-[#77736C]">
              <span>Processed:</span>
              <strong className="text-[#181817] font-semibold">{stats.totalOrders} orders</strong>
            </div>
          </div>
        </div>

        {/* User Card & Action Footer */}
        <div className="p-4 border-t border-[#DDD8CF] bg-[#F4EFEA]/60 space-y-3">
          <div className="flex items-center gap-3 p-2.5 bg-[#FAF8F5] border border-[#DDD8CF]">
            <div className="w-8 h-8 rounded-full bg-[#2D4438] text-[#FAF8F5] flex items-center justify-center font-bold text-xs shrink-0 font-serif">
              {user?.name
                ? user.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                : 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[#181817] block truncate leading-tight">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[11px] text-[#77736C] block truncate">
                {user?.email}
              </span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-wider bg-[#2D4438]/10 text-[#2D4438] px-1.5 py-0.5 border border-[#2D4438]/20">
              Admin
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider py-2 bg-[#FAF8F5] hover:bg-[#EAE5DC] text-[#181817] transition-colors border border-[#DDD8CF]"
            >
              <ExternalLink size={12} />
              <span>Storefront</span>
            </Link>
            <button
              onClick={() => logout()}
              className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 transition-colors cursor-pointer border border-rose-200"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN WORKSPACE ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#DDD8CF] px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-[#FAF8F5] border border-[#DDD8CF] text-[#181817] hover:bg-[#EAE5DC]"
              title="Open Navigation"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase font-bold tracking-wider text-[#77736C] mb-0.5 font-mono">
                <span>Terra</span>
                <span>/</span>
                <span className="text-[#2D4438]">Admin Panel</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#181817] font-normal capitalize tracking-tight leading-tight">
                {activeSection === 'overview'
                  ? 'Overview'
                  : activeSection === 'products'
                  ? 'Products'
                  : activeSection === 'orders'
                  ? 'Orders'
                  : activeSection === 'users'
                  ? 'Customers'
                  : 'System Settings'}
              </h1>
            </div>
          </div>

          {/* Quick Actions & DB Beacon */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#F4EFEA] border border-[#DDD8CF] px-3 py-1.5 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  stats.dbStatus?.connected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="text-[#57534E] font-medium">MongoDB:</span>
              <span
                className={`font-bold ${
                  stats.dbStatus?.connected ? 'text-emerald-800' : 'text-amber-800'
                }`}
              >
                {stats.dbStatus?.connected ? 'Online' : 'Checking'}
              </span>
            </div>

            <button
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="px-3.5 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE5DC] border border-[#DDD8CF] text-xs uppercase font-bold tracking-wider text-[#181817] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              title="Refresh All Store Data"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#2D4438]' : ''} />
              <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 bg-[#181817] hover:bg-[#2D4438] text-white text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5"
            >
              <span>Storefront</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        {/* Workspace Canvas */}
        <div className="p-6 sm:p-8 flex-1 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* ================= SECTION 1: DASHBOARD OVERVIEW ================= */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              {/* Executive KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {/* 1. Total Revenue */}
                <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-6 shadow-2xs hover:border-[#2D4438]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#77736C] font-mono">
                      Total Sales
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-100/80 text-emerald-800 flex items-center justify-center">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl text-[#181817] mt-3 font-medium tracking-tight">
                    ₹{stats.totalRevenue?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-emerald-800 font-bold mt-3 flex items-center gap-1.5">
                    <TrendingUp size={13} />
                    <span>From {stats.totalOrders} total orders</span>
                  </div>
                </div>

                {/* 2. Pending Orders */}
                <div
                  onClick={() => {
                    setActiveSection('orders');
                    setOrderStatusFilter('Processing');
                  }}
                  className="bg-[#FAF8F5] border border-[#DDD8CF] p-6 shadow-2xs hover:border-amber-500/60 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#77736C] font-mono">
                      Pending Orders
                    </span>
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Clock size={16} />
                    </div>
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl text-[#181817] mt-3 font-medium tracking-tight">
                    {stats.processingOrders}
                  </div>
                  <div className="text-xs text-amber-800 font-bold mt-3 flex items-center justify-between">
                    <span>Awaiting packing & shipping</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 3. Catalog Products */}
                <div
                  onClick={() => setActiveSection('products')}
                  className="bg-[#FAF8F5] border border-[#DDD8CF] p-6 shadow-2xs hover:border-[#2D4438]/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#77736C] font-mono">
                      Live Catalog
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#2D4438]/10 text-[#2D4438] flex items-center justify-center">
                      <Box size={16} />
                    </div>
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl text-[#181817] mt-3 font-medium tracking-tight">
                    {products.length}
                  </div>
                  <div className="text-xs text-[#57534E] font-medium mt-3 flex items-center justify-between">
                    <span>Active formulas in stock</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 4. Registered Customers */}
                <div
                  onClick={() => setActiveSection('users')}
                  className="bg-[#FAF8F5] border border-[#DDD8CF] p-6 shadow-2xs hover:border-[#2D4438]/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#77736C] font-mono">
                      Clientele
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#DDD8CF] text-[#181817] flex items-center justify-center">
                      <Users size={16} />
                    </div>
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl text-[#181817] mt-3 font-medium tracking-tight">
                    {usersList.length || stats.usersCount}
                  </div>
                  <div className="text-xs text-[#57534E] font-medium mt-3 flex items-center justify-between">
                    <span>Registered store accounts</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 5. Units Sold */}
                <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-6 shadow-2xs hover:border-[#2D4438]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#77736C] font-mono">
                      Units Sold
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#EAE5DC] text-[#2D4438] flex items-center justify-center">
                      <Package size={16} />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#57534E]">Beard Oil</span>
                      <span className="font-serif font-bold text-[#181817] text-lg">{totalBeardOil}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm border-t border-[#DDD8CF] pt-2">
                      <span className="text-[#57534E]">Face Wash</span>
                      <span className="font-serif font-bold text-[#181817] text-lg">{totalFaceWash}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fulfillment Pipeline Quick-Bar */}
              <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-[#2D4438]" />
                    <span className="font-serif text-base font-bold text-[#181817]">
                      Fulfillment Pipeline
                    </span>
                  </div>
                  <span className="text-xs text-[#77736C]">Click any stage to filter orders</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: 'Processing',
                      count: orders.filter((o) => o.status === 'Processing').length,
                      color: 'bg-amber-50 text-amber-900 border-amber-300',
                      badgeColor: 'bg-amber-200 text-amber-950',
                    },
                    {
                      label: 'Shipped',
                      count: orders.filter((o) => o.status === 'Shipped').length,
                      color: 'bg-sky-50 text-sky-900 border-sky-300',
                      badgeColor: 'bg-sky-200 text-sky-950',
                    },
                    {
                      label: 'Delivered',
                      count: orders.filter((o) => o.status === 'Delivered').length,
                      color: 'bg-emerald-50 text-emerald-900 border-emerald-300',
                      badgeColor: 'bg-emerald-200 text-emerald-950',
                    },
                    {
                      label: 'Cancelled',
                      count: orders.filter((o) => o.status === 'Cancelled').length,
                      color: 'bg-rose-50 text-rose-900 border-rose-300',
                      badgeColor: 'bg-rose-200 text-rose-950',
                    },
                  ].map((stage) => (
                    <button
                      key={stage.label}
                      onClick={() => {
                        setActiveSection('orders');
                        setOrderStatusFilter(stage.label);
                      }}
                      className={`p-3 border text-left flex items-center justify-between transition-all hover:scale-[1.02] cursor-pointer ${stage.color}`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {stage.label}
                      </span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${stage.badgeColor}`}>
                        {stage.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2-Column: Recent Orders (8 cols) + Quick Actions (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Orders Table */}
                <div className="lg:col-span-8 bg-[#FAF8F5] border border-[#DDD8CF] p-6 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#DDD8CF] pb-4">
                    <div>
                      <h3 className="font-serif text-xl text-[#181817] font-bold">
                        Recent Store Orders
                      </h3>
                      <p className="text-xs text-[#77736C]">
                        Latest customer purchases and payment statuses
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveSection('orders');
                        setOrderStatusFilter('All');
                      }}
                      className="text-xs uppercase font-bold tracking-wider text-[#2D4438] hover:underline flex items-center gap-1"
                    >
                      <span>View All ({orders.length})</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#77736C] space-y-2">
                      <ShoppingBag size={28} className="mx-auto text-[#8C887B]" />
                      <p>No customer orders placed yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-[#EAE5DC]/60 border-b border-[#DDD8CF] text-[#57534E] uppercase font-bold tracking-wider">
                            <th className="p-3">Order</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DDD8CF]">
                          {orders.slice(0, 6).map((ord) => (
                            <tr key={ord._id || ord.orderNumber} className="hover:bg-[#F6F3ED] transition-colors">
                              <td className="p-3 font-serif font-bold text-[#181817]">
                                #{ord.orderNumber}
                              </td>
                              <td className="p-3 font-medium text-[#181817]">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-[#2D4438] text-white text-[9px] font-serif font-bold flex items-center justify-center shrink-0">
                                    {ord.customerName ? ord.customerName.slice(0, 2).toUpperCase() : 'TC'}
                                  </div>
                                  <span className="truncate max-w-[120px]">{ord.customerName}</span>
                                </div>
                              </td>
                              <td className="p-3 font-serif font-bold text-[#181817]">
                                ₹{ord.total?.toLocaleString('en-IN')}
                              </td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 text-[10px] uppercase font-bold border inline-block ${
                                    ord.status === 'Delivered'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : ord.status === 'Shipped'
                                      ? 'bg-sky-50 text-sky-800 border-sky-200'
                                      : ord.status === 'Cancelled'
                                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}
                                >
                                  {ord.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => setSelectedOrder(ord)}
                                  className="px-2.5 py-1 bg-[#EAE5DC] hover:bg-[#DDD8CF] text-[11px] font-bold text-[#181817] uppercase tracking-wider transition-colors"
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Quick Actions & Maintenance (4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-6 space-y-4 shadow-2xs">
                    <h3 className="font-serif text-xl text-[#181817] font-bold border-b border-[#DDD8CF] pb-3">
                      Store Operations
                    </h3>

                    <div className="space-y-2.5">
                      <button
                        onClick={handleOpenCreateProduct}
                        className="w-full flex items-center justify-between p-3.5 bg-[#181817] hover:bg-[#2D4438] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Plus size={15} /> Add New Formula
                        </span>
                        <ChevronRight size={14} />
                      </button>

                      <button
                        onClick={() => {
                          setActiveSection('orders');
                          setOrderStatusFilter('Processing');
                        }}
                        className="w-full flex items-center justify-between p-3.5 bg-[#FAF8F5] hover:bg-[#EAE5DC] text-[#181817] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-[#DDD8CF]"
                      >
                        <span className="flex items-center gap-2">
                          <Truck size={15} className="text-[#2D4438]" /> Review Shipments
                        </span>
                        <ChevronRight size={14} />
                      </button>


                    </div>

                    {dbActionMessage && (
                      <div className="p-3 bg-[#2D4438]/10 border border-[#2D4438]/30 text-xs font-semibold text-[#2D4438]">
                        {dbActionMessage}
                      </div>
                    )}
                  </div>

                  {/* System Health Card */}
                  <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-5 space-y-3 shadow-2xs text-xs">
                    <div className="flex items-center justify-between font-bold text-[#181817] border-b border-[#DDD8CF] pb-2">
                      <span className="uppercase tracking-wider">System State</span>
                      <Activity size={14} className="text-[#2D4438]" />
                    </div>
                    <div className="flex justify-between text-[#57534E]">
                      <span>MongoDB Connection:</span>
                      <strong className="text-emerald-800 font-bold">
                        {stats.dbStatus?.connected ? '✓ Active' : 'Offline'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-[#57534E]">
                      <span>Catalog Count:</span>
                      <strong className="text-[#181817]">{products.length} SKU items</strong>
                    </div>
                    <div className="flex justify-between text-[#57534E]">
                      <span>Payment Gateway:</span>
                      <strong className="text-[#2D4438]">Razorpay + Cash on Delivery</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 2: PRODUCTS CATALOG ================= */}
          {activeSection === 'products' && (
            <div className="space-y-6">
              {/* Product Controls & Category Filter Bar */}
              <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-4 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-lg">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C887B]" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search products by name, web link, or subtitle..."
                      className="w-full bg-[#FFFFFF] border border-[#DDD8CF] pl-10 pr-9 py-2 text-xs text-[#181817] placeholder:text-[#8C887B] focus:outline-none focus:border-[#2D4438]"
                    />
                    {productSearch && (
                      <button
                        onClick={() => setProductSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C887B] hover:text-[#181817]"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2.5">


                    <button
                      onClick={handleOpenCreateProduct}
                      className="px-4 py-2 bg-[#181817] hover:bg-[#2D4438] text-white text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus size={14} />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>

                {/* Category Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#DDD8CF]">
                  {[
                    { key: 'All', label: 'All Catalog', count: products.length },
                    {
                      key: 'Face',
                      label: 'Face Care',
                      count: products.filter((p) => p.category === 'Face').length,
                    },
                    {
                      key: 'Beard',
                      label: 'Beard Grooming',
                      count: products.filter((p) => p.category === 'Beard').length,
                    },
                    {
                      key: 'Sets',
                      label: 'Sets & Routines',
                      count: products.filter((p) => p.category === 'Sets').length,
                    },
                    {
                      key: 'LowStock',
                      label: 'Low Stock (<=15)',
                      count: products.filter((p) => (p.stock ?? 100) <= 15).length,
                    },
                  ].map((chip) => (
                    <button
                      key={chip.key}
                      onClick={() => setProductCategoryFilter(chip.key)}
                      className={`px-3 py-1 text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                        productCategoryFilter === chip.key
                          ? 'bg-[#2D4438] text-[#FAF8F5]'
                          : 'bg-[#EAE5DC]/70 text-[#57534E] hover:text-[#181817] hover:bg-[#EAE5DC]'
                      }`}
                    >
                      <span>{chip.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          productCategoryFilter === chip.key
                            ? 'bg-white/20 text-white'
                            : 'bg-[#DDD8CF] text-[#44403C]'
                        }`}
                      >
                        {chip.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-[#FAF8F5] border border-[#DDD8CF] overflow-hidden shadow-2xs">
                {filteredProducts.length === 0 ? (
                  <div className="p-12 text-center space-y-2">
                    <Package size={28} className="mx-auto text-[#8C887B]" />
                    <p className="font-serif text-lg text-[#181817]">No products matched your filters.</p>
                    <button
                      onClick={() => {
                        setProductSearch('');
                        setProductCategoryFilter('All');
                      }}
                      className="text-xs text-[#2D4438] underline font-bold"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#EAE5DC] border-b border-[#DDD8CF] text-[#44403C] uppercase font-bold tracking-wider">
                          <th className="p-4 pl-5">Product Formula</th>
                          <th className="p-4">Category & Purpose</th>
                          <th className="p-4">Retail Price</th>
                          <th className="p-4">Stock Inventory</th>
                          <th className="p-4">Customer Rating</th>
                          <th className="p-4 pr-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DDD8CF]">
                        {filteredProducts.map((prod) => {
                          const productReviews = reviewsList.filter(
                            (r: any) => r.productSlug === prod.slug && r.status === 'approved'
                          );
                          const dynReviewCount = productReviews.length;
                          const dynRating = dynReviewCount > 0 
                            ? (productReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / dynReviewCount).toFixed(1) 
                            : '0.0';

                          return (
                          <tr key={prod._id || prod.id || prod.slug} className="hover:bg-[#F6F3ED] transition-colors">
                            {/* Product Info */}
                            <td className="p-4 pl-5">
                              <div className="flex items-center gap-3.5">
                                <div className="relative w-13 h-13 bg-[#EAE5DC] border border-[#DDD8CF] shrink-0 overflow-hidden shadow-2xs">
                                  <Image
                                    src={prod.featuredImage || '/images/home/hero-products.jpeg'}
                                    alt={prod.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-serif text-base text-[#181817] font-bold leading-tight">
                                    {prod.name}
                                  </h4>
                                  <span className="text-[11px] text-[#77736C] block mt-0.5">
                                    Web Link: <strong className="font-mono text-[#181817]">{prod.slug}</strong> • Size: {prod.size}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="p-4">
                              <span className="text-[#181817] font-bold block">{prod.category}</span>
                              <span className="text-[11px] text-[#77736C] block">{prod.purpose}</span>
                            </td>

                            {/* Price */}
                            <td className="p-4">
                              <span className="text-[#181817] font-bold text-sm font-serif">₹{prod.price}</span>
                              {prod.compareAtPrice && (
                                <span className="text-[10px] text-[#8C887B] line-through block font-medium">
                                  ₹{prod.compareAtPrice}
                                </span>
                              )}
                            </td>

                            {/* Stock */}
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 text-[11px] font-bold uppercase inline-block border ${
                                  (prod.stock ?? 100) > 15
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-amber-100 text-amber-900 border-amber-300'
                                }`}
                              >
                                {prod.stock ?? 100} in stock
                              </span>
                            </td>

                            {/* Rating */}
                            <td className="p-4 text-[#2D4438] font-bold">
                              ★ {dynRating}{' '}
                              <span className="text-[10px] text-[#77736C] font-normal">
                                ({dynReviewCount})
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="p-4 pr-5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-1.5 bg-[#FAF8F5] hover:bg-[#EAE5DC] border border-[#DDD8CF] text-[#44403C] transition-colors"
                                  title="Edit formula"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod._id || prod.slug)}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-colors"
                                  title="Delete formula"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= SECTION 3: ORDERS & FULFILLMENT ================= */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              
              {/* Top Controls Bar */}
              <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-4 space-y-4 shadow-2xs">
                
                {/* Row 1: Universal Search, Sort & Counter */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                  
                  {/* Search Input */}
                  <div className="relative flex-1 max-w-xl">
                    <Search
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C887B]"
                    />
                    <input
                      type="text"
                      placeholder="Search by Order #, Customer, Email, Phone, City, Tracking AWB, or Product..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#DDD8CF] pl-10 pr-9 py-2.5 text-xs text-[#181817] placeholder:text-[#8C887B] focus:outline-none focus:border-[#2D4438]"
                    />
                    {orderSearchQuery && (
                      <button
                        onClick={() => setOrderSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C887B] hover:text-[#181817]"
                        title="Clear Search"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Sort by & Refresh */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#77736C] font-semibold text-[11px] uppercase tracking-wider">
                        Sort:
                      </span>
                      <AdminCustomSelect<'newest' | 'oldest' | 'amount_high' | 'amount_low'>
                        value={orderSortBy}
                        onChange={(val) => setOrderSortBy(val)}
                        options={[
                          { value: 'newest', label: 'Newest First' },
                          { value: 'oldest', label: 'Oldest First' },
                          { value: 'amount_high', label: 'Highest Amount (₹)' },
                          { value: 'amount_low', label: 'Lowest Amount (₹)' },
                        ]}
                        className="min-w-[160px]"
                        buttonClassName="py-1.5"
                      />
                    </div>

                    <button
                      onClick={fetchOrders}
                      className="p-2 bg-[#EAE5DC] hover:bg-[#DDD8CF] border border-[#DDD8CF] text-[#181817] transition-colors"
                      title="Refresh Orders"
                    >
                      <RefreshCw size={13} />
                    </button>
                  </div>
                </div>

                {/* Row 2: Status Tabs & Payment Filter */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DDD8CF]">
                  
                  {/* Status Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-[#EAE5DC]/60 p-1 border border-[#DDD8CF]">
                    {[
                      { key: 'All', label: 'All Orders', count: orders.length },
                      {
                        key: 'Processing',
                        label: 'Processing',
                        count: orders.filter((o) => o.status === 'Processing').length,
                      },
                      {
                        key: 'Shipped',
                        label: 'Shipped',
                        count: orders.filter((o) => o.status === 'Shipped').length,
                      },
                      {
                        key: 'Delivered',
                        label: 'Delivered',
                        count: orders.filter((o) => o.status === 'Delivered').length,
                      },
                      {
                        key: 'Cancelled',
                        label: 'Cancelled',
                        count: orders.filter((o) => o.status === 'Cancelled').length,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setOrderStatusFilter(tab.key)}
                        className={`px-3 py-1.5 text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                          orderStatusFilter === tab.key
                            ? 'bg-[#2D4438] text-[#FAF8F5]'
                            : 'text-[#57534E] hover:text-[#181817] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                            orderStatusFilter === tab.key
                              ? 'bg-white/20 text-white'
                              : 'bg-[#DDD8CF] text-[#44403C]'
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Payment Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#77736C]">
                      Payment:
                    </span>
                    <AdminCustomSelect
                      value={orderPaymentFilter}
                      onChange={(val) => setOrderPaymentFilter(val)}
                      options={[
                        { value: 'All', label: 'All Payments' },
                        { value: 'Paid', label: 'Paid Only', dotColor: 'bg-emerald-600' },
                        { value: 'Pending', label: 'Pending / COD', dotColor: 'bg-amber-600' },
                        { value: 'COD', label: 'Cash on Delivery', dotColor: 'bg-amber-700' },
                        { value: 'Failed', label: 'Failed', dotColor: 'bg-rose-600' },
                      ]}
                      className="min-w-[155px]"
                    />

                    {(orderSearchQuery || orderStatusFilter !== 'All' || orderPaymentFilter !== 'All') && (
                      <button
                        onClick={() => {
                          setOrderSearchQuery('');
                          setOrderStatusFilter('All');
                          setOrderPaymentFilter('All');
                        }}
                        className="text-xs text-[#2D4438] hover:underline font-bold px-2 py-1"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Orders Counter Banner */}
              <div className="flex items-center justify-between text-xs text-[#77736C] px-1 font-medium">
                <span>
                  Showing <strong className="text-[#181817] font-bold">{filteredOrders.length}</strong> of{' '}
                  <strong className="text-[#181817]">{orders.length}</strong> total orders
                </span>
                {orderSearchQuery && (
                  <span className="text-[#2D4438] font-bold">
                    Filter: &ldquo;{orderSearchQuery}&rdquo;
                  </span>
                )}
              </div>

              {/* ================= DESKTOP ORDERS TABLE ================= */}
              <div className="hidden lg:block bg-[#FAF8F5] border border-[#DDD8CF] overflow-hidden shadow-2xs">
                {filteredOrders.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <Package size={28} className="mx-auto text-[#8C887B]" />
                    <h4 className="font-serif text-xl font-bold text-[#181817]">
                      No orders found
                    </h4>
                    <p className="text-xs text-[#77736C] max-w-sm mx-auto">
                      No matching records found for the current query or filters.
                    </p>
                    <button
                      onClick={() => {
                        setOrderSearchQuery('');
                        setOrderStatusFilter('All');
                        setOrderPaymentFilter('All');
                      }}
                      className="px-4 py-2 bg-[#2D4438] text-white text-xs uppercase font-bold tracking-wider"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#EAE5DC] border-b-2 border-[#D5CFBF] text-[#44403C] uppercase font-bold tracking-wider">
                          <th className="p-4 pl-5 w-16 text-center font-mono">No.</th>
                          <th className="p-4">Order & Date</th>
                          <th className="p-4">Customer & Destination</th>
                          <th className="p-4 min-w-[270px]">Products Ordered</th>
                          <th className="p-4">Payment & Total</th>
                          <th className="p-4">Fulfillment & Carrier</th>
                          <th className="p-4 pr-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-0">
                        {filteredOrders.map((ord, idx) => {
                          const totalItems =
                            ord.items?.reduce((acc: number, it: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => acc + (it.quantity || 1), 0) || 0;
                          const isCod =
                            ord.paymentMethod?.toLowerCase().includes('cash') ||
                            ord.paymentMethod?.toLowerCase().includes('cod');

                          return (
                            <tr
                              key={ord._id || ord.orderNumber}
                              className={`border-b-4 border-[#E7E2D7] transition-colors border-l-4 border-l-[#2D4438] ${
                                idx % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#FAF8F5]'
                              } hover:bg-[#F2ECE2]`}
                            >
                              {/* 0. Order Sequence Numbering */}
                              <td className="p-4 pl-5 align-top text-center">
                                <div className="flex flex-col items-center gap-1 pt-0.5">
                                  <span className="w-8 h-8 rounded-full bg-[#2D4438] text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                                    #{idx + 1}
                                  </span>
                                  <span className="text-[9px] uppercase font-mono text-[#8C887B] font-bold tracking-wider">
                                    ORD
                                  </span>
                                </div>
                              </td>

                              {/* 1. Order ID & Date */}
                              <td className="p-4 align-top">
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-serif font-bold text-base text-[#181817] tracking-tight">
                                      #{ord.orderNumber}
                                    </span>
                                    <button
                                      onClick={() => handleCopyText(ord.orderNumber, `tbl_ord_${ord.orderNumber}`)}
                                      className="p-1 text-[#8C887B] hover:text-[#181817] transition-colors"
                                      title="Copy Order ID"
                                    >
                                      {copiedKey === `tbl_ord_${ord.orderNumber}` ? (
                                        <CheckCheck size={13} className="text-emerald-700" />
                                      ) : (
                                        <Copy size={13} />
                                      )}
                                    </button>
                                  </div>

                                  <span className="text-[11px] text-[#77736C] flex items-center gap-1">
                                    <Calendar size={12} className="text-[#8C887B]" />
                                    {new Date(ord.createdAt || '2024-01-01T00:00:00.000Z').toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })}
                                  </span>

                                  <span className="inline-block text-[10px] font-mono text-[#57534E] bg-[#EAE5DC] px-1.5 py-0.5 rounded-xs">
                                    {totalItems} item{totalItems !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </td>

                              {/* 2. Customer & Destination */}
                              <td className="p-4 align-top">
                                <div className="space-y-1.5 max-w-[200px]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-[#2D4438] text-white font-serif font-bold text-[10px] flex items-center justify-center shrink-0">
                                      {ord.customerName ? ord.customerName.slice(0, 2).toUpperCase() : 'TC'}
                                    </div>
                                    <span className="font-bold text-sm text-[#181817] truncate leading-tight block">
                                      {ord.customerName}
                                    </span>
                                  </div>

                                  <span className="text-[11px] text-[#57534E] block truncate" title={ord.customerEmail}>
                                    {ord.customerEmail}
                                  </span>

                                  {ord.customerPhone && (
                                    <div className="flex items-center gap-1 text-[11px] text-[#77736C]">
                                      <span className="truncate">{ord.customerPhone}</span>
                                      <button
                                        onClick={() => handleCopyText(ord.customerPhone, `tbl_ph_${ord.orderNumber}`)}
                                        className="text-[#8C887B] hover:text-[#181817]"
                                        title="Copy Phone"
                                      >
                                        {copiedKey === `tbl_ph_${ord.orderNumber}` ? (
                                          <CheckCheck size={11} className="text-emerald-700" />
                                        ) : (
                                          <Copy size={11} />
                                        )}
                                      </button>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-1 text-[11px] text-[#2D4438] font-medium pt-0.5">
                                    <MapPin size={11} className="shrink-0" />
                                    <span className="truncate">
                                      {ord.shippingAddress?.city}, {ord.shippingAddress?.state || 'India'}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* 3. Products Ordered */}
                              <td className="p-4 align-top">
                                <div className="space-y-2 max-w-[280px]">
                                  {ord.items?.slice(0, 2).map((it: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, i: number) => {
                                    const itemInfo = resolveOrderItemImage(it);
                                    return (
                                      <div
                                        key={i}
                                        className="flex items-center gap-2.5 p-1.5 bg-[#FAF8F5] border border-[#DDD8CF] rounded-xs group hover:border-[#2D4438]/50 transition-colors"
                                      >
                                        <div className="relative w-12 h-12 bg-[#ECE7DE] border border-[#DDD8CF] rounded-xs shrink-0 overflow-hidden shadow-2xs">
                                          <Image
                                            src={itemInfo.image}
                                            alt={it.name || 'Product'}
                                            fill
                                            sizes="48px"
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement;
                                              if (target.src !== '/images/home/hero-products.jpeg') {
                                                target.src = '/images/home/hero-products.jpeg';
                                              }
                                            }}
                                          />
                                          <span className="absolute top-0.5 right-0.5 bg-[#181817]/90 text-[#FAF8F5] text-[9px] font-mono font-bold px-1 rounded-xs">
                                            ×{it.quantity}
                                          </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <span
                                            className="text-xs font-bold text-[#181817] leading-snug block truncate"
                                            title={it.name}
                                          >
                                            {it.name}
                                          </span>
                                          <div className="flex items-center gap-1.5 text-[10px] text-[#77736C]">
                                            <span className="text-[#2D4438] font-semibold">{itemInfo.category}</span>
                                            <span>•</span>
                                            <span className="font-mono font-bold">₹{it.price}</span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}

                                  {ord.items?.length > 2 && (
                                    <button
                                      onClick={() => setSelectedOrder(ord)}
                                      className="text-[11px] text-[#2D4438] hover:underline font-bold block pt-0.5 cursor-pointer"
                                    >
                                      +{ord.items.length - 2} more product(s)...
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* 4. Payment & Total */}
                              <td className="p-4 align-top">
                                <div className="space-y-1.5">
                                  <span className="text-[#181817] font-bold text-base font-serif block">
                                    ₹{ord.total?.toLocaleString('en-IN')}
                                  </span>

                                  <div>
                                    <span
                                      className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${
                                        isCod
                                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      }`}
                                    >
                                      {isCod ? 'Cash on Delivery' : ord.paymentMethod || 'Online Prepaid'}
                                    </span>
                                  </div>

                                  <div className="pt-0.5">
                                    <AdminCustomSelect<'Paid' | 'Pending' | 'Failed'>
                                      value={(ord.paymentStatus as 'Paid' | 'Pending' | 'Failed') || 'Pending'}
                                      onChange={(val) =>
                                        handleUpdatePaymentStatus(
                                          ord._id || ord.orderNumber,
                                          val
                                        )
                                      }
                                      variant="status-payment"
                                      options={[
                                        { value: 'Paid', label: 'Paid', dotColor: 'bg-emerald-600' },
                                        { value: 'Pending', label: 'COD Pending', dotColor: 'bg-amber-600' },
                                        { value: 'Failed', label: 'Failed', dotColor: 'bg-rose-600' },
                                      ]}
                                      className="w-full"
                                      buttonClassName="w-full justify-between"
                                      title="Update Payment Status in Database"
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* 5. Fulfillment & Carrier */}
                              <td className="p-4 align-top">
                                <div className="space-y-2">
                                  <AdminCustomSelect
                                    value={ord.status || 'Processing'}
                                    onChange={(val) =>
                                      handleUpdateOrderStatus(ord._id || ord.orderNumber, val)
                                    }
                                    variant="status-order"
                                    options={[
                                      { value: 'Processing', label: 'Processing', dotColor: 'bg-amber-600' },
                                      { value: 'Shipped', label: 'Shipped', dotColor: 'bg-sky-600' },
                                      { value: 'Delivered', label: 'Delivered', dotColor: 'bg-emerald-600' },
                                      { value: 'Cancelled', label: 'Cancelled', dotColor: 'bg-rose-600' },
                                    ]}
                                    className="w-full"
                                    buttonClassName="w-full justify-between"
                                  />

                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      placeholder="Carrier AWB #"
                                      defaultValue={ord.trackingNumber || ''}
                                      onChange={(e) =>
                                        setTrackingInputs({
                                          ...trackingInputs,
                                          [ord._id || ord.orderNumber]: e.target.value,
                                        })
                                      }
                                      className="w-28 bg-[#FFFFFF] border border-[#DDD8CF] px-2 py-1 text-xs text-[#181817] placeholder:text-[#8C887B] focus:outline-none focus:border-[#2D4438]"
                                    />
                                    <button
                                      onClick={() => handleSaveTracking(ord._id || ord.orderNumber)}
                                      className="p-1 bg-[#181817] hover:bg-[#2D4438] text-[#FAF8F5] transition-colors"
                                      title="Save Tracking & Mark Shipped"
                                    >
                                      <Check size={12} />
                                    </button>
                                  </div>

                                  {ord.trackingNumber && (
                                    <div className="flex items-center gap-1 text-[10px] text-[#77736C] font-mono">
                                      <Truck size={11} className="text-[#2D4438]" />
                                      <span>#{ord.trackingNumber}</span>
                                      <button
                                        onClick={() => handleCopyText(ord.trackingNumber, `tbl_trk_${ord.orderNumber}`)}
                                        className="text-[#8C887B] hover:text-[#181817]"
                                        title="Copy Tracking Number"
                                      >
                                        {copiedKey === `tbl_trk_${ord.orderNumber}` ? (
                                          <CheckCheck size={10} className="text-emerald-700" />
                                        ) : (
                                          <Copy size={10} />
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* 6. Actions */}
                              <td className="p-4 pr-5 align-top text-right">
                                <div className="flex flex-col items-end gap-2">
                                  <button
                                    onClick={() => setSelectedOrder(ord)}
                                    className="px-3 py-1.5 bg-[#EAE5DC] hover:bg-[#DDD8CF] text-xs font-bold text-[#181817] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                                  >
                                    <span>Details</span>
                                    <ExternalLink size={12} />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSelectedOrder(ord);
                                      setModalViewTab('invoice');
                                      setTimeout(() => window.print(), 250);
                                    }}
                                    className="text-[11px] font-bold text-[#2D4438] hover:underline flex items-center gap-1"
                                    title="Quick Print Invoice"
                                  >
                                    <Printer size={12} /> Print Slip
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ================= MOBILE & TABLET ORDER CARDS ================= */}
              <div className="block lg:hidden space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-8 text-center text-xs text-[#77736C]">
                    No orders found matching filters.
                  </div>
                ) : (
                  filteredOrders.map((ord, idx) => {
                    const isCod =
                      ord.paymentMethod?.toLowerCase().includes('cash') ||
                      ord.paymentMethod?.toLowerCase().includes('cod');

                    return (
                      <div
                        key={ord._id || ord.orderNumber}
                        className="bg-[#FFFFFF] border-2 border-[#DDD8CF] border-l-4 border-l-[#2D4438] p-4 space-y-3.5 shadow-sm rounded-xs"
                      >
                        <div className="flex items-center justify-between border-b-2 border-[#E7E2D7] pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-[#2D4438] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <div>
                              <span className="font-serif font-bold text-base text-[#181817] block leading-tight">
                                #{ord.orderNumber}
                              </span>
                              <span className="text-[11px] text-[#77736C]">
                                {new Date(ord.createdAt || '2024-01-01T00:00:00.000Z').toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : ord.status === 'Shipped'
                                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                                  : ord.status === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-amber-50 text-amber-900 border-amber-300'
                              }`}
                            >
                              {ord.status || 'Processing'}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#181817]">{ord.customerName}</span>
                            <span className="text-[11px] text-[#2D4438] flex items-center gap-1 font-medium">
                              <MapPin size={11} /> {ord.shippingAddress?.city}, {ord.shippingAddress?.state || 'IN'}
                            </span>
                          </div>
                          <span className="text-[#57534E] text-[11px] block">{ord.customerEmail}</span>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {ord.items?.slice(0, 2).map((it: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, i: number) => {
                            const itemInfo = resolveOrderItemImage(it);
                            return (
                              <div
                                key={i}
                                className="flex items-center gap-2 p-1.5 bg-[#F6F3ED] border border-[#DDD8CF]"
                              >
                                <div className="relative w-10 h-10 bg-[#EAE5DC] shrink-0 overflow-hidden">
                                  <Image
                                    src={itemInfo.image}
                                    alt={it.name || 'Product'}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-xs font-bold text-[#181817] block truncate">
                                    {it.name}
                                  </span>
                                  <span className="text-[10px] text-[#77736C]">
                                    Qty: {it.quantity} • ₹{it.price}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#DDD8CF] text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#77736C] block">
                              {isCod ? 'Cash on Delivery' : 'Prepaid'}
                            </span>
                            <span className="font-serif font-bold text-base text-[#181817]">
                              ₹{ord.total?.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-3 py-1.5 bg-[#EAE5DC] hover:bg-[#DDD8CF] text-xs font-bold uppercase tracking-wider"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* ================= SECTION 4: CUSTOMERS DIRECTORY ================= */}
          {activeSection === 'users' && (
            <div className="space-y-6">
              <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#181817]">Customer Accounts</h3>
                  <p className="text-xs text-[#77736C]">
                    Total Registered Clientele: <strong className="text-[#181817]">{usersList.length}</strong>
                  </p>
                </div>

              </div>

              <div className="bg-[#FAF8F5] border border-[#DDD8CF] overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#EAE5DC] border-b border-[#DDD8CF] text-[#44403C] uppercase font-bold tracking-wider">
                        <th className="p-4 pl-5">Client Name</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Tier Status</th>
                        <th className="p-4">Registered Date</th>
                        <th className="p-4 pr-5 text-right">Role Access</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DDD8CF]">
                      {usersList.map((u) => (
                        <tr key={u._id} className="hover:bg-[#F6F3ED] transition-colors">
                          <td className="p-4 pl-5 font-bold text-[#181817]">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#2D4438] text-white text-[10px] font-serif font-bold flex items-center justify-center shrink-0">
                                {u.name ? u.name.slice(0, 2).toUpperCase() : 'CU'}
                              </div>
                              <span>{u.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-[#57534E] font-medium">{u.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 text-[10px] uppercase font-bold border ${
                                u.role === 'admin'
                                  ? 'bg-[#2D4438] text-white border-[#2D4438]'
                                  : 'bg-[#EAE5DC] text-[#181817] border-[#DDD8CF]'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-[#57534E] font-medium">{u.tier || 'Standard Patron'}</td>
                          <td className="p-4 text-[#57534E] font-medium">
                            {new Date(u.createdAt || '2024-01-01T00:00:00.000Z').toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="p-4 pr-5 text-right">
                            <button
                              onClick={() => handleToggleUserRole(u._id, u.role)}
                              className={`px-3 py-1 text-xs uppercase font-bold transition-colors cursor-pointer border ${
                                u.role === 'admin'
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                                  : 'bg-[#181817] hover:bg-[#2D4438] text-white border-[#181817]'
                              }`}
                            >
                              {u.role === 'admin' ? 'Change to User' : 'Promote to Admin'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 4.5: REVIEWS ================= */}
          {activeSection === 'reviews' && (
            <div className="space-y-6">
              <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#181817]">Product Reviews</h3>
                  <p className="text-xs text-[#77736C]">
                    Manage customer feedback and ratings
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF8F5] border border-[#DDD8CF] overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#EAE5DC] border-b border-[#DDD8CF] text-[#44403C] uppercase font-bold tracking-wider">
                        <th className="p-4 pl-5">Product</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4">Review Content</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DDD8CF]">
                      {currentReviews.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#77736C]">
                            No reviews found.
                          </td>
                        </tr>
                      ) : (
                        currentReviews.map((r) => (
                          <tr key={r.id || r._id} className="hover:bg-[#F6F3ED] transition-colors">
                            <td className="p-4 pl-5 font-bold text-[#181817]">
                              {r.productName}
                              <div className="text-[10px] text-[#77736C] font-normal mt-0.5">
                                {r.date}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-[#181817] block">{r.author}</span>
                              <div className="text-[10px] text-[#77736C]">
                                {r.location && <span className="block mb-0.5">{r.location}</span>}
                                {r.email}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < r.rating ? 'fill-current' : 'text-[#DDD8CF]'}
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="p-4 max-w-xs">
                              <span className="font-bold text-[#181817] block mb-1">{r.title}</span>
                              <p className="text-[#57534E] line-clamp-2" title={r.content}>
                                {r.content}
                              </p>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-0.5 text-[10px] uppercase font-bold border ${
                                  r.status === 'approved'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : r.status === 'rejected'
                                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                                    : 'bg-amber-50 text-amber-900 border-amber-300'
                                }`}
                              >
                                {r.status || 'pending'}
                              </span>
                            </td>
                            <td className="p-4 pr-5 text-right space-x-2">
                              {r.status !== 'approved' && (
                                <button
                                  onClick={() => handleUpdateReviewStatus(r._id, 'approved')}
                                  disabled={updatingReviewStatus === r._id}
                                  className="px-3 py-1 bg-[#2D4438] hover:bg-[#181817] text-white text-[10px] uppercase font-bold transition-colors disabled:opacity-50"
                                >
                                  Approve
                                </button>
                              )}
                              {r.status !== 'rejected' && (
                                <button
                                  onClick={() => handleUpdateReviewStatus(r._id, 'rejected')}
                                  disabled={updatingReviewStatus === r._id}
                                  className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[10px] uppercase font-bold transition-colors disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenEditReview(r)}
                                className="px-3 py-1 bg-[#EAE5DC] hover:bg-[#DDD8CF] text-[#181817] border border-[#DDD8CF] text-[10px] uppercase font-bold transition-colors"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalReviewPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t border-[#DDD8CF] bg-[#F6F3ED]">
                    <div className="text-xs text-[#77736C]">
                      Showing <span className="font-bold text-[#181817]">{indexOfFirstReview + 1}</span> to{' '}
                      <span className="font-bold text-[#181817]">
                        {Math.min(indexOfLastReview, reviewsList.length)}
                      </span>{' '}
                      of <span className="font-bold text-[#181817]">{reviewsList.length}</span> reviews
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setReviewCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={reviewCurrentPage === 1}
                        className="p-1.5 border border-[#DDD8CF] bg-white text-[#181817] disabled:opacity-50 disabled:bg-[#F6F3ED] hover:bg-[#EAE5DC] transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      <div className="flex items-center gap-1 px-2">
                        {Array.from({ length: totalReviewPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setReviewCurrentPage(i + 1)}
                            className={`w-7 h-7 flex items-center justify-center text-xs font-bold transition-colors ${
                              reviewCurrentPage === i + 1
                                ? 'bg-[#2D4438] text-white'
                                : 'text-[#77736C] hover:bg-[#EAE5DC] hover:text-[#181817]'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setReviewCurrentPage((prev) => Math.min(prev + 1, totalReviewPages))}
                        disabled={reviewCurrentPage === totalReviewPages}
                        className="p-1.5 border border-[#DDD8CF] bg-white text-[#181817] disabled:opacity-50 disabled:bg-[#F6F3ED] hover:bg-[#EAE5DC] transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ================= SECTION 5: DATABASE & SYSTEM HEALTH ================= */}
          {activeSection === 'database' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-6 sm:p-8 space-y-6 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#DDD8CF] pb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[#181817] font-bold">
                      Database & Infrastructure
                    </h3>
                    <p className="text-xs text-[#77736C] mt-0.5">
                      MongoDB connection diagnostics and maintenance utilities
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-bold uppercase border ${
                      stats.dbStatus?.connected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {stats.dbStatus?.connected ? '✓ Connected' : 'Checking / Offline'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-[#F6F3ED] border border-[#DDD8CF] flex justify-between items-center">
                    <span className="text-[#57534E] font-medium">Database Connection:</span>
                    <strong className="text-[#181817] font-mono">
                      {stats.dbStatus?.state || 'Checking...'}
                    </strong>
                  </div>

                  <div className="p-3.5 bg-[#F6F3ED] border border-[#DDD8CF] flex justify-between items-center">
                    <span className="text-[#57534E] font-medium">Catalog Collections:</span>
                    <strong className="text-[#181817] font-mono">
                      {products.length} Products, {orders.length} Orders, {usersList.length} Users
                    </strong>
                  </div>
                </div>

                {/* Database Maintenance Tools */}
                <div className="pt-2 space-y-3">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#44403C]">
                    Data Utilities
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">



                  </div>

                  {dbActionMessage && (
                    <div className="p-3.5 bg-[#2D4438]/10 border border-[#2D4438]/30 text-xs font-semibold text-[#2D4438]">
                      {dbActionMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] border border-[#DDD8CF] max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#F5F2EA] border-b border-[#DDD8CF] flex flex-wrap items-start justify-between gap-4 shrink-0">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[11px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 bg-[#2D4438]/10 text-[#2D4438] border border-[#2D4438]/20">
                    Products
                  </span>
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 bg-[#FFFFFF] border border-[#DDD8CF] text-[#57534E]">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </span>
                  {productForm.category && (
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#EAE5DC] text-[#181817] font-semibold border border-[#DDD8CF]">
                      {productForm.category}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#181817] font-normal tracking-tight">
                  {editingProduct ? (productForm.name || 'Edit Product') : 'Add New Product'}
                </h3>
                <p className="text-xs text-[#77736C] font-light">
                  Fill in the product details, pricing, stock, and photos below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#57534E] hover:text-[#181817] p-2 bg-[#FFFFFF] border border-[#DDD8CF] hover:border-[#2D4438] transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {/* SECTION 1: BASIC INFO */}
              <div className="bg-[#FFFFFF] border border-[#DDD8CF] p-6 space-y-5 shadow-2xs">
                <div className="flex items-center gap-2 pb-3 border-b border-[#EAE5DC]">
                  <Package size={16} className="text-[#2D4438]" />
                  <h4 className="text-xs uppercase font-bold tracking-widest text-[#181817]">
                    1. Basic Details
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C] block mb-1.5">
                      Product Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        const autoSlug = newName
                          .toLowerCase()
                          .trim()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-+|-+$/g, '');
                        setProductForm({
                          ...productForm,
                          name: newName,
                          slug: isSlugAuto ? autoSlug : productForm.slug,
                        });
                      }}
                      placeholder="e.g. Face Wash"
                      className="w-full bg-[#FAF8F5] border border-[#DDD8CF] p-3 text-sm text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C]">
                        Product Web Address (URL)
                      </label>
                      <div className="flex items-center gap-2">
                        {isSlugAuto ? (
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                            Auto-syncing
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsSlugAuto(true);
                              const autoSlug = productForm.name
                                .toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-+|-+$/g, '');
                              setProductForm({ ...productForm, slug: autoSlug });
                            }}
                            className="text-[10px] text-[#2D4438] hover:underline cursor-pointer font-medium"
                          >
                            Reset to auto
                          </button>
                        )}
                        <span className="text-[10px] font-mono text-[#77736C]">/shop/{productForm.slug || 'url-slug'}</span>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-[#77736C] font-mono">
                        /shop/
                      </span>
                      <input
                        type="text"
                        value={productForm.slug}
                        onChange={(e) => {
                          setIsSlugAuto(false);
                          setProductForm({ ...productForm, slug: e.target.value });
                        }}
                        placeholder="face-wash"
                        className="w-full bg-[#FAF8F5] border border-[#DDD8CF] pl-16 pr-3 py-3 text-sm text-[#181817] font-mono focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C] block mb-1.5">
                      Category <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          category: e.target.value as 'Face' | 'Beard' | 'Sets',
                        })
                      }
                      className="w-full bg-[#FAF8F5] border border-[#DDD8CF] p-3 text-sm text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors cursor-pointer"
                    >
                      <option value="Face">Face</option>
                      <option value="Beard">Beard</option>
                      <option value="Sets">Sets</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C] block mb-1.5">
                      Type / Step <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={productForm.purpose}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          purpose: e.target.value as 'Cleanse' | 'Nourish' | 'The Method',
                        })
                      }
                      className="w-full bg-[#FAF8F5] border border-[#DDD8CF] p-3 text-sm text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors cursor-pointer"
                    >
                      <option value="Cleanse">Cleanse</option>
                      <option value="Nourish">Nourish</option>
                      <option value="The Method">The Method</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C] block mb-1.5">
                      Bottle Size
                    </label>
                    <input
                      type="text"
                      value={productForm.size}
                      onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                      placeholder="e.g. 100ml"
                      className="w-full bg-[#FAF8F5] border border-[#DDD8CF] p-3 text-sm text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C] block mb-1.5">
                      Badge
                    </label>
                    <input
                      type="text"
                      value={productForm.badge}
                      onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                      placeholder="e.g. Bestseller"
                      className="w-full bg-[#FAF8F5] border border-[#DDD8CF] p-3 text-sm text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRICING & STOCK */}
              <div className="bg-[#FFFFFF] border border-[#DDD8CF] p-6 space-y-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-[#2D4438]" />
                    <h4 className="text-xs uppercase font-bold tracking-widest text-[#181817]">
                      2. Pricing & Stock
                    </h4>
                  </div>
                  {productForm.compareAtPrice && Number(productForm.compareAtPrice) > Number(productForm.price) && (
                    <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5">
                      Save ₹{Number(productForm.compareAtPrice) - Number(productForm.price)} (
                      {Math.round(((Number(productForm.compareAtPrice) - Number(productForm.price)) / Number(productForm.compareAtPrice)) * 100)}% off)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C] block mb-1.5">
                      Price (₹) <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sm font-semibold text-[#77736C]">
                        ₹
                      </span>
                      <input
                        type="number"
                        required
                        min="0"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({ ...productForm, price: Number(e.target.value) })
                        }
                        className="w-full bg-[#FAF8F5] border border-[#DDD8CF] pl-8 pr-3 py-3 text-sm font-medium text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-[#77736C] mt-1 font-light">Selling price paid by customer</p>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C] block mb-1.5">
                      Original Price (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sm font-semibold text-[#77736C]">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={productForm.compareAtPrice}
                        onChange={(e) =>
                          setProductForm({ ...productForm, compareAtPrice: e.target.value })
                        }
                        placeholder="e.g. 899"
                        className="w-full bg-[#FAF8F5] border border-[#DDD8CF] pl-8 pr-3 py-3 text-sm text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-[#77736C] mt-1 font-light">Optional MRP / strikethrough price</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C]">
                        Stock Quantity
                      </label>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 font-semibold ${
                        Number(productForm.stock) > 20
                          ? 'bg-emerald-50 text-emerald-800'
                          : Number(productForm.stock) > 0
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}>
                        {Number(productForm.stock) > 20 ? 'In Stock' : Number(productForm.stock) > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({ ...productForm, stock: Number(e.target.value) })
                      }
                      className="w-full bg-[#FAF8F5] border border-[#DDD8CF] p-3 text-sm font-mono text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors"
                    />
                    <p className="text-[10px] text-[#77736C] mt-1 font-light">Number of units available</p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: DESCRIPTIONS */}
              <div className="bg-[#FFFFFF] border border-[#DDD8CF] p-6 space-y-5 shadow-2xs">
                <div className="flex items-center gap-2 pb-3 border-b border-[#EAE5DC]">
                  <FileText size={16} className="text-[#2D4438]" />
                  <h4 className="text-xs uppercase font-bold tracking-widest text-[#181817]">
                    3. Description
                  </h4>
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C] block mb-1.5">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={productForm.tagline}
                    onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                    placeholder="e.g. THE DAILY CLEANSE"
                    className="w-full bg-[#FAF8F5] border border-[#DDD8CF] p-3 text-sm text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors"
                  />
                  <p className="text-[10px] text-[#77736C] mt-1 font-light">Short subtitle shown above product name</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C] block mb-1.5">
                      Short Description
                    </label>
                    <textarea
                      rows={3}
                      value={productForm.shortDescription}
                      onChange={(e) =>
                        setProductForm({ ...productForm, shortDescription: e.target.value })
                      }
                      placeholder="Short summary shown on product cards..."
                      className="w-full bg-[#FAF8F5] border border-[#DDD8CF] p-3 text-sm text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C] block mb-1.5">
                      Full Description
                    </label>
                    <textarea
                      rows={3}
                      value={productForm.fullDescription}
                      onChange={(e) =>
                        setProductForm({ ...productForm, fullDescription: e.target.value })
                      }
                      placeholder="Detailed product information for the product page..."
                      className="w-full bg-[#FAF8F5] border border-[#DDD8CF] p-3 text-sm text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: PRODUCT IMAGES */}
              <div className="bg-[#FFFFFF] border border-[#DDD8CF] p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-[#2D4438]" />
                    <h4 className="text-xs uppercase font-bold tracking-widest text-[#181817]">
                      4. Product Photos
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#F5F2EA] border border-[#DDD8CF] text-[#2D4438]">
                    {productForm.images?.length || 0} / 5 Images
                  </span>
                </div>

                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Uploaded Image Thumbnails (Sequenced 1 to 5) */}
                {productForm.images && productForm.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-[#FAF8F5] border border-[#DDD8CF]">
                    {productForm.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative group bg-[#FFFFFF] border p-2 flex flex-col items-center transition-all ${
                          idx === 0 ? 'border-[#2D4438] ring-1 ring-[#2D4438]/30 shadow-xs' : 'border-[#DDD8CF]'
                        }`}
                      >
                        <span className={`absolute top-2 left-2 z-10 px-1.5 py-0.5 text-[10px] font-bold font-mono uppercase ${
                          idx === 0
                            ? 'bg-[#2D4438] text-[#FAF8F5]'
                            : 'bg-[#FAF8F5] text-[#57534E] border border-[#DDD8CF]'
                        }`}>
                          #{idx + 1} {idx === 0 ? '• Main' : ''}
                        </span>

                        <div className="relative w-full aspect-square bg-[#EAE5DC] overflow-hidden mt-5 mb-2">
                          <Image
                            src={img.url || '/images/home/hero-products.jpeg'}
                            alt={img.alt || `Image ${idx + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between w-full pt-1.5 border-t border-[#EAE5DC]">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, 'left')}
                              className="p-1 text-[#57534E] hover:text-[#181817] hover:bg-[#F5F2EA] disabled:opacity-20 cursor-pointer transition-colors"
                              title="Move Left"
                            >
                              <MoveLeft size={13} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === productForm.images.length - 1}
                              onClick={() => handleMoveImage(idx, 'right')}
                              className="p-1 text-[#57534E] hover:text-[#181817] hover:bg-[#F5F2EA] disabled:opacity-20 cursor-pointer transition-colors"
                              title="Move Right"
                            >
                              <MoveRight size={13} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer transition-colors"
                            title="Remove Image"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Drag and Drop Zone */}
                {(productForm.images?.length || 0) < 5 ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(false);
                      if (e.dataTransfer.files) {
                        handleUploadFiles(e.dataTransfer.files);
                      }
                    }}
                    className={`relative border-2 border-dashed p-7 text-center transition-all cursor-pointer ${
                      dragActive
                        ? 'border-[#2D4438] bg-[#2D4438]/8'
                        : 'border-[#DDD8CF] bg-[#FAF8F5] hover:border-[#2D4438] hover:bg-[#FFFFFF]'
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleUploadFiles(e.target.files);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {uploadingImage ? (
                      <div className="flex flex-col items-center justify-center py-3 text-[#2D4438] space-y-2">
                        <Loader2 size={26} className="animate-spin" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider">
                          Uploading image...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-2 text-[#57534E] space-y-1.5">
                        <div className="w-11 h-11 rounded-full bg-[#FFFFFF] border border-[#DDD8CF] flex items-center justify-center mb-1 shadow-2xs">
                          <UploadCloud size={22} className="text-[#2D4438]" />
                        </div>
                        <p className="text-xs font-bold text-[#181817]">
                          Drag & drop photos here, or{' '}
                          <span className="text-[#2D4438] underline underline-offset-2">browse files</span>
                        </p>
                        <p className="text-[11px] text-[#77736C]">
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-[#EAE5DC] border border-[#DDD8CF] text-xs text-[#57534E] text-center font-mono">
                    ✓ Maximum 5 photos uploaded for this product.
                  </div>
                )}

                {/* Featured Cover URL */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] uppercase font-bold tracking-wider text-[#44403C]">
                      Main Image URL
                    </label>
                    <span className="text-[10px] text-[#77736C] font-mono">Auto-set from Image #1</span>
                  </div>
                  <input
                    type="text"
                    value={productForm.featuredImage}
                    onChange={(e) =>
                      setProductForm({ ...productForm, featuredImage: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full bg-[#FAF8F5] border border-[#DDD8CF] p-3 text-xs font-mono text-[#181817] focus:outline-none focus:border-[#2D4438] focus:bg-[#FFFFFF] transition-colors"
                  />
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div className="p-4 bg-[#F5F2EA] border border-[#DDD8CF] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#77736C] font-mono">
                  <span>{productForm.name || 'New Product'}</span>
                  <span>•</span>
                  <span>₹{productForm.price || 0}</span>
                  <span>•</span>
                  <span>{productForm.images?.length || 0} Images</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 bg-[#FFFFFF] border border-[#DDD8CF] text-[#181817] hover:bg-[#EAE5DC] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className={`px-6 py-2.5 text-[#F6F3ED] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm flex items-center gap-2 relative ${
                      isSavingProduct ? 'bg-[#181817] opacity-90 cursor-not-allowed' : 'bg-[#181817] hover:bg-[#2D4438]'
                    }`}
                  >
                    {isSavingProduct ? (
                      <div className="flex items-center gap-2 justify-center">
                        <svg className="animate-spin h-4 w-4 text-[#F6F3ED]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                          <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>SAVING...</span>
                      </div>
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        <span>{editingProduct ? 'Save Changes' : 'Add Product'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ORDER DETAILS (REVAMPED LUXURY UI & COMPLETE TAX INVOICE) ================= */}
      {selectedOrder && (() => {
        const orderSubtotal = selectedOrder.subtotal || selectedOrder.total || 0;
        const orderShipping = selectedOrder.shipping || 0;
        const orderGrandTotal = selectedOrder.total || 0;
        const orderDiscount = selectedOrder.discountAmount || 0;
        const appliedCoupon = selectedOrder.couponCode || '';
        const totalItemsCount = selectedOrder.items?.reduce((acc: number, it: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => acc + (it.quantity || 1), 0) || 0;
        const totalTaxable = Math.round((orderGrandTotal / 1.18) * 100) / 100;
        const totalGst = Math.round((orderGrandTotal - totalTaxable) * 100) / 100;
        const cgst = Math.round((totalGst / 2) * 100) / 100;
        const sgst = Math.round((totalGst - cgst) * 100) / 100;
        const customerState = selectedOrder.shippingAddress?.state || 'Delhi';
        const isDelhi = customerState.toLowerCase().includes('delhi');

        return (
          <>
            {/* SCREEN MODAL DIALOG */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 no-print">
              <div className="bg-[#FAF8F5] border border-[#DDD8CF] max-w-5xl w-full max-h-[92vh] sm:max-h-[92vh] h-[95dvh] sm:h-auto flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] overflow-y-auto">
                
                {/* Slimmed Modal Header */}
                <div className="p-4 sm:p-6 bg-[#F5F2EA] border-b border-[#DDD8CF] flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-mono uppercase tracking-widest font-bold px-2.5 py-0.5 bg-[#2D4438] text-[#FAF8F5] border border-[#2D4438]">
                        Order #{selectedOrder.orderNumber}
                      </span>
                      <button
                        onClick={() => handleCopyText(selectedOrder.orderNumber, 'modal_order_no')}
                        className="text-[#77736C] hover:text-[#181817] transition-colors"
                        title="Copy Order ID"
                      >
                        {copiedKey === 'modal_order_no' ? <CheckCheck size={14} className="text-emerald-700" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <h3 className="font-serif text-2xl text-[#181817] font-medium tracking-tight">
                      {selectedOrder.customerName || 'Customer Order'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#57534E] mt-1 font-mono">
                      <span>{new Date(selectedOrder.createdAt || '2024-01-01T00:00:00.000Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{selectedOrder.paymentMethod || 'Prepaid / UPI'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex items-center bg-[#EAE5DC] p-1 border border-[#DDD8CF]">
                      <button type="button" onClick={() => setModalViewTab('overview')} className={`px-3 py-1.5 text-xs uppercase tracking-wider font-bold transition-colors ${modalViewTab === 'overview' ? 'bg-[#181817] text-[#FAF8F5]' : 'text-[#57534E] hover:text-[#181817]'}`}>
                        Overview
                      </button>
                      <button type="button" onClick={() => setModalViewTab('invoice')} className={`px-3 py-1.5 text-xs uppercase tracking-wider font-bold transition-colors ${modalViewTab === 'invoice' ? 'bg-[#181817] text-[#FAF8F5]' : 'text-[#57534E] hover:text-[#181817]'}`}>
                        Invoice
                      </button>
                    </div>
                    <button onClick={() => window.print()} className="p-2 bg-[#2D4438] hover:bg-[#181817] border border-[#2D4438] text-[#FAF8F5] transition-colors" title="Print Invoice">
                      <Printer size={16} />
                    </button>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 bg-[#FAF8F5] hover:bg-[#EAE5DC] border border-[#DDD8CF] text-[#57534E] hover:text-[#181817] transition-colors" title="Close Modal">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* TAB 1: INTERACTIVE ORDER OVERVIEW */}
                {modalViewTab === 'overview' && (
                  <div className="p-4 sm:p-6 space-y-6">
                    
                    {/* Fulfillment Control Center Card */}
                    <div className="bg-white border border-[#DDD8CF] shadow-sm">
                      <div className="p-3.5 border-b border-[#DDD8CF] bg-[#FAF8F5] flex items-center gap-2">
                        <Activity size={15} className="text-[#2D4438]" />
                        <h4 className="text-xs uppercase font-bold text-[#181817] tracking-widest">Fulfillment Control Center</h4>
                      </div>
                      
                      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Order Status */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#77736C]">1. Dispatch Status</span>
                          <div className="flex flex-wrap gap-2">
                            {(['Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map((st) => (
                              <button
                                key={st}
                                disabled={updatingOrderStatus || selectedOrder.status === st}
                                onClick={() => handleUpdateOrderStatus(selectedOrder._id || selectedOrder.orderNumber, st)}
                                className={`text-[10px] px-2.5 py-1.5 font-bold uppercase tracking-wider transition-colors border ${
                                  selectedOrder.status === st ? 'bg-[#181817] text-[#FAF8F5] border-[#181817]' : 'bg-[#FAF8F5] hover:bg-[#EAE5DC] text-[#44403C] border-[#DDD8CF]'
                                } ${updatingOrderStatus ? 'opacity-50' : ''}`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Payment Status */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#77736C]">2. Payment Collection</span>
                          <div className="flex flex-wrap gap-2">
                            {(['Paid', 'Pending', 'Failed'] as const).map((pst) => (
                              <button
                                key={pst}
                                disabled={updatingPaymentStatus || selectedOrder.paymentStatus === pst}
                                onClick={() => handleUpdatePaymentStatus(selectedOrder._id || selectedOrder.orderNumber, pst)}
                                className={`text-[10px] px-2.5 py-1.5 font-bold uppercase tracking-wider transition-colors border ${
                                  selectedOrder.paymentStatus === pst
                                    ? pst === 'Paid' ? 'bg-emerald-800 text-white border-emerald-800' : pst === 'Pending' ? 'bg-amber-700 text-white border-amber-700' : 'bg-rose-700 text-white border-rose-700'
                                    : 'bg-[#FAF8F5] hover:bg-[#EAE5DC] text-[#44403C] border-[#DDD8CF]'
                                } ${updatingPaymentStatus ? 'opacity-50' : ''}`}
                              >
                                {pst === 'Paid' ? '✓ Paid' : pst === 'Pending' ? '⏳ Pending' : '✕ Failed'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Tracking Input */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#77736C]">3. Logistics Tracking</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="AWB / Tracking #"
                              value={modalTrackingInput}
                              onChange={(e) => setModalTrackingInput(e.target.value)}
                              className="bg-[#FAF8F5] border border-[#DDD8CF] px-3 py-1.5 text-xs text-[#181817] w-full focus:outline-none focus:border-[#2D4438]"
                            />
                            <button
                              onClick={() => handleSaveTracking(selectedOrder._id || selectedOrder.orderNumber, modalTrackingInput)}
                              className="px-3 py-1.5 bg-[#2D4438] hover:bg-[#181817] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0"
                            >
                              {modalTrackingSaved ? 'Saved' : 'Save'}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                      
                      {/* Order Fulfillment Stepper */}
                      <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 text-center">
                          {[
                            { label: '1. Placed', done: true },
                            {
                              label: '2. Processing',
                              done:
                                selectedOrder.status === 'Processing' ||
                                selectedOrder.status === 'Shipped' ||
                                selectedOrder.status === 'Delivered',
                            },
                            {
                              label: '3. Shipped',
                              done:
                                selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered',
                            },
                            {
                              label: '4. Delivered',
                              done: selectedOrder.status === 'Delivered',
                            },
                          ].map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1.5">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                  step.done
                                    ? 'bg-[#2D4438] text-[#FAF8F5]'
                                    : 'bg-[#EAE5DC] text-[#8C887B]'
                                }`}
                              >
                                {step.done ? <Check size={14} /> : idx + 1}
                              </div>
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wider ${
                                  step.done ? 'text-[#181817]' : 'text-[#8C887B]'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Main 2-Column Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* Left Column: Products and Financials (7 cols) */}
                        <div className="lg:col-span-7 space-y-5">
                          <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-[#DDD8CF] pb-3">
                              <span className="text-xs uppercase font-bold text-[#2D4438] tracking-wider flex items-center gap-1.5">
                                <ShoppingBag size={15} /> Ordered Products ({selectedOrder.items?.length || 0})
                              </span>
                              <span className="text-xs text-[#77736C]">Verified Catalog Match</span>
                            </div>

                            {/* Ordered Items List with Dynamic Images */}
                            <div className="divide-y divide-[#DDD8CF]/80">
                              {selectedOrder.items?.map((it: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, idx: number) => {
                                const itemInfo = resolveOrderItemImage(it);
                                return (
                                  <div
                                    key={idx}
                                    className="py-4 first:pt-1 last:pb-1 flex items-center gap-4 group"
                                  >
                                    {/* Product Dynamic Image Container */}
                                    <div className="relative w-20 h-20 sm:w-22 sm:h-22 bg-[#ECE7DE] border border-[#DDD8CF] rounded-sm shrink-0 overflow-hidden shadow-2xs">
                                      <Image
                                        src={itemInfo.image}
                                        alt={it.name || 'Terra Product'}
                                        fill
                                        sizes="88px"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          if (target.src !== '/images/home/hero-products.jpeg') {
                                            target.src = '/images/home/hero-products.jpeg';
                                          }
                                        }}
                                      />
                                      <div className="absolute top-1 right-1 bg-[#181817]/90 backdrop-blur-xs text-[#FAF8F5] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs">
                                        ×{it.quantity}
                                      </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-serif text-base sm:text-lg text-[#181817] font-medium leading-snug truncate">
                                          {it.name}
                                        </h4>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <span className="px-2 py-0.5 bg-[#EAE5DC] text-[#44403C] text-[10px] uppercase font-bold tracking-wider">
                                          {itemInfo.category}
                                        </span>
                                        <span className="text-[#77736C]">
                                          HSN: <strong className="font-mono text-[#181817]">{getItemHsn(it.name)}</strong>
                                        </span>
                                        <span className="text-[#77736C]">
                                          Rate: <strong className="text-[#181817]">₹{it.price}</strong>
                                        </span>
                                      </div>

                                      <div className="pt-1 flex items-center gap-3 text-xs">
                                        <Link
                                          href={`/shop/${itemInfo.slug}`}
                                          target="_blank"
                                          className="inline-flex items-center gap-1 text-[11px] text-[#2D4438] hover:underline font-semibold"
                                        >
                                          <span>View in Shop</span>
                                          <ExternalLink size={12} />
                                        </Link>
                                      </div>
                                    </div>

                                    {/* Line Total */}
                                    <div className="text-right shrink-0">
                                      <span className="block font-bold text-base text-[#181817]">
                                        ₹{it.price * it.quantity}
                                      </span>
                                      <span className="text-[10px] text-[#77736C] uppercase font-mono">
                                        ({it.quantity} × ₹{it.price})
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Financial Breakdown Card */}
                          <div className="bg-[#F5F2EA] border border-[#DDD8CF] p-5 space-y-3">
                            <span className="text-xs uppercase font-bold text-[#2D4438] tracking-wider block">
                              Payment & Billing Summary
                            </span>

                            <div className="space-y-2 text-sm text-[#44403C]">
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold text-[#181817]">
                                  ₹{orderSubtotal}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span>Shipping Courier</span>
                                {orderShipping === 0 ? (
                                  <span className="text-xs font-bold text-[#2D4438] bg-[#2D4438]/10 px-2 py-0.5">
                                    FREE EXPRESS
                                  </span>
                                ) : (
                                  <span className="font-semibold text-[#181817]">
                                    ₹{orderShipping}
                                  </span>
                                )}
                              </div>

                              {orderDiscount > 0 && (
                                <div className="flex justify-between items-center text-emerald-700">
                                  <span>Discount Applied {appliedCoupon ? `(${appliedCoupon})` : ''}</span>
                                  <span className="font-semibold">
                                    - ₹{orderDiscount}
                                  </span>
                                </div>
                              )}

                              <div className="flex justify-between text-xs text-[#77736C]">
                                <span>Goods & Services Tax (18% GST Included)</span>
                                <span>₹{totalGst}</span>
                              </div>

                              <div className="border-t border-[#DDD8CF] pt-3 flex justify-between items-center">
                                <div>
                                  <span className="text-base font-bold text-[#181817] block">
                                    Grand Total
                                  </span>
                                  <span className="text-[11px] text-[#77736C]">
                                    Paid via {selectedOrder.paymentMethod || 'Online Gateway'}
                                  </span>
                                </div>
                                <span className="font-serif text-2xl font-bold text-[#181817]">
                                  ₹{orderGrandTotal}
                                </span>
                              </div>

                              {/* COD Collection Action Card */}
                              {selectedOrder.paymentStatus !== 'Paid' ? (
                                <div className="mt-3 p-3.5 bg-amber-50 border border-amber-300 space-y-2 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                                      <DollarSign size={15} /> Cash on Delivery — Payment Due
                                    </span>
                                    <span className="font-mono font-bold text-amber-950 text-sm">
                                      Collect ₹{orderGrandTotal}
                                    </span>
                                  </div>
                                  <p className="text-amber-800 text-[11px] leading-relaxed">
                                    Customer selected Pay on Delivery. Once cash or doorstep UPI is collected by the delivery agent, mark payment as paid here.
                                  </p>
                                  <button
                                    type="button"
                                    disabled={updatingPaymentStatus}
                                    onClick={() =>
                                      handleUpdatePaymentStatus(
                                        selectedOrder._id || selectedOrder.orderNumber,
                                        'Paid'
                                      )
                                    }
                                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                                  >
                                    <CheckCircle2 size={14} /> Mark ₹{orderGrandTotal} as Collected & Paid
                                  </button>
                                </div>
                              ) : (
                                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                                    <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                                    <span>Payment Received & Verified (₹{orderGrandTotal})</span>
                                  </div>
                                  <button
                                    type="button"
                                    disabled={updatingPaymentStatus}
                                    onClick={() =>
                                      handleUpdatePaymentStatus(
                                        selectedOrder._id || selectedOrder.orderNumber,
                                        'Pending'
                                      )
                                    }
                                    className="text-[10px] text-gray-600 hover:text-red-700 underline uppercase tracking-wider"
                                    title="Revert to Pending"
                                  >
                                    Revert to Pending
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Customer & Shipping (5 cols) */}
                        <div className="lg:col-span-5 space-y-5">
                          
                          {/* Customer Information Card */}
                          <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-5 space-y-3.5">
                            <div className="flex items-center justify-between border-b border-[#DDD8CF] pb-2.5">
                              <span className="text-xs uppercase font-bold text-[#2D4438] tracking-wider flex items-center gap-1.5">
                                <UserIcon size={14} /> Customer Profile
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#EAE5DC] text-[#44403C]">
                                Direct Buyer
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#2D4438] text-[#FAF8F5] font-serif font-bold text-sm flex items-center justify-center shrink-0">
                                {selectedOrder.customerName ? selectedOrder.customerName.slice(0, 2).toUpperCase() : 'TC'}
                              </div>
                              <div className="min-w-0">
                                <p className="text-base font-bold text-[#181817] leading-tight truncate">
                                  {selectedOrder.customerName}
                                </p>
                                <p className="text-xs text-[#77736C]">Registered Customer</p>
                              </div>
                            </div>

                            <div className="space-y-2 pt-1 text-xs">
                              <div className="flex items-center justify-between p-2.5 bg-[#F5F2EA] border border-[#DDD8CF]">
                                <div className="flex items-center gap-2 text-[#44403C] truncate">
                                  <Mail size={13} className="text-[#8C887B] shrink-0" />
                                  <span className="truncate">{selectedOrder.customerEmail}</span>
                                </div>
                                <button
                                  onClick={() => handleCopyText(selectedOrder.customerEmail, 'modal_email')}
                                  className="p-1 text-[#77736C] hover:text-[#181817]"
                                  title="Copy Email"
                                >
                                  {copiedKey === 'modal_email' ? (
                                    <CheckCheck size={14} className="text-emerald-700" />
                                  ) : (
                                    <Copy size={14} />
                                  )}
                                </button>
                              </div>

                              {selectedOrder.customerPhone && (
                                <div className="flex items-center justify-between p-2.5 bg-[#F5F2EA] border border-[#DDD8CF]">
                                  <div className="flex items-center gap-2 text-[#44403C]">
                                    <Phone size={13} className="text-[#8C887B] shrink-0" />
                                    <span>{selectedOrder.customerPhone}</span>
                                  </div>
                                  <button
                                    onClick={() => handleCopyText(selectedOrder.customerPhone, 'modal_phone')}
                                    className="p-1 text-[#77736C] hover:text-[#181817]"
                                    title="Copy Phone"
                                  >
                                    {copiedKey === 'modal_phone' ? (
                                      <CheckCheck size={14} className="text-emerald-700" />
                                    ) : (
                                      <Copy size={14} />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Shipping & Delivery Address Card */}
                          <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-5 space-y-3">
                            <div className="flex items-center justify-between border-b border-[#DDD8CF] pb-2.5">
                              <span className="text-xs uppercase font-bold text-[#2D4438] tracking-wider flex items-center gap-1.5">
                                <MapPin size={14} /> Delivery Destination
                              </span>
                              <button
                                onClick={() => {
                                  const fullAddr = [
                                    selectedOrder.customerName,
                                    selectedOrder.shippingAddress?.address1,
                                    selectedOrder.shippingAddress?.address2,
                                    `${selectedOrder.shippingAddress?.city}, ${selectedOrder.shippingAddress?.state} ${selectedOrder.shippingAddress?.postalCode}`,
                                    selectedOrder.shippingAddress?.country || 'India',
                                    selectedOrder.customerPhone ? `Phone: ${selectedOrder.customerPhone}` : '',
                                  ]
                                    .filter(Boolean)
                                    .join(', ');
                                  handleCopyText(fullAddr, 'modal_address');
                                }}
                                className="text-[11px] font-bold text-[#2D4438] hover:underline flex items-center gap-1"
                              >
                                {copiedKey === 'modal_address' ? (
                                  <span className="text-emerald-700 font-bold">Address Copied!</span>
                                ) : (
                                  <>
                                    <Copy size={12} /> Copy Address
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="p-3.5 bg-[#F5F2EA] border border-[#DDD8CF] text-xs text-[#33302E] leading-relaxed space-y-1">
                              <p className="font-bold text-sm text-[#181817]">
                                {selectedOrder.shippingAddress?.firstName
                                  ? `${selectedOrder.shippingAddress.firstName} ${selectedOrder.shippingAddress.lastName || ''}`
                                  : selectedOrder.customerName}
                              </p>
                              <p>{selectedOrder.shippingAddress?.address1}</p>
                              {selectedOrder.shippingAddress?.address2 && (
                                <p>{selectedOrder.shippingAddress.address2}</p>
                              )}
                              <p className="font-medium text-[#181817]">
                                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} —{' '}
                                <span className="font-mono font-bold">
                                  {selectedOrder.shippingAddress?.postalCode}
                                </span>
                              </p>
                              <p className="text-[#77736C]">
                                {selectedOrder.shippingAddress?.country || 'India'}
                              </p>
                            </div>
                          </div>

                          {/* Shipment Tracking Details */}
                          <div className="bg-[#FAF8F5] border border-[#DDD8CF] p-5 space-y-3">
                            <span className="text-xs uppercase font-bold text-[#2D4438] tracking-wider flex items-center gap-1.5">
                              <Truck size={14} /> Logistics Information
                            </span>

                            <div className="p-3 bg-[#F5F2EA] border border-[#DDD8CF] space-y-2 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-[#77736C]">Assigned Carrier:</span>
                                <span className="font-bold text-[#181817]">Shiprocket</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[#77736C]">Tracking ID:</span>
                                {selectedOrder.trackingNumber ? (
                                  <div className="flex items-center gap-1.5 font-mono font-bold text-[#181817]">
                                    <span>#{selectedOrder.trackingNumber}</span>
                                    <button
                                      onClick={() =>
                                        handleCopyText(selectedOrder.trackingNumber, 'modal_tracking_val')
                                      }
                                      className="text-[#77736C] hover:text-[#181817]"
                                    >
                                      {copiedKey === 'modal_tracking_val' ? (
                                        <CheckCheck size={13} className="text-emerald-700" />
                                      ) : (
                                        <Copy size={13} />
                                      )}
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 text-[10px]">
                                    Pending Dispatch
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                  </div>
                )}

                {/* TAB 2: FORMAL TAX INVOICE SCREEN PREVIEW */}
                {modalViewTab === 'invoice' && (
                  <div className="p-4 sm:p-8 bg-[#EAE5DC]/50 flex justify-center">
                    <div className="bg-white border border-[#DDD8CF] shadow-xl p-6 sm:p-10 max-w-4xl w-full text-black text-xs space-y-6">
                      
                      {/* Top Bar with Print Callout */}
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#2D4438] font-bold block">
                            Document Preview
                          </span>
                          <h4 className="font-serif text-xl font-bold text-black">
                            Formal Tax Invoice #{selectedOrder.orderNumber}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="px-4 py-2 bg-[#2D4438] hover:bg-[#181817] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                        >
                          <Printer size={14} /> Print Now
                        </button>
                      </div>

                      {/* Letterhead */}
                      <div className="flex flex-wrap justify-between items-start gap-4 border-b pb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <img src="/images/logo/logo-dark.png" alt="Terra Mens" className="h-7 w-auto object-contain" />
                            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#181817]">TERRA MENS</h1>
                          </div>
                          <p className="text-[10px] tracking-widest uppercase text-[#555] font-semibold">
                            Sri Sai Enterprises
                          </p>
                          <p className="text-[11px] text-[#444] mt-2 leading-relaxed">
                            C-5/39, G/f, Khand-42/16, Plot No. 6, Karawal Nagar Road<br />
                            New Delhi, North East Delhi - 110094<br />
                            <strong>GSTIN:</strong> 07ELZPS4500M1Z9<br />
                            Email: info@terramensco.com
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 border border-gray-200 text-right min-w-64 space-y-1">
                          <span className="inline-block bg-[#181817] text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
                            Original For Recipient
                          </span>
                          <h3 className="font-bold text-sm text-black pt-1">TAX INVOICE</h3>
                          <p className="text-[11px] text-gray-700">
                            <strong>Invoice No:</strong> INV-{selectedOrder.orderNumber}
                          </p>
                          <p className="text-[11px] text-gray-700">
                            <strong>Invoice Date:</strong> {new Date(selectedOrder.createdAt || '2024-01-01T00:00:00.000Z').toLocaleDateString('en-IN')}
                          </p>
                          <p className="text-[11px] text-gray-700">
                            <strong>Order No:</strong> #{selectedOrder.orderNumber}
                          </p>
                          <p className="text-[11px] text-gray-700">
                            <strong>Place of Supply:</strong> {customerState}
                          </p>
                        </div>
                      </div>

                      {/* Buyer & Consignee */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-6">
                        <div className="p-3 bg-gray-50/70 border border-gray-200 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#2D4438] block tracking-wider">
                            Billed To (Buyer)
                          </span>
                          <p className="font-bold text-sm text-black">{selectedOrder.customerName}</p>
                          <p className="text-gray-700 text-[11px] leading-relaxed">
                            {selectedOrder.shippingAddress?.address1}
                            {selectedOrder.shippingAddress?.address2 && `, ${selectedOrder.shippingAddress?.address2}`}
                            <br />
                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} — {selectedOrder.shippingAddress?.postalCode}
                            <br />
                            {selectedOrder.shippingAddress?.country || 'India'}
                          </p>
                          <p className="text-[11px] text-gray-600 pt-1">
                            Email: <strong>{selectedOrder.customerEmail}</strong><br />
                            Phone: <strong>{selectedOrder.customerPhone || 'N/A'}</strong>
                          </p>
                        </div>

                        <div className="p-3 bg-gray-50/70 border border-gray-200 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#2D4438] block tracking-wider">
                            Shipped To (Consignee)
                          </span>
                          <p className="font-bold text-sm text-black">
                            {selectedOrder.shippingAddress?.firstName
                              ? `${selectedOrder.shippingAddress.firstName} ${selectedOrder.shippingAddress.lastName || ''}`
                              : selectedOrder.customerName}
                          </p>
                          <p className="text-gray-700 text-[11px] leading-relaxed">
                            {selectedOrder.shippingAddress?.address1}
                            {selectedOrder.shippingAddress?.address2 && `, ${selectedOrder.shippingAddress?.address2}`}
                            <br />
                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} — {selectedOrder.shippingAddress?.postalCode}
                          </p>
                          <p className="text-[11px] text-gray-600 pt-1">
                            Carrier: <strong>Bluedart Express / Delhivery Air</strong><br />
                            AWB / Tracking: <strong>{selectedOrder.trackingNumber || 'Pending Dispatch'}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Items Table */}
                      <div className="overflow-x-auto w-full">
                        <table className="w-full min-w-[600px] text-left border-collapse border border-gray-300 text-[11px]">
                          <thead>
                            <tr className="bg-gray-100 text-gray-800 border-b border-gray-300 font-bold uppercase text-[10px]">
                              <th className="p-2 border border-gray-300 text-center w-10">#</th>
                              <th className="p-2 border border-gray-300 text-center w-14">Image</th>
                              <th className="p-2 border border-gray-300">Description of Goods</th>
                              <th className="p-2 border border-gray-300 text-center">HSN</th>
                              <th className="p-2 border border-gray-300 text-center">Qty</th>
                              <th className="p-2 border border-gray-300 text-right">Unit Rate</th>
                              <th className="p-2 border border-gray-300 text-right">Taxable Val</th>
                              <th className="p-2 border border-gray-300 text-right">GST (18%)</th>
                              <th className="p-2 border border-gray-300 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items?.map((it: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, idx: number) => {
                              const itemInfo = resolveOrderItemImage(it);
                              const gross = it.price * it.quantity;
                              const taxable = Math.round((gross / 1.18) * 100) / 100;
                              const gst = Math.round((gross - taxable) * 100) / 100;
                              return (
                                <tr key={idx} className="border-b border-gray-200">
                                  <td className="p-2 border border-gray-200 text-center font-mono">{idx + 1}</td>
                                  <td className="p-2 border border-gray-200 text-center">
                                    <div className="w-10 h-10 border border-gray-200 bg-gray-50 overflow-hidden mx-auto">
                                      <img
                                        src={itemInfo.image}
                                        alt={it.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </td>
                                  <td className="p-2 border border-gray-200 font-medium">
                                    <span className="font-serif font-bold text-black text-xs block">{it.name}</span>
                                    <span className="text-[10px] text-gray-500">{itemInfo.category}</span>
                                  </td>
                                  <td className="p-2 border border-gray-200 text-center font-mono text-[10px]">
                                    {getItemHsn(it.name)}
                                  </td>
                                  <td className="p-2 border border-gray-200 text-center font-bold">{it.quantity}</td>
                                  <td className="p-2 border border-gray-200 text-right font-mono">₹{it.price}</td>
                                  <td className="p-2 border border-gray-200 text-right font-mono">₹{taxable}</td>
                                  <td className="p-2 border border-gray-200 text-right font-mono">₹{gst}</td>
                                  <td className="p-2 border border-gray-200 text-right font-bold font-mono">₹{gross}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Calculations Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 border border-gray-200 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-gray-700 block">
                              Amount in Words:
                            </span>
                            <p className="font-serif italic font-bold text-black text-xs">
                              INR {amountToWords(orderGrandTotal)}
                            </p>
                          </div>

                          <div className="p-3 bg-gray-50 border border-gray-200 space-y-1 text-[11px] text-gray-600">
                            <p><strong>Payment Mode:</strong> {selectedOrder.paymentMethod || 'Prepaid / Online UPI'}</p>
                            <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus === 'Paid' ? 'PAID IN FULL' : 'PENDING ON DELIVERY'}</p>
                            <p><strong>Total Items:</strong> {totalItemsCount} units</p>
                          </div>
                        </div>

                        <div className="border border-gray-200 divide-y divide-gray-200 text-[11px]">
                          <div className="flex justify-between p-2">
                            <span className="text-gray-600">Total Taxable Value</span>
                            <span className="font-mono font-medium">₹{totalTaxable}</span>
                          </div>
                          {isDelhi ? (
                            <>
                              <div className="flex justify-between p-2">
                                <span className="text-gray-600">CGST (9.00%)</span>
                                <span className="font-mono">₹{cgst}</span>
                              </div>
                              <div className="flex justify-between p-2">
                                <span className="text-gray-600">SGST (9.00%)</span>
                                <span className="font-mono">₹{sgst}</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex justify-between p-2">
                              <span className="text-gray-600">IGST (18.00%)</span>
                              <span className="font-mono">₹{totalGst}</span>
                            </div>
                          )}
                          <div className="flex justify-between p-2">
                            <span className="text-gray-600">Shipping & Handling</span>
                            <span className="font-mono font-medium">
                              {orderShipping === 0 ? 'FREE' : `₹${orderShipping}`}
                            </span>
                          </div>
                          {orderDiscount > 0 && (
                            <div className="flex justify-between p-2 text-emerald-700">
                              <span className="text-gray-600 font-medium">Discount Applied {appliedCoupon ? `(${appliedCoupon})` : ''}</span>
                              <span className="font-mono font-medium">- ₹{orderDiscount}</span>
                            </div>
                          )}
                          <div className="flex justify-between p-3 bg-gray-100 font-bold text-sm text-black">
                            <span>Total Invoice Value</span>
                            <span className="font-mono text-base">₹{orderGrandTotal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Terms and Signatory */}
                      <div className="pt-6 border-t border-gray-200 flex flex-wrap justify-between items-end gap-6 text-[10px] text-gray-600">
                        <div className="max-w-md space-y-1">
                          <p className="font-bold text-gray-800 uppercase">Declaration & Terms:</p>
                          <p>1. We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                          <p>2. Terra 100% Botanical Guarantee: Returns/replacements accepted within 7 days in original sealed condition.</p>
                          <p>3. This is an electronically generated and authenticated computer document.</p>
                        </div>
                        <div className="text-center p-3 border border-gray-300 min-w-56 bg-gray-50/50">
                          <p className="text-[10px] text-gray-500 mb-6">For SRI SAI ENTERPRISES</p>
                          <div className="border-t border-dashed border-gray-400 pt-1 font-bold text-black">
                            Authorized Signatory
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="p-4 sm:p-5 bg-[#F5F2EA] border-t border-[#DDD8CF] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#77736C]">
                    <FileText size={14} />
                    <span>Terra Enterprise Admin Portal • Order #{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-[#2D4438] hover:bg-[#181817] text-white text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer size={13} /> Print Official Invoice
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(null)}
                      className="px-6 py-2 bg-[#181817] hover:bg-[#2D4438] text-[#FAF8F5] text-xs uppercase font-bold tracking-wider transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* DEDICATED PRINTABLE TAX INVOICE (RENDERED ONLY IN PRINT VIA @media print) */}
            <div id="printable-tax-invoice" className="hidden print:block p-8 bg-white text-black font-sans">
              {/* Header Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <img src="/images/logo/logo-dark.png" alt="Terra Mens" className="h-7 w-auto object-contain" />
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-black">TERRA MENS</h1>
                  </div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-800 font-bold">
                    Sri Sai Enterprises
                  </p>
                  <p className="text-xs text-gray-700 mt-1 leading-snug">
                    C-5/39, G/f, Khand-42/16, Plot No. 6, Karawal Nagar Road<br />
                    New Delhi, North East Delhi - 110094<br />
                    <strong>GSTIN:</strong> 07ELZPS4500M1Z9<br />
                    Email: info@terramensco.com
                  </p>
                </div>
                <div className="text-right border border-gray-400 p-2.5 bg-gray-50 min-w-56 text-xs space-y-0.5">
                  <span className="inline-block bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    Tax Invoice
                  </span>
                  <p className="pt-1"><strong>Invoice No:</strong> INV-{selectedOrder.orderNumber}</p>
                  <p><strong>Invoice Date:</strong> {new Date(selectedOrder.createdAt || '2024-01-01T00:00:00.000Z').toLocaleDateString('en-IN')}</p>
                  <p><strong>Order ID:</strong> #{selectedOrder.orderNumber}</p>
                  <p><strong>Place of Supply:</strong> {customerState}</p>
                </div>
              </div>

              {/* Billed To and Shipped To */}
              <div className="grid grid-cols-2 gap-4 border border-gray-300 p-3 mb-5 text-xs">
                <div className="pr-3 border-r border-gray-300 space-y-1">
                  <p className="font-bold text-[10px] uppercase tracking-wider text-gray-600">Billed To (Buyer):</p>
                  <p className="font-bold text-sm text-black">{selectedOrder.customerName}</p>
                  <p className="text-gray-700 leading-snug">
                    {selectedOrder.shippingAddress?.address1}
                    {selectedOrder.shippingAddress?.address2 && `, ${selectedOrder.shippingAddress?.address2}`}<br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} — {selectedOrder.shippingAddress?.postalCode}<br />
                    {selectedOrder.shippingAddress?.country || 'India'}
                  </p>
                  <p className="text-gray-600 pt-1">
                    Email: <strong>{selectedOrder.customerEmail}</strong> | Phone: <strong>{selectedOrder.customerPhone || 'N/A'}</strong>
                  </p>
                </div>

                <div className="pl-3 space-y-1">
                  <p className="font-bold text-[10px] uppercase tracking-wider text-gray-600">Shipped To (Consignee):</p>
                  <p className="font-bold text-sm text-black">
                    {selectedOrder.shippingAddress?.firstName
                      ? `${selectedOrder.shippingAddress.firstName} ${selectedOrder.shippingAddress.lastName || ''}`
                      : selectedOrder.customerName}
                  </p>
                  <p className="text-gray-700 leading-snug">
                    {selectedOrder.shippingAddress?.address1}
                    {selectedOrder.shippingAddress?.address2 && `, ${selectedOrder.shippingAddress?.address2}`}<br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} — {selectedOrder.shippingAddress?.postalCode}
                  </p>
                  <p className="text-gray-600 pt-1">
                    Dispatch Carrier: <strong>Shiprocket</strong><br />
                    AWB Tracking: <strong>{selectedOrder.trackingNumber || 'Pending Dispatch'}</strong>
                  </p>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full border-collapse border border-gray-400 text-xs mb-5">
                <thead>
                  <tr className="bg-gray-100 text-black border-b border-gray-400 font-bold uppercase text-[10px]">
                    <th className="p-2 border border-gray-400 text-center w-8">#</th>
                    <th className="p-2 border border-gray-400 text-center w-14">Image</th>
                    <th className="p-2 border border-gray-400 text-left">Item Description</th>
                    <th className="p-2 border border-gray-400 text-center">HSN</th>
                    <th className="p-2 border border-gray-400 text-center w-12">Qty</th>
                    <th className="p-2 border border-gray-400 text-right">Unit Rate</th>
                    <th className="p-2 border border-gray-400 text-right">Taxable Val</th>
                    <th className="p-2 border border-gray-400 text-right">GST (18%)</th>
                    <th className="p-2 border border-gray-400 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((it: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, idx: number) => {
                    const itemInfo = resolveOrderItemImage(it);
                    const gross = it.price * it.quantity;
                    const taxable = Math.round((gross / 1.18) * 100) / 100;
                    const gst = Math.round((gross - taxable) * 100) / 100;
                    return (
                      <tr key={idx} className="border-b border-gray-300">
                        <td className="p-2 border border-gray-300 text-center font-mono">{idx + 1}</td>
                        <td className="p-1 border border-gray-300 text-center">
                          <div className="w-10 h-10 border border-gray-300 bg-gray-100 overflow-hidden mx-auto">
                            <img
                              src={itemInfo.image}
                              alt={it.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-2 border border-gray-300">
                          <span className="font-bold text-black block">{it.name}</span>
                          <span className="text-[10px] text-gray-600">{itemInfo.category}</span>
                        </td>
                        <td className="p-2 border border-gray-300 text-center font-mono text-[10px]">
                          {getItemHsn(it.name)}
                        </td>
                        <td className="p-2 border border-gray-300 text-center font-bold">{it.quantity}</td>
                        <td className="p-2 border border-gray-300 text-right font-mono">₹{it.price}</td>
                        <td className="p-2 border border-gray-300 text-right font-mono">₹{taxable}</td>
                        <td className="p-2 border border-gray-300 text-right font-mono">₹{gst}</td>
                        <td className="p-2 border border-gray-300 text-right font-bold font-mono">₹{gross}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Calculations and Words */}
              <div className="grid grid-cols-2 gap-4 border border-gray-300 p-3 mb-6 text-xs">
                <div className="space-y-3">
                  <div className="p-2 bg-gray-50 border border-gray-200">
                    <p className="text-[10px] uppercase font-bold text-gray-600">Amount in Words:</p>
                    <p className="font-serif italic font-bold text-black text-xs pt-0.5">
                      INR {amountToWords(orderGrandTotal)}
                    </p>
                  </div>

                  <div className="text-[11px] text-gray-700 space-y-1">
                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'Prepaid / Online UPI'}</p>
                    <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus === 'Paid' ? 'PAID IN FULL' : selectedOrder.paymentStatus === 'Failed' ? 'PAYMENT FAILED / CANCELLED' : 'CASH ON DELIVERY (PENDING)'}</p>
                    <p><strong>Total Items Count:</strong> {totalItemsCount} units</p>
                  </div>
                </div>

                <div className="border border-gray-300 divide-y divide-gray-300 text-xs">
                  <div className="flex justify-between p-1.5">
                    <span>Taxable Amount</span>
                    <span className="font-mono">₹{totalTaxable}</span>
                  </div>
                  {isDelhi ? (
                    <>
                      <div className="flex justify-between p-1.5">
                        <span>CGST (9%)</span>
                        <span className="font-mono">₹{cgst}</span>
                      </div>
                      <div className="flex justify-between p-1.5">
                        <span>SGST (9%)</span>
                        <span className="font-mono">₹{sgst}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between p-1.5">
                      <span>IGST (18%)</span>
                      <span className="font-mono">₹{totalGst}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-1.5">
                    <span>Shipping Charges</span>
                    <span className="font-mono">{orderShipping === 0 ? 'FREE' : `₹${orderShipping}`}</span>
                  </div>
                  {orderDiscount > 0 && (
                    <div className="flex justify-between p-1.5 text-emerald-800">
                      <span className="font-medium">Discount Applied {appliedCoupon ? `(${appliedCoupon})` : ''}</span>
                      <span className="font-mono font-medium">- ₹{orderDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-2 bg-gray-100 font-bold text-sm text-black">
                    <span>Grand Total</span>
                    <span className="font-mono">₹{orderGrandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Authorized Signature */}
              <div className="border-t border-gray-300 pt-4 flex justify-between items-end text-[10px] text-gray-600">
                <div className="max-w-md space-y-0.5">
                  <p className="font-bold text-black uppercase">Declaration:</p>
                  <p>1. We declare that this invoice shows the actual price of the goods described.</p>
                  <p>2. Returns/replacements accepted within 7 days in original sealed condition.</p>
                  <p>3. This is a computer-generated invoice and requires no physical signature.</p>
                </div>
                <div className="text-center p-2.5 border border-gray-400 min-w-52">
                  <p className="text-[10px] text-gray-500 mb-6">For SRI SAI ENTERPRISES</p>
                  <p className="border-t border-dashed border-gray-400 pt-1 font-bold text-black">
                    Authorized Signatory
                  </p>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* Review Edit Modal */}
      {isReviewEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] border-2 border-[#DDD8CF] w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#DDD8CF] bg-[#F6F3ED]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2D4438] rounded-full flex items-center justify-center text-white">
                  <Star size={16} className="fill-current" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#181817]">
                    Edit Review
                  </h3>
                  <p className="text-[11px] text-[#77736C]">
                    Modify customer review details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReviewEditModalOpen(false)}
                className="p-1.5 text-[#8C887B] hover:text-[#181817] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <form id="review-edit-form" onSubmit={handleSaveReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#181817] mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.author}
                    onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#DDD8CF] px-3 py-2 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#181817] mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={reviewForm.location}
                    onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                    placeholder="e.g. Verified Practitioner"
                    className="w-full bg-[#FFFFFF] border border-[#DDD8CF] px-3 py-2 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#181817] mb-1.5">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className="w-full bg-[#FFFFFF] border border-[#DDD8CF] px-3 py-2 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#181817] mb-1.5">
                    Review Date
                  </label>
                  <input
                    type="date"
                    required
                    value={reviewForm.date}
                    onChange={(e) => setReviewForm({ ...reviewForm, date: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#DDD8CF] px-3 py-2 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#181817] mb-1.5">
                    Review Title
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#DDD8CF] px-3 py-2 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#181817] mb-1.5">
                    Review Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#DDD8CF] px-3 py-2 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438] resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#DDD8CF] bg-[#F6F3ED] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsReviewEditModalOpen(false)}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#57534E] hover:text-[#181817] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="review-edit-form"
                disabled={isSavingReview}
                className={`px-6 py-2.5 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs relative ${
                  isSavingReview ? 'bg-[#2D4438] opacity-90 cursor-not-allowed' : 'bg-[#2D4438] hover:bg-[#181817]'
                }`}
              >
                {isSavingReview ? (
                  <div className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                      <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>SAVING...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
