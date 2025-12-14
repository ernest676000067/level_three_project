"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaMapMarkerAlt, FaWifi, FaSquarespace, FaStar } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoIosPricetags, IoMdRestaurant, IoIosThumbsUp } from "react-icons/io";
import { PiSwimmingPoolThin, PiShowerLight } from "react-icons/pi";
import { MdOutlineRoomService, MdOutlineDoorbell } from "react-icons/md";
import { TbSmokingNo } from "react-icons/tb";
import { AiOutlineCheckCircle } from "react-icons/ai";
import GuestReviews from "../guest/GuestReviews";
import WhereYoullBeMap from "../WhereYoullBeMap/WhereYoullBeMap";
import MeetYourHost from "../MeetYourHost/MeetYourHost";
import { createClient } from "@/lib/supabase/client";
import { slugify, titleFromSlug } from "@/lib/utils";
import FooterComponent from './../footer/FooterComponent';

const FALLBACK_GALLERY_ALT = "Property gallery image";
const STORAGE_PUBLIC_PREFIX = "/storage/v1/object/public/";
const STORAGE_GALLERY_CACHE = new Map();

const BASE_PROPERTY = {
  name: "Luxury Hotel Residence",
  overall_rating: 7.8,
  reviews_count: 288,
  location_rating: 8.6,
  main_image: "/images/island.webp",
  gallery_images: [
    { url: "/images/inside.webp", alt: "Spacious room" },
    { url: "/images/inside.webp", alt: "Cozy room" },
    { url: "/images/inside.webp", alt: "Hotel lobby" },
    { url: "/images/inside.webp", alt: "Bedroom" },
    { url: "/images/inside.webp", alt: "Exterior" },
    { url: "/images/inside.webp", alt: "Desk area" },
    { url: "/images/inside.webp", alt: "Amenities" },
  ],
  review_summary: "Its location is very central and safe. Internet connection is very good…",
  reviewer_name: "Vincent",
  reviewer_country: "United States",
  city: "Bonapriso",
  country: "Cameroon",
  status: "free",
  price: 183303,
  old_price: 215000,
  description:
    "Thoughtfully curated suites with panoramic city views, concierge service, and dedicated workspace for extended stays.",
  location_description:
    "Magnificent and beautiful place to stay, very central in the heart of Bonapriso with cafés, boutiques, and nightlife within a few minutes walk. Transit and airport connections keep you close to every district of Douala.",
  map_image: "/images/madrid_map_placeholder.png",
  photo_count: 163,
  features: [
    "24/7 monitored security with controlled access",
    "Dedicated concierge to support long-term residents",
    "Private parking and on-site maintenance team",
  ],
};

const RELATED_PROPERTIES = [
  {
    id: "bonapriso-loft",
    name: "Bonapriso Skyline Loft",
    type: "Private residence",
    city: "Bonapriso",
    country: "Cameroon",
    rating: 4.8,
    reviewSummary: "Exceptional",
    reviewsCount: 188,
    price: 166500,
    image: "https://qvuarrcymyczzhlkdnkg.supabase.co/storage/v1/object/public/guest_love_images/bonapriso/image1.jpg",
    features: ["Infinity pool", "Private concierge", "Skyline lounge"],
  },
  {
    id: "akwa-penthouse",
    name: "Akwa Executive Penthouse",
    type: "Luxury penthouse",
    city: "Akwa",
    country: "Cameroon",
    rating: 4.9,
    reviewSummary: "Loved by couples",
    reviewsCount: 241,
    price: 205000,
    image: "https://qvuarrcymyczzhlkdnkg.supabase.co/storage/v1/object/public/weekend_images/akwa/image1.jpg",
    features: ["Panoramic terrace", "Chef's kitchen", "Valet parking"],
  },
  {
    id: "bonanjo-residence",
    name: "Bonanjo Residence & Spa",
    type: "Boutique hotel",
    city: "Bonanjo",
    country: "Cameroon",
    rating: 4.7,
    reviewSummary: "Great for groups",
    reviewsCount: 162,
    price: 189900,
    image: "https://qvuarrcymyczzhlkdnkg.supabase.co/storage/v1/object/public/recomended_images/bonaberi/image1.jpg",
    features: ["Thermal spa", "Executive lounge", "Airport transfers"],
  },
];

const DEFAULT_RATINGS = {
  cleanliness: 5.1,
  accuracy: 4.9,
  checkin: 3.5,
  communication: 4.9,
  location: 4.9,
  value: 4.9,
};

