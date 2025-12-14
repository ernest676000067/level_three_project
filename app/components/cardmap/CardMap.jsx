import Image from 'next/image';
import React from 'react';
import { MdOutlineConfirmationNumber } from 'react-icons/md';
import { BsPercent } from 'react-icons/bs';
import { LuUmbrella } from 'react-icons/lu';
import { useSearchStore } from "@/store/SearchStore";
import Link from 'next/link';

// --- Data ---
const RENTAL_LOCATIONS = [
  { country: 'Spain', rentals: '166,514', img: '/images/hotel.webp' },
  { country: 'Italy', rentals: '179,454', img: '/images/italy-rental.jpg' },
  { country: 'France', rentals: '181,734', img: '/images/france-rental.jpg' },
  { country: 'Greece', rentals: '60,580', img: '/images/greece-rental.jpg' },
  { country: 'Switzerland', rentals: '14,211', img: '/images/switzerland-rental.jpg' },
];

const BOOKING_BENEFITS = [
  {
    title: 'No hidden fees',
    icon: '/images/lock.png',
    description: 'The price you see is the price you pay.',
  },
  {
    title: 'Instant confirmation',
    icon: '/images/phone.png',
    description: 'Most stays can be booked instantly.',
  },
  {
    title: 'Flexibility',
    icon: '/images/chair.png',
    description: 'Many properties offer free cancellation.',
  },
];

// --- Component Start ---

/**
 * Renders the section featuring rental locations and booking benefits 
 * with a subtle map background.
 */
export default function CardMap() {
  const addInterestedProperty = useSearchStore((state) => state.addInterestedProperty);

  return (
    <div className="relative w-full py-16 overflow-hidden mt-5">
      
      {/* Subtle Map Background Image (Absolute Position) */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <Image
          src="/images/map1.jpg" 
          alt="World Map Background"
          fill
          className="object-contain"
        />
      </div>

      {/* Main Content Container (Relative Z-index to sit on top) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Feel at home wherever you go
        </h2>

        {/* --- 1. Rental Locations Grid (FIXED FOR SCROLLING) --- */}
        {/* Outer Container: Handles the scrolling */}
        <div className="overflow-x scrollbar-hide pb-4 mb-20"> 
          {/* Inner Container: Defines the layout (Flex on mobile, Grid on MD/LG) */}
          <div className="flex space-x-6 md:grid md:grid-cols-5 md:gap-6 justify-items-center items-start w-max md:w-full">
            {RENTAL_LOCATIONS.map((location, index) => {
              let offsetClass = '';
              // Apply a margin-top to specific cards to push them down on desktop
              if (index === 1 || index === 3) {
                offsetClass = 'md:mt-12';
              }
              const href = `/components/${encodeURIComponent(location.country)}`;
              return (
                <Link
                  href={href}
                  key={location.country}
                  className={`shrink-0 w-full max-w-[180px] lg:max-w-[210px]  bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 ${offsetClass}`}
                  onClick={() => addInterestedProperty(location)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Image Area */}
                  <div className="relative w-full h-32">
                    <Image
                      src={location.img}
                      alt={location.country}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="p-3">
                    <h3 className="text-lg font-semibold text-gray-900">{location.country}</h3>
                    <p className="text-sm text-gray-500">{location.rentals} vacation rentals</p>
                  </div>

                  {/* Button */}
                  <div className="p-3 pt-0">
                    <button className="w-full text-blue-600 border border-blue-600 hover:bg-blue-50 py-2 text-sm font-medium rounded-lg transition-colors">
                      Explore
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* --- 2. Booking Benefits Section --- */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Booking made easy
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {BOOKING_BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className={`flex gap-8 items-center  px-5 w-80 h-40 rounded-md border border-gray-200 shadow-md bg-white`}
            >
              {/* Icon */}
              <div className="mb-4 shrink-0 w-20 h-20 relative">
                <Image src={benefit.icon} fill alt='image here'  />
               
              </div>
              <div className='flex flex-col gap-1'>
                {/* Title and Description */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-700">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}