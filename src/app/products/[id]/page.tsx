'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { 
  ShoppingBag, Heart, Truck, Shield, RotateCcw, Star, ChevronLeft, 
  Share2, Ruler, Check, Minus, Plus, AlertCircle 
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/lib/permissions';
import Link from 'next/link';

// ─── Types ─────────────────────────────────────────────────────────
interface ProductImage {
  id: number;
  alt: string;
  gradient: string;
  emoji: string;
}

interface ColorOption {
  name: string;
  bg: string;
  ring: string;
  textColor: string;
}

interface RatingBreakdown {
  stars: number;
  count: number;
  pct: number;
}

interface TrustBadge {
  icon: typeof Truck;
  label: string;
  sub: string;
}

// ─── Constants ───────────────────────────────────────────────────────
const PRODUCT_IMAGES: ProductImage[] = [
  { id: 1, alt: 'Sky Blue variant front view', gradient: 'from-sky-200 to-blue-500', emoji: '👕' },
  { id: 2, alt: 'Indigo variant side view', gradient: 'from-blue-300 to-indigo-500', emoji: '👕' },
  { id: 3, alt: 'Slate variant back view', gradient: 'from-slate-200 to-blue-400', emoji: '👕' },
  { id: 4, alt: 'Cyan variant detail view', gradient: 'from-sky-300 to-cyan-500', emoji: '👕' },
];

const COLOR_OPTIONS: ColorOption[] = [
  { name: 'Sky Blue', bg: 'bg-sky-400', ring: 'ring-sky-400', textColor: 'text-sky-600' },
  { name: 'Navy', bg: 'bg-blue-900', ring: 'ring-blue-900', textColor: 'text-blue-900' },
  { name: 'White', bg: 'bg-white border border-gray-300', ring: 'ring-gray-400', textColor: 'text-gray-600' },
  { name: 'Olive', bg: 'bg-green-700', ring: 'ring-green-700', textColor: 'text-green-700' },
];

const RATINGS_BREAKDOWN: RatingBreakdown[] = [
  { stars: 5, count: 142, pct: 61 },
  { stars: 4, count: 55, pct: 24 },
  { stars: 3, count: 22, pct: 9 },
  { stars: 2, count: 9, pct: 4 },
  { stars: 1, count: 6, pct: 2 },
];

const TRUST_BADGES: TrustBadge[] = [
  { icon: Truck, label: 'Free Delivery', sub: 'Above ₹999' },
  { icon: RotateCcw, label: '15-Day Returns', sub: 'Hassle free' },
  { icon: Shield, label: 'Secure Pay', sub: '100% safe' },
];

const PRODUCT_DETAILS = [
  '100% Premium Cotton',
  'Machine Washable',
  'Slim Fit',
  'Button-down Collar',
  'Regular Length',
];

// ─── Components ──────────────────────────────────────────────────────
function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

