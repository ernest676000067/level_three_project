import Link from 'next/link'
import React, { Suspense } from 'react'
import Image  from 'next/image';
import { useSearchStore } from "@/store/SearchStore";
import { AuthButton } from "@/components/auth-button";

export default function NavbarComponent() {
  const recentSearches = useSearchStore((state) => state.recentSearches);

  return (
    <div className='pt-6   p-8 px-10 pb-6 text-white '>
        <nav className='flex justify-between  items-center'>
            <div>
              <Link href="/" className="flex items-center gap-2 group">
                {/* Logo icon (simple roof/house SVG) */}
                <span className="inline-block">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="7" y="14" width="18" height="11" rx="2" fill="#059669" />
                    <polygon points="16,6 5,16 7,16 16,8 25,16 27,16 16,6" fill="#10B981" />
                    <rect x="13" y="19" width="6" height="6" rx="1" fill="#fff" />
                  </svg>
                </span>
                <span className="font-bold text-xl text-emerald-700 group-hover:text-emerald-900 tracking-tight">Douala Toit</span>
              </Link>
            </div>


            <div>
                <ul className='flex gap-5 items-center'>
                    <li>
                        <Link href="/">XAF</Link>
                    </li>
                    <li>
                        <Link href="/about"><Image src='/images/flag.png' alt='image here' width={30} height={20} /></Link>
                    </li>

                     <li>
                        <Link href="/about">Galleries</Link>
                    </li>

                    <li>
                        <Link className='border rounded-full px-2 py-1' href="/contact">?</Link>
                    </li>
                     <li>
                        <Link  href="/contact">List your property</Link>
                    </li>

                     {/* <li className='bg-red-400 p-2 px-4 rounded-lg text-white hover:bg-red-500'>
                        <Link href="/contact">Register</Link>
                    </li>

                     <li className='bg-yellow-400 p-2 px-4 rounded-lg text-white hover:bg-yellow-500'>
                        <Link href="/contact">Sign in</Link>
                    </li> */}

                </ul>
            </div>  
            {/* Auth section on the right */}
            <div className="flex items-center gap-4">
              <Suspense>
                <AuthButton />
              </Suspense>
            </div>
        </nav>
        {/* Recent Searches below navbar, only if there are any */}
        {recentSearches && recentSearches.length > 0 && (
          <div className="w-full mt-4 flex overflow-x-auto space-x-4 scrollbar-hide">
            {recentSearches.map((search, idx) => (
              <div key={idx} className="flex flex-col items-start rounded-xl shadow-md relative w-[180px] md:w-[220px] pb-4 shrink-0 bg-white text-black">
                <div className="w-full h-auto min-h-[100px] md:min-h-[120px] lg:min-h-[140px] mr-4 relative">
                  <Image 
                    src={search.img || "/images/hotel.webp"} 
                    alt={search.name || search.location || "Property"} 
                    fill 
                    className='object-cover rounded-xl' 
                  />
                </div>
                <div className='py-2 px-2'>
                  <h2 className='text-base font-semibold'>{search.name || search.location}</h2>
                  <p className='text-xs text-gray-400 mb-1'>{search.propertyType || "Type"} {search.feature ? `- ${search.feature}` : ""}</p>
                  <span className='text-xs text-gray-500'>{search.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

/* Add this to your global CSS or Tailwind config:
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
*/
