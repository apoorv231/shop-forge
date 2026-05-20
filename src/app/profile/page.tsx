'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { 
  User, Mail, Phone, MapPin, Edit2, Save, ShoppingBag, Package, Heart, Settings,
  Camera, Shield, Bell, CreditCard, LogOut, ChevronRight, Check, X, Upload,
  Calendar, Globe, Award, Star, TrendingUp, Clock, Eye, Lock, MapPinned,
  Sparkles, ShieldCheck, UserCheck, KeyRound, FileText, Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
// Arctic Slate: Clean, crisp, modern with cool blue-gray tones

const DESIGN = {
  bg: {
    page: 'bg-[#F0F4F8]',        // arctic blue-gray
    card: 'bg-white',
    elevated: 'bg-[#E8EDF2]',    // deeper arctic
    modal: 'bg-white',
    hover: 'bg-[#DFE4EA]',
    accent: 'bg-[#0F172A]',       // slate 900
    subtle: 'bg-[#F8FAFC]',
    danger: 'bg-[#FEF2F2]',
    success: 'bg-[#F0FDF4]',
    warning: 'bg-[#FFFBEB]',
    info: 'bg-[#EFF6FF]',
  },
  text: {
    primary: 'text-[#0F172A]',     // slate 900
    secondary: 'text-[#475569]',  // slate 600
    muted: 'text-[#94A3B8]',       // slate 400
    inverse: 'text-white',
    accent: 'text-[#2563EB]',      // blue 600
    success: 'text-[#16A34A]',     // green 600
    warning: 'text-[#D97706]',      // amber 600
    danger: 'text-[#DC2626]',       // red 600
  },
  border: {
    light: 'border-[#E2E8F0]',
    medium: 'border-[#CBD5E1]',
    accent: 'border-[#2563EB]',
    focus: 'border-[#0F172A]',
  },
  accent: {
    blue: '#2563EB',
    slate: '#0F172A',
    arctic: '#F0F4F8',
    green: '#16A34A',
    amber: '#D97706',
  }
};

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────

function Badge({ children, variant = 'default', className = '' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'muted';
  className?: string;
}) {
  const variants = {
    default: 'bg-[#0F172A] text-white',
    success: 'bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/20',
    warning: 'bg-[#FFFBEB] text-[#D97706] border border-[#D97706]/20',
    danger: 'bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/20',
    accent: 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20',
    muted: 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  delay = 0 
}: { 
  label: string; 
  value: number; 
  icon: any; 
  trend?: string;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const end = value;
    const startTime = performance.now();
    const duration = 1200;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isVisible, value]);

  return (
    <div 
      className={`relative overflow-hidden bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-all duration-500 group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#F1F5F9] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#16A34A]">
            <TrendingUp className="w-3 h-3" strokeWidth={2} />
            {trend}
          </div>
        )}
      </div>

      <div>
        <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.08em] mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#0F172A] tracking-tight tabular-nums">{count.toLocaleString()}</p>
      </div>
    </div>
  );
}

function SidebarItem({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick,
  badge
}: { 
  icon: any; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
        active 
          ? 'bg-[#0F172A] text-white shadow-md' 
          : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
      }`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : ''}`} strokeWidth={1.5} />
      <span className="text-sm font-semibold flex-1">{label}</span>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          active ? 'bg-white/20 text-white' : 'bg-[#EFF6FF] text-[#2563EB]'
        }`}>
          {badge}
        </span>
      )}
      <ChevronRight className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white/60' : 'text-[#94A3B8]'}`} strokeWidth={2} />
    </button>
  );
}

