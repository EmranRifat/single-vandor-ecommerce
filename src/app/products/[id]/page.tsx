"use client";

import { useProductDetails } from "@/lib/hooks/product/useProductDetails";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Grid3X3,
  MapPin,
  Star,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const formatCurrency = (amount: number, currency?: string) => {
  const label = currency === "BDT" || currency === "USD" ? currency : "BDT";

  return `${label} ${new Intl.NumberFormat("en-US").format(amount || 0)}`;
};

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const { data, isLoading, isError, error } = useProductDetails({ id });

  const bookingDates = useMemo(() => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 3);

    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 1);

    return {
      checkIn,
      checkOut,
      nights: Math.max(
        1,
        Math.round(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        )
      ),
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-[360px] animate-pulse rounded-lg bg-gray-100" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_464px]">
          <div className="space-y-4">
            <div className="h-7 w-56 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-80 max-w-full animate-pulse rounded bg-gray-100" />
            <div className="h-28 w-full animate-pulse rounded bg-gray-100" />
          </div>
          <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-red-500">{error.message}</p>
      </div>
    );
  }

  const item = data?.data;

  if (!item) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">Listing not found.</p>
      </div>
    );
  }

  const photos = item.images?.length ? item.images : [item.image].filter(Boolean);
  const galleryPhotos = Array.from(
    { length: 5 },
    (_, index) => photos[index] || photos[0]
  );
  const details = item.details || {};
  const guestCount = details.guests || 1;
  const bedroomCount = details.bedrooms || 0;
  const bedCount = details.beds || 0;
  const bathroomCount = details.bathrooms || 0;
  const amenities = item.amenities || [];
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 6);
  const totalPrice = item.price_per_night * bookingDates.nights;
  const hostName = item.host?.name || item.host_name;
  const isSuperhost = item.host?.is_superhost ?? item.is_superhost;

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="mb-5">
          <p className="text-sm font-medium capitalize text-gray-500">
            {item.category} in {item.location || `${item.city}, ${item.country}`}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950 sm:text-3xl">
            {item.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700">
            <span className="inline-flex items-center gap-1 font-medium">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {Number(item.rating || 0).toFixed(2)}
            </span>
            <a href="#reviews" className="font-medium underline underline-offset-2">
              {item.reviews_count} reviews
            </a>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              {item.address || `${item.city}, ${item.country}`}
            </span>
          </div>
        </div>

        <section className="grid h-auto gap-2 overflow-hidden rounded-lg md:h-[360px] md:grid-cols-[1.02fr_1fr]">
          <button
            type="button"
            onClick={() => setShowPhotoModal(true)}
            className="relative min-h-[260px] overflow-hidden bg-gray-100"
          >
            {galleryPhotos[0] && (
              <Image
                src={galleryPhotos[0]}
                alt={`${item.title} main photo`}
                fill
                className="object-cover transition duration-300 hover:scale-105"
                sizes="(min-width: 768px) 50vw, 100vw"
                unoptimized
              />
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            {galleryPhotos.slice(1, 5).map((photo, index) => (
              <button
                key={`${photo}-${index}`}
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="relative min-h-[150px] overflow-hidden bg-gray-100"
              >
                {photo && (
                  <Image
                    src={photo}
                    alt={`${item.title} photo ${index + 2}`}
                    fill
                    className="object-cover transition duration-300 hover:scale-105"
                    sizes="(min-width: 768px) 25vw, 50vw"
                    unoptimized
                  />
                )}

                {index === 3 && (
                  <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-950 shadow">
                    <Grid3X3 className="h-4 w-4" />
                    Show all photos
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_464px] lg:items-start">
          <section>
            <div className="border-b border-gray-200 pb-7">
              <h2 className="text-xl font-semibold text-gray-950">
                About This Home
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-gray-700">
                <span>{pluralize(guestCount, "guest")}</span>
                {bedroomCount > 0 && (
                  <span>{pluralize(bedroomCount, "bedroom")}</span>
                )}
                {bedCount > 0 && <span>{pluralize(bedCount, "bed")}</span>}
                {bathroomCount > 0 && (
                  <span>
                    {pluralize(bathroomCount, "attached bath", "attached baths")}
                  </span>
                )}
              </div>
              <div
                id="reviews"
                className="mt-3 flex items-center gap-3 text-sm text-gray-900"
              >
                <span className="inline-flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {Number(item.rating || 0).toFixed(2)}
                </span>
                <a href="#reviews" className="font-medium underline underline-offset-2">
                  {item.reviews_count} reviews
                </a>
              </div>
            </div>

            <div className="border-b border-gray-200 py-7">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-950">
                    Hosted by {hostName}
                  </h2>
                  {isSuperhost && (
                    <p className="mt-1 text-sm font-medium text-gray-600">
                      Superhost
                    </p>
                  )}
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-950 text-sm font-semibold text-white">
                  {hostName?.slice(0, 1).toUpperCase() || "H"}
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 py-7">
              <h2 className="text-xl font-semibold text-gray-950">Details</h2>
              <p className="mt-4 leading-7 text-gray-700">{item.description}</p>

              {!!amenities.length && (
                <div className="mt-6">
                  <p className="mb-2 font-medium text-gray-950">
                    The room includes
                  </p>
                  <ul className="space-y-1 text-gray-800">
                    {visibleAmenities.map((amenity) => (
                      <li key={amenity} className="flex items-center gap-2">
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-emerald-500 text-white">
                          <Check className="h-3 w-3" />
                        </span>
                        {amenity}
                      </li>
                    ))}
                  </ul>

                  {amenities.length > 6 && (
                    <>
                      {!showAllAmenities && <p className="mt-1 text-gray-800">...</p>}
                      <button
                        type="button"
                        onClick={() => setShowAllAmenities((value) => !value)}
                        className="mt-3 rounded-md bg-pink-50 px-4 py-2 text-sm font-medium text-pink-500 transition hover:bg-pink-100"
                      >
                        {showAllAmenities ? "Show less" : "Show more"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {!!item.house_rules?.length && (
              <div className="border-b border-gray-200 py-7">
                <h2 className="text-xl font-semibold text-gray-950">
                  House rules
                </h2>
                <ul className="mt-4 grid gap-3 text-gray-800 sm:grid-cols-2">
                  {item.house_rules.map((rule) => (
                    <li key={rule} className="flex items-center gap-2">
                      <X className="h-4 w-4 text-rose-500" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="pt-4 text-base font-semibold text-gray-950">
              Selected: {dateFormatter.format(bookingDates.checkIn)} -{" "}
              {dateFormatter.format(bookingDates.checkOut)} (
              {pluralize(bookingDates.nights, "night")})
            </p>
          </section>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-lg bg-white p-6 shadow-[0_12px_42px_rgba(15,23,42,0.12)]">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-pink-500">
                  {formatCurrency(item.price_per_night, item.currency)}
                </span>
                <span className="pb-1 font-medium text-gray-700">/day</span>
              </div>

              <p className="mt-4 text-sm text-gray-950">
                <span className="font-semibold">
                  {formatCurrency(totalPrice, item.currency)}
                </span>{" "}
                for {pluralize(bookingDates.nights, "night")}
              </p>

              <div className="mt-7 overflow-hidden rounded-lg border border-gray-300">
                <div className="grid grid-cols-2 divide-x divide-gray-300">
                  <div className="flex items-center gap-3 p-4">
                    <CalendarDays className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Check In</p>
                      <p className="text-sm font-semibold text-gray-950">
                        {dateFormatter.format(bookingDates.checkIn)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <CalendarDays className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Check Out</p>
                      <p className="text-sm font-semibold text-gray-950">
                        {dateFormatter.format(bookingDates.checkOut)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 flex w-full items-center justify-between rounded-lg border border-gray-300 p-4 text-left"
              >
                <span className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <span>
                    <span className="block text-sm text-gray-600">Guests</span>
                    <span className="block text-sm font-semibold text-gray-950">
                      {pluralize(guestCount, "guest")}
                    </span>
                  </span>
                </span>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </button>

              <button
                type="button"
                disabled={item.availability === false}
                className="mt-6 w-full rounded-lg bg-pink-500 px-6 py-4 text-sm font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {item.availability === false ? "NOT AVAILABLE" : "BOOK NOW"}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {showPhotoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-950">
                {item.title}
              </h2>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="rounded-full border border-gray-300 p-2 transition hover:bg-gray-100"
                aria-label="Close photos"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4">
              {photos.map((photo, index) => (
                <div
                  key={`${photo}-modal-${index}`}
                  className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-100"
                >
                  <Image
                    src={photo}
                    alt={`${item.title} large photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
