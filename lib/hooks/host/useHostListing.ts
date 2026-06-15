import { CreateHostListingVariables, HostListingResponse } from "@/lib/types/types";
import { useMutation } from "@tanstack/react-query";


const createHostListing = async ({
  payload,
  token,
}: CreateHostListingVariables): Promise<HostListingResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
  }

  const formData = new FormData();

  formData.append("availabilitySelectionMode", payload.availabilitySelectionMode);
  formData.append("availableFrom", payload.availableFrom);
  formData.append("availableTo", payload.availableTo);
  formData.append("bathrooms", String(payload.bathrooms));
  formData.append("bedrooms", String(payload.bedrooms));
  formData.append("checkIn", payload.checkIn);
  formData.append("checkOut", payload.checkOut);
  formData.append("description", payload.description);
  formData.append("facilities", JSON.stringify(payload.facilities));
  formData.append("kitchens", String(payload.kitchens));
  formData.append("latitude", String(payload.latitude));
  formData.append("longitude", String(payload.longitude));
  formData.append("location", payload.location);
  formData.append("propertyType", payload.propertyType);
  formData.append("rentPerNight", payload.rentPerNight);
  formData.append("title", payload.title);

  payload.photos.forEach((file) => {
    formData.append("photos", file);
  });

  const response = await fetch(`${baseUrl}/api/host-listings`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
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
  const mutation = useMutation<HostListingResponse, Error, CreateHostListingVariables>({
    mutationFn: createHostListing,
  });

  return {
    ...mutation,
    isPending: mutation.isPending,
  };
};