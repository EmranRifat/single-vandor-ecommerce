

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
  reviews_count: number;
  is_superhost: boolean;
  created_at: string;
  updated_at: string;
}


export interface Pagination {
  limit: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  listings: Product[];
  pagination: Pagination;
}

export interface GetProductsPayload {
  page?: number;
  limit?: number;
  category?: string;
  city?: string;
  token?: string;
}