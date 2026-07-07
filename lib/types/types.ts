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
export type All = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type AuthContextType = {
  user: All | null;
  loading: boolean;
  setUser: (user: All | null) => void;
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

export interface ListingData {
  id: string
  title: string
  description: string
  price_per_night: number
  city: string
  country: string
  image: string
  category: string
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