import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';

// --- Mock Data ---
// In a real app, this data would come from a database query.
const propertyData = {
    name: "Luxury Hotel Residence",
    overall_rating: 7.8,
    reviews_count: 288,
    location_rating: 8.6,
    main_image: '/images/large-building.webp',
    gallery_images: [
        { url: '/images/room-double-bed.webp', alt: 'Spacious double bed hotel room' },
        { url: '/images/room-single-bed.webp', alt: 'Cozy single bed hotel room' },
        { url: '/images/lobby-area.webp', alt: 'Hotel lobby and reception' },
        { url: '/images/second-bedroom.webp', alt: 'Alternate view of a bedroom' },
        { url: '/images/hotel-exterior-small.webp', alt: 'Exterior view from the street' },
        { url: '/images/room-desk.webp', alt: 'Room with desk area' },
        { url: '/images/amenities.webp', alt: 'Close-up of amenities' },
    ],
    review_summary: '"Its location is very central and safe. Internet connection is very good. The hotel is very clean and new, beds comfortable."',
    reviewer_name: 'Vincent',
    reviewer_country: 'United States'
};

export default function PropertyDetailsHero({ data = propertyData }) {
    
    // Separate images for the grid layout
    const mainImage = data.main_image;
    const topGalleryImage = data.gallery_images[0]?.url;
    const bottomGalleryImage = data.gallery_images[1]?.url;
    const thumbnailImages = data.gallery_images.slice(2);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* --- LEFT SIDE: IMAGE GRID (COL-SPAN-8) --- */}
                <div className="md:col-span-8">
                    <div className="grid grid-cols-6 grid-rows-2 gap-3 h-[550px]">
                        
                        {/* 1. LARGE MAIN IMAGE (Col-span-4, Row-span-2) */}
                        <div className="relative col-span-6 md:col-span-4 row-span-2 rounded-xl overflow-hidden shadow-lg">
                            <Image
                                src={mainImage}
                                alt={`${data.name} Exterior`}
                                fill
                                priority
                                className="object-cover transition duration-300 hover:scale-[1.03]"
                            />
                        </div>

                        {/* 2. TOP RIGHT IMAGE (Col-span-2, Row-span-1) */}
                        <div className="relative col-span-3 md:col-span-2 row-span-1 rounded-xl overflow-hidden shadow-lg h-full">
                            {topGalleryImage && (
                                <Image
                                    src={topGalleryImage}
                                    alt="Interior room view"
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>

                        {/* 3. BOTTOM RIGHT IMAGE (Col-span-2, Row-span-1) */}
                        <div className="relative col-span-3 md:col-span-2 row-span-1 rounded-xl overflow-hidden shadow-lg h-full">
                            {bottomGalleryImage && (
                                <Image
                                    src={bottomGalleryImage}
                                    alt="Room details and furniture"
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                    </div>
                    
                    {/* --- HORIZONTAL THUMBNAIL STRIP --- */}
                    <div className="flex space-x-3 overflow-x-auto pt-3 pb-2">
                        {/* Map through the remaining images for the horizontal scroll */}
                        {thumbnailImages.map((img, index) => (
                            <div key={index} className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition cursor-pointer">
                                <Image
                                    src={img.url}
                                    alt={img.alt}
                                    fill
                                    className="object-cover"
                                />
                                {/* Overlay for the last thumbnail (+163 photos) */}
                                {index === thumbnailImages.length - 1 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="text-white text-md font-bold">
                                            +163 photos
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- RIGHT SIDE: REVIEWS AND MAP (COL-SPAN-4) --- */}
                <aside className="md:col-span-4 p-4 bg-white rounded-xl shadow-lg h-fit">
                    
                    {/* Overall Rating Box */}
                    <div className="flex justify-between items-center mb-4 pb-4 border-b">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-700">Good</span>
                            <span className="text-xs text-gray-500">{data.reviews_count} reviews</span>
                        </div>
                        <div className="bg-blue-600 text-white text-xl font-bold py-2 px-3 rounded-tr-lg rounded-bl-lg">
                            {data.overall_rating}
                        </div>
                    </div>

                    {/* Guest Review */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Guests who stayed here loved</h3>
                        <blockquote className="italic text-sm text-gray-600 border-l-4 border-green-500 pl-3">
                            {data.review_summary}
                        </blockquote>
                        <div className="flex items-center text-sm mt-3 space-x-2">
                            <span className="bg-green-600 text-white font-bold px-2 rounded-full">V</span>
                            <span className="font-medium">{data.reviewer_name}</span>
                            <span className="text-gray-500">| 🇺🇸 {data.reviewer_country}</span>
                        </div>
                    </div>
                    
                    {/* Location Rating */}
                    <div className="flex justify-between items-center mb-4 pb-4 border-b">
                        <span className="text-lg font-bold text-gray-800">Great location!</span>
                        <div className="bg-blue-600 text-white text-lg font-bold py-1 px-3 rounded-tr-lg rounded-bl-lg">
                            {data.location_rating}
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                             <span className="text-gray-600 font-medium">[Interactive Map Placeholder]</span>
                        </div>
                        {/* Map Controls and Location Pin */}
                        <div className="absolute inset-0 flex flex-col justify-end items-center p-3">
                            <FaMapMarkerAlt size={30} className="text-blue-600 z-10 -translate-y-4" />
                            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center space-x-2 hover:bg-blue-700">
                                Show on map
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}