'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { hasPermission, PERMISSIONS } from '@/lib/permissions';
import { 
  Shield, Plus, Edit2, Trash2, Search, Check, X, Users, 
  Lock, ChevronRight, AlertCircle, Filter, MoreVertical,
  ShieldCheck, ShieldAlert, Eye, ShoppingCart, Package,
  UserCog, KeyRound, Save, RotateCcw, ChevronDown,
  Crown, Layers, Fingerprint, Zap, ArrowUpRight, Minus,
  Sparkles, CircleDot, LayoutGrid, List, BarChart3,
  TrendingUp, Activity, Bell, Clock, Hash
} from 'lucide-react';

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
// Warm ivory/cream base with deep ink accents and terracotta highlights
// Typography: Geist Sans (display) + Geist Mono (data/labels)

const DESIGN = {
  bg: {
    page: 'bg-[#F5F0E8]',        // raw linen
    card: 'bg-[#FFFDF9]',         // warm white
    elevated: 'bg-[#EDE8DE]',   // aged paper
    modal: 'bg-[#FFFDF9]',
    hover: 'bg-[#E5DDD0]',
    accent: 'bg-[#8B4513]',       // saddle brown
    subtle: 'bg-[#F8F4EC]',
  },
  text: {
    primary: 'text-[#2C1810]',     // dark espresso
    secondary: 'text-[#6B5B4F]',  // warm taupe
    muted: 'text-[#A89B8C]',       // sand
    inverse: 'text-[#FFFDF9]',
    accent: 'text-[#C65D3B]',      // burnt sienna
    success: 'text-[#4A7C59]',     // forest moss
    warning: 'text-[#B8860B]',     // antique gold
    danger: 'text-[#A52A2A]',      // rust
  },
  border: {
    light: 'border-[#DDD5C7]',
    medium: 'border-[#C9BFB0]',
    accent: 'border-[#C65D3B]',
    focus: 'border-[#8B4513]',
  },
  accent: {
    sienna: '#C65D3B',
    espresso: '#2C1810',
    linen: '#F5F0E8',
    moss: '#4A7C59',
    gold: '#B8860B',
  }
};

type Permission = keyof typeof PERMISSIONS;

const ALL_PERMISSIONS: Permission[] = Object.keys(PERMISSIONS) as Permission[];

const PERMISSION_META: Record<string, { label: string; icon: any; description: string; category: string }> = {
  'VIEW_PRODUCTS': { label: 'View Products', icon: Eye, description: 'Browse and view product listings', category: 'Products' },
  'MANAGE_PRODUCTS': { label: 'Manage Products', icon: Package, description: 'Create, edit and delete products', category: 'Products' },
  'ADD_TO_CART': { label: 'Add to Cart', icon: ShoppingCart, description: 'Add items to shopping cart', category: 'Cart' },
  'MANAGE_CART': { label: 'Manage Cart', icon: ShoppingCart, description: 'Modify and clear cart items', category: 'Cart' },
  'VIEW_ORDERS': { label: 'View Orders', icon: Eye, description: 'View order history and details', category: 'Orders' },
  'MANAGE_ORDERS': { label: 'Manage Orders', icon: Package, description: 'Process and update order status', category: 'Orders' },
  'MANAGE_USERS': { label: 'Manage Users', icon: UserCog, description: 'Create and modify user accounts', category: 'Administration' },
  'MANAGE_PERMISSIONS': { label: 'Manage Permissions', icon: KeyRound, description: 'Configure roles and access', category: 'Administration' },
};

const PERMISSION_CATEGORIES: Record<string, Permission[]> = {
  'Products': ['VIEW_PRODUCTS', 'MANAGE_PRODUCTS'],
  'Cart': ['ADD_TO_CART'],
  'Orders': ['VIEW_ORDERS', 'MANAGE_ORDERS'],
  'Administration': ['MANAGE_USERS', 'MANAGE_PERMISSIONS'],
};

