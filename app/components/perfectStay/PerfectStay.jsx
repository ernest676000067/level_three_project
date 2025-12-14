"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchStore } from "@/store/SearchStore";
import Image from "next/image";
import Link from "next/link";
import { CiHeart, CiLocationOn } from "react-icons/ci";
import { IoIosThumbsUp } from "react-icons/io";
import { MdStar } from "react-icons/md";
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

const RECOMMENDED_FEATURE_KEYS = [
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

const RECOMMENDED_FEATURE_VALUE_KEYS = ["label", "title", "name", "description", "value", "text"];

function normalizeRecommendedFeatures(source) {
  if (!source) return [];

  if (Array.isArray(source)) {
    return source
      .flatMap((entry) => normalizeRecommendedFeatures(entry))
      .map((item) => (typeof item === "string" ? item.trim() : item))
      .filter((item) => typeof item === "string" && item.length > 0);
  }

  if (typeof source === "string") {
    const trimmed = source.trim();
    if (!trimmed) return [];

    if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeRecommendedFeatures(parsed);
      } catch (error) {
        console.warn("Unable to parse recommended feature string", error);
      }
    }

    return trimmed
      .split(/[•,|\n]/)
      .map((segment) => segment.trim())
      .filter(Boolean);
  }

  if (typeof source === "object") {
    for (const key of RECOMMENDED_FEATURE_KEYS) {
      if (key in source) {
        const extracted = normalizeRecommendedFeatures(source[key]);
        if (extracted.length) return extracted;
      }
    }

    for (const key of RECOMMENDED_FEATURE_VALUE_KEYS) {
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

function extractRecommendedFeatures(stay) {
  if (!stay || typeof stay !== "object") return [];
  const collected = RECOMMENDED_FEATURE_KEYS.flatMap((key) => normalizeRecommendedFeatures(stay[key]));
  if (collected.length) {
    return Array.from(new Set(collected));
  }
  return [];
}

function resolveFeatureBackdrop(stay) {
  if (!stay || typeof stay !== "object") return FEATURE_BACKDROP_FALLBACK;
  return (
    stay.feature_backdrop ||
    stay.feature_image ||
    stay.cover_image ||
    stay.main_image ||
    FEATURE_BACKDROP_FALLBACK
  );
}

export default function PerfectStay() {
  const [stays, setStays] = useState([]);
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

    const loadStays = async () => {
      try {
        const { data, error } = await supabase
          .from("recommended_stays")
          .select(
            "id, title, subtitle, is_genius, property_name, city, country, rating, review_summary, reviews_count, starting_price, starting_price_signed_in, main_image, features"
          )
          .order("created_at", { ascending: false });

        if (error) throw error;
        setStays(data ?? []);
      } catch (err) {
        console.error("Failed to load recommended stays", err);
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
      stay.property_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      stay.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
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
        <h2 className="text-3xl font-semibold mb-2">Looking for the perfect stay?</h2>
        <p className="text-gray-600">No recommendations match your filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-semibold mb-2">Looking for the perfect stay?</h2>
      <p className="text-gray-600 mb-6">Travelers with similar searches booked these properties</p>

      <div className="relative">
        <button
          id="perfect-prev"
          className={`absolute -left-7 top-1/2 -translate-y-1/2 md:top-20 bg-white p-3 rounded-full shadow-lg z-30 transition-opacity duration-300 ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <GoChevronLeft size={20} className="text-gray-500" />
        </button>

        <button
          id="perfect-next"
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
            nextEl: "#perfect-next",
            prevEl: "#perfect-prev",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-perfect-pagination",
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
          {filteredStays.map((stay) => {
            const formattedPrice = formatPrice(stay.starting_price);
            const signedInPrice = formatPrice(stay.starting_price_signed_in);
            const fallbackPrice = stay.starting_price ? `XAF ${stay.starting_price}` : null;
            const displayPrice = user
              ? signedInPrice ?? formattedPrice ?? fallbackPrice
              : formattedPrice ?? fallbackPrice ?? signedInPrice;

            const href = `/components/${encodeURIComponent(
              stay.id ?? slugify(stay.property_name || stay.title || "residence")
            )}`;
            const features = extractRecommendedFeatures(stay).slice(0, 6);
            const featureBackdrop = resolveFeatureBackdrop(stay);

            return (
              <SwiperSlide key={stay.id}>
                <Link
                  href={href}
                  className="group block focus:outline-none focus-visible:ring focus-visible:ring-emerald-200"
                >
                  <div className="relative w-[300px] h-[460px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="relative h-[240px] w-full">
                    <Image
                      src={stay.main_image || FALLBACK_IMAGE}
                      alt={stay.property_name}
                      fill
                        className="rounded-t-lg object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="flex h-[220px] flex-col justify-between">
                    <div className="flex items-center gap-2 px-3 pt-3">
                      <span className="text-sm text-gray-700">{stay.title}</span>
                      <IoIosThumbsUp size={15} className="text-yellow-400" />
                      {stay.is_genius && !user ? (
                        <span className="rounded-sm bg-blue-700 px-2 py-0.5 text-xs font-semibold text-white">Genius</span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1 px-3 text-yellow-400">
                      <MdStar size={16} />
                      <MdStar size={16} />
                      <MdStar size={16} />
                      <MdStar size={16} />
                    </div>

                    <h3 className="px-3 text-lg font-semibold text-slate-900">{stay.property_name}</h3>
                    <p className="px-3 text-sm text-slate-600">
                      {stay.city}, {stay.country}
                    </p>

                    {stay.subtitle ? (
                      <div className="flex items-center gap-2 px-3 text-xs text-slate-500">
                        <CiLocationOn size={14} />
                        <span>{stay.subtitle}</span>
                      </div>
                    ) : null}

                    <div className="flex items-center gap-2 px-3 text-sm">
                      <span className="rounded-md bg-blue-800 px-2 py-0.5 font-semibold text-white">
                        {stay.rating}
                      </span>
                      <div className="flex flex-col text-xs text-slate-500">
                        <span>{stay.review_summary}</span>
                        {stay.reviews_count ? (
                          <span>{stay.reviews_count} reviews</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="px-3 pb-3 text-right text-sm text-slate-600">
                      <p>
                        {user ? "Member price" : "Starting from"}{" "}
                        <span className="text-lg font-semibold text-slate-900">
                          {displayPrice ?? "Pricing unavailable"}
                        </span>
                      </p>
                      {!user && formattedPrice && signedInPrice && signedInPrice !== formattedPrice ? (
                        <span className="text-xs text-emerald-600">Sign in for {signedInPrice}</span>
                      ) : null}
                      {user && formattedPrice && signedInPrice && signedInPrice !== formattedPrice ? (
                        <span className="text-xs text-slate-500">Standard rate {formattedPrice}</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 rounded-full bg-white p-1 shadow">
                    <CiHeart size={22} />
                  </div>
                  {features.length > 0 && (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Image
                        src={featureBackdrop}
                        alt={`${stay.property_name} feature backdrop`}
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

        <div className="swiper-perfect-pagination mt-4 flex justify-center" />
      </div>
    </div>
  );
}
