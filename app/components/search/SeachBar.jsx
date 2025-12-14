"use client";

import { useState } from "react";
import { useSearchStore } from "@/store/SearchStore";
import { createClient } from "@/lib/supabase/client";

export default function SearchBar() {
  const setFilters = useSearchStore((state) => state.setFilters);
  const addRecentSearch = useSearchStore((state) => state.addRecentSearch);

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [feature, setFeature] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = async () => {
    setFilters({
      location,
      propertyType,
      feature,
      status,
    });

    // Fetch property from Supabase
    const supabase = createClient();
    let query = supabase.from("properties").select("*");
    if (location) query = query.ilike("city", `%${location}%`);
    if (propertyType) query = query.eq("type", propertyType);
    if (status) query = query.eq("status", status);
    if (feature) query = query.ilike("features", `%${feature}%`);
    query = query.order("overall_rating", { ascending: false });
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      const property = data[0];
      addRecentSearch({
        location: property.city,
        propertyType: property.type,
        feature: feature,
        status: property.status,
        img: property.main_image || "/images/hotel.webp",
        name: property.name,
        id: property.id,
      });
    } else {
      addRecentSearch({
        location,
        propertyType,
        feature,
        status,
        img: "/images/hotel.webp",
        name: location,
      });
    }
  };

  return (
    <div className="w-full shadow-lg rounded-xl py-2 px-3 flex flex-col md:flex-row gap-1 bg-yellow-400">
      {/* LOCATION */}
      <input
        type="text"
        placeholder="City / Neighborhood"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full bg-white px-4 py-3 rounded-lg outline-none"
      />

      {/* PROPERTY TYPE */}
      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        className="w-full bg-white px-4 py-3 rounded-lg outline-none"
      >
        <option value="">Property Type</option>
        <option value="apartment">Apartment</option>
        <option value="studio">Studio</option>
        <option value="house">House</option>
        <option value="villa">Villa</option>
      </select>

      {/* FEATURES */}
      <select
        value={feature}
        onChange={(e) => setFeature(e.target.value)}
        className="w-full bg-white px-4 py-3 rounded-lg outline-none"
      >
        <option value="">Feature</option>
        <option value="swimming_pool">Swimming Pool</option>
        <option value="balcony">Balcony</option>
        <option value="parking">Parking</option>
        <option value="air_conditioning">Air Conditioning</option>
      </select>

      {/* STATUS */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full bg-white px-4 py-3 rounded-lg outline-none"
      >
        <option value="">Status</option>
        <option value="free">Free</option>
        <option value="occupied">Occupied</option>
      </select>

      {/* BUTTON */}
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Search
      </button>
    </div>
  );
}
