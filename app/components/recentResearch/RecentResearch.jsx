'use client';

import { useState, useEffect, useCallback } from 'react'; // Added useEffect for client-only rendering
import Image from 'next/image';
import { useSearchStore } from "@/store/SearchStore";

// --- Data Definition ---
const recentSearchesData = [ 
  {
    town: 'Bonapriso',
    type: 'Apartment',
    feature: 'Swimming pool',
    img: '/images/home.png',
  },
  {
    town: 'Bonapriso',
    type: 'Apartment',
    feature: 'Balcony',
    img: '/images/home.png',
  },
  {
    town: 'Bonapriso',
    type: 'Apartment',
    feature: 'Air Conditioning',
    img: '/images/home.png',
  },
  {
    town: 'Bonapriso',
    type: 'Apartment',
    feature: 'Private Garden',
    img: '/images/home.png',
  },
  {
    town: 'Bonapriso',
    type: 'Studio',
    feature: 'Fully Furnished',
    img: '/images/home.png',
  },
];

export default function RecentResearch() {
  // State for client-side rendering check
  const [hasMounted, setHasMounted] = useState(false);

  // Run only on the client side after the initial mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filters = useSearchStore((state) => state.filters);
  const recentSearches = useSearchStore((state) => state.recentSearches);
  // Only show cards if there are recent searches
  if (!recentSearches || recentSearches.length === 0) {
    return null;
  }

  const displaySearches = recentSearches.length > 0 ? recentSearches : recentSearchesData;

  // Map each search to a CardMap-style card
  const propertyCards = displaySearches.map((search, index) => (
    <div
      key={index}
      className="shrink-0 w-full max-w-[180px] lg:max-w-[210px] bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 mt-10"
    >
      {/* Image Area */}
      <div className="relative w-full h-32">
        <Image
          src={search.img || '/images/hotel.webp'}
          alt={search.location || search.town || 'Property'}
          fill
          className="object-cover"
        />
      </div>
      {/* Text Content */}
      <div className="p-3">
        <h3 className="text-lg font-semibold text-gray-900">{search.location || search.town || 'Unknown'}</h3>
        <p className="text-sm text-gray-500">{search.propertyType || search.type || 'Type'} {search.feature ? `- ${search.feature}` : ''}</p>
      </div>
      {/* Button */}
      <div className="p-3 pt-0">
        <button className="w-full text-blue-600 border border-blue-600 hover:bg-blue-50 py-2 text-sm font-medium rounded-lg transition-colors">
          Explore
        </button>
      </div>
    </div>
  ));

  // Guard clause for empty data
  if (displaySearches.length === 0) {
    return null;
  }
  
  // --- Client-Only Rendering Check ---
  if (!hasMounted) {
    // Render a placeholder to prevent layout shift while loading
    return (
      <div className="w-full mx-auto py-10 px-4 relative mt-8 max-w-7xl">
        <h2 className="text-2xl font-bold mb-4">Your recent searches</h2>
        {/* Placeholder height matches the expected carousel height */}
        <div className="h-40 bg-gray-100 rounded-xl animate-pulse" /> 
      </div>
    );
  }
  
  // --- JSX Rendering ---
  return (
    <div className="w-full mx-auto py-10 px-4 relative mt-8 max-w-7xl">
      <h2 className="text-2xl font-bold mb-4">Your recent searches</h2>

      <div className="flex space-x-6 md:grid md:grid-cols-5 md:gap-6 justify-items-center items-start w-max md:w-full">
        {propertyCards}
      </div>
    </div>
  );
}