"use client";

import { useState } from "react";
import { CiHeart } from "react-icons/ci";

export function FavoriteButton({ propertyId }) {
  const [active, setActive] = useState(false);

  const toggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActive((previous) => !previous);
  };

  const label = active ? "Remove from favorites" : "Save to favorites";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={toggle}
      data-property-id={propertyId}
      className={`rounded-full bg-white/90 p-2 shadow transition hover:shadow-md ${
        active ? "text-rose-500" : "text-slate-600"
      }`}
    >
      <CiHeart size={20} className={active ? "fill-current" : ""} />
    </button>
  );
}
