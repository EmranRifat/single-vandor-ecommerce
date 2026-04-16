
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

export type Category = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  product_category_id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  manufacturer: string;
  created_at: string;
  updated_at: string;
  product_category?: ProductCategory;
};
// export interface ProductCategory {
//   id: string;
//   name: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface Product {
//   id: string;
//   product_category_id: string;
//   name: string;
//   price: number;
//   image: string;
//   description: string;
//   manufacturer: string;
//   created_at: string;
//   updated_at: string;
//   product_category: ProductCategory;
// }

export interface ProductMeta {
  limit: number;
  page: number;
  total: number;
  total_pages: number;
}

export interface ProductListResponse {
  message: string;
  success: boolean;
  data: Product[];
  meta: ProductMeta;
}

export type ProductListPayload = {
  page?: number;
  limit?: number;
  q?: string;
  token?: string;
  category?: string;
};