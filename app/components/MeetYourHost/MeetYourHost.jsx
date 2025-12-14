// components/MeetYourHost.jsx
'use client'; // 👈 Must be a client component

import React, { useState } from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import ScheduleHostModal from './ScheduleHostModal';

// --- Static Data ---
const hostData = {
    name: "Belen",
    superhost: true,
    reviews: 918,
    rating: 4.92,
    years_hosting: 12,
    location: "Madrid, Spain",
    response_rate: "100%",
    response_time: "within an hour",
    profile_image: "/images/host_profile_belen.png" 
};

export default function MeetYourHost() {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
            
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Meet your host
            </h2>

            <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-12">
                
                {/* --- Left Side: Profile Card (Content remains the same) --- */}
                <div className="flex-shrink-0 w-full lg:w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
                    {/* ... Profile Image and Stats ... */}
                     <div className="relative w-28 h-28 mb-4">
                        <Image 
                            src={hostData.profile_image}
                            alt={`Profile photo of ${hostData.name}`}
                            width={112}
                            height={112}
                            className="rounded-full object-cover border-4 border-pink-500 shadow-xl"
                        />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{hostData.name}</h3>
                    <p className="text-sm font-semibold text-gray-600 mb-4 flex items-center">
                        {hostData.superhost && (<><FaStar size={12} className="text-pink-500 mr-1" />Superhost</>)}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full text-left border-t border-gray-200 pt-4">
                        <div className="flex flex-col">
                            <span className="text-xl font-bold">{hostData.reviews}</span>
                            <span className="text-sm text-gray-500">Reviews</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold flex items-center">{hostData.rating}<FaStar size={14} className="text-gray-900 ml-1" /></span>
                            <span className="text-sm text-gray-500">Rating</span>
                        </div>
                        <div className="col-span-2 flex flex-col mt-2">
                            <span className="text-xl font-bold">{hostData.years_hosting}</span>
                            <span className="text-sm text-gray-500">Years hosting</span>
                        </div>
                    </div>
                </div>

                {/* --- Right Side: Details and Actions --- */}
                <div className="grow">
                    
                    {/* Superhost Description and Host Details (Content remains the same) */}
                    <p className="text-lg font-bold text-gray-900 mb-2">{hostData.name} is a Superhost</p>
                    <p className="text-gray-700 leading-relaxed mb-6">Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
                    <h3 className="font-bold text-gray-900 mb-3">Host details</h3>
                    <div className="space-y-1 text-gray-700 mb-8">
                        <p>Response rate: {hostData.response_rate}</p>
                        <p>Responds: {hostData.response_time}</p>
                    </div>

                    {/* Message Host Button - Now with onClick handler */}
                    <button 
                        onClick={() => setIsModalOpen(true)} // Open the modal on click
                        className="bg-gray-200 text-gray-900 font-semibold  py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-150"
                    >
                        Message host
                    </button>
                    
                    {/* Payment Protection Note (Content remains the same) */}
                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <p className="text-xs text-pink-600 flex items-start space-x-2">
                            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8a1 1 0 00-2 0v4a1 1 0 102 0v-4zm2-4a1 1 0 00-2 0v4a1 1 0 102 0V6z" clipRule="evenodd" />
                            </svg>
                            <span>To help protect your payment, always use Airbnb to send money and communicate with hosts.</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* --- Bottom Location Footer (Content remains the same) --- */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center text-gray-600">
                <FaMapMarkerAlt size={16} className="mr-2" />
                <span className="font-medium">Lives in {hostData.location}</span>
            </div>

            {/* --- The Modal --- */}
            <ScheduleHostModal 
                hostName={hostData.name}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Function to close the modal
            />
        </div>
    );
}