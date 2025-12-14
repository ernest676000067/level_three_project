// components/ScheduleHostModal.jsx
'use client';

import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

export default function ScheduleHostModal({ hostName, isOpen, onClose }) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [place, setPlace] = useState('');
    const [message, setMessage] = useState(`Hello ${hostName}, I'd love to schedule a quick chat.`);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send this data to an API endpoint here.
        console.log("Scheduling Request Sent:", { date, time, place, message });
        alert(`Request sent to ${hostName} for ${date} at ${time} regarding ${place}!`);
        onClose(); // Close the modal after submission
    };

    return (
        // Modal Backdrop
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold">Schedule a Meeting with {hostName}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Date and Time */}
                    <div className="flex space-x-4">
                        <label className="flex-1">
                            <span className="block text-sm font-medium text-gray-700">Date</span>
                            <input 
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </label>
                        <label className="flex-1">
                            <span className="block text-sm font-medium text-gray-700">Time</span>
                            <input 
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </label>
                    </div>

                    {/* Place/Topic */}
                    <label>
                        <span className="block text-sm font-medium text-gray-700">Place or Topic (e.g., Property Viewing)</span>
                        <input 
                            type="text"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="e.g., The property address, or 'video call'"
                        />
                    </label>

                    {/* Message */}
                    <label>
                        <span className="block text-sm font-medium text-gray-700">Your Message</span>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="4"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </label>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Send Schedule Request
                    </button>
                </form>
            </div>
        </div>
    );
}