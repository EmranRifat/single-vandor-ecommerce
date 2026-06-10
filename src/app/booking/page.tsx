"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
  Star,
  Tag,
  User,
  Users,
} from "lucide-react";
import type { RootState } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { useProductDetails } from "@/lib/hooks/product/useProductDetails";
import { createManualBooking, initSslCommerzPayment } from "@/lib/queries";
import type { SslPaymentInitData } from "@/lib/types/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fallbackListing = {
  id: "demo-booking",
  title: "[VEONE-Quill] Twin Towers Business District Subway Exit Infinity Pool",
  image:
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
  price_per_night: 52.94,
  currency: "USD",
  rating: 4.92,
  reviews_count: 36,
  host_name: "VEONE",
  is_superhost: true,
  city: "Kuala Lumpur",
  country: "Malaysia",
};

const toDateInputValue = (date: Date) => date.toISOString().slice(0, 10);

const getDateFromParam = (value: string | null, fallbackDays: number) => {
  if (value) {
    const parsed = new Date(value);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const date = new Date();
  date.setDate(date.getDate() + fallbackDays);
  return date;
};

const getNights = (checkIn: Date, checkOut: Date) => {
  const diff = Math.round(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  return Math.max(1, diff);
};

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

const formatDisplayDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

const getGuestsLabel = (adults: number, children: number) => {
  const total = adults + children;
  return `${total} ${total === 1 ? "guest" : "guests"}`;
};

const paymentLogoPaths = {
  bkash: "/assets/logo/Bkash-logo.png",
  nagad: "/assets/logo/Nagad-Logo.wine.svg",
  otherMethods: "/assets/logo/payment-method.png",
  card: "/assets/logo/realistic-credit-card-design_23-2149126093.avif",
  visa: "/assets/logo/Visa.png",
};

const sslCommerzOptions = [
  "Visa",
  "Mastercard",
  "Amex",
  "Nagad",
  "Rocket",
  "Upay",
  "Bank",
];

const getSslGatewayUrl = (result: {
  data?: SslPaymentInitData;
  GatewayPageURL?: string;
  gateway_url?: string;
  redirect_url?: string;
}) =>
  result.GatewayPageURL ||
  result.gateway_url ||
  result.redirect_url ||
  result.data?.GatewayPageURL ||
  result.data?.gateway_url ||
  result.data?.redirect_url ||
  "";

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

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const listingId = searchParams.get("id") || "";
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { data } = useProductDetails({ id: listingId });

  const firstCartItem = cartItems[0];
  const listing = data?.data
    ? data.data
    : firstCartItem
      ? {
          ...fallbackListing,
          id: firstCartItem.product.id,
          title: firstCartItem.product.name,
          image: firstCartItem.product.image,
          price_per_night: firstCartItem.product.price,
          rating: 4.92,
          reviews_count: 36,
        }
      : fallbackListing;

  const [checkIn, setCheckIn] = useState(() =>
    getDateFromParam(searchParams.get("checkIn"), 2)
  );
  const [checkOut, setCheckOut] = useState(() =>
    getDateFromParam(searchParams.get("checkOut"), 4)
  );
  const [adults, setAdults] = useState(() =>
    Math.max(1, Number(searchParams.get("adults")) || 1)
  );
  const [children, setChildren] = useState(() =>
    Math.max(0, Number(searchParams.get("children")) || 0)
  );
  const [paymentMethod, setPaymentMethod] = useState("manual");
  const [showTripEditor, setShowTripEditor] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [billing, setBilling] = useState({
    cardNumber: "",
    expiration: "",
    cvv: "",
    street: "",
    suite: "",
    city: "",
    state: "",
    zip: "",
    country: "Bangladesh",
  });
  const [sslCustomer, setSslCustomer] = useState({
    bookingId: searchParams.get("bookingId") || "",
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    customerPhone: "",
  });
  const [bkashDetails, setBkashDetails] = useState({
    mobileNumber: "",
    transactionId: "",
  });

  const pricing = useMemo(() => {
    const nights = getNights(checkIn, checkOut);
    const nightlyTotal = Number(listing.price_per_night || 0) * nights;
    const discount = Number((nightlyTotal * 0.15).toFixed(2));
    const taxes = Number(((nightlyTotal - discount) * 0.055).toFixed(2));
    const total = Number((nightlyTotal - discount + taxes).toFixed(2));

    return { nights, nightlyTotal, discount, taxes, total };
  }, [checkIn, checkOut, listing.price_per_night]);

  const currency = listing.currency || "USD";

  useEffect(() => {
    if (!user) return;

    setSslCustomer((prev) => ({
      ...prev,
      customerName: prev.customerName || user.name,
      customerEmail: prev.customerEmail || user.email,
    }));
  }, [user]);

  const handleCheckInChange = (value: string) => {
    const nextCheckIn = new Date(value);
    const currentNights = pricing.nights;
    const nextCheckOut = new Date(nextCheckIn);
    nextCheckOut.setDate(nextCheckIn.getDate() + currentNights);
    setCheckIn(nextCheckIn);
    setCheckOut(nextCheckOut);
  };

  const handleCheckOutChange = (value: string) => {
    const nextCheckOut = new Date(value);

    if (nextCheckOut <= checkIn) {
      nextCheckOut.setDate(checkIn.getDate() + 1);
    }

    setCheckOut(nextCheckOut);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!acceptedTerms) return;

    if (paymentMethod === "sslcommerz") {
      try {
        setSubmitError("");
        setIsSubmitting(true);
        let bookingId = Number(sslCustomer.bookingId);

        if (!bookingId || Number.isNaN(bookingId)) {
          const bookingResponse = await createManualBooking({
            listing_id: String(listing.id),
            payment_method: "sslcommerz",
            check_in: toDateInputValue(checkIn),
            check_out: toDateInputValue(checkOut),
            adults,
            children,
            total_amount: pricing.total,
            currency,
            billing_address: {
              street: billing.street,
              city: billing.city,
              zip: billing.zip,
              country: billing.country,
            },
            terms_accepted: acceptedTerms,
          });

          bookingId = getCreatedBookingId(bookingResponse) || 0;

          if (bookingId) {
            setSslCustomer((prev) => ({
              ...prev,
              bookingId: String(bookingId),
            }));
          }
        }

        if (!bookingId || Number.isNaN(bookingId)) {
          throw new Error(
            "Booking was created, but the booking ID was not returned.",
          );
        }

        const sslPayload = {
          booking_id: bookingId,
          customer_name: sslCustomer.customerName.trim(),
          customer_email: sslCustomer.customerEmail.trim(),
          customer_phone: sslCustomer.customerPhone.trim(),
        };
        const response = await initSslCommerzPayment(sslPayload);
        const gatewayUrl = getSslGatewayUrl(response);

        if (!gatewayUrl) {
          throw new Error("Payment gateway URL was not returned by the server.");
        }

        toast.info("Redirecting to SSLCommerz secure payment...");
        window.location.href = gatewayUrl;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to start SSLCommerz payment";

        setSubmitError(message);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (paymentMethod === "bkash") {
      try {
        setSubmitError("");
        setIsSubmitting(true);
        let bookingId = Number(sslCustomer.bookingId);

        if (!bookingId || Number.isNaN(bookingId)) {
          const bookingResponse = await createManualBooking({
            listing_id: String(listing.id),
            payment_method: "bkash",
            check_in: toDateInputValue(checkIn),
            check_out: toDateInputValue(checkOut),
            adults,
            children,
            total_amount: pricing.total,
            currency,
            billing_address: {
              street: billing.street,
              city: billing.city,
              zip: billing.zip,
              country: billing.country,
            },
            terms_accepted: acceptedTerms,
          });

          bookingId = getCreatedBookingId(bookingResponse) || 0;

          if (bookingId) {
            setSslCustomer((prev) => ({
              ...prev,
              bookingId: String(bookingId),
            }));
          }
        }

        if (!bookingId || Number.isNaN(bookingId)) {
          throw new Error(
            "Booking was created, but the booking ID was not returned.",
          );
        }

        toast.success("Booking submitted with bKash payment selected");
        setSubmitted(true);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to submit bKash booking";

        setSubmitError(message);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    const manualBookingPayload = {
      listing_id: String(listing.id),
      payment_method: "manual" as const,
      check_in: toDateInputValue(checkIn),
      check_out: toDateInputValue(checkOut),
      adults,
      children,
      total_amount: pricing.total,
      currency,
      billing_address: {
        street: billing.street,
        city: billing.city,
        zip: billing.zip,
        country: billing.country,
      },
      card_last4: billing.cardNumber.replace(/\D/g, "").slice(-4),
      card_expiration: billing.expiration,
      terms_accepted: acceptedTerms,
    };

    try { 
      setSubmitError("");
      setIsSubmitting(true);
      console.log("Manual booking payload", manualBookingPayload);
      const response = await createManualBooking(manualBookingPayload);
      toast.success(response.message || "Booking created successfully with manual payment");
      setSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create booking";

      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-white px-4 py-12 text-gray-950">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          <h1 className="mt-6 text-3xl font-semibold">Booking confirmed</h1>
          <p className="mt-3 text-gray-600">
            Your payment details were accepted for {listing.title}. Total paid:{" "}
            <span className="font-semibold text-gray-950">
              {formatCurrency(pricing.total, currency)}
            </span>
            .
          </p>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="mt-8 rounded-lg bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Browse more stays
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            Confirm and pay
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start"
        >
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-8">
            <h2 className="text-xl font-semibold">1. Add a payment method</h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <label
                className={`flex min-h-[92px] cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                  paymentMethod === "manual"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 hover:border-pink-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "manual"}
                  onChange={() => setPaymentMethod("manual")}
                  className="h-4 w-4 shrink-0 accent-pink-600"
                />
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white shadow-sm">
                    <img
                      src={paymentLogoPaths.card}
                      alt="Card"
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span>
                    <span className="block font-semibold">Manual card</span>
                    <span className="mt-1 block text-xs text-gray-500">
                      Enter card details
                    </span>
                  </span>
                </span>
              </label>

              <label
                className={`flex min-h-[92px] cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                  paymentMethod === "bkash"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 hover:border-pink-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bkash"}
                  onChange={() => setPaymentMethod("bkash")}
                  className="h-4 w-4 shrink-0 accent-pink-600"
                />
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-14 w-28 shrink-0 items-center justify-center rounded-md bg-white p-2 shadow-sm">
                    <img
                      src={paymentLogoPaths.bkash}
                      alt="bKash"
                      className="max-h-full max-w-full object-contain"
                    />
                  </span>
                  <span className="font-semibold">bKash Payment</span>
                </span>
              </label>

              <label
                className={`flex min-h-[92px] cursor-pointer items-center gap-4 rounded-lg border p-4 transition sm:col-span-2 ${
                  paymentMethod === "sslcommerz"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 hover:border-pink-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "sslcommerz"}
                  onChange={() => setPaymentMethod("sslcommerz")}
                  className="h-4 w-4 shrink-0 accent-pink-600"
                />
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-2 shadow-sm">
                    <img
                      src={paymentLogoPaths.otherMethods}
                      alt="Other payment methods"
                      className="max-h-full max-w-full object-contain"
                    />
                  </span>
                  <span>
                    <span className="block font-semibold">
                      Other payment methods
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      SSLCommerz cards and mobile banking
                    </span>
                  </span>
                </span>
              </label>
            </div>

            {paymentMethod === "manual" ? (
              <div className="mt-4">
                <div className="overflow-hidden rounded-lg border border-gray-400">
                  <input
                    required
                    inputMode="numeric"
                    value={billing.cardNumber}
                    onChange={(event) =>
                      setBilling({ ...billing, cardNumber: event.target.value })
                    }
                    placeholder="Card number"
                    className="h-14 w-full border-b border-gray-300 px-4 outline-none focus:bg-gray-50"
                  />
                  <div className="grid grid-cols-2 divide-x divide-gray-300">
                    <input
                      required
                      value={billing.expiration}
                      onChange={(event) =>
                        setBilling({
                          ...billing,
                          expiration: event.target.value,
                        })
                      }
                      placeholder="Expiration"
                      className="h-14 px-4 outline-none focus:bg-gray-50"
                    />
                    <input
                      required
                      inputMode="numeric"
                      value={billing.cvv}
                      onChange={(event) =>
                        setBilling({ ...billing, cvv: event.target.value })
                      }
                      placeholder="CVV"
                      className="h-14 px-4 outline-none focus:bg-gray-50"
                    />
                  </div>
                </div>

                <h3 className="mt-4 font-semibold">Billing address</h3>
                <div className="mt-3 overflow-hidden rounded-lg border border-gray-400">
                  {[
                    ["street", "Street address"],
                    ["suite", "Apt or suite number"],
                    ["city", "City"],
                  ].map(([key, placeholder]) => (
                    <input
                      key={key}
                      required={key !== "suite"}
                      value={billing[key as keyof typeof billing]}
                      onChange={(event) =>
                        setBilling({ ...billing, [key]: event.target.value })
                      }
                      placeholder={placeholder}
                      className="h-[60px] w-full border-b border-gray-300 px-4 outline-none focus:bg-gray-50"
                    />
                  ))}
                  <div className="grid grid-cols-2 divide-x divide-gray-300">
                    <input
                      required
                      value={billing.state}
                      onChange={(event) =>
                        setBilling({ ...billing, state: event.target.value })
                      }
                      placeholder="State"
                      className="h-[60px] border-b border-gray-300 px-4 outline-none focus:bg-gray-50"
                    />
                    <input
                      required
                      value={billing.zip}
                      onChange={(event) =>
                        setBilling({ ...billing, zip: event.target.value })
                      }
                      placeholder="ZIP code"
                      className="h-[60px] border-b border-gray-300 px-4 outline-none focus:bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    className="flex h-[60px] w-full items-center justify-between px-4 text-left"
                  >
                    <span>
                      <span className="block text-xs text-gray-500">
                        Country/region
                      </span>
                      <span className="block font-medium">
                        {billing.country}
                      </span>
                    </span>
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : paymentMethod === "bkash" ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-pink-100 bg-pink-50 p-4 text-sm text-pink-950">
                  <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-pink-600" />
                  <div>
                    <p className="font-semibold">Submit booking with bKash</p>
                    <p className="mt-1">
                      Add the bKash number and transaction reference used for
                      this booking.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-950">
                    bKash payment details
                  </h3>
                  <div className="mt-4 space-y-3">
                    <label className="block text-sm font-semibold text-gray-800">
                      <span className="mb-1.5 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        bKash mobile number
                      </span>
                      <input
                        required
                        type="tel"
                        inputMode="tel"
                        value={bkashDetails.mobileNumber}
                        onChange={(event) =>
                          setBkashDetails({
                            ...bkashDetails,
                            mobileNumber: event.target.value,
                          })
                        }
                        placeholder="01712345678"
                        className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-gray-800">
                      <span className="mb-1.5 block text-xs font-normal text-gray-500">
                        Transaction ID
                      </span>
                      <input
                        required
                        type="text"
                        value={bkashDetails.transactionId}
                        onChange={(event) =>
                          setBkashDetails({
                            ...bkashDetails,
                            transactionId: event.target.value,
                          })
                        }
                        placeholder="bKash transaction ID"
                        className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-950">
                      Pay securely with SSLCommerz
                    </p>
                    <p className="mt-1 text-sm text-emerald-900/80">
                      After you confirm, you will be redirected to SSLCommerz to
                      complete payment with card or mobile banking.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Supported payment options
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="flex h-11 w-20 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white p-2">
                      <img
                        src={paymentLogoPaths.visa}
                        alt="Visa"
                        className="max-h-full max-w-full object-contain"
                      />
                    </span>
                    <span className="flex h-11 w-20 items-center justify-center rounded-md border border-gray-200 bg-white px-2">
                      <img
                        src={paymentLogoPaths.nagad}
                        alt="Nagad"
                        className="max-h-full max-w-full object-contain"
                      />
                    </span>
                    {sslCommerzOptions
                      .filter((option) => !["Nagad", "Visa"].includes(option))
                      .map((option) => (
                        <span
                          key={option}
                          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700"
                        >
                          {option}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-950">
                    Customer details for payment
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Required by SSLCommerz before redirecting to the gateway.
                  </p>

                  <div className="mt-4 space-y-3">
                    <label className="block text-sm font-semibold text-gray-800">
                      <span className="mb-1.5 block text-xs font-normal text-gray-500">
                        Booking ID
                      </span>
                      <input
                        type="number"
                        min={1}
                        inputMode="numeric"
                        value={sslCustomer.bookingId}
                        onChange={(event) =>
                          setSslCustomer({
                            ...sslCustomer,
                            bookingId: event.target.value,
                          })
                        }
                        placeholder="Auto-generated if empty"
                        className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      />
                      <span className="mt-1 block text-xs text-gray-500">
                        Enter an existing exact booking ID, or leave empty to
                        create one for this order.
                      </span>
                    </label>

                    <label className="block text-sm font-semibold text-gray-800">
                      <span className="mb-1.5 flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        Full name
                      </span>
                      <input
                        required
                        type="text"
                        value={sslCustomer.customerName}
                        onChange={(event) =>
                          setSslCustomer({
                            ...sslCustomer,
                            customerName: event.target.value,
                          })
                        }
                        placeholder="Emran Hasan"
                        className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-gray-800">
                      <span className="mb-1.5 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        Email
                      </span>
                      <input
                        required
                        type="email"
                        value={sslCustomer.customerEmail}
                        onChange={(event) =>
                          setSslCustomer({
                            ...sslCustomer,
                            customerEmail: event.target.value,
                          })
                        }
                        placeholder="emran@example.com"
                        className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-gray-800">
                      <span className="mb-1.5 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        Mobile number
                      </span>
                      <input
                        required
                        type="tel"
                        inputMode="tel"
                        value={sslCustomer.customerPhone}
                        onChange={(event) =>
                          setSslCustomer({
                            ...sslCustomer,
                            customerPhone: event.target.value,
                          })
                        }
                        placeholder="01712345678"
                        className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      />
                      <span className="mt-1 block text-xs text-gray-500">
                        Bangladesh mobile format (11 digits).
                      </span>
                    </label>
                  </div>
                </div>

              </div>
            )}

            <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-gray-950"
              />
              <span>
                I agree to the{" "}
                <a
                  href="/terms"
                  className="font-semibold text-gray-950 underline underline-offset-2"
                >
                  terms and conditions
                </a>{" "}
                and understand the booking cancellation policy.
              </span>
            </label>

            {submitError && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={!acceptedTerms || isSubmitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              <LockKeyhole className="h-4 w-4" />
              {isSubmitting
                ? paymentMethod === "sslcommerz"
                  ? "Connecting to SSLCommerz..."
                  : paymentMethod === "bkash"
                    ? "Submitting bKash booking..."
                    : "Creating booking..."
                : paymentMethod === "bkash"
                  ? `Submit bKash booking ${formatCurrency(pricing.total, currency)}`
                  : paymentMethod === "sslcommerz"
                    ? `Pay ${formatCurrency(pricing.total, currency)} with SSLCommerz`
                    : `Confirm and pay ${formatCurrency(pricing.total, currency)}`}
            </button>
          </section>

          <aside className="space-y-6 lg:sticky lg:top-8">
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <div className="flex gap-4">
                <div className="h-[102px] w-[102px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="line-clamp-3 text-lg font-semibold leading-snug">
                    {listing.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-gray-950" />
                      {Number(listing.rating || 0).toFixed(2)} (
                      {listing.reviews_count})
                    </span>
                    {listing.is_superhost && (
                      <span className="flex items-center gap-1">
                        <BadgeCheck className="h-4 w-4" />
                        Superhost
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-5 border-b border-gray-200 pb-4 text-sm leading-5 text-gray-700">
                Cancel before check-in on {formatDisplayDate(checkIn)} for a
                partial refund.{" "}
                <button
                  type="button"
                  className="font-semibold underline underline-offset-2"
                >
                  Full policy
                </button>
              </p>

              <div className="divide-y divide-gray-200">
                <div className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-semibold">Dates</span>
                    <button
                      type="button"
                      onClick={() => setShowTripEditor((value) => !value)}
                      className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold transition hover:bg-gray-200"
                    >
                      Change
                    </button>
                  </div>
                  <p className="mt-1 text-sm">
                    {formatDisplayDate(checkIn)} - {formatDisplayDate(checkOut)}
                  </p>
                </div>

                <div className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-semibold">Guests</span>
                    <button
                      type="button"
                      onClick={() => setShowTripEditor((value) => !value)}
                      className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold transition hover:bg-gray-200"
                    >
                      Change
                    </button>
                  </div>
                  <p className="mt-1 text-sm">{getGuestsLabel(adults, children)}</p>
                </div>

                <div className="py-4">
                  <span className="font-semibold">Booking ID</span>
                  <p className="mt-1 text-sm">
                    {sslCustomer.bookingId
                      ? `#${sslCustomer.bookingId}`
                      : paymentMethod === "sslcommerz"
                        ? "Will be generated for this order"
                        : "Created after confirmation"}
                  </p>
                </div>
              </div>

              {showTripEditor && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <label className="text-sm font-semibold">
                      <span className="mb-1 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Check in
                      </span>
                      <input
                        type="date"
                        value={toDateInputValue(checkIn)}
                        onChange={(event) =>
                          handleCheckInChange(event.target.value)
                        }
                        className="h-11 w-full rounded-lg border border-gray-300 px-3 font-normal"
                      />
                    </label>
                    <label className="text-sm font-semibold">
                      <span className="mb-1 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Check out
                      </span>
                      <input
                        type="date"
                        value={toDateInputValue(checkOut)}
                        onChange={(event) =>
                          handleCheckOutChange(event.target.value)
                        }
                        className="h-11 w-full rounded-lg border border-gray-300 px-3 font-normal"
                      />
                    </label>
                  </div>

                  <div className="mt-4 space-y-3">
                    {[
                      ["Adults", adults, setAdults, 1],
                      ["Children", children, setChildren, 0],
                    ].map(([label, value, setter, minimum]) => (
                      <div
                        key={label as string}
                        className="flex items-center justify-between gap-4"
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <Users className="h-4 w-4" />
                          {label as string}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              (setter as Dispatch<SetStateAction<number>>)(
                                Math.max(
                                  minimum as number,
                                  (value as number) - 1
                                )
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow-sm"
                          >
                            -
                          </button>
                          <span className="w-5 text-center">{value as number}</span>
                          <button
                            type="button"
                            onClick={() =>
                              (setter as Dispatch<SetStateAction<number>>)(
                                (value as number) + 1
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-b border-gray-200 py-5">
                <h3 className="font-semibold">Price details</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span>
                      {pricing.nights} {pricing.nights === 1 ? "night" : "nights"} x {" "}
                      {formatCurrency(Number(listing.price_per_night || 0), currency)}
                    </span>
                    <span>{formatCurrency(pricing.nightlyTotal, currency)}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-emerald-700">
                    <span>Special offer</span>
                    <span>-{formatCurrency(pricing.discount, currency)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Taxes</span>
                    <span>{formatCurrency(pricing.taxes, currency)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-4 py-5 font-bold">
                <span>Total {currency}</span>
                <span>{formatCurrency(pricing.total, currency)}</span>
              </div>
              <button
                type="button"
                className="text-sm font-semibold underline underline-offset-2"
              >
                Price breakdown
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 rounded-xl bg-emerald-50 px-5 py-4 font-semibold text-emerald-950">
              <Tag className="h-5 w-5 text-emerald-600" />
              {formatCurrency(pricing.discount, currency)} discount applied
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white px-4 py-12 text-gray-950">
          <div className="mx-auto max-w-6xl">
            <div className="h-10 w-72 animate-pulse rounded bg-gray-100" />
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
              <div className="h-[620px] animate-pulse rounded-3xl bg-gray-100" />
              <div className="h-[520px] animate-pulse rounded-3xl bg-gray-100" />
            </div>
          </div>
        </main>
      }
    >
      <BookingContent />
      <ToastContainer />
    </Suspense>
  );
}
