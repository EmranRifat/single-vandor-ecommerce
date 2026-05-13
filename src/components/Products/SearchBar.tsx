"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Users, Search } from "lucide-react";
 
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import GuestRow from "../ui/gestRow";

type GuestState = {
  adults: number;
  children: number;
  infants: number;
};


export default function SearchBar() {
  const [destination, setDestination] = useState("");
    const [guests, setGuests] = useState<GuestState>({
    adults: 1,
    children: 0,
    infants: 0,
  });


  const [date, setDate] = useState({
    checkIn: "",
    checkOut: "",
  });

  const totalGuests = useMemo(
    () => guests.adults + guests.children,
    [guests]
  );

  const handleSearch = () => {
    console.log({
      destination,
      date,
      guests,
    });
  };

    
  const updateGuest = (
    key: keyof GuestState,
    type: "increment" | "decrement"
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
    <div className="flex justify-center   py- ">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        {/* SEARCH BAR */}
        <div className="flex items-center rounded-full border border-gray-200 bg-white shadow-lg overflow-hidden">

          {/* DESTINATION */}
          <div className="flex flex-1 items-center gap-3 px-6   hover:bg-gray-100">
             

            <div className="flex flex-col">
              <span className="text-xs font-semibold">Where</span>

              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search destination"
                className="bg-transparent text-sm outline-none text-gray-600"
              />
            </div>
          </div>

          <Divider />

          {/* CHECK IN */}
          <div className="flex flex-1 items-center gap-3 px-6 py-  hover:bg-gray-100">
            

            <div className="flex flex-col">
              <span className="text-xs font-semibold">Check in</span>

              <input
                type="date"
                value={date.checkIn}
                onChange={(e) =>
                  setDate({ ...date, checkIn: e.target.value })
                }
                className="bg-transparent text-sm outline-none text-gray-600"
              />
            </div>
          </div>

          <Divider />

          {/* CHECK OUT */}
          <div className="flex flex-1 items-center gap-3 px-6 py-4 hover:bg-gray-100">
             <Popover  >
              <PopoverTrigger> 
          

              <div className="flex ">
                <span className="text-xs font-semibold">Check out</span>

                <input
                  type="date"
                  value={date.checkOut}
                  onChange={(e) =>
                    setDate({ ...date, checkOut: e.target.value })
                  }
                  className="bg-transparent text-sm outline-none text-gray-600"
                />
              </div>
              </PopoverTrigger>

              </Popover>
          </div>

          <Divider />

          {/* GUESTS */}
           <Popover  >
              <PopoverTrigger>
                <div className="group cursor-pointer rounded-3xl  hover:bg-gray-100 px-5 py-1 transition-all  ">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="flex h-5 w-9 items-center justify-center rounded-full   text-black">
                       
                    </div>

                    <div>
                      

                      <h4 className="text-sm font-semibold text-black">
                        Add guests
                      </h4>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    {totalGuests} guest
                    {totalGuests > 1 ? "s" : ""}
                    {guests.infants > 0 &&
                      ` · ${guests.infants} infant${
                        guests.infants > 1 ? "s" : ""
                      }`}
                  </p>
                </div>
              </PopoverTrigger>

              <PopoverContent className="w-[340px] rounded-3xl border border-gray-200 p-5 shadow-2xl">
                <div className="flex w-full flex-col gap-5">
                  <GuestRow
                    title="Adults"
                    subtitle="Age 13+"
                    value={guests.adults}
                    onIncrement={() =>
                      updateGuest("adults", "increment")
                    }
                    onDecrement={() =>
                      updateGuest("adults", "decrement")
                    }
                    disableMinus={guests.adults <= 1}
                  />

                  <GuestRow
                    title="Children"
                    subtitle="Age 2-12"
                    value={guests.children}
                    onIncrement={() =>
                      updateGuest("children", "increment")
                    }
                    onDecrement={() =>
                      updateGuest("children", "decrement")
                    }
                    disableMinus={guests.children <= 0}
                  />

                  <GuestRow
                    title="Infants"
                    subtitle="Under 2"
                    value={guests.infants}
                    onIncrement={() =>
                      updateGuest("infants", "increment")
                    }
                    onDecrement={() =>
                      updateGuest("infants", "decrement")
                    }
                    disableMinus={guests.infants <= 0}
                  />
                </div>
              </PopoverContent>
            </Popover>

          {/* SEARCH BUTTON */}
          <button
            onClick={handleSearch}
            className="m-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF385C] text-white hover:scale-105 transition"
          >
            <Search size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* Divider */
function Divider() {
  return <div className="h-8 w-px bg-gray-200" />;
}