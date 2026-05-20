
"use client";
import { useState, useMemo } from 'react';
import {
  SlidersHorizontal, Heart, Star, X, ShoppingBag,
  ChevronDown, LayoutGrid, List, Sparkles, TrendingUp, Zap,
  ArrowUpDown, Check
} from 'lucide-react';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const MOCK_PRODUCTS = [
  { id: '1', name: 'Slim Fit Casual Shirt', price: 1299, mrp: 2599, brand: 'AJIO Basics', category: 'Shirts', rating: 4.5, reviews: 234, bg: '#DBEAFE', accent: '#3B82F6', emoji: '👕', badge: 'TRENDING', isNew: false },
  { id: '2', name: 'High Rise Slim Jeans', price: 1999, mrp: 3999, brand: 'Denim Co.', category: 'Jeans', rating: 4.3, reviews: 189, bg: '#EDE9FE', accent: '#7C3AED', emoji: '👖', badge: null, isNew: true },
  { id: '3', name: 'Formal Stretch Trousers', price: 1599, mrp: 2999, brand: 'AJIO Basics', category: 'Trousers', rating: 4.0, reviews: 97, bg: '#F1F5F9', accent: '#64748B', emoji: '👔', badge: null, isNew: false },
  { id: '4', name: 'Pack of 2 Cotton Tees', price: 599, mrp: 1299, brand: 'Basics Life', category: 'T-Shirts', rating: 4.7, reviews: 512, bg: '#FCE7F3', accent: '#DB2777', emoji: '👕', badge: 'BESTSELLER', isNew: false },
  { id: '5', name: 'Classic Polo Shirt', price: 899, mrp: 1799, brand: 'AJIO Basics', category: 'Shirts', rating: 4.2, reviews: 78, bg: '#DCFCE7', accent: '#16A34A', emoji: '👕', badge: null, isNew: true },
  { id: '6', name: 'Smart Chinos', price: 1799, mrp: 3599, brand: 'Denim Co.', category: 'Trousers', rating: 4.4, reviews: 143, bg: '#FEF9C3', accent: '#CA8A04', emoji: '👖', badge: null, isNew: false },
  { id: '7', name: 'Printed Bomber Jacket', price: 2499, mrp: 4999, brand: 'Roadster', category: 'Jackets', rating: 4.6, reviews: 302, bg: '#FEE2E2', accent: '#DC2626', emoji: '🧥', badge: 'NEW ARRIVAL', isNew: true },
  { id: '8', name: 'Canvas Slip-On Sneakers', price: 1299, mrp: 2299, brand: 'Red Tape', category: 'Footwear', rating: 4.1, reviews: 211, bg: '#ECFCCB', accent: '#65A30D', emoji: '👟', badge: null, isNew: false },
];

