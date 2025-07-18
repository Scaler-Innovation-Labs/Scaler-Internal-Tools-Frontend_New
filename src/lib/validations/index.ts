import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const ticketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  category: z.enum(['tickets', 'transport', 'documents', 'mess', 'common-drive', 'other']),
})

export const transportBookingSchema = z.object({
  route: z.string().min(1, 'Route is required'),
  pickupTime: z.string().min(1, 'Pickup time is required'),
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  dropLocation: z.string().min(1, 'Drop location is required'),
  passengerCount: z.number().min(1, 'At least 1 passenger required').max(8, 'Maximum 8 passengers'),
  vehicleType: z.enum(['hatchback', 'sedan', 'suv']),
})

export const messBookingSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  meals: z.object({
    breakfast: z.array(z.string()).optional(),
    lunch: z.array(z.string()).optional(),
    dinner: z.array(z.string()).optional(),
  }),
})

export type LoginData = z.infer<typeof loginSchema>
export type TicketData = z.infer<typeof ticketSchema>
export type TransportBookingData = z.infer<typeof transportBookingSchema>
export type MessBookingData = z.infer<typeof messBookingSchema>
