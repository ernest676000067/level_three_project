"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CiHeart, CiLocationOn } from "react-icons/ci";
import { IoIosThumbsUp } from "react-icons/io";
import { MdStar } from "react-icons/md";

// Swiper modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { useSearchStore } from "@/store/SearchStore";
const FEATURE_BACKDROP_FALLBACK = "https://qvuarrcymyczzhlkdnkg.supabase.co/storage/v1/object/public/properties/security.jpg";

const SERVICE_FEATURE_KEYS = [
  "features",
  "Features",
  "feature_list",
  "featureHighlights",
  "feature_highlights",
  "highlights",
  "amenities",
  "amenityHighlights",
  "key_features",
  "selling_points",
  "tags",
  "points",
  "details",
];

const SERVICE_FEATURE_VALUE_KEYS = ["label", "title", "name", "description", "value", "text"];

function normalizeServiceFeatures(source) {
  if (!source) return [];

  if (Array.isArray(source)) {
    return source
      .flatMap((entry) => normalizeServiceFeatures(entry))
      .map((item) => (typeof item === "string" ? item.trim() : item))
      .filter((item) => typeof item === "string" && item.length > 0);
  }

  if (typeof source === "string") {
    const trimmed = source.trim();
    if (!trimmed) return [];

    if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeServiceFeatures(parsed);
      } catch (error) {
        console.warn("Unable to parse service feature string", error);
      }
    }

    return trimmed
      .split(/[•,|\n]/)
      .map((segment) => segment.trim())
      .filter(Boolean);
  }

  if (typeof source === "object") {
    for (const key of SERVICE_FEATURE_KEYS) {
      if (key in source) {
        const extracted = normalizeServiceFeatures(source[key]);
        if (extracted.length) return extracted;
      }
    }

    for (const key of SERVICE_FEATURE_VALUE_KEYS) {
      if (typeof source[key] === "string") {
        const value = source[key].trim();
        if (value) return [value];
      }
    }

    if (typeof source.value === "string") {
      const value = source.value.trim();
      if (value) return [value];
    }
  }

  return [];
}

function extractServiceFeatures(service) {
  if (!service || typeof service !== "object") return [];
  const collected = SERVICE_FEATURE_KEYS.flatMap((key) => normalizeServiceFeatures(service[key]));
  if (collected.length) {
    return Array.from(new Set(collected));
  }
  return [];
}

function resolveFeatureBackdrop(service) {
  if (!service || typeof service !== "object") return FEATURE_BACKDROP_FALLBACK;
  return (
    service.feature_backdrop ||
    service.feature_image ||
    service.cover_image ||
    service.main_image ||
    FEATURE_BACKDROP_FALLBACK
  );
}

const FALLBACK_IMAGE = "/images/hotel.webp";

