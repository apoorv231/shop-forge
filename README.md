# AJIO E-Commerce Clone - Frontend

A modern e-commerce platform built with Next.js 15, TypeScript, and Tailwind CSS, featuring Role-Based Access Control (RBAC).

## Features

### 🔐 RBAC (Role-Based Access Control)
- **System Roles**: Guest, Buyer, Seller, Admin
- **Permission Management**: Fine-grained access control
- **Future Ready**: Extensible for dynamic role creation

### 👥 User Features
- **Authentication**: Login/Signup with role selection
- **Guest Browsing**: View products without login
- **Buyer**: Add to cart, place orders
- **Seller**: Product management, onboarding
- **Admin**: User management, full access

### 🛍️ E-Commerce Features
- Product listing with filters (category, brand, price)
- Product detail pages
- Shopping cart
- Seller onboarding (multi-step form)
- Product management for sellers
- User management for admins

### 🎨 UI/UX
- AJIO-inspired design
- Responsive layout
- Clean and modern interface
- Smooth navigation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── login/              # Authentication
│   ├── products/           # Product listing & details
│   ├── seller/
│   │   ├── onboarding/     # Seller registration
│   │   └── products/       # Product management
│   └── admin/
│       └── users/          # User management
├── components/
│   └── Header.tsx          # Navigation header
├── store/
│   └── authStore.ts        # Auth state management
└── lib/
    └── permissions.ts      # RBAC permissions

```

## Getting Started

1. **Install dependencies**:
```bash
cd ajio-clone
npm install
```

2. **Run development server**:
```bash
npm run dev
```

3. **Open browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## RBAC Permissions

| Permission | Guest | Buyer | Seller | Admin |
|------------|-------|-------|--------|-------|
| View Products | ✅ | ✅ | ✅ | ✅ |
| Add to Cart | ❌ | ✅ | ❌ | ✅ |
| Manage Products | ❌ | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| Seller Onboard | ❌ | ❌ | ❌ | ✅ |

## Pages Overview

### Public Pages
- `/` - Homepage with categories and featured products
- `/products` - Product listing with filters
- `/products/[id]` - Product detail page
- `/login` - Login/Signup

### Buyer Pages
- `/cart` - Shopping cart
- `/orders` - Order history

### Seller Pages
- `/seller/onboarding` - Multi-step seller registration
- `/seller/products` - Product management dashboard
- `/seller/products/add` - Add new product

### Admin Pages
- `/admin/users` - User management with role assignment

## API Integration

This is a frontend-only implementation. To connect with your Java backend:

1. Create an API service layer in `src/lib/api.ts`
2. Replace mock data with actual API calls
3. Update authentication to use JWT tokens
4. Configure CORS in your Java backend

Example API service:
```typescript
// src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  login: (credentials) => fetch(`${API_BASE}/auth/login`, {...}),
  getProducts: (filters) => fetch(`${API_BASE}/products`, {...}),
  // ... more endpoints
};
```

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Future Enhancements

- [ ] Dynamic role creation
- [ ] Advanced permission management
- [ ] Order management
- [ ] Payment integration
- [ ] Product reviews
- [ ] Wishlist functionality
- [ ] Real-time notifications

## Best Practices Implemented

✅ TypeScript for type safety
✅ Component-based architecture
✅ Centralized state management
✅ Permission-based rendering
✅ Responsive design
✅ Clean code structure
✅ Reusable components

## License

MIT
