"use client";

import { createManualBooking } from "@/lib/queries";
import { useProductDetails } from "@/lib/hooks/product/useProductDetails";
import ReviewsSection from "@/src/components/Products/ReviewsSection";
import {
  BadgeCheck,
  Bath,
  Bed,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  CircleDot,
  Coffee,
  IdCard,
  Grid3X3,
  MapPin,
  MessageSquare,
  Snowflake,
  Star,
  Tv,
  User,
  Utensils,
  Wifi,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";

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

const getFacilityIcon = (facility: string) => {
  const value = facility.toLowerCase();

  if (value.includes("blanket") || value.includes("bed")) return Bed;
  if (value.includes("id")) return IdCard;
  if (value.includes("ac") || value.includes("air")) return Snowflake;
  if (value.includes("wifi")) return Wifi;
  if (value.includes("parking")) return Car;
  if (value.includes("coffee")) return Coffee;
  if (value.includes("tv")) return Tv;
  if (value.includes("kitchen")) return Utensils;
  if (value.includes("water") || value.includes("washroom")) return Bath;

  return CircleDot;
};

const getLocationCoordinates = (
  location?: string | { lat?: number; lng?: number }
) => {
  if (!location || typeof location === "string") {
    return null;
  }

  if (typeof location.lat !== "number" || typeof location.lng !== "number") {
    return null;
  }

  return {
    lat: location.lat,
    lng: location.lng,
  };
};

const getLocationLabel = (
  location: string | { lat?: number; lng?: number } | undefined,
  fallback: string
) => (typeof location === "string" && location ? location : fallback);

const getMapEmbedUrl = (lat: number, lng: number) => {
  const delta = 0.008;
  const bbox = [
    lng - delta,
    lat - delta,
    lng + delta,
    lat + delta,
  ].join(",");

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
};

const getDefaultBookingRange = (): DateRange => {
  const from = new Date();
  from.setDate(from.getDate() + 3);

  const to = new Date(from);
  to.setDate(to.getDate() + 1);

  return { from, to };
};

const getCreatedBookingId = (response: unknown) => {
  const result = response as {
    id?: string | number;
    booking_id?: string | number;
    data?: {
      id?: string | number;
      booking_id?: string | number;
      booking?: {
        id?: string | number;
        booking_id?: string | number;
      };
    };
    booking?: {
      id?: string | number;
      booking_id?: string | number;
    };
  };
  const rawId =
    result.data?.booking_id ||
    result.data?.id ||
    result.data?.booking?.booking_id ||
    result.data?.booking?.id ||
    result.booking_id ||
    result.id ||
    result.booking?.booking_id ||
    result.booking?.id;
  const bookingId = Number(rawId);

  return bookingId && !Number.isNaN(bookingId) ? bookingId : null;
};

const getNights = (range: DateRange) => {
  if (!range.from || !range.to) {
    return 1;
  }

  return Math.max(
    1,
    Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))
  );
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultBookingRange);
  const [guestSelection, setGuestSelection] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const { data, isLoading, isError, error } = useProductDetails({ id });

  const bookingDates = useMemo(() => {
    return {
      checkIn: dateRange.from,
      checkOut: dateRange.to,
      nights: getNights(dateRange),
    };
  }, [dateRange]);

  const updateGuestCount = (
    key: keyof typeof guestSelection,
    direction: "increase" | "decrease"
  ) => {
    setGuestSelection((current) => {
      const minimum = key === "adults" ? 1 : 0;
      const nextValue =
        direction === "increase" ? current[key] + 1 : current[key] - 1;

      return {
        ...current,
        [key]: Math.max(minimum, nextValue),
      };
    });
  };

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
  const bookingDiscount = Number((totalPrice * 0.15).toFixed(2));
  const bookingTaxes = Number(((totalPrice - bookingDiscount) * 0.055).toFixed(2));
  const bookingTotal = Number(
    (totalPrice - bookingDiscount + bookingTaxes).toFixed(2)
  );
  const hostName = item.host?.name || item.host_name;
  const isSuperhost = item.host?.is_superhost ?? item.is_superhost;
  const locationLabel = getLocationLabel(
    item.location,
    item.address || `${item.city}, ${item.country}`
  );
  
  const mapCoordinates = getLocationCoordinates(item.location);
  const facilities = amenities.length
    ? amenities.slice(0, 6)
    : ["Blanket", "ID Required", "Air Conditioner"];
  const bookingGuestCount = guestSelection.adults + guestSelection.children;
  const bookingUrl = `/booking?${new URLSearchParams({
    id: item.id,
    checkIn: bookingDates.checkIn
      ? bookingDates.checkIn.toISOString()
      : "",
    checkOut: bookingDates.checkOut
      ? bookingDates.checkOut.toISOString()
      : "",
    adults: String(guestSelection.adults),
    children: String(guestSelection.children),
  }).toString()}`;
  const guestRows = [
    {
      key: "adults" as const,
      title: "Adults",
      subtitle: "Age 13+",
      value: guestSelection.adults,
    },
    {
      key: "children" as const,
      title: "Children",
      subtitle: "Ages 2-12",
      value: guestSelection.children,
    },
    {
      key: "infants" as const,
      title: "Infants",
      subtitle: "Under 2",
      value: guestSelection.infants,
    },
    {
      key: "pets" as const,
      title: "Pets",
      subtitle: "Bringing a service animal?",
      value: guestSelection.pets,
    },
  ];

  const handleBookNow = async () => {
    if (item.availability === false) return;

    try {
      setBookingError("");
      setIsCreatingBooking(true);

      const bookingResponse = await createManualBooking({
        listing_id: String(item.id),
        payment_method: "sslcommerz",
        check_in: bookingDates.checkIn
          ? bookingDates.checkIn.toISOString().slice(0, 10)
          : "",
        check_out: bookingDates.checkOut
          ? bookingDates.checkOut.toISOString().slice(0, 10)
          : "",
        adults: guestSelection.adults,
        children: guestSelection.children,
        total_amount: bookingTotal,
        currency: item.currency || "BDT",
        terms_accepted: true,
      });
      const bookingId = getCreatedBookingId(bookingResponse);

      if (!bookingId) {
        throw new Error("Booking was created, but the booking ID was not returned.");
      }

      router.push(`${bookingUrl}&bookingId=${bookingId}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create booking";

      setBookingError(message);
    } finally {
      setIsCreatingBooking(false);
    }
  };

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="mb-5">
          <p className="text-sm font-medium capitalize text-gray-500">
            {item.category} in {locationLabel}
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
              {item.address || locationLabel}
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
              <div className="border-b border-gray-200 py-5">
                <h2 className="text-lg font-semibold text-gray-950">
                  House rules
                </h2>
                <ul className="mt-3 flex flex-nowrap gap-3 overflow-x-auto pb-1 text-sm text-gray-800">
                  {item.house_rules.map((rule) => (
                    <li
                      key={rule}
                      className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2"
                    >
                      <X className="h-3.5 w-3.5 text-rose-500" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-b border-gray-200 py-5">
              <h2 className="text-lg font-semibold text-gray-950">
                Facilities
              </h2>
              <div className="mt-3 flex flex-nowrap gap-3 overflow-x-auto pb-1">
                {facilities.map((facility) => {
                  const FacilityIcon = getFacilityIcon(facility);

                  return (
                    <div
                      key={facility}
                      className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-50 text-gray-950">
                        <FacilityIcon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {facility}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-b border-gray-200 py-7">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-950">
                  {hostName?.slice(0, 1).toUpperCase() || "H"}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-950">
                    Hello, I am {hostName}
                  </h2>
                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-800">
                    <BadgeCheck className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                    Identity verified
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 font-medium text-gray-950">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <span>Languages Bangla, English</span>
              </div>

              <button
                type="button"
                className="mt-8 w-full max-w-xl rounded-lg border-2 border-pink-500 px-6 py-4 font-semibold text-pink-500 transition hover:bg-pink-50"
              >
                Contact Host
              </button>
            </div>

            <p className="pt-4 text-base font-semibold text-gray-950">
              Selected:{" "}
              {bookingDates.checkIn
                ? dateFormatter.format(bookingDates.checkIn)
                : "Select check in"}{" "}
              -{" "}
              {bookingDates.checkOut
                ? dateFormatter.format(bookingDates.checkOut)
                : "Select check out"}{" "}
              (
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

              <div className="relative mt-7">
                <button
                  type="button"
                  onClick={() => {
                    setShowCalendar((value) => !value);
                    setShowGuests(false);
                  }}
                  className="w-full overflow-hidden rounded-lg border border-gray-300 text-left transition hover:border-gray-950"
                >
                  <div className="grid grid-cols-2 divide-x divide-gray-300">
                    <div className="flex items-center gap-3 p-4">
                      <CalendarDays className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Check In</p>
                        <p className="text-sm font-semibold text-gray-950">
                          {bookingDates.checkIn
                            ? dateFormatter.format(bookingDates.checkIn)
                            : "Add date"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4">
                      <CalendarDays className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Check Out</p>
                        <p className="text-sm font-semibold text-gray-950">
                          {bookingDates.checkOut
                            ? dateFormatter.format(bookingDates.checkOut)
                            : "Add date"}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>

                {showCalendar && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
                    <DayPicker
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) =>
                        setDateRange(range || getDefaultBookingRange())
                      }
                      numberOfMonths={1}
                      disabled={{ before: new Date() }}
                      classNames={{
                        months: "flex",
                        month: "w-full space-y-4",
                        caption:
                          "relative flex items-center justify-center py-2 text-sm font-semibold text-gray-950",
                        nav: "absolute left-0 right-0 top-2 flex items-center justify-between",
                        nav_button:
                          "flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-100",
                        table: "w-full border-collapse",
                        head_row: "grid grid-cols-7",
                        head_cell:
                          "h-9 text-center text-xs font-medium text-gray-500",
                        row: "grid grid-cols-7",
                        cell: "p-1 text-center",
                        day: "h-9 w-9 rounded-full text-sm transition hover:bg-gray-100",
                        day_selected:
                          "bg-gray-950 text-white hover:bg-gray-950 hover:text-white",
                        day_range_middle:
                          "bg-pink-50 text-gray-950 hover:bg-pink-100",
                        day_today: "font-bold text-pink-500",
                        day_disabled:
                          "cursor-not-allowed text-gray-300 hover:bg-transparent",
                        day_outside: "text-gray-300",
                      }}
                    />
                    <div className="mt-3 flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
                      <button
                        type="button"
                        onClick={() => setDateRange(getDefaultBookingRange())}
                        className="text-sm font-semibold text-gray-700 underline underline-offset-2"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCalendar(false)}
                        className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowGuests((value) => !value);
                    setShowCalendar(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-300 p-4 text-left transition hover:border-gray-950"
                >
                  <span className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <span>
                      <span className="block text-sm uppercase text-gray-600">
                        Guests
                      </span>
                      <span className="block text-sm font-semibold text-gray-950">
                        {pluralize(bookingGuestCount, "guest")}
                        {guestSelection.infants > 0
                          ? `, ${pluralize(guestSelection.infants, "infant")}`
                          : ""}
                        {guestSelection.pets > 0
                          ? `, ${pluralize(guestSelection.pets, "pet")}`
                          : ""}
                      </span>
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-700 transition ${
                      showGuests ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showGuests && (
                  <div className="absolute left-0 right-0 top-full z-20 overflow-hidden rounded-b-2xl border border-t-0 border-gray-300 bg-white shadow-2xl">
                    {guestRows.map((row) => {
                      const minimum = row.key === "adults" ? 1 : 0;
                      const canDecrease = row.value > minimum;

                      return (
                        <div
                          key={row.key}
                          className="flex items-center justify-between gap-4 px-4 py-5"
                        >
                          <div>
                            <p className="font-semibold text-gray-950">
                              {row.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {row.subtitle}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              disabled={!canDecrease}
                              onClick={() => updateGuestCount(row.key, "decrease")}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xl leading-none text-gray-500 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-300"
                              aria-label={`Decrease ${row.title}`}
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-base text-gray-950">
                              {row.value}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateGuestCount(row.key, "increase")}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xl leading-none text-gray-700 transition hover:bg-gray-200"
                              aria-label={`Increase ${row.title}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={item.availability === false || isCreatingBooking}
                onClick={handleBookNow}
                className="mt-6 w-full rounded-lg bg-pink-500 px-6 py-4 text-sm font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {item.availability === false
                  ? "NOT AVAILABLE"
                  : isCreatingBooking
                    ? "CREATING BOOKING..."
                    : "BOOK NOW"}
              </button>
              {bookingError && (
                <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {bookingError}
                </p>
              )}
            </div>
          </aside>
        </div>

 

        <section className="mt-10 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-semibold text-gray-950">Map</h2>
          <div className="relative mt-4 h-[360px] overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
            {mapCoordinates ? (
              <iframe
                title={`${item.title} map`}
                src={getMapEmbedUrl(mapCoordinates.lat, mapCoordinates.lng)}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-100 text-gray-500">
                Location coordinates are not available.
              </div>
            )}
            <div className="absolute bottom-5 left-5 rounded-lg bg-white/95 px-4 py-3 shadow">
              <p className="text-sm font-semibold text-gray-950">
                {item.address || locationLabel}
              </p>
              {mapCoordinates && (
                <p className="mt-1 text-xs text-gray-600">
                  {mapCoordinates.lat.toFixed(6)}, {mapCoordinates.lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        </section>
               <div className="mt-10">
          <ReviewsSection rating={item.rating} reviewsCount={item.reviews_count} />
          {/* show all reviews  */}
          
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
