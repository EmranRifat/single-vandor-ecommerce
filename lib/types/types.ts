
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