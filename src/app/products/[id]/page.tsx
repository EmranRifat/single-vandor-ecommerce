"use client";

import { useProductDetails } from "@/lib/http/product/useProductDetails";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isLoading, isError, error } = useProductDetails({ id });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-gray-500">Loading listing details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-red-500">{error.message}</p>
      </div>
    );
  }

  const item = data?.data;
console.log("dynamic data.>",item)
  if (!item) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-gray-500">Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-gray-100 shadow">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              {item.category}
            </span>

            {item.is_superhost && (
              <span className="rounded-full bg-black px-3 py-1 text-sm text-white">
                Superhost
              </span>
            )}
          </div>

          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            {item.title}
          </h1>

          <p className="mb-4 text-gray-600">
            {item.city}, {item.country}
          </p>

          <div className="mb-6 flex items-center gap-4 text-sm text-gray-600">
            <span>⭐ {item.rating}</span>
            <span>{item.reviews_count} reviews</span>
            <span>Host: {item.host_name}</span>
          </div>

          <p className="mb-6 leading-7 text-gray-700">{item.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${item.price_per_night}
            </span>
            <span className="ml-2 text-gray-500">/ night</span>
          </div>

          <button
            type="button"
            className="rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800"
          >
            Reserve now
          </button>
        </div>
      </div>
    </div>
  );
}