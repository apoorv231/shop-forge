'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/lib/permissions';
import { Package, Eye, CheckCircle, XCircle } from 'lucide-react';

const MOCK_SELLER_ORDERS = [
  { id: '1', buyer: 'John Doe', product: 'Slim Fit Shirt', quantity: 2, total: 2598, status: 'Pending', date: '2024-05-20' },
  { id: '2', buyer: 'Jane Smith', product: 'Casual Jeans', quantity: 1, total: 1999, status: 'Shipped', date: '2024-05-19' },
  { id: '3', buyer: 'Bob Wilson', product: 'Cotton T-Shirt', quantity: 3, total: 1797, status: 'Delivered', date: '2024-05-18' },
];

export default function SellerOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState(MOCK_SELLER_ORDERS);
  const [filter, setFilter] = useState('All');

  if (!user || !hasPermission(user.role, 'MANAGE_ORDERS')) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2">You need Seller or Admin role to manage orders.</p>
        </div>
      </>
    );
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold">Order Management</h1>
          </div>
          <div className="flex gap-2">
            {['All', 'Pending', 'Shipped', 'Delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md ${
                  filter === status ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Buyer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Qty</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">#{order.id}</td>
                  <td className="px-6 py-4">{order.buyer}</td>
                  <td className="px-6 py-4">{order.product}</td>
                  <td className="px-6 py-4">{order.quantity}</td>
                  <td className="px-6 py-4">₹{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Shipped')}
                          className="p-2 hover:bg-green-50 rounded text-green-600"
                          title="Mark as Shipped"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {order.status === 'Shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                          className="p-2 hover:bg-green-50 rounded text-green-600"
                          title="Mark as Delivered"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Shipped</p>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'Shipped').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Delivered</p>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'Delivered').length}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
