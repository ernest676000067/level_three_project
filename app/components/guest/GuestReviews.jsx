"use client";

import { useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

// ⭐ Example Reviews Data
const REVIEWS = [
  {
    id: 1,
    name: "Tina",
    country: "",
    location: "10 years on Airbnb",
    date: "September 2025",
    rating: 5,
    text: "The hosts were truly wonderful. The room was spotless and included a private bathroom, making my stay very comfortable. The location was perfect...",
    avatar: "/images/avatar1.png",
  },
  {
    id: 2,
    name: "Samantha",
    country: "Vaughan, Canada",
    location: "2 weeks ago",
    date: "",
    rating: 5,
    text: "Definitely recommend!! The place was so lovely and the location was fantastic. Super clean and comfortable. Belen was fantastic...",
    avatar: "/images/avatar2.png",
  },
  {
    id: 3,
    name: "Sebastian",
    country: "West Palm Beach, Florida",
    location: "September 2025",
    rating: 5,
    text: "I can completely recommend staying here. The apartment is modern and clean, with many useful and thoughtful amenities...",
    avatar: "/images/avatar3.png",
  },
  {
    id: 4,
    name: "Alain",
    country: "",
    location: "7 years on Airbnb",
    date: "July 2025",
    rating: 5,
    text: "This was an unbeatable option for my stay, I would gladly come back whenever I'm visiting Madrid. Mr. Avelino was helpful...",
    avatar: "/images/avatar4.png",
  },
  {
    id: 5,
    name: "Nancy",
    country: "Vienna, Virginia",
    location: "June 2025",
    rating: 5,
    text: "This place is so clean! Belen and her husband are extremely organized. The room was small but perfect for what I needed...",
    avatar: "/images/avatar5.png",
  },
  {
    id: 6,
    name: "Olga",
    country: "",
    location: "7 months on Airbnb",
    date: "July 2025",
    rating: 5,
    text: "Great hosts! Welcoming and very helpful. The place was in perfect condition, clean and spacious. The location could not be better...",
    avatar: "/images/avatar6.png",
  },
];

export default function GuestReviews() {
  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Guest Reviews</h2>

      <div className="grid md:grid-cols-2 gap-10">
        {REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

// ⭐ Individual Review Component
function ReviewCard({ review }) {
  const [showMore, setShowMore] = useState(false);
  // Host image path (same as MeetYourHost)
  const hostImage = "/images/flower.avif";
  const hostName = "Belen";

  return (
    <div>
      {/* Header with Guest and Host Avatars */}
      <div className="flex items-start gap-3">
        {/* Guest Avatar */}
        <div className="flex flex-col items-center">
          <Image
            src={review.avatar}
            alt={review.name}
            width={48}
            height={48}
            className="rounded-full border"
          />
          <span className="text-xs text-gray-500 mt-1">Guest</span>
        </div>
        {/* Host Avatar */}
        <div className="flex flex-col items-center">
          <Image
            src={hostImage}
            alt={hostName}
            width={40}
            height={40}
            className="rounded-full border-2 border-pink-500"
          />
          <span className="text-xs text-pink-600 mt-1">Host</span>
        </div>
        <div>
          <h3 className="font-semibold">{review.name}</h3>
          <p className="text-sm text-gray-500">
            {review.country || review.location}
          </p>
        </div>
      </div>

      {/* Rating + Date */}
      <div className="flex items-center gap-1 mt-2">
        {Array(review.rating)
          .fill(0)
          .map((_, i) => (
            <FaStar key={i} className="text-black" size={12} />
          ))}
        <span className="text-sm text-gray-600 ml-2">{review.date}</span>
      </div>

      {/* Review Text */}
      <p className="text-sm mt-3 text-gray-700 leading-relaxed">
        {showMore ? review.text : review.text.slice(0, 50) + "..."}
      </p>

      {/* Show More Button */}
      <button
        className="text-black font-medium mt-2 text-sm underline"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Show less" : "Show more"}
      </button>
    </div>
  );
}
