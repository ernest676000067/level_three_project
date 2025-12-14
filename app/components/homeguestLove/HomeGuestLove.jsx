"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchStore } from "@/store/SearchStore";
import Image from "next/image";
import Link from "next/link";
import { CiHeart } from "react-icons/ci";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

const FALLBACK_IMAGE = "/images/hotel.webp";
const FEATURE_BACKDROP_FALLBACK = "https://qvuarrcymyczzhlkdnkg.supabase.co/storage/v1/object/public/properties/security.jpg";

const HOME_FEATURE_KEYS = [
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

const HOME_FEATURE_VALUE_KEYS = ["label", "title", "name", "description", "value", "text"];

function normalizeHomeFeatures(source) {
  if (!source) return [];

  if (Array.isArray(source)) {
    return source
      .flatMap((entry) => normalizeHomeFeatures(entry))
      .map((item) => (typeof item === "string" ? item.trim() : item))
      .filter((item) => typeof item === "string" && item.length > 0);
  }

  if (typeof source === "string") {
    const trimmed = source.trim();
    if (!trimmed) return [];

    if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeHomeFeatures(parsed);
      } catch (error) {
        console.warn("Unable to parse home feature string", error);
      }
    }

    return trimmed
      .split(/[•,|\n]/)
      .map((segment) => segment.trim())
      .filter(Boolean);
  }

  if (typeof source === "object") {
    for (const key of HOME_FEATURE_KEYS) {
      if (key in source) {
        const extracted = normalizeHomeFeatures(source[key]);
        if (extracted.length) return extracted;
      }
    }

    for (const key of HOME_FEATURE_VALUE_KEYS) {
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

function extractHomeFeatures(home) {
  if (!home || typeof home !== "object") return [];
  const collected = HOME_FEATURE_KEYS.flatMap((key) => normalizeHomeFeatures(home[key]));
  if (collected.length) {
    return Array.from(new Set(collected));
  }
  return [];
}

function resolveFeatureBackdrop(home) {
  if (!home || typeof home !== "object") return FEATURE_BACKDROP_FALLBACK;
  return (
    home.feature_backdrop ||
    home.feature_image ||
    home.cover_image ||
    home.image ||
    FEATURE_BACKDROP_FALLBACK
  );
}

export default function HomeGuestLove() {
  const [homes, setHomes] = useState([]);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [user, setUser] = useState(null);
  const filters = useSearchStore((state) => state.filters);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const loadHomes = async () => {
      try {
        const { data, error } = await supabase
          .from("homes_guests_love")
          .select(
            "id, name, type, city, country, image, rating, status, mode, price, genus, review_count, features"
          )
          .order("name", { ascending: true });

        if (error) throw error;
        setHomes(data ?? []);
      } catch (err) {
        console.error("Failed to load homes guests love", err);
        setHomes([]);
      }
    };

    void loadHomes();
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

  // Filter homes by useSearchStore filters (like UniqueProperty)
  const filteredHomes = homes.filter((home) => {
    // Location
    if (filters.location && !home.city?.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    // Type
    if (filters.propertyType && home.type !== filters.propertyType) {
      return false;
    }
    // Status
    if (filters.status && home.status !== filters.status) {
      return false;
    }
    // Features
    if (filters.feature && !String(home.features).toLowerCase().includes(filters.feature.toLowerCase())) {
      return false;
    }
    // General search (name/city/country)
    if (filters.search && !(
      home.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      home.city?.toLowerCase().includes(filters.search.toLowerCase()) ||
      home.country?.toLowerCase().includes(filters.search.toLowerCase())
    )) {
      return false;
    }
    return true;
  });

  if (!filteredHomes.length) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-2">Homes guests love</h2>
        <p className="text-gray-600">No featured homes match your filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-2">Homes guests love</h2>

      <div className="relative py-6">
        <button
          id="homes-prev"
          className={`absolute -left-7 top-1/2 -translate-y-1/2 md:top-20 bg-white p-3 rounded-full shadow-lg z-30 transition-opacity duration-300 ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <GoChevronLeft size={20} className="text-gray-500" />
        </button>

        <button
          id="homes-next"
          className={`absolute -right-7 top-1/2 -translate-y-1/2 md:top-20 bg-white p-3 rounded-full shadow-lg z-30 transition-opacity duration-300 ${isEnd ? "opacity-0 pointer-events-none" : "opacity-100"}`}
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
            nextEl: "#homes-next",
            prevEl: "#homes-prev",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-homes-pagination",
            bulletActiveClass: "bg-blue-600",
            bulletClass: "swiper-pagination-bullet bg-gray-300",
          }}
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 1.8 },
            1024: { slidesPerView: 3.6 },
          }}
          className="pb-12"
        >
          {filteredHomes.map((home) => {
            const href = `/components/${encodeURIComponent(
              home.id ?? slugify(home.name || home.property_name || "home")
            )}`;
            const features = extractHomeFeatures(home).slice(0, 5);
            const featureBackdrop = resolveFeatureBackdrop(home);

            return (
              <SwiperSlide key={home.id}>
                <Link
                  href={href}
                  className="group block focus:outline-none focus-visible:ring focus-visible:ring-emerald-200"
                >
                  <div className="relative w-[300px] h-[405px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative h-[205px] w-full">
                  <Image
                    src={home.image || FALLBACK_IMAGE}
                    alt={home.name}
                    fill
                    className="rounded-t-lg object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="flex h-[200px] flex-col justify-between">
                  <div className="px-3 pt-3 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">{home.type}</span>
                    {home.mode ? (
                      <span className="ml-2 rounded-sm bg-slate-900/70 px-2 py-0.5 text-xs font-semibold text-white">
                        {home.mode}
                      </span>
                    ) : null}
                    {home.genus && !user ? (
                      <span className="ml-2 rounded-sm bg-blue-700 px-2 py-0.5 text-xs font-semibold text-white">
                        {home.genus}
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-2 px-3">
                    <h3 className="text-lg font-semibold text-slate-900">{home.name}</h3>
                    <p className="text-sm text-slate-600">
                      {home.city}, {home.country}
                    </p>

                    <div className="flex items-center gap-3 text-sm">
                      <span className="rounded-md bg-blue-800 px-2 py-0.5 font-semibold text-white">
                        {home.rating}
                      </span>
                      <div className="flex flex-col text-xs text-slate-500">
                        <span>{home.status}</span>
                        {home.review_count ? (
                          <span>{home.review_count} reviews</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="px-3 pb-3 text-right text-sm text-slate-600">
                    <p>
                      {user ? "Member price" : "Starting from"}{" "}
                      <span className="text-lg font-semibold text-slate-900">
                        {formatPrice(home.price) ?? "Pricing unavailable"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="absolute top-2 right-2 rounded-full bg-white p-1 shadow">
                  <CiHeart size={22} />
                </div>

                {features.length > 0 && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Image
                      src={featureBackdrop}
                      alt={`${home.name} feature backdrop`}
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

        <div className="swiper-homes-pagination mt-4 flex justify-center" />
      </div>
    </div>
  );
}