const MOCK_ROLES = [
  { 
    id: '1', 
    name: 'BUYER', 
    description: 'Standard customer with browsing and purchasing rights',
    permissions: ['VIEW_PRODUCTS', 'ADD_TO_CART', 'VIEW_ORDERS'] as Permission[],
    userCount: 12453,
    createdAt: '2024-01-15',
    lastActive: '2 min ago',
    growth: '+12%'
  },
  { 
    id: '2', 
    name: 'SELLER', 
    description: 'Vendor with product and order management capabilities',
    permissions: ['VIEW_PRODUCTS', 'MANAGE_PRODUCTS', 'VIEW_ORDERS', 'MANAGE_ORDERS'] as Permission[],
    userCount: 892,
    createdAt: '2024-02-20',
    lastActive: '5 min ago',
    growth: '+8%'
  },
  { 
    id: '3', 
    name: 'ADMIN', 
    description: 'Full system access with user and permission control',
    permissions: ['VIEW_PRODUCTS', 'ADD_TO_CART', 'MANAGE_PRODUCTS', 'MANAGE_USERS', 'VIEW_ORDERS', 'MANAGE_ORDERS'] as Permission[],
    userCount: 24,
    createdAt: '2024-01-10',
    lastActive: 'Just now',
    growth: '+3%'
  },
  { 
    id: '4', 
    name: 'MODERATOR', 
    description: 'Content moderator with product oversight',
    permissions: ['VIEW_PRODUCTS', 'MANAGE_PRODUCTS', 'VIEW_ORDERS'] as Permission[],
    userCount: 156,
    createdAt: '2024-03-05',
    lastActive: '1 hr ago',
    growth: '+5%'
  },
];

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────

