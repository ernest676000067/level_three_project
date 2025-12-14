"use client";
import Image from 'next/image';
import React from 'react';
import NavbarComponent from './../navbar/NavbarComponent';
import SearchBar from './../search/SeachBar';


export default function HeroComponent() {
  return (
    
    <div className="flex justify-center  mb-18">
      
      {/* The actual component container: Full width, 80% viewport height, relative */}
      <div className="relative min-h-[80vh] w-full  overflow-hidden"> 
        
        <Image
          src="/images/background.jpg" 
          alt="Page Background"
          priority
          fill 
          className="object-cover" 
        />
        
        {/* 3. Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{ 
            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.6) 0%, transparent 100%)' 
          }} 
        />

           <div className='relative z-20 '> <NavbarComponent /></div>
        {/* 4. Content Area */}
        <div className="relative z-20 p-30 h-full flex flex-col ml-10 justify-center ">
         
          <h1 className="text-5xl font-bold text-white max-w-lg ">
            Find Your Next Home Without Stress
          </h1>
          <p className="text-white/80 mt-4 max-w-md text-xl">
            We’ve got apartments, studios, shared rooms  everything and more .
          </p>
        </div>
        
      </div>

          {/* 5. Search Bar Component */}
        <div className="absolute bottom-20 w-full px-10 z-20">
          <SearchBar  />
        </div>


    </div>
  );
}