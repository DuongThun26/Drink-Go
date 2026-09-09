import { z } from 'zod'

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

export const RegisterSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    receivename: z.string().min(2, 'Name is required'),
    receivephone: z.string().regex(/^[0-9]{10,11}$/, 'Phone must be 10-11 digits'),
    province: z.string().min(1, 'Province is required'),
    district: z.string().min(1, 'District is required'),
    ward: z.string().min(1, 'Ward is required'),
    detailaddress: z.string().min(5, 'Address is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const CheckoutSchema = z.object({
  paymentMethod: z.enum(['COD', 'VNPay'], { message: 'Select a payment method' }),
  receivename: z.string().min(2, 'Name is required'),
  receivephone: z.string().regex(/^[0-9]{10,11}$/, 'Phone must be 10-11 digits'),
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  ward: z.string().min(1, 'Ward is required'),
  detailaddress: z.string().min(5, 'Address is required'),
  note: z.string().optional(),
})

export const PromoCodeSchema = z.object({
  code: z.string().min(1, 'Promo code is required'),
})

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, 'Password must be at least 6 characters'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
