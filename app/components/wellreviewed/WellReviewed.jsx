"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchStore } from "@/store/SearchStore";
import Image from "next/image";
import { CiHeart, CiLocationOn } from "react-icons/ci";
import { IoIosThumbsUp } from "react-icons/io";
import { MdStar } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

const FALLBACK_IMAGE = "/images/hotel.webp";
const FEATURE_BACKDROP_FALLBACK = "https://qvuarrcymyczzhlkdnkg.supabase.co/storage/v1/object/public/properties/security.jpg";

const WELL_FEATURE_KEYS = [
  "features",
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

const WELL_FEATURE_VALUE_KEYS = ["label", "title", "name", "description", "value", "text"];

function normalizeWellFeatures(source) {
  if (!source) return [];

  if (Array.isArray(source)) {
    return source
      .flatMap((entry) => normalizeWellFeatures(entry))
      .map((item) => (typeof item === "string" ? item.trim() : item))
      .filter((item) => typeof item === "string" && item.length > 0);
  }

  if (typeof source === "string") {
    const trimmed = source.trim();
    if (!trimmed) return [];

    if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeWellFeatures(parsed);
      } catch (error) {
        console.warn("Unable to parse well reviewed feature string", error);
      }
    }

    return trimmed
      .split(/[•,|\n]/)
      .map((segment) => segment.trim())
      .filter(Boolean);
  }

  if (typeof source === "object") {
    for (const key of WELL_FEATURE_KEYS) {
      if (key in source) {
        const extracted = normalizeWellFeatures(source[key]);
        if (extracted.length) return extracted;
      }
    }

    for (const key of WELL_FEATURE_VALUE_KEYS) {
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

function extractWellFeatures(stay) {
  if (!stay || typeof stay !== "object") return [];
  const collected = WELL_FEATURE_KEYS.flatMap((key) => normalizeWellFeatures(stay[key]));
  if (collected.length) {
    return Array.from(new Set(collected));
  }
  return [];
}

function resolveFeatureBackdrop(stay) {
  if (!stay || typeof stay !== "object") return FEATURE_BACKDROP_FALLBACK;
  return stay.feature_backdrop || stay.feature_image || stay.cover_image || stay.image || FEATURE_BACKDROP_FALLBACK;
}

export default function WellReviewed() {
  const [stays, setStays] = useState([]);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const filters = useSearchStore((state) => state.filters);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const loadStays = async () => {
      try {
        const { data, error } = await supabase
          .from("well_reviewed")
          .select("id, name, type, city, country, image, rating, status, price, features")
          .order("name", { ascending: true });

        if (error) throw error;
        setStays(data ?? []);
      } catch (err) {
        console.error("Failed to load well reviewed stays", err);
        setStays([]);
      }
    };

    void loadStays();
  }, [supabase]);

  const formatPrice = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XAF",
      maximumFractionDigits: 0,
    }).format(numeric);
  };

  // Filter stays by useSearchStore filters (like UniqueProperty)
  const filteredStays = stays.filter((stay) => {
    // Location
    if (filters.location && !stay.city?.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    // Type
    if (filters.propertyType && stay.type !== filters.propertyType) {
      return false;
    }
    // Status
    if (filters.status && stay.status !== filters.status) {
      return false;
    }
    // Features
    if (filters.feature && !String(stay.features).toLowerCase().includes(filters.feature.toLowerCase())) {
      return false;
    }
    // General search (name/city/country)
    if (filters.search && !(
      stay.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      stay.city?.toLowerCase().includes(filters.search.toLowerCase()) ||
      stay.country?.toLowerCase().includes(filters.search.toLowerCase())
    )) {
      return false;
    }
    return true;
  });

  if (!filteredStays.length) {
    return (
      <div className="w-full max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-semibold mb-2">For your next getaway with friends</h2>
        <p className="text-gray-600">No well-reviewed stays match your filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-semibold mb-2">For your next getaway with friends</h2>
      {/* Search input is handled globally via useSearchStore, like UniqueProperty */}
      <p className="text-gray-600 mb-6">Well-reviewed by groups</p>

      <div className="relative">
        <button
          id="well-reviewed-prev"
          className={`absolute -left-7 top-1/2 -translate-y-1/2 md:top-20 bg-white p-3 rounded-full shadow-lg z-30 transition-opacity duration-300 ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <GoChevronLeft size={20} className="text-gray-500" />
        </button>

        <button
          id="well-reviewed-next"
          className={`absolute -right-7 -translate-y-1/2 md:top-20 bg-white p-3 rounded-full shadow-lg z-30 transition-opacity duration-300 ${isEnd ? "opacity-0 pointer-events-none" : "opacity-100"}`}
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
            nextEl: "#well-reviewed-next",
            prevEl: "#well-reviewed-prev",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-well-pagination",
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
          {filteredStays.map((stay) => {
            const href = `/components/${encodeURIComponent(stay.id ?? slugify(stay.name))}`;
            const features = extractWellFeatures(stay).slice(0, 6);
            const featureBackdrop = resolveFeatureBackdrop(stay);
            return (
              <SwiperSlide key={stay.id ?? stay.name}>
                <Link href={href} className="group block focus:outline-none focus-visible:ring">
                  <div className="w-[300px] h-[405px] border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative bg-white">
                    <div className="w-full h-[205px] relative">
                      <Image
                        src={stay.image || FALLBACK_IMAGE}
                        alt={stay.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1 py-3 pl-2">
                        <MdStar size={20} className="text-yellow-400" />
                        <MdStar size={20} className="text-yellow-400" />
                        <MdStar size={20} className="text-yellow-400" />
                        <MdStar size={20} className="text-yellow-400" />
                        <IoIosThumbsUp size={20} className="bg-yellow-300 p-1 rounded-sm" />
                      </div>

                      <h1 className="px-2 text-lg font-bold group-hover:underline">{stay.name}</h1>
                      <p className="text-sm px-2 text-slate-600">
                        {stay.city}, {stay.country}
                      </p>

                      <div className="flex items-center px-2 gap-2 mt-1">
                        <span className="bg-blue-800 text-white px-2 py-0.5 rounded-md text-sm font-semibold">
                          {stay.rating}
                        </span>
                        <span className="text-sm text-slate-600">{stay.status}</span>
                      </div>

                      <div className="py-2 px-2 flex items-center gap-2 text-sm text-slate-600">
                        <CiLocationOn size={20} />
                        <span>
                          {stay.city}, {stay.country}
                        </span>
                      </div>

                      <div className="py-1 flex justify-end px-3 text-sm text-slate-600">
                        <p>
                          Starting from {" "}
                          <span className="text-lg font-semibold text-slate-900">
                            {formatPrice(stay.price) ?? "Pricing unavailable"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:scale-105 transition-transform">
                      <CiHeart size={22} />
                    </div>
                    {features.length > 0 && (
                      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Image
                          src={featureBackdrop}
                          alt={`${stay.name} feature backdrop`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 25vw"
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
        </Swiper>

        <div className="swiper-well-pagination mt-4 flex justify-center" />
      </div>
    </div>
  );
}
