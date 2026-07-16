

//all product type for getProuctData and fetchingProductData 

export interface Product {
  id: string;
  title: string;
  description: string;
  price_per_night: number;
  city: string;
  country: string;
  category: string;
  host_name: string;
  image: string;
  rating: number;
  address: string;
  reviews_count: number;
  is_superhost: boolean;
  created_at: string;
  updated_at: string;
}


export interface Pagination {
  limit: number;
  page: number;
  totalPages: number;
  total: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  listings: Product[];
  pagination: Pagination;
}

export type ProductSortOption =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "newest";

export interface GetProductsPayload {
  page?: number;
  limit?: number;
  category?: string;
  city?: string;
  token?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  is_superhost?: boolean;
  sort_by?: ProductSortOption;
}