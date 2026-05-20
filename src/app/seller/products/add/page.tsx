'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/lib/permissions';
import { Package, Upload, Tag, DollarSign, Box, Image as ImageIcon, Save, X } from 'lucide-react';

export default function AddProductPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    mrp: '',
    category: '',
    brand: '',
    stock: '',
    sizes: [] as string[],
  });

  if (!user || !hasPermission(user.role, 'MANAGE_PRODUCTS')) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        </div>
      </>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product data:', formData);
    alert('Product added successfully!');
    router.push('/seller/products');
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-10 animate-slide-up">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Add New Product</h1>
              <p className="text-gray-600 mt-1">Fill in the details to list your product</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card p-8 animate-slide-in">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-red-600" />
                Basic Information
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Slim Fit Casual Shirt"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product in detail..."
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 resize-none transition-colors"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g., AJIO"
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="shirts">Shirts</option>
                      <option value="jeans">Jeans</option>
                      <option value="trousers">Trousers</option>
                      <option value="tshirts">T-Shirts</option>
                      <option value="jackets">Jackets</option>
                      <option value="shoes">Shoes</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8 animate-slide-in" style={{ animationDelay: '100ms' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-red-600" />
                Pricing & Stock
              </h3>
              
              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="2999"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1499"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="100"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold mb-3">Available Sizes</label>
                <div className="flex gap-3 flex-wrap">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`w-14 h-14 border-2 rounded-xl font-semibold transition-all ${
                        formData.sizes.includes(size)
                          ? 'border-red-600 bg-red-50 text-red-600 scale-105'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card p-8 animate-slide-in" style={{ animationDelay: '200ms' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-red-600" />
                Product Images
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-red-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex gap-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
              <button type="submit" className="btn-primary flex-1 py-5 text-lg flex items-center justify-center gap-3">
                <Save className="w-5 h-5" />
                Add Product
              </button>
              <button type="button" onClick={() => router.back()} className="btn-secondary px-8 py-5 flex items-center gap-2">
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