const CATEGORIES = ['Shirts', 'Jeans', 'Trousers', 'T-Shirts', 'Jackets', 'Footwear'];
const BRANDS = ['AJIO Basics', 'Denim Co.', 'Basics Life', 'Roadster', 'Red Tape'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price ↑' },
  { value: 'price-high', label: 'Price ↓' },
  { value: 'discount', label: 'Discount' },
  { value: 'rating', label: 'Rating' },
];

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [checkedCategories, setCheckedCategories] = useState<Set<string>>(new Set());
  const [checkedBrands, setCheckedBrands] = useState<Set<string>>(new Set());
  const [checkedSizes, setCheckedSizes] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState(5000);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggle = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const filteredProducts = useMemo(() => {
    let r = [...MOCK_PRODUCTS];
    if (checkedCategories.size) r = r.filter(p => checkedCategories.has(p.category));
    if (checkedBrands.size) r = r.filter(p => checkedBrands.has(p.brand));
    if (priceRange < 5000) r = r.filter(p => p.price <= priceRange);
    switch (sortBy) {
      case 'price-low':  r.sort((a, b) => a.price - b.price); break;
      case 'price-high': r.sort((a, b) => b.price - a.price); break;
      case 'rating':     r.sort((a, b) => b.rating - a.rating); break;
      case 'discount':   r.sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price)); break;
    }
    return r;
  }, [checkedCategories, checkedBrands, priceRange, sortBy]);

  const activeFilterCount = checkedCategories.size + checkedBrands.size + checkedSizes.size + (priceRange < 5000 ? 1 : 0);
  const clearAll = () => { setCheckedCategories(new Set()); setCheckedBrands(new Set()); setCheckedSizes(new Set()); setPriceRange(5000); };

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF9', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@600;700&display=swap');

        * { box-sizing: border-box; }

        .playfair { font-family: 'Playfair Display', Georgia, serif; }

        .card-lift {
          transition: transform 0.25s cubic-bezier(.22,.68,0,1.2), box-shadow 0.25s ease;
        }
        .card-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px -8px rgba(0,0,0,0.12);
        }

        .badge-new {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        }
        .badge-trending {
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
        }
        .badge-bestseller {
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
        }
        .badge-arrival {
          background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
        }

        .wishlist-btn { transition: transform 0.2s cubic-bezier(.22,.68,0,1.4); }
        .wishlist-btn:hover { transform: scale(1.15); }
        .wishlist-btn:active { transform: scale(0.9); }

        .size-chip {
          transition: all 0.15s ease;
          border: 1.5px solid #E5E7EB;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 7px;
          color: #6B7280;
          cursor: pointer;
          background: white;
        }
        .size-chip:hover {
          border-color: #111827;
          color: #111827;
          background: #F9FAFB;
        }

        .overlay-actions {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.2s ease, transform 0.25s cubic-bezier(.22,.68,0,1.1);
        }
        .product-card:hover .overlay-actions {
          opacity: 1;
          transform: translateY(0);
        }
        .product-card:hover .product-emoji {
          transform: scale(1.08) translateY(-4px);
        }
        .product-emoji {
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.2);
        }

        .filter-drawer {
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(.22,.68,0,1);
        }
        .filter-drawer.open {
          transform: translateX(0);
        }

        .sort-pill {
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .range-thumb { accent-color: #111827; }

        .stagger-1 { animation: fadeUp 0.4s ease both; animation-delay: 0ms; }
        .stagger-2 { animation: fadeUp 0.4s ease both; animation-delay: 60ms; }
        .stagger-3 { animation: fadeUp 0.4s ease both; animation-delay: 120ms; }
        .stagger-4 { animation: fadeUp 0.4s ease both; animation-delay: 180ms; }
        .stagger-5 { animation: fadeUp 0.4s ease both; animation-delay: 240ms; }
        .stagger-6 { animation: fadeUp 0.4s ease both; animation-delay: 300ms; }
        .stagger-7 { animation: fadeUp 0.4s ease both; animation-delay: 360ms; }
        .stagger-8 { animation: fadeUp 0.4s ease both; animation-delay: 420ms; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .list-card { transition: background 0.15s ease, box-shadow 0.15s ease; }
        .list-card:hover { background: white; box-shadow: 0 4px 24px -4px rgba(0,0,0,0.08); }

        /* Scrollbar */
        .filter-scroll::-webkit-scrollbar { width: 3px; }
        .filter-scroll::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }
      `}</style>

      {/* ── TOP BAR ─────────────────────────── */}
      <div style={{ background: 'white', borderBottom: '1px solid #F0EEE9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 24px' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9CA3AF', marginBottom: 14 }}>
            {['Home', 'Men', 'Clothing'].map((crumb, i, arr) => (
              <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ cursor: 'pointer', color: i === arr.length - 1 ? '#111827' : undefined, fontWeight: i === arr.length - 1 ? 600 : 400 }}>
                  {crumb}
                </span>
                {i < arr.length - 1 && <span style={{ color: '#D1D5DB' }}>/</span>}
              </span>
            ))}
          </nav>

          {/* Title + controls row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 className="playfair" style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1.1, margin: 0 }}>
                Men's Clothing
              </h1>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4, fontWeight: 400 }}>
                {filteredProducts.length} of {MOCK_PRODUCTS.length} products
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Sort Pills */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '2px 0' }}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className="sort-pill"
                    onClick={() => setSortBy(opt.value)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 99,
                      border: `1.5px solid ${sortBy === opt.value ? '#111827' : '#E5E7EB'}`,
                      background: sortBy === opt.value ? '#111827' : 'white',
                      color: sortBy === opt.value ? 'white' : '#6B7280',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ width: 1, height: 28, background: '#E5E7EB' }} />

              {/* View toggle */}
              <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 10, padding: 3, gap: 2 }}>
                {([['grid', LayoutGrid], ['list', List]] as const).map(([mode, Icon]) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      width: 32, height: 32, borderRadius: 7,
                      border: 'none',
                      background: viewMode === mode ? 'white' : 'transparent',
                      color: viewMode === mode ? '#111827' : '#9CA3AF',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: viewMode === mode ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>

              {/* Filter button (mobile) */}
              <button
                onClick={() => setShowFilters(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 10,
                  border: '1.5px solid #E5E7EB',
                  background: activeFilterCount ? '#111827' : 'white',
                  color: activeFilterCount ? 'white' : '#374151',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span style={{
                    background: 'white', color: '#111827',
                    width: 18, height: 18, borderRadius: 99,
                    fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{activeFilterCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 14 }}>
              {[...checkedCategories].map(c => (
                <FilterChip key={c} label={c} onRemove={() => toggle(checkedCategories, c, setCheckedCategories)} />
              ))}
              {[...checkedBrands].map(b => (
                <FilterChip key={b} label={b} onRemove={() => toggle(checkedBrands, b, setCheckedBrands)} />
              ))}
              {[...checkedSizes].map(s => (
                <FilterChip key={s} label={`Size: ${s}`} onRemove={() => toggle(checkedSizes, s, setCheckedSizes)} />
              ))}
              {priceRange < 5000 && (
                <FilterChip label={`Under ₹${priceRange.toLocaleString()}`} onRemove={() => setPriceRange(5000)} />
              )}
              <button
                onClick={clearAll}
                style={{ fontSize: 12, fontWeight: 600, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ─────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 0 }}>

        {/* ── SIDEBAR (desktop) ─── */}
        <aside style={{
          width: 240,
          flexShrink: 0,
          padding: '28px 0 28px 24px',
          display: 'none', // hidden on mobile, shown via CSS below
        }}
          className="sidebar-desktop"
        >
          <style>{`.sidebar-desktop { display: block !important; } @media (max-width: 900px) { .sidebar-desktop { display: none !important; } }`}</style>
          <FilterSidebar
            checkedCategories={checkedCategories}
            checkedBrands={checkedBrands}
            checkedSizes={checkedSizes}
            priceRange={priceRange}
            activeFilterCount={activeFilterCount}
            toggle={toggle}
            setCheckedCategories={setCheckedCategories}
            setCheckedBrands={setCheckedBrands}
            setCheckedSizes={setCheckedSizes}
            setPriceRange={setPriceRange}
            clearAll={clearAll}
          />
        </aside>

        {/* ── PRODUCTS ─── */}
        <main style={{ flex: 1, minWidth: 0, padding: '28px 24px' }}>
          {filteredProducts.length === 0 ? (
            <EmptyState />
          ) : viewMode === 'grid' ? (
            <GridView
              products={filteredProducts}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          ) : (
            <ListView
              products={filteredProducts}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          )}
        </main>
      </div>

      {/* ── MOBILE FILTER DRAWER ─── */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          pointerEvents: showFilters ? 'all' : 'none',
        }}
      >
        {/* Backdrop */}
        <div
          onClick={() => setShowFilters(false)}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            opacity: showFilters ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
        {/* Drawer */}
        <div
          style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: 320, background: 'white',
            transform: showFilters ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s cubic-bezier(.22,.68,0,1)',
            display: 'flex', flexDirection: 'column',
          }}
        >
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #F0EEE9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SlidersHorizontal size={16} color="#374151" />
              <span className="playfair" style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Filters</span>
              {activeFilterCount > 0 && (
                <span style={{ background: '#111827', color: 'white', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button onClick={() => setShowFilters(false)} style={{ background: '#F3F4F6', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color="#374151" />
            </button>
          </div>

          <div className="filter-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            <FilterSidebar
              checkedCategories={checkedCategories}
              checkedBrands={checkedBrands}
              checkedSizes={checkedSizes}
              priceRange={priceRange}
              activeFilterCount={activeFilterCount}
              toggle={toggle}
              setCheckedCategories={setCheckedCategories}
              setCheckedBrands={setCheckedBrands}
              setCheckedSizes={setCheckedSizes}
              setPriceRange={setPriceRange}
              clearAll={clearAll}
              hideHeader
            />
          </div>

          <div style={{ padding: '16px 20px', borderTop: '1px solid #F0EEE9', flexShrink: 0 }}>
            <button
              onClick={() => setShowFilters(false)}
              style={{
                width: '100%', padding: '14px',
                background: '#111827', color: 'white',
                border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GRID VIEW
───────────────────────────────────────────── */
function GridView({ products, wishlist, onToggleWishlist }: {
  products: typeof MOCK_PRODUCTS;
  wishlist: Set<string>;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '28px 20px' }}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          index={i}
          isWishlisted={wishlist.has(product.id)}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
function ProductCard({ product, index, isWishlisted, onToggleWishlist }: {
  product: typeof MOCK_PRODUCTS[0];
  index: number;
  isWishlisted: boolean;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
}) {
  const discount = Math.round((1 - product.price / product.mrp) * 100);
  const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

  const badgeClass = product.badge === 'TRENDING' ? 'badge-trending'
    : product.badge === 'BESTSELLER' ? 'badge-bestseller'
    : product.badge === 'NEW ARRIVAL' ? 'badge-arrival'
    : '';

  return (
    <Link href={`/products/${product.id}`} className={staggerClass} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div className="product-card card-lift" style={{ borderRadius: 16, overflow: 'hidden', background: 'white', cursor: 'pointer' }}>
        {/* Image area */}
        <div style={{ position: 'relative', aspectRatio: '3/4', background: product.bg, overflow: 'hidden' }}>
          {/* Decorative circle blur */}
          <div style={{
            position: 'absolute', bottom: -30, right: -30,
            width: 120, height: 120,
            background: product.accent,
            borderRadius: '50%',
            opacity: 0.12,
            filter: 'blur(24px)',
          }} />
          <div style={{
            position: 'absolute', top: -20, left: -20,
            width: 80, height: 80,
            background: product.accent,
            borderRadius: '50%',
            opacity: 0.08,
            filter: 'blur(16px)',
          }} />

          {/* Emoji */}
          <div className="product-emoji" style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 72, lineHeight: 1,
          }}>
            {product.emoji}
          </div>

          {/* Top row badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start' }}>
              {/* Discount */}
              <span style={{
                background: 'white', color: '#111827',
                fontSize: 11, fontWeight: 700,
                padding: '4px 8px', borderRadius: 7,
                boxShadow: '0 1px 6px rgba(0,0,0,0.10)',
                letterSpacing: '-0.01em',
              }}>
                {discount}% OFF
              </span>
              {/* Named badge */}
              {product.badge && (
                <span className={badgeClass} style={{
                  color: 'white', fontSize: 9,
                  fontWeight: 700, padding: '3px 7px',
                  borderRadius: 5, letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}>
                  {product.badge}
                </span>
              )}
              {/* New dot */}
              {product.isNew && !product.badge && (
                <span style={{
                  background: '#10B981', color: 'white',
                  fontSize: 9, fontWeight: 700,
                  padding: '3px 7px', borderRadius: 5,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>NEW</span>
              )}
            </div>

            {/* Wishlist */}
            <button
              className="wishlist-btn"
              onClick={(e) => onToggleWishlist(product.id, e)}
              style={{
                width: 34, height: 34,
                background: 'white',
                borderRadius: '50%',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 8px rgba(0,0,0,0.12)',
              }}
            >
              <Heart
                size={16}
                fill={isWishlisted ? '#EF4444' : 'none'}
                color={isWishlisted ? '#EF4444' : '#9CA3AF'}
              />
            </button>
          </div>

          {/* Overlay: size chips + quick add */}
          <div className="overlay-actions" style={{
            position: 'absolute', inset: '0 0 0 0',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: '0 12px 12px',
          }}>
            {/* Sizes */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
              {['S', 'M', 'L', 'XL'].map(s => (
                <span
                  key={s}
                  className="size-chip"
                  onClick={e => e.preventDefault()}
                  style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)' }}
                >
                  {s}
                </span>
              ))}
            </div>
            {/* Quick Add */}
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); }}
              style={{
                width: '100%', padding: '10px',
                background: '#111827', color: 'white',
                border: 'none', borderRadius: 10,
                fontSize: 12, fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.04em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <ShoppingBag size={13} /> QUICK ADD
            </button>
          </div>
        </div>

        {/* Info area */}
        <div style={{ padding: '14px 14px 16px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 4px' }}>
            {product.brand}
          </p>
          <h3 style={{ fontSize: 13, fontWeight: 500, color: '#111827', margin: '0 0 10px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3,
              background: product.rating >= 4.5 ? '#ECFDF5' : product.rating >= 4 ? '#FFFBEB' : '#FEF2F2',
              padding: '2px 7px', borderRadius: 6,
            }}>
              <Star size={10} fill={product.rating >= 4.5 ? '#10B981' : product.rating >= 4 ? '#F59E0B' : '#EF4444'}
                color={product.rating >= 4.5 ? '#10B981' : product.rating >= 4 ? '#F59E0B' : '#EF4444'} />
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: product.rating >= 4.5 ? '#059669' : product.rating >= 4 ? '#D97706' : '#DC2626',
              }}>{product.rating}</span>
            </div>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>({product.reviews.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
              ₹{product.price.toLocaleString()}
            </span>
            <span style={{ fontSize: 12, color: '#D1D5DB', textDecoration: 'line-through' }}>
              ₹{product.mrp.toLocaleString()}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A' }}>{discount}% off</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   LIST VIEW
───────────────────────────────────────────── */
function ListView({ products, wishlist, onToggleWishlist }: {
  products: typeof MOCK_PRODUCTS;
  wishlist: Set<string>;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {products.map((product, i) => {
        const discount = Math.round((1 - product.price / product.mrp) * 100);
        const isWishlisted = wishlist.has(product.id);
        return (
          <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className={`list-card stagger-${Math.min(i + 1, 8)}`}
              style={{
                display: 'flex', gap: 16, padding: 16,
                borderRadius: 16, border: '1px solid #F0EEE9',
                background: '#FAFAF9', cursor: 'pointer',
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: 100, height: 130, flexShrink: 0,
                borderRadius: 12, overflow: 'hidden',
                background: product.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 48, position: 'relative',
              }}>
                {product.emoji}
                {discount >= 40 && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.55)', color: 'white', fontSize: 10, fontWeight: 700, textAlign: 'center', padding: '4px 0' }}>
                    {discount}% OFF
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', margin: 0 }}>{product.brand}</p>
                    {product.badge && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#D97706', background: '#FFFBEB', padding: '2px 6px', borderRadius: 5, letterSpacing: '0.04em' }}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 8px', lineHeight: 1.35 }}>{product.name}</h3>

                  {/* Sizes */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                    {['S', 'M', 'L', 'XL'].map(s => (
                      <span key={s} className="size-chip">{s}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>₹{product.price.toLocaleString()}</span>
                      <span style={{ fontSize: 12, color: '#D1D5DB', textDecoration: 'line-through' }}>₹{product.mrp.toLocaleString()}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#16A34A' }}>{discount}% off</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Star size={11} fill="#F59E0B" color="#F59E0B" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{product.rating}</span>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>({product.reviews.toLocaleString()})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="wishlist-btn"
                      onClick={(e) => onToggleWishlist(product.id, e)}
                      style={{
                        width: 38, height: 38, borderRadius: '50%',
                        border: '1.5px solid #E5E7EB',
                        background: isWishlisted ? '#FEF2F2' : 'white',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#9CA3AF'} />
                    </button>
                    <button
                      onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                      style={{
                        padding: '0 18px', height: 38, borderRadius: 10,
                        background: '#111827', color: 'white', border: 'none',
                        fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      <ShoppingBag size={13} /> ADD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FILTER SIDEBAR
───────────────────────────────────────────── */
function FilterSidebar({
  checkedCategories, checkedBrands, checkedSizes, priceRange,
  activeFilterCount, toggle, setCheckedCategories, setCheckedBrands,
  setCheckedSizes, setPriceRange, clearAll, hideHeader,
}: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      {!hideHeader && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <SlidersHorizontal size={14} color="#374151" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', letterSpacing: '0.02em' }}>FILTERS</span>
            {activeFilterCount > 0 && (
              <span style={{ background: '#111827', color: 'white', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearAll} style={{ fontSize: 11, fontWeight: 600, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Category */}
      <FilterSection title="Category" defaultOpen>
        {CATEGORIES.map(cat => (
          <FilterRow
            key={cat}
            label={cat}
            count={MOCK_PRODUCTS.filter(p => p.category === cat).length}
            checked={checkedCategories.has(cat)}
            onChange={() => toggle(checkedCategories, cat, setCheckedCategories)}
          />
        ))}
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range" defaultOpen>
        {/* Mini histogram bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 32, marginBottom: 10 }}>
          {[12, 25, 38, 30, 18, 22, 15, 8].map((h, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: 3,
              background: (i / 8) * 5000 <= priceRange ? '#111827' : '#E5E7EB',
              height: `${h}px`,
              transition: 'background 0.2s ease',
            }} />
          ))}
        </div>
        <input
          type="range" min={0} max={5000} step={100}
          value={priceRange}
          onChange={e => setPriceRange(Number(e.target.value))}
          className="range-thumb"
          style={{ width: '100%', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>₹0</span>
          <span style={{
            fontSize: 12, fontWeight: 700, color: '#111827',
            background: '#F3F4F6', padding: '2px 8px', borderRadius: 6,
          }}>₹{priceRange.toLocaleString()}</span>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        {BRANDS.map(brand => (
          <FilterRow
            key={brand}
            label={brand}
            count={MOCK_PRODUCTS.filter(p => p.brand === brand).length}
            checked={checkedBrands.has(brand)}
            onChange={() => toggle(checkedBrands, brand, setCheckedBrands)}
          />
        ))}
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size" last>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {SIZES.map(size => (
            <button
              key={size}
              onClick={() => toggle(checkedSizes, size, setCheckedSizes)}
              style={{
                minWidth: 40, height: 36,
                border: `2px solid ${checkedSizes.has(size) ? '#111827' : '#E5E7EB'}`,
                borderRadius: 9, background: checkedSizes.has(size) ? '#111827' : 'white',
                color: checkedSizes.has(size) ? 'white' : '#6B7280',
                fontSize: 12, fontWeight: 700,
                cursor: 'pointer', padding: '0 10px',
                transition: 'all 0.15s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}
            >
              {checkedSizes.has(size) && <Check size={11} />}
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating" last>
        {[4.5, 4, 3].map(r => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 0' }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid #E5E7EB', background: 'white', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={12} fill={i <= r ? '#F59E0B' : '#E5E7EB'} color={i <= r ? '#F59E0B' : '#E5E7EB'} />
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#6B7280' }}>{r}+ only</span>
          </div>
        ))}
      </FilterSection>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FILTER SECTION
───────────────────────────────────────────── */
function FilterSection({ title, children, last, defaultOpen }: { title: string; children: React.ReactNode; last?: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  return (
    <div style={{ borderBottom: last ? 'none' : '1px solid #F3F4F6', paddingBottom: last ? 0 : 20, marginBottom: 20 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none',
          cursor: 'pointer', padding: '0 0 12px',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: '#111827', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{title}</span>
        <ChevronDown size={14} color="#9CA3AF" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>
      {open && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FILTER ROW
───────────────────────────────────────────── */
function FilterRow({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div
        onClick={onChange}
        style={{
          width: 18, height: 18, borderRadius: 5, flexShrink: 0,
          border: `2px solid ${checked ? '#111827' : '#D1D5DB'}`,
          background: checked ? '#111827' : 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}
      >
        {checked && <Check size={11} color="white" strokeWidth={2.5} />}
      </div>
      <span style={{ fontSize: 13, color: checked ? '#111827' : '#6B7280', fontWeight: checked ? 600 : 400, flex: 1, transition: 'color 0.15s ease' }}>
        {label}
      </span>
      {count !== undefined && (
        <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>{count}</span>
      )}
    </label>
  );
}

/* ─────────────────────────────────────────────
   FILTER CHIP
───────────────────────────────────────────── */
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: '#F3F4F6', color: '#374151',
      fontSize: 12, fontWeight: 500,
      padding: '5px 10px 5px 12px', borderRadius: 99,
    }}>
      {label}
      <button
        onClick={onRemove}
        style={{
          background: '#D1D5DB', border: 'none', borderRadius: '50%',
          width: 16, height: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, flexShrink: 0,
        }}
      >
        <X size={9} color="#6B7280" />
      </button>
    </span>
  );
}

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: '#F3F4F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, marginBottom: 20,
      }}>🕵️</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>No matches found</h3>
      <p style={{ fontSize: 14, color: '#9CA3AF', maxWidth: 280, lineHeight: 1.6 }}>
        Try removing some filters or broadening your search — there's a lot more to explore.
      </p>
    </div>
  );
} 