const HIGHLIGHTS = [
  {
    title: "Prime Douala location",
    description: "Stroll to Bonapriso cafés, boutiques, and nightlife in under five minutes.",
  },
  {
    title: "Business ready",
    description: "Dedicated fiber internet, ergonomic workspace, and 24/7 concierge support.",
  },
  {
    title: "Resort-grade wellness",
    description: "On-site spa, indoor lap pool, and private fitness studio reserved for guests.",
  },
];

const AMENITIES = [
  { icon: <FaWifi size={18} />, label: "High-speed Wi-Fi" },
  { icon: <PiSwimmingPoolThin size={18} />, label: "Indoor pool" },
  { icon: <FaSquarespace size={18} />, label: "Spa & sauna" },
  { icon: <MdOutlineRoomService size={18} />, label: "24h room service" },
  { icon: <IoMdRestaurant size={18} />, label: "Chef's kitchen" },
  { icon: <PiShowerLight size={18} />, label: "Rainfall showers" },
  { icon: <MdOutlineDoorbell size={18} />, label: "Smart entry" },
  { icon: <TbSmokingNo size={18} />, label: "Smoke-free suites" },
];

const TABLE_SOURCES = [
  "properties",
  "extra_services",
  "recommended_stays",
  "weekend_deals",
  "homes_guests_love",
  "well_reviewed",
  "property_types",
  "real_estate_offers",
];

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

function deriveFeatures(record) {
  if (!record || typeof record !== "object") return [];

  const collected = PROPERTY_FEATURE_KEYS.flatMap((key) => normalizeFeatureList(record[key]));
  if (collected.length) {
    return Array.from(new Set(collected));
  }

  if (Array.isArray(record.features)) {
    return record.features
      .map((item) => (typeof item === "string" ? item.trim() : item))
      .filter((item) => typeof item === "string" && item.length > 0);
  }

  return [];
}

function deriveStorageContext(imageUrl) {
  if (!imageUrl) return null;
  try {
    const url = new URL(imageUrl);
    const { pathname } = url;
    const index = pathname.indexOf(STORAGE_PUBLIC_PREFIX);
    if (index === -1) return null;
    const relative = pathname.slice(index + STORAGE_PUBLIC_PREFIX.length);
    if (!relative) return null;
    const parts = relative.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const bucket = parts.shift();
    const fileName = parts.pop();
    if (!bucket || !fileName) return null;
    const folder = parts.join("/");
    return { bucket, folder };
  } catch (error) {
    console.warn("Unable to derive storage context", error);
    return null;
  }
}

async function fetchStorageGallery(supabase, record) {
  if (!supabase || !record) return [];

  const candidateUrls = [
    record.gallery_cover,
    record.hero_image,
    record.main_image,
    record.image,
    Array.isArray(record.gallery_images) && record.gallery_images[0]?.url,
    typeof record.gallery === "string" ? record.gallery : null,
  ].filter(Boolean);

  for (const candidate of candidateUrls) {
    const context = deriveStorageContext(candidate);
    if (!context) continue;
    const cacheKey = `${context.bucket}::${context.folder}`;
    if (STORAGE_GALLERY_CACHE.has(cacheKey)) {
      const cached = STORAGE_GALLERY_CACHE.get(cacheKey);
      if (Array.isArray(cached) && cached.length) {
        return cached;
      }
      continue;
    }

    try {
      const { data, error } = await supabase.storage
        .from(context.bucket)
        .list(context.folder, { sortBy: { column: "name", order: "asc" } });

      if (error) {
        console.warn("Failed to list storage folder", context, error);
        STORAGE_GALLERY_CACHE.set(cacheKey, []);
        continue;
      }

      const images = (data || [])
        .filter((item) => item && typeof item.name === "string" && !item.name.endsWith("/"))
        .map((item) => {
          const path = context.folder ? `${context.folder}/${item.name}` : item.name;
          const { data: publicData } = supabase.storage.from(context.bucket).getPublicUrl(path);
          return publicData?.publicUrl ?? null;
        })
        .filter(Boolean)
        .map((url) => ({ url, alt: FALLBACK_GALLERY_ALT }));

      if (images.length) {
        STORAGE_GALLERY_CACHE.set(cacheKey, images);
        return images;
      }

      STORAGE_GALLERY_CACHE.set(cacheKey, []);
    } catch (error) {
      console.warn("Error while fetching storage gallery", error);
    }
  }

  return [];
}

