import Header from '@/components/Header';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Zap, ShieldCheck, RotateCcw, Truck, Star, ChevronRight, Heart } from 'lucide-react';

const CATEGORIES = [
  { name: 'MacBook Air', sub: 'Light. Speed. M3 power.', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-og-202503?wid=1200&hei=630&fmt=jpeg&qlt=95', href: '/products?category=macbook-air' },
  { name: 'MacBook Pro', sub: 'Mind-blowing performance.', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-pro-og-202410?wid=1200&hei=630&fmt=jpeg&qlt=95', href: '/products?category=macbook-pro' },
  { name: 'Accessories', sub: 'Cases, adapters & more', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-14-space-gray-og-202410?wid=1200&hei=630&fmt=jpeg&qlt=95', href: '/products?category=accessories' },
  { name: 'Refurbished', sub: 'Certified quality, less price', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/refurb-mac-og-202410?wid=1200&hei=630&fmt=jpeg&qlt=95', href: '/products?condition=refurbished' },
];

const TRENDING_PRODUCTS = [
  { 
    id: 1, 
    name: 'MacBook Air 13" M3', 
    brand: 'Apple', 
    price: 114900, 
    mrp: 119900, 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-silver-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90', 
    rating: 4.8, 
    reviews: 3421,
    specs: 'M3 chip • 8GB RAM • 256GB SSD'
  },
  { 
    id: 2, 
    name: 'MacBook Pro 14" M3 Pro', 
    brand: 'Apple', 
    price: 169900, 
    mrp: 199900, 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90', 
    rating: 4.9, 
    reviews: 2156,
    specs: 'M3 Pro • 18GB RAM • 512GB SSD'
  },
  { 
    id: 3, 
    name: 'MacBook Air 15" M3', 
    brand: 'Apple', 
    price: 134900, 
    mrp: 149900, 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-midnight-select-202306?wid=904&hei=840&fmt=jpeg&qlt=90', 
    rating: 4.7, 
    reviews: 1876,
    specs: 'M3 chip • 8GB RAM • 256GB SSD'
  },
  { 
    id: 4, 
    name: 'MacBook Pro 16" M3 Max', 
    brand: 'Apple', 
    price: 279900, 
    mrp: 329900, 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90', 
    rating: 4.9, 
    reviews: 987,
    specs: 'M3 Max • 36GB RAM • 1TB SSD'
  },
  { 
    id: 5, 
    name: 'MacBook Air 13" M2', 
    brand: 'Apple', 
    price: 99900, 
    mrp: 114900, 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-starlight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90', 
    rating: 4.6, 
    reviews: 5621,
    specs: 'M2 chip • 8GB RAM • 256GB SSD'
  },
  { 
    id: 6, 
    name: 'MacBook Pro 14" M3', 
    brand: 'Apple', 
    price: 149900, 
    mrp: 169900, 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-silver-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90', 
    rating: 4.8, 
    reviews: 1543,
    specs: 'M3 chip • 8GB RAM • 512GB SSD'
  },
  { 
    id: 7, 
    name: 'MacBook Air 15" M2', 
    brand: 'Apple', 
    price: 119900, 
    mrp: 134900, 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-starlight-select-202306?wid=904&hei=840&fmt=jpeg&qlt=90', 
    rating: 4.5, 
    reviews: 2341,
    specs: 'M2 chip • 8GB RAM • 256GB SSD'
  },
  { 
    id: 8, 
    name: 'MacBook Pro 16" M3 Pro', 
    brand: 'Apple', 
    price: 249900, 
    mrp: 279900, 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90', 
    rating: 4.8, 
    reviews: 765,
    specs: 'M3 Pro • 18GB RAM • 512GB SSD'
  },
];

const BRANDS = [
  { name: 'Apple', initials: 'AP', href: '/products?brand=apple' },
  { name: 'Dell', initials: 'DL', href: '/products?brand=dell' },
  { name: 'HP', initials: 'HP', href: '/products?brand=hp' },
  { name: 'Lenovo', initials: 'LV', href: '/products?brand=lenovo' },
  { name: 'Asus', initials: 'AS', href: '/products?brand=asus' },
  { name: 'Microsoft', initials: 'MS', href: '/products?brand=microsoft' },
  { name: 'Razer', initials: 'RZ', href: '/products?brand=razer' },
  { name: 'Samsung', initials: 'SG', href: '/products?brand=samsung' },
];

const TRUST_BADGES = [
  { icon: Truck, title: 'Free Delivery', desc: 'On all orders', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '15-day return policy', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: '100% encrypted', color: 'text-violet-600', bg: 'bg-violet-50' },
  { icon: Star, title: 'Genuine Products', desc: 'Authorized reseller', color: 'text-amber-600', bg: 'bg-amber-50' },
];

const FEATURED_BANNERS = [
  {
    title: 'MacBook Air M3',
    subtitle: 'Light. Speed. M3 power. Now in 13" and 15".',
    cta: 'Shop MacBook Air',
    bg: 'bg-gradient-to-br from-slate-50 to-gray-50',
    accent: 'text-slate-800',
    border: 'border-slate-200',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-og-202503?wid=600&hei=315&fmt=jpeg&qlt=95'
  },
  {
    title: 'MacBook Pro M3',
    subtitle: 'Mind-blowing performance. For the pros.',
    cta: 'Shop MacBook Pro',
    bg: 'bg-gradient-to-br from-neutral-900 to-slate-900',
    accent: 'text-white',
    border: 'border-neutral-800',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-pro-og-202410?wid=600&hei=315&fmt=jpeg&qlt=95'
  }
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : star <= rating
              ? 'fill-amber-200 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero Banner */}
        <section className="relative bg-neutral-950 text-white overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(60,60,60,0.4)_0%,_transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(40,40,60,0.3)_0%,_transparent_50%)]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-8 text-sm font-medium border border-white/20">
                  <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-white/90">New — M3 Chip Family</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-[1.1] tracking-tight">
                  Supercharged
                  <span className="block text-neutral-500">for pros.</span>
                </h1>

                <p className="text-lg text-neutral-400 mb-10 max-w-md leading-relaxed">
                  The most advanced Mac laptops ever. Built for everything you love to do — and things you haven't imagined yet.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-white text-neutral-950 px-8 py-4 rounded-full font-medium hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Shop MacBook
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/products?sort=discount"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white px-6 py-4 rounded-full font-medium transition-colors duration-300"
                  >
                    View Offers
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="flex items-center gap-8 mt-16 pt-8 border-t border-white/10">
                  {[
                    { value: '5M+', label: 'Happy Customers' },
                    { value: '50K+', label: 'Products Sold' },
                    { value: '4.9★', label: 'Average Rating' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-2xl font-semibold text-white">{stat.value}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block relative">
                <div className="relative aspect-square max-w-lg mx-auto">
                  <img
                    src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90"
                    alt="MacBook Pro 16-inch"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-100">
              {TRUST_BADGES.map(({ icon: Icon, title, desc, color, bg }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 py-8 px-6 first:pl-0 last:pr-0 hover:bg-neutral-50/50 transition-colors duration-300"
                >
                  <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-neutral-900">{title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flash Sale Strip */}
        <section className="bg-neutral-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-bold tracking-wider">
                  FLASH SALE
                </span>
                <span className="text-sm text-neutral-400">Up to ₹20,000 off — Limited time</span>
              </div>
              <Link
                href="/products?sort=discount"
                className="text-xs font-semibold text-white/60 hover:text-white transition-colors flex items-center gap-1"
              >
                Shop Now
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-semibold text-neutral-900 tracking-tight">Shop by Category</h2>
              <p className="text-neutral-500 mt-2">Find your perfect Mac</p>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 group transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-neutral-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-1">{cat.name}</h3>
                    <p className="text-sm text-white/70">{cat.sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Banners */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURED_BANNERS.map((banner) => (
              <div
                key={banner.title}
                className={`${banner.bg} ${banner.border} border rounded-3xl overflow-hidden group hover:shadow-lg transition-all duration-500 relative min-h-[280px]`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute right-0 top-0 w-2/3 h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                />
                
                <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-center max-w-[60%]">
                  <h3 className={`text-2xl font-semibold ${banner.accent} mb-2`}>{banner.title}</h3>
                  <p className={`text-sm ${banner.accent} opacity-70 mb-6 leading-relaxed`}>{banner.subtitle}</p>
                  <Link
                    href="/products"
                    className={`inline-flex items-center gap-2 text-sm font-semibold ${banner.accent} hover:opacity-70 transition-opacity w-fit`}
                  >
                    {banner.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section className="bg-neutral-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-sm font-semibold text-red-600">Trending Now</span>
                </div>
                <h2 className="text-3xl font-semibold text-neutral-900 tracking-tight">Best Sellers</h2>
                <p className="text-neutral-500 mt-2">Most popular among Mac users</p>
              </div>
              <Link
                href="/products"
                className="text-sm font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 group transition-colors"
              >
                See All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {TRENDING_PRODUCTS.map((product) => {
                const discount = Math.round((1 - product.price / product.mrp) * 100);
                return (
                  <Link key={product.id} href={`/products/${product.id}`} className="group">
                    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-neutral-100">
                      {/* Image Area */}
                      <div className="relative aspect-square bg-neutral-50 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Discount Badge */}
                        {discount > 0 && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                              Save ₹{(product.mrp - product.price).toLocaleString()}
                            </span>
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-sm">
                          <Heart className="w-4 h-4 text-neutral-600" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                          {product.brand}
                        </p>
                        <h3 className="font-semibold text-sm mt-1 text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">{product.specs}</p>

                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-lg font-semibold text-neutral-900">₹{product.price.toLocaleString()}</span>
                          <span className="text-xs text-neutral-400 line-through">₹{product.mrp.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <StarRating rating={product.rating} />
                          <span className="text-[11px] text-neutral-400">
                            {product.rating} ({product.reviews.toLocaleString()})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top Brands */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-semibold text-neutral-900 tracking-tight">Top Brands</h2>
              <p className="text-neutral-500 mt-2">Shop premium laptops</p>
            </div>
            <Link
              href="/products?sort=brand"
              className="text-sm font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 group transition-colors"
            >
              All Brands
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {BRANDS.map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                className="group"
              >
                <div className="bg-neutral-50 hover:bg-neutral-100 border border-transparent hover:border-neutral-200 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-0.5 aspect-square flex flex-col items-center justify-center gap-2">
                  <span className="text-lg font-bold text-neutral-300 group-hover:text-neutral-900 transition-colors duration-300">
                    {brand.initials}
                  </span>
                  <span className="text-xs font-semibold text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    {brand.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-neutral-950 rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
            
            <div className="max-w-xl mx-auto text-center relative z-10">
              <h2 className="text-3xl font-semibold text-white mb-3">Stay Updated</h2>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                Get notified about new Mac releases, exclusive deals, and tech tips.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all text-sm"
                />
                <button className="px-8 py-3.5 bg-white text-neutral-950 rounded-xl font-medium hover:bg-neutral-100 transition-colors text-sm whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-neutral-600 mt-4">No spam, unsubscribe anytime.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-xl font-semibold text-white mb-4">MacStore</h3>
              <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                India's trusted destination for Apple products. Genuine devices, expert support.
              </p>
              <div className="flex gap-2">
                {['f', 'in', '𝕏', '▶'].map((icon) => (
                  <button
                    key={icon}
                    className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-xs text-neutral-400 hover:text-white transition-all duration-300"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {[
              { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Contact'] },
              { title: 'Support', links: ['Track Order', 'Returns', 'FAQs', 'Service Centers'] },
              { title: 'Shop', links: ['MacBook Air', 'MacBook Pro', 'Accessories', 'Refurbished'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'Warranty'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-semibold text-sm text-neutral-300 mb-4">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-neutral-500 hover:text-white transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-600">© 2026 MacStore. All rights reserved.</p>
            <div className="flex items-center gap-6 text-xs text-neutral-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure Payments
              </span>
              <span>Authorized Apple Reseller</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}