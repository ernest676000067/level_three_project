import React from 'react';
import Image from 'next/image';
import { CiHeart } from 'react-icons/ci';
import { useSearchStore } from "@/store/SearchStore";

export default function InterestedProperties() {
  const interestedProperties = useSearchStore((state) => state.interestedProperties);

  if (!interestedProperties || interestedProperties.length === 0) return null;

  return (
    <div>
      <div className='text-3xl font-semibold mb-4 mt-14'>
        Still interested in these properties?
      </div>
      <div className='flex overflow-x-auto space-x-6 scrollbar-hide pb-4'>
        {interestedProperties.map((property, idx) => (
          <div key={property.id || idx} className='flex flex-col items-start rounded-xl shadow-md relative w-[180px] md:w-[260px] pb-4 shrink-0'>
            <div className='w-full h-auto min-h-[130px] md:min-h-[155px] lg:min-h-[180px] mr-4 relative'>
              <Image 
                src={property.main_image || "/images/hotel.webp"} 
                alt={property.name || "Property"} 
                fill 
                className='object-cover rounded-xl' 
              />
            </div>
            <div className='py-3 px-2'>
              <h2 className='text-xl font-semibold'>{property.name}</h2>
              <p className='text-sm text-gray-400 mb-2'>{property.country}, {property.city}</p>
              <div className='flex items-center gap-2'>
                <span className='bg-blue-900 text-white rounded-t-md rounded-br-md p-1 px-2 text-sm font-bold'>{property.overall_rating}</span>
                <div className='flex flex-col'>
                  <span className='text-black text-sm'>{property.status}</span>
                  <span className='text-gray-400 text-sm tracking-wide'>({property.reviews_count} reviews)</span>
                </div>
              </div>
            </div>
            <div className='absolute bg-white top-2 right-2 p-1 rounded-full shadow-md cursor-pointer hover:scale-105 transition-transform'>
              <span>
                <CiHeart size={20} color='black' />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Add this to your global CSS or Tailwind config:
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
*/