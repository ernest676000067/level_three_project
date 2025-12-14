"use client";

import { useState } from "react";
import Link from "next/link";

import { MdAddHomeWork, MdMessage } from "react-icons/md";
import { FaClipboardList, FaHeart } from "react-icons/fa";
import { IoIosContact, IoIosNotifications } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { TbApiAppOff } from "react-icons/tb";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  const [listingsOpen, setListingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 z-50 bg-[#0A2342] text-white flex flex-col p-6 overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden text-3xl mb-8"
          aria-label="Close navigation"
        >
          <HiX />
        </button>

        <h1 className="text-2xl font-bold mb-10 pl-1">Douala Toit</h1>

        <nav className="space-y-5">
          <Link
            onClick={() => setOpen(false)}
            href="/dashboard"
            className="flex items-center px-3 gap-3 text-gray-200 hover:bg-blue-950 p-2 rounded-md"
          >
            <MdAddHomeWork size={25} />
            <span>Dashboard</span>
          </Link>

          <div>
            <button
              type="button"
              className="flex items-center w-full px-3 gap-3 text-gray-200 hover:bg-blue-950 p-2 rounded-md focus:outline-none"
              onClick={() => setListingsOpen((prev) => !prev)}
            >
              <FaClipboardList size={18} />
              <span>Listings</span>
              <span className="ml-auto">{listingsOpen ? "▲" : "▼"}</span>
            </button>
            {listingsOpen && (
              <div className="ml-8 mt-2 space-y-2">
                <Link href="/dashboard/listings" className="block text-gray-200 hover:bg-blue-950 p-2 rounded-md">Properties</Link>
                <Link href="/dashboard/listings/offers" className="block text-gray-200 hover:bg-blue-950 p-2 rounded-md">Offers</Link>
                <Link href="/dashboard/extra_services" className="block text-gray-200 hover:bg-blue-950 p-2 rounded-md">Extra Services</Link>
                <Link href="/dashboard/well_reviewed" className="block text-gray-200 hover:bg-blue-950 p-2 rounded-md">Well Reviewed</Link>
                <Link href="/dashboard/weekend_deals" className="block text-gray-200 hover:bg-blue-950 p-2 rounded-md">Weekend deals</Link>
                <Link href="/dashboard/guest_homes_love" className="block text-gray-200 hover:bg-blue-950 p-2 rounded-md">Homes Guest Love</Link>
                {/* Add more subfolders as needed */}
              </div>
            )}
          </div>

          <Link
            onClick={() => setOpen(false)}
            href="/dashboard/favorites"
            className="flex items-center px-3 gap-3 text-gray-200 hover:bg-blue-950 p-2 rounded-md"
          >
            <FaHeart size={20} />
            <span>Favorites</span>
          </Link>

          <Link
            onClick={() => setOpen(false)}
            href="/dashboard/messages"
            className="flex items-center px-3 gap-3 text-gray-200 hover:bg-blue-950 p-2 rounded-md"
          >
            <MdMessage size={25} />
            <span>Messages</span>
          </Link>

           <Link
            onClick={() => setOpen(false)}
            href="/dashboard/notifications"
            className="flex items-center px-3 gap-1 text-gray-200 hover:bg-blue-950 p-2 rounded-md"
          >
            <IoIosNotifications size={25} />
            <span>Notifications Center</span>
          </Link>

          <Link
            onClick={() => setOpen(false)}
            href="/dashboard/analytics"
            className="flex items-center px-3 gap-3 text-gray-200 hover:bg-blue-950 p-2 rounded-md"
          >
            <TbBrandGoogleAnalytics size={25} />
            <span>Analytics</span>
          </Link>

          <Link
            onClick={() => setOpen(false)}
            href="/dashboard/properties"
            className="flex items-center px-3 gap-3 text-gray-200 hover:bg-blue-950 p-2 rounded-md"
          >
            <TbApiAppOff size={25} />
            <span>Properties</span>
          </Link>

          <Link
            onClick={() => setOpen(false)}
            href="/dashboard/accounts"
            className="flex items-center px-3 gap-3 text-gray-200 hover:bg-blue-950 p-2 rounded-md"
          >
            <IoIosContact size={25} />
            <span>Account</span>
          </Link>
        </nav>
      </aside>

      {/* Overlay (mobile only) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
        />
      )}

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="w-full bg-white h-16 flex items-center justify-between lg:justify-between px-4 sm:px-6 border-b">
          <div>
      <h1 className="text-2xl font-bold mb-1">Welcome back 👋</h1>

      <p className="text-gray-600">
        Here is your overview of Douala Toit real estate activity.
      </p>
      </div>
          <IoIosContact size={35} />
        </header>

        <main className="flex-1 overflow-x-hidden">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
