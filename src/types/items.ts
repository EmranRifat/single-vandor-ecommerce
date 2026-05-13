
export interface ListingData  {
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

export interface items {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price: number | null
  stock: number
  featured: boolean
  category_id: string | null
  categories?: Category
  image: string
  images: string[]
  created_at: string
  updated_at: string
}

export interface Category{
  id: string
  name: string
  created_at: string
  updated_at: string
}
export interface Product {
  id: string
  name: string
  image: string
}
export interface Item {
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