export default function ExtraSection() {
  const [services, setServices] = useState([]);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const filters = useSearchStore((state) => state.filters);
  const addInterestedProperty = useSearchStore((state) => state.addInterestedProperty);

  useEffect(() => {
    const supabase = createClient();

    const fetchServices = async () => {
      try {
        let query = supabase.from("extra_services").select("*");

// LOCATION
if (filters.location) {
  query = query.ilike("city", `%${filters.location}%`);
}

// TYPE
if (filters.propertyType) {
  query = query.eq("type", filters.propertyType);
}

// STATUS
if (filters.status) {
  query = query.eq("status", filters.status);
}

// FEATURES — advanced (search inside your array/string fields)
if (filters.feature) {
  query = query.ilike("features", `%${filters.feature}%`);
}

query = query.order("overall_rating", { ascending: false });
        const { data, error } = await query;
        if (error) throw error;
        setServices(data ?? []);
      } catch (err) {
        console.error("Failed to load extra services", err);
        setServices([]);
      }
    };

    void fetchServices();
  }, [filters.location, filters.propertyType, filters.status, filters.feature]);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-semibold mb-2">Extra services</h2>
      <p className="text-gray-600 mb-6">Front desk, housekeeping, and more</p>

      <div className="relative">

        {/* LEFT ARROW */}
        
          <button
            id="extra-prev"
            className={`absolute -left-7 top-1/2 -translate-y-1/2 md:top-20
            bg-white shadow-lg p-3 rounded-full 
            z-30 cursor-pointer transition-opacity duration-300
            ${isBeginning ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
          >
            <GoChevronLeft size={20} className='text-gray-500' />
          </button>
       

        {/* RIGHT ARROW */}
      
          <button
            id="extra-next"
            className={`absolute -right-7 to-2/3 -translate-y-1/2 md:top-20
            bg-white shadow-lg p-3 rounded-full 
            z-30 cursor-pointer transition-opacity duration-300
            ${isEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
          >
            <GoChevronRight size={20} className='text-gray-500' />
          </button>
        

       <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={20}
          
          // Setup initial state and update on slide change
          onSwiper={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}

          // Link custom navigation elements
          navigation={{
            nextEl: '#extra-next',
            prevEl: '#extra-prev',
          }}
          
          // Link custom pagination container
          pagination={{
            clickable: true,
            el: '.swiper-offer-pagination',
            bulletActiveClass: 'bg-blue-600',
            bulletClass: 'swiper-pagination-bullet bg-gray-300',
          }}
          
          // Responsive breakpoints (2 cards on large screen, matching OfferComponent.png)
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 1.8 },
            1024: { slidesPerView: 3.2 },
          }}
          className="pb-12" // Add padding at the bottom for the dots
        >
          {services.map((item) => {
            // Debug log for availability_status and status
            console.log('Service:', item.name, 'availability_status:', item.availability_status, 'status:', item.status);
            const href = `/components/${encodeURIComponent(
              item.id ?? slugify(item.name || "service")
            )}`;
            const features = extractServiceFeatures(item).slice(0, 6);
            const featureBackdrop = resolveFeatureBackdrop(item);

            return (
              <SwiperSlide key={item.id}>
                <Link
                  href={href}
                  className="group block focus:outline-none focus-visible:ring focus-visible:ring-emerald-200"
                  onClick={() => addInterestedProperty(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="w-[340px] h-[460px] border border-gray-200 rounded-lg overflow-hidden shadow-md transition hover:-translate-y-0.5 hover:shadow-lg relative bg-white">

                {/* Image */}
                <div className="w-full h-[240px] relative">
                  <Image
                    src={item.main_image || FALLBACK_IMAGE}
                    alt={item.name}
                    fill
                    className="object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Card body */}
                <div className="flex h-[200px] flex-col justify-between">
                  {/* Stars */}
                  <div className="flex items-center gap-1 py-3 pl-2">
                    <MdStar size={20} className="text-yellow-400" />
                    <MdStar size={20} className="text-yellow-400" />
                    <MdStar size={20} className="text-yellow-400" />
                    <MdStar size={20} className="text-yellow-400" />
                    <IoIosThumbsUp size={20} className="bg-yellow-300 p-1 rounded-sm" />
                  </div>

                  {/* Name */}
                  <h1 className="px-2 text-lg font-bold">{item.name}</h1>
                  <p className="text-sm px-2">
                    {item.city}, {item.country}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center px-2 gap-2 mt-1">
                    <span className="bg-blue-800 text-white px-2 py-0.5 rounded-md text-sm font-semibold">
                      {item.overall_rating}
                    </span>
                    <div className='flex flex-col '><span className="text-[10px] ">{item.status}  </span>
                    <span className="text-[10px] "> {item.location_rating} </span>
                    </div>
                    
                    {item.availability_status ? (
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                          item.availability_status?.toLowerCase() === "free"
                            ? "bg-lime-400 text-slate-900"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {item.availability_status}
                      </span>
                    ) : null}
                  </div>

                  {/* Location */}
                  <div className="py-2 px-2 flex items-center gap-2 text-sm text-slate-600">
                    {item.amenities || "amenities"}
                  </div>

                  {/* Price */}
                  <div className="py-1 flex justify-end px-3">
                    <p>
                      Starting from{" "}
                      <span className="text-lg font-semibold">
                        XAF {item.price}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Heart icon */}
                <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md cursor-pointer hover:scale-105 transition-transform">
                  <CiHeart size={22} />
                </div>

                {features.length > 0 && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Image
                      src={featureBackdrop}
                      alt={`${item.name} feature backdrop`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 26vw"
                    />
                    <div className="absolute inset-0 bg-slate-950/75" />
                    <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-5 text-white">
                      <span className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Key features</span>
                      <ul className="space-y-2 text-sm leading-snug">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
          {/* Pagination container */}
        <div className="swiper-offer-pagination mt-4 flex justify-center z-30 relative" />
      
        </Swiper>

        


      </div>
    </div>
  );
}
