"use client";

import { Star } from "lucide-react";

interface ReviewsSectionProps {
  rating?: number;
  reviewsCount?: number;
}

const reviews = [
  {
    name: "May",
    meta: "11 years on Airbnb",
    date: "2 weeks ago",
    avatar: "M",
    avatarClass: "bg-sky-500",
    text: "Had a comfortable stay overall. ",
  },
  {
    name: "Calvin",
    meta: "6 months on Airbnb",
    date: "April 2026",
    avatar: "C",
    avatarClass: "bg-amber-500",
    text: "The place was excellent, clean, comfortable, and exactly as described. .",
  },
  {
    name: "Rekha",
    meta: "10 years on Airbnb",
    date: "April 2026",
    avatar: "R",
    avatarClass: "bg-rose-500",
    text: "A beautiful unit in an ideal location. We truly loved our stay here. ",
  },
  {
    name: "Apostolos",
    meta: "Abu Dhabi, United Arab Emirates",
    date: "March 2026",
    avatar: "A",
    avatarClass: "bg-emerald-600",
    text: "Great apartment, very spacious with the added bonus of a second bathroom. ",
  },
];

export default function ReviewsSection({
  rating = 0,
  reviewsCount = 0,
}: ReviewsSectionProps) {
  return (
    <section id="reviews" className="border-t border-gray-200 pt-10">
      <div className="mb-8 flex items-center gap-2 text-2xl font-semibold text-gray-950">
        <Star className="h-6 w-6 fill-gray-950 text-gray-950" />
        <span>
          {Number(rating || 0).toFixed(2)} &middot; {reviewsCount} reviews
        </span>
      </div>

      <div className="grid gap-x-24 gap-y-10 md:grid-cols-2">
        {reviews.map((review) => (
          <article key={review.name}>
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${review.avatarClass}`}
              >
                {review.avatar}
              </div>
              <div>
                <h3 className="font-semibold text-gray-950">{review.name}</h3>
                <p className="text-sm text-gray-600">{review.meta}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
              <span className="flex items-center gap-0.5 text-gray-950">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-3 w-3 fill-gray-950 text-gray-950"
                  />
                ))}
              </span>
              <span>&middot;</span>
              <span>{review.date}</span>
            </div>

            <p className="mt-2 line-clamp-3 max-w-xl leading-6 text-gray-800">
              {review.text}
            </p>

            {/* <button
              type="button"
              className="mt-3 font-semibold text-gray-950 underline underline-offset-2"
            >
              Show more
            </button> */}
          </article>
        ))}
      </div>

      <button
        type="button"
        className="mt-10 rounded-lg border border-gray-950 px-6 py-3 font-semibold text-gray-950 transition hover:bg-gray-100"
      >
        Show all {reviewsCount || reviews.length} reviews
      </button>
    </section>
  );
}
