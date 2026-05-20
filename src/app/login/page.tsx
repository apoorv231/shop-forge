'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, Sparkles, Users } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { email: 'buyer@demo.com', password: 'buyer123', name: 'Demo Buyer', role: 'BUYER' },
  { email: 'seller@demo.com', password: 'seller123', name: 'Demo Seller', role: 'SELLER' },
  { email: 'admin@demo.com', password: 'admin123', name: 'Demo Admin', role: 'ADMIN' },
  { email: 'superadmin@demo.com', password: 'super123', name: 'Super Admin', role: 'SUPERADMIN' },
];

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'BUYER' });
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      const demoAccount = DEMO_ACCOUNTS.find(
        acc => acc.email === formData.email && acc.password === formData.password
      );
      
      if (demoAccount) {
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email: demoAccount.email,
          name: demoAccount.name,
          role: demoAccount.role as any,
          token: 'demo-token-' + Date.now()
        };
        login(user);
        router.push('/');
      } else {
        setError('Invalid credentials. Try demo accounts below.');
      }
    } else {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email: formData.email,
        name: formData.name,
        role: formData.role as any,
        token: 'token-' + Date.now()
      };
      login(user);
      router.push('/');
    }
  };

  const loginWithDemo = (account: typeof DEMO_ACCOUNTS[0]) => {
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email: account.email,
      name: account.name,
      role: account.role as any,
      token: 'demo-token-' + Date.now()
    };
    login(user);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-red-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              AJIO
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {isLogin ? 'Welcome back! 👋' : 'Join us today! 🎉'}
          </p>
        </div>

        {/* Demo Accounts Banner */}
        <div className="card p-4 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 animate-slide-up">
          <button 
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Demo Accounts</span>
            </div>
            <span className="text-blue-600 text-sm">{showDemo ? 'Hide' : 'Show'}</span>
          </button>
          
          {showDemo && (
            <div className="mt-4 space-y-2 animate-slide-in">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  onClick={() => loginWithDemo(account)}
                  className="w-full text-left p-3 bg-white rounded-lg hover:bg-blue-50 transition-all border border-blue-100 hover:border-blue-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{account.name}</p>
                      <p className="text-xs text-gray-600">{account.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {account.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="card p-8 backdrop-blur-sm bg-white/90 animate-scale-in">
          {/* Toggle Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                isLogin 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                !isLogin 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-slide-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-slide-in">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field pl-12 group"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-12"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-12 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="animate-slide-in">
                <label className="block text-sm font-semibold mb-2 text-gray-700">I want to</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'BUYER' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === 'BUYER'
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🛍️</div>
                    <div className="font-semibold text-sm">Shop</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'SELLER' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === 'SELLER'
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🏪</div>
                    <div className="font-semibold text-sm">Sell</div>
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 group">
              {isLogin ? 'Login to Account' : 'Create Account'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-red-600 hover:text-red-700 font-medium">
                Forgot password?
              </a>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6 animate-fade-in">
          By continuing, you agree to AJIO's{' '}
          <a href="#" className="text-red-600 hover:underline">Terms</a> &{' '}
          <a href="#" className="text-red-600 hover:underline">Privacy Policy</a>
        </p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
