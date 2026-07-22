import { AvailabilitySelectionMode } from "@/src/app/become-a-host/setup/page";
import { Item } from "@/src/types/items";

export interface NewUser {
  email: string;
  name: string;
  password: string;
  token: string;
}

export interface RegUserResponse {
  status: string;
  status_code: number;
  success: boolean;
  user: object;
  error: string;
  message: string;
  isLoading: boolean;
}


import { Dispatch, SetStateAction } from "react";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin" | "Admin" | "superadmin" | "SuperAdmin";
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  logout_user: () => void;
};







export type ApiResponse<T> = {
  status: "success" | "error";
  status_code: number;
  message: string;
  data: T;
  error?: string;
};


export type ProductCategory = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};



export interface ProductMeta {
  limit: number;
  page: number;
  total: number;
  total_pages: number;
}


export interface ItemListPayload {
  page?: number;
  limit?: number;
  category?: string;
  token?: string;
}




export type Category = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};
export type SideCategory = {
  id: string;
  name: string;

};

export interface ListingData {
  id: string
  title: string
  description: string
  price_per_night: number
  city: string
  country: string
  image: string
  category: string
  address?: string
  product_address?: string
  rating: number
  reviews_count: number
  host_name: string
  is_superhost: boolean
  created_at: string
  updated_at: string
}





export interface ItemListPayload {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  token?: string;
}

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  price_per_night: number;
  city: string;
  country: string;
  image: string;
  category: string;
  address?: string;
  product_address?: string;
  rating: number;
  reviews_count: number;
  host_name: string;
  is_superhost: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemListResponse {
  message: string;
  success: boolean;
  data: ListingData[];
  meta: {
    limit: number;
    page: number;
    total_pages: number;
  };
}

export type ProductDetail = Item & {
  name?: string;
  price?: number;
  manufacturer?: string;
  slug?: string;
  compare_at_price?: number | null;
  category_id?: string | null;
  images?: string[];
  stock?: number;
  featured?: boolean;
  product_category?: {
    id: string;
    name: string;
  };
};

export type Product = ProductDetail & {
  name: string;
  title?: string;
  price: number;
  price_per_night?: number;
  image: string;
  stock: number;
  slug?: string;
};


export type ManualBookingPayload = {
  listing_id: string;
  product_title?: string;
  product_image?: string;
  category?: string;
  product_address?: string;
  booking_id?: number | null;
  payment_method: "manual" | "sslcommerz" | "bkash";
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  total_amount: number;
  currency: string;
  billing_address?: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  user_address?: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  user_information?: {
    name: string;
    role: "admin" | "user" | "host" | string;
    phone: string;
    email: string;
  };
  card_last4?: string;
  card_expiration?: string;
  terms_accepted: boolean;
};

export type SslPaymentInitPayload = {
  booking_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
};

export type SslPaymentInitData = {
  GatewayPageURL?: string;
  gateway_url?: string;
  redirect_url?: string;
  sessionkey?: string;
};

export type SslPaymentInitResponse = {
  status?: string;
  message?: string;
  data?: SslPaymentInitData;
  GatewayPageURL?: string;
  gateway_url?: string;
  redirect_url?: string;
  amount?: number;
  booking_id?: number;
  currency?: string;
  payment_id?: number;
  tran_id?: string;
};

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  price_per_night: number;
  currency?: string;
  city: string;
  country: string;
  location?:
  | string
  | {
    lat?: number;
    lng?: number;
  };
  address?: string;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews_count: number;
  host_name: string;
  is_superhost: boolean;
  host?: {
    name?: string;
    is_superhost?: boolean;
  };
  details?: {
    guests?: number;
    bedrooms?: number;
    beds?: number;
    bathrooms?: number;
  };
  amenities?: string[];
  house_rules?: string[];
  availability?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductDetailsResponse {
  message: string;
  success: boolean;
  data: ProductItem | null;
}

export interface ProductDetailsPayload {
  id: string;
  token?: string;
}

export interface ProductDetailsApiResponse {
  product: ProductItem;
  message: string;
  success: boolean;
}
export type HostListingItem = {
  id: string;
  listingId: string | null;
  host_id: number;
  title: string;
  description: string;
  status: string;
  photos: string[];
  rentPerNight: string;
  bathrooms: number;
  bedrooms: number;
  checkIn: string;
  checkOut: string;
  facilities: Record<string, boolean>;
  kitchens: number;
  latitude: number;
  longitude: number;
  location: string;
  propertyType: string;
  availabilitySelectionMode: string;
  availableFrom: string;
  availableTo: string;
  created_at: string;
  updated_at: string;
};


export type HostListingSubmission = {
  propertyType: string;
  title: string;
  rentPerNight: string;
  checkIn: string;
  checkOut: string;
  availabilitySelectionMode: AvailabilitySelectionMode;
  availableDate: string | null;
  availableFrom: string | null;
  availableTo: string | null;
  suggestedAvailableFrom: string | null;
  suggestedAvailableTo: string | null;
  location: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  photos: string[];
};






export type HostListingPayload = {
  availabilitySelectionMode: "single" | "range";
  availableFrom: string;
  availableTo: string;
  bathrooms: number;
  bedrooms: number;
  checkIn: string;
  checkOut: string;
  description: string;
  facilities: Record<string, boolean>;
  kitchens: number;
  latitude: number;
  longitude: number;
  location: string;
  photos: File[];
  propertyType: string;
  rentPerNight: string;
  title: string;
};

export type CreateHostListingVariables = {
  payload: HostListingPayload;
  token: string;
};

export type HostListingListResponse = {
  message?: string;
  success?: boolean;
  data?: HostListingItem[];
  listing?: unknown;
  error?: string;
};

export type HostListingResponse = {
  message?: string;
  success?: boolean;
  data?: unknown;
  listing?: unknown;
  error?: string;
};

export type ApiLogItem = {
  id: number;
  method: string;
  operation: string;
  path: string;
  query: string;
  statusCode: number;
  status: string;
  message: string;
  isError: boolean;
  errorType: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  userEmail: string;
  latencyMs: number;
  errorMessage: string;
  createdAt: string;
};

export type ApiLogsPayload = {
  page?: number;
  limit?: number;
};

export type ApiLogsResponse = {
  count: number;
  data: ApiLogItem[];
  limit: number;
  page: number;
  success: boolean;
  total: number;
  message?: string;
  error?: string;
};
export interface AllUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "host";
  created_at: string;
  updated_at: string;
}

export interface AllUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "host";
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetAllUsersResponse {
  status: string;
  message: string;
  pagination: PaginationInfo;
  data: AllUser[];
}
export interface Booking {
  product_address: any;
  category: string;
  id: number;
  booking_id?: string | number;
  booked_by_id: number;
  booked_by_name: string;
  booked_by_email: string;
  booked_by_role: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  user_role?: string;
  listing_id: string;
  payment_method: string;
  product_title?: string;
  product_image?: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  total_amount: number;
  currency: string;
  billing_street?: string;
  billing_city?: string;
  billing_zip?: string;
  billing_country?: string;
  user_street?: string;
  user_city?: string;
  user_zip?: string;
  user_country?: string;
  card_last4: string;
  card_expiration: string;
  terms_accepted: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetBookingsResponse {
  status: string;
  message: string;
  data: Booking[];
  pagination: BookingPagination;
}


export interface Review {
  id: number;
  user_id: number;
  listing_id: number;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetReviewsResponse {
  status: string;
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Review[];
}


