import Image from 'next/image';
import React from 'react';

export default function RentalCategories() {
  return (
    // Outer container with padding
    <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-6'>Three-Column Fractional Grid</h2>

      {/* GRID LAYOUT DIV: 3 equal-width columns */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>

        {/* 1️⃣ DIV 1: First Column (1/3 width) - Contains a 1/2 image and two 1/2 cards */}
        <div className='flex flex-col gap-4 min-h-[300px]'> 
          {/* Using min-h-[300px] to give the column a starting height, 
              adjust this based on desired overall component height */}
          
          {/* Nested Content 1: Top section (Image - takes 1/2 height) */}
          <div className='w-full h-1/2 relative min-h-[150px]'>
            <Image 
              src={'/images/island.webp'} 
              alt='island' 
              fill 
              className='object-cover rounded-xl' 
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Nested Content 2: Bottom section (Two cards - takes 1/2 height) */}
          <div className='grid grid-cols-2 gap-4 h-1/2'>
            <div className='bg-gray-100 border border-gray-200 flex flex-col gap-2 justify-center items-center rounded-lg p-2'>
              <svg 
                className='text-gray-700 w-[50px] h-[50px]' 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
              >
                <path 
                  d="M10.5 15.75v7.5a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-1.5 0M3 23.25v-7.5a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0M1.2 17.1l6-4.5h-.9l6 4.5a.75.75 0 1 0 .9-1.2l-6-4.5a.75.75 0 0 0-.9 0l-6 4.5a.75.75 0 1 0 .9 1.2m19.8.15a2.25 2.25 0 0 1-4.5 0c0-.801.102-1.698.297-2.673.253-1.264.652-2.618 1.158-4.008a39 39 0 0 1 1.344-3.23q.089-.19.122-.254h-1.342l.122.253a39 39 0 0 1 1.344 3.23c.506 1.39.905 2.745 1.158 4.01.195.974.297 1.87.297 2.672m1.5 0c0-.909-.113-1.902-.327-2.967-.269-1.346-.689-2.77-1.218-4.227a41 41 0 0 0-1.398-3.361q-.097-.202-.136-.28a.75.75 0 0 0-1.342 0 34 34 0 0 0-.483 1.039 41 41 0 0 0-1.05 2.602c-.53 1.456-.95 2.881-1.22 4.227C15.114 15.348 15 16.34 15 17.25a3.75 3.75 0 1 0 7.5 0m-4.5 3v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-1.5 0M.75 24h22.5a.75.75 0 0 0 0-1.5H.75a.75.75 0 0 0 0 1.5M6 23.25v-3a.75.75 0 0 1 1.5 0v3a.75.75 0 0 0 1.5 0v-3a2.25 2.25 0 0 0-4.5 0v3a.75.75 0 0 0 1.5 0M8.247 7.5a3 3 0 1 0-2.163-5.067l.544.517.722-.202A3.745 3.745 0 1 0 3.752 7.5H8.25zM8.25 6h-4.5a2.245 2.245 0 1 1 2.156-2.848.75.75 0 0 0 1.266.315A1.5 1.5 0 1 1 8.253 6z"
                  fill="currentColor"> 
                </path>
              </svg>
              <span className='text-xl font-bold'>Chalets</span>
            </div>
            <div className='bg-gray-100 border border-gray-200 flex flex-col gap-2 justify-center items-center rounded-lg p-2'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-[50px] h-[50px]'><path fill="currentColor" d="M22.5 10.5v12.75l.75-.75H.75l.75.75V10.5a.75.75 0 0 0-1.5 0v12.75c0 .414.336.75.75.75h22.5a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-1.5 0m.75-.75H16.5l.75.75a5.25 5.25 0 1 0-10.5 0l.75-.75H.75l.717.97L4.14 2.03a.75.75 0 0 1 .717-.53h14.284c.33 0 .62.215.717.53l2.674 8.69.717-.97zm0 1.5a.75.75 0 0 0 .717-.97l-2.674-8.692A2.25 2.25 0 0 0 19.142 0H4.858a2.25 2.25 0 0 0-2.15 1.589l-2.675 8.69a.75.75 0 0 0 .717.971H7.5a.75.75 0 0 0 .75-.75 3.75 3.75 0 1 1 7.5 0c0 .414.336.75.75.75zm-9.75 1.5h-3l.75.75v-3.375c0-.154.295-.375.75-.375s.75.22.75.375V13.5zm0 1.5a.75.75 0 0 0 .75-.75v-3.375c0-1.093-1.045-1.875-2.25-1.875s-2.25.782-2.25 1.875V13.5c0 .414.336.75.75.75zm0 8.25h-3l.75.75V18a.75.75 0 0 1 1.5 0v5.25zm0 1.5a.75.75 0 0 0 .75-.75V18a2.25 2.25 0 0 0-4.5 0v5.25c0 .414.336.75.75.75zm-9.75-9.75h3a.75.75 0 0 0 0-1.5h-3a.75.75 0 0 0 0 1.5m13.5 0h3a.75.75 0 0 0 0-1.5h-3a.75.75 0 0 0 0 1.5m-13.5 3h3L6 16.5v3l.75-.75h-3l.75.75v-3zm0-1.5a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3a.75.75 0 0 0-.75-.75zm13.5 1.5h3l-.75-.75v3l.75-.75h-3l.75.75v-3zm0-1.5a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3a.75.75 0 0 0-.75-.75z"></path></svg>
              <span className='text-xl font-bold'>Apartments</span>
            </div>
          </div>
        </div>

        {/* 2️⃣ DIV 2: Second Column (1/3 width) - Full height image card */}
        <div className='bg-[#ebe0d1] rounded-xl relative min-h-[400px]'>
          <Image 
            src={'/images/villa.webp'} 
            alt='hotel image' 
            fill 
            className='object-cover rounded-xl'
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className='absolute text-white text-2xl font-bold p-4'>
            <span>Visit our best villas in town</span>
          </div>
        </div>

        {/* 3️⃣ DIV 3: Third Column (1/3 width) - Contains a 1/2 card and a 1/2 image */}
        <div className='flex flex-col gap-4 min-h-[400px]'>
          
          {/* Nested Content 1: Top section (Card - takes 1/2 height) */}
          <div className='bg-green-100 rounded-xl h-1/2 relative flex justify-center items-center flex-col gap-2 min-h-[100px] p-2'>
            <div className='text-green-800'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-[50px] h-[50px]'>
                <path fill="currentColor" d="M13.77.36.109 22.86A.75.75 0 0 0 .75 24h22.5a.75.75 0 0 0 .641-1.14L10.231.36a.75.75 0 0 0-1.283.78l13.66 22.5.642-1.14H.75l.641 1.14 13.661-22.5A.75.75 0 1 0 13.77.36m-2.426 15.294-4.018 7.232A.75.75 0 0 0 7.982 24h8.036a.75.75 0 0 0 .656-1.114l-4.018-7.232a.75.75 0 0 0-1.312 0m1.312.728h-1.312l4.018 7.232.656-1.114H7.982l.656 1.114z"></path>
              </svg>
            </div>
            <div>
              <h3 className='text-xl font-semibold text-green-800'>Campsites & boats</h3>
            </div>
          </div>

          {/* Nested Content 2: Bottom section (Image - takes 1/2 height) */}
          <div className='bg-red-300 rounded-xl h-1/2 relative min-h-[150px]'>
            {/* Optional gradient overlay - kept your original one */}
            <div 
              className='absolute inset-0 rounded-xl z-30' // Use rounded-xl for consistency
              style={{ background: 'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 0) 100%)' }}
            ></div>
            
            <Image 
              src={'/images/inside.webp'} 
              alt='hotel image' 
              fill 
              className='object-cover rounded-xl' 
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className='absolute top-3 left-5 text-lg font-bold z-40'>
              <h3>Houses</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}