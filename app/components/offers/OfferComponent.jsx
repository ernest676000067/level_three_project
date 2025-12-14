"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FALLBACK_IMAGE = "/images/hotel.webp";

export default function OfferComponent() {
  const [offers, setOffers] = useState([]);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const loadOffers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("real_estate_offers")
          .select("id, title, subtitle, description, img, discount_tag")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOffers(data ?? []);
      } catch (error) {
        console.error("Failed to load real estate offers", error);
        setOffers([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadOffers();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="relative mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="mb-1 text-2xl font-bold">Offers</h2>
        <p className="mb-6 text-md text-gray-600">Promotions, deals, and special offers for you</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[0, 1].map((key) => (
            <div key={key} className="h-40 animate-pulse rounded-xl border border-gray-200 bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!offers.length) {
    return (
      <div className="relative mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="mb-1 text-2xl font-bold">Offers</h2>
        <p className="text-md text-gray-600">No promotions are live just yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-10">
      <h2 className="mb-1 text-2xl font-bold">Offers</h2>
      <p className="mb-6 text-md text-gray-600">Promotions, deals, and special offers for you</p>

      <div className="relative">
        <button
          id="offer-prev"
          className={`absolute -left-7 top-2/3 z-30  rounded-full bg-white p-3 shadow-lg  duration-300 md:top-20 ${
            isBeginning ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-label="Previous Offer"
        >
          <GoChevronLeft size={20} className="text-gray-500" />
        </button>

        <button
          id="offer-next"
          className={`absolute -right-7 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg  duration-300 md:top-20 ${
            isEnd ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-label="Next Offer"
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
            nextEl: "#offer-next",
            prevEl: "#offer-prev",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-offer-pagination",
            bulletActiveClass: "bg-blue-600",
            bulletClass: "swiper-pagination-bullet bg-gray-300",
          }}
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 1.8 },
            1024: { slidesPerView: 2 },
          }}
          className="pb-12"
        >
          {offers.map((item) => {
            const href = `/components/${encodeURIComponent(
              item.id ?? slugify(item.subtitle || item.title || "offer")
            )}`;

            return (
              <SwiperSlide key={item.id ?? item.subtitle}>
                <Link
                  href={href}
                  className="group block rounded-xl border border-gray-300 bg-white "
                >
                  <div className="flex min-h-40 gap-4 p-4">
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{item.title}</p>
                        <h3 className="text-lg font-bold text-gray-900">{item.subtitle}</h3>
                        <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                      </div>
                      <span className="mt-2 inline-flex w-fit items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-blue-700">
                        Explore deals
                      </span>
                    </div>

                    <div className="relative h-28 w-32 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={item.img || FALLBACK_IMAGE}
                        alt={item.subtitle || item.title}
                        fill
                        sizes="112px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                      {item.discount_tag ? (
                        <span className="absolute bottom-1 right-2 text-3xl font-extrabold text-blue-600/30">
                          {item.discount_tag}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="swiper-offer-pagination relative z-30 mt-4 flex justify-center" />
      </div>
    </div>
  );
}