function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function Badge({ children, variant = 'default', className = '' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'muted';
  className?: string;
}) {
  const variants = {
    default: 'bg-[#1A1A1A] text-white',
    success: 'bg-[#E8F5EE] text-[#2D7A5E] border border-[#2D7A5E]/20',
    warning: 'bg-[#FDF6E3] text-[#B8860B] border border-[#B8860B]/20',
    danger: 'bg-[#FDEDEC] text-[#C0392B] border border-[#C0392B]/20',
    accent: 'bg-[#FDF0EB] text-[#C45C3A] border border-[#C45C3A]/20',
    muted: 'bg-[#F5F3EF] text-[#6B6560] border border-[#D5CFC7]',
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`relative overflow-hidden bg-white rounded-2xl border border-[#E8E4DE] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-500 group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#F5F3EF] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#2D7A5E]">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>

      <div>
        <p className="text-[11px] font-semibold text-[#9A948E] uppercase tracking-[0.08em] mb-1">{label}</p>
        <p className="text-3xl font-bold text-[#1A1A1A] tracking-tight tabular-nums">
          <AnimatedCounter value={value} />
        </p>
      </div>
    </div>
  );
}

function PermissionPill({ 
  perm, 
  isSelected = false, 
  onClick, 
  size = 'md' 
}: { 
  perm: Permission; 
  isSelected?: boolean; 
  onClick?: () => void;
  size?: 'sm' | 'md';
}) {
  const meta = PERMISSION_META[perm];
  const Icon = meta?.icon || Lock;

  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-1 text-[11px] gap-1.5'
    : 'px-3 py-1.5 text-xs gap-2';

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-lg font-medium transition-all duration-200 ${sizeClasses} ${
        isSelected 
          ? 'bg-[#1A1A1A] text-white shadow-sm' 
          : 'bg-[#F8F7F4] text-[#6B6560] hover:bg-[#F0EDE8] border border-[#E8E4DE]'
      } ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${isSelected ? 'text-white' : 'text-[#9A948E]'}`} strokeWidth={1.5} />
      <span>{meta?.label || perm}</span>
      {isSelected && <Check className="w-3 h-3 text-white/70" strokeWidth={2} />}
    </button>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function PermissionManagementPage() {
  const { user } = useAuthStore();
  const [roles, setRoles] = useState(MOCK_ROLES);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredRoles = useMemo(() => {
    let filtered = roles.filter(role =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.permissions.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (activeFilter !== 'all') {
      filtered = filtered.filter(role => {
        const ratio = role.permissions.length / ALL_PERMISSIONS.length;
        if (activeFilter === 'high') return ratio > 0.6;
        if (activeFilter === 'medium') return ratio > 0.3 && ratio <= 0.6;
        return ratio <= 0.3;
      });
    }

    return filtered;
  }, [roles, searchQuery, activeFilter]);

  const handleOpenModal = (role?: any) => {
    if (role) {
      setEditingRole(role);
      setRoleName(role.name);
      setRoleDescription(role.description);
      setSelectedPermissions(role.permissions);
    } else {
      setEditingRole(null);
      setRoleName('');
      setRoleDescription('');
      setSelectedPermissions([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setRoleName('');
    setRoleDescription('');
    setSelectedPermissions([]);
  };

  const togglePermission = (perm: Permission) => {
    setSelectedPermissions(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const selectAllInCategory = (category: string) => {
    const perms = PERMISSION_CATEGORIES[category];
    const allSelected = perms.every(p => selectedPermissions.includes(p));
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(p => !perms.includes(p)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...perms])]);
    }
  };

  const handleSaveRole = () => {
    if (!roleName.trim()) {
      showToast('Role name is required', 'error');
      return;
    }
    if (selectedPermissions.length === 0) {
      showToast('Select at least one permission', 'error');
      return;
    }

    if (editingRole) {
      setRoles(roles.map(r => 
        r.id === editingRole.id 
          ? { ...r, name: roleName, description: roleDescription, permissions: selectedPermissions }
          : r
      ));
      showToast(`Role "${roleName}" updated`);
    } else {
      const newRole = {
        id: Date.now().toString(),
        name: roleName,
        description: roleDescription || 'No description provided',
        permissions: selectedPermissions,
        userCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastActive: 'Just now',
        growth: '0%'
      };
      setRoles([...roles, newRole]);
      showToast(`Role "${roleName}" created`);
    }
    handleCloseModal();
  };

  const handleDelete = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    setRoles(roles.filter(r => r.id !== roleId));
    setDeleteConfirm(null);
    showToast(`Role "${role?.name}" deleted`);
  };

  const getPermissionLevel = (count: number) => {
    const ratio = count / ALL_PERMISSIONS.length;
    if (ratio > 0.6) return { label: 'High', color: 'bg-[#FDF0EB] text-[#C45C3A] border-[#C45C3A]/20' };
    if (ratio > 0.3) return { label: 'Medium', color: 'bg-[#FDF6E3] text-[#B8860B] border-[#B8860B]/20' };
    return { label: 'Low', color: 'bg-[#F5F3EF] text-[#6B6560] border-[#D5CFC7]' };
  };

  const getRoleRank = (permCount: number) => {
    if (permCount >= 6) return { icon: Crown, label: 'System', color: 'text-[#C45C3A]' };
    if (permCount >= 4) return { icon: ShieldCheck, label: 'Advanced', color: 'text-[#B8860B]' };
    if (permCount >= 2) return { icon: Shield, label: 'Standard', color: 'text-[#2D7A5E]' };
    return { icon: Eye, label: 'Basic', color: 'text-[#6B6560]' };
  };

  if (!user || !hasPermission(user.role, 'MANAGE_PERMISSIONS')) {
    return (
      <>
        <Header />
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#FAF9F7]">
          <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-[#E8E4DE] p-16 text-center max-w-md">
            <div className="w-20 h-20 bg-[#FDEDEC] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-10 h-10 text-[#C0392B]" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3 tracking-tight">Access Denied</h1>
            <p className="text-[#6B6560] leading-relaxed">Only users with MANAGE_PERMISSIONS can access role configuration.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* ─── TOAST ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border animate-in slide-in-from-right-5 fade-in duration-300 ${
          toast.type === 'success' ? 'bg-white border-[#2D7A5E]/20' : 'bg-white border-[#C0392B]/20'
        }`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            toast.type === 'success' ? 'bg-[#E8F5EE]' : 'bg-[#FDEDEC]'
          }`}>
            {toast.type === 'success' 
              ? <Check className="w-4 h-4 text-[#2D7A5E]" strokeWidth={2.5} />
              : <AlertCircle className="w-4 h-4 text-[#C0392B]" strokeWidth={2.5} />
            }
          </div>
          <span className={`text-sm font-semibold ${toast.type === 'success' ? 'text-[#1A1A1A]' : 'text-[#C0392B]'}`}>
            {toast.message}
          </span>
          <button onClick={() => setToast(null)} className="ml-2 text-[#9A948E] hover:text-[#1A1A1A] transition-colors">
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      )}

      <div className="min-h-[calc(100vh-64px)] bg-[#FAF9F7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

          {/* ─── PAGE HEADER ─────────────────────────────────────────────────── */}
          <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 transition-all duration-700 ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                <ShieldCheck className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-[32px] font-bold text-[#1A1A1A] tracking-tight leading-none">
                    Permission Management
                  </h1>
                  <Badge variant="accent">
                    <Sparkles className="w-3 h-3" />
                    {roles.length} Roles
                  </Badge>
                </div>
                <p className="text-[15px] text-[#6B6560] mt-2 leading-relaxed">
                  Configure access control, manage role hierarchies, and audit permission assignments
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white rounded-xl border border-[#E8E4DE] p-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#1A1A1A] text-white' : 'text-[#9A948E] hover:text-[#1A1A1A]'}`}
                >
                  <List className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#1A1A1A] text-white' : 'text-[#9A948E] hover:text-[#1A1A1A]'}`}
                >
                  <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.18)] active:scale-[0.97]"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Create Role
              </button>
            </div>
          </div>

          {/* ─── STATS ROW ─────────────────────────────────────────────────────── */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 transition-all duration-700 delay-100 ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <StatCard label="Total Roles" value={roles.length} icon={Layers} trend="+2 this month" delay={0} />
            <StatCard label="Permissions" value={ALL_PERMISSIONS.length} icon={Lock} delay={100} />
            <StatCard label="Total Users" value={roles.reduce((acc, r) => acc + r.userCount, 0)} icon={Users} trend="+1.2K" delay={200} />
            <StatCard label="Active Roles" value={roles.length} icon={Activity} trend="100% uptime" delay={300} />
          </div>

          {/* ─── FILTERS & SEARCH ──────────────────────────────────────────────── */}
          <div className={`flex flex-col lg:flex-row gap-4 mb-8 transition-all duration-700 delay-200 ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <div className="flex-1 bg-white rounded-2xl border border-[#E8E4DE] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A948E]" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Search roles, permissions, descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-transparent border-none text-sm font-medium text-[#1A1A1A] focus:outline-none focus:ring-0 placeholder:text-[#9A948E] placeholder:font-normal"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A948E] hover:text-[#1A1A1A] transition-colors"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All Roles' },
                { key: 'high', label: 'High Access' },
                { key: 'medium', label: 'Medium' },
                { key: 'low', label: 'Limited' },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as any)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeFilter === filter.key
                      ? 'bg-[#1A1A1A] text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                      : 'bg-white text-[#6B6560] border border-[#E8E4DE] hover:border-[#D5CFC7] hover:text-[#1A1A1A] shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─── ROLES LIST / GRID ───────────────────────────────────────────── */}
          <div className={`space-y-4 transition-all duration-700 delay-300 ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            {filteredRoles.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E8E4DE] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-20 text-center">
                <div className="w-20 h-20 bg-[#F5F3EF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-[#D5CFC7]" strokeWidth={1.5} />
                </div>
                <p className="text-[#1A1A1A] font-bold text-xl mb-2">No roles found</p>
                <p className="text-[#6B6560] text-sm">Try adjusting your search or filters</p>
              </div>
            ) : viewMode === 'list' ? (
              filteredRoles.map((role, index) => {
                const level = getPermissionLevel(role.permissions.length);
                const rank = getRoleRank(role.permissions.length);
                const RankIcon = rank.icon;
                const isExpanded = expandedRole === role.id;

                return (
                  <div
                    key={role.id}
                    className="group bg-white rounded-2xl border border-[#E8E4DE] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#D5CFC7] transition-all duration-300 overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Main Row */}
                    <div className="p-6">
                      <div className="flex items-center gap-5">
                        {/* Role Icon */}
                        <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1A1A1A] transition-colors duration-300">
                          <RankIcon className={`w-6 h-6 ${rank.color} group-hover:text-white transition-colors duration-300`} strokeWidth={1.5} />
                        </div>

                        {/* Role Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1.5">
                            <h3 className="text-base font-bold text-[#1A1A1A] tracking-tight">{role.name}</h3>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${level.color}`}>
                              {level.label} Access
                            </span>
                            <span className="text-[11px] text-[#9A948E] font-medium">
                              {role.permissions.length} / {ALL_PERMISSIONS.length} permissions
                            </span>
                          </div>
                          <p className="text-sm text-[#6B6560] leading-relaxed">{role.description}</p>
                        </div>

                        {/* Meta Info */}
                        <div className="hidden lg:flex items-center gap-8">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 mb-0.5">
                              <Users className="w-3.5 h-3.5 text-[#9A948E]" strokeWidth={1.5} />
                              <p className="text-lg font-bold text-[#1A1A1A] tabular-nums">{role.userCount.toLocaleString()}</p>
                            </div>
                            <p className="text-[10px] font-semibold text-[#9A948E] uppercase tracking-wider">Users</p>
                          </div>
                          <div className="w-px h-10 bg-[#E8E4DE]" />
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 mb-0.5">
                              <Clock className="w-3.5 h-3.5 text-[#9A948E]" strokeWidth={1.5} />
                              <p className="text-sm font-semibold text-[#1A1A1A]">{role.lastActive}</p>
                            </div>
                            <p className="text-[10px] font-semibold text-[#9A948E] uppercase tracking-wider">Last Active</p>
                          </div>
                          <div className="w-px h-10 bg-[#E8E4DE]" />
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 mb-0.5">
                              <TrendingUp className="w-3.5 h-3.5 text-[#2D7A5E]" strokeWidth={1.5} />
                              <p className="text-sm font-semibold text-[#2D7A5E]">{role.growth}</p>
                            </div>
                            <p className="text-[10px] font-semibold text-[#9A948E] uppercase tracking-wider">Growth</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                            className="p-2.5 hover:bg-[#F5F3EF] rounded-xl text-[#9A948E] hover:text-[#1A1A1A] transition-all duration-200"
                            title="View permissions"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => handleOpenModal(role)}
                            className="p-2.5 hover:bg-[#F5F3EF] rounded-xl text-[#9A948E] hover:text-[#1A1A1A] transition-all duration-200"
                            title="Edit role"
                          >
                            <Edit2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(role.id)}
                            className="p-2.5 hover:bg-[#FDEDEC] rounded-xl text-[#9A948E] hover:text-[#C0392B] transition-all duration-200"
                            title="Delete role"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Permissions View */}
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-[#F0EDE8]">
                        <div className="pt-5">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-[11px] font-bold text-[#9A948E] uppercase tracking-[0.08em]">
                              Assigned Permissions
                            </p>
                            <div className="flex items-center gap-4 text-[11px] text-[#9A948E]">
                              <span className="flex items-center gap-1.5">
                                <Hash className="w-3 h-3" />
                                {role.permissions.length} active
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Minus className="w-3 h-3" />
                                {ALL_PERMISSIONS.length - role.permissions.length} inactive
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {ALL_PERMISSIONS.map((perm) => {
                              const meta = PERMISSION_META[perm];
                              const Icon = meta?.icon || Lock;
                              const isActive = role.permissions.includes(perm);

                              return (
                                <div
                                  key={perm}
                                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                    isActive
                                      ? 'bg-[#1A1A1A] text-white shadow-sm'
                                      : 'bg-[#F8F7F4] text-[#9A948E] border border-[#E8E4DE]'
                                  }`}
                                >
                                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#D5CFC7]'}`} strokeWidth={1.5} />
                                  <span>{meta?.label || perm}</span>
                                  {isActive && <Check className="w-3 h-3 text-white/60" strokeWidth={2} />}
                                </div>
                              );
                            })}
                          </div>

                          {/* Category breakdown */}
                          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => {
                              const activeInCategory = perms.filter(p => role.permissions.includes(p)).length;
                              const totalInCategory = perms.length;
                              const pct = (activeInCategory / totalInCategory) * 100;

                              return (
                                <div key={category} className="bg-[#F8F7F4] rounded-xl p-3 border border-[#E8E4DE]">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-semibold text-[#6B6560] uppercase tracking-wider">{category}</span>
                                    <span className="text-[11px] font-bold text-[#1A1A1A]">{activeInCategory}/{totalInCategory}</span>
                                  </div>
                                  <div className="h-1.5 bg-[#E8E4DE] rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-[#1A1A1A] rounded-full transition-all duration-500"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRoles.map((role, index) => {
                  const level = getPermissionLevel(role.permissions.length);
                  const rank = getRoleRank(role.permissions.length);
                  const RankIcon = rank.icon;

                  return (
                    <div
                      key={role.id}
                      className="group bg-white rounded-2xl border border-[#E8E4DE] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#D5CFC7] transition-all duration-300 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-[#F5F3EF] flex items-center justify-center group-hover:bg-[#1A1A1A] transition-colors duration-300">
                          <RankIcon className={`w-5 h-5 ${rank.color} group-hover:text-white transition-colors duration-300`} strokeWidth={1.5} />
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleOpenModal(role)}
                            className="p-2 hover:bg-[#F5F3EF] rounded-lg text-[#9A948E] hover:text-[#1A1A1A] transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(role.id)}
                            className="p-2 hover:bg-[#FDEDEC] rounded-lg text-[#9A948E] hover:text-[#C0392B] transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">{role.name}</h3>
                      <p className="text-sm text-[#6B6560] mb-4 line-clamp-2">{role.description}</p>

                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${level.color}`}>
                          {level.label}
                        </span>
                        <span className="text-[11px] text-[#9A948E]">{role.permissions.length} permissions</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {role.permissions.slice(0, 4).map(perm => (
                          <PermissionPill key={perm} perm={perm} size="sm" />
                        ))}
                        {role.permissions.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 bg-[#F8F7F4] text-[#9A948E] rounded-lg text-[11px] font-medium border border-[#E8E4DE]">
                            +{role.permissions.length - 4} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#F0EDE8]">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#9A948E]">
                          <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span className="font-semibold text-[#1A1A1A]">{role.userCount.toLocaleString()}</span>
                          <span>users</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#2D7A5E] font-medium">
                          <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {role.growth}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── CREATE/EDIT MODAL ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.2)] max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-[#F0EDE8] flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
                  {editingRole ? 'Edit Role' : 'Create New Role'}
                </h2>
                <p className="text-sm text-[#6B6560] mt-1">
                  {editingRole ? `Modifying ${editingRole.name}` : 'Define role details and permissions'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2.5 hover:bg-[#F5F3EF] rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-[#9A948E]" strokeWidth={2} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-8">
                {/* Role Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-[0.08em] mb-2.5">
                      Role Name <span className="text-[#C0392B]">*</span>
                    </label>
                    <input
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value.toUpperCase())}
                      placeholder="e.g., MODERATOR"
                      className="w-full px-4 py-3 bg-[#F8F7F4] border border-[#E8E4DE] rounded-xl text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white focus:ring-2 focus:ring-[#1A1A1A]/5 transition-all placeholder:text-[#9A948E] placeholder:font-normal tracking-wide"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-[0.08em] mb-2.5">
                      Description
                    </label>
                    <input
                      type="text"
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      placeholder="Role purpose and scope..."
                      className="w-full px-4 py-3 bg-[#F8F7F4] border border-[#E8E4DE] rounded-xl text-sm font-medium text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white focus:ring-2 focus:ring-[#1A1A1A]/5 transition-all placeholder:text-[#9A948E] placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Permission Selection */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-[0.08em]">
                      Permissions
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 bg-[#1A1A1A] text-white rounded-lg text-xs font-bold">
                        {selectedPermissions.length} selected
                      </span>
                      <button 
                        onClick={() => setSelectedPermissions([])}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#9A948E] hover:text-[#1A1A1A] transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => {
                      const allSelected = perms.every(p => selectedPermissions.includes(p));

                      return (
                        <div key={category} className="border border-[#E8E4DE] rounded-2xl overflow-hidden bg-[#FAF9F7]">
                          <div className="px-5 py-3.5 bg-white border-b border-[#F0EDE8] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-[#9A948E]" strokeWidth={1.5} />
                              <span className="text-xs font-bold text-[#6B6560] uppercase tracking-wider">{category}</span>
                            </div>
                            <button
                              onClick={() => selectAllInCategory(category)}
                              className={`text-[11px] font-bold transition-colors ${
                                allSelected ? 'text-[#2D7A5E]' : 'text-[#9A948E] hover:text-[#1A1A1A]'
                              }`}
                            >
                              {allSelected ? 'Deselect All' : 'Select All'}
                            </button>
                          </div>
                          <div className="p-3 space-y-1">
                            {perms.map((perm) => {
                              const meta = PERMISSION_META[perm];
                              const Icon = meta?.icon || Lock;
                              const isSelected = selectedPermissions.includes(perm);

                              return (
                                <button
                                  key={perm}
                                  onClick={() => togglePermission(perm)}
                                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all duration-200 ${
                                    isSelected
                                      ? 'bg-[#1A1A1A] text-white shadow-sm'
                                      : 'hover:bg-white text-[#6B6560]'
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                    isSelected ? 'bg-white border-white' : 'border-[#D5CFC7] bg-white'
                                  }`}>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#1A1A1A]" strokeWidth={2.5} />}
                                  </div>
                                  <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-[#9A948E]'}`} strokeWidth={1.5} />
                                  <div className="text-left flex-1">
                                    <span className="font-semibold block text-[13px]">{meta?.label || perm}</span>
                                    <span className={`text-[11px] block ${isSelected ? 'text-white/50' : 'text-[#9A948E]'}`}>
                                      {meta?.description}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-8 border-t border-[#F0EDE8] bg-[#FAF9F7] flex-shrink-0">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-5 py-3.5 border border-[#E8E4DE] text-[#6B6560] rounded-xl font-semibold text-sm hover:bg-white hover:border-[#D5CFC7] hover:text-[#1A1A1A] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                className="flex-1 px-5 py-3.5 bg-[#1A1A1A] text-white rounded-xl font-semibold text-sm hover:bg-[#333333] transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                {editingRole ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION ───────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.2)] max-w-md w-full p-8 animate-in zoom-in-95 fade-in duration-200">
            <div className="w-14 h-14 bg-[#FDEDEC] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-7 h-7 text-[#C0392B]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] text-center mb-2 tracking-tight">Delete Role</h3>
            <p className="text-[#6B6560] text-center text-sm leading-relaxed mb-8">
              This will permanently remove the role and revoke access for all assigned users. 
              <span className="text-[#C0392B] font-medium"> This action cannot be undone.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-5 py-3.5 border border-[#E8E4DE] text-[#6B6560] rounded-xl font-semibold text-sm hover:bg-[#FAF9F7] hover:text-[#1A1A1A] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-5 py-3.5 bg-[#C0392B] text-white rounded-xl font-semibold text-sm hover:bg-[#A93226] transition-all shadow-[0_4px_16px_rgba(192,57,43,0.2)]"
              >
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}