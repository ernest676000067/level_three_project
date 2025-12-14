"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdStar } from "react-icons/md";
import { IoIosThumbsUp } from "react-icons/io";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { createClient } from "@/lib/supabase/client";
import { FavoriteButton } from "../common/FavoriteButton";
import { slugify } from "@/lib/utils";
import { useSearchStore } from "@/store/SearchStore";
// import { useSearchStore } from "@/store/searchStore"; 


const FEATURES_BACKDROP_URL = "https://qvuarrcymyczzhlkdnkg.supabase.co/storage/v1/object/public/properties/security.jpg";

const PROPERTY_FEATURE_KEYS = [
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

const FEATURE_VALUE_KEYS = ["label", "title", "name", "description", "value", "text"];


function normalizeFeatureList(source) {
  if (!source) return [];

  if (Array.isArray(source)) {
    return source
      .flatMap((entry) => normalizeFeatureList(entry))
      .map((item) => (typeof item === "string" ? item.trim() : item))
      .filter((item) => typeof item === "string" && item.length > 0);
  }

  if (typeof source === "string") {
    const trimmed = source.trim();
    if (!trimmed) return [];

    if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeFeatureList(parsed);
      } catch (error) {
        console.warn("Unable to parse feature string", error);
      }
    }

    return trimmed
      .split(/[•,|\n]/)
      .map((segment) => segment.trim())
      .filter(Boolean);
  }

  if (typeof source === "object") {
    for (const key of PROPERTY_FEATURE_KEYS) {
      if (key in source) {
        const extracted = normalizeFeatureList(source[key]);
        if (extracted.length) {
          return extracted;
        }
      }
    }

    for (const key of FEATURE_VALUE_KEYS) {
      if (typeof source[key] === "string") {
        const value = source[key].trim();
        if (value) {
          return [value];
        }
      }
    }

    if (typeof source.value === "string") {
      const value = source.value.trim();
      if (value) return [value];
    }
  }

  return [];
}

function extractPropertyFeatures(property) {
  if (!property || typeof property !== "object") return [];

  const collected = PROPERTY_FEATURE_KEYS.flatMap((key) => normalizeFeatureList(property[key]));
  if (collected.length) {
    return Array.from(new Set(collected));
  }

  return [];
}

function resolveFeatureBackdrop(property) {
  if (!property || typeof property !== "object") return FEATURES_BACKDROP_URL;
  return (
    property.feature_backdrop ||
    property.feature_image ||
    property.featureBanner ||
    property.security_image ||
    property.background_image ||
    property.cover_image ||
    FEATURES_BACKDROP_URL
  );
}

export default function UniqueProperty() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const filters = useSearchStore((state) => state.filters);
  const addInterestedProperty = useSearchStore((state) => state.addInterestedProperty);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  // Fetch user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
  }, []);

  // Fetch properties
  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
       let query = supabase.from("properties").select("*");

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
        setProperties(data || []);
      } catch (err) {
        console.error("Error loading properties:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, [filters]);

  if (loading) {
    return (
      <div className="pb-10 relative animate-pulse">
        <h2 className="text-3xl font-semibold mb-4 bg-gray-200 h-8 w-64 rounded"></h2>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Loading unique properties...</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="pb-10 relative">
        <h2 className="text-3xl font-semibold mb-4">Unique Properties</h2>
        <p className="text-gray-600">No unique properties are available right now.</p>
      </div>
    );
  }

  return (
    <div className="pb-10 relative">
      <h2 className="text-3xl font-semibold mb-4">Unique Properties</h2>
      <p className="text-gray-600 mb-6">
        Discover one-of-a-kind properties that stand out from the rest.
      </p>

      <div className="flex justify-between mb-3 px-2">
        <button ref={prevRef} className="px-4 py-2 bg-gray-200 rounded-md">Prev</button>
        <button ref={nextRef} className="px-4 py-2 bg-gray-200 rounded-md">Next</button>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1.2}
        pagination={{ clickable: true }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.8 } }}
        className="pb-10"
      >
        {properties.map((p) => {
          const slug = encodeURIComponent(p.id ?? slugify(p.name || "unique-property"));
          const features = extractPropertyFeatures(p).slice(0, 5);
          const featureBackdrop = resolveFeatureBackdrop(p);
          const propertyId = (p.id ?? slugify(p.name || "unique-property")).toString();

          return (
            <SwiperSlide key={propertyId}>
              <Link
                href={`/components/${slug}`}
                className="group block focus:outline-none focus-visible:ring focus-visible:ring-emerald-200"
                onClick={() => addInterestedProperty(p)}
                style={{ cursor: 'pointer' }}
              >
                <div className="relative h-[420px] w-[300px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-sm">
                <div className="relative w-full h-[220px]">
                  <Image
                    src={p.main_image || '/images/background.jpg'}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-500 "
                  />

                  {/* Genius badge for unauthenticated users */}
                  {!user && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Genius
                    </span>
                  )}

                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${
                      p.status === "free" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3 px-4 py-4">
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">{p.name}</h1>
                    <p className="text-sm font-medium text-gray-500">{p.city}, {p.country}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-md bg-blue-800 px-2 py-1 text-xs font-semibold text-white">
                      {p.overall_rating}
                    </span>
                    <div className="flex flex-col text-xs text-gray-500">
                      <span className="font-medium text-gray-700">Good</span>
                      <span>{p.reviews_count} reviews</span>
                    </div>
                  </div>

                  {user ? (
                    <p className="text-sm text-gray-500">
                      Member price <span className="font-semibold text-gray-900">XAF {p.price}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      From {" "}
                      {p.old_price ? (
                        <>
                          <span className="pr-1 text-xs font-semibold uppercase tracking-wide text-rose-500">Limited</span>
                          <span className="pr-2 text-sm text-rose-400 line-through">XAF {p.old_price}</span>
                        </>
                      ) : null}
                      <span className="font-semibold text-gray-900">XAF {p.price}</span>
                    </p>
                  )}
                </div>

                <div className="absolute right-4 top-4">
                  <FavoriteButton propertyId={propertyId} />
                </div>
                {features.length > 0 && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Image
                      src={featureBackdrop}
                      alt={`${p.name} feature backdrop`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80vw, (max-width: 1024px) 45vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-slate-950/75" />
                    <div className="relative z-10 flex h-full w-full flex-col justify-end gap-3 p-5 text-white">
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
    </div>
  );
}
