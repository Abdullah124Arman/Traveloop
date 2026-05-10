// Core types mirroring the Prisma schema

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  country?: string;
  additionalInfo?: string;
  photoUrl?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  place?: string;
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  coverPhotoUrl?: string;
  totalBudget?: number;
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL';
  createdAt: string;
  updatedAt: string;
  stops?: Stop[];
}

export interface Stop {
  id: string;
  tripId: string;
  cityId?: string;
  description?: string;
  startDate: string;
  endDate: string;
  sectionBudget?: number;
  orderIndex: number;
  city?: City;
  activities?: StopActivity[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  region?: string;
  costIndex?: number;
  popularityScore?: number;
  imageUrl?: string;
  lat?: number;
  lng?: number;
}

export interface Activity {
  id: string;
  cityId?: string;
  name: string;
  description?: string;
  type: 'SIGHTSEEING' | 'FOOD' | 'ADVENTURE' | 'CULTURE' | 'WELLNESS';
  cost?: number;
  durationMinutes?: number;
  imageUrl?: string;
  city?: City;
}

export interface StopActivity {
  id: string;
  stopId: string;
  activityId?: string;
  scheduledTime?: string;
  customCost?: number;
  notes?: string;
  orderIndex: number;
  activity?: Activity;
}

export interface ChecklistItem {
  id: string;
  tripId: string;
  name: string;
  category: 'ESSENTIALS' | 'CLOTHING' | 'ELECTRONICS' | 'MISC';
  isPacked: boolean;
  createdAt: string;
}

export interface TripNote {
  id: string;
  tripId: string;
  stopId?: string;
  title?: string;
  content: string;
  dayNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  tripId: string;
  subtotal: number;
  tax?: number;
  grandTotal: number;
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL';
  pdfUrl?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  category: string;
  description: string;
  quantity: number;
  unitCost: number;
  amount: number;
  orderIndex: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  tripId?: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    photoUrl?: string;
  };
  trip?: { id: string; name: string; place?: string };
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  breakdown: Record<string, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
