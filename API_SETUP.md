# API Integration Setup

## Overview
The application is set up for API integration but currently uses demo logins for development.

## Service Files Structure

### Authentication
- `/src/services/authService.ts` - Login, signup, logout, token management

### Products
- `/src/services/productService.ts` - Product CRUD, image upload

### Orders
- `/src/services/orderService.ts` - Order management, status updates, invoices

### Cart
- `/src/services/cartService.ts` - Cart operations, item management

### Profile
- `/src/services/profileService.ts` - User profile, password, avatar

### User Management (Admin)
- `/src/services/userService.ts` - User CRUD, role management, block/unblock

### Permissions (Admin)
- `/src/services/permissionService.ts` - Permission management, role permissions

### Seller
- `/src/services/sellerService.ts` - Onboarding, analytics, seller dashboard

### Wishlist
- `/src/services/wishlistService.ts` - Wishlist operations

### Reviews
- `/src/services/reviewService.ts` - Product reviews

### Checkout
- `/src/services/checkoutService.ts` - Order creation, payment verification

### Central Export
- `/src/services/index.ts` - Export all services

## Configuration

### Environment Variables
Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Usage Examples

### Import Services
```typescript
// Import specific service
import { productService } from '@/services/productService';
import { cartService } from '@/services/cartService';

// Or import all
import { productService, cartService, authService } from '@/services';
```

### Products
```typescript
import { productService } from '@/services';

// Get all products
const products = await productService.getAll({ category: 'shirts' });

// Create product
await productService.create({
  name: 'Casual Shirt',
  price: 1299
});

// Upload images
await productService.uploadImages(productId, files);
```

### Cart
```typescript
import { cartService } from '@/services';

// Add to cart
await cartService.addItem(productId, 1, 'M');

// Get cart
const cart = await cartService.get();

// Get cart count
const count = await cartService.getCount();
```

### Orders
```typescript
import { orderService } from '@/services';

// Create order
await orderService.create(orderData);

// Get orders
const orders = await orderService.getAll();

// Download invoice
const blob = await orderService.downloadInvoice(orderId);
```

### Profile
```typescript
import { profileService } from '@/services';

// Update profile
await profileService.update({
  name: 'John Doe',
  phone: '+91 9876543210'
});

// Upload avatar
await profileService.uploadAvatar(file);
```

### Admin - Users
```typescript
import { userService } from '@/services';

// Get all users
const users = await userService.getAll();

// Update role
await userService.updateRole(userId, 'SELLER');

// Get stats
const stats = await userService.getStats();
```

### Admin - Permissions
```typescript
import { permissionService } from '@/services';

// Get role permissions
const permissions = await permissionService.getRolePermissions('BUYER');

// Update permissions
await permissionService.updateRolePermissions('BUYER', [
  'VIEW_PRODUCTS',
  'ADD_TO_CART'
]);
```

### Seller
```typescript
import { sellerService } from '@/services';

// Submit onboarding
await sellerService.submitOnboarding(data);

// Get analytics
const analytics = await sellerService.getAnalytics();

// Get dashboard
const dashboard = await sellerService.getDashboard();
```

### Wishlist
```typescript
import { wishlistService } from '@/services';

// Add to wishlist
await wishlistService.add(productId);

// Check if in wishlist
const isInWishlist = await wishlistService.isInWishlist(productId);
```

### Reviews
```typescript
import { reviewService } from '@/services';

// Create review
await reviewService.create(productId, 5, 'Great product!');

// Get my reviews
const myReviews = await reviewService.getMyReviews();
```

### Checkout
```typescript
import { checkoutService } from '@/services';

// Create order
await checkoutService.createOrder(orderData);

// Apply promo code
const discount = await checkoutService.applyPromoCode('SAVE10');
```

## File Structure
```
src/services/
├── index.ts                    # Central export
├── authService.ts              # Authentication
├── productService.ts           # Products
├── orderService.ts             # Orders
├── cartService.ts              # Cart
├── profileService.ts           # Profile
├── userService.ts              # User management
├── permissionService.ts        # Permissions
├── sellerService.ts            # Seller
├── wishlistService.ts          # Wishlist
├── reviewService.ts            # Reviews
├── checkoutService.ts          # Checkout
└── apiService.ts               # Legacy (backward compatibility)
```

## Current Setup
- ✅ Separate service files for each entity
- ✅ Clean, organized structure
- ✅ Token management
- ✅ File upload support
- ✅ Central export
- ⏳ Using demo data (no backend calls)
- ⏳ Backend API pending

## Next Steps
1. Set up backend API
2. Update `NEXT_PUBLIC_API_URL` in `.env.local`
3. Replace demo data with service calls
4. Test all endpoints
5. Handle error states
