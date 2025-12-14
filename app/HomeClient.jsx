"use client";

import HeroComponent from "./components/heropage/HeroComponent";
import MainComponent from "./components/main/MainComponent";
import React, { useState } from "react";

export default function HomeClient() {
  // Example: search state and handler
  const [search, setSearch] = useState("");
  const handleSearch = (value) => setSearch(value);

  // Pass search and handler as props if needed
  return (
    <>
      <HeroComponent search={search} onSearch={handleSearch} />
      <MainComponent search={search} />
    </>
  );
}
