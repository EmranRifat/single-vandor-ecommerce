import { supabase } from './supabase';
import type { ProductWithCategory, CartItemWithProduct } from './database.types';

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

export const getProducts = async (categorySlug?: string) => {
  let query = supabase
    .from('products')
    .select('*, categories(*)')
    .order('created_at', { ascending: false });

  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as ProductWithCategory[];
};

export const getFeaturedProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) throw error;
  return data as ProductWithCategory[];
};

export const getProduct = async (slug: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data as ProductWithCategory | null;
};

export const getCartItems = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('session_id', sessionId);

  if (error) throw error;
  return data as CartItemWithProduct[];
};

export const addToCart = async (sessionId: string, productId: string, quantity: number) => {
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ session_id: sessionId, product_id: productId, quantity })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  if (quantity <= 0) {
    return deleteCartItem(itemId);
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCartItem = async (itemId: string) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
};

export const clearCart = async (sessionId: string) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('session_id', sessionId);

  if (error) throw error;
};

export const createOrder = async (orderData: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  totalAmount: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}) => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderData.orderNumber,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
      shipping_address: orderData.shippingAddress,
      total_amount: orderData.totalAmount,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
};
