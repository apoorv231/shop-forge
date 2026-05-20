'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/lib/permissions';
import { 
  Package, Eye, ChevronRight, Truck, CheckCircle2, Clock, 
  MapPin, Calendar, Receipt, Box, AlertCircle, ArrowRight,
  Download, X, Printer
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Use placeholder images or local images instead of external URLs
// Option 1: Local images in /public/products/
// Option 2: Data URIs for simple placeholders
// Option 3: Configure unsplash in next.config.js (shown above)

const PRODUCT_THUMBNAILS = [
  '/products/shirt.jpg',
  '/products/jeans.jpg', 
  '/products/tshirt.jpg',
  '/products/jacket.jpg',
  '/products/shoes.jpg',
];

// Fallback to colored placeholders if images don't exist
const getPlaceholderColor = (index: number) => {
  const colors = ['#E8F4FD', '#E0E7FF', '#FCE7F3', '#FEE2E2', '#ECFCCB'];
  return colors[index % colors.length];
};

const MOCK_BUYER_ORDERS = [
  { 
    id: 'ORD-7829', 
    date: '2024-05-20', 
    total: 3597, 
    status: 'Delivered', 
    items: 3,
    itemImages: [0, 1, 2], // indices into PRODUCT_THUMBNAILS
    itemNames: ['Slim Fit Casual Shirt', 'High Rise Slim Jeans', 'Pack of 2 Cotton Tees'],
    itemPrices: [1299, 1999, 599],
    deliveryDate: '2024-05-23',
    trackingId: 'TRK-9988776655',
    shippingAddress: '123 Main Street, Mumbai, Maharashtra 400001',
    paymentMethod: 'Credit Card ending in 4242'
  },
  { 
    id: 'ORD-7821', 
    date: '2024-05-18', 
    total: 1999, 
    status: 'Shipped', 
    items: 1,
    itemImages: [3],
    itemNames: ['Printed Bomber Jacket'],
    itemPrices: [1999],
    estimatedDelivery: '2024-05-25',
    trackingId: 'TRK-1122334455',
    shippingAddress: '456 Park Avenue, Delhi, 110001',
    paymentMethod: 'UPI'
  },
  { 
    id: 'ORD-7815', 
    date: '2024-05-15', 
    total: 2598, 
    status: 'Processing', 
    items: 2,
    itemImages: [0, 4],
    itemNames: ['Slim Fit Casual Shirt', 'Canvas Slip-On Sneakers'],
    itemPrices: [1299, 1299],
    estimatedDelivery: '2024-05-28',
    shippingAddress: '789 Beach Road, Bangalore, 560001',
    paymentMethod: 'Debit Card ending in 8888'
  },
  { 
    id: 'ORD-7802', 
    date: '2024-05-10', 
    total: 4599, 
    status: 'Delivered', 
    items: 4,
    itemImages: [1, 2, 3, 4],
    itemNames: ['High Rise Slim Jeans', 'Pack of 2 Cotton Tees', 'Printed Bomber Jacket', 'Canvas Slip-On Sneakers'],
    itemPrices: [1999, 599, 2499, 1299],
    deliveryDate: '2024-05-14',
    trackingId: 'TRK-5566778899',
    shippingAddress: '321 Lake View, Chennai, 600001',
    paymentMethod: 'Net Banking'
  },
  { 
    id: 'ORD-7798', 
    date: '2024-05-08', 
    total: 899, 
    status: 'Cancelled', 
    items: 1,
    itemImages: [0],
    itemNames: ['Slim Fit Casual Shirt'],
    itemPrices: [899],
    shippingAddress: '654 Hill Station, Pune, 411001',
    paymentMethod: 'Cash on Delivery',
    cancellationReason: 'Item no longer needed'
  },
];

type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';

const STATUS_CONFIG: Record<OrderStatus, { 
  label: string; 
  icon: React.ElementType; 
  bg: string; 
  text: string; 
  border: string;
  dot: string;
}> = {
  Delivered: { 
    label: 'Delivered', 
    icon: CheckCircle2, 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700', 
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  },
  Shipped: { 
    label: 'In Transit', 
    icon: Truck, 
    bg: 'bg-sky-50', 
    text: 'text-sky-700', 
    border: 'border-sky-200',
    dot: 'bg-sky-500'
  },
  Processing: { 
    label: 'Processing', 
    icon: Clock, 
    bg: 'bg-amber-50', 
    text: 'text-amber-700', 
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  },
  Cancelled: { 
    label: 'Cancelled', 
    icon: AlertCircle, 
    bg: 'bg-gray-50', 
    text: 'text-gray-600', 
    border: 'border-gray-200',
    dot: 'bg-gray-400'
  },
};

export default function BuyerOrdersPage() {
  const { user } = useAuthStore();
  const [orders] = useState(MOCK_BUYER_ORDERS);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<typeof MOCK_BUYER_ORDERS[0] | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  if (!user || !hasPermission(user.role, 'VIEW_ORDERS')) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-sm text-gray-500">You don't have permission to view orders.</p>
          </div>
        </div>
      </>
    );
  }

  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status as OrderStatus] || STATUS_CONFIG.Processing;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleViewDetails = (order: typeof MOCK_BUYER_ORDERS[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrder(order);
  };

  const handleViewInvoice = (order: typeof MOCK_BUYER_ORDERS[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setShowInvoice(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowInvoice(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50/50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Box className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Orders</h1>
                <p className="text-sm text-gray-500 mt-0.5">Track and manage your purchases</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Orders', value: orders.length, icon: Receipt },
              { label: 'In Transit', value: orders.filter(o => o.status === 'Shipped').length, icon: Truck },
              { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, icon: CheckCircle2 },
              { label: 'Processing', value: orders.filter(o => o.status === 'Processing').length, icon: Clock },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.map((order) => {
              const config = getStatusConfig(order.status);
              const StatusIcon = config.icon;
              const isExpanded = expandedOrder === order.id;

              return (
                <div 
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-200"
                >
                  {/* Order Header */}
                  <div 
                    className="p-5 sm:p-6 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Order Info */}
                      <div className="flex items-start gap-4">
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                          ${config.bg} ${config.border} border
                        `}>
                          <StatusIcon className={`w-6 h-6 ${config.text}`} />
                        </div>
                        
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{order.id}</h3>
                            <span className={`
                              inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold
                              ${config.bg} ${config.text} border ${config.border}
                            `}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                              {config.label}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(order.date)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5" />
                              {order.items} {order.items === 1 ? 'item' : 'items'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Action */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Total amount</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button 
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={(e) => handleViewDetails(order, e)}
                          >
                            <Eye className="w-4 h-4" />
                            Details
                          </button>
                          <ChevronRight className={`
                            w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0
                            ${isExpanded ? 'rotate-90' : ''}
                          `} />
                        </div>
                      </div>
                    </div>

                    {/* Product Thumbnails */}
                    <div className="flex items-center gap-2 mt-4 pl-16">
                      <div className="flex -space-x-2">
                        {order.itemImages.slice(0, 3).map((imgIndex, i) => (
                          <div 
                            key={i} 
                            className="w-8 h-8 rounded-lg border-2 border-white overflow-hidden relative"
                            style={{ backgroundColor: getPlaceholderColor(imgIndex) }}
                          >
                            {/* Try to load image, fallback to color */}
                            <Image
                              src={PRODUCT_THUMBNAILS[imgIndex]}
                              alt={order.itemNames[i]}
                              fill
                              className="object-cover"
                              sizes="32px"
                              onError={(e) => {
                                // Hide broken image, show colored background
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                        {order.itemImages.length > 3 && (
                          <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                            +{order.itemImages.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 sm:px-6 py-5 bg-gray-50/30">
                      {/* Timeline */}
                      <div className="mb-6">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Order Progress</h4>
                        <div className="relative">
                          <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-200" />
                          <div className="space-y-6">
                            {[
                              { 
                                label: 'Order Placed', 
                                date: formatDate(order.date),
                                done: true,
                                active: order.status === 'Processing'
                              },
                              { 
                                label: 'Processing', 
                                date: order.status !== 'Processing' ? 'May 16, 2024' : 'In progress',
                                done: order.status !== 'Processing',
                                active: order.status === 'Processing'
                              },
                              { 
                                label: 'Shipped', 
                                date: order.status === 'Shipped' || order.status === 'Delivered' 
                                  ? 'May 18, 2024' 
                                  : 'Pending',
                                done: order.status === 'Shipped' || order.status === 'Delivered',
                                active: order.status === 'Shipped'
                              },
                              { 
                                label: 'Delivered', 
                                date: order.deliveryDate 
                                  ? formatDate(order.deliveryDate) 
                                  : order.estimatedDelivery 
                                    ? `Est. ${formatDate(order.estimatedDelivery)}`
                                    : 'Pending',
                                done: order.status === 'Delivered',
                                active: order.status === 'Delivered'
                              },
                            ].map((step) => (
                              <div key={step.label} className="relative flex items-start gap-4">
                                <div className={`
                                  w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10
                                  ${step.done 
                                    ? 'bg-emerald-500' 
                                    : step.active 
                                      ? 'bg-gray-900 ring-4 ring-gray-100' 
                                      : 'bg-gray-200'
                                  }
                                `}>
                                  {step.done ? (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  ) : step.active ? (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  ) : (
                                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                  )}
                                </div>
                                <div className="flex-1 pt-0.5">
                                  <p className={`text-sm font-medium ${step.done || step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.label}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">{step.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tracking & Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {order.trackingId ? (
                            <span>Tracking ID: <span className="font-mono font-medium text-gray-900">{order.trackingId}</span></span>
                          ) : (
                            <span>Tracking ID will be available once shipped</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button 
                            onClick={(e) => handleViewInvoice(order, e)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                          >
                            <Receipt className="w-4 h-4" />
                            Invoice
                          </button>
                          <button 
                            onClick={(e) => handleViewDetails(order, e)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders yet</h3>
              <p className="text-sm text-gray-500 mb-6">Start shopping to see your orders here.</p>
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && !showInvoice && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={closeModal}
          getStatusConfig={getStatusConfig}
          formatDate={formatDate}
          getPlaceholderColor={getPlaceholderColor}
          productThumbnails={PRODUCT_THUMBNAILS}
        />
      )}

      {/* Invoice Modal */}
      {selectedOrder && showInvoice && (
        <InvoiceModal 
          order={selectedOrder} 
          onClose={closeModal}
          getStatusConfig={getStatusConfig}
          formatDate={formatDate}
        />
      )}
    </>
  );
}

// Order Details Modal Component
function OrderDetailsModal({ 
  order, 
  onClose, 
  getStatusConfig, 
  formatDate,
  getPlaceholderColor,
  productThumbnails
}: { 
  order: typeof MOCK_BUYER_ORDERS[0];
  onClose: () => void;
  getStatusConfig: (status: string) => any;
  formatDate: (date: string) => string;
  getPlaceholderColor: (index: number) => string;
  productThumbnails: string[];
}) {
  const config = getStatusConfig(order.status);
  const StatusIcon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
              <StatusIcon className={`w-5 h-5 ${config.text}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{order.id}</h2>
              <p className="text-xs text-gray-500">Placed on {formatDate(order.date)}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${config.bg} ${config.text} border ${config.border}`}>
            <span className={`w-2 h-2 rounded-full ${config.dot}`} />
            {config.label}
          </div>

          {/* Items List */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Items ({order.items})</h3>
            <div className="space-y-3">
              {order.itemNames.map((name, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div 
                    className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden relative"
                    style={{ backgroundColor: getPlaceholderColor(order.itemImages[i]) }}
                  >
                    <Image
                      src={productThumbnails[order.itemImages[i]]}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="64px"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">Qty: 1</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{order.itemPrices[i].toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Order Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">₹{order.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="font-medium text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="font-medium">₹0</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-lg text-gray-900">₹{order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-100 rounded-xl">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Shipping Address</h4>
              <p className="text-sm text-gray-700">{order.shippingAddress}</p>
            </div>
            <div className="p-4 border border-gray-100 rounded-xl">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment Method</h4>
              <p className="text-sm text-gray-700">{order.paymentMethod}</p>
            </div>
          </div>

          {/* Tracking */}
          {order.trackingId && (
            <div className="p-4 border border-gray-100 rounded-xl">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tracking Information</h4>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-mono font-medium text-gray-900">{order.trackingId}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              <Download className="w-4 h-4" />
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Invoice Modal Component
function InvoiceModal({ 
  order, 
  onClose, 
  getStatusConfig, 
  formatDate 
}: { 
  order: typeof MOCK_BUYER_ORDERS[0];
  onClose: () => void;
  getStatusConfig: (status: string) => any;
  formatDate: (date: string) => string;
}) {
  const config = getStatusConfig(order.status);
  const invoiceDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handleDownload = () => {
    // Create invoice content
    const invoiceContent = `
INVOICE
-------
Invoice #: INV-${order.id}
Date: ${invoiceDate}
Order #: ${order.id}
Order Date: ${formatDate(order.date)}

BILL TO:
${order.shippingAddress}

ITEMS:
${order.itemNames.map((name, i) => `${i + 1}. ${name} - ₹${order.itemPrices[i].toLocaleString()}`).join('\n')}

SUBTOTAL: ₹${order.total.toLocaleString()}
SHIPPING: Free
TAX: ₹0
TOTAL: ₹${order.total.toLocaleString()}

Payment Method: ${order.paymentMethod}
Status: ${order.status}
    `.trim();

    // Create and download file
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-h-none">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Invoice</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Invoice Content */}
        <div className="p-8 print:p-0" id="invoice-content">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">INVOICE</h1>
              <p className="text-sm text-gray-500">Invoice #: INV-{order.id}</p>
              <p className="text-sm text-gray-500">Date: {invoiceDate}</p>
            </div>
            <div className="text-right">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-2 ml-auto">
                <Box className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900">Your Store</p>
              <p className="text-xs text-gray-500">support@store.com</p>
            </div>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
              <p className="font-medium text-gray-900">{order.id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Order Date</p>
              <p className="font-medium text-gray-900">{formatDate(order.date)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</p>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                {config.label}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Payment Method</p>
              <p className="font-medium text-gray-900">{order.paymentMethod}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3">Item</th>
                  <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider py-3">Qty</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider py-3">Price</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.itemNames.map((name, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">{name}</td>
                    <td className="py-3 text-sm text-gray-500 text-center">1</td>
                    <td className="py-3 text-sm text-gray-500 text-right">₹{order.itemPrices[i].toLocaleString()}</td>
                    <td className="py-3 text-sm font-medium text-gray-900 text-right">₹{order.itemPrices[i].toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (GST)</span>
                <span className="font-medium">₹0</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-4 border border-gray-100 rounded-xl mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Shipping Address</p>
            <p className="text-sm text-gray-700">{order.shippingAddress}</p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
            <p>Thank you for shopping with us!</p>
            <p className="mt-1">For any queries, contact support@store.com</p>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button 
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}