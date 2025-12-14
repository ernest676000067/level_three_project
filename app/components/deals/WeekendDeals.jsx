"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchStore } from "@/store/SearchStore";
import Image from "next/image";
import Link from "next/link";
import { CiHeart } from "react-icons/ci";
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

const WEEKEND_FEATURE_KEYS = [
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

const WEEKEND_FEATURE_VALUE_KEYS = ["label", "title", "name", "description", "value", "text"];

function normalizeWeekendFeatures(source) {
  if (!source) return [];

  if (Array.isArray(source)) {
    return source
      .flatMap((entry) => normalizeWeekendFeatures(entry))
      .map((item) => (typeof item === "string" ? item.trim() : item))
      .filter((item) => typeof item === "string" && item.length > 0);
  }

  if (typeof source === "string") {
    const trimmed = source.trim();
    if (!trimmed) return [];

    if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeWeekendFeatures(parsed);
      } catch (error) {
        console.warn("Unable to parse weekend deal feature string", error);
      }
    }

    return trimmed
      .split(/[•,|\n]/)
      .map((segment) => segment.trim())
      .filter(Boolean);
  }

  if (typeof source === "object") {
    for (const key of WEEKEND_FEATURE_KEYS) {
      if (key in source) {
        const extracted = normalizeWeekendFeatures(source[key]);
        if (extracted.length) return extracted;
      }
    }

    for (const key of WEEKEND_FEATURE_VALUE_KEYS) {
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

function extractWeekendFeatures(deal) {
  if (!deal || typeof deal !== "object") return [];
  const collected = WEEKEND_FEATURE_KEYS.flatMap((key) => normalizeWeekendFeatures(deal[key]));
  if (collected.length) {
    return Array.from(new Set(collected));
  }
  return [];
}

function resolveFeatureBackdrop(deal) {
  if (!deal || typeof deal !== "object") return FEATURE_BACKDROP_FALLBACK;
  return (
    deal.feature_backdrop ||
    deal.feature_image ||
    deal.cover_image ||
    deal.main_image ||
    FEATURE_BACKDROP_FALLBACK
  );
}

export default function WeekendDeals() {
  const [deals, setDeals] = useState([]);
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
    const loadDeals = async () => {
      try {
        const { data, error } = await supabase
          .from("weekend_deals")
          .select(
            "id, title, subtitle, is_genius, property_name, city, country, rating, review_summary, reviews_count, deal_type, starting_price, main_image, availability_status, features"
          )
          .order("created_at", { ascending: false });

        if (error) throw error;
        setDeals(data ?? []);
      } catch (err) {
        console.error("Failed to load weekend deals", err);
        setDeals([]);
      }
    };

    void loadDeals();
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

  // Filter deals by useSearchStore filters (like UniqueProperty)
  const filteredDeals = deals.filter((deal) => {
    // Location
    if (filters.location && !deal.city?.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    // Type
    if (filters.propertyType && deal.type !== filters.propertyType) {
      return false;
    }
    // Status
    if (filters.status && deal.availability_status !== filters.status) {
      return false;
    }
    // Features
    if (filters.feature && !String(deal.features).toLowerCase().includes(filters.feature.toLowerCase())) {
      return false;
    }
    // General search (name/city/country)
    if (filters.search && !(
      deal.property_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      deal.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      deal.city?.toLowerCase().includes(filters.search.toLowerCase()) ||
      deal.country?.toLowerCase().includes(filters.search.toLowerCase())
    )) {
      return false;
    }
    return true;
  });

  if (!filteredDeals.length) {
    return (
      <div className="w-full max-w-7xl mx-auto py-4 px-4">
        <h2 className="text-3xl font-semibold mb-2">Deals for the weekend</h2>
        <p className="text-gray-600">No weekend deals match your filters.</p>
      </div>
    );
  }
    
  return (
   <div className="w-full max-w-7xl mx-auto py-4 px-4">
      <h2 className="text-3xl font-semibold mb-2">Deals for the weekend</h2>
      <p className="text-gray-600 mb-6">Save on stays for December 5 - December 7</p>

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
            1024: { slidesPerView: 3.5 },
          }}
          className="pb-12" // Add padding at the bottom for the dots
        >
          {filteredDeals.map((deal) => {
            const formattedPrice = formatPrice(deal.starting_price);
            const href = `/components/${encodeURIComponent(
              deal.id ?? slugify(deal.property_name || deal.title || "deal")
            )}`;
            const features = extractWeekendFeatures(deal).slice(0, 6);
            const featureBackdrop = resolveFeatureBackdrop(deal);

            return (
            <SwiperSlide key={deal.id}>
              <Link
                href={href}
                className="group block focus:outline-none focus-visible:ring focus-visible:ring-emerald-200"
              >
                <div className="w-[300px] h-[405px] border border-gray-200 rounded-lg overflow-hidden shadow-md transition hover:-translate-y-0.5 hover:shadow-lg relative bg-white">

                {/* Image */}
                <div className="w-full h-[205px] relative">
                  <Image
                    src={deal.main_image || FALLBACK_IMAGE}
                    alt={deal.property_name}
                    fill
                    className="object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Card body */}
                <div>
                  {/* Stars */}
                  {/* ICONS (dynamic) */}
                <div className="flex items-center gap-1 py-3 pl-2">
                   <span className="text-sm text-gray-700">{deal.title}</span>
                    <IoIosThumbsUp size={15} className="text-yellow-400" />
                    {deal.is_genius && !user ? (
                     <span className="bg-blue-700 text-white text-sm px-1 py-.5 rounded-sm">Genius</span>
                    ) : null}
                    </div>


                  {/* Name */}
                  <h1 className="px-2 text-lg font-bold">{deal.property_name}</h1>
                  <p className="text-sm px-2">
                    {deal.city}, {deal.country}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center px-2 gap-2 mt-1">
                    <span className="bg-blue-800 text-white px-2 py-0.5 rounded-md text-sm font-semibold">
                      {deal.rating}
                    </span>
                    <span className="text-sm">{deal.review_summary}</span>
                    {deal.reviews_count ? (
                      <span className="text-xs text-slate-500">{deal.reviews_count} reviews</span>
                    ) : null}
                  </div>

                  {/* Black Friday */}
                  <div className="py-2 px-2">
                    
                    <span className="text-sm py-1 px-1  gap-2 bg-black/60 text-white  rounded-sm">
                        {deal.deal_type}
                    </span>
                    {deal.availability_status ? (
                      <span
                        className={`ml-2 rounded-sm px-2 py-0.5 text-xs font-semibold uppercase ${
                          deal.availability_status.toLowerCase() === "free"
                            ? "bg-lime-400 text-slate-900"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {deal.availability_status}
                      </span>
                    ) : null}
                  </div>

                  {/* Price */}
                  <div className="py-1 flex justify-end px-3">
                    <p>
                      Starting from{" "}
                      <span className="text-lg font-semibold">
                        {formattedPrice ?? "Pricing unavailable"}
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
                      alt={`${deal.property_name} feature backdrop`}
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
          )})}
          {/* Pagination container */}
        <div className="swiper-offer-pagination mt-4 flex justify-center z-30 relative" />
      
        </Swiper>

        


      </div>
    </div>
  )
}
