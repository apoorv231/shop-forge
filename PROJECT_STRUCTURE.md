# AJIO E-Commerce Clone - Complete Project Structure

## 📁 Pages & Routes

### Public Pages
- `/` - Homepage with hero banner, categories, featured products
- `/login` - Login/Signup with role selection
- `/products` - Product listing with filters (category, brand, price)
- `/products/[id]` - Product detail page

### Buyer Pages (Role: BUYER)
- `/cart` - Shopping cart with quantity management
- `/orders` - Order history and tracking

### Seller Pages (Role: SELLER)
- `/seller/onboarding` - Multi-step seller registration
- `/seller/products` - Product management dashboard
- `/seller/products/add` - Add new product form
- `/seller/orders` - Order management (view, update status)

### Admin Pages (Role: ADMIN)
- `/admin/users` - User management with role assignment

### SuperAdmin Pages (Role: SUPERADMIN)
- `/admin/permissions` - Permission & role management
- `/admin/users` - User management (inherited)

## 🔐 RBAC System

### Roles
1. **GUEST** - Browse products only
2. **BUYER** - Browse, cart, orders
3. **SELLER** - Manage products & orders
4. **ADMIN** - Manage users, products, orders
5. **SUPERADMIN** - Full access + permission management

### Permissions Matrix

| Permission | GUEST | BUYER | SELLER | ADMIN | SUPERADMIN |
|------------|-------|-------|--------|-------|------------|
| VIEW_PRODUCTS | ✅ | ✅ | ✅ | ✅ | ✅ |
| ADD_TO_CART | ❌ | ✅ | ❌ | ✅ | ✅ |
| MANAGE_PRODUCTS | ❌ | ❌ | ✅ | ✅ | ✅ |
| MANAGE_USERS | ❌ | ❌ | ❌ | ✅ | ✅ |
| VIEW_ORDERS | ❌ | ✅ | ✅ | ✅ | ✅ |
| MANAGE_ORDERS | ❌ | ❌ | ✅ | ✅ | ✅ |
| MANAGE_PERMISSIONS | ❌ | ❌ | ❌ | ❌ | ✅ |

## 📂 File Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                        # Homepage
│   ├── login/page.tsx                  # Authentication
│   ├── cart/page.tsx                   # Shopping cart
│   ├── orders/page.tsx                 # Buyer orders
│   ├── products/
│   │   ├── page.tsx                    # Product listing
│   │   └── [id]/page.tsx               # Product details
│   ├── seller/
│   │   ├── onboarding/page.tsx         # Seller registration
│   │   ├── orders/page.tsx             # Seller order management
│   │   └── products/
│   │       ├── page.tsx                # Product management
│   │       └── add/page.tsx            # Add product
│   └── admin/
│       ├── users/page.tsx              # User management
│       └── permissions/page.tsx        # Permission management
├── components/
│   └── Header.tsx                      # Navigation header
├── store/
│   └── authStore.ts                    # Zustand auth state
├── lib/
│   ├── permissions.ts                  # RBAC logic
│   └── api.ts                          # Backend API calls
└── ...
```

## 🎨 Features by Page

### Homepage (/)
- Hero banner with CTA
- Category grid (Men, Women, Kids, Accessories)
- Featured/trending products
- Brand showcase
- Footer with links

### Product Listing (/products)
- Sidebar filters (category, brand, price)
- Sort options (relevance, price, newest)
- Grid layout with product cards
- Responsive design

### Product Detail (/products/[id])
- Image gallery
- Product info (name, brand, price, discount)
- Size selection
- Add to cart (role-based)
- Product details section

### Cart (/cart)
- Cart items with images
- Quantity controls (+/-)
- Remove item option
- Order summary
- Checkout button

### Buyer Orders (/orders)
- Order list with status
- Order details (date, items, total)
- Status badges (Delivered, Shipped, Processing)
- View details button

### Seller Product Management (/seller/products)
- Product table (name, price, stock, status)
- Add product button
- Edit/delete actions
- Product statistics

### Seller Order Management (/seller/orders)
- Order table with buyer info
- Filter by status (All, Pending, Shipped, Delivered)
- Update order status
- Order statistics dashboard

### User Management (/admin/users)
- User table (name, email, role, status)
- Add user button
- Edit/delete actions
- Role statistics

### Permission Management (/admin/permissions)
- Role cards with permissions
- Create/edit role modal
- Permission checkboxes
- Delete role option

## 🔌 API Integration Points

All API calls are defined in `src/lib/api.ts`:

### Auth APIs
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`

### Product APIs
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

### Cart APIs
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/{id}`
- `DELETE /api/cart/items/{id}`

### Order APIs
- `GET /api/orders/my` (buyer)
- `POST /api/orders`
- `GET /api/seller/orders` (seller)
- `PATCH /api/orders/{id}/status`

### User APIs
- `GET /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

### Permission APIs
- `GET /api/permissions/roles`
- `POST /api/permissions/roles`
- `PUT /api/permissions/roles/{id}`
- `DELETE /api/permissions/roles/{id}`

## 🚀 Getting Started

```bash
cd ajio-clone
npm install
npm run dev
```

Visit: http://localhost:3000

## 🔗 Backend Connection

Update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

See `INTEGRATION_GUIDE.md` for complete backend integration steps.
