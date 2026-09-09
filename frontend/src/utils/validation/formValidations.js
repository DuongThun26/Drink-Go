/**
 * Form Validation Schemas using Zod
 * Centralized validation for all forms
 */

import { z } from 'zod';

// ============= AUTH VALIDATION =============

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ============= ORDER VALIDATION =============

export const OrderSchema = z.object({
  paymentMethod: z.enum(['COD', 'VNPay'], { errorMap: () => ({ message: 'Invalid payment method' }) }),
  receivename: z.string().min(2, 'Name must be at least 2 characters'),
  receivephone: z.string().regex(/^[0-9]{10,11}$/, 'Phone must be 10-11 digits'),
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  ward: z.string().min(1, 'Ward is required'),
  detailaddress: z.string().min(5, 'Address must be at least 5 characters'),
  note: z.string().optional(),
});

// ============= USER PROFILE VALIDATION =============

export const UserProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Phone must be 10-11 digits'),
  email: z.string().email('Invalid email address'),
});

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ============= ADDRESS VALIDATION =============

export const AddressSchema = z.object({
  receivename: z.string().min(2, 'Name must be at least 2 characters'),
  receivephone: z.string().regex(/^[0-9]{10,11}$/, 'Phone must be 10-11 digits'),
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  ward: z.string().min(1, 'Ward is required'),
  detailaddress: z.string().min(5, 'Address must be at least 5 characters'),
});

// ============= PROMOTION VALIDATION =============

export const PromoCodeSchema = z.object({
  code: z.string().min(1, 'Promo code is required').transform(val => val.toUpperCase()),
});

// Type exports for TypeScript compatibility removed
// This file is JavaScript, not TypeScript
// If TypeScript support is needed, rename to formValidations.ts

