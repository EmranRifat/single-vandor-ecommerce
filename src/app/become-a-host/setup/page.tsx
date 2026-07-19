"use client";

import { Label, TimeField } from "@heroui/react";
import { parseTime, Time } from "@internationalized/date";
import {
  BedDouble,
  Building,
  CalendarDays,
  ChevronRight,
  Clock,
  Hotel,
  ImagePlus,
  LocateFixed,
  MapPin,
  Minus,
  Plus,
  X,
} from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useHostListing } from "@/lib/hooks/host/useHostListing";
import { useAuth } from "@/lib/auth-context";
import { HostListingPayload, HostListingSubmission } from "@/lib/types/types";

const propertyTypes = [
  {
    id: "apartment",
    label: "Apartment",
    Icon: Building,
  },
  {
    id: "home",
    label: "Room",
    Icon: BedDouble,
  },
  {
    id: "hotel",
    label: "Hotel",
    Icon: Hotel,
  },
];

const propertyCopy = {
  apartment: {
    titlePlaceholder: "Apartment title",
    rentPlaceholder: "Rent per night for StayNest guests (Taka)",
    bedroomLabel: "Bedroom",
    bedroomHint: "Total number of bedrooms",
  },
  room: {
    titlePlaceholder: "Room title",
    rentPlaceholder: "Rent per night for StayNest guests (Taka)",
    bedroomLabel: "Room",
    bedroomHint: "Total number of rooms",
  },
  hotel: {
    titlePlaceholder: "Hotel title",
    rentPlaceholder: "Average rent per night for StayNest guests",
    bedroomLabel: "Room",
    bedroomHint: "Total number of guest rooms",
  },
};

const facilityOptions = [
  { id: "wifi", label: "Wi-Fi" },
  { id: "ac", label: "AC" },
  { id: "parking", label: "Parking" },
  { id: "balcony", label: "Balcony" },
  { id: "attachWash", label: "Attach wash" },
  { id: "lift", label: "Lift" },
];

const defaultAvailabilityRange = () => {
  const from = new Date();
  from.setDate(from.getDate() + 1);

  const to = new Date(from);
  to.setDate(to.getDate() + 30);

  return { from, to };
};

const formatTimeValue = (time: Time) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2024, 0, 1, time.hour, time.minute));

const formatDate = (date?: Date) =>
  date?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const formatDateRange = (range?: DateRange) =>
  range?.from && range?.to
    ? `${range.from.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${range.to.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`
    : range?.from
      ? formatDate(range.from) || "Select available dates"
      : "Select available dates";

const formatSubmittedDate = (date: string | null) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not selected";

export type AvailabilitySelectionMode = "single" | "range";

