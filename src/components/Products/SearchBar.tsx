"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import GuestRow from "../ui/gestRow";

type GuestState = {
  adults: number;
  children: number;
  infants: number;
};

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [destination, setDestination] = useState(
    () => searchParams.get("city") || "",
  );
  const [guests, setGuests] = useState<GuestState>({
    adults: Math.max(1, Number(searchParams.get("adults")) || 1),
    children: Math.max(0, Number(searchParams.get("children")) || 0),
    infants: Math.max(0, Number(searchParams.get("infants")) || 0),
  });

  const [date, setDate] = useState({
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
  });

  const totalGuests = useMemo(
    () => guests.adults + guests.children,
    [guests],
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(
      pathname === "/products" ? searchParams.toString() : "",
    );
    const city = destination.trim();

    if (city) {
      params.set("city", city);
    } else {
      params.delete("city");
    }

    if (date.checkIn) {
      params.set("checkIn", date.checkIn);
    } else {
      params.delete("checkIn");
    }

    if (date.checkOut) {
      params.set("checkOut", date.checkOut);
    } else {
      params.delete("checkOut");
    }

    params.set("adults", guests.adults.toString());
    params.set("children", guests.children.toString());

    if (guests.infants > 0) {
      params.set("infants", guests.infants.toString());
    } else {
      params.delete("infants");
    }

    router.push(`/products?${params.toString()}`);
  };

  const updateGuest = (
    key: keyof GuestState,
    type: "increment" | "decrement",
  ) => {
    setGuests((prev) => {
      const current = prev[key];

      if (type === "increment") {
        return {
          ...prev,
          [key]: current + 1,
        };
      }

      const min = key === "adults" ? 1 : 0;

      return {
        ...prev,
        [key]: Math.max(min, current - 1),
      };
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        <div className="flex items-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-lg">
          <label className="flex min-w-0 flex-1 cursor-text flex-col px-5 py-3 hover:bg-gray-100">
            <span className="text-xs font-semibold text-gray-950">Where</span>

            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Search city"
              className="w-full bg-transparent text-sm text-gray-600 outline-none"
            />
          </label>

          <Divider className="hidden md:block" />

          <label className="hidden flex-1 cursor-pointer flex-col px-5 py-3 hover:bg-gray-100 md:flex">
            <span className="text-xs font-semibold text-gray-950">Check in</span>

            <input
              type="date"
              value={date.checkIn}
              onChange={(e) =>
                setDate((prev) => ({
                  ...prev,
                  checkIn: e.target.value,
                  checkOut:
                    prev.checkOut && prev.checkOut < e.target.value
                      ? ""
                      : prev.checkOut,
                }))
              }
              className="bg-transparent text-sm text-gray-600 outline-none"
            />
          </label>

          <Divider className="hidden md:block" />

          <label className="hidden flex-1 cursor-pointer flex-col px-5 py-3 hover:bg-gray-100 md:flex">
            <span className="text-xs font-semibold text-gray-950">Check out</span>

            <input
              type="date"
              min={date.checkIn || undefined}
              value={date.checkOut}
              onChange={(e) =>
                setDate((prev) => ({ ...prev, checkOut: e.target.value }))
              }
              className="bg-transparent text-sm text-gray-600 outline-none"
            />
          </label>

          <Divider className="hidden lg:block" />

          <Popover>
            <PopoverTrigger>
              <button
                type="button"
                className="hidden cursor-pointer rounded-3xl px-5 py-2 text-left transition-all hover:bg-gray-100 lg:block"
              >
                <span className="block text-sm font-semibold text-black">
                  Add guests
                </span>

                <span className="block text-sm text-gray-600">
                  {totalGuests} guest{totalGuests > 1 ? "s" : ""}
                  {guests.infants > 0
                    ? ` - ${guests.infants} infant${
                        guests.infants > 1 ? "s" : ""
                      }`
                    : ""}
                </span>

              </button>
            </PopoverTrigger>

            <PopoverContent className="w-[340px] rounded-3xl border border-gray-200 p-5 shadow-2xl">
              <div className="flex w-full flex-col gap-5">
                <GuestRow
                  title="Adults"
                  subtitle="Age 13+"
                  value={guests.adults}
                  onIncrement={() => updateGuest("adults", "increment")}
                  onDecrement={() => updateGuest("adults", "decrement")}
                  disableMinus={guests.adults <= 1}
                />

                <GuestRow
                  title="Children"
                  subtitle="Age 2-12"
                  value={guests.children}
                  onIncrement={() => updateGuest("children", "increment")}
                  onDecrement={() => updateGuest("children", "decrement")}
                  disableMinus={guests.children <= 0}
                />

                <GuestRow
                  title="Infants"
                  subtitle="Under 2"
                  value={guests.infants}
                  onIncrement={() => updateGuest("infants", "increment")}
                  onDecrement={() => updateGuest("infants", "decrement")}
                  disableMinus={guests.infants <= 0}
                />
              </div>
            </PopoverContent>
          </Popover>

          <button
            type="submit"
            aria-label="Search listings"
            className="m-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF385C] text-white transition hover:scale-105"
          >
            <Search size={18} />
          </button>
        </div>
      </motion.div>
    </form>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-8 w-px bg-gray-200 ${className}`} />;
}
