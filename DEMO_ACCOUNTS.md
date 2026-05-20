# 🎭 Demo Accounts for Testing

## Quick Login Credentials

Use these pre-configured demo accounts to test different user roles and permissions:

### 👤 Buyer Account
- **Email**: `buyer@demo.com`
- **Password**: `buyer123`
- **Access**: Browse products, add to cart, place orders

### 🏪 Seller Account
- **Email**: `seller@demo.com`
- **Password**: `seller123`
- **Access**: Manage products, view/update orders

### 👨‍💼 Admin Account
- **Email**: `admin@demo.com`
- **Password**: `admin123`
- **Access**: Manage users, products, and orders

### 🔐 SuperAdmin Account
- **Email**: `superadmin@demo.com`
- **Password**: `super123`
- **Access**: Full system access + permission management

## How to Use

### Method 1: One-Click Demo Login
1. Go to `/login` page
2. Click "Show" on the "Demo Accounts" banner
3. Click any demo account card to instantly login

### Method 2: Manual Login
1. Go to `/login` page
2. Enter email and password from above
3. Click "Login to Account"

### Method 3: Sign Up (Any Email)
1. Go to `/login` page
2. Switch to "Sign Up" tab
3. Enter any email/password
4. Choose role (Buyer/Seller)
5. Click "Create Account"

## Testing Scenarios

### Test Buyer Flow
1. Login as `buyer@demo.com`
2. Browse products at `/products`
3. Add items to cart
4. View cart at `/cart`
5. Apply promo code: `SAVE10`
6. View orders at `/orders`

### Test Seller Flow
1. Login as `seller@demo.com`
2. View products at `/seller/products`
3. Add new product at `/seller/products/add`
4. Manage orders at `/seller/orders`
5. Update order status

### Test Admin Flow
1. Login as `admin@demo.com`
2. Manage users at `/admin/users`
3. View all products and orders

### Test SuperAdmin Flow
1. Login as `superadmin@demo.com`
2. Access permission management at `/admin/permissions`
3. Create/edit custom roles
4. Assign permissions to roles

## Features to Test

✅ **Authentication**
- Login with demo accounts
- Sign up with new account
- Password visibility toggle
- Error handling for invalid credentials

✅ **RBAC (Role-Based Access Control)**
- Different navigation menus per role
- Page access restrictions
- Permission-based features

✅ **Shopping Features**
- Product browsing with filters
- Add to cart (Buyer only)
- Promo code application
- Order placement

✅ **Seller Features**
- Product CRUD operations
- Order management
- Status updates

✅ **Admin Features**
- User management
- Role assignment
- Permission management (SuperAdmin)

## Notes

- All demo accounts work instantly without backend
- Data is stored in browser localStorage
- Refresh page to reset demo data
- Sign up creates new accounts with any email
