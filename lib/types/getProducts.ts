

//all product type for getProuctData and fetchingProductData 

export interface Product {
  id: string;
  title: string;
  description: string;
  price_per_night: number;
  currency?: string;
  city: string;
  country: string;
  location?: {
    lat: number;
    lng: number;
  };
  address: string;
  image: string;
  images?: string[];
  category: string;
  status?: string;
  rating: number;
  reviews_count: number;
  host_name: string;
  host?: {
    name: string;
    is_superhost: boolean;
  };
  is_superhost: boolean;
  details?: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  kitchens?: number;
  checkIn?: string;
  checkOut?: string;
  facilities?: Record<string, string> | null;
  amenities?: string[] | null;
  house_rules?: string[] | null;
  availability?: boolean;
  availabilitySelectionMode?: string;
  availableFrom?: string | null;
  availableTo?: string | null;
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

export interface GetProductsPayload {
  page?: number;
  limit?: number;
  category?: string;
  city?: string;
  token?: string;
}