function normalizeRecord(record) {
  if (!record) return null;

  const resolvedName =
    record.name || record.property_name || record.title || BASE_PROPERTY.name;
  const resolvedCity = record.city ?? BASE_PROPERTY.city;
  const resolvedCountry = record.country ?? BASE_PROPERTY.country;

  const resolvedImage =
    record.main_image ||
    record.image ||
    record.img ||
    (Array.isArray(record.gallery_images) && record.gallery_images[0]?.url) ||
    BASE_PROPERTY.main_image;

  // For extra_services, prefer images array for gallery
  let gallerySource =
    record.gallery_images ??
    record.gallery ??
    record.image_gallery ??
    record.photo_gallery ??
    record.media ??
    record.photos;

  // If images array exists and is non-empty, use it as gallery
  if (Array.isArray(record.images) && record.images.length > 0) {
    gallerySource = record.images;
  }

  const normalizedGallery = buildGallery(gallerySource, resolvedImage, resolvedName);
  const resolvedFeatures = deriveFeatures(record);
  const resolvedPrice =
    record.price ??
    record.starting_price ??
    record.starting_price_signed_in ??
    BASE_PROPERTY.price;

  return {
    ...BASE_PROPERTY,
    ...record,
    id: record.id ?? slugify(resolvedName),
    name: resolvedName,
    city: resolvedCity,
    country: resolvedCountry,
    main_image: resolvedImage,
    gallery_images: normalizedGallery,
    overall_rating: record.overall_rating ?? record.rating ?? BASE_PROPERTY.overall_rating,
    reviews_count: record.reviews_count ?? record.review_count ?? BASE_PROPERTY.reviews_count,
    review_summary:
      record.review_summary ||
      record.subtitle ||
      record.deal_type ||
      BASE_PROPERTY.review_summary,
    status:
      record.status ||
      record.availability_status ||
      record.mode ||
      BASE_PROPERTY.status,
    price: resolvedPrice,
    old_price: BASE_PROPERTY.old_price,
    location_rating: record.location_rating ?? record.rating ?? BASE_PROPERTY.location_rating,
    description: record.description || BASE_PROPERTY.description,
    location_description: record.location_description || BASE_PROPERTY.location_description,
    map_image: record.map_image || BASE_PROPERTY.map_image,
    photo_count: record.photo_count || BASE_PROPERTY.photo_count,
    features: resolvedFeatures.length ? resolvedFeatures : BASE_PROPERTY.features,
  };
}

function buildGallery(gallery, fallbackImage, name) {
  if (Array.isArray(gallery) && gallery.length) {
    return gallery
      .map((item) => {
        if (!item) return null;
        if (typeof item === "string") {
          return { url: item, alt: `Photo of ${name ?? "property"}` };
        }
        if (typeof item === "object") {
          const url = item.url || item.image_url || item.src || item.path || item.image || item.photo_url;
          if (!url) return null;
          return { url, alt: item.alt || `Photo of ${name ?? "property"}` };
        }
        return null;
      })
      .filter(Boolean);
  }

  if (typeof gallery === "string" && gallery.trim()) {
    const trimmed = gallery.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return buildGallery(parsed, fallbackImage, name);
        }
        if (parsed && typeof parsed === "object") {
          const candidate = parsed.images || parsed.gallery || parsed.data;
          if (candidate) {
            return buildGallery(candidate, fallbackImage, name);
          }
          if (parsed.url) {
            return [{ url: parsed.url, alt: parsed.alt || `Photo of ${name ?? "property"}` }];
          }
        }
      } catch (error) {
        console.warn("Failed to parse gallery string", error);
      }
    }

    return trimmed
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url) => ({ url, alt: `Photo of ${name ?? "property"}` }));
  }

  if (gallery && typeof gallery === "object") {
    const candidate = gallery.images || gallery.gallery || gallery.data || gallery.items;
    if (candidate) {
      return buildGallery(candidate, fallbackImage, name);
    }
  }

  if (fallbackImage) {
    return [{ url: fallbackImage, alt: `Hero image of ${name ?? "property"}` }];
  }

  return BASE_PROPERTY.gallery_images;
}

function deriveRatings(record) {
  if (!record) return DEFAULT_RATINGS;
  const candidates = {
    cleanliness: record.cleanliness ?? record.cleanliness_rating,
    accuracy: record.accuracy ?? record.accuracy_rating,
    checkin: record.checkin ?? record.checkin_rating,
    communication: record.communication ?? record.communication_rating,
    location: record.location_rating ?? record.location,
    value: record.value ?? record.value_rating,
  };

  return Object.entries(DEFAULT_RATINGS).reduce((acc, [key, fallback]) => {
    const value = Number(candidates[key]);
    acc[key] = Number.isFinite(value) ? value : fallback;
    return acc;
  }, {});
}

