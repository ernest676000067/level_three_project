"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { useSearchStore } from "@/store/SearchStore";

const FALLBACK_IMAGE = "/images/hotel.webp";

export default function ByPropertyType() {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const supabase = useMemo(() => createClient(), []);
  const addInterestedProperty = useSearchStore((state) => state.addInterestedProperty);

  useEffect(() => {
    const loadPropertyTypes = async () => {
      try {
        const { data, error } = await supabase
          .from("property_types")
          .select("id, name, image")
          .order("name", { ascending: true });

        if (error) throw error;
        setPropertyTypes(data ?? []);
      } catch (err) {
        console.error("Failed to load property types", err);
        setPropertyTypes([]);
      }
    };

    void loadPropertyTypes();
  }, [supabase]);

  if (!propertyTypes.length) {
    return (
      <div className="w-full max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-semibold mb-4">Browse by property type</h2>
        <p className="text-gray-600">No property types available right now.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-semibold mb-4">Browse by property type</h2>

      <div className="relative">
        <button
          id="property-prev"
          className={`absolute -left-7 top-1/2 -translate-y-1/2 md:top-20 bg-white shadow-lg p-3 rounded-full z-30 cursor-pointer transition-opacity duration-300 ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <GoChevronLeft size={20} className="text-gray-500" />
        </button>

        <button
          id="property-next"
          className={`absolute -right-7 -translate-y-1/2 md:top-20 bg-white shadow-lg p-3 rounded-full z-30 cursor-pointer transition-opacity duration-300 ${isEnd ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <GoChevronRight size={20} className="text-gray-500" />
        </button>

        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={20}
          onSwiper={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          navigation={{
            nextEl: "#property-next",
            prevEl: "#property-prev",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-property-pagination",
            bulletActiveClass: "bg-blue-600",
            bulletClass: "swiper-pagination-bullet bg-gray-300",
          }}
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 1.8 },
            1024: { slidesPerView: 3.5 },
          }}
          className="pb-12"
        >
          {propertyTypes.map((type) => (
            <SwiperSlide key={type.id}>
              <Link
                href={`/components/${encodeURIComponent(type.id ?? slugify(type.name || "type"))}`}
                className="group block focus:outline-none focus-visible:ring focus-visible:ring-emerald-200"
                onClick={() => addInterestedProperty(type)}
                style={{ cursor: 'pointer' }}
              >
                <div className="w-[300px] h-[250px] rounded-lg overflow-hidden relative bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="w-full h-[205px] relative">
                    <Image
                      src={type.image || FALLBACK_IMAGE}
                      alt={type.name}
                      fill
                      className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>

                  <div>
                    <h1 className="px-2 text-lg font-bold py-2">{type.name}</h1>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-property-pagination mt-4 flex justify-center z-30 relative" />
      </div>
    </div>
  );
}
