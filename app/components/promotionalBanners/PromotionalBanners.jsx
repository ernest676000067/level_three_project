"use client";

import { useEffect, useMemo, useState } from "react";
import Image from 'next/image';
import Link  from 'next/link';
import { createClient } from "@/lib/supabase/client";

export default function PromotionalBanners() {
  const [user, setUser] = useState(null);
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

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      {/* Main Header */}
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Travel more, spend less
      </h1>
      
      {/* --- 1. Sign In & Save (Genius Banner) --- */}
      {!user && (
        <div className="bg-white p-4 rounded-lg  border border-gray-200 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold mb-2">Sign in, save money</h2>
              <p className="text-sm text-gray-700 max-w-lg [word-spacing-.5rem]">
                Save 10% or more at participating properties just look for the blue Genius label
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <Link href='#'>
                  <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150">
                    Sign in
                  </button>
                </Link>
                <a href="#" className="text-blue-600 font-semibold hover:underline">
                  Register
                </a>
              </div>
            </div>
            
            {/* Genius Gift Icon */}
            <div className="relative w-24 h-24">
              {/* This is a simple Tailwind/Icon implementation of the gift box graphic */}
              <div className="w-full h-full  rounded-lg flex items-center justify-center p-3 ">
                 <Image src={'/images/gift.png'} alt='gift here' fill />
              </div>
            
            </div>
          </div>
        </div>
      )}


      {/* --- 2. Vacation Rentals (Blue Graphical Banner) --- */}
      <div className="bg-white p-6 rounded-lg overflow-hidden border border-gray-200">
        <div className="flex justify-between items-center h-80 cursor-pointer">
          
          {/* Left Side: Blue Circle Text/Button */}
          <div className="relative flex items-center justify-center w-3/5 h-full">
            {/* Simulating the large blue circle background EXACTLY */}
            <div className="absolute w-[600px] h-[600px] bg-[#0066FF] rounded-full left-5 flex items-center justify-center">
                <div className="z-10  ml-20">
                    <h2 className="text-3xl font-bold text-white mb-6 max-w-lg">
                        Want to feel at home on your next adventure?
                    </h2>
                    <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-md shadow-lg hover:bg-gray-100 transition duration-150">
                        Discover vacation rentals
                    </button>
                </div>
            </div>
            {/* Small yellow circle detail (bottom left) */}
            <div className="absolute w-20 h-20 bg-yellow-400 rounded-full bottom-0 left-0 translate-x-1/2 translate-y-1/2"></div>
          </div>

          {/* Right Side: Illustration (Using placeholder for complex graphics) */}
          <div className="w-2/5 h-full flex items-center justify-end">
             {/* Note: Complex illustrations require SVG or an actual image file.
                 This is a conceptual placeholder matching the image's structure. */}
             <div className="relative w-full h-full flex items-center justify-center">
                 {/* Yellow Chair Placeholder (Using a simple box) */}
                <div className='relative w-[360px] h-[257px] '>
                    <Image src={'/images/cat.png'} fill alt='cat table' className='bg-contain'  />
                </div>
                 
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}