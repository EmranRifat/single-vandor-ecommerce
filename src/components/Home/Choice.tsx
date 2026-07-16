import React from "react";
import { MapPin, Users, CalendarDays, HandCoins, Star } from "lucide-react";

const features = [
  {
    id: "01",
    icon: <MapPin className="h-6 w-6 text-emerald-600" />,
    title: "Reliable Stays Across Bangladesh",
    description:
      "From cozy rooms to furnished apartments, find stays across Bangladesh with verified listings and trusted support.",
  },
  {
    id: "02",
    icon: <Users className="h-6 w-6 text-amber-500" />,
    title: "Strong Community Support",
    description:
      "Our local team is available 24/7 to assist both hosts and guests whenever help is needed.",
  },
  {
    id: "03",
    icon: <CalendarDays className="h-6 w-6 text-violet-500" />,
    title: "Easy Booking & Hosting",
    description:
      "Search, book, list, and manage properties through one simple and user-friendly platform.",
  },
  {
    id: "04",
    icon: <HandCoins className="h-6 w-6 text-sky-500" />,
    title: "Earn or Save More",
    description:
      "Guests enjoy affordable stays while hosts receive faster bookings and personalized support.",
  },
];

const Choice = () => {
  return (
    <section className="bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-[#091139] dark:via-gray-700 dark:to-[#090e34] py-16 transition-colors duration-300">
      {" "}
      <div className="mx-auto max-w-7xl px-5">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300 px-4 py-1.5 text-sm font-semibold">
            <Star className="h-4 w-4 fill-current" />
            Why Choose Us
          </div>
        </div>

        {/* Heading */}
        <div className="mt-5 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-5xl">
            Why Homely is Your{" "}
            <span className="text-pink-500 dark:text-pink-400">
              Best Choice?
            </span>
          </h2>

          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-pink-500 to-rose-300 dark:from-pink-400 dark:to-pink-600"></div>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.id}
              className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-gradient-to-br
        dark:from-gray-900
        dark:via-gray-800
        dark:to-gray-900
        p-5
        min-h-[260px]
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-pink-300
        dark:hover:border-pink-500/60
        hover:shadow-xl
        dark:hover:shadow-black/40
    "
            >
              {/* Top */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm">
                  {item.icon}
                </div>

                <span className="text-5xl font-bold text-gray-100 dark:text-gray-700 transition group-hover:text-pink-100 dark:group-hover:text-pink-900">
                  {item.id}
                </span>
              </div>
              {/* Title */}
              <h3 className="mb-3 text-lg font-semibold leading-7 text-slate-900 dark:text-white">
                {item.title}
              </h3>
              {/* Description */}
              <p className="text-sm leading-6 text-slate-600 dark:text-gray-300">
                {item.description}
              </p>
              {/* Bottom Hover Line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-pink-500 to-rose-400 dark:from-pink-400 dark:to-purple-500 transition-all duration-500 group-hover:w-full"></div>{" "}
            </div>
          ))}
        </div>
      </div>
      {/* Bottom Stats */}
      {/* Bottom Info */}
      <div className="mt-8 flex flex-col items-center">
        <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 md:text-base">
          Join thousands of satisfied travelers and hosts across Bangladesh
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-5 md:gap-8">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-pink-500"></span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 md:text-sm">
              Premium Service
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-pink-500"></span>
            <span className="text-xs font-medium text-gray-500 md:text-sm">
              24/7 Support
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-pink-500"></span>
            <span className="text-xs font-medium text-gray-500 md:text-sm">
              Verified Listings
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Choice;
