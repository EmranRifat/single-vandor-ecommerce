import { useMutation } from "@tanstack/react-query";

export type HostListingPayload = {
  availabilitySelectionMode: "single" | "range";
  availableFrom: string;
  availableTo: string;
  bathrooms: number;
  bedrooms: number;
  checkIn: string;
  checkOut: string;
  description: string;
  facilities: Record<string, boolean>;
  kitchens: number;
  latitude: number;
  longitude: number;
  location: string;
  photos: string[];
  propertyType: string;
  rentPerNight: string;
  title: string;
};

type CreateHostListingVariables = {
  payload: HostListingPayload;
  token: string;
};

export type HostListingResponse = {
  message?: string;
  success?: boolean;
  data?: unknown;
  listing?: unknown;
  error?: string;
};

const createHostListing = async ({
  payload,
  token,
}: CreateHostListingVariables): Promise<HostListingResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
  }

  if (!token) {
    throw new Error("Login token is required");
  }

  const response = await fetch(`${baseUrl}/api/host-listings`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as HostListingResponse;

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || result.error || "Failed to create host listing",
    );
  }

  return result;
};


export const useHostListing = () => {
  return useMutation<HostListingResponse, Error, CreateHostListingVariables>({
    mutationFn: createHostListing,
  });
};