function RatingStars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const sizeClasses = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  
  return (
    <div className="flex items-center" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= fullStars
              ? 'fill-amber-400 text-amber-400'
              : star === fullStars + 1 && hasHalfStar
              ? 'fill-amber-200 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const { user } = useAuthStore();

  const product = useMemo(() => ({
    id: params.id,
    name: 'Slim Fit Casual Shirt',
    brand: 'AJIO Basics',
    price: 1299,
    mrp: 2599,
    discount: 50,
    rating: 4.5,
    reviews: 234,
    description: 'A breathable slim fit shirt crafted from 100% premium cotton. Perfect for everyday casual wear or smart casual outings. Features a classic collar, button-down placket, and a flattering fit that moves with you.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    outOfStock: ['XS'],
  }), [params.id]);

  const canAddToCart = user && hasPermission(user.role, 'ADD_TO_CART');
  const savings = product.mrp - product.price;
  const isOutOfStock = product.outOfStock.length === product.sizes.length;

  const handleAddToCart = useCallback(() => {
    if (!selectedSize || isOutOfStock) return;
    
    setAddedToBag(true);
    // TODO: Add to cart API call
    setTimeout(() => setAddedToBag(false), 2000);
  }, [selectedSize, isOutOfStock]);

  const handleWishlistToggle = useCallback(() => {
    setIsWishlisted((prev) => !prev);
    // TODO: Sync with API
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at ₹${product.price}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  }, [product.name, product.price]);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, 10)));
  }, []);

  // Keyboard navigation for images
  const handleKeyNavigation = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveImage(index);
    }
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <Link href="/" className="hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded">
                Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-gray-800 font-medium truncate" aria-current="page">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
          {/* ─── Product Images ────────────────────────────────────── */}
          <section aria-label="Product images" className="flex gap-3 sm:gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2.5 flex-shrink-0" role="tablist" aria-label="Product image thumbnails">
              {PRODUCT_IMAGES.map((img, i) => (
                <button
                  key={img.id}
                  role="tab"
                  aria-selected={activeImage === i}
                  aria-label={`View ${img.alt}`}
                  onClick={() => setActiveImage(i)}
                  onKeyDown={(e) => handleKeyNavigation(e, i)}
                  className={`w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden bg-gradient-to-br ${img.gradient} 
                    flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                    ${activeImage === i 
                      ? 'ring-2 ring-red-500 ring-offset-2 scale-105 shadow-md' 
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                >
                  <span className="text-xl sm:text-2xl" aria-hidden="true">{img.emoji}</span>
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div 
              className={`relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br ${PRODUCT_IMAGES[activeImage].gradient} 
                shadow-lg cursor-zoom-in transition-transform duration-300 ${isZoomed ? 'scale-105' : ''}`}
              onClick={() => setIsZoomed(!isZoomed)}
              role="button"
              aria-label={`Main product image: ${PRODUCT_IMAGES[activeImage].alt}. Click to ${isZoomed ? 'zoom out' : 'zoom in'}`}
              tabIndex={0}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[80px] sm:text-[120px] opacity-70 animate-float drop-shadow-2xl select-none">
                  {PRODUCT_IMAGES[activeImage].emoji}
                </span>
              </div>
              
              {/* Badges */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <span className="inline-flex items-center bg-red-600 text-white text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg shadow-sm">
                  {product.discount}% OFF
                </span>
              </div>
              
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-lg text-lg">Out of Stock</span>
                </div>
              )}

              {/* Actions */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleWishlistToggle(); }}
                  aria-pressed={isWishlisted}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md 
                    hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Heart 
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                    aria-hidden="true"
                  />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleShare(); }}
                  aria-label="Share product"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md 
                    hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>

          {/* ─── Product Info ──────────────────────────────────────── */}
          <section aria-label="Product details" className="flex flex-col">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-black leading-tight text-gray-900">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 bg-green-600 text-white px-2.5 py-1 rounded-lg">
                  <span className="font-bold text-sm">{product.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
                </div>
                <Link 
                  href="#reviews" 
                  className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
                >
                  {product.reviews} Ratings & Reviews
                </Link>
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 py-4 sm:py-5 border-y border-gray-100 my-4 sm:my-5">
              <span className="text-2xl sm:text-3xl font-black text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="text-base sm:text-lg text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-bold">
                {product.discount}% OFF
              </span>
              <span className="text-xs text-green-600 font-medium w-full sm:w-auto mt-1 sm:mt-0">
                You save ₹{savings.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Color Selection */}
            <fieldset className="mb-5">
              <legend className="font-bold text-sm mb-3 flex items-center gap-2">
                COLOR
                <span className="font-normal text-gray-500">— {COLOR_OPTIONS[selectedColor].name}</span>
              </legend>
              <div className="flex gap-3" role="radiogroup" aria-label="Select color">
                {COLOR_OPTIONS.map((color, i) => (
                  <button
                    key={color.name}
                    role="radio"
                    aria-checked={selectedColor === i}
                    aria-label={color.name}
                    onClick={() => setSelectedColor(i)}
                    className={`w-8 h-8 rounded-full ${color.bg} transition-all duration-200 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                      ${selectedColor === i ? `ring-2 ${color.ring} ring-offset-2 scale-110` : 'hover:scale-105'}`}
                  />
                ))}
              </div>
            </fieldset>

            {/* Size Selection */}
            <fieldset className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <legend className="font-bold text-sm">SELECT SIZE</legend>
                <button 
                  className="flex items-center gap-1 text-xs text-red-600 font-semibold hover:text-red-700 
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                >
                  <Ruler className="w-3.5 h-3.5" aria-hidden="true" /> Size Guide
                </button>
              </div>
              <div className="flex gap-2.5 flex-wrap" role="radiogroup" aria-label="Select size">
                {product.sizes.map((size) => {
                  const isOos = product.outOfStock.includes(size);
                  return (
                    <button
                      key={size}
                      role="radio"
                      aria-checked={selectedSize === size}
                      aria-disabled={isOos}
                      disabled={isOos}
                      onClick={() => setSelectedSize(size)}
                      className={`relative min-w-[48px] sm:min-w-[52px] h-11 sm:h-12 px-3 border-2 rounded-xl font-bold text-sm 
                        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                        ${isOos
                          ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50 line-through'
                          : selectedSize === size
                          ? 'border-red-600 bg-red-50 text-red-600 scale-105 shadow-sm'
                          : 'border-gray-200 hover:border-gray-400 text-gray-700 hover:scale-105'
                        }`}
                    >
                      {size}
                      {isOos && <VisuallyHidden>(Out of stock)</VisuallyHidden>}
                    </button>
                  );
                })}
              </div>
              {!selectedSize && !isOutOfStock && (
                <p className="flex items-center gap-1.5 text-xs text-amber-600 mt-2 font-medium" role="alert">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  Please select a size to continue
                </p>
              )}
            </fieldset>

            {/* Quantity Selector */}
            {selectedSize && (
              <div className="flex items-center gap-3 mb-4">
                <span className="font-bold text-sm">QTY:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 
                      disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm" aria-live="polite">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 
                      disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            {canAddToCart ? (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || isOutOfStock}
                  aria-live="polite"
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-xl font-bold text-sm 
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                    ${addedToBag
                      ? 'bg-green-600 text-white'
                      : selectedSize && !isOutOfStock
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {addedToBag ? (
                    <><Check className="w-5 h-5" aria-hidden="true" /> Added to Bag!</>
                  ) : (
                    <><ShoppingBag className="w-5 h-5" aria-hidden="true" /> ADD TO BAG</>
                  )}
                </button>
                <Link 
                  href="/checkout" 
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-xl font-bold text-sm 
                    border-2 border-red-600 text-red-600 hover:bg-red-50 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                    ${!selectedSize || isOutOfStock ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  BUY NOW
                </Link>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm font-medium text-center">
                <span className="flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  Please <Link href="/login" className="underline font-bold hover:text-amber-900">sign in as a Buyer</Link> to purchase
                </span>
              </div>
            )}

            {/* Delivery & Trust */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-2xl mb-6">
              {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" aria-hidden="true" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-bold text-gray-800">{label}</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400">{sub}</p>
                </div>
              ))}
            </div>

            {/* Product Details Accordion */}
            <details className="group bg-white border border-gray-200 rounded-xl p-4 mb-3 shadow-sm">
              <summary className="font-bold text-sm cursor-pointer flex items-center justify-between list-none 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg">
                PRODUCT DETAILS
                <ChevronLeft className="w-4 h-4 rotate-[-90deg] group-open:rotate-90 transition-transform text-gray-400" aria-hidden="true" />
              </summary>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                <ul className="mt-3 space-y-1.5">
                  {PRODUCT_DETAILS.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" aria-hidden="true" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </details>

            {/* Ratings & Reviews Accordion */}
            <details id="reviews" className="group bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <summary className="font-bold text-sm cursor-pointer flex items-center justify-between list-none
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg">
                RATINGS & REVIEWS
                <ChevronLeft className="w-4 h-4 rotate-[-90deg] group-open:rotate-90 transition-transform text-gray-400" aria-hidden="true" />
              </summary>
              <div className="mt-4">
                <div className="flex items-center gap-4 sm:gap-6 mb-5">
                  <div className="text-center">
                    <p className="text-4xl sm:text-5xl font-black text-gray-900">{product.rating}</p>
                    <RatingStars rating={product.rating} size="md" />
                    <p className="text-xs text-gray-500 mt-1">{product.reviews} ratings</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {RATINGS_BREAKDOWN.map(({ stars, count, pct }) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-xs font-bold w-2 text-gray-600">{stars}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" aria-hidden="true" />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </section>
        </div>
      </main>
    </>
  );
}