export default function HostSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [photoPreviews, setPhotoPreviews] = useState<
    { id: string; url: string; name: string; file: File }[]
  >([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [suggestedAvailabilityRange] = useState<DateRange>(
    defaultAvailabilityRange,
  );

  const [availabilityRange, setAvailabilityRange] = useState<
    DateRange | undefined
  >(defaultAvailabilityRange);

  const [submittedData, setSubmittedData] =
    useState<HostListingSubmission | null>(null);

  const [form, setForm] = useState({
    title: "",
    rentPerNight: "",
    description: "",
    facilities: {} as Record<string, boolean>,
    kitchens: 0,
    checkInTime: parseTime("14:00"),
    checkOutTime: parseTime("11:00"),
    location: "Road 25, Banani",
    latitude: 23.7937,
    longitude: 90.4066,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
  });

  const selectedCopy =
    propertyCopy[selectedType as keyof typeof propertyCopy] ||
    propertyCopy.apartment;

  const handleFacilityToggle = (facility: string) => {
    setForm((current) => ({
      ...current,
      facilities: {
        ...current.facilities,
        [facility]: !current.facilities[facility],
      },
    }));
  };
  const availabilityLabel = formatDateRange(availabilityRange);
  const suggestionLabel = formatDateRange(suggestedAvailabilityRange);
  const availabilitySelectionMode: AvailabilitySelectionMode =
    availabilityRange?.from && !availabilityRange.to ? "single" : "range";

  const updateCounter = (
    key: "bedrooms" | "beds" | "bathrooms" | "kitchens",
    direction: "increase" | "decrease",
  ) => {
    setForm((current) => ({
      ...current,
      [key]:
        direction === "increase"
          ? current[key] + 1
          : Math.max(0, current[key] - 1),
    }));
  };

  const handleNext = () => {
    if (!selectedType) return;

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }
  };

  const { mutateAsync: createHostListing, isPending } = useHostListing();
  const { user } = useAuth();

  const token = Cookies.get("token") || "";

  const selectedFacilities = Object.entries(form.facilities)
    .filter(([, value]) => value)
    .map(
      ([key]) =>
        facilityOptions.find((option) => option.id === key)?.label || key,
    );

  const hostDetailsPreview = [
    {
      label: "Host",
      value: user ? `${user.name} (${user.email})` : "Not signed in",
    },
    { label: "Listing title", value: form.title || "Not provided" },
    { label: "Description", value: form.description || "Not provided" },
    { label: "Property type", value: selectedType || "Not selected" },
    { label: "Rent per night", value: form.rentPerNight || "Not provided" },
    { label: "Check in", value: formatTimeValue(form.checkInTime) },
    { label: "Check out", value: formatTimeValue(form.checkOutTime) },
    {
      label: "Available dates",
      value:
        availabilitySelectionMode === "single"
          ? formatSubmittedDate(availabilityRange?.from?.toISOString() || null)
          : `${formatSubmittedDate(availabilityRange?.from?.toISOString() || null)} - ${formatSubmittedDate(availabilityRange?.to?.toISOString() || null)}`,
    },
    { label: "Location", value: form.location },
    {
      label: "Coordinates",
      value: `${form.latitude.toFixed(4)}, ${form.longitude.toFixed(4)}`,
    },
    {
      label: "Facilities",
      value: selectedFacilities.length ? selectedFacilities.join(", ") : "None",
    },
    {
      label: "Rooms",
      value: `${form.bedrooms} bedrooms, ${form.beds} beds, ${form.bathrooms} bathrooms`,
    },
    {
      label: "Photos",
      value: photoFiles.length
        ? photoFiles.map((file) => file.name).join(", ")
        : "No photos added",
    },
  ];
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step !== 3) {
      handleNext();
      return;
    }

    if (!token) {
      toast.error("Unable to submit listing. Please sign in and try again.");
      console.error("Token missing");
      return;
    }

    if (photoFiles.length === 0) {
      toast.error("Please upload at least one photo before submitting.");
      console.error("Please upload at least one photo");
      return;
    }

    const payload: HostListingPayload = {
      propertyType: selectedType,
      title: form.title,
      rentPerNight: form.rentPerNight,
      checkIn: formatTimeValue(form.checkInTime),
      checkOut: formatTimeValue(form.checkOutTime),
      availabilitySelectionMode,
      availableFrom: availabilityRange?.from?.toISOString() || "",
      availableTo:
        availabilitySelectionMode === "single"
          ? availabilityRange?.from?.toISOString() || ""
          : availabilityRange?.to?.toISOString() || "",
      description: form.description || "",
      facilities: form.facilities || {},
      kitchens: form.kitchens || 0,
      latitude: form.latitude,
      longitude: form.longitude,
      location: form.location,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,

      // real files, not blob URLs
      photos: photoFiles,
    };

    try {
      const result = await createHostListing({ payload, token });

      toast.success("Host listing created successfully!", {
        autoClose: 2500,
        onClose: () => router.push("/become-a-host/success"),
      });
      console.log("Created listing:", result);

      setSubmittedData({
        propertyType: selectedType,
        title: form.title,
        rentPerNight: form.rentPerNight,
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
        availabilitySelectionMode,
        availableDate:
          availabilitySelectionMode === "single"
            ? availabilityRange?.from?.toISOString() || null
            : null,
        availableFrom:
          availabilitySelectionMode === "range"
            ? availabilityRange?.from?.toISOString() || null
            : null,
        availableTo:
          availabilitySelectionMode === "range"
            ? availabilityRange?.to?.toISOString() || null
            : null,
        suggestedAvailableFrom:
          suggestedAvailabilityRange.from?.toISOString() || null,
        suggestedAvailableTo:
          suggestedAvailabilityRange.to?.toISOString() || null,
        location: form.location,
        latitude: form.latitude,
        longitude: form.longitude,
        bedrooms: form.bedrooms,
        beds: form.beds,
        bathrooms: form.bathrooms,
        photos: photoFiles.map((file) => file.name),
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create host listing.";
      toast.error(message);
      console.error("Failed to create host listing", error);
    }
  };
  const handleBack = () => {
    if (step > 1) {
      setStep((current) => current - 1);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setForm((current) => ({
        ...current,
        location: "Current location",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    });
  };

  const createPreviewId = (file: File, index: number) => {
    const uuid =
      typeof crypto?.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

    return `${file.name}-${file.lastModified}-${index}-${uuid}`;
  };

  const handlePhotosChange = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const previews = fileArray.map((file, index) => ({
      id: createPreviewId(file, index),
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));

    setPhotoPreviews((current) => [...current, ...previews]);
    setPhotoFiles((current) => [...current, ...fileArray]);
  };

  const removePhoto = (id: string) => {
    setPhotoPreviews((current) => {
      const photo = current.find((item) => item.id === id);

      if (photo) {
        URL.revokeObjectURL(photo.url);
      }

      setPhotoFiles((currentFiles) =>
        currentFiles.filter((file) => file !== photo?.file),
      );

      return current.filter((item) => item.id !== id);
    });
  };

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  // Debounced geocoding: when the user types a location, look it up via
  // OpenStreetMap Nominatim and recenter the map. Only runs on step 3.
  useEffect(() => {
    if (step !== 3) return;

    const query = form.location.trim();
    if (query.length < 3) {
      setGeocodeError(null);
      return;
    }

    // Don't geocode the placeholder default
    if (query === "Road 25, Banani" || query === "Current location") return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsGeocoding(true);
      setGeocodeError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
            query,
          )}`,
          {
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`Geocoding failed (${response.status})`);
        }

        const results = (await response.json()) as Array<{
          lat: string;
          lon: string;
          display_name: string;
        }>;

        if (results.length === 0) {
          setGeocodeError("No matching location found");
          return;
        }

        const match = results[0];
        const nextLat = Number.parseFloat(match.lat);
        const nextLon = Number.parseFloat(match.lon);

        if (Number.isNaN(nextLat) || Number.isNaN(nextLon)) {
          setGeocodeError("Invalid coordinates returned");
          return;
        }

        setForm((current) => ({
          ...current,
          latitude: nextLat,
          longitude: nextLon,
          location: match.display_name || current.location,
        }));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        const message =
          error instanceof Error ? error.message : "Geocoding failed";
        setGeocodeError(message);
        console.error("Geocoding error:", error);
      } finally {
        setIsGeocoding(false);
      }
    }, 800);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [form.location, step]);

  const mapDelta = 0.008;
  const mapBbox = [
    form.longitude - mapDelta,
    form.latitude - mapDelta,
    form.longitude + mapDelta,
    form.latitude + mapDelta,
  ].join(",");
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBbox}&layer=mapnik&marker=${form.latitude},${form.longitude}`;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-white text-gray-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {" "}
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl flex-col px-4 sm:px-6"
      >
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800 mt-2">
          <div
            className={`h-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 transition-all duration-500 ${
              step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"
            } dark:from-pink-500 dark:via-fuchsia-500 dark:to-violet-500`}
          />
        </div>

        {step === 1 ? (
          <section className="flex w-full max-w-4xl flex-1 flex-col pb-28 pt-8 sm:pt-12">
            <p className="text-sm font-semibold text-pink-500 dark:text-pink-400">
              Step 1 of 3
            </p>

            <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-normal text-gray-950 dark:text-white sm:text-4xl">
              Which of these best describes your property?
            </h1>

            <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
              {propertyTypes.map(({ id, label, Icon }) => {
                const isSelected = selectedType === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedType(id)}
                    className={`flex min-h-[150px] flex-col items-center justify-center gap-5 rounded-lg border p-5 text-center transition-all duration-300 ${
                      isSelected
                        ? "border-pink-500 bg-pink-50 shadow-sm ring-2 ring-pink-100 dark:bg-pink-500/10 dark:ring-pink-500/30"
                        : "border-gray-300 bg-gray-50 hover:border-pink-500 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-pink-500 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200 dark:bg-slate-800 dark:ring-slate-600">
                      <Icon className="h-8 w-8 text-gray-950 dark:text-white" />
                    </span>

                    <span className="text-sm font-bold text-gray-950 dark:text-white">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : step === 2 ? (
          <section className="mx-auto w-full max-w-3xl flex-1 pb-32 pt-8 sm:pt-12">
            <p className="text-sm font-semibold text-pink-500">Step 2 of 3</p>
            <h1 className="mt-3 text-3xl font-bold tracking-normal text-gray-950 sm:text-4xl">
              Create Listing - Details
            </h1>

            <div className="mt-7 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-bold text-gray-950">Property photos</p>
              <p className="mt-1 text-sm text-gray-500">
                Add multiple images. You can remove any image before continuing.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <label className="flex aspect-square min-h-28 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed border-pink-300 bg-white text-pink-500 transition hover:bg-pink-50">
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-sm font-semibold">Add Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      handlePhotosChange(event.target.files);
                      event.target.value = "";
                    }}
                  />
                </label>

                {photoPreviews.map((preview) => (
                  <div
                    key={preview.id}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200"
                  >
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(preview.id)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-gray-950 shadow-sm transition hover:bg-white"
                      aria-label={`Remove ${preview.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-800">
                    Listing title
                  </span>
                  <input
                    required
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                    placeholder={selectedCopy.titlePlaceholder}
                    className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm font-medium outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-800">
                    Rent per night (TK)
                  </span>
                  <input
                    required
                    inputMode="decimal"
                    value={form.rentPerNight}
                    onChange={(event) =>
                      setForm({ ...form, rentPerNight: event.target.value })
                    }
                    placeholder={selectedCopy.rentPlaceholder}
                    className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm font-medium outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-800">
                    Description
                  </span>
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                    placeholder="Describe your property features"
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100"
                  />
                </label>

                <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-bold text-gray-950">Facilities</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {facilityOptions.map((option) => (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 transition hover:border-gray-300"
                      >
                        <input
                          type="checkbox"
                          checked={!!form.facilities[option.id]}
                          onChange={() => handleFacilityToggle(option.id)}
                          className="h-4 w-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  {[
                    {
                      title: "Check In",
                      name: "checkInTime",
                      value: form.checkInTime,
                    },
                    {
                      title: "Check Out",
                      name: "checkOutTime",
                      value: form.checkOutTime,
                    },
                  ].map((timeField) => (
                    <div
                      key={timeField.name}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                      <TimeField
                        className="w-full"
                        name={timeField.name}
                        onChange={(value) => {
                          if (!value) return;

                          setForm((current) => ({
                            ...current,
                            [timeField.name]: value,
                          }));
                        }}
                        granularity="minute"
                        hourCycle={12}
                      >
                        <Label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-gray-600">
                          <Clock className="h-4 w-4 text-pink-500" />
                          {timeField.title}
                        </Label>
                        <TimeField.Group className="flex h-12 w-full items-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-bold text-gray-950 transition focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-100">
                          <TimeField.Input className="flex w-full items-center gap-0.5">
                            {(segment) => (
                              <TimeField.Segment
                                segment={segment}
                                className="rounded-md px-1.5 py-1 outline-none data-[focused]:bg-pink-50 data-[focused]:text-pink-600"
                              />
                            )}
                          </TimeField.Input>
                        </TimeField.Group>
                      </TimeField>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <CalendarDays className="h-4 w-4 text-teal-600" />
                    Available dates
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {availabilityLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAvailabilityRange(undefined);
                  }}
                  className="self-start rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 sm:self-auto"
                >
                  Clear
                </button>
              </div>

              {/* <div className="mt-3 flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Default available dates
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {suggestionLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAvailabilityRange({
                      from: suggestedAvailabilityRange.from,
                      to: suggestedAvailabilityRange.to,
                    });
                  }}
                  className="self-start rounded-lg border border-teal-100 bg-white px-3 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-50 sm:self-auto"
                >
                  Reset default
                </button>
              </div> */}

              <div className="mt-3 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                <DayPicker
                  mode="range"
                  selected={availabilityRange}
                  onSelect={setAvailabilityRange}
                  numberOfMonths={1}
                  disabled={{ before: new Date() }}
                  modifiers={{
                    suggested: suggestedAvailabilityRange,
                  }}
                  modifiersClassNames={{
                    suggested: "bg-teal-50 text-slate-700",
                  }}
                  classNames={{
                    months: "flex w-full",
                    month: "w-full space-y-2",
                    caption:
                      "relative flex items-center justify-center py-1 text-xs font-bold text-slate-700",
                    nav: "absolute left-0 right-0 top-1 flex items-center justify-between",
                    nav_button:
                      "flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100",
                    table: "w-full border-collapse",
                    head_row: "grid grid-cols-7",
                    head_cell:
                      "flex h-7 items-center justify-center text-[11px] font-bold text-slate-500",
                    row: "grid grid-cols-7",
                    cell: "p-1 text-center",
                    day: "flex h-10 w-full items-center justify-center rounded-lg text-xs font-semibold text-slate-700 transition hover:bg-white sm:h-11",
                    day_selected:
                      "bg-teal-600 text-white hover:bg-teal-600 hover:text-white",
                    day_range_middle:
                      "bg-teal-100 text-slate-700 hover:bg-teal-100",
                    day_today: "font-bold text-teal-700",
                    day_disabled:
                      "cursor-not-allowed text-slate-300 hover:bg-transparent",
                    day_outside: "text-slate-300",
                  }}
                />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {[
                  {
                    key: "bedrooms" as const,
                    label: selectedCopy.bedroomLabel,
                    hint: selectedCopy.bedroomHint,
                    value: form.bedrooms,
                  },
                  {
                    key: "beds" as const,
                    label: "Beds",
                    hint: "Total number of beds",
                    value: form.beds,
                  },
                  {
                    key: "kitchens" as const,
                    label: "Kitchen",
                    hint: "Total number of kitchens",
                    value: form.kitchens,
                  },
                  {
                    key: "bathrooms" as const,
                    label: "Bathroom",
                    hint: "Total number of bathroom",
                    value: form.bathrooms,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-base font-bold text-gray-950 dark:text-white">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                        {item.hint}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateCounter(item.key, "decrease")}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-900 text-gray-950 disabled:border-gray-300 disabled:text-gray-300"
                        disabled={item.value === 0}
                        aria-label={`Decrease ${item.label}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-xl font-bold">
                        {item.key === "bathrooms"
                          ? item.value.toFixed(1)
                          : item.value}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCounter(item.key, "increase")}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-900 text-gray-950"
                        aria-label={`Increase ${item.label}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="mx-auto w-full max-w-3xl flex-1 pb-32 pt-8 sm:pt-12">
            <p className="text-sm font-semibold text-pink-500">Step 3 of 3</p>
            <h1 className="mt-3 text-3xl font-bold tracking-normal text-gray-950 sm:text-4xl">
              Pick Location
            </h1>

            <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_180px]">
              <label className="block">
                <span className="sr-only">Property location</span>
                <div className="relative">
                  <input
                    required
                    value={form.location}
                    onChange={(event) =>
                      setForm({ ...form, location: event.target.value })
                    }
                    placeholder="Road 25, Banani"
                    className="h-14 w-full border-b border-gray-300 bg-transparent px-1 pr-8 text-xl font-medium outline-none transition placeholder:text-gray-400 focus:border-pink-500"
                  />
                  {isGeocoding ? (
                    <span
                      aria-label="Searching location"
                      className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2"
                    >
                      <span className="block h-4 w-4 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500" />
                    </span>
                  ) : null}
                </div>
                {geocodeError ? (
                  <p className="mt-1 text-xs text-red-500">{geocodeError}</p>
                ) : null}
              </label>

              <button
                type="button"
                onClick={handleUseMyLocation}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-pink-500 px-6 text-sm font-bold text-white transition hover:bg-pink-600"
              >
                <LocateFixed className="h-5 w-5" />
                My Location
              </button>
            </div>

            <div className="relative mt-6 h-[520px] overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
              <iframe
                title="Selected property location"
                src={mapUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center text-pink-500">
                <MapPin className="h-12 w-12 fill-pink-500 text-pink-500 drop-shadow" />
              </div>
              <div className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] rounded-lg bg-white/95 px-4 py-3 text-sm font-semibold text-gray-950 shadow">
                {form.location}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
              <div>
                <p className="text-sm font-bold text-gray-950">Host Summary </p>
                <p className="mt-1 text-sm text-gray-500">
                  Preview your listing before submitting.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {hostDetailsPreview.map((detail) => (
                  <div
                    key={detail.label}
                    className={`rounded-xl border border-gray-200 bg-gray-50 p-3 ${
                      detail.label === "Host" || detail.label === "Description"
                        ? "sm:col-span-2"
                        : ""
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                      {detail.label}
                    </p>
                    <p className="mt-1 text-sm text-gray-800">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <footer className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white/95 backdrop-blur-md transition-colors duration-300 dark:border-slate-700 dark:bg-slate-950/95">
          <div className="mx-auto flex h-24 max-w-5xl items-center justify-between px-4 sm:px-6">
            {step === 1 ? (
              <Link
                href="/become-a-host"
                className="text-sm font-semibold text-gray-700 underline underline-offset-4 transition hover:text-gray-950 dark:text-slate-300 dark:hover:text-white"
              >
                Back
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="text-sm font-semibold text-gray-700 underline underline-offset-4 transition hover:text-gray-950 dark:text-slate-300 dark:hover:text-white"
              >
                Back
              </button>
            )}

            <button
              type={step === 1 ? "button" : "submit"}
              disabled={!selectedType || isPending}
              onClick={step === 1 ? handleNext : undefined}
              className="inline-flex h-14 min-w-36 items-center justify-center gap-2 rounded-lg bg-pink-500 px-8 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-pink-500/40 disabled:cursor-not-allowed disabled:bg-gray-300 dark:shadow-pink-900/30 dark:disabled:bg-slate-700"
            >
              {step === 3 ? "Submit" : "Next"}
              {step !== 3 && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </footer>
      </form>
      <ToastContainer position="top-right" autoClose={5000} />
    </main>
  );
}
