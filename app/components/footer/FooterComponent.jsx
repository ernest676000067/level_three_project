"use client";

import { FaFacebookF, FaInstagram, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function FooterComponent() {
  return (
    <footer className="bg-blue-600 text-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white">Douala Toit</h2>
          <p className="mt-3 text-gray-800">
            Your trusted luxury real estate marketplace in Douala.  
            Discover beautiful homes, apartments, and exclusive services.
          </p>

          {/* SOCIALS */}
          <div className="flex gap-3 mt-4">
            <a className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full">
              <FaFacebookF size={15} />
            </a>
            <a className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full">
              <FaInstagram size={15} />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-800">
            <li className="hover:text-gray-800 cursor-pointer">Home</li>
            <li className="hover:text-gray-800 cursor-pointer">Properties</li>
            <li className="hover:text-gray-800 cursor-pointer">Extra Services</li>
            <li className="hover:text-gray-800 cursor-pointer">About Us</li>
          </ul>
        </div>

        {/* POPULAR AREAS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Popular Areas</h3>
          <ul className="space-y-2 text-gray-800">
            <li className="hover:text-gray-800 cursor-pointer">Bonapriso</li>
            <li className="hover:text-gray-800 cursor-pointer">Akwa</li>
            <li className="hover:text-gray-800 cursor-pointer">Bonamoussadi</li>
            <li className="hover:text-gray-800 cursor-pointer">Bonaberi</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-3 white">
            <li className="flex items-center gap-3">
              <FaPhoneAlt size={18} /> +237 672 000 111
            </li>
            <li className="flex items-center gap-3">
              <MdEmail size={20} /> support@doualatoit.com
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt size={18} /> Douala, Cameroon
            </li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT */}
      {/* <div className="border-t border-gray-800 mt-10 py-6 text-center text-gray-500">
        © {new Date().getFullYear()} Douala Toit — All Rights Reserved.
      </div> */}
    </footer>
  );
}