function FormField({ 
  label, 
  value, 
  onChange, 
  disabled, 
  icon: Icon,
  type = 'text',
  placeholder = ''
}: { 
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  icon: any;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-[0.08em] mb-2.5">
        {label}
      </label>
      <div className="relative">
        <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${disabled ? 'text-[#94A3B8]' : 'text-[#2563EB]'}`} strokeWidth={1.5} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            disabled 
              ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed' 
              : 'bg-white border-[#E2E8F0] text-[#0F172A] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none placeholder:text-[#94A3B8]'
          }`}
        />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'settings'>('profile');
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || 'Rahul Sharma',
    email: user?.email || 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    address: '123 Main Street, Mumbai, Maharashtra',
    pincode: '400001',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    bio: 'Passionate about quality products and seamless shopping experiences.',
    joinDate: '2023-08-15'
  });

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSave = () => {
    setIsEditing(false);
    showToast('Profile updated successfully');
  };

  const handleCancel = () => {
    setIsEditing(false);
    showToast('Changes discarded');
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Header />

      {/* ─── TOAST ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg border animate-in slide-in-from-right-5 fade-in duration-300 ${
          toast.type === 'success' ? 'bg-white border-[#16A34A]/20' : 'bg-white border-[#DC2626]/20'
        }`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            toast.type === 'success' ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'
          }`}>
            {toast.type === 'success' 
              ? <Check className="w-4 h-4 text-[#16A34A]" strokeWidth={2.5} />
              : <X className="w-4 h-4 text-[#DC2626]" strokeWidth={2.5} />
            }
          </div>
          <span className={`text-sm font-semibold ${toast.type === 'success' ? 'text-[#0F172A]' : 'text-[#DC2626]'}`}>
            {toast.message}
          </span>
        </div>
      )}

      <div className="min-h-[calc(100vh-64px)] bg-[#F0F4F8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

          {/* ─── PAGE HEADER ─────────────────────────────────────────────────── */}
          <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 transition-all duration-700 ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight leading-none">
                  My Account
                </h1>
                <Badge variant="accent">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </Badge>
              </div>
              <p className="text-[15px] text-[#475569] mt-2 leading-relaxed">
                Manage your profile, track orders, and customize your experience
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                <Calendar className="w-4 h-4" strokeWidth={1.5} />
                <span>Member since <span className="font-semibold text-[#475569]">Aug 2023</span></span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">

            {/* ─── SIDEBAR ─────────────────────────────────────────────────────── */}
            <div className={`lg:col-span-3 space-y-6 transition-all duration-700 delay-100 ${
              isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              {/* Profile Card */}
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 text-center">
                <div className="relative inline-block mb-5">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#2563EB] flex items-center justify-center mx-auto shadow-lg">
                    <User className="w-12 h-12 text-white" strokeWidth={1.5} />
                  </div>
                  <button 
                    onClick={() => setShowAvatarUpload(true)}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-center shadow-sm hover:bg-[#F1F5F9] transition-colors"
                  >
                    <Camera className="w-4 h-4 text-[#475569]" strokeWidth={1.5} />
                  </button>
                </div>

                <h2 className="text-lg font-bold text-[#0F172A] mb-1">{formData.name}</h2>
                <p className="text-sm text-[#475569] mb-3">{formData.email}</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge variant="muted">{user.role || 'BUYER'}</Badge>
                  <Badge variant="accent">
                    <Star className="w-3 h-3" />
                    Premium
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-1 text-[11px] text-[#94A3B8]">
                  <Globe className="w-3 h-3" strokeWidth={1.5} />
                  <span>{formData.city}, {formData.country}</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-3 space-y-1">
                <SidebarItem 
                  icon={User} 
                  label="Personal Info" 
                  active={activeTab === 'profile'} 
                  onClick={() => setActiveTab('profile')}
                />
                <SidebarItem 
                  icon={ShoppingBag} 
                  label="My Orders" 
                  active={activeTab === 'orders'} 
                  onClick={() => setActiveTab('orders')}
                  badge="12"
                />
                <SidebarItem 
                  icon={Heart} 
                  label="Wishlist" 
                  active={activeTab === 'wishlist'} 
                  onClick={() => setActiveTab('wishlist')}
                  badge="24"
                />
                <SidebarItem 
                  icon={Settings} 
                  label="Settings" 
                  active={activeTab === 'settings'} 
                  onClick={() => setActiveTab('settings')}
                />

                <div className="pt-2 border-t border-[#E2E8F0]">
                  <SidebarItem 
                    icon={Bell} 
                    label="Notifications" 
                    badge="3"
                  />
                  <SidebarItem 
                    icon={CreditCard} 
                    label="Payment Methods" 
                  />
                  <SidebarItem 
                    icon={Shield} 
                    label="Security" 
                  />
                </div>

                <div className="pt-2 border-t border-[#E2E8F0]">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left text-[#DC2626] hover:bg-[#FEF2F2]">
                    <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-sm font-semibold flex-1">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ─── MAIN CONTENT ────────────────────────────────────────────────── */}
            <div className={`lg:col-span-9 space-y-6 transition-all duration-700 delay-200 ${
              isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <StatCard label="Total Orders" value={12} icon={ShoppingBag} trend="+2 this week" delay={0} />
                <StatCard label="Delivered" value={8} icon={Package} trend="67% rate" delay={100} />
                <StatCard label="Wishlist" value={24} icon={Heart} trend="+5 new" delay={200} />
              </div>

              {/* Personal Information Card */}
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                {/* Card Header */}
                <div className="flex items-center justify-between p-8 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center">
                      <User className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A]">Personal Information</h3>
                      <p className="text-sm text-[#475569]">Manage your identity and contact details</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.97]"
                      >
                        <Edit2 className="w-4 h-4" strokeWidth={2} />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handleCancel}
                          className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E2E8F0] text-[#475569] rounded-xl font-semibold text-sm hover:bg-[#F1F5F9] transition-all"
                        >
                          <X className="w-4 h-4" strokeWidth={2} />
                          Cancel
                        </button>
                        <button 
                          onClick={handleSave} 
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md active:scale-[0.97]"
                        >
                          <Save className="w-4 h-4" strokeWidth={2} />
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <FormField 
                      label="Full Name" 
                      value={formData.name} 
                      onChange={(val) => updateField('name', val)}
                      disabled={!isEditing}
                      icon={User}
                      placeholder="Enter your full name"
                    />
                    <FormField 
                      label="Email Address" 
                      value={formData.email} 
                      onChange={(val) => updateField('email', val)}
                      disabled={!isEditing}
                      icon={Mail}
                      type="email"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <FormField 
                      label="Phone Number" 
                      value={formData.phone} 
                      onChange={(val) => updateField('phone', val)}
                      disabled={!isEditing}
                      icon={Phone}
                      type="tel"
                      placeholder="+91 98765 43210"
                    />
                    <FormField 
                      label="Pincode" 
                      value={formData.pincode} 
                      onChange={(val) => updateField('pincode', val)}
                      disabled={!isEditing}
                      icon={MapPin}
                      placeholder="400001"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-[0.08em] mb-2.5">
                      Address
                    </label>
                    <div className="relative">
                      <MapPinned className={`absolute left-4 top-4 w-5 h-5 ${!isEditing ? 'text-[#94A3B8]' : 'text-[#2563EB]'}`} strokeWidth={1.5} />
                      <textarea
                        value={formData.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Enter your full address"
                        className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-sm font-medium transition-all duration-200 resize-none ${
                          !isEditing 
                            ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed' 
                            : 'bg-white border-[#E2E8F0] text-[#0F172A] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none placeholder:text-[#94A3B8]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-[0.08em] mb-2.5">
                      Bio
                    </label>
                    <div className="relative">
                      <Award className={`absolute left-4 top-4 w-5 h-5 ${!isEditing ? 'text-[#94A3B8]' : 'text-[#2563EB]'}`} strokeWidth={1.5} />
                      <textarea
                        value={formData.bio}
                        onChange={(e) => updateField('bio', e.target.value)}
                        disabled={!isEditing}
                        rows={2}
                        placeholder="Tell us a bit about yourself"
                        className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-sm font-medium transition-all duration-200 resize-none ${
                          !isEditing 
                            ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed' 
                            : 'bg-white border-[#E2E8F0] text-[#0F172A] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none placeholder:text-[#94A3B8]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Location Summary */}
                  <div className="flex items-center gap-6 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 text-sm text-[#475569]">
                      <MapPin className="w-4 h-4 text-[#2563EB]" strokeWidth={1.5} />
                      <span className="font-semibold">{formData.city}</span>
                      <span className="text-[#94A3B8]">•</span>
                      <span>{formData.state}</span>
                      <span className="text-[#94A3B8]">•</span>
                      <span>{formData.country}</span>
                    </div>
                    <div className="w-px h-6 bg-[#CBD5E1]" />
                    <div className="flex items-center gap-2 text-sm text-[#475569]">
                      <Globe className="w-4 h-4 text-[#2563EB]" strokeWidth={1.5} />
                      <span>IST (UTC+5:30)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity & Security Summary */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] flex items-center justify-center">
                      <Clock className="w-4 h-4 text-[#D97706]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A]">Recent Activity</h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { action: 'Order placed', detail: 'Order #ORD-2847 — ₹2,499', time: '2 hours ago', icon: ShoppingBag },
                      { action: 'Profile updated', detail: 'Changed phone number', time: '1 day ago', icon: Edit2 },
                      { action: 'Item added to wishlist', detail: 'Wireless Earbuds Pro', time: '3 days ago', icon: Heart },
                      { action: 'Password changed', detail: 'Security update', time: '1 week ago', icon: Lock },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <activity.icon className="w-3.5 h-3.5 text-[#475569]" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0F172A]">{activity.action}</p>
                          <p className="text-xs text-[#475569] mt-0.5">{activity.detail}</p>
                        </div>
                        <span className="text-[11px] text-[#94A3B8] font-medium flex-shrink-0">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Status */}
                <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
                      <Shield className="w-4 h-4 text-[#16A34A]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A]">Security Status</h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Two-Factor Authentication', status: 'Enabled', variant: 'success' as const, icon: Lock },
                      { label: 'Email Verified', status: 'Verified', variant: 'success' as const, icon: Mail },
                      { label: 'Phone Verified', status: 'Verified', variant: 'success' as const, icon: Phone },
                      { label: 'Last Login', status: 'Today, 10:42 AM', variant: 'muted' as const, icon: Eye },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                            <item.icon className="w-3.5 h-3.5 text-[#475569]" strokeWidth={1.5} />
                          </div>
                          <span className="text-sm font-medium text-[#0F172A]">{item.label}</span>
                        </div>
                        <Badge variant={item.variant}>{item.status}</Badge>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#F1F5F9]">
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#2563EB] hover:text-[#0F172A] transition-colors">
                      <Shield className="w-4 h-4" strokeWidth={1.5} />
                      Manage Security Settings
                      <ChevronRight className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── AVATAR UPLOAD MODAL ───────────────────────────────────────────── */}
      {showAvatarUpload && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-8 animate-in zoom-in-95 fade-in duration-200">
            <div className="w-14 h-14 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Upload className="w-7 h-7 text-[#475569]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] text-center mb-2 tracking-tight">Update Photo</h3>
            <p className="text-[#475569] text-center text-sm leading-relaxed mb-6">
              Upload a new profile picture. JPG, PNG or GIF up to 5MB.
            </p>

            <div className="border-2 border-dashed border-[#E2E8F0] rounded-2xl p-8 text-center hover:border-[#2563EB] hover:bg-[#F8FAFC] transition-all cursor-pointer mb-6">
              <Camera className="w-8 h-8 text-[#94A3B8] mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm font-semibold text-[#0F172A] mb-1">Click to upload</p>
              <p className="text-xs text-[#94A3B8]">or drag and drop</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAvatarUpload(false)}
                className="flex-1 px-5 py-3 border border-[#E2E8F0] text-[#475569] rounded-xl font-semibold text-sm hover:bg-[#F1F5F9] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAvatarUpload(false);
                  showToast('Photo updated');
                }}
                className="flex-1 px-5 py-3 bg-[#0F172A] text-white rounded-xl font-semibold text-sm hover:bg-[#1E293B] transition-all shadow-md"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}