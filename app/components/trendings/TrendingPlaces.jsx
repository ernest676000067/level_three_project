"use client";

import Image from "next/image";

const TRENDING = [
  // ---- TOP ROW ----
  {
    name: "Nai Yang Beach",
    countryFlag: "/flags/thailand.png",
    img: "/images/island.webp",
    size: "large",
  },
  {
    name: "Villa in Spain",
    countryFlag: "/flags/spain.png",
    img: "/images/villa.webp",
    size: "large",
  },

  // ---- BOTTOM ROW ----
  {
    name: "Barcelona",
    countryFlag: "/flags/spain.png",
    img: "/images/hotel.webp",
    size: "medium",
  },
  {
    name: "Lloret de Mar",
    countryFlag: "/flags/spain.png",
    img: "/images/island.webp",
    size: "medium",
  },
  {
    name: "Málaga",
    countryFlag: "/flags/spain.png",
    img: "/images/inside.webp",
    size: "medium",
  },
];

export default function TrendingPlaces() {
  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-1">Trending destinations</h2>
      <p className="text-gray-600 mb-6">
        Travelers searching for Spain also booked these
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP ROW (2 large items) */}
        {TRENDING.filter((x) => x.size === "large").map((item, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden h-[300px] cursor-pointer"
          >
            <Image
              src={item.img}
              alt={item.name}
              fill
              className="object-cover"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>

            {/* TEXT */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <h3 className="text-white text-xl font-semibold">{item.name}</h3>
              {/* <Image
                src={item.countryFlag}
                alt="flag"
                width={22}
                height={22}
                className="rounded-sm"
              /> */}
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM ROW (3 medium items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {TRENDING.filter((x) => x.size === "medium").map((item, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden h-[220px] cursor-pointer"
          >
            <Image
              src={item.img}
              alt={item.name}
              fill
              className="object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-linear-to-t from-white/60 to-transparent" />

            {/* TEXT */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <h3 className="text-white text-lg font-semibold">{item.name}</h3>
              {/* <Image
                src={item.countryFlag}
                alt="flag"
                width={20}
                height={20}
                className="rounded-sm"
              /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
