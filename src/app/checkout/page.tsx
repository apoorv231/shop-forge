'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/lib/permissions';
import { CreditCard, MapPin, CheckCircle, Wallet, Building2, Smartphone, ShieldCheck, Package, Truck, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  if (!user || !hasPermission(user.role, 'ADD_TO_CART')) {
    router.push('/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Order placed successfully!');
    router.push('/orders');
  };

  const orderSummary = { subtotal: 3298, discount: 500, shipping: 0, total: 2798 };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-10 animate-slide-up">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Secure Checkout</h1>
              <p className="text-gray-600 mt-1">Complete your order in a few simple steps</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="card p-8 animate-slide-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold">Delivery Address</h2>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                    <textarea
                      placeholder="Complete Address (House No, Street, Landmark)"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors resize-none"
                      rows={3}
                    />
                    <div className="grid sm:grid-cols-2 gap-5">
                      <input
                        type="text"
                        placeholder="City"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="card p-8 animate-slide-in" style={{ animationDelay: '100ms' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold">Payment Method</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <label className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="w-5 h-5 text-red-600"
                      />
                      <Package className="w-6 h-6 text-gray-600" />
                      <div className="flex-1">
                        <p className="font-semibold">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive</p>
                      </div>
                    </label>
                    <label className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'upi' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="w-5 h-5 text-red-600"
                      />
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="w-8 h-8 object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">UPI Payment</p>
                        <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </label>
                    <label className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="w-5 h-5 text-red-600"
                      />
                      <div className="flex gap-2 items-center">
                        <img src="https://cdn.worldvectorlogo.com/logos/visa-2.svg" alt="Visa" className="h-5" />
                        <img src="https://cdn.worldvectorlogo.com/logos/mastercard-6.svg" alt="Mastercard" className="h-8" />
                        <img src="https://cdn.worldvectorlogo.com/logos/rupay.svg" alt="Rupay" className="h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Credit/Debit Card</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, Rupay</p>
                      </div>
                    </label>
                    <label className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'netbanking' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="netbanking"
                        checked={formData.paymentMethod === 'netbanking'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="w-5 h-5 text-red-600"
                      />
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Net Banking</p>
                        <p className="text-sm text-gray-500">All major banks</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 group animate-slide-in" style={{ animationDelay: '200ms' }}>
                  <Lock className="w-5 h-5" />
                  Place Order Securely
                  <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="card p-8 sticky top-24 animate-slide-up">
                <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{orderSummary.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{orderSummary.discount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-3xl font-bold text-red-600">₹{orderSummary.total}</span>
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-red-600" />
                    <span>Free delivery on all orders</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ShieldCheck className="w-5 h-5 text-red-600" />
                    <span>100% secure payments</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Package className="w-5 h-5 text-red-600" />
                    <span>Easy returns & refunds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
