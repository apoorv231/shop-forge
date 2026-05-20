'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/lib/permissions';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Sparkles, Gift } from 'lucide-react';
import Link from 'next/link';

const MOCK_CART_ITEMS = [
  { id: '1', productId: '1', name: 'Slim Fit Casual Shirt', price: 1299, quantity: 2, image: '/placeholder.jpg', size: 'M', color: 'Blue' },
  { id: '2', productId: '2', name: 'Premium Denim Jeans', price: 1999, quantity: 1, image: '/placeholder.jpg', size: 'L', color: 'Black' },
];

export default function CartPage() {
  const { user } = useAuthStore();
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(false);

  if (!user || !hasPermission(user.role, 'ADD_TO_CART')) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center animate-scale-in">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <ShoppingCart className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Please login as a buyer to add items to cart</p>
            <Link href="/login" className="btn-primary inline-flex items-center gap-2">
              Login to Continue
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </>
    );
  }

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setAppliedPromo(true);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedPromo ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8 animate-slide-up">
            <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">{cartItems.length} items in your bag</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="card p-6 hover:shadow-xl transition-all duration-300 group animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex gap-6">
                    <div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">Image</div>
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">50% OFF</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-red-600 transition-colors">{item.name}</h3>
                          <div className="flex gap-3 mt-2 text-sm text-gray-600">
                            <span>Size: <span className="font-semibold">{item.size}</span></span>
                            <span>•</span>
                            <span>Color: <span className="font-semibold">{item.color}</span></span>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all h-fit">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1.5">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">₹{item.price * item.quantity}</p>
                          <p className="text-sm text-gray-500 line-through">₹{item.price * item.quantity * 2}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24 animate-slide-up">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold">Order Summary</h2>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Have a promo code?</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="SAVE10" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 uppercase" />
                    </div>
                    <button onClick={applyPromo} className="btn-secondary px-6 whitespace-nowrap">Apply</button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600 animate-slide-in">
                      <Gift className="w-4 h-4" />
                      <span>Promo code applied!</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 animate-slide-in">
                      <span>Discount</span>
                      <span className="font-semibold">-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl mb-6">
                    <p className="text-sm text-gray-700 text-center font-medium">🎉 Add ₹{999 - subtotal} more for FREE shipping</p>
                    <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-red-600 to-pink-600 h-full transition-all duration-500" style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-4xl font-bold text-red-600">₹{total}</span>
                </div>

                <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 group">
                  Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
