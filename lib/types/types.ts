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
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
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


export type ManualBookingPayload = {
  listing_id: string;
  payment_method: "manual";
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  total_amount: number;
  currency: string;
  billing_address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  card_last4: string;
  card_expiration: string;
  terms_accepted: boolean;
};
