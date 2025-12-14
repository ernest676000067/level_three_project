"use client";

import React from "react";
import { IoIosBed } from "react-icons/io";
import { IoIosApps } from "react-icons/io";
import { GiHomeGarage, GiTreeSwing } from "react-icons/gi";
import { MdOutlineCottage } from "react-icons/md"; // Replacement for camping icon

// DATA
const RENTAL_TYPES = [
  {
    title: "Bungalows",
    icon: IoIosBed,
    bg: "bg-red-300",
    col: "col-span-2",   // spans 2 columns
    row: "row-span-1",   // spans 1 row
  },
  {
    title: "Villas",
    icon: GiHomeGarage,
    bg: "bg-orange-300",
    col: "col-span-1",
    row: "row-span-2",   // this one is tall
  },
  {
    title: "Campsites & Boats",
    icon: MdOutlineCottage,
    bg: "bg-green-300",
    col: "col-span-1",
    row: "row-span-1",
  },
  {
    title: "Apartments",
    icon: IoIosApps,
    bg: "bg-blue-300",
    col: "col-span-1",
    row: "row-span-1",
  },
  {
    title: "Châlets",
    icon: GiTreeSwing,
    bg: "bg-purple-300",
    col: "col-span-1",
    row: "row-span-1",
  },
  {
    title: "Houses",
    icon: GiHomeGarage,
    bg: "bg-yellow-300",
    col: "col-span-2",   // wide card
    row: "row-span-1",
  },
];

export default function RentalTypeGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <h2 className="text-3xl font-bold mb-6">
        Rental Types
      </h2>

      {/* MOBILE: horizontal scroll */}
      <div className="lg:hidden flex gap-4 overflow-x-auto pb-4">
        {RENTAL_TYPES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`min-w-[180px] h-40 rounded-xl p-4 text-white flex flex-col justify-between ${item.bg}`}
            >
              <Icon className="text-3xl" />
              <h3 className="text-lg font-semibold">{item.title}</h3>
            </div>
          );
        })}
      </div>

      {/* DESKTOP GRID */}
      <div className="hidden lg:grid grid-cols-3 grid-rows-2 gap-4 h-[500px]">
        {RENTAL_TYPES.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`
                rounded-xl p-6 text-white flex flex-col justify-between 
                ${item.bg}
                ${item.col}
                ${item.row}
              `}
            >
              <Icon className="text-4xl" />
              <h3 className="text-2xl font-semibold">{item.title}</h3>
            </div>
          );
        })}
      </div>

    </div>
  );
}
