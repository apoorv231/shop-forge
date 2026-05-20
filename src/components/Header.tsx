'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Heart, Package, LogOut, LayoutDashboard, Store, ShieldCheck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Men', href: '/products?gender=men' },
  { label: 'Women', href: '/products?gender=women' },
  { label: 'Kids', href: '/products?gender=kids' },
  { label: 'Accessories', href: '/products?category=accessories' },
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Promo Strip */}
      <div className="bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        Free Shipping on orders above ₹999 &nbsp;·&nbsp; Use code <span className="font-semibold underline underline-offset-2">SAVE10</span> for 10% off
      </div>

      {/* Main Header */}
      <div className={`bg-white transition-all duration-300 ${scrolled ? 'shadow-lg shadow-black/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-10">
              <Link href="/" className="text-2xl font-bold tracking-tight text-neutral-900 hover:opacity-70 transition-opacity">
                AJIO
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-3 py-2 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-50 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              {/* Mobile Search */}
              <button className="md:hidden p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-600">
                <Search className="w-[18px] h-[18px]" />
              </button>

              {/* Wishlist */}
              <Link 
                href="/wishlist" 
                className="hidden sm:flex p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-500 hover:text-neutral-900"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px]" />
              </Link>

              {/* Cart */}
              <Link 
                href="/cart" 
                className="relative p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-500 hover:text-neutral-900"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 bg-neutral-900 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="relative ml-1" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-all duration-200"
                  >
                    <div className="w-7 h-7 bg-neutral-900 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:block text-[13px] font-medium text-neutral-700 max-w-[80px] truncate">{user?.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 hidden xl:block ${showMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl shadow-black/10 border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
                      <div className="p-4 border-b border-neutral-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-neutral-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user?.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-neutral-900 truncate">{user?.name}</p>
                            <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link href="/profile" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
                          <User className="w-4 h-4 text-neutral-400" /> Profile
                        </Link>
                        {user?.role === 'BUYER' && (
                          <Link href="/orders" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
                            <Package className="w-4 h-4 text-neutral-400" /> Orders
                          </Link>
                        )}
                        {user?.role === 'SELLER' && (
                          <>
                            <Link href="/seller/products" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
                              <Store className="w-4 h-4 text-neutral-400" /> My Products
                            </Link>
                            <Link href="/seller/orders" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
                              <ShoppingBag className="w-4 h-4 text-neutral-400" /> Seller Orders
                            </Link>
                          </>
                        )}
                        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
                          <>
                            <Link href="/admin/users" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
                              <LayoutDashboard className="w-4 h-4 text-neutral-400" /> Admin
                            </Link>
                            <Link href="/admin/permissions" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
                              <ShieldCheck className="w-4 h-4 text-neutral-400" /> Permissions
                            </Link>
                          </>
                        )}
                        <div className="border-t border-neutral-100 mt-1 pt-1">
                          <button onClick={() => { logout(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-600 hover:text-neutral-900 ml-1"
                >
                  <User className="w-[18px] h-[18px]" />
                  <span className="text-[13px] font-medium hidden xl:block">Sign In</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2.5 rounded-lg hover:bg-neutral-50 transition-colors ml-1"
                aria-label="Menu"
              >
                {showMobileMenu ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-neutral-100 shadow-lg shadow-black/5 animate-in slide-in-from-top-1 duration-200">
          <div className="px-6 py-4 border-b border-neutral-100">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>
          <nav className="flex flex-col px-2 py-2">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                onClick={() => setShowMobileMenu(false)} 
                className="px-4 py-3 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'SELLER' && (
              <>
                <div className="mx-4 my-2 border-t border-neutral-100" />
                <Link href="/seller/products" onClick={() => setShowMobileMenu(false)} className="px-4 py-3 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all">
                  My Products
                </Link>
                <Link href="/seller/orders" onClick={() => setShowMobileMenu(false)} className="px-4 py-3 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all">
                  Orders
                </Link>
              </>
            )}
            {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
              <>
                <div className="mx-4 my-2 border-t border-neutral-100" />
                <Link href="/admin/users" onClick={() => setShowMobileMenu(false)} className="px-4 py-3 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all">
                  Admin Panel
                </Link>
                <Link href="/admin/permissions" onClick={() => setShowMobileMenu(false)} className="px-4 py-3 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all">
                  Permissions
                </Link>
              </>
            )}
          </nav>
          {!isAuthenticated && (
            <div className="px-6 py-4 border-t border-neutral-100">
              <Link 
                href="/login" 
                onClick={() => setShowMobileMenu(false)} 
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white py-2.5 rounded-lg text-[13px] font-medium transition-colors"
              >
                <User className="w-4 h-4" /> Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}