export default function PropertyPage() {
  const params = useParams();
  const slugParam = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const supabase = useMemo(() => createClient(), []);

  const fallbackProperty = useMemo(() => {
    const humanName = titleFromSlug(slugParam) || BASE_PROPERTY.name;
    return {
      ...BASE_PROPERTY,
      id: slugParam ?? slugify(BASE_PROPERTY.name),
      name: humanName,
    };
  }, [slugParam]);

  const [property, setProperty] = useState(fallbackProperty);
  const [ratings, setRatings] = useState(DEFAULT_RATINGS);
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [inquiryStatus, setInquiryStatus] = useState({ state: "idle" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProperty(fallbackProperty);
    setRatings(DEFAULT_RATINGS);
    setIsLoading(true);
  }, [fallbackProperty]);

  useEffect(() => {
    let isActive = true;

    if (!slugParam) {
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    const fetchProperty = async () => {
      for (const table of TABLE_SOURCES) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select("*")
            .eq("id", slugParam)
            .maybeSingle();

          if (error && error.code !== "PGRST116") {
            console.warn(`Failed to query ${table}`, error);
            continue;
          }

          if (data) {
            if (!isActive) return;
            const storageGallery = await fetchStorageGallery(supabase, data);
            const recordWithGallery = storageGallery.length
              ? { ...data, gallery_images: storageGallery }
              : data;
            const normalized = normalizeRecord(recordWithGallery);
            setProperty(normalized ?? fallbackProperty);
            setRatings(deriveRatings(data));
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.warn(`Error fetching ${table}`, error);
        }
      }

      if (isActive) {
        setProperty(fallbackProperty);
        setRatings(DEFAULT_RATINGS);
        setIsLoading(false);
      }
    };

    void fetchProperty();

    return () => {
      isActive = false;
    };
  }, [fallbackProperty, slugParam, supabase]);

  useEffect(() => {
    if (isGalleryOpen) {
      setInquiryStatus({ state: "idle" });
    }
  }, [isGalleryOpen]);

  const normalizedGallery = useMemo(() => {
    return buildGallery(property.gallery_images, property.main_image, property.name);
  }, [property.gallery_images, property.main_image, property.name]);

  const [primary, secondary, tertiary, ...thumbnails] = normalizedGallery;
  const heroImage = property.main_image || primary?.url || "/images/island.webp";
  const propertyFeatures = Array.isArray(property.features) ? property.features.filter(Boolean) : [];

  const modalImages = useMemo(() => {
    const base = normalizedGallery.length
      ? normalizedGallery
      : [{ url: heroImage, alt: FALLBACK_GALLERY_ALT }];

    return base
      .filter((item) => item && item.url)
      .map((item) => ({
        url: item.url,
        alt: item.alt || FALLBACK_GALLERY_ALT,
      }));
  }, [heroImage, normalizedGallery]);

  const photoCount = Number(property.photo_count) || modalImages.length || BASE_PROPERTY.photo_count;
  const heroScore = Number(property.overall_rating) || 0;

  const handleOpenGallery = (index = 0) => {
    setActiveSlide(index);
    setGalleryOpen(true);
  };

  const handleNavigateGallery = (step) => {
    if (!modalImages.length) return;
    setActiveSlide((previous) => {
      const total = modalImages.length;
      return (previous + step + total) % total;
    });
  };

  const handleSelectImage = (index) => {
    setActiveSlide(index);
  };

  const handleSubmitInquiry = async (payload) => {
    setInquiryStatus({ state: "loading" });
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      console.log("Inquiry submitted", {
        property: property.name,
        propertyId: property.id ?? property.name,
        ...payload,
      });
      setInquiryStatus({
        state: "success",
        message: "Your message was shared with our dashboard team. They'll reach out shortly.",
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to submit inquiry", error);
      setInquiryStatus({
        state: "error",
        message: "We couldn't send your note. Please try again in a moment.",
      });
      return { success: false };
    }
  };

  return (
    <div className="bg-white">
      {isLoading ? (
        <div className="bg-emerald-50/60 text-center text-sm text-emerald-700 py-2">
          Loading property details…
        </div>
      ) : null}

      <HeroBanner
        data={property}
        heroImage={heroImage}
        overall={heroScore}
        onOpenGallery={handleOpenGallery}
        photoCount={photoCount}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-12 md:px-6 lg:px-8">
        <Gallery
          property={property}
          primary={primary}
          secondary={secondary}
          tertiary={tertiary}
          thumbnails={thumbnails}
          onOpenModal={handleOpenGallery}
          modalImages={modalImages}
          photoCount={photoCount}
        />

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-10">
            <Highlights data={HIGHLIGHTS} />
            <Description data={property} />
            <ExperienceRatings ratings={ratings} />
            <AmenitiesGrid amenities={AMENITIES} />
          </div>
          <BookingSummary data={property} features={propertyFeatures} />
        </section>

        <StayEssentials />
        <WhereYoullBeMap
          location={{
            city: [property.city, property.country].filter(Boolean).join(", ") || BASE_PROPERTY.city,
            description:
              property.location_description ||
              "Magnificent and beautiful place to stay, very central in the heart of Bonapriso with cafés, boutiques, and nightlife within moments.",
            mapImageSrc: property.map_image,
          }}
        />
        <RelatedResidences properties={RELATED_PROPERTIES} />
      </main>

      <div className="space-y-16 pb-20">
        <GuestReviews />
        <MeetYourHost />
      </div>

      <GalleryModal
        open={isGalleryOpen}
        images={modalImages}
        activeIndex={activeSlide}
        onClose={() => setGalleryOpen(false)}
        onSelect={handleSelectImage}
        onNavigate={handleNavigateGallery}
        data={property}
        onSubmitInquiry={handleSubmitInquiry}
        inquiryStatus={inquiryStatus}
      />
    </div>
  );
}

function HeroBanner({ data, heroImage, overall, onOpenGallery, photoCount = 0 }) {
  const formattedReviews = new Intl.NumberFormat().format(Number(data.reviews_count) || 0);
  const ratingScore = Number(overall) || 0;
  const locationLabel = [data.city, data.country].filter(Boolean).join(", ");
  const descriptionFallback =
    data.description ||
    "Experience a tailored hideaway with curated interiors, five-star amenities, and concierge service crafted for extended stays.";
  return (
    <header className="relative overflow-hidden bg-slate-900 text-white">
      <div className="absolute inset-0">
        <Image src={heroImage} alt={data.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-slate-900/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-14 md:px-6 lg:px-8 lg:py-20">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-white/70">
          <Link href="/" className="hover:text-white">
            Overview
          </Link>
          <span>/</span>
          <Link href="/homes" className="hover:text-white">
            Homes
          </Link>
          <span>/</span>
          <span className="truncate text-white/90">{data.name}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
              <FaMapMarkerAlt className="text-emerald-300" />
              <span>{locationLabel || "Douala, Cameroon"}</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:inline-flex" />
              <span>Entire serviced residence</span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {data.name}
            </h1>

            <p className="max-w-2xl text-base text-white/80 sm:text-lg">{descriptionFallback}</p>

            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-sm">
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white">
                  {ratingScore.toFixed(2)}
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold">Exceptional</span>
                  <span className="text-white/70">{formattedReviews} verified reviews</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-white/80">
                <IoIosPricetags />
                <span>Best price guarantee</span>
              </div>

              {typeof onOpenGallery === "function" && photoCount > 0 && (
                <button
                  type="button"
                  onClick={() => onOpenGallery(0)}
                  className="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-white hover:text-white"
                >
                  +{photoCount} photos
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white hover:text-white">
              <IoShareSocialOutline className="mr-2 inline" /> Share
            </button>
            <button className="rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white hover:text-white">
              <FaHeart className="mr-2 inline" /> Save
            </button>
            <button className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600">
              Reserve now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Gallery({ property, primary, secondary, tertiary, thumbnails, onOpenModal, modalImages, photoCount = 0 }) {
  const resolveModalIndex = (image, fallback = 0) => {
    const url = typeof image === "string" ? image : image?.url;
    if (!url || !Array.isArray(modalImages)) return fallback;
    const index = modalImages.findIndex((img) => img.url === url);
    return index >= 0 ? index : fallback;
  };
  const totalPhotos = photoCount || (Array.isArray(modalImages) ? modalImages.length : 0);

  // Always use main_image from Supabase for hero image
  const heroImage = property?.main_image || primary?.url || modalImages?.[0]?.url;
  const sideImages = [secondary, tertiary].filter(Boolean);

  const desiredThumbnailSlots = 6;
  const rawThumbnails = Array.isArray(thumbnails) ? thumbnails : [];
  const paddedThumbnails = rawThumbnails.slice(0, desiredThumbnailSlots);
  while (paddedThumbnails.length < desiredThumbnailSlots) {
    paddedThumbnails.push(null);
  }

  const displayedThumbnailCount = Math.min(rawThumbnails.length, desiredThumbnailSlots);
  const revealedCount = 1 + sideImages.length + displayedThumbnailCount;
  const extraPhotos = Math.max(totalPhotos - revealedCount, 0);
  const firstHiddenModalIndex = Math.min(
    Math.max(revealedCount, 0),
    Math.max(modalImages.length - 1, 0)
  );

  const renderPreview = (image, buttonIndex, fallbackLabel, sizeHint = "(max-width: 1024px) 50vw, 25vw") => {
    const imageSrc = typeof image === "string" ? image : image?.url;
    const imageAlt = dataFallbackAlt(image);

    if (!imageSrc) {
      return (
        <div className="flex h-full items-center justify-center rounded-2xl bg-slate-100 text-xs font-medium text-slate-400">
          {fallbackLabel}
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onOpenModal?.(resolveModalIndex(image, buttonIndex))}
        className="relative h-full w-full overflow-hidden rounded-2xl"
      >
        <span className="sr-only">Open gallery image</span>
        <Image src={imageSrc} alt={imageAlt} fill quality={100} priority={buttonIndex === 0} sizes={sizeHint} className="object-cover" />
      </button>
    );
  };

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="relative h-[420px] overflow-hidden rounded-3xl bg-white">
          {renderPreview(heroImage, 0, "Preview coming soon", "(max-width: 1024px) 100vw, 70vw")}
          {totalPhotos > 0 && (
            <button
              type="button"
              onClick={() => onOpenModal?.(0)}
              className="absolute right-5 top-5 z-10 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-900 shadow-lg transition hover:bg-white"
            >
              View all {totalPhotos}+
            </button>
          )}
        </div>

        <div className="grid h-[420px] grid-rows-2 gap-4">
          {renderPreview(sideImages[0], 1, "Awaiting photo", "(max-width: 1024px) 40vw, 20vw")}
          {renderPreview(sideImages[1], 2, "Awaiting photo", "(max-width: 1024px) 40vw, 20vw")}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {paddedThumbnails.map((image, index) => {
          const rawImage = rawThumbnails[index];
          const imageSrc = typeof image === "string" ? image : image?.url;
          const imageAlt = dataFallbackAlt(image);
          const key = imageSrc ? `${imageSrc}-${index}` : `placeholder-${index}`;
          const fallbackHeroSrc =
            typeof heroImage === "string"
              ? heroImage
              : heroImage && typeof heroImage === "object"
              ? heroImage.url
              : "/images/island.webp";
          const modalIndex = rawImage
            ? resolveModalIndex(rawImage, index + 3)
            : firstHiddenModalIndex;

          return (
            <div key={key} className="relative h-32 overflow-hidden rounded-2xl">
              <button
                type="button"
                onClick={() => onOpenModal?.(modalIndex)}
                className="relative h-full w-full overflow-hidden rounded-2xl"
              >
                <span className="sr-only">Open gallery thumbnail {index + 1}</span>
                <Image
                  src={imageSrc || fallbackHeroSrc}
                  alt={imageAlt}
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 40vw, 12vw"
                  className="object-cover"
                />
              </button>
              {index === paddedThumbnails.length - 1 && extraPhotos > 0 && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-900/60 text-sm font-semibold text-white">
                  +{extraPhotos} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Highlights({ data }) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Why guests choose this stay</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {data.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex rounded-full bg-emerald-50 p-2 text-emerald-600">
              <AiOutlineCheckCircle size={18} />
            </div>
            <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Description({ data }) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">About this residence</h2>
      <div className="space-y-4 text-sm leading-relaxed text-slate-600">
        <p>
          {data.description ||
            "This thoughtfully curated property pairs five-star amenities with the privacy of a boutique home. Suites open onto a lush skyline terrace, while the concierge team coordinates airport transfers, private chefs, and Douala discovery itineraries on request."}
        </p>
        <p>
          Each bedroom features soundproof glazing, adaptive lighting, and made-to-order artisan bedding. Guests enjoy access to the resident lounge, business pod, and signature wellness circuit designed for restorative stays.
        </p>
        <ul className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
          {[
            "Complimentary airport pickup & drop-off",
            "Dedicated lifestyle concierge",
            "Daily housekeeping & turndown service",
            "Secure underground parking",
          ].map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <AiOutlineCheckCircle className="mt-1 text-emerald-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ExperienceRatings({ ratings }) {
  const entries = Object.entries(ratings || {});
  if (!entries.length) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Guest experience scores</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {entries.map(([label, value]) => {
          const score = Number(value) || 0;
          const percentage = Math.min((score / 6) * 100, 100);
          return (
            <div key={label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                <span className="capitalize">{label}</span>
                <span className="text-slate-900">{score.toFixed(1)}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AmenitiesGrid({ amenities }) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Amenities tailored for long stays</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((amenity) => (
          <div
            key={amenity.label}
            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              {amenity.icon}
            </span>
            <span className="text-sm font-medium text-slate-700">{amenity.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BookingSummary({ data, features = [] }) {
  const nightlyRate = Number(data.price);
  const formattedPrice = Number.isFinite(nightlyRate)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
      }).format(nightlyRate)
    : "—";
  const status = (data.status || "").toLowerCase() === "free" ? "Available" : "Temporarily booked";
  const sentimentScore = Number(data.overall_rating) || 0;
  const locationScore = Number(data.location_rating) || 0;

  return (
    <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 lg:sticky lg:top-28">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wide text-slate-400">Nightly from</span>
          <p className="text-2xl font-semibold text-slate-900">{formattedPrice}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            status === "Available" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Flexible cancellation</span>
          <span className="font-medium text-slate-900">48 hrs</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Minimum rentage</span>
          <span className="font-medium text-slate-900">3 years</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Check-in / Check-out</span>
          <span className="font-medium text-slate-900">14:00 / 11:00</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Guest score</span>
          <span className="font-medium text-slate-900">{sentimentScore.toFixed(1)} / 10</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Location rating</span>
          <span className="font-medium text-slate-900">{locationScore.toFixed(1)} / 10</span>
        </div>
      </div>

      {features.length > 0 && (
        <div className="mt-6 rounded-2xl bg-slate-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Included features</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {features.slice(0, 6).map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <AiOutlineCheckCircle className="mt-0.5 text-emerald-500" size={14} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="mt-6 w-full rounded-full bg-emerald-500 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600">
        Start reservation
      </button>
      <div className="mt-5 space-y-3 text-xs text-slate-500">
        <p className="text-center">No booking fees. Instant confirmation once your stay is approved.</p>
        {data.review_summary && (
          <blockquote className="rounded-2xl bg-slate-50 p-3 text-left text-slate-600">
            "{data.review_summary}"
            <span className="mt-2 block text-xs font-semibold text-slate-500">— {data.reviewer_name || "Recent guest"}</span>
          </blockquote>
        )}
      </div>
    </aside>
  );
}

function GalleryModal({
  open,
  images = [],
  activeIndex = 0,
  onClose,
  onSelect,
  onNavigate,
  data,
  onSubmitInquiry,
  inquiryStatus,
}) {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [message, setMessage] = useState("");
  const status = inquiryStatus?.state ?? "idle";
  const feedback = inquiryStatus?.message ?? "";
  const activeImage = images[activeIndex] || images[0];

  useEffect(() => {
    if (!open) {
      setGuestName("");
      setGuestEmail("");
      setMessage("");
    }
  }, [open]);

  useEffect(() => {
    if (status === "success") {
      setMessage("");
    }
  }, [status]);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (typeof onSubmitInquiry !== "function") return;
    if (!message.trim()) {
      return;
    }
    const payload = {
      name: guestName.trim(),
      email: guestEmail.trim(),
      message: message.trim(),
    };
    const result = await onSubmitInquiry(payload);
    if (result?.success) {
      setGuestName("");
      setGuestEmail("");
      setMessage("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-10" role="dialog" aria-modal="true">
      <div className="relative flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-30 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-slate-600 shadow hover:bg-white"
          aria-label="Close gallery"
        >
          Close
        </button>

        <div className="grid gap-6 overflow-y-auto p-6 lg:grid-cols-[3fr,2fr] lg:gap-10">
          <div className="flex flex-col gap-4">
            <div className="relative h-80 overflow-hidden rounded-3xl bg-slate-100 sm:h-[420px]">
              {activeImage ? (
                <Image
                  key={`${activeImage.url}-${activeIndex}`}
                  src={activeImage.url}
                  alt={activeImage.alt || data?.name || "Property image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 80vw, 55vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">No imagery available yet.</div>
              )}

              {images.length > 1 && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
                  <button
                    type="button"
                    onClick={() => onNavigate?.(-1)}
                    className="pointer-events-auto rounded-full bg-white/80 p-2 text-slate-700 shadow hover:bg-white"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(1)}
                    className="pointer-events-auto rounded-full bg-white/80 p-2 text-slate-700 shadow hover:bg-white"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {images.map((img, index) => (
                  <button
                    key={`${img.url}-${index}`}
                    type="button"
                    onClick={() => onSelect?.(index)}
                    className={`group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border transition ${
                      index === activeIndex ? "border-emerald-500 shadow" : "border-transparent"
                    }`}
                    aria-label={`Show image ${index + 1}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `Property image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 45vw, (max-width: 1024px) 22vw, 15vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5 rounded-3xl border border-slate-100 bg-slate-50/60 p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">See the full portfolio</h3>
              <p className="mt-2 text-sm text-slate-600">
                Preview every suite, amenities, and floorplan. Leave a note for our dashboard team and we'll respond with tailored availability and pricing.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="gallery-name" className="text-xs font-medium text-slate-600">
                    Your name
                  </label>
                  <input
                    id="gallery-name"
                    type="text"
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    placeholder="Ndedi Alain"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="gallery-email" className="text-xs font-medium text-slate-600">
                    Email (optional)
                  </label>
                  <input
                    id="gallery-email"
                    type="email"
                    value={guestEmail}
                    onChange={(event) => setGuestEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="gallery-message" className="text-xs font-medium text-slate-600">
                  Message for dashboard admin
                </label>
                <textarea
                  id="gallery-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  minLength={12}
                  placeholder={`Hi team, I'm interested in ${data?.name}. Could you share availability for next month?`}
                  className="h-32 w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-emerald-500 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-400"
              >
                {status === "loading" ? "Sending..." : "Send message to admin"}
              </button>
            </form>

            {feedback && (
              <p className={`text-sm ${status === "success" ? "text-emerald-600" : "text-rose-500"}`}>{feedback}</p>
            )}

            <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-inner">
              <p className="font-semibold text-slate-900">Property reference</p>
              <p className="mt-1 text-slate-600">{data?.name}</p>
              <p className="text-xs text-slate-400">
                ID: {data?.id ?? data?.slug ?? data?.name?.toLowerCase().replace(/\s+/g, "-")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StayEssentials() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/5 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Planning a group getaway?</h2>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300">
            Request custom itinerary
          </button>
        </div>
        <p className="mt-4 max-w-3xl text-sm text-slate-600">
          Our concierge team can curate airport transfers, private chefs, and experience-led itineraries for families or corporate retreats. Let us tailor the stay around your group's pace.
        </p>
      </div>
    </section>
  );
}

function dataFallbackAlt(image) {
  if (!image) return "Property view";
  if (typeof image === "string") return "Property view";
  return image.alt || "Property view";
}

function RelatedResidences({ properties = [] }) {
  if (!properties.length) return null;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Related residences</h2>
        <Link href="/homes" className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700">
          Browse all homes
        </Link>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4">
        {properties.map((property) => {
          const formattedPrice = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "XAF",
            maximumFractionDigits: 0,
          }).format(property.price);

          const reviewsLabel = property.reviewsCount
            ? `${property.reviewsCount} reviews`
            : "Be the first to stay";

          return (
            <Link
              key={property.id}
              href={`/components/${encodeURIComponent(property.id)}`}
              className="group relative flex w-[300px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring focus-visible:ring-emerald-200"
            >
              <div className="relative h-[205px] w-full">
                <Image
                  src={property.image || "/images/island.webp"}
                  alt={property.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 45vw, 22vw"
                />
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className="rounded-md bg-blue-800 px-2 py-0.5 text-xs font-semibold text-white">
                    {property.rating.toFixed(1)}
                  </span>
                  <span className="rounded-sm bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {property.reviewSummary || "Guest favorite"}
                  </span>
                </div>
              </div>

              <div className="flex h-[210px] flex-col justify-between p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{property.type}</span>
                    <span className="inline-flex items-center gap-1 rounded-sm bg-slate-100 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-600">
                      <IoIosThumbsUp size={12} /> Verified stay
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{property.name}</h3>
                  <p className="text-sm text-slate-600">
                    {property.city}, {property.country}
                  </p>
                  <div className="text-xs text-slate-500">{reviewsLabel}</div>
                </div>

                {Array.isArray(property.features) && property.features.length > 0 && (
                  <ul className="space-y-1 text-xs text-slate-500">
                    {property.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Starting from</span>
                  <span className="text-base font-semibold text-slate-900">{formattedPrice}</span>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition group-hover:border-emerald-200" />
            </Link>
          );
        })}
      </div>
      
    </section>
    
  );
}
