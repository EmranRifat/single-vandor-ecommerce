import type { ProductWithCategory } from "./database.types";

type LooseProduct = Partial<ProductWithCategory> & {
  image_url?: string;
  product_category_id?: string;
  product_category?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    image_url?: string;
    created_at?: string;
  };
};

export function normalizeProduct(product: LooseProduct): ProductWithCategory {
  const rawImage = product.image || product.image_url || "";
  const category = product.categories || product.product_category;

  return {
    id: product.id || "",
    name: product.name || "Unnamed Product",
    slug: product.slug || product.id || "",
    description: product.description || "",
    price: Number(product.price || 0),
    compare_at_price:
      typeof product.compare_at_price === "number"
        ? product.compare_at_price
        : null,
      category_id:
      product.category_id ||
      product.product_category_id ||
      category?.id ||
      null,
    image: rawImage,
    images:
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : rawImage
          ? [rawImage]
          : [],
    stock: typeof product.stock === "number" ? product.stock : 999,
    featured: Boolean(product.featured),
    created_at: product.created_at || "",
    updated_at: product.updated_at || "",
    categories: category
      ? {
          id: category.id || "",
          name: category.name || "",
          slug: category.slug || category.id || "",
          description: category.description || "",
          image: category.image || category.image || "",
          created_at: category.created_at || "",
        }
      : undefined,
  };
}
