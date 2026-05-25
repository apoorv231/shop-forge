import { Role } from '@/store/authStore';

export const PERMISSIONS = {
  VIEW_PRODUCTS: ['GUEST', 'BUYER', 'SELLER', 'ADMIN', 'SUPERADMIN'],
  ADD_TO_CART: ['BUYER', 'ADMIN', 'SUPERADMIN'],
  MANAGE_CART: ['ADMIN', 'SUPERADMIN'],
  MANAGE_PRODUCTS: ['SELLER', 'ADMIN', 'SUPERADMIN'],
  MANAGE_USERS: ['ADMIN', 'SUPERADMIN'],
  MANAGE_PERMISSIONS: ['SUPERADMIN'],
  VIEW_ORDERS: ['BUYER', 'SELLER', 'ADMIN', 'SUPERADMIN'],
  MANAGE_ORDERS: ['SELLER', 'ADMIN', 'SUPERADMIN'],
} as const;

export const hasPermission = (userRole: Role, permission: keyof typeof PERMISSIONS): boolean => {
  return PERMISSIONS[permission].includes(userRole